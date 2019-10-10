---
title: Integrate Azure Data Lake Storage Gen2 with other services | Microsoft Docs
description: Understand how Azure Data Lake Storage Gen1 integrates with other Azure services.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 09/30/2019
ms.author: normesta

---
# Integrate Azure Data Lake Storage Gen2 with other services

This table describes which services are supported

| Azure service | Supported | Guidance |
|---------------|-----------|-------------------|
|Power BI|  :heavy_check_mark: | :small_blue_diamond: [Analyze data in Data Lake Storage Gen2 using Power BI](data-lake-storage-use-power-bi.md) | 
|SQL Server Integration Services (SSIS) |  :heavy_check_mark:  | <li>[Use Data Lake Storage Gen2 with SSIS](https://docs.microsoft.com/sql/integration-services/connection-manager/azure-data-lake-store-connection-manager)|
|SQL Data Warehouse | :heavy_check_mark:  | <li>[Use with Azure SQL Data Warehouse](https://docs.microsoft.com/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#azure-sql-data-warehouse-polybase)|
|Azure Event Hubs capture|  :heavy_check_mark:  | <li>[Use Data Lake Storage Gen2 with Azure Event Hubs](data-lake-store-archive-eventhub-capture.md)|
|HDInsight clusters |  :heavy_check_mark:  | <li>[Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)<br><li>[Using the HDFS CLI with Data Lake Storage Gen2](data-lake-storage-use-hdfs-data-lake-storage.md) <br><li>[Tutorial: Extract, transform, and load data by using Apache Hive on Azure HDInsight](data-lake-storage-tutorial-extract-transform-load-hive.md) |
|Azure Databricks | :heavy_check_mark:| <li>[Use with Azure Databricks](https://docs.azuredatabricks.net/data/data-sources/azure/azure-datalake-gen2.html) <br><li> [Quickstart: Analyze data in Azure Data Lake Storage Gen2 by using Azure Databricks](data-lake-storage-quickstart-create-databricks-account.md) <br><li>[Tutorial: Extract, transform, and load data by using Azure Databricks](https://docs.microsoft.com/azure/azure-databricks/databricks-extract-load-sql-data-warehouse) <br><li> [Tutorial: Access Data Lake Storage Gen2 data with Azure Databricks using Spark](data-lake-storage-use-databricks-spark.md) <br><li>[Tutorial: Implement the data lake capture pattern to update a Databricks Delta table](data-lake-storage-events.md)|
|Azure Stream Analytics| :heavy_check_mark: | <li>[Egress to Azure Data Lake Gen2](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-define-outputs#blob-storage-and-azure-data-lake-gen2) |
|HDInsight clusters| :heavy_check_mark:| Url|
|Azure Databricks| :heavy_check_mark: | Url|
|IOT Hub | :heavy_check_mark: | <li>[Use IoT Hub message routing to send device-to-cloud messages to different endpoints](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c)]|
|DataBox| Yes | Url|
|Azure Search | :heavy_check_mark: | <li>[Searching Blob storage with Azure Search](https://docs.microsoft.com/azure/search/search-blob-storage-integration)]|
|Azure Logic Apps | :heavy_check_mark: | <li>[Overview - What is Azure Logic Apps?](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview)|
|Something else | :no_entry_sign: | Not yet supported | 
|Something else # 2 | :no_entry_sign: | Not yet supported | 
|Something else # 3 | :no_entry_sign: | No plans to support | 


