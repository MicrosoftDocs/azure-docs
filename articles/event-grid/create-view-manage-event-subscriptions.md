---
title: Create, view, and manage Azure Event Grid event subscriptions in namespace topics
description: Learn how to create, view, and manage event subscriptions to namespace topics in Azure Event Grid by using the Azure portal.
author: robece
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.author: robece
ms.date: 08/26/2026
ai-usage: ai-assisted
#customer intent: As a developer, I want to create, view, and manage event subscriptions to namespace topics so that I can deliver events to my applications by using pull or push delivery.
---

# Create, view, and manage event subscriptions in namespace topics

An event subscription defines how a consumer receives events published to a namespace topic. This article shows you how to create, view, and manage event subscriptions to namespace topics in Azure Event Grid by using the Azure portal.

When you create an event subscription, you choose either pull or push delivery. With pull delivery, your application connects to Event Grid to read events at its own pace. With push delivery, Event Grid sends events to a destination that you configure. To learn more about these options, see [Pull delivery overview](pull-delivery-overview.md) and [Push delivery overview](namespace-push-delivery-overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- An Event Grid namespace. To create one, see [Create, view, and manage namespaces](create-view-manage-namespaces.md).
- A namespace topic in your Event Grid namespace. To create one, see [Create, view, and manage namespace topics](create-view-manage-namespace-topics.md).

## Create an event subscription in a namespace topic

1. In the [Azure portal](https://portal.azure.com), go to the namespace topic that you want to use for the event subscription. For steps to locate a topic, see [Create, view, and manage namespace topics](create-view-manage-namespace-topics.md).

1. In the **Entities** section, select **Subscriptions**.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscriptions.png" alt-text="Screenshot showing Event Grid event subscriptions.":::

1. On the **Subscriptions** page, select **+ Subscription**.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-create.png" alt-text="Screenshot showing Event Grid event subscription create.":::

1. On the **Basics** tab, enter a name for the event subscription, and then select the delivery mode.

    > [!IMPORTANT]
    > When you create a subscription, choose either the **Pull** or **Push** delivery mode. To learn more about the consumption modes available in Event Grid namespaces, see [Pull delivery overview](pull-delivery-overview.md) or [Push delivery overview](namespace-push-delivery-overview.md).

    The following screenshot shows the settings for a pull delivery subscription:

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-create-basics.png" alt-text="Screenshot showing pull event subscription creation.":::

    The following screenshot shows the settings for a push delivery subscription:

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-push-create-basics.png" alt-text="Screenshot showing push event subscription creation.":::

1. On the **Filters** tab, add the event types that you want to filter on, and add any context attribute filters that you want to use in the subscription.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-create-filters.png" alt-text="Screenshot showing Event Grid event subscription create filters.":::

1. On the **Additional features** tab, set the lock duration in minutes, specify the maximum delivery count, and then select **Create**.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-create-additional-features.png" alt-text="Screenshot showing Event Grid event subscription create additional features.":::

## View an event subscription in a namespace topic

1. Go to the namespace topic that contains the event subscription that you want to view. For steps to locate a topic, see [Create, view, and manage namespace topics](create-view-manage-namespace-topics.md).

1. In the **Entities** section, select **Subscriptions**.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscriptions.png" alt-text="Screenshot showing Event Grid event subscriptions.":::

1. Search for the subscription that you want to view, and then select it.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscriptions-search.png" alt-text="Screenshot showing Event Grid event subscriptions search.":::

1. Review the event subscription settings.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription.png" alt-text="Screenshot showing Event Grid event subscription.":::

## Delete an event subscription in a namespace topic

1. Go to the namespace topic that contains the event subscription that you want to delete. For steps to locate a topic, see [Create, view, and manage namespace topics](create-view-manage-namespace-topics.md).

1. In the **Entities** section, select **Subscriptions**.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscriptions.png" alt-text="Screenshot showing Event Grid event subscriptions.":::

1. Search for the subscription that you want to delete, and then select it.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscriptions-search.png" alt-text="Screenshot showing Event Grid event subscriptions search.":::

1. On the **Overview** page, select **Delete** on the toolbar.

    :::image type="content" source="media/create-view-manage-event-subscriptions/delete-event-subscription.png" alt-text="Screenshot showing Event Grid event subscription deletion.":::

1. On the confirmation page, enter the name of the resource, and then select **Delete** to confirm the deletion.

    :::image type="content" source="media/create-view-manage-event-subscriptions/delete-event-subscription-confirmation.png" alt-text="Screenshot showing Event Grid event subscription deletion confirmation.":::

## Configure filters for a namespace topic subscription

1. To update the filters for an existing subscription, go to the subscription, and then select **Filters** in the **Settings** section. Add the event types that you want to filter on, add any context attribute filters that you want to use, and then select **Save**.

    :::image type="content" source="media/create-view-manage-event-subscriptions/event-subscription-settings-filters.png" alt-text="Screenshot showing Event Grid event subscription filters settings." border="false" lightbox="media/create-view-manage-event-subscriptions/event-subscription-settings-filters.png":::

### Simplified filtering model for namespace topic subscriptions

Event subscriptions under a [namespace topic](concepts-event-grid-namespaces.md#namespace-topics) have a simplified filtering configuration model compared to event subscriptions to domains and to custom, system, partner, and domain topics. The filtering capabilities are the same, except for how you configure filters on the `subject` attribute. The following sections explain the differences.

#### Filter on event data

You can filter events based on values in the event `data` object when the event data is a JSON object. For more information, see [Event subscriptions](concepts-event-grid-namespaces.md#event-subscriptions).

#### Subject begins with

No dedicated configuration properties specify filters on `subject`. To filter the context attribute `subject` with a value that begins with a string, use the following filter configuration.

| key value  | operator   |   value |
|-----------|:---------:|-----------|
|  subject  |  String begins with   |  **your string**  |

#### Subject ends with

No dedicated configuration properties specify filters on `subject`. To filter the context attribute `subject` with a value that ends with a string, use the following filter configuration.

| key value  | operator   |   value |
|-----------|:---------:|-----------|
|  subject  |  String ends with   |  **your string**  |

## Related content

- [Publish to namespace topics and consume events](publish-events-using-namespace-topics.md)
- [Pull delivery overview](pull-delivery-overview.md)
- [Push delivery overview](namespace-push-delivery-overview.md)
