---
title: Health status reason codes reference
description: Reference guide for health status reason codes used by Azure IoT Operations components to report runtime health issues.
author: sethmanheim
ms.author: sethm
ms.reviewer: vakavali
ms.date: 04/29/2026
ms.topic: reference
ai-usage: ai-assisted
---

# Health status reason codes reference

When Azure IoT Operations resources report **Degraded** or **Unavailable** health status, they include a reason code that identifies the underlying issue. This reference helps you troubleshoot health status problems more effectively by providing detailed explanations and recommended actions for each reason code.

> [!NOTE]
> In the following descriptions, placeholders such as `{error}`, `{e}`, or `{err}` represent the actual error message returned at runtime.

## Data flows

| Reason code | Description | Recommended action |
|------------|-------------|--------------------|
| `DataflowTransformSourceSchemaRetrievalFailed` | Failed to retrieve the source schema for a transform. | Verify schema reference and schema registry connectivity. |
| `DataflowTransformTargetSchemaRetrievalFailed` | Failed to retrieve the target schema for a transform. | Verify schema reference and schema registry connectivity. |
| `DataflowTransformConfigurationFailed` | Failed to build the transform pipeline. | Review the data flow transform configuration. |
| `DataflowTransformEnrichDataFailed` | Failed to enrich data during transform processing. | Check Broker state store connectivity and dataset configuration. |
| `DataflowTransformSourceChannelClosed` | Source input channel closed unexpectedly. | Restart the data flow pipeline if the issue persists. |
| `DataflowTransformMapperFailed` | One or more transform steps failed during processing. | Review transform configuration and restart the pipeline. |
| `DataflowGraphModuleDownloadFailed` | Failed to download the WASM graph module. | Verify graph artifact availability and registry connectivity. |
| `DataflowGraphModuleDownloadChannelClosed` | Internal channel closed during graph artifact download. | Check pod logs and restart the pod. |
| `DataflowGraphInstantiationFailed` | WASM runtime failed to instantiate the graph. | Verify module compatibility and resource availability; restart the pod. |
| `DataflowGraphConfigurationFailed` | Failed to build the graph pipeline. | Validate graph topology and operation configuration. |
| `DataflowGraphSinkChannelClosed` | Output channel closed unexpectedly. | Restart the pod to recover. |
| `DataflowGraphOutputSendFailed` | Failed to forward processed messages to the target connector. | Check downstream pipeline and restart the pod. |
| `DataflowGraphProcessingFailed` | Unrecoverable error during graph message processing. | Check WASM module logs and restart the pod. |
| `DataflowGraphSourceChannelClosed` | Source input channel disconnected unexpectedly. | Verify source connector health and restart the pod. |
| `DataflowGraphSourceSchemaRetrievalFailed` | Failed to retrieve source schema for the graph. | Verify schema registry connectivity and configuration. |
| `DataflowGraphNoInputHandle` | No input handle found for the graph. | Restart the pod to recover. |
| `DataflowGraphModuleDownloadTimeout` | Graph artifact download didn't complete within the timeout. | Verify artifact existence and controller availability. |
| `DataflowGraphModuleRuntimeFault` | WASM module panicked during execution. | Check pod logs and backtrace; restart the pod. |
| `DataflowMqttSourceConnectionFailed` | MQTT source failed to connect to the broker. | Verify MQTT endpoint, authentication, and network connectivity. |
| `DataflowMqttSourceConfigurationError` | MQTT source failed due to a configuration error. | Review MQTT source configuration. |
| `DataflowMqttSourceSubscriptionFailed` | MQTT subscription request failed. | Verify topic existence and permissions. |
| `DataflowKafkaSourceConnectionFailed` | Kafka source failed to connect to the broker. | Verify broker availability, authentication, and consumer group configuration. |
| `DataflowMqttTargetConfigurationError` | MQTT target encountered a fatal configuration error. | Review target configuration and endpoint settings. |
| `DataflowMqttTargetConnectionFailed` | MQTT target failed to connect to the broker. | Verify endpoint and authentication settings. |
| `DataflowKafkaTargetConfigurationError` | Kafka target failed due to a configuration error. | Review Kafka target configuration. |
| `DataflowKafkaTargetConnectionFailed` | Kafka target failed to connect to the broker. | Verify broker availability and authentication. |
| `DataflowKafkaTargetSendFailed` | Failed to send data to Kafka. | Check broker health and retry behavior. |
| `DataflowKafkaTargetEndpointUnreachable` | Kafka target encountered a fatal client error. | Verify endpoint reachability and restart the client. |
| `DataflowAdxTargetAuthenticationFailed` | Failed to authenticate to Azure Data Explorer. | Verify identity and permissions. |
| `DataflowAdxTargetConfigurationError` | ADX target encountered a configuration or channel error. | Review target configuration and connectivity. |
| `DataflowAdxTargetSendFailed` | Failed to write data to Azure Data Explorer. | Verify ingestion endpoint and retry behavior. |
| `DataflowOtelTargetConfigurationError` | Failed to create OpenTelemetry exporter. | Verify OTEL endpoint and configuration. |
| `DataflowOtelTargetProcessingError` | Failed to process or batch telemetry data. | Review payload format and OTEL configuration. |
| `DataflowOtelTargetSendFailed` | Failed to send telemetry data. | Verify OTEL endpoint reachability. |
| `DataflowObjectStoreTargetAuthenticationFailed` | Authentication failed for object storage. | Verify credentials and permissions. |
| `DataflowObjectStoreTargetConfigurationError` | Object store configuration is missing or invalid. | Review store configuration. |
| `DataflowObjectStoreTargetSendFailed` | Failed to write data to object storage. | Verify endpoint availability and retry behavior. |
| `DataflowDeltaLakeTargetConnectionTimeout` | Delta Lake target connection timed out. | Verify endpoint reachability. |
| `DataflowDeltaLakeTargetAuthenticationFailed` | Delta Lake authentication failed. | Verify identity and permissions. |
| `DataflowDeltaLakeTargetConfigurationError` | Delta Lake configuration is missing or invalid. | Review Delta Lake configuration. |
| `DataflowDeltaLakeTargetSendFailed` | Failed to write data to Delta Lake. | Verify storage endpoint and retry behavior. |

## Assets, devices, and connectors

| Reason code | Description | Suggested action |
|------------|-------------|------------------|
| `RestConnectorHttpClientCreationFailure` | Failed to create REST client: `{error}`. | Check TLS configuration and authentication settings. |
| `RestConnectorHttpRequestFailure` | HTTP request failed after retries: `{error}`. | Verify endpoint availability and network connectivity. |
| `RestConnectorSchemaGenerationFailure` | Failed to create message schema. Response data might be malformed or in an unexpected format. | Validate the response payload format and schema expectations. |
| `RestConnectorWasmProcessingFailure` | WASM graph processing failed: `{err}`. | Check WASM module configuration and input data format. |
| `SseConnectorSchemaGenerationFailure` | Failed to create message schema. Event data might be malformed or in an unexpected format. | Validate the event payload and schema configuration. |
| `SseConnectorStreamClosed` | SSE client stream closed unexpectedly. | Verify endpoint stability and restart the connector if needed. |
| `SseConnectorStreamError` | SSE stream error: `{e}`. | Check endpoint availability and network connectivity. |
| `MqttConnectorActionNotReady` | Management action is not ready: `{reason}`. | Verify that the management action prerequisites are satisfied. |
| `MqttConnectorPublishFailed` | PUBACK indicated failure: `{e}`. | Check broker connectivity, topic configuration, and permissions. |
| `MqttConnectorPublishFailed` | Failed to complete publish: `{e}`. | Verify MQTT broker availability and authentication settings. |
| `MqttConnectorPublishFailed` | Failed to publish: `{e}`. | Validate topic configuration and broker health. |
| `MqttConnectorSchemaCreationFailed` | Failed to create message schema, likely due to malformed data. | Inspect input payload and schema definitions. |
| `MqttConnectorSchemaReportingFailed` | Failed to report message schema, likely due to malformed data. | Validate schema reporting configuration and payload format. |
| `MqttConnectorWasmGraphCreationFailed` | Failed to create or load WASM graph for data transformation. | Verify WASM graph configuration and availability. |
| `MqttConnectorWasmGraphUpdateFailed` | Failed to update WASM graph for data transformation. | Check WASM graph update process and dependencies. |
| `MqttConnectorWasmProcessingFailed` | WASM graph failed to process message: `{err}`. | Inspect WASM module logs and input data. |
| `MqttConnectorWasmSchemaCreationFailed` | Failed to create message schema from WASM-processed data. | Validate WASM output and schema expectations. |
| `OpcUaConnectorAssetConnected`         | The asset is connected and data collection is active.        | No action required.          |
| `OpcUaConnectorAssetDisconnected`      | The asset lost connectivity to the OPC UA server.            | Check the device endpoint health. If the endpoint is also unavailable, resolve the endpoint issue first. If the endpoint is healthy, review the asset's OPC UA node configuration. |
| `OpcUaConnectorInboundEndpointInvalidConfiguration` | The endpoint configuration is invalid and the connector cannot establish a connection.                      | Review the endpoint configuration in your device resource. Check the endpoint URL, security mode, and authentication settings. |
| `OpcUaConnectorCertificateRejected`                 | The OPC UA server rejected the connector's certificate, or the connector rejected the server's certificate. | Ensure that certificates are properly configured and trusted on both the connector and the OPC UA server.                      |
| `OpcUaConnectorInboundEndpointConnected`            | The connector successfully connected to the OPC UA server endpoint.                                         | No action required.                                                                                                            |
| `OpcUaConnectorInboundEndpointDisconnected`         | The connector lost its connection to the OPC UA server endpoint.                                            | Check that the OPC UA server is running and reachable from the edge cluster. Verify network connectivity and firewall rules.   |
| `OpcUaConnectorInboundEndpointInvalidConfiguration` | The endpoint configuration is invalid and the connector cannot establish a connection.                      | Review the endpoint configuration in your device resource. Check the endpoint URL, security mode, and authentication settings. |
| `OpcUaConnectorCertificateRejected`                 | The OPC UA server rejected the connector's certificate, or the connector rejected the server's certificate. | Ensure that certificates are properly configured and trusted on both the connector and the OPC UA server.                      |

## Broker

| Reason code | Description | Suggested action |
|------------|-------------|------------------|
| `BrokerReplicaFailed` | Broker is in a failed state. | Collect and review the support bundle. |
| `BrokerPartitionFailed` | At least one backend replica is down. | Check broker replica health and restart failed replicas if necessary. |
| `BrokerProbeFailed` | Probe failed: Failed Operation CONNECT (1/8). | Verify broker connectivity, configuration, and network conditions. |

## Related content

- [Unified health status reporting and observability](../configure-observability-monitoring/health-status-reporting.md)
- [Configure observability for your Azure IoT Operations deployment](../configure-observability-monitoring/howto-configure-observability.md)