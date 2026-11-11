---
title: Metrics for the connector for OPC UA
description: Available observability metrics for the connector for OPC UA to monitor the health and performance of your solution.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-opcua-connector
ms.topic: reference
ms.custom:
  - ignite-2023
ms.date: 10/29/2026
ai-usage: ai-assisted

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Metrics for the connector for OPC UA

The connector for OPC UA emits observability metrics that you can use to monitor the health of your solution. This article lists the available metrics. Each section gives the name, type, description, and dimensions for each metric.

## Common metrics

The supervisor, the OPC UA connector, and the OPC UA commander all emit these metrics.

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio.opc.heartbeat.count | Counter | Number of heartbeat signals that the component instance emits. | [`instance`](#instance) |
| aio.opc.instance.count | Gauge | Current number of active component instances. | [`service.name`](#servicename), [`instance`](#instance) |
| aio.opc.mqtt.message.publishing.retry.count | Counter | Number of times publishing an MQTT message is retried. | [`aio.opc.mqtt.message.qos`](#aioopcmqttmessageqos) |
| aio.opc.mqtt.message.publishing.failure.count | Counter | Number of failed attempts to publish an MQTT message. | [`aio.opc.mqtt.client.id`](#aioopcmqttclientid), [`aio.opc.mqtt.publish.result`](#aioopcmqttpublishresult) |
| aio.opc.mqtt.message.publishing.duration | Histogram | Duration of publishing a message to the MQTT broker and receiving an acknowledgment. | [`aio.opc.mqtt.message.qos`](#aioopcmqttmessageqos), [`aio.opc.mqtt.publish.result`](#aioopcmqttpublishresult) |
| aio.opc.mqtt.client.connect.count | Counter | Number of times the MQTT client tries to connect. | [`aio.opc.mqtt.client.purpose`](#aioopcmqttclientpurpose) |
| aio.opc.mqtt.client.connect.failure.count | Counter | Number of times the MQTT client fails to connect. | [`aio.opc.mqtt.client.purpose`](#aioopcmqttclientpurpose) |
| aio.opc.mqtt.client.subscription.failure.count | Counter | Number of times the MQTT client fails to subscribe to a topic. | [`aio.opc.mqtt.client.id`](#aioopcmqttclientid), [`aio.opc.mqtt.topic`](#aioopcmqtttopic), [`aio.opc.mqtt.subscribe.result`](#aioopcmqttsubscriberesult) |
| aio.opc.mqtt.client.disconnect.count | Counter | Number of times the MQTT client disconnects. | [`aio.opc.mqtt.client.id`](#aioopcmqttclientid) |
| aio.opc.mqtt.client.publish.attempt.when.disconnected.count | Counter | Number of times the MQTT client attempts to publish when disconnected. | |
| aio.opc.component.shutdown.count | Counter | Number of times the component is shut down. | [`aio.opc.component.shutdown.originator`](#aioopccomponentshutdownoriginator), [`aio.opc.component.shutdown.code`](#aioopccomponentshutdowncode) |

## Supervisor

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio.opc.asset.count | ObservableGauge | Number of assets currently deployed. | |
| aio.opc.endpoint.count | ObservableGauge | Number of deployed asset endpoint profiles. | |
| aio.opc.asset.datapoint.count | ObservableGauge | Number of datapoints defined across all assets. | |
| aio.opc.asset.event.count | ObservableGauge | Number of events defined across all assets. | |
| aio.opc.connector.failover.duration | Histogram | Duration of a connector instance failover, measured from when the connector is detected as missing until the passive instance confirms its activation. | [`aio.opc.connector-schema`](#aioopcconnector-schema), [`aio.opc.connector-name`](#aioopcconnector-name) |
| aio.opc.connector.asset.count | Histogram | Number of assets assigned per connector instance. | [`aio.opc.connector-name`](#aioopcconnector-name) |
| aio.opc.connector.endpoint.count | Histogram | Number of endpoints assigned per connector instance. | [`aio.opc.connector-name`](#aioopcconnector-name) |
| aio.opc.connector.load | Histogram | Number that indicates the load per connector instance. | [`aio.opc.connector-name`](#aioopcconnector-name) |
| aio.opc.schema.connector.count | Histogram | Number of connector instances per schema. | [`aio.opc.connector-schema`](#aioopcconnector-schema) |

## OPC UA connector

Dimensions marked with **(1)** are emitted only when you set `ExperimentalConfiguration.EnableUnboundedMetricDimensions` to `true`, because of unbounded cardinality.

| Metric                                            | Type            | Description                                                                                                                                                                            | Dimensions                                                                                                                                                                        |
| ------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| aio.opc.subscription.transfer.count               | Counter         | Number of times a subscription is transferred.                                                                                                                                         |                                                                                                                                                                                   |
| aio.opc.asset.telemetry.data_change.count         | Counter         | Number of asset data changes received.                                                                                                                                                 |                                                                                                                                                                                   |
| aio.opc.asset.telemetry.data.cyclicread.count     | Counter         | Number of cyclic read cycles and skipped deadlines. A completed read doesn't confirm MQTT delivery.                                                                                    | [`aio.opc.cyclic.read.outcome`](#aioopccyclicreadoutcome)                                                                                                                         |
| aio.opc.asset.telemetry.keyframe.on.trigger.count | Counter         | Number of triggered publications converted to full key frames by `keyFrameOnTrigger`.                                                                                                  |                                                                                                                                                                                   |
| aio.opc.asset.telemetry.event.count               | Counter         | Number of asset events received.                                                                                                                                                       |                                                                                                                                                                                   |
| aio.opc.asset.telemetry.value_change.count        | Counter         | Number of asset value changes received.                                                                                                                                                | [`aio.opc.value-change.status`](#aioopcvalue-changestatus)                                                                                                                        |
| aio.opc.asset.session.connect.count               | Counter         | Number of asset session connect events.                                                                                                                                                | [`aio.opc.session-name`](#aioopcsession-name) **(1)**, [`aio.opc.endpoint`](#aioopcendpoint) **(1)**                                                                              |
| aio.opc.asset.session.disconnect.count            | Counter         | Number of asset session disconnect events.                                                                                                                                             | [`aio.opc.session-name`](#aioopcsession-name) **(1)**, [`aio.opc.endpoint`](#aioopcendpoint) **(1)**, [`aio.opc.error-source`](#aioopcerror-source)                               |
| aio.opc.session.connect.duration                  | Histogram       | OPC UA session connect duration.                                                                                                                                                       | [`aio.opc.connect.result`](#aioopcconnectresult), [`aio.opc.endpoint`](#aioopcendpoint) **(1)**                                                                                   |
| aio.opc.data_change.processing.duration           | Histogram       | Processing duration of data changes received from an asset, measured from when the connector receives the data change until it receives a publish acknowledgment from the MQTT broker. | [`aio.opc.mqtt.messages.count`](#aioopcmqttmessagescount), [`aio.opc.mqtt.messages.error.any`](#aioopcmqttmessageserrorany), [`aio.opc.processing.error`](#aioopcprocessingerror) |
| aio.opc.event.processing.duration                 | Histogram       | Processing duration of events received from an asset, measured from when the connector receives the event until it receives a publish acknowledgment from the MQTT broker.             | [`aio.opc.mqtt.messages.count`](#aioopcmqttmessagescount)                                                                                                                         |
| aio.opc.data_change.delivery_time.duration        | Histogram       | Data change delivery latency, measured from when the OPC UA server publishes the data until the connector receives it.                                                                 | [`aio.opc.endpoint`](#aioopcendpoint) **(1)**                                                                                                                                     |
| aio.opc.event_delivery_time.duration              | Histogram       | Event delivery latency, measured from when the OPC UA server publishes the event until the connector receives it.                                                                      | [`aio.opc.endpoint`](#aioopcendpoint) **(1)**                                                                                                                                     |
| aio.opc.message.egress.size                       | Histogram       | Number of bytes for telemetry sent by the assets.                                                                                                                                      | [`aio.opc.compression`](#aioopccompression)                                                                                                                                       |
| aio.opc.method.request.count                      | Counter         | Number of method invocations received.                                                                                                                                                 | [`aio.opc.method`](#aioopcmethod)                                                                                                                                                 |
| aio.opc.method.response.count                     | Counter         | Number of method invocations responded to.                                                                                                                                             | [`aio.opc.method`](#aioopcmethod)                                                                                                                                                 |
| aio.opc.mqtt.message.processing.duration          | Histogram       | Processing duration of messages received from the MQTT broker (method invocations, writes).                                                                                            |                                                                                                                                                                                   |
| aio.opc.mqtt.queue.ack.size                       | ObservableGauge | Number of incoming MQTT messages with QoS > 0 whose delivery acknowledgment hasn't been sent to the MQTT broker yet.                                                                   |                                                                                                                                                                                   |
| aio.opc.mqtt.queue.notack.size                    | ObservableGauge | Number of incoming MQTT messages with QoS > 0 in the acknowledgment queue whose acknowledgment period timed out because of delays acknowledging previous messages.                     |                                                                                                                                                                                   |
| aio.opc.output_queue.count                        | ObservableGauge | Number of asset telemetry items (data changes or events) queued for publish to the MQTT broker.                                                                                        |                                                                                                                                                                                   |

### Dataset heartbeat metrics

Starting with Azure IoT Operations 2610, the connector emits the following failure counters for [dataset heartbeats](../discover-manage-assets/howto-configure-opc-ua-dataset-heartbeat.md). These metrics are distinct from the common component heartbeat metric `aio.opc.heartbeat.count` and the server-liveness gauge `aio.opc.commander.server.heartbeat.state`.

As with the other connector metrics, dimensions marked **(1)** are emitted only when `ExperimentalConfiguration.EnableUnboundedMetricDimensions` is `true`.

| Metric | Type | Description | Dimensions |
| --- | --- | --- | --- |
| aio.opc.heartbeat.write.failure.count | Counter | Number of times a dataset heartbeat counter couldn't be initialized or written. Also includes the OPC UA error code. | [`aio.opc.heartbeat.asset`](#aioopcheartbeatasset) **(1)**, [`aio.opc.heartbeat.dataset`](#aioopcheartbeatdataset) **(1)** |
| aio.opc.heartbeat.wrong.type.count | Counter | Number of times a heartbeat datasource had the wrong type (not a scalar `Int32` or `UInt32`). | [`aio.opc.heartbeat.asset`](#aioopcheartbeatasset) **(1)**, [`aio.opc.heartbeat.dataset`](#aioopcheartbeatdataset) **(1)**, [`aio.opc.heartbeat.actual-type`](#aioopcheartbeatactual-type) |

### Delivery acknowledgment metrics

Starting with Azure IoT Operations 2610, the connector emits these counters for [delivery acknowledgment ](../discover-manage-assets/howto-configure-opc-ua-advanced-data-collection.md#configure-delivery-acknowledgment ). They measure writes of the delivery counter back to the OPC UA server, not downstream consumer processing.

Dimensions marked **(1)** are emitted only when `ExperimentalConfiguration.EnableUnboundedMetricDimensions` is `true`.

| Metric | Type | Description | Dimensions |
| --- | --- | --- | --- |
| aio.opc.asset.telemetry.delivery.acknowledgement.write.count | Counter | Number of successful delivery acknowledgment counter writes to the OPC UA server. A write can include multiple pending delivery confirmations. | [`aio.opc.asset`](#aioopcasset) **(1)**, [`aio.opc.dataset`](#aioopcdataset) **(1)** |
| aio.opc.asset.telemetry.delivery.acknowledgement.failure.count | Counter | Number of failures to initialize or write a delivery acknowledgment counter, tagged by failure stage. | [`aio.opc.asset.telemetry.delivery.acknowledgement.failure.reason`](#aioopcassettelemetrydeliveryacknowledgementfailurereason), [`aio.opc.asset`](#aioopcasset) **(1)**, [`aio.opc.dataset`](#aioopcdataset) **(1)** |

## OPC UA commander

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio.opc.browse.count | Counter | Number of browse calls executed. | |
| aio.opc.browse.succeeded | Counter | Number of browse calls that succeeded. | |
| aio.opc.browse.failed | Counter | Number of browse calls that failed. | |
| aio.opc.browse.nodes.count | Gauge | Total number of OPC UA nodes browsed. | |
| aio.opc.asset.call.count | Counter | Number of asset action calls attempted. | |
| aio.opc.asset.call.completed | Counter | Number of asset action calls that succeeded. | |
| aio.opc.asset.call.failed | Counter | Number of asset action calls that failed. | |
| aio.opc.method.call.count | Counter | Number of OPC UA method calls attempted. | |
| aio.opc.method.call.completed | Counter | Number of OPC UA method calls that succeeded. | |
| aio.opc.method.call.failed | Counter | Number of OPC UA method calls that failed. | |
| aio.opc.action.count | Counter | Number of dataset action calls executed. | |
| aio.opc.action.succeeded | Counter | Number of dataset action calls that succeeded fully. | |
| aio.opc.action.failed | Counter | Number of dataset action calls that failed at least partially. | |
| aio.opc.node.read.count | Counter | Number of OPC UA node read calls attempted. | |
| aio.opc.node.read.succeeded | Counter | Number of OPC UA node read calls that succeeded. | |
| aio.opc.node.read.failed | Counter | Number of OPC UA node read calls that failed. | |
| aio.opc.node.write.count | Counter | Number of OPC UA node write calls attempted. | |
| aio.opc.node.write.succeeded | Counter | Number of OPC UA node write calls that succeeded. | |
| aio.opc.node.write.failed | Counter | Number of OPC UA node write calls that failed. | |
| aio.opc.write.count | Counter | Number of explicit write calls executed. | |
| aio.opc.write.succeeded | Counter | Number of explicit write calls that succeeded fully. | |
| aio.opc.write.failed | Counter | Number of explicit write calls that failed at least partially. | |
| aio.opc.read.count | Counter | Number of dataset read calls executed. | |
| aio.opc.read.succeeded | Counter | Number of dataset read calls that succeeded fully. | |
| aio.opc.read.failed | Counter | Number of dataset read calls that failed at least partially. | |
| aio.opc.syncprops.count | Counter | Number of `SyncProperties` calls executed. | |
| aio.opc.syncprops.succeeded | Counter | Number of `SyncProperties` calls that succeeded fully. | |
| aio.opc.syncprops.failed | Counter | Number of `SyncProperties` calls that failed at least partially. | |
| aio.opc.syncprops.total | Counter | Total number of properties read from OPC UA and written to the [state store](../develop-edge-apps/overview-state-store.md). | |
| aio.opc.managed_service.running | UpDownCounter | Number of currently running managed services. | [`service_type`](#service_type) |
| aio.opc.managed_service.crashes | Counter | Number of managed service crashes. | [`service_type`](#service_type) |
| aio.opc.managed_service.restarts | Counter | Number of managed service restarts. | [`service_type`](#service_type) |
| aio.opc.commander.server.heartbeat.state | Gauge | Current OPC UA server liveness state observed by the server heartbeat monitor. Values are `1` (alive), `0` (not alive), and `-1` (unknown). For more information, see [Monitor OPC UA server availability with heartbeat monitoring](../discover-manage-assets/concept-opc-ua-server-heartbeat-monitoring.md). | [`aio.opc.inbound.endpoint`](#aioopcinboundendpoint) |

## MCP tool

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio.opc.mcp.generateschema.count | Counter | Number of times the `GenerateSchema` tool was called. | |
| aio.opc.mcp.generateschema.success | Counter | Number of times the `GenerateSchema` tool completed successfully. | |
| aio.opc.mcp.generateschema.failed | Counter | Number of times the `GenerateSchema` tool failed. | |
| aio.opc.mcp.datasetaction.count | Counter | Number of times the `DatasetAction` tool was called. | |
| aio.opc.mcp.datasetaction.success | Counter | Number of times the `DatasetAction` tool completed successfully. | |
| aio.opc.mcp.datasetaction.failed | Counter | Number of times the `DatasetAction` tool failed. | |
| aio.opc.mcp.datasetread.count | Counter | Number of times the `DatasetRead` tool was called. | |
| aio.opc.mcp.datasetread.success | Counter | Number of times the `DatasetRead` tool completed successfully. | |
| aio.opc.mcp.datasetread.failed | Counter | Number of times the `DatasetRead` tool failed. | |
| aio.opc.mcp.datasetwrite.count | Counter | Number of times the `DatasetWrite` tool was called. | |
| aio.opc.mcp.datasetwrite.success | Counter | Number of times the `DatasetWrite` tool completed successfully. | |
| aio.opc.mcp.datasetwrite.failed | Counter | Number of times the `DatasetWrite` tool failed. | |
| aio.opc.mcp.browse.count | Counter | Number of times the `Browse` tool was called. | |
| aio.opc.mcp.browse.success | Counter | Number of times the `Browse` tool completed successfully. | |
| aio.opc.mcp.browse.failed | Counter | Number of times the `Browse` tool failed. | |
| aio.opc.mcp.discoverassets.count | Counter | Number of times the `DiscoverAssets` tool was called. | |
| aio.opc.mcp.discoverassets.success | Counter | Number of times the `DiscoverAssets` tool completed successfully. | |
| aio.opc.mcp.discoverassets.failed | Counter | Number of times the `DiscoverAssets` tool failed. | |
| aio.opc.mcp.typebased.discoverassets.count | Counter | Number of times the `TypeBasedDiscoverAssets` tool was called. | |
| aio.opc.mcp.typebased.discoverassets.success | Counter | Number of times the `TypeBasedDiscoverAssets` tool completed successfully. | |
| aio.opc.mcp.typebased.discoverassets.failed | Counter | Number of times the `TypeBasedDiscoverAssets` tool failed. | |
| aio.opc.mcp.readmanagementaction.count | Counter | Number of times the `ReadManagementAction` tool was called. | |
| aio.opc.mcp.readmanagementaction.success | Counter | Number of times the `ReadManagementAction` tool completed successfully. | |
| aio.opc.mcp.readmanagementaction.failed | Counter | Number of times the `ReadManagementAction` tool failed. | |
| aio.opc.mcp.writemanagementaction.count | Counter | Number of times the `WriteManagementAction` tool was called. | |
| aio.opc.mcp.writemanagementaction.success | Counter | Number of times the `WriteManagementAction` tool completed successfully. | |
| aio.opc.mcp.writemanagementaction.failed | Counter | Number of times the `WriteManagementAction` tool failed. | |
| aio.opc.mcp.callmanagementaction.count | Counter | Number of times the `CallManagementAction` tool was called. | |
| aio.opc.mcp.callmanagementaction.success | Counter | Number of times the `CallManagementAction` tool completed successfully. | |
| aio.opc.mcp.callmanagementaction.failed | Counter | Number of times the `CallManagementAction` tool failed. | |
| aio.opc.mcp.syncproperties.count | Counter | Number of times the `SyncProperties` tool was called. | |
| aio.opc.mcp.syncproperties.success | Counter | Number of times the `SyncProperties` tool completed successfully. | |
| aio.opc.mcp.syncproperties.failed | Counter | Number of times the `SyncProperties` tool failed. | |

## Dimension reference

### instance

Identifier of the component instance that emits the metric.

### service.name

Name of the service that emits the metric.

### aio.opc.mqtt.message.qos

QoS setting for MQTT publishing.

### aio.opc.mqtt.publish.result

Result code of the MQTT publish request.

### aio.opc.mqtt.client.id

MQTT client identifier.

### aio.opc.mqtt.client.purpose

Purpose of the MQTT client connection.

### aio.opc.mqtt.topic

Topic the MQTT message is published or subscribed to.

### aio.opc.mqtt.subscribe.result

Result code of the MQTT subscribe request.

### aio.opc.component.shutdown.originator

Component or subsystem that initiates the shutdown.

### aio.opc.component.shutdown.code

Exit code at component shutdown.

### aio.opc.connector-schema

Name of the connector schema.

### aio.opc.connector-name

Name of the connector.

### aio.opc.value-change.status

Status code associated with an OPC UA value change. Values are `good`, `bad`, `localOverride`, or `filtered`. The `filtered` value counts samples that a [data-quality filter](../discover-manage-assets/howto-configure-opc-ua-advanced-data-collection.md#filter-data-by-opc-ua-quality) excludes.

### aio.opc.session-name

OPC UA session name. This attribute has unbounded cardinality and is emitted only when you set `ExperimentalConfiguration.EnableUnboundedMetricDimensions` to `true`.

### aio.opc.endpoint

Endpoint address of the OPC UA server. This attribute has unbounded cardinality and is emitted only when you set `ExperimentalConfiguration.EnableUnboundedMetricDimensions` to `true`.

### aio.opc.asset

Name of the asset associated with the delivery acknowledgmentcounter. This attribute has unbounded cardinality and is emitted only when you set `ExperimentalConfiguration.EnableUnboundedMetricDimensions` to `true`.

### aio.opc.dataset

Name of the dataset or event group associated with the delivery acknowledgment counter. This attribute has unbounded cardinality and is emitted only when you set `ExperimentalConfiguration.EnableUnboundedMetricDimensions` to `true`.

### aio.opc.asset.telemetry.delivery.acknowledgement.failure.reason

Stage of a delivery acknowledgment failure: `source` for an unsupported counter type, `processing` for an unexpected acknowledgement-processing exception, or `forwarding` for an OPC UA initialization or write failure.

### aio.opc.heartbeat.asset

Name of the asset associated with the dataset heartbeat. This attribute has unbounded cardinality and is emitted only when you set `ExperimentalConfiguration.EnableUnboundedMetricDimensions` to `true`.

### aio.opc.heartbeat.dataset

Name of the dataset associated with the heartbeat. This attribute has unbounded cardinality and is emitted only when you set `ExperimentalConfiguration.EnableUnboundedMetricDimensions` to `true`.

### aio.opc.heartbeat.actual-type

Actual type encountered when the heartbeat datasource isn't a supported scalar `Int32` or `UInt32` variable.

### aio.opc.inbound.endpoint

Name of the OPC UA inbound endpoint for which the server heartbeat monitor reports server liveness.

### aio.opc.connect.result

Result of the OPC UA session connect attempt. Values are `succeeded` or `failed`.

### aio.opc.error-source

Origin of the error. Values are `internal` or `external`.

### aio.opc.mqtt.messages.count

Number of messages the OPC UA `DataChangeNotification` splits into. Values are `single` or `multiple`.

### aio.opc.mqtt.messages.error.any

Whether any messages of the OPC UA `DataChangeNotification` couldn't publish to MQTT. Values are `true` or `false`.

### aio.opc.processing.error

Whether an error occurs while processing the OPC UA `DataChangeNotification`. Values are `true` or `false`.

### aio.opc.compression

Compression for the MQTT message payload. Values are `none`, `brotli`, or `gzip`.

### aio.opc.method

Name of the method invoked on the OPC UA server.

### aio.opc.cyclic.read.outcome

Cyclic read outcome: `completed`, `failed`, or `skipped`. A skipped outcome counts an elapsed deadline while a previous cycle is still running.

### service_type

Type of managed service. Currently, the only value is `OPC UA Commander`.

## Related content

- [Configure observability](../deploy-iot-ops/howto-configure-observability.md)
