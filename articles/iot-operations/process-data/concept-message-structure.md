---
title: Data Processor message structure overview
description: Understand the message structure used internally by Azure IoT Data Processor to represent messages as they move between pipeline stages.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: 09/07/2023

#CustomerIntent: As an operator, I want understand how internal messages in the data processor are structured so that I can configure pipelines and pipeline stages to process my telemetry.
---

# Data Processor Preview message structure overview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The Azure IoT Data Processor processes incoming messages by passing them through a series of pipeline stages. Each stage in the pipeline can transform the message before passing it to the next stage. This article describes the structure used to represent the messages as they move through the pipeline. Understanding the message structure is important when you configure pipeline stages to process your telemetry messages.

The following example shows the JSON representation of a message that was read from Azure IoT MQ Preview by a pipeline:

```json
{
    "systemProperties":{
        "partitionKey":"foo",
        "partitionId":5,
        "timestamp":"2023-01-11T10:02:07Z"
    },
    "qos":1,
    "topic":"/assets/foo/tags/bar",
    "properties":{
        "responseTopic":"outputs/foo/tags/bar",
        "contentType": "application/json",
        "payloadFormat":1,
        "correlationData":"base64::Zm9v",
        "messageExpiry":412
    },
    "userProperties":[
        {
            "key":"prop1",
            "value":"value1"
        },
        {
            "key":"prop2",
            "value":"value2"
        }
    ],
    "payload":
    { 
        "values":[ 
            { 
                "timeStamp":"2022-06-14T16:59:01Z", 
                "tag":"temperature", 
                "numVal":250
            }, 
            { 
                "timeStamp":"2022-06-14T16:59:01Z", 
                "tag":"pressure", 
                "numVal":30 
            }, 
            { 
                "timeStamp":"2022-06-14T16:59:01Z", 
                "tag":"humidity", 
                "numVal":10
            }, 
            { 
                "timeStamp":"2022-06-14T16:59:01Z", 
                "tag":"runningStatus", 
                "boolVal":true
            }
        ] 
    } 
}
```

## Data types

Data Processor messages support the following data types:

- Map
- Array
- Boolean
- Integer – 64-bit size
- Float – 64-bit size
- String
- Binary

## System data

All system level metadata is placed in the `systemProperties` node:

| Property      | Description | Type | Note |
|---------------|-------------|------|------|
| `timestamp`   | An RFC3339 UTC millisecond timestamp that represents the time the system received the message. | String | This field is always added at the input stage. |
| `partitionId` | The physical partition of the message. | Integer | This field is always added at the input stage. |
| `partitionKey` | The logical partition key defined at the input stage. | String | This field is only added if you defined a partition expression. |

## Payload

The payload section contains the primary contents of the incoming message. The content of `payload` section depends on the format chosen at the input stage of the pipeline:

- If you chose the `Raw` format in the input stage, the payload content is binary.
- If the input stage parses your data, the contents of the payload are represented accordingly.

By default, the pipeline doesn't parse the incoming payload. The previous example shows parsed input data. To learn more, see [Message formats](concept-supported-formats.md).

## Metadata

All metadata that's not part of the primary data becomes top-level properties within the message:

| Property | Description | Type | Note |
| -------- | ----------- | ---- | ---- |
| `topic`  | The topic the message is read from.   | String | This field is always added at the input.   |
| `qos`    | The quality of service level chosen at the input stage.  | Integer | This field is always added in the input stage.   |
| `packetId` | The packet ID of the message.  | Integer | This field is only added if the quality of service is `1` or `2`.   |
| `properties` | The logical partition key defined at the input stage.  | Map | The property bag is always added.  |
| `userProperties` | User defined properties.   | Array | The property bag is always added. The content can be empty if no user properties are present in the message.   |

<!-- TODO: Clarify with Mohsina how properties field works. -->

## Related content

- [Supported formats](concept-supported-formats.md)
- [What is partitioning?](concept-partitioning.md)
- [What are configuration patterns?](concept-configuration-patterns.md)
