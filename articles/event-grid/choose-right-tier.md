---
title: Choose the right Event Grid tier for your solution
description: Describes how to choose the right tier based on the resource features and use cases.
ms.topic: overview
ms.date: 10/26/2023
---

# Choose the right Event Grid tier for your solution

Azure Event Grid has two tiers with different capabilities. This article helps you with choosing the right tier for your solution.

## Event Grid standard tier

Event Grid standard tier enables pub-sub using Message Queuing Telemetry Transport (MQTT) broker capability, pull delivery and push delivery of messages through Event Grid namespaces.

Use this tier when you want to: 

- Publish and consume MQTT messages.
- Build applications with flexible consumption patterns, for example, pull delivery for multiple consumers or push delivery to Event Hubs.
- Go over 5 MB/s in ingress and egress throughput for pull delivery or push delivery (up to 40 MB/s for ingress and 80 MB/s for egress).
- Retain events that aren't delivered, dropped, or dead-lettered. For more information, see [Event retention for namespace topics](event-retention.md).

For more information, see quotas and limits for [namespaces](quotas-limits.md#namespace-resource-limits).

## Event Grid basic tier

Event Grid basic tier enables push delivery using custom topics, system topics, domains, and partner topics.

Use this tier when you want to:

- Build a solution to trigger actions based on custom application events, Azure system events, and partner events.
- Publish events to thousands of topics at the same time.
- Go up to 5 MB/s in ingress and egress throughput.

For more information, see quotas and limits for [custom topics, system topics and partner topics](quotas-limits.md#custom-topic-system-topic-and-partner-topic-resource-limits) and [domains](quotas-limits.md#domain-resource-limits).

## Basic and standard tiers

The standard tier of Event Grid is focused on providing the following features:

- Higher ingress and egress rates.
- Support for IoT solutions that require the use of bidirectional communication capabilities.
- Pull delivery for multiple consumers. 
- Push delivery to Event Hubs. 

The basic tier is focused on providing push delivery support to trigger actions based on events. For a detailed breakdown of quotas and limits for each Event Grid resource, see [Quotas and limits](quotas-limits.md).

| Feature | Standard | Basic |
|---------|----------|-------|
| Throughput | High, up to 40 MB/s (ingress) and 80 MB/s (egress) | Low, up to 5 MB/s (ingress and egress) |
| MQTT v5 and v3.1.1 | Yes | |
| Pull delivery | Yes | |
| Retention of events that aren't delivered, dropped, or dead-lettered | Yes | |
| Publish and subscribe to custom events | Yes | Yes |
| Push delivery to Event Hubs | Yes | Yes |
| Push delivery to Azure services (Functions, Webhooks, Service Bus queues and topics, relay hybrid connections, and storage queues) | | Yes |
| Subscribe to Azure system events | | Yes |
| Subscribe to partner events | | Yes |
| Domain scope subscriptions | | Yes |

## Next steps

- [Azure Event Grid overview](overview.md)
- [Azure Event Grid pricing](https://azure.microsoft.com/pricing/details/event-grid/)
- [Azure Event Grid quotas and limits](quotas-limits.md)
- [MQTT overview](mqtt-overview.md)
- [Pull delivery overview](pull-delivery-overview.md)
- [Push delivery overview](push-delivery-overview.md)
