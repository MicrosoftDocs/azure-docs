<properties
   	pageTitle="Secure HDInsight Overview| Microsoft Azure"
   	description="Learn ...."
   	services="hdinsight"
   	documentationCenter=""
   	authors="mumian"
   	manager="paulettm"
   	editor="cgronlun"
	tags="azure-portal"/>

<tags
   	ms.service="hdinsight"
   	ms.devlang="na"
   	ms.topic="hero-article"
   	ms.tgt_pltfrm="na"
   	ms.workload="big-data"
   	ms.date="09/08/2016"
   	ms.author="jgao"/>

# Introduce Secure HDInsight(Preview)

The HDInsight cluster until today supported only a single user local admin mode with minimal auditing and authorization. Using the enterprise grade security features in HDInsight, you can create a secure HDInsight cluster joined to an Active Directory domain, configure a list of employees from the enterprise who can authenticate (through Azure Active Directory or through on premise Active Directory via [Express Route](https://azure.microsoft.com/services/expressroute/)) to log on to HDInsight cluster, configure role based access control for HiveServer2 security using Apache Ranger, and audit the data access by employees, and any changes done to access control policies, thus achieving a high degree of governance of your corporate resources.

[AZURE.NOTE]> the new features described in this preview are available only on Linux-based HDInsight clusters for HiveServer2 workload. The other workloads, such as HBase, Spark, Storm and Kafka, will be enabled in future releases. 

## Benefits

Enterprise Security contains four big pillars – Authentication, Authorization, Encryption and Auditing.

###Authentication

With this public preview, an enterprise admin can create a secure HDInsight cluster in a virtual network. The nodes of the HDInsight cluster will be joined to the domain managed by the enterprise. This is achieved through use of [Azure Active Directory Domain Services](https://technet.microsoft.com/library/cc770946%28v=ws.10%29.aspx?f=255&MSPPError=-2147217396). The HDInsight cluster can be configured with either Azure Storage Blob or Azure Data Lake Storage as the data stores for HDFS. All the nodes in the cluster are joined to a domain that the enterprise manages. With this setup, the enterprise employees can log on to the cluster nodes using their domain credentials. They can also use their domain credentials to authenticate with other approved endpoints like Hue, Ambari Views, ODBC tools, PowerShell and REST APIs to interact with the cluster. The admin has full control over limiting the number of users interacting with the cluster via these endpoints.

###Authorization

A best practice followed by most enterprises is that not every employee has access to all enterprise resources. Likewise, with this release, the admin can define role based access control policies for the cluster resources. For example, the admin can configure [Apache Ranger](http://hortonworks.com/apache/ranger/) to set access control policies for the HiveServer2. This functionality ensures that employees will be able to access only as much data as they need to be successful in their jobs. The admin also has complete control to restrict access to only some employees for logging in the cluster using SSH tools.

###Encryption

Protecting data is important for meeting organizational security and compliance requirements, and along with restricting access to data from unauthorized employees, it should also be secured by encrypting it. Both the data stores for HDInsight clusters, Azure Storage Blob, and Azure Data Lake Storage support encryption of data . See [Azure Storage Blob supports encryption(https://azure.microsoft.com/documentation/articles/storage-service-encryption/]). Secure HDInsight clusters will rely on the server side encryption of data at rest capability.

###Auditing

Along with protecting the HDInsight cluster resources from unauthorized users, and securing the data, auditing of all access to the cluster resources, and the data is necessary to track unauthorized or unintentional access of the resources. With this preview, the admin can view and report all access to the HDInsight cluster resources and data. The admin can also view and report all changes to the access control policies done in Apache Ranger supported endpoints. A secure HDInsight cluster uses [Apache Solr](http://hortonworks.com/apache/solr/) to record and search audit logs.


## Configure Secure HDInsight environment

See [Configure Secure HDInsight](hdinsight-secure-setup.md)

## Run a Hive job 

See [Run a Hive job using Secure HDInsight](hdinsight-secure-run-hive.md)

