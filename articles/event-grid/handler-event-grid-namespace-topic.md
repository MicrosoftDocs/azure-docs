---
title: How to send events to Event Grid namespace topics
description: This article describes how to deliver events to Event Grid namespace topics.
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 10/16/2023
author: robece
ms.author: robece
---

# How to send events from Event Grid basic to Event Grid namespace topics (Preview)

This article describes how to forward events from event subscriptions created in resources like custom topics, system topics, domains, and partner topics to Event Grid namespaces.

## Overview

Namespace topic as a destination in Event Grid basic event subscriptions that helps you to transition to Event Grid namespaces without modifying your existing workflow.

:::image type="content" source="media/handler-event-grid-namespace-topic/namespace-topic-handler-destination.png" alt-text="Image that shows events forwarded from Event Grid basic to Event Grid namespace topic." border="false" lightbox="media/handler-event-grid-namespace-topic/namespace-topic-handler-destination.png":::

Event Grid namespaces provides new, and interesting capabilities that you might be interested to use in your solutions. If you're currently using Event Grid basic resources like topics, system topics, domains, and partner topics you only need to create a new event subscription in your current topic and select Event Grid namespace topic as a handler destination.

## How to forward events to a new Event Grid namespace

Scenario: Subscribe to a storage account system topic and forward storage events to a new Event Grid namespace.

### Prerequisites

1. Create an Event Grid namespace resource by following instructions from [Create, view, and manage namespaces](create-view-manage-namespaces.md).
1. Create an Event Grid namespace topic by following instructions from [Create, view, and manage namespace topics](create-view-manage-namespace-topics.md).
1. Create an Event Grid event subscription in a namespace topic by following instructions from [Create, view, and manage event subscriptions in namespace topics](create-view-manage-event-subscriptions.md).
1. Create an Azure storage account by following instructions from [create a storage account](blob-event-quickstart-portal.md#create-a-storage-account).

### Create and configure the event subscription

:::image type="content" source="media/handler-event-grid-namespace-topic/namespace-topic-subscription.png" alt-text="Screenshot that shows how to create a subscription to forward events from Event Grid basic to Event Grid namespace topic." border="false" lightbox="media/handler-event-grid-namespace-topic/namespace-topic-subscription.png":::

> [!NOTE]
> For **Event Schema**, select the event schema as **Cloud Events Schema v1.0**. It's the only schema type that the Event Grid Namespace Topic destination supports.

Once the subscription is configured with the basic information, select the **Event Grid Namespace Topic** endpoint type in the endpoint details section and select **Configure an endpoint** to configure the endpoint.

You might want to use this article as a reference to explore how to [subscribe to the blob storage](blob-event-quickstart-portal.md#subscribe-to-the-blob-storage).

Steps to configure the endpoint:

1. On the **Select Event Grid Namespace Topic** page, follow these steps.
    1. Select the **subscription**.
    1. Select the **resource group**.
    1. Select the **Event Grid namespace** resource previously created.
    1. Select the **Event Grid namespace topic** where you want to forward the events.
    1. Select **Confirm Selection**.

        :::image type="content" source="media/handler-event-grid-namespace-topic/namespace-topic-endpoint-configuration.png" alt-text="Screenshot that shows the Select Event Grid Namespace topic page to configure the endpoint to forward events from Event Grid basic to Event Grid namespace topic." border="false" lightbox="media/handler-event-grid-namespace-topic/namespace-topic-endpoint-configuration.png":::
1. Now, on the **Create Event Subscription** page, select **Create** to create the event subscription.

## Next steps

See the following articles:

- [Pull delivery overview](pull-delivery-overview.md)
- [Push delivery overview](push-delivery-overview.md)
- [Concepts](concepts.md)
- Quickstart: [Publish and subscribe to app events using namespace topics](publish-events-using-namespace-topics.md)
