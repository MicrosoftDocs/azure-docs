---
title: Configure a pipeline MQ source stage
description: Configure a pipeline source stage to read messages from an Azure IoT MQ topic for processing. The source stage is the first stage in a Data Processor pipeline.
author: dominicbetts
ms.author: dobett
ms.subservice: data-processor
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/23/2023

#CustomerIntent: As an operator, I want to configure an Azure IoT Data Processor pipeline MQ source stage so that I can read messages from Azure IoT MQ for processing.
---

# Configure a pipeline MQ source stage

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The source stage is the first and required stage in an Azure IoT Data Processor (preview) pipeline. The source stage gets data into the data processing pipeline and prepares it for further processing. The MQ source stage lets you subscribe to messages from an MQTT topic. In the source stage, you define connection details to the MQ source and establish a partitioning configuration based on your specific data processing requirements.

## Prerequisites

- A functioning instance of Data Processor is deployed.
- An instance of the Azure IoT MQ Preview broker with all necessary raw data available is operational and reachable.

## Configure the MQ source

To configure the MQ source:

- Provide connection details to the MQ source. This configuration includes the type of the MQ source, the MQTT broker URL, the Quality of Service (QoS) level, the session type, and the topics to subscribe to.
- Specify the authentication method. Currently limited to username/password-based authentication or service account token.

The following table describes the MQ source configuration parameters:

| Field | Description | Required | Default | Example |
|----|---|---|---|---|
| Name | A customer-visible name for the source stage. | Required | NA | `asset-1broker` |
| Description | A customer-visible description of the source stage. | Optional | NA | `brokerforasset-1`|
| Broker | The URL of the MQTT broker to connect to. | Required | NA | `tls://aio-mq-dmqtt-frontend:8883` |
| Authentication | The authentication method to connect to the broker. One of: `None`, `Username/Password`, and `Service Account Token (SAT)`. | Required | `Service Account Token (SAT)` | `Service Account Token (SAT)` |
| Username/Password > Username | The username for the username/password authentication | Yes | NA | `myuser` |
| Username/Password > Secret | Reference to the password stored in Azure Key Vault. | Yes | NA | `AKV_USERNAME_PASSWORD` |
| QoS | QoS level for message delivery. | Required | 1 | 0 |
| Clean session | Set to `FALSE` for a persistent session. | Required | `FALSE` | `FALSE` |
| Topic | The topic to subscribe to for data acquisition. | Required | NA | `contoso/site1/asset1`, `contoso/site1/asset2` |

To learn more about secrets, see [Manage secrets for your Azure IoT Operations deployment](../deploy-iot-ops/howto-manage-secrets.md).

Data Processor doesn't reorder out-of-order data coming from the MQTT broker. If the data is received out of order from the broker, it remains so in the pipeline.

## Select data format

[!INCLUDE [data-processor-data-format](../includes/data-processor-data-format.md)]

## Configure partitioning

[!INCLUDE [data-processor-configure-partition](../includes/data-processor-configure-partition.md)]

| Field | Description | Required | Default | Example |
| ----- | ----------- | -------- | ------- | ------- |
| Partition type | The type of partitioning to be used: Partition `ID` or Partition `Key` | Required | `Key` | `Key` |
| Partition expression | The [jq expression](../process-data/concept-jq-expression.md) to use on the incoming message to compute the partition `ID` or partition `Key` | Required | `.topic` | `.topic` |
| Number of partitions| The number of partitions in a Data Processor pipeline. | Required | `2` | `2` |

Data Processor adds additional metadata to the incoming message. See [Data Processor message structure overview](concept-message-structure.md) to understand how to correctly specify the partitioning expression that runs on the incoming message. By default, the partitioning expression is set to `0` with the **Partition type** as `ID` to send all the incoming data to a single partition.

For recommendations and to learn more, see [What is partitioning?](../process-data/concept-partitioning.md).

## Sample configuration

The following shows an example configuration for the stage:

| Parameter | Value |
| --------- | ----- |
| Name | `input data` |
| Broker | `tls://aio-mq-dmqtt-frontend:8883` |
| Authentication | `Service Account Token (SAT)` |
| Topic | `azure-iot-operations/data/opc.tcp/opc.tcp-1/#` |
| Data format | `JSON` |

This example shows the topic used in the [Quickstart: Use Data Processor pipelines to process data from your OPC UA assets](../get-started/quickstart-process-telemetry.md). This configuration then generates messages that look like the following example:

```json
{
    "Timestamp": "2023-08-10T00:54:58.6572007Z", 
    "MessageType": "ua-deltaframe",
    "payload": {
      "temperature": {
        "SourceTimestamp": "2023-08-10T00:54:58.2543129Z",
        "Value": 7109
      },
      "Tag 10": {
        "SourceTimestamp": "2023-08-10T00:54:58.2543482Z",
        "Value": 7109
      }
    },
    "DataSetWriterName": "oven",
    "SequenceNumber": 4660
}
```

## Related content

- [Serialization and deserialization formats](concept-supported-formats.md)
- [What is partitioning?](concept-partitioning.md)
