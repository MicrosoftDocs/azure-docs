---
title: Choose the right Event Grid tier for your solution
description: Describes how to choose the right tier based on resource features and use cases.
ms.topic: overview
ms.custom:
  - ignite-2023
ms.date: 11/15/2023
---

# Choose the right Event Grid tier for your solution

Azure Event Grid has two tiers with different capabilities. This article shares details on both.

## Event Grid standard tier

Azure Event Grid includes the following functionality through Event Grid namespaces:

* An MQTT pub-sub broker that supports bidirectional communication using MQTT v3.1.1 and v5.0.
* CloudEvents publication using HTTP.
* Pull delivery using HTTP.
* Push delivery to Event Hubs using AMQP.

Use this tier if any of the following statements is true:

* You want to publish and consume MQTT messages.
* You want to build a solution to trigger actions based on custom application events in CloudEvents JSON format.
* You want to build applications with flexible consumption patterns, e. g. HTTP pull delivery for multiple consumers or push delivery to Event Hubs.
* You require HTTP communication rates greater than 5 MB/s for ingress and egress using pull delivery or push delivery. Event Grid currently supports up to 40 MB/s for ingress and 80 MB/s for egress for events published to namespace topics (HTTP). MQTT supports a throughput rate of 40 MB/s for publisher and subscriber clients.
* You require CloudEvents retention of up to 7 days.

For more information, see quotas and limits for [namespaces](quotas-limits.md#namespace-resource-limits).

## Event Grid basic tier

Event Grid basic tier supports push delivery using Event Grid custom topics, Event Grid system topics, Event domains and Event Grid partner topics.

Use this tier if any of these statements is true:

* You want to build a solution to trigger actions based on custom application events, Azure system events, partner events.
* You want to publish events to thousands of topics using Event Grid domains.
* You don't have any future needs to support rates greater than 5 MB/s for ingress or egress.
* You don't require event retention greater than 1 day. For example, an event handler logic is able to be patched in less than 1 day. Otherwise, you're fine with the extra cost and overhead of reading events from a blob dead-letter destination once they have stayed for more than 1 day in Event Grid.

For more information, see quotas and limits for [custom topics, system topics and partner topics](quotas-limits.md#custom-topic-system-topic-and-partner-topic-resource-limits) and [domains](quotas-limits.md#domain-resource-limits).

## Basic and standard tiers

The standard tier of Event Grid is focused on providing the following features:

* Higher ingress and egress rates.
* Support for IoT solutions that require the use of bidirectional communication using MQTT.
* Pull delivery for multiple consumers.
* Push delivery to Event Hubs.

The basic tier is focused on providing push delivery support to trigger actions based on events. For a detailed breakdown of which quotas and limits are included in each Event Grid resource, see [Quotas and limits](quotas-limits.md).

| Feature                                                                                                                            | Standard                                           | Basic                                  |
|------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|----------------------------------------|
| Throughput                                                                                                                         | High, up to 40 MB/s (ingress) and 80 MB/s (egress) | Low, up to 5 MB/s (ingress and egress) |
| MQTT v5 and v3.1.1                                                                                                                 | Yes                                                |                                        |
| Pull delivery                                                                                                                      | Yes                                                |                                        |
| Publish and subscribe to custom events                                                                                             | Yes                                                | Yes                                    |
| Push delivery to Event Hubs                                                                                                        | Yes                                                | Yes                                    |
| Maximum message retention  | 7 days on namespace topics  | 1 day
| Push delivery to Azure services (Functions, Webhooks, Service Bus queues and topics, relay hybrid connections, and storage queues) |                                                    | Yes                                    |
| Subscribe to Azure system events                                                                                                   |                                                    | Yes                                    |
| Subscribe to partner events                                                                                                        |                                                    | Yes                                    |
| Domain scope subscriptions                                                                                                         |                                                    | Yes                                    |


## Next steps

- [Azure Event Grid overview](overview.md)
- [Azure Event Grid pricing](https://azure.microsoft.com/pricing/details/event-grid/)
- [Azure Event Grid quotas and limits](quotas-limits.md)
- [MQTT overview](mqtt-overview.md)
- [Pull delivery overview](pull-delivery-overview.md)
- [Push delivery overview](push-delivery-overview.md)
