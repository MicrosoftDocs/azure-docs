---
title: Filter and route data in data flow graphs
description: Learn how to filter, branch, and merge messages using data flow graphs in Azure IoT Operations.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 04/16/2026
ai-usage: ai-assisted

---

# Filter and route data in data flow graphs

Data flow graphs provide two ways to control which messages flow through your pipeline: **filter** transforms drop unwanted messages, and **branch** transforms route each message down one of two paths based on a condition. After branching, a **concatenate** transform merges the paths back together.

For an overview of data flow graphs and how transforms compose in a pipeline, see [Data flow graphs overview](concept-dataflow-graphs.md).

## Prerequisites

- An Azure IoT Operations instance deployed on an Arc-enabled Kubernetes cluster. For more information, see [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md).
- A default registry endpoint named `default` that points to `mcr.microsoft.com` is automatically created during deployment. The built-in transforms use this endpoint.

## Filter transform

A filter transform evaluates each incoming message against one or more rules and decides whether the message continues through the pipeline or gets dropped.

### How filter rules work

Each filter rule has these properties:

| Property | Required | Description |
|----------|----------|-------------|
| `inputs` | Yes | List of field paths to read from the incoming message. |
| `expression` | Yes | Formula applied to the input values. Must return a boolean. |
| `description` | No | Human-readable label used in error messages. |

Inputs are assigned positional variables based on their order: the first input is `$1`, the second is `$2`, and so on.

When you define multiple rules, they use **OR logic**: if *any* rule evaluates to true, the message is dropped. The engine short-circuits once a rule matches.

Key constraints:

- **Expression is required.** Every filter rule must include an `expression`.
- **No wildcard inputs.** Each input must reference a specific field path.
- **Missing fields cause errors.** If a field referenced in `inputs` doesn't exist, the filter returns an error rather than silently passing the message.
- **Non-boolean results cause errors.** If an expression returns a non-boolean value (such as a string or number), the filter returns an error.

### Drop messages by condition

To drop messages where the temperature exceeds 100:

# [Operations experience](#tab/portal)

In the filter transform configuration, add a rule:

| Setting | Value |
|---------|-------|
| **Input** | `temperature` |
| **Expression** | `$1 > 100` |

# [Bicep](#tab/bicep)

```bicep
filter: [
  {
    inputs: [ 'temperature' ]
    expression: '$1 > 100'
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
- inputs:
    - temperature     # $1
  expression: "$1 > 100"
```

---

Messages where the temperature is 100 or less pass through. Messages above 100 are dropped.

### Use multiple conditions

When you define more than one rule, the filter drops the message if *any* rule matches:

# [Operations experience](#tab/portal)

Add two rules:

| Input | Expression | Description |
|-------|-----------|-------------|
| `temperature` | `$1 > 100` | Drop high temperature |
| `humidity` | `$1 > 95` | Drop high humidity |

# [Bicep](#tab/bicep)

```bicep
filter: [
  {
    inputs: [ 'temperature' ]
    expression: '$1 > 100'
    description: 'Drop high temperature'
  }
  {
    inputs: [ 'humidity' ]
    expression: '$1 > 95'
    description: 'Drop high humidity'
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
- inputs:
    - temperature     # $1
  expression: "$1 > 100"
  description: "Drop high temperature"

- inputs:
    - humidity     # $1
  expression: "$1 > 95"
  description: "Drop high humidity"
```

---

| Message | temperature rule | humidity rule | Result |
|---------|-----------------|--------------|--------|
| `{"temperature": 150, "humidity": 60}` | true | false | Dropped |
| `{"temperature": 80, "humidity": 98}` | false | true | Dropped |
| `{"temperature": 80, "humidity": 60}` | false | false | Passes |

> [!TIP]
> Use multiple inputs in one rule when you need AND logic across fields. Use multiple rules when you need OR logic across independent conditions.

### Use complex expressions

Reference multiple fields in a single rule and combine them with logical operators:

# [Operations experience](#tab/portal)

Add a rule with inputs `temperature` and `humidity`, and expression `$1 > 30 && $2 < 60`.

# [Bicep](#tab/bicep)

```bicep
filter: [
  {
    inputs: [ 'temperature', 'humidity' ]
    expression: '$1 > 30 && $2 < 60'
    description: 'Drop hot and dry readings'
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
- inputs:
    - temperature     # $1
    - humidity        # $2
  expression: "$1 > 30 && $2 < 60"
  description: "Drop hot and dry readings"
```

---

For the full list of operators and functions, see [Expressions reference](concept-dataflow-graphs-expressions.md).

### Validate messages against a schema

You can configure a filter transform to validate incoming messages against a JSON schema before filter rules run. Messages that don't conform to the schema are dropped immediately.

To enable schema validation, set `validateSchema` to `true` in the filter configuration. When enabled, the filter retrieves the schema from the `schemaRef` on the incoming node connection (the `from` side of the `nodeConnections` entry that feeds into the filter node).

# [Operations experience](#tab/portal)

The filter transform configuration includes a **Validate schema** checkbox. However, the Operations experience doesn't currently support configuring or viewing the `schemaRef` on node connections. To use schema validation, configure the node connection's `schemaRef` through Bicep or Kubernetes manifests.

# [Bicep](#tab/bicep)

Include `validateSchema` in the filter rules JSON and configure `schemaRef` on the incoming node connection:

```bicep
nodes: [
  {
    nodeType: 'Graph'
    name: 'schema-filter'
    graphSettings: {
      registryEndpointRef: 'default'
      artifact: 'azureiotoperations/graph-dataflow-filter:1.0.0'
      configuration: [
        {
          key: 'rules'
          value: '{"version":"1.0.0","validateSchema":true,"filter":[]}'
        }
      ]
    }
  }
]
nodeConnections: [
  {
    from: {
      name: 'sensors'
      schema: {
        schemaRef: 'aio-sr://my-namespace/sensor-schema:1'
        serializationFormat: 'Json'
      }
    }
    to: { name: 'schema-filter' }
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
nodes:
  - nodeType: Graph
    name: schema-filter
    graphSettings:
      registryEndpointRef: default
      artifact: azureiotoperations/graph-dataflow-filter:1.0.0
      configuration:
        - key: rules
          value: |
            {
              "version": "1.0.0",
              "validateSchema": true,
              "filter": []
            }

nodeConnections:
  - from:
      name: sensors
      schema:
        schemaRef: "aio-sr://my-namespace/sensor-schema:1"
        serializationFormat: Json
    to:
      name: schema-filter
```

---

Guidelines:

- Use only one validating filter per pipeline.
- Place the validating filter first so that invalid messages are dropped before other processing.
- Filter rules still apply after schema validation passes. If you only need schema validation, leave the filter rules empty.
- The `schemaRef` must point to a schema in the schema registry. The `serializationFormat` specifies the schema format (for example, `Json`).

To learn about configuring schemas, see [Understand message schemas](concept-schema-registry.md).

### Enrich filter rules with external data

Filter rules support datasets, which let you compare values against data from an external state store. For details on configuring datasets, see [Enrich with external data](howto-dataflow-graphs-enrich.md).

### Full filter configuration

# [Operations experience](#tab/portal)

In the filter transform configuration, add one or more rules with inputs and boolean expressions. Optionally enable schema validation and configure datasets for enrichment lookups.

# [Bicep](#tab/bicep)

The filter rules JSON is passed as the `value` for the `rules` key:

```bicep
configuration: [
  {
    key: 'rules'
    value: '{"datasets":[{"key":"device_limits as limits","inputs":["$source.deviceId","$context.deviceId"],"expression":"$1 == $2"}],"filter":[{"inputs":["temperature"],"expression":"$1 > 100","description":"Drop high temperature readings"},{"inputs":["rawValue","$context(limits).maxValue"],"expression":"$1 > $2","description":"Drop readings above device-specific limit"}]}'
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```json
{
  "datasets": [
    {
      "key": "device_limits as limits",
      "inputs": ["$source.deviceId", "$context.deviceId"],
      "expression": "$1 == $2"
    }
  ],
  "filter": [
    {
      "inputs": ["temperature"],
      "expression": "$1 > 100",
      "description": "Drop high temperature readings"
    },
    {
      "inputs": ["rawValue", "$context(limits).maxValue"],
      "expression": "$1 > $2",
      "description": "Drop readings above device-specific limit"
    }
  ]
}
```

---

| Key | Required | Description |
|-----|----------|-------------|
| `filter` | Yes | Array of filter rules. |
| `datasets` | No | Array of dataset definitions for enrichment lookups. |
| `validateSchema` | No | When `true`, validates messages against a JSON schema before filter rules run. Defaults to `false`. |

## Branch transform

A branch transform evaluates a condition on each incoming message and routes it to one of two output paths: `true` or `false`. Unlike a filter (which drops messages), a branch preserves every message and directs it down the appropriate path.

### How branching works

Every message goes to exactly one of the two paths. Nothing is dropped.

Key constraints:

- The branch expression **must return a boolean**. Non-boolean results cause an error (unlike filter, which also errors on non-boolean).
- **No wildcard inputs.**
- **Exactly one branch rule.** The `branch` key takes a single object, not an array.

> [!IMPORTANT]
> Branching splits messages into separate processing paths, but all paths must merge back together using a concatenate transform before reaching the destination. Think of branching as a way to apply different transformations to different messages, not as a way to route to multiple endpoints.

### Define a branch rule

To branch messages based on a severity threshold:

# [Operations experience](#tab/portal)

In the branch transform configuration, set:

| Setting | Value |
|---------|-------|
| **Input** | `severity` |
| **Expression** | `$1 > 5` |

# [Bicep](#tab/bicep)

```bicep
configuration: [
  {
    key: 'rules'
    value: '{"branch":{"inputs":["severity"],"expression":"$1 > 5","description":"Route high-severity messages"}}'
  }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```json
{
  "branch": {
    "inputs": ["severity"],
    "expression": "$1 > 5",
    "description": "Route high-severity messages"
  }
}
```

---

Messages where `severity` is greater than 5 go to the `true` path. All others go to the `false` path.

### Connect branch outputs

In the pipeline configuration, use the node name followed by `.output.true` or `.output.false` to wire each path to a downstream transform.

# [Operations experience](#tab/portal)

In the data flow graph editor, drag connections from the branch transform's true and false outputs to the appropriate downstream transforms.

# [Bicep](#tab/bicep)

```bicep
nodeConnections: [
  { from: { name: 'sensors' }, to: { name: 'severity-check' } }
  { from: { name: 'severity-check.output.true' }, to: { name: 'alert-transform' } }
  { from: { name: 'severity-check.output.false' }, to: { name: 'normal-transform' } }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
nodeConnections:
  - from: { name: sensors }
    to: { name: severity-check }
  - from: { name: severity-check.output.true }
    to: { name: alert-transform }
  - from: { name: severity-check.output.false }
    to: { name: normal-transform }
```

---

## Merge paths with concatenate

All branch paths must converge before reaching a destination. A concatenate transform merges them. It has no configuration and no rules. Messages from all connected inputs pass through unmodified.

# [Operations experience](#tab/portal)

Add a concatenate transform to the canvas and connect both branch paths to it, then connect the concatenate to the destination.

# [Bicep](#tab/bicep)

```bicep
{
  nodeType: 'Graph'
  name: 'merge'
  graphSettings: {
    registryEndpointRef: 'default'
    artifact: 'azureiotoperations/graph-dataflow-concatenate:1.0.0'
  }
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
- nodeType: Graph
  name: merge
  graphSettings:
    registryEndpointRef: default
    artifact: azureiotoperations/graph-dataflow-concatenate:1.0.0
```

---

## Example: filter, branch, and merge

This end-to-end example filters out bad readings, branches by severity, applies different map transforms to each path, and merges the results.

# [Operations experience](#tab/portal)

:::image type="content" source="media/howto-dataflow-graphs-filter-route/filter-branch-pipeline.png" alt-text="Screenshot of the operations experience canvas showing a filter, branch, map, concat, and destination pipeline." lightbox="media/howto-dataflow-graphs-filter-route/filter-branch-pipeline.png":::

To build this pipeline in the Operations experience:

1. Create a data flow graph and add a **source** that reads from `telemetry/sensors`.
1. Add a **filter** transform. Configure a rule that drops messages where `temperature > 1000`.
1. Add a **branch** transform. Configure the condition `severity > 5` to route high-severity messages to the true path.
1. Add a **map** transform on the true path. Configure rules to rename `deviceId` to `id`, `temperature` to `temp`, and add a field `alert` set to `true`.
1. Add a **map** transform on the false path. Configure rules to rename `deviceId` to `id` and `temperature` to `temp`.
1. Add a **concatenate** transform to merge both paths.
1. Add a **destination** that sends to `telemetry/processed`.
1. Connect the elements: source → filter → branch → (true path: alert map, false path: normal map) → concatenate → destination.

# [Bicep](#tab/bicep)

```bicep
resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2025-10-01' = {
  name: 'alert-routing'
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
          dataSources: [ 'telemetry/sensors' ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'remove-bad-data'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-filter:1.0.0'
          configuration: [
            {
              key: 'rules'
              value: '{"filter":[{"inputs":["temperature"],"expression":"$1 > 1000","description":"Drop impossible temperature readings"}]}'
            }
          ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'severity-check'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-branch:1.0.0'
          configuration: [
            {
              key: 'rules'
              value: '{"branch":{"inputs":["severity"],"expression":"$1 > 5","description":"Route high-severity messages"}}'
            }
          ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'alert-transform'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-map:1.0.0'
          configuration: [
            {
              key: 'rules'
              value: '{"map":[{"inputs":["deviceId"],"output":"id"},{"inputs":["temperature"],"output":"temp"},{"inputs":[],"output":"alert","expression":"true"}]}'
            }
          ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'normal-transform'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-map:1.0.0'
          configuration: [
            {
              key: 'rules'
              value: '{"map":[{"inputs":["deviceId"],"output":"id"},{"inputs":["temperature"],"output":"temp"}]}'
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
          dataDestination: 'telemetry/processed'
        }
      }
    ]
    nodeConnections: [
      { from: { name: 'sensors' }, to: { name: 'remove-bad-data' } }
      { from: { name: 'remove-bad-data' }, to: { name: 'severity-check' } }
      { from: { name: 'severity-check.output.true' }, to: { name: 'alert-transform' } }
      { from: { name: 'severity-check.output.false' }, to: { name: 'normal-transform' } }
      { from: { name: 'alert-transform' }, to: { name: 'merge' } }
      { from: { name: 'normal-transform' }, to: { name: 'merge' } }
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
  name: alert-routing
  namespace: azure-iot-operations
spec:
  profileRef: default
  nodes:
    - nodeType: Source
      name: sensors
      sourceSettings:
        endpointRef: default
        dataSources:
          - telemetry/sensors

    - nodeType: Graph
      name: remove-bad-data
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-filter:1.0.0
        configuration:
          - key: rules
            value: |
              {
                "filter": [
                  {
                    "inputs": ["temperature"],
                    "expression": "$1 > 1000",
                    "description": "Drop impossible temperature readings"
                  }
                ]
              }

    - nodeType: Graph
      name: severity-check
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-branch:1.0.0
        configuration:
          - key: rules
            value: |
              {
                "branch": {
                  "inputs": ["severity"],
                  "expression": "$1 > 5",
                  "description": "Route high-severity messages"
                }
              }

    - nodeType: Graph
      name: alert-transform
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-map:1.0.0
        configuration:
          - key: rules
            value: |
              {
                "map": [
                  { "inputs": ["deviceId"], "output": "id" },
                  { "inputs": ["temperature"], "output": "temp" },
                  { "inputs": [], "output": "alert", "expression": "true" }
                ]
              }

    - nodeType: Graph
      name: normal-transform
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-map:1.0.0
        configuration:
          - key: rules
            value: |
              {
                "map": [
                  { "inputs": ["deviceId"], "output": "id" },
                  { "inputs": ["temperature"], "output": "temp" }
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
        dataDestination: telemetry/processed

  nodeConnections:
    - from: { name: sensors }
      to: { name: remove-bad-data }
    - from: { name: remove-bad-data }
      to: { name: severity-check }
    - from: { name: severity-check.output.true }
      to: { name: alert-transform }
    - from: { name: severity-check.output.false }
      to: { name: normal-transform }
    - from: { name: alert-transform }
      to: { name: merge }
    - from: { name: normal-transform }
      to: { name: merge }
    - from: { name: merge }
      to: { name: output }
```

---

## Next steps

- [Transform data with map](howto-dataflow-graphs-map.md)
- [Aggregate data over time](howto-dataflow-graphs-window.md)
- [Enrich with external data](howto-dataflow-graphs-enrich.md)
- [Route messages to different topics](howto-dataflow-graphs-topic-routing.md)
- [Expressions reference](concept-dataflow-graphs-expressions.md)
