---
title: Metrics for Azure IoT MQ
titleSuffix: Azure IoT Operations
description: Available observability metrics for Azure IoT MQ to monitor the health and performance of your solution.
author: timlt
ms.author: timlt
ms.topic: reference
ms.custom:
  - ignite-2023
ms.date: 11/1/2023

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Metrics for Azure IoT MQ

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT MQ Preview provides a set of observability metrics that you can use to monitor and analyze the health of your solution.  This article describes the available metrics for MQ and the MQ cloud connector.

## MQ metrics

> [!div class="mx-tdBreakAll"]
> | Metric name                                      | Definition                                                                                     | 
> | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
> | aio_mq_publishes_received                        | On the front end, represents how many incoming publish packets have been received from clients. For the backend, represents how many internal messages have been sent from the front end nodes.  |
> | aio_mq_publishes_sent                            | On the front end, represents how many outgoing publish packets have been sent to clients. If multiple clients are subscribed to the same topic, this metric counts each message sent, even if they have the same payload. The metric does not count `ack` packets. For the backend, this metric represents how many internal messages have been sent to the front end nodes.  |
> | aio_mq_authorization_allow                       | Counts how many times an authenticated client has successfully authorized. This should always be less than or equal to `authentication_successes`.  |
> | aio_mq_authorization_deny                        | Counts how many times an authenticated client has been denied. This should always be less than or equal to `authentication_successes`.  |
> | aio_mq_total_sessions                            | On the front end and single node broker, represents how many client sessions there are. The metric does not include disconnected persistent sessions, because a client might reconnect to a different front end node. For the backend, this represents its connections to the other nodes in its chain. On the operator, represents how many front and back end nodes are connected. For the authentication server, represents how many front end workers are connected (one per front end per thread).  |
> | aio_mq_store_total_sessions                      | This is a back end specific metric that represents how many sessions are managed by the backend's chain. Backend nodes in the same chain should report the same number of sessions, and the sum of each chain should equal the sum of the front end's `total_sessions`.  |
> | aio_mq_connected_sessions                        | Similar to `aio_mq_total_sessions`, except that it represents only sessions that have an active connection.  |
> | aio_mq_backpressure_packets_rejected             | This is a count of how many packets rejected in MQTT back pressure.  |
> | aio_mq_store_connected_sessions                  | Similar to `aio_mq_store_total_sessions`, except that it only refers to sessions that have an active connection. If `is_persistent` is false, this should be equal to total sessions.  |
> | aio_mq_total_subscriptions                       | On the front end, represents how many subscriptions the currently connected sessions have. This does not include disconnected persistent sessions, because a client might reconnect to a different front end node. For the backend, represents other nodes in its chain connecting to it. On the operator, this represents the front and back end nodes. For the authentication server, this represents how many front end workers are connected (one per front end per thread).  |
> | aio_mq_store_total_subscriptions                 | This is a back end specific metric that represents how many subscriptions are managed by the backend's chain. Backend nodes in the same chain should report the same number of subscriptions. This will not necessarily match the front end's `total_subscriptions`, since this metric tracks disconnected persistent sessions as well.  |
> | aio_mq_authentication_successes                  | Counts how many times a client has successfully authenticated.  |
> | aio_mq_authentication_failures                   | Counts how many times a client has failed to authenticate. For an errorless authentication server: `authentication_successes` + `authentication_failures` = `publishes_received` = `publishes_sent`. |
> | aio_mq_authentication_deny                       | Counts how many times a client has denies to authenticate.   |
> | aio_mq_number_of_routes                          | Counts number of routes.  |
> | aio_mq_connect_route_replication_correctness     | Describes if a connection request from a self test client is replicated correctly along a specific route.  |
> | aio_mq_connect_latency_route_ms                  | Describes the time interval between a self test client sending a CONNECT packet and receiving a CONNACK packet. This metric is generated per route. The metric is generated only if a CONNECT is successful.  |
> | aio_mq_connect_latency_last_value_ms             | An estimated p99 of `connect_latency_route_ms`.  |
> | aio_mq_connect_latency_mu_ms                     | The mean value of `connect_latency_route_ms`.  |
> | aio_mq_connect_latency_sigma_ms                  | The standard deviation of `connect_latency_route_ms`.  |
> | aio_mq_subscribe_route_replication_correctness   | Describes if a subscribe request from a self test client is replicated correctly along a specific route.  |
> | aio_mq_subscribe_latency_route_ms                | Describes time interval between a self test client sending a SUBSCRIBE packet and receiving a SUBACK packet. This metric is generated per route. The metric is generated only if a SUBSCRIBE is successful.  |
> | aio_mq_subscribe_latency_last_value_ms           | An estimated p99 of `subscribe_latency_route_ms`.  |
> | aio_mq_subscribe_latency_mu_ms                   | The mean value of `subscribe_latency_route_ms`.  |
> | aio_mq_subscribe_latency_sigma_ms                | The standard deviation of `subscribe_latency_route_ms`.  |
> | aio_mq_unsubscribe_route_replication_correctness | Describes if a unsubscribe request from a self test client is replicated correctly along a specific route.  |
> | aio_mq_unsubscribe_latency_route_ms              | Describes the time interval between a self test client sending a UNSUBSCRIBE packet and receiving a UNSUBACK packet. This metric is generated per route. The metric is generated only if a UNSUBSCRIBE is successful. |
> | aio_mq_unsubscribe_latency_last_value_ms         | An estimated p99 of `unsubscribe_latency_route_ms`.  |
> | aio_mq_unsubscribe_latency_mu_ms                 | The mean value of `unsubscribe_latency_route_ms`.  |
> | aio_mq_unsubscribe_latency_sigma_ms              | The standard deviation of `subscribe_latency_route_ms`.  |
> | aio_mq_publish_route_replication_correctness     | Describes if an unsubscribe request from a self test client is replicated correctly along a specific route.  |
> | aio_mq_publish_latency_route_ms                  | Describes the time interval between a self test client sending a PUBLISH packet and receiving a PUBACK packet. This metric is generated per route. The metric is generated only if a PUBLISH is successful.  |
> | aio_mq_publish_latency_last_value_ms             | An estimated p99 of `publish_latency_route_ms`.  |
> | aio_mq_publish_latency_mu_ms                     | The mean value of `publish_latency_route_ms`.  |
> | aio_mq_publish_latency_sigma_ms                  | The standard deviation of `publish_latency_route_ms`.  |
> | aio_mq_backend_replicas                          | This set of metrics tracks the overall state of the broker. These are paired metrics, where the first metric represents the desired state and the second metric represents the current state. These metrics show how many pods are healthy from the broker's perspective, and might not match with what k8s reports.  |
> | aio_mq_backend_replicas_current                  | This set of metrics tracks the overall state of the broker. These are paired metrics, where the first metric represents the desired state and the second metric represents the current state. These metrics show how many pods are healthy from the broker's perspective, and might not match with what k8s reports.   |
> | aio_mq_frontend_replicas                         | This set of metrics tracks the overall state of the broker. These are paired metrics, where the first metric represents the desired state and the second metric represents the current state. These metrics show how many pods are healthy from the broker's perspective, and might not match with what k8s reports.   |
> | aio_mq_frontend_replicas_current                 | This set of metrics tracks the overall state of the broker. These are paired metrics, where the first metric represents the desired state and the second metric represents the current state. These metrics show how many pods are healthy from the broker's perspective, and might not match with what k8s reports.   |
> | aio_mq_payload_bytes_received                    | Counts the message payload in bytes received.  |
> | aio_mq_payload_bytes_sent                        | Counts the message payload in bytes sent.  |
> | aio_mq_payload_check_latency_last_value_ms       | An estimated p99 of latency check of the last value.  |
> | aio_mq_payload_check_latency_mu_ms               | The mean value of latency check.  |
> | aio_mq_payload_check_latency_sigma_ms            | The standard deviation of latency of the payload. |
> | aio_mq_payload_check_total_messages_lost         | The count of payload total message lost.  |
> | aio_mq_payload_check_total_messages_receieved    | The count of total number of message received.  |
> | aio_mq_payload_check_total_messages_sent         | The count of total number of message sent.  |
> | aio_mq_ping_correctness                          | Describes whether the ping from self-test client works correctly.  |
> | aio_mq_ping_latency_last_value_ms                | An estimated p99 of ping operation of the last value.  |
> | aio_mq_ping_latency_mu_ms                        | The mean value of ping check.  |
> | aio_mq_ping_latency_route_ms                     | The ping latency in milliseconds for a specific route. |
> | aio_mq_ping_latency_sigma_ms                     | The standard deviation of latency of the ping operation.  |
> | aio_mq_publishes_processed_count                 | Describes the processed counts of message published.  |
> | aio_mq_publishes_received_per_second             | Counts the number of published messages received per second.  |
> | aio_mq_publishes_sent_per_second                 | Counts the number of sent messages received per second.  |
> | aio_mq_qos0_messages_dropped                     | Counts QoS0 messages dropped.  |
> | aio_mq_state_store_deletions                     | Counts the number of messages deleted that are stored in the system.  |
> | aio_mq_state_store_insertions                    | Counts the number of messages inserted that are stored in the system.  |
> | aio_mq_state_store_modifications                 | Counts the number of messages modified that are stored in the system. |
> | aio_mq_state_store_retrievals                    | Counts the number of messages retrieved that are stored in the system.  |
> | aio_mq_store_retained_bytes                      | Contains the number in bytes of messages retained in the system.  |
> | aio_mq_store_retained_messages                   | Contains the number of messages retained in the system.  |
> | aio_mq_store_will_bytes                          | Contains the bytes that cover the payload of the will messages in the system.  |

## Cloud connector metrics

### MQTT Bridge

> [!div class="mx-tdBreakAll"]
> | Metric name                                      | Definition                                                                                     | 
> | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
> | aio_mq_mqttbridge_active_connections_count       | Count of active connection to the Azure Event Grid MQTT broker. |
> | aio_mq_mqttbridge_number_of_routes               | Count of routes to the Azure Event Grid MQTT broker. |
> | aio_mq_mqttbridge_publish_bytes                  | The number in bytes of messaged published to the Azure Event Grid MQTT broker. |
> | aio_mq_mqttbridge_publishes_processed_count      | Count of processed messages published to the Azure Event Grid MQTT broker. |


### Event Hubs and Kafka

> [!div class="mx-tdBreakAll"]
> | Metric name                                      | Definition                                                                                     | 
> | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
> | aio_mq_kafka_cloud_bytes_received                | Messages in bytes received from Azure IoT MQ to Azure Event Hubs. |
> | aio_mq_kafka_cloud_bytes_sent                    | Messages in bytes sent from Azure Event Hubs to Azure IoT MQ. |
> | aio_mq_kafka_cloud_publishes_received            | Count of messages published from Azure IoT MQ to Azure Event Hubs. |
> | aio_mq_kafka_cloud_publishes_sent                | Count of messages from Azure Event Hubs to Azure IoT MQ. |
> | aio_mq_kafka_dmqtt_bytes_received                | Messages in bytes received from Azure Event Hubs to Azure IoT MQ. If the connector is online, this metric should equal the value of `aio_mq_kafka_cloud_bytes_sent`. |
> | aio_mq_kafka_dmqtt_bytes_sent                    | Messages in bytes published from Azure IoT MQ to Azure Event Hubs. If the connector is online, this metric should equal the value of `aio_mq_kafka_cloud_bytes_received`. |
> | aio_mq_kafka_dmqtt_publishes_received            | Counts of messages received from Azure Event Hubs to Azure IoT MQ. If the connector is online, this metric should equal the value of `aio_mq_kafka_cloud_publishes_sent`. |
> | aio_mq_kafka_dmqtt_publishes_sent                | Counts of messages published from Azure IoT MQ to Azure Event Hubs. If the connector is online, this metric should equal the value of `aio_mq_kafka_cloud_publishes_received`. |

### Data Lake

> [!div class="mx-tdBreakAll"]
> | Metric name                                      | Definition                                                                                     | 
> | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
> | aio_mq_datalake_cloud_publishes_sent             | Count of messages published from Azure Data Lake to Azure IoT MQ. |
> | aio_mq_datalake_dmqtt_bytes_received             | The number in bytes of messages that Azure IoT MQ received from Azure Data Lake. |
> | aio_mq_datalake_dmqtt_publishes_received         | The number in bytes of messages published from Azure IoT MQ to Azure Data Lake. |



## Related content

- [Configure observability](../monitor/howto-configure-observability.md)
