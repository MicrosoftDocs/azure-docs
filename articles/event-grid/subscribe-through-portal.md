---
title: Azure Event Grid subscriptions through the portal
description: Create Azure Event Grid subscriptions for supported event sources like Azure Blob Storage by using the Azure portal.
ms.topic: how-to
ms.date: 06/11/2026
ai-usage: ai-assisted
# Customer intent: I want to learn how to create Azure Event Grid subscriptions for the supported sources such as Azure Blob Storage using the Azure portal. 
---

# Subscribe to events through the portal

This article describes how to create Event Grid subscriptions through the Azure portal. 

## Create event subscriptions

To create an Event Grid subscription for any of the supported [event sources](concepts.md#event-sources), follow these steps. This example shows how to create an Event Grid subscription for an Azure subscription.

1. In the Azure portal, search for **Event Grid Subscriptions** using the search box at the top, and select it from the available options.

    :::image type="content" source="./media/subscribe-through-portal/search.png" alt-text="Screenshot that shows Event Grid Subscription in the search box in the Azure portal.":::
1. Select **+ Event Subscription**.

    :::image type="content" source="./media/subscribe-through-portal/add-subscription.png" alt-text="Screenshot that shows the Event Subscription button on the Event Grid Subscriptions page.":::
1. On the **Create Event Subscription** page, follow these steps:
    1. Enter a name for the event subscription. 
    1. Select the type of event source (**topic type**) on which you want to create a subscription. For example, to subscribe to events for your Azure storage account, select **Storage Accounts**.
    
        :::image type="content" source="./media/subscribe-through-portal/azure-subscription.png" alt-text="Screenshot that shows the Create Event Subscription page.":::
    1. Select the Azure subscription that contains the storage account.
    1. Select the resource group that has the storage account.
    1. Select the storage account.

        :::image type="content" source="./media/subscribe-through-portal/create-event-subscription.png" alt-text="Screenshot that shows the Create Event Subscription page with the storage account selected.":::
1. Select the event types that you want to receive on the event subscription.

    :::image type="content" source="./media/subscribe-through-portal/select-event-types.png" alt-text="Screenshot that shows the selection of event types.":::
1. If there's a system topic for the resource you selected, it shows up as a read-only field for **System Topic Name**. Otherwise, enter a name for the system topic. 

    :::image type="content" source="./media/subscribe-through-portal/system-topic-name.png" alt-text="Screenshot that shows the system topic name field.":::    
1. Select an **endpoint type**. In this example, **Service Bus Queue** is selected as the endpoint type. Then, select the **Configure an endpoint** link to select the Service Bus queue that receives events from Event Grid. 
    
    :::image type="content" source="./media/subscribe-through-portal/configure-endpoint.png" alt-text="Screenshot that shows the selection of Service Bus queue as the endpoint.":::
    
1.  In the **Select Service Bus Queue** pane, select the Service Bus namespace and queue that receives events from Event Grid, and then select **Confirm selection**. In this example, `myqueue` is the name of the Service Bus queue that receives events from Event Grid. 

    :::image type="content" source="./media/subscribe-through-portal/select-queue.png" alt-text="Screenshot that shows the selection of an endpoint.":::
    
    > [!NOTE]
    > - For a list of supported event handlers, see [Event handlers](event-handlers.md).
    > - If you enable managed identity for a topic or domain, add the managed identity to the appropriate role-based access control (RBAC) role on the destination for successful message delivery. For more information, see [Supported destinations and Azure roles](add-identity-roles.md#supported-destinations-and-azure-roles).
1. In the **Managed Identity for Delivery** section, select whether to use a system-assigned managed identity or user-assigned managed identity to deliver events to the endpoint or destination. 
1. Use the **Filters** tab to apply filters to the event subscription. For example, you can filter events by event type, subject, or advanced filters. For more information, see [Event subscription filters](event-filtering.md).

    :::image type="content" source="./media/subscribe-through-portal/filters.png" alt-text="Screenshot that shows the Filters tab of the Create Event Subscription page.":::
1. Use the **Additional features** tab to enable dead lettering and customize retry policies. [Dead lettering](manage-event-delivery.md#set-dead-letter-location) allows you to specify a storage blob container where events that can't be delivered to the event handler are stored. You can then inspect these events to understand why they weren't delivered. Customizing [retry policies](manage-event-delivery.md#set-retry-policy) allows you to specify how Event Grid retries event delivery in case of transient failures. 

    :::image type="content" source="./media/subscribe-through-portal/select-additional-features.png" alt-text="Screenshot that shows the Additional features tab of the Create Event Subscription page.":::
1. Use the **Delivery properties** tab to set up HTTP headers that are included in delivered events. You can add up to 10 custom HTTP headers to include in delivered events. Each header value can't exceed 4,096 (4K) bytes. This feature allows you to set custom headers that a destination requires. For more information, see [Custom delivery properties](delivery-properties.md).

    :::image type="content" source="./media/subscribe-through-portal/delivery-properties.png" alt-text="Screenshot that shows the Delivery properties tab of the Create Event Subscription page.":::
1. Select **Create**.

## Create subscription on resource

Some event sources support creating an event subscription through the portal interface for that resource. Select the event source, and look for **Events** in the left pane.

:::image type="content" source="./media/subscribe-through-portal/resource-events.png" alt-text="Screenshot that shows the Events option on the left menu of the Storage account page on the Azure portal.":::

The portal shows options for creating an event subscription that's relevant to that source.

## Related content

* For information about event delivery and retries, see [Event Grid message delivery and retry](delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
