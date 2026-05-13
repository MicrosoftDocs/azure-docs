---
title: Metrics for the connector for OPC UA
description: Available observability metrics for the connector for OPC UA to monitor the health and performance of your solution.
author: dominicbetts
ms.author: dobett
ms.topic: reference
ms.custom:
  - ignite-2023
ms.date: 03/25/2026

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Metrics for the connector for OPC UA

The connector for OPC UA provides a set of observability metrics that you can use to monitor and analyze the health of your solution. This article lists the available metrics for the connector for OPC UA. The following sections group related sets of metrics, and list the name, type, description, and dimensions for each metric.

## Crosscutting

Emitted by all components: Supervisor, OPC UA Connector, and OPC UA Commander.

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio.opc.heartbeat.count | Counter | The number of heartbeat signals emitted by the component instance. | [`instance`](#instance) |
| aio.opc.instance.count | Gauge | The current number of active component instances. | [`service.name`](#servicename), [`instance`](#instance) |
| aio.opc.mqtt.message.publishing.retry.count | Counter | The number of times publishing an MQTT message had to be retried. | [`aio.opc.mqtt.message.qos`](#aioopcmqttmessageqos) |
| aio.opc.mqtt.message.publishing.failure.count | Counter | The number of failed attempts to publish an MQTT message. | [`aio.opc.mqtt.client.id`](#aioopcmqttclientid), [`aio.opc.mqtt.publish.result`](#aioopcmqttpublishresult) |
| aio.opc.mqtt.message.publishing.duration | Histogram | The duration of publishing a message to the MQTT broker and receiving an acknowledgment. | [`aio.opc.mqtt.message.qos`](#aioopcmqttmessageqos), [`aio.opc.mqtt.publish.result`](#aioopcmqttpublishresult) |
| aio.opc.mqtt.client.connect.count | Counter | The number of times the MQTT client tried to connect. | [`aio.opc.mqtt.client.purpose`](#aioopcmqttclientpurpose) |
| aio.opc.mqtt.client.connect.failure.count | Counter | The number of times the MQTT client failed to connect. | [`aio.opc.mqtt.client.purpose`](#aioopcmqttclientpurpose) |
| aio.opc.mqtt.client.subscription.failure.count | Counter | The number of times the MQTT client failed to subscribe to a topic. | [`aio.opc.mqtt.client.id`](#aioopcmqttclientid), [`aio.opc.mqtt.topic`](#aioopcmqtttopic), [`aio.opc.mqtt.subscribe.result`](#aioopcmqttsubscriberesult) |
| aio.opc.mqtt.client.disconnect.count | Counter | The number of times the MQTT client disconnected. | [`aio.opc.mqtt.client.id`](#aioopcmqttclientid) |
| aio.opc.mqtt.client.publish.attempt.when.disconnected.count | Counter | The number of times a publish attempt was made when the MQTT client was disconnected. | |
| aio.opc.component.shutdown.count | Counter | The number of times the component is shut down. | [`aio.opc.component.shutdown.originator`](#aioopccomponentshutdownoriginator), [`aio.opc.component.shutdown.code`](#aioopccomponentshutdowncode) |

## Supervisor

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio.opc.asset.count | ObservableGauge | The number of assets that are currently deployed. | |
| aio.opc.endpoint.count | ObservableGauge | The number of asset endpoint profiles that are deployed. | |
| aio.opc.asset.datapoint.count | ObservableGauge | The number of datapoints that are defined across all assets. | |
| aio.opc.asset.event.count | ObservableGauge | The number of events that are defined across all assets. | |
| aio.opc.connector.failover.duration | Histogram | The duration of a connector instance failover, measured from when the connector was detected as missing until the passive connector instance confirms its activation. | [`aio.opc.connector-schema`](#aioopcconnector-schema), [`aio.opc.connector-name`](#aioopcconnector-name) |
| aio.opc.connector.asset.count | Histogram | Number of assets assigned per connector instance. | [`aio.opc.connector-name`](#aioopcconnector-name) |
| aio.opc.connector.endpoint.count | Histogram | Number of endpoints assigned per connector instance. | [`aio.opc.connector-name`](#aioopcconnector-name) |
| aio.opc.connector.load | Histogram | Number that indicates the load per connector instance. | [`aio.opc.connector-name`](#aioopcconnector-name) |
| aio.opc.schema.connector.count | Histogram | Number of connector instances per schema. | [`aio.opc.connector-schema`](#aioopcconnector-schema) |

## Connector for OPC UA

Dimensions marked with **(1)** are only emitted when `ExperimentalConfiguration.EnableUnboundedMetricDimensions` is set to `true` due to unbounded cardinality.

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio.opc.subscription.transfer.count | Counter | The number of times a subscription was transferred. | |
| aio.opc.asset.telemetry.data_change.count | Counter | The number of asset data changes that were received. | |
| aio.opc.asset.telemetry.event.count | Counter | The number of asset events that were received. | |
| aio.opc.asset.telemetry.value_change.count | Counter | The number of asset value changes that were received. | [`aio.opc.value-change.status`](#aioopcvalue-changestatus) |
| aio.opc.asset.session.connect.count | Counter | The number of asset session connect events. | [`aio.opc.session-name`](#aioopcsession-name) **(1)**, [`aio.opc.endpoint`](#aioopcendpoint) **(1)** |
| aio.opc.asset.session.disconnect.count | Counter | The number of asset session disconnect events. | [`aio.opc.session-name`](#aioopcsession-name) **(1)**, [`aio.opc.endpoint`](#aioopcendpoint) **(1)**, [`aio.opc.error-source`](#aioopcerror-source) |
| aio.opc.session.connect.duration | Histogram | The OPC UA session connect duration. | [`aio.opc.connect.result`](#aioopcconnectresult), [`aio.opc.endpoint`](#aioopcendpoint) **(1)** |
| aio.opc.data_change.processing.duration | Histogram | The processing duration of data changes received from an asset, measured from when the data change was received by the connector until a publish acknowledgment is received from the MQTT broker. | [`aio.opc.mqtt.messages.count`](#aioopcmqttmessagescount), [`aio.opc.mqtt.messages.error.any`](#aioopcmqttmessageserrorany), [`aio.opc.processing.error`](#aioopcprocessingerror) |
| aio.opc.event.processing.duration | Histogram | The processing duration of events received from an asset, measured from when the event was received by the connector until a publish acknowledgment is received from the MQTT broker. | [`aio.opc.mqtt.messages.count`](#aioopcmqttmessagescount) |
| aio.opc.data_change.delivery_time.duration | Histogram | The data changes delivery latency, measured from the OPC UA server publishing time to the connector. | [`aio.opc.endpoint`](#aioopcendpoint) **(1)** |
| aio.opc.event_delivery_time.duration | Histogram | The event delivery latency, measured from the OPC UA server publishing time to the connector. | [`aio.opc.endpoint`](#aioopcendpoint) **(1)** |
| aio.opc.message.egress.size | Histogram | The number of bytes for telemetry sent by the assets. | [`aio.opc.compression`](#aioopccompression) |
| aio.opc.method.request.count | Counter | The number of method invocations received. | [`aio.opc.method`](#aioopcmethod) |
| aio.opc.method.response.count | Counter | The number of method invocations answered. | [`aio.opc.method`](#aioopcmethod) |
| aio.opc.mqtt.message.processing.duration | Histogram | The duration for the processing of messages received from the MQTT broker (method invocations, writes). | |
| aio.opc.mqtt.queue.ack.size | ObservableGauge | The number of incoming MQTT messages with QoS higher than 0 which delivery acknowledgment is yet to be sent to MQTT broker. | |
| aio.opc.mqtt.queue.notack.size | ObservableGauge | The number of incoming MQTT messages with QoS higher than 0 in the acknowledgment queue which acknowledgment period timed out due to delay in acknowledgment of previous messages. | |
| aio.opc.output_queue.count | ObservableGauge | Number of asset telemetry items (data changes or events) that are queued for publish to the MQTT broker. | |

## OPC UA Commander

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio.opc.browse.count | Counter | The number of browse calls executed. | |
| aio.opc.browse.succeeded | Counter | The number of browse calls that succeeded. | |
| aio.opc.browse.failed | Counter | The number of browse calls that failed. | |
| aio.opc.browse.nodes.count | Gauge | The total number of OPC UA nodes browsed. | |
| aio.opc.asset.call.count | Counter | The number of asset action calls attempted. | |
| aio.opc.asset.call.completed | Counter | The number of asset action calls that succeeded. | |
| aio.opc.asset.call.failed | Counter | The number of asset action calls that failed. | |
| aio.opc.method.call.count | Counter | The number of OPC UA method calls attempted. | |
| aio.opc.method.call.completed | Counter | The number of OPC UA method calls that succeeded. | |
| aio.opc.method.call.failed | Counter | The number of OPC UA method calls that failed. | |
| aio.opc.action.count | Counter | The number of dataset action calls executed. | |
| aio.opc.action.succeeded | Counter | The number of dataset action calls that succeeded fully. | |
| aio.opc.action.failed | Counter | The number of dataset action calls that failed at least partially. | |
| aio.opc.node.read.count | Counter | The number of OPC UA node read calls attempted. | |
| aio.opc.node.read.succeeded | Counter | The number of OPC UA node read calls that succeeded. | |
| aio.opc.node.read.failed | Counter | The number of OPC UA node read calls that failed. | |
| aio.opc.node.write.count | Counter | The number of OPC UA node write calls attempted. | |
| aio.opc.node.write.succeeded | Counter | The number of OPC UA node write calls that succeeded. | |
| aio.opc.node.write.failed | Counter | The number of OPC UA node write calls that failed. | |
| aio.opc.write.count | Counter | The number of explicit write calls executed. | |
| aio.opc.write.succeeded | Counter | The number of explicit write calls that succeeded fully. | |
| aio.opc.write.failed | Counter | The number of explicit write calls that failed at least partially. | |
| aio.opc.read.count | Counter | The number of dataset read calls executed. | |
| aio.opc.read.succeeded | Counter | The number of dataset read calls that succeeded fully. | |
| aio.opc.read.failed | Counter | The number of dataset read calls that failed at least partially. | |
| aio.opc.syncprops.count | Counter | The number of sync properties calls executed. | |
| aio.opc.syncprops.succeeded | Counter | The number of sync properties calls that succeeded fully. | |
| aio.opc.syncprops.failed | Counter | The number of sync properties calls that failed at least partially. | |
| aio.opc.syncprops.total | Counter | The total number of properties read from OPC UA and written into Distributed State Store. | |
| aio.opc.managed_service.running | UpDownCounter | The number of currently running managed services. | [`service_type`](#service_type) |
| aio.opc.managed_service.crashes | Counter | The number of managed service crashes. | [`service_type`](#service_type) |
| aio.opc.managed_service.restarts | Counter | The number of managed service restarts. | [`service_type`](#service_type) |

## MCP Tool

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio.opc.mcp.generateschema.count | Counter | Number of times the GenerateSchema tool was called. | |
| aio.opc.mcp.generateschema.success | Counter | Number of times the GenerateSchema tool completed successfully. | |
| aio.opc.mcp.generateschema.failed | Counter | Number of times the GenerateSchema tool failed. | |
| aio.opc.mcp.datasetaction.count | Counter | Number of times the DatasetAction tool was called. | |
| aio.opc.mcp.datasetaction.success | Counter | Number of times the DatasetAction tool completed successfully. | |
| aio.opc.mcp.datasetaction.failed | Counter | Number of times the DatasetAction tool failed. | |
| aio.opc.mcp.datasetread.count | Counter | Number of times the DatasetRead tool was called. | |
| aio.opc.mcp.datasetread.success | Counter | Number of times the DatasetRead tool completed successfully. | |
| aio.opc.mcp.datasetread.failed | Counter | Number of times the DatasetRead tool failed. | |
| aio.opc.mcp.datasetwrite.count | Counter | Number of times the DatasetWrite tool was called. | |
| aio.opc.mcp.datasetwrite.success | Counter | Number of times the DatasetWrite tool completed successfully. | |
| aio.opc.mcp.datasetwrite.failed | Counter | Number of times the DatasetWrite tool failed. | |
| aio.opc.mcp.browse.count | Counter | Number of times the Browse tool was called. | |
| aio.opc.mcp.browse.success | Counter | Number of times the Browse tool completed successfully. | |
| aio.opc.mcp.browse.failed | Counter | Number of times the Browse tool failed. | |
| aio.opc.mcp.discoverassets.count | Counter | Number of times the DiscoverAssets tool was called. | |
| aio.opc.mcp.discoverassets.success | Counter | Number of times the DiscoverAssets tool completed successfully. | |
| aio.opc.mcp.discoverassets.failed | Counter | Number of times the DiscoverAssets tool failed. | |
| aio.opc.mcp.typebased.discoverassets.count | Counter | Number of times the TypeBasedDiscoverAssets tool was called. | |
| aio.opc.mcp.typebased.discoverassets.success | Counter | Number of times the TypeBasedDiscoverAssets tool completed successfully. | |
| aio.opc.mcp.typebased.discoverassets.failed | Counter | Number of times the TypeBasedDiscoverAssets tool failed. | |
| aio.opc.mcp.readmanagementaction.count | Counter | Number of times the ReadManagementAction tool was called. | |
| aio.opc.mcp.readmanagementaction.success | Counter | Number of times the ReadManagementAction tool completed successfully. | |
| aio.opc.mcp.readmanagementaction.failed | Counter | Number of times the ReadManagementAction tool failed. | |
| aio.opc.mcp.writemanagementaction.count | Counter | Number of times the WriteManagementAction tool was called. | |
| aio.opc.mcp.writemanagementaction.success | Counter | Number of times the WriteManagementAction tool completed successfully. | |
| aio.opc.mcp.writemanagementaction.failed | Counter | Number of times the WriteManagementAction tool failed. | |
| aio.opc.mcp.callmanagementaction.count | Counter | Number of times the CallManagementAction tool was called. | |
| aio.opc.mcp.callmanagementaction.success | Counter | Number of times the CallManagementAction tool completed successfully. | |
| aio.opc.mcp.callmanagementaction.failed | Counter | Number of times the CallManagementAction tool failed. | |
| aio.opc.mcp.syncproperties.count | Counter | Number of times the sync properties tool was called. | |
| aio.opc.mcp.syncproperties.success | Counter | Number of times the sync properties tool completed successfully. | |
| aio.opc.mcp.syncproperties.failed | Counter | Number of times the sync properties tool failed. | |

## Dimension reference

### instance

The identifier of the component instance emitting the metric.

### service.name

The name of the service emitting the metric.

### aio.opc.mqtt.message.qos

The quality of service setting used for MQTT publishing.

### aio.opc.mqtt.publish.result

The result code of the MQTT publish request.

### aio.opc.mqtt.client.id

The MQTT client identifier.

### aio.opc.mqtt.client.purpose

The purpose of the MQTT client connection.

### aio.opc.mqtt.topic

The topic the MQTT message was published to or subscribed on.

### aio.opc.mqtt.subscribe.result

The result code of the MQTT subscribe request.

### aio.opc.component.shutdown.originator

The component or subsystem that initiated the shutdown.

### aio.opc.component.shutdown.code

The exit code at the time of component shutdown.

### aio.opc.connector-schema

The name of the connector schema.

### aio.opc.connector-name

The name of the connector.

### aio.opc.value-change.status

The status code associated with an OPC UA value change. Values are `good`, `bad`, or `localOverride`.

### aio.opc.session-name

The OPC UA session name. This attribute has unbounded cardinality and is only emitted when `ExperimentalConfiguration.EnableUnboundedMetricDimensions` is set to `true`.

### aio.opc.endpoint

The endpoint address of the OPC UA server. This attribute has unbounded cardinality and is only emitted when `ExperimentalConfiguration.EnableUnboundedMetricDimensions` is set to `true`.

### aio.opc.connect.result

The result of the OPC UA session connect attempt. Values are `succeeded` or `failed`.

### aio.opc.error-source

The origin of the error. Values are `internal` or `external`.

### aio.opc.mqtt.messages.count

The number of messages the OPC UA DataChangeNotification was split into. Values are `single` or `multiple`.

### aio.opc.mqtt.messages.error.any

Whether any messages of the OPC UA DataChangeNotification couldn't be published to MQTT. Values are `true` or `false`.

### aio.opc.processing.error

Whether an error occurred while processing the OPC UA DataChangeNotification. Values are `true` or `false`.

### aio.opc.compression

The compression used for the MQTT message payload. Values are `none`, `brotli`, or `gzip`.

### aio.opc.method

The name of the method invoked on the OPC UA server.

### service_type

The type of managed service (OPC UA Commander).

## Related content

- [Configure observability](../configure-observability-monitoring/howto-configure-observability.md)
