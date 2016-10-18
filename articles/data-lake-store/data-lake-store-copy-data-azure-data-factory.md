<properties
   pageTitle="Copy data into Data Lake Store using Azure Data Factory | Microsoft Azure"
   description="Use Azure Data Factory to copy data into Data Lake Store"
   services="data-lake-store"
   documentationCenter=""
   authors="nitinme"
   manager="jhubbard"
   editor="cgronlun"/>

<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="10/19/2016"
   ms.author="nitinme"/>

# Use Azure Data Factory to copy data into Data Lake Store

> [AZURE.SELECTOR]
- [Using Azure Data Factory](data-lake-store-copy-data-azure-data-factory.md)
- [Using DistCp](data-lake-store-copy-data-wasb-distcp.md)
- [Using AdlCopy](data-lake-store-copy-data-azure-storage-blob.md)

You can use [Azure Data Factory](https://azure.microsoft.com/services/data-factory/) to ingest data into Azure Data Lake Store from a variety of sources such as Azure tables, Azure SQL Database, Azure SQL DataWarehouse, Azure Storage Blobs, and on-premises databases. Being a first class citizen in the Azure ecosystem, Azure Data Factory can be used to orchestrate the ingestion of data from these source to Azure Data Lake Store.

For instructions on how to use Azure Data Factory with Data Lake Store, see [Move data to and from Data Lake Store using Data Factory](../data-factory/data-factory-azure-datalake-connector.md).

## Next steps

- [Secure data in Data Lake Store](data-lake-store-secure-data.md)
- [Use Azure Data Lake Analytics with Data Lake Store](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
- [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)
