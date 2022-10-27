---
# Mandatory fields.
title: Data history (with Azure Data Explorer)
titleSuffix: Azure Digital Twins
description: Understand data history for Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 10/25/2022
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins data history (with Azure Data Explorer)

**Data history** is an integration feature of Azure Digital Twins. It allows you to connect an Azure Digital Twins instance to an [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) cluster so that digital twin property updates are automatically historized to Azure Data Explorer.

Once twin property values are historized to Azure Data Explorer, you can run joint queries using the [Azure Digital Twins plugin for Azure Data Explorer](concepts-data-explorer-plugin.md) to reason across digital twins, their relationships, and time series data to gain insights into the behavior of modeled environments. You can also use these queries to power operational dashboards, enrich 2D and 3D web applications, and drive immersive augmented/mixed reality experiences to convey the current and historical state of assets, processes, and people modeled in Azure Digital Twins. 

For more of an introduction to data history, including a quick demo, watch the following IoT show video:

<iframe src="https://aka.ms/docs/player?id=2f9a9af4-1556-44ea-ab5f-afcfd6eb9c15" width="1080" height="530"></iframe>

## Resources and data flow

Data history requires the following resources:
* Azure Digital Twins instance, with a [managed identity](concepts-security.md#managed-identity-for-accessing-other-resources) enabled
* [Event Hubs](../event-hubs/event-hubs-about.md) namespace containing an event hub
* [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) cluster containing a database 

These resources are connected into the following flow:

:::image type="content" source="media/concepts-data-history/data-history-architecture.png" alt-text="Diagram showing the flow of telemetry data into Azure Digital Twins, through an event hub, to Azure Data Explorer.":::

Data moves through these resources in this order:
1. A property of a digital twin in Azure Digital Twins is updated.
1. Data history forwards a message containing the twin's updated property value and metadata to the event hub. 
1. The event hub forwards the message to the target Azure Data Explorer cluster. 
1. The Azure Data Explorer cluster maps the message fields to the data history schema, and stores the data as a timestamped record in a data history table.

When working with data history, use the [2022-05-31](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/data-plane/Microsoft.DigitalTwins/stable/2022-05-31) version of the APIs.

### History from multiple Azure Digital Twins instances

If you'd like, you can have multiple Azure Digital Twins instances historize twin property updates to the same Azure Data Explorer cluster.

Each Azure Digital Twins instance will have its own data history connection targeting the same Azure Data Explorer cluster. Within the cluster, instances can send their twin data to either...
* **different tables** in the Azure Data Explorer cluster.
* **the same table** in the Azure Data Explorer cluster. To do this, specify the same Azure Data Explorer table name while [creating the data history connections](how-to-use-data-history.md#set-up-data-history-connection). In the [data history table schema](#data-schema), the `ServiceId` column will contain the URL of the source Azure Digital Twins instance, so you can use this field to resolve which Azure Digital Twins instance emitted each record.

## Required permissions

In order to set up a data history connection, your Azure Digital Twins instance must have the following permissions to access the Event Hubs and Azure Data Explorer resources. These roles enable Azure Digital Twins to configure the event hub and Azure Data Explorer database on your behalf (for example, creating a table in the database). These permissions can optionally be removed after data history is set up.
* Event Hubs resource: **Azure Event Hubs Data Owner**
* Azure Data Explorer cluster: **Contributor** (scoped to either the entire cluster or specific database)
* Azure Data Explorer database principal assignment: **Admin** (scoped to the database being used)

Later, your Azure Digital Twins instance must have the following permission on the Event Hubs resource while data history is being used: **Azure Event Hubs Data Sender** (you can also opt instead to keep **Azure Event Hubs Data Owner** from data history setup).

## Creating a data history connection

Once all the [resources](#resources-and-data-flow) and [permissions](#required-permissions) are set up, you can use the [Azure CLI](/cli/azure/what-is-azure-cli), [Azure portal](https://portal.azure.com), or the [Azure Digital Twins SDK](concepts-apis-sdks.md) to create the data history connection between them. The CLI command set is [az dt data-history](/cli/azure/dt/data-history).

For instructions on how to set up a data history connection, see [Use data history with Azure Data Explorer](how-to-use-data-history.md).

## Data schema

Time series data for twin property updates is stored in Azure Data Explorer with the following schema:

| Attribute | Type | Description |
| --- | --- | --- |
| `TimeStamp` | DateTime | The date/time the property update message was processed by Azure Digital Twins. This field is set by the system and isn't writable by users. |
| `SourceTimeStamp` | DateTime |  An optional, writable property representing the timestamp when the property update was observed in the real world. This property can only be written using the **2022-05-31** version of the [Azure Digital Twins APIs/SDKs](concepts-apis-sdks.md) and the value must comply to ISO 8601 date and time format. For more information about how to update this property, see [Update a property's sourceTime](how-to-manage-twin.md#update-a-propertys-sourcetime). |
| `ServiceId` | String | The service instance ID of the Azure IoT service logging the record |
| `Id` | String | The twin ID |
| `ModelId` | String | The DTDL model ID (DTMI) |
| `Key` | String | The name of the updated property |
| `Value` | Dynamic | The value of the updated property |
| `RelationshipId` | String | For properties defined on relationships (as opposed to twins or devices), this column contains the ID of the relationship; otherwise, empty |
| `RelationshipTarget` | String | For properties defined on relationships, this column defines the twin ID of the twin targeted by the relationship; otherwise, empty |

Below is an example table of twin property updates stored to Azure Data Explorer.

| `TimeStamp` | `SourceTimeStamp` | `ServiceId` | `Id` | `ModelId` | `Key` | `Value` | `RelationshipTarget` | `RelationshipID` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2021-06-30T20:23:29.8697482Z | 2021-06-30T20:22:14.3854859Z | myInstance.api.neu.digitaltwins.azure.net | solar_plant_3 | `dtmi:example:grid:plants:solarPlant;1` | Output | 130 |  |  |
| 2021-06-30T20:23:39.3235925Z| 2021-06-30T20:22:26.5837559Z | myInstance.api.neu.digitaltwins.azure.net | solar_plant_3 | `dtmi:example:grid:plants:solarPlant;1` | Output | 140 |  |  |
| 2021-06-30T20:23:47.078367Z | 2021-06-30T20:22:34.9375957Z | myInstance.api.neu.digitaltwins.azure.net | solar_plant_3 | `dtmi:example:grid:plants:solarPlant;1` | Output | 130 |  |  |
| 2021-06-30T20:23:57.3794198Z | 2021-06-30T20:22:50.1028562Z | myInstance.api.neu.digitaltwins.azure.net | solar_plant_3 | `dtmi:example:grid:plants:solarPlant;1` | Output | 123 |  |  |

### Representing properties with multiple fields 

You may need to store a property with multiple fields. These properties are represented with a JSON object in the `Value` attribute of the schema.

For instance, if you're representing a property with three fields for roll, pitch, and yaw, data history will store the following JSON object as the `Value`: `{"roll": 20, "pitch": 15, "yaw": 45}`.

## Pricing

Messages emitted by data history are metered under the [Message pricing dimension](https://azure.microsoft.com/pricing/details/digital-twins/#pricing).

## End-to-end ingestion latency

Azure Digital Twins data history builds on the existing ingestion mechanism provided by Azure Data Explorer. Azure Digital Twins will ensure that property updates are made available to Azure Data Explorer within less than two seconds. Extra latency may be introduced by Azure Data Explorer ingesting the data. 

There are two methods in Azure Data Explorer for ingesting data: [batch ingestion](#batch-ingestion-default) and [streaming ingestion](#streaming-ingestion). You can configure these ingestion methods for individual tables according to your needs and the specific data ingestion scenario.

Streaming ingestion has the lowest latency. However, due to processing overhead, this mode should only be used if less than 4 GB of data is ingested every hour. Batch ingestion works best if high ingestion data rates are expected. Azure Data Explorer uses batch ingestion by default. The following table summarizes the expected worst-case end-to-end latency: 

| Azure Data Explorer configuration | Expected end-to-end latency | Recommended data rate |
| --- | --- | --- |
| Streaming ingestion | <12 sec (<3 sec typical) | <4 GB / hr |
| Batch ingestion | Varies (12 sec-15 m, depending on configuration) | >4 GB / hr

The rest of this section contains details for enabling each type of ingestion.

### Batch ingestion (default)

If not configured otherwise, Azure Data Explorer will use **batch ingestion**. The default settings may lead to data being available for query only 5-10 minutes after an update to a digital twin was performed. The ingestion policy can be altered, such that the batch processing occurs at most every 10 seconds (at minimum; or 15 minutes at maximum). To alter the ingestion policy, the following command must be issued in the Azure Data Explorer query view: 

```kusto
.alter table <table_name> policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:10", "MaximumNumberOfItems": 500, "MaximumRawDataSizeMB": 1024}' 
```

Ensure that `<table_name>` is replaced with the name of the table that was set up for you. MaximumBatchingTimeSpan should be set to the preferred batching interval. It may take 5-10 minutes for the policy to take effect. You can read more about ingestion batching at the following link: [Kusto IngestionBatching policy management command](/azure/data-explorer/kusto/management/batching-policy). 

### Streaming ingestion 

Enabling **streaming ingestion** is a 2-step process: 
1. Enable streaming ingestion for your cluster. This action only has to be done once. (Warning: Doing so will have an effect on the amount of storage available for hot cache, and may introduce extra limitations).  For instructions, see [Configure streaming ingestion on your Azure Data Explorer cluster](/azure/data-explorer/ingest-data-streaming?tabs=azure-portal%2Ccsharp).
2. Add a streaming ingestion policy for the desired table. You can read more about enabling streaming ingestion for your cluster in the Azure Data Explorer documentation: [Kusto IngestionBatching policy management command](/azure/data-explorer/kusto/management/batching-policy). 

To enable streaming ingestion for your Azure Digital Twins data history table, the following command must be issued in the Azure Data Explorer query pane: 

```kusto
.alter table <table_name> policy streamingingestion enable 
```

Ensure that `<table_name>` is replaced with the name of the table that was set up for you. It may take 5-10 minutes for the policy to take effect. 

## Next steps

Once twin data has been historized to Azure Data Explorer, you can use the Azure Digital Twins query plugin for Azure Data Explorer to run queries across the data. Read more about the plugin here: [Querying with the Azure Data Explorer plugin](concepts-data-explorer-plugin.md).

Or, dive deeper into data history with an example scenario in this how-to: [Use data history with Azure Data Explorer](how-to-use-data-history.md).
