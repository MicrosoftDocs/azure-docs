---
title: Azure Data Explorer output from Azure Stream Analytics 
description: This article describes using Azure Database Explorer as an output for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 09/26/2022
---

# Azure Data Explorer output from Azure Stream Analytics

You can use [Azure Data Explorer](https://azure.microsoft.com/services/data-explorer/) as an output for analyzing large volumes of diverse data from any data source, such as websites, applications, IoT devices, and more. Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. It helps you handle the many data streams emitted by modern software, so you can collect, store, and analyze data. This data is used for diagnostics, monitoring, reporting, machine learning, and additional analytics capabilities.

Azure Data Explorer supports several ingestion methods, including connectors to common services like Event Hubs, programmatic ingestion using SDKs, such as .NET and Python, and direct access to the engine for exploration purposes. Azure Data Explorer integrates with analytics and modeling services for additional analysis and visualization of data.

For more information about Azure Data Explorer, visit the [What is Azure Data Explorer documentation.](/azure/data-explorer/data-explorer-overview/)

To learn more about how to create an Azure Data Explorer cluster by using the Azure portal, visit: [Quickstart: Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-database-portal/)

> [!NOTE] 
> Azure Data Explorer from Azure Stream Analytics supports output to Synapse Data Explorer clusters. To write to your synapse data explorer clusters, you have to specify the url of your cluster in the configuration blade in for Azure Data Explorer output in your Azure Stream Analytics job.

## Output configuration

The following table lists the property names and their description for creating an Azure Data Explorer output:

| Property name | Description |
| --- | --- |
| Output alias |A friendly name used in queries to direct the query output to this database. |
| Subscription | Select the Azure subscription that you want to use for your cluster. |
| Cluster | Choose a unique name that identifies your cluster. The domain name [region].kusto.windows.net is appended to the cluster name you provide. The name can contain only lowercase letters and numbers. It must contain from 4 to 22 characters. |
| Database | The name of the database where you are sending your output. The database name must be unique within the cluster. |
| Authentication | A [managed identity from Azure Active Directory](../active-directory/managed-identities-azure-resources/overview.md) allows your cluster to easily access other Azure AD-protected resources such as Azure Key Vault. The identity is managed by the Azure platform and doesn't require you to provision or rotate any secrets. Managed identity configuration is currently supported only to [enable customer-managed keys for your cluster.](/azure/data-explorer/security#customer-managed-keys-with-azure-key-vault/). |
| Table | The table name where the output is written. The table name is case-sensitive. The schema of this table should exactly match the number of fields and their types that your job output generates. |


## Partitioning

Partitioning needs to enabled and is based on the PARTITION BY clause in the query. When the Inherit Partitioning option is enabled, it follows the input partitioning for [fully parallelizable queries](stream-analytics-scale-jobs.md). 


## When to use Azure Data Explorer or/and Azure Stream Analytics

### Azure Stream Analytics:

* Stream Processing Engine - Continuous/ Streaming real-time analytics
* Job based
* ASA has a lookback window period of 1ms to 7 days for in-memory temporal analytics/stream processing
* Ingest from Event Hubs, IoTHub with subsecond latency

### Azure Data Explorer:

* Analytical Engine - On-demand/ Interactive real-time analytics
* Streaming data ingestion into persistent data store along with querying capabilities
* Ingest data from Event Hubs, IoT Hub, Blob, Data Lake, Kafka, Logstash, Spark, ADF.
* 10 seconds to 5 minutes latency for high throughput workloads
* Simple data transformation can be done with update policy during ingestion

You can significantly grow the scope of real-time analytics by leveraging ASA and ADX together. Below are a few scenarios:

* Stream Analytics identifies anomalies in real time and Data Explorer helps determine how and why it occurred through interactive exploration
* Stream Analytics deserializes incoming data stream for use in Data Explorer (E.g. ingest Protobuff format by using custom deserializer, custom binaries formats etc.)
* Stream Analytics can perform aggregates, filters, enrich, and transform incoming data streams for use in Data Explorer


## Other Scenarios and limitations
* The name of the columns and data type should match between Azure Stream Analytics SQL query and Azure Data Explorer table. Note that the comparison is case sensitive.
* Columns that exist in your Azure Data explorer clusters but are missing in ASA are ignored while columns that are missing in Azure Stream  raise an error.
* The order of your columns in your ASA query does not matter. Order is determined by the schema of the ADX table.
* Azure Data Explorer has an aggregation (batching) policy for data ingestion, designed to optimize the ingestion process. The policy is configured to 5 minutes, 1000 items or 1 GB of data by default, so you may experience a latency. See [batching policy](/azure/data-explorer/kusto/management/batchingpolicy) for aggregation options.

## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
