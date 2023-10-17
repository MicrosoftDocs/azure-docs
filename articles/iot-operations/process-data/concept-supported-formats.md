---
title: Serialization and deserialization formats overview
description: Understand the data formats the Azure IoT Data Processor supports when it serializes or deserializes messages.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: concept-article
ms.date: 09/07/2023

#CustomerIntent: As an operator, I want understand what data formats the data processor supports so that I can serialize and deserialize messages in a pipeline.
---

# Serialization and deserialization formats overview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The data processor is a data agnostic platform. The data processor can ingest, process, and write out data in any format.

However, to use _jq path expressions_ in some pipeline stages, the data must be in a structured format within a pipeline. You may need to deserialize your data to get it into a suitable structured format.

Some pipeline destinations or call outs from stages may require the data to be in a specific format. You may need to serialize your data to a suitable format for the destination.

## Deserialize messages

The data processor natively supports deserialization of various formats at both the data source stage and the call out stages where the pipeline reads external data:

- The source stage can deserialize incoming data.
- The call out stages can deserialize the API response.

You may not need to deserialize incoming data if:

- You're not using the stages that require deserialized data.
- You're processing metadata only.
- The incoming data is already in a format that's consistent with the stages being used.

Following table lists the formats for which deserialization is supported and the corresponding stages.

| Format      | Data source | Call out            |
|-------------|-------------|---------------------|
| Raw         | Supported   | HTTP                |
| JSON        | Supported   | HTTP                |
| Protobuf    | Supported   | All (HTTP and gRPC) |
| CSV         | Supported   | HTTP                |
| MessagePack | Supported   | HTTP                |
| CBOR        | Supported   | HTTP                |

> [!TIP]
> Select `Raw` when you don't require deserialization. The `Raw` option passes the data through in it's current format.

## Serialize messages

The data processor natively supports serialization to various formats at both the destination and call out stages where the pipeline writes external data:

- The destination stage can serialize outgoing data to suitable format.
- Call out stages can serialize the data sent in an API request.

| Format        | Call out      | Output stage                |
|---------------|---------------|-----------------------------|
| `Raw`         | HTTP          | All except Microsoft Fabric |
| `JSON`        | HTTP          | All except Microsoft Fabric |
| `Parquet`     | Not supported | Microsoft Fabric            |
| `Protobuf`    | All           | All except Microsoft Fabric |
| `CSV`         | HTTP          | All except Microsoft Fabric |
| `MessagePack` | HTTP          | All except Microsoft Fabric |
| `CBOR`        | HTTP          | All except Microsoft Fabric |

> [!TIP]
> Select `Raw` when no serialization is required. The `Raw`  option passes the data through in its current format.

## Raw/JSON/MessagePack/CBOR data formats

Raw is the option to use when you don't need to deserialize or serialize data. Raw is the default in most stages where deserialization or serialization isn't enforced.

The serialization or deserialization configuration is common for the `Raw`, `JSON`, `MessagePack`, and `CBOR` formats. For these formats, use the following configuration options.

Use the following configuration options to deserialize data:

| Field | Type | Description | Required? | Default | Example |
|-------|------|-------------|-----------|---------|---------|
| `type` | `string enum` | The format for deserialization | No | - | `JSON` |
| `path` | [Path](concept-jq-path.md) | The path to the portion of the data processor message where the deserialized data is written to. | (see following note)| `.payload` | `.payload.response` |

> [!NOTE]
> You don't need to specify `path` when you deserialize data in the source stage. The deserialized data is automatically placed in the `.payload` section of the message.

Use the following configuration options to serialize data:

| Field | Type | Description | Required? | Default | Example |
|-------|------|-------------|-----------|---------|---------|
| `type` | `string enum` | The format for serialization | Yes | - | `JSON` |
| `path` | [Path](concept-jq-path.md) | The path to the portion of the data processor message that should be serialized. | (see following note) | `.payload` | `.payload.response` |

> [!NOTE]
> You don't need to specify `path` when you serialize [batched](concept-configuration-patterns.md#batch) data. The default path is `.`, which represents the entire message. For unbatched data, you must specify `path`.

The following example shows the configuration for serializing or deserializing unbatched JSON data:

```json
{
    "format": {
        "type": "json",
        "path": ".payload"
    }
}
```

The following example shows the configuration for deserializing JSON data in the source stage or serializing [batched](concept-configuration-patterns.md#batch) JSON data:

```json
{
    "format": {
        "type": "json"
    }
}
```

## Protocol Buffers data format

Use the following configuration options to deserialize Protocol Buffers (protobuf) data:

| Field | Type | Description | Required? | Default | Example |
|-------|------|-------------|-----------|---------|---------|
| `type` | `string enum` | The format for deserialization | Yes | - | `protobuf` |
| `descriptor` | `string` | The base64 encoded descriptor for the protobuf definition file(s). | Yes | - | `Zm9v..` |
| `package` | `string` | The name of the package in the descriptor where the type is defined. | Yes | - | `package1..` |
| `message` | `string` | The name of the message type that's used to format the data. | Yes | - | `message1..` |
| `path` | [Path](concept-jq-path.md) | The path to the portion of the data processor message where the deserialized data should be written. | (see following note) | `.payload` | `.payload.gRPCResponse` |

> [!NOTE]
> You don't need to specify `path` when you deserialize data in the source stage. The deserialized data is automatically placed in the `.payload` section of the message.

Use the following configuration options to serialize protobuf data:

| Field | Type | Description | Required? | Default | Example |
|-------|------|-------------|-----------|---------|---------|
| `type` | `string enum` | The format for serialization | Yes | - | `protobuf` |
| `descriptor` | `string` | The base64 encoded descriptor for the protobuf definition file(s). | Yes | - | `Zm9v..` |
| `package` | `string` | The name of the package in the descriptor where the type is defined. | Yes | - | `package1..` |
| `message` | `string` | The name of the message type that's used to format the data. | Yes | - | `message1..` |
| `path` | [Path](concept-jq-path.md) | The path to the portion of the data processor message where data to be serialized is read from. | (see following note) | - | `.payload.gRPCRequest` |

> [!NOTE]
> You don't need to specify `path` when you serialize [batched](concept-configuration-patterns.md#batch) data. The default path is `.`, which represents the entire message.

The following example shows the configuration for serializing or deserializing unbatched protobuf data:

```json
{
    "format": {
        "type": "protobuf",
        "descriptor": "Zm9v..",
        "package": "package1",
        "message": "message1",
        "path": ".payload"
    }
}
```

The following example shows the configuration for deserializing protobuf data in the source stage or serializing [batched](concept-configuration-patterns.md#batch) protobuf data:

```json
{
    "format": {
        "type": "protobuf",
        "descriptor": "Zm9v...", // The full descriptor
        "package": "package1",
        "message": "message1"
    }
}
```

## CSV data format

Use the following configuration options to deserialize CSV data:

| Field | Type | Description | Required? | Default | Example |
|-------|------|-------------|-----------|---------|---------|
| `type` | `string enum` | The format for deserialization | Yes | - | `CSV` |
| `header` | `boolean` | This field indicates whether the input data has a CSV header row. | Yes | - | `true` |
| `columns` | `array` | The schema definition of the CSV to read. | Yes | - | (see following table) |
| `path` | [Path](concept-jq-path.md) | The path to the portion of the data processor message where the deserialized data should be written. | (see following note) | -| `.payload` |

> [!NOTE]
> You don't need to specify `path` when you deserialize data in the source stage. The deserialized data is automatically placed in the `.payload` section of the message.

Each element in the columns array is an object with the following schema:

| Field | Type | Description | Required? | Default | Example |
| --- | ---| --- | --- | ---| --- |
| `name` | `string` | The name of the column as it appears in the CSV header. | Yes | - | `temperature` |
| `type` | `string enum` | The data processor data type held in the column that's used to determine how to parse the data. | No | string | `integer` |
| `path` | [Path](concept-jq-path.md) | The location within each record of the data where the value of the column should be read from. | No | `.{{name}}` | `.temperature` |

Use the following configuration options to serialize CSV data:

| Field | Type | Description | Required? | Default | Example |
|-------|------|-------------|-----------|---------|---------|
| `type` | `string enum` | The format for serialization | Yes | - | `CSV` |
| `header` | `boolean` | This field indicates whether to include the header line with column names in the serialized CSV. | Yes | - | `true` |
| `columns` | `array` | The schema definition of the CSV to write. | Yes | - | (see following table) |
| `path` | [Path](concept-jq-path.md) | The path to the portion of the data processor message where data to be serialized is written. | (see following note) | - | `.payload` |

> [!NOTE]
> You don't need to specify `path` when you serialize [batched](concept-configuration-patterns.md#batch) data. The default path is `.`, which represents the entire message.

| Field | Type | Description | Required? | Default | Example |
| --- | ---| --- | --- | ---| --- |
| `name` | `string` | The name of the column as it would appear in a CSV header. | Yes | - | `temperature` |
| `path` | [Path](concept-jq-path.md) | The location within each record of the data where the value of the column should be written to. | No | `.{{name}}` | `.temperature` |

The following example shows the configuration for serializing unbatched CSV data:

```json
{
    "format": {
        "type": "csv",
        "header": true,
        "columns": [
            {
                "name": "assetId",
                "path": ".assetId"
            },
            {
                "name": "timestamp",
                "path": ".eventTime"
            },
            {
                "name": "temperature",
                // Path is optional, defaults to the name
            }
        ],
        "path": ".payload"
    }
}
```

The following example shows the configuration for serializing batched CSV data. Omit the top-level `path` for batched data:

```json
{
    "format": {
        "type": "csv",
        "header": true,
        "columns": [
            {
                "name": "assetId",
                "path": ".assetId"
            },
            {
                "name": "timestamp",
                "path": ".eventTime"
            },
            {
                "name": "temperature",
                // Path is optional, defaults to .temperature
            }
        ]
    }
}
```

The following example shows the configuration for deserializing unbatched CSV data:

```json
{
    "format": {
        "type": "csv",
        "header": false,
        "columns": [
            {
                "name": "assetId",
                "type": "string",
                "path": ".assetId"
            },
            {
                "name": "timestamp",
                // Type is optional, defaults to string
                "path": ".eventTime"
            },
            {
                "name": "temperature",
                "type": "float"
                // Path is optional, defaults to .temperature
            }
        ],
        "path": ".payload"
    }
}
```

The following example shows the configuration for deserializing batched CSV data in the source stage:

```json
{
    "format": {
        "type": "csv",
        "header": false,
        "columns": [
            {
                "name": "assetId",
                "type": "string",
                "path": ".assetId"
            },
            {
                "name": "timestamp",
                // Type is optional, defaults to string
                "path": ".eventTime"
            },
            {
                "name": "temperature",
                "type": "float",
                // Path is optional, defaults to .temperature
            }
        ]
    }
}
```

## Related content

- [Data processor messages](concept-message-structure.md)
- [What is partitioning?](concept-partitioning.md)
- [What are configuration patterns?](concept-configuration-patterns.md)
