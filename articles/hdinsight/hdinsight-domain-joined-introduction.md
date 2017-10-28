---
title: Hadoop security - domain-joined HDInsight clusters - Azure | Microsoft Docs
description: Learn ....
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
ms.date: 10/31/2016
ms.author: saurinsh

---
# An introduction to Hadoop security with domain-joined HDInsight clusters (Preview)

Azure HDInsight until today supported only a single user local admin. This worked great for smaller application teams or departments. As Hadoop based workloads gained more popularity in the enterprise sector, the need for enterprise grade capabilities like active directory based authentication, multi-user support, and role based access control became increasingly important. Using Domain-joined HDInsight clusters, you can create an HDInsight cluster joined to an Active Directory domain, configure a list of employees from the enterprise who can authenticate through Azure Active Directory to log on to HDInsight cluster. Anyone outside the enterprise cannot log on or access the HDInsight cluster. The enterprise admin can configure role based access control for Hive security using [Apache Ranger](http://hortonworks.com/apache/ranger/), thus restricting access to data to only as much as needed. Finally, the admin can audit the data access by employees, and any changes done to access control policies, thus achieving a high degree of governance of their corporate resources.

> [!NOTE]
> The new features described in this preview are available only on Linux-based HDInsight clusters for Hive workload. The other workloads, such as HBase, Spark, Storm and Kafka, will be enabled in future releases.

> [!IMPORTANT]
> Oozie is not enabled on domain-joined HDInsight.

## Benefits
Enterprise Security contains four big pillars – Perimeter Security, Authentication, Authorization, and Encryption.

![Domain Joined HDInsight clusters benefits pillars](./media/hdinsight-domain-joined-introduction/hdinsight-domain-joined-four-pillars.png).

### Perimeter Security
Perimeter security in HDInsight is achieved using virtual networks and Gateway service. Today, an enterprise admin can create an HDInsight cluster inside a virtual network and use Network Security Groups (inbound or outbound firewall rules) to restrict access to the virtual network. Only the IP addresses defined in the inbound firewall rules will be able to communicate with the HDInsight cluster, thus providing perimeter security. Another layer of perimeter security is achieved using Gateway service. The Gateway is the service which acts as first line of defense for any incoming request to the HDInsight cluster. It accepts the request, validates it and only then allows the request to pass to the other nodes in cluster, thus providing perimeter security to other name and data nodes in the cluster.

### Authentication
With this public preview, an enterprise admin can provision a Domain-joined HDInsight cluster, in a [virtual network](https://azure.microsoft.com/services/virtual-network/). The nodes of the HDInsight cluster will be joined to the domain managed by the enterprise. This is achieved through use of [Azure Active Directory Domain Services](../active-directory-domain-services/active-directory-ds-overview.md). All the nodes in the cluster are joined to a domain that the enterprise manages. With this setup, the enterprise employees can log on to the cluster nodes using their domain credentials. They can also use their domain credentials to authenticate with other approved endpoints like Hue, Ambari Views, ODBC, JDBC, PowerShell and REST APIs to interact with the cluster. The admin has full control over limiting the number of users interacting with the cluster via these endpoints.

### Authorization
A best practice followed by most enterprises is that not every employee has access to all enterprise resources. Likewise, with this release, the admin can define role based access control policies for the cluster resources. For example, the admin can configure [Apache Ranger](http://hortonworks.com/apache/ranger/) to set access control policies for Hive. This functionality ensures that employees will be able to access only as much data as they need to be successful in their jobs. SSH access to the cluster is also restricted only to the administrator.

### Auditing
Along with protecting the HDInsight cluster resources from unauthorized users, and securing the data, auditing of all access to the cluster resources, and the data is necessary to track unauthorized or unintentional access of the resources. With this preview, the admin can view and report all access to the HDInsight cluster resources and data. The admin can also view and report all changes to the access control policies done in Apache Ranger supported endpoints. A Domain-joined HDInsight cluster uses the familiar Apache Ranger UI to search audit logs. On the backend, Ranger uses [Apache Solr](http://hortonworks.com/apache/solr/) for storing and searching the logs.

### Encryption
Protecting data is important for meeting organizational security and compliance requirements, and along with restricting access to data from unauthorized employees, it should also be secured by encrypting it. Both the data stores for HDInsight clusters, Azure Storage Blob, and Azure Data Lake Storage support transparent server-side [encryption of data](../storage/storage-service-encryption.md) at rest. Secure HDInsight clusters will seamlessly work with this server side encryption of data at rest capability.

## Next steps
* For configuring a Domain-joined HDInsight cluster, see [Configure Domain-joined HDInsight clusters](hdinsight-domain-joined-configure.md).
* For managing a Domain-joined HDInsight clusters, see [Manage Domain-joined HDInsight clusters](hdinsight-domain-joined-manage.md).
* For configuring Hive policies and run Hive queries, see [Configure Hive policies for Domain-joined HDInsight clusters](hdinsight-domain-joined-run-hive.md).
* For running Hive queries using SSH on Domain-joined HDInsight clusters, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md#domainjoined).
