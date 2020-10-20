---
title: LDAP sync in Ranger and Apache Ambari in Azure HDInsight
description: Address the LDAP sync in Ranger and Ambari and provide general guidelines.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 02/14/2020
---

# LDAP sync in Ranger and Apache Ambari in Azure HDInsight

HDInsight Enterprise Security Package (ESP) clusters use Ranger for authorization. Apache Ambari and Ranger both sync users and groups independently and work a little differently. This article is meant to address the LDAP sync in Ranger and Ambari.

## General guidelines

* Always deploy clusters with groups.
* Instead of changing group filters in Ambari and Ranger, try to manage all these in Azure AD and use nested groups to bring in the required users.
* Once a user is synced, it isn't removed even if the user isn't part of the groups.
* If you need to change the LDAP filters directly, use the UI first as it contains some validations.

## Users are synced separately

Ambari and Ranger don't share the user database because they serve two different purposes. If a user needs to use the Ambari UI, then the user needs to be synced to Ambari. If the user isn't synced to Ambari, Ambari UI / API will reject it but other parts of the system will work (these are guarded by Ranger or Resource Manager and not Ambari). If you want to include the user into a Ranger policy, then sync the user to Ranger.

When a secure cluster is deployed, group members are synced transitively (all the subgroups and their members) to both Ambari and Ranger. 

## Ambari user sync and configuration

From the head nodes, a cron job, `/opt/startup_scripts/start_ambari_ldap_sync.py`, is run every hour to schedule the user sync. The cron job calls the Ambari rest APIs to perform the sync. The script submits a list of users and groups to sync (as the users may not belong to the specified groups, both are specified individually). Ambari syncs the sAMAccountName as the username and all the group members, transitively.

The logs should be in `/var/log/ambari-server/ambari-server.log`. For more information, see [Configure Ambari logging level](https://docs.cloudera.com/HDPDocuments/Ambari-latest/administering-ambari/content/amb_configure_ambari_logging_level.html).

In Data Lake clusters, the post user creation hook is used to create the home folders for the synced users and they're set as the owners of the home folders. If the user isn't synced to Ambari correctly, then the user could face failures in accessing staging and other temporary folders.

### Update groups to be synced to Ambari

If you can't manage groups memberships in Azure AD, you have two choices:

* Perform a one time sync as described more fully at [Synchronize LDAP Users and Groups](https://docs.cloudera.com/HDPDocuments/HDP3/latest/ambari-authentication-ldap-ad/content/authe_ldapad_synchronizing_ldap_users_and_groups.html). Whenever the group membership changes, you'll have to do this sync again.

* Write a cron job, call the [Ambari API periodically](https://community.cloudera.com/t5/Support-Questions/How-do-I-automate-the-Ambari-LDAP-sync/m-p/96634) with the new groups.

## Ranger User sync and configuration

Ranger has an inbuilt sync engine that runs every hour to sync the users. It doesn't share the user database with Ambari. HDInsight configures the search filter to sync the admin user, the watchdog user, and the members of the group specified during the cluster creation. The group members will be synced transitively:

* Disable incremental sync.
* Enable User group sync map.
* Specify the search filter to include the transitive group members.
* Sync sAMAccountName for users and name attribute for groups.

### Group or Incremental sync

Ranger supports a group sync option, but it works as an intersection with user filter. Not a union between group memberships and user filter. A typical use case for group sync filter in Ranger is - group filter: (dn=clusteradmingroup), user filter: (city=seattle).

Incremental sync works only for the users who are already synced (the first time). Incremental won't sync any new users added to the groups after the initial sync.

### Update Ranger sync filter

The LDAP filter can be found in the Ambari UI, under the Ranger user-sync configuration section. The existing filter will be in the form `(|(userPrincipalName=bob@contoso.com)(userPrincipalName=hdiwatchdog-core01@CONTOSO.ONMICROSOFT.COM)(memberOf:1.2.840.113556.1.4.1941:=CN=hadoopgroup,OU=AADDC Users,DC=contoso,DC=onmicrosoft,DC=com))`. Ensure that you add predicate at the end and test the filter by using `net ads` search command or ldp.exe or something similar.

## Ranger user sync logs

Ranger user sync can happen out of either of the headnodes. The logs are in `/var/log/ranger/usersync/usersync.log`. To increase the verbosity of the logs, do the following steps:

1. Log in to Ambari.
1. Go to the Ranger configuration section.
1. Go to the Advanced **usersync-log4j** section.
1. Change the `log4j.rootLogger` to `DEBUG` level (After change it should look like `log4j.rootLogger = DEBUG,logFile,FilterLog`).
1. Save the configuration and restart ranger.

## Next steps

* [Authentication issues in Azure HDInsight](./domain-joined-authentication-issues.md)
* [Synchronize Azure AD users to an HDInsight cluster](../hdinsight-sync-aad-users-to-cluster.md)
