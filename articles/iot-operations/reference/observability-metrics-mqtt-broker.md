---
title: Metrics for MQTT broker
description: Available observability metrics for MQTT broker to monitor the health and performance of your solution.
author: dominicbetts
ms.author: dobett
ms.topic: reference
ms.custom:
  - ignite-2023
ms.date: 11/15/2024

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Metrics for MQTT broker

The MQTT broker emits observability metrics that you can use to monitor the health of your solution. This article lists the available metrics.

To configure options for these metrics, see [Diagnostics](../deployment-plan/deployment-planning-diagnostics.md).

Many metrics are tagged with a [`category`](#category) dimension, which clients set by including a `metriccategory` user property in the MQTT CONNECT packet. Sessions without a `metriccategory` are tagged as `category=uncategorized`.

## Messaging metrics

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_broker_publishes_received | Counter | Number of incoming PUBLISH packets received from clients. | [`namespace`](#namespace), [`hostname`](#hostname), [`category`](#category) |
| aio_broker_publishes_sent | Counter | Number of outgoing PUBLISH packets sent to clients. Counts each delivery separately even if multiple clients receive the same payload. Doesn't count acknowledgment (`PUBACK`) packets. | [`namespace`](#namespace), [`hostname`](#hostname), [`category`](#category) |
| aio_broker_payload_bytes_received | Counter | Number of payload bytes for all PUBLISH packets received. Doesn't include MQTT packet overhead or properties. | [`namespace`](#namespace), [`hostname`](#hostname), [`category`](#category) |
| aio_broker_payload_bytes_sent | Counter | Number of payload bytes for all PUBLISH packets sent. Doesn't include MQTT packet overhead or properties. | [`namespace`](#namespace), [`hostname`](#hostname), [`category`](#category) |
| aio_broker_authentication_successes | Counter | Number of successful client authentications. | [`namespace`](#namespace), [`hostname`](#hostname), [`category`](#category) |
| aio_broker_authentication_failures | Counter | Number of failed client authentications. A failure is an error that prevents the authentication check. | [`namespace`](#namespace), [`hostname`](#hostname), [`category`](#category) |
| aio_broker_authentication_deny | Counter | Number of denied client authentications. | [`namespace`](#namespace), [`hostname`](#hostname), [`category`](#category) |
| aio_broker_authorization_allow | Counter | Number of successful client authorizations. | [`namespace`](#namespace), [`hostname`](#hostname), [`category`](#category) |
| aio_broker_authorization_deny | Counter | Number of denied client authorizations. | [`namespace`](#namespace), [`hostname`](#hostname), [`category`](#category) |
| aio_broker_authorization_failures | Counter | Number of failed client authorizations. A failure is an error that prevents the authorization check. | [`namespace`](#namespace), [`hostname`](#hostname), [`category`](#category) |
| aio_broker_qos0_messages_dropped | Counter | Number of QoS 0 messages dropped because of high volume or memory limits. | [`namespace`](#namespace), [`hostname`](#hostname), [`category`](#category), [`direction`](#direction) |
| aio_broker_store_retained_messages | Gauge | Retained messages currently stored. | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |
| aio_broker_store_retained_bytes | Gauge | Bytes used by retained message payloads. Doesn't include metadata overhead. | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |
| aio_broker_store_will_messages | Gauge | Will messages currently stored. | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |
| aio_broker_store_will_bytes | Gauge | Bytes used by will message payloads. Doesn't include metadata overhead. | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |
| aio_broker_store_expired_messages | Counter | Messages that expired before delivery. | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |

## Memory and backpressure metrics

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_broker_buffer_pool_used_percent | Gauge | Buffer pool utilization percentage. When a pool reaches about 75% usage, the broker triggers backpressure. | [`namespace`](#namespace), [`hostname`](#hostname), [`name`](#name) |
| aio_broker_backpressure_packets_rejected_memory | Counter | Packets rejected because of memory backpressure. | [`namespace`](#namespace), [`hostname`](#hostname) |
| aio_broker_backpressure_packets_rejected_disk | Counter | Packets rejected because of disk backpressure. | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |

## Broker operator health metrics

Metrics for cluster health and replica management.

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_broker_backend_replicas | Gauge | Backend replica count. Must match the value specified in the `Broker` custom resource. | [`namespace`](#namespace), [`hostname`](#hostname) |
| aio_broker_backend_replicas_restarts | Counter | Backend replica restarts. Incremented each time a backend replica restarts. The `hostname` dimension indicates which replica restarted. | [`namespace`](#namespace), [`hostname`](#hostname) |
| aio_broker_backend_partitions | Gauge | Backend partition count. Must match the value specified in the `Broker` custom resource. | [`namespace`](#namespace), [`hostname`](#hostname) |
| aio_broker_backend_workers | Gauge | Backend worker count. Must match the value specified in the `Broker` custom resource. | [`namespace`](#namespace), [`hostname`](#hostname) |
| aio_broker_frontend_replicas | Gauge | Frontend replica count. Must match the value specified in the `Broker` custom resource. | [`namespace`](#namespace), [`hostname`](#hostname) |
| aio_broker_frontend_replicas_restarts | Counter | Frontend replica restarts. Incremented each time a frontend replica restarts. The `hostname` dimension indicates which frontend restarted. | [`namespace`](#namespace), [`hostname`](#hostname) |
| aio_broker_frontend_workers | Gauge | Frontend worker count. Must match the value specified in the `Broker` custom resource. | [`namespace`](#namespace), [`hostname`](#hostname) |
| aio_broker_version | Counter | Broker version information. | [`version`](#version) |

## Connection and subscription metrics

These metrics provide observability for the connections and subscriptions on the broker.

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_broker_store_total_sessions | Gauge | Total sessions managed by the backend store, including connected and offline sessions. | [`namespace`](#namespace), [`backend_chain`](#backend_chain), [`is_persistent`](#is_persistent) |
| aio_broker_store_connected_sessions | Gauge | Currently connected sessions in the store. | [`namespace`](#namespace), [`backend_chain`](#backend_chain), [`is_persistent`](#is_persistent) |
| aio_broker_store_subscriptions | Gauge | Total subscriptions in the store. Includes subscriptions from offline sessions. | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |
| aio_broker_store_shared_subscriptions | Gauge | Shared subscriptions in the store. Includes subscriptions from offline sessions. | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |

## State store metrics

This set of metrics tracks the overall state of the [state store](../develop-edge-apps/overview-state-store.md).

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_broker_state_store_deletions | Counter | Key deletion requests received (counts both successes and errors). | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |
| aio_broker_state_store_insertions | Counter | Key insertion requests received (counts both successes and errors). | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |
| aio_broker_state_store_keynotify_requests | Counter | KEYNOTIFY requests received (allows clients to monitor key changes). | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |
| aio_broker_state_store_modifications | Counter | Key modification requests received (counts both successes and errors). | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |
| aio_broker_state_store_notifications_sent | Counter | Key change notifications sent to clients registered via KEYNOTIFY. | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |
| aio_broker_state_store_retrievals | Counter | Key retrieval requests received (counts both successes and errors). | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |

## Disk-backed message buffer metrics

These metrics provide observability for the [disk-backed message buffer](../deployment-plan/deployment-planning-disk-buffer.md).

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_broker_disk_transfers_completed | Counter | Completed disk transfers (publishes transferred from buffer pool to disk). | [`namespace`](#namespace), [`hostname`](#hostname) |
| aio_broker_disk_transfers_failed | Counter | Failed disk transfers. | [`namespace`](#namespace), [`hostname`](#hostname) |
| aio_broker_total_disk_backed_message_buffer_usage | Gauge | Total disk-backed message buffer usage. | [`namespace`](#namespace), [`hostname`](#hostname) |

> [!NOTE]
> Only certain backend buffer pools, specifically the dynamic ones named "reader", use the disk-backed message buffer feature. These pools store subscriber message queues and transfer elements to disk when usage exceeds 75%.

## Persistence metrics

These metrics provide observability for persistence and recovery operations. They're reported only when the broker persistence feature is enabled.

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_broker_persistence_disk_usage | Gauge | Current disk usage in bytes. | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |
| aio_broker_persistence_disk_percent_available | Gauge | Disk space available, calculated from current usage and total disk size. | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |
| aio_broker_persistence_last_recovery_time | Gauge | Time (seconds) for most recent recovery from disk after a crash. Reports `0` if no recovery occurred. | [`namespace`](#namespace), [`backend_chain`](#backend_chain) |
| aio_broker_persistence_dynamic_requests | Counter | Dynamic persistence requests. | [`namespace`](#namespace), [`hostname`](#hostname), [`allowed`](#allowed) |

## Failure recovery metrics

Metrics for chain replication and failure recovery.

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_broker_store_transfer_batch_sender_message_count | Counter | Messages sent by store transfer sender during recovery. | [`namespace`](#namespace), [`hostname`](#hostname), [`worker_id`](#worker_id) |
| aio_broker_store_transfer_batch_receiver_message_count | Counter | Messages received by store transfer receiver (should equal sender count). | [`namespace`](#namespace), [`hostname`](#hostname), [`worker_id`](#worker_id) |
| aio_broker_store_transfer_batch_sender_transfer_bytes | Counter | Bytes sent by store transfer sender. | [`namespace`](#namespace), [`hostname`](#hostname), [`worker_id`](#worker_id) |
| aio_broker_store_transfer_patch_tracker_sender_message_count | Counter | Patch tracker messages sent. | [`namespace`](#namespace), [`hostname`](#hostname), [`worker_id`](#worker_id) |
| aio_broker_store_transfer_patch_tracker_receiver_message_count | Counter | Patch tracker messages received. | [`namespace`](#namespace), [`hostname`](#hostname), [`worker_id`](#worker_id) |
| aio_broker_store_transfer_ack_event_sender_message_count | Counter | Ack event messages sent. | [`namespace`](#namespace), [`hostname`](#hostname), [`worker_id`](#worker_id) |
| aio_broker_store_transfer_ack_event_receiver_message_count | Counter | Ack event messages received. | [`namespace`](#namespace), [`hostname`](#hostname), [`worker_id`](#worker_id) |
| aio_broker_store_transfer_ack_event_sender_transfer_bytes | Counter | Bytes sent for ack events. | [`namespace`](#namespace), [`hostname`](#hostname), [`worker_id`](#worker_id) |

## Self-test and diagnostics metrics

Metrics from the diagnostics service for monitoring broker SLO compliance.

For each operation in the following table, the broker also emits three aggregate latency metrics with no dimensions: `*_latency_last_value_ms` (most recent value), `*_latency_mu_ms` (mean), and `*_latency_sigma_ms` (standard deviation). Replace `*` with `aio_broker_connect`, `aio_broker_publish`, `aio_broker_subscribe`, `aio_broker_unsubscribe`, `aio_broker_ping`, or `aio_broker_message_delivery_check`.

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_broker_connect_route_replication_correctness | Gauge | Connect route replication correctness. `1` indicates success; `0` indicates failure. Failure means that the probe didn't receive the response in time. | [`frontend`](#frontend), [`backend_chain`](#backend_chain) |
| aio_broker_connect_latency_route_ms | Gauge | Connect latency value for a specific route (ms). | [`frontend`](#frontend), [`backend_chain`](#backend_chain) |
| aio_broker_publish_route_replication_correctness | Gauge | Publish route replication correctness. `1` indicates success; `0` indicates failure. Failure means that the probe didn't receive the response in time. | [`frontend`](#frontend), [`backend_chain`](#backend_chain) |
| aio_broker_publish_latency_route_ms | Gauge | Publish latency value for a specific route (ms). | [`frontend`](#frontend), [`backend_chain`](#backend_chain) |
| aio_broker_subscribe_route_replication_correctness | Gauge | Subscribe route replication correctness. `1` indicates success; `0` indicates failure. Failure means that the probe didn't receive the response in time. | [`frontend`](#frontend), [`backend_chain`](#backend_chain), [`is_wildcard`](#is_wildcard) |
| aio_broker_subscribe_latency_route_ms | Gauge | Subscribe latency value for a specific route (ms). | [`frontend`](#frontend), [`backend_chain`](#backend_chain), [`is_wildcard`](#is_wildcard) |
| aio_broker_unsubscribe_route_replication_correctness | Gauge | Unsubscribe route replication correctness. `1` indicates success; `0` indicates failure. Failure means that the probe didn't receive the response in time. | [`frontend`](#frontend), [`backend_chain`](#backend_chain), [`is_wildcard`](#is_wildcard) |
| aio_broker_unsubscribe_latency_route_ms | Gauge | Unsubscribe latency value for a specific route (ms). | [`frontend`](#frontend), [`backend_chain`](#backend_chain), [`is_wildcard`](#is_wildcard) |
| aio_broker_ping_correctness | Gauge | Ping correctness. `1` indicates success; `0` indicates failure. Failure means that the probe didn't receive the response in time. | [`frontend`](#frontend) |
| aio_broker_ping_latency_route_ms | Gauge | Ping latency value for a specific route (ms). | [`frontend`](#frontend) |
| aio_broker_message_delivery_check_total_timeouts | Gauge | Message delivery check correctness. Message delivery check validates the end-to-end delivery of a message from a publisher to the subscriber. `0` indicates success; a value greater than `0` indicates failure. Failure means that the subscriber probe didn't receive the response in time. | |
| aio_broker_message_delivery_check_latency_route_ms | Gauge | Message delivery check latency value for a specific route (ms). | |
| aio_broker_message_delivery_check_total_messages_sent | Counter | Total messages sent for delivery check. | |
| aio_broker_message_delivery_check_total_messages_received | Counter | Total messages received for delivery check. | |

## Developer metrics

Metrics for debugging and diagnostics of internal traffic flow.

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_broker_patch_tracker_held_patches | Gauge | Pending message IDs (of any type, including internal) currently held in the message ID tracker. The message tracker is used to guarantee internal message delivery and ordering. IDs in the message tracker are cleaned up periodically. In a stable state, the chart should look like a sawtooth pattern. | [`namespace`](#namespace), [`hostname`](#hostname), [`worker_id`](#worker_id) |
| aio_broker_ack_handler_pending_transactions | Gauge | Pending messages in the ack handler. The ack handler tracks the acknowledgment of messages (of any type, including internal). In a stable state, the chart should look like a flat line close to zero. Spikes or high values might indicate issues with message processing or queue buildup. | [`namespace`](#namespace), [`hostname`](#hostname), [`worker_id`](#worker_id) |
| aio_broker_internal_client_connected | Counter | Internal client connections. | [`namespace`](#namespace), [`hostname`](#hostname), [`worker_id`](#worker_id), [`endpoint`](#endpoint) |
| aio_broker_internal_client_disconnected | Counter | Internal client disconnections. | [`namespace`](#namespace), [`hostname`](#hostname), [`worker_id`](#worker_id), [`endpoint`](#endpoint) |
| aio_broker_internal_client_removed | Counter | Internal clients removed. | [`namespace`](#namespace), [`hostname`](#hostname), [`worker_id`](#worker_id), [`endpoint`](#endpoint) |

## Dimension reference

### namespace

Kubernetes namespace where the broker is deployed.

### hostname

Pod hostname that emitted the metric.

### category

Comes from the MQTT CONNECT packet's `metriccategory` user property. When a client connects to the broker, it can include this user property to categorize its traffic. Dashboards can use this dimension to differentiate traffic sources without the high cardinality issues of tagging metrics with topics.

Sessions without a `metriccategory` receive `category=uncategorized`.

> [!IMPORTANT]
> The number of unique categories is limited to 1,000. Avoid using high-cardinality values for `metriccategory` to prevent metric data loss.

### backend_chain

Identifies which partition or chain the metric belongs to. Backend nodes in the same chain report the same values for store-level metrics. The value is zero-indexed (for example, `backend_chain=0` for the first chain, `backend_chain=1` for the second). The total number of chains equals backend partitions × backend workers per partition.

### direction

Direction of message flow. Values are `incoming` (on receipt from a client) or `outgoing` (before delivery to a client).

### worker_id

Identifies which worker within a frontend or backend partition emitted the metric. Worker identifiers are zero-indexed.

### frontend

Identifies which frontend pod handled the probe operation. The value is the pod index extracted from the frontend pod name (for example, `0` for `aio-broker-frontend-0`).

### is_wildcard

Whether the subscription topic contains a wildcard pattern. Values are `true` (wildcard topic like `foo/#`) or `false` (exact topic match).

### is_persistent

Whether a session is persistent (`true`) or transient (`false`).

### name

Identifies a specific buffer pool. Used with memory and backpressure metrics.

### endpoint

Type of internal connection. Values are `hm` (health manager), `head` (chain head), `tail` (chain tail), or `successor` (successor node).

### allowed

Whether the dynamic persistence request was allowed (`true`) or denied (`false`).

### version

Broker version string.

## Related content

- [Configure MQTT broker diagnostic settings](../deployment-plan/deployment-planning-diagnostics.md)
- [Configure observability](../deploy-iot-ops/howto-configure-observability.md)
