---
title: Azure services that support Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn about which Azure services integrate with Azure Data Lake Storage Gen2
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 04/07/2020
ms.author: normesta
ms.reviewer: stewu
---

# Azure services that support Azure Data Lake Storage Gen2

You can use Azure services to ingest data, perform analytics, and create visual representations. This article provides a list of supported Azure services, discloses their level of support, and provides you with links to articles that help you to use these services with Azure Data Lake Storage Gen2.

## Supported Azure services

This table lists the Azure services that you can use with Azure Data Lake Storage Gen2. The items that appear in these tables will change over time as support continues to expand.

> [!NOTE]
> Support level refers only to how the service is supported with Data Lake Storage Gen 2.

|Azure service |Support level |Related articles |
|---------------|-------------------|---|
|Azure Data Factory|Generally available|[Load data into Azure Data Lake Storage Gen2 with Azure Data Factory](https://docs.microsoft.com/azure/data-factory/load-azure-data-lake-storage-gen2?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Azure Databricks|Generally available|[Use with Azure Databricks](https://docs.azuredatabricks.net/data/data-sources/azure/azure-datalake-gen2.html) <br> [Quickstart: Analyze data in Azure Data Lake Storage Gen2 by using Azure Databricks](data-lake-storage-quickstart-create-databricks-account.md) <br>[Tutorial: Extract, transform, and load data by using Azure Databricks](https://docs.microsoft.com/azure/azure-databricks/databricks-extract-load-sql-data-warehouse) <br>[Tutorial: Access Data Lake Storage Gen2 data with Azure Databricks using Spark](data-lake-storage-use-databricks-spark.md)|
|Azure Event Hub|Generally available|[Capture events through Azure Event Hubs in Azure Blob Storage or Azure Data Lake Storage](https://docs.microsoft.com/azure/event-hubs/event-hubs-capture-overview)|
|Azure Event Grid|Generally available|[Tutorial: Implement the data lake capture pattern to update a Databricks Delta table](data-lake-storage-events.md)|
|Azure Logic Apps|Generally available|[Overview - What is Azure Logic Apps?](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview)|
|Azure Machine Learning|Generally available|[Access data in Azure storage services](https://docs.microsoft.com/azure/machine-learning/how-to-access-data)|
|Azure Stream Analytics|Generally available|[Quickstart: Create a Stream Analytics job by using the Azure portal](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-quick-create-portal) <br> [Egress to Azure Data Lake Gen2](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-define-outputs#blob-storage-and-azure-data-lake-gen2)|
|Data Box|Generally available|[Use Azure Data Box to migrate data from an on-premises HDFS store to Azure Storage](data-lake-storage-migrate-on-premises-hdfs-cluster.md)|
|HDInsight |Generally available|[Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)<br>[Using the HDFS CLI with Data Lake Storage Gen2](data-lake-storage-use-hdfs-data-lake-storage.md) <br>[Tutorial: Extract, transform, and load data by using Apache Hive on Azure HDInsight](data-lake-storage-tutorial-extract-transform-load-hive.md)|
|IoT Hub |Generally available|[Use IoT Hub message routing to send device-to-cloud messages to different endpoints](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c)|
|Power BI|Generally available|[Analyze data in Data Lake Storage Gen2 using Power BI](https://docs.microsoft.com/power-query/connectors/datalakestorage)|
|SQL Data Warehouse|Generally available|[Use with Azure SQL Data Warehouse](https://docs.microsoft.com/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#azure-sql-data-warehouse-polybase)|
|SQL Server Integration Services (SSIS)|Generally available|[Azure Storage connection manager](https://docs.microsoft.com/sql/integration-services/connection-manager/azure-storage-connection-manager?view=sql-server-2017)|
|Azure Cognitive Search|Preview|[Index and search Azure Data Lake Storage Gen2 documents (preview)](https://docs.microsoft.com/azure/search/search-howto-index-azure-data-lake-storage)|
|Azure Data Explorer|Preview|[Query data in Azure Data Lake using Azure Data Explorer](https://docs.microsoft.com/azure/data-explorer/data-lake-query-data)|
|Azure Content Delivery Network|Not yet supported|[Index and search Azure Data Lake Storage Gen2 documents (preview)](https://docs.microsoft.com/azure/cdn/cdn-overview)|


## See also

- [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md)
- [Blob storage features available in Azure Data Lake Storage Gen2](data-lake-storage-supported-blob-storage-features.md)
- [Open source platforms that support Azure Data Lake Storage Gen2](data-lake-storage-supported-open-source-platforms.md)
- [Multi-protocol access on Azure Data Lake Storage](data-lake-storage-multi-protocol-access.md)