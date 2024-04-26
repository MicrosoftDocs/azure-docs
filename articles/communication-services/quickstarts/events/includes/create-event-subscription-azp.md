---
author: pgrandhi
ms.service: azure-communication-services
ms.topic: include
ms.date: 01/26/2024
ms.author: pgrandhi
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An [Azure Communication Services resource](../../create-communication-resource.md).
- Create a Webhook to receive events. [Webhook Event Delivery](/azure/event-grid/webhook-event-delivery).

[!INCLUDE [register-event-grid-resource-provider.md](register-event-grid-resource-provider.md)]

## Create event subscription

To create an Event subscription for Azure Communication Services, use the following steps. This article shows how to create an Event subscription for Azure Communication Services to receive events via Webhook.

To create an Event subscription for Azure Communication Services resource, first sign in to the [Azure portal](https://portal.azure.com). In the upper-left corner of the page, select the Communication Services resource. 
* Select on the Events tab on the left menu.
* Select on **+ Event Subscription**. 

:::image type="content" source="../media/subscribe-through-portal/add-subscription.png" alt-text="Screenshot highlighting the create event subscription button in the Azure portal." lightbox="../media/subscribe-through-portal/add-subscription.png":::

* On the **Create Event Subscription** page, follow these steps:
1. Enter a name for the event subscription. 
1. Enter a name for the System topic name.
1. Select the event types that you want to receive on the event subscription.

   :::image type="content" source="../media/subscribe-through-portal/select-event-types.png" alt-text="Screenshot that shows the selection of event types." lightbox="../media/subscribe-through-portal/select-event-types.png":::

   For more information on Communication Services events, see [Communication Services Events](/azure/event-grid/event-schema-communication-services)

1. Select the Endpoint Type as Web Hook.
 
   :::image type="content" source="../media/subscribe-through-portal/select-endpoint-type.png" alt-text="Screenshot that shows the selection of endpoint type." lightbox="../media/subscribe-through-portal/select-endpoint-type.png":::

1. Select **Configure an Endpoint**

    :::image type="content" source="../media/subscribe-through-portal/create-event-subscription.png" alt-text="Screenshot highlighting the create event page in the Azure portal." lightbox="../media/subscribe-through-portal/create-event-subscription.png":::
 
1. Enter the link to the webhook and Select **Confirm Selection**.

    :::image type="content" source="../media/subscribe-through-portal/select-web-hook-endpoint.png" alt-text="Screenshot highlighting the select webhook endpoint page in the Azure portal." lightbox="../media/subscribe-through-portal/select-web-hook-endpoint.png":::

1. In the **Filters** tab, add the names of the event types you want to filter in the subscription and add context attribute filters you want to use in the subscription. Then, select **Next: Additional features** at the bottom of the page.

    :::image type="content" source="../media/subscribe-through-portal/create-event-filters.png" alt-text="Screenshot highlighting Event Grid create filters page in the Azure portal." lightbox="../media/subscribe-through-portal/create-event-filters.png":::

1. To enable dead lettering and customize retry policies, select **Additional Features**.

    :::image type="content" source="../media/subscribe-through-portal/select-additional-features.png" alt-text="Screenshot that shows the Additional features tab of the Create Event Subscription page." lightbox="../media/subscribe-through-portal/select-additional-features.png":::

1. When done, select **Create**.


## Update event subscription

To update an Event subscription for Azure Communication Services, use the following steps. This section shows how to update an Event subscription for Azure Communication Services to update the events you want to receive via Webhook.

To update an Event subscription for Azure Communication Services resource, first sign in to the [Azure portal](https://portal.azure.com). In the upper-left corner of the page, select the Communication Services resource. 

1. Select the Events tab on the left menu.
1. Select the **Event Subscriptions** and select on the Event subscription you want to update. 

    :::image type="content" source="../media/subscribe-through-portal/event-subscriptions.png" alt-text="Screenshot highlighting the event subscription button in the Azure portal." lightbox="../media/subscribe-through-portal/event-subscriptions.png":::

1. On the **Event Subscription** page, select on **Filters** tab. Select the event types that you want to receive on the event subscription.

    :::image type="content" source="../media/subscribe-through-portal/update-event-types.png" alt-text="Screenshot that shows the selection of event types to update." lightbox="../media/subscribe-through-portal/update-event-types.png":::

1. To enable dead lettering and customize retry policies, select **Additional Features**.

    :::image type="content" source="../media/subscribe-through-portal/select-additional-features.png" alt-text="Screenshot that shows the Additional features tab of the Update Event Subscription page." lightbox="../media/subscribe-through-portal/select-additional-features.png":::

1. To update the webhook to receive events, select on **Change** next to the webhook link and enter the new webhook endpoint. 
     :::image type="content" source="../media/subscribe-through-portal/update-web-hook-endpoint.png" alt-text="Screenshot that shows the Change the webhook endpoint link in the Event Subscription page." lightbox="../media/subscribe-through-portal/update-web-hook-endpoint.png":::

1. When done, select **Save**,
     :::image type="content" source="../media/subscribe-through-portal/save-update.png" alt-text="Screenshot that shows the save button in the Azure portal." lightbox="../media/subscribe-through-portal/save-update.png":::

## Delete event subscription

To delete an Event subscription for Azure Communication Services, use the following steps.

To delete an Event subscription for Azure Communication Services resource, first sign in to the [Azure portal](https://portal.azure.com). In the upper-left corner of the page, select the Communication Services resource. 

1. Select on the Events tab on the left menu.
1. Select on **Event Subscriptions** and Select on the Event subscription you want to delete. 

    :::image type="content" source="../media/subscribe-through-portal/event-subscriptions.png" alt-text="Screenshot highlighting the event subscriptions button to access event subscription to be deleted in the Azure portal." lightbox="../media/subscribe-through-portal/event-subscriptions.png":::

1. On the Event Subscription page, Select on **Delete** button at the top. 

    :::image type="content" source="../media/subscribe-through-portal/delete-subscription.png" alt-text="Screenshot highlighting the delete button in the Azure portal." lightbox="../media/subscribe-through-portal/delete-subscription.png":::

## Next steps
* For a list of Communication Services events, see [Communication Services Events](/azure/event-grid/event-schema-communication-services).
* For a list of supported event handlers, see [Event handlers](/azure/event-grid/event-handlers).
* For information about event delivery and retries, [Event Grid message delivery and retry](/azure/event-grid/delivery-and-retry).
* For an introduction to Event Grid, see [About Event Grid](/azure/event-grid/overview).