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

# [Bicep](#tab/bicep)

```bicep
resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2026-03-01' = {
  name: 'sensors-throttle'
  parent: dataflowProfile
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
      { from: { name: 'sensors' }, to: { name: 'throttle' } }
      { from: { name: 'throttle' }, to: { name: 'output' } }
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

- [Transform data with map](howto-dataflow-graphs-map.md)
- [Filter and route data](howto-dataflow-graphs-filter-route.md)
- [Aggregate data over time](howto-dataflow-graphs-window.md)
- [Enrich with external data](howto-dataflow-graphs-enrich.md)
- [Expressions reference](concept-dataflow-graphs-expressions.md)
- [Configure a source](howto-configure-dataflow-source.md)
- [Configure a destination](howto-configure-dataflow-destination.md)
