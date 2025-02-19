---
title: Azure Event Grid subscriptions through portal
description: This article describes how to create Event Grid subscriptions for the supported sources, such as Azure Blob Storage, by using the Azure portal.
ms.topic: how-to
ms.custom: build-2023
ms.date: 01/21/2025
# Customer intent: I want to learn how to create Azure Event Grid subscriptions for the supported sources such as Azure Blob Storage using the Azure portal. 
---

# Subscribe to events through portal

This article describes how to create Event Grid subscriptions through the portal. 

## Create event subscriptions

To create an Event Grid subscription for any of the supported [event sources](concepts.md#event-sources), use the following steps. This article shows how to create an Event Grid subscription for an Azure subscription.

1. In the Azure portal, search for **Event Grid Subscriptions** using the search box at the top, and select it from the available options.

    :::image type="content" source="./media/subscribe-through-portal/search.png" alt-text="Screenshot that shows Event Grid Subscription in the search box in the Azure portal.":::
1. Select **+ Event Subscription**.

    :::image type="content" source="./media/subscribe-through-portal/add-subscription.png" alt-text="Screenshot that shows the select of Add Event Subscription menu on the Event Grid Subscriptions page.":::
1. On the **Create Event Subscription** page, follow these steps:
    1. Enter a name for the event subscription. 
    1. Select the type of event source (**topic type**) on which you want to create a subscription. For example, to subscribe to events for your Azure storage account, select **Storage Accounts**.
    
        :::image type="content" source="./media/subscribe-through-portal/azure-subscription.png" alt-text="Screenshot that shows the Create Event Subscription page.":::
    1. Select the Azure subscription that contains the storage account.
    1. Select the resource group that has the storage account.
    1. Then, select the storage account.

        :::image type="content" source="./media/subscribe-through-portal/create-event-subscription.png" alt-text="Screenshot that shows the Create Event Subscription page with the storage account selected.":::
1. Select the event types that you want to receive on the event subscription.

    :::image type="content" source="./media/subscribe-through-portal/select-event-types.png" alt-text="Screenshot that shows the selection of event types.":::
1. If there's a system topic for the resource you selected, it shows up as a read-only field for **System Topic Name**. Otherwise, enter a name for the system topic. 
1. Select an **endpoint type**, and the endpoint that receives the events. In the following example, **Service Bus Queue** is selected as the endpoint type and `myqueue` is the name of the Service Bus queue that receives events from Event Grid. 

    :::image type="content" source="./media/subscribe-through-portal/select-end-point.png" alt-text="Screenshot that shows the selection of an endpoint.":::
    
    > [!NOTE]
    > - For a list of supported event handlers, see [Event handlers](event-handlers.md).
    > - If you enable managed identity for a topic or domain, you need to add the managed identity to the appropriate role-based access control (RBAC) role on the destination for the messages to be delivered successfully. For more information, see [Supported destinations and Azure roles](add-identity-roles.md#supported-destinations-and-azure-roles).
1. In the **Managed Identity for Delivery** section, specify if you want to use a system assigned managed identity or user-assigned managed identity to deliver events to the endpoint or destination. 
1. To enable dead lettering and customize retry policies, select **Additional Features**.

    :::image type="content" source="./media/subscribe-through-portal/select-additional-features.png" alt-text="Screenshot that shows the Additional features tab of the Create Event Subscription page.":::
1. When done, select **Create**.

## Create subscription on resource

Some event sources support creating an event subscription through the portal interface for that resource. Select the event source, and look for **Events** in left pane.

:::image type="content" source="./media/subscribe-through-portal/resource-events.png" alt-text="Screenshot that shows the Events option on the left menu of the Storage account page on the Azure portal.":::

The portal presents you with options for creating an event subscription that is relevant to that source.

## Related content

* For information about event delivery and retries, [Event Grid message delivery and retry](delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
