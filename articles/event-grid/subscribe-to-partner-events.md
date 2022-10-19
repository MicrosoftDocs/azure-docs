---
title: Azure Event Grid - Subscribe to partner events 
description: This article explains how to subscribe to events from a partner using Azure Event Grid.
ms.topic: how-to
ms.date: 09/14/2022
---

# Subscribe to events published by a partner with Azure Event Grid
This article describes steps to subscribe to events that originate in a system owned or managed by a partner (SaaS, ERP, etc.). 

> [!IMPORTANT]
>If you aren't familiar with the **Partner Events** feature, see [Partner Events overview](partner-events-overview.md) to understand the rationale of the steps in this article.


## High-level steps

Here are the steps that a subscriber needs to perform to receive events from a partner.

1. [Register the Event Grid resource provider](#register-the-event-grid-resource-provider) with your Azure subscription.
2. [Authorize partner](#authorize-partner-to-create-a-partner-topic) to create a partner topic in your resource group.
3. [Request partner to enable events flow to a partner topic](#request-partner-to-enable-events-flow-to-a-partner-topic).
4. [Activate partner topic](#activate-a-partner-topic) so that your events start flowing to your partner topic.
5. [Subscribe to events](#subscribe-to-events).

[!INCLUDE [register-event-grid-provider](includes/register-event-grid-provider.md)]

## Authorize partner to create a partner topic

You must grant your consent to the partner to create partner topics in a resource group that you designate. This authorization has an expiration time. It's effective for the time period you specify between 1 to 365 days. 

> [!IMPORTANT]
> For a greater security stance, specify the minimum expiration time that offers the partner enough time to configure your events to flow to Event Grid and to provision your partner topic. Your partner won't be able to create resources (partner topics) in your Azure subscription after the authorization expiration time. 

> [!NOTE]
> Event Grid started enforcing authorization checks to create partner topics around June 30th, 2022. 

Following example shows the way to create a partner configuration resource that contains the partner authorization. You must identify the partner by providing either its **partner registration ID** or the **partner name**. Both can be obtained from your partner, but only one of them is required. For your convenience, the following examples leave a sample expiration time in the UTC format.

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar at the top, enter **Partner Configurations**, and select **Event Grid Partner Configurations** under **Services** in the results. 
1. On the **Event Grid Partner Configurations** page, select **Create Event Grid partner configuration** button on the page (or) select **+ Create** on the command bar. 

    :::image type="content" source="./media/subscribe-to-partner-events/partner-configurations.png" alt-text="Event Grid Partner Configurations page showing the list of partner configurations and the link to create a partner registration.":::    
1. On the **Create Partner Configuration** page, do the following steps: 
    1. In the **Project Details** section, select the **Azure subscription** and the **resource group** where you want to allow the partner to create a partner topic. 
    1. In the **Partner Authorizations** section, specify a default expiration time for partner authorizations defined in this configuration. 
    1. To provide your authorization for a partner to create partner topics in the specified resource group, select **+ Partner Authorization** link. 
    
        :::image type="content" source="./media/subscribe-to-partner-events/partner-authorization-configuration.png" alt-text="Create Partner Configuration page with the Partner Authorization link selected.":::
        
1. On the **Add partner authorization to create resources** page, you see a list of **verified partners**. A verified partner is a partner whose identity has been validated by Microsoft. You can select a verified partner, and select **Add** button at the bottom to give the partner the authorization to add a partner topic in your resource group. This authorization is effective up to the expiration time. 

    You also have an option to authorize a **non-verified partner.** Unless the partner is an entity that you know well, for example, an organization within your company, it's strongly encouraged that you only work with verified partners. If the partner isn't yet verified, encourage them to get verified by asking them to contact the Event Grid team at askgrid@microsoft.com. 

    1. To authorize a **verified partner**:
        1. Select the partner from the list.
        1. Specify **authorization expiration time**.
        1. select **Add**. 
    
            :::image type="content" source="./media/subscribe-to-partner-events/add-verified-partner.png" alt-text="Screenshot for granting a verified partner the authorization to create resources in your resource group.":::        
    1. To authorize a non-verified partner, select **Authorize non-verified partner**, and follow these steps:
        1. Enter the **partner registration ID**. You need to ask your partner for this ID. 
        1. Specify authorization expiration time. 
        1. Select **Add**. 
        
            :::image type="content" source="./media/subscribe-to-partner-events/add-non-verified-partner.png" alt-text="Screenshot for granting a non-verified partner the authorization to create resources in your resource group.":::       

            > [!IMPORTANT]          
            > Your partner won't be able to create resources (partner topics) in your Azure subscription after the authorization expiration time. 
1. Back on the **Create Partner Configuration** page, verify that the partner is added to the partner authorization list at the bottom. 
1. Select **Review + create** at the bottom of the page. 

    :::image type="content" source="./media/subscribe-to-partner-events/create-partner-registration.png" alt-text="Create Partner Configuration page showing the partner authorization you just added.":::                    
1. On the **Review** page, review all settings, and then select **Create** to create the partner registration. 


## Request partner to enable events flow to a partner topic

Here's the list of partners and a link to submit a request to enable events flow to a partner topic.

- [Auth0](auth0-how-to.md)
- [Microsoft Graph API](subscribe-to-graph-api-events.md)


## Activate a partner topic

1. In the search bar of the Azure portal, search for and select **Event Grid Partner Topics**.
1. On the **Event Grid Partner Topics** page, select the partner topic in the list. 

    :::image type="content" source="./media/onboard-partner/select-partner-topic.png" lightbox="./media/onboard-partner/select-partner-topic.png" alt-text="Select a partner topic in the Event Grid Partner Topics page.":::    
1. Review the activate message, and select **Activate** on the page or on the command bar to activate the partner topic before the expiration time mentioned on the page. 

    :::image type="content" source="./media/onboard-partner/activate-partner-topic-button.png" lightbox="./media/onboard-partner/activate-partner-topic-button.png" alt-text="Image showing the selection of the Activate button on the command bar or on the page.":::    
1. Confirm that the activation status is set to **Activated** and then create event subscriptions for the partner topic by selecting **+ Event Subscription** on the command bar. 

    :::image type="content" source="./media/onboard-partner/partner-topic-activation-status.png" lightbox="./media/onboard-partner/partner-topic-activation-status.png" alt-text="Image showing the activation state as **Activated**.":::   

## Subscribe to events
First, create an event handler that will handle events from the partner. For example, create an event hub, Service Bus queue or topic, or an Azure function.

Then, create an event subscription for the partner topic using the event handler you created. 

#### Create an event handler
To test your partner topic, you'll need an event handler. Go to your Azure subscription and spin up a service that's supported as an [event handler](event-handlers.md) such as an [Azure Function](custom-event-to-function.md). For an example, see [Event Grid Viewer sample](custom-event-quickstart-portal.md#create-a-message-endpoint) that you can use as an event handler via webhooks. 

#### Subscribe to the partner topic
Subscribing to the partner topic tells Event Grid where you want your partner events to be delivered.

1. In the Azure portal, type **Event Grid Partner Topics** in the search box, and select **Event Grid Partner Topics**. 
1. On the **Event Grid Partner Topics** page, select the partner topic in the list. 

    :::image type="content" source="./media/subscribe-to-partner-events/select-partner-topic.png" lightbox="./media/subscribe-to-partner-events/select-partner-topic.png" alt-text="Image showing the selection of a partner topic.":::
1. On the **Event Grid Partner Topic** page for the partner topic, select **+ Event Subscription** on the command bar. 

    :::image type="content" source="./media/subscribe-to-partner-events/select-add-event-subscription.png" alt-text="Image showing the selection of Add Event Subscription button on the Event Grid Partner Topic page.":::    
1. On the **Create Event Subscription** page, do the following steps:
    1. Enter a **name** for the event subscription.
    1. For **Filter to Event Types**, select types of events that your subscription will receive.
    1. For **Endpoint Type**, select an Azure service (Azure Function, Storage Queues, Event Hubs, Service Bus Queue, Service Bus Topic, Hybrid Connections. etc.), or webhook.
    1. Click the **Select an endpoint** link. In this example, let's use Azure Event Hubs destination or endpoint. 
    
        :::image type="content" source="./media/subscribe-to-partner-events/select-endpoint.png" lightbox="./media/subscribe-to-partner-events/select-endpoint.png" alt-text="Image showing the configuration of an endpoint for an event subscription.":::            
    1. On the **Select Event Hub** page, select configurations for the endpoint, and then select **Confirm Selection**. 
    
        :::image type="content" source="./media/subscribe-to-partner-events/select-event-hub.png" lightbox="./media/subscribe-to-partner-events/select-event-hub.png" alt-text="Image showing the configuration of an Event Hubs endpoint.":::    
    1. Now on the **Create Event Subscription** page, select **Create**. 
    
        :::image type="content" source="./media/subscribe-to-partner-events/create-event-subscription.png" alt-text="Image showing the Create Event Subscription page with example configurations.":::
        

## Next steps 

See the following articles for more details about the Partner Events feature:

- [Partner Events overview for customers](partner-events-overview.md)
- [Partner Events overview for partners](partner-events-overview-for-partners.md)
- [Onboard as a partner](onboard-partner.md)
