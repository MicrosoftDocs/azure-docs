---
title: Service Bus queues output from Azure Stream Analytics
description: This article describes Service Bus queues as output for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 09/23/2020
---

# Service Bus queues output from Azure Stream Analytics

[Service Bus queues](../service-bus-messaging/service-bus-queues-topics-subscriptions.md) offer a FIFO message delivery to one or more competing consumers. Typically, messages are received and processed by the receivers in the temporal order in which they were added to the queue. Each message is received and processed by only one message consumer.

In [compatibility level 1.2](stream-analytics-compatibility-level.md), Azure Stream Analytics uses [Advanced Message Queueing Protocol (AMQP)](../service-bus-messaging/service-bus-amqp-overview.md) messaging protocol to write to Service Bus Queues and Topics. AMQP enables you to build cross-platform, hybrid applications using an open standard protocol.

## Output configuration

The following table lists the property names and their descriptions for creating a queue output.

| Property name | Description |
| --- | --- |
| Output alias |A friendly name used in queries to direct the query output to this Service Bus queue. |
| Service Bus namespace |A container for a set of messaging entities. |
| Queue name |The name of the Service Bus queue. |
| Queue policy name |When you create a queue, you can also create shared access policies on the queue's **Configure** tab. Each shared access policy has a name, permissions that you set, and access keys. |
| Queue policy key |The shared access key that's used to authenticate access to the Service Bus namespace. |
| Event serialization format |The serialization format for output data. JSON, CSV, and Avro are supported. |
| Encoding |For CSV and JSON, UTF-8 is the only supported encoding format at this time. |
| Delimiter |Applicable only for CSV serialization. Stream Analytics supports a number of common delimiters for serializing data in CSV format. Supported values are comma, semicolon, space, tab, and vertical bar. |
| Format |Applicable only for JSON type. **Line separated** specifies that the output is formatted by having each JSON object separated by a new line. If you select **Line separated**, the JSON is read one object at a time. The whole content by itself would not be a valid JSON. **Array** specifies that the output is formatted as an array of JSON objects. |
| Property columns | Optional. Comma-separated columns that need to be attached as user properties of the outgoing message instead of the payload. More information about this feature is in the section [Custom metadata properties for output](#custom-metadata-properties-for-output). |
| System Property columns | Optional. Key value pairs of System Properties and corresponding column names that need to be attached to the outgoing message instead of the payload.  |

The number of partitions is [based on the Service Bus SKU and size](../service-bus-messaging/service-bus-partitioning.md). Partition key is a unique integer value for each partition.

## Partitioning

Partitioning is automatically chosen. The number of partitions is based on the [Service Bus SKU and size](../service-bus-messaging/service-bus-partitioning.md). The partition key is a unique integer value for each partition. The number of output writers is the same as the number of partitions in the output queue.

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

   :::image type="content" source="media/service-bus-queues-output/property-columns.png" alt-text="Property columns":::

The following image is of the expected output message properties inspected in EventHub using [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer).

:::image type="content" source="media/service-bus-queues-output/custom-properties.png" alt-text="Event custom properties":::

## System properties

You can attach query columns as [system properties](/dotnet/api/azure.messaging.servicebus.servicebusmessage#properties) to your outgoing service bus Queue or Topic messages.

These columns don't go into the payload instead the corresponding ServiceBusMessage [system property](/dotnet/api/azure.messaging.servicebus.servicebusmessage#properties) is populated with the query column values.
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