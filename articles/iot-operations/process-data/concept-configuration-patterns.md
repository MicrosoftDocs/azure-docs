---
title: Data Processor configuration patterns
description: Understand the common patterns such as path, batch, and duration that you use to configure pipeline stages.
author: dominicbetts
ms.author: dobett
ms.subservice: data-processor
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.custom:
  - ignite-2023
ms.date: 09/07/2023

#CustomerIntent: As an operator I want to understand common configuration patterns so I can configure a pipeline to process my data.
---

# What are configuration patterns?

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Several types of configuration, such as durations and paths, are common to multiple pipeline stages. This article describes these common configuration patterns.

## Path

Several pipeline stages use a path to identify a location in the [message](concept-message-structure.md) where data should be read from or written to. To define these locations, you use a `Path` field that uses jq syntax:

- A path is defined as a string in the UI, and uses the [jq](concept-jq-path.md) syntax.
- A path is defined relative to the root of the Data Processor message. The path `.` refers to the entire message.
- All paths start with `.`.
- Each segment of path can be:
  - `.<identifier>` for an alphanumeric object key such as `.topic`.
  - `."<identifier>"` for an arbitrary object key such as `."asset-id"`.
  - `["<identifier>"]` for an arbitrary object key such as `["asset-id"]`.
  - `[<index>]` for an array index such as `[2]`.
- Segments can be chained to form complex paths.

Individual path segments must conform to the following regular expressions:

| Pattern | Regex | Example |
| --- | --- | --- |
| `.<identifier>` | `\.[a-zA-Z_][a-zA-Z0-9_]*` | `.topic` |
| `."<identifier>"` | `\."(\\"\|[^"])*"` | `."asset-id"` |
| `["<identifier>"]` | `\["(\\"\|[^"])*"\]` | `["asset-id"]` |
| `[<index>]` | `\[-?[0-9]+\]` | [2] |

To learn more, see [Paths](concept-jq-path.md) in the jq guide.

### Path examples

The following paths are examples based on the standard data processor [Message](concept-message-structure.md) structure:

- `.systemProperties` returns:

  ```json
  {
    "partitionKey": "foo",
    "partitionId": 5,
    "timestamp": "2023-01-11T10:02:07Z"
  }
  ```

- `.payload.humidity` returns:

  ```json
  10
  ```

- `.userProperties[0]` returns:

  ```json
  {
    "key": "prop1",
    "value": "value1"
  }

  ```

- `.userProperties[0].value` returns:

  ```json
  value1
  ```

## Duration

Several stages require the definition of a _timespan_ duration. For example, windows in an aggregate stage and timeouts in a call out stage. These stages use a `Duration` field to represent this value.

Several pipeline stages use a _timespan_ duration. For example, the aggregate stage  has a windows property and the call out stages have a timeouts property. To define these timespans, you use a `Duration` field:

Duration is a string value with the following format `<number><char><number><char>` where `char`` can be:

- `h`: hour
- `m`: minute
- `s`: second
- `ms`: millisecond
- `us`, `µs`: microsecond
- `ns`: nanosecond

### Duration examples

- `2h`
- `1h10m30s`
- `3m9ms400ns`

## Templates

Several stages require you to define a string with a mix of dynamic and static values. These stages use _template_ values.

Data Processor templates use [Mustache syntax](https://mustache.github.io/mustache.5.html) to define dynamic values in strings.

The dynamic system values available for use in templates are:

- `instanceId`: The data processor instance ID.
- `pipelineId`: The pipeline ID the stage is part of.
- `YYYY`: The current year.
- `MM`: The current month.
- `DD`: The current date.
- `HH`: The current hour.
- `mm`: The current minute.

Currently, you can use templates to define file paths in a destination stage.

### Static and dynamic fields

Some stages require the definition of values that can either be static strings or a dynamic value that's derived from a `Path` in a [Message](concept-message-structure.md). To define these values, you can use _static_ or _dynamic_ fields.

A static or dynamic field is always written as an object with a `type` field that has one of two values: `static` or `dynamic`. The schema varies based on `type`.

### Static fields

The static definition is a fixed value for `type` is `static`. The actual value is held in `value`.

| Field | Type | Description | Required | Default | Example |
| --- | --- | --- | --- | --- | --- |
| type | const string | The type of the field. | Yes | - | `static` |
| value | any | The static value to use for the configuration (typically a string). | Yes | - | `"static"` |

### Dynamic fields

The fixed value for `type` is `dynamic`, the value is a [jq path](concept-jq-path.md).

| Field | Type | Description | Required | Default | Example |
| --- | --- | --- | --- | --- | --- |
| type | const string | The type of the field | Yes | - | `dynamic` |
| value | Path | The path in each message where a value for the field can be dynamically retrieved. | Yes | - | `.systemProperties.partitionKey` |

## Batch

Several destinations in the output stage let you batch messages before they write to the destination. These destinations use _batch_ to define the batching parameters.

Currently, you can define _batch_ based on time. To define batching, you need to specify the time interval and a path. `Path` defines which portion of the incoming message to include in the batched output.

| Field | Type | Description | Required | Default | Example |
| --- | --- | --- | --- | --- | --- |
| Time | [Duration](#duration) | How long to batch data | No | `60s` (In destinations where batching is enforced) | `120s` |
| Path | [Path](#path) | The path to value in each message to include in the output. | No | `.payload` | `.payload.output` |

## Related content

- [Data Processor messages](concept-message-structure.md)
- [Supported formats](concept-supported-formats.md)
- [What is partitioning?](concept-partitioning.md)
