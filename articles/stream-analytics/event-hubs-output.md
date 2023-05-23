---
title: Event Hubs output from Azure Stream Analytics
description: This article describes how to output data from Azure Stream Analytics to Azure Event Hubs.
author: an-emma
ms.author: raan
ms.service: stream-analytics
ms.custom: build-2023
ms.topic: conceptual
ms.date: 02/27/2023
---
# Event Hubs output from Azure Stream Analytics

The [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/) service is a highly scalable publish-subscribe event ingestor. It can collect millions of events per second. One use of an event hub as output is when the output of a Stream Analytics job becomes the input of another streaming job. For information about the maximum message size and batch size optimization, see the [output batch size](#output-batch-size) section.

## Output configuration

The following table has the parameters needed to configure data streams from event hubs as an output.

| Property name | Description |
| --- | --- |
| Output alias | A friendly name used in queries to direct the query output to this event hub. |
| Event hub namespace | A container for a set of messaging entities. When you created a new event hub, you also created an event hub namespace. |
| Event hub name | The name of your event hub output. |
| Event hub policy name | The shared access policy, which you can create on the event hub's **Configure** tab. Each shared access policy has a name, permissions that you set, and access keys. |
| Event hub policy key | The shared access key that's used to authenticate access to the event hub namespace. |
| Partition key column | Optional. A column that contains the partition key for event hub output. |
| Event serialization format | The serialization format for output data. JSON, CSV, and Avro are supported. |
| Encoding | For CSV and JSON, UTF-8 is the only supported encoding format at this time. |
| Delimiter | Applicable only for CSV serialization. Stream Analytics supports a number of common delimiters for serializing data in CSV format. Supported values are comma, semicolon, space, tab, and vertical bar. |
| Format | Applicable only for JSON serialization. **Line separated** specifies that the output is formatted by having each JSON object separated by a new line. If you select **Line separated**, the JSON is read one object at a time. The whole content by itself would not be a valid JSON. **Array** specifies that the output is formatted as an array of JSON objects.  |
| Property columns | Optional. Comma-separated columns that need to be attached as user properties of the outgoing message instead of the payload. More information about this feature is in the section [Custom metadata properties for output](#custom-metadata-properties-for-output). |

## Partitioning

Partitioning varies depending on partition alignment. When the partition key for event hub output is equally aligned with the upstream (previous) query step, the number of writers is the same as the number of partitions in event hub output. Each writer uses the [EventHubSender class](/dotnet/api/microsoft.servicebus.messaging.eventhubsender) to send events to the specific partition. When the partition key for event hub output is not aligned with the upstream (previous) query step, the number of writers is the same as the number of partitions in that prior step. Each writer uses the [SendBatchAsync class](/dotnet/api/microsoft.servicebus.messaging.eventhubclient.sendasync) in **EventHubClient** to send events to all the output partitions. 

## Output batch size

The maximum message size is 256 KB or 1 MB per message. For more information, see [Event Hubs limits](../event-hubs/event-hubs-quotas.md). When input/output partitioning isn't aligned, each event is packed individually in `EventData` and sent in a batch of up to the maximum message size. This also happens if [custom metadata properties](#custom-metadata-properties-for-output) are used. When input/output partitioning is aligned, multiple events are packed into a single `EventData` instance, up to the maximum message size, and sent.

## Custom metadata properties for output

You can attach query columns as user properties to your outgoing messages. These columns don't go into the payload. The properties are present in the form of a dictionary on the output message. *Key* is the column name and *value* is the column value in the properties dictionary. All Stream Analytics data types are supported except Record and Array.

In the following example, the fields `DeviceId` and `DeviceStatus` are added to the metadata.

1. Use the following query:

   ```sql
   select *, DeviceId, DeviceStatus from iotHubInput
   ```

1. Configure `DeviceId,DeviceStatus` as property columns in the output.

   :::image type="content" source="media/event-hubs-output/property-columns.png" alt-text="Property columns":::

The following image is of the expected output message properties inspected in an event hub using [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer).

:::image type="content" source="media/event-hubs-output/custom-properties.png" alt-text="Event custom properties":::

## Exactly Once Delivery

Exactly once delivery is supported in Event Hubs output by default. Regardless of your input, Stream Analytics guarantees no data loss or no duplicates in an Event Hubs output, across user-initiated restarts from last output time, preventing duplicates from being produced. This greatly simplifies the streaming pipeline by not having to monitor, implement, and troubleshoot deduplication logic.


## Next steps

* [Use managed identities to access an event hub from an Azure Stream Analytics job (Preview)](event-hubs-managed-identity.md)
* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
