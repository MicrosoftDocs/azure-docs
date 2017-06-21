---
title: Domain-joined Azure HDInsight architecture | Microsoft Docs
description: Learn how to plan domain-joined HDInsight.
services: hdinsight
documentationcenter: ''
author: saurinsh
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 7dc6847d-10d4-4b5c-9c83-cc513cf91965
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 02/03/2017
ms.author: saurinsh

---
# Plan Azure domain-joined Hadoop clusters in HDInsight

The traditional Hadoop is a single-user cluster. It is suitable for most companies that have smaller application teams building large data workloads. As Hadoop gains popularity, many enterprises are moving toward a model in which clusters are managed by IT teams and multiple application teams share clusters. Thus, functionalities involving multiuser clusters are among the most requested functionalities in Azure HDInsight.

Instead of building its own multiuser authentication and authorization, HDInsight relies on the most popular identity provider--Azure Active Directory (Azure AD). The powerful security functionality in Azure AD can be used to manage multiuser authorization in HDInsight. By integrating HDInsight with Azure AD, you can communicate with the clusters by using your Azure AD credentials. HDInsight maps an Azure AD user to a local Hadoop user, so all the services running on HDInsight (Ambari, Hive server, Ranger, Spark thrift server, and others) work seamlessly for the authenticated user.

## Integrate HDInsight with Azure AD and AD on IaaS VM

By integrating HDInsight with Azure AD or AD on Iaas VM, the HDInsight cluster nodes are domain-joined to a domain. HDInsight creates service principals for the Hadoop services running on the cluster and places them within a specified organizational unit (OU) in Azure AD or AD on IaaS VM. HDInsight also creates reverse DNS mappings in the domain for the IP addresses of the nodes that are joined to the domain.

You can achieve this setup by using multiple architectures. You can choose from the following architectures.

**HDInsight integrated with AD running on Azure IaaS**

This is the simplest architecture for integrating HDInsight with Active Directory. The AD domain controller runs on one (or multiple) virtual machines (VMs) in Azure. These VMs are usually in a virtual network. You set up another virtual network for the HDInsight cluster. For HDInsight to have a line of sight to Active Directory, you need to peer these virtual networks by using [VNet-to-VNet peering](../virtual-network/virtual-network-create-peering.md). If you create the Active Directory in ARM, then you can create the Active Directory and HDInsight in the same VNet and you don't need to do peering. 

![Domain-join HDInsight cluster topology](./media/hdinsight-domain-joined-architecture/hdinsight-domain-joined-architecture_1.png)

> [!NOTE]
> In this architecture, you cannot use Azure Data Lake Store with the HDInsight cluster.


Prerequisites for Active Directory:

* An [organizational unit](../active-directory-domain-services/active-directory-ds-admin-guide-create-ou.md) must be created, within which you place the HDInsight cluster VMs and the service principals used by the cluster.
* [Lightweight Directory Access Protocols](../active-directory-domain-services/active-directory-ds-admin-guide-configure-secure-ldap.md) (LDAPs) must be set up for communicating with AD. The certificate used to set up LDAPS must be a real certificate (not a self-signed certificate).
* Reverse DNS zones must be created on the domain for the IP address range of the HDInsight subnet (for example, 10.2.0.0/24 in the previous picture).
* A service account or a user account is needed. Use this account to create the HDInsight cluster. This account must have the following permissions:

    - Permissions to create service principal objects and machine objects within the organizational unit
    - Permissions to create reverse DNS proxy rules
    - Permissions to join machines to the Active Directory domain

**HDInsight integrated with cloud-only Azure AD**

For cloud-only Azure AD, configure a domain controller so that HDInsight can be integrated with Azure AD. This is achieved by using [Azure Active Directory Domain Services](../active-directory-domain-services/active-directory-ds-overview.md) (Azure AD DS). Azure AD DS creates domain controller machines on the cloud and provides IP addresses for them. It creates two domain controllers for high availability.

Currently, Azure AD DS exists only in classic virtual networks. It is only accessible by using the Azure classic portal. The HDInsight virtual network exists in the Azure portal, which needs to be peered with the classic virtual network by using VNet-to-VNet peering.

> [!NOTE]
> Peering between a classic virtual network and an Azure Resource Manager virtual network requires that both virtual networks are in the same region and under the same Azure subscription.

![Domain-join HDInsight cluster topology](./media/hdinsight-domain-joined-architecture/hdinsight-domain-joined-architecture_2.png)

Prerequisites for Azure AD:

* An [organizational unit](../active-directory-domain-services/active-directory-ds-admin-guide-create-ou.md) must be created within which you place the HDInsight cluster VMs and the service principals used by the cluster.
* [LDAPS](../active-directory-domain-services/active-directory-ds-admin-guide-configure-secure-ldap.md) must be set up when you configure Azure AD DS. The certificate used to set up LDAPS must be a real certificate (not a self-signed certificate).
* Reverse DNS zones must be created on the domain for the IP address range of the HDInsight subnet (for example, 10.2.0.0/24 in the previous picture).
* [Password hashes](../active-directory-domain-services/active-directory-ds-getting-started-password-sync.md) must be synced from Azure AD to Azure AD DS.
* A service account or a user account is needed. Use this account to create the HDInsight cluster. This account must have the following permissions:

    - Permissions to create service principal objects and machine objects within the organizational unit
    - Permissions to create reverse DNS proxy rules
    - Permissions to join machines to the Azure AD domain

## Next steps
* To configure a domain-joined HDInsight cluster, see [Configure domain-joined HDInsight clusters](hdinsight-domain-joined-configure.md).
* To manage domain-joined HDInsight clusters, see [Manage domain-joined HDInsight clusters](hdinsight-domain-joined-manage.md).
* To configure Hive policies and run Hive queries, see [Configure Hive policies for domain-joined HDInsight clusters](hdinsight-domain-joined-run-hive.md).
* To run Hive queries by using SSH on domain-joined HDInsight clusters, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).
