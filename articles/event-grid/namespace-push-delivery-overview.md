---
title: How to send events to Azure monitor alerts
description: This article describes how to deliver Azure Key Vault events as Azure Monitor alerts. 
ms.topic: conceptual
ms.date: 09/21/2023
author: robece
ms.author: robece
---

# Push delivery on namespaces

This article builds on [push delivery with HTTP for Event Grid basic](push-delivery-overview.md) and provides essential information before you start using push delivery on Event Grid namespaces over HTTP protocol. This article is suitable for users who need to build applications to react to discrete events using Event Grid namespaces. If you are interested to know more about the difference between the Event Grid basic tier and the standard tier with namespaces, see [choose the right Event Grid tier for your solution](choose-right-tier.md).

## Namespace topics and subscriptions

Events published to Event Grid namespaces will land on a topic, which is a namespace subresource that logically contains all events. Namespace topics allows you to create subscriptions with flexible consumption modes to push events to a particular destination or [pull events](pull-delivery-overview.md) at yourself pace.

:::image type="content" source="media/namespace-push-delivery-overview/topic-event-subscriptions-namespace.png" alt-text="Diagram showing a topic and associated event subscriptions." lightbox="media/namespace-push-delivery-overview/topic-event-subscriptions-namespace.png" border="false":::

## Push and pull delivery

Using HTTP, Event Grid supports push and pull event delivery. With push delivery, you define a destination in an event subscription, a webhook or an Azure service, to which Event Grid sends events. Push delivery is supported in custom topics, system topics, domain topics and partner topics. With pull delivery, subscriber applications connect to Event Grid to consume events. Pull delivery is supported in topics within a namespace.

:::image type="content" source="media/namespace-push-delivery-overview/push-pull-delivery-mechanism.png" alt-text="High-level diagram showing push delivery and pull delivery with the kind of resources involved." lightbox="media/namespace-push-delivery-overview/push-pull-delivery-mechanism.png" border="false":::

### When to use push delivery vs. pull delivery

The following are general guidelines to help you decide when to use pull or push delivery.

#### Pull delivery

- Your applications or services publish events. Event Grid doesn't yet support pull delivery when the source of the events is an [Azure service](event-schema-api-management.md?tabs=cloud-event-schema) or a [partner](partner-events-overview.md) (SaaS) system.
- You need full control as to when to receive events. For example, your application may not up all the time, not stable enough, or you process data at certain times.
- You need full control over event consumption. For example, a downstream service or layer in your consumer application has a problem that prevents you from processing events. In that case, the pull delivery API allows the consumer app to release an already read event back to the broker so that it can be delivered later.
- You want to use [private links](../private-link/private-endpoint-overview.md) when receiving events. This is possible with pull delivery.
- You don't have the ability to expose an endpoint and use push delivery, but you can connect to Event Grid to consume events.

#### Push delivery

- You need to receive events from your applications. Push delivery supports these types of event sources.
- You want to avoid constant polling to determine that a system state change has occurred. You rather use Event Grid to send events to you at the time state changes happen.
- You have an application that can't make outbound calls. For example, your organization may be concerned about data exfiltration. However, your application can receive events through a public endpoint.

## Supported event handlers

Here are the supported event handlers:
[!INCLUDE [namespace-event-handlers.md](includes/namespace-event-handlers.md)]

## Next steps

- [Create, view, and manage namespaces](create-view-manage-namespaces.md)
- Quickstart: [Publish and subscribe to app events using namespace topics](publish-events-using-namespace-topics.md)
- [Control plane and data plane SDKs](sdk-overview.md)
- [Quotas and limits](quotas-limits.md)
