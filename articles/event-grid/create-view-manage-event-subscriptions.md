---
title: Create, view, and manage Azure Event Grid event subscriptions in namespace topics
description: This article describes how to create, view and manage event subscriptions in namespace topics
author: robece
ms.topic: how-to
ms.custom: build-2023
ms.author: robece
ms.date: 05/23/2023
---

# Create, view, and manage event subscriptions in namespace topics

## Create an event subscription

1. Follow the [create, view, and manage a namespace topics](create-view-manage-namespace-topics.md) steps to identify the topic you want to use to create the event subscription.

2. Click on the **Subscriptions** option in the **Entities** section.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscriptions.png" alt-text="Screenshot showing Event Grid event subscriptions.":::

3. Click "**+ Subscription**" button in the **Subscriptions** blade.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-create.png" alt-text="Screenshot showing Event Grid event subscription create.":::

4. In the **Basics** tab, type the name of the topic you want to create.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-create-basics.png" alt-text="Screenshot showing Event Grid event subscription create basics.":::

5. In the **Filters** tab, add the names of the event types you want to filter in the subscription and add context attribute filters you want to use in the subscription.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-create-filters.png" alt-text="Screenshot showing Event Grid event subscription create filters.":::

6. In the **Additional features** tab, set the lock duration in minutes and select **Create**.

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

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-settings-filters.png" alt-text="Screenshot showing Event Grid event subscription filters settings.":::

## Next steps

- See the [Publish to namespace topics and consume events](publish-events-using-namespace-topics.md) steps to learn more about how to publish and subscribe events in Azure Event Grid namespaces.
