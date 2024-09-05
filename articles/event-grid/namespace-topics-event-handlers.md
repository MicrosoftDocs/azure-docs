---
title: Azure Event Grid namespace topic push delivery event handlers
description: Describes supported event handlers with Azure Event Grid push delivery available in namespace topics. Webhooks, Event Hubs.
ms.topic: conceptual
ms.custom:
  - build-2024
ms.date: 06/16/2023
ms.author: robece
---


# Namespace topic push delivery event handlers

An event handler is typically an application or Azure service that receives events sent by namespace topics' push delivery mechanism. Event handlers, or sometimes called destinations, receive events and usually take an action as a way to react to the event. For example, you can use any public endpoint (webhook) to handle events. The webhook doesn't need to be hosted on Azure.

## Supported event handlers

Here are the supported event handlers: 

[!INCLUDE [namespace-event-handlers.md](includes/namespace-event-handlers.md)]

## Next steps

- For an introduction to Event Grid's Push Delivery, see [Namespace Topics - Push Delivery](namespace-push-delivery-overview.md).
