---
title: Route readings by severity
description: Filter impossible readings, branch by severity, map each path, and merge the results with built-in Azure IoT Operations data flow graph transforms.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/21/2026
ai-usage: ai-assisted

#customer intent: As a solution developer, I want to route readings by severity so that high-severity readings include an alert flag in the processed output.
---

# Route readings by severity

Send high-severity readings through an alert path, then merge them with normal readings. This example first drops readings with `temperature > 1000`. It adds `alert: true` when `severity > 5` and renames fields on both paths.

## Prerequisites

This standalone example uses the existing `default` MQTT endpoint, the `default` profile and registry endpoint, `telemetry/sensors` as input, and `telemetry/processed` as output. For deployment prerequisites, Bicep parent resources, and Azure CLI environment variables (`AIO_INSTANCE_NAME` and `RESOURCE_GROUP`), see [Create a data flow graph](../howto-create-dataflow-graph.md).

[!INCLUDE [prereq-deployed-instance](../../includes/prereq-deployed-instance.md)]

[!INCLUDE [set-environment-variables](../../includes/set-environment-variables.md)]

The example assumes numeric `temperature` and `severity` fields and a `deviceId`; it doesn't perform schema validation.

## Configure the severity routes

:::image type="content" source="../media/concept-dataflow-graphs/route-by-severity.svg" alt-text="Diagram showing a filter dropping temperatures above 1000, a branch sending severity above 5 to an alert map and other readings to a normal map, and concatenate forwarding both paths to telemetry/processed." border="false":::

<!--
```mermaid
graph LR
    I("telemetry/sensors") --&gt; F("BUILT-IN filter<br/>Drop temperature &gt; 1000")
    F --&gt; B("BUILT-IN branch<br/>severity &gt; 5?")
    B --&gt;|true: high severity| A("BUILT-IN map<br/>deviceId → id<br/>temperature → temp<br/>alert = true")
    B --&gt;|false: severity ≤ 5| N("BUILT-IN map<br/>deviceId → id<br/>temperature → temp")
    A --&gt; C("BUILT-IN concatenate<br/>Not a join")
    N --&gt; C
    C --&gt; O("telemetry/processed")
```
-->

Concatenate forwards each processed message independently; it doesn't join records or guarantee ordering across paths. The example renames fields but doesn't convert temperature units.

| Synthetic input on `telemetry/sensors` | Output on `telemetry/processed` |
| --- | --- |
| `{"deviceId":"sensor-01","temperature":20,"severity":2}` | `{"id":"sensor-01","temp":20}` |
| `{"deviceId":"sensor-01","temperature":20,"severity":8}` | `{"id":"sensor-01","temp":20,"alert":true}` |
| `{"deviceId":"sensor-01","temperature":1001,"severity":8}` | Dropped |

# [Operations experience](#tab/portal)

:::image type="content" source="../media/howto-dataflow-graphs-filter-route/filter-branch-pipeline.png" alt-text="Screenshot of the operations experience canvas showing a filter, branch, map, concat, and destination pipeline." lightbox="../media/howto-dataflow-graphs-filter-route/filter-branch-pipeline.png":::

To build this pipeline in the operations experience:

1. Create a data flow graph and add a **source** that reads from `telemetry/sensors`.
1. Add a **filter** transform. Configure a rule that drops messages where `temperature > 1000`.
1. Add a **branch** transform. Configure the condition `severity > 5` to route high-severity messages to the true path.
1. Add a **map** transform on the true path. Configure rules to rename `deviceId` to `id`, `temperature` to `temp`, and add a field `alert` set to `true`.
1. Add a **map** transform on the false path. Configure rules to rename `deviceId` to `id` and `temperature` to `temp`.
1. Add a **concatenate** transform to merge both paths.
1. Add a **destination** that sends to `telemetry/processed`.
1. Connect the elements: source → filter → branch → (true path: alert map, false path: normal map) → concatenate → destination.

# [Azure CLI](#tab/cli)

Save the following graph properties as `graph.json`. Transform rules are escaped JSON strings. The Kubernetes tab shows the same rules in a readable form.

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
          "telemetry/sensors"
        ]
      }
    },
    {
      "nodeType": "Graph",
      "name": "remove-bad-data",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-filter:1.1.0",
        "configuration": [
          {
            "key": "rules",
            "value": "{\"filter\":[{\"inputs\":[\"temperature\"],\"expression\":\"$1 > 1000\",\"description\":\"Drop impossible temperature readings\"}]}"
          }
        ]
      }
    },
    {
      "nodeType": "Graph",
      "name": "severity-check",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-branch:1.1.0",
        "configuration": [
          {
            "key": "rules",
            "value": "{\"branch\":{\"inputs\":[\"severity\"],\"expression\":\"$1 > 5\",\"description\":\"Route high-severity messages\"}}"
          }
        ]
      }
    },
    {
      "nodeType": "Graph",
      "name": "alert-transform",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-map:1.0.0",
        "configuration": [
          {
            "key": "rules",
            "value": "{\"map\":[{\"inputs\":[\"deviceId\"],\"output\":\"id\"},{\"inputs\":[\"temperature\"],\"output\":\"temp\"},{\"inputs\":[],\"output\":\"alert\",\"expression\":\"true\"}]}"
          }
        ]
      }
    },
    {
      "nodeType": "Graph",
      "name": "normal-transform",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-map:1.0.0",
        "configuration": [
          {
            "key": "rules",
            "value": "{\"map\":[{\"inputs\":[\"deviceId\"],\"output\":\"id\"},{\"inputs\":[\"temperature\"],\"output\":\"temp\"}]}"
          }
        ]
      }
    },
    {
      "nodeType": "Graph",
      "name": "merge",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-concatenate:1.0.0"
      }
    },
    {
      "nodeType": "Destination",
      "name": "output",
      "destinationSettings": {
        "endpointRef": "default",
        "dataDestination": "telemetry/processed"
      }
    }
  ],
  "nodeConnections": [
    {
      "from": {
        "name": "sensors"
      },
      "to": {
        "name": "remove-bad-data"
      }
    },
    {
      "from": {
        "name": "remove-bad-data"
      },
      "to": {
        "name": "severity-check"
      }
    },
    {
      "from": {
        "name": "severity-check.output.true"
      },
      "to": {
        "name": "alert-transform"
      }
    },
    {
      "from": {
        "name": "severity-check.output.false"
      },
      "to": {
        "name": "normal-transform"
      }
    },
    {
      "from": {
        "name": "alert-transform"
      },
      "to": {
        "name": "merge"
      }
    },
    {
      "from": {
        "name": "normal-transform"
      },
      "to": {
        "name": "merge"
      }
    },
    {
      "from": {
        "name": "merge"
      },
      "to": {
        "name": "output"
      }
    }
  ]
}
```

Apply the config file through Azure Resource Manager. This approach avoids an `azure-iot-ops` extension validation issue with named outputs such as `severity-check.output.true`.

```azurecli
INSTANCE_ID=$(az iot ops show --name "$AIO_INSTANCE_NAME" --resource-group "$RESOURCE_GROUP" --query id --output tsv)
EXTENDED_LOCATION=$(az iot ops show --name "$AIO_INSTANCE_NAME" --resource-group "$RESOURCE_GROUP" --query extendedLocation --output json)
GRAPH_ID="$INSTANCE_ID/dataflowProfiles/default/dataflowGraphs/alert-routing"

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
  name: 'alert-routing'
  parent: defaultDataflowProfile
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
          dataSources: [ 'telemetry/sensors' ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'remove-bad-data'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-filter:1.1.0'
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
          artifact: 'azureiotoperations/graph-dataflow-branch:1.1.0'
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

Deploy the template to the instance's resource group. Set `CUSTOM_LOCATION_NAME` to the existing custom location name.

```azurecli
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --template-file main.bicep \
  --parameters aioInstanceName=$AIO_INSTANCE_NAME customLocationName=$CUSTOM_LOCATION_NAME
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../../includes/kubernetes-debug-only-note.md)]

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: alert-routing
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
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
        artifact: azureiotoperations/graph-dataflow-filter:1.1.0
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
        artifact: azureiotoperations/graph-dataflow-branch:1.1.0
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

## Related content

- [Filter, branch, and merge messages](../howto-dataflow-graphs-filter-route.md)
- [Transform data with map](../howto-dataflow-graphs-map.md)
- [Route more than two message kinds](howto-route-message-kinds.md)
- [Common use cases and patterns](overview-dataflow-patterns.md)
