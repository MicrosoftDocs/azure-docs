---
title: Enterprise security general guidelines in Azure HDInsight
description: Some best practices that should make Enterprise Security Package deployment and management easier.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 02/13/2020
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
* Only filesystem permission that works is **Storage Data XXXX** RBAC role, to be assigned to the user directly in Azure portal.

### Default HDFS permissions

* By default, users don't have access to the **/** folder on HDFS (they need to be in the storage blob owner role for access to succeed).
* For the staging directory for mapreduce and others, a user-specific directory is created and provided `sticky _wx` permissions. Users can create files and folders underneath, but can't look at other items.

### URL auth

If the url auth is enabled:

* The config will contain what prefixes are covered in the url auth (like `adl://`).
* If the access is for this url, then Ranger will check if the user is in the allow list.
* Ranger won't check any of the fine grained policies.

## Resource groups

Use a new resource group for each cluster so that you can distinguish between cluster resources.

## NSGs, firewalls, and internal gateway

* Use network security groups (NSGs) to lock down virtual networks.
* Use firewall to handle outbound access policies.
* Use the internal gateway that isn't open to the public internet.

## Azure Active Directory

[Azure Active Directory](../../active-directory/fundamentals/active-directory-whatis.md) (Azure AD) is Microsoft's cloud-based identity and access management service.

### Policies

* Disable conditional access policy using the IP address based policy. This requires service endpoints to be enabled on the VNETs where the clusters are deployed. If you use an external service for MFA (something other than AAD), the IP address based policy won't work

* `AllowCloudPasswordValidation` policy is required for federated users. Since HDInsight uses the username / password directly to get tokens from Azure AD, this policy has to be enabled for all federated users.

* Enable service endpoints if you require conditional access bypass using Trusted IPs.

### Groups

* Always deploy clusters with a group.
* Use Azure AD to manage group memberships (easier than trying to manage the individual services in the cluster).

### User accounts

* Use a unique user account for each scenario. For example, use an account for import, use another for query or other processing jobs.
* Use group-based Ranger policies instead of individual policies.
* Have a plan on how to manage users who shouldn't have access to clusters anymore.

## Azure Active Directory Domain Services

[Azure Active Directory Domain Services](../../active-directory-domain-services/overview.md) (Azure AD DS) provides managed domain services such as domain join, group policy, lightweight directory access protocol (LDAP), and Kerberos / NTLM authentication that is fully compatible with Windows Server Active Directory.

Azure AD DS is required for secure clusters to join a domain.
HDInsight can't depend on on-premise domain controllers or custom domain controllers, as it introduces too many fault points, credential sharing, DNS permissions, and so on. For more information, see [Azure AD DS FAQs](../../active-directory-domain-services/faqs.md).

### Azure AD DS instance

* Create the instance with the `.onmicrosoft.com domain`. This way, there won’t be multiple DNS servers serving the domain.
* Create a self-signed certificate for the LDAPS and upload it to Azure AD DS.
* Use a peered virtual network for deploying clusters (when you have a number of teams deploying HDInsight ESP clusters, this will be helpful). This ensures that you don't need to open up ports (NSGs) on the virtual network with domain controller.
* Configure the DNS for the virtual network properly (the Azure AD DS domain name should resolve without any hosts file entries).
* If you're restricting outbound traffic, make sure that you have read through the [firewall support in HDInsight](../hdinsight-restrict-outbound-traffic.md)

### Properties synced from Azure AD to Azure AD DS

* Azure AD connect syncs from on-premise to Azure AD.
* Azure AD DS syncs from Azure AD.

Azure AD DS syncs objects from Azure AD periodically. The Azure AD DS blade on the Azure portal displays the sync status. During each stage of sync, unique properties may get into conflict and renamed. Pay attention to the property mapping from Azure AD to Azure AD DS.

For more information, see [Azure AD UserPrincipalName population](../../active-directory/hybrid/plan-connect-userprincipalname.md), and [How Azure AD DS synchronization works](../../active-directory-domain-services/synchronization.md).

### Password hash sync

* Passwords are synced differently from other object types. Only non-reversible password hashes are synced in Azure AD and Azure AD DS
* On-premise to Azure AD has to be enabled through AD Connect
* Azure AD to Azure AD DS sync is automatic (latencies are under 20 minutes).
* Password hashes are synced only when there's a changed password. When you enable password hash sync, all existing passwords don't get synced automatically as they're stored irreversibly. When you change the password, password hashes get synced.

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

## Next steps

* [Enterprise Security Package configurations with Azure Active Directory Domain Services in HDInsight](./apache-domain-joined-configure-using-azure-adds.md)

* [Synchronize Azure Active Directory users to an HDInsight cluster](../hdinsight-sync-aad-users-to-cluster.md).
