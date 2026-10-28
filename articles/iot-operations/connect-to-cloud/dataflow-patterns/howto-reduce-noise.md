---
title: Noise reduction
description: Reduce noise and message volume with a ten-reading tumbling window in Azure IoT Operations data flow graphs.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/20/2026
ai-usage: ai-assisted

#customer intent: As a solution developer, I want to reduce noise with nonoverlapping batches so that I can implement the appropriate data processing pattern.
---

# Noise reduction

Average 10 readings into one result to reduce variation and message volume. For values `9, 11, 10, 10, 9, 11, 10, 10, 9, 11`, the mean is `10`.

## Prerequisites

Complete the [shared example prerequisites](overview-dataflow-patterns.md#prerequisites), including the `default` profile and `factory-mqtt` endpoint. Use YAML for debugging and Azure CLI or Bicep for production management.

Use the existing built-in registry endpoint named `default`. For the [environment variables](../howto-create-dataflow-graph.md#prerequisites), set `AIO_INSTANCE_NAME` and `RESOURCE_GROUP` to your existing instance and resource group names. For Bicep, also set `CUSTOM_LOCATION_NAME` to your existing custom location name.

## Configure a ten-reading batch

:::image type="content" source="../media/concept-dataflow-graphs/batch-smoothing.svg" alt-text="Diagram of a filter keeping only line-1 readings, followed by a built-in window that averages ten readings into one nonoverlapping batch with meanValue 10 and readingCount 10." border="false":::

<!--
```mermaid
graph LR
    R("10 readings<br/>9, 11, 10, 10, 9,<br/>11, 10, 10, 9, 11") --&gt; F("BUILT-IN filter<br/>Keep only assetId: line-1")
    F --&gt; W("BUILT-IN window<br/>Mean of one batch<br/>Nonoverlapping")
    W --&gt; O("One output message<br/>assetId: line-1<br/>meanValue: 10<br/>readingCount: 10")
```
-->

The built-in window produces one average per nonoverlapping batch, not after every reading. You wait for the batch to close, and a timeout can close a partial batch.

For configuration syntax, see [Count-based window](../howto-dataflow-graphs-window.md#count-based-window) and [Boundary behavior](../howto-dataflow-graphs-window.md#boundary-behavior). The `messageInCurrent` setting includes the tenth message in the batch it closes.

This graph sends only one asset's readings to the window.
The filter prevents other assets from being averaged into the same batch.
The ten values are separate messages, not an array in one message. An asset ID
field doesn't automatically partition a window; keep unrelated signals and
units separate too.

# [Operations experience](#tab/portal)

1. In the [operations experience](https://iotoperations.azure.com/), open your instance and select **Data flow graph** > **Create data flow graph**.
1. Name the graph `average-line-1` and select the `default` profile.
1. Add a source named `source` using endpoint `factory-mqtt` and topic `factory/values`.
1. Add a filter transform named `only-line-1`, using `azureiotoperations/graph-dataflow-filter:1.1.0` from registry endpoint `default`. Add a rule with input `assetId` and expression `$1 != "line-1"`. A true result drops the message.
1. Add a window transform named `batch`, using `azureiotoperations/graph-dataflow-window:1.1.0` from registry endpoint `default`. Set **Message count** to `10` and the boundary message behavior to **messageInCurrent**. Leave the timeout at its default of 60 seconds.
1. Add these accumulation rules to the window:

   | Input | Output | Expression |
   | --- | --- | --- |
   | `assetId` | `assetId` | `first($1)` |
   | `value` | `meanValue` | `average($1)` |
   | `value` | `readingCount` | `count($1)` |

1. Add a destination named `destination` using endpoint `factory-mqtt` and topic `factory/means`.
1. Connect `source` → `only-line-1` → `batch` → `destination`, then select **Save** to deploy the enabled graph.

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
        "dataSources": ["factory/values"]
      }
    },
    {
      "name": "only-line-1",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-filter:1.1.0",
        "configuration": [
          {
            "key": "rules",
            "value": "{\"filter\":[{\"inputs\":[\"assetId\"],\"expression\":\"$1 != \\\"line-1\\\"\"}]}\n"
          }
        ]
      }
    },
    {
      "name": "batch",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-window:1.1.0",
        "configuration": [
          {
            "key": "count",
            "value": "{\"type\":\"messageCount\",\"maxMessageCount\":10,\"boundaryMessage\":\"messageInCurrent\"}"
          },
          {
            "key": "rules",
            "value": "{\n  \"accumulate\": [\n    {\"inputs\":[\"assetId\"],\"output\":\"assetId\",\"expression\":\"first($1)\"},\n    {\"inputs\":[\"value\"],\"output\":\"meanValue\",\"expression\":\"average($1)\"},\n    {\"inputs\":[\"value\"],\"output\":\"readingCount\",\"expression\":\"count($1)\"}\n  ]\n}\n"
          }
        ]
      }
    },
    {
      "name": "destination",
      "nodeType": "Destination",
      "destinationSettings": {
        "endpointRef": "factory-mqtt",
        "dataDestination": "factory/means"
      }
    }
  ],
  "nodeConnections": [
    { "from": { "name": "source" }, "to": { "name": "only-line-1" } },
    { "from": { "name": "only-line-1" }, "to": { "name": "batch" } },
    { "from": { "name": "batch" }, "to": { "name": "destination" } }
  ]
}
```

```azurecli
az iot ops dataflowgraph apply \
  --name average-line-1 \
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
  name: 'average-line-1'
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
          dataSources: [ 'factory/values' ]
        }
      }
      {
        name: 'only-line-1'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-filter:1.1.0'
          configuration: [
            {
              key: 'rules'
              value: '{"filter":[{"inputs":["assetId"],"expression":"$1 != \\"line-1\\""}]}\n'
            }
          ]
        }
      }
      {
        name: 'batch'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-window:1.1.0'
          configuration: [
            {
              key: 'count'
              value: '{"type":"messageCount","maxMessageCount":10,"boundaryMessage":"messageInCurrent"}'
            }
            {
              key: 'rules'
              value: '{\n  "accumulate": [\n    {"inputs":["assetId"],"output":"assetId","expression":"first($1)"},\n    {"inputs":["value"],"output":"meanValue","expression":"average($1)"},\n    {"inputs":["value"],"output":"readingCount","expression":"count($1)"}\n  ]\n}\n'
            }
          ]
        }
      }
      {
        name: 'destination'
        nodeType: 'Destination'
        destinationSettings: {
          endpointRef: 'factory-mqtt'
          dataDestination: 'factory/means'
        }
      }
    ]
    nodeConnections: [
      {
        from: { name: 'source' }
        to: { name: 'only-line-1' }
      }
      {
        from: { name: 'only-line-1' }
        to: { name: 'batch' }
      }
      {
        from: { name: 'batch' }
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

Save the following manifest as `average-line-1.yaml`.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: average-line-1
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
  nodes:
    - name: source
      nodeType: Source
      sourceSettings:
        endpointRef: factory-mqtt
        dataSources: [factory/values]
    - name: only-line-1
      nodeType: Graph
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-filter:1.1.0
        configuration:
          - key: rules
            value: |
              {"filter":[{"inputs":["assetId"],"expression":"$1 != \"line-1\""}]}
    - name: batch
      nodeType: Graph
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-window:1.1.0
        configuration:
          - key: count
            value: '{"type":"messageCount","maxMessageCount":10,"boundaryMessage":"messageInCurrent"}'
          - key: rules
            value: |
              {
                "accumulate": [
                  {"inputs":["assetId"],"output":"assetId","expression":"first($1)"},
                  {"inputs":["value"],"output":"meanValue","expression":"average($1)"},
                  {"inputs":["value"],"output":"readingCount","expression":"count($1)"}
                ]
              }
    - name: destination
      nodeType: Destination
      destinationSettings:
        endpointRef: factory-mqtt
        dataDestination: factory/means
  nodeConnections:
    - from: { name: source }
      to: { name: only-line-1 }
    - from: { name: only-line-1 }
      to: { name: batch }
    - from: { name: batch }
      to: { name: destination }
```

```bash
kubectl apply -f average-line-1.yaml
```

---

Publish each line in the following example as a separate message to `factory/values`:

```ndjson
{"assetId":"line-1","value":9}
{"assetId":"line-1","value":11}
{"assetId":"line-1","value":10}
{"assetId":"line-1","value":10}
{"assetId":"line-1","value":9}
{"assetId":"line-1","value":11}
{"assetId":"line-1","value":10}
{"assetId":"line-1","value":10}
{"assetId":"line-1","value":9}
{"assetId":"line-1","value":11}
```

The filter drops other assets. If there's no earlier partial batch, the tenth reading closes the window and produces this payload on `factory/means` (`100 / 10 = 10`):

```json
{"assetId":"line-1","meanValue":10,"readingCount":10}
```

Send the ten readings within the default 60-second timeout for the stated
ten-message result. A timeout can publish a smaller batch, which `readingCount`
makes visible. Validate that sensor payloads contain numeric values before
using the mean.

At ten readings per second, collecting ten readings takes about
one second; slower input increases the collection delay. To change the default
timeout, configure an explicit [duration-based closing condition](../howto-dataflow-graphs-window.md#duration-based-window)
and account for partial batches downstream.

For a smoothed value after every reading, see the exponential moving average sample in the [Azure Samples deployment instructions](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#data-flow-pattern-samples).

## Related content

- [Choose another pattern](overview-dataflow-patterns.md)
- [Data flow graphs overview](../concept-dataflow-graphs.md)
