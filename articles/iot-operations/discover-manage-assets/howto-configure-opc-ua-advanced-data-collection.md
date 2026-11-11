---
title: Configure advanced OPC UA data collection
description: Configure cyclic reads, data-change and data-quality filters, dynamic node resolution, key frames, event filters, message metadata, and delivery acknowledgment for the connector for OPC UA.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-opcua-connector
ms.topic: how-to
ms.date: 10/29/2026
ai-usage: ai-assisted

#CustomerIntent: As an OT user, I want to configure how the connector for OPC UA resolves nodes and publishes data so that downstream applications receive the data they need.
---

# Configure advanced OPC UA data collection

The connector for OPC UA can filter data changes and data quality, resolve nodes that have dynamic identifiers, periodically publish complete dataset snapshots, and select the fields to include in event notifications. Use these features when the default asset configuration doesn't meet the needs of your OPC UA server or downstream applications.

This article shows you how to:

- Read a dataset on a fixed cycle without creating monitored items.
- Filter data changes by status, value, timestamp, or deadband, a threshold that suppresses notifications for value changes that don't exceed it.
- Publish only data samples that have an exact `Good` OPC UA status.
- Resolve dynamic OPC UA nodes by using a start instance and relative browse paths.
- Configure key frames to help consumers recover the current state of a dataset.
- Select and rename fields in OPC UA event notifications.
- Enable optional OPC UA PubSub conformance information and message diagnostics in MQTT user properties.
- Write a delivery acknowledgment counter to the OPC UA server after dataset or event delivery.

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../includes/prereq-deployed-instance.md)]

[!INCLUDE [prereq-azure-cli](../includes/prereq-azure-cli.md)]

- Your Azure IoT Operations instance has the connector for OPC UA enabled.
- You have a device inbound endpoint and an asset configured for your OPC UA server. To create these resources, see [Configure the connector for OPC UA](howto-configure-opc-ua.md).
- To use data-change or data-quality filtering, you have Azure IoT Operations 2610 or later and a namespaced asset that references a namespaced device endpoint. The connector ignores filter settings on classic assets.
- To configure browse paths, you know the starting node and relative browse path for each target node on your OPC UA server.

## Choose an advanced data-collection feature

Each feature changes a different part of data collection or message delivery:

| Requirement | Feature | Configuration location | Consideration |
| --- | --- | --- | --- |
| Read complete datasets at a fixed interval | Cyclic reads | Bicep: asset-level dataset defaults or dataset | Each successful read cycle publishes a full snapshot, even when no values change. |
| Reduce notifications for insignificant data changes | Data-change filter | Bicep: asset-level dataset defaults, dataset, or data point | The OPC UA server must support the requested filter and engineering-unit range for a percent deadband. |
| Exclude samples that don't have an exact `Good` status | Data-quality filter | Bicep: asset-level dataset defaults or dataset | The connector doesn't publish Bad, Uncertain, and nonzero Good status codes. |
| Resolve nodes whose identifiers can change | Relative browse paths | **Start instance** on a dataset or event, and **Data source** on each data point or event | Numeric namespace indexes in browse paths can change on the server. |
| Help consumers recover a complete dataset state | Key frames | **Key frame count** on each dataset | More frequent key frames improve recovery time but increase message size and bandwidth use. |
| Control the fields in event notifications | Event filters | **Event filter** on each event | A filter replaces the server's default field selection for the event. |
| Include OPC UA metadata or message diagnostics | Message metadata configuration | Stringified dataset or event-group configuration, or the corresponding asset defaults | Azure IoT Operations 2610 or later; both options are disabled by default. |
| Signal delivery of critical data back to the OPC UA server | Delivery acknowledgment | `deliveryAcknowledgementDatasource` in stringified dataset or event-group configuration | Azure IoT Operations 2610 or later; use a dedicated readable and writable `Int32` or `UInt32` node and MQTT QoS 1 for broker acknowledgment. |

Use these features independently or together on the same asset.

## Configure cyclic reads

Starting with Azure IoT Operations 2610, use cyclic reads when the server doesn't support subscriptions or consumers need complete snapshots at a fixed cadence. Also use cyclic reads when consumers need data at intervals shorter than the server's minimum subscription publishing interval.

In Bicep, set the following properties in an existing dataset's stringified `datasetConfiguration`. Keep its data points and destinations unchanged:

```bicep
datasetConfiguration: string({
  datasetMode: 'Cyclic'
  publishingInterval: 1000
})
```

This configuration reads every data point in the dataset once per second. `publishingInterval` sets the cycle interval in milliseconds and must be greater than zero. Set `datasetMode` to `OnChange`, the default, to use subscriptions.

You can also set these properties in `defaultDatasetsConfiguration`. A dataset-level setting overrides the asset default.

Each successful cycle publishes a full snapshot, even when no value changes. If a `Read` fails, the connector skips publication and retries next cycle. Individual values with `Bad` or `Uncertain` status are included unless the [data-quality filter](#filter-data-by-opc-ua-quality) rejects them.

Cyclic reads don't use sampling intervals, queue sizes, data-change filters, triggering settings, subscription settings, or `keyFrameCount`. Event groups continue using subscriptions.

Values aren't sampled simultaneously, so use each value's source timestamp. With `opcUaConformance` enabled, snapshots carry the `ua-keyframe` message type.

To monitor cycles, use `aio.opc.asset.telemetry.data.cyclicread.count` in the [metrics reference](../reference/observability-metrics-opcua-broker.md).

## Resolve dynamic nodes by using browse paths

Typically, the **Data source** field for an OPC UA data point or event contains a fixed node ID. This approach works when the node ID remains stable across server restarts and deployments. Some OPC UA servers create node IDs at runtime or on demand, so the IDs can change, and you can't persist them reliably in an asset configuration.

For dynamic nodes, configure a starting node and a relative browse path. At runtime, the connector calls the OPC UA `TranslateBrowsePathToNodeId` service to resolve the browse path from the starting node to a concrete node ID.

The configuration has two parts:

- **Start instance** identifies the starting node. Configure it in the [dataset workflow](howto-configure-opc-ua.md#add-an-asset-dataset-and-data-points) for data points or in the [event workflow](howto-configure-opc-ua.md#add-events-and-event-groups) for event notifications.
- **Data source** contains the relative browse path from the start instance to the target node. Configure it on each data point or event that uses dynamic resolution.

If you don't configure **Start instance**, the connector treats each **Data source** value as a fixed node ID.

### Configure a start instance and browse paths

1. Choose a stable OPC UA node to use as the start instance.

   The start instance can use any valid OPC UA node ID format. For example:

   - `i=2555`
   - `nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt1`
   - `nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=5`
   - `ns=10;s=System.Pump1`
   - `ns=1;b=M/RbKBsRVkePCePcx24oRA==`

1. In the operations experience, open the asset that contains the dynamic nodes.

1. Configure the start instance:

   - For data points, edit the dataset and enter the node ID in **Start instance**.
   - For an event, edit the event and enter the node ID in **Start instance**.

1. For each data point or event that you want the connector to resolve dynamically, enter its relative browse path in **Data source**. For example:

   - `/1:SYSTEM/1:PUMP/1:P1`
   - `/2:Block&.Output`
   - `/3:Truck.0:NodeVersion`
   - `<!HasChild>Truck`
   - `<1:ConnectedTo>1:Boiler/`

1. Save the asset configuration.

For the relative browse path syntax, see [OPC UA Part 4, section A.2](https://reference.opcfoundation.org/Core/Part4/v105/docs/A.2).

> [!IMPORTANT]
> Relative browse paths must use numeric OPC UA namespace indexes. Namespace names in string format aren't supported. Namespace indexes can change on the server. If they change, update the browse paths in the asset configuration.

Browse paths also work with dataset read/write operations and management actions. For examples, see [Address nodes by using browse paths](howto-control-opc-ua.md#address-nodes-by-using-browse-paths).

## Configure key frames for state recovery

By default, a message includes only data points whose values changed since the previous message. A key frame includes the values of all data points in the dataset, whether or not the values changed.

If a consumer misses messages because of a restart, reconnection, or network problem, it can't reliably reconstruct the current dataset state until it receives all the data point values. Periodic key frames reduce this recovery time, but larger and more frequent messages increase bandwidth use.

Configure **Key frame count** when you [add or edit a dataset](howto-configure-opc-ua.md#add-an-asset-dataset-and-data-points). The value controls the number of publishing cycles between key frames:

| Value            | Behavior                                           |
| ---------------- | -------------------------------------------------- |
| `-1`             | Use the connector default behavior.                |
| `0`              | Disable scheduled key frames.                      |
| `1`              | Make every frame a key frame.                      |
| Greater than `1` | Emit a key frame every specified number of frames. |

The approximate interval between key frames is:

`Key frame interval = Key frame count * Publishing interval`

For example:

| Key frame count | Publishing interval | Approximate result             |
| --------------- | ------------------- | ------------------------------ |
| `0`             | 1,000 ms            | No scheduled key frames        |
| `1`             | 1,000 ms            | A key frame every second       |
| `10`            | 500 ms              | A key frame every five seconds |
| `10`            | 5,000 ms            | A key frame every 50 seconds   |

Choose a value based on the recovery requirements of your consumers:

- Use a smaller value, such as `5` to `10`, when consumers must recover quickly after reconnecting.
- Use a larger value, such as `30` to `60`, when lower bandwidth use is more important than recovery time.
- Use `0` only when consumers don't require periodic complete snapshots.

### Operations experience

When you add or edit a dataset in the operations experience, enter the value in **Key frame count** on the **Create dataset** or **Edit dataset** page.

### Azure CLI

Use the `--key-frame-count` parameter when you add or replace an OPC UA dataset. For example, the following command sets the key frame count to `5`:

```azurecli
az iot ops ns asset opcua dataset add \
  --asset thermostat \
  --instance {your instance name} \
  --resource-group {your resource group name} \
  --name telemetry \
  --key-frame-count 5 \
  --replace
```

### Bicep

In Bicep, set `keyFrameCount` in the dataset's stringified `datasetConfiguration` property:

```bicep
datasets: [
  {
    name: 'telemetry'
    datasetConfiguration: string({
      keyFrameCount: 5
    })
  }
]
```

Changing the dataset publishing interval also changes the effective key-frame interval. A configuration update can require resource reconciliation or a connector pod restart.

For more information about the message behavior, see [OPC UA Part 14, PubSub](https://reference.opcfoundation.org/Core/Part14/v105/docs/).

### Request a key frame on demand

Starting with Azure IoT Operations 2610, request an extra key frame by sending an MQTT remote procedure call (mRPC) to:

```text
{AioNamespace}/asset-operations/{AssetName}/builtin/{DatasetName}-keyframe
```

Use the same namespace and topic encoding as other [OPC UA control requests](howto-control-opc-ua.md#how-to-write-data-to-an-opc-ua-server). Include the required [RPC message metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

The request and successful response payloads are both an empty JSON object:

```json
{}
```

The connector publishes its cached values without reading the OPC UA server again. Points with no reported value carry `BadWaitingForInitialData`. A successful response doesn't confirm MQTT delivery.

The request doesn't change scheduled key frames or a cyclic dataset's polling schedule. For a cyclic dataset, the snapshot can contain values from different cycles.

Key-frame errors use the SDK-specific MQTT user property `AppErrCode`. The value is `DatasetNotServed` if the dataset is no longer served, or `KeyFrameNotEmitted` if snapshot generation fails.

The management group name `builtin` is reserved for implicit operations. Don't create a management group with that name. Dataset names must not end with `-keyframe`, because that suffix identifies the trigger topic.

## Filter data changes

A data-change filter controls which changes the OPC UA server reports for a monitored data point. Use this filter to reduce notifications for changes that downstream applications don't need. Because the server evaluates the filter, only accepted notifications reach the connector for publication.

This feature requires Azure IoT Operations 2610 or later and a namespaced asset that references a namespaced device endpoint. Classic assets ignore filter settings.

The `dataChangeFilter` object has these properties:

| Property | Value | Behavior |
| --- | --- | --- |
| `trigger` | `StatusValue` | Report a change to the status or value. This value is the default. |
| `trigger` | `Status` | Report only a status change. |
| `trigger` | `StatusValueTimestamp` | Report a change to the status, value, or source timestamp. |
| `deadbandType` | `None` | Don't apply a deadband. This value is the default, and the filter ignores `deadbandValue`. |
| `deadbandType` | `Absolute` | Report a value change when its magnitude exceeds the nonnegative `deadbandValue` in the node's engineering units. |
| `deadbandType` | `Percent` | Report a value change when it exceeds `deadbandValue`, from `0` through `100`, as a percentage of the node's engineering-unit range. |

Set the whole `dataChangeFilter` object at any of these levels:

- `defaultDatasetsConfiguration` for asset-level dataset defaults.
- `datasetConfiguration` for a dataset.
- `dataPointConfiguration` for an individual data point.

The most specific configured object replaces the whole inherited object. Properties from filters at different levels don't merge.

### Configure a data-change filter

In Bicep, add the filter to the stringified connector configuration at the level that matches the required scope. The following example sets an absolute deadband for a dataset and replaces it with a status-only filter for one data point:

```bicep
datasets: [
  {
    name: 'telemetry'
    datasetConfiguration: string({
      dataChangeFilter: {
        trigger: 'StatusValue'
        deadbandType: 'Absolute'
        deadbandValue: 0.5
      }
    })
    dataPoints: [
      {
        name: 'temperature'
        dataSource: 'ns=3;s=Temperature'
        dataPointConfiguration: '{}'
      }
      {
        name: 'pumpStatus'
        dataSource: 'ns=3;s=PumpStatus'
        dataPointConfiguration: string({
          dataChangeFilter: {
            trigger: 'Status'
            deadbandType: 'None'
          }
        })
      }
    ]
  }
]
```

To apply the filter to every dataset that doesn't override it, put the same object in `defaultDatasetsConfiguration`:

```bicep
defaultDatasetsConfiguration: string({
  dataChangeFilter: {
    trigger: 'StatusValue'
    deadbandType: 'Percent'
    deadbandValue: 2
  }
})
```

Changing or removing the filter updates the monitored item without resubscribing. A value within the configured deadband doesn't produce a notification, but other advanced settings continue to apply independently. The feature contract doesn't define whether a key frame bypasses a server-side deadband, so don't rely on key frames to recover values that this filter suppresses.

> [!IMPORTANT]
> A percent deadband requires the OPC UA node to expose a valid engineering-unit range. If the server rejects the filter, the connector can't create that data point and reports an asset error.

An invalid deadband range disables the filter at that scope and produces an asset status error. An unrecognized `trigger` or `deadbandType` makes that filter object unreadable, causes the connector to use an inherited filter if one exists, and produces an asset status error.

## Filter data by OPC UA quality

Enable data-quality filtering when downstream consumers should receive only samples whose status code is exactly OPC UA `Good`.

This feature requires Azure IoT Operations 2610 or later and a namespaced asset that references a namespaced device endpoint. The connector ignores filter settings on classic assets.

Set the Boolean `dataQualityFilterEnabled` property at either of these levels:

- `defaultDatasetsConfiguration` to set the asset-level default for datasets.
- `datasetConfiguration` to override the default for one dataset.

The default is `false`, which publishes samples regardless of their status. When the value is `true`, the connector filters samples with `Bad` or `Uncertain` status, nonzero Good status codes such as `GoodLocalOverride`, or no exact `Good` status. Filtering one sample doesn't prevent the connector from publishing accepted samples for other data points in the dataset.

### Configure a data-quality filter

In Bicep, add the filter to the stringified connector configuration. For example, enable the filter by default and disable it for a dataset that must publish every status:

```bicep
defaultDatasetsConfiguration: string({
  dataQualityFilterEnabled: true
})

datasets: [
  {
    name: 'telemetry'
    datasetConfiguration: '{}'
  }
  {
    name: 'diagnostics'
    datasetConfiguration: string({
      dataQualityFilterEnabled: false
    })
  }
]
```

Filtered samples don't update the connector's value cache. Therefore, a [key frame](#configure-key-frames-for-state-recovery) repeats the last value that had an exact `Good` status. If no such value arrives, the key frame contains `BadWaitingForInitialData` for that data point.

### Verify and troubleshoot filtering

After you deploy a filter, observe the dataset's MQTT destination and the asset status:

| Result | What to check |
| --- | --- |
| Expected data changes don't appear | For a data-change filter, verify the trigger and deadband and confirm that the server supports the filter. For a percent deadband, verify the node's engineering-unit range. |
| A data point fails to start | Check the asset status for a filter rejection from the OPC UA server or an invalid filter value. |
| A key frame contains an older value | With data-quality filtering enabled, verify whether newer samples have an exact `Good` status. Filtered samples don't update the cache. |
| A key frame contains `BadWaitingForInitialData` | No sample with an exact `Good` status reaches the cache. Check the source node's status on the OPC UA server. |
| Other data points continue to publish | Expect this behavior. Data-quality filtering applies independently to each sample. |

For data-quality filtering, the asset telemetry value-change metric also counts filtered samples, with the `aio.opc.value-change.status` dimension set to `filtered`. A filtered sample indicates that the connector receives data and applies the configured rule; it doesn't by itself indicate a server or connector failure.

## Select and rename event fields

By default, an OPC UA server sends a selection of standard fields in each event notification. The server determines the exact selection for each event type. For example:

```json
{
  "EventId": "OkaXYhfr20yUoj1QBbzcIg==",
  "EventType": "i=2130",
  "SourceNode": "i=2253",
  "SourceName": "WestTank",
  "Time": "2025-10-10T15:09:13.3946878Z",
  "ReceiveTime": "2025-10-10T15:09:13.3946881Z",
  "Message": "Raising Events",
  "Severity": 500
}
```

Use an event filter to include extra fields, exclude fields, or rename fields in the event notification. Each select clause has these properties:

| Property | Required | Description |
| --- | --- | --- |
| Browse path | Yes | Identifies the source field to include in the event notification. |
| Type definition ID | No | Specifies the OPC UA type definition of the source field. |
| Field ID | No | Specifies the output field name. If you omit this value, the connector uses the original field name. |

The following filter selects four fields and renames `EventId` and `SourceName`:

| Browse path | Type definition ID | Field ID |
| --- | --- | --- |
| `EventId` | `ns=0;i=2041` | `myEventId` |
| `EventType` | `ns=0;i=2041` | `EventType` |
| `SourceName` | Not set | `mySourceName` |
| `Severity` | Not set | `Severity` |

### Configure an event filter

#### Operations experience

1. In the operations experience, open the asset and edit the event that you want to filter.

1. In **Event filter**, add a row for each field to include in the event notification.

1. Configure the browse path, type definition ID, and field ID for each row.

   :::image type="content" source="media/howto-configure-opc-ua/event-filter.png" alt-text="Screenshot that shows an event filter for an OPC UA asset." lightbox="media/howto-configure-opc-ua/event-filter.png":::

1. Save the asset configuration.

#### Azure CLI

Use `az iot ops ns asset opcua event add` with `--replace true` to update an existing event. Add one `--filter-clause` parameter for each field to include:

```azurecli
az iot ops ns asset opcua event add \
  --asset thermostat \
  --instance {your instance name} \
  --resource-group {your resource group name} \
  --event-group alerts \
  --name serverObjectNotifier \
  --data-source "ns=0;i=2253" \
  --replace true \
  --filter-type "ns=0;i=2041" \
  --filter-clause path="EventId" type="ns=0;i=2041" field="myEventId" \
  --filter-clause path="EventType" type="ns=0;i=2041" field="EventType" \
  --filter-clause path="SourceName" field="mySourceName" \
  --filter-clause path="Severity" field="Severity"
```

#### Bicep

In Bicep, add an `eventFilter` object to the stringified JSON in the event's `eventConfiguration` property:

```bicep
eventGroups: [
  {
    name: 'alerts'
    eventGroupConfiguration: '{"publishingInterval":1000,"queueSize":10}'
    events: [
      {
        name: 'serverObjectNotifier'
        dataSource: 'ns=0;i=2253'
        eventConfiguration: '{"eventFilter":{"selectClauses":[{"browsePath":"EventId","typeDefinitionId":"ns=0;i=2041","fieldId":"myEventId"},{"browsePath":"EventType","typeDefinitionId":"ns=0;i=2041","fieldId":"EventType"},{"browsePath":"SourceName","typeDefinitionId":"","fieldId":"mySourceName"},{"browsePath":"Severity","typeDefinitionId":"","fieldId":"Severity"}]}}'
        destinations: [
          {
            target: 'Mqtt'
            configuration: {
              topic: 'azure-iot-operations/events/test-thermostat-bicep'
              qos: 'Qos1'
              retain: 'Never'
              ttl: 3600
            }
          }
        ]
      }
    ]
  }
]
```

The connector forwards only the selected fields. The example filter produces the following message:

```json
{
  "myEventId": "OkaXYhfr20yUoj1QBbzcIg==",
  "EventType": "i=2130",
  "mySourceName": "WestTank",
  "Severity": 500
}
```

To create an event before you add a filter, see [Add events and event groups](howto-configure-opc-ua.md#add-events-and-event-groups).

## Configure message metadata

Starting with Azure IoT Operations 2610, you can independently enable OPC UA PubSub conformance information and message diagnostics for each dataset or event group. Both options are Boolean values and default to `false`.

> [!IMPORTANT]
> This default is a breaking change in Azure IoT Operations 2610. Earlier versions emitted this MQTT metadata without requiring opt-in. To restore the previous metadata and diagnostic behavior, set both `opcUaConformance` and `messageDiagnostics` to `true` for the required datasets and event groups, or in the corresponding asset defaults. The redundant `uuid` user property is no longer emitted; update consumers to use `aioassetref` instead.

| Option | When `true` | Default |
| --- | --- | --- |
| `opcUaConformance` | Publish OPC UA PubSub metadata messages and add OPC UA message type and metadata version user properties. | `false` |
| `messageDiagnostics` | Add recorded time, distributed tracing, and server-to-connector latency user properties to telemetry and event messages. | `false` |

Configure the options in the stringified JSON at these locations:

| Scope | Configuration property | Asset-level default |
| --- | --- | --- |
| Dataset | `datasetConfiguration` | `defaultDatasetsConfiguration` |
| Event group | `eventGroupConfiguration` | `defaultEventsConfiguration` |

Each option on a dataset or event group overrides the corresponding asset default. If an option is omitted at that level, it inherits the asset default. If it's omitted at both levels, it's disabled. The two options are independent: for example, you can enable diagnostics without enabling OPC UA conformance.

### Enable metadata for a dataset or event group

The following YAML fragment shows the options in an asset's `spec`. Merge these settings into your existing asset configuration, preserving its data points, events, and destinations:

```yaml
spec:
  defaultDatasetsConfiguration: |-
    {
      "opcUaConformance": false,
      "messageDiagnostics": false
    }
  datasets:
    - name: processTelemetry
      datasetConfiguration: |-
        {
          "publishingInterval": 1000,
          "opcUaConformance": true,
          "messageDiagnostics": true
        }
  defaultEventsConfiguration: |-
    {
      "opcUaConformance": false,
      "messageDiagnostics": false
    }
  eventGroups:
    - name: alerts
      eventGroupConfiguration: |-
        {
          "opcUaConformance": true,
          "messageDiagnostics": true
        }
```

This configuration enables both options for `processTelemetry` and `alerts`. Other datasets and event groups inherit the disabled defaults unless they override them.

### Restore metadata after upgrading to Azure IoT Operations 2610

To enable both options by default for an asset's datasets and event groups, add the following properties to the asset's `properties` object in Bicep:

```bicep
defaultDatasetsConfiguration: string({
  opcUaConformance: true
  messageDiagnostics: true
})
defaultEventsConfiguration: string({
  opcUaConformance: true
  messageDiagnostics: true
})
```

Merge these options with any existing defaults rather than replacing other connector settings. Check individual `datasetConfiguration` and `eventGroupConfiguration` values for explicit `false` overrides.

### Verify message metadata

Subscribe to the configured MQTT telemetry or event destination by using MQTT v5 and inspect the user properties:

- With `opcUaConformance` enabled, expect `opcuamessagetype`. After metadata is available for that dataset or event group, expect `opcuametadatamajorversion` and `opcuametadataminorversion` too. Check the retained metadata topic for that dataset or event group.
- With `messageDiagnostics` enabled, expect `recordedtime`, `traceparent`, and `serverToConnectorMilliseconds`.
- With either option disabled, the properties controlled by that option aren't emitted. Disabling OPC UA conformance also removes the retained metadata message.
- For an asset with a UUID, expect `aioassetref: ms-aio:<asset-uuid>`, not `uuid`, regardless of these options.

For header definitions, metadata topic formats, and retained-message lifecycle, see [Connector for OPC UA message format](overview-opc-ua-connector.md#user-properties).

## Configure delivery acknowledgment

Starting with Azure IoT Operations 2610, delivery acknowledgment provides a handshake for critical data. After the connector forwards a dataset's data changes or an event group's events to the MQTT broker, it increments a counter on the OPC UA server. With MQTT QoS 1, the delivery completes after the broker acknowledges the messages. The server, or another OPC UA client, can monitor this counter to distinguish delivery from local data collection or processing.

The feature reuses the asset's existing OPC UA session and doesn't require MQTT write requests or an additional connection. Unlike a [dataset heartbeat](howto-configure-opc-ua-dataset-heartbeat.md), which updates on a timer to signal connector liveness, delivery acknowledgment updates in response to completed deliveries.

> [!IMPORTANT]
> Use MQTT QoS 1 (`Qos1`) for the relevant destinations when you need confirmation that the broker accepted the data. QoS 0 doesn't provide a broker acknowledgment. Delivery acknowledgment doesn't confirm that a downstream application or cloud consumer processed the data, and isn't an end-to-end exactly-once guarantee.

### Configuration and requirements

Set the following property in each dataset's `datasetConfiguration` or each event group's `eventGroupConfiguration`. These properties contain stringified JSON:

| Property | Type | Description |
| --- | --- | --- |
| `deliveryAcknowledgementDatasource` | String | Absolute OPC UA node ID or expanded node ID of a readable and writable scalar `Int32` or `UInt32` counter variable. |

A nonempty data source enables delivery acknowledgment. The connector disables the feature if you don't configure a datasource or the effective datasource is empty. There's no separate enable flag or timer interval. Configure the datasource explicitly on each dataset or event group, rather than relying on asset-level defaults. Don't put it in `dataPointConfiguration` or an individual event's `eventConfiguration`.

The datasource accepts a namespace URI, such as `nsu=http://microsoft.com/Opc/OpcPlc/;s=Deliveryacknowledgment`, or a numeric namespace index, such as `ns=2;s=Deliveryacknowledgment`. The connector doesn't apply browse paths or `StartInstance` resolution to this property.

Before you configure delivery acknowledgment:

1. Create a dedicated counter variable on the OPC UA server for each dataset or event group that needs confirmation. The asset definition doesn't create the server variable.
1. Grant the connector's session identity permission to read and write each variable.
1. Ensure that the relevant MQTT destinations use `Qos1` if you require broker acknowledgment.

> [!IMPORTANT]
> Don't share counter nodes between datasets, event groups, assets, or dataset heartbeats. Each delivery acknowledgment counter has independent cached state. Concurrent writers can overwrite each other's values. The connector warns when multiple datasets or event groups within an asset target the same datasource, but doesn't arbitrate the writes.

### Configure a dataset and an event group

The following Bicep fragment shows the connector-specific settings in a namespaced asset's `properties` object. Merge the settings into your existing datasets and event groups, preserving their data points, events, and destinations. Replace the example node IDs with existing server variables:

```bicep
datasets: [
  {
    name: 'processTelemetry'
    datasetConfiguration: string({
      publishingInterval: 1000
      deliveryAcknowledgementDatasource: 'nsu=http://microsoft.com/Opc/OpcPlc/;s=DeliveryAcknowledgement'
    })
  }
]
eventGroups: [
  {
    name: 'processEvents'
    eventGroupConfiguration: string({
      publishingInterval: 1000
      deliveryAcknowledgementDatasource: 'nsu=http://microsoft.com/Opc/OpcPlc/;s=EventDeliveryAcknowledgement'
    })
  }
]
```

For a Kubernetes namespaced `Asset` resource, the equivalent fields under `spec` contain JSON strings:

```yaml
spec:
  datasets:
    - name: processTelemetry
      datasetConfiguration: |-
        {
          "publishingInterval": 1000,
          "deliveryAcknowledgementDatasource": "nsu=http://microsoft.com/Opc/OpcPlc/;s=DeliveryAcknowledgement"
        }
  eventGroups:
    - name: processEvents
      eventGroupConfiguration: |-
        {
          "publishingInterval": 1000,
          "deliveryAcknowledgementDatasource": "nsu=http://microsoft.com/Opc/OpcPlc/;s=EventDeliveryAcknowledgement"
        }
```

These configuration fragments aren't complete asset definitions. For the surrounding resource definition, see [Configure the connector for OPC UA](howto-configure-opc-ua.md).

Apply the updated asset configuration and allow time for reconciliation. To disable the feature, remove or empty the datasource on the dataset or event group, and remove any inherited datasource from the corresponding asset defaults.

### Initialization and counter behavior

After schema processing, the connector reads each configured variable to determine its type and starting value. Delivery triggers become active only after initialization succeeds. If initialization fails, the asset can't complete its transition to the running state, reports degraded health, and retries initialization during normal maintenance.

The connector keeps an in-memory counter for each asset and dataset or event group. It doesn't reread the variable before each write:

- The counter advances for confirmed deliveries, not for individual data points or events. When notifications are coalesced, confirmation occurs after the last coalesced data is successfully forwarded, not once for every original change.
- The connector generates a delivery confirmation when all outbound messages for the corresponding batch complete successfully. Local read or processing success alone isn't sufficient.
- The connector serializes writes to each counter. If more confirmations arrive while a write is in progress, the next write can advance by several confirmations. Don't interpret the number of OPC UA writes as the number of MQTT messages or source changes.
- The first increment starts from the value read during initialization. An `Int32` counter wraps from `Int32.MaxValue` to `Int32.MinValue`. A `UInt32` counter wraps from `UInt32.MaxValue` to `0`. Monitoring logic must tolerate wraparound.
- The connector reports a failed write through logs and metrics. It doesn't undo the cached increment, so later successful writes can skip values.

### Check and troubleshoot delivery acknowledgment

Watch the counter with an OPC UA client while you generate data changes or events and monitor the configured MQTT destinations. With QoS 1, expect the counter to advance after the broker acknowledges delivery, not periodically during idle periods.

The connector reports initialization failures, write failures, and wrong types in aggregated logs. A shared datasource within an asset produces a configuration warning. For counter definitions and dimensions, see [Delivery acknowledgment metrics](../reference/observability-metrics-opcua-broker.md#delivery-acknowledgment-metrics).

| Symptom | Action |
| --- | --- |
| The counter doesn't change. | Verify that the asset configuration was applied, the datasource isn't empty, and the asset reached its running state. Confirm that there are data changes or events to deliver and that MQTT publishing succeeds. |
| The asset remains degraded during initialization. | Verify that every configured counter node exists and is readable by the connector identity. Check the initialization error in the logs. |
| The logs report the wrong type. | Use a scalar `Int32` or `UInt32`, not an array or another data type. |
| Initialization succeeds, but counter writes fail. | Grant write access to the connector identity and ensure the server variable is writable. Inspect the logged OPC UA status code, such as `Bad_NotWritable` or `Bad_UserAccessDenied`. |
| Values skip, repeat, or move backward. | Account for batching, failed writes, and wraparound. Ensure that every dataset, event group, and heartbeat uses its own node and that no other client writes to the counter. |

## Related content

- [Connector for OPC UA overview](overview-opc-ua-connector.md)
- [Configure the connector for OPC UA](howto-configure-opc-ua.md)
- [Configure OPC UA sessions and high availability](howto-configure-opc-ua-sessions-high-availability.md)