---
title: Data flow graphs
description: Learn about data flow graphs in Azure IoT Operations, including built-in transforms for mapping, filtering, branching, windowing, throttling, and enrichment.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: concept-article
ms.date: 08/06/2026
ai-usage: ai-assisted

#customer intent: As a solution developer, I want to understand what data flow graphs are and how they process data so that I can decide when to use them instead of standard data flows.
---

# Data flow graphs in Azure IoT Operations

A *data flow graph* is a configurable pipeline that processes data as it moves through Azure IoT Operations. A standard [data flow](overview-dataflow.md) follows a fixed enrich, filter, map sequence, but a data flow graph lets you compose transforms in any order, branch into parallel paths, and aggregate data over time windows.

The `DataflowGraph` Kubernetes custom resource defines a data flow graph. Inside the resource, you wire together sources, transforms, and destinations to build processing pipelines that match your scenario.

> [!IMPORTANT]
> Data flow graphs currently support only MQTT, Kafka, and OpenTelemetry endpoints. Other endpoint types like Data Lake, Microsoft Fabric OneLake, Azure Data Explorer, and Local Storage aren't supported.

## Data flows vs. data flow graphs

Azure IoT Operations provides two ways to process data in a pipeline:

| Capability | Data flows | Data flow graphs |
|-----------|-----------|-----------------|
| Pipeline shape | Fixed: enrich, filter, map | Flexible: any order, branching, merging |
| Transform types | Map, filter, enrich | Map, filter, branch, concatenate, window, throttle, enrich |
| Time-based aggregation | Not available | Window transforms with tumbling windows |
| Conditional routing | Not available | Branch and concatenate transforms |
| Endpoint support | All endpoint types | MQTT, Kafka, and OpenTelemetry only |

For new projects that use supported endpoint types, we recommend data flow graphs. Data flows remain fully supported for all scenarios, and they support the full range of endpoint types.

## Available transforms

Each transform is a prebuilt processing step that you configure with rules and chain with other transforms inside a `DataflowGraph` resource.

[!INCLUDE [dataflow-graphs-built-in-transforms](../includes/dataflow-graphs-built-in-transforms.md)]

All transforms share an [expression language](concept-dataflow-graphs-expressions.md) for operators, functions, and field references. You can also [enrich](howto-dataflow-graphs-enrich.md) messages with external data from a state store in map, filter, and branch transforms.

> [!TIP]
> Expressions use positional variables, so `$1` is the first input, `$2` is the second, and so on. The [Expressions reference](concept-dataflow-graphs-expressions.md) lists built-in functions like `cToF` and covers every operator, function, and metadata field available to transforms.

## How transforms compose in a data flow graph

Transforms connect in sequence inside a `DataflowGraph` resource: **Source > Transform A > Transform B > … > Destination**.

Branch transforms split the flow into parallel paths, and concatenate transforms merge them back.

You can chain any number of transforms in any order. A pipeline with a single map transform is as valid as one that filters, branches, maps each path differently, merges, and then aggregates over a time window.

## How data flow graph configuration works

Each transform in a data flow graph references a prebuilt artifact pulled from a container registry. You configure the transform by passing rules as JSON through the `configuration` section of the graph resource.

When you deploy Azure IoT Operations, it automatically creates a default registry endpoint named `default` that points to `mcr.microsoft.com`. The built-in transforms use this endpoint to pull artifacts from Microsoft Container Registry. You don't need any extra registry setup.

A data flow graph resource defines three kinds of elements—a source, one or more transforms (each with `nodeType: Graph`), and a destination—and a set of `nodeConnections` that describe how data flows between them. Each transform's `configuration` passes its rules as a JSON string under the `rules` key.

For a complete, runnable example that reads temperature data, converts Celsius to Fahrenheit with a map transform, and publishes the result—in the Operations experience, Azure CLI, Bicep, and Kubernetes—see [Create a data flow graph](howto-create-dataflow-graph.md). In the how-to articles that follow, examples focus on the transform rules themselves.

## Configure schemas on node connections

Data flow graphs handle schemas differently from data flows. Instead of setting the schema on the source or transformation, you configure schemas on the **node connections** between nodes in the graph. Branch and filter transforms can optionally validate runtime data against schemas attached to node connections.

Each entry in the `nodeConnections` array can include a `schema` on the `from` side of a connection. This schema describes the expected format of the data that flows between those two nodes:

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

The `schemaRef` value uses the format `aio-sr://<namespace>/<name>:<version>` and points to a schema stored in the [schema registry](concept-schema-registry.md). Because data flow graphs support only MQTT, Kafka, and OpenTelemetry endpoints, the supported serialization format is `Json`.

The following table summarizes how schema configuration differs between data flows and data flow graphs:

| Aspect | Data flows | Data flow graphs |
|--------|-----------|-----------------|
| Schema location | On source (`sourceSettings.schemaRef`) and transformation (`builtInTransformationSettings.schemaRef`) | On node connections (`nodeConnections[].from.schema`) |
| Supported destination formats | JSON, Parquet, Delta | JSON |
| Runtime validation | Not supported for source schemas | Optional on node connections through branch and filter transforms |

> [!NOTE]
> For data flow graphs, JSON is currently the only supported destination format, despite the formats listed in the REST API reference documentation.

For message schema definitions, formats, and how to upload schemas, see [Understand message schemas](concept-schema-registry.md).

## Built-in transforms vs. WASM transforms

Data flow graphs support two kinds of transforms:

- **Built-in transforms** are prebuilt by Microsoft (map, filter, branch, concatenate, window, throttle). You configure them with rules. No coding required.
- **WASM transforms** are custom WebAssembly modules that developers build and deploy. Use them when you need logic that the built-in transforms don't cover.

Both kinds of transforms run inside the same `DataflowGraph` resource, and you can mix them in a single pipeline. For information on building and deploying custom transforms, see [Use WASM transforms in data flow graphs](howto-dataflow-graph-wasm.md).

## Error handling in data flow graphs

When a transform encounters an error while processing a message (for example, a missing field or an invalid expression), the transform drops the message and logs an error. The pipeline continues processing subsequent messages.

Common causes of processing errors:

- A field referenced in a rule's `inputs` doesn't exist in the message.
- A filter or branch expression returns a non-boolean value.
- An expression references an incompatible data type (for example, a JSON object in arithmetic).
- A state store used for enrichment is unreachable.

To monitor for processing errors, check the pod logs for the data flow graph or use the metrics endpoints. For more information, see [Configure observability and monitoring](../deploy-iot-ops/howto-configure-observability.md).

## Scaling limitation for stateful graphs

[!INCLUDE [dataflow-graphs-scaling-limitation](../includes/dataflow-graphs-scaling-limitation.md)]

## Performance guidance for data flow graphs

Each transform in the pipeline adds processing overhead. Keep these guidelines in mind:

- **Prefer fewer transforms with more rules.** If you have many transformation rules that operate on the same structure, put them in a single map transform rather than creating separate transforms for each rule.
- **Use multiple transforms when the logic is distinct.** Separate transforms make sense when different processing steps are fundamentally different (filtering vs. mapping vs. aggregating).
- **Keep related rules together.** A single map transform can handle field renaming, restructuring, computed fields, and metadata transformations all at once.

## Related content

- [Data flows vs. data flow graphs](overview-dataflow-comparison.md)
- [Create a data flow graph](howto-create-dataflow-graph.md)
- [Transform data with map](howto-dataflow-graphs-map.md)
- [Filter and route data](howto-dataflow-graphs-filter-route.md)
- [Aggregate data over time](howto-dataflow-graphs-window.md)
- [Enrich with external data](howto-dataflow-graphs-enrich.md)
- [Throttle data](howto-dataflow-graphs-throttle.md)
- [Route messages to different topics](howto-dataflow-graphs-topic-routing.md)
- [Expressions reference](concept-dataflow-graphs-expressions.md)
- [Use WASM transforms in data flow graphs](howto-dataflow-graph-wasm.md)
