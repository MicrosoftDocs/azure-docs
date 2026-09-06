---
title: Window transforms in data flow graphs
description: Aggregate high-frequency device data over duration, count, memory, and trigger-based windows in Azure IoT Operations data flow graphs to cut message volume.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 07/24/2026
ai-usage: ai-assisted

#customer intent: As an operator, I want to aggregate high-frequency device data over configurable windows so that I can reduce message volume and send consolidated statistics downstream.

---

# Aggregate data with window transforms in data flow graphs

A window transform groups incoming messages and produces a single output message with aggregated values when the window closes. Instead of forwarding every reading individually, you can compute statistics such as averages, minimums, or counts and send one consolidated result downstream.

Currently, a window can close based on duration, count, memory, or trigger conditions.

For an overview of data flow graphs and how transforms compose in a pipeline, see [Data flow graphs overview](concept-dataflow-graphs.md).

> [!NOTE]
> Non-duration-based windowing requires `azureiotoperations/graph-dataflow-window:1.1.0` or later.

[!INCLUDE [dataflow-graphs-expressions-intro](../includes/dataflow-graphs-expressions-intro.md)]

Window transforms add aggregation functions such as `average`, `min`, and `max`, which are available only in accumulation rules. For the full list, see [Aggregation functions](concept-dataflow-graphs-expressions.md#aggregation-functions-window-transforms-only).

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../includes/prereq-deployed-instance.md)]
- A default registry endpoint named `default` that points to `mcr.microsoft.com` is automatically created during deployment.

[!INCLUDE [set-environment-variables](../includes/set-environment-variables.md)]

## Scaling limitation for stateful graphs

[!INCLUDE [dataflow-graphs-scaling-limitation](../includes/dataflow-graphs-scaling-limitation.md)]

## When to use a window transform

Use a window transform when you receive high-frequency sensor data and want to reduce the volume before sending it downstream. Common scenarios include:

- **Compute averages**: A temperature sensor publishes every second, but your cloud application only needs a 30-second average.
- **Track extremes**: You want the minimum and maximum pressure readings over each one-minute interval.
- **Count events**: You need to know how many door-open events occurred in the last five minutes.
- **Create production batches**: You want to compute statistics for each fixed-size batch, such as every 100 packages coming off a filling line.
- **Respond to state changes**: You want to know whenever an operating signal changes, such as when a mixer changes from `running` to `draining`.

## How the window transform works

The window transform has two internal steps connected in sequence:

1. **Window**: Buffers messages until one of the configured closing conditions fires.
2. **Accumulate**: Applies your aggregation rules when the window closes. The transform reduces all messages in the window to a single output message.

> [!NOTE]
> A window transform must configure at least one closing condition: `delay`, `count`, `memory`, or `triggers`.

## Configure window closing conditions

Starting from version `1.1.0`, the window transform adds three configuration keys alongside the existing `delay` key:

| Configuration key | Window type | Purpose |
| --- | --- | --- |
| `delay` | Duration-based window | Close the window after a fixed duration. |
| `count` | Count-based window | Close the window after a fixed number of messages. |
| `memory` | Memory-based window | Close the window when the buffered payload size reaches a limit. |
| `triggers` | Trigger-based window | Close the window when a custom expression evaluates to `true`. |

### Duration-based window

Use the `delay` configuration to close the window after a fixed duration. This setting controls how long each tumbling window lasts.

> [!NOTE]
> The delay step aligns message timestamps to window boundaries. If a message arrives 7 seconds into a 10-second window, it belongs to the 10-second boundary.

> [!NOTE]
> If you don't provide `delay`, the window uses a 60-second default timeout as a safety valve.

# [Operations experience](#tab/portal)

In the window transform configuration, set the **Window duration** in seconds. For example, set it to `30` for a 30-second tumbling window.

# [Azure CLI](#tab/cli)

The CLI applies the whole graph from one config file. Add this configuration to the window transform node's `configuration` in your `graph.json` file. Then, apply it by using [`az iot ops dataflowgraph apply`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-apply).

The rules are a JSON object:

```json
{
  "type": "duration",
  "delaySeconds": 30
}
```

These rules go in the `value` field as an escaped string:

```json
"configuration": [
  {
    "key": "delay",
    "value": "{\"type\":\"duration\",\"delaySeconds\":30}"
  }
]
```

[!INCLUDE [dataflow-jq-tip](../includes/dataflow-jq-tip.md)]

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
| `delaySeconds` | uint64 | Number of seconds before the window closes. Must be greater than 0. |

### Count-based window

Use the `count` configuration to close the window after a fixed number of messages.

# [Operations experience](#tab/portal)

In the window transform configuration, set **Message count** to `5` and set the boundary message behavior to **messageInCurrent**.

# [Azure CLI](#tab/cli)

The CLI applies the whole graph from one config file, so add this configuration to the window transform node's `configuration` in your `graph.json` file. Then, apply it by using [`az iot ops dataflowgraph apply`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-apply).

The rules are a JSON object:

```json
{
  "type": "messageCount",
  "maxMessageCount": 5,
  "boundaryMessage": "messageInCurrent"
}
```

Add these rules in the `value` field as an escaped string:

```json
"configuration": [
  {
    "key": "count",
    "value": "{\"type\":\"messageCount\",\"maxMessageCount\":5,\"boundaryMessage\":\"messageInCurrent\"}"
  }
]
```

[!INCLUDE [dataflow-jq-tip](../includes/dataflow-jq-tip.md)]

# [Bicep](#tab/bicep)

```bicep
configuration: [
  {
    key: 'count'
    value: '{"type":"messageCount","maxMessageCount":5,"boundaryMessage":"messageInCurrent"}'
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```json
{
  "type": "messageCount",
  "maxMessageCount": 5,
  "boundaryMessage": "messageInCurrent"
}
```

---

| Property | Type | Description |
| --- | --- | --- |
| `type` | string | Must be `"messageCount"`. |
| `maxMessageCount` | uint64 | Number of messages to buffer before the window closes. Must be greater than 0. |
| `boundaryMessage` | string | Whether the message that closes the window stays in the current window (`messageInCurrent`) or starts the next window (`messageInNext`). |

### Memory-based window

Use the `memory` configuration to close the window when the buffered payload size reaches a limit.

# [Operations experience](#tab/portal)

In the window transform configuration, set **Buffer size** to `1048576` bytes and set the boundary message behavior to **messageInNext**.

# [Azure CLI](#tab/cli)

The CLI applies the whole graph from one config file, so add this configuration to the window transform node's `configuration` in your `graph.json` file. Then, apply it by using [`az iot ops dataflowgraph apply`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-apply).

The rules are a JSON object:

```json
{
  "type": "bufferSize",
  "maxBufferBytes": 1048576,
  "boundaryMessage": "messageInNext"
}
```

Add these rules in the `value` field as an escaped string:

```json
"configuration": [
  {
    "key": "memory",
    "value": "{\"type\":\"bufferSize\",\"maxBufferBytes\":1048576,\"boundaryMessage\":\"messageInNext\"}"
  }
]
```

[!INCLUDE [dataflow-jq-tip](../includes/dataflow-jq-tip.md)]

# [Bicep](#tab/bicep)

```bicep
configuration: [
  {
    key: 'memory'
    value: '{"type":"bufferSize","maxBufferBytes":1048576,"boundaryMessage":"messageInNext"}'
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```json
{
  "type": "bufferSize",
  "maxBufferBytes": 1048576,
  "boundaryMessage": "messageInNext"
}
```

---

| Property | Type | Description |
| --- | --- | --- |
| `type` | string | Must be `"bufferSize"`. |
| `maxBufferBytes` | uint64 | Maximum cumulative payload bytes before the window closes. Must be greater than 0. |
| `boundaryMessage` | string | Whether the message that closes the window stays in the current window (`messageInCurrent`) or starts the next window (`messageInNext`). |

### Trigger-based window

Use the `triggers` configuration when the window should close based on message content or running state inside the current window.

# [Operations experience](#tab/portal)

In the window transform configuration, add a trigger rule with input field `temperature`, expression `running_sum($1) + $1 > 100`, and boundary message behavior **messageInCurrent**.

# [Azure CLI](#tab/cli)

The CLI applies the whole graph from one config file, so add this configuration to the window transform node's `configuration` in your `graph.json` file. Then, apply it by using [`az iot ops dataflowgraph apply`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-apply).

The rules are a JSON object:

```json
{
  "type": "expression",
  "rules": [
    {
      "inputs": ["temperature"],
      "trigger": "running_sum($1) + $1 > 100",
      "boundaryMessage": "messageInCurrent"
    }
  ]
}
```

Add these rules in the `value` field as an escaped string:

```json
"configuration": [
  {
    "key": "triggers",
    "value": "{\"type\":\"expression\",\"rules\":[{\"inputs\":[\"temperature\"],\"trigger\":\"running_sum($1) + $1 > 100\",\"boundaryMessage\":\"messageInCurrent\"}]}"
  }
]
```

[!INCLUDE [dataflow-jq-tip](../includes/dataflow-jq-tip.md)]

# [Bicep](#tab/bicep)

```bicep
configuration: [
  {
    key: 'triggers'
    value: '{"type":"expression","rules":[{"inputs":["temperature"],"trigger":"running_sum($1) + $1 > 100","boundaryMessage":"messageInCurrent"}]}'
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```json
{
  "type": "expression",
  "rules": [
    {
      "inputs": ["temperature"],
      "trigger": "running_sum($1) + $1 > 100",
      "boundaryMessage": "messageInCurrent"
    }
  ]
}
```

---

| Property | Required | Description |
| --- | --- | --- |
| `type` | Yes | Must be `"expression"`. |
| `rules` | Yes | Array of trigger rules. Rules are evaluated sequentially per message; the first matching rule closes the window. |
| `datasets` | No | Optional state-store datasets that reference the state store. |

Each trigger rule supports these fields:

| Property | Required | Description |
| --- | --- | --- |
| `inputs` | Yes | Array of input field references. The expression binds to `$1`, `$2`, and so on. |
| `trigger` | Yes | Boolean expression that closes the window when it evaluates to `true`. |
| `boundaryMessage` | Yes | Whether the message that closes the window stays in the current window (`messageInCurrent`) or starts the next window (`messageInNext`). |

The `inputs` field supports the same input syntax used elsewhere in data flow graphs, including plain fields, `??` defaults, `? $last`, `$context(key).field`, and `$metadata.*`. For more details about using `$context(key)`, see [Enrich with external data](howto-dataflow-graphs-enrich.md).

Trigger expressions can use the regular graph expression functions and the following running-state functions that reset when the window closes:

| Function | Description |
| --- | --- |
| `running_sum($1)` | Cumulative sum of `$1` across previous messages in the current window. |
| `running_avg($1)` | Cumulative average of `$1` across previous messages. |
| `running_min($1)` | Minimum value of `$1` seen in previous messages. Returns `$1` on the first message (min of one element is itself). |
| `running_max($1)` | Maximum value of `$1` seen in previous messages. Returns `$1` on the first message (max of one element is itself). |
| `running_count($1)` | Count of messages where `$1` was present. |
| `running_count()` | Total message count (no field filter). |
| `first($1)` | First non-empty value of `$1` in the current window. Returns `$1` on the first message. |
| `changed($1)` | `true` if `$1` differs from its value in the previous message. `false` on the first message of a window (no previous value to compare against). |
| `prev($1)` | Most recent non-empty value of `$1` from a prior message in the current window. Messages where `$1` was Empty are skipped (the stored value isn't overwritten). Returns `$1` on the first message of a window. |

> [!NOTE]
> `running_sum($1)` and similar functions return values from previously processed messages. For the current message, use `$1`.

#### Trigger rule examples

Use these examples to see common `inputs` and `trigger` patterns in a complete trigger configuration object:

- This example shows a regular trigger expression. The window closes when the current `temperature` is greater than 80.

```json
{
  "type": "expression",
  "rules": [
    {
      "inputs": ["temperature"],
      "trigger": "$1 > 80",
      "boundaryMessage": "messageInCurrent"
    }
  ]
}
```

- This example shows a trigger expression that uses `running_sum($1) + $1` to combine prior messages in the current window with the current message, then close the window when the threshold is exceeded.

```json
{
  "type": "expression",
  "rules": [
    {
      "inputs": ["temperature"],
      "trigger": "running_sum($1) + $1 > 100",
      "boundaryMessage": "messageInCurrent"
    }
  ]
}
```

- This example shows null-safe input handling with `temperature ?? 0`, plus `messageInNext` to place the boundary message in the next window.

```json
{
  "type": "expression",
  "rules": [
    {
      "inputs": ["temperature ?? 0"],
      "trigger": "running_avg($1) > 80",
      "boundaryMessage": "messageInNext"
    }
  ]
}
```

- This example shows a metadata-based trigger where the window closes for a specific topic value from `$metadata.topic`.

```json
{
  "type": "expression",
  "rules": [
    {
      "inputs": ["$metadata.topic"],
      "trigger": "$1 == \"telemetry/high-priority\"",
      "boundaryMessage": "messageInCurrent"
    }
  ]
}
```

- This example shows trigger rules using dataset enrichment: it matches the message `factoryId` to a state-store row, reads `shiftId` from `$context(factory).shiftId`, and closes the window when that shift value changes (`changed($1)`).

```json
{
  "type": "expression",
  "datasets": [
    {
      "key": "factory",
      "inputs": ["$source.factoryId", "$context.factoryId"],
      "expression": "$1 == $2"
    }
  ],
  "rules": [
    {
      "inputs": ["$context(factory).shiftId"],
      "trigger": "changed($1)",
      "boundaryMessage": "messageInCurrent"
    }
  ]
}
```

In this example, the state store dataset represented by `factory` is expected to contain fields like `factoryId` and `shiftId`.

### Boundary behavior

The `boundaryMessage` setting controls what happens to the message that caused a **count**, **memory**, or **trigger**-based window to close:

- `messageInCurrent`: include the boundary message in the closing window.
- `messageInNext`: close the current window first, then start the next window with the boundary message.

If `messageInNext` fires on the first message in a new window, the close is suppressed so that an empty window isn't emitted.

> [!NOTE]
> Duration-based window doesn't use `boundaryMessage`. Duration boundaries are time-based, not message-based, so there isn't a boundary message to place in the current or next window.

### Combine closing conditions

You can combine duration, count, memory, and trigger conditions in the same graph.

- Duration is time-driven and evaluated by the timer.
- For each incoming message, message-driven conditions are evaluated in this order: `Memory > Count > Trigger`.
- Within `triggers.rules`, rules are evaluated sequentially and the first matching rule wins.

The evaluation order in message-driven conditions matters for the accumulation results when a message satisfies multiple conditions at the same time. For example, if `memory` uses `messageInCurrent` and `count` uses `messageInNext`, a message that satisfies both conditions follows the memory configuration. The message stays in the current window and contributes to that window's accumulation output.

## Define accumulation rules

Each accumulation rule specifies how to reduce a window of messages into a single output value. The configuration key is `rules`.

# [Operations experience](#tab/portal)

In the window transform configuration, add an accumulation rule with input `temperature`, output `avgTemperature`, and aggregation function `average($1)`.

# [Azure CLI](#tab/cli)

The CLI applies the whole graph from one config file, so add this to the window transform node's `configuration` in your `graph.json` and apply it with [`az iot ops dataflowgraph apply`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-apply).

The rules are a JSON object:

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

These rules go in the `value` field as an escaped string:

```json
{
  "key": "rules",
  "value": "{\"accumulate\":[{\"inputs\":[\"temperature\"],\"output\":\"avgTemperature\",\"expression\":\"average($1)\"}]}"
}
```

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

Combine multiple aggregation functions in a single expression:

# [Operations experience](#tab/portal)

Add a rule with inputs `temperature` and `humidity`, and expression `average($1) + max($2)`.

# [Azure CLI](#tab/cli)

The CLI applies the whole graph from one config file, so add this to the corresponding place in your `graph.json` and apply it with [`az iot ops dataflowgraph apply`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-apply):

```json
{
  "inputs": [
    "temperature",
    "humidity"
  ],
  "output": "tempHumidityIndex",
  "expression": "average($1) + max($2)"
}
```

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

This example shows a complete window configuration that closes the window after 30 seconds, 5 messages, 1,048,576 buffered bytes, or when `running_sum($1) + $1 > 100`. The example sets the `boundaryMessage` value to `messageInCurrent` for the last three conditions, and the window computes temperature statistics when it closes.

Which condition closes the window depends on message timing, count, payload size, and content. The following examples show the resulting output for each closing condition.

### Duration closes

If no other condition fires first and the window reaches 30 seconds after receiving these three messages:

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

### Count closes

If the window receives these five messages before any other condition fires:

```json
{ "temperature": 20.0 }
{ "temperature": 22.0 }
{ "temperature": 21.0 }
{ "temperature": 24.0 }
{ "temperature": 23.0 }
```

The output message is:

```json
{
  "avgTemperature": 22.0,
  "minTemperature": 20.0,
  "maxTemperature": 24.0,
  "readingCount": 5,
  "tempRange": 4.0
}
```

### Memory closes

If the buffered payload size reaches 1,048,576 bytes before any other condition fires, for example after these two large messages:

```json
{ "temperature": 21.0, "payloadPad": "<large string>" }
{ "temperature": 22.5, "payloadPad": "<large string>" }
```

The output message is:

```json
{
  "avgTemperature": 21.75,
  "minTemperature": 21.0,
  "maxTemperature": 22.5,
  "readingCount": 2,
  "tempRange": 1.5
}
```

### Trigger closes

If the trigger expression `running_sum($1) + $1 > 100` fires before any other condition, for example after these three messages:

```json
{ "temperature": 40.0 }
{ "temperature": 35.0 }
{ "temperature": 30.0 }
```

The output message is:

```json
{
  "avgTemperature": 35.0,
  "minTemperature": 30.0,
  "maxTemperature": 40.0,
  "readingCount": 3,
  "tempRange": 10.0
}
```

# [Operations experience](#tab/portal)

In the Operations experience, create a data flow graph with a window transform:

1. Add a **source** that reads from `telemetry/temperature`.
1. Add a **window** transform. Configure a 30-second duration window, a 5-message count limit, a 1,048,576-byte buffer size limit, and a trigger rule on `temperature` with expression `running_sum($1) + $1 > 100`. For the count, memory, and trigger conditions, set the boundary message behavior to `messageInCurrent`. Add accumulation rules for average, min, max, count, and range on the `temperature` field.
1. Add a **destination** that sends to `telemetry/aggregated`.

# [Azure CLI](#tab/cli)

The Azure CLI applies a data flow graph from a single JSON config file. Create a `graph.json` file with the graph properties. In the `graph.json` file, store each transform's rules in the `value` field as an escaped JSON string. For the readable form of each transform's rules, see the how-to for that transform type.

```json
{
  "mode": "Enabled",
  "nodes": [
    {
      "nodeType": "Source",
      "name": "sensors",
      "sourceSettings": {
        "endpointRef": "default",
        "dataSources": [
          "telemetry/temperature"
        ]
      }
    },
    {
      "nodeType": "Graph",
      "name": "aggregate",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-window:1.1.0",
        "configuration": [
          {
            "key": "delay",
            "value": "{\"type\":\"duration\",\"delaySeconds\":30}"
          },
          {
            "key": "count",
            "value": "{\"type\":\"messageCount\",\"maxMessageCount\":5,\"boundaryMessage\":\"messageInCurrent\"}"
          },
          {
            "key": "memory",
            "value": "{\"type\":\"bufferSize\",\"maxBufferBytes\":1048576,\"boundaryMessage\":\"messageInCurrent\"}"
          },
          {
            "key": "triggers",
            "value": "{\"type\":\"expression\",\"rules\":[{\"inputs\":[\"temperature\"],\"trigger\":\"running_sum($1) + $1 > 100\",\"boundaryMessage\":\"messageInCurrent\"}]}"
          },
          {
            "key": "rules",
            "value": "{\"accumulate\":[{\"inputs\":[\"temperature\"],\"output\":\"avgTemperature\",\"expression\":\"average($1)\"},{\"inputs\":[\"temperature\"],\"output\":\"minTemperature\",\"expression\":\"min($1)\"},{\"inputs\":[\"temperature\"],\"output\":\"maxTemperature\",\"expression\":\"max($1)\"},{\"inputs\":[\"temperature\"],\"output\":\"readingCount\",\"expression\":\"count($1)\"},{\"inputs\":[\"temperature\"],\"output\":\"tempRange\",\"expression\":\"max($1) - min($1)\"}]}"
          }
        ]
      }
    },
    {
      "nodeType": "Destination",
      "name": "output",
      "destinationSettings": {
        "endpointRef": "default",
        "dataDestination": "telemetry/aggregated"
      }
    }
  ],
  "nodeConnections": [
    {
      "from": {
        "name": "sensors"
      },
      "to": {
        "name": "aggregate"
      }
    },
    {
      "from": {
        "name": "aggregate"
      },
      "to": {
        "name": "output"
      }
    }
  ]
}
```

Apply the config file.

```azurecli
az iot ops dataflowgraph apply \
  --name temperature-window \
  --instance $AIO_INSTANCE_NAME \
  --resource-group $RESOURCE_GROUP \
  --config-file graph.json
```

# [Bicep](#tab/bicep)

```bicep
resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2026-03-01' = {
  name: 'temperature-window'
  parent: dataflowProfile
  properties: {
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
          artifact: 'azureiotoperations/graph-dataflow-window:1.1.0'
          configuration: [
            {
              key: 'delay'
              value: '{"type":"duration","delaySeconds":30}'
            }
            {
              key: 'count'
              value: '{"type":"messageCount","maxMessageCount":5,"boundaryMessage":"messageInCurrent"}'
            }
            {
              key: 'memory'
              value: '{"type":"bufferSize","maxBufferBytes":1048576,"boundaryMessage":"messageInCurrent"}'
            }
            {
              key: 'triggers'
              value: '{"type":"expression","rules":[{"inputs":["temperature"],"trigger":"running_sum($1) + $1 > 100","boundaryMessage":"messageInCurrent"}]}'
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
        artifact: azureiotoperations/graph-dataflow-window:1.1.0
        configuration:
          - key: delay
            value: |
              {
                "type": "duration",
                "delaySeconds": 30
              }
          - key: count
            value: |
              {
                "type": "messageCount",
                "maxMessageCount": 5,
                "boundaryMessage": "messageInCurrent"
              }
          - key: memory
            value: |
              {
                "type": "bufferSize",
                "maxBufferBytes": 1048576,
                "boundaryMessage": "messageInCurrent"
              }
          - key: triggers
            value: |
              {
                "type": "expression",
                "rules": [
                  {
                    "inputs": ["temperature"],
                    "trigger": "running_sum($1) + $1 > 100",
                    "boundaryMessage": "messageInCurrent"
                  }
                ]
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
- [Throttle data](howto-dataflow-graphs-throttle.md)
<!-- - [Filter and route data](howto-dataflow-graphs-filter-route.md)
- [Enrich with external data](howto-dataflow-graphs-enrich.md)
- [Expressions reference](concept-dataflow-graphs-expressions.md)
- [Configure a source](howto-configure-dataflow-source.md)
- [Configure a destination](howto-configure-dataflow-destination.md) -->
