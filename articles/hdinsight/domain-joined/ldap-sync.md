---
title: LDAP sync in Ranger and Apache Ambari in Azure HDInsight
description: Address the LDAP sync in Ranger and Ambari and provide general guidelines.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/24/2023
---

# LDAP sync in Ranger and Apache Ambari in Azure HDInsight

HDInsight Enterprise Security Package (ESP) clusters use Ranger for authorization. Apache Ambari and Ranger both sync users and groups independently and work a little differently. This article is meant to address the LDAP sync in Ranger and Ambari.

## General guidelines

* Always deploy clusters with one or more groups.
* If you want to use more groups in the cluster, check whether it makes sense to update the group memberships in Microsoft Entra ID.
* If you want to change the cluster groups, you can change the sync filters by using Ambari.
* All group membership changes in Microsoft Entra ID are reflected in the cluster in subsequent syncs. The changes need to be synced to Microsoft Entra Domain Services first, and then to the clusters.
* HDInsight clusters use Samba/Winbind to project the group memberships on the cluster nodes.
* Group members are synced transitively (all the subgroups and their members) to both Ambari and Ranger. 

## Users are synced separately

 * Ambari and Ranger don't share the user database because they serve two different purposes. 
   * If a user needs to use the Ambari UI, the user needs to be synced to Ambari. 
   * If the user isn't synced to Ambari, the Ambari UI/API will reject it, but other parts of the system will work (these are guarded by Ranger or Resource Manager, and not by Ambari).
   * To include users or groups in Ranger policies, the principals need to be explicitly synced in Ranger.

## Ambari user sync and configuration

From the head nodes, a cron job, `/opt/startup_scripts/start_ambari_ldap_sync.py`, is run every hour to schedule the user sync. The cron job calls the Ambari rest APIs to perform the sync. The script submits a list of users and groups to sync (as the users may not belong to the specified groups, both are specified individually). Ambari syncs the sAMAccountName as the username and all the group members, transitively.

The logs should be in `/var/log/ambari-server/ambari-server.log`. For more information, see [Configure Ambari logging level](https://docs.cloudera.com/HDPDocuments/Ambari-latest/administering-ambari/content/amb_configure_ambari_logging_level.html).

In Data Lake clusters, the post user creation hook is used to create the home folders for the synced users and they're set as the owners of the home folders. If the user isn't synced to Ambari correctly, then the user could face failures in running jobs as the home folder may not be setup correctly.

## Ranger user sync and configuration

Ranger has a built-in sync engine that runs every hour to sync users. It doesn't share the user database with Ambari. HDInsight configures the search filter to sync the admin user, the watchdog user, and the members of the group specified during the cluster creation. The group members will be synced transitively:

1. Disable incremental sync.
1. Enable the User group sync map.
1. Specify the search filter to include the transitive group members.
1. Sync the sAMAccountName attribute for users and the name attribute for groups.

### Group or incremental sync

Ranger supports a group sync option, but it works as an intersection with user filter, not as a union between group memberships and user filter. A typical use case for group sync filter in Ranger is - group filter: (dn=clusteradmingroup), user filter: (city=seattle).

Incremental sync works only for the users who are already synced (the first time). Incremental won't sync any new users added to the groups after the initial sync.

### Update Ranger sync filter

The LDAP filter can be found in the Ambari UI, under the Ranger user-sync configuration section. The existing filter will be in the form `(|(userPrincipalName=bob@contoso.com)(userPrincipalName=hdiwatchdog-core01@CONTOSO.ONMICROSOFT.COM)(memberOf:1.2.840.113556.1.4.1941:=CN=hadoopgroup,OU=AADDC Users,DC=contoso,DC=onmicrosoft,DC=com))`. Ensure that you add predicate at the end and test the filter by using `net ads` search command or ldp.exe or something similar.

## Ranger user sync logs

Ranger user sync can happen out of either of the headnodes. The logs are in `/var/log/ranger/usersync/usersync.log`. To increase the verbosity of the logs, do the following steps:

1. Log in to Ambari.
1. Go to the Ranger configuration section.
1. Go to the Advanced **usersync-log4j** section.
1. Change the `log4j.rootLogger` to `DEBUG` level. (After changing it, it should look like `log4j.rootLogger = DEBUG,logFile,FilterLog`).
1. Save the configuration and restart Ranger.

## Known issues with Ranger user sync
* If the group name has unicode characters, Ranger sync fails to sync that object. If a user belongs to a group that has international characters, Ranger syncs partial group membership
* User name (sAMAccountName) and group name (name) have to be 20 characters long or less. If the group name is longer, then the user will be treated as if they do not belong to the group, when calculating the permissions.

## Next steps

* [Authentication issues in Azure HDInsight](./domain-joined-authentication-issues.md)
* [Synchronize Microsoft Entra users to an HDInsight cluster](../hdinsight-sync-aad-users-to-cluster.md)
