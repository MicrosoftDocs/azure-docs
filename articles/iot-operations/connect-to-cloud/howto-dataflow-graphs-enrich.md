---
title: Enrich data with external datasets in data flow graphs
description: Learn how to augment incoming messages with data from an external state store by configuring datasets in Azure IoT Operations data flow graphs.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 03/19/2026
ai-usage: ai-assisted

---

# Enrich data with external datasets in data flow graphs

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

Sometimes the incoming message doesn't contain everything you need. A temperature reading might arrive with a device ID, but the display name, location, and calibration offset live in a separate lookup table. Enrichment lets you pull that external data into your transform rules.

For an overview of data flow graphs, see [Data flow graphs overview](concept-dataflow-graphs.md).

## Prerequisites

- An Azure IoT Operations instance deployed on an Arc-enabled Kubernetes cluster. For more information, see [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md).
- A default registry endpoint named `default` that points to `mcr.microsoft.com` is automatically created during deployment.

## What is enrichment

You can augment incoming messages with data from an external state store, called a *contextualization dataset*. During processing, the runtime looks up records in the dataset and matches them against the incoming message using a condition you define. The matched fields then become available to your rules.

Enrichment works with **map**, **filter**, and **branch** transforms. It isn't supported in window transforms.

## Configure a dataset

Datasets are defined in the `datasets` array at the top level of your rules configuration, alongside `map`, `filter`, or `branch`.

# [Operations experience](#tab/portal)

In the transform configuration, add a dataset. Configure:

| Setting | Description |
|---------|-------------|
| **State store key** | The key where dataset records are stored. Use `as` to assign an alias (for example, `device-metadata as device`). |
| **Match inputs** | Fields to compare: one from the source message (`$source.<field>`) and one from the dataset (`$context.<field>`). |
| **Match expression** | A boolean expression (for example, `$1 == $2`). |

# [Bicep](#tab/bicep)

The dataset configuration is part of the rules JSON:

```bicep
configuration: [
  {
    key: 'rules'
    value: '{"datasets":[{"key":"device-metadata as device","inputs":["$source.deviceId","$context.deviceId"],"expression":"$1 == $2"}],"map":[{"inputs":["$context(device).displayName"],"output":"deviceName"}]}'
  }
]
```

# [Kubernetes (preview)](#tab/kubernetes)

```json
{
  "datasets": [
    {
      "key": "device-metadata as device",
      "inputs": ["$source.deviceId", "$context.deviceId"],
      "expression": "$1 == $2"
    }
  ],
  "map": [
    {
      "inputs": ["$context(device).displayName"],
      "output": "deviceName"
    }
  ]
}
```

---

Each dataset entry has these properties:

| Property | Required | Description |
|----------|----------|-------------|
| `key` | Yes | The state store key where the dataset records are stored. Supports an optional alias with the `as` keyword. |
| `inputs` | Yes | List of field references used in the match expression. Each entry uses a `$source.` or `$context.` prefix. |
| `expression` | Yes | A boolean expression that determines which dataset record matches the incoming message. |

### Key and alias

The `key` value is the state store key that the runtime reads. Assign a shorter alias with the `as` keyword. For example, `datasets.parag10.rule42 as position` lets you reference fields as `$context(position).WorkingHours`.

### Dataset inputs

Each entry in the `inputs` array uses a prefix to indicate where the value comes from:

- `$source.<field>`: reads from the incoming message.
- `$context.<field>`: reads from the dataset record being evaluated.

Inputs can appear in any order and you can mix `$source` and `$context` references freely. Wildcard inputs aren't supported in dataset definitions.

### Match expression

The `expression` evaluates to a boolean. The runtime loads the dataset from the state store as NDJSON (one JSON object per line), iterates through the records, and returns the first record where the expression evaluates to `true`.

If no record matches, the enrichment fields aren't available and any rule that depends on them is skipped for that message.

## Use enriched data in rules

Reference matched record fields in any rule's `inputs` array using `$context(<alias>).<fieldPath>`.

### Map example

# [Operations experience](#tab/portal)

Add map rules that reference enriched fields:

| Input | Output |
|-------|--------|
| `$context(position).WorkingHours` | `WorkingHours` |
| `rawValue` and `$context(product).multiplier` | `adjustedValue` (expression: `$1 * $2`) |

# [Bicep](#tab/bicep)

The enriched field references are part of the map rules JSON:

```bicep
'{"datasets":[...],"map":[{"inputs":["$context(position).WorkingHours"],"output":"WorkingHours"},{"inputs":["rawValue","$context(product).multiplier"],"output":"adjustedValue","expression":"$1 * $2"}]}'
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
- inputs:
    - "$context(position).WorkingHours"
  output: WorkingHours

- inputs:
    - rawValue                          # $1
    - "$context(product).multiplier"    # $2
  output: adjustedValue
  expression: "$1 * $2"
```

---

### Filter example

# [Operations experience](#tab/portal)

Add a filter rule with inputs `rawValue`, `$context(limits).multiplier`, and `$context(limits).baseLimit`, and expression `$1 * $2 > $3`.

# [Bicep](#tab/bicep)

```bicep
'{"datasets":[{"key":"device_limits as limits","inputs":["$source.deviceId","$context.deviceId"],"expression":"$1 == $2"}],"filter":[{"inputs":["rawValue","$context(limits).multiplier","$context(limits).baseLimit"],"expression":"$1 * $2 > $3"}]}'
```

# [Kubernetes (preview)](#tab/kubernetes)

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
      "inputs": ["rawValue", "$context(limits).multiplier", "$context(limits).baseLimit"],
      "expression": "$1 * $2 > $3"
    }
  ]
}
```

---

### Branch example

# [Operations experience](#tab/portal)

Configure a branch rule with inputs `quantity`, `$context(mult).factor`, and `$context(mult).threshold`, and expression `$1 * $2 > $3`.

# [Bicep](#tab/bicep)

```bicep
'{"datasets":[{"key":"multipliers as mult","inputs":["$source.productCode","$context.productCode"],"expression":"$1 == $2"}],"branch":{"inputs":["quantity","$context(mult).factor","$context(mult).threshold"],"expression":"$1 * $2 > $3"}}'
```

# [Kubernetes (preview)](#tab/kubernetes)

```json
{
  "datasets": [
    {
      "key": "multipliers as mult",
      "inputs": ["$source.productCode", "$context.productCode"],
      "expression": "$1 == $2"
    }
  ],
  "branch": {
    "inputs": ["quantity", "$context(mult).factor", "$context(mult).threshold"],
    "expression": "$1 * $2 > $3"
  }
}
```

---

## Wildcards with datasets

In map rules, use `$context(<alias>).*` to copy all top-level fields from the matched dataset record:

# [Operations experience](#tab/portal)

Add a map rule with input `$context(device).*` and output `*`.

# [Bicep](#tab/bicep)

```bicep
{
  inputs: [ '$context(device).*' ]
  output: '*'
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
- inputs:
    - "$context(device).*"
  output: "*"
```

---

You can also target a nested object within the dataset record. For example, `$context(device).configuration.*` copies only the fields under `configuration`.

Wildcard enrichment inputs are supported only in map rules. Filter and branch rules don't support wildcard inputs.

## Set up the state store

The runtime reads dataset records from the Azure IoT Operations distributed state store. Each dataset key maps to one or more records in NDJSON format (one JSON object per line). The runtime caches records and receives change notifications, so state store updates are reflected in processing.

For information on configuring the distributed state store, see [State store overview](../develop-edge-apps/overview-state-store.md).

## Deploy a data flow graph with enrichment

# [Operations experience](#tab/portal)

In the Operations experience, create a data flow graph with enrichment:

1. Add a **source** that reads from your MQTT topic.
1. Add a **map** transform. In the dataset configuration, add a dataset with the state store key and match condition.
1. In the map rules, reference enriched fields using `$context(<alias>).<field>` syntax.
1. Add a **destination** that sends to your output topic.

# [Bicep](#tab/bicep)

```bicep
resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2025-10-01' = {
  name: 'enrich-example'
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
        name: 'enrich-and-map'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-map:1.0.0'
          configuration: [
            {
              key: 'rules'
              value: '{"datasets":[{"key":"device-metadata as device","inputs":["$source.deviceId","$context.deviceId"],"expression":"$1 == $2"}],"map":[{"inputs":["*"],"output":"*"},{"inputs":["$context(device).displayName"],"output":"deviceName"},{"inputs":["$context(device).location"],"output":"location"}]}'
            }
          ]
        }
      }
      {
        nodeType: 'Destination'
        name: 'output'
        destinationSettings: {
          endpointRef: 'default'
          dataDestination: 'telemetry/enriched'
        }
      }
    ]
    nodeConnections: [
      { from: { name: 'sensors' }, to: { name: 'enrich-and-map' } }
      { from: { name: 'enrich-and-map' }, to: { name: 'output' } }
    ]
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: enrich-example
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
      name: enrich-and-map
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-map:1.0.0
        configuration:
          - key: rules
            value: |
              {
                "datasets": [
                  {
                    "key": "device-metadata as device",
                    "inputs": ["$source.deviceId", "$context.deviceId"],
                    "expression": "$1 == $2"
                  }
                ],
                "map": [
                  { "inputs": ["*"], "output": "*" },
                  { "inputs": ["$context(device).displayName"], "output": "deviceName" },
                  { "inputs": ["$context(device).location"], "output": "location" }
                ]
              }

    - nodeType: Destination
      name: output
      destinationSettings:
        endpointRef: default
        dataDestination: telemetry/enriched

  nodeConnections:
    - from: { name: sensors }
      to: { name: enrich-and-map }
    - from: { name: enrich-and-map }
      to: { name: output }
```

---

## Limitations

- **Not supported in window transforms.** Enrichment datasets aren't available in window (accumulate) transforms.
- **First match wins.** The runtime uses the first record where the expression evaluates to `true`.
- **Missing matches skip enriched rules.** If no dataset record matches, rules that reference `$context(<alias>)` fields are skipped. The transformation doesn't fail.
- **State store errors propagate.** If the state store is unreachable, the transformation fails for that message.
- **No wildcard inputs in dataset definitions.** Each input must be a specific `$source.<field>` or `$context.<field>` reference.

## Next steps

- [Transform data with map](howto-dataflow-graphs-map.md)
- [Filter and route data](howto-dataflow-graphs-filter-route.md)
- [Aggregate data over time](howto-dataflow-graphs-window.md)
- [Expressions reference](concept-dataflow-graphs-expressions.md)
- [Configure a source](howto-configure-dataflow-source.md)
- [Configure a destination](howto-configure-dataflow-destination.md)
