---
title: Azure services that support Azure Data Lake Storage Gen2
titleSuffix: Azure Storage
description: Learn about which Azure services integrate with Azure Data Lake Storage Gen2
author: normesta

ms.service: azure-data-lake-storage
ms.topic: conceptual
ms.date: 03/09/2023
ms.author: normesta
---

# Azure services that support Azure Data Lake Storage Gen2

You can use Azure services to ingest data, perform analytics, and create visual representations. This article provides a list of supported Azure services, discloses their level of support, and provides you with links to articles that help you to use these services with Azure Data Lake Storage Gen2.

## Supported Azure services

This table lists the Azure services that you can use with Azure Data Lake Storage Gen2. The items that appear in these tables will change over time as support continues to expand.

> [!NOTE]
> Support level refers only to how the service is supported with Data Lake Storage Gen 2.

|Azure service |Support level |Microsoft Entra ID |Shared Key| Related articles |
|---------------|-------------------|---|---|---|
|Azure Data Factory|Generally available|Yes|Yes|<ul><li>[Load data into Azure Data Lake Storage Gen2 with Azure Data Factory](../../data-factory/load-azure-data-lake-storage-gen2.md?toc=/azure/storage/blobs/toc.json)</li></ul>|
|Azure Databricks|Generally available|Yes|Yes|<ul><li>[Use with Azure Databricks](/azure/databricks/data/data-sources/azure/azure-datalake-gen2)</li><br><li>[Tutorial: Extract, transform, and load data by using Azure Databricks](/azure/databricks/scenarios/databricks-extract-load-sql-data-warehouse)</li><br><li>[Tutorial: Access Data Lake Storage Gen2 data with Azure Databricks using Spark](data-lake-storage-use-databricks-spark.md)</li></ul>|
|Azure Event Hubs|Generally available|No|Yes|<ul><li>[Capture events through Azure Event Hubs in Azure Blob Storage or Azure Data Lake Storage](../../event-hubs/event-hubs-capture-overview.md)</li></ul>|
|Azure Event Grid|Generally available|Yes|Yes|<ul><li>[Tutorial: Implement the data lake capture pattern to update a Databricks Delta table](data-lake-storage-events.md)</li></ul>|
|Azure Logic Apps|Generally available|No|Yes|<ul><li>[Overview - What is Azure Logic Apps?](../../logic-apps/logic-apps-overview.md)</li></ul>|
|Azure Machine Learning|Generally available|Yes|Yes|<ul><li>[Access data in Azure storage services](../../machine-learning/how-to-access-data.md)</li></ul>|
|Azure Stream Analytics|Generally available|Yes|Yes|<ul><li>[Quickstart: Create a Stream Analytics job by using the Azure portal](../../stream-analytics/stream-analytics-quick-create-portal.md)</li><br><li>[Egress to Azure Data Lake Gen2](../../stream-analytics/stream-analytics-define-outputs.md)</li></ul>|
|Data Box|Generally available|No|Yes|<ul><li>[Use Azure Data Box to migrate data from an on-premises HDFS store to Azure Storage](data-lake-storage-migrate-on-premises-hdfs-cluster.md)</li></ul>|
|HDInsight |Generally available|Yes|Yes|<ul><li>[Azure Storage overview in HDInsight](../../hdinsight/overview-azure-storage.md)</li><br><li>[Use Azure storage with Azure HDInsight clusters](../../hdinsight/hdinsight-hadoop-use-blob-storage.md)</li><br><li>[Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](../../hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2.md)</li><br><li>[Using the HDFS CLI with Data Lake Storage Gen2](data-lake-storage-use-hdfs-data-lake-storage.md)</li><br><li>[Tutorial: Extract, transform, and load data by using Apache Hive on Azure HDInsight](data-lake-storage-tutorial-extract-transform-load-hive.md)</li></ul>|
|IoT Hub |Generally available|Yes|Yes|<ul><li>[Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../../iot-hub/iot-hub-devguide-messages-d2c.md)</li></ul>|
|Power BI|Generally available|Yes|Yes|<ul><li>[Analyze data in Data Lake Storage Gen2 using Power BI](/power-query/connectors/datalakestorage)</li></ul>|
|Azure Synapse Analytics (formerly SQL Data Warehouse)|Generally available|Yes|Yes|<ul><li>[Analyze data in a storage account](../../synapse-analytics/get-started-analyze-storage.md)</li></ul>|
|SQL Server Integration Services (SSIS)|Generally available|Yes|Yes|<ul><li>[Azure Storage connection manager](/sql/integration-services/connection-manager/azure-storage-connection-manager)</li></ul>|
|Azure Data Explorer|Generally available|Yes|Yes|<ul><li>[Query data in Azure Data Lake using Azure Data Explorer](/azure/data-explorer/data-lake-query-data)</li></ul>|
|Azure Cognitive Search|Generally available|Yes|Yes|<ul><li>[Index and search Azure Data Lake Storage Gen2 documents](../../search/search-howto-index-azure-data-lake-storage.md)</li></ul>|
|Azure SQL Managed Instance|Preview|No|Yes|<ul><li>[Data virtualization with Azure SQL Managed Instance](/azure/azure-sql/managed-instance/data-virtualization-overview)</li></ul>|


> [!TIP]
> To see how services organized into categories such as ingest, download, process, and visualize, see [Ingest, process, and analyze](./data-lake-storage-best-practices.md#ingest-process-and-analyze).

## See also

- [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md)
- [Blob Storage feature support in Azure Storage accounts](storage-feature-support-in-storage-accounts.md)
- [Open source platforms that support Azure Data Lake Storage Gen2](data-lake-storage-supported-open-source-platforms.md)
- [Multi-protocol access on Azure Data Lake Storage](data-lake-storage-multi-protocol-access.md)
- [Best practices for using Azure Data Lake Storage Gen2](data-lake-storage-best-practices.md)
