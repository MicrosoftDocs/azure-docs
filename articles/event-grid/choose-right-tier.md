---
title: Choose the right Event Grid tier for your solution
description: Describes how to choose the right tier based on the resource features and use cases.
ms.topic: overview
ms.date: 08/25/2023
---

# Choose the right Event Grid tier for your solution

Azure Event Grid has two tiers with different capabilities. This article will share details on both.

## Event Grid standard tier

Event Grid standard tier enables pub-sub using MQTT broker functionality and push/pull delivery of messages through the Event Grid namespace.

Use this tier:

- If you want to publish and consume MQTT messages.
- If you want to build applications with flexible consumption patterns, e. g. pull delivery or push delivery to Event Hubs.
- If you want to go beyond 5 MB/s in ingress and egress throughput for push or pull delivery, up to 40 MB/s (ingress) and 80 MB/s (egress).

For more information, see quotas and limits for [namespaces](quotas-limits.md#namespace-resource-limits).

## Event Grid basic tier

Event Grid basic tier enables push delivery using Event Grid custom topics, Event Grid system topics, Event domains and Event Grid partner topics.

Use this tier:

- If you want to build a solution to trigger actions based on custom application events, Azure system events, partner events.
- If you want to publish events to thousands of topics at the same time.
- If you want to go up to 5 MB/s in ingress and egress throughput.

For more information, see quotas and limits for [custom topics, system topics and partner topics](quotas-limits.md#custom-topic-system-topic-and-partner-topic-resource-limits) and [domains](quotas-limits.md#domain-resource-limits).

## Basic and standard tiers

The standard tier of Event Grid is focused on providing support for higher ingress and egress rates, support for IoT solutions that require the use of bidirectional communication capabilities, and support pull delivery for multiple consumers. The basic tier is focused on providing push delivery support to trigger actions based on events. For a detailed breakdown of which quotas and limits are included in each Event Grid resource, see [Quotas and limits](quotas-limits.md).

| Feature                                                                                                                            | Standard                                           | Basic                                  |
|------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|----------------------------------------|
| Throughput                                                                                                                         | High, up to 40 MB/s (ingress) and 80 MB/s (egress) | Low, up to 5 MB/s (ingress and egress) |
| MQTT v5 and v3.1.1                                                                                                                 | Yes                                                |                                        |
| Pull delivery                                                                                                                      | Yes                                                |                                        |
| Publish and subscribe to custom events                                                                                             | Yes                                                |                                        |
| Push delivery to Event Hubs                                                                                                        | Yes                                                | Yes                                    |
| Push delivery to Azure services (Functions, Webhooks, Service Bus queues and topics, relay hybrid connections, and storage queues) |                                                    | Yes                                    |
| Subscribe to Azure system events                                                                                                   |                                                    | Yes                                    |
| Subscribe to partner events                                                                                                        |                                                    | Yes                                    |
| Domain scope subscriptions                                                                                                         |                                                    | Yes                                    |

## Next steps

- [Azure Event Grid overview](overview.md)
- [Azure Event Grid pricing](https://azure.microsoft.com/pricing/details/event-grid/)
- [Azure Event Grid quotas and limits](..//azure-resource-manager/management/azure-subscription-service-limits.md)
- [MQTT overview](mqtt-overview.md)
- [Pull delivery overview](pull-delivery-overview.md)
- [Push delivery overview](push-delivery-overview.md)
