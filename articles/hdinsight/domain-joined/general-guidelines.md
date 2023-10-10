---
title: Enterprise security general guidelines in Azure HDInsight
description: Some best practices that should make Enterprise Security Package deployment and management easier.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/23/2023
---

# Enterprise security general information and guidelines in Azure HDInsight

When deploying a secure HDInsight cluster, there are some best practices that should make the deployment and cluster management easier. Some general information and guidelines are discussed here.

## Use of secure cluster

### Recommended

* Cluster will be used by multiple users at the same time.
* Users have different levels of access to the same data.

### Not necessary

* You're going to run only automated jobs (like single user account), a standard cluster is good enough.
* You can do the data import using a standard cluster and use the same storage account on a different secure cluster where users can run analytics jobs.

## Use of local account

* If you use a shared user account or a local account, then it will be difficult to identify who used the account to change the config or service.
* Using local accounts is problematic when users are no longer part of the organization.

## Ranger

### Policies

* By default, Ranger uses **Deny** as the policy.

* When data access is made through a service where authorization is enabled:
  * Ranger authorization plugin is invoked and given the context of the request.
  * Ranger applies the policies configured for the service. If the Ranger policies fail, the access check is deferred to the file system. Some services like MapReduce only check if the file / folder being owned by the same user who is submitting the request. Services like Hive, check for either ownership match or appropriate filesystem permissions (`rwx`).

* For Hive, in addition to having the permissions to do Create / Update / Delete permissions, the user should have `rwx`permissions on the directory on storage and all sub directories.

* Policies can be applied to groups (preferable) instead of individuals.

* Ranger authorizer will evaluate all Ranger policies for that service for each request. This evaluation could have an impact on the time take to accept the job or query.

### Storage access

* If the storage type is WASB, then no OAuth token is involved.
* If Ranger has performed the authorization, then the storage access happens using the Managed Identity.
* If Ranger didn't perform any authorization, then the storage access happens using the user's OAuth token.

### Hierarchical name space

When hierarchical name space in not enabled:

* There are no inherited permissions.
* Only filesystem permission that works is **Storage Data XXXX** Azure role, to be assigned to the user directly in Azure portal.

### Default HDFS permissions

* By default, users don't have access to the **/** folder on HDFS (they need to be in the storage blob owner role for access to succeed).
* For the staging directory for mapreduce and others, a user-specific directory is created and provided `sticky _wx` permissions. Users can create files and folders underneath, but can't look at other items.

### URL auth

If the url auth is enabled:

* The config will contain what prefixes are covered in the url auth (like `adl://`).
* If the access is for this url, then Ranger will check if the user is in the allow list.
* Ranger won't check any of the fine grained policies.

### Manage Ranger audit logs

To prevent Ranger audit logs from consuming too much disk space on your hn0 headnode, you can change the number of days to retain the logs. 

1. Sign in to the **Ambari UI**.
2. Navigate to **Services** > **Ranger** > **Configs** > **Advanced** > **Advanced ranger-solr-configuration**.
3. Change the 'Max Retention Days' to 7 days or less.
4. Select **Save** and restart affected components for the change to take effect. 

### Use a custom Ranger DB  

We recommend deploying an external Ranger DB to use with your ESP cluster for high availability of Ranger metadata, which ensures that policies are available even if the cluster is unavailable. Since an external database is customer-managed, you'll also have the ability to tune the DB size and share the database across multiple ESP clusters. You can specify your [external Ranger DB during the ESP cluster creation](/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters) process using the Azure portal, Azure Resource Manager, Azure CLI, etc. 

### Set Ranger user sync to run daily 

HDInsight ESP clusters are configured for Ranger to synchronize AD users automatically every hour. The Ranger sync is a user sync and can cause extra load on the AD instance. For this reason, we recommend that you change the Ranger user sync interval to 24 hours. 

1. Sign in to the **Ambari UI**. 
2. Navigate to **Services** > **Ranger** > **Configs** > **Advanced** > **ranger-ugsync-site**
3. Set property **ranger.usersync.sleeptimeinmillisbetweensynccycle** to 86400000 (24h in milliseconds).
4. Select **Save** and restart affected components for the change to take effect. 

## Resource groups

Use a new resource group for each cluster so that you can distinguish between cluster resources.

## NSGs, firewalls, and internal gateway

* Use network security groups (NSGs) to lock down virtual networks.
* Use firewall to handle outbound access policies.
* Use the internal gateway that isn't open to the public internet.

<a name='azure-active-directory'></a>

## Microsoft Entra ID

[Microsoft Entra ID](../../active-directory/fundamentals/active-directory-whatis.md) (Microsoft Entra ID) is Microsoft's cloud-based identity and access management service.

### Policies

* Disable conditional access policy using the IP address based policy. This requires service endpoints to be enabled on the VNETs where the clusters are deployed. If you use an external service for MFA (something other than Microsoft Entra ID), the IP address based policy won't work

* `AllowCloudPasswordValidation` policy is required for federated users. Since HDInsight uses the username / password directly to get tokens from Microsoft Entra ID, this policy has to be enabled for all federated users.

* Enable service endpoints if you require conditional access bypass using Trusted IPs.

### Groups

* Always deploy clusters with a group.
* Use Microsoft Entra ID to manage group memberships (easier than trying to manage the individual services in the cluster).

### User accounts

* Use a unique user account for each scenario. For example, use an account for import, use another for query or other processing jobs.
* Use group-based Ranger policies instead of individual policies.
* Have a plan on how to manage users who shouldn't have access to clusters anymore.

<a name='azure-active-directory-domain-services'></a>

## Microsoft Entra Domain Services

[Microsoft Entra Domain Services](../../active-directory-domain-services/overview.md) (Microsoft Entra Domain Services) provides managed domain services such as domain join, group policy, lightweight directory access protocol (LDAP), and Kerberos / NTLM authentication that is fully compatible with Windows Server Active Directory.

Microsoft Entra Domain Services is required for secure clusters to join a domain.
HDInsight can't depend on on-premises domain controllers or custom domain controllers, as it introduces too many fault points, credential sharing, DNS permissions, and so on. For more information, see [Microsoft Entra Domain Services FAQs](../../active-directory-domain-services/faqs.yml).

<a name='choose-correct-azure-ad-ds-sku'></a>

### Choose correct Microsoft Entra Domain Services SKU 

When creating your managed domain, [you can choose from different SKUs](/azure/active-directory-domain-services/administration-concepts#azure-ad-ds-skus) that offer varying levels of performance and features. The amount of ESP clusters and other applications that will be using the Microsoft Entra Domain Services instance for authentication requests determines which SKU is appropriate for your organization. If you notice high CPU on your managed domain or your business requirements change, you can upgrade your SKU.

<a name='azure-ad-ds-instance'></a>

### Microsoft Entra Domain Services instance

* Create the instance with the `.onmicrosoft.com domain`. This way, there won’t be multiple DNS servers serving the domain.
* Create a self-signed certificate for the LDAPS and upload it to Microsoft Entra Domain Services.
* Use a peered virtual network for deploying clusters (when you have a number of teams deploying HDInsight ESP clusters, this will be helpful). This ensures that you don't need to open up ports (NSGs) on the virtual network with domain controller.
* Configure the DNS for the virtual network properly (the Microsoft Entra Domain Services domain name should resolve without any hosts file entries).
* If you're restricting outbound traffic, make sure that you have read through the [firewall support in HDInsight](../hdinsight-restrict-outbound-traffic.md)

<a name='consider-azure-ad-ds-replica-sets'></a>

### Consider Microsoft Entra Domain Services replica sets 

When you create a Microsoft Entra Domain Services managed domain, you define a unique namespace, and two domain controllers (DCs) are then deployed into your selected Azure region. This deployment of DCs is known as a replica set. [Adding additional replica sets](/azure/active-directory-domain-services/tutorial-create-replica-set) will provide resiliency and ensure availability of authentication services, which is critical for Azure HDInsight clusters.

### Configure scoped user/group synchronization 

When you enable [Microsoft Entra Domain Services for your ESP cluster](/azure/hdinsight/domain-joined/apache-domain-joined-create-configure-enterprise-security-cluster), you can choose to synchronize all users and groups from Microsoft Entra ID or scoped groups and their members. We recommend that you choose "Scoped" synchronization for the best performance. 

[Scoped synchronization](/azure/active-directory-domain-services/scoped-synchronization) can be modified with different group selections or converted to "All" users and groups if needed. You can't change the synchronization type from "All" to "Scoped" unless you delete and recreate the Microsoft Entra Domain Services instance.

<a name='properties-synced-from-azure-ad-to-azure-ad-ds'></a>

### Properties synced from Microsoft Entra ID to Microsoft Entra Domain Services

* Microsoft Entra Connect syncs from on-premises to Microsoft Entra ID.
* Microsoft Entra Domain Services syncs from Microsoft Entra ID.

Microsoft Entra Domain Services syncs objects from Microsoft Entra ID periodically. The Microsoft Entra Domain Services blade on the Azure portal displays the sync status. During each stage of sync, unique properties may get into conflict and renamed. Pay attention to the property mapping from Microsoft Entra ID to Microsoft Entra Domain Services.

For more information, see [Microsoft Entra UserPrincipalName population](../../active-directory/hybrid/plan-connect-userprincipalname.md), and [How Microsoft Entra Domain Services synchronization works](../../active-directory-domain-services/synchronization.md).

### Password hash sync

* Passwords are synced differently from other object types. Only non-reversible password hashes are synced in Microsoft Entra ID and Microsoft Entra Domain Services
* On-premises to Microsoft Entra ID has to be enabled through AD Connect
* Microsoft Entra ID to Microsoft Entra Domain Services sync is automatic (latencies are under 20 minutes).
* Password hashes are synced only when there's a changed password. When you enable password hash sync, all existing passwords don't get synced automatically as they're stored irreversibly. When you change the password, password hashes get synced.

### Set Ambari LDAP sync to run daily

The process of syncing new LDAP users to Ambari is automatically configured to run every hour. Running this every hour can cause excess load on the cluster's headnodes and the AD instance. For improved performance, we recommend changing the /opt/startup_scripts/start_ambari_ldap_sync.py script that runs the Ambari LDAP sync to run once a day. This script is run through a crontab job, and it is stored the in the directory "/etc/cron.hourly/" on the cluster headnodes.  

To make it run once a day, perform the following steps: 

1. ssh to hn0
2. Move the script to the cron daily folder: `sudo mv /etc/cron.hourly/ambarildapsync /etc/cron.daily/ambarildapsync`
3. Apply the change in the crontab job: `sudo service cron reload`
4. ssh to hn1 and repeat stepts 1 - 3 

If needed, you can [use the Ambari REST API to manually synchronize new users and groups](/azure/hdinsight/hdinsight-sync-aad-users-to-cluster#use-the-apache-ambari-rest-api-to-synchronize-users) immediately. 

### Computer objects location

Each cluster is associated with a single OU. An internal user is provisioned in the OU. All the nodes are domain joined into the same OU.

### Active Directory administrative tools

For steps on how to install the Active Directory administrative tools on a Windows Server VM, see [Install management tools](../../active-directory-domain-services/tutorial-create-management-vm.md).

## Troubleshooting

### Cluster creation fails repeatedly

Most common reasons:

* DNS configuration isn't correct, domain join of cluster nodes fail.
* NSGs are too restrictive, preventing domain join.
* Managed Identity doesn't have sufficient permissions.
* Cluster name isn't unique on the first six characters (either with another live cluster, or with a deleted cluster).

## Authentication setup and configuration

### User Principal Name (UPN)

* Please use lowercase for all services - UPNs are not case sensitive in ESP clusters, but
* The UPN prefix should match both SAMAccountName in Microsoft Entra Domain Services. Matching with the mail field is not required.

### LDAP properties in Ambari configuration

For a full list of the Ambari properties that affect your HDInsight cluster configuration, see [Ambari LDAP Authentication Setup](https://ambari.apache.org/1.2.1/installing-hadoop-using-ambari/content/ambari-chap2-4.html).

### Generate domain user keytab(s) 

All service keytabs are automatically generated for you during the ESP cluster creation process. To enable secure communication between the cluster and other services and/or jobs that require authentication, you can generate a keytab for your domain username. 

Use the ktutil on one of the cluster VMs to create a Kerberos keytab: 

``` 

ktutil
ktutil: addent -password -p <username>@<DOMAIN.COM> -k 1 -e aes256-cts-hmac-sha1-96
Password for <username>@<DOMAIN.COM>: <password>
ktutil: wkt <username>.keytab
ktutil: q
``` 

If your TenantName & DomainName are different, you need to add a SALT value using the -s option. Check the HDInsight FAQ page to [determine the proper SALT value when creating a Kerberos keytab](/azure/hdinsight/hdinsight-faq#how-do-i-create-a-keytab-for-an-hdinsight-esp-cluster-). 

### LDAP certificate renewal

HDInsight will automatically renew the certificates for the managed identities you use for clusters with the Enterprise Security Package (ESP). However, there is a limitation when different managed identities are used for Microsoft Entra Domain Services and ADLS Gen2 that could cause the renewal process to fail. Follow the 2 recommendations below to ensure we are able to renew your certificates successfully:

- If you use different managed identities for ADLS Gen2 and Microsoft Entra Domain Services clusters, then both of them should have the **Storage blob data Owner** and **HDInsight Domain Services Contributor** roles assigned to them.
- HDInsight clusters require public IPs for certificate updates and other maintenance so **any policies that deny public IP on the cluster should be removed**.

## Next steps

* [Enterprise Security Package configurations with Microsoft Entra Domain Services in HDInsight](./apache-domain-joined-configure-using-azure-adds.md)

* [Synchronize Microsoft Entra users to an HDInsight cluster](../hdinsight-sync-aad-users-to-cluster.md).
