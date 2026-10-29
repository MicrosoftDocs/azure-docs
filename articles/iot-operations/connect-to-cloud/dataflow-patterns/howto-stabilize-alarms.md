---
title: Alarm hysteresis
description: Use separate raise and clear thresholds with waiting periods to prevent repeated alarm changes with a custom stateful data flow graph.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/21/2026
ai-usage: ai-assisted

#customer intent: As a solution developer, I want to use alarm hysteresis so that brief fluctuations don't repeatedly raise and clear an alarm.
---

# Alarm hysteresis

Raise an alarm at `80` or above, but clear it only at `70` or below. A reading of `75` leaves the alarm as it is. This gap between the thresholds is called *hysteresis* and prevents repeated on-off changes near a single threshold.

This example also waits `1` second before raising the alarm and `0.5` seconds before clearing it, so brief spikes don't change the alarm state. All examples are synthetic.

## Prerequisites

Start with an existing Azure IoT Operations deployment and MQTT broker access. Follow [Create a data flow graph](../howto-create-dataflow-graph.md) to configure a data flow profile and MQTT endpoint.

Complete the [Azure Samples deployment instructions](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#data-flow-pattern-samples) for registry setup and single-instance deployment, then use the [standalone sample setup](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#use-complete-standalone-manifests). The examples use namespace `azure-iot-operations`. Configure the [clock publisher](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#supply-clock-events-during-sensor-silence) to evaluate observation periods during sensor silence.

The `default` data flow profile must already exist with one instance. The examples reuse the existing `factory-mqtt` MQTT endpoint and `factory-artifacts` registry endpoint for `ghcr.io`; they don't create profiles or endpoints.

[!INCLUDE [prereq-azure-cli](../../includes/prereq-azure-cli.md)]

[!INCLUDE [set-environment-variables](../../includes/set-environment-variables.md)]

## Deploy the complete graph

:::image type="content" source="../media/concept-dataflow-graphs/stabilize-alarms.svg" alt-text="Diagram showing an alarm raised after a reading of 80 persists for 1 second and cleared after readings of 69 and 70 persist for 0.5 seconds. A reading of 75 leaves the established state unchanged." border="false":::

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
        "dataSources": ["factory/alarm-readings", "factory/alarm-ticks"]
      }
    },
    {
      "name": "processor",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "factory-artifacts",
        "artifact": "azure-samples/explore-iot-operations/dataflow-patterns/graph-stable-alarm:1.0.0-rc.4",
        "configuration": [
          {
            "key": "settings",
            "value": "{\"role\":\"stable-alarm\",\"high\":80,\"low\":70,\"raiseForMs\":1000,\"clearForMs\":500,\"maxObservationGapMs\":1500,\"inputTopics\":{\"reading\":\"factory/alarm-readings\",\"tick\":\"factory/alarm-ticks\"}}"
          }
        ]
      }
    },
    {
      "name": "destination",
      "nodeType": "Destination",
      "destinationSettings": {
        "endpointRef": "factory-mqtt",
        "dataDestination": "factory/alarms"
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
  --name stable-alarm \
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
  name: 'stable-alarm'
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
            'factory/alarm-readings'
            'factory/alarm-ticks'
          ]
        }
      }
      {
        name: 'processor'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'factory-artifacts'
          artifact: 'azure-samples/explore-iot-operations/dataflow-patterns/graph-stable-alarm:1.0.0-rc.4'
          configuration: [
            {
              key: 'settings'
              value: '{"role":"stable-alarm","high":80,"low":70,"raiseForMs":1000,"clearForMs":500,"maxObservationGapMs":1500,"inputTopics":{"reading":"factory/alarm-readings","tick":"factory/alarm-ticks"}}'
            }
          ]
        }
      }
      {
        name: 'destination'
        nodeType: 'Destination'
        destinationSettings: {
          endpointRef: 'factory-mqtt'
          dataDestination: 'factory/alarms'
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
  https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/huguesBouvier/dataflow-pattern-samples/samples/wasm/dataflow-patterns/manifests/stable-alarm.yaml \
  --output stable-alarm.yaml
kubectl apply -f stable-alarm.yaml
```

Alternatively, save this equivalent manifest as `stable-alarm.yaml` and run the same `kubectl apply` command:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: stable-alarm
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
  nodes:
    - name: source
      nodeType: Source
      sourceSettings:
        endpointRef: factory-mqtt
        dataSources: [factory/alarm-readings, factory/alarm-ticks]
    - name: processor
      nodeType: Graph
      graphSettings:
        registryEndpointRef: factory-artifacts
        artifact: azure-samples/explore-iot-operations/dataflow-patterns/graph-stable-alarm:1.0.0-rc.4
        configuration:
          - key: settings
            value: '{"role":"stable-alarm","high":80,"low":70,"raiseForMs":1000,"clearForMs":500,"maxObservationGapMs":1500,"inputTopics":{"reading":"factory/alarm-readings","tick":"factory/alarm-ticks"}}'
    - name: destination
      nodeType: Destination
      destinationSettings:
        endpointRef: factory-mqtt
        dataDestination: factory/alarms
  nodeConnections:
    - from: {name: source}
      to: {name: processor}
    - from: {name: processor}
      to: {name: destination}
```

---

The source subscribes to `factory/alarm-readings` and `factory/alarm-ticks`; the destination is `factory/alarms`. Allow sensor publishers to publish readings, but allow only the authorized clock publisher to publish on `factory/alarm-ticks`.

The example starts in the normal state. It raises an alarm after observations at or above `80` persist for `1` second, and clears it after observations at or below `70` persist for `0.5` seconds. An observation older than `1.5` seconds can't complete a pending transition.

## Check the behavior

A complete reading looks like this:

```json
{"kind":"reading","assetId":"sensor-1","messageId":"r1","sequence":1,"value":80,"units":"C"}
```

Example timeline for a fresh deployment. Publish readings on `factory/alarm-readings`; the clock publisher sends events on `factory/alarm-ticks`:

| Elapsed time | Input | Result |
| --- | --- | --- |
| `0` s | `r0`, sequence `0`, value `75` | Start normal |
| `0.1` s | `r1`, sequence `1`, value `80`, units `C` | Start waiting to raise |
| `1.1` s | Clock event | Emit `active` using observation `r1` |
| `1.2` s | `r2`, sequence `2`, value `75` | Keep active state |
| `1.3` s | `r3`, sequence `3`, value `70` | Start waiting to clear |
| `1.5` s | `r4`, sequence `4`, value `71` | Interrupt the wait |
| `1.6` s | `r5`, sequence `5`, value `69` | Start a fresh wait to clear |
| `2.1` s | `r6`, sequence `6`, value `70` | Emit `cleared` |

The clock event at `1.1` seconds produces:

```json
{"kind":"alarm","assetId":"sensor-1","messageId":"r1","sequence":1,"value":80,"units":"C","state":"active","reason":"thresholdSustained","threshold":80,"emittedAtMs":1100,"receivedAtMs":100,"observationAgeMs":1000,"isFreshMeasurement":false}
```

Outputs preserve the latest observation's fields. The processor computes time fields automatically; the example shows milliseconds relative to the timeline's start, while live outputs use processing-clock epoch milliseconds. A reading-triggered transition has `isFreshMeasurement: true` and age `0`; a clock-triggered transition refers to the earlier observation.

## Advanced: timing and restart

The graph checks elapsed processing time when a reading or clock event arrives. A gap greater than `1.5` seconds cancels a pending transition but preserves the established alarm state. A fresh qualifying reading starts the wait again.

A reading that no longer meets the threshold interrupts the wait. Values between `70` and `80` preserve the established state. The time before an alarm update depends on clock-event frequency, delivery, and processing. The graph can't guarantee the sensor's value between readings. Use [offline detection](howto-detect-offline-sensors.md) for availability.

Keep `messageId` unique for each asset, including across restarts, and keep `sequence` strictly increasing. Retry a message only with its original ID, sequence, and unchanged content.

A restart clears the alarm state, pending transitions, and retry tracking. Update consumers to account for the reset and collect fresh readings. The graph starts normal, without publishing a cleared event, and publishes its first state change when the raise condition is met.

## Related content

- [Data flow graph concepts](../concept-dataflow-graphs.md)
- [Detect offline sensors](howto-detect-offline-sensors.md)
- [Report meaningful value changes](howto-report-value-changes.md)
- [Detailed input and state contracts](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/dataflow-patterns/contracts.json)
