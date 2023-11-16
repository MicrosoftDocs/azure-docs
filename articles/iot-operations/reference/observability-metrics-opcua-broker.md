---
title: Metrics for Azure IoT OPC UA Broker
# titleSuffix: Azure IoT Operations
description: Available observability metrics for Azure IoT OPC UA Broker to monitor the health and performance of your solution.
author: timlt
ms.author: timlt
ms.topic: reference
ms.custom:
  - ignite-2023
ms.date: 11/1/2023

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Metrics for Azure IoT OPC UA Broker

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT OPC UA Broker Preview provides a set of observability metrics that you can use to monitor and analyze the health of your solution. This article lists the available metrics for OPC UA Broker. The following sections group related sets of metrics, and list the name and description for each metric.

## Crosscutting

> [!div class="mx-tdBreakAll"]
> | Metric name                                 | Definition                                                                               |
> | ------------------------------------------- | --------- | 
> | aio_opc_MQTT_message_publishing_retry_count | The number of retries that it took to publish an MQTT message.                            | 
> | aio_opc_MQTT_message_publishing_duration    | The span of time to publish a message to the MQTT broker and receive an acknowledgement.  |


## Supervisor

> [!div class="mx-tdBreakAll"]
> | Metric name                                       | Definition                                                                         | 
> | ------------------------------------------------- | ---------------------------------------------------------------------------------   | 
> | aio_opc_asset_count                               | The number of assets that are currently deployed.                                                                                                                       |
> | aio_opc_endpoint_count                            | The number of asset endpoint profiles that are deployed.                                                                                                                |
> | aio_opc_asset_datapoint_count                     | The number of data points that are defined across all assets.                                                                                                           |
> | aio_opc_asset_event_count                         | The number of events that are defined across all assets.                                                                                                                |
> | aio_opc_runtime_supervisor_settings_updates_count | The number of times the application settings were updated.                                                                                                              |
> | aio_opc_connector_restart_count                   | The number of times a connector instance had to be restarted.                                                                                                           |
> | aio_opc_connector_failover_duration               | The duration of a connector instance failover. This spans from when the connector was detected as missing until the passive connector instance confirms its activation. |
> | aio_opc_connector_asset_count                     | The number of assets assigned per connector instance.                                                                                                                   |
> | aio_opc_connector_endpoint_count                  | The number of endpoints assigned per connector instance.                                                                                                                |
> | aio_opc_connector_load                            | A number that indicates the load per connector instance.                                                                                                                |
> | aio_opc_schema_connector_count                    | The number of connector instances per schema.                                                                                                                           |

## Sidecar

> [!div class="mx-tdBreakAll"]
> | Metric name                                  | Definition                                                                              |
> | -------------------------------------------- | ---------------------------------------------------------------------------------------  | 
> | aio_opc_message_egress_size                  | The number of bytes for telemetry sent by the assets.                                                                                                                                 | 
> | aio_opc_method_request_count                 | The number of method invocations received.                                                                                                                                            | 
> | aio_opc_method_response_count                | The number of method invocations that have been answered.                                                                                                                             | 
> | aio_opc_module-connector_error_receive_count | The number of error signals received by the module connector.                                                                                                                         | 
> | aio_opc_MQTT_queue_ack_size                  | The number of incoming MQTT messages with QoS higher than 0 which delivery acknowledgement is yet to be sent to MQTT broker.                                                          |
> | aio_opc_MQTT_queue_notack_size               | The number of incoming MQTT messages with QoS higher than 0 in the acknowledgement queue which acknowledgement period timed out due to delay in acknowledgement of previous messages. |
> | aio_opc_MQTT_message_processing_duration     | The duration of the processing of messages received from the MQTT broker (method invocations, writes).                                                                                |


## OPC UA Connector

> [!div class="mx-tdBreakAll"]
> | Name                                       | Definition                                                                                | 
> | ------------------------------------------ | ------------------------------------------------------------------------------------------ |
> | aio_opc_output_queue_count                 | The number of asset telemetry items (data changes or events) that are queued for publish to the MQTT broker.                                                                            |
> | aio_opc_session_browse_invocation_count    | The number of times browse was invoked for sessions.                                                                                                                                    | 
> | aio_opc_subscription_transfer_count        | The number of times a subscription was transferred.                                                                                                                                     | 
> | aio_opc_asset_telemetry_data_change_count  | The number of asset data changes that were received.                                                                                                                                    |
> | aio_opc_asset_telemetry_event_count        | The number of asset events that were received.                                                                                                                                          |
> | aio_opc_asset_telemetry_value_change_count | The number of asset value changes that were received.                                                                                                                                   | 
> | aio_opc_session_connect_duration           | The duration of the OPC UA session connection.                                                                                                                                          |
> | aio_opc_data_change_processing_duration    | The processing duration of data changes received from an asset. This spans from when the connector receives the event until the MQTT broker provides a publish acknowledgement.         |
> | aio_opc_event_processing_duration          | HThe processing duration of events received from an asset. This spans from when the connector receives the event until the MQTT broker provides a publish acknowledgement.              |


## Related content

- [Configure observability](../monitor/howto-configure-observability.md)
