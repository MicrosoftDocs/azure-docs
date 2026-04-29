---
title: Understand message schemas
description: Learn how the schema registry stores and manages message schemas for data flows in Azure IoT Operations.
author: sethmanheim
ms.author: sethm
ms.topic: concept-article
ms.date: 03/19/2026
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
      { "name": "asset_id", "type": "string", "nullable": false, "metadata": {} },
      { "name": "temperature", "type": "double", "nullable": false, "metadata": {} },
      { "name": "timestamp", "type": "string", "nullable": false, "metadata": {} }
    ]
  }
}
```

### Generate a schema

To generate a schema from a sample data file, use the [Schema Gen Helper](https://github.com/Azure-Samples/explore-iot-operations/tree/main/tools/schema-gen-helper).

For a tutorial that uses the schema generator, see [Tutorial: Send data from an OPC UA server to Azure Data Lake Storage Gen 2](./tutorial-opc-ua-to-data-lake.md).

## Configure a source schema

Each data flow source can optionally specify a message schema. Currently, data flows don't perform runtime validation on source schemas. The schema is used by the operations experience to display available fields when you build transformations.

Asset sources have a predefined schema created by the connector for OPC UA. For message broker sources, you can upload a JSON schema in the operations experience or reference one in your configuration.

:::image type="content" source="./media/concept-schema-registry/upload-schema.png" alt-text="Screenshot that shows uploading a message schema in the operations experience web UI.":::

To reference a schema in your data flow source configuration, use the `schemaRef` field. For more information, see [Configure a data flow source](howto-configure-dataflow-source.md#specify-source-schema).

## Configure an output schema

Output schemas control how data is serialized before it reaches the destination. Storage endpoints (ADLS Gen2, Fabric OneLake, Azure Data Explorer, local storage) require a schema and support Parquet and Delta serialization formats. MQTT and Kafka destinations use JSON by default.

In the operations experience, when you select a storage destination, the UI applies any transformations to the source schema and generates a Delta schema automatically. The generated schema is stored in the schema registry and referenced by the data flow.

For Bicep or Kubernetes deployments, specify the schema and serialization format in the transformation settings. For more information, see [Configure a data flow destination](howto-configure-dataflow-destination.md#serialize-the-output-with-a-schema).

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
      { "name": "deviceId", "type": "string", "nullable": false, "metadata": {} }
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
