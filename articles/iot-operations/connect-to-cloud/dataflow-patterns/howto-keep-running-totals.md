---
title: Keep running totals
description: Add each new reading to a running total for each sensor with a custom stateful data flow graph.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/21/2026
ai-usage: ai-assisted

#customer intent: As a solution developer, I want to keep running totals so that consumers receive an updated total for each accepted increment.
---

# Keep running totals

Add each new reading to the previous total. For example, a machine uses `2.5` kWh, then another `1.5` kWh. The graph reports `2.5` kWh, then `4` kWh.

Each reading must contain the amount **since the previous reading**, not the meter's lifetime total. The graph keeps a separate total for each sensor.

## Prerequisites

Start with an existing Azure IoT Operations deployment and MQTT broker access. Follow [Create a data flow graph](../howto-create-dataflow-graph.md) to configure a data flow profile and MQTT endpoint.

Complete the [Azure Samples deployment instructions](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#data-flow-pattern-samples) for registry setup and single-instance deployment, then use the [standalone sample setup](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#use-complete-standalone-manifests). The examples use namespace `azure-iot-operations`. Arrange durable checkpoints and an ordered input log for continuity across restarts.

The `default` data flow profile must already exist with one instance. The examples reuse the existing `factory-mqtt` MQTT endpoint and `factory-artifacts` registry endpoint for `ghcr.io`; they don't create profiles or endpoints.

[!INCLUDE [prereq-azure-cli](../../includes/prereq-azure-cli.md)]

[!INCLUDE [set-environment-variables](../../includes/set-environment-variables.md)]

## Deploy the complete graph

:::image type="content" source="../media/concept-dataflow-graphs/keep-running-totals.svg" alt-text="Diagram showing readings of 2.5 and 1.5 added to a sensor's running total, producing 2.5 and 4, followed by an authorized reset to zero." border="false":::

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
        "dataSources": ["factory/total-readings", "factory/total-resets"]
      }
    },
    {
      "name": "processor",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "factory-artifacts",
        "artifact": "azure-samples/explore-iot-operations/dataflow-patterns/graph-running-total:1.0.0-rc.4",
        "configuration": [
          {
            "key": "settings",
            "value": "{\"role\":\"running-total\",\"inputTopics\":{\"reading\":\"factory/total-readings\",\"reset\":\"factory/total-resets\"},\"initialStates\":[{\"assetId\":\"sensor-1\",\"total\":0,\"stateVersion\":0,\"epoch\":0,\"lastSequence\":0}]}"
          }
        ]
      }
    },
    {
      "name": "destination",
      "nodeType": "Destination",
      "destinationSettings": {
        "endpointRef": "factory-mqtt",
        "dataDestination": "factory/totals"
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
  --name running-total \
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
  name: 'running-total'
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
            'factory/total-readings'
            'factory/total-resets'
          ]
        }
      }
      {
        name: 'processor'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'factory-artifacts'
          artifact: 'azure-samples/explore-iot-operations/dataflow-patterns/graph-running-total:1.0.0-rc.4'
          configuration: [
            {
              key: 'settings'
              value: '{"role":"running-total","inputTopics":{"reading":"factory/total-readings","reset":"factory/total-resets"},"initialStates":[{"assetId":"sensor-1","total":0,"stateVersion":0,"epoch":0,"lastSequence":0}]}'
            }
          ]
        }
      }
      {
        name: 'destination'
        nodeType: 'Destination'
        destinationSettings: {
          endpointRef: 'factory-mqtt'
          dataDestination: 'factory/totals'
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
  https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/huguesBouvier/dataflow-pattern-samples/samples/wasm/dataflow-patterns/manifests/running-total.yaml \
  --output running-total.yaml
kubectl apply -f running-total.yaml
```

Alternatively, save this equivalent manifest as `running-total.yaml` and run the same `kubectl apply` command:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: running-total
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
  nodes:
    - name: source
      nodeType: Source
      sourceSettings:
        endpointRef: factory-mqtt
        dataSources: [factory/total-readings, factory/total-resets]
    - name: processor
      nodeType: Graph
      graphSettings:
        registryEndpointRef: factory-artifacts
        artifact: azure-samples/explore-iot-operations/dataflow-patterns/graph-running-total:1.0.0-rc.4
        configuration:
          - key: settings
            value: '{"role":"running-total","inputTopics":{"reading":"factory/total-readings","reset":"factory/total-resets"},"initialStates":[{"assetId":"sensor-1","total":0,"stateVersion":0,"epoch":0,"lastSequence":0}]}'
    - name: destination
      nodeType: Destination
      destinationSettings:
        endpointRef: factory-mqtt
        dataDestination: factory/totals
  nodeConnections:
    - from: {name: source}
      to: {name: processor}
    - from: {name: processor}
      to: {name: destination}
```

---

The source subscribes to `factory/total-readings` and `factory/total-resets`; the destination is `factory/totals`. Allow sensor publishers to publish readings, but allow only authorized operators to publish on `factory/total-resets`.

The sample starts `sensor-1` at zero. To add another sensor, add its starting values to the manifest's `initialStates`. Readings and resets for sensors missing from `initialStates` are rejected.

## Add readings

Publish each line separately on `factory/total-readings`:

```ndjson
{"kind":"reading","assetId":"sensor-1","messageId":"r1","sequence":1,"epoch":0,"value":2.5,"units":"kWh"}
{"kind":"reading","assetId":"sensor-1","messageId":"r2","sequence":2,"epoch":0,"value":1.5,"units":"kWh"}
```

The total is now `4` kWh. For each sensor, use a new `messageId` and increase `sequence` with every message, starting at `1` for this zero starting state. Retry a message only with its original ID, sequence, and unchanged content. Keep `epoch` at `0` until you reset the total.

The second output looks like this:

```json
{"kind":"total","assetId":"sensor-1","messageId":"r2","sequence":2,"epoch":0,"value":1.5,"units":"kWh","total":4,"stateVersion":2,"lastSequence":2,"emittedAtMs":400}
```

`total` is the updated sum. The other added fields track the last processed message and support resets and recovery. The graph fills in `emittedAtMs`; `400` is an illustrative time, not a value to supply.

## Reset the total

To start counting from zero again, publish this message on `factory/total-resets` using an identity authorized to reset totals:

```json
{"kind":"reset","assetId":"sensor-1","resetId":"reset-1","sequence":3,"expectedStateVersion":2,"operator":"synthetic"}
```

Use the latest output's `stateVersion` as `expectedStateVersion`, and increase `sequence`. This prevents a reset based on an outdated total. The result is:

```json
{"kind":"totalReset","assetId":"sensor-1","resetId":"reset-1","sequence":3,"expectedStateVersion":2,"operator":"synthetic","total":0,"epoch":1,"stateVersion":3,"lastSequence":3,"emittedAtMs":600}
```

The next reading uses epoch `1` and continues the sequence:

```json
{"kind":"reading","assetId":"sensor-1","messageId":"r3","sequence":4,"epoch":1,"value":3}
```

The total is now `3`. After a reset, use the new `epoch` so delayed readings from before the reset aren't counted. Give each new reset a unique `resetId`; retry it only with its original, unchanged content.

## Advanced: keep totals across restarts

The graph holds totals in memory and doesn't automatically save them across restarts. For each `assetId`, your application must save `total`, `epoch`, `stateVersion`, `lastSequence`, and `lastSampledAt` when present, along with an ordered record of inputs. Output messages provide these values but don't save them durably.

To recover, pause incoming messages, restore the saved values in `initialStates`, and replay later inputs in order. Keep message and reset IDs unique across restarts, and ensure downstream consumers don't count replayed outputs twice. Use the sample's zero starting values only for a new total.

## Related content

- [Data flow graph concepts](../concept-dataflow-graphs.md)
- [Report meaningful value changes](howto-report-value-changes.md)
- [Reduce noise with an exponential moving average](howto-smooth-each-reading.md)
- [Detailed input and recovery contracts](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/dataflow-patterns/contracts.json)
