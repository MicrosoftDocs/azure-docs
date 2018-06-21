---
title: Domain-joined Azure HDInsight architecture | Microsoft Docs
description: Learn how to plan domain-joined HDInsight.
services: hdinsight
documentationcenter: 
author: omidm1
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 7dc6847d-10d4-4b5c-9c83-cc513cf91965
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: 
ms.topic: conceptual
ms.date: 05/30/2018
ms.author: omidm

---
# Plan Azure domain-joined Hadoop clusters in HDInsight

The standard HDInsight cluster is a single-user cluster. It is suitable for most companies that have smaller application teams building large data workloads. Each user can have a different cluster dedicated to himself on demand and destroy it when it's not needed anymore. However, many enterprises started moving toward a model in which clusters are managed by IT teams and multiple application teams share clusters. Thus, multiuser access to the cluster is needed in Azure HDInsight for these larger enterprises.

HDInsight relies on the most popular identity provider--Active Directory (AD) in a managed way. By integrating HDInsight with [Azure Active Directory Domain Services (AAD-DS)](../../active-directory-domain-services/active-directory-ds-overview.md), you can access the clusters by using your domain credentials. The VMs in HDInsight are domain-joined to your provided domain, so all the services running on HDInsight (Ambari, Hive server, Ranger, Spark thrift server, and others) work seamlessly for the authenticated user. Administrators can then create strong authorization policies using Apache Ranger to provide role-based access control for resources in the cluster.


## Integrate HDInsight with Active Directory

Open-source Hadoop relies on Kerberos for providing authentication and security. Therefore, HDInsight cluster nodes are domain-joined to a domain managed by AAD-DS. Kerberos security is configured for the Hadoop components on the cluster. For each of the Hadoop components, a service principal is created automatically. A corresponding machine principal is also created for each machine that is joined to the domain. In order to store these service and machine principals, it is required to provide an Organizational Unit (OU) within the domain controller (AAD-DS), where these principals are placed. 

To summarize, you need to set up an environment with:

- An Active Directory domain (managed by AAD-DS)
- Secure LDAP (LDAPS) enabled in AAD-DS.
- Proper networking connectivity from HDInsight’s VNET to the AAD-DS VNET, in case you choose separate VNETs for them. A VM inside the HDI VNET should have a line of sight to AAD-DS using VNET peering. If both HDI and AAD-DS are deployed in the same VNET, the connectivity is automatically provided and no further action is needed.
- An Organizational Unit (OU) [created on AAD-DS](../../active-directory-domain-services/active-directory-ds-admin-guide-create-ou.md)
- A service account that has permissions to:
    - Create Service principals in the OU.
    - Join machines to the domain and create machine principals in the OU.

The following screenshot shows an OU created in contoso.com. Some of the service principals and machine principals are shown in the screenshot as well.

![Domain Joined HDInsight clusters ou](./media/apache-domain-joined-architecture/hdinsight-domain-joined-ou.png).

### Different Domain Controllers Setup:
HDInsight currently only supports AAD-DS as the main domain controller that the cluster will talk to Kerberise the cluster. However, other complex AD setups are also possible as long as it leads to enabling AAD-DS for HDI access.

- **[Azure Active Directory Domain Services (AAD-DS)](../../active-directory-domain-services/active-directory-ds-overview.md)**: This service provides a managed domain, which is fully compatible with Windows Server Active Directory. Microsoft takes care of managing, patching, and monitoring the domain in a Highly Available(HA) setup. You can deploy your cluster without worrying about maintaining domain controllers. Users, groups, and passwords are synchronized from your Azure Active Directory(AAD) [One-way sync from AAD to AAD-DS], enabling users to sign in to the cluster using the same corporate credentials. For more information, see [How to configure Domain-joined HDInsight clusters using AAD-DS](./apache-domain-joined-configure-using-azure-adds.md).
- **On-premise AD or AD on IaaS VMs**: If you have an on-premise AD or other more complex AD setups for your domain, you can sync those identities to AAD using AD Connect and then enable AAD-DS on that AD tenant. Since Kerberos relies on password hashes, you will need to [enable password hash sync on AAD-DS](../../active-directory-domain-services/active-directory-ds-getting-started-password-sync.md). If you are using federation with AD federation Services (ADFS), you can optionally setup password hash sync as a backup in case your ADFS infrastructure fails. For more info, see [enable password hash sync with AAD Connect sync](../../active-directory/connect/active-directory-aadconnectsync-implement-password-hash-synchronization.md). Using on-premise AD or AD on IaaS VMs alone, without AAD and AAD-DS is not a supported configuration for HDI cluster domain joining.

## Next steps
* [Configure domain-joined HDInsight clusters](apache-domain-joined-configure-using-azure-adds.md).
* [Configure Hive policies for domain-joined HDInsight clusters](apache-domain-joined-run-hive.md).
* [Manage domain-joined HDInsight clusters](apache-domain-joined-manage.md). 
