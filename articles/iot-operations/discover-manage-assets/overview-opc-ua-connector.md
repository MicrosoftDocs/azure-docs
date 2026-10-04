---
title: What is the connector for OPC UA?
description: Learn how the connector for OPC UA connects industrial assets, manages OPC UA sessions, and exchanges data with the MQTT broker.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-opcua-connector
ms.topic: overview
ms.date: 08/10/2026

# CustomerIntent: As an industrial edge IT or operations user, I want to understand what the connector for OPC UA is and how it works with OPC UA industrial assets to enable me to add them as resources to my Kubernetes cluster. I want to understand how to read data from OPC UA servers and write data to implement process control.

---

# What is the connector for OPC UA?

OPC UA (OPC Unified Architecture) is a standard developed by the [OPC Foundation](https://opcfoundation.org/) to enable the exchange of data between industrial components at the edge and with the cloud. The connector for OPC UA can route messages from OPC UA servers to the MQTT broker and send control messages to OPC UA servers. OPC UA provides a consistent, secure, documented standard based on widely used data formats. Industrial components can implement the OPC UA standard to enable universal data exchange.

By using the *OPC UA write capability*, industrial developers and operations engineers can use the connector for OPC UA to perform real-time control at the edge by writing values directly to OPC UA nodes. This capability enables immediate updates to configurations, triggers for automation, and dynamic process adjustments without relying on round-trips to the cloud.

The write capability is useful in scenarios where latency, autonomy, or local decision making is critical such as in manufacturing lines, predictive maintenance, or in AI-driven control loops.

The connector for OPC UA is an optional part of Azure IoT Operations that:

- Connects to OPC UA servers to retrieve data that it publishes to topics in the MQTT broker.
- Writes data based on values from an MQTT broker topic subscription.

The connector for OPC UA enables your industrial OPC UA environment to ingress data into your local workloads running on a Kubernetes cluster, and into your cloud workloads.

> [!TIP]
> If you didn't include the connector for OPC UA when you deployed Azure IoT Operations, you can add it to your existing instance from the Azure portal. For instructions, see [Manage components using the Azure portal](../manage-iot-ops/howto-manage-update-uninstall.md#manage-instance-components).

The connector for OPC UA is a client application that runs as a middleware service in Azure IoT Operations. The connector for OPC UA connects to OPC UA servers, lets you browse the server address space, monitor data changes and events in connected assets, and write data to nodes in the server address space. Operations teams and developers use the connector for OPC UA to streamline the task of connecting OPC UA assets to their industrial solution at the edge.

## Capabilities

As part of Azure IoT Operations, the connector for OPC UA is a native Kubernetes application that:

- Connects existing OPC UA servers and assets to a native Kubernetes cluster at the edge.
- Can automatically [discover assets](./howto-detect-opc-ua-assets.md) connected to an OPC UA server and add the asset configurations into Azure Device Registry.
- Publishes JSON-encoded messages from OPC UA servers in OPC UA PubSub format, using a JSON payload. By using this standard format for data exchange, you can reduce the risk of future compatibility issues.
- Can synchronize OPC UA node properties to the [distributed state store](../develop-edge-apps/overview-edge-apps.md#state-store).
- Writes values directly to nodes in a connected OPC UA server based on MQTT subscriptions.
- Connects to Azure Arc-enabled services in the cloud.

### Other features

The connector for OPC UA supports the following features as part of Azure IoT Operations:

| Feature | Supported | Notes |
|---------|:---------:|-------|
| Username/password authentication | Yes | |
| X.509 user certificates | Yes | |
| Anonymous access | Yes | For testing purposes |
| Southbound certificate trust list | Yes | For secure, encrypted OPC UA connections |
| OpenTelemetry integration | Yes | |
| Automatic reconnection | Yes | Reconnects to OPC UA servers after failures |
| Multiple server connections | Yes | Configured using `device` resources |
| OPC UA PubSub format | Yes | JSON-encoded data value changes |
| CloudEvents headers | Yes | Message headers as MQTT user properties |
| OPC UA events | Yes | Predefined event fields |
| Payload compression | Yes | Supports `gzip` and `brotli` |
| [Dynamic node resolution](#dynamic-node-resolution-with-browse-paths) | Yes | Uses the `TranslateBrowsePathToNodeId` service |
| State store synchronization | Yes | Sync OPC UA node properties to distributed state store |
| [Shared endpoint mode](#shared-endpoint-mode) | Yes | Multiple assets share a single OPC UA session |
| [High availability](#high-availability-for-opc-ua-connections) | Yes | Uses active and passive connector instances to reduce interruptions |
| [Key frame generation](#key-frames-for-opc-ua-data-points) | Yes | Enables downstream services to recover state more quickly |
| [Dataset triggering](#control-dataset-publishing-with-a-triggering-item) | Yes | Publishes sampled data points when a selected data point changes |
| [Server heartbeat monitoring](concept-opc-ua-server-heartbeat-monitoring.md) | Yes | Detects OPC UA server liveness and reports inbound endpoint health |

## How it works

To read data from a connected OPC UA server, the connector for OPC UA application:

1. Reads the asset's associated device configuration to determine the OPC UA server endpoint and the security settings to use for the connection.
1. Reads the asset's configured publishing interval to determine how frequently the connector publishes data to an MQTT broker topic.
1. Reads the asset's configured data points and events to determine which values from the OPC UA server to publish to the MQTT broker.
1. Creates a session to the OPC UA server for each configured asset.
1. Creates a separate subscription in the session for each 1,000 data points.
1. Creates a separate subscription for each event defined in the asset.
1. Publishes messages to the MQTT broker based on the publishing interval. The connector implements retry logic to identify connections to endpoints that don't respond after a specified number of keep-alive requests. For example, there could be a nonresponsive endpoint in your environment when an OPC UA server stops responding because of a power outage.

To write values to a node in a connected OPC UA server, the connector for OPC UA:

1. Reads the asset's associated device configuration to determine the OPC UA server endpoint and the security settings to use for the connection.

1. Reads the asset configuration to determine which nodes to write to on the OPC UA server.

1. Subscribes to an MQTT topic that contains write requests for the asset. The topic name is in the format `<namespace>/asset-operations/<asset-name>/builtin/<dataset-name>/`, where `<namespace>` is the namespace for the Azure IoT Operations instance, `<asset-name>` is the name of the asset, and `<dataset-name>` is the name of the dataset that contains the nodes to write to.

1. Creates a temporary session with the OPC UA server using the device configuration.

1. Checks the payload to ensure all data points exist in the target dataset.

1. Writes the values to the OPC UA server, and publishes a success or failure response to the MQTT broker. The changed value is published to the standard message topic associated with the dataset.

To generate a write request, publish a JSON message to the MQTT topic using MQTT v5 request/response semantics. Specify the dataset name and the values to be written in the payload. Each MQTT message includes metadata that defines system-level and user-defined properties such as `SourceId`, `ProtocolVersion`, and `CorrelationData` to ensure traceability and conformance.

To synchronize OPC UA node properties to the distributed state store, the connector for OPC UA:

1. Follows the `HasProperty` reference of all variable nodes that are referenced as data points within any dataset of all assets using the same OPC UA inbound endpoint.
1. Adds the properties to the distributed state store under the ID: `<aio-namespace>.<asset-name>.<dataset-name>.<data-point-name>.<property-name>`.
1. Automatically subscribes the `ModelChange` event of the OPC UA server and repopulates all properties after a `ModelChange` event occurs.

To configure this behavior, select **Sync properties into state store** when you configure an inbound OPC UA endpoint in the operations experience web UI:

:::image type="content" source="media/overview-opc-ua-connector/sync-properties.png" alt-text="Screenshot that shows the location of the sync properties to state store option." lightbox="media/overview-opc-ua-connector/sync-properties.png":::

You can also force a synchronization of all properties by making an MQTT RPC call to the `azure-iot-operations/asset-operations/<asset-name>/builtin/syncProperties` topic. A payload `{}` forces a synchronization without observing `ModelChange` events. A payload `{"observeModelChanges": true}` forces a synchronization that observes `ModelChange` events.

## Shared endpoint mode

By default, each asset that connects to an OPC UA server opens its own independent OPC UA session. This default behavior is called *dedicated* mode.

When you set the `shared` flag to `true` on a device's inbound endpoint, the connector establishes a single OPC UA session for the endpoint and reuses it across all assets that reference that endpoint. This behavior is called *shared* mode.

Shared mode reduces the number of sessions and connections on the OPC UA server, but it also increases the effect of a session interruption because every asset on the endpoint uses the same session. You can use shared and dedicated endpoints on the same device to balance server capacity and asset isolation.

To compare session modes and configure a shared endpoint, see [Configure OPC UA sessions and high availability](howto-configure-opc-ua-sessions-high-availability.md).

## High availability for OPC UA connections

High availability uses active and passive connector instances for an OPC UA inbound endpoint. The active instance owns the server session and subscriptions. If the active instance becomes unavailable, a passive instance takes over the endpoint and attempts to restore data collection.

You can combine high availability with dedicated or shared session mode. High availability reduces interruptions caused by connector failures, but it doesn't make the OPC UA server itself highly available and it doesn't guarantee that no data is lost during failover.

To plan capacity, configure redundant connectors, and verify failover, see [Configure OPC UA sessions and high availability](howto-configure-opc-ua-sessions-high-availability.md).

## Server heartbeat monitoring

The connector for OPC UA can monitor whether an OPC UA server is alive, independently of your asset data collection. A dedicated monitoring session watches the server's current time and reports server liveness as inbound endpoint health, so you can tell a server outage apart from a data configuration problem.

Server heartbeat monitoring is separate from dataset publishing behavior, session sharing, and connector high availability. To learn how it works, how to configure it per endpoint, and how to monitor the heartbeat state, see [Monitor OPC UA server availability with heartbeat monitoring](concept-opc-ua-server-heartbeat-monitoring.md).

## Connector for OPC UA message format

The connector for OPC UA publishes messages from OPC UA servers to the MQTT broker as JSON. Each message has a payload and a collection of properties that are part of the MQTT user properties section. The payload contains the messages from the OPC UA server, and the properties provide metadata.

### Payload

The payload of an OPC UA message is a JSON object that contains the messages from the OPC UA server. The following example shows the payload of a message from the sample thermostat asset used in the quickstarts. Use the following command to subscribe to messages in the `azure-iot-operations/data` topic:

```console
mosquitto_sub --host aio-broker --port 18883 --topic "azure-iot-operations/data/#" -v --debug --cafile /var/run/certs/ca.crt -D CONNECT authentication-method 'K8S-SAT' -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)
```

The output from the previous command looks like the following example:

```output
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:17.1858435Z","Value":4558},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:17.1858869Z","Value":4558}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:18.1838125Z","Value":4559},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:18.1838523Z","Value":4559}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:19.1834363Z","Value":4560},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:19.1834879Z","Value":4560}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:20.1861251Z","Value":4561},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:20.1861709Z","Value":4561}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:21.1856798Z","Value":4562},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:21.1857211Z","Value":4562}}
```

### Example write payload

Here's a minimal example for writing a simple float value to a node:

```json
{ 
   "SetPoint": 50
}
```

### User properties

The connector for OPC UA bases the headers in the published messages on the [CloudEvents specification for OPC UA](https://github.com/cloudevents/spec/blob/main/cloudevents/extensions/opcua.md). The connector transforms the headers from an OPC UA message into user properties in the message it publishes to the MQTT broker. The following example shows the user properties of a message from the sample thermostat asset used in the quickstarts. Use the following command to subscribe to messages in the `azure-iot-operations/data` topic:

```console
mosquitto_sub --host aio-broker --port 18883 --topic "azure-iot-operations/data/#" -V mqttv5 -F %P --cafile /var/run/certs/ca.crt -D CONNECT authentication-method 'K8S-SAT' -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)
```

The output from the previous command looks like the following example:

```output
uuid:0000aaaa-11bb-cccc-dd22-eeeeee333333 externalAssetId:0000aaaa-11bb-cccc-dd22-eeeeee333333 serverToConnectorMilliseconds:0.3153 id:1111bbbb-22cc-dddd-ee33-ffffff444444 specversion:1.0 type:ua-keyframe source:urn:OpcPlc:opcplc-000000 time:2024-08-05T14:19:08.8738457Z datacontenttype:application/json subject:0000aaaa-11bb-cccc-dd22-eeeeee333333 sequence:9768 traceparent:00-4eb4313536bc006c918e936686921cfc-4ee795f6fdd5fae7-01 recordedtime:2024-08-05 14:19:08.874 +00:00
uuid:0000aaaa-11bb-cccc-dd22-eeeeee333333 externalAssetId:0000aaaa-11bb-cccc-dd22-eeeeee333333 serverToConnectorMilliseconds:0.3561 id:1111bbbb-22cc-dddd-ee33-ffffff444444 specversion:1.0 type:ua-keyframe source:urn:OpcPlc:opcplc-000000 time:2024-08-05T14:19:09.8746396Z datacontenttype:application/json subject:0000aaaa-11bb-cccc-dd22-eeeeee333333 sequence:9769 traceparent:00-388697f77c2dcb5e9b30589c0a4cef6e-de9351186ff5833e-01 recordedtime:2024-08-05 14:19:09.875 +00:00
uuid:0000aaaa-11bb-cccc-dd22-eeeeee333333 externalAssetId:0000aaaa-11bb-cccc-dd22-eeeeee333333 serverToConnectorMilliseconds:0.3423 id:1111bbbb-22cc-dddd-ee33-ffffff444444 specversion:1.0 type:ua-keyframe source:urn:OpcPlc:opcplc-000000 time:2024-08-05T14:19:10.8754860Z datacontenttype:application/json subject:0000aaaa-11bb-cccc-dd22-eeeeee333333 sequence:9770 traceparent:00-7c65a93fa7668bbe0cdfd051168c88ac-ab86b83fb1b7944f-01 recordedtime:2024-08-05 14:19:10.875 +00:00
uuid:0000aaaa-11bb-cccc-dd22-eeeeee333333 externalAssetId:0000aaaa-11bb-cccc-dd22-eeeeee333333 serverToConnectorMilliseconds:0.3277 id:1111bbbb-22cc-dddd-ee33-ffffff444444 specversion:1.0 type:ua-keyframe source:urn:OpcPlc:opcplc-000000 time:2024-08-05T14:19:11.8765569Z datacontenttype:application/json subject:0000aaaa-11bb-cccc-dd22-eeeeee333333 sequence:9771 traceparent:00-5851e56a6f358ab5e1af1d798f7580a1-bf6dfbda8196cba0-01 recordedtime:2024-08-05 14:19:11.877 +00:00
```

The subject field contains the name of the asset that the message relates to. The sequence field contains the sequence number of the message.

> [!NOTE]
> For assets you create in the operations experience web UI, the subject property for any messages the asset sends is set to the `externalAssetId` value. In this case, the `subject` property contains a GUID rather than a friendly asset name.

## Dynamic node resolution with browse paths

Some OPC UA servers create node IDs dynamically, so the identifiers can change after a server restart or deployment. For these servers, the connector can use the OPC UA `TranslateBrowsePathToNodeId` service to resolve a target node from a stable starting node and a relative browse path at runtime.

To configure start instances and relative browse paths, see [Configure advanced OPC UA data collection](howto-configure-opc-ua-advanced-data-collection.md#resolve-dynamic-nodes-by-using-browse-paths).

## Control dataset publishing with a triggering item

Dataset triggering lets one data point control when the connector publishes the other sampled data points in the same dataset. Use dataset triggering when you want the dataset output cadence to follow a specific signal instead of publishing whenever any data point changes.

For each dataset, the `triggeringItem` setting identifies the data point that acts as the trigger. The value must exactly match the name of one data point in that dataset. Empty or whitespace values are treated as unset. When the trigger changes, the connector publishes the sampled values for the other data points together.

The `triggeringItemReportingMode` setting controls how the connector monitors the trigger data point:

| Mode | Behavior |
| --- | --- |
| `Sampling` | The trigger data point controls dataset publishing but doesn't report its own value. This mode is the default. |
| `Reporting` | The trigger data point controls dataset publishing and reports its own value. |
| `Disabled` | The trigger data point is disabled. |

Dataset triggering has the following requirements and fallback behavior:

- Triggering applies to a single dataset. Configure each dataset with its own triggering item.
- All data points in the dataset must fit in a single OPC UA subscription. If the dataset exceeds `subscription.maxItems`, the connector disables triggering, returns the data points to normal reporting, and publishes an asset status error.
- The asset must reference a namespaced device endpoint. For a classic asset that doesn't use a namespace, the connector ignores the triggering settings.
- If `triggeringItem` doesn't match exactly one data point name, the connector disables triggering for the dataset and publishes an asset status error.
- If the connector can't link the trigger to the target data points at runtime, it leaves the target data points in reporting mode to avoid silent data loss.

To configure a triggering item for a dataset, see [Configure the connector for OPC UA](howto-configure-opc-ua.md#configure-dataset-triggering).

## Key frames for OPC UA data points

Normally, the connector includes only changed data-point values in a message. A key frame includes every data-point value in the dataset, which helps consumers recover the current state after missed messages, restarts, or reconnections. More frequent key frames improve recovery time but increase message size and bandwidth use.

To choose and configure a key-frame interval, see [Configure advanced OPC UA data collection](howto-configure-opc-ua-advanced-data-collection.md#configure-key-frames-for-state-recovery).

## How does it relate to Azure IoT Operations?

The connector for OPC UA is part of Azure IoT Operations. You deploy the connector to an Arc-enabled Kubernetes cluster on the edge as part of an Azure IoT Operations deployment. The connector interacts with other Azure IoT Operations elements, such as:

- [Assets and devices](./concept-assets-devices.md)
- [The MQTT broker](../connect-to-cloud/overview-dataflow.md)
- [Azure Device Registry](./overview-manage-assets.md#azure-device-registry)

## Next step

> [!div class="nextstepaction"]
> [How to use the connector for OPC UA](./howto-configure-opc-ua.md)
