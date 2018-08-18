---
title: Azure Event Grid subscriptions through portal
description: Describes how to create Event Grid subscriptions through the portal.
services: event-grid
author: tfitzmac

ms.service: event-grid
ms.topic: conceptual
ms.date: 08/17/2018
ms.author: tomfitz
---

# Subscribe to events through portal

This article describes how to create Event Grid subscriptions through the portal.

## Create subscriptions

To create an Event Grid subscription for your Azure subscription, use the following steps.

1. Select **All services**.

   ![Select all services](./media/subscribe-through-portal/select-all-services.png)

1. Search for **Event Grid Subscriptions** and select it from the available options.

   ![Search](./media/subscribe-through-portal/search.png)

1. Select **+ Event Subscription**.

   ![Add subscription](./media/subscribe-through-portal/add-subscription.png)

1. Select the type of subscription you want to create. For example, to subscribe to events for your Azure subscription, select **Azure Subscriptions** and the target subscription.

   ![Select Azure subscription](./media/subscribe-through-portal/azure-subscription.png)

## Resource subscriptions

## Next steps

* For information about event delivery and retries, [Event Grid message delivery and retry](delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
