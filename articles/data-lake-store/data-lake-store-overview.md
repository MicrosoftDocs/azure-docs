<properties 
   pageTitle="Overview of Azure Data Lake Store | Azure" 
   description="Understand what is Azure Data Lake Store and the value it provides over other data stores" 
   services="data-lake-store" 
   documentationCenter="" 
   authors="nitinme" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="10/27/2015"
   ms.author="nitinme"/>

# Overview of Azure Data Lake Store

Azure Data Lake Store is an enterprise-wide hyper-scale repository for big data analytic workloads that stores every type of data regardless of its size, structure, or how fast it is ingested. Azure Data Lake Store can be accessed using the WebHDFS-compatible APIs. It is specifically designed to enable analytics on the stored data. Out of the box, it includes all the enterprise-grade capabilities—security, performance, throughput, manageability, scalability, reliability, availability—essential for real-world enterprise use.


![Ambari web UI bar with ops selected](./media/data-lake-store-overview/data-lake-store-concept.png)

Some of the key capabilities of the Azure Data Lake include the following.


### HDFS for the Cloud

Azure Data Lake Store exposes the WebHDFS interface making it a HDFS-compatible file system in the cloud. Data stored in Data Lake Store can be easily analyzed using Hadoop analytic frameworks such as MapReduce or Hive. Microsoft Azure HDInsight clusters can be provisioned and configured to directly access data stored in Data Lake Store. 

### Ease of provisioning

Azure Data Lake Store can be provisioned through the Azure Preview Portal, Azure PowerShell, and the .NET SDK.

### Unlimited storage, petabyte files, and massive throughput

Azure Data Lake Store has unbounded scale with no limits to the amount of data that can be stored in a single account. Data Lake Store does not impose any limits on the file sizes and stores data for indefinite period of time.

Data Lake Store is built for running large analytic systems that require massive throughput to query and analyze petabytes of data. It can handle high volumes of small writes at low latency making it optimized for near real-time scenarios like website analytics, Internet of Things (IoT), analytics from sensors, etc.

### Enterprise-ready: Highly-available and secure

Azure Data Lake Store also provides data reliability by replicating your data assets to guard against any unexpected failures. This enables enterprises to factor Azure Data Lake in their solutions as an important part of their existing data platform.

Data Lake Store also provides enterprise-grade security for the stored data. For more information, see [Securing data in Azure Data Lake Store](#DataLakeStoreSecurity).


### Data in native format

Azure Data Lake Store can store any data in their native format, as is, without requiring any filtering or transformations. Data Lake Store does not require a schema to be defined before the data is loaded, leaving it up to the individual analytic framework to interpret the data and define a schema at the time of the analysis. Being able to store files of arbitrary sizes and formats makes it possible for Data Lake Store to handle structured, semi-structured, and unstructured data.


## <a name="DataLakeStoreSecurity"></a>Securing data in Azure Data Lake Store

Azure Data Lake Store uses Azure Active Directory, encryption, and access control lists (ACLs) to manage access to your data.

| Feature                                 | Description 							 |
|-----------------------------------------|------------------------------------------|
| Integration with Azure Active Directory | Azure Data Lake Store integrates with Azure Active Directory (AAD) for identity and access management for all the data stored in Azure Data Lake Store. As a result of the integration, Azure Data Lake benefits from all AAD features including multi-factor authentication, conditional access, role-based access control, application usage monitoring, security monitoring and alerting, etc. |
| Encryption                              | Azure Data Lake Store encrypts all data flowing to and from public networks. Azure Data Lake Store also provides transparent server-side encryption.|
| Access control                          | Azure Data Lake Store provides file and folder level access control by supporting POSIX-style permissions exposed by the WebHDFS protocol.|
| Authentication                          | Azure Data Lake Store supports OAuth 2.0 for authentication with WebHDFS protocol.|

For instructions on how to secure data in Data Lake Store, see [Securing data in Azure Data Lake Store](data-lake-store-secure-data.md).

## Applications compatible with Azure Data Lake

See [Applications and services compatible with Azure Data Lake](data-lake-store-compatible-oss-other-applications.md) for a list of open source applications, Microsoft applications/services, and other third-party applications that can be used with Azure Data Lake. 

## What is Azure Data Lake Store file system (adl://)?

The Azure Data Lake Store is a Hadoop file system compatible with Hadoop Distributed File System (HDFS) and works with the Hadoop ecosystem. As a result, the existing applications or services that use the WebHDFS API can easily integrate with Data Lake Store. Data Lake Store has contributed changes to the WebHDFS API to support OAuth 2.0 open standard authorization protocol along with several other enhancements. 

Data Lake Store can also be accessed via the new filesystem, the AzureDataLakeFilesystem (adl://), in Hadoop environments and from Java applications. Applications and services that use adl:// are able to take advantage of further performance optimization that are not currently available in WebHDFS. As a result, Data Lake Store gives you the flexibility to either avail the best performance with the recommended option of using adl:// or maintain existing code by continuing to use the WebHDFS API directly. Azure HDInsight service fully leverages the AzureDataLakeFilesystem to provide the best performance on Data Lake Store.


## How do I start using Azure Data Lake Store?

See [Get Started with Data Lake Store using the Azure Preview Porta](data-lake-store-get-started-portal.md), on how to provision an Azure Data Lake account using the Azure Preview portal. Once you have provisioned Azure Data Lake, you can learn how to use big data offerings such as Azure Data Lake Analytics or Azure HDInsight with Data Lake Store. You can also create a .NET application to create an Azure Data Lake Store account and perform operations such as upload data, download data, etc.

- [Get Started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md)
- [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)
- [Get started with Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)  
