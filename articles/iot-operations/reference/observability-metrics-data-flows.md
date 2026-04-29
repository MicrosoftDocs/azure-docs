---
title: Metrics for data flows
description: Available observability metrics for data flows to monitor the health and performance of your solution.
author: vadim-kovalyov
ms.author: vakavali
ms.topic: reference
ms.date: 03/27/2026

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Metrics for data flows

Data flows provide a set of observability metrics that you can use to monitor and analyze the health of your solution. This article lists the available metrics for data flows. The following sections group related sets of metrics, and list the name, type, description, and dimensions for each metric.

## Common data flow metrics

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_dataflow_messages_received | Counter | Number of messages received from sources. | [`source_service_type`](#source_service_type), [`category`](#category) |
| aio_dataflow_messages_sent | Counter | Number of messages sent to targets. For QoS 0, the counter increments without waiting for ACK from the target. For higher QoS levels, it waits for ACK before incrementing. | [`target_service_type`](#target_service_type), [`category`](#category) |
| aio_dataflow_messages_retried | Counter | Number of messages that were retried for delivery to targets. | [`target_service_type`](#target_service_type), [`category`](#category) |
| aio_dataflow_messages_expired | Counter | Number of messages dropped because they expired after being received. Expiry is controlled by the `Message Expiry Interval` property set on the MQTTv5 publish packet. | [`target_service_type`](#target_service_type) |
| aio_dataflow_messages_filtered | Counter | Number of messages dropped because they were filtered by the data processing rules. | [`target_service_type`](#target_service_type) |
| aio_dataflow_messages_dropped_processing_errors | Counter | Number of messages dropped due to processing errors such as conversion errors or message size exceeding limits. | [`target_service_type`](#target_service_type) |
| aio_dataflow_messages_dropped_when_busy | Counter | Number of messages dropped when internal queues were full. Applicable only to QoS 0 messages. | [`source_service_type`](#source_service_type), [`category`](#category) |
| aio_dataflow_bytes_received | Counter | Sum of the payloads of all messages received. Doesn't include the size of message properties or publish packets. | [`source_service_type`](#source_service_type), [`category`](#category) |
| aio_dataflow_bytes_sent | Counter | Sum of the payloads of all messages sent. Doesn't include the size of message properties or publish packets. | [`target_service_type`](#target_service_type), [`category`](#category) |
| aio_dataflow_errors | Counter | Number of errors that occurred in sources or targets. | [`source_service_type`](#source_service_type) or [`target_service_type`](#target_service_type), [`error_code`](#error_code) |
| aio_dataflow_processing_latency | Histogram | Processing latency in milliseconds from the moment the message was received until the acknowledge was received from the target. May include network round-trip time for QoS 1 MQTT messages. For QoS 0, doesn't wait for ACK from the target. | [`source_service_type`](#source_service_type), [`category`](#category) |
| aio_dataflow_upload_latency | Histogram | Latency in milliseconds of sending messages to the target endpoint. | [`target_service_type`](#target_service_type), [`success`](#success), [`category`](#category) |
| aio_dataflow_transformation_latency | Histogram | Latency in milliseconds from the moment a message was received until it was processed and is ready to be sent to the target. | [`source_service_type`](#source_service_type), [`target_service_type`](#target_service_type), [`success`](#success), [`category`](#category) |

## Operator metrics

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_dataflow_active_dataflows | Gauge | Number of active data flows. | |
| aio_dataflow_active_dataflow_graphs | Gauge | Number of active data flow graphs. | |
| aio_dataflow_version | Counter | Reports data flow version via the `version` dimension. | `version` |
| aio_dataflow_reconcile_errors | Gauge | Indicates whether the operator encountered reconciliation errors. A value of 1 means an error occurred; 0 means no errors. | |

## Data flow graph metrics

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_dataflow_graphs | Gauge | Number of individual graphs within the data flow graphs. | [`dataflow_id`](#dataflow_id) |
| aio_dataflow_graph_modules | Gauge | Number of unique WASM modules loaded across all graph artifacts in a DataflowGraph. | [`dataflow_id`](#dataflow_id) |
| aio_dataflow_graph_inputs | Gauge | Number of input topics (dataSources) across all Source nodes in a DataflowGraph. | [`dataflow_id`](#dataflow_id) |
| aio_dataflow_graph_operators | Gauge | Number of operations by type in graph artifact(s) referenced by a DataflowGraph. | [`dataflow_id`](#dataflow_id), [`operator_type`](#operator_type) |
| aio_dataflow_graph_errors | Counter | Number of errors encountered while downloading or parsing graphs. | [`error_code`](#error_code) |
| aio_dataflow_graph_module_exit | Counter | Number of unexpected module errors that caused a module to exit. | |
| aio_dataflow_graph_messages_received | Counter | Number of messages received by graph processing. | |
| aio_dataflow_graph_messages_sent | Counter | Number of messages sent from graphs to a target. The counter increments without waiting for ACK from the target. | |
| aio_dataflow_graph_accumulated_messages | Counter | Number of messages that were accumulated. | |
| aio_dataflow_graph_accumulated_bytes | Counter | Sum of the payloads of all accumulated messages. Doesn't include the size of message properties or publish packets. | |

## Dimension reference

### category

The [`category`](#category) dimension comes from the MQTT Connect packet's `metriccategory` user property. When a client connects to the broker, it can include this user property to categorize its traffic. This allows dashboards to differentiate traffic sources.

> [!IMPORTANT]
> The number of unique categories is limited to 1000. Avoid using high-cardinality values for `metriccategory` to prevent metric data loss.

### source_service_type

Source endpoint service type, determined from the endpoint type and host. Possible values:

- `Local Storage`
- `Blob Storage`
- `Fabric OneLake`
- `Data Explorer`
- `Fabric RTI`
- `Local AIO MQTT Broker`
- `Event Hubs`
- `Event Grid`
- `Open Telemetry`
- `Unknown Kafka Broker`
- `Unknown Mqtt Broker`
- `Other`

### target_service_type

Target endpoint service type, determined from the endpoint type and host. Same possible values as [`source_service_type`](#source_service_type).

### error_code

Type of error associated with the metric. Possible values:

- `ConfigError`
- `PayloadError`
- `InternalError`

The list also includes other error codes from health status reporting.

### dataflow_id

Name of the DataflowGraph custom resource that the metric is associated with.

### operator_type

Type of graph operation. Possible values:

- `Source`
- `Sink`
- `Map`
- `Filter`
- `Branch`
- `Concatenate`
- `Accumulate`
- `Delay`

### success

Boolean string (`"true"` or `"false"`) indicating whether the operation associated with the metric was successful.

## Related content

- [Configure observability](../configure-observability-monitoring/howto-configure-observability.md)
