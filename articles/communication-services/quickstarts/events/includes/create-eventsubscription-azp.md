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
- Register the [Event Grid Resource Provider](./register-event-grid-resource-provider.md).
- Create a Webhook to receive events. [Webhook Event Delivery](../../../../../articles/event-grid/webhook-event-delivery.md).

## Create Event Subscription

To create an Event subscription for Azure Communication Services, use the following steps. This article shows how to create an Event subscription for Azure Communication Services to receive events via Webhook.

To create an Event subscription for Azure Communication Services resource, first sign in to the [Azure portal](https://portal.azure.com). In the upper-left corner of the page, select the Communication Services resource. 

1. Click on the Events tab on the left menu.
1. Click on **+ Event Subscription**. 

:::image type="content" source="../media/subscribe-through-portal/add-subscription.png" alt-text="Screenshot highlighting the create event subscription button in the Azure portal.":::

1. On the **Create Event Subscription** page, follow these steps:
1. Enter a name for the event subscription. 
1. Enter a name for the System topic name.
1. Select the event types that you want to receive on the event subscription.

    :::image type="content" source="../media/subscribe-through-portal/select-event-types.png" alt-text="Screenshot that shows the selection of event types.":::

For more information on Communication Services events, see [Communication Services Events](../../../../../articles/event-grid/event-schema-communication-services.md)

1. Select the Endpoint Type as Web Hook.
     :::image type="content" source="../media/subscribe-through-portal/select-endpoint-type.png" alt-text="Screenshot that shows the selection of endpoint type.":::

1. Click on **Configure an Endpoint**

    :::image type="content" source="../media/subscribe-through-portal/create-event-subscription.png" alt-text="Screenshot highlighting the create event page in the Azure portal.":::
 
1. Enter the link to the webhook and Click **Confirm Selection**.

    :::image type="content" source="../media/subscribe-through-portal/select-webhook-endpoint.png" alt-text="Screenshot highlighting the select webhook endpoint page in the Azure portal.":::

1. In the **Filters** tab, add the names of the event types you want to filter in the subscription and add context attribute filters you want to use in the subscription. Then, select **Next: Additional features** at the bottom of the page.

    :::image type="content" source="../media/subscribe-through-portal/create-event-filters.png" alt-text="Screenshot highlighting Event Grid create filters page in the Azure portal.":::

1. To enable dead lettering and customize retry policies, select **Additional Features**.

    :::image type="content" source="../media/subscribe-through-portal/select-additional-features.png" alt-text="Screenshot that shows the Additional features tab of the Create Event Subscription page.":::
1. When done, select **Create**.


## Update Event Subscription

To update an Event subscription for Azure Communication Services, use the following steps. This section shows how to update an Event subscription for Azure Communication Services to update the events you want to receive via Webhook.

To update an Event subscription for Azure Communication Services resource, first sign in to the [Azure portal](https://portal.azure.com). In the upper-left corner of the page, select the Communication Services resource. 

1. Click on the Events tab on the left menu.
1. Click on **Event Subscriptions** and click on the Event subscription you want to update. 

    :::image type="content" source="../media/subscribe-through-portal/update-subscription.png" alt-text="Screenshot highlighting the event subscription button in the Azure portal.":::

1. On the **Event Subscription** page, click on **Filters** tab. Select the event types that you want to receive on the event subscription.

    :::image type="content" source="../media/subscribe-through-portal/update-event-types.png" alt-text="Screenshot that shows the selection of event types.":::

For more information on Communication Services events, see [Communication Services Events](../../../../../articles/event-grid/event-schema-communication-services.md)

1. To enable dead lettering and customize retry policies, select **Additional Features**.

    :::image type="content" source="../media/subscribe-through-portal/select-additional-features.png" alt-text="Screenshot that shows the Additional features tab of the Create Event Subscription page.":::

1. To update the webhook to receive events, click on **Change** next to the webhook link and enter the new webhook endpoint. 
     :::image type="content" source="../media/subscribe-through-portal/update-webhook-endpoint.png" alt-text="Screenshot that shows the Additional features tab of the Create Event Subscription page.":::

1. When done, click **Save**,
     :::image type="content" source="../media/subscribe-through-portal/save-update.png" alt-text="Screenshot that shows the selection of endpoint type.":::

## Delete Event Subscription

To delete an Event subscription for Azure Communication Services, use the following steps.

To delete an Event subscription for Azure Communication Services resource, first sign in to the [Azure portal](https://portal.azure.com). In the upper-left corner of the page, select the Communication Services resource. 

1. Click on the Events tab on the left menu.
1. Click on **Event Subscriptions** and click on the Event subscription you want to delete. 

    :::image type="content" source="../media/subscribe-through-portal/update-subscription.png" alt-text="Screenshot highlighting the create event subscription button in the Azure portal.":::

1. On the Event Subscription page, click on **Delete** button at the top. 

    :::image type="content" source="../media/subscribe-through-portal/delete-subscription.png" alt-text="Screenshot highlighting the delete event subscription button in the Azure portal.":::

## Next steps
* For a list of Communication Services events, see [Communication Services Events](../../../../../articles/event-grid/event-schema-communication-services.md).
* For a list of supported event handlers, see [Event handlers](../../../../../articles/event-grid/includes/event-handlers.md).
* For information about event delivery and retries, [Event Grid message delivery and retry](../../../../../articles/event-grid/delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](../../../../../articles/event-grid/overview.md).