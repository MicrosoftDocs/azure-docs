---
title: Configure data buffering and disk persistence for data flows
description: Configure buffering and disk persistence for data flows when destination endpoints are unavailable in Azure IoT Operations.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 05/08/2026
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to configure buffering and disk persistence for my data flows so that I can reduce data loss during destination outages and restarts.
---

# Configure data buffering and disk persistence for data flows

When a data flow sends messages to a destination endpoint, such as Azure Event Hubs, Microsoft Fabric Real-Time Intelligence, Kafka, or another cloud service, the destination or network might become unavailable. Azure IoT Operations uses the local MQTT broker subscription model to buffer messages and retry delivery.

This article explains how data flows protect messages during destination outages, and how to configure broker buffering and disk persistence for stronger protection.

## How data flows buffer messages during destination outages

When you use the local MQTT broker as a source endpoint in a data flow, either directly or indirectly through assets that publish to it, the data flow receives messages from the MQTT broker as a subscriber. The data flow acknowledges each source message after the message is successfully processed and delivered to the destination, or after the message is intentionally dropped because of filtering, schema validation, or message expiry.

If the destination endpoint is unavailable, delivery can't complete. In this case, the data flow doesn't acknowledge the source message. The MQTT broker keeps the message in the subscriber queue and the data flow retries delivery. When connectivity is restored, the data flow sends queued messages to the destination and acknowledges them after successful delivery.

The message path is: publisher or asset to MQTT broker, MQTT broker to data flow, and data flow to destination endpoint.

1. The MQTT broker delivers a message to the data flow.
1. The data flow sends the message to the destination endpoint.
1. If the send succeeds, the data flow acknowledges the source message and the broker removes it from the subscriber queue.
1. If the send fails, the data flow doesn't acknowledge the source message. The broker keeps it queued.
1. The data flow retries delivery until it succeeds, the message expires, or a configured limit applies.

> [!IMPORTANT]
> Data flow buffering is bounded. Queued messages are subject to the MQTT broker memory profile, subscriber queue limits, disk-backed message buffer size, persistence configuration, and message or session expiry. Configure these settings for the maximum outage duration and throughput you need to tolerate.

## Data protection configuration layers

Use the following configuration layers to control how messages are buffered and protected during destination outages.

| Layer | What it protects against | Default behavior | Customer action |
| --- | --- | --- | --- |
| Data flow retry and withheld acknowledgment | Temporary destination or network outage | Built in for local MQTT broker and asset-backed sources | No configuration required |
| MQTT broker subscriber queue | Messages received by a data flow subscription but not yet acknowledged | Stored in memory | Configure memory profile and subscriber queue limits |
| Disk-backed message buffer | Large temporary backlogs that exceed available memory | Disabled | Configure the broker at deployment with a disk-backed message buffer |
| MQTT broker persistence | Broker or pod restart while messages are queued | Disabled by default | Enable broker persistence and subscriber queue persistence |
| Data flow `requestDiskPersistence` | Per-data-flow request for persistent subscriber queue storage | Disabled | Enable `requestDiskPersistence` on the data flow or data flow graph, and enable dynamic subscriber queue persistence on the broker |
| Message and session expiry | Bounded storage and replay behavior | Configurable | Set expiry and limits based on your loss tolerance and outage window |

The local MQTT broker subscriber queue is stored in memory by default. You can configure the MQTT broker to use disk in two different ways:

- **Disk-backed message buffer**: Uses disk as a spillover buffer when queues grow beyond available memory. This setting helps with larger temporary backlogs, but it isn't the same as durable persistence across broker restarts.
- **MQTT broker persistence**: Persists selected broker data, including subscriber queues, to disk so queued messages can survive restarts or power loss.

For broker configuration details, see:

- [Configure broker settings for high availability, scaling, and memory usage](../manage-mqtt-broker/howto-configure-availability-scale.md)
- [Configure disk-backed message buffer behavior](../manage-mqtt-broker/howto-disk-backed-message-buffer.md)
- [Configure MQTT broker persistence](../manage-mqtt-broker/howto-broker-persistence.md)
- [Configure broker MQTT client options](../manage-mqtt-broker/howto-broker-mqtt-client-options.md#subscriber-queue-limit)

## Choose a buffering configuration

Choose a configuration based on the outage duration and durability requirements for your workload:

- For short transient cloud or network outages, the default in-memory subscriber queue might be enough.
- For higher throughput or longer temporary outages, configure the disk-backed message buffer.
- For restart or power-loss protection, enable MQTT broker persistence and subscriber queue persistence, then enable `requestDiskPersistence` on the data flow or data flow graph.
- For bounded storage environments, configure subscriber queue limits, message expiry, and monitoring so the broker enforces queue limits and drops or rejects messages according to your policy.

## Example: Destination outage

Assume that you create a data flow by using the default local MQTT broker as the source endpoint and Azure Event Hubs as the destination endpoint. If connectivity between the data flow and Azure Event Hubs is lost, the data flow retries sends and doesn't acknowledge source messages. The MQTT broker queues the unacknowledged messages. With default settings, the queue is stored in memory. With disk-backed message buffer, the queue can spill to disk. With broker persistence and data flow `requestDiskPersistence`, queued messages can survive broker restarts, subject to the configured persistence, expiry, and storage limits.

## Enable disk persistence for a data flow

Disk persistence lets data flows and data flow graphs keep processing state across restarts. When you enable this feature, the MQTT broker persists data, like messages in the subscriber queue, to disk. This approach helps make sure your data flow's data source doesn't lose queued data during power outages or broker restarts. The broker maintains optimal performance because persistence is configured per data flow, so only the data flows that need it use this feature.

The data flow requests persistence during subscription by using an MQTTv5 user property. This feature works only when:

- The data flow uses the MQTT broker or asset as the source.
- The MQTT broker has persistence enabled with dynamic persistence mode set to `Enabled` for the data type, like subscriber queues.

For details about MQTT broker persistence configuration, see [Configure MQTT broker persistence](../manage-mqtt-broker/howto-broker-persistence.md).

The setting accepts `Enabled` or `Disabled`. `Disabled` is the default.

## Configure for a data flow

# [Operations experience](#tab/portal)

When you create or edit a data flow, select **Edit**, and then select **Yes** next to **Request data persistence**.

# [Azure CLI](#tab/cli)

Add the `requestDiskPersistence` property to your data flow configuration file:

```json
{
    "mode": "Enabled",
    "requestDiskPersistence": "Enabled",
    "operations": [
        // ... your data flow operations
    ]
}
```

# [Bicep](#tab/bicep)

Add the `requestDiskPersistence` property to your data flow resource. The API version is `2025-10-01` or later:

```bicep
resource dataflow 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflows@2025-10-01' = {
  parent: defaultDataflowProfile
  name: dataflowName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    requestDiskPersistence: 'Enabled'
    operations: [
      // ... your data flow operations
    ]
  }
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

Add the `requestDiskPersistence` property to your data flow spec:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: Dataflow
metadata:
  name: <DATAFLOW_NAME>
  namespace: azure-iot-operations
spec:
  profileRef: default 
  mode: Enabled
  requestDiskPersistence: Enabled
  operations:
    # ... your data flow operations
```

---

## Configure for a data flow graph

# [Operations experience](#tab/portal)

When you create or edit a data flow graph, select **Edit**, and then select **Yes** next to **Request data persistence**.

# [Azure CLI](#tab/cli)

The API doesn't currently support disk persistence configuration for data flow graphs through the CLI.

# [Bicep](#tab/bicep)

Add the `requestDiskPersistence` property to your data flow graph resource:

```bicep
resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2026-03-01' = {
  parent: dataflowProfile
  name: 'my-graph'
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    requestDiskPersistence: 'Enabled'
    nodes: [
      // ... your graph nodes
    ]
    nodeConnections: [
      // ... your node connections
    ]
  }
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

Add the `requestDiskPersistence` property to your data flow graph spec:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: <GRAPH_NAME>
  namespace: azure-iot-operations
spec:
  profileRef: default
  requestDiskPersistence: Enabled
  nodes:
    # ... your graph nodes
  nodeConnections:
    # ... your node connections
```

---

## Related content

- [Create a data flow](howto-create-dataflow.md)
- [Data flow graphs overview](concept-dataflow-graphs.md)
- [Configure MQTT broker persistence](../manage-mqtt-broker/howto-broker-persistence.md)
- [Configure disk-backed message buffer behavior](../manage-mqtt-broker/howto-disk-backed-message-buffer.md)
