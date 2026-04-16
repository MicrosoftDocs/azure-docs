---
title: Connect and control industrial assets using the connector for OPC UA
description: Use the connector for OPC UA to connect to OPC UA servers and exchange messages and data with the MQTT broker in a Kubernetes cluster.
author: dominicbetts
ms.author: dobett
ms.subservice: azure-opcua-connector
ms.topic: overview
ms.date: 11/04/2025

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand what the connector for OPC UA is and how it works with OPC UA industrial assets to enable me to add them as resources to my Kubernetes cluster. I want to understand how to read data from OPC UA servers and write data to implement process control.

---

# What is the connector for OPC UA?

OPC UA (OPC Unified Architecture) is a standard developed by the [OPC Foundation](https://opcfoundation.org/) to enable the exchange of data between industrial components at the edge and with the cloud. The connector for OPC UA can route messages from OPC UA servers to the MQTT broker and send control messages to OPC UA servers. OPC UA provides a consistent, secure, documented standard based on widely used data formats. Industrial components can implement the OPC UA standard to enable universal data exchange.

By using the *OPC UA write capability*, industrial developers and operations engineers can use the connector for OPC UA to perform real-time control at the edge by writing values directly to OPC UA nodes. This capability enables immediate updates to configurations, triggers for automation, and dynamic process adjustments without relying on round-trips to the cloud.

The write capability is useful in scenarios where latency, autonomy, or local decision making is critical such as in manufacturing lines, predictive maintenance, or in AI-driven control loops.

The connector for OPC UA is an optional part of Azure IoT Operations. The connector for OPC UA connects to OPC UA servers to retrieve data that it publishes to topics in the MQTT broker and write data based in values from an MQTT broker topic subscription. The connector for OPC UA enables your industrial OPC UA environment to ingress data into your local workloads running on a Kubernetes cluster, and into your cloud workloads.

> [!TIP]
> If you didn't include the connector for OPC UA when you deployed Azure IoT Operations, you can add it to your existing instance from the Azure portal. For instructions, see [Manage components using the Azure portal](../deploy-iot-ops/howto-manage-update-uninstall.md#manage-instance-components).

The connector for OPC UA is a client application that runs as a middleware service in Azure IoT Operations. The connector for OPC UA connects to OPC UA servers, lets you browse the server address space, monitor data changes and events in connected assets, and write data to nodes in the server address space. Operations teams and developers use the connector for OPC UA to streamline the task of connecting OPC UA assets to their industrial solution at the edge.

## Capabilities

As part of Azure IoT Operations, the connector for OPC UA is a native Kubernetes application that:

- Connects existing OPC UA servers and assets to a native Kubernetes cluster at the edge.
- Publishes JSON-encoded messages from OPC UA servers in OPC UA PubSub format, using a JSON payload. By using this standard format for data exchange, you can reduce the risk of future compatibility issues.
- Can synchronize OPC UA node properties to the [distributed state store](../develop-edge-apps/overview-edge-apps.md#state-store).
- Writes values directly to nodes in a connected OPC UA server based on MQTT subscriptions.
- Connects to Azure Arc-enabled services in the cloud.

### Other features

The connector for OPC UA supports the following features as part of Azure IoT Operations:

| Feature | Supported | Notes |
|---------|:---------:|-------|
| Username/password authentication | Yes | |
| X.509 client certificates | Yes | |
| Anonymous access | Yes | For testing purposes |
| Certificate trust list | Yes | For secure, encrypted OPC UA connections |
| OpenTelemetry integration | Yes | |
| Automatic reconnection | Yes | Reconnects to OPC UA servers after failures |
| Multiple server connections | Yes | Configured using Kubernetes `device` CRs |
| OPC UA PubSub format | Yes | JSON-encoded data value changes |
| CloudEvents headers | Yes | Message headers as MQTT user properties |
| OPC UA events | Yes | Predefined event fields |
| Payload compression | Yes | Supports `gzip` and `brotli` |
| [Dynamic node resolution](#resolve-nodes-dynamically-by-using-browse-paths) | Yes | Using `TranslateBrowsePathToNodeId` service |
| State store synchronization | Yes | Sync OPC UA node properties to distributed state store |
| [Shared endpoint mode](#shared-endpoint-mode) | Yes | Multiple assets share a single OPC UA session |
| [Key frame generation](#understand-key-frames-for-opc-ua-data-points) | Yes | Enables downstream services to recover state more quickly |

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

1. Subscribes to an MQTT topic that contains write requests for the asset. The topic name is in the format `{Namespace}/asset-operations/{AssetId}/builtin/{DatasetName}/`, where `{Namespace}` is the namespace for Azure IoT Operations instance, `{AssetId}` is the unique identifier for the asset, and `{DatasetName}` is the name of the dataset that contains the nodes to write to.

1. Creates a temporary session with the OPC UA server using the device configuration.

1. Checks the payload to ensure all data points exist in the target dataset.

1. Writes the values to the OPC UA server, and publishes a success or failure response to the MQTT broker. The changed value is published to the standard message topic associated with the dataset.

To generate a write request, publish a JSON message to the MQTT topic using MQTT v5 request/response semantics. Specify the dataset name and the values to be written in the payload. Each MQTT message includes metadata that defines system-level and user-defined properties such as `SourceId`, `ProtocolVersion`, and `CorrelationData` to ensure traceability and conformance.

To synchronize OPC UA node properties to the distributed state store, the connector for OPC UA:

1. Follows the `HasProperty` reference of all variable nodes that are referenced as data points within any dataset of all assets using the same OPC UA inbound endpoint.
1. Adds the properties to the distributed state store under the ID: `{AioNamespace}.{AssetName}.{DatasetName}.{DataPointName}.{PropertyName}`.
1. Automatically subscribes the `ModelChange` event of the OPC UA server and repopulates all properties after a `ModelChange` event occurs.

To configure this behavior, select **Sync properties into state store** when you configure an inbound OPC UA endpoint in the operations experience web UI:

:::image type="content" source="media/overview-opc-ua-connector/sync-properties.png" alt-text="Screenshot that shows the location of the sync properties to state store option." lightbox="media/overview-opc-ua-connector/sync-properties.png":::

You can also force a synchronization of all properties by making an MQTT RPC call to the `azure-iot-operation/asset-operations/{AssetName}/builtin/syncProperties` topic. A payload `{}` forces a synchronization without observing `ModelChange` events. A payload `{"observeModelChanges": true}` forces a synchronization that observes `ModelChange` events.

## Shared endpoint mode

By default, each asset that connects to an OPC UA server opens its own independent OPC UA session. This default behavior is called *dedicated* mode.

When you set the `shared` flag to `true` on a device's inbound endpoint, the connector establishes a single OPC UA session for the endpoint and reuses it across all assets that reference that endpoint. This behavior is called *shared* mode.

```
Dedicated mode (default)           Shared mode
─────────────────────────          ─────────────────────────
Asset A  →  Session A              Asset A ─┐
Asset B  →  Session B              Asset B ──┼─→  Session (shared)
Asset C  →  Session C              Asset C ─┘
(3 sessions to the server)         (1 session to the server)
```

### When to use shared mode

Use shared mode when:

- The OPC UA server enforces a low session limit, for example a PLC that allows only a few simultaneous connections.
- You have many assets pointing to the same server and want to minimize the connection footprint.
- You want to reduce resource consumption (memory, TCP connections, licensing) on the OPC UA server.

The `shared` flag is independent of the authentication method. The single shared session uses whichever authentication method you configure on the endpoint. Telemetry payload, topic structure, and message schema are identical regardless of session mode.

You can mix shared and dedicated assets on the same device. Create separate endpoints, for example `my-opcua-endpoint-shared` and `my-opcua-endpoint-dedicated`, each with its own `shared` flag. Assets reference a specific endpoint by name through `deviceRef.endpointName`.

### Constraints and trade-offs

| Aspect | Dedicated mode | Shared mode |
|---|---|---|
| Sessions to server | One per asset | One per endpoint |
| Server session limit impact | High | Low |
| Isolation between assets | Full (each asset has its own session) | None (all assets share the same session) |
| Session disconnect impact | Only the affected asset reconnects | All assets on the endpoint are affected |
| Certificate update | Each asset reconnects independently | The single shared session is recreated; all assets on the endpoint are briefly interrupted |

> [!IMPORTANT]
> When the shared OPC UA session disconnects because of a network failure, server restart, or certificate rotation, all assets that reference the endpoint temporarily lose telemetry until the session is reestablished.

### Shared endpoint lifecycle

1. When you create or update a device resource, the connector reads the `shared` flag.
1. If `shared` is `true`, the connector opens one OPC UA session before any asset connects. The endpoint transitions to the `Shared` state.
1. When an asset connects, its `ConnectedAsset` record links to the existing session—no second session opens.
1. When you remove an asset, the OPC UA session stays open for other assets. Only the removed asset's subscriptions are torn down.
1. When you delete or update the device, the shared session disconnects and all linked assets are requeued.

If you change `shared` from `true` to `false` on a running device, the connector disconnects the shared session and requeues all affected assets. Each asset then establishes its own dedicated session. Expect a brief interruption in telemetry.

### Health states for shared endpoints

- The **InboundEndpoint** health state reports `Available` or `Unavailable` for the single shared session.
- Each **Asset** health state also reports `Available` or `Unavailable`. Because all assets share the same session, a session drop marks all linked assets as `Unavailable` simultaneously.

### Certificate rotation for shared endpoints

When the connector's application certificate is renewed, it recreates the secure channel of the shared session once. All assets on the endpoint are briefly interrupted, then automatically recover without requiring individual reconnects.

To learn how to configure a shared endpoint, see [Configure a shared endpoint](howto-configure-opc-ua.md#configure-a-shared-endpoint).

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

## Resolve nodes dynamically by using browse paths

When you configure OPC UA data points or events in an asset, you typically add an OPC UA server node ID in the **Data source** field. This approach assumes that node IDs are stable across server restarts and deployments. However, some OPC UA servers create node IDs dynamically at runtime or on demand. You can't persist these dynamic node IDs in an asset configuration because they might change over time.

To address this scenario, the connector can resolve dynamic nodes at runtime by using the OPC UA `TranslateBrowsePathToNodeId` service. This service resolves a target node ID from a starting object and a relative browse path. When you configure a **Start instance** value in a dataset or event configuration, each data point or event requires a valid relative browse path in its **Data source** property. The connector translates the relative browse path to a concrete node ID at runtime.

> [!NOTE]
> If you don't provide a **Start instance** value, the connector uses the **Data source** property as a fixed node ID.

Example **Start instance** values:

* `i=2555`
* `nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt1`
* `nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=5`
* `ns=10;s=System.Pump1`
* `ns=1;b=M/RbKBsRVkePCePcx24oRA==`

Example relative browse paths to use in the **Data source** field:

* `/1:SYSTEM/1:PUMP/1:P1`
* `/2:Block&.Output`
* `/3:Truck.0:NodeVersion`
* `<!HasChild>Truck`
* `<1:ConnectedTo>1:Boiler/`

For more information about the relative browse path syntax, see [OPC Foundation Part 4 A.2](https://reference.opcfoundation.org/Core/Part4/v105/docs/A.2).

The relative browse paths must use numeric OPC UA namespace indexes. There's currently no support for namespace names in string format.

> [!IMPORTANT]
> Namespace indexes can change within the server. If namespace indexes change, you must reconfigure them in the asset definition.

## Understand key frames for OPC UA data points

Use the *key frame count* setting to control how often the connector for OPC UA sends a key frame. By default, when the connector sends a message, it only includes data points whose value changed since the last message. A key frame is a message that contains values for all the data points in the dataset, regardless of whether they changed since the last message.

If a consumer misses messages (due to restarts, reconnects, or network problems), it can't reliably reconstruct the current state until it receives a key frame with all the data point values. Key frames enable consumers to recover state faster, but they make message sizes larger.

For more information about key frames, see [OPC UA Part 14 – PubSub](https://reference.opcfoundation.org/Core/Part14/v105/docs/).

### Key frame count behavior

| Value | Behavior |
|-------|----------|
| `-1` | Default (not set) |
| `0` | Disable key frames |
| `1` | Every frame is a key frame |
| `>1` | Emit a key frame every *n* frames |

The key frame interval is approximately: `KeyFrameCount * PublishingIntervalMs`

For example:

| KeyFrameCount | PublishingIntervalMs | Result |
|---------------|----------------------|--------|
| `-1` | 1000 | Connector default behavior |
| `0` | 1000 | No key frames |
| `1` | 1000 | Key frame every one second |
| `10` | 500 | Key frame every five seconds |

For the key frame count setting, choose:

- Larger values (30–60): Lower bandwidth, slower recovery
- Smaller values (5–10): Faster recovery for frequently reconnecting consumers
- Zero: Only if consumers don't require snapshots

To learn more about configuring key frames, see [Add a dataset to an asset](howto-configure-opc-ua.md#add-a-dataset-to-an-asset).

> [!NOTE]
> Changing the publishing interval affects the effective key frame interval. Configuration updates can require reconciliation or a pod restart.

## How does it relate to Azure IoT Operations?

The connector for ONVIF is part of Azure IoT Operations. You deploy the connector to an Arc-enabled Kubernetes cluster on the edge as part of an Azure IoT Operations deployment. The connector interacts with other Azure IoT Operations elements, such as:

- [Assets and devices](./concept-assets-devices.md)
- [The MQTT broker](../connect-to-cloud/overview-dataflow.md)
- [Azure Device Registry](./overview-manage-assets.md#azure-device-registry)

## Next step

> [!div class="nextstepaction"]
> [How to use the connector for OPC UA](./howto-configure-opc-ua.md)
