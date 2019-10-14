---
title: Integrating Azure Data Lake Storage Gen1 with other Azure Services | Microsoft Docs
description: Understand how Azure Data Lake Storage Gen1 integrates with other Azure services
documentationcenter: ''
services: data-lake-store
author: twooley
manager: mtillman
editor: cgronlun

ms.assetid: 48a5d1f4-3850-4c22-bbc4-6d1d394fba8a
ms.service: data-lake-store
ms.devlang: na
ms.topic: conceptual
ms.date: 05/29/2018
ms.author: twooley

---
# Integrating Azure Data Lake Storage Gen1 with other Azure services
Azure Data Lake Storage Gen1 can be used in conjunction with other Azure services to enable a wider range of scenarios. The following article lists the services that Data Lake Storage Gen1 can be integrated with.

## Use Data Lake Storage Gen1 with Azure HDInsight
You can provision an [Azure HDInsight](https://azure.microsoft.com/documentation/learning-paths/hdinsight-self-guided-hadoop-training/) cluster that uses Data Lake Storage Gen1 as the HDFS-compliant storage. For this release, for Hadoop and Storm clusters on Windows and Linux, you can use Data Lake Storage Gen1 only as an additional storage. Such clusters still use Azure Storage (WASB) as the default storage. However, for HBase clusters on Windows and Linux, you can use Data Lake Storage Gen1 as the default storage, or additional storage, or both.

For instructions on how to provision an HDInsight cluster with Data Lake Storage Gen1, see:

* [Provision an HDInsight cluster with Data Lake Storage Gen1 using Azure Portal](data-lake-store-hdinsight-hadoop-use-portal.md)
* [Provision an HDInsight cluster with Data Lake Storage Gen1 as default storage using Azure PowerShell](data-lake-store-hdinsight-hadoop-use-powershell-for-default-storage.md)
* [Provision an HDInsight cluster with Data Lake Storage Gen1 as additional storage using Azure PowerShell](data-lake-store-hdinsight-hadoop-use-powershell.md)

## Use Data Lake Storage Gen1 with Azure Data Lake Analytics
[Azure Data Lake Analytics](../data-lake-analytics/data-lake-analytics-overview.md) enables you to work with Big Data at cloud scale. It dynamically provisions resources and lets you do analytics on terabytes or even exabytes of data that can be stored in a number of supported data sources, one of them being Data Lake Storage Gen1. Data Lake Analytics is specially optimized to work with Data Lake Storage Gen1 - providing the highest level of performance, throughput, and parallelization for you big data workloads.

For instructions on how to use Data Lake Analytics with Data Lake Storage Gen1, see [Get Started with Data Lake Analytics using Data Lake Storage Gen1](../data-lake-analytics/data-lake-analytics-get-started-portal.md).

## Use Data Lake Storage Gen1 with Azure Data Factory
You can use [Azure Data Factory](https://azure.microsoft.com/services/data-factory/) to ingest data from Azure tables, Azure SQL Database, Azure SQL DataWarehouse, Azure Storage Blobs, and on-premises databases. Being a first class citizen in the Azure ecosystem, Azure Data Factory can be used to orchestrate the ingestion of data from these source to Data Lake Storage Gen1.

For instructions on how to use Azure Data Factory with Data Lake Storage Gen1, see [Move data to and from Data Lake Storage Gen1 using Data Factory](../data-factory/connector-azure-data-lake-store.md).

## Copy data from Azure Storage Blobs into Data Lake Storage Gen1
Azure Data Lake Storage Gen1 provides a command-line tool, AdlCopy, that enables you to copy data from Azure Blob Storage into a Data Lake Storage Gen1 account. For more information, see [Copy data from Azure Storage Blobs to Data Lake Storage Gen1](data-lake-store-copy-data-azure-storage-blob.md).

## Copy data between Azure SQL Database and Data Lake Storage Gen1
You can use Apache Sqoop to import and export data between Azure SQL Database and Data Lake Storage Gen1. For more information, see [Copy data between Data Lake Storage Gen1 and Azure SQL database using Sqoop](data-lake-store-data-transfer-sql-sqoop.md).

## Use Data Lake Storage Gen1 with Stream Analytics
You can use Data Lake Storage Gen1 as one of the outputs to store data streamed using Azure Stream Analytics. For more information, see [Stream data from Azure Storage Blob into Data Lake Storage Gen1 using Azure Stream Analytics](data-lake-store-stream-analytics.md).

## Use Data Lake Storage Gen1 with Power BI
You can use Power BI to import data from a Data Lake Storage Gen1 account to analyze and visualize the data. For more information, see [Analyze data in Data Lake Storage Gen1 using Power BI](data-lake-store-power-bi.md).

## Use Data Lake Storage Gen1 with Data Catalog
You can register data from Data Lake Storage Gen1 into the Azure Data Catalog to make the data discoverable throughout the organization. For more information see [Register data from Data Lake Storage Gen1 in Azure Data Catalog](data-lake-store-with-data-catalog.md).

## Use Data Lake Storage Gen1 with SQL Server Integration Services (SSIS)
You can use the Data Lake Storage Gen1 connection manager in SSIS to connect an SSIS package with Data Lake Storage Gen1. For more information, see [Use Data Lake Storage Gen1 with SSIS](https://docs.microsoft.com/sql/integration-services/connection-manager/azure-data-lake-store-connection-manager).

## Use Data Lake Storage Gen1 with SQL Data Warehouse
You can use PolyBase to load data from Data Lake Storage Gen1 into SQL Data Warehouse. For more information see [Use Data Lake Storage Gen1 with SQL Data Warehouse](../sql-data-warehouse/sql-data-warehouse-load-from-azure-data-lake-store.md).

## Use Data Lake Storage Gen1 with Azure Event Hubs
You can use Azure Data Lake Storage Gen1 to archive and capture data received by Azure Event Hubs. For more information see [Use Data Lake Storage Gen1 with Azure Event Hubs](data-lake-store-archive-eventhub-capture.md).

## See also
* [Overview of Azure Data Lake Storage Gen1](data-lake-store-overview.md)
* [Get Started with Data Lake Storage Gen1 using Portal](data-lake-store-get-started-portal.md)
* [Get started with Data Lake Storage Gen1 using PowerShell](data-lake-store-get-started-powershell.md)  

