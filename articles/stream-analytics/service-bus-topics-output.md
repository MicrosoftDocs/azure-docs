---
title: Service Bus topics output from Azure Stream Analytics
description: This article describes Service Bus topics as output for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 09/23/2020
---

# Service Bus Topics output from Azure Stream Analytics

Service Bus queues provide a one-to-one communication method from sender to receiver. [Service Bus topics](/previous-versions/azure/hh367516(v=azure.100)) provide a one-to-many form of communication.

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
| System Property columns | Optional. Key value pairs of System Properties and corresponding column names that need to be attached to the outgoing message instead of the payload. |

The number of partitions is [based on the Service Bus SKU and size](../service-bus-messaging/service-bus-partitioning.md). The partition key is a unique integer value for each partition.

## Partitioning

Partitioning is automatically chosen. The number of partitions is based on the [Service Bus SKU and size](../service-bus-messaging/service-bus-partitioning.md). The partition key is a unique integer value for each partition. The number of output writers is the same as the number of partitions in the output topic.

## Output batch size

The maximum message size is 256 KB per message for Standard tier and 1MB for Premium tier. For more information, see [Service Bus limits](../service-bus-messaging/service-bus-quotas.md). To optimize, use a single event per message.

## Custom metadata properties for output

You can attach query columns as user properties to your outgoing messages. These columns don't go into the payload. The properties are present in the form of a dictionary on the output message. *Key* is the column name and *value* is the column value in the properties dictionary. All Stream Analytics data types are supported except Record and Array.

In the following example, the fields `DeviceId` and `DeviceStatus` are added to the metadata.

1. Use the following query:

   ```sql
   select *, DeviceId, DeviceStatus from iotHubInput
   ```

1. Configure `DeviceId,DeviceStatus` as property columns in the output.

   :::image type="content" source="media/service-bus-topics-output/property-columns.png" alt-text="Property columns":::

The following image is of the expected output message properties inspected in EventHub using [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer).

:::image type="content" source="media/service-bus-topics-output/custom-properties.png" alt-text="Event custom properties":::

## System properties

You can attach query columns as [system properties](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage#properties) to your outgoing service bus Queue or Topic messages. 
These columns don't go into the payload instead the corresponding BrokeredMessage [system property](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage#properties) is populated with the query column values.
These system properties are supported - `MessageId, ContentType, Label, PartitionKey, ReplyTo, SessionId, CorrelationId, To, ForcePersistence, TimeToLive, ScheduledEnqueueTimeUtc`.

String values of these columns are parsed as corresponding system property value type and any parsing failures are treated as data errors.
This field is provided as a JSON object format. Details about this format are as follows:

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

## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Quickstart: Create an Azure Stream Analytics job using the Azure CLI](quick-create-azure-cli.md)
* [Quickstart: Create an Azure Stream Analytics job by using an ARM template](quick-create-azure-resource-manager.md)
* [Quickstart: Create a Stream Analytics job using Azure PowerShell](stream-analytics-quick-create-powershell.md)
* [Quickstart: Create an Azure Stream Analytics job by using Visual Studio](stream-analytics-quick-create-vs.md)
* [Quickstart: Create an Azure Stream Analytics job in Visual Studio Code](quick-create-visual-studio-code.md)