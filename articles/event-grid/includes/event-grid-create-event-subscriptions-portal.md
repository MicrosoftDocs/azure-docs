---
 title: include file
 description: include file
 services: event-grid
 author: sonalika-roy
 ms.service: event-grid
 ms.topic: include
 ms.date: 05/30/20223
 ms.author: sonalikaroy
 ms.custom: include file
---

## Create an event subscription

1. Follow the [create, view, and manage a namespace topics](../create-view-manage-namespace-topics.md) steps to identify the topic you want to use to create the event subscription.

2. Click on the **Subscriptions** option in the **Entities** section.

    :::image type="content" source="../media/create-view-manage-event-subscriptions/event-subscriptions.png" alt-text="Screenshot showing Event Grid event subscriptions.":::

3. Click "**+ Subscription**" button in the **Subscriptions** blade.

    :::image type="content" source="../media/create-view-manage-event-subscriptions/event-subscription-create.png" alt-text="Screenshot showing Event Grid event subscription create.":::

4. In the **Basics** tab, type the name of the topic you want to create.

    :::image type="content" source="../media/create-view-manage-event-subscriptions/event-subscription-create-basics.png" alt-text="Screenshot showing Event Grid event subscription create basics.":::

5. In the **Filters** tab, add the names of the event types you want to filter in the subscription and add context attribute filters you want to use in the subscription.

    :::image type="content" source="../media/create-view-manage-event-subscriptions/event-subscription-create-filters.png" alt-text="Screenshot showing Event Grid event subscription create filters.":::

6. In the **Additional features** tab, set the lock duration in minutes and select **Create**.

    :::image type="content" source="../media/create-view-manage-event-subscriptions/event-subscription-create-additional-features.png" alt-text="Screenshot showing Event Grid event subscription create additional features.":::
