---
 title: include file
 description: include file
 services: event-grid
 author: robece
 ms.service: event-grid
 ms.topic: include
 ms.date: 05/09/2023
 ms.author: robece
 ms.custom: include file
---

> [!NOTE]
> The following limits listed in this article are per region.

## Namespace resource limits

[Azure Event Grid namespaces](concepts.md#namespaces) is available in public preview and enables MQTT messaging, and HTTP pull delivery.
The following limits apply to namespace resources in Azure Event Grid.

| Limit description                      | Limit |
|----------------------------------------|-------|
| Namespaces per Azure subscription      | 10    |
| Maximum throughput units per namespace | 20    |

## Throughput unit limits for MQTT Messages in namespaces

A single [throughput unit](concepts.md#throughput-units) lets you:

| Limit description | Limit                                                                      |
|-------------------|----------------------------------------------------------------------------|
| MQTT Clients      | 10,000                                                                     |
| Receive           | Up to 1,000 messages per second or 1 MB per second (whichever comes first) |
| Deliver/Consume   | Up to 1,000 events per second or 1 MB per second                           |

## Throughput unit limits for Events in namespaces

A single [throughput unit](concepts.md#throughput-units) lets you:

| Limit description | Limit                                                                    |
|-------------------|--------------------------------------------------------------------------|
| Event topics      | 1,000                                                                    |
| Receive           | Up to 1,000 events per second or 1 MB per second (whichever comes first) |
| Deliver/Consume   | Up to 2,000 events per second or 2 MB per second                         |

## Topic and subscription resource limits in namespaces

The following limits apply to topic and subscription resources in Azure Event Grid namespaces.

| Limit description                                     | Limit   |
|-------------------------------------------------------|---------|
| Event topics per namespace                            | 100,000 |
| Event duration period in topic                        | 1 day   |
| Subscriptions per topic                               | 500     |
| Connected clients per namespace (queue subscriptions) | 5,000   |

## Event limits in namespaces

The following limits apply to events in Azure Event Grid namespaces.

| Limit description  | Limit |
|--------------------|-------|
| Event size         | 1 MB  |
| Batch size         | 1 MB  |
| Events per request | 5,000 |

## MQTT resource limits

The following limits apply to MQTT resources in Azure Event Grid namespaces.

| Limit description   | Limit   |
|---------------------|---------|
| Clients             | 100,000 |
| CA certificates     | 2       |
| Client groups       | 10      |
| Topic spaces        | 10      |
| Topic templates     | 10      |
| Permission bindings | 100     |

## MQTT messages limits

The following limits apply to MQTT messages in Azure Event Grid namespaces.

| Limit description                            | Limit                                     |
|----------------------------------------------|-------------------------------------------|
| Max message size                             | 512 KiB                                   |
| Topic size                                   | 256 B                                     |
| Topic alias                                  | 10 topic aliases                          |
| New connect requests                         | 500 requests per second? Per TU / per NS? |
| Subscribe requests                           | 5,000 requests per second                 |
| Total number of subscriptions per connection | 50                                        |

## Custom topic, system topic and partner topic resource limits

The following limits apply to custom topic, system topic and partner topic resources in Azure Event Grid.

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

The following limits apply to Domain resources in Azure Event Grid.

| Limit description                             | Limit                                                              |
|-----------------------------------------------|--------------------------------------------------------------------|
| Domains per Azure subscription                | 100                                                                |
| Topics per domain                             | 100,000                                                            |
| Event subscriptions per topic within a domain | 500<br/>This limit can’t be increased                              |
| Domain scope event subscriptions              | 50<br/>This limit can’t be increased                               |
| Publish rate for a domain (ingress)           | 5,000 events per second or 5 MB per second (whichever comes first) |
| Private endpoint connections per domain       | 64                                                                 |
| IP Firewall rules per topic                   | 128                                                                |
