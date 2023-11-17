---
title: Introduction to push delivery in Event Grid namespaces
description: Learn about push delivery supported by Azure Event Grid namespaces.
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 11/15/2023
author: robece
ms.author: robece
---

# Azure Event Grid namespaces - Push delivery

This article builds on [push delivery with HTTP for Event Grid basic](push-delivery-overview.md) and provides essential information before you start using push delivery on Event Grid namespaces over HTTP protocol. This article is suitable for users who need to build applications to react to discrete events using Event Grid namespaces. If you're interested to know more about the difference between the Event Grid basic tier and the standard tier with namespaces, see [choose the right Event Grid tier for your solution](choose-right-tier.md).

[!INCLUDE [simple-preview-note](./includes/simple-preview-note.md)]

## Namespace topics and subscriptions

Events published to Event Grid namespaces land on a topic, which is a namespace subresource that logically contains all events. Namespace topics allows you to create subscriptions with flexible consumption modes to push events to a particular destination or [pull events](pull-delivery-overview.md) at yourself pace.

:::image type="content" source="media/namespace-push-delivery-overview/topic-event-subscriptions-namespace.png" alt-text="Diagram showing a topic and associated event subscriptions." lightbox="media/namespace-push-delivery-overview/topic-event-subscriptions-namespace.png" border="false":::

## Supported event handlers

Here are the supported event handlers:
[!INCLUDE [namespace-event-handlers.md](includes/namespace-event-handlers.md)]

[!INCLUDE [differences-between-consumption-modes](./includes/differences-between-consumption-modes.md)]

## Next steps

- [Create, view, and manage namespaces](create-view-manage-namespaces.md)
- Quickstart: [Publish and subscribe to app events using namespace topics](publish-events-using-namespace-topics.md)
- [Control plane and data plane SDKs](sdk-overview.md)
- [Quotas and limits](quotas-limits.md)
