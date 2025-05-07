---
 title: include file
 description: include file
 author: robece
 ms.service: azure-event-grid
 ms.topic: include
 ms.date: 11/15/2023
 ms.author: robece
ms.custom: include file, ignite-2023
---

> [!NOTE]
> The following limits listed in this article are per region.

## Event Grid throttle limits

Event Grid offers a standard tier and basic tier. Event Grid standard tier enables pub-sub using Message Queuing Telemetry Transport (MQTT) broker functionality and pull-delivery of messages through the Event Grid namespace. Event Grid basic tier enables push delivery using Event Grid custom topics, Event Grid system topics, Event domains, and Event Grid partner topics. See [Choose the right Event Grid tier](../choose-right-tier.md). This article describes the quota and limits for both tiers.

## Event Grid Namespace resource limits

[Azure Event Grid namespaces](../concepts-event-grid-namespaces.md#namespaces) enables MQTT messaging, and HTTP pull delivery.
The following limits apply to namespace resources in Azure Event Grid.

| Limit description                      | Limit |
|----------------------------------------|-------|
| Event Grid namespaces per Azure subscription      | 50    |
| Maximum throughput units per Event Grid namespace | 40    |
| IP Firewall rules per Event Grid namespace        | 16    |

## MQTT limits in Event Grid namespace

The following limits apply to MQTT in Azure Event Grid namespace resource.

> [!NOTE]
> Throughput units (TUs) define the ingress and egress event rate capacity in namespaces. They allow you to control the capacity of your namespace resource for message ingress and egress. 

| Limit description                            | Limit                                                                             |
|----------------------------------------------|-----------------------------------------------------------------------------------|
| MQTT sessions per Event Grid namespace               | 10,000 per throughput unit (TU)                                                                     |
| Sessions per Event Grid namespace                       | 10,000 per TU                                                                     |
| Session Expiry Interval                      | 8 hours, [configurable on the Event Grid namespace](../mqtt-support.md#maximum-session-expiry-interval-configuration)|
| Inbound MQTT publishing requests per Event Grid namespace  | 1,000 messages per second per TU                                                         |
| Inbound MQTT bandwidth per Event Grid namespace         | 1 MB per second per TU                                                            |
| Inbound MQTT publishing requests per session | 100 messages per second                                                           |
| Inbound MQTT bandwidth per session        | 1 MB per second                                                                   |
| Inbound in-flight MQTT messages*        | 100 messages                                                                   |
| Inbound in-flight MQTT bandwidth*         | 64 KB                                                             |
| Outbound MQTT publishing requests per Event Grid namespace | 1,000 messages per second per TU                                                         |
| Outbound MQTT bandwidth per Event Grid namespace        | 1 MB per second per TU                                                            |
| Outbound MQTT publishing requests per session| 100 messages per second                                                           |
| Outbound MQTT bandwidth per session       | 1 MB per second                                                                   |
| Outbound in-flight MQTT messages*        | 100 messages                                                                   |
| Outbound in-flight MQTT bandwidth*         | 64 KB                                                             |
| Max message size                             | 512 KB                                                                            |
| Segments per topic/ topic filter             | 8                                                                                 |
| Topic size                                   | 256 B                                                                             |
| MQTTv5 response topic                        | 256 B                                                                             |
| MQTTv5 topic aliases                         | 10 per session                                                                 |
| MQTTv5 total size of all user properties     | 32 KB                                                                              |
| MQTTv5 content type size                     | 256 B                                                                             |
| MQTTv5 correlation data size                 | 256 B                                                                             |
| Connect requests                             | 200 requests per second per TU                                                    |
| MQTTv5 authentication data size              | 8 KB                                                                              |
| Maximum keep-alive interval                  | 1160                                                                              |
| Topic filters per MQTT SUBSCRIBE packet      | 10                                                                                |
| Subscribe and unsubscribe requests per Event Grid namespace | 200 requests per second                                                       |
| Subscribe and unsubscribe requests per session | 5 requests per second                                                        |
| Subscriptions per MQTT session            | 50                                                                                |
| Subscriptions per Event Grid namespace                  | 1 million                                                                         |
| Subscriptions per MQTT topic                 | Unlimited, as long as they don't exceed the limit for subscriptions per Event Grid namespace or session|
| Registered client resources                  | 10,000 clients per TU                                                             |
| CA certificates                              | 10                                                                                 |
| Client groups                                | 10                                                                                |
| Topic spaces                                 | 10                                                                                |
| Topic templates                              | 10 per topic space                                                                |
| Permission bindings                          | 100                                                                               |

\* For MQTTv5, learn more about [flow control support](../mqtt-support.md#flow-control).

## Events limits in Event Grid namespace

The following limits apply to events in Azure Event Grid namespace resource.

| Limit description                                                    | Limit                                                                              |
|----------------------------------------------------------------------|------------------------------------------------------------------------------------|
| Event Grid namespace topics                                                     | 100 per TU                                                                         |
| Event ingress                                                        | 1,000 events per second or 1 MB per second per TU (whichever comes first)          |
| Event egress  (push and pull APIs)                                   | Up to 2,000 events per second or 2 MB per second per TU                            |
| Event egress  (acknowledge, release, reject, and renew lock APIs)    | Up to 2,000 events per second or 2 MB per second per TU                            |
| Maximum event retention on Event Grid namespace topics                          | 7 days                                                                             |
| Subscriptions per topic                                              | 500                                                                                |
| Maximum event size                                                   | 1 MB                                                                               |
| Batch size                                                           | 1 MB                                                                               |
| Events per request                                                   | 1,000                                                                              |

## Custom topic, system topic, and partner topic resource limits

The following limits apply to Azure Event Grid custom topic, system topic, and partner topic resources.

| Limit description                                      | Limit                                                                                                                               |
|--------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| Custom topics per Azure subscription                   | 100<br/>When the limit is reached, you can consider a different region or consider using domains, which can support 100,000 topics. |
| Event subscriptions per topic                          | 500<br/>This limit can’t be increased.                                                                                              |
| Publish rate for a custom or a partner topic (ingress) | 5,000 events or 5 MB per second (whichever comes first). An event is counted for limits and pricing purposes as a 64KB data chunk. So, if the event is 128 KB, it counts as two events. |
| Event size                                             | 1 MB<br/>This limit can’t be increased.                                                                                             |
| Maximum event retention on topics              | 1 day. This limit can't be increased. |
| Number of incoming events per batch                    | 5,000<br/>This limit can’t be increased                                                                                             |
| Private endpoint connections per topic                 | 64<br/>This limit can’t be increased                                                                                                |
| IP Firewall rules per topic                            | 128                                                                                                                                 |

## Domain resource limits

The following limits apply to Azure Event Grid domain resource.

| Limit description                             | Limit                                                              |
|-----------------------------------------------|--------------------------------------------------------------------|
| Domains per Azure subscription                | 100                                                                |
| Topics per domain                             | 100,000                                                            |
| Event subscriptions per topic within a domain | 500<br/>This limit can’t be increased                              |
| Domain scope event subscriptions              | 50<br/>This limit can’t be increased                               |
| Publish rate for a domain (ingress)           | 5,000 events or 5 MB per second (whichever comes first). An event is counted for limits and pricing purposes as a 64KB data chunk. So, if the event is 128 KB, it counts as two events. |
| Maximum event retention on domain topics              | 1 day. This limit can't be increased. |
| Private endpoint connections per domain       | 64                                                                 |
| IP Firewall rules per topic                   | 128                                                                |
