---
title: Understand message schemas
description: Learn how the schema registry stores and manages message schemas for data flows in Azure IoT Operations.
author: dominicbetts
ms.author: dobett
ms.topic: concept-article
ms.date: 06/23/2026
ms.service: azure-iot-operations
ms.subservice: azure-data-flows

#CustomerIntent: As an operator, I want to understand how I can use message schemas to work with data flows.
ms.custom:
  - build-2025
---

# Understand message schemas

The schema registry, a feature of Azure Device Registry, is a synchronized repository in the cloud and at the edge. It stores definitions of messages coming from edge assets and exposes an API to access those schemas at the edge.

Data flows use schemas in three places:

- **Source**: Optionally specify a schema to describe incoming messages. The operations experience uses it to display available fields.
- **Transformation**: The operations experience uses the source schema as a starting point when you build transformations.
- **Destination**: Specify an output schema and serialization format when sending data to storage endpoints.

> [!NOTE]
> For data flow graphs, schemas are configured differently. See [Use schemas in data flow graphs](concept-dataflow-graphs-schema.md).

## Schema formats

The schema registry supports two formats:

| Format | `$schema` value | Used for |
|--------|----------------|----------|
| JSON | `http://json-schema.org/draft-07/schema#` | Source endpoints (MQTT, Kafka) |
| Delta | `Delta/1.0` | Destination endpoints (storage: ADLS, Fabric, ADX, local) |

Both formats require `type: "object"` and a `properties` field that defines the message structure.

### JSON schema example

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "temperature": { "type": "number" },
    "humidity": { "type": "number" },
    "deviceId": { "type": "string" },
    "timestamp": { "type": "string" }
  }
}
```

### Delta schema example

```json
{
  "$schema": "Delta/1.0",
  "type": "object",
  "properties": {
    "type": "struct",
    "fields": [
      { "name": "asset_id", "type": "string", "nullable": true, "metadata": {} },
      { "name": "temperature", "type": "double", "nullable": true, "metadata": {} },
      { "name": "timestamp", "type": "string", "nullable": true, "metadata": {} }
    ]
  }
}
```

This example marks every field `nullable: true`. Mark a field `nullable: false` only when your mapping always produces a value for it. With Parquet and Delta, a field that is `nullable: false` but missing from a record causes the whole batch to fail and be dropped. For more information, see [Storage serialization behavior](#storage-serialization-behavior).

### Generate a schema

To generate a schema from a sample data file, use the [Schema Gen Helper](https://github.com/Azure-Samples/explore-iot-operations/tree/main/tools/schema-gen-helper).

For a tutorial that uses the schema generator, see [Tutorial: Send data from an OPC UA server to Azure Data Lake Storage Gen 2](./tutorial-opc-ua-to-data-lake.md).

## Configure a source schema

Each data flow source can optionally specify a message schema. Currently, data flows don't perform runtime payload validation on source schemas. The schema is used by the operations experience to display available fields when you build transformations.

Two related behaviors are easy to miss:

- **A schema reference on the message can gate the record.** If a source message carries a schema reference (the MQTT `dataschema` property) and the source is configured with schema information, the data flow compares the two. When they conflict, the message is acknowledged and dropped without output, and the runtime logs `conflicting schema`. This check is separate from payload validation: the message content isn't validated against the schema, but a mismatched reference still stops the record.
- **Configured JSON schemas aren't runtime validators.** For JSON output, a configured schema isn't enforced during serialization. The data flow serializes the runtime value shape directly with inferred types. Use JSON schemas as design-time documentation, not as a guarantee that output conforms to the schema.

Asset sources have a predefined schema created by the connector for OPC UA. For message broker sources, you can upload a JSON schema in the operations experience or reference one in your configuration.

:::image type="content" source="./media/concept-schema-registry/upload-schema.png" alt-text="Screenshot that shows uploading a message schema in the operations experience web UI.":::

To reference a schema in your data flow source configuration, use the `schemaRef` field. For more information, see [Configure a data flow source](howto-configure-dataflow-source.md#specify-source-schema).

## Configure an output schema

Output schemas control how data is serialized before it reaches the destination. Storage endpoints (ADLS Gen2, Fabric OneLake, Azure Data Explorer, local storage) require a schema and support Parquet and Delta serialization formats. MQTT and Kafka destinations use JSON by default.

In the operations experience, when you select a storage destination, the UI applies any transformations to the source schema and generates a Delta schema automatically. The generated schema is stored in the schema registry and referenced by the data flow.

For Bicep or Kubernetes deployments, specify the schema and serialization format in the transformation settings. For more information, see [Configure a data flow destination](howto-configure-dataflow-destination.md#serialize-the-output-with-a-schema).

### Storage serialization behavior

When a data flow writes to a storage endpoint (ADLS Gen2, Fabric OneLake, Azure Data Explorer, or local storage) by using Parquet or Delta serialization, the output schema controls how records are written. The following behaviors can cause records to be dropped or written with unexpected values. Review them before you design a schema or a mapping.

**Non-nullable fields can drop a whole batch.** At write time, the encoder checks every field in the output schema. If a field is `nullable: false` and a record doesn't have a value for it (because the field wasn't mapped, was misspelled, or was missing from the source), the commit fails and the data flow drops the entire pending batch, not just the one record. The runtime logs an error similar to `ParquetEncoding found missing property that is not Nullable: <field>` followed by `failed to commit record into a batch, dropping it`. The data flow keeps running, so the loss is silent unless you check the logs. To avoid this problem, mark a field `nullable: false` only when your mapping always produces a value for it. Otherwise, use `nullable: true`. An explicit `null` value mapped into a `nullable: false` field fails the same way, with the error `Cannot set null value. Reason: field '<field>' is not nullable.`

**Map to each leaf field, not to a whole object.** For Parquet and Delta, you can set a value only on a leaf field declared in the schema. Mapping a whole struct or object to a parent path doesn't write the nested values and drops the record with an error similar to `ParquetEncoding could not set a field <path>, it does not exist by the schema`. Map each output leaf that the schema declares.

**Wildcards require the schema to declare every expanded field.** A `* -> *` mapping (or any wildcard, including flatten and restructure patterns) expands to every leaf in the runtime payload. For Parquet and Delta, the output schema must declare every one of those leaves. If the payload contains a leaf that the schema doesn't declare, the record is dropped. Generate the schema from representative sample data so it includes every field the data flow produces.

**A schema alone doesn't populate values.** A schema describes the output shape, but it doesn't move data. Without a mapping, the data flow writes records of all nulls (for nullable fields) or drops them (for non-nullable fields). To populate values, add a mapping, commonly `* -> *`, and make sure fields are `nullable: true` when a value might be absent.

**Numeric conversions are silent and can lose precision.** When a mapped value's type doesn't match the schema column type, Parquet and Delta coerce it without an error. Float-to-integer conversions truncate the fractional part, and narrowing conversions can lose precision or wrap. If you need rounding, round explicitly in the mapping. For the available functions, see [Scaling and rounding functions](concept-dataflow-graphs-expressions.md#scaling-and-rounding-functions).

**Missing and null aren't the same.** A field that's absent from a record (missing) is skipped during serialization, while a field that's explicitly set to `null` is written when the format allows it. For Parquet and Delta, a missing value in a `nullable: true` field is written as null, a missing value in a `nullable: false` field drops the batch, and an explicit null in a `nullable: false` field also fails. Design your mappings and nullability with this difference in mind.

**Complex types are converted differently by each format.** Objects, maps, byte values, and arrays don't serialize the same way across formats:

- **Maps (objects with non-string keys):** Parquet and Delta reject maps with the error `Currently maps are not supported`. JSON supports maps only when the keys are strings. Avro converts map keys to strings, and if two keys collide after conversion, the last value wins.
- **Byte values:** JSON encodes bytes as a base64 string. Parquet and Delta can write bytes as binary, a base64 string, or a list, depending on the schema column type.
- **Arrays:** Parquet and Delta write arrays as a list or as binary, depending on the column type. A fixed-size binary column fails if the array length doesn't match.

If you need a predictable shape for a complex value, map its individual leaf fields explicitly rather than relying on whole-object passthrough.

## Upload a schema

You can upload schemas through the operations experience UI, the Azure CLI, or a Bicep deployment.

### Upload with the Azure CLI

Use the [az iot ops schema](/cli/azure/iot/ops/schema) command group to create and manage schemas.

Create a schema from a file:

```azurecli
az iot ops schema create -n myschema -g myresourcegroup --registry myregistry --format json --type message --version-content myschema.json
```

Create a schema from inline content with a specific version:

```azurecli
az iot ops schema create -n myschema -g myresourcegroup --registry myregistry --format delta --type message --version-content '{"hello": "world"}' --ver 14
```

> [!TIP]
> If you don't know your registry name, use the `schema registry list` command:
>
> ```azurecli
> az iot ops schema registry list -g myresourcegroup --query "[].{Name:name}" -o tsv
> ```

After the command completes, a blob appears in your storage account container with the schema content. The blob name follows the format `schema-namespace/schema/version`.

### Upload with Bicep

Define the schema content as a variable and create the schema resource:

```bicep
param schemaRegistryName string = '<SCHEMA_REGISTRY_NAME>'
param schemaName string = 'sensor-data-delta'
param schemaVersion string = '1'

var schemaContent = '''
{
  "$schema": "Delta/1.0",
  "type": "object",
  "properties": {
    "type": "struct",
    "fields": [
      { "name": "temperature", "type": "double", "nullable": true, "metadata": {} },
      { "name": "humidity", "type": "double", "nullable": true, "metadata": {} },
      { "name": "deviceId", "type": "string", "nullable": true, "metadata": {} }
    ]
  }
}
'''

resource schemaRegistry 'Microsoft.DeviceRegistry/schemaRegistries@2025-10-01' existing = {
  name: schemaRegistryName
}

resource schema 'Microsoft.DeviceRegistry/schemaRegistries/schemas@2025-10-01' = {
  parent: schemaRegistry
  name: schemaName
  properties: {
    displayName: 'Sensor Data Delta Schema'
    description: 'Delta schema for sensor telemetry'
    format: 'Delta/1.0'
    schemaType: 'MessageSchema'
  }
}

resource version 'Microsoft.DeviceRegistry/schemaRegistries/schemas/schemaVersions@2025-10-01' = {
  parent: schema
  name: schemaVersion
  properties: {
    description: 'Initial version'
    schemaContent: schemaContent
  }
}
```

Deploy the Bicep file:

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file schema.bicep
```

## Related content

- [Use schemas in data flow graphs](concept-dataflow-graphs-schema.md)
- [Configure a data flow source](howto-configure-dataflow-source.md)
- [Configure a data flow destination](howto-configure-dataflow-destination.md)
- [Create a data flow](howto-create-dataflow.md)
