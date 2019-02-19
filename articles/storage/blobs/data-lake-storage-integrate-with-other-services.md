---
title: Integrating Azure Data Lake Storage Gen2 with other Azure Services | Microsoft Docs
description: Understand how Azure Data Lake Storage Gen2 integrates with other Azure services
documentationcenter: ''
services: storage
author: normesta
ms.component: data-lake-storage-gen2
ms.service: storage
ms.devlang: na
ms.topic: conceptual
ms.date: 01/04/2019
ms.author: nitinme
---

# Integrate Azure Data Lake Storage Gen2 with other Azure services

You can use Azure services to ingest, analyze, and visualize data in your Azure Data Lake Storage Gen2 storage account. Choose services that best suit that tasks that you are trying to accomplish.

## Ingest data into your data lake

These services help you populate your data lake with data.

### Azure Data Factory

You can use [Azure Data Factory](https://azure.microsoft.com/services/data-factory/) to ingest data from these sources:

* Azure tables
* Azure SQL databases
* Azure SQL DataWarehouse
* Azure Storage Blobs
* On-premises databases

See [Move data to and from Data Lake Storage Gen2 using Data Factory](../../data-factory/connector-azure-data-lake-store.md).

## Analyze and visualize data in your data lake

These services can use Data Lake Storage Gen2 as a storage endpoint.

### Azure HDInsight

You can provision an [Azure HDInsight](https://azure.microsoft.com/documentation/learning-paths/hdinsight-self-guided-hadoop-training/) cluster that uses Data Lake Storage Gen2 as the HDFS-compliant storage. For this release, for Hadoop and Storm clusters on Windows and Linux, you can use Data Lake Storage Gen2 only as an additional storage. Such clusters still use Azure Storage (WASB) as the default storage. However, for HBase clusters on Windows and Linux, you can use Data Lake Storage Gen2 as the default storage and as additional storage.

See [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2)

### Azure Data Lake Analytics

You can use [Azure Data Lake Analytics](../../data-lake-analytics/data-lake-analytics-overview.md) to work with Big Data at cloud scale. It dynamically provisions resources, and lets you analyze exabytes of data. Data Lake Analytics is optimized to use Data Lake Storage Gen2 as a data source. 

See [Get Started with Data Lake Analytics using Data Lake Storage Gen2](../../data-lake-analytics/data-lake-analytics-get-started-portal.md).

## Copy data to other repositories

Use these services to copy data from your data lake and place them into other repositories.

### SQL Data Warehouse

You can use PolyBase to load data from Data Lake Storage Gen2 into SQL Data Warehouse. For more information see [Use Data Lake Storage Gen2 with SQL Data Warehouse](../../sql-data-warehouse/sql-data-warehouse-load-from-azure-data-lake-store.md).

## See also

* [Overview of Azure Data Lake Storage Gen2](data-lake-storage-introduction.md)
* [Using Azure Data Lake Storage Gen2 for big data requirements](data-lake-storage-data-scenarios.md)
