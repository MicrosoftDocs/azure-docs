---
title: Configure a pipeline data source stage
description: Configure a pipeline data source stage to read messages from an Azure IoT MQ for processing.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: how-to
ms.date: 09/19/2023

#CustomerIntent: As an operator, I want to configure an Azure IoT Data Processor pipeline data source stage so that I can read messages from Azure IoT MQ for processing.
---

# Configure a pipeline data source stage

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The source stage is the first and required stage in a data processor pipeline. The source stage gets data into the data processing pipeline and prepares it for further processing. In the source stage, you define connection details to the data source and establish a partitioning configuration based on your specific data processing requirements. This stage helps you get data into the pipeline and prepare it for further processing.

## Prerequisites

- A functioning instance of Data Processor Preview is deployed.
- An instance of the Azure IoT MQ Preview broker is operational with all necessary raw data available.
- Basic knowledge of MQ and the corresponding MQTT topic structure.

## Configure the data source

To configure the data source:

- Provide connection details to the data source. This configuration includes the type of the data source, the MQTT broker URL, the Quality of Service (QoS) level, the session type, and the topics to subscribe to.
- Specify the authentication method. Currently limited to username/password-based authentication.

The following table describes the data source configuration parameters:

| Field | Description | Required | Default | Example |
|----|---|---|---|---|
| Name | A customer-visible name for the source stage. | Required | NA | `asset-1broker` |
| Description | A customer-visible description of the source stage. | Optional | NA | `brokerforasset-1`|
| Broker | The URL of the MQTT broker | Required | NA | `mqtt://127.0.0.1:1883` |
| Authentication | Authentication method to subscribe to E4K topics | Optional | Username Password | Username Password |
| Username | The username for the username/password authentication | Optional | NA | `username` |
| Password | The password for the username/password authentication | Optional | NA | `password` |
| QoS | QoS level for message delivery. | Required | 1 | 0 |
| Clean session (Non-persistent)| Parameter to establish a persistent session with the E4K broker. | Required | `FALSE` | `FALSE` |
| Topics | The topics to subscribe to for data acquisition. | Required | NA | `contoso/site1/asset1`, `contoso/site1/asset2` |

> [!NOTE]
> For a persistent session `Clean Session` must be `FALSE`. The current release of data processor supports persistent sessions with the MQTT broker.

The data processor doesn't reorder out-of-order data coming from the MQTT broker. If the data is received out of order from the broker, it remains so in the pipeline.

## Select the data format

In a Data Processor pipeline, the [format](concept-supported-formats.md) field in the source stage specifies how to deserialize the incoming data. By default, the data processor uses the `raw` format that means it doesn't convert the incoming data. To use many Data Processor features such as `Filter` or `Enrich` stages in a pipeline, you must deserialize your data in the input stage. You can choose to deserialize your incoming data from `JSON`, `jsonStream`, `MessagePack`, `CBOR`, `CSV`, or `Protobuf` formats into a Data Processor readable message in order to use the full data processor functionality.

The following tables describe the different deserialization configuration options:

| Field | Description | Required | Default | Value |
|---|---|---|---|---|
| Data Format | The type of the data format. | Yes | `Raw` | `Raw` `JSON` `jsonStream` `MessagePack` `CBOR` `CSV` `Protobuf` |

The `Data Format` field is mandatory and its value determines the other required fields.

To deserialize CSV messages, you also need to specify the following fields:

| Field | Description | Required | Value | Example |
|----|---|---|---|---|
| Header | Whether the CSV data includes a header line. | Yes | `Yes` `No` | `No` |
| Name | Name of the column in CSV | Yes | - | `temp`, `asset` |
| Path | The [jq path](concept-jq-path.md) in the message where the column information is added. | No | - | The default jq path is the column name |
| Data Type | The data type of the data in the column and how it's represented inside the data processor. | No | `String`, `Float`, `Integer`, `Boolean`, `Bytes` | Default: `String` |

To deserialize Protobuf messages, you also need to specify the following fields:

| Field | Description | Required | Value | Example |
|---|---|---|---|---|
| Descriptor | The base64-encoded descriptor for the protobuf definition. | Yes | - | `Zhf...` |
| Message | The name of the message type that's used to format the data. | Yes | - | `pipeline` |
| Package | The name of the package in the descriptor where the type is defined. | Yes | - | `schedulerv1` |

> [!NOTE]
> Data Processor supports only one message type in each **.proto** file.

## Configure partitioning

Partitioning in a pipeline divides the incoming data into separate partitions. Partitioning enables data parallelism in the pipeline, which can improve throughput and reduce latency. Partitioning strategies affect how the data is processed in the other stages of the pipeline. For example, the last known value stage and aggregate stage operate on each logical partition.

To partition your data, specify a partitioning strategy and the number of partitions to use:

| Field | Description | Required | Default | Example |
| ----- | ----------- | -------- | ------- | ------- |
| Partition type | The type of partitioning to be used: Partition `id` or Partition `key` | Required | `key` | `key` |
| Partition expression | The [jq expression](concept-jq-expression.md) to use on the incoming message to compute  the partition `id` or partition `key` | Required | N/A | `.topic` |
| Number of partitions| The number of partitions in a data processor pipeline. | Required | N/A | `3` |

## Related content

- [Serialization and deserialization formats](concept-supported-formats.md)
- [What is partitioning?](concept-partitioning.md)
