---
title: Create, view, and manage Azure Event Grid event subscriptions in namespace topics
description: This article describes how to create, view and manage event subscriptions in namespace topics
author: robece
ms.topic: how-to
ms.author: robece
ms.date: 04/28/2023
---

# Create, view, and manage event subscriptions in namespace topics

## Create an event subscription

1. Follow the [create, view, and manage a namespace topics](create-view-manage-namespace-topics.md) steps to identify the topic you want to use to create the event subscription.
2. Click on the **Subscriptions** option in the **Entities** section.
3. Click "**+ Subscription**" button in the **Subscriptions** blade.
4. In the **Basics** tab, type the name of the topic you want to create.
5. In the **Basics** tab, add the names of the event types you want to filter in the subscription.
6. In the **Filters** tab, add more advanced filters you want to use in the subscription.
7. In the **Additional features** tab, check "Enable dead-lettering" in case you want to store events that could not be delivered.
8. Select **Create** to create the subscription.
9. To view the created subscription, search for the subscription in the list of subscriptions and select it.

## View an event subscription

1. Follow the [create, view, and manage a namespace topics](create-view-manage-namespace-topics.md) steps to identify the topic you want to use to view the event subscription.
2. Click on the **Subscriptions** option in the **Entities** section.
3. Search for the subscription you want to select.
4. Select the subscription.

## Delete an event subscription

1. Follow the [create, view, and manage a namespace topics](create-view-manage-namespace-topics.md) steps to identify the topic you want to use to delete the event subscription.
2. Click on the **Subscriptions** option in the **Entities** section.
3. Search for the subscription you want to delete.
4. Select the subscription.
5. On the **Overview** page, select **Delete** on the toolbar.
6. On the confirmation page, type the name of the resource and select **Delete** to confirm the deletion. It deletes the event subscription.

## Next steps

- See the [Publish to namespace topics and consume events](publish-events-using-namespace-topics.md) steps to learn more about how to publish and subscribe events in Azure Event Grid namespaces.
