---
title: Push delivery in Event Grid namespaces
description: Learn how push delivery works in Azure Event Grid namespaces so that you can build applications that react to discrete events over HTTP.
ms.topic: concept-article
ms.custom:
  - ignite-2023
  - build-2024
ms.date: 08/27/2026
author: robece
ms.author: robece
ai-usage: ai-assisted
#customer intent: As a developer, I want to understand push delivery in Event Grid namespaces so that I can build applications that react to discrete events.
---

# Azure Event Grid namespaces - Push delivery

Push delivery is a delivery mode in which Event Grid namespaces send events to a destination as soon as they're published, so your applications can react to discrete events without polling. Over HTTP, Event Grid pushes each event to a supported event handler or a custom webhook that you configure.

This article explains how push delivery works in Event Grid namespaces and describes the supported event handlers, so you can decide whether it fits your application.

## Namespace topics and subscriptions

Events published to Event Grid namespaces land on a topic, which is a namespace subresource that logically contains all events. With namespace topics, you can create subscriptions with flexible consumption modes to push events to a particular destination or [pull events](pull-delivery-overview.md) at your pace.

:::image type="content" source="media/namespace-push-delivery-overview/topic-event-subscriptions-namespace.png" alt-text="Diagram showing a topic and associated event subscriptions." lightbox="media/namespace-push-delivery-overview/topic-event-subscriptions-namespace.png" border="false":::

## Supported event handlers

Event Grid supports the following event handlers:

[!INCLUDE [namespace-event-handlers.md](includes/namespace-event-handlers.md)]

[!INCLUDE [differences-between-consumption-modes](./includes/differences-between-consumption-modes.md)]

## Related content

- [Push delivery with HTTP for Event Grid basic](push-delivery-overview.md)
- [Choose the right Event Grid tier for your solution](choose-right-tier.md)
- [Create, view, and manage namespaces](create-view-manage-namespaces.md)
- [Quickstart: Publish and subscribe to app events using namespace topics](publish-events-using-namespace-topics.md)
- [Control plane and data plane SDKs](sdk-overview.md)
- [Quotas and limits](quotas-limits.md)
