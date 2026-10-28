---
title: Align and correlate records
description: Align records by timestamp and correlate delayed measurements by ID with customer-built stateful processing in data flow graphs.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/20/2026
ai-usage: ai-assisted

#customer intent: As a solution developer, I want to match records by event time or item ID so that I can implement the appropriate data processing pattern.
---

# Align and correlate records

Match related values that arrive as separate messages. These examples use one MQTT source with multiple subscriptions and a custom stateful transform that holds records until it can match them.

## Prerequisites

Complete the [shared example prerequisites](overview-dataflow-patterns.md#prerequisites), including the existing `default` profile, `factory-mqtt` endpoint, and `factory-artifacts` registry endpoint for `ghcr.io`. These examples reference these shared resources without recreating them.

For Azure CLI and Bicep, follow the environment setup in [Create a data flow graph](../howto-create-dataflow-graph.md#prerequisites). Set `AIO_INSTANCE_NAME` and `RESOURCE_GROUP` to your existing instance and resource group. For Bicep, also set `CUSTOM_LOCATION_NAME` to the instance's existing custom location name.

## Choose the matching rule

- **Timestamp and asset ID:** match a speed reading with the temperature valid when it was sampled.
- **Item and asset IDs:** match a prediction with a delayed measurement of the same physical piece.

The custom transform manages pending records, expiration, and duplicate handling. Run each sample graph on one runtime instance: its state is in memory and is lost on restart. Recovery requires external durable input logs and downstream deduplication.

## Match context by timestamp

A speed reading of `12` at `10:00:02` matches temperature `20` at `10:00:01`, not temperature `22` at `10:00:03`. The later temperature isn't valid at the speed reading's timestamp.

:::image type="content" source="../media/concept-dataflow-graphs/timestamp-alignment.svg" alt-text="Diagram of one MQTT source forwarding speed, temperature, and tick messages to a custom timestamp matcher. It matches speed 12 with the earlier temperature 20 and publishes one aligned record." border="false":::

<!--
```mermaid
graph LR
    S("MQTT source<br/>factory/speed<br/>factory/temperature") --&gt; C("CUSTOM timestamp matcher<br/>Hold speed until ready<br/>Select earlier temperature")
    C --&gt; O("factory/aligned<br/>Speed: 12; temperature: 20")
```
-->

Select the latest context at or before the reading's timestamp. This selection requires custom stateful WASM or an external service, not a built-in window.

This wiring uses the custom `graph-align-by-time` sample in
the `factory-artifacts` registry endpoint for `ghcr.io`. The [sample source and contracts](https://github.com/Azure-Samples/explore-iot-operations/tree/huguesBouvier/dataflow-pattern-samples/samples/wasm/dataflow-patterns)
describe its bounded state and diagnostics. The contract
for this example is: buffer by asset; allow two seconds for out-of-order context;
select the newest temperature at or before the speed timestamp, at most five
seconds old; emit the reading when that decision is ready. If eligible context
is missing, emit a diagnostic and skip the reading.

# [Operations experience](#tab/portal)

The operations experience only supports creating and viewing graph artifacts from Azure Container Registry (ACR) and, for built-in transforms, `mcr.microsoft.com`. It can't select or display this sample's GHCR artifact through `factory-artifacts`. Use the **Azure CLI** or **Bicep** tab to deploy the exact sample.

For a separately republished ACR variant with a configured ACR registry endpoint:

1. Create a data flow graph named `align-by-time` with the existing `default` profile.
1. Configure a source using `factory-mqtt` and topics `factory/speed` and `factory/temperature`.
1. Select **Add graph transform (optional)**. In **Graph selection**, select the republished `graph-align-by-time:1.0.0-rc.4` artifact and select **Apply**.
1. Configure the destination using `factory-mqtt` and topic `factory/aligned`, then select **Save**. The operations experience generates the artifact's node connections automatically.

This ACR variant uses a different registry endpoint; it isn't the exact GHCR configuration in the following deployment tabs. For supported actions and limitations, see [Use WASM transforms](../howto-dataflow-graph-wasm.md).

# [Azure CLI](#tab/cli)

Save these complete graph properties as `graph.json`:

```json
{
  "mode": "Enabled",
  "nodes": [
    {
      "name": "source",
      "nodeType": "Source",
      "sourceSettings": {
        "endpointRef": "factory-mqtt",
        "dataSources": ["factory/speed", "factory/temperature"]
      }
    },
    {
      "name": "processor",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "factory-artifacts",
        "artifact": "azure-samples/explore-iot-operations/dataflow-patterns/graph-align-by-time:1.0.0-rc.4"
      }
    },
    {
      "name": "destination",
      "nodeType": "Destination",
      "destinationSettings": {
        "endpointRef": "factory-mqtt",
        "dataDestination": "factory/aligned"
      }
    }
  ],
  "nodeConnections": [
    {"from": {"name": "source"}, "to": {"name": "processor"}},
    {"from": {"name": "processor"}, "to": {"name": "destination"}}
  ]
}
```

Apply the graph:

```azurecli
az iot ops dataflowgraph apply --name align-by-time --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --config-file graph.json
```

# [Bicep](#tab/bicep)

Save this complete template as `main.bicep`. It references the existing instance, custom location, and profile:

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
  name: 'align-by-time'
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
            'factory/speed'
            'factory/temperature'
          ]
        }
      }
      {
        name: 'processor'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'factory-artifacts'
          artifact: 'azure-samples/explore-iot-operations/dataflow-patterns/graph-align-by-time:1.0.0-rc.4'
        }
      }
      {
        name: 'destination'
        nodeType: 'Destination'
        destinationSettings: {
          endpointRef: 'factory-mqtt'
          dataDestination: 'factory/aligned'
        }
      }
    ]
    nodeConnections: [
      {
        from: { name: 'source' }
        to: { name: 'processor' }
      }
      {
        from: { name: 'processor' }
        to: { name: 'destination' }
      }
    ]
  }
}
```

Deploy the template:

```azurecli
az deployment group create --resource-group $RESOURCE_GROUP --template-file main.bicep --parameters aioInstanceName="$AIO_INSTANCE_NAME" customLocationName="$CUSTOM_LOCATION_NAME"
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../../includes/kubernetes-debug-only-note.md)]

Save this complete resource as `align-by-time.yaml`:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: align-by-time
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
  nodes:
    - name: source
      nodeType: Source
      sourceSettings:
        endpointRef: factory-mqtt
        dataSources: [factory/speed, factory/temperature]
    - name: processor
      nodeType: Graph
      graphSettings:
        registryEndpointRef: factory-artifacts
        artifact: azure-samples/explore-iot-operations/dataflow-patterns/graph-align-by-time:1.0.0-rc.4
    - name: destination
      nodeType: Destination
      destinationSettings:
        endpointRef: factory-mqtt
        dataDestination: factory/aligned
  nodeConnections:
    - from: { name: source }
      to: { name: processor }
    - from: { name: processor }
      to: { name: destination }
```

Apply the graph for debugging:

```bash
kubectl apply -f align-by-time.yaml
```

---

Publish these synthetic messages in order, one JSON message per line (NDJSON):

```ndjson
{"kind":"temperature","assetId":"line-1","sampledAt":"2026-10-19T10:00:01Z","temperature":20}
{"kind":"temperature","assetId":"line-1","sampledAt":"2026-10-19T10:00:03Z","temperature":22}
{"kind":"speed","assetId":"line-1","sampledAt":"2026-10-19T10:00:02Z","speed":12}
{"kind":"tick","assetId":"line-1","sampledAt":"2026-10-19T10:00:04Z"}
```

The first two messages go to `factory/temperature`; the speed reading and final tick go to `factory/speed`. The transform retains the temperatures and holds the speed reading. The tick at `10:00:04` releases the speed reading at `10:00:02` after the two-second allowance, producing this result on `factory/aligned`:

```json
{
  "assetId": "line-1",
  "sampledAt": "2026-10-19T10:00:02Z",
  "speed": 12,
  "temperature": 20,
  "temperatureSampledAt": "2026-10-19T10:00:01Z"
}
```

When one arrival releases several readings, the custom module emits
`{"kind":"batch","records":[...]}`. Downstream processing must handle that
batch envelope.

Keep these runtime constraints in mind:

- Send trusted periodic ticks for each active asset. There's no background timer, so idle graphs can't release pending readings or expire state without another arrival.
- Use RFC3339 timestamps, no earlier than the Unix epoch, with millisecond precision or coarser. The default maximum future clock skew is 30 seconds.
- Monitor diagnostics for late or duplicate inputs and missing context. To see the sample's limits and duplicate rules, check the `contracts.json` file.
- Keep buffered timestamps and IDs in JSON. Output MQTT metadata comes from the arrival that releases the result, not necessarily the original reading.

## Match predictions with delayed measurements by ID

Match prediction `203` with later measurement `200` for asset `line-1`, piece `part-42`. The residual is measurement minus prediction: `200 - 203 = -3`.

:::image type="content" source="../media/concept-dataflow-graphs/delayed-correlation.svg" alt-text="Diagram of one MQTT source forwarding predictions and measurements to a custom ID matcher. It matches line-1 and part-42 and publishes residual minus 3 and targetError 2." border="false":::

<!--
```mermaid
graph LR
    S("MQTT source<br/>factory/predictions<br/>factory/measurements") --&gt; C("CUSTOM ID matcher<br/>Match asset and piece<br/>Calculate errors")
    C --&gt; O("factory/matches<br/>Residual: -3; targetError: 2")
```
-->

Match by asset and piece IDs. Include a run or batch ID if piece IDs repeat. Hold pending records for either arrival order, bound their age and count, and preserve the prediction's timestamps and model version.

The custom `graph-correlate-by-id` sample matches records and calculates `residual` and `targetError`. A residual measures prediction error; with a target of `198`, the separate target error is `200 - 198 = 2`.

### Deploy the ID correlation example

# [Operations experience](#tab/portal)

The operations experience only supports creating and viewing graph artifacts from ACR and, for built-in transforms, `mcr.microsoft.com`. It can't select or display this sample's GHCR artifact through `factory-artifacts`. Use the **Azure CLI** or **Bicep** tab to deploy the exact sample.

For a separately republished ACR variant with a configured ACR registry endpoint:

1. Create a data flow graph named `correlate-predictions` with the existing `default` profile.
1. Configure a source using `factory-mqtt` and topics `factory/predictions` and `factory/measurements`.
1. Select **Add graph transform (optional)**. In **Graph selection**, select the republished `graph-correlate-by-id:1.0.0-rc.4` artifact and select **Apply**.
1. Configure the destination using `factory-mqtt` and topic `factory/matches`, then select **Save**. The operations experience generates the artifact's node connections automatically.

This ACR variant uses a different registry endpoint; it isn't the exact GHCR configuration in the following deployment tabs. For supported actions and limitations, see [Use WASM transforms](../howto-dataflow-graph-wasm.md).

# [Azure CLI](#tab/cli)

Save these complete graph properties as `graph.json`:

```json
{
  "mode": "Enabled",
  "nodes": [
    {
      "name": "source",
      "nodeType": "Source",
      "sourceSettings": {
        "endpointRef": "factory-mqtt",
        "dataSources": ["factory/predictions", "factory/measurements"]
      }
    },
    {
      "name": "processor",
      "nodeType": "Graph",
      "graphSettings": {
        "registryEndpointRef": "factory-artifacts",
        "artifact": "azure-samples/explore-iot-operations/dataflow-patterns/graph-correlate-by-id:1.0.0-rc.4"
      }
    },
    {
      "name": "destination",
      "nodeType": "Destination",
      "destinationSettings": {
        "endpointRef": "factory-mqtt",
        "dataDestination": "factory/matches"
      }
    }
  ],
  "nodeConnections": [
    {"from": {"name": "source"}, "to": {"name": "processor"}},
    {"from": {"name": "processor"}, "to": {"name": "destination"}}
  ]
}
```

Apply the graph:

```azurecli
az iot ops dataflowgraph apply --name correlate-predictions --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --config-file graph.json
```

# [Bicep](#tab/bicep)

Save this complete template as `main.bicep`. It references the existing instance, custom location, and profile:

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
  name: 'correlate-predictions'
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
            'factory/predictions'
            'factory/measurements'
          ]
        }
      }
      {
        name: 'processor'
        nodeType: 'Graph'
        graphSettings: {
          registryEndpointRef: 'factory-artifacts'
          artifact: 'azure-samples/explore-iot-operations/dataflow-patterns/graph-correlate-by-id:1.0.0-rc.4'
        }
      }
      {
        name: 'destination'
        nodeType: 'Destination'
        destinationSettings: {
          endpointRef: 'factory-mqtt'
          dataDestination: 'factory/matches'
        }
      }
    ]
    nodeConnections: [
      {
        from: { name: 'source' }
        to: { name: 'processor' }
      }
      {
        from: { name: 'processor' }
        to: { name: 'destination' }
      }
    ]
  }
}
```

Deploy the template:

```azurecli
az deployment group create --resource-group $RESOURCE_GROUP --template-file main.bicep --parameters aioInstanceName="$AIO_INSTANCE_NAME" customLocationName="$CUSTOM_LOCATION_NAME"
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../../includes/kubernetes-debug-only-note.md)]

Azure Samples provides a complete
[`correlate-predictions.yaml`](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/dataflow-patterns/manifests/correlate-predictions.yaml)
with its own topics and published graph reference. The separate
[`align-by-time.yaml`](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/dataflow-patterns/manifests/align-by-time.yaml)
contains the timestamp example.

Clone the sample repository and run these commands after completing
the [shared prerequisites](overview-dataflow-patterns.md#prerequisites):

```bash
git clone --branch huguesBouvier/dataflow-pattern-samples https://github.com/Azure-Samples/explore-iot-operations.git
cd explore-iot-operations
kubectl apply -f samples/wasm/dataflow-patterns/manifests/registry.yaml
kubectl apply -f samples/wasm/dataflow-patterns/manifests/correlate-predictions.yaml
```

These manifests use the existing `default` profile and `factory-mqtt` endpoint
in `azure-iot-operations`. The registry manifest describes the shared `factory-artifacts` endpoint; if it's already configured, its apply step is idempotent.

---

ID correlation requires predictions with `kind: "prediction"`, `assetId`, `pieceId`, a positive integer `modelVersion`, and finite numeric `predictedWeight`. Measurements require `kind: "measurement"`, the same asset and piece IDs, and finite numeric `measuredWeight` and `targetWeight`. Use distinct `predictedAt` and `measuredAt` fields for optional timestamps that describe different instants. Shared non-key fields must have equal values or the match fails.

The custom module manages pending matches, limits, duplicate handling, and completed-match output. The graph publishes matches to the distinct topic `factory/matches`.

**Synthetic input messages (NDJSON):** publish the first line to `factory/predictions` and the second line later to `factory/measurements`. The prediction includes the original feature values for retraining.

```ndjson
{"kind":"prediction","assetId":"line-1","pieceId":"part-42","modelVersion":8,"speed":10,"temperature":20,"predictedWeight":203}
{"kind":"measurement","assetId":"line-1","pieceId":"part-42","measuredWeight":200,"targetWeight":198}
```

The prediction alone produces no match. When the measurement arrives, expect this payload on `factory/matches`, including the original model version and feature values:

```json
{"kind":"correlated","assetId":"line-1","pieceId":"part-42","modelVersion":8,"speed":10,"temperature":20,"predictedWeight":203,"measuredWeight":200,"targetWeight":198,"residual":-3,"targetError":2}
```

Either arrival order works. By default, pending entries expire 60 seconds after the first side arrives; retries don't extend that time. Valid arrivals or trusted `{"kind":"tick","assetId":"line-1"}` messages trigger cleanup; there is no background timer.

Completed matches are deduplicated for 60 seconds by default, not forever. A restart loses both pending and completed entries. For recovery, deduplicate in an external durable sink by asset, piece, and optional run ID. For retraining, preserve the original feature values used by each prediction.

## Related content

- [Choose another pattern](overview-dataflow-patterns.md)
- [Data flow graphs overview](../concept-dataflow-graphs.md)
