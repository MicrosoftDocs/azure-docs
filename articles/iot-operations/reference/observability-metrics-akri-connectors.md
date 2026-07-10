---
title: Metrics for Akri and connectors
description: Available observability metrics for Akri and connectors to monitor the health and performance of your solution.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-akri
ms.topic: reference
ms.date: 03/30/2026

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Metrics for Akri and connectors

Akri and the first-party connectors emit observability metrics that you can use to monitor the health of your solution. This article lists the metrics for Akri, the SSE connector, the REST connector, the MQTT connector, and the WASM graph runtime. Each section gives the name, type, description, and dimensions for each metric.

## Akri operator metrics

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_akri_operator_reconciliation_total_count | Counter | The total number of operator reconciliation attempts across Akri-managed resources. | [`result`](#result), [`resource_type`](#resource_type), [`error_type`](#error_type) |
| aio_akri_operator_connector_template_count | Counter | The total number of connector template endpoint type entries handled by the operator. | [`endpoint_type`](#endpoint_type) |
| aio_akri_operator_connector_deployment_instance_count | Counter | The total number of connector deployment instances created for a connector template. | [`template_name`](#template_name) |
| aio_akri_operator_heartbeat | Counter | Emits a periodic heartbeat from the operator service. | [`service`](#service), [`instance`](#instance) |
| aio_akri_operator_active_devices | Gauge | Reports the current number of active Device resources observed by the operator watcher. | |
| aio_akri_operator_active_assets | Gauge | Reports the current number of active Asset resources observed by the operator watcher. | |
| aio_akri_operator_connector_instance_count | Gauge | Reports the current connector instance count for each connector template. | [`connector_template_name`](#connector_template_name) |

## Akri ADR service metrics

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_akri_adr_service_instance_count | Gauge | Reports the configured ADR service instance count from operator heartbeat emission. | [`service`](#service) |
| aio_akri_adr_service_heartbeat | Counter | Emits a periodic heartbeat from each ADR service instance. | [`service`](#service), [`instance`](#instance) |
| aio_akri_adr_service_api_invocation_count | Counter | Number of ADR service API requests, classified by outcome. | [`api`](#api), [`result`](#result), [`operation`](#operation) |
| aio_akri_adr_service_watcher_event_count | Counter | Number of ADR watcher events processed for `Device` and `Asset` flows. | [`result`](#result), [`target`](#target) |
| aio_akri_adr_service_watcher_event_to_publish_duration_seconds | Histogram | Time, in seconds, from receipt of a watcher event to the telemetry publish attempt. | [`result`](#result), [`target`](#target) |
| aio_akri_api_request_duration_seconds | Histogram | ADR API request handling latency, in seconds. | [`api`](#api), [`result`](#result), [`operation`](#operation) |

## Akri Kubernetes API and MQTT metrics

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_akri_k8s_api_request_count | Counter | Number of Kubernetes API requests issued by Akri components in the operator and the ADR service. | [`operation`](#operation), [`resource_type`](#resource_type) |
| aio_akri_k8s_api_request_duration_seconds | Histogram | Kubernetes API request latency, in seconds, across the operator and the ADR service. | [`operation`](#operation), [`resource_type`](#resource_type), [`status`](#status) |
| aio_akri_k8s_api_errors_total_count | Counter | Number of ADR service Kubernetes API errors. | |
| aio_akri_mqtt_connection_errors_total_count | Counter | Number of ADR service MQTT connection and session failures. | [`error_reason`](#error_reason) |

## SSE connector metrics

All SSE connector metrics include the common dimensions [`instance`](#instance) and [`service`](#service). The dimensions column lists any additional dimensions.

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_sse_connector_messages_received | Counter | Number of messages received from SSE sources. | |
| aio_sse_connector_messages_dropped | Counter | Number of messages dropped. | |
| aio_sse_connector_messages_forwarded | Counter | Number of messages successfully forwarded. | |
| aio_sse_connector_messages_failed | Counter | Number of messages that failed to process. | |
| aio_sse_connector_processing_latency | Histogram | Processing latency, in milliseconds, from when the message arrives until forwarding completes. Might include network round-trip time for QoS 1 MQTT messages. For QoS 0, the metric doesn't include target acknowledgment time. | |
| aio_sse_connector_errors | Counter | Number of errors that occurred. | [`error`](#error) |
| aio_sse_connector_bytes_in | Counter | Sum of all bytes received in each message payload. Doesn't include headers. | |
| aio_sse_connector_bytes_out | Counter | Sum of all bytes in the payload of each message forwarded. Doesn't include headers or cloud events. | |
| aio_sse_connector_heartbeat | Counter | Liveness counter incremented every 30 seconds. | |

## REST connector metrics

All REST connector metrics include the common dimensions [`instance`](#instance) and [`service`](#service). The dimensions column lists any additional dimensions.

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_rest_connector_messages_received | Counter | Number of messages received from REST sources. | |
| aio_rest_connector_messages_forwarded | Counter | Number of messages successfully forwarded. | |
| aio_rest_connector_messages_failed | Counter | Number of messages that failed to process. | |
| aio_rest_connector_processing_latency | Histogram | Processing latency, in milliseconds, from when the message arrives until forwarding completes, marked by target acknowledgment. Might include network round-trip time for QoS 1 MQTT messages. For QoS 0, the metric doesn't include target acknowledgment time. | |
| aio_rest_connector_errors | Counter | Number of errors that occurred. | [`error`](#error) |
| aio_rest_connector_bytes_in | Counter | Sum of bytes received in each REST GET response payload. Doesn't include headers. | |
| aio_rest_connector_bytes_out | Counter | Sum of all bytes in the payload of each message forwarded. Doesn't include headers or cloud events. | |
| aio_rest_connector_heartbeat | Counter | Liveness counter incremented every 30 seconds. | |

## MQTT connector metrics

Most MQTT connector telemetry is exposed through the MQTT broker metrics. The connector itself emits only a liveness heartbeat, which includes the common dimensions [`instance`](#instance) and [`service`](#service).

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_mqtt_connector_heartbeat | Counter | Liveness counter incremented every 30 seconds. | |

## WASM graph runtime metrics

All WASM graph runtime metrics include the common dimensions [`instance`](#instance), [`service`](#service), and [`graph`](#graph). The dimensions column lists any additional dimensions.

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_connector_wasm_graph_processing_latency | Histogram | End-to-end graph processing latency, in milliseconds. | [`wasm_status`](#wasm_status) |
| aio_connector_wasm_graphs_created | Counter | Number of WASM graph creation attempts. | [`wasm_status`](#wasm_status) |

## Dimension reference

### api

ADR API or command path that handled the request (for example, `GetDevice` or `UpdateAssetStatus`).

### connector_template_name

Name of the connector template being measured.

### endpoint_type

Endpoint type declared in a connector template.

### error

General category of error.

### error_reason

High-level MQTT failure reason (for example, `config_error` or `broker_restart`).

### error_type

Error classification for failed reconciliations, when available.

### graph

WASM graph instance that the metric is associated with.

### instance

Emitting service instance, typically the pod hostname or the connector's unique ID.

### operation

Operation being executed, such as a Kubernetes verb (`get`, `list`, `create`, `update`, `patch`, `delete`, `watch`) or a discovered-resource action (`create` or `update`).

### resource_type

Resource category targeted by the operation.

### result

Outcome classification for the request or event.

### service

Logical service emitting the metric (for example, `operator`, `adr_service`, `aio_sse_connector`, `aio_rest_connector`, or `aio_mqtt_connector`).

### status

Whether the call succeeded (`success`) or failed (`error`).

### target

Watcher target kind. Values are `Device` or `Asset`.

### template_name

Name of the connector template that owns the deployment instance.

### wasm_status

Status of the WASM graph operation. For processing latency, values are `forwarded` (message returned by the graph), `filtered` (message dropped without error), or `failed` (graph returned an error). For graph creation, values are `succeeded` or `failed`.

## Related content

- [Configure observability](../deploy-iot-ops/howto-configure-observability.md)
