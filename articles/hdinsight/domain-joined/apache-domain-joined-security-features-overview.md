---
title: Overview of enterprise security features in Azure HDInsight
description: Learn the various features that support enterprise security in Azure HDInsight.
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.topic: conceptual
ms.date: 07/11/2019
#Customer intent: As a user of Azure HDInsight, I want to learn the features that Azure HDInsight offers to ensure security at various system layers.
---

# Overview of enterprise security features in Azure HDInsight

Azure HDInsight offers a number of features to address your enterprise security needs. Most of these solutions are optional, and are not activated by default. This flexibility allows you to choose the security features that are most important to you, and helps you to avoid paying for features that you don't want. This also means that it is your responsibility to make sure that the correct solutions are enabled for your setup and environment.

In this article we will look at security in two different ways. The first way divides security solutions along the lines of four traditional security pillars: perimeter security, authentication, authorization, and encryption. The second way, divides security solutions based on the system layer where they are implemented: data access layer, application/middleware layer, operating system layer and network layer. Security at the physical and virtualized infrastructure layers are handled by HDInsight and do not require any action on your part.

This article will also introduce the **Azure HDInsight Enterprise Security Package (ESP)** which provides Active Directory-based authentication, multi-user support, and role-based access control for HDInsight clusters.

## Enterprise security pillars

One way of looking at enterprise security divides security solutions into four main groups based on the type of control. These groups are also called security pillars and are the following: perimeter security, authentication, authorization, and encryption.

![Benefits of Enterprise Security Package HDInsight clusters in the four pillars of enterprise security](./media/apache-domain-joined-introduction/hdinsight-domain-joined-four-pillars.png).

### Perimeter security

Perimeter security in HDInsight is achieved through virtual networks and the Azure VPN Gateway service. An enterprise admin can create an ESP cluster inside a virtual network and use network security groups (firewall rules) to restrict access to the virtual network. Only the IP addresses defined in the inbound firewall rules will be able to communicate with the HDInsight cluster. This configuration provides perimeter security.

Another layer of perimeter security is achieved through the VPN Gateway service. The gateway acts as first line of defense for any incoming request to the HDInsight cluster. It accepts the request, validates it, and only then allows the request to pass to the other nodes in cluster. In this way, the gateway provides perimeter security to other name and data nodes in the cluster.

### Authentication

An enterprise admin can create a HDInsight cluster with ESP in a [virtual network](https://azure.microsoft.com/services/virtual-network/). All the nodes of the HDInsight cluster are joined to the domain that the enterprise manages. This is achieved through the use of [Azure Active Directory Domain Services](../../active-directory-domain-services/overview.md). 

With this setup, enterprise employees can sign in to the cluster nodes by using their domain credentials. They can also use their domain credentials to authenticate with other approved endpoints like Apache Ambari Views, ODBC, JDBC, PowerShell, and REST APIs to interact with the cluster. The admin has full control over limiting the number of users who interact with the cluster via these endpoints.

### Authorization
A best practice that most enterprises follow is making sure that not every employee has access to all enterprise resources. Likewise, the admin can define role-based access control policies for the cluster resources. 

For example, the admin can configure [Apache Ranger](https://ranger.apache.org/) to set access control policies for Hive. This functionality ensures that employees can access only as much data as they need to be successful in their jobs. SSH access to the cluster is also restricted to only the administrator.

### Auditing
Auditing of all access to the cluster resources, and the data, is necessary to track unauthorized or unintentional access of the resources. It's as important as protecting the HDInsight cluster resources from unauthorized users and securing the data. 

The admin can view and report all access to the HDInsight cluster resources and data. The admin can also view and report all changes to the access control policies created in Apache Ranger supported endpoints. 

A HDInsight cluster with ESP uses the familiar Apache Ranger UI to search audit logs. On the back end, Ranger uses [Apache Solr](https://lucene.apache.org/solr/) for storing and searching the logs.

### Encryption
Protecting data is important for meeting organizational security and compliance requirements. Along with restricting access to data from unauthorized employees, you should encrypt it. 

Both data stores for HDInsight clusters, Azure Blob storage and Azure Data Lake Storage Gen1/Gen2, support transparent server-side [encryption of data](../../storage/common/storage-service-encryption.md) at rest. Secure HDInsight clusters will seamlessly work with this capability of server-side encryption of data at rest.

## Layered security model

The following table summarizes the major system security areas and the security solutions that are available to you in each.

| Security area | Solution available |
|---|---|
| Data Access Security | Configure [access control lists ACLs](../../storage/blobs/data-lake-storage-access-control.md) for Azure Data Lake Storage Gen1 and Gen2  |
|  | Enable the ["Secure transfer required"](../../storage/common/storage-require-secure-transfer.md) property on storage accounts. |
|  | Configure [Azure Storage firewalls](../../storage/common/storage-network-security.md) and virtual networks |
|  | Ensure [TLS encryption](../../storage/common/storage-security-tls.md) is enabled for data in transit. |
|  | Configure [customer-managed keys](../../storage/common/storage-encryption-keys-portal.md) for Azure Storage encryption |
| Application and middleware security | Integrate with AAD-DS and [Configure Authentication](apache-domain-joined-configure-using-azure-adds.md) |
|  | Configure [Apache Ranger Authorization](apache-domain-joined-run-hive.md) policies |
|  | Use [Azure Monitor logs](../hdinsight-hadoop-oms-log-analytics-tutorial.md) |
| Operating system security | Create clusters with most recent secure base image |
|  | Ensure [OS Patching](../hdinsight-os-patching.md) on regular intervals |
| Network security | Configure a [virtual network](../hdinsight-extend-hadoop-virtual-network.md) |
|  | Configure [Inbound network security group (NSG) rules](../hdinsight-extend-hadoop-virtual-network.md#networktraffic) |
|  | Configure [Outbound traffic restriction](../hdinsight-restrict-outbound-traffic.md) with Firewall (preview) |

# What is Enterprise Security Package in Azure HDInsight

In the past, Azure HDInsight supported only a single user: local admin. This worked great for smaller application teams or departments. As Apache Hadoop-based workloads gained more popularity in the enterprise sector, the need for enterprise-grade capabilities like Active Directory-based authentication, multi-user support, and role-based access control became increasingly important. 

You can create an HDInsight cluster with Enterprise Security Package (ESP) that's joined to an Active Directory domain. You can then configure a list of employees from the enterprise who can authenticate through Azure Active Directory to sign in to the HDInsight cluster. No one from outside the enterprise can sign in or access the HDInsight cluster. 

The enterprise admin can configure role-based access control (RBAC) for Apache Hive security by using [Apache Ranger](https://ranger.apache.org/). Configuring RBAC restricts data access to only what's needed. Finally, the admin can audit the data access by employees and any changes done to access control policies. The admin can then achieve a high degree of governance of their corporate resources.

Apache Oozie is now enabled on ESP clusters. To access the Oozie web UI, users should enable [tunneling](../hdinsight-linux-ambari-ssh-tunnel.md).

## Next steps

* [Plan for HDInsight clusters with ESP](apache-domain-joined-architecture.md)
* [Configure HDInsight clusters with ESP](apache-domain-joined-configure.md)
* [Manage HDInsight clusters with ESP](apache-domain-joined-manage.md)
