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
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="08/02/2016"
   ms.author="nitinme"/>

# Overview of Azure Data Lake Store

Azure Data Lake Store is an enterprise-wide hyper-scale repository for big data analytic workloads. Azure Data Lake enables you to capture data of any size, type, and ingestion speed in one single place for operational and exploratory analytics.

> [AZURE.TIP] Use the [Data Lake Store learning path](https://azure.microsoft.com/documentation/learning-paths/data-lake-store-self-guided-training/) to start exploring the Azure Data Lake Store service.

Azure Data Lake Store can be accessed from Hadoop (available with HDInsight cluster) using the WebHDFS-compatible REST APIs. It is specifically designed to enable analytics on the stored data and is tuned for performance for data analytics scenarios. Out of the box, it includes all the enterprise-grade capabilities—security, manageability, scalability, reliability, and availability—essential for real-world enterprise use cases.


![Azure Data Lake](./media/data-lake-store-overview/data-lake-store-concept.png)

Some of the key capabilities of the Azure Data Lake include the following.

### Built for Hadoop

The Azure Data Lake store is an Apache Hadoop file system compatible with Hadoop Distributed File System (HDFS) and works with the Hadoop ecosystem.  Your existing HDInsight applications or services that use the WebHDFS API can easily integrate with Data Lake Store. Data Lake Store also exposes a WebHDFS-compatible REST interface for applications

Data stored in Data Lake Store can be easily analyzed using Hadoop analytic frameworks such as MapReduce or Hive. Microsoft Azure HDInsight clusters can be provisioned and configured to directly access data stored in Data Lake Store.

### Unlimited storage, petabyte files

Azure Data Lake Store provides unlimited storage and is suitable for storing a variety of data for analytics. It does not impose any limits on account sizes, file sizes, or the amount of data that can be stored in a data lake. Individual files can range from kilobyte to petabytes in size making it a great choice to store any type of data. Data is stored durably by making multiple copies and there is no limit on the duration of time for which the data can be stored in the data lake.

### Performance-tuned for big data analytics

Azure Data Lake Store is built for running large scale analytic systems that require massive throughput to query and analyze large amounts of data. The data lake spreads parts of a file over a number of individual storage servers. This improves the read throughput when reading the file in parallel for performing data analytics.


### Enterprise-ready: Highly-available and secure

Azure Data Lake Store provides industry-standard availability and reliability. Your data assets are stored durably by making redundant copies to guard against any unexpected failures. Enterprises can use Azure Data Lake in their solutions as an important part of their existing data platform.

Data Lake Store also provides enterprise-grade security for the stored data. For more information, see [Securing data in Azure Data Lake Store](#DataLakeStoreSecurity).


### All Data

Azure Data Lake Store can store any data in their native format, as is, without requiring any prior transformations. Data Lake Store does not require a schema to be defined before the data is loaded, leaving it up to the individual analytic framework to interpret the data and define a schema at the time of the analysis. Being able to store files of arbitrary sizes and formats makes it possible for Data Lake Store to handle structured, semi-structured, and unstructured data.

Azure Data Lake Store containers for data are essentially folders and files. You operate on the stored data using SDKs, Azure Portal, and Azure Powershell. As long as you put your data into the store using these interfaces and using the appropriate containers, you can store any type of data. Data Lake Store does not perform any special handling of data based on the type of data it stores.


## <a name="DataLakeStoreSecurity"></a>Securing data in Azure Data Lake Store

Azure Data Lake Store uses Azure Active Directory for authentication and access control lists (ACLs) to manage access to your data.

| Feature                                 | Description 							 |
|-----------------------------------------|------------------------------------------|
| Authentication | Azure Data Lake Store integrates with Azure Active Directory (AAD) for identity and access management for all the data stored in Azure Data Lake Store. As a result of the integration, Azure Data Lake benefits from all AAD features including multi-factor authentication, conditional access, role-based access control, application usage monitoring, security monitoring and alerting, etc. Azure Data Lake Store supports the OAuth 2.0 protocol for authentication with in the REST interface. |
| Access control                          | Azure Data Lake Store provides access control by supporting POSIX-style permissions exposed by the WebHDFS protocol. In the current release, ACLs can be enabled on the root folder, sub-folders, as well as individual files. The ACLs you apply to the root folder will also applicable to all the child folders/files as well.|

Want to learn more about securing data in Data Lake Store. Follow the links below.

* For instructions on how to secure data in Data Lake Store, see [Securing data in Azure Data Lake Store](data-lake-store-secure-data.md).
* Prefer videos? [Watch this video](https://mix.office.com/watch/1q2mgzh9nn5lx) on how to secure data stored in Data Lake Store.

## Applications compatible with Azure Data Lake Store

Azure Data Lake Store is compatible with most open source components in the Hadoop ecosystem. It also integrates nicely with other Azure services. This makes Data Lake Store a perfect option for your data storage needs. Follow the links below to learn more about how Data Lake Store can be used both with open source components as well as other Azure services.

* See [Applications and services compatible with Azure Data Lake Store](data-lake-store-compatible-oss-other-applications.md) for a list of open source applications interoperable with Data Lake Store.
* See [Integrating with other Azure services](data-lake-store-integrate-with-other-services.md) to understand how Data Lake Store can be used with other Azure services to enable a wider range of scenarios.
* See [Scenarios for using Data Lake Store](data-lake-store-data-scenarios.md) to learn how to use Data Lake Store in scenarios such as ingesting data, processing data, downloading data, and visualizing data.

## What is Azure Data Lake Store file system (adl://)?

Data Lake Store can be accessed via the new filesystem, the AzureDataLakeFilesystem (adl://), in Hadoop environments (available with HDInsight cluster). Applications and services that use adl:// are able to take advantage of further performance optimization that are not currently available in WebHDFS. As a result, Data Lake Store gives you the flexibility to either avail the best performance with the recommended option of using adl:// or maintain existing code by continuing to use the WebHDFS API directly. Azure HDInsight fully leverages the AzureDataLakeFilesystem to provide the best performance on Data Lake Store.

You can access your data in the Data Lake Store using `adl://<data_lake_store_name>.azuredatalakestore.net`. For more information on how to access the data in the Data Lake Store, see [View properties of the stored data](data-lake-store-get-started-portal.md#properties)

## How do I start using Azure Data Lake Store?

See [Get Started with Data Lake Store using the Azure Portal](data-lake-store-get-started-portal.md), on how to provision a Data Lake Store using the Azure Portal. Once you have provisioned Azure Data Lake, you can learn how to use big data offerings such as Azure Data Lake Analytics or Azure HDInsight with Data Lake Store. You can also create a .NET application to create an Azure Data Lake Store account and perform operations such as upload data, download data, etc.

- [Get Started with Azure Data Lake Analytics](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
- [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)
- [Get started with Azure Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)


## Data Lake Store videos

If you prefer watching videos to learn, Data Lake Store provides videos on a range of features.

* [Create an Azure Data Lake Store Account](https://mix.office.com/watch/1k1cycy4l4gen)
* [Use the Data Explorer to Manage Data in Azure Data Lake Store](https://mix.office.com/watch/icletrxrh6pc)
* [Connect Azure Data Lake Analytics to Azure Data Lake Store](https://mix.office.com/watch/qwji0dc9rx9k)
* [Access Azure Data Lake Store via Data Lake Analytics](https://mix.office.com/watch/1n0s45up381a8)
* [Connect Azure HDInsight to Azure Data Lake Store](https://mix.office.com/watch/l93xri2yhtp2)
* [Access Azure Data Lake Store via Hive and Pig](https://mix.office.com/watch/1n9g5w0fiqv1q)
* [Use DistCp (Hadoop Distributed Copy) to copy data to and from Azure Data Lake Store](https://mix.office.com/watch/1liuojvdx6sie)
* [Use Apache Sqoop to move data between relational sources and Azure Data Lake Store](https://mix.office.com/watch/1butcdjxmu114)
* [Data Orchestration using Azure Data Factory for Azure Data Lake Store](https://mix.office.com/watch/1oa7le7t2u4ka)
* [Securing Data in the Azure Data Lake Store](https://mix.office.com/watch/1q2mgzh9nn5lx)



