---
title: Route messages to different topics in data flow graphs
description: Learn how to dynamically set the output MQTT topic based on message content using data flow graphs in Azure IoT Operations.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 04/02/2026
ai-usage: ai-assisted

---

# Route messages to different topics in data flow graphs

Some scenarios require messages to arrive on different MQTT topics depending on their content. For example, sensor readings above a critical threshold might need to go to an `alerts` topic, while normal readings go to a `historian` topic. With data flow graphs, you can set the output topic dynamically, even though the dataflow has a single destination.

## How it works

A map transform can write to message metadata, including the MQTT topic, by using the `$metadata.topic` output path. The destination then uses the `${outputTopic}` variable to publish to whatever topic the transform set.

Two pieces work together:

1. **Inside the transform**: A map rule writes a string value to `$metadata.topic`.
2. **In the destination**: The `dataDestination` field references `${outputTopic}`, which resolves to the value the transform wrote.

<!-- For more on metadata fields, see [Metadata fields](concept-dataflow-graphs-expressions.md#metadata-fields). -->

## Option 1: Single map transform with a conditional expression

The simplest approach uses one map transform with an `if` expression that picks the topic.

# [Operations experience](#tab/portal)

In the Operations experience, create a data flow graph:

1. Add a **source** that reads from `sensors/temperature`.
1. Add a **map** transform with two rules:
    - A wildcard passthrough rule (input `*`, output `*`).
    - A compute rule with input `temperature`, output `$metadata.topic`, and expression `if($1 > 1000, "alerts", "historian")`.
1. Add a **destination** with topic `factory/${outputTopic}`.

When the map transform writes `"alerts"` to `$metadata.topic`, the destination resolves `factory/${outputTopic}` to `factory/alerts`.

# [Bicep](#tab/bicep)

```bicep
resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2025-10-01' = {
  name: 'dynamic-topic-routing'
  parent: dataflowProfile
  properties: {
    profileRef: dataflowProfileName
    mode: 'Enabled'
    nodes: [
      {
        nodeType: 'Source'
        name: 'sensors'
        sourceSettings: {
          endpointRef: 'default'
          dataSources: [ 'sensors/temperature' ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'route-by-temperature'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-map:1.0.0'
          configuration: [
            {
              key: 'rules'
              value: '{"map":[{"inputs":["*"],"output":"*"},{"description":"Set topic based on temperature threshold","inputs":["temperature"],"output":"$metadata.topic","expression":"if($1 > 1000, \\"alerts\\", \\"historian\\")"}]}'
            }
          ]
        }
      }
      {
        nodeType: 'Destination'
        name: 'output'
        destinationSettings: {
          endpointRef: 'default'
          dataDestination: 'factory/${outputTopic}'
        }
      }
    ]
    nodeConnections: [
      { from: { name: 'sensors' }, to: { name: 'route-by-temperature' } }
      { from: { name: 'route-by-temperature' }, to: { name: 'output' } }
    ]
  }
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: dynamic-topic-routing
  namespace: azure-iot-operations
spec:
  profileRef: default
  nodes:
    - nodeType: Source
      name: sensors
      sourceSettings:
        endpointRef: default
        dataSources:
          - sensors/temperature

    - nodeType: Graph
      name: route-by-temperature
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-map:1.0.0
        configuration:
          - key: rules
            value: |
              {
                "map": [
                  {
                    "inputs": ["*"],
                    "output": "*"
                  },
                  {
                    "description": "Set topic based on temperature threshold",
                    "inputs": ["temperature"],
                    "output": "$metadata.topic",
                    "expression": "if($1 > 1000, \"alerts\", \"historian\")"
                  }
                ]
              }

    - nodeType: Destination
      name: output
      destinationSettings:
        endpointRef: default
        dataDestination: "factory/${outputTopic}"

  nodeConnections:
    - from: { name: sensors }
      to: { name: route-by-temperature }
    - from: { name: route-by-temperature }
      to: { name: output }
```

---

## Option 2: Branch, map each path, and merge

If you need different transformations on each path (not just a different topic), use a branch transform to split the flow, a map transform on each arm to set the topic and apply path-specific rules, and a concatenate transform to merge the paths.

# [Operations experience](#tab/portal)

In the Operations experience:

1. Add a **source** that reads from `sensors/temperature`.
1. Add a **branch** transform with condition `$1 > 1000` on the `temperature` field.
1. On the **true** path, add a **map** transform with a wildcard passthrough and a rule that sets `$metadata.topic` to `"alerts"`.
1. On the **false** path, add a **map** transform with a wildcard passthrough and a rule that sets `$metadata.topic` to `"historian"`.
1. Add a **concatenate** transform to merge both paths.
1. Add a **destination** with topic `factory/${outputTopic}`.

# [Bicep](#tab/bicep)

```bicep
resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2025-10-01' = {
  name: 'dynamic-topic-routing-branched'
  parent: dataflowProfile
  properties: {
    profileRef: dataflowProfileName
    mode: 'Enabled'
    nodes: [
      {
        nodeType: 'Source'
        name: 'sensors'
        sourceSettings: {
          endpointRef: 'default'
          dataSources: [ 'sensors/temperature' ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'check-temperature'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-branch:1.0.0'
          configuration: [
            {
              key: 'rules'
              value: '{"branch":{"inputs":["temperature"],"expression":"$1 > 1000","description":"Route critical temperatures to alerts"}}'
            }
          ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'set-alerts-topic'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-map:1.0.0'
          configuration: [
            {
              key: 'rules'
              value: '{"map":[{"inputs":["*"],"output":"*"},{"inputs":[],"output":"$metadata.topic","expression":"\\"alerts\\""}]}'
            }
          ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'set-historian-topic'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-map:1.0.0'
          configuration: [
            {
              key: 'rules'
              value: '{"map":[{"inputs":["*"],"output":"*"},{"inputs":[],"output":"$metadata.topic","expression":"\\"historian\\""}]}'
            }
          ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'merge'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-concatenate:1.0.0'
        }
      }
      {
        nodeType: 'Destination'
        name: 'output'
        destinationSettings: {
          endpointRef: 'default'
          dataDestination: 'factory/${outputTopic}'
        }
      }
    ]
    nodeConnections: [
      { from: { name: 'sensors' }, to: { name: 'check-temperature' } }
      { from: { name: 'check-temperature.output.true' }, to: { name: 'set-alerts-topic' } }
      { from: { name: 'check-temperature.output.false' }, to: { name: 'set-historian-topic' } }
      { from: { name: 'set-alerts-topic' }, to: { name: 'merge' } }
      { from: { name: 'set-historian-topic' }, to: { name: 'merge' } }
      { from: { name: 'merge' }, to: { name: 'output' } }
    ]
  }
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: dynamic-topic-routing-branched
  namespace: azure-iot-operations
spec:
  profileRef: default
  nodes:
    - nodeType: Source
      name: sensors
      sourceSettings:
        endpointRef: default
        dataSources:
          - sensors/temperature

    - nodeType: Graph
      name: check-temperature
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-branch:1.0.0
        configuration:
          - key: rules
            value: |
              {
                "branch": {
                  "inputs": ["temperature"],
                  "expression": "$1 > 1000",
                  "description": "Route critical temperatures to alerts"
                }
              }

    - nodeType: Graph
      name: set-alerts-topic
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-map:1.0.0
        configuration:
          - key: rules
            value: |
              {
                "map": [
                  { "inputs": ["*"], "output": "*" },
                  { "inputs": [], "output": "$metadata.topic", "expression": "\"alerts\"" }
                ]
              }

    - nodeType: Graph
      name: set-historian-topic
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-map:1.0.0
        configuration:
          - key: rules
            value: |
              {
                "map": [
                  { "inputs": ["*"], "output": "*" },
                  { "inputs": [], "output": "$metadata.topic", "expression": "\"historian\"" }
                ]
              }

    - nodeType: Graph
      name: merge
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-concatenate:1.0.0

    - nodeType: Destination
      name: output
      destinationSettings:
        endpointRef: default
        dataDestination: "factory/${outputTopic}"

  nodeConnections:
    - from: { name: sensors }
      to: { name: check-temperature }
    - from: { name: check-temperature.output.true }
      to: { name: set-alerts-topic }
    - from: { name: check-temperature.output.false }
      to: { name: set-historian-topic }
    - from: { name: set-alerts-topic }
      to: { name: merge }
    - from: { name: set-historian-topic }
      to: { name: merge }
    - from: { name: merge }
      to: { name: output }
```

---

## Which option to choose

| Consideration | Option 1 (single map) | Option 2 (branch + maps) |
|---------------|----------------------|--------------------------|
| Simplicity | Fewer nodes, simpler to read | More nodes, more explicit |
| Topic-only routing | Ideal | Works, but more setup than needed |
| Different transforms per path | Possible with nested `if()`, gets complex | Natural: each branch has its own map rules |
| Adding more paths | Chain `if()` calls | Requires nested branches |

For straightforward topic routing based on a single condition, option 1 is simpler. Use option 2 when each path needs different processing beyond the topic name.

## Topic translation details

The `${outputTopic}` variable in `dataDestination` resolves to the full value of `$metadata.topic` as set by the last transform in the pipeline. You can also use segments with `${outputTopic.N}` (1-indexed). For example, if the transform sets `$metadata.topic` to `"region/west"`:

| `dataDestination` | Resolved topic |
|-------------------|---------------|
| `factory/${outputTopic}` | `factory/region/west` |
| `factory/${outputTopic.1}` | `factory/region` |
| `factory/${outputTopic.2}` | `factory/west` |

If the topic variable can't be resolved (for example, `$metadata.topic` was never set), the message is dropped and an error is logged.

## Next steps

<!-- - [Transform data with map](howto-dataflow-graphs-map.md)
- [Filter and route data](howto-dataflow-graphs-filter-route.md)
- [Expressions reference](concept-dataflow-graphs-expressions.md)
- [Data flow graphs overview](concept-dataflow-graphs.md) -->
