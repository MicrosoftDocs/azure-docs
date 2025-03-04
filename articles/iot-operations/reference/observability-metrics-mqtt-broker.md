---
title: Metrics for MQTT broker
description: Available observability metrics for MQTT broker to monitor the health and performance of your solution.
author: kgremban
ms.author: kgremban
ms.topic: reference
ms.custom:
  - ignite-2023
ms.date: 11/15/2024

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Metrics for MQTT broker

MQTT broker provides a set of observability metrics that you can use to monitor and analyze the health of your solution. This article describes the available metrics for the MQTT broker.

To configure options for these metrics, see [Configure MQTT broker diagnostic settings](../manage-mqtt-broker/howto-broker-diagnostics.md).

## MQTT Connect `metriccategory` user property

When a client connects to the broker, it can include a user property called `metriccategory` in the connect packet. The broker then tags all session-driven metrics (like publishes and subscribes) with this `metriccategory` as `category`.

For example, if the self-check probe connects with `metriccategory=broker_selftest`, the broker tags all metrics from these sessions with `category=broker_selftest`.

This feature helps dashboards show traffic sources without the high cardinality issues of tagging metrics with topics.

Sessions without a `metriccategory` are tagged as `category=uncategorized`.

## Messaging metrics

All metrics include the `hostname` tag to identify the pod that generated the metrics. The tags listed in the individual metric descriptions are added to this tag.

| Metric | Description | Tags |
|--------|-------------|------|
| aio_broker_publishes_received | On the frontend, this metric represents how many incoming publish packets are received from clients. For the backend, this metric represents how many internal messages are sent from the frontend nodes. | `category` |
| aio_broker_publishes_sent | On the frontend, this metric represents how many outgoing publish packets are sent to clients. If multiple clients are subscribed to the same topic, this metric counts each message sent, even if they have the same payload. This count doesn't count ack packets. For the backend, this metric represents how many internal messages are sent to the frontend nodes. | `category` |
| aio_broker_payload_bytes_received | The sum of the payloads of all publishes received. This sum doesn't include the size of the properties or publish packets themselves. | `category` |
| aio_broker_payload_bytes_sent | The sum of the payloads of all publishes sent. This sum doesn't include the size of the properties or publish packets themselves. | `category` |
| aio_broker_authentication_successes | This metric counts the number of successful authentication requests. | `category` |
| aio_broker_authentication_failures | This metric counts the number of failed authentication requests. For an errorless authentication server, `aio_broker_authentication_successes` + `aio_broker_authentication_failures` = `aio_broker_publishes_received = publishes_sent` | `category` |
| aio_broker_authentication_deny | This metric counts the number of denied authentication requests. | `category` |
| aio_broker_authorization_allow | This metric counts successfully authorization requests. This metric should always be less than or equal to `aio_broker_authentication_successes`. | `category` |
| aio_broker_authorization_deny | This metric counts denied authorization requests. This metric should always be less than or equal to `aio_broker_authentication_successes`. | `category` |
| aio_broker_qos0_messages_dropped | This metric counts the number of dropped QoS0 messages for any reason. The category `direction` is either `incoming` or `outgoing`. | `category`, `direction` |
| aio_broker_backpressure_packets_rejected | This metric counts number of rejected packets due to backpressure. A packet is rejected if the system is at 97% capacity. | |
| aio_broker_store_retained_messages | This metric counts how many retained messages are stored on the broker. | |
| aio_broker_store_retained_bytes | This metric counts how many bytes are stored via retained messages on the broker. | |
| aio_broker_store_will_messages | This metric counts how many will messages are stored on the broker. | |
| aio_broker_store_will_bytes | This metric counts how many bytes are stored via will messages on the broker. | |
| aio_broker_number_of_routes | Counts number of routes. | |
| aio_broker_connect_route_replication_correctness | Describes if a connection request from a self test client is replicated correctly along a specific route. | |
| aio_broker_connect_latency_route_ms | Describes the time interval between a self test client sending a CONNECT packet and receiving a CONNACK packet. This metric is generated per route. The metric is generated only if a CONNECT is successful. | |
| aio_broker_connect_latency_last_value_ms | An estimated p99 of `connect_latency_route_ms`. | |
| aio_broker_connect_latency_mu_ms | The mean value of `connect_latency_route_ms`. | |
| aio_broker_connect_latency_sigma_ms | The standard deviation of `connect_latency_route_ms`. | |
| aio_broker_subscribe_route_replication_correctness | Describes if a subscribe request from a self test client is replicated correctly along a specific route. | |
| aio_broker_subscribe_latency_route_ms | Describes time interval between a self test client sending a SUBSCRIBE packet and receiving a SUBACK packet. This metric is generated per route. The metric is generated only if a SUBSCRIBE is successful. | |
| aio_broker_subscribe_latency_last_value_ms | An estimated p99 of `subscribe_latency_route_ms`. | |
| aio_broker_subscribe_latency_mu_ms | The mean value of `subscribe_latency_route_ms`. | |
| aio_broker_subscribe_latency_sigma_ms | The standard deviation of `subscribe_latency_route_ms`. | |
| aio_broker_unsubscribe_route_replication_correctness | Describes if an unsubscribe request from a self test client is replicated correctly along a specific route. | |
| aio_broker_unsubscribe_latency_route_ms | Describes the time interval between a self test client sending a UNSUBSCRIBE packet and receiving a UNSUBACK packet. This metric is generated per route. The metric is generated only if a UNSUBSCRIBE is successful. | |
| aio_broker_unsubscribe_latency_last_value_ms | An estimated p99 of `unsubscribe_latency_route_ms`. | |
| aio_broker_unsubscribe_latency_mu_ms | The mean value of `unsubscribe_latency_route_ms`. | |
| aio_broker_unsubscribe_latency_sigma_ms | The standard deviation of `subscribe_latency_route_ms`. | |
| aio_broker_publish_route_replication_correctness | Describes if an unsubscribe request from a self test client is replicated correctly along a specific route. | |
| aio_broker_publish_latency_route_ms | Describes the time interval between a self test client sending a PUBLISH packet and receiving a PUBACK packet. This metric is generated per route. The metric is generated only if a PUBLISH is successful. | |
| aio_broker_publish_latency_last_value_ms | An estimated p99 of `publish_latency_route_ms`. | |
| aio_broker_publish_latency_mu_ms | The mean value of `publish_latency_route_ms`. | |
| aio_broker_publish_latency_sigma_ms | The standard deviation of `publish_latency_route_ms`. | |
| aio_broker_payload_check_latency_last_value_ms | An estimated p99 of latency check of the last value. | |
| aio_broker_payload_check_latency_mu_ms | The mean value of latency check. | |
| aio_broker_payload_check_latency_sigma_ms | The standard deviation of latency of the payload. | |
| aio_broker_payload_check_total_messages_lost | The count of payload total message lost. | |
| aio_broker_payload_check_total_messages_received | The count of total number of messages received. | |
| aio_broker_payload_check_total_messages_sent | The count of total number of messages sent. | |
| aio_broker_ping_correctness | Describes whether the ping from self-test client works correctly. | |
| aio_broker_ping_latency_last_value_ms | An estimated p99 of ping operation of the last value. | |
| aio_broker_ping_latency_mu_ms | The mean value of ping check. | |
| aio_broker_ping_latency_route_ms | The ping latency in milliseconds for a specific route. | |
| aio_broker_ping_latency_sigma_ms | The standard deviation of latency of the ping operation. | |
| aio_broker_publishes_processed_count | Describes the processed counts of message published. | |
| aio_broker_publishes_received_per_second | Counts the number of published messages received per second. | |
| aio_broker_publishes_sent_per_second | Counts the number of sent messages received per second. | |

## Broker operator health metrics

This set of metrics tracks the [cardinality state of the broker](../manage-mqtt-broker/howto-configure-availability-scale.md). Each desired metric is paired with a reported metric to show the current state. These metrics indicate the number of healthy pods from the broker's perspective, which might differ from Kubernetes' reports.

For example, if a backend node restarts but doesn't reconnect to its chain, there can be a discrepancy in health reports. Kubernetes might report the pod as healthy, while the broker reports it as down because it isn't functioning properly.

| Desired Metric | Reported Metric |
|----------------|-----------------|
| aio_broker_backend_replicas | aio_broker_backend_replicas_current |
| aio_broker_backend_vertical_chain | aio_broker_backend_vertical_chain_current |
| aio_broker_frontend_replicas | aio_broker_frontend_replicas_current |

> [!NOTE]
> `backend_vertical_chain_current` reports the number of healthy nodes in the least healthy chain. For example, if the expected chain length is 4, and three chains have 4 healthy nodes while one chain has only 2 healthy nodes, `backend_vertical_chain_current` would report 2.

## Connection and subscription metrics

These metrics provide observability for the connections and subscriptions on the broker.

| Metric | Description | Tags |
|--------|-------------|------|
| aio_broker_total_sessions | On the frontend and single node broker, this metric represents how many client sessions there are. This count doesn't include disconnected persistent sessions, because a client might reconnect to a different frontend node. For the backend, this metric represents its connections to the other nodes in its chain. On the operator, this metric represents how many front and backend nodes are connected. For the authentication server, this metric represents how many frontend workers are connected (1 per frontend per thread). | `mqtt_version`: [v3/v5] <br> Backend Node Only Tags: <br> `is_tail`: [true/false] <br> `chain_id`: [n] |
| aio_broker_store_total_sessions | This metric represents how many sessions are in backend chain. Backend nodes in the same chain should report the same number of sessions, and the sum of each chain should equal the sum of the frontend's total_sessions. | `is_persistent`: [true/false] <br> `is_tail`: [true/false] <br> `chain_id`: [n] |
| aio_broker_connected_sessions | Same as `aio_broker_total_sessions`, except only sessions that have an active connection. | |
| aio_broker_store_connected_sessions | Same as `aio_broker_store_total_sessions`, except only sessions that have an active connection. If `is_persistent` is false, this count should be equal to total sessions. | |
| aio_broker_total_subscriptions | On the frontend, this metric represents how many subscriptions the currently connected sessions have. This count doesn't include disconnected persistent sessions, because a client might reconnect to a different frontend node. On the operator, this metric represents the frontend and backend nodes. For the authentication server, this metric represents how many frontend workers are connected (1 per frontend per thread). | |
| aio_broker_store_total_subscriptions | This metric represents how many subscriptions are in backend chain. Backend nodes in the same chain should report the same number of subscriptions. This count doesn't necessarily match the frontend's `total_subscriptions`, since this metric tracks disconnected persistent sessions as well. | |

## State store metrics

This set of metrics tracks the overall state of the [state store](../create-edge-apps/overview-state-store.md).

| Metric | Description | Tags |
|--------|-------------|------|
| aio_broker_state_store_deletions | This metric counts the number of delete key requests received, including both successful deletes and errors. | |
| aio_broker_state_store_insertions | This metric counts the number of new key insert requests received, including both successful insertions and errors. | |
| aio_broker_state_store_keynotify_requests | This metric counts the number of requests to monitor key changes (KEYNOTIFY) received, including both successful modifications and errors. | |
| aio_broker_state_store_modifications | This metric counts the number of modify key requests received, including both successful modifications and errors. | |
| aio_broker_state_store_notifications_sent | This metric counts the number of notification messages the state store sends when a key value changes and a client are registered via KEYNOTIFY. | |
| aio_broker_state_store_retrievals | This metric counts the number of key value retrieval requests received, including both successful retrievals and errors. | |

## Disk-backed message buffer metrics

These metrics provide observability for the [disk-backed message buffer](../manage-mqtt-broker/howto-disk-backed-message-buffer.md).

| Metric | Description | Tags |
|--------|-------------|------|
| aio_broker_buffer_pool_used_percent | Reports the percentage of used buffer for a single frontend or backend buffer pool. | `name` |
| aio_broker_disk_transfers_completed | Reports the number of disk transfers completed on a given backend pod. Tracks the total number of publishes transferred from a buffer pool to disk. | |
| aio_broker_disk_transfers_failed | Reports the number of disk transfers that failed on a given backend pod. | |

> [!NOTE]
> Only certain backend buffer pools, specifically the dynamic ones named "reader", use the disk-backed message buffer feature. These pools store subscriber message queues and transfer elements to disk when usage exceeds 75%.

## Failure recovery metrics

| Metric | Description |
|--------|-------------|
| aio_broker_store_transfer_batch_receiver_message_count | This metric reports the number of messages received by the store transfer receiver. This count should be equal to the number of messages sent by the store transfer sender. |
| aio_broker_store_transfer_batch_sender_transfer_bytes | This metric reports the number of bytes sent by the store transfer sender. |
| aio_broker_store_transfer_batch_sender_message_count | This metric reports the number of messages sent by the store transfer sender. |
| aio_broker_store_transfer_ack_event_receiver_message_count | This metric reports the number of ack event messages received by the store transfer receiver. This count should be equal to the number of ack event messages sent by the store transfer sender. |
| aio_broker_store_transfer_ack_event_sender_message_count | This metric reports the number of ack event messages sent by the store transfer sender. |
| aio_broker_store_transfer_ack_event_sender_transfer_bytes | This metric reports the number of bytes sent by the store transfer sender for ack events. |
| aio_broker_store_transfer_patch_tracker_receiver_message_count | This metric reports the number of patch tracker messages received by the store transfer receiver. This count should be equal to the number of patch tracker messages sent by the store transfer sender. |
| aio_broker_store_transfer_patch_tracker_sender_message_count | This metric reports the number of patch tracker messages sent by the store transfer sender. |

## Developer metrics

These metrics are useful for developer debugging.

| Metric | Description |
|--------|-------------|
| aio_broker_patch_tracker_held_patches | This metric reports how many patches are currently held within a node in a chain. |
| aio_broker_ack_handler_pending_transactions | This metric reports how many transactions are currently pending in the ack handler. |
| aio_broker_client_connected | This metric reports how many clients are connected. |
| aio_broker_client_disconnected | This metric reports how many clients are disconnected. |
| aio_broker_client_removed | This metric reports how many clients are removed. |

## Related content

- [Configure MQTT broker diagnostic settings](../manage-mqtt-broker/howto-broker-diagnostics.md).
- [Configure observability](../configure-observability-monitoring/howto-configure-observability.md)
