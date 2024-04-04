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

1. If you are on the **Topics** page of your Event Grid namespace in the Azure portal, select your topic from the list of topics. If you are on the **Topics** page, follow instructions from [create, view, and manage a namespace topics](../create-view-manage-namespace-topics.md) to identify the topic you want to use to create the event subscription.
2. On the **Event Gird Namespace Topic** page, select **Subscriptions** option in the **Entities** section on the left menu.
3. On the **Subscriptions** page, select "**+ Subscription**" button on the command bar.

    :::image type="content" source="../media/create-view-manage-event-subscriptions/event-subscription-create.png" alt-text="Screenshot showing Event Grid event subscription create.":::
4. In the **Basics** tab, type the name of the topic you want to create, and then select **Next: Filters** at the bottom of the page.

    :::image type="content" source="../media/create-view-manage-event-subscriptions/event-subscription-create-basics.png" alt-text="Screenshot showing Event Grid event subscription create basics.":::
5. In the **Filters** tab, add the names of the event types you want to filter in the subscription and add context attribute filters you want to use in the subscription. Then, select **Next: Additional features** at the bottom of the page.

    :::image type="content" source="../media/create-view-manage-event-subscriptions/event-subscription-create-filters.png" alt-text="Screenshot showing Event Grid event subscription create filters.":::
6. In the **Additional features** tab, you can specify the event retention, maximum delivery count, lock duration, and dead-lettering settings. 

    :::image type="content" source="../media/create-view-manage-event-subscriptions/event-subscription-create-additional-features.png" alt-text="Screenshot showing Event Grid event subscription create additional features.":::
7. Select **Create** to create the event subscription. 
