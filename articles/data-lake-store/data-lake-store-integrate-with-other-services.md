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
   ms.date="04/13/2016"
   ms.author="nitinme"/>

# Integrating Data Lake Store with other Azure Services

Azure Data Lake Store can be used in conjunction with other Azure services to enable a wider range of scenarios. The following article lists the services that Data Lake Store can be integrated with.

## Use Data Lake Store with Azure HDInsight

You can provision an [Azure HDInsight](https://azure.microsoft.com/documentation/learning-paths/hdinsight-self-guided-hadoop-training/) cluster that uses Data Lake Store as the HDFS-compliant storage. For this release, for Hadoop and Storm clusters on Windows and Linux, you can use Data Lake Store only as an additional storage. Such clusters still use Azure Storage (WASB) as the default storage. However, for HBase clusters on Windows and Linux, you can use Data Lake Store as the default storage, or additional storage, or both.

For instructions on how to provision an HDInsight cluster with Data Lake Store, see:

* [Provision an HDInsight cluster with Data Lake Store using Azure Portal](data-lake-store-hdinsight-hadoop-use-portal.md)
* [Provision an HDInsight cluster with Data Lake Store using Azure PowerShell](data-lake-store-hdinsight-hadoop-use-powershell.md)


## Use Data Lake Store with Azure Data Lake Analytics

[Azure Data Lake Analytics](../data-lake-analytics/data-lake-analytics-overview.md) enables you to work with Big Data at cloud scale. It dynamically provisions resources and lets you do analytics on terabytes or even exabytes of data that can be stored in a number of supported data sources, one of them being Data Lake Store. Data Lake Analytics is specially optimized to work with Azure Data Lake Store - providing the highest level of performance, throughput, and parallelization for you big data workloads.

For instructions on how to use Data Lake Analytics with Data Lake Store, see [Get Started with Data Lake Analytics using Data Lake Store](../data-lake-analytics/data-lake-analytics-get-started-portal.md).


## Use Data Lake Store with Azure Data Factory

You can use [Azure Data Factory](https://azure.microsoft.com/services/data-factory/) to ingest data from Azure tables, Azure SQL Database, Azure SQL DataWarehouse, Azure Storage Blobs, and on-premises databases. Being a first class citizen in the Azure ecosystem, Azure Data Factory can be used to orchestrate the ingestion of data from these source to Azure Data Lake Store.

For instructions on how to use Azure Data Factory with Data Lake Store, see [Move data to and from Data Lake Store using Data Factory](../data-factory/data-factory-azure-datalake-connector.md).

## Copy data from Azure Storage Blobs into Data Lake Store

Azure Data Lake Store provides a command-line tool, AdlCopy, that enables you to copy data from Azure Blob Storage into a Data Lake Store account. For more information, see [Copy data from Azure Storage Blobs to Data Lake Store](data-lake-store-copy-data-azure-storage-blob.md).

## Copy data between Azure SQL Database and Data Lake Store

You can use Apache Sqoop to import and export data between Azure SQL Database and Data Lake Store. For more information, see [Copy data between Data Lake Store and Azure SQL database using Sqoop](data-lake-store-data-transfer-sql-sqoop.md).


## See also

- [Overview of Azure Data Lake Store](data-lake-store-overview.md)
- [Get Started with Data Lake Store using Portal](data-lake-store-get-started-portal.md)
- [Get started with Data Lake Store using PowerShell](data-lake-store-get-started-powershell.md)  
