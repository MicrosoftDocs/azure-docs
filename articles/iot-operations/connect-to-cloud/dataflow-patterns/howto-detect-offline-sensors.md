---
title: Detect offline sensors
description: Detect when an expected sensor stops reporting and publish its offline and recovery status with a custom data flow graph.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/21/2026
ai-usage: ai-assisted

#customer intent: As a solution developer, I want to detect offline sensors so that consumers learn when an expected sensor stops reporting and when it recovers.
---

# Detect offline sensors

Find out when a sensor stops reporting. In this example, `sensor-1` is marked offline after `1` second without a reading. When it sends a new reading, the graph reports it online again.

Register sensors you expect to hear from so you can also detect one that never sends its first reading. A clock publisher sends periodic events so the graph can check for silence even when no readings arrive. All examples are synthetic.

## Prerequisites

Start with an existing Azure IoT Operations deployment and MQTT broker access. Follow [Create a data flow graph](../howto-create-dataflow-graph.md) to configure a data flow profile and MQTT endpoint.

Complete the [Azure Samples deployment instructions](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#data-flow-pattern-samples) for registry setup and single-instance deployment, then use the [standalone sample setup](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#use-complete-standalone-manifests). The examples use namespace `azure-iot-operations`. Configure the [clock publisher](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#supply-clock-events-during-sensor-silence).

The `default` data flow profile must already exist with one instance. The examples reuse the existing `factory-mqtt` MQTT endpoint and `factory-artifacts` registry endpoint for `ghcr.io`; they don't create profiles or endpoints.

[!INCLUDE [prereq-azure-cli](../../includes/prereq-azure-cli.md)]

[!INCLUDE [set-environment-variables](../../includes/set-environment-variables.md)]

## Deploy the complete graph

:::image type="content" source="../media/concept-dataflow-graphs/detect-offline-sensors.svg" alt-text="Diagram showing sensor-1 registered at 0.1 seconds, reported offline after 1 second of silence, and reported online again when a reading arrives." border="false":::

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
        "dataSources": [
          "factory/availability-readings",
          "factory/availability-ticks",
          "factory/availability-registers"
        ]
      }
    },
    {
      "name": "processor",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "factory-artifacts",
        "artifact": "azure-samples/explore-iot-operations/dataflow-patterns/graph-offline-detection:1.0.0-rc.4",
        "configuration": [
          {
            "key": "settings",
            "value": "{\"role\":\"offline-detection\",\"timeoutMs\":1000,\"inputTopics\":{\"reading\":\"factory/availability-readings\",\"tick\":\"factory/availability-ticks\",\"register\":\"factory/availability-registers\"}}"
          }
        ]
      }
    },
    {
      "name": "destination",
      "nodeType": "Destination",
      "destinationSettings": {
        "endpointRef": "factory-mqtt",
        "dataDestination": "factory/availability"
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
  --name offline-detection \
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
  name: 'offline-detection'
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
            'factory/availability-readings'
            'factory/availability-ticks'
            'factory/availability-registers'
          ]
        }
      }
      {
        name: 'processor'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'factory-artifacts'
          artifact: 'azure-samples/explore-iot-operations/dataflow-patterns/graph-offline-detection:1.0.0-rc.4'
          configuration: [
            {
              key: 'settings'
              value: '{"role":"offline-detection","timeoutMs":1000,"inputTopics":{"reading":"factory/availability-readings","tick":"factory/availability-ticks","register":"factory/availability-registers"}}'
            }
          ]
        }
      }
      {
        name: 'destination'
        nodeType: 'Destination'
        destinationSettings: {
          endpointRef: 'factory-mqtt'
          dataDestination: 'factory/availability'
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
  https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/huguesBouvier/dataflow-pattern-samples/samples/wasm/dataflow-patterns/manifests/offline-detection.yaml \
  --output offline-detection.yaml
kubectl apply -f offline-detection.yaml
```

Alternatively, save this equivalent manifest as `offline-detection.yaml` and run the same `kubectl apply` command:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: offline-detection
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
  nodes:
    - name: source
      nodeType: Source
      sourceSettings:
        endpointRef: factory-mqtt
        dataSources: [factory/availability-readings, factory/availability-ticks, factory/availability-registers]
    - name: processor
      nodeType: Graph
      graphSettings:
        registryEndpointRef: factory-artifacts
        artifact: azure-samples/explore-iot-operations/dataflow-patterns/graph-offline-detection:1.0.0-rc.4
        configuration:
          - key: settings
            value: '{"role":"offline-detection","timeoutMs":1000,"inputTopics":{"reading":"factory/availability-readings","tick":"factory/availability-ticks","register":"factory/availability-registers"}}'
    - name: destination
      nodeType: Destination
      destinationSettings:
        endpointRef: factory-mqtt
        dataDestination: factory/availability
  nodeConnections:
    - from: {name: source}
      to: {name: processor}
    - from: {name: processor}
      to: {name: destination}
```

---

The source subscribes to `factory/availability-readings`, `factory/availability-registers`, and `factory/availability-ticks`. The destination is `factory/availability`. Allow sensor publishers to publish only readings. Reserve registration and clock topics for authorized publishers; sensor identities must not have permission to publish on them.

The example marks a watched sensor offline when a reading or clock event detects at least `1` second of silence.

## Register an expected sensor

Using an identity authorized to register sensors, publish this message on `factory/availability-registers`:

```json
{"kind":"register","assetId":"sensor-1"}
```

Registration starts the timeout when it arrives. Repeating it doesn't restart the timeout. Clock events alone don't register an unknown sensor.

The clock publisher can register configured assets and send events on `factory/availability-ticks` during silence:

```json
{"kind":"tick","assetId":"sensor-1"}
```

A complete telemetry reading on `factory/availability-readings` is:

```json
{"kind":"reading","assetId":"sensor-1","messageId":"r0","sequence":0,"value":10}
```

Keep `messageId` unique per asset, including across restarts, and `sequence` strictly increasing. Retry a message only with its original ID, sequence, and unchanged content. Accepted readings refresh last-seen time; retries and rejected readings don't.

## Check timeout and recovery

Example timeline:

| Elapsed time | Input | Result |
| --- | --- | --- |
| `0.1` s | Register `sensor-1` | Start waiting for its first reading |
| `0.5` s | Repeat registration | Preserve the original start time |
| `1.1` s | Clock event | Offline after `1` second of silence |
| `1.2` s | Clock event | Stay offline; no repeated transition |
| `1.3` s | First reading, `r0`, sequence `0`, value `10` | Online with `reason: "recovered"` |
| `1.4` s | `r1`, sequence `1`, value `11` | Refresh last-seen time |
| `2` s | Identical retry of `r1` | Preserve last-seen time |
| `2.4` s | `r2`, sequence `2`, value `12`, with no intervening clock event | Batch: offline, then online recovered |

The first offline output is:

```json
{"kind":"availability","assetId":"sensor-1","state":"offline","reason":"timeout","emittedAtMs":1100,"lastSeenAtMs":null,"elapsedMs":1000}
```

The processor computes time fields automatically; the example shows milliseconds relative to the timeline's start, while live timestamps use processing-clock epoch milliseconds. `lastSeenAtMs` is null until a reading arrives. Recovery at `1.3` seconds sets it to `1300`; `elapsedMs: 1200` records the silence since registration.

If a valid reading arrives at or after timeout before a clock event detects the silence, both transitions are delivered together:

```json
{"kind":"batch","records":[{"kind":"availability","assetId":"sensor-1","state":"offline","reason":"timeout","emittedAtMs":2400,"lastSeenAtMs":1400,"elapsedMs":1000},{"kind":"availability","assetId":"sensor-1","state":"online","reason":"recovered","emittedAtMs":2400,"lastSeenAtMs":2400,"elapsedMs":1000}]}
```

Consumers must handle both individual availability records and this batch of records. For a new sensor, a first accepted reading before timeout produces `state: "online"`, `reason: "firstReading"`, and `elapsedMs: 0`, with or without prior registration.

## Advanced: timing and restart

The graph checks elapsed processing time when a clock event or reading arrives. Detection latency includes clock-event frequency, delivery, and processing delay. Monitor the clock publisher and its route. The optional `sampledAt` property records measurement time; the timeout uses processing time.

A restart clears registrations, last-seen times, availability state, and retry tracking. The sample clock publisher repeats registration to restore monitoring for configured sensors without postponing existing timeouts. If you use another publisher, register the expected sensors again after restart. To stop monitoring a retired sensor, remove it from the registration list and coordinate a restart.

## Related content

- [Data flow graph concepts](../concept-dataflow-graphs.md)
- [Alarm hysteresis](howto-stabilize-alarms.md)
- [Report meaningful value changes](howto-report-value-changes.md)
- [Detailed input and state contracts](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/dataflow-patterns/contracts.json)
