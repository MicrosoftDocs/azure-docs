---
title: Aggregate data over time in data flow graphs
description: Learn how to compute averages, sums, min/max, counts, and other aggregations over tumbling time windows in Azure IoT Operations data flow graphs.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 03/19/2026
ai-usage: ai-assisted

---

# Aggregate data over time in data flow graphs

A window transform collects messages over a fixed time interval and produces a single output message with aggregated values. Instead of forwarding every reading individually, you can compute statistics like averages, minimums, or counts and send one consolidated result downstream.

<!-- For an overview of data flow graphs and how transforms compose in a pipeline, see [Data flow graphs overview](concept-dataflow-graphs.md). -->

## Prerequisites

- An Azure IoT Operations instance deployed on an Arc-enabled Kubernetes cluster. For more information, see [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md).
- A default registry endpoint named `default` that points to `mcr.microsoft.com` is automatically created during deployment.

## When to use a window transform

Use a window transform when you receive high-frequency sensor data and want to reduce the volume before sending it downstream. Common scenarios include:

- **Compute averages**: A temperature sensor publishes every second, but your cloud application only needs a 30-second average.
- **Track extremes**: You want the minimum and maximum pressure readings over each one-minute interval.
- **Count events**: You need to know how many door-open events occurred in the last five minutes.

## How the window transform works

The window transform has two internal steps connected in sequence:

1. **Delay**: Sets the tumbling window duration. Incoming messages are assigned to a window boundary based on their timestamp.
2. **Accumulate**: Applies your aggregation rules when the window closes. All messages in the window are reduced to a single output message.

> [!NOTE]
> The delay step aligns message timestamps to window boundaries. If a message arrives 7 seconds into a 10-second window, it's assigned to the 10-second boundary.

## Configure the window duration

The delay step controls how long each tumbling window lasts. The configuration key is `delay` (not `rules`).

# [Operations experience](#tab/portal)

In the window transform configuration, set the **Window duration** in seconds. For example, set it to `30` for a 30-second tumbling window.

# [Bicep](#tab/bicep)

```bicep
configuration: [
  {
    key: 'delay'
    value: '{"type":"duration","delaySeconds":30}'
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```json
{
  "type": "duration",
  "delaySeconds": 30
}
```

---

| Property | Type | Description |
|----------|------|-------------|
| `type` | string | Must be `"duration"`. |
| `delaySeconds` | uint64 | The tumbling window size in seconds. Must be greater than 0. |

## Define accumulation rules

Each accumulation rule specifies how to reduce a window of messages into a single output value. The configuration key is `rules`.

# [Operations experience](#tab/portal)

In the window transform configuration, add accumulation rules. For each rule, specify:

| Setting | Description |
|---------|-------------|
| **Input** | The field to aggregate (for example, `temperature`). |
| **Output** | The output field name (for example, `avgTemperature`). |
| **Expression** | The aggregation function (for example, `average($1)`). |

# [Bicep](#tab/bicep)

```bicep
{
  key: 'rules'
  value: '{"accumulate":[{"inputs":["temperature"],"output":"avgTemperature","expression":"average($1)"}]}'
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```json
{
  "accumulate": [
    {
      "inputs": ["temperature"],
      "output": "avgTemperature",
      "expression": "average($1)"
    }
  ]
}
```

---

| Property | Required | Description |
|----------|----------|-------------|
| `inputs` | Yes | List of field paths to read from each incoming message. |
| `output` | Yes | Field path for the aggregated result. Each rule must have a unique output. |
| `expression` | Yes | Formula that reduces input values across the window to a single scalar. Must contain at least one aggregation function. |
| `description` | No | Human-readable description. |

Unlike map rules, `expression` is **required** for every accumulation rule. Using `$1` alone isn't valid because it references a collection of values, not a single scalar. You must wrap it in an aggregation function like `average($1)`.

## Aggregation functions

| Function | Returns | Empty window behavior |
|----------|---------|-----------------------|
| `average` | Mean of numeric values | Error |
| `sum` | Sum of numeric values | 0.0 |
| `min` | Minimum numeric value | Error |
| `max` | Maximum numeric value | Error |
| `count` | Count of messages where the field exists | 0 |
| `first` | First value in the window | Error |
| `last` | Last value in the window | Error |

Each function takes a single positional variable as its argument (`$1` for the first input, `$2` for the second, and so on).

**Non-numeric values**: The `average`, `sum`, `min`, and `max` functions silently skip non-numeric values.

**Presence-based functions**: `count`, `first`, and `last` operate on field presence regardless of value type.

## Combine aggregations

You can combine multiple aggregation functions in a single expression:

# [Operations experience](#tab/portal)

Add a rule with inputs `temperature` and `humidity`, and expression `average($1) + max($2)`.

# [Bicep](#tab/bicep)

```bicep
{
  inputs: [ 'temperature', 'humidity' ]
  output: 'tempHumidityIndex'
  expression: 'average($1) + max($2)'
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
- inputs:
    - temperature     # $1
    - humidity        # $2
  output: tempHumidityIndex
  expression: "average($1) + max($2)"
```

---

To convert an aggregated value, apply the conversion function outside the aggregation. For example, `cToF(average($1))` converts the average temperature to Fahrenheit.

Each aggregation function must reference a single positional variable directly. `average($1) + max($2)` is valid, but `average($1 + $2)` isn't.

## Differences from map rules

| Capability | Map rules | Accumulation rules |
|-----------|-----------|-------------------|
| Expression required | No | Yes |
| Wildcard inputs | Supported | Not supported |
| `$metadata` access | Supported | Not supported |
| `$context` enrichment | Supported | Not supported |
| `? $last` directive | Supported | Not supported |
| Output content type | Matches input | Always `application/json` |

## Full configuration example

A complete window configuration that computes temperature statistics over a 30-second window.

If the window receives these three messages:

```json
{ "temperature": 21.5 }
{ "temperature": 23.0 }
{ "temperature": 19.8 }
```

The output message is:

```json
{
  "avgTemperature": 21.433333333333334,
  "minTemperature": 19.8,
  "maxTemperature": 23.0,
  "readingCount": 3,
  "tempRange": 3.2
}
```

# [Operations experience](#tab/portal)

In the Operations experience, create a data flow graph with a window transform:

1. Add a **source** that reads from `telemetry/temperature`.
1. Add a **window** transform. Set the window duration to 30 seconds. Configure accumulation rules for average, min, max, count, and range on the `temperature` field.
1. Add a **destination** that sends to `telemetry/aggregated`.

# [Bicep](#tab/bicep)

```bicep
resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2025-10-01' = {
  name: 'temperature-window'
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
          dataSources: [ 'telemetry/temperature' ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'aggregate'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-window:1.0.0'
          configuration: [
            {
              key: 'delay'
              value: '{"type":"duration","delaySeconds":30}'
            }
            {
              key: 'rules'
              value: '{"accumulate":[{"inputs":["temperature"],"output":"avgTemperature","expression":"average($1)"},{"inputs":["temperature"],"output":"minTemperature","expression":"min($1)"},{"inputs":["temperature"],"output":"maxTemperature","expression":"max($1)"},{"inputs":["temperature"],"output":"readingCount","expression":"count($1)"},{"inputs":["temperature"],"output":"tempRange","expression":"max($1) - min($1)"}]}'
            }
          ]
        }
      }
      {
        nodeType: 'Destination'
        name: 'output'
        destinationSettings: {
          endpointRef: 'default'
          dataDestination: 'telemetry/aggregated'
        }
      }
    ]
    nodeConnections: [
      { from: { name: 'sensors' }, to: { name: 'aggregate' } }
      { from: { name: 'aggregate' }, to: { name: 'output' } }
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
  name: temperature-window
  namespace: azure-iot-operations
spec:
  profileRef: default
  nodes:
    - nodeType: Source
      name: sensors
      sourceSettings:
        endpointRef: default
        dataSources:
          - telemetry/temperature

    - nodeType: Graph
      name: aggregate
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-window:1.0.0
        configuration:
          - key: delay
            value: |
              {
                "type": "duration",
                "delaySeconds": 30
              }
          - key: rules
            value: |
              {
                "accumulate": [
                  {
                    "inputs": ["temperature"],
                    "output": "avgTemperature",
                    "expression": "average($1)"
                  },
                  {
                    "inputs": ["temperature"],
                    "output": "minTemperature",
                    "expression": "min($1)"
                  },
                  {
                    "inputs": ["temperature"],
                    "output": "maxTemperature",
                    "expression": "max($1)"
                  },
                  {
                    "inputs": ["temperature"],
                    "output": "readingCount",
                    "expression": "count($1)"
                  },
                  {
                    "inputs": ["temperature"],
                    "output": "tempRange",
                    "expression": "max($1) - min($1)"
                  }
                ]
              }

    - nodeType: Destination
      name: output
      destinationSettings:
        endpointRef: default
        dataDestination: telemetry/aggregated

  nodeConnections:
    - from: { name: sensors }
      to: { name: aggregate }
    - from: { name: aggregate }
      to: { name: output }
```

---

## Next steps

- [Transform data with map](howto-dataflow-graphs-map.md)
<!-- - [Filter and route data](howto-dataflow-graphs-filter-route.md)
- [Enrich with external data](howto-dataflow-graphs-enrich.md)
- [Expressions reference](concept-dataflow-graphs-expressions.md)
- [Configure a source](howto-configure-dataflow-source.md)
- [Configure a destination](howto-configure-dataflow-destination.md) -->
