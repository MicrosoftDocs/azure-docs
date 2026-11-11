---
title: Configure OPC UA dataset heartbeats
description: Configure the connector for OPC UA to write a dataset heartbeat counter to an OPC UA server so that the server can monitor connector liveness.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-opcua-connector
ms.topic: how-to
ms.date: 10/29/2026
ai-usage: ai-assisted

# CustomerIntent: As an industrial edge operator, I want to configure a dataset heartbeat so that my OPC UA server can detect whether the connector is alive and processing a dataset.
---

# Configure OPC UA dataset heartbeats

A dataset heartbeat is a watchdog signal that the connector for OPC UA writes into an OPC UA server. The connector periodically increments an `Int32` or `UInt32` counter variable so that the server, or another OPC UA client, can detect that the connector is alive and actively processing a dataset.

The heartbeat reuses the asset's existing OPC UA session. It doesn't create an additional session or connection, and doesn't require MQTT write requests.

> [!IMPORTANT]
> Dataset heartbeats are available starting with Azure IoT Operations 2610.

Dataset heartbeats are different from [server heartbeat monitoring](concept-opc-ua-server-heartbeat-monitoring.md). A dataset heartbeat writes a counter to signal **connector liveness**. Server heartbeat monitoring uses a dedicated monitoring session to observe **server liveness** and report inbound endpoint health.

A dataset heartbeat doesn't confirm MQTT delivery. For a counter that advances after dataset or event delivery, use [delivery acknowledgment](howto-configure-opc-ua-advanced-data-collection.md#configure-delivery-acknowledgment). If you configure both features, use separate server variables for the heartbeat and delivery acknowledgment counters.

## Prerequisites

- An Azure IoT Operations instance with the connector for OPC UA enabled and Azure IoT Operations 2610 or later.
- An OPC UA device and asset configuration. To create them, see [Configure the connector for OPC UA](howto-configure-opc-ua.md).
- A dedicated, readable and writable scalar variable of type `Int32` or `UInt32` on the OPC UA server for each dataset heartbeat. The connector's session identity must have permission to read and write the variable.
- To apply the Kubernetes example, `kubectl` access to the cluster where Azure IoT Operations is deployed.

> [!IMPORTANT]
> Don't share a heartbeat node between datasets, either within an asset or across assets. Each dataset maintains an independent in-memory counter and doesn't reread the node before writing. Otherwise successful writes can overwrite each other, causing values to repeat, skip, or move backward. Sharing a heartbeat node is unsupported.

## Configure a dataset heartbeat

Set the following fields in the dataset's connector-specific additional configuration, represented by the stringified JSON `datasetConfiguration` property:

| Field | Type | Description |
| --- | --- | --- |
| `heartbeatDatasource` | String | An absolute OPC UA node ID or expanded node ID for a readable and writable scalar variable of type `Int32` or `UInt32`. |
| `heartbeatInterval` | Integer (`int`) | Interval, in milliseconds, at which the connector increments and writes the counter. |

The heartbeat is enabled only when `heartbeatDatasource` is nonempty and `heartbeatInterval` is greater than `0`. A missing or empty datasource, or a `null`, zero, or negative interval, disables the heartbeat for the dataset.

These settings apply only at the dataset level. They aren't inherited from connector defaults and don't apply to events or individual data points.

The datasource accepts both expanded node IDs with a namespace URI, such as `nsu=http://microsoft.com/Opc/OpcPlc/;s=HeartbeatCounter`, and node IDs with a numeric namespace index, such as `ns=2;s=HeartbeatCounter`. Browse paths and `StartInstance` resolution aren't applied to the heartbeat datasource.

1. Create a dedicated heartbeat variable on your OPC UA server and grant the connector identity read and write access.
1. Add `heartbeatDatasource` and `heartbeatInterval` to each dataset that needs a heartbeat, preserving any other settings in its `datasetConfiguration`.
1. Apply the updated asset configuration and wait for reconciliation. The asset must reach its running state before heartbeat timers start.
1. Use the server or another OPC UA client to observe the counter. The first value written is the value read during initialization plus one, subject to the wraparound behavior described in [Heartbeat counter behavior](#heartbeat-counter-behavior).

### Example Kubernetes asset

The following example writes a heartbeat every five seconds. Before you apply it, replace the device and endpoint references with your existing device and endpoint, and ensure the heartbeat node exists and is writable. This asset definition doesn't create the heartbeat variable.

Save the configuration as `asset-heartbeat.yaml`:

```yaml
apiVersion: namespaces.deviceregistry.microsoft.com/v1
kind: Asset
metadata:
  name: namespaces-thermostat-sample
  namespace: iot-ops
spec:
  displayName: Thermostat sample asset
  deviceRef:
    deviceName: demo-device
    endpointName: opcuaProfileV1
  enabled: true
  datasets:
    - name: processTelemetry
      datasetConfiguration: |-
        {
          "publishingInterval": 1000,
          "heartbeatDatasource": "nsu=http://microsoft.com/Opc/OpcPlc/;s=HeartbeatCounter",
          "heartbeatInterval": 5000
        }
      dataPoints:
        - name: dtmi:com:example:Thermostat;1:temperature
          dataSource: nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt1
```

Apply the configuration in the namespace where you deployed your Azure IoT Operations resources:

```bash
kubectl apply -f asset-heartbeat.yaml
```

To disable this heartbeat, remove or empty `heartbeatDatasource`, or set `heartbeatInterval` to `0`, and apply the updated configuration.

## Initialization and lifecycle

After schema processing, the connector reads each configured heartbeat variable once to determine its type and starting value. The asset reaches its terminal running state and starts heartbeat timers only after all configured heartbeat variables initialize successfully. An unsupported type produces a wrong-type event.

If initialization fails, reconciliation retries it on the normal maintenance cadence. If the asset is removed or disconnected, or its endpoint changes, the heartbeat stops. The connector reestablishes the heartbeat when the asset returns to the running state.

The connector never permanently disables a configured heartbeat because of a failure. Initialization failures are retried during reconciliation. After initialization, write failures are retried at every heartbeat interval. Both paths continue to aggregate failure logs and metrics.

After a configuration update, allow time for reconciliation. Depending on how your environment applies configuration updates, you might also need to roll the connector pods.

## Heartbeat counter behavior

The connector keeps its own in-memory counter for each asset and dataset pair. It doesn't reread the server variable on each interval.

- On each interval, the connector increments the cached counter and writes the new value to the node.
- The first value written is the server value read during initialization plus one.
- The counter increments every interval regardless of whether the previous write succeeded. This behavior preserves the heartbeat cadence, so the server can observe gaps after failed writes.
- An `Int32` counter wraps to `0` after `Int32.MaxValue`. A `UInt32` counter wraps to `0` after `UInt32.MaxValue`.

## Monitor dataset heartbeats

Successful heartbeat operations don't produce logs. Problems are reported through aggregated failure-only logs and metrics.

### Logs

The aggregation window matches the periodic asset-metrics logger interval, controlled by `opcuabroker_PeriodicAssetMetricsLoggerIntervalSeconds`, which defaults to 60 seconds. A log message is emitted only if at least one failure or wrong-type event occurred during the window.

Initialization or write failures produce an **Error** log:

```text
Asset {AssetName} | dataset {DatasetName}: heartbeat counter could not be initialized or updated {FailureCount} time(s) in the last {WindowSeconds}s (lastError={LastError})
```

Wrong-type events produce a **Warning** log:

```text
Asset {AssetName} | dataset {DatasetName}: heartbeat datasource has the wrong type (expected Int32 or UInt32); {Count} occurrence(s) in the last {WindowSeconds}s
```

### Metrics

| Metric | Meaning |
| --- | --- |
| `aio.opc.heartbeat.write.failure.count` | Number of times a dataset heartbeat counter couldn't be initialized or written. |
| `aio.opc.heartbeat.wrong.type.count` | Number of times a heartbeat datasource had the wrong type. |

The metrics identify the asset and dataset through `aio.opc.heartbeat.asset` and `aio.opc.heartbeat.dataset` dimensions only when unbounded metric dimensions are enabled. The write-failure metric also includes the OPC UA error code. The wrong-type metric includes the actual type in `aio.opc.heartbeat.actual-type`.

For dimension details and the setting that enables unbounded dimensions, see [Metrics for the connector for OPC UA](../reference/observability-metrics-opcua-broker.md#dataset-heartbeat-metrics).

## Troubleshoot dataset heartbeats

| Symptom | Action |
| --- | --- |
| The counter doesn't change on the server. | Confirm that you applied the dataset configuration in the correct namespace, that the asset reached its running state, and that `heartbeatDatasource` is nonempty and `heartbeatInterval` is greater than `0`. Check whether another configured heartbeat failed initialization and is preventing the asset from running. |
| The logs report `heartbeat counter could not be initialized or updated`. | Verify that the node exists and is readable and writable by the connector session. Inspect the `lastError` OPC UA status code. |
| The initial read succeeds, but writes fail. | Verify that the node's `AccessLevel` and the session's `UserAccessLevel` include `CurrentWrite`. A node that isn't writable can return `Bad_NotWritable`. An identity without write authorization can receive `Bad_UserAccessDenied`. Configure the server variable as writable and grant the connector identity write access. Writes continue to be retried at the configured interval, with failures reported in the aggregated error log and `aio.opc.heartbeat.write.failure.count`. |
| Values repeat, skip, or move backward when datasets share a node. | Assign a dedicated heartbeat node to every dataset. Sharing a `heartbeatDatasource` within or across assets is unsupported because independent cached counters can overwrite one another. |
| The logs report `heartbeat datasource has the wrong type`. | Verify that the target is a scalar variable of type `Int32` or `UInt32`, not an array or another data type. |

For OPC UA access attributes and write behavior, see [OPC UA Part 3: Address Space Model](https://reference.opcfoundation.org/Core/Part3/) and [OPC UA Part 4: Services](https://reference.opcfoundation.org/Core/Part4/).

## Related content

- [Configure the connector for OPC UA](howto-configure-opc-ua.md)
- [Monitor OPC UA server availability with heartbeat monitoring](concept-opc-ua-server-heartbeat-monitoring.md)
- [Metrics for the connector for OPC UA](../reference/observability-metrics-opcua-broker.md)
