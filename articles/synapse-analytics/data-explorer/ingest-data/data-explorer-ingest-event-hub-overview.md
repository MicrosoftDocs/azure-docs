---
title: Event Hubs data connection for Azure Synapse Data Explorer (Preview)
description: This article provides an overview of how to ingest (load) data into Azure Synapse Data Explorer from Event Hubs.
ms.topic: how-to
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.reviewer: tzgitlin
ms.service: azure-synapse-analytics
ms.subservice: data-explorer
---
# Event Hubs data connection (Preview)

[Azure Event Hubs](../../../event-hubs/event-hubs-about.md) is a big data streaming platform and event ingestion service. Azure Synapse Data Explorer offers continuous ingestion from customer-managed Event Hubs.

The Event Hubs ingestion pipeline transfers events to Azure Synapse Data Explorer in several steps. You first create an Event Hubs in the Azure portal. You then create a target table in Azure Synapse Data Explorer into which the [data in a particular format](#data-format), will be ingested using the given [ingestion properties](#ingestion-properties). The Event Hubs connection needs to know [events routing](#events-routing). Data is embedded with selected properties according to the [event system properties mapping](#event-system-properties-mapping). [Create a connection](#event-hubs-connection) to Event Hubs to [create an Event Hubs](#create-an-event-hubs) and [send events](#send-events). This process can be managed through the [Azure portal](data-explorer-ingest-event-hub-portal.md), programmatically with [C#](data-explorer-ingest-event-hub-csharp.md) or [Python](data-explorer-ingest-event-hub-python.md), or with the [Azure Resource Manager template](data-explorer-ingest-event-hub-resource-manager.md).

For general information about data ingestion in Azure Synapse Data Explorer, see [Azure Synapse Data Explorer data ingestion overview](data-explorer-ingest-data-overview.md).

## Data format

* Data is read from the Event Hubs in form of [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata) objects.
* See [supported formats](data-explorer-ingest-data-supported-formats.md).
    > [!NOTE]
    > Event Hub doesn't support the .raw format.

* Data can be compressed using the `GZip` compression algorithm. Specify `Compression` in [ingestion properties](#ingestion-properties).
   * Data compression isn't supported for compressed formats (Avro, Parquet, ORC).
   * Custom encoding and embedded [system properties](#event-system-properties-mapping) aren't supported on compressed data.
  
## Ingestion properties

Ingestion properties instruct the ingestion process, where to route the data, and how to process it. You can specify [ingestion properties](data-explorer-ingest-data-properties.md) of the events ingestion using the [EventData.Properties](/dotnet/api/microsoft.servicebus.messaging.eventdata.properties#Microsoft_ServiceBus_Messaging_EventData_Properties). You can set the following properties:

|Property |Description|
|---|---|
| Table | Name (case sensitive) of the existing target table. Overrides the `Table` set on the `Data Connection` pane. |
| Format | Data format. Overrides the `Data format` set on the `Data Connection` pane. |
| IngestionMappingReference | Name of the existing [ingestion mapping](/azure/data-explorer/kusto/management/create-ingestion-mapping-command?context=/azure/synapse-analytics/context/context) to be used. Overrides the `Column mapping` set on the `Data Connection` pane.|
| Compression | Data compression, `None` (default), or `GZip` compression.|
| Encoding | Data encoding, the default is UTF8. Can be any of [.NET supported encodings](/dotnet/api/system.text.encoding#remarks). |
| Tags | A list of [tags](/azure/data-explorer/kusto/management/extents-overview?context=/azure/synapse-analytics/context/context#extent-tagging) to associate with the ingested data, formatted as a JSON array string. There are [performance implications](/azure/data-explorer/kusto/management/extents-overview?context=/azure/synapse-analytics/context/context#ingest-by-extent-tags) when using tags. |

> [!NOTE]
> Only events enqueued after you create the data connection are ingested.

## Events routing

When you set up an Event Hubs connection to Azure Synapse Data Explorer cluster, you specify target table properties (table name, data format, compression, and mapping). The default routing for your data is also referred to as `static routing`.
You can also specify target table properties for each event, using event properties. The connection will dynamically route the data as specified in the [EventData.Properties](/dotnet/api/microsoft.servicebus.messaging.eventdata.properties#Microsoft_ServiceBus_Messaging_EventData_Properties), overriding the static properties for this event.

In the following example, set Event Hubs details and send weather metric data to table `WeatherMetrics`.
Data is in `json` format. `mapping1` is pre-defined on the table `WeatherMetrics`.

>[!WARNING]
>This example uses connection string authentication to connect to Event Hubs for simplicity of the example. However, hard-coding a connection string into your script requires a very high degree of trust in the application, and carries security risks.
>
>For long-term, secure solutions, use one of these options:
>
>* [Passwordless authentication](../../../event-hubs/event-hubs-dotnet-standard-getstarted-send.md?tabs=passwordless)
>* [Store your connection string in an Azure Key Vault](/azure/key-vault/secrets/quick-create-portal) and use [this method](/azure/key-vault/secrets/quick-create-net#retrieve-a-secret) to retrieve it in your code.

```csharp
var eventHubNamespaceConnectionString=<connection_string>;
var eventHubName=<event_hub>;

// Create the data
var metric = new Metric { Timestamp = DateTime.UtcNow, MetricName = "Temperature", Value = 32 }; 
var data = JsonConvert.SerializeObject(metric);

// Create the event and add optional "dynamic routing" properties
var eventData = new EventData(Encoding.UTF8.GetBytes(data));
eventData.Properties.Add("Table", "WeatherMetrics");
eventData.Properties.Add("Format", "json");
eventData.Properties.Add("IngestionMappingReference", "mapping1");
eventData.Properties.Add("Tags", "['mydatatag']");

// Send events
var eventHubClient = EventHubClient.CreateFromConnectionString(eventHubNamespaceConnectionString, eventHubName);
eventHubClient.Send(eventData);
eventHubClient.Close();
```

## Event system properties mapping

System properties store properties that are set by the Event Hubs service, at the time, the event is enqueued. The Azure Synapse Data Explorer Event Hubs connection will embed the selected properties into the data landing in your table.

[!INCLUDE [event-hub-system-mapping](../includes/data-explorer-event-hub-system-mapping.md)]

### System properties

Event Hubs exposes the following system properties:

|Property |Data Type |Description|
|---|---|---|
| x-opt-enqueued-time |datetime | UTC time when the event was enqueued |
| x-opt-sequence-number |long | The logical sequence number of the event within the partition stream of the Event Hubs
| x-opt-offset |string | The offset of the event from the Event Hubs partition stream. The offset identifier is unique within a partition of the Event Hubs stream |
| x-opt-publisher |string | The publisher name, if the message was sent to a publisher endpoint |
| x-opt-partition-key |string |The partition key of the corresponding partition that stored the event |

<!-- When you work with [IoT Central](https://azure.microsoft.com/services/iot-central/) event hubs, you can also embed IoT Hub system properties in the payload. For the complete list, see [IoT Hub system properties](ingest-data-iot-hub-overview.md#event-system-properties-mapping). -->

If you selected **Event system properties** in the **Data Source** section of the table, you must include the properties in the table schema and mapping.

[!INCLUDE [data-explorer-container-system-properties](../includes/data-explorer-container-system-properties.md)]

## Event Hubs connection

> [!Note]
> For best performance, create all resources in the same region as the Azure Synapse Data Explorer cluster.

### Create an Event Hubs

If you don't already have one, [Create an Event Hubs](../../../event-hubs/event-hubs-create.md). Connecting to Event Hubs can be managed through the [Azure portal](data-explorer-ingest-event-hub-portal.md), programmatically with [C#](data-explorer-ingest-event-hub-csharp.md) or [Python](data-explorer-ingest-event-hub-python.md), or with the [Azure Resource Manager template](data-explorer-ingest-event-hub-resource-manager.md).

> [!Note]
> * The partition count isn't changeable, so you should consider long-term scale when setting partition count.
> * Consumer group *must* be unique per consumer. Create a consumer group dedicated to Azure Synapse Data Explorer connection.

## Send events

See the [sample app](https://github.com/Azure-Samples/event-hubs-dotnet-ingest) that generates data and sends it to an Event Hubs.

For an example of how to generate sample data, see [Ingest data from Event Hubs into Azure Synapse Data Explorer](data-explorer-ingest-event-hub-portal.md#generate-sample-data)

## Set up Geo-disaster recovery solution

Event Hubs offers a [Geo-disaster recovery](../../../event-hubs/event-hubs-geo-dr.md) solution. 
Azure Synapse Data Explorer doesn't support `Alias` Event Hubs namespaces. To implement the Geo-disaster recovery in your solution, create two Event Hubs data connections: one for the primary namespace and one for the secondary namespace. Azure Synapse Data Explorer will listen to both Event Hubs connections.

> [!NOTE]
> It's the user's responsibility to implement a failover from the primary namespace to the secondary namespace.

## Next steps

- [Ingest data from Event Hubs into Azure Synapse Data Explorer](data-explorer-ingest-event-hub-portal.md)
- [Create an Event Hubs data connection for Azure Synapse Data Explorer using C#](data-explorer-ingest-event-hub-csharp.md)
- [Create an Event Hubs data connection for Azure Synapse Data Explorer using Python](data-explorer-ingest-event-hub-python.md)
- [Create an Event Hubs data connection for Azure Synapse Data Explorer using Azure Resource Manager template](data-explorer-ingest-event-hub-resource-manager.md)