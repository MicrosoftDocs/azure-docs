---
title: Track last known values in a pipeline
description: Configure a last known value pipeline stage to track and maintain up to date and complete data in a Data Processor pipeline.
author: dominicbetts
ms.author: dobett
ms.subservice: data-processor
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/09/2023

#CustomerIntent: As an operator, I want to track and maintain last known values for data in a pipeline so that I can create complete records by filling in missing values with last known values.
---

# Use last known values in a pipeline

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use the last known value (LKV) stage in a data processor pipeline to maintain an up-to-date and complete record of your data. The LKV stage tracks the latest values of key-value pairs for messages in the pipeline. The stage can then enrich messages by using the tracked LKV values. Last known value tracking and enrichment are important for downstream processes that rely on:

- Multiple time-series data points at a specific timestamp.
- Payloads that always have a value for a particular key.

In a data processing pipeline, the LKV stage is an optional stage. When you use the LKV stage, you can:

- Add multiple LKV stages to a pipeline. Each LKV stage can track multiple values.
- Enrich messages with the stored LKV values, ensuring the data remains complete and comprehensive.
- Keep LKVs updated automatically with the latest values from the incoming messages.
- Track LKVs separately for each [logical partition](concept-partitioning.md). The LKV stage operates independently in each logical partition.
- Configure the expiration time for each tracked LKV to manage the duration for it remains valid. This control helps to ensure that messages aren't enriched with stale values.

The LKV stage maintains chronological data integrity. The stage ensures that messages with earlier timestamps don't override or replace LKVs with messages that have later timestamps.

The LKV stage enriches incoming messages with the last known values it tracks. These enriched values represent previously recorded data, and aren't necessarily the current real-time values. Be sure that this behavior aligns with your data processing expectations.

## Prerequisites

To configure and use an aggregate pipeline stage, you need a deployed instance of Azure IoT Data Processor (preview).

## Configure the stage

The LKV stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab:

| Field | Description | Required | Default | Example |
|---|---|---|---|---|
| Name | User defined name for the stage. | Yes | - | `lkv1` |
| Description | User defined description for the stage. | No |  - | `lkv1` |
| Properties&nbsp;>&nbsp;Input path | The [path](concept-configuration-patterns.md#path) of the key to track. | Yes | - | `.payload.temperature` |
| Properties&nbsp;>&nbsp;Output path | The [path](concept-configuration-patterns.md#path) to the location in the output message to write the LKV. | Yes | - | `.payload.temperature_lkv` |
| Properties&nbsp;>&nbsp;Expiration time | Tracked LKVs are valid only for user-defined time interval, after which the output message isn't enriched with the stored value. Expiration is tracked for each LKV key. | No | - | `10h` |
| Properties&nbsp;>&nbsp;Timestamp Path | The [path](concept-configuration-patterns.md#path) to the location in the output message to write the timestamp of when the LKV was last updated. | No | False | - |

If you include the timestamp path, it helps you to understand precisely when the LKVs were recorded and enhances transparency and traceability.

### `inputPath` equals `outputPath`

The outgoing message is either the actual message value, or LKV if the tracked key is missing from the message payload. Any incoming value takes priority and the stage doesn't override it with an LKV. To identify whether the message value is an LKV value, use the timestamp path. The timestamp path is only included in the outgoing message if the value in the message is the tracked LKV.

### `inputPath` isn't equal to `outputPath`

The stage writes the LKV to the `outputPath` for all the incoming messages. Use this configuration to track the difference between values in subsequent message payloads.

## Sample configuration

The following example shows a sample message for the LKV stage with the message arriving at 10:02 and with a payload that contains the tracked `.payload.temperature` LKV value:

```json
{ 
  { 
    "systemProperties":{ 
        "partitionKey":"pump", 
        "partitionId":5, 
        "timestamp":"2023-01-11T10:02:07Z" 
    }, 
    "qos":1, 
    "topic":"/assets/pump/#" 
    }, 
    "payload":{ 
        "humidity": 10, 
        "temperature":250, 
        "pressure":30, 
        "runningState": true 
    } 
} 
```

LKV configuration:

| Field  | Value |
|---|---|
| Input Path* | `.payload.temperature` |
| Output Path | `.payload.lkvtemperature` |
| Expiration time | `10h` |
| Timestamp Path| `.payload.lkvtemperature_timestamp` |

The tracked LKV values are:

- `.payload.temperature` is 250.
- Timestamp of the LKV is `2023-01-11T10:02:07Z`

For a message that arrives at 11:05 with a payload that doesn't have the temperature property, the LKV stage enriches the message with the tracked values:

Example input to LKV stage at 11:05:

```json
{ 
    "systemProperties":{ 
        "partitionKey":"pump", 
        "partitionId":5, 
        "timestamp":"2023-01-11T11:05:00Z" 
    }, 
    "qos":1, 
    "topic":"/assets/pump/#" 
    }, 
    "payload":{ 
        "runningState": true 
    } 
} 
```

Example output from LKV stage at 11:05:

```json
{ 
    "systemProperties":{ 
        "partitionKey":"pump", 
        "partitionId":5, 
        "timestamp":"2023-01-11T11:05:00Z" 
    }, 
    "qos":1, 
    "topic":"/assets/pump/#" 
    }, 
    "payload":{ 
        "lkvtemperature":250, 
        "lkvtemperature_timestamp"":"2023-01-11T10:02:07Z" 
        "runningState": true 
    } 
} 
```

## Related content

- [Aggregate data in a pipeline](howto-configure-aggregate-stage.md)
- [Enrich data in a pipeline](howto-configure-enrich-stage.md)
- [Filter data in a pipeline](howto-configure-filter-stage.md)
- [Call out to a gRPC endpoint from a pipeline](howto-configure-grpc-callout-stage.md)
- [Call out to an HTTP endpoint from a pipeline](howto-configure-http-callout-stage.md)
- [Transform data in a pipeline](howto-configure-transform-stage.md)
