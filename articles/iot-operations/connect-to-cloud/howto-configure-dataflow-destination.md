---
title: Configure a data flow destination
description: Configure destination endpoints, data destinations, and dynamic topic routing for data flows and data flow graphs in Azure IoT Operations.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/20/2026
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to configure the destination for a data flow or data flow graph.
---

# Configure a data flow destination in Azure IoT Operations

The destination is where a data flow or data flow graph sends processed data. You configure the destination by specifying an endpoint reference and a data destination (topic, container, or table).

This page applies to both [data flows](overview-dataflow.md) and [data flow graphs](concept-dataflow-graphs.md). For data flows, the destination is an operation in the `Dataflow` resource. For data flow graphs, the destination is a `Destination` node in the `DataflowGraph` resource.

> [!IMPORTANT]
> Data flows and data flow graphs support all endpoint types as destinations: MQTT, Kafka, Azure Data Lake Storage, Microsoft Fabric OneLake, Azure Data Explorer, OpenTelemetry, and local storage. To send data to a destination other than the local MQTT broker, create a [data flow endpoint](howto-configure-dataflow-endpoint.md). Storage endpoints require a [schema for serialization](#serialize-the-output-with-a-schema).

## Configure the destination endpoint

# [Operations experience](#tab/portal)

1. Select the data flow endpoint to use as the destination.

    :::image type="content" source="media/howto-create-dataflow/dataflow-destination.png" alt-text="Screenshot using operations experience to select Event Hubs destination endpoint.":::

    Storage endpoints require a [schema for serialization](./concept-schema-registry.md). If you choose a Microsoft Fabric OneLake, Azure Data Lake Storage, Azure Data Explorer, or Local Storage destination endpoint, you must [specify a schema reference](#serialize-the-output-with-a-schema).

    :::image type="content" source="media/howto-create-dataflow/serialization-schema.png" alt-text="Screenshot using operations experience to choose output schema and serialization format.":::

1. Select **Proceed** to configure the destination.
1. Enter the required settings for the destination, including the topic or table to send the data to. See [Configure the data destination](#configure-the-data-destination-topic-container-or-table) for more information.

# [Azure CLI](#tab/cli)

```json
{
  "destinationSettings": {
    "endpointRef": "<CUSTOM_ENDPOINT_NAME>",
    "dataDestination": "<TOPIC_OR_TABLE>"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
destinationSettings: {
  endpointRef: '<CUSTOM_ENDPOINT_NAME>'
  dataDestination: '<TOPIC_OR_TABLE>'
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
destinationSettings:
  endpointRef: <CUSTOM_ENDPOINT_NAME>
  dataDestination: <TOPIC_OR_TABLE>
```

---

## Configure the data destination (topic, container, or table)

Like data sources, data destinations make data flow endpoints reusable across multiple data flows. A data destination represents the subdirectory in the data flow endpoint configuration. For example, if the data flow endpoint is a storage endpoint, the data destination is the container. If the data flow endpoint is a Kafka endpoint, the data destination is the Kafka topic.

| Endpoint type | Data destination meaning | Description |
| - | - | - |
| MQTT (or Event Grid) | Topic | The MQTT topic where the data is sent. Supports both static topics and dynamic topic routing using variables like `${inputTopic}` and `${inputTopic.index}`. For more information, see [Dynamic destination topics](#dynamic-destination-topics). |
| Kafka (or Event Hubs) | Topic | The Kafka topic where the data is sent. Only static topics are supported, no wildcards. If the endpoint is an Event Hubs namespace, the data destination is the individual event hub within the namespace. |
| Azure Data Lake Storage | Container | The container in the storage account. Not the table. |
| Microsoft Fabric OneLake | Table or Folder | Corresponds to the configured [path type for the endpoint](howto-configure-fabric-endpoint.md#onelake-path-type). |
| Azure Data Explorer | Table | The table in the Azure Data Explorer database. |
| Local Storage | Folder | The folder or directory name in the local storage persistent volume mount. When using [Azure Container Storage enabled by Azure Arc Cloud Ingest Edge Volumes](/azure/azure-arc/container-storage/overview), this value must match the `spec.path` parameter for the subvolume you created. |
| OpenTelemetry | Topic | The OpenTelemetry topic where the data is sent. Only static topics are supported. |

# [Operations experience](#tab/portal)

When you use the operations experience, it automatically interprets the data destination field based on the endpoint type. For example, if the data flow endpoint is a storage endpoint, the destination details page prompts you to enter the container name. If the data flow endpoint is an MQTT endpoint, the destination details page prompts you to enter the topic.

:::image type="content" source="media/howto-create-dataflow/data-destination.png" alt-text="Screenshot showing the operations experience prompting the user to enter an MQTT topic given the endpoint type.":::

# [Azure CLI](#tab/cli)

To send data back to the local MQTT broker, use a static MQTT topic:

```json
{
  "destinationSettings": {
    "endpointRef": "default",
    "dataDestination": "example-topic"
  }
}
```

If you have a custom event hub endpoint:

```json
{
  "destinationSettings": {
    "endpointRef": "my-eh-endpoint",
    "dataDestination": "individual-event-hub"
  }
}
```

# [Bicep](#tab/bicep)

To send data back to the local MQTT broker:

```bicep
destinationSettings: {
  endpointRef: 'default'
  dataDestination: 'example-topic'
}
```

If you have a custom event hub endpoint:

```bicep
destinationSettings: {
  endpointRef: 'my-eh-endpoint'
  dataDestination: 'individual-event-hub'
}
```

This example uses a storage endpoint:

```bicep
destinationSettings: {
  endpointRef: 'my-adls-endpoint'
  dataDestination: 'my-container'
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

To send data back to the local MQTT broker:

```yaml
destinationSettings:
  endpointRef: default
  dataDestination: example-topic
```

If you have a custom event hub endpoint:

```yaml
destinationSettings:
  endpointRef: my-eh-endpoint
  dataDestination: individual-event-hub
```

This example uses a storage endpoint:

```yaml
destinationSettings:
  endpointRef: my-adls-endpoint
  dataDestination: my-container
```

---

## Dynamic destination topics

For MQTT endpoints, you can use dynamic topic variables in the `dataDestination` field to route messages based on the source topic structure or message content.

### Route by source topic

In both data flows and data flow graphs, use the following variables to reference segments of the source topic in the `dataDestination` field:

- `${inputTopic}`: The full original input topic
- `${inputTopic.index}`: A segment of the input topic (index starts at 1)

For example, `processed/factory/${inputTopic.2}` routes messages from `factory/1/data` to `processed/factory/1`. Topic segments are 1-indexed, and leading or trailing slashes are ignored.

If a topic variable can't be resolved (for example, `${inputTopic.5}` when the input topic only has three segments), the message is dropped and a warning is logged. Wildcard characters (`#` and `+`) aren't allowed in destination topics.

# [Operations experience](#tab/portal)

In the operations experience, enter the dynamic topic variable in the **Topic** field when you configure the destination. For example, enter `processed/factory/${inputTopic.2}`.

# [Azure CLI](#tab/cli)

```json
{
  "destinationSettings": {
    "endpointRef": "default",
    "dataDestination": "processed/factory/${inputTopic.2}"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
destinationSettings: {
  endpointRef: 'default'
  dataDestination: 'processed/factory/${inputTopic.2}'
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
destinationSettings:
  endpointRef: default
  dataDestination: processed/factory/${inputTopic.2}
```

---

> [!NOTE]
> Only the dynamic topic variables described here (`${inputTopic}`, `${inputTopic.index}`, and, for data flow graphs, `${outputTopic}`) are substituted. A path segment that uses curly braces without a leading `$`, such as `edge-ai/predict/{model_id}`, is treated as a literal string, not a variable. To set the destination topic based on a field in the message, use the data flow graph `${outputTopic}` approach described in the next section. The characters `$`, `{`, and `}` are valid in MQTT topic names, so a topic like `factory/$inputTopic.2` is acceptable but incorrect if you intended to use the dynamic topic variable.

### Data flow graphs: route by message content

Data flow graphs support an additional approach: you can set the destination topic dynamically based on message content by combining a map transform with the `${outputTopic}` variable:

1. In a map transform, write a value to `$metadata.topic` based on message content. For example, use an expression like `if($1 > 1000, "alerts", "historian")`.
2. In the destination, reference the value with `${outputTopic}` in the `dataDestination` field.

This approach is more flexible than source topic routing because it lets you set the destination topic based on any field or computed value in the message, not just the source topic structure.

For more information and complete examples, see [Route messages to different topics](howto-dataflow-graphs-topic-routing.md).

## Serialize the output with a schema

MQTT and Kafka destinations use JSON by default. Table-based destinations require an output schema and a serialization format. This requirement applies to both data flows and data flow graphs, including graphs with custom WASM transforms.

First, configure the destination endpoint and its permissions by following the existing endpoint guide. Choose the serialization format for your destination:

| Destination | Serialization format |
| --- | --- |
| [Azure Data Lake Storage Gen2](howto-configure-adlsv2-endpoint.md) | Delta or Parquet |
| [Microsoft Fabric OneLake](howto-configure-fabric-endpoint.md) | Delta for a table with the `Tables` [path type](howto-configure-fabric-endpoint.md#onelake-path-type) |
| [Azure Data Explorer](howto-configure-adx-endpoint.md) | Parquet |
| [Local storage](howto-configure-local-storage-endpoint.md) | Parquet |

[Create and upload a Delta schema](concept-schema-registry.md#delta-schema-example) that describes the final transformed message. Use the Delta schema definition format for both Delta and Parquet output. Field names and types must match the fields produced by your transforms or WASM module, not just the original input.

For a data flow, specify the schema in `builtInTransformationSettings`. For a data flow graph, specify it in the destination node's `destinationSettings.outputSchemaSettings`. The graph runtime serializes the processed message before sending it to the endpoint; your WASM module doesn't need to produce Parquet files or a Delta table itself.

> [!IMPORTANT]
> With Parquet and Delta serialization, the schema and mapping determine whether records are written, dropped, or written with coerced values. A non-nullable field that a mapping doesn't populate causes the whole batch to be dropped, and type mismatches are coerced silently. Before you deploy a storage data flow, review [Storage serialization behavior](concept-schema-registry.md#storage-serialization-behavior).

> [!TIP]
> To generate the schema from a sample data file, use the [Schema Gen Helper](https://github.com/Azure-Samples/explore-iot-operations/tree/main/tools/schema-gen-helper).

# [Operations experience](#tab/portal)

For a data flow graph, use the **Bicep** tab in this section to configure the destination output schema.

For a data flow, specify the schema and serialization format in the data flow endpoint details. The endpoints that support serialization formats are Microsoft Fabric OneLake, Azure Data Lake Storage Gen 2, Azure Data Explorer, and local storage. For example, to serialize the data in Delta format, upload a schema to the schema registry and reference it in the data flow destination configuration.

:::image type="content" source="media/howto-create-dataflow/destination-serialization.png" alt-text="Screenshot using the operations experience to set the data flow destination endpoint serialization.":::

# [Azure CLI](#tab/cli)

For a data flow graph with a table-based destination, use the **Bicep** tab in this section to update your graph template, then deploy it with the Azure CLI:

```azurecli
az deployment group create --resource-group $RESOURCE_GROUP --template-file main.bicep
```

Use this deployment method rather than `az iot ops dataflowgraph apply` for table destinations. The latter command's endpoint validation can reject storage endpoints even though the graph API supports them. For the full graph template, see [Create a data flow graph](howto-create-dataflow-graph.md).

For a data flow, after you [upload a schema to the schema registry](concept-schema-registry.md#upload-with-the-azure-cli), reference it in the transformation configuration.

```json
{
  "builtInTransformationSettings": {
    "serializationFormat": "Delta",
    "schemaRef": "aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA>:<VERSION>"
  }
}
```

# [Bicep](#tab/bicep)

For a data flow graph, use `Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2026-10-01` and add `outputSchemaSettings` to the destination node. For example, replace the destination node in an [existing graph template](howto-create-dataflow-graph.md) with this node to write Delta output to an ADLS Gen2 container:

```bicep
{
  nodeType: 'Destination'
  name: 'output'
  destinationSettings: {
    endpointRef: '<ADLS_ENDPOINT_NAME>'
    dataDestination: '<CONTAINER_NAME>'
    outputSchemaSettings: {
      serializationFormat: 'Delta'
      schemaRef: 'aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA>:<VERSION>'
    }
  }
}
```

Keep the node name unchanged so that the existing node connections still point to it. Set `endpointRef` to your configured endpoint name, `dataDestination` to the [container, table, or folder](#configure-the-data-destination-topic-container-or-table), and `schemaRef` to the uploaded output schema. To write Parquet instead, set `serializationFormat` to `Parquet`.

For a data flow, reference the schema in the transformation configuration:

```bicep
builtInTransformationSettings: {
  serializationFormat: 'Delta'
  schemaRef: 'aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA>:<VERSION>'
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

For a data flow graph, add the output schema settings to the destination node in `spec.nodes`:

```yaml
- nodeType: Destination
  name: output
  destinationSettings:
    endpointRef: <ADLS_ENDPOINT_NAME>
    dataDestination: <CONTAINER_NAME>
    outputSchemaSettings:
      serializationFormat: Delta
      schemaRef: 'aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA>:<VERSION>'
```

Keep the node name unchanged so that the existing node connections still point to it. Use `Parquet` instead of `Delta` for Parquet output.

For a data flow, after you [upload a schema to the schema registry](concept-schema-registry.md#upload-with-the-azure-cli), reference it in the transformation configuration:

```yaml
builtInTransformationSettings:
  serializationFormat: Delta
  schemaRef: 'aio-sr://<SCHEMA_NAMESPACE>/<SCHEMA>:<VERSION>'
```

---

For more information about schema registry, see [Understand message schemas](concept-schema-registry.md).

## Next steps

- [Configure a data flow source](howto-configure-dataflow-source.md)
- [Create a data flow](howto-create-dataflow.md)
- [Data flow graphs overview](concept-dataflow-graphs.md)
- [Route messages to different topics with data flow graphs](howto-dataflow-graphs-topic-routing.md)
