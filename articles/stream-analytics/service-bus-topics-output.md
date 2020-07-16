---
title: Service Bus topics output from Azure Stream Analytics
description: This article describes data output options available in Azure Stream Analytics, including Power BI for analysis results.
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 07/15/2020
---

## Service Bus Topics output from Azure Stream Analytics

Service Bus queues provide a one-to-one communication method from sender to receiver. [Service Bus topics](https://msdn.microsoft.com/library/azure/hh367516.aspx) provide a one-to-many form of communication.

The following table lists the property names and their descriptions for creating a Service Bus topic output.

| Property name | Description |
| --- | --- |
| Output alias |A friendly name used in queries to direct the query output to this Service Bus topic. |
| Service Bus namespace |A container for a set of messaging entities. When you created a new event hub, you also created a Service Bus namespace. |
| Topic name |Topics are messaging entities, similar to event hubs and queues. They're designed to collect event streams from devices and services. When a topic is created, it's also given a specific name. The messages sent to a topic aren't available unless a subscription is created, so ensure there's one or more subscriptions under the topic. |
| Topic policy name |When you create a Service Bus topic, you can also create shared access policies on the topic's **Configure** tab. Each shared access policy has a name, permissions that you set, and access keys. |
| Topic policy key |The shared access key that's used to authenticate access to the Service Bus namespace. |
| Event serialization format |The serialization format for output data. JSON, CSV, and Avro are supported. |
| Encoding |If you're using CSV or JSON format, an encoding must be specified. UTF-8 is the only supported encoding format at this time. |
| Delimiter |Applicable only for CSV serialization. Stream Analytics supports a number of common delimiters for serializing data in CSV format. Supported values are comma, semicolon, space, tab, and vertical bar. |
| Property columns | Optional. Comma-separated columns that need to be attached as user properties of the outgoing message instead of the payload. More information about this feature is in the section [Custom metadata properties for output](#custom-metadata-properties-for-output). |
| System Property columns | Optional. Key value pairs of System Properties and corresponding column names that need to be attached to the outgoing message instead of the payload. More information about this feature is in the section [System properties for Service Bus Queue and Topic outputs](#system-properties-for-service-bus-queue-and-topic-outputs) |

The number of partitions is [based on the Service Bus SKU and size](../service-bus-messaging/service-bus-partitioning.md). The partition key is a unique integer value for each partition.

## Partitioning
| Azure Service Bus topic | Yes | Automatically chosen. The number of partitions is based on the [Service Bus SKU and size](../service-bus-messaging/service-bus-partitioning.md). The partition key is a unique integer value for each partition.| Same as the number of partitions in the output topic.  |
## Output batch size
| Azure Service Bus topic | 256 KB per message for Standard tier, 1MB for Premium tier.<br /> See [Service Bus limits](../service-bus-messaging/service-bus-quotas.md). | Use a single event per message. |

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

## System properties for Service Bus Queue and Topic outputs 
You can attach query columns as [system properties](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.brokeredmessage?view=azure-dotnet#properties) to your outgoing service bus Queue or Topic messages. 
These columns don't go into the payload instead the corresponding BrokeredMessage [system property](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.brokeredmessage?view=azure-dotnet#properties) is populated with the query column values.
These system properties are supported - `MessageId, ContentType, Label, PartitionKey, ReplyTo, SessionId, CorrelationId, To, ForcePersistence, TimeToLive, ScheduledEnqueueTimeUtc`.
String values of these columns are parsed as corresponding system property value type and any parsing failures are treated as data errors.
This field is provided as a JSON object format. Details about this format are as follows -
* Surrounded by curly braces {}.
* Written in key/value pairs.
* Keys and values must be strings.
* Key is the system property name and value is the query column name.
* Keys and values are separated by a colon.
* Each key/value pair is separated by a comma.

This shows how to use this property –

* Query: `select *, column1, column2 INTO queueOutput FROM iotHubInput`
* System Property Columns:
`{ "MessageId": "column1", "PartitionKey": "column2"}`

This sets the `MessageId` on service bus queue messages with `column1`'s values and PartitionKey is set with `column2`'s values.