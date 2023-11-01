---
title: Metrics for Azure IoT MQ
# titleSuffix: Azure IoT Operations
description: Available observability metrics for Azure IoT MQ to monitor the health and performance of your solution.
author: timlt
ms.author: timlt
ms.topic: reference
ms.date: 11/1/2023

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data 
# on the health of my industrial assets and edge environment. 
---

# Metrics for Azure IoT MQ

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT MQ Preview provides a set of observability metrics that you can use to monitor and analyze the health of your solution.  This article lists the available metrics for MQ, and describes the meaning and usage details of each metric. 

## Available metrics
The following tables list the related sets of available metrics. To see more information about a metric, select the link for the metric. 

Messaging metrics:

| Metric Name | Labels/tags |
| ----------- | ----------: |
| [publishes_received](#publishes_received) | `ThreadId`| 
| [publishes_sent](#publishes_sent) | `ThreadId`| 
| [authorization_allow](#authorization_allow) | `ThreadId`| 
| [authorization_deny](#authorization_deny) | `ThreadId`| 

Connection and subscription metrics:

| Metric Name | Labels/tags |
| ----------- | ----------: |
| [total_sessions](#total_sessions) | `mqtt_version`| 
| [store_total_sessions](#store_total_sessions)  | `is_persistent`| 
| [connected_sessions](#connected_sessions)  |
| [store_connected_sessions](#store_connected_sessions) | `is_persistent`| 
| [total_subscriptions](#total_subscriptions)  |
| [store_total_subscriptions](#store_total_subscriptions)  |
| [authentication_successes](#authentication_successes)  | `ThreadId`| 
| [authentication_failures](#authentication_failures)  | `ThreadId`| 

Self-test metrics:

| Metric Name | Labels/tags |
| ----------- | ----------: |
| [connect_route_replication_correctness](#connect_route_replication_correctness)|`route`| 
| [connect_latency_route_ms](#connect_latency_route_ms)|`route`| 
| [connect_latency_last_value_ms](#connect_latency_last_value_ms)|
| [connect_latency_mu_ms](#connect_latency_mu_ms)|
| [connect_latency_sigma_ms](#connect_latency_sigma_ms) |
| [subscribe_route_replication_correctness](#subscribe_route_replication_correctness) | `route`| 
| [subscribe_latency_route_ms](#subscribe_latency_route_ms) | `route`| 
| [subscribe_latency_last_value_ms](#subscribe_latency_last_value_ms) | 
| [subscribe_latency_mu_ms](#subscribe_latency_mu_ms)|
| [subscribe_latency_sigma_ms](#subscribe_latency_sigma_ms)|
| [unsubscribe_route_replication_correctness](#unsubscribe_route_replication_correctness)| `route`| 
| [unsubscribe_latency_route_ms](#unsubscribe_latency_route_ms)| `route`| 
| [unsubscribe_latency_last_value_ms](#unsubscribe_latency_last_value_ms)|
| [unsubscribe_latency_mu_ms](#unsubscribe_latency_mu_ms)|
| [unsubscribe_latency_sigma_ms](#unsubscribe_latency_sigma_ms)|
| [publish_route_replication_correctness](#publish_route_replication_correctness)|`route`| 
| [publish_latency_route_ms](#publish_latency_route_ms) | `route`| 
| [publish_latency_last_value_ms](#publish_latency_last_value_ms)|
| [publish_latency_mu_ms](#publish_latency_mu_ms)|
| [publish_latency_sigma_ms](#publish_latency_sigma_ms)|

Operator health metrics:

| Metric Name | Labels/tags |
| ----------- | ----------: |
| [backend_replicas](#operator-health-metrics) |
| [backend_replicas_current](#operator-health-metrics) |
| [backend_vertical_chain](#operator-health-metrics) |
| [backend_vertical_chain_current](#operator-health-metrics) |
| [frontend_replicas](#operator-health-metrics) |
| [frontend_replicas_current](#operator-health-metrics) |

Cloud connector metrics:

| Metric Name | Labels/tags |
| ----------- | ----------: |
| [connector_routes](#connector_routes) |
| [local_publishes_received](#local_publishes_received) | `route`, `hostname`| 
| [local_publishes_sent](#local_publishes_sent) | `route`, `hostname`| 
| [cloud_publishes_received](#cloud_publishes_received) | `route`, `hostname`| 
| [cloud_publishes_sent](#cloud_publishes_sent) | `route`, `hostname`| 


## Metric descriptions
The following section contains descriptions for each available metric. 

### publishes_received

On the front end, this metric represents how many incoming publish packets are received from clients. For the backend, this metric represents how many internal messages that the front end nodes send.

Tags: `ThreadId`

### publishes_sent

On the front end, this metric represents how many outgoing publish packets were sent to clients. If multiple clients are subscribed to the same topic, this metric counts each message sent, even if they have the same payload. This metric doesn't count ack packets. For the backend, the metric represents how many internal messages were sent to the front end nodes.

Tags: `ThreadId`

### authorization_allow

This metric counts how many times an authenticated client was successfully authorized. This metric should always be less than or equal to `authentication_successes`.

Tags: `ThreadId`

### authorization_deny

This metric counts how many times an authenticated client was denied. This metric should always be less than or equal to authentication_successes.

Tags: `ThreadId`

### authentication_successes

This metric counts how many times a client successfully authenticated.

Tags: `ThreadId`

### authentication_failures

This metric counts how many times a client failed to authenticate. For an errorless authentication server, this value is calculated as follows: `authentication_successes` + `authentication_failures` = `publishes_received` = `publishes_sent`.

Tags: `ThreadId`

### total_sessions

On the front end and single node broker, this metric represents how many client sessions there are. The value doesn't include disconnected persistent sessions, because a client might reconnect to a different front end node. For the backend, the metric represents its connections to the other nodes in its chain. On the operator, the metric represents how many front and back end nodes are connected. For the authentication server, the metric represents how many front end workers are connected (there should be one worker per front end per thread). 

Tags:

* `mqtt_version`: [v3/v5]

Backend Node Only Tags:

* `is_tail`: [true/false]
* `chain_id`: [n]

### store_total_sessions

This metric is a back end specific metric that represents how many sessions that the backend chain manages. Backend nodes in the same chain should report the same number of sessions, and the sum of each chain should equal the sum of the front end's `total_sessions` value.

Tags:

* `is_persistent`: [true/false]
* `is_tail`: [true/false]
* `chain_id`: [n]

### connected_sessions

The same as [total_sessions](#total_sessions), except only sessions that have an active connection.

### store_connected_sessions

The same as [store_total_sessions](#store_total_sessions), except only sessions that have an active connection. If `is_persistent` is false, this metric should be equal to total sessions.

### total_subscriptions

On the front end, this metric represents how many subscriptions the currently connected sessions have. This metric doesn't include disconnected persistent sessions, because a client might reconnect to a different front end node. For the backend, this metric represents other nodes in its chain connecting to it. On the operator, the metric represents the front and back end nodes. For the authentication server, the metric represents how many front end workers are connected (there should be one worker per front end per thread). 

### store_total_subscriptions

This metric is a back end specific metric that represents how many subscriptions that the backend chain manages. Backend nodes in the same chain should report the same number of subscriptions. The metric doesn't necessarily match the front end's `total_subscriptions` value, because this metric tracks disconnected persistent sessions as well.

### connect_route_replication_correctness

This metric describes if a connection request from the self test client is replicated correctly along a specific route.

### connect_latency_route_ms

This metric describes the time interval between a self test client sending a CONNECT packet, and receiving a CONNACK packet. The metric is generated per route, and is generated only if a CONNECT is successful.

### connect_latency_last_value_ms

This metric is an estimated p99 of `connect_latency_route_ms`.

### connect_latency_mu_ms

This metric is the mean value of `connect_latency_route_ms`.

### connect_latency_sigma_ms

This metric is the standard deviation of `connect_latency_route_ms`.

### subscribe_route_replication_correctness

This metric describes if a subscribe request from the self test client is replicated correctly along a specific route.

### subscribe_latency_route_ms

This metric describes time interval between a self test client sending a SUBSCRIBE packet and receiving a SUBACK packet. The metric is generated per route, and is generated only if a SUBSCRIBE is successful.

### subscribe_latency_last_value_ms

This metric is an estimated p99 of `subscribe_latency_route_ms`.

### subscribe_latency_mu_ms

This metric is the mean value of `subscribe_latency_route_ms`.

### subscribe_latency_sigma_ms

This metric is the standard deviation of `subscribe_latency_route_ms`.

### unsubscribe_route_replication_correctness

This metric describes if an unsubscribe request from the self test client is replicated correctly along a specific route.

### unsubscribe_latency_route_ms

This metric describes time interval between a self test client sending an UNSUBSCRIBE packet and receiving a UNSUBACK packet. This metric is generated per route, and is generated only if a UNSUBSCRIBE is successful.

### unsubscribe_latency_last_value_ms

This metric is an estimated p99 of `unsubscribe_latency_route_ms`.

### unsubscribe_latency_mu_ms

This metric is the mean value of `unsubscribe_latency_route_ms`.

### unsubscribe_latency_sigma_ms

This metric is the standard deviation of `unsubscribe_latency_route_ms`.

### publish_route_replication_correctness

This metric describes if a publish request from a self test client is replicated correctly along a specific route.

### publish_latency_route_ms

This metric describes time interval between a self test client sending a PUBLISH packet and receiving a PUBACK packet. This metric is generated per route, and is generated only if a PUBLISH is successful.

### publish_latency_last_value_ms

This metric is an estimated p99 of `publish_latency_route_ms`.

### publish_latency_mu_ms

This metric is the mean value of `publish_latency_route_ms`.

### publish_latency_sigma_ms

This metric is the standard deviation of `publish_latency_route_ms`.

### Operator health metrics
This set of metrics tracks the overall state of the broker. These metrics are paired, and the first metric (for example, `backend_replicas`) represents the desired state. The second metric (for example, `backend_replicas_current`) represents the current state. These metrics show how many pods are healthy from the broker's perspective, and might not match with what Kubernetes reports.

For example, if a back end node restarts but fails to reconnect to its chain, K8s reports the pod as healthy. But the operator reports the pod is down, because the pod isn't functioning.

Desired Metric | Reported Metric
--|--
backend_replicas | backend_replicas_current
backend_vertical_chain | backend_vertical_chain_current
frontend_replicas | frontend_replicas_current

> [!NOTE]
> The `backend_vertical_chain_current` metric reports the chain with the least healthy nodes. For example, suppose there's an expected chain length value of `4`. If three of the chains have four healthy nodes while one chain only has two healthy nodes, the `backend_vertical_chain_current` metric reports a value of `2`.

### connector_routes

The number of routes that are configured.

### local_publishes_received

The number of publish actions received from the dmqtt broker. If the connector is online, this value is equal to the `cloud_publishes_sent` with the same `route` tag.

### local_publishes_sent

The number of publish actions sent to the dmqtt broker. This metric should be equal to the `cloud_publishes_received` with the same `route` tag.

### cloud_publishes_received

The number of messages received from the cloud.

### cloud_publishes_sent

The number of messages sent to the cloud.



## Related content

- [Configure observability](../monitor/howto-configure-observability.md)