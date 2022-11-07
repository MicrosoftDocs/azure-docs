---
title: How to send events from Auth0 to Azure using Azure Event Grid
description: How to end events from Auth0 to Azure services with Azure Event Grid.
ms.topic: conceptual
ms.date: 11/07/2022
---

# Integrate Azure Event Grid with Auth0
This article describes how to connect your Auth0 and Azure accounts by creating an Event Grid partner topic.

> [!NOTE]
> See the [Auth0 event type codes](https://auth0.com/docs/logs/references/log-event-type-codes) for a full list of the events that Auth0 supports

## Send events from Auth0 to Azure Event Grid
To send Auth0 events to Azure:

1. [Register the Event Grid resource provider](#register-the-event-grid-resource-provider) with your Azure subscription.
1. [Authorize partner](#authorize-partner-to-create-a-partner-topic) to create a partner topic in your resource group.
3. Request Auth0 to enable events flow to a partner topic by [setting up an Auth0 partner topic](#set-up-an-auth0-partner-topic) in the Auth0 Dashboard.
4. [Activate partner topic](#activate-the-partner-topic) so that your events start flowing to your partner topic.
5. [Subscribe to events](#subscribe-to-events).


[!INCLUDE [register-event-grid-provider](includes/register-event-grid-provider.md)]

## Authorize partner to create a partner topic

You must grant your consent to Auth0 to create a partner topic in a resource group that you designate. This authorization has an expiration time. It's effective for the time period you specify between 1 to 365 days. 

> [!IMPORTANT]
> For a greater security stance, specify the minimum expiration time that offers the partner enough time to configure your events to flow to Event Grid and to provision your partner topic. Your partner won't be able to create resources (partner topics) in your Azure subscription after the authorization expiration time. 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar at the top, enter **Partner Configurations**, and select **Event Grid Partner Configurations** under **Services** in the results. 
1. On the **Event Grid Partner Configurations** page, select **Create Event Grid partner configuration** button on the page (or) select **+ Create** on the command bar. 

    :::image type="content" source="./media/subscribe-to-partner-events/partner-configurations.png" alt-text="Event Grid Partner Configurations page showing the list of partner configurations and the link to create a partner registration.":::    
1. On the **Create Partner Configuration** page, do the following steps: 
    1. In the **Project Details** section, select the **Azure subscription** and the **resource group** where you want to allow the partner to create a partner topic. 
    1. In the **Partner Authorizations** section, specify a default expiration time for partner authorizations defined in this configuration. 
    1. To provide your authorization for a partner to create partner topics in the specified resource group, select **+ Partner Authorization** link. 
    
        :::image type="content" source="./media/subscribe-to-partner-events/partner-authorization-configuration.png" alt-text="Create Partner Configuration page with the Partner Authorization link selected.":::
        
1. On the **Add partner authorization to create resources** page, you see a list of **verified partners**. A verified partner is a partner whose identity has been validated by Microsoft. Follow these steps to authorize **Auth0** to create a partner topic. 
    1. Select **Auth0** from the list of verified partners.
    1. Specify **authorization expiration time**.
    1. select **Add**. 

        :::image type="content" source="./media/auth0-how-to/add-verified-partner.png" alt-text="Screenshot for granting a verified partner the authorization to create resources in your resource group.":::        

        > [!IMPORTANT]          
        > Your partner won't be able to create resources (partner topics) in your Azure subscription after the authorization expiration time. 
1. Back on the **Create Partner Configuration** page, verify that the partner is added to the partner authorization list at the bottom, and then select **Review + create** at the bottom of the page. 

    :::image type="content" source="./media/auth0-how-to/create-partner-registration.png" alt-text="Create Partner Configuration page showing the partner authorization you just added.":::                    
1. On the **Review** page, review all settings, and then select **Create** to create the partner registration. 

    :::image type="content" source="./media/auth0-how-to/review-partner-authorization.png" alt-text="Screenshot showing the Create Partner Configuration page with Auth0.":::
1. After the deployment is complete, select **Go to resource** to navigate to the **Event Grid Partner Configuration** page that shows **Auth0** partner authorization.

    :::image type="content" source="./media/auth0-how-to/partner-configuration.png" alt-text="Screenshot showing the Partner Configuration page with Auth0.":::


## Set up an Auth0 partner topic
Part of the integration process is to set up Auth0 for use as an event source by using the [Auth0 Dashboard](https://manage.auth0.com/).

1. Log in to the [Auth0 Dashboard](https://manage.auth0.com/).
1. Navigate to **Monitoring** > **Streams**.
1. Click **+ Create Log Stream**.
1. Select **Azure Event Grid** and enter a unique name for your new stream.
1. For **Subscription ID**, enter your Azure subscription ID. 
1. For **Azure Region**, select the Azure region in which the resource group exists. 
1. For **Resource Group**, enter the name of the resource group.
1. For **Filter by Event Category**, select **All** or filter for specific types of events.
1. Select **Use a specific day and time to start the stream from** option if you want the streaming to start on a specific day and time. 
1. Click **Save**.

You should see the partner topic in the resource group you specified. [Activate the partner topic](subscribe-to-partner-events.md#activate-a-partner-topic) so that your events start flowing to your partner topic. Then, [subscribe to events](subscribe-to-partner-events.md#subscribe-to-events).


:::image type="content" source="./media/auth0-how-to/partner-topic.png" alt-text="Screenshot showing the partner topic in the list.":::
 
## Activate the partner topic

1. On the **Event Grid Partner Topics** page, select the partner topic in the list. You should see the **Partner Topic** page. 
1. Review the activate message, and select **Activate** on the page or on the command bar to activate the partner topic before the expiration time mentioned on the page. 

    :::image type="content" source="./media/auth0-how-to/activate-partner-topic-button.png" lightbox="./media/onboard-partner/activate-partner-topic-button.png" alt-text="Image showing the selection of the Activate button on the command bar or on the page.":::    
1. Confirm that the activation status is set to **Activated** and then create event subscriptions for the partner topic by selecting **+ Event Subscription** on the command bar. 

    :::image type="content" source="./media/auth0-how-to/partner-topic-activation-status.png" lightbox="./media/onboard-partner/partner-topic-activation-status.png" alt-text="Image showing the activation state as **Activated**.":::   

[!INCLUDE [subscribe-to-events](includes/subscribe-to-events.md)]

Try [invoking any of the Auth0 actions that trigger an event to be published](https://auth0.com/docs/logs/references/log-event-type-codes) to see events flow.

## Verify the integration
To verify that the integration is working as expected:

1. Log in to the Auth0 Dashboard.
1. Navigate to **Monitoring** > **Streams**.
1. Click on your **Event Grid stream**.
1. Once on the stream, click on the **Health** tab. The stream should be active and as long as you don't see any errors, the stream is working.

## Delivery attempts and retries
Auth0 events are delivered to Azure via a streaming mechanism. Each event is sent as it's triggered in Auth0. If Event Grid is unable to receive the event, Auth0 will retry up to three times to deliver the event. Otherwise, Auth0 will log the failure to deliver in its system.


## Next steps

- [Auth0 Partner Topic](auth0-overview.md)
- [Partner topics overview](partner-events-overview.md)
- [Become an Event Grid partner](onboard-partner.md)