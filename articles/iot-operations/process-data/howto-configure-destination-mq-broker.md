---
title: Publish data to an MQTT broker from a pipeline
description: Configure a pipeline destination stage to publish the pipeline output to an MQTT broker and make it available to other subscribers.
author: dominicbetts
ms.author: dobett
ms.subservice: data-processor
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/09/2023

#CustomerIntent: As an operator, I want to publish data from a pipeline to an MQTT broker so that it's available to other subscribers including other data pipelines.
---


# Publish data to an MQTT broker

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use the _MQ_ destination to publish processed messages to an MQTT broker, such as an Azure IoT MQ instance, on the edge. The data processor connects to an MQTT broker by using MQTT v5.0. The destination publishes messages to the MQTT broker as the stage receives them. The MQ destination doesn't support batching.

## Prerequisites

To configure and use an Azure Data Explorer destination pipeline stage, you need a deployed instance of Azure IoT Data Processor (preview).

## Configure the destination stage

The MQ destination stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab:

| Field | Type | Description | Required | Default | Example |
| --- | --- | --- | --- | --- | --- |
| Name | String | A name to show in the Data Processor UI.  | Yes | -  | `MQTT broker output` |
| Description | String | A user-friendly description of what the stage does.  | No |  | `Write to topic default/topic1` |
| Broker | String | The broker address.  | Yes | - | `mqtt://mqttEndpoint.cluster.local:1111` |
| Authentication | String | The authentication details to connect to MQTT broker. `None`/`Username/Password`/`Service account token (SAT)`  | Yes | `Service account token (SAT)` | `Username/Password` |
| Username | String | The username to use when `Authentication` is set to `Username/Password`. | No | - | `myusername` |
| Password | String | The [secret reference](../deploy-iot-ops/howto-manage-secrets.md) for the password to use when `Authentication` is set to `Username/Password`. | No | - | `mysecret` |
| Topic | [Static/Dynamic](concept-configuration-patterns.md#static-and-dynamic-fields) | The topic definition. String if type is static, [jq path](concept-configuration-patterns.md#path) if type is dynamic.  | Yes | - | `".topic"` |
| Data Format<sup>1</sup> | String | The [format](concept-supported-formats.md) to serialize messages to. | Yes | - | `Raw` |

Data format<sup>1</sup>: Use Data Processor's built-in serializer to serialize your messages to the following [Formats](concept-supported-formats.md) before it publishes messages to the MQTT broker:

- `Raw`
- `JSON`
- `JSONStream`
- `CSV`
- `Protobuf`
- `MessagePack`
- `CBOR`

Select `Raw` when you don't require serialization. Raw sends the data to the MQTT broker in its current format.

## Sample configuration

The following JSON example shows a complete MQ destination stage configuration that writes the entire message to the MQ `pipelineOutput` topic:

```json
{
    "displayName": "MQ - 67e929",
    "type": "output/mqtt@v1",
    "viewOptions": {
        "position": {
            "x": 0,
            "y": 992
        }
    },
    "broker": "tls://aio-mq-dmqtt-frontend:8883",
    "qos": 1,
    "authentication": {
        "type": "serviceAccountToken"
    },
    "topic": {
        "type": "static",
        "value": "pipelineOutput"
    },
    "format": {
        "type": "json",
        "path": "."
    },
    "userProperties": []
}
```

The configuration defines that:

- Authentication is done by using service account token.
- The topic is a static string called `pipelineOutput`.
- The output format is `JSON`.
- The format path is `.` to ensure the entire data processor message is written to MQ. To write just the payload, change the path to ``.payload`.

### Example

The following example shows a sample input message to the MQ destination stage:

```json
{
  "payload": {
    "Batch": 102,
    "CurrentTemperature": 7109,
    "Customer": "Contoso",
    "Equipment": "Boiler",
    "IsSpare": true,
    "LastKnownTemperature": 7109,
    "Location": "Seattle",
    "Pressure": 7109,
    "Timestamp": "2023-08-10T00:54:58.6572007Z",
    "assetName": "oven"
  },
  "qos": 0,
  "systemProperties": {
    "partitionId": 0,
    "partitionKey": "quickstart",
    "timestamp": "2023-11-06T23:42:51.004Z"
  },
  "topic": "quickstart"
}
```

## Related content

- [Send data to Azure Data Explorer](../connect-to-cloud/howto-configure-destination-data-explorer.md)
- [Send data to Microsoft Fabric](../connect-to-cloud/howto-configure-destination-fabric.md)
- [Send data to a gRPC endpoint](howto-configure-destination-grpc.md)
- [Send data to the reference data store](howto-configure-destination-reference-store.md)
