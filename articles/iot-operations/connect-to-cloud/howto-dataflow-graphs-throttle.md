---
title: Throttle MQTT message rate in data flow graphs
titleSuffix: Azure IoT Operations
description: Learn how to limit the message rate per MQTT topic using the throttle transform in Azure IoT Operations data flow graphs.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 07/22/2026
ai-usage: ai-assisted

#customer intent: As an Azure IoT Operations operator, I want to limit the message rate per MQTT topic so that I can protect downstream systems from bursty or high-frequency sources.
---
# Throttle data in data flow graphs

A throttle transform rate-limits how often it forwards messages on an MQTT topic. Instead of dropping messages based on their content, the throttle transform drops messages based on when it processes them, forwarding at most one message per topic pattern within each configured interval. Use throttling to protect downstream systems from bursty or high-frequency sources without changing message content.

For an overview of data flow graphs and how transforms compose in a pipeline, see [Data flow graphs overview](concept-dataflow-graphs.md).

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../includes/prereq-deployed-instance.md)]
- Deployment automatically creates a default registry endpoint named `default` that points to `mcr.microsoft.com`. The built-in transforms use this endpoint.

## Scaling limitation for stateful graphs

[!INCLUDE [dataflow-graphs-scaling-limitation](../includes/dataflow-graphs-scaling-limitation.md)]

## How the throttle transform works

The throttle transform evaluates each incoming message's topic against an ordered list of per-topic rules:

- **First match wins.** The transform evaluates rules in order. The first rule whose `topic` pattern matches the message's topic determines whether the transform forwards the message. The transform doesn't check later rules, even if they would also match.
- **Unmatched topics pass through.** If no rule matches the message's topic, the transform forwards the message without any throttling.
- **Forwarding is time-based, not count-based.** For a matched rule, the transform forwards the first message it processes, then drops every subsequent message on that pattern until the configured interval (`1000 / maxMessagesPerSecond` milliseconds, rounded up) elapses since the last forwarded message. This behavior bounds the maximum rate but doesn't allow bursts to make up for earlier drops.
- **Shared state per pattern, not per topic.** When a rule's `topic` pattern uses a wildcard, all concrete topics that match it share the same throttle state within a transform instance. For example, a single `sensors/+` rule limits the combined rate across `sensors/temperature` and `sensors/humidity`, not each one independently.
- **`0` drops everything.** Setting `maxMessagesPerSecond` to `0` for a rule drops every message that matches that rule's pattern.
- **Timing is based on processing time, not message content.** The transform uses its monotonic clock when it processes each message. It doesn't read a timestamp field from the message payload.

> [!NOTE]
> The throttle transform only decides whether to forward or drop a message. It never modifies message content.

## Configure per-topic throttle rules

Define throttle rules in the `throttle` configuration key (not `rules`) as a JSON object with a `perTopicThrottles` array.

# [Operations experience](#tab/portal)

In the throttle transform configuration, add one or more throttle rules. For each rule, specify:

| Setting | Description |
|---------|-------------|
| **Topic** | The MQTT topic pattern to match. Supports the `+` (single-level) and `#` (multi-level) wildcards. |
| **Max messages per second** | The maximum forwarding rate for topics that match this pattern. Set to `0` to drop every matching message. |

# [Azure CLI](#tab/cli)

The CLI applies the whole graph from one config file. Add this configuration to the throttle transform node's `configuration` in your `graph.json` file, and apply it by using [`az iot ops dataflowgraph apply`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-apply).

The configuration is a JSON object:

```json
{
  "perTopicThrottles": [
    {
      "topic": "sensors/temperature",
      "maxMessagesPerSecond": 10
    }
  ]
}
```

Add this configuration in the `value` field as an escaped string, under the `throttle` key:

```json
"configuration": [
  {
    "key": "throttle",
    "value": "{\"perTopicThrottles\":[{\"topic\":\"sensors/temperature\",\"maxMessagesPerSecond\":10}]}"
  }
]
```

[!INCLUDE [dataflow-jq-tip](../includes/dataflow-jq-tip.md)]

# [Bicep](#tab/bicep)

```bicep
configuration: [
  {
    key: 'throttle'
    value: '{"perTopicThrottles":[{"topic":"sensors/temperature","maxMessagesPerSecond":10}]}'
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
configuration:
  - key: throttle
    value: |
      {
        "perTopicThrottles": [
          {
            "topic": "sensors/temperature",
            "maxMessagesPerSecond": 10
          }
        ]
      }
```

---

With this rule, the transform forwards the first `sensors/temperature` message it processes, then drops any further messages on that topic that it processes less than 100 milliseconds later (`1000 / 10`). This rule doesn't affect topics other than `sensors/temperature`.

Each entry in `perTopicThrottles` has these properties:

| Property | Required | Description |
|----------|----------|-------------|
| `topic` | Yes | MQTT topic pattern to match. Supports the `+` (single-level) and `#` (multi-level, trailing-only) wildcards. |
| `maxMessagesPerSecond` | Yes | Maximum forwarding rate for topics that match this pattern, in messages per second. The transform allows fractional values. For example, `0.1` allows one message every 10 seconds. Must be zero or a positive, finite number. Set to `0` to drop every message that matches the pattern. Timing has 1-millisecond precision, so values greater than `1000` have the same effective limit as `1000`. |

> [!IMPORTANT]
> Each `topic` pattern in `perTopicThrottles` must be unique. The transform rejects configuring the same pattern string more than once during initialization.

## Use multiple per-topic rules

Because the transform evaluates rules in order and the first match wins, list more specific patterns before more general ones if you want them to have their own rate limit:

# [Operations experience](#tab/portal)

Add two rules, in this order:

| Order | Topic | Max messages per second |
|-------|-------|--------------------------|
| 1 | `sensors/temperature` | `10` |
| 2 | `sensors/#` | `1` |

# [Azure CLI](#tab/cli)

```json
{
  "perTopicThrottles": [
    {
      "topic": "sensors/temperature",
      "maxMessagesPerSecond": 10
    },
    {
      "topic": "sensors/#",
      "maxMessagesPerSecond": 1
    }
  ]
}
```

# [Bicep](#tab/bicep)

```bicep
configuration: [
  {
    key: 'throttle'
    value: '{"perTopicThrottles":[{"topic":"sensors/temperature","maxMessagesPerSecond":10},{"topic":"sensors/#","maxMessagesPerSecond":1}]}'
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
configuration:
  - key: throttle
    value: |
      {
        "perTopicThrottles": [
          { "topic": "sensors/temperature", "maxMessagesPerSecond": 10 },
          { "topic": "sensors/#", "maxMessagesPerSecond": 1 }
        ]
      }
```

---

Messages on `sensors/temperature` match the first rule and are limited to 10 messages per second. Messages on any other `sensors/*` topic (for example, `sensors/humidity`) match the second rule and share a combined limit of 1 message per second.

> [!IMPORTANT]
> Order matters. If the `sensors/#` rule were listed first, it would match `sensors/temperature` messages too, and the transform would never reach the more specific rule.

## Use wildcards to throttle groups of topics

The `topic` pattern supports the same wildcards as MQTT topic filters:

| Wildcard | Matches | Example |
|----------|---------|---------|
| `+` | Exactly one topic level | `sensors/+/status` matches `sensors/line1/status` but not `sensors/line1/sub/status` |
| `#` | Zero or more remaining topic levels, and must be the last segment | `sensors/#` matches `sensors`, `sensors/temperature`, and `sensors/line1/temperature` |

All concrete topics that match the same wildcard rule share one throttle state.

# [Operations experience](#tab/portal)

Add a rule with topic `sensors/+` and max messages per second `1`.

# [Azure CLI](#tab/cli)

```json
{
  "perTopicThrottles": [
    {
      "topic": "sensors/+",
      "maxMessagesPerSecond": 1
    }
  ]
}
```

# [Bicep](#tab/bicep)

```bicep
configuration: [
  {
    key: 'throttle'
    value: '{"perTopicThrottles":[{"topic":"sensors/+","maxMessagesPerSecond":1}]}'
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
configuration:
  - key: throttle
    value: |
      {
        "perTopicThrottles": [
          { "topic": "sensors/+", "maxMessagesPerSecond": 1 }
        ]
      }
```

---

With this rule, a message on `sensors/temperature` and a message on `sensors/humidity` processed 500 milliseconds apart aren't both forwarded—the second one is dropped, because it counts against the same shared 1-second interval as the first, regardless of which concrete topic it's on.

> [!NOTE]
> A bare `#` pattern matches every topic and applies a single, combined rate limit within each transform instance.

## Drop all messages for a topic

Set `maxMessagesPerSecond` to `0` to drop every message that matches a pattern, without removing the rule or the topic from your pipeline:

# [Operations experience](#tab/portal)

Add a rule with topic `debug/#` and max messages per second `0`.

# [Azure CLI](#tab/cli)

```json
{
  "perTopicThrottles": [
    {
      "topic": "debug/#",
      "maxMessagesPerSecond": 0
    }
  ]
}
```

# [Bicep](#tab/bicep)

```bicep
configuration: [
  {
    key: 'throttle'
    value: '{"perTopicThrottles":[{"topic":"debug/#","maxMessagesPerSecond":0}]}'
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
configuration:
  - key: throttle
    value: |
      {
        "perTopicThrottles": [
          { "topic": "debug/#", "maxMessagesPerSecond": 0 }
        ]
      }
```

---

## Deploy a data flow graph with throttle

To apply throttling end to end, deploy a data flow graph that connects a source, a throttle transform, and a destination. Use the tool that matches your workflow.

# [Operations experience](#tab/portal)

In the Operations experience, create a data flow graph with a throttle transform:

1. Add a **source** that reads from your MQTT topic.
1. Add a **throttle** transform. Add one or more per-topic rules, ordered from most to least specific.
1. Add a **destination** that sends to your output topic.

# [Azure CLI](#tab/cli)

The Azure CLI applies a data flow graph from a single JSON configuration file. Create a `graph.json` file with the graph properties. In the `graph.json` file, each transform stores its configuration in the `value` field as an escaped JSON string. For the readable form of the throttle configuration, see [Configure per-topic throttle rules](#configure-per-topic-throttle-rules). Apply it by using [`az iot ops dataflowgraph apply`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-apply).

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
          "sensors/#"
        ]
      }
    },
    {
      "nodeType": "Graph",
      "name": "throttle",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-throttle:1.0.0",
        "configuration": [
          {
            "key": "throttle",
            "value": "{\"perTopicThrottles\":[{\"topic\":\"sensors/temperature\",\"maxMessagesPerSecond\":10},{\"topic\":\"sensors/#\",\"maxMessagesPerSecond\":1}]}"
          }
        ]
      }
    },
    {
      "nodeType": "Destination",
      "name": "output",
      "destinationSettings": {
        "endpointRef": "default",
        "dataDestination": "telemetry/throttled"
      }
    }
  ],
  "nodeConnections": [
    {
      "from": {
        "name": "sensors"
      },
      "to": {
        "name": "throttle"
      }
    },
    {
      "from": {
        "name": "throttle"
      },
      "to": {
        "name": "output"
      }
    }
  ]
}
```

Apply the configuration to the existing instance's `default` profile:

```azurecli
az iot ops dataflowgraph apply \
  --name sensors-throttle \
  --instance $AIO_INSTANCE_NAME \
  --resource-group $RESOURCE_GROUP \
  --config-file graph.json
```

# [Bicep](#tab/bicep)

Save the following template as `main.bicep`.

```bicep
param aioInstanceName string
param customLocationName string

resource aioInstance 'Microsoft.IoTOperations/instances@2026-07-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource dataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2026-07-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2026-07-01' = {
  name: 'sensors-throttle'
  parent: dataflowProfile
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    nodes: [
      {
        nodeType: 'Source'
        name: 'sensors'
        sourceSettings: {
          endpointRef: 'default'
          dataSources: [ 'sensors/#' ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'throttle'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-throttle:1.0.0'
          configuration: [
            {
              key: 'throttle'
              value: '{"perTopicThrottles":[{"topic":"sensors/temperature","maxMessagesPerSecond":10},{"topic":"sensors/#","maxMessagesPerSecond":1}]}'
            }
          ]
        }
      }
      {
        nodeType: 'Destination'
        name: 'output'
        destinationSettings: {
          endpointRef: 'default'
          dataDestination: 'telemetry/throttled'
        }
      }
    ]
    nodeConnections: [
      {
        from: { name: 'sensors' }
        to: { name: 'throttle' }
      }
      {
        from: { name: 'throttle' }
        to: { name: 'output' }
      }
    ]
  }
}
```

Set `CUSTOM_LOCATION_NAME` to the existing instance's custom location name, then deploy to the resource group containing the instance and custom location:

```azurecli
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --template-file main.bicep \
  --parameters aioInstanceName=$AIO_INSTANCE_NAME customLocationName=$CUSTOM_LOCATION_NAME
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: sensors-throttle
  namespace: azure-iot-operations
spec:
  profileRef: default
  nodes:
    - nodeType: Source
      name: sensors
      sourceSettings:
        endpointRef: default
        dataSources:
          - sensors/#
    - nodeType: Graph
      name: throttle
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-throttle:1.0.0
        configuration:
          - key: throttle
            value: |
              {
                "perTopicThrottles": [
                  { "topic": "sensors/temperature", "maxMessagesPerSecond": 10 },
                  { "topic": "sensors/#", "maxMessagesPerSecond": 1 }
                ]
              }
    - nodeType: Destination
      name: output
      destinationSettings:
        endpointRef: default
        dataDestination: telemetry/throttled
  nodeConnections:
    - from: { name: sensors }
      to: { name: throttle }
    - from: { name: throttle }
      to: { name: output }
```

---

## Example: forward at most two messages per second

This example reduces a stream of 10 messages per second to at most 2. Forwarded messages keep their original content; excess messages are dropped. Use it when you can discard intermediate readings.

Complete the [shared example prerequisites](dataflow-patterns/overview-dataflow-patterns.md#prerequisites), including the `default` profile and `factory-mqtt` MQTT endpoint in the `azure-iot-operations` namespace. Keep the profile on one instance for the stated rate; each instance maintains its own throttle state.

:::image type="content" source="media/concept-dataflow-graphs/rate-limit-telemetry.svg" alt-text="Diagram of ten messages per second entering a throttle, which forwards unchanged messages at least 500 milliseconds apart to the destination and drops the eight excess messages in the example second." border="false":::

<!--
```mermaid
graph LR
    S("Source: factory/readings<br/>10 messages/s<br/>0, 100, ..., 900 ms") --&gt; T("BUILT-IN Throttle<br/>Maximum 2 messages/s<br/>Minimum interval 500 ms")
    T --&gt; D("Destination: factory/rate-limited<br/>Forwarded unchanged<br/>reading-001 at 0 ms<br/>reading-006 at 500 ms")
    T --&gt; X("Dropped messages<br/>reading-002 to reading-005<br/>reading-007 to reading-010")
```
-->

# [Operations experience](#tab/portal)

In the Operations experience, create a data flow graph named `rate-limit-telemetry` on the `default` profile:

1. Add a source named `source` with endpoint `factory-mqtt` and topic `factory/readings`.
1. Add the built-in **throttle** transform named `throttle`. Add one per-topic rule with topic `factory/readings` and **Max messages per second** set to `2`.
1. Add a destination named `destination` with endpoint `factory-mqtt` and topic `factory/rate-limited`.
1. Connect `source` to `throttle`, then `throttle` to `destination`. Save and enable the graph.

The throttle forwards messages unchanged at least 500 milliseconds apart and drops excess messages. It doesn't buffer messages or select the latest value.

# [Azure CLI](#tab/cli)

Save these complete graph properties as `graph.json`:

```json
{
  "mode": "Enabled",
  "nodes": [
    {
      "name": "source",
      "nodeType": "Source",
      "sourceSettings": {
        "endpointRef": "factory-mqtt",
        "dataSources": ["factory/readings"]
      }
    },
    {
      "name": "throttle",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-throttle:1.0.0",
        "configuration": [
          {
            "key": "throttle",
            "value": "{\"perTopicThrottles\":[{\"topic\":\"factory/readings\",\"maxMessagesPerSecond\":2}]}"
          }
        ]
      }
    },
    {
      "name": "destination",
      "nodeType": "Destination",
      "destinationSettings": {
        "endpointRef": "factory-mqtt",
        "dataDestination": "factory/rate-limited"
      }
    }
  ],
  "nodeConnections": [
    {
      "from": { "name": "source" },
      "to": { "name": "throttle" }
    },
    {
      "from": { "name": "throttle" },
      "to": { "name": "destination" }
    }
  ]
}
```

Apply the configuration to the existing instance's `default` profile:

```azurecli
az iot ops dataflowgraph apply \
  --name rate-limit-telemetry \
  --instance $AIO_INSTANCE_NAME \
  --resource-group $RESOURCE_GROUP \
  --config-file graph.json
```

# [Bicep](#tab/bicep)

Save the following template as `main.bicep`:

```bicep
param aioInstanceName string
param customLocationName string

resource aioInstance 'Microsoft.IoTOperations/instances@2026-07-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource dataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2026-07-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2026-07-01' = {
  name: 'rate-limit-telemetry'
  parent: dataflowProfile
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    nodes: [
      {
        name: 'source'
        nodeType: 'Source'
        sourceSettings: {
          endpointRef: 'factory-mqtt'
          dataSources: [ 'factory/readings' ]
        }
      }
      {
        name: 'throttle'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-throttle:1.0.0'
          configuration: [
            {
              key: 'throttle'
              value: '{"perTopicThrottles":[{"topic":"factory/readings","maxMessagesPerSecond":2}]}'
            }
          ]
        }
      }
      {
        name: 'destination'
        nodeType: 'Destination'
        destinationSettings: {
          endpointRef: 'factory-mqtt'
          dataDestination: 'factory/rate-limited'
        }
      }
    ]
    nodeConnections: [
      {
        from: { name: 'source' }
        to: { name: 'throttle' }
      }
      {
        from: { name: 'throttle' }
        to: { name: 'destination' }
      }
    ]
  }
}
```

Set `CUSTOM_LOCATION_NAME` to the existing instance's custom location name, then deploy to the resource group containing the instance and custom location:

```azurecli
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --template-file main.bicep \
  --parameters aioInstanceName=$AIO_INSTANCE_NAME customLocationName=$CUSTOM_LOCATION_NAME
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

Save this complete **Graph YAML** as `rate-limit-telemetry.yaml` and apply it for debugging with `kubectl apply -f rate-limit-telemetry.yaml`.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: rate-limit-telemetry
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
  nodes:
    - name: source
      nodeType: Source
      sourceSettings:
        endpointRef: factory-mqtt
        dataSources: [factory/readings]
    - name: throttle
      nodeType: Graph
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-throttle:1.0.0
        configuration:
          - key: throttle
            value: |
              {
                "perTopicThrottles": [
                  {"topic":"factory/readings","maxMessagesPerSecond":2}
                ]
              }
    - name: destination
      nodeType: Destination
      destinationSettings:
        endpointRef: factory-mqtt
        dataDestination: factory/rate-limited
  nodeConnections:
    - from: { name: source }
      to: { name: throttle }
    - from: { name: throttle }
      to: { name: destination }
```

---

### Check the output

For a fresh transform instance, process these ten messages on `factory/readings` at 100-millisecond intervals. Times are relative to processing the first message. The transform uses its monotonic processing clock; publisher timestamps and delivery times are separate.

| Input on `factory/readings` | Processing time | Output on `factory/rate-limited` |
| --- | --- | --- |
| `{"messageId":"reading-001","temperature":20}` | 0 ms | Same payload |
| `{"messageId":"reading-002","temperature":21}` | 100 ms | Dropped |
| `{"messageId":"reading-003","temperature":22}` | 200 ms | Dropped |
| `{"messageId":"reading-004","temperature":23}` | 300 ms | Dropped |
| `{"messageId":"reading-005","temperature":24}` | 400 ms | Dropped |
| `{"messageId":"reading-006","temperature":25}` | 500 ms | Same payload |
| `{"messageId":"reading-007","temperature":26}` | 600 ms | Dropped |
| `{"messageId":"reading-008","temperature":27}` | 700 ms | Dropped |
| `{"messageId":"reading-009","temperature":28}` | 800 ms | Dropped |
| `{"messageId":"reading-010","temperature":29}` | 900 ms | Dropped |

The expected two output messages are:

```json
{"messageId":"reading-001","temperature":20}
```

```json
{"messageId":"reading-006","temperature":25}
```

The throttle drops excess readings immediately. Buffering, queueing, latest-value selection, and smoothing require separate processing. Use durable buffering and application-controlled backpressure for alarms, commands, or audit events that require every event to be retained.

For state and scaling constraints, see [Limitations](#limitations).

## Limitations

- **Doesn't modify messages.** The throttle transform only forwards or drops messages; it doesn't change message content.
- **First match wins.** The transform applies only the first rule whose `topic` pattern matches the message's topic. List more specific patterns before more general ones.
- **Shared state per pattern.** A wildcard rule shares its rate limit across every concrete topic it matches. There isn't a separate limit per topic.
- **No burst allowance.** The transform enforces a minimum time between forwarded messages per matched pattern. It doesn't accumulate unused capacity from earlier, slower periods.
- **Millisecond precision.** The minimum throttle interval is 1 millisecond, so values greater than `1000` for `maxMessagesPerSecond` don't increase the effective forwarding rate beyond 1,000 messages per second.
- **Timing is based on processing time, not message content.** The transform uses the time it processes each message, not the time the broker received it or a timestamp field in the payload.
- **State is local and in memory.** Each data flow profile instance maintains its own throttle state. Restarting or reconfiguring the transform resets that state. If a profile has multiple instances, each instance enforces the configured rate independently.
- **Duplicate topic patterns aren't allowed.** Configuring the same `topic` string more than once in `perTopicThrottles` fails when the transform initializes.

## Related content

- [Choose another pattern](dataflow-patterns/overview-dataflow-patterns.md)
- [Noise reduction](dataflow-patterns/howto-reduce-noise.md)
- [Transform data with map](howto-dataflow-graphs-map.md)
- [Filter and route data](howto-dataflow-graphs-filter-route.md)
- [Aggregate data over time](howto-dataflow-graphs-window.md)
- [Enrich with external data](howto-dataflow-graphs-enrich.md)
- [Expressions reference](concept-dataflow-graphs-expressions.md)
- [Configure a source](howto-configure-dataflow-source.md)
- [Configure a destination](howto-configure-dataflow-destination.md)
