---
title: Create, view, and manage Azure Event Grid event subscriptions in namespace topics
description: This article describes how to create, view and manage event subscriptions in namespace topics
author: robece
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.author: robece
ms.date: 11/15/2023
---

# Create, view, and manage event subscriptions in namespace topics

This article shows you how to create, view, and manage event subscriptions to namespace topics in Azure Event Grid.

## Create an event subscription

1. Follow the [create, view, and manage a namespace topics](create-view-manage-namespace-topics.md) steps to identify the topic you want to use to create the event subscription.

2. Click on the **Subscriptions** option in the **Entities** section.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscriptions.png" alt-text="Screenshot showing Event Grid event subscriptions.":::

3. Click "**+ Subscription**" button in the **Subscriptions** blade.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-create.png" alt-text="Screenshot showing Event Grid event subscription create.":::

4. In the **Basics** tab, type the name of the topic you want to create.

> [!IMPORTANT]
> When you create a subscription you will need to choose between the **pull** or **push** delivery mode. See [pull delivery overview](pull-delivery-overview.md) or [push delivery overview](namespace-push-delivery-overview.md) to learn more about the consumption modes available in Event Grid namespaces.

1. Pull delivery subscription:

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-create-basics.png" alt-text="Screenshot showing pull event subscription creation.":::

2. Push delivery subscription:

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-push-create-basics.png" alt-text="Screenshot showing push event subscription creation.":::

5. In the **Filters** tab, add the names of the event types you want to filter in the subscription and add context attribute filters you want to use in the subscription.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-create-filters.png" alt-text="Screenshot showing Event Grid event subscription create filters.":::

6. In the **Additional features** tab, set the lock duration in minutes, specify maximum delivery count, and then select **Create**.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-create-additional-features.png" alt-text="Screenshot showing Event Grid event subscription create additional features.":::

## View an event subscription

1. Follow the [create, view, and manage a namespace topics](create-view-manage-namespace-topics.md) steps to identify the topic you want to use to view the event subscription.

2. Click on the **Subscriptions** option in the **Entities** section.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscriptions.png" alt-text="Screenshot showing Event Grid event subscriptions.":::

3. Search for the subscription you want to view and select the subscription.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscriptions-search.png" alt-text="Screenshot showing Event Grid event subscriptions search.":::

4. Explore the event subscription topic settings.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription.png" alt-text="Screenshot showing Event Grid event subscription.":::

## Delete an event subscription

1. Follow the [create, view, and manage a namespace topics](create-view-manage-namespace-topics.md) steps to identify the topic you want to use to delete the event subscription.

2. Click on the **Subscriptions** option in the **Entities** section.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscriptions.png" alt-text="Screenshot showing Event Grid event subscriptions.":::

3. Search for the subscription you want to delete and select the subscription.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscriptions-search.png" alt-text="Screenshot showing Event Grid event subscriptions search.":::

4. On the **Overview** page, select **Delete** on the toolbar.

    :::image type="content" source="media/create-view-manage-event-subscriptions/delete-event-subscription.png" alt-text="Screenshot showing Event Grid event subscription deletion.":::

5. On the confirmation page, type the name of the resource and select **Delete** to confirm the deletion. It deletes the event subscription.

    :::image type="content" source="media/create-view-manage-event-subscriptions/delete-event-subscription-confirmation.png" alt-text="Screenshot showing Event Grid event subscription deletion confirmation.":::

## Filters configuration

1. To configure the filters associated to the subscription, select **Filters** option in the **Settings** section and add the names of the event types you want to filter in the subscription and add context attribute filters you want to use in the subscription, once you finish the filters configuration select **Save**.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-settings-filters.png" alt-text="Screenshot showing Event Grid event subscription filters settings." border="false" lightbox="media/create-view-manage-event-subscriptions/event-subscription-settings-filters.png":::

### Simplified resource model

The event subscriptions under a [Namespace Topic](concepts-event-grid-namespaces.md#namespace-topics) feature a simplified filtering configuration model when compared to that of event subscriptions to domains and to custom, system, partner, and domain topics. The filtering capabilities are the same except for the scenarios documented in the following sections.

#### Filter on event data

Filtering on event `data` isn't currently supported. This capability will be available in a future release.

#### Subject begins with

There's no dedicated configuration properties to specify filters on `subject`. You can configure filters in the following way to filter the context attribute `subject` with a value that begins with a string.

| key value  | operator   |   value |
|-----------|:---------:|-----------|
|  subject  |  String begins with   |  **your string**  |

#### Subject ends with

There's no dedicated configuration properties to specify filters on `subject`. You can configure filters in the following way to filter the context attribute `subject` with a value that ends with a string.

| key value  | operator   |   value |
|-----------|:---------:|-----------|
|  subject  |  String ends with   |  **your string**  |

## Next steps

- See the [Publish to namespace topics and consume events](publish-events-using-namespace-topics.md) steps to learn more about how to publish and subscribe events in Azure Event Grid namespaces.
