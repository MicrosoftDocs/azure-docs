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
> The following limits listed in this article are per region.

## Event Grid throttle limits

Event Grid offers a standard tier and basic tier. Event Grid standard tier enables pub-sub using MQTT broker functionality and pull delivery of messages through the Event Grid namespace. Event Grid basic tier enables push delivery using Event Grid custom topics, Event Grid system topics, Event domains and Event Grid partner topics. See [Choose the right Event Grid tier](../choose-right-tier.md). This article describes the quota and limits for both tiers.

## Namespace resource limits

[Azure Event Grid namespaces](../concepts-pull-delivery.md#namespaces) is available in public preview and enables MQTT messaging, and HTTP pull delivery.
The following limits apply to namespace resources in Azure Event Grid.

| Limit description                      | Limit |
|----------------------------------------|-------|
| Namespaces per Azure subscription      | 10    |
| Maximum throughput units per namespace | 20    |

See [throughput units (TUs)](../concepts-pull-delivery.md#throughput-units) for more information.

## MQTT limits in namespace

The following limits apply to MQTT in Azure Event Grid namespace resource.

| Limit description                            | Limit                                                                             |
|----------------------------------------------|-----------------------------------------------------------------------------------|
| MQTT connections per namespace               | 10,000 per TU                                                                     |
| Sessions per namespace                       | 10,000 per TU                                                                     |
| MQTT inbound publish requests per namespace  | Up to 1,000 messages per second or 1 MB per second per TU (whichever comes first) |
| MQTT inbound publish requests per connection | Up to 100 messages per second or 1 MB per second (whichever comes first)          |
| MQTT outbound publish requests per namespace | Up to 1,000 messages per second or 1 MB per second per TU (whichever comes first) |
| MQTT outbound publish requests per connection| Up to 100 messages per second or 1 MB per second (whichever comes first)          |
| Connect requests                             | 200 requests per second per TU                                                    |
| Subscribe and unsubscribe requests           | 200 requests per second per TU                                                    |
| Max message size                             | 512 KB                                                                            |
| Topic size                                   | 256 B                                                                             |
| Segments per topic filter                    | 8                                                                                 |
| MQTTv5 topic aliases                         | 10 per connection                                                                 |
| Subscriptions per MQTT client session        | 50                                                                                |
| Topic filters per MQTT SUBSCRIBE packet      | 10                                                                                |
| Maximum keep-alive interval                  | 1160                                                                              |
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
| Event ingress                                         | Up to 1,000 events per second or 1 MB per second per TU (whichever comes first)    |
| Event egress                                          | Up to 2,000 events per second or 2 MB per second per TU                            |
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
