---
title: Create, view, and manage Azure Event Grid namespace topics
description: This article describes how to create, view and manage namespace topics
author: robece
ms.topic: how-to
ms.custom:
  - build-2023
  - ignite-2023
ms.author: robece
ms.date: 11/15/2023
---

# Create, view, and manage namespace topics
This article shows you how to create, view, and manage namespace topics in Azure Event Grid. 



## Create a namespace topic

1. Follow the [create, view and manage namespaces](create-view-manage-namespaces.md) steps to identify the namespace you want to use to create the topic.

2. Once you are in the resource, click on the **Topics** option in the **Eventing** section.

    :::image type="content" source="media/create-view-manage-namespace-topics/namespace-topics.png" alt-text="Screenshot showing Event Grid namespace topic section.":::

3. Click "**+ Topic**" button in the **Topics** blade.

    :::image type="content" source="media/create-view-manage-namespace-topics/namespace-topic-creation.png" alt-text="Screenshot showing Event Grid namespace topic creation.":::

4. In the **Basics** tab, type the name of the topic you want to create and select **Create**.

    :::image type="content" source="media/create-view-manage-namespace-topics/namespace-topic-creation-basics.png" alt-text="Screenshot showing Event Grid namespace topic creation basics.":::

## View a namespace topic

1. Follow the [create, view, and manage namespaces](create-view-manage-namespaces.md) steps to identify the namespace you want to use to view the topic.

2. Click on the **Topics** option in the **Eventing** section.

    :::image type="content" source="media/create-view-manage-namespace-topics/namespace-topics.png" alt-text="Screenshot showing Event Grid namespace topic section.":::

3. Search for the topic you want to view and select the topic.

    :::image type="content" source="media/create-view-manage-namespace-topics/namespace-topic-search.png" alt-text="Screenshot showing Event Grid namespace topic search.":::

4. Explore the namespace topic settings.

    :::image type="content" source="media/create-view-manage-namespace-topics/namespace-topic-overview.png" alt-text="Screenshot showing Event Grid namespace topic settings.":::

## Delete a namespace topic

1. Follow the [create, view, and manage namespaces](create-view-manage-namespaces.md) steps to identify the namespace you want to use to delete the topic.

2. Click on the **Topics** option in the **Eventing** section.

    :::image type="content" source="media/create-view-manage-namespace-topics/namespace-topics.png" alt-text="Screenshot showing Event Grid namespace topic section.":::

3. Search for the topic you want to delete and select the topic.

    :::image type="content" source="media/create-view-manage-namespace-topics/namespace-topic-search.png" alt-text="Screenshot showing Event Grid namespace topic search.":::

4. On the **Overview** page, select **Delete** on the toolbar.

    :::image type="content" source="media/create-view-manage-namespace-topics/delete-namespace-topic.png" alt-text="Screenshot showing Event Grid namespace topic deletion.":::

5. On the confirmation page, type the name of the resource and select **Delete** to confirm the deletion. It deletes the topic and also all the nested subscriptions.

    :::image type="content" source="media/create-view-manage-namespace-topics/delete-namespace-topic-confirmation.png" alt-text="Screenshot showing how to confirm an Event Grid namespace topic deletion.":::

## Next steps

- See the [Create, view, and manage event subscriptions](create-view-manage-event-subscriptions.md) steps to learn more about the event subscriptions in Azure Event Grid namespaces.
