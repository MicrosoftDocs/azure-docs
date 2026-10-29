---
title: Route more than two message kinds
description: Route more than two message kinds with built-in branch and concatenate transforms in Azure IoT Operations data flow graphs.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/21/2026
ai-usage: ai-assisted

#customer intent: As a solution developer, I want to route multiple message kinds and handle unknown kinds so that I can implement the appropriate data processing pattern.
---

# Route more than two message kinds

Give speed, temperature, and remaining messages separate processing paths. Check for speed first, then check the false path for temperature. Merge the results into one output stream.

## Prerequisites

Complete the [shared example prerequisites](overview-dataflow-patterns.md#prerequisites), including the `default` profile and `factory-mqtt` endpoint. Use YAML for debugging and Azure CLI or Bicep for production management.

Use the existing built-in registry endpoint named `default`. For the [environment variables](../howto-create-dataflow-graph.md#prerequisites), set `AIO_INSTANCE_NAME` and `RESOURCE_GROUP` to your existing instance and resource group names. For Bicep, also set `CUSTOM_LOCATION_NAME` to your existing custom location name.

## Configure the routing paths

:::image type="content" source="../media/concept-dataflow-graphs/branch-message-routing.svg" alt-text="Diagram of two built-in branches routing speed, temperature, and remaining messages, including unknown kinds, through separate paths. Concatenate forwards each processed message to one output stream without joining records." border="false":::

<!--
```mermaid
graph LR
    I("Mixed<br/>messages") --&gt; B1("BUILT-IN branch<br/>Speed?")
    B1 --&gt;|true| S("Speed path")
    B1 --&gt;|false| B2("BUILT-IN branch<br/>Temperature?")
    B2 --&gt;|true| T("Temperature path")
    B2 --&gt;|false| R("Remaining path<br/>Humidity + unknown")
    S --&gt; C("BUILT-IN<br/>concatenate<br/>Not a join")
    T --&gt; C
    R --&gt; C
    C --&gt; O("One stream<br/>Individual<br/>messages")
```
-->

Chain binary branches to make multiple paths, and use concatenate to merge them. Route missing and unknown message kinds through a fallback path.

Branches route messages after the source receives them. Concatenate forwards each message independently; messages from different paths can arrive in any order.

The expression input `kind ?? "unknown"` supplies a fallback when `kind` is missing; it doesn't add or rewrite the payload's `kind` field. For syntax, see [Default values](../concept-dataflow-graphs-expressions.md#default-values).

The remaining path contains humidity messages as well as missing, unknown, and unrecognized kinds. Keep unknown messages identifiable, and don't run humidity-specific calculations without checking the kind and required fields. If humidity needs a separate path, add a third branch on the remaining path with expression `$1 == "humidity"` and the same defaulted input.

For technical details, see [Define a branch rule](../howto-dataflow-graphs-filter-route.md#define-a-branch-rule) and [Merge paths with concatenate](../howto-dataflow-graphs-filter-route.md#merge-paths-with-concatenate).

Three map nodes label the path while preserving the input fields.

# [Operations experience](#tab/portal)

1. In the [operations experience](https://iotoperations.azure.com/), open your instance and select **Data flow graph** > **Create data flow graph**.
1. Name the graph `route-message-kinds` and select the `default` profile.
1. Add a source named `source` using endpoint `factory-mqtt` and topic `factory/mixed-readings`.
1. Add two branch transforms using `azureiotoperations/graph-dataflow-branch:1.1.0` from registry endpoint `default`. Configure one rule per transform:

   | Transform name | Input | Expression |
   | --- | --- | --- |
   | `speed-check` | `kind ?? "unknown"` | `$1 == "speed"` |
   | `temperature-check` | `kind ?? "unknown"` | `$1 == "temperature"` |

1. Add three map transforms using `azureiotoperations/graph-dataflow-map:1.0.0` from registry endpoint `default`. In each, add a rule with input `*`, output `*`, and no expression to preserve the fields. Add a second rule:

   | Transform name | Input | Output | Expression |
   | --- | --- | --- | --- |
   | `speed-path` | `kind ?? "unknown"` | `route` | `"speed"` |
   | `temperature-path` | `kind ?? "unknown"` | `route` | `"temperature"` |
   | `remaining-path` | `kind ?? "unknown"` | `route` | `"remaining"` |

1. Add a concatenate transform named `merge`, using `azureiotoperations/graph-dataflow-concatenate:1.0.0` from registry endpoint `default`. It needs no configuration.
1. Add a destination named `destination` using endpoint `factory-mqtt` and topic `factory/routed-readings`.
1. Connect `source` to `speed-check`. Drag connections from `speed-check`'s **true** output to `speed-path` and its **false** output to `temperature-check`. Connect `temperature-check`'s **true** output to `temperature-path` and its **false** output to `remaining-path`.
1. Connect all three map outputs to `merge`, then connect `merge` to `destination`. Select **Save** to deploy the enabled graph.

# [Azure CLI](#tab/cli)

Save these complete graph properties as `graph.json`. The command uses the existing `default` profile.

```json
{
  "mode": "Enabled",
  "nodes": [
    {
      "name": "source",
      "nodeType": "Source",
      "sourceSettings": {
        "endpointRef": "factory-mqtt",
        "dataSources": ["factory/mixed-readings"]
      }
    },
    {
      "name": "speed-check",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-branch:1.1.0",
        "configuration": [
          {
            "key": "rules",
            "value": "{\"branch\":{\"inputs\":[\"kind ?? \\\"unknown\\\"\"],\"expression\":\"$1 == \\\"speed\\\"\"}}"
          }
        ]
      }
    },
    {
      "name": "temperature-check",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-branch:1.1.0",
        "configuration": [
          {
            "key": "rules",
            "value": "{\"branch\":{\"inputs\":[\"kind ?? \\\"unknown\\\"\"],\"expression\":\"$1 == \\\"temperature\\\"\"}}"
          }
        ]
      }
    },
    {
      "name": "speed-path",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-map:1.0.0",
        "configuration": [
          {
            "key": "rules",
            "value": "{\"map\":[{\"inputs\":[\"*\"],\"output\":\"*\"},{\"inputs\":[\"kind ?? \\\"unknown\\\"\"],\"output\":\"route\",\"expression\":\"\\\"speed\\\"\"}]}"
          }
        ]
      }
    },
    {
      "name": "temperature-path",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-map:1.0.0",
        "configuration": [
          {
            "key": "rules",
            "value": "{\"map\":[{\"inputs\":[\"*\"],\"output\":\"*\"},{\"inputs\":[\"kind ?? \\\"unknown\\\"\"],\"output\":\"route\",\"expression\":\"\\\"temperature\\\"\"}]}"
          }
        ]
      }
    },
    {
      "name": "remaining-path",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-map:1.0.0",
        "configuration": [
          {
            "key": "rules",
            "value": "{\"map\":[{\"inputs\":[\"*\"],\"output\":\"*\"},{\"inputs\":[\"kind ?? \\\"unknown\\\"\"],\"output\":\"route\",\"expression\":\"\\\"remaining\\\"\"}]}"
          }
        ]
      }
    },
    {
      "name": "merge",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-concatenate:1.0.0"
      }
    },
    {
      "name": "destination",
      "nodeType": "Destination",
      "destinationSettings": {
        "endpointRef": "factory-mqtt",
        "dataDestination": "factory/routed-readings"
      }
    }
  ],
  "nodeConnections": [
    { "from": { "name": "source" }, "to": { "name": "speed-check" } },
    { "from": { "name": "speed-check.output.true" }, "to": { "name": "speed-path" } },
    { "from": { "name": "speed-check.output.false" }, "to": { "name": "temperature-check" } },
    { "from": { "name": "temperature-check.output.true" }, "to": { "name": "temperature-path" } },
    { "from": { "name": "temperature-check.output.false" }, "to": { "name": "remaining-path" } },
    { "from": { "name": "speed-path" }, "to": { "name": "merge" } },
    { "from": { "name": "temperature-path" }, "to": { "name": "merge" } },
    { "from": { "name": "remaining-path" }, "to": { "name": "merge" } },
    { "from": { "name": "merge" }, "to": { "name": "destination" } }
  ]
}
```

Apply the graph through Azure Resource Manager. This approach avoids an `azure-iot-ops` extension validation issue with named outputs such as `speed-check.output.true`.

```azurecli
INSTANCE_ID=$(az iot ops show --name "$AIO_INSTANCE_NAME" --resource-group "$RESOURCE_GROUP" --query id --output tsv)
EXTENDED_LOCATION=$(az iot ops show --name "$AIO_INSTANCE_NAME" --resource-group "$RESOURCE_GROUP" --query extendedLocation --output json)
GRAPH_ID="$INSTANCE_ID/dataflowProfiles/default/dataflowGraphs/route-message-kinds"

az rest --method put \
  --url "$GRAPH_ID?api-version=2026-07-01" \
  --body "{\"extendedLocation\":$EXTENDED_LOCATION,\"properties\":$(cat graph.json)}"

az resource wait --created --ids "$GRAPH_ID" --api-version 2026-07-01
```

# [Bicep](#tab/bicep)

Save this template as `main.bicep`. It references the existing instance, custom location, and `default` profile.

```bicep
param aioInstanceName string
param customLocationName string

resource aioInstance 'Microsoft.IoTOperations/instances@2026-07-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2026-07-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2026-07-01' = {
  parent: defaultDataflowProfile
  name: 'route-message-kinds'
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
          dataSources: [ 'factory/mixed-readings' ]
        }
      }
      {
        name: 'speed-check'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-branch:1.1.0'
          configuration: [
            {
              key: 'rules'
              value: '{"branch":{"inputs":["kind ?? \\"unknown\\""],"expression":"$1 == \\"speed\\""}}'
            }
          ]
        }
      }
      {
        name: 'temperature-check'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-branch:1.1.0'
          configuration: [
            {
              key: 'rules'
              value: '{"branch":{"inputs":["kind ?? \\"unknown\\""],"expression":"$1 == \\"temperature\\""}}'
            }
          ]
        }
      }
      {
        name: 'speed-path'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-map:1.0.0'
          configuration: [
            {
              key: 'rules'
              value: '{"map":[{"inputs":["*"],"output":"*"},{"inputs":["kind ?? \\"unknown\\""],"output":"route","expression":"\\"speed\\""}]}'
            }
          ]
        }
      }
      {
        name: 'temperature-path'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-map:1.0.0'
          configuration: [
            {
              key: 'rules'
              value: '{"map":[{"inputs":["*"],"output":"*"},{"inputs":["kind ?? \\"unknown\\""],"output":"route","expression":"\\"temperature\\""}]}'
            }
          ]
        }
      }
      {
        name: 'remaining-path'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-map:1.0.0'
          configuration: [
            {
              key: 'rules'
              value: '{"map":[{"inputs":["*"],"output":"*"},{"inputs":["kind ?? \\"unknown\\""],"output":"route","expression":"\\"remaining\\""}]}'
            }
          ]
        }
      }
      {
        name: 'merge'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-concatenate:1.0.0'
        }
      }
      {
        name: 'destination'
        nodeType: 'Destination'
        destinationSettings: {
          endpointRef: 'factory-mqtt'
          dataDestination: 'factory/routed-readings'
        }
      }
    ]
    nodeConnections: [
      {
        from: { name: 'source' }
        to: { name: 'speed-check' }
      }
      {
        from: { name: 'speed-check.output.true' }
        to: { name: 'speed-path' }
      }
      {
        from: { name: 'speed-check.output.false' }
        to: { name: 'temperature-check' }
      }
      {
        from: { name: 'temperature-check.output.true' }
        to: { name: 'temperature-path' }
      }
      {
        from: { name: 'temperature-check.output.false' }
        to: { name: 'remaining-path' }
      }
      {
        from: { name: 'speed-path' }
        to: { name: 'merge' }
      }
      {
        from: { name: 'temperature-path' }
        to: { name: 'merge' }
      }
      {
        from: { name: 'remaining-path' }
        to: { name: 'merge' }
      }
      {
        from: { name: 'merge' }
        to: { name: 'destination' }
      }
    ]
  }
}
```

```azurecli
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --template-file main.bicep \
  --parameters aioInstanceName="$AIO_INSTANCE_NAME" customLocationName="$CUSTOM_LOCATION_NAME"
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../../includes/kubernetes-debug-only-note.md)]

Save the following manifest as `route-message-kinds.yaml`.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: route-message-kinds
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
  nodes:
    - name: source
      nodeType: Source
      sourceSettings:
        endpointRef: factory-mqtt
        dataSources: [factory/mixed-readings]
    - name: speed-check
      nodeType: Graph
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-branch:1.1.0
        configuration:
          - key: rules
            value: '{"branch":{"inputs":["kind ?? \"unknown\""],"expression":"$1 == \"speed\""}}'
    - name: temperature-check
      nodeType: Graph
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-branch:1.1.0
        configuration:
          - key: rules
            value: '{"branch":{"inputs":["kind ?? \"unknown\""],"expression":"$1 == \"temperature\""}}'
    - name: speed-path
      nodeType: Graph
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-map:1.0.0
        configuration:
          - key: rules
            value: '{"map":[{"inputs":["*"],"output":"*"},{"inputs":["kind ?? \"unknown\""],"output":"route","expression":"\"speed\""}]}'
    - name: temperature-path
      nodeType: Graph
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-map:1.0.0
        configuration:
          - key: rules
            value: '{"map":[{"inputs":["*"],"output":"*"},{"inputs":["kind ?? \"unknown\""],"output":"route","expression":"\"temperature\""}]}'
    - name: remaining-path
      nodeType: Graph
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-map:1.0.0
        configuration:
          - key: rules
            value: '{"map":[{"inputs":["*"],"output":"*"},{"inputs":["kind ?? \"unknown\""],"output":"route","expression":"\"remaining\""}]}'
    - name: merge
      nodeType: Graph
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-concatenate:1.0.0
    - name: destination
      nodeType: Destination
      destinationSettings:
        endpointRef: factory-mqtt
        dataDestination: factory/routed-readings
  nodeConnections:
    - from: { name: source }
      to: { name: speed-check }
    - from: { name: speed-check.output.true }
      to: { name: speed-path }
    - from: { name: speed-check.output.false }
      to: { name: temperature-check }
    - from: { name: temperature-check.output.true }
      to: { name: temperature-path }
    - from: { name: temperature-check.output.false }
      to: { name: remaining-path }
    - from: { name: speed-path }
      to: { name: merge }
    - from: { name: temperature-path }
      to: { name: merge }
    - from: { name: remaining-path }
      to: { name: merge }
    - from: { name: merge }
      to: { name: destination }
```

```bash
kubectl apply -f route-message-kinds.yaml
```

---

Publish each input separately:

| Input on `factory/mixed-readings` | Output on `factory/routed-readings` |
| --- | --- |
| `{"kind":"speed","value":12}` | `{"kind":"speed","value":12,"route":"speed"}` |
| `{"kind":"temperature","value":20}` | `{"kind":"temperature","value":20,"route":"temperature"}` |
| `{"kind":"humidity","value":60}` | `{"kind":"humidity","value":60,"route":"remaining"}` |
| `{"value":99}` | `{"value":99,"route":"remaining"}` |

Expect four separate output messages, in any order.

## Related content

- [Route readings by severity](howto-route-by-severity.md)
- [Route invalid messages to a dead-letter queue](howto-route-invalid-messages.md)
- [Choose another pattern](overview-dataflow-patterns.md)
- [Data flow graphs overview](../concept-dataflow-graphs.md)
