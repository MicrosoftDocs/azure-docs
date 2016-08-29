<properties
   pageTitle="Integrating Data Lake Store with other Azure Services | Azure"
   description="Understand how Data Lake Store integrates with other Azure services"
   documentationCenter=""
   services="data-lake-store"
   authors="nitinme"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="08/02/2016"
   ms.author="nitinme"/>

# Integrating Data Lake Store with other Azure Services

Azure Data Lake Store can be used in conjunction with other Azure services to enable a wider range of scenarios. The following article lists the services that Data Lake Store can be integrated with.

## Use Data Lake Store with Azure HDInsight

You can provision an [Azure HDInsight](https://azure.microsoft.com/documentation/learning-paths/hdinsight-self-guided-hadoop-training/) cluster that uses Data Lake Store as the HDFS-compliant storage. For this release, for Hadoop and Storm clusters on Windows and Linux, you can use Data Lake Store only as an additional storage. Such clusters still use Azure Storage (WASB) as the default storage. However, for HBase clusters on Windows and Linux, you can use Data Lake Store as the default storage, or additional storage, or both.

For instructions on how to provision an HDInsight cluster with Data Lake Store, see:

* [Provision an HDInsight cluster with Data Lake Store using Azure Portal](data-lake-store-hdinsight-hadoop-use-portal.md)
* [Provision an HDInsight cluster with Data Lake Store using Azure PowerShell](data-lake-store-hdinsight-hadoop-use-powershell.md)

**Prefer videos?** Follow the links below to watch videos with instructions on how to use Data Lake Store with HDInsight clusters.

* [Create an HDInsight cluster with access to Data Lake Store](https://mix.office.com/watch/l93xri2yhtp2)
* Once the cluster is set up, [Access data in Data Lake Store using Hive and Pig scripts](https://mix.office.com/watch/1n9g5w0fiqv1q)


## Use Data Lake Store with Azure Data Lake Analytics

[Azure Data Lake Analytics](../data-lake-analytics/data-lake-analytics-overview.md) enables you to work with Big Data at cloud scale. It dynamically provisions resources and lets you do analytics on terabytes or even exabytes of data that can be stored in a number of supported data sources, one of them being Data Lake Store. Data Lake Analytics is specially optimized to work with Azure Data Lake Store - providing the highest level of performance, throughput, and parallelization for you big data workloads.

For instructions on how to use Data Lake Analytics with Data Lake Store, see [Get Started with Data Lake Analytics using Data Lake Store](../data-lake-analytics/data-lake-analytics-get-started-portal.md).

**Prefer videos?** Follow the links below to watch videos with instructions on how to use Data Lake Store with HDInsight clusters.

* [Connect Azure Data Lake Analytics to Azure Data Lake Store](https://mix.office.com/watch/qwji0dc9rx9k)
* [Access Azure Data Lake Store via Data Lake Analytics](https://mix.office.com/watch/1n0s45up381a8)


## Use Data Lake Store with Azure Data Factory

You can use [Azure Data Factory](https://azure.microsoft.com/services/data-factory/) to ingest data from Azure tables, Azure SQL Database, Azure SQL DataWarehouse, Azure Storage Blobs, and on-premises databases. Being a first class citizen in the Azure ecosystem, Azure Data Factory can be used to orchestrate the ingestion of data from these source to Azure Data Lake Store.

For instructions on how to use Azure Data Factory with Data Lake Store, see [Move data to and from Data Lake Store using Data Factory](../data-factory/data-factory-azure-datalake-connector.md).

**Videos again!** See [Data Orchestration using Azure Data Factory for Azure Data Lake Store](https://mix.office.com/watch/1oa7le7t2u4ka). 

## Copy data from Azure Storage Blobs into Data Lake Store

Azure Data Lake Store provides a command-line tool, AdlCopy, that enables you to copy data from Azure Blob Storage into a Data Lake Store account. For more information, see [Copy data from Azure Storage Blobs to Data Lake Store](data-lake-store-copy-data-azure-storage-blob.md).

## Copy data between Azure SQL Database and Data Lake Store

You can use Apache Sqoop to import and export data between Azure SQL Database and Data Lake Store. For more information, see [Copy data between Data Lake Store and Azure SQL database using Sqoop](data-lake-store-data-transfer-sql-sqoop.md).

**Watch this video** on [Using Apache Sqoop to move data between relational sources and Azure Data Lake Store](https://mix.office.com/watch/1butcdjxmu114).

## Use Data Lake Store with Stream Analytics

You can use Data Lake Store as one of the outputs to store data streamed using Azure Stream Analytics. For more information, see [Stream data from Azure Storage Blob into Data Lake Store using Azure Stream Analytics](data-lake-store-stream-analytics.md).

## Use Data Lake Store with Power BI

You can use Power BI to import data from a Data Lake Store account to analyze and visualize the data. For more information, see [Analyze data in Data Lake Store using Power BI](data-lake-store-power-bi.md).

## Use Data Lake Store with Data Catalog

You can register data from Data Lake Store into the Azure Data Catalog to make the data discoverable throughout the organization. For more information see [Register data from Data Lake Store in Azure Data Catalog](data-lake-store-with-data-catalog.md).


## See also

- [Overview of Azure Data Lake Store](data-lake-store-overview.md)
- [Get Started with Data Lake Store using Portal](data-lake-store-get-started-portal.md)
- [Get started with Data Lake Store using PowerShell](data-lake-store-get-started-powershell.md)  
