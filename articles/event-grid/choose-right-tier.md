---
title: Choose the right Event Grid tier for your solution
description: Compare Azure Event Grid standard and basic tiers to determine which tier fits your event-driven solution based on throughput, MQTT support, and delivery options.
ms.topic: overview
ms.date: 06/11/2026
ai-usage: ai-assisted
ms.custom:
  - build-2025
---

# Choose the right Event Grid tier for your solution

Azure Event Grid has two tiers with different capabilities. This article covers both tiers so you can choose the right one for your solution.

## Event Grid standard tier

Azure Event Grid standard tier includes the following functionality through Event Grid namespaces:

* A Message Queueing Telemetry Transport (MQTT) pub-sub broker that supports bidirectional communication using MQTT v3.1.1 and v5.0.
* CloudEvents publication using HTTP.
* Pull delivery using HTTP.
* Push delivery to Event Hubs using Advanced Messaging Queueing Protocol (AMQP).

Use this tier if any of the following statements is true:

* You want to publish and consume MQTT messages.
* You want to build a solution to trigger actions based on custom application events in CloudEvents JSON format.
* You want to build applications with flexible consumption patterns, for example, HTTP pull delivery for multiple consumers or push delivery to Event Hubs.
* You require HTTP communication rates greater than 5 MB/s for ingress and egress using pull delivery or push delivery. Event Grid currently supports up to 40 MB/s for ingress and 80 MB/s for egress for events published to namespace topics (HTTP). MQTT supports a throughput rate of 40 MB/s for publisher and subscriber clients.
* You require CloudEvents retention of up to 7 days.

For more information, see quotas and limits for [namespaces](quotas-limits.md#event-grid-namespace-resource-limits).

## Event Grid basic tier

Event Grid basic tier supports push delivery using custom topics, system topics, partner topics, and domains.

Use this tier if any of these statements is true:

* You want to build a solution to trigger actions based on custom application events, Azure system events, or partner events.
* You want to publish events to thousands of topics using Event Grid domains.
* You don't have any future needs to support rates greater than 5 MB/s for ingress or egress.
* You don't require event retention greater than 1 day. For example, you can patch event handler logic in less than 1 day if it has a bug. Otherwise, you don't have concerns with the extra cost and overhead of reading events from a blob dead-letter destination.

For more information, see quotas and limits for [custom topics, system topics and partner topics](quotas-limits.md#custom-topic-system-topic-and-partner-topic-resource-limits) and [domains](quotas-limits.md#domain-resource-limits).

## Basic and standard tiers

The Event Grid standard tier focuses on providing the following features:

* Higher ingress and egress rates.
* Support for IoT solutions that require the use of bidirectional communication using MQTT.
* Pull delivery for multiple consumers.
* Push delivery to Event Hubs.

The basic tier focuses on providing push delivery support to trigger actions based on events. For a detailed breakdown of the quotas and limits for each Event Grid resource, see [Quotas and limits](quotas-limits.md).

| Feature   | Standard  | Basic |
|-----------|-----------|-------|
| Throughput | High, up to 40 MB/s (ingress) and 80 MB/s (egress) | Low, up to 5 MB/s (ingress and egress) |
| MQTT v5 and v3.1.1 | Yes | |
| Pull delivery | Yes | |
| Publish and subscribe to custom events | Yes | Yes |
| Push delivery to Webhooks  |Yes  | Yes
| Push delivery to Event Hubs | Yes | Yes |
| Push delivery to Azure services (Functions, Service Bus queues and topics, relay hybrid connections, and storage queues) | | Yes  |
| Maximum message retention  | 7 days on namespace topics  | 1 day
| Subscribe to Azure system events | | Yes |
| Subscribe to partner events | | Yes |
| Domain scope subscriptions | | Yes |
| Pull delivery to Fabric Eventstream | Yes | No |

## Related content

- [Azure Event Grid overview](overview.md)
- [Azure Event Grid pricing](https://azure.microsoft.com/pricing/details/event-grid/)
- [Azure Event Grid quotas and limits](quotas-limits.md)
- [MQTT overview](mqtt-overview.md)
- [Pull delivery overview](pull-delivery-overview.md)
- [Push delivery overview](push-delivery-overview.md)