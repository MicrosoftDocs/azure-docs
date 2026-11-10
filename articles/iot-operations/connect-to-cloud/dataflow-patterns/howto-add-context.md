---
title: Add context to readings
description: Add calibration context to readings with built-in enrichment in Azure IoT Operations data flow graphs.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/20/2026
ai-usage: ai-assisted

#customer intent: As a solution developer, I want to add current calibration context to readings so that I can implement the appropriate data processing pattern.
---

# Add context to readings

Look up an asset's calibration offset and add it to each reading. This example adds an offset of `2` to a value of `20`, producing `correctedValue: 22`.

## Prerequisites

Complete the [shared example prerequisites](overview-dataflow-patterns.md#prerequisites), including the `default` profile and `factory-mqtt` endpoint. Use YAML for debugging and Azure CLI or Bicep for production management.

Use the existing built-in registry endpoint named `default`. For the [environment variables](../howto-create-dataflow-graph.md#prerequisites), set `AIO_INSTANCE_NAME` and `RESOURCE_GROUP` to your existing instance and resource group names. For Bicep, also set `CUSTOM_LOCATION_NAME` to your existing custom location name.

Synchronize the state-store writer's clock with the broker. Confirm a successful
`+OK` response when populating the calibration record before publishing readings.

## Configure a calibration lookup

:::image type="content" source="../media/concept-dataflow-graphs/calibration-context-lookup.svg" alt-text="Diagram of a reading with value 20 entering a map transform. The transform looks up offset 2 for the same asset in the state store and emits correctedValue 22." border="false":::

<!--
```mermaid
flowchart LR
R["Reading: line-1<br/>value: 20"] --&gt; M["BUILT-IN map<br/>20 + 2"]
S[("State store: line-1<br/>offset: 2")] -.->|Context lookup| M
M --&gt; O["Enriched reading<br/>correctedValue: 22"]
```
-->

Use [enrichment](../howto-dataflow-graphs-enrich.md) to read calibration records that an application maintains in the state store. The lookup uses the context available during processing, not necessarily the context valid when the reading was sampled. For that case, [match context by timestamp](howto-align-correlate.md#match-context-by-timestamp).

Deploy the calibration graph:

# [Operations experience](#tab/portal)

1. In the [operations experience](https://iotoperations.azure.com/), open your instance and select **Data flow graph** > **Create data flow graph**.
1. Name the graph `add-calibration` and select the `default` profile.
1. Add a source named `source` using endpoint `factory-mqtt` and topic `factory/readings`.
1. Add a map transform named `calibrate`, using `azureiotoperations/graph-dataflow-map:1.0.0` from registry endpoint `default`.
1. In the map transform configuration, add a dataset with **State store key** `factory-calibration as calibration`, **Match inputs** `$source.assetId` and `$context.assetId` in that order, and **Match expression** `$1 == $2`.
1. Add these map rules:

   | Inputs (in order) | Output | Expression |
   | --- | --- | --- |
   | `*` | `*` | Leave empty |
   | `value`, `$context(calibration).offset` | `correctedValue` | `$1 + $2` |

1. Add a destination named `destination` using endpoint `factory-mqtt` and topic `factory/calibrated`.
1. Connect `source` → `calibrate` → `destination`, then select **Save** to deploy the enabled graph.

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
        "dataSources": ["factory/readings"]
      }
    },
    {
      "name": "calibrate",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-map:1.0.0",
        "configuration": [
          {
            "key": "rules",
            "value": "{\n  \"datasets\": [\n    {\n      \"key\": \"factory-calibration as calibration\",\n      \"inputs\": [\"$source.assetId\", \"$context.assetId\"],\n      \"expression\": \"$1 == $2\"\n    }\n  ],\n  \"map\": [\n    {\"inputs\": [\"*\"], \"output\": \"*\"},\n    {\n      \"inputs\": [\"value\", \"$context(calibration).offset\"],\n      \"output\": \"correctedValue\",\n      \"expression\": \"$1 + $2\"\n    }\n  ]\n}\n"
          }
        ]
      }
    },
    {
      "name": "destination",
      "nodeType": "Destination",
      "destinationSettings": {
        "endpointRef": "factory-mqtt",
        "dataDestination": "factory/calibrated"
      }
    }
  ],
  "nodeConnections": [
    { "from": { "name": "source" }, "to": { "name": "calibrate" } },
    { "from": { "name": "calibrate" }, "to": { "name": "destination" } }
  ]
}
```

```azurecli
az iot ops dataflowgraph apply \
  --name add-calibration \
  --instance $AIO_INSTANCE_NAME \
  --resource-group $RESOURCE_GROUP \
  --config-file graph.json
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
  name: 'add-calibration'
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
        name: 'calibrate'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-map:1.0.0'
          configuration: [
            {
              key: 'rules'
              value: '{\n  "datasets": [\n    {\n      "key": "factory-calibration as calibration",\n      "inputs": ["$source.assetId", "$context.assetId"],\n      "expression": "$1 == $2"\n    }\n  ],\n  "map": [\n    {"inputs": ["*"], "output": "*"},\n    {\n      "inputs": ["value", "$context(calibration).offset"],\n      "output": "correctedValue",\n      "expression": "$1 + $2"\n    }\n  ]\n}\n'
            }
          ]
        }
      }
      {
        name: 'destination'
        nodeType: 'Destination'
        destinationSettings: {
          endpointRef: 'factory-mqtt'
          dataDestination: 'factory/calibrated'
        }
      }
    ]
    nodeConnections: [
      {
        from: { name: 'source' }
        to: { name: 'calibrate' }
      }
      {
        from: { name: 'calibrate' }
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

Save the following manifest as `add-calibration.yaml`.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: add-calibration
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
    - name: calibrate
      nodeType: Graph
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-map:1.0.0
        configuration:
          - key: rules
            value: |
              {
                "datasets": [
                  {
                    "key": "factory-calibration as calibration",
                    "inputs": ["$source.assetId", "$context.assetId"],
                    "expression": "$1 == $2"
                  }
                ],
                "map": [
                  {"inputs": ["*"], "output": "*"},
                  {
                    "inputs": ["value", "$context(calibration).offset"],
                    "output": "correctedValue",
                    "expression": "$1 + $2"
                  }
                ]
              }
    - name: destination
      nodeType: Destination
      destinationSettings:
        endpointRef: factory-mqtt
        dataDestination: factory/calibrated
  nodeConnections:
    - from: { name: source }
      to: { name: calibrate }
    - from: { name: calibrate }
      to: { name: destination }
```

```bash
kubectl apply -f add-calibration.yaml
```

---

Before sending readings, write this synthetic NDJSON record under state-store key
`factory-calibration`. Use the state-store `SET` procedure in
[Populate the state store key](../howto-dataflow-graphs-enrich.md#populate-the-state-store-key).

```json
{"assetId":"line-1","offset":2}
```

Publish this reading to `factory/readings`:

```json
{"assetId":"line-1","value":20}
```

Expect this payload on `factory/calibrated`. The map preserves the original fields and adds `20 + 2`:

```json
{"assetId":"line-1","value":20,"correctedValue":22}
```

This graph assumes a matching calibration record with a numeric offset. Before using it in production, define how to handle missing context and monitor lookup errors; the example doesn't include an invalid-context route.

## Related content

- [Choose another pattern](overview-dataflow-patterns.md)
- [Data flow graphs overview](../concept-dataflow-graphs.md)
