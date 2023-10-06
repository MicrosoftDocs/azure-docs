---
title: Publish data to an MQTT broker from a pipeline
description: Configure a pipeline destination stage to publish the pipeline output to an MQTT broker and make it available to other subscribers.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: how-to
ms.date: 10/09/2023

#CustomerIntent: As an operator, I want to publish data from a pipeline to an MQTT broker so that it's available to other subscribers including other data pipelines.
---


# Publish data to an MQTT broker

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use the _E4K_ destination to publish processed messages to an MQTT broker, such as an Azure IoT MQ instance, on the edge. The data processor connects to an MQTT broker by using MQTT v5.0. The destination publishes messages to the MQTT broker as the stage receives them. The E4K destination doesn't support batching.

## Prerequisites

To configure and use an Azure Data Explorer destination pipeline stage, you need a deployed instance of Data Processor Preview.

## Configure the destination stage

The E4K destination stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab:

| Field | Type | Description | Required | Default | Example |
| --- | --- | --- | --- | --- | --- |
| Name | String | A name to show in the data processor UI.  | Yes | -  | `MQTT broker output` |
| Description | String | A user-friendly description of what the stage does.  | No |  | `Write to topic default/topic1` |
| Broker | String | The broker address.  | Yes | - | `mqtt://mqttEndpoint.cluster.local:1111` |
| Topic | [Static/Dynamic](concept-configuration-patterns.md#static-and-dynamic-fields) | The topic definition. String if type is static, [jq path](concept-configuration-patterns.md#path) if type is dynamic.  | Yes | - | `".topic"` |
| Authentication<sup>1</sup> | String | The authentication details to connect to MQTT broker.  | Yes | Username/password | Username/password |
| Data Format<sup>2</sup> | String | The [format](concept-supported-formats.md) to serialize messages to. | Yes | - | `Raw` |

Authentication<sup>1</sup>: Currently, the data processor only supports password based authentication when it connects to an MQTT broker:

| Field | Description | Required |
| --- | --- | --- |
| Username  | The username of the MQTT broker  | Yes |
| Password | The password of the MQTT broker  | Yes |

You can select `none` if authentication isn't required.

Data format<sup>2</sup>: Use the data processor's built-in serializer to serialize your messages to the following [Formats](concept-supported-formats.md) before it publishes messages to the MQTT broker:

- `Raw`
- `JSON`
- `JSONStream`
- `CSV`
- `Protobuf`
- `MessagePack`
- `CBOR`

Select `Raw` when you don't require serialization. Raw sends the data to the MQTT broker in its current format.

## Related content

- [Send data to Azure Data Explorer](../connect-to-cloud/howto-configure-destination-data-explorer.md)
- [Send data to Microsoft Fabric](../connect-to-cloud/howto-configure-destination-fabric.md)
- [Send data to a gRPC endpoint](howto-configure-destination-grpc.md)
- [Send data to the reference data store](howto-configure-destination-reference-store.md)
