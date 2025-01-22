---
title: Understand message schemas
description: Learn how schema registry handles message schemas to work with Azure IoT Operations components including dataflows.
author: kgremban
ms.author: kgremban
ms.topic: conceptual
ms.date: 11/14/2024

#CustomerIntent: As an operator, I want to understand how I can use message schemas to filter and transform messages.
---

# Understand message schemas

Schema registry, a feature provided by Azure Device Registry, is a synchronized repository in the cloud and at the edge. The schema registry stores the definitions of messages coming from edge assets, and then exposes an API to access those schemas at the edge. 

The connector for OPC UA can create message schemas and add them to the schema registry or customers can upload schemas to the operations experience web UI or using ARM/Bicep templates.

Edge services use message schemas to filter and transform messages as they're routed across your industrial edge scenario.

*Schemas* are documents that describe the format of a message and its contents to enable processing and contextualization.

## Message schema definitions

Schema registry expects the following required fields in a message schema:

| Required field | Definition |
| -------------- | ---------- |
| `$schema` | Either `http://json-schema.org/draft-07/schema#` or `Delta/1.0`. In dataflows, JSON schemas are used for source endpoints and Delta schemas are used for destination endpoints. |
| `type` | `Object` |
| `properties` | The message definition. |

### Sample schemas

The following sample schemas provide examples for defining message schemas in each format.

JSON:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "name": "foobarbaz",
  "description": "A representation of an event",
  "type": "object",
  "required": [ "dtstart", "summary" ],
  "properties": {
    "summary": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "url": {
      "type": "string"
    },
    "duration": {
      "type": "string",
      "description": "Event duration"
    }
  }
}
```

Delta:

```json
{
  "$schema": "Delta/1.0",
  "type": "object",
  "properties": {
    "type": "struct",
    "fields": [
      { "name": "asset_id", "type": "string", "nullable": false, "metadata": {} },
      { "name": "asset_name", "type": "string", "nullable": false, "metadata": {} },
      { "name": "location", "type": "string", "nullable": false, "metadata": {} },
      { "name": "manufacturer", "type": "string", "nullable": false, "metadata": {} },
      { "name": "production_date", "type": "string", "nullable": false, "metadata": {} },
      { "name": "serial_number", "type": "string", "nullable": false, "metadata": {} },
      { "name": "temperature", "type": "double", "nullable": false, "metadata": {} }
    ]
  }
}
```

### Generate a schema

To generate the schema from a sample data file, use the [Schema Gen Helper](https://azure-samples.github.io/explore-iot-operations/schema-gen-helper/).

For a tutorial that uses the schema generator, see [Tutorial: Send data from an OPC UA server to Azure Data Lake Storage Gen 2](./tutorial-opc-ua-to-data-lake.md).

## How dataflows use message schemas

Message schemas are used in all three phases of a dataflow: defining the source input, applying data transformations, and creating the destination output.

### Input schema

Each dataflow source can optionally specify a message schema. Currently, dataflows doesn't perform runtime validation on source message schemas. 

Asset sources have a predefined message schema that was created by the connector for OPC UA.

Schemas can be uploaded for MQTT sources. Currently, Azure IoT Operations supports JSON for source schemas, also known as input schemas. In the operations experience, you can select an existing schema or upload one while defining an MQTT source:

:::image type="content" source="./media/concept-schema-registry/upload-schema.png" alt-text="Screenshot that shows uploading a message schema in the operations experience portal.":::

### Transformation

The operations experience uses the input schema as a starting point for your data, making it easier to select transformations based on the known input message format.

### Output schema

Output schemas are associated with dataflow destinations.

In the operations experience portal, you can configure output schemas for the following destination endpoints that support Parquet output:

* local storage
* Fabric OneLake
* Azure Storage (ADLS Gen2)
* Azure Data Explorer

Note: The Delta schema format is used for both Parquet and Delta output.

If you use Bicep or Kubernetes, you can configure output schemas using JSON output for MQTT and Kafka destination endpoints. MQTT- and Kafka-based destinations don't support Delta format.

For these dataflows, the operations experience applies any transformations to the input schema then creates a new schema in Delta format. When the dataflow custom resource (CR) is created, it includes a `schemaRef` value that points to the generated schema stored in the schema registry.

To upload an output schema, see [Upload schema](#upload-schema).

## Upload schema

Input schema can be uploaded in the operations experience portal as described in the [Input schema](#input-schema) section of this article. You can also upload a schema using the Azure CLI or a Bicep template. 

### Upload schema with the CLI

The [az iot ops schema](/cli/azure/iot/ops/schema) command group contains commands to create, view, and manage schemas in your schema registry.

You can upload a schema by referencing a JSON file or by including the schema as inline content.

The following example uses minimal inputs to create a schema called `myschema` from a file. When no version number is specified, the schema version is 1.

```azurecli
az iot ops schema create -n myschema -g myresourcegroup --registry myregistry --format json --type message --version-content myschema.json
```

The following example creates a schema called `myschema` from inline content and assigns a version number.

```azurecli
az iot ops schema create -n myschema -g myresourcegroup --registry myregistry --format delta --type message --version-content '{\"hello\": \"world\"}' --ver 14 
```

>[!TIP]
>If you don't know your registry name, use the `schema registry list` command to query for it. For example:
>
>```azurecli
>az iot ops schema registry list -g myresourcegroup --query "[].{Name:name}" -o tsv
>```

Once the `create` command is completed, you should see a blob in your storage account container with the schema content. The name for the blob is in the format `schema-namespace/schema/version`.

You can see more options with the helper command `az iot ops schema -h`.

### Upload schema with a Bicep template

Create a Bicep `.bicep` file, and add the schema content to it at the top as a variable. This example is a Delta schema that corresponds to the OPC UA data from [quickstart](../get-started-end-to-end-sample/quickstart-add-assets.md).

```bicep
// Delta schema content matching OPC UA data from quickstart
// For ADLS Gen2, ADX, and Fabric destinations
var opcuaSchemaContent = '''
{
  "$schema": "Delta/1.0",
  "type": "object",
  "properties": {
    "type": "struct",
    "fields": [
      {
        "name": "temperature",
        "type": {
          "type": "struct",
          "fields": [
            {
              "name": "SourceTimestamp",
              "type": "string",
              "nullable": true,
              "metadata": {}
            },
            {
              "name": "Value",
              "type": "integer",
              "nullable": true,
              "metadata": {}
            },
            {
              "name": "StatusCode",
              "type": {
                "type": "struct",
                "fields": [
                  {
                    "name": "Code",
                    "type": "integer",
                    "nullable": true,
                    "metadata": {}
                  },
                  {
                    "name": "Symbol",
                    "type": "string",
                    "nullable": true,
                    "metadata": {}
                  }
                ]
              },
              "nullable": true,
              "metadata": {}
            }
          ]
        },
        "nullable": true,
        "metadata": {}
      },
      {
        "name": "Tag 10",
        "type": {
          "type": "struct",
          "fields": [
            {
              "name": "SourceTimestamp",
              "type": "string",
              "nullable": true,
              "metadata": {}
            },
            {
              "name": "Value",
              "type": "integer",
              "nullable": true,
              "metadata": {}
            },
            {
              "name": "StatusCode",
              "type": {
                "type": "struct",
                "fields": [
                  {
                    "name": "Code",
                    "type": "integer",
                    "nullable": true,
                    "metadata": {}
                  },
                  {
                    "name": "Symbol",
                    "type": "string",
                    "nullable": true,
                    "metadata": {}
                  }
                ]
              },
              "nullable": true,
              "metadata": {}
            }
          ]
        },
        "nullable": true,
        "metadata": {}
      }
    ]
  }
}
'''
```

Then, in the same file, just underneath the schema, define the schema resource along with pointers to the existing schema registry resource that you have from deploying Azure IoT Operations.

```bicep
// Replace placeholder values with your actual resource names
param schemaRegistryName string = '<SCHEMA_REGISTRY_NAME>'

// Pointers to existing resources from AIO deployment
resource schemaRegistry 'Microsoft.DeviceRegistry/schemaRegistries@2024-09-01-preview' existing = {
  name: schemaRegistryName
}

// Name and version of the schema
param opcuaSchemaName string = 'opcua-output-delta'
param opcuaSchemaVer string = '1'

// Define the schema resource to be created and instantiate a version
resource opcSchema 'Microsoft.DeviceRegistry/schemaRegistries/schemas@2024-09-01-preview' = {
  parent: schemaRegistry
  name: opcuaSchemaName
  properties: {
    displayName: 'OPC UA Delta Schema'
    description: 'This is a OPC UA delta Schema'
    format: 'Delta/1.0'
    schemaType: 'MessageSchema'
  }
}
resource opcuaSchemaVersion 'Microsoft.DeviceRegistry/schemaRegistries/schemas/schemaVersions@2024-09-01-preview' = {
  parent: opcSchema
  name: opcuaSchemaVer
  properties: {
    description: 'Schema version'
    schemaContent: opcuaSchemaContent
  }
}
```

After you've defined the schema content and resources, you can deploy the Bicep template to create the schema in the schema registry.

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

## Next steps

- [Create a dataflow](howto-create-dataflow.md)