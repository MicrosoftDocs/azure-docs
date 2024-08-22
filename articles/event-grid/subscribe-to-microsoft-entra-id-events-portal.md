---
title: Subscribe to Microsoft Entra ID events using Azure portal
description: This article explains how to subscribe to events published by Microsoft Entra ID using the Azure portal.
ms.topic: how-to
ms.custom: build-2024
ms.date: 05/08/2024
author: spelluru
ms.author: spelluru
---

# Subscribe to events published by Microsoft Entra ID using the Azure portal
This article describes steps to subscribe to events published by Microsoft Entra ID using the Azure portal.

## Create a partner topic

1. Navigate to [Azure portal](https://portal.azure.com).
1. In the search box, type **Event Grid**, and select **Event Grid** from the results. 

    :::image type="content" source="./media/subscribe-to-microsoft-entra-id-events-portal/select-event-grid.png" alt-text="Screenshot that shows the search box with Event Grid.":::
1. On the left menu, expand **Partner events**, select **Available partners**.
1. On the **Microsoft Entra ID** tile, select **Create**. 
    
    :::image type="content" source="./media/subscribe-to-microsoft-entra-id-events-portal/select-microsoft-entra-id.png" alt-text="Screenshot that shows the Available partners page with Microsoft Entra ID selected." lightbox="./media/subscribe-to-microsoft-entra-id-events-portal/select-microsoft-entra-id.png":::    
1. On the **Microsoft Graph API subscription** tab of the wizard, follow these steps:
    1. For **Subscription**, select the **Azure subscription** in which you want to create the partner topic.
    1. For **Resource group**, select the resource group for the partner topic resource.
    1. For **Location**, select the region in which you want to create the partner topic.
    1. For **Partner topic name**, enter a name for the partner topic. 
    1. For **Resource**, specify the resource for which you want to receive the notifications. For example: `users`.
    
        :::image type="content" source="./media/subscribe-to-microsoft-entra-id-events-portal/graph-api-subscription-page.png" alt-text="Screenshot that shows the Microsoft Graph API subscription page with up to resource specified.":::            
    1. For **Change type**, select the types of events for which you want to be notified.

        :::image type="content" source="./media/subscribe-to-microsoft-entra-id-events-portal/select-change-type.png" alt-text="Screenshot that shows the Microsoft Graph API subscription page with Updated and Deleted types selected.":::                
    1. For **Expiration time**, select date and time when the partner topic expires.

        :::image type="content" source="./media/subscribe-to-microsoft-entra-id-events-portal/expiration-time.png" alt-text="Screenshot that shows the Microsoft Graph API subscription page with Expiration time specified.":::                
    1. Select **Enable lifecycle events** options if you want the `Microsoft.Graph.ReauthorizationRequired` event to be supported. For details about lifecycle events, see [Lifecycle notifications for subscriptions](/graph/change-notifications-lifecycle-events#supported-resources).
    1. Select **Next: Partner Configuration** at the bottom of the page.
1. On the **Partner Configuration** page, follow these steps:
    1. Select **+ Partner Authorization**. 
    
        :::image type="content" source="./media/subscribe-to-microsoft-entra-id-events-portal/select-partner-authorization.png" alt-text="Screenshot that shows the selection of + Partner Authorization on the Partner Configuration page.":::                    
    1. On the **Add partner authorization to create resources** page, select **Microsoft Graph API**, specify **Authorization expiration time**, and select **Add**. 

        :::image type="content" source="./media/subscribe-to-microsoft-entra-id-events-portal/select-microsoft-graph-api.png" alt-text="Screenshot that shows the selection of Microsoft Graph API.":::                    
    1. Now, on the **Partner Configuration** page, select **Next: Review + create** at the bottom of the page. 
    
        :::image type="content" source="./media/subscribe-to-microsoft-entra-id-events-portal/review-create-button.png" alt-text="Screenshot that shows the selection of Next: Review + create button.":::                    
1. On the **Review + create** page, review all the settings, and select **Create**.

    :::image type="content" source="./media/subscribe-to-microsoft-entra-id-events-portal/review-create-page.png" alt-text="Screenshot that shows the Review + create page.":::                    
1. After the Graph API subscription is created and the partner topic is activated, you see a link to navigate to the partner topic in the portal.

    :::image type="content" source="./media/subscribe-to-microsoft-entra-id-events-portal/go-to-partner-topic-button.png" alt-text="Screenshot that shows the Create page with a link to navigate to the partner topic.":::                    


[!INCLUDE [subscribe-to-partner-events-event-enablement](includes/subscribe-to-partner-events-event-enablement.md)]

## Test the event flow

You're now ready to test your Microsoft Entra ID subscription. According to the change type provided when you created the Microsoft Entra ID subscription, update, or delete the resource that you're tracking. You should see an event displayed on the Event Viewer application for every resource change you make.

## Next steps

- Build your own partner event handler application
  - Use the [sample applications](subscribe-to-graph-api-events.md#samples-with-detailed-instructions) as a way to expedite your development effort. After you have your application, you can update the event subscription endpoint with your application's endpoint.
  - For production purposes, you might want to automate the creation of the Microsoft Graph API subscription and hence the partner topic. To that end, the sample applications are also a good resource. You might want to consult the code snippets in section [How to create a Microsoft Graph API subscription](subscribe-to-graph-api-events.md#how-to-create-a-microsoft-graph-api-subscription) for quick reference.
  - The sample applications also show you how to renew Microsoft Graph API subscriptions to ensure a continuous flow of events. You should understand the concepts behind subscription renewal and the APIs called in section [How to renew a Microsoft Graph API subscription](subscribe-to-graph-api-events.md#how-to-renew-a-microsoft-graph-api-subscription)