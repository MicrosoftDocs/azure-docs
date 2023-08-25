---
title: Choosing the right Event Grid tier for your solution
description: Describes how to choose the right tier based on the resource features and use cases.
ms.topic: overview
ms.date: 08/25/2023
---

# Choosing the right Event Grid tier for your solution

**Standard tier offers namespaces.**

Use this tier:

- If you want to publish and consume MQTT messages.
- If you want to build applications with flexible consumption patterns, e. g. pull delivery.
- If you want to go beyond 5 MB/s in ingress and egress throughput, up to 20 MB/s (ingress) and 40 MB/s (egress).

For more information, see quotas and limits for [namespaces](quotas-limits#namespace-resource-limits).

**Basic tier offers custom topics, system topics, event domains and partner topics.**

Use this tier:

- If you want to build a solution to trigger actions based on custom application events, Azure system events, partner events.
- If you want to publish events to thousands of topics at the same time.
- If you want to go up to 5 MB/s in ingress and egress throughput.

For more information, see quotas and limits for [custom topics, system topics and partner topics](quotas-limits#custom-topic-system-topic-and-partner-topic-resource-limits) and [domains](quotas-limits#domain-resource-limits).

## Basic and standard tiers

The standard tier of Event Grid is focused on providing support for higher ingress and egress rates, support for IoT solutions that require the use of bidirectional communication capabilities, and support pull delivery for multiple consumers. The basic tier is focused on providing push delivery support to trigger actions based on events. For a detailed breakdown of which quotas and limits are included in each Event Grid resource, see Quotas and limits.

| Feature                                                                                                                            | Standard                                           | Basic                                  |
|------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|----------------------------------------|
| Throughput                                                                                                                         | High, up to 20 MB/s (ingress) and 40 MB/s (egress) | Low, up to 5 MB/s (ingress and egress) |
| MQTT v5 and v3.1.1                                                                                                                 | Yes                                                |                                        |
| Pull delivery                                                                                                                      | Yes                                                |                                        |
| Publish and subscribe to custom events                                                                                             | Yes                                                |                                        |
| Push delivery to Event Hubs                                                                                                        | Yes                                                |                                        |
| Push delivery to Azure services (Functions, Webhooks, Service Bus queues and topics, relay hybrid connections, and storage queues) |                                                    | Yes                                    |
| Subscribe to Azure system events                                                                                                   |                                                    | Yes                                    |
| Subscribe to partner events                                                                                                        |                                                    | Yes                                    |
| Domain scope subscriptions                                                                                                         |                                                    | Yes                                    |

## Next steps

- [Azure Event Grid overview](overview)
- [Azure Event Grid pricing](https://azure.microsoft.com/pricing/details/event-grid/)
- [Azure Event Grid quotas and limits](..//azure-resource-manager/management/azure-subscription-service-limits.md)
- [MQTT overview](mqtt-overview)
- [Pull delivery overview](pull-delivery-overview)
- [Push delivery overview](push-delivery-overview)
