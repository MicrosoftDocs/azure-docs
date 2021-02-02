---
title: Use Azure Data Lake Storage Gen2 with Azure services
description: Learn how to use Azure Data Lake Storage Gen2 with Azure services.
author: normesta
ms.topic: how-to
ms.author: normesta
ms.date: 02/02/2021
ms.service: storage
ms.reviewer: stewu
ms.subservice: data-lake-storage-gen2
---

# Use Azure Data Lake Storage with Azure services

Some sort of explanation here about the organizing principals of content. We don't list tutorials here. All tutorials reside with their respective services with the exception of a few.

## List of how to articles

|Azure service |Support level |Azure AD |Shared Key| Related articles |
|---------------|-------------------|---|---|---|
|Azure Data Factory|Generally available|Yes|Yes|[Load data into Azure Data Lake Storage Gen2 with Azure Data Factory](../../data-factory/load-azure-data-lake-storage-gen2.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Azure Databricks|Generally available|Yes|Yes|[Use with Azure Databricks](https://docs.azuredatabricks.net/data/data-sources/azure/azure-datalake-gen2.html) <br> [Quickstart: Analyze data in Azure Data Lake Storage Gen2 by using Azure Databricks](data-lake-storage-quickstart-create-databricks-account.md) <br>[Tutorial: Extract, transform, and load data by using Azure Databricks](/azure/databricks/scenarios/databricks-extract-load-sql-data-warehouse) <br>[Tutorial: Access Data Lake Storage Gen2 data with Azure Databricks using Spark](data-lake-storage-use-databricks-spark.md)|
|Azure Event Hub|Generally available|No|Yes|[Capture events through Azure Event Hubs in Azure Blob Storage or Azure Data Lake Storage](../../event-hubs/event-hubs-capture-overview.md)|
|Azure Event Grid|Generally available|Yes|Yes|[Tutorial: Implement the data lake capture pattern to update a Databricks Delta table](data-lake-storage-events.md)|
|Azure Logic Apps|Generally available|No|Yes|[Overview - What is Azure Logic Apps?](../../logic-apps/logic-apps-overview.md)|
|Azure Machine Learning|Generally available|Yes|Yes|[Access data in Azure storage services](../../machine-learning/how-to-access-data.md)|
|Azure Stream Analytics|Generally available|Yes|Yes|[Quickstart: Create a Stream Analytics job by using the Azure portal](../../stream-analytics/stream-analytics-quick-create-portal.md) <br> [Egress to Azure Data Lake Gen2](../../stream-analytics/stream-analytics-define-outputs.md)|
|Data Box|Generally available|No|Yes|[Use Azure Data Box to migrate data from an on-premises HDFS store to Azure Storage](data-lake-storage-migrate-on-premises-hdfs-cluster.md)|
|HDInsight |Generally available|Yes|Yes|[Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](../../hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)<br>[Using the HDFS CLI with Data Lake Storage Gen2](data-lake-storage-use-hdfs-data-lake-storage.md) <br>[Tutorial: Extract, transform, and load data by using Apache Hive on Azure HDInsight](data-lake-storage-tutorial-extract-transform-load-hive.md)|
|IoT Hub |Generally available|Yes|Yes|[Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../../iot-hub/iot-hub-devguide-messages-d2c.md)|
|Power BI|Generally available|Yes|Yes|[Analyze data in Data Lake Storage Gen2 using Power BI](/power-query/connectors/datalakestorage)|
|Azure Synapse Analytics (formerly SQL Data Warehouse)|Generally available|Yes|Yes|[Analyze data in a storage account](../../synapse-analytics/get-started-analyze-storage.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|SQL Server Integration Services (SSIS)|Generally available|Yes|Yes|[Azure Storage connection manager](/sql/integration-services/connection-manager/azure-storage-connection-manager)|
|Azure Data Explorer|Generally available|Yes|Yes|[Query data in Azure Data Lake using Azure Data Explorer](/azure/data-explorer/data-lake-query-data)|
|Azure Cognitive Search|Preview|Yes|Yes|[Index and search Azure Data Lake Storage Gen2 documents (preview)](../../search/search-howto-index-azure-data-lake-storage.md)|
|Azure Content Delivery Network|Not yet supported|Not applicable|Not applicable|[Index and search Azure Data Lake Storage Gen2 documents (preview)](../../cdn/cdn-overview.md)|
|Azure SQL Database|Not yet supported|Not applicable|Not applicable|[What is Azure SQL Database?](../../azure-sql/database/sql-database-paas-overview.md)|

## Next steps

- View a list of Tutorial articles. See put link here.
- View a complete list of supported Azure services. See put link here.
- [Storage account overview](../common/storage-account-overview.md)
- [Using Azure Data Lake Storage Gen2 for big data requirements](data-lake-storage-data-scenarios.md)
- [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md)
