---
title: Ingest from IoT Hub - Azure Data Explorer | Microsoft Docs
description: This article describes Ingest from IoT Hub in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: how-to
ms.date: 08/13/2020
---
# IoT Hub data connection

[Azure IoT Hub](/azure/iot-hub/about-iot-hub) is a managed service, hosted in the cloud, that acts as a central message hub for bi-directional communication between your IoT application and the devices it manages. Azure Data Explorer offers continuous ingestion from customer-managed IoT Hubs, using its [Event Hub compatible built in endpoint](/azure/iot-hub/iot-hub-devguide-messages-d2c#routing-endpoints).

The IoT ingestion pipeline goes through several steps. First, you create an IoT Hub, and register a device to it. You then create a target table in Azure Data Explorer into which the [data in a particular format](#data-format), will be ingested using the given [ingestion properties](#ingestion-properties). The Iot Hub connection needs to know [events routing](#events-routing) to connect to the Azure Data Explorer table. Data is embedded with selected properties according to the [event system properties mapping](#event-system-properties-mapping). This process can be managed through the [Azure portal](ingest-data-iot-hub.md), programmatically with [C#](data-connection-iot-hub-csharp.md) or [Python](data-connection-iot-hub-python.md), or with the [Azure Resource Manager template](data-connection-iot-hub-resource-manager.md).

For general information about data ingestion in Azure Data Explorer, see [Azure Data Explorer data ingestion overview](ingest-data-overview.md).

## Data format

* Data is read from the Event Hub endpoint in form of [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata) objects.
* See [supported formats](ingestion-supported-formats.md).
    > [!NOTE]
    > IoT Hub doesn't support the .raw format.
* See [supported compressions](ingestion-supported-formats.md#supported-data-compression-formats).
  * The original uncompressed data size should be part of the blob metadata, or else Azure Data Explorer will estimate it. The ingestion uncompressed size limit per file is 4 GB.

## Ingestion properties

Ingestion properties instruct the ingestion process where to route the data and how to process it. You can specify [Ingestion properties](ingestion-properties.md) of the events using the [EventData.Properties](/dotnet/api/microsoft.servicebus.messaging.eventdata.properties#Microsoft_ServiceBus_Messaging_EventData_Properties). You can set the following properties:

|Property |Description|
|---|---|
| Table | Name (case sensitive) of the existing target table. Overrides the `Table` set on the `Data Connection` pane. |
| Format | Data format. Overrides the `Data format` set on the `Data Connection` pane. |
| IngestionMappingReference | Name of the existing [ingestion mapping](kusto/management/create-ingestion-mapping-command.md) to be used. Overrides the `Column mapping` set on the `Data Connection` pane.|
| Encoding |  Data encoding, the default is UTF8. Can be any of [.NET supported encodings](/dotnet/api/system.text.encoding#remarks). |

> [!NOTE]
> Only events enqueued after you create the data connection are ingested.

## Events routing

When setting up an IoT Hub connection to Azure Data Explorer cluster, you specify target table properties (table name, data format, and mapping). This setting is the default routing for your data, also referred to as static routing.
You can also specify target table properties for each event, using event properties. The connection will dynamically route the data as specified in the [EventData.Properties](/dotnet/api/microsoft.servicebus.messaging.eventdata.properties#Microsoft_ServiceBus_Messaging_EventData_Properties), overriding the static properties for this event.

> [!Note]
> If **My data includes routing info** selected, you must provide the necessary routing information as part of the events properties.

## Event system properties mapping

System properties are a collection used to store properties that are set by the IoT Hub service, on the time the event is received. The Azure Data Explorer IoT Hub connection will embed the selected properties in the data landing in your table.

> [!Note]
> For `csv` mapping, properties are added at the beginning of the record in the order listed in the table below. For `json` mapping, properties are added according to property names in the following table.

### System properties

IoT Hub exposes the following system properties:

|Property |Description|
|---|---|
| message-id | A user-settable identifier for the message used for request-reply patterns. |
| sequence-number | A number (unique per device-queue) assigned by IoT Hub to each cloud-to-device message. |
| to | A destination specified in Cloud-to-Device messages. |
| absolute-expiry-time | Date and time of message expiration. |
| iothub-enqueuedtime | Date and time the Device-to-Cloud message was received by IoT Hub. |
| correlation-id| A string property in a response message that typically contains the MessageId of the request, in request-reply patterns. |
| user-id| An ID used to specify the origin of messages. |
| iothub-ack| A feedback message generator. |
| iothub-connection-device-id| An ID set by IoT Hub on device-to-cloud messages. It contains the deviceId of the device that sent the message. |
| iothub-connection-auth-generation-id| An ID set by IoT Hub on device-to-cloud messages. It contains the connectionDeviceGenerationId (as per Device identity properties) of the device that sent the message. |
| iothub-connection-auth-method| An authentication method set by IoT Hub on device-to-cloud messages. This property contains information about the authentication method used to authenticate the device sending the message. |
| iothub-creation-time-utc| Timestamp recording when the message was sent by the device. |

If you selected **Event system properties** in the **Data Source** section of the table, you must include the properties in the table schema and mapping.

[!INCLUDE [data-explorer-iot-system-properties](includes/data-explorer-iot-system-properties.md)]

## IoT Hub connection

> [!Note]
> For best performance, create all resources in the same region as the Azure Data Explorer cluster.

### Create an IoT Hub

If you don't already have one, [Create an Iot Hub](ingest-data-iot-hub.md#create-an-iot-hub). Connection to IoT Hub can be managed through the [Azure portal](ingest-data-iot-hub.md), programmatically with [C#](data-connection-iot-hub-csharp.md) or [Python](data-connection-iot-hub-python.md), or with the [Azure Resource Manager template](data-connection-iot-hub-resource-manager.md).

> [!Note]
> * The `device-to-cloud partitions` count is not changeable, so you should consider long-term scale when setting partition count.
> * Consumer group must be unique per consumer. Create a consumer group dedicated to Azure Data Explorer connection. Find your resource in the Azure portal and go to `Built-in endpoints` to add a new consumer group.
> * The Data Connection uses IoT Hub `Built-in endpoints`. If you configure any other `Message routing endpoint`, message routing to the `Built-in endpoint` will be prevented. To configure multiple routing endpoints, create an EventHub custom endpoint. Use this custom endpoint to create the Data Connection, instead of using the IoT Hub directly.

## Sending events

See the [sample project](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/master/iot-hub/Quickstarts/SimulatedDevice) that simulates a device and generates data.

## Next steps

There are various methods to ingest data into IoT Hub. See the following links for walkthroughs of each method.

* [Ingest data from IoT Hub into Azure Data Explorer](ingest-data-iot-hub.md)
* [Create an IoT Hub data connection for Azure Data Explorer by using C# (Preview)](data-connection-iot-hub-csharp.md)
* [Create an IoT Hub data connection for Azure Data Explorer by using Python (Preview)](data-connection-iot-hub-python.md)
* [Create an IoT Hub data connection for Azure Data Explorer by using Azure Resource Manager template](data-connection-iot-hub-resource-manager.md)
