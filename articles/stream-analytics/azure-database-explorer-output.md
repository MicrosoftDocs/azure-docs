---
title: Azure Data Explorer output from Azure Stream Analytics 
description: This article describes using Azure Data Explorer as an output for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 06/01/2023
---

# Azure Data Explorer output from Azure Stream Analytics

You can use [Azure Data Explorer](https://azure.microsoft.com/services/data-explorer/) as an output for analyzing large volumes of diverse data from any data source, such as websites, applications, and Internet of Things (IoT) devices. Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. It helps you handle the many data streams that modern software emits, so you can collect, store, and analyze data. This data is used for diagnostics, monitoring, reporting, machine learning, and additional analytics capabilities.

Azure Data Explorer supports several ingestion methods, including connectors to common services like Azure Event Hubs, programmatic ingestion through SDKs such as .NET and Python, and direct access to the engine for exploration purposes. Azure Data Explorer integrates with analytics and modeling services for additional analysis and visualization of data.

For more information about Azure Data Explorer, see [What is Azure Data Explorer?](/azure/data-explorer/data-explorer-overview/).

To learn more about how to create an Azure Data Explorer cluster by using the Azure portal, see [Quickstart: Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-database-portal/).

> [!NOTE]
> Azure Data Explorer from Azure Stream Analytics supports output to Azure Synapse Data Explorer. To write to your clusters in Azure Synapse Data Explorer, specify the URL of your cluster in the configuration pane for Azure Data Explorer output in your Azure Stream Analytics job.

## Output configuration

The following table lists the property names and their descriptions for creating an Azure Data Explorer output.

| Property name | Description |
| --- | --- |
| Output alias |A friendly name that's used in queries to direct the query output to this database. |
| Subscription | The Azure subscription that you want to use for your cluster. |
| Cluster | A unique name that identifies your cluster. The domain name \<region\>.kusto.windows.net is appended to the cluster name that you provide. The name can contain only lowercase letters and numbers. It must contain 4 to 22 characters. |
| Database | The name of the database where you're sending the output. The database name must be unique within the cluster. |
| Authentication | A [managed identity from Microsoft Entra ID](../active-directory/managed-identities-azure-resources/overview.md), which allows your cluster to easily access other Microsoft Entra protected resources, such as Azure Key Vault. The identity is managed by the Azure platform and doesn't require you to provision or rotate any secrets. Managed identity configuration is currently supported only to [enable customer-managed keys for your cluster](/azure/data-explorer/security#customer-managed-keys-with-azure-key-vault/). |
| Table | The table name where the output is written. The table name is case-sensitive. The schema of this table should exactly match the number of fields and their types that your job output generates. |

## Partitioning

Partitioning needs to be enabled and is based on the `PARTITION BY` clause in the query. When the Inherit Partitioning option is enabled, it follows the input partitioning for [fully parallelizable queries](stream-analytics-scale-jobs.md).

## When to use Azure Stream Analytics and Azure Data Explorer

Characteristics of Azure Stream Analytics include:

* Stream processing engine: continuous, streaming real-time analytics
* Job based
* Lookback window of 1 millisecond to 7 days for in-memory temporal analytics and stream processing
* Ingestion from Azure Event Hubs and Azure IoT Hub with subsecond latency

Characteristics of Azure Data Explorer include:

* Analytical engine: on-demand, interactive real-time analytics
* Streaming data ingestion into a persistent data store, along with querying capabilities
* Ingestion of data from Event Hubs, IoT Hub, Azure Blob Storage, Azure Data Lake Storage, Kafka, Logstash, Spark, and Azure Data Factory
* Latency of 10 seconds to 5 minutes for high-throughput workloads
* Simple data transformation through an update policy during ingestion

You can significantly grow the scope of real-time analytics by using Azure Stream Analytics and Azure Data Explorer together. Here are a few scenarios:

* Stream Analytics identifies anomalies in real time, and Azure Data Explorer helps determine how and why they occurred through interactive exploration.
* Stream Analytics deserializes incoming data streams for use in Azure Data Explorer (for example, ingest Protobuf format by using a custom deserializer or custom binary formats).
* Stream Analytics can aggregate, filter, enrich, and transform incoming data streams for use in Azure Data Explorer.

## Other scenarios and limitations

* The name of the columns and data type should match between the Azure Stream Analytics SQL query and the Azure Data Explorer table. The comparison is case-sensitive.
* Columns that exist in your Azure Data Explorer clusters but are missing in Azure Stream Analytics are ignored. Columns that are missing in Azure Stream Analytics raise an error.
* The order of your columns in your Azure Stream Analytics query doesn't matter. The schema of the Azure Data Explorer table determines the order.
* Azure Data Explorer has an aggregation (batching) policy for data ingestion that's designed to optimize the ingestion process. The policy is configured to 5 minutes, 1,000 items, or 1 GB of data by default, so you might experience a latency. To reduce latency, enable streaming ingestion on your cluster, and then table or database by following the steps in [Configure streaming ingestion on your Azure Data Explorer cluster](/azure/data-explorer/ingest-data-streaming). For aggregation options, see [IngestionBatching policy](/azure/data-explorer/kusto/management/batchingpolicy).

## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
