---
title: Migrate on-premises Apache Hadoop clusters to Azure HDInsight - security and DevOps best practices
description: Learn security and DevOps best practices for migrating on-premises Hadoop clusters to Azure HDInsight.
author: hrasheed-msft
ms.reviewer: ashishth
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: hrasheed
---
# Migrate on-premises Apache Hadoop clusters to Azure HDInsight - security and DevOps best practices

This article gives recommendations for security and DevOps in Azure HDInsight systems. It's part of a series that provides best practices to assist with migrating on-premises Apache Hadoop systems to Azure HDInsight.

## Secure and govern cluster with Enterprise Security Package

The Enterprise Security Package (ESP) supports Active Directory-based authentication, multiuser support, and role-based access control. With the ESP option chosen, HDInsight cluster is joined to the Active Directory domain and the enterprise admin can configure role-based access control (RBAC) for Apache Hive security by using Apache Ranger. The admin can also audit the data access by employees and any changes done to access control policies.

ESP is available on the following cluster types: Apache Hadoop, Apache Spark, Apache HBase, Apache Kafka, and Interactive Query (Hive LLAP). 

Use the following steps to deploy the Domain-joined HDInsight cluster:

- Deploy Azure Active Directory (AAD) by passing the Domain name.
- Deploy Azure Active Directory Domain Services (AAD DS).
- Create the required Virtual Network and subnet.
- Deploy a VM in the Virtual Network to manage AAD DS.
- Join the VM to the domain.
- Install AD and DNS tools.
- Have the AAD DS Administrator create an Organizational Unit (OU).
- Enable LDAPS for AAD DS.
- Create a service account in Azure Active Directory with delegated read & write admin permission to the OU, so that it can. This service account can then join machines to the domain and place machine principals within the OU. It can also create service principals within the OU that you specify during cluster creation.


    > [!Note]
    > The service account does not need to be AD domain admin account.


- Deploy HDInsight ESP cluster by setting the following parameters:
    - **Domain name**: The domain name that's associated with Azure AD DS.
    - **Domain user name**: The service account in the Azure AD DS DC-managed domain that you created in the previous section, for example: `hdiadmin@contoso.onmicrosoft.com`. This domain user will be the administrator of this HDInsight cluster.
    - **Domain password**: The password of the service account.
    - **Organizational unit**: The distinguished name of the OU that you want to use with the HDInsight cluster, for example: `OU=HDInsightOU,DC=contoso,DC=onmicrosoft,DC=com`. If this OU does not exist, the HDInsight cluster tries to create the OU using the privileges of the service account.
    - **LDAPS URL**: for example, `ldaps://contoso.onmicrosoft.com:636`.
    - **Access user group**: The security groups whose users you want to sync to the cluster, for example: `HiveUsers`. If you want to specify multiple user groups, separate them by semicolon ';'. The group(s) must exist in the directory prior to creating the ESP cluster.

For more information, see the following articles:

- [An introduction to Apache Hadoop security with domain-joined HDInsight clusters](../domain-joined/apache-domain-joined-introduction.md)

- [Plan Azure domain-joined Apache Hadoop clusters in HDInsight](../domain-joined/apache-domain-joined-architecture.md)
- [Configure a domain-joined HDInsight cluster by using Azure Active Directory Domain Services](../domain-joined/apache-domain-joined-configure-using-azure-adds.md)
- [Synchronize Azure Active Directory users to an HDInsight cluster](../hdinsight-sync-aad-users-to-cluster.md)
- [Configure Apache Hive policies in Domain-joined HDInsight](../domain-joined/apache-domain-joined-run-hive.md)
- [Run Apache Oozie in domain-joined HDInsight Hadoop clusters](../domain-joined/hdinsight-use-oozie-domain-joined-clusters.md)

## Implement end to end enterprise security

End to end enterprise security can be achieved using the following controls:

- **Private and protected data pipeline (perimeter level security)**
    - Perimeter level Security can be achieved through Azure Virtual Networks, Network Security Groups, and Gateway service.

- **Authentication and authorization for data access**
    - Create Domain-joined HDInsight cluster using Azure Active Directory Domain Services. (Enterprise Security Package).
    - Use Ambari to provide Role-based access to cluster resources for AD users.
    - Use Apache Ranger to set access control policies for Hive at the table / column / row level.
    - SSH access to the cluster can be restricted only to the administrator.

- **Auditing**
    - View and report all access to the HDInsight cluster resources and data.
    - View and report all changes to the access control policies.

- **Encryption**
    - Transparent Server-Side encryption using Microsoft-managed keys or customer-managed keys.
    - In Transit encryption using Client-Side encryption, https and TLS.

For more information, see the following articles:

- [Azure Virtual Networks overview](../../virtual-network/virtual-networks-overview.md)
- [Azure Network Security Groups overview](../../virtual-network/security-overview.md)
- [Azure Virtual Network peering](../../virtual-network/virtual-network-peering-overview.md)
- [Azure storage security guide](../../storage/common/storage-security-guide.md)
- [Azure Storage Service Encryption at rest](../../storage/common/storage-service-encryption.md)

## Use monitoring & alerting

For more information, see the article:

[Azure Monitor Overview](../../azure-monitor/overview.md)

## Upgrade clusters

Regularly upgrade to the latest HDInsight version to take advantage of the latest features. The following steps can be used to upgrade the cluster to the latest version:

1. Create a new TEST HDInsight cluster using the latest available HDInsight version.
1. Test on the new cluster to make sure that the jobs and workloads work as expected.
1. Modify jobs or applications or workloads as required.
1. Back up any transient data stored locally on the cluster nodes.
1. Delete the existing cluster.
1. Create a cluster of the latest HDInsight version in the same VNET subnet, using the same default data and meta store as the previous cluster.
1. Import any transient data that was backed up.
1. Start jobs/continue processing using the new cluster.

For more information, see the article: [Upgrade HDInsight cluster to a new version](../hdinsight-upgrade-cluster.md).

## Patch cluster operating systems

As a managed Hadoop service, HDInsight takes care of patching the OS of the VMs used by HDInsight clusters.

For more information, see the article: [OS patching for HDInsight](../hdinsight-os-patching.md).

## Post-Migration

1. **Remediate applications** - Iteratively make the necessary changes to the jobs, processes, and scripts.
2. **Perform Tests** - Iteratively run functional and performance tests.
3. **Optimize** - Address any performance issues based on the above test results and then retest to confirm the performance improvements.

## Next steps

- Read more about [HDInsight 4.0](https://docs.microsoft.com/azure/hdinsight/hadoop/apache-hadoop-introduction).
