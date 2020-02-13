---
title: Integrate Azure Data Lake Storage with Azure services | Microsoft Docs
description: Learn about which Azure services integrate with Azure Data Lake Storage Gen2.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 11/01/2019
ms.author: normesta

---
# Integrate Azure Data Lake Storage with Azure services

You can use Azure services to ingest data, perform analytics, and create visual representations. This article provides a list of supported Azure services and provides you with links to articles that help you to use these services with Azure Data Lake Storage Gen2.

## Azure services that support Azure Data Lake Storage Gen2

The following table lists the Azure services that support Azure Data Lake Storage Gen2.

| Azure service |  Related articles |
|---------------|-------------------|
|Azure Data Factory | [Load data into Azure Data Lake Storage Gen2 with Azure Data Factory](https://docs.microsoft.com/azure/data-factory/load-azure-data-lake-storage-gen2?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Azure Databricks | [Use with Azure Databricks](https://docs.azuredatabricks.net/data/data-sources/azure/azure-datalake-gen2.html) <br> [Quickstart: Analyze data in Azure Data Lake Storage Gen2 by using Azure Databricks](data-lake-storage-quickstart-create-databricks-account.md) <br>[Tutorial: Extract, transform, and load data by using Azure Databricks](https://docs.microsoft.com/azure/azure-databricks/databricks-extract-load-sql-data-warehouse) <br>[Tutorial: Access Data Lake Storage Gen2 data with Azure Databricks using Spark](data-lake-storage-use-databricks-spark.md) |
|Azure Event Hubs capture| [Capture events through Azure Event Hubs in Azure Blob Storage or Azure Data Lake Storage](https://docs.microsoft.com/azure/event-hubs/event-hubs-capture-overview)|
|Azure Logic Apps | [Overview - What is Azure Logic Apps?](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview)|
|Azure Machine Learning|[Access data in Azure storage services](https://docs.microsoft.com/azure/machine-learning/how-to-access-data)|
|Azure Cognitive Search | [Index and search Azure Data Lake Storage Gen2 documents (preview)](https://docs.microsoft.com/azure/search/search-howto-index-azure-data-lake-storage)|
|Azure Stream Analytics| [Quickstart: Create a Stream Analytics job by using the Azure portal](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-quick-create-portal) <br> [Egress to Azure Data Lake Gen2](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-define-outputs#blob-storage-and-azure-data-lake-gen2) |
|Data Box|  [Use Azure Data Box to migrate data from an on-premises HDFS store to Azure Storage](data-lake-storage-migrate-on-premises-hdfs-cluster.md)|
|HDInsight | [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)<br>[Using the HDFS CLI with Data Lake Storage Gen2](data-lake-storage-use-hdfs-data-lake-storage.md) <br>[Tutorial: Extract, transform, and load data by using Apache Hive on Azure HDInsight](data-lake-storage-tutorial-extract-transform-load-hive.md) |
|IoT Hub | [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c)|
|Power BI|  [Analyze data in Data Lake Storage Gen2 using Power BI](data-lake-storage-use-power-bi.md) |
|SQL Data Warehouse | [Use with Azure SQL Data Warehouse](https://docs.microsoft.com/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#azure-sql-data-warehouse-polybase)|
|SQL Server Integration Services (SSIS) | [Azure Storage connection manager](https://docs.microsoft.com/sql/integration-services/connection-manager/azure-storage-connection-manager?view=sql-server-2017)|

## Next steps

- Learn more about which tools you can use to process data in your data lake. See [Using Azure Data Lake Storage Gen2 for big data requirements](data-lake-storage-data-scenarios.md).

- Learn more about Data Lake Storage Gen2, and how to get started with it. See [Introduction to Azure Data Lake Storage Gen2](data-lake-storage-introduction.md)
