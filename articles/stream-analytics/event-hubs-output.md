---
title: Event Hubs output from Azure Stream Analytics
description: This article describes data output options available in Azure Stream Analytics, including Power BI for analysis results.
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/8/2020
---
# Event Hubs output from Azure Stream Analytics

The [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/) service is a highly scalable publish-subscribe event ingestor. It can collect millions of events per second. One use of an event hub as output is when the output of a Stream Analytics job becomes the input of another streaming job. For information about the maximum message size and batch size optimization, see the [output batch size](#output-batch-size) section.

You need a few parameters to configure data streams from event hubs as an output.

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
| Azure Event Hubs | Yes | Yes | Varies depending on partition alignment.<br /> When the partition key for event hub output is equally aligned with the upstream (previous) query step, the number of writers is the same as the number of partitions in event hub output. Each writer uses the [EventHubSender class](/dotnet/api/microsoft.servicebus.messaging.eventhubsender?view=azure-dotnet) to send events to the specific partition. <br /> When the partition key for event hub output is not aligned with the upstream (previous) query step, the number of writers is the same as the number of partitions in that prior step. Each writer uses the [SendBatchAsync class](/dotnet/api/microsoft.servicebus.messaging.eventhubclient.sendasync?view=azure-dotnet) in **EventHubClient** to send events to all the output partitions. |
## Output batch size
| Azure Event Hubs    | 256 KB or 1 MB per message. <br />See [Event Hubs limits](../event-hubs/event-hubs-quotas.md). |    When input/output partitioning isn't aligned, each event is packed individually in `EventData` and sent in a batch of up to the maximum message size. This also happens if [custom metadata properties](#custom-metadata-properties-for-output) are used. <br /><br />  When input/output partitioning is aligned, multiple events are packed into a single `EventData` instance, up to the maximum message size, and sent.    |

## Custom metadata properties for output 

You can attach query columns as user properties to your outgoing messages. These columns don't go into the payload. The properties are present in the form of a dictionary on the output message. *Key* is the column name and *value* is the column value in the properties dictionary. All Stream Analytics data types are supported except Record and Array.  

Supported outputs: 
* Service Bus queue 
* Service Bus topic 
* Event hub 

In the following example, we add the two fields `DeviceId` and `DeviceStatus` to the metadata. 
* Query: `select *, DeviceId, DeviceStatus from iotHubInput`
* Output configuration: `DeviceId,DeviceStatus`

![Property columns](./media/stream-analytics-define-outputs/10-stream-analytics-property-columns.png)

The following screenshot shows output message properties inspected in EventHub through [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer).

![Event custom properties](./media/stream-analytics-define-outputs/09-stream-analytics-custom-properties.png)