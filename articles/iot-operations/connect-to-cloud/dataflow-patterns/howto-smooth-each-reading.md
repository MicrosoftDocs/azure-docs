---
title: Reduce noise with an exponential moving average
description: Reduce sensor noise by combining each new reading with the previous smoothed value using an exponential moving average.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/21/2026
ai-usage: ai-assisted

#customer intent: As a solution developer, I want to smooth each incoming reading so that consumers receive a less variable result after each accepted observation.
---

# Reduce noise with an exponential moving average

An **exponential moving average** reduces sensor noise by combining each new reading with the previous smoothed value. It produces a result for every accepted reading.

For example, readings of `30`, `35`, and `35` produce smoothed values of `30`, `32.5`, and `33.75` when each calculation gives equal weight to the new reading and the previous result. Each sensor is smoothed separately. All examples are synthetic.

## Prerequisites

Start with an existing Azure IoT Operations deployment and MQTT broker access. Follow [Create a data flow graph](../howto-create-dataflow-graph.md) to configure a data flow profile and MQTT endpoint.

Complete the [Azure Samples deployment instructions](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#data-flow-pattern-samples) for registry setup and single-instance deployment, then use the [standalone sample setup](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#use-complete-standalone-manifests). The examples use namespace `azure-iot-operations`.

The `default` data flow profile must already exist with one instance. The examples reuse the existing `factory-mqtt` MQTT endpoint and `factory-artifacts` registry endpoint for `ghcr.io`; they don't create profiles or endpoints.

[!INCLUDE [prereq-azure-cli](../../includes/prereq-azure-cli.md)]

[!INCLUDE [set-environment-variables](../../includes/set-environment-variables.md)]

## Deploy the complete graph

:::image type="content" source="../media/concept-dataflow-graphs/smooth-each-reading.svg" alt-text="Diagram showing readings of 30, 35, and 35 blended with the previous smoothed result using equal weights, producing 30, 32.5, and 33.75." border="false":::

# [Operations experience](#tab/portal)

This sample uses a custom artifact from `ghcr.io`. The operations experience supports custom artifacts from Azure Container Registry (ACR), not GHCR. Use the Azure CLI or Bicep tab to deploy this example unchanged.

To use the operations experience, first [copy the graph and its referenced WASM modules to ACR and configure a registry endpoint](../../develop-edge-apps/howto-deploy-wasm-graph-definitions.md). Then follow [Deploy custom WASM transforms](../howto-dataflow-graph-wasm.md#example-1-basic-deployment-with-one-wasm-module) for the supported UI workflow. The graph configuration in the Azure CLI tab shows the required topics and settings.

# [Azure CLI](#tab/cli)

Save the complete graph properties as `graph.json`. The `settings` value is an escaped JSON string.

```json
{
  "mode": "Enabled",
  "nodes": [
    {
      "name": "source",
      "nodeType": "Source",
      "sourceSettings": {
        "endpointRef": "factory-mqtt",
        "dataSources": ["factory/smoothing-readings"]
      }
    },
    {
      "name": "processor",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "factory-artifacts",
        "artifact": "azure-samples/explore-iot-operations/dataflow-patterns/graph-smooth-readings:1.0.0-rc.4",
        "configuration": [
          {
            "key": "settings",
            "value": "{\"role\":\"smooth-readings\",\"inputTopics\":{\"reading\":\"factory/smoothing-readings\"}}"
          }
        ]
      }
    },
    {
      "name": "destination",
      "nodeType": "Destination",
      "destinationSettings": {
        "endpointRef": "factory-mqtt",
        "dataDestination": "factory/smoothed"
      }
    }
  ],
  "nodeConnections": [
    { "from": { "name": "source" }, "to": { "name": "processor" } },
    { "from": { "name": "processor" }, "to": { "name": "destination" } }
  ]
}
```

Apply the graph to the existing `default` profile:

```azurecli
az iot ops dataflowgraph apply \
  --name smooth-readings \
  --instance $AIO_INSTANCE_NAME \
  --resource-group $RESOURCE_GROUP \
  --config-file graph.json
```

# [Bicep](#tab/bicep)

Save this complete template as `main.bicep`. Set `CUSTOM_LOCATION_NAME` to the name of your instance's existing custom location in the same resource group.

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
  name: 'smooth-readings'
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
          dataSources: [
            'factory/smoothing-readings'
          ]
        }
      }
      {
        name: 'processor'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'factory-artifacts'
          artifact: 'azure-samples/explore-iot-operations/dataflow-patterns/graph-smooth-readings:1.0.0-rc.4'
          configuration: [
            {
              key: 'settings'
              value: '{"role":"smooth-readings","inputTopics":{"reading":"factory/smoothing-readings"}}'
            }
          ]
        }
      }
      {
        name: 'destination'
        nodeType: 'Destination'
        destinationSettings: {
          endpointRef: 'factory-mqtt'
          dataDestination: 'factory/smoothed'
        }
      }
    ]
    nodeConnections: [
      { from: { name: 'source' }, to: { name: 'processor' } }
      { from: { name: 'processor' }, to: { name: 'destination' } }
    ]
  }
}
```

Deploy the template:

```azurecli
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --template-file main.bicep \
  --parameters aioInstanceName="$AIO_INSTANCE_NAME" customLocationName="$CUSTOM_LOCATION_NAME"
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../../includes/kubernetes-debug-only-note.md)]

Download and apply the complete manifest:

```bash
curl --fail --location \
  https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/huguesBouvier/dataflow-pattern-samples/samples/wasm/dataflow-patterns/manifests/smooth-readings.yaml \
  --output smooth-readings.yaml
kubectl apply -f smooth-readings.yaml
```

Alternatively, save this equivalent manifest as `smooth-readings.yaml` and run the same `kubectl apply` command:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: smooth-readings
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
  nodes:
    - name: source
      nodeType: Source
      sourceSettings:
        endpointRef: factory-mqtt
        dataSources: [factory/smoothing-readings]
    - name: processor
      nodeType: Graph
      graphSettings:
        registryEndpointRef: factory-artifacts
        artifact: azure-samples/explore-iot-operations/dataflow-patterns/graph-smooth-readings:1.0.0-rc.4
        configuration:
          - key: settings
            value: '{"role":"smooth-readings","inputTopics":{"reading":"factory/smoothing-readings"}}'
    - name: destination
      nodeType: Destination
      destinationSettings:
        endpointRef: factory-mqtt
        dataDestination: factory/smoothed
  nodeConnections:
    - from: {name: source}
      to: {name: processor}
    - from: {name: processor}
      to: {name: destination}
```

---

The source subscribes to `factory/smoothing-readings`; the destination is `factory/smoothed`. Authorize sensor publishers for the readings topic.

The example blends half of each new reading with half of the previous smoothed output (`alpha: 0.5`). The first reading initializes the output directly. Each later accepted reading uses:

```text
new smoothed output = 0.5 * new reading + 0.5 * previous smoothed output
```

The blend uses the previous **smoothed output**. A larger weight follows changes faster; a smaller weight retains more of the previous result. Supported weights are greater than `0` and at most `1`.

## Check the blend

Publish each line separately on `factory/smoothing-readings`:

```ndjson
{"kind":"reading","assetId":"sensor-1","messageId":"r0","sequence":0,"value":30}
{"kind":"reading","assetId":"sensor-1","messageId":"r1","sequence":1,"value":35}
{"kind":"reading","assetId":"sensor-1","messageId":"r2","sequence":2,"value":35}
```

| Reading | Calculation | `smoothedValue` |
| --- | --- | --- |
| `30` | Initialize directly | `30` |
| `35` | `0.5 * 35 + 0.5 * 30` | `32.5` |
| `35` | `0.5 * 35 + 0.5 * 32.5` | `33.75` |

The second reading produces this output when it arrives `0.1` seconds into the example timeline:

```json
{"kind":"smoothed","assetId":"sensor-1","messageId":"r1","sequence":1,"value":35,"smoothedValue":32.5,"emittedAtMs":100}
```

Each output retains the raw `value` and other input metadata, including optional `sampledAt`. The processor adds `smoothedValue` and computes `emittedAtMs` automatically. The example time is relative to the timeline's start; live outputs use processing-clock epoch milliseconds. Results aren't rounded.

## Advanced: reading frequency and restart

The weight applies to each accepted reading. More frequent readings make the output follow a change faster in elapsed time. This graph needs no clock publisher.

Keep `messageId` unique per asset, including across restarts, and `sequence` strictly increasing. Retry a message only with its original ID, sequence, and unchanged content.

A restart clears previous outputs and retry tracking. The next reading initializes directly, which can create a sudden change in the output. If continuity matters, coordinate replay from saved readings and make sure consumers don't process replayed outputs twice. Use separate assets or deployments for different measurements and units.

## Related content

- [Data flow graph concepts](../concept-dataflow-graphs.md)
- [Aggregate data over time](../howto-dataflow-graphs-window.md)
- [Report meaningful value changes](howto-report-value-changes.md)
- [Detailed input and state contracts](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/dataflow-patterns/contracts.json)
