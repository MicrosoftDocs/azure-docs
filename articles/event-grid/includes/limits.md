---
 title: include file
 description: include file
 services: event-grid
 author: robece
 ms.service: event-grid
 ms.topic: include
 ms.date: 05/09/2023
 ms.author: robece
ms.custom: include file, build-2023
---

> [!NOTE]
> - The following limits listed in this article are per region.
> - See [throughput units (TUs)](../concepts-pull-delivery.md#throughput-units) for more information.

## Namespace resource limits

[Azure Event Grid namespaces](../concepts-pull-delivery.md#namespaces) is available in public preview and enables MQTT messaging, and HTTP pull delivery.
The following limits apply to namespace resources in Azure Event Grid.

| Limit description                      | Limit |
|----------------------------------------|-------|
| Namespaces per Azure subscription      | 10    |
| Maximum throughput units per namespace | 20    |

## MQTT limits in namespace

The following limits apply to MQTT in Azure Event Grid namespace resource.

| Limit description                            | Limit                                                                             |
|----------------------------------------------|-----------------------------------------------------------------------------------|
| MQTT sessions per namespace               | 10,000 per TU                                                                     |
| Sessions per namespace                       | 10,000 per TU                                                                     |
| Session Expiry Interval                      | 8 hours, [configurable on the namesapce](../mqtt-support.md#maximum-session-expiry-interval-configuration)|
| Inbound MQTT publish requests per namespace  | 1,000 messages per second                                                         |
| Inbound MQTT bandwidth per namespace         | 1 MB per second per TU                                                            |
| Inbound MQTT publish requests per session | 100 messages per second                                                           |
| Inbound MQTT bandwidth per session        | 1 MB per second                                                                   |
| Outbound MQTT publish requests per namespace | 1,000 messages per second                                                         |
| Outbound MQTT bandwidth per namespace        | 1 MB per second per TU                                                            |
| Outbound MQTT publish requests per session| 100 messages per second                                                           |
| Outbound MQTT bandwidth per session       | 1 MB per second                                                                   |
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
| Subscribe and unsubscribe requests per namespace | 200 requests per second                                                       |
| Subscribe and unsubscribe requests per session | 5 requests per second                                                        |
| Subscriptions per MQTT session            | 50                                                                                |
| Subscriptions per namespace                  | 1 million                                                                         |
| Subscriptions per MQTT topic                 | Unlimited, as long as they don't exceed the limit for subscriptions per namespace or session|
| Registered client resources                  | 10,000 clients per TU                                                             |
| CA certificates                              | 10                                                                                 |
| Client groups                                | 10                                                                                |
| Topic spaces                                 | 10                                                                                |
| Topic templates                              | 10 per topic space                                                                |
| Permission bindings                          | 100                                                                               |


## Events limits in namespace

The following limits apply to events in Azure Event Grid namespace resource.

| Limit description                                     | Limit                                                                              |
|-------------------------------------------------------|------------------------------------------------------------------------------------|
| Namespace topics                                      | 100 per TU                                                                         |
| Event ingress                                         | 1,000 events per second or 1 MB per second per TU (whichever comes first)          |
| Event egress                                          | 2,000 events per second or 2 MB per second per TU (whichever comes first)          |
| Event duration period in topic                        | 1 day                                                                              |
| Subscriptions per topic                               | 100                                                                                |
| Connected clients per namespace (queue subscriptions) | 1,000                                                                              |
| Maximum event size                                    | 1 MB                                                                               |
| Batch size                                            | 1 MB                                                                               |
| Events per request                                    | 1,000                                                                              |

## Custom topic, system topic and partner topic resource limits

The following limits apply to Azure Event Grid custom topic, system topic and partner topic resources.

| Limit description                                      | Limit                                                                                                                               |
|--------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| Custom topics per Azure subscription                   | 100<br/>When the limit is reached, you can consider a different region or consider using domains, which can support 100,000 topics. |
| Event subscriptions per topic                          | 500<br/>This limit can’t be increased.                                                                                              |
| Publish rate for a custom or a partner topic (ingress) | 5,000 events per second or 5 MB per second (whichever comes first)                                                                  |
| Event size                                             | 1 MB<br/>This limit can’t be increased.                                                                                             |
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
| Publish rate for a domain (ingress)           | 5,000 events per second or 5 MB per second (whichever comes first) |
| Private endpoint connections per domain       | 64                                                                 |
| IP Firewall rules per topic                   | 128                                                                |
