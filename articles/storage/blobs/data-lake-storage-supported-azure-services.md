---
title: Azure services that support Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn about which Azure services integrate with Azure Data Lake Storage Gen2
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: normesta
ms.reviewer: stewu
---

# Azure services that support Azure Data Lake Storage Gen2

You can use Azure services to ingest data, perform analytics, and create visual representations. This article provides a list of supported Azure services, discloses their level of support, and provides you with links to articles that help you to use these services with Azure Data Lake Storage Gen2.

## Supported Azure services

This table lists the Azure services that you can use with Azure Data Lake Storage Gen2. The items that appear in these tables will change over time as support continues to expand.

> [!NOTE]
> Support level refers only to how the service is supported with Data Lake Storage Gen 2.

|Azure service |Support level |Azure AD |Shared Key| Related articles |
|---------------|-------------------|---|---|---|
|Azure Data Factory|Generally available|Yes|Yes|[Load data into Azure Data Lake Storage Gen2 with Azure Data Factory](../../data-factory/load-azure-data-lake-storage-gen2.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Azure Databricks|Generally available|Yes|Yes|[Use with Azure Databricks](/azure/databricks/data/data-sources/azure/azure-datalake-gen2) <br> [Tutorial: Extract, transform, and load data by using Azure Databricks](/azure/databricks/scenarios/databricks-extract-load-sql-data-warehouse) <br>[Tutorial: Access Data Lake Storage Gen2 data with Azure Databricks using Spark](data-lake-storage-use-databricks-spark.md)|
|Azure Event Hub|Generally available|No|Yes|[Capture events through Azure Event Hubs in Azure Blob Storage or Azure Data Lake Storage](../../event-hubs/event-hubs-capture-overview.md)|
|Azure Event Grid|Generally available|Yes|Yes|[Tutorial: Implement the data lake capture pattern to update a Databricks Delta table](data-lake-storage-events.md)|
|Azure Logic Apps|Generally available|No|Yes|[Overview - What is Azure Logic Apps?](../../logic-apps/logic-apps-overview.md)|
|Azure Machine Learning|Generally available|Yes|Yes|[Access data in Azure storage services](../../machine-learning/how-to-access-data.md)|
|Azure Stream Analytics|Generally available|Yes|Yes|[Quickstart: Create a Stream Analytics job by using the Azure portal](../../stream-analytics/stream-analytics-quick-create-portal.md) <br> [Egress to Azure Data Lake Gen2](../../stream-analytics/stream-analytics-define-outputs.md)|
|Data Box|Generally available|No|Yes|[Use Azure Data Box to migrate data from an on-premises HDFS store to Azure Storage](data-lake-storage-migrate-on-premises-hdfs-cluster.md)|
|HDInsight |Generally available|Yes|Yes|[Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](../../hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2.md)<br>[Using the HDFS CLI with Data Lake Storage Gen2](data-lake-storage-use-hdfs-data-lake-storage.md) <br>[Tutorial: Extract, transform, and load data by using Apache Hive on Azure HDInsight](data-lake-storage-tutorial-extract-transform-load-hive.md)|
|IoT Hub |Generally available|Yes|Yes|[Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../../iot-hub/iot-hub-devguide-messages-d2c.md)|
|Power BI|Generally available|Yes|Yes|[Analyze data in Data Lake Storage Gen2 using Power BI](/power-query/connectors/datalakestorage)|
|Azure Synapse Analytics (formerly SQL Data Warehouse)|Generally available|Yes|Yes|[Analyze data in a storage account](../../synapse-analytics/get-started-analyze-storage.md)|
|SQL Server Integration Services (SSIS)|Generally available|Yes|Yes|[Azure Storage connection manager](/sql/integration-services/connection-manager/azure-storage-connection-manager)|
|Azure Data Explorer|Generally available|Yes|Yes|[Query data in Azure Data Lake using Azure Data Explorer](/azure/data-explorer/data-lake-query-data)|
|Azure Cognitive Search|Preview|Yes|Yes|[Index and search Azure Data Lake Storage Gen2 documents (preview)](../../search/search-howto-index-azure-data-lake-storage.md)|
|Azure Content Delivery Network|Not yet supported|Not applicable|Not applicable|[Index and search Azure Data Lake Storage Gen2 documents (preview)](../../cdn/cdn-overview.md)|
|Azure SQL Database|Not yet supported|Not applicable|Not applicable|[What is Azure SQL Database?](../../azure-sql/database/sql-database-paas-overview.md)|

## See also

- [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md)
- [Blob storage features available in Azure Data Lake Storage Gen2](data-lake-storage-supported-blob-storage-features.md)
- [Open source platforms that support Azure Data Lake Storage Gen2](data-lake-storage-supported-open-source-platforms.md)
- [Multi-protocol access on Azure Data Lake Storage](data-lake-storage-multi-protocol-access.md)