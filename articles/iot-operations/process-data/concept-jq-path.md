---
title: Data Processor jq path expressions
description: Understand the jq path expressions used by Azure IoT Data Processor to reference parts of a message.
author: dominicbetts
ms.author: dobett
ms.subservice: data-processor
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.custom:
  - ignite-2023
ms.date: 09/07/2023

#CustomerIntent: As an operator, I want understand how to reference parts of a message so that I can configure pipeline stages.
---

# What are jq path expressions?

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Many pipeline stages in Azure IoT Data Processor (preview) make use of _jq path_ expressions. Whenever you need to retrieve information from a message or to place some information into a message, you use a path. jq paths let you:

- Locate a piece of information in a message.
- Identify where to place a piece of information into a message.

Both cases use the same syntax and specify locations relative to the root of the message structure.

The jq paths supported by Data Processor are syntactically correct for [jq](https://jqlang.github.io/jq/), but have simplified semantics to make the them easier to use and to help reduce errors in the Data Processor pipleline. In particular, Data Processor doesn't use the `?` syntax to suppress errors for misaligned data structures. Those errors are automatically suppressed for you when working with paths.

Examples of data access within a data processor pipeline include the `inputPath` in the [aggregate](howto-configure-aggregate-stage.md) and [last known value](howto-configure-lkv-stage.md) stages. Use the data access pattern whenever you need to access some data within a data processor message.

Data update uses the same syntax as data access, but there are some special behaviors in specific update scenarios. Examples of data update within a data processor pipeline include the `outputPath` in the [aggregate](howto-configure-aggregate-stage.md) and [last known value](howto-configure-lkv-stage.md) pipeline stages. Use the data update pattern whenever you need to place the result of an operation into the Data Processor message.

> [!NOTE]
> A data processor message contains more than just the body of your message. A data processor message includes any properties and metadata that you sent and other relevant system information. The primary payload containing the data sent into the processing pipeline is placed in a `payload` field at the root of the message. This is why many of the examples in this guide include paths that start with `.payload`.

## Syntax

Every jq path consists of a sequence of one or more of the following segments:

- The root path: `.`.
- A field in a map or object that uses one of:
  - `.<identifier>` for alphanumeric object keys. For example, `.temperature`.
  - `."<identifier>"` for arbitrary object keys. For example, `."asset-id"`.
  - `["<identifier>"]` or arbitrary object keys. For example, `["asset-id"]`.
- An array index: `[<index>]`. For example,`[2]`.

Paths must always start with a `.`. Even if you have an array or complex map key at the beginning of your path, there must be a `.` that precedes it. The paths `.["complex-key"]` and `.[1].value` are valid. The paths `["complex-key"]` and `[1].value` are invalid.

## Example message

The following data access and data update examples use the following message to illustrate the use of different path expressions:

```json
{
  "systemProperties": {
    "partitionKey": "slicer-3345",
    "partitionId": 5,
    "timestamp": "2023-01-11T10:02:07Z"
  },
  "qos": 1,
  "topic": "assets/slicer-3345",
  "properties": {
    "responseTopic": "assets/slicer-3345/output",
    "contentType": "application/json"
  },
  "payload": {
    "Timestamp": 1681926048,
    "Payload": {
      "dtmi:com:prod1:slicer3345:humidity": {
        "sourceTimestamp": 1681926048,
        "value": 10
      },
      "dtmi:com:prod1:slicer3345:lineStatus": {
        "sourceTimestamp": 1681926048,
        "value": [1, 5, 2]
      },
      "dtmi:com:prod1:slicer3345:speed": {
        "sourceTimestamp": 1681926048,
        "value": 85
      },
      "dtmi:com:prod1:slicer3345:temperature": {
        "sourceTimestamp": 1681926048,
        "value": 46
      }
    },
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092
  }
}
```

## Root path for data access

The most basic path is the root path, which points to the root of the message and returns the entire message. Given the following jq path:

```jq
.
```

The result is:

```json
{
  "systemProperties": {
    "partitionKey": "slicer-3345",
    "partitionId": 5,
    "timestamp": "2023-01-11T10:02:07Z"
  },
  "qos": 1,
  "topic": "assets/slicer-3345",
  "properties": {
    "responseTopic": "assets/slicer-3345/output",
    "contentType": "application/json"
  },
  "payload": {
    "Timestamp": 1681926048,
    "Payload": {
      "dtmi:com:prod1:slicer3345:humidity": {
        "sourceTimestamp": 1681926048,
        "value": 10
      },
      "dtmi:com:prod1:slicer3345:lineStatus": {
        "sourceTimestamp": 1681926048,
        "value": [1, 5, 2]
      },
      "dtmi:com:prod1:slicer3345:speed": {
        "sourceTimestamp": 1681926048,
        "value": 85
      },
      "dtmi:com:prod1:slicer3345:temperature": {
        "sourceTimestamp": 1681926048,
        "value": 46
      }
    },
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092
  }
}
```

## Simple identifier for data access

The next simplest path involves a single identifier, in this case the `payload` field. Given the following jq path:

```jq
.payload
```

> [!TIP]
> `."payload"` and `.["payload"]` are also valid ways to specify this path. However identifiers that only contain `a-z`, `A-Z`, `0-9` and `_` don't require the more complex syntax.

The result is:

```json
{
  "Timestamp": 1681926048,
  "Payload": {
    "dtmi:com:prod1:slicer3345:humidity": {
      "SourceTimestamp": 1681926048,
      "Value": 10
    },
    "dtmi:com:prod1:slicer3345:lineStatus": {
      "SourceTimestamp": 1681926048,
      "Value": [1, 5, 2]
    },
    "dtmi:com:prod1:slicer3345:speed": {
      "SourceTimestamp": 1681926048,
      "Value": 85
    },
    "dtmi:com:prod1:slicer3345:temperature": {
      "SourceTimestamp": 1681926048,
      "Value": 46
    }
  },
  "DataSetWriterName": "slicer-3345",
  "SequenceNumber": 461092
}
```

## Nested fields for data access

You can combine path segments to retrieve data nested deeply within the message, such as a single leaf value. Given either of the following two jq paths:

```jq
.payload.Payload.["dtmi:com:prod1:slicer3345:temperature"].Value
```

```jq
.payload.Payload."dtmi:com:prod1:slicer3345:temperature".Value
```

The result is:

```json
46
```

## Array elements for data access

Array elements work in the same way as map keys, except that you use a number in place a string in the`[]`. Given either of the following two jq paths:

```jq
.payload.Payload.["dtmi:com:prod1:slicer3345:lineStatus"].Value[1]
```

```jq
.payload.Payload."dtmi:com:prod1:slicer3345:lineStatus".Value[1]
```

The result is:

```json
5
```

## Nonexistent and invalid paths in data access

If a jq path identifies a location that doesn't exist or is incompatible with the structure of the message, then no value is returned.

> [!IMPORTANT]
> Some processing stages require some value to be present and may fail if no value is found. Others are designed to continue processing normally and either skip the requested operation or perform a different action if no value is found at the path.

Given the following jq path:

```jq
.payload[1].temperature
```

The result is:

No value

## Root path for data update

The most basic path is the root path, which points to the root of the message and replaces the entire message. Given the following new value to insert and jq path:

```json
{ "update": "data" }
```

```jq
.
```

The result is:

```json
{ "update": "data" }
```

Updates aren't deep merged with the previous data, but instead replace the data at the level where the update happens. To avoid overwriting data, scope your update to the finest-grained path you want to change or update a separate field to the side of your primary data.

## Simple identifier for data update

The next simplest path involves a single identifier, in this case the `payload` field. Given the following new value to insert and jq path:

```json
{ "update": "data" }
```

```jq
.payload
```

> [!TIP]
> `."payload"` and `.["payload"]` are also valid ways to specify this path. However identifiers that only contain `a-z`, `A-Z`, `0-9` and `_` don't require the more complex syntax.

The result is:

```json
{
  "systemProperties": {
    "partitionKey": "slicer-3345",
    "partitionId": 5,
    "timestamp": "2023-01-11T10:02:07Z"
  },
  "qos": 1,
  "topic": "assets/slicer-3345",
  "properties": {
    "responseTopic": "assets/slicer-3345/output",
    "contentType": "application/json"
  },
  "payload": { "update": "data" }
}
```

## Nested fields for data update

You can combine path segments to retrieve data nested deeply within the message, such as a single leaf value. Given the following new value to insert and either of the following two jq paths:

```json
{ "update": "data" }
```

```jq
.payload.Payload.["dtmi:com:prod1:slicer3345:temperature"].Value
```

```jq
.payload.Payload."dtmi:com:prod1:slicer3345:temperature".Value
```

The result is:

```json
{
  "systemProperties": {
    "partitionKey": "slicer-3345",
    "partitionId": 5,
    "timestamp": "2023-01-11T10:02:07Z"
  },
  "qos": 1,
  "topic": "assets/slicer-3345",
  "properties": {
    "responseTopic": "assets/slicer-3345/output",
    "contentType": "application/json"
  },
  "payload": {
    "Timestamp": 1681926048,
    "Payload": {
      "dtmi:com:prod1:slicer3345:humidity": {
        "sourceTimestamp": 1681926048,
        "value": 10
      },
      "dtmi:com:prod1:slicer3345:lineStatus": {
        "sourceTimestamp": 1681926048,
        "value": [1, 5, 2]
      },
      "dtmi:com:prod1:slicer3345:speed": {
        "sourceTimestamp": 1681926048,
        "value": 85
      },
      "dtmi:com:prod1:slicer3345:temperature": {
        "sourceTimestamp": 1681926048,
        "value": { "update": "data" }
      }
    },
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092
  }
}
```

## Array elements for data update

Array elements work in the same way as map keys, except that you use a number in place a string in the`[]`. Given the following new value to insert and either of the following two jq paths:

```json
{ "update": "data" }
```

```jq
.payload.Payload.["dtmi:com:prod1:slicer3345:lineStatus"].Value[1]
``````

```jq
.payload.Payload."dtmi:com:prod1:slicer3345:lineStatus".Value[1]
```

The result is:

```json
{
  "systemProperties": {
    "partitionKey": "slicer-3345",
    "partitionId": 5,
    "timestamp": "2023-01-11T10:02:07Z"
  },
  "qos": 1,
  "topic": "assets/slicer-3345",
  "properties": {
    "responseTopic": "assets/slicer-3345/output",
    "contentType": "application/json"
  },
  "payload": {
    "Timestamp": 1681926048,
    "Payload": {
      "dtmi:com:prod1:slicer3345:humidity": {
        "sourceTimestamp": 1681926048,
        "value": 10
      },
      "dtmi:com:prod1:slicer3345:lineStatus": {
        "sourceTimestamp": 1681926048,
        "value": [1, { "update": "data" }, 2]
      },
      "dtmi:com:prod1:slicer3345:speed": {
        "sourceTimestamp": 1681926048,
        "value": 85
      },
      "dtmi:com:prod1:slicer3345:temperature": {
        "sourceTimestamp": 1681926048,
        "value": 46
      }
    },
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092
  }
}
```

## Nonexistent and type-mismatched paths in data update

If a jq path identifies a location that doesn't exist or is incompatible with the structure of the message, then the following semantics apply:

- If any segments of the path don't exist, they're created:
  - For object keys, the key is added to the object.
  - For array indexes, the array is lengthened with `null` values to make it long enough to have the required index, then the index is updated.
  - For negative array indexes, the same lengthening procedure happens, but then the first element is replaced.
- If a path segment has a different type than what it needs, the expression changes the type and discards any existing data at that path location.

The following examples use the same input message as the previous examples and insert the following new value:

```json
{ "update": "data" }
```

Given the following jq path:

```jq
.payload[1].temperature
```

The result is:

```json
{
  "systemProperties": {
    "partitionKey": "slicer-3345",
    "partitionId": 5,
    "timestamp": "2023-01-11T10:02:07Z"
  },
  "qos": 1,
  "topic": "assets/slicer-3345",
  "properties": {
    "responseTopic": "assets/slicer-3345/output",
    "contentType": "application/json"
  },
  "payload": [null, { "update": "data" }]
}
```

Given the following jq path:

```jq
.payload.nested.additional.data
```

The result is:

```json
{
  "systemProperties": {
    "partitionKey": "slicer-3345",
    "partitionId": 5,
    "timestamp": "2023-01-11T10:02:07Z"
  },
  "qos": 1,
  "topic": "assets/slicer-3345",
  "properties": {
    "responseTopic": "assets/slicer-3345/output",
    "contentType": "application/json"
  },
  "payload": {
    "Timestamp": 1681926048,
    "Payload": {
      "dtmi:com:prod1:slicer3345:humidity": {
        "sourceTimestamp": 1681926048,
        "value": 10
      },
      "dtmi:com:prod1:slicer3345:lineStatus": {
        "sourceTimestamp": 1681926048,
        "value": [1, 5, 2]
      },
      "dtmi:com:prod1:slicer3345:speed": {
        "sourceTimestamp": 1681926048,
        "value": 85
      },
      "dtmi:com:prod1:slicer3345:temperature": {
        "sourceTimestamp": 1681926048,
        "value": 46
      }
    },
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092,
    "nested": {
      "additional": {
        "data": { "update": "data" }
      }
    }
  }
}
```

Given the following jq path:

```jq
.systemProperties.partitionKey[-4]
```

The result is:

```json
{
  "systemProperties": {
    "partitionKey": [{"update": "data"}, null, null, null],
    "partitionId": 5,
    "timestamp": "2023-01-11T10:02:07Z"
  },
  "qos": 1,
  "topic": "assets/slicer-3345",
  "properties": {
    "responseTopic": "assets/slicer-3345/output",
    "contentType": "application/json"
  },
  "payload": {
    "Timestamp": 1681926048,
    "Payload": {
      "dtmi:com:prod1:slicer3345:humidity": {
        "sourceTimestamp": 1681926048,
        "value": 10
      },
      "dtmi:com:prod1:slicer3345:lineStatus": {
        "sourceTimestamp": 1681926048,
        "value": [1, 5, 2]
      },
      "dtmi:com:prod1:slicer3345:speed": {
        "sourceTimestamp": 1681926048,
        "value": 85
      },
      "dtmi:com:prod1:slicer3345:temperature": {
        "sourceTimestamp": 1681926048,
        "value": 46
      }
    },
    "DataSetWriterName": "slicer-3345",
    "SequenceNumber": 461092,
  }
```

## Related content

- [What is jq in Data Processor pipelines?](concept-jq.md)
- [jq expressions](concept-jq-expression.md)
