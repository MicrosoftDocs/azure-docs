---
title: Report meaningful value changes
description: Compare each incoming reading with the last reported value for its asset to publish meaningful changes with a custom stateful data flow graph.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/21/2026
ai-usage: ai-assisted

#customer intent: As a solution developer, I want to report meaningful value changes so that consumers receive fewer messages while tracking changes from the last reported value.
---

# Report meaningful value changes

Report a reading only when it changes enough to matter. For example, with a change threshold of `1`, readings of `30`, `30.5`, and `31` produce reports of `30` and `31`.

Use this pattern when a consumer needs meaningful changes rather than every fluctuation. Small changes accumulate against the last **reported** value, rather than the last received value. All examples are synthetic.

## Prerequisites

Start with an existing Azure IoT Operations deployment and MQTT broker access. Follow [Create a data flow graph](../howto-create-dataflow-graph.md) to configure a data flow profile and MQTT endpoint.

Complete the [Azure Samples deployment instructions](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#data-flow-pattern-samples) for registry setup and single-instance deployment. Then, use the [standalone sample setup](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#use-complete-standalone-manifests). The examples use namespace `azure-iot-operations`. Configure the [clock publisher](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#supply-clock-events-during-sensor-silence) for heartbeats during sensor silence.

The `default` data flow profile must already exist with one instance. The examples reuse the existing `factory-mqtt` MQTT endpoint and `factory-artifacts` registry endpoint for `ghcr.io`; they don't create profiles or endpoints.

[!INCLUDE [prereq-azure-cli](../../includes/prereq-azure-cli.md)]

[!INCLUDE [set-environment-variables](../../includes/set-environment-variables.md)]

## Deploy the complete graph

:::image type="content" source="../media/concept-dataflow-graphs/report-value-changes.svg" alt-text="Diagram showing readings of 30, 30.5, and 31 compared with the last reported value. With a change threshold of 1, only 30 and 31 are reported." border="false":::

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
        "dataSources": ["factory/report-readings", "factory/report-ticks"]
      }
    },
    {
      "name": "processor",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "factory-artifacts",
        "artifact": "azure-samples/explore-iot-operations/dataflow-patterns/graph-report-by-exception:1.0.0-rc.4",
        "configuration": [
          {
            "key": "settings",
            "value": "{\"role\":\"report-by-exception\",\"heartbeatIntervalMs\":1000,\"inputTopics\":{\"reading\":\"factory/report-readings\",\"tick\":\"factory/report-ticks\"}}"
          }
        ]
      }
    },
    {
      "name": "destination",
      "nodeType": "Destination",
      "destinationSettings": {
        "endpointRef": "factory-mqtt",
        "dataDestination": "factory/changes"
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
  --name report-by-exception \
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
  name: 'report-by-exception'
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
            'factory/report-readings'
            'factory/report-ticks'
          ]
        }
      }
      {
        name: 'processor'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'factory-artifacts'
          artifact: 'azure-samples/explore-iot-operations/dataflow-patterns/graph-report-by-exception:1.0.0-rc.4'
          configuration: [
            {
              key: 'settings'
              value: '{"role":"report-by-exception","heartbeatIntervalMs":1000,"inputTopics":{"reading":"factory/report-readings","tick":"factory/report-ticks"}}'
            }
          ]
        }
      }
      {
        name: 'destination'
        nodeType: 'Destination'
        destinationSettings: {
          endpointRef: 'factory-mqtt'
          dataDestination: 'factory/changes'
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
  https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/huguesBouvier/dataflow-pattern-samples/samples/wasm/dataflow-patterns/manifests/report-by-exception.yaml \
  --output report-by-exception.yaml
kubectl apply -f report-by-exception.yaml
```

Alternatively, save this equivalent manifest as `report-by-exception.yaml` and run the same `kubectl apply` command:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: report-by-exception
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
  nodes:
    - name: source
      nodeType: Source
      sourceSettings:
        endpointRef: factory-mqtt
        dataSources: [factory/report-readings, factory/report-ticks]
    - name: processor
      nodeType: Graph
      graphSettings:
        registryEndpointRef: factory-artifacts
        artifact: azure-samples/explore-iot-operations/dataflow-patterns/graph-report-by-exception:1.0.0-rc.4
        configuration:
          - key: settings
            value: '{"role":"report-by-exception","heartbeatIntervalMs":1000,"inputTopics":{"reading":"factory/report-readings","tick":"factory/report-ticks"}}'
    - name: destination
      nodeType: Destination
      destinationSettings:
        endpointRef: factory-mqtt
        dataDestination: factory/changes
  nodeConnections:
    - from: {name: source}
      to: {name: processor}
    - from: {name: processor}
      to: {name: destination}
```

---

The manifest subscribes to `factory/report-readings` and `factory/report-ticks`, and publishes to `factory/changes`. Allow sensor publishers to publish readings, but allow only the authorized clock publisher to publish on `factory/report-ticks`.

The example reports the first reading, then changes of at least `1` from the last reported value. A clock event also reports the latest observation if at least `1` second has passed since the previous report. This periodic report is called a *heartbeat*.

## Check value changes

For a fresh deployment, publish each line separately on `factory/report-readings` before the heartbeat interval elapses:

```ndjson
{"kind":"reading","assetId":"sensor-1","messageId":"r0","sequence":0,"value":30}
{"kind":"reading","assetId":"sensor-1","messageId":"r1","sequence":1,"value":30.5}
{"kind":"reading","assetId":"sensor-1","messageId":"r2","sequence":2,"value":31}
```

| Reading | Comparison | Result |
| --- | --- | --- |
| `30` | First accepted reading | Report with `reason: "initial"`; last reported value becomes `30` |
| `30.5` | Difference from `30` is `0.5` | Keep the observation for a later heartbeat; last reported value stays `30` |
| `31` | Difference from `30` is exactly `1` | Report with `reason: "change"`; last reported value becomes `31` |

Each report preserves the reading's fields, replaces `kind` with `reported`, and adds `reason`, `emittedAtMs`, `receivedAtMs`, `observationAgeMs`, and `isFreshMeasurement`. Reading-triggered reports have age `0` and `isFreshMeasurement: true`. In a live deployment, times are processing-clock epoch milliseconds.

## Report the latest observation periodically

Example timeline for a fresh deployment. Publish readings on `factory/report-readings`; the clock publisher sends events on `factory/report-ticks`:

| Elapsed time | Input | Result |
| --- | --- | --- |
| `0` s | `r0`, sequence `0`, value `10` | Initial report; last reported value is `10` |
| `0.1` s | `r1`, sequence `1`, value `10.5` | Latest observation becomes `10.5` |
| `1` s | Clock event: `{"kind":"tick","assetId":"sensor-1"}` | Heartbeat reports `10.5`; last reported value becomes `10.5` |
| `1.1` s | `r2`, sequence `2`, value `11` | Difference `0.5`; retain observation |
| `1.2` s | `r3`, sequence `3`, value `11.5` | Difference exactly `1`; report change |

The heartbeat output at `1` second is:

```json
{"kind":"reported","assetId":"sensor-1","messageId":"r1","sequence":1,"value":10.5,"reason":"heartbeat","emittedAtMs":1000,"receivedAtMs":100,"observationAgeMs":900,"isFreshMeasurement":false}
```

The processor computes the time fields automatically; the example shows milliseconds relative to the timeline's start. Live outputs use processing-clock epoch milliseconds. A heartbeat reports an older observation, not a new measurement. Its timing depends on clock-event delivery and processing. Use [offline detection](howto-detect-offline-sensors.md) to track sensor availability.

## Advanced: timing and restart

Heartbeats require clock events; readings alone don't trigger them. Monitor the clock publisher and its route if you depend on periodic reports.

Keep `messageId` unique for each asset, including across restarts, and keep `sequence` strictly increasing. Retry a message only with its original ID, sequence, and unchanged content. A restart clears the remembered values and retry tracking. The graph reports the next accepted reading as an initial value. If you replay saved readings, ensure consumers don't process replayed outputs twice.

## Related content

- [Data flow graph concepts](../concept-dataflow-graphs.md)
- [Reduce noise with an exponential moving average](howto-smooth-each-reading.md)
- [Detect offline sensors](howto-detect-offline-sensors.md)
- [Detailed input and state contracts](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/dataflow-patterns/contracts.json)
