---
title: Use schemas in data flow graphs
description: Configure input and output schemas on node connections in data flow graphs in Azure IoT Operations.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 03/19/2026
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to configure schemas for my data flow graphs.
---

# Use schemas in data flow graphs

Data flow graphs handle schemas differently from classic data flows. Instead of setting the schema on the source or transformation, you configure schemas on the **node connections** between nodes in the graph.

For information about message schema definitions, formats (JSON, Delta), and how to upload schemas, see [Understand message schemas](concept-schema-registry.md).

## Schema location in data flow graphs

In a classic data flow, schemas are configured on the source (`schemaRef` in `sourceSettings`) and transformation (`schemaRef` in `builtInTransformationSettings`). In a data flow graph, schemas are configured on the connections between nodes.

Each entry in the `nodeConnections` array can include a `schema` on the `from` side of the connection. This schema describes the expected format of the data flowing between those two nodes.

## Configure an input schema

To specify a schema on data entering a connection, add a `schema` field to the `from` side of the connection:

# [Bicep](#tab/bicep)

```bicep
nodeConnections: [
  {
    from: {
      name: 'source'
      schema: {
        schemaRef: 'aio-sr://my-namespace/sensor-data:1'
        serializationFormat: 'Json'
      }
    }
    to: {
      name: 'transform'
    }
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
nodeConnections:
  - from:
      name: source
      schema:
        schemaRef: "aio-sr://my-namespace/sensor-data:1"
        serializationFormat: Json
    to:
      name: transform
```

---

The `schemaRef` follows the format `aio-sr://<namespace>/<name>:<version>` and references a schema stored in the [schema registry](concept-schema-registry.md).

Supported serialization formats:

| Format | Description |
|--------|-------------|
| `Json` | JSON format (default for MQTT and Kafka) |

## Configure an output schema

Data flow graph destinations support an `outputSchemaSettings` field to control the serialization format of the output data:

# [Bicep](#tab/bicep)

```bicep
{
  name: 'output'
  nodeType: 'Destination'
  destinationSettings: {
    endpointRef: 'my-adls-endpoint'
    dataDestination: 'my-container'
  }
}
```

When using storage destinations (ADLS, Fabric, ADX), the output schema and serialization format are configured on the destination endpoint. See [Configure a data flow destination](howto-configure-dataflow-destination.md#serialize-the-output-with-a-schema).

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
- name: output
  nodeType: Destination
  destinationSettings:
    endpointRef: my-adls-endpoint
    dataDestination: my-container
```

When using storage destinations (ADLS, Fabric, ADX), the output schema and serialization format are configured on the destination endpoint. See [Configure a data flow destination](howto-configure-dataflow-destination.md#serialize-the-output-with-a-schema).

---

> [!NOTE]
> Data flow graphs currently support MQTT, Kafka, and OpenTelemetry endpoints only. Storage endpoints aren't supported as data flow graph destinations.

## Differences from data flow schemas

| Aspect | Data flows | Data flow graphs |
|--------|-----------|-----------------|
| Schema location | On source (`sourceSettings.schemaRef`) and transformation (`builtInTransformationSettings.schemaRef`) | On node connections (`nodeConnections[].from.schema`) |
| Output schema | On transformation (`builtInTransformationSettings.serializationFormat`) | On destination node (`outputSchemaSettings`) |
| Runtime validation | Not currently supported for source schemas | Not currently supported for source schemas |
| Supported destination formats | JSON, Parquet, Delta | JSON |

## Related content

- [Understand message schemas](concept-schema-registry.md)
- [Data flow graphs overview](concept-dataflow-graphs.md)
- [Configure a data flow destination](howto-configure-dataflow-destination.md)
