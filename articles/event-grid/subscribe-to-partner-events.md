---
title: Azure Event Grid - Subscribe to partner events 
description: This article explains how to subscribe to events from a partner using Azure Event Grid.
ms.topic: how-to
ms.date: 03/31/2022
---

# Subscribe to events published by a partner with Azure Event Grid
This article describes steps that an end user should take to subscribe to events that originate in an system owned or managed by a partner (SaaS, ERP, and so on.). 

> [!IMPORTANT]
>If you aren't familiar with the **Partner Events** feature, see [Partner Events overview](partner-events-overview.md) to understand the rationale of the steps in this article.

> [!NOTE]
> Event Grid's CLI and PowerShell extension support for the operations shown in this article is being released and may not be yet available. As an alternative approach, this article shows a way to execute operations using either [az resource](/cli/azure/resource) cli commands or an Azure Resource Manager client. For Resource Manager client options, check out [ARMClient for Windows](https://github.com/projectkudu/ARMClient?msclkid=2e158d8cad4b11ecb4ad09b1ca1151d7) for Windows. For Linux-based OS, try [ARMClient for Linux](https://github.com/yangl900/armclient-go?msclkid=8ce873c7ad4e11eca5a4826b726766fa). 

## Subscribe to events published by a partner

Here are the steps that a subscriber needs to perform to receive events from a partner.

1. [Register the Event Grid resource provider](#register-the-event-grid-resource-provider) with your Azure subscription.
2. [Authorize partner](#authorize-partner-to-create-a-partner-topic) to create a partner topic in your resource group.
3. [Request partner to enable events flow to a partner topic](#request-partner-to-enable-events-flow-to-a-partner-topic).
4. [Activate partner topic](#activate-partner-topic) so that your events start flowing to your partner topic.
5. [Subscribe to events](#subscribe-to-events).

## Register the Event Grid resource provider
Unless you've used Event Grid before, you'll need to register the Event Grid resource provider. If you’ve used Event Grid before, skip to the next section.

In the Azure portal, do the following steps: 

1. On the left menu, select **Subscriptions**.
1. Select the **subscription** you want to use for Event Grid from the subscription list.  
1. On the **Subscription** page, select **Resource providers** under **Settings** on the left menu. 
1. Search for **Microsoft.EventGrid**, and select it in the provider list. 
1. Select **Register** on the command bar. 

    :::image type="content" source="./media/subscribe-to-partner-events/register-event-grid-provider.png" alt-text="Image showing the registration of Microsoft.EventGrid provider with the Azure subscription.":::
1. Refresh to make sure the status of **Microsoft.EventGrid** is changed to **Registered**. 

    :::image type="content" source="./media/subscribe-to-partner-events/register-event-grid-registered.png" alt-text="Image showing the successful registration of Microsoft.EventGrid provider with the Azure subscription.":::

## Authorize partner to create a partner topic

You must grant your consent to the partner to create partner topics in a resource group that you designate. This authorization has an expiration time. It's effective for the time period you specify between 1 to 365 days. 

> [!IMPORTANT]
> For a greater security stance, specify the minimum expiration time that offers the partner enough time to configure your events to flow to Event Grid and to provision your partner topic. 

> [!NOTE]
> At the time of the release of this feature on March 31st, 2022, requiring your (subscriber's) authorization for a partner to create resources on your Azure subscription is an optional feature. We encourage you to opt-in to use this feature and try it using in non-production Azure subscriptions before it's a mandatory step by around June 1st, 2022. To opt-in to this feature, reach out to [mailto:askgrid@microsoft.com](mailto:askgrid@microsoft.com) using the subject line **Request to enforce partner authorization on my Azure subscription(s)** and provide your Azure subscription(s) in the email.

Following example shows the way to create a partner configuration resource which contains the partner authorization. You must identify the partner by providing either its partner registration ID or the name of its partner registration resource (specified in the partnerName parameter). Both can be obtained from your partner, but only of them is required. For your convenience, the following examples leave a sample expiration time in the UTC format.

### Azure CLI

```azurecli-interactive
az resource create \
    -g {resource-group} \
    -n default/AuthorizePartner \
    --resource-type Microsoft.EventGrid/partnerconfigurations \
    --properties "{ \"partnerRegistrationImmutableId\":\"{partner-registration-immutable-ID-obtained-from-partner}\", \
    \"authorizationExpirationTimeInUtc\": \"2022-03-26T14:33:47Z\"	"}
```

### ARMClient

```bash
armclient post https://centralus.management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000000/resourceGroups/myazresourcegroup/providers/Microsoft.EventGrid/partnerConfigurations/default/AuthorizePartner?api-version=2021-10-15-preview @ap-1.json
```

**ap-1.json**:

```json
{
    "partnerRegistrationImmutableId": "partner-registration-immutable-ID-obtained-from-partner",
	"partnerName": "partner-registration-resource-name-obtained-from-partner",
    "authorizationExpirationTimeInUtc": "2022-05-10T04:02:10.044Z"
}

```
## Request partner to enable events flow to a partner topic

Here is the list of partners and a link to submit a request to enable events flow to a partner topic.

- [Auth0](auth0-how-to.md)


## Activate partner topic

1. In the search bar of the Azure portal, search for and select **Event Grid Partner Topics**.
1. On the **Event Grid Partner Topics** page, select the partner topic in the list. 

    :::image type="content" source="./media/onboard-partner/select-partner-topic.png" alt-text="Select a partner topic in the Event Grid Partner Topics page.":::    
1. Review the activate message, and select **Activate** on the page or on the command bar to activate the partner topic before the expiration time mentioned on the page. 

    :::image type="content" source="./media/onboard-partner/activate-partner-topic-button.png" alt-text="Image showing the selection of the Activate button on the command bar or on the page.":::    
1. Confirm that the activation status is set to **Activated** and then create event subscriptions for the partner topic by selecting **+ Event Subscription** on the command bar. 

    :::image type="content" source="./media/onboard-partner/partner-topic-activation-status.png" alt-text="Image showing the activation state as **Activated**.":::   

## Subscribe to events
First, create an event handler that will handle events from the partner. For example, create an event hub, Service Bus queue or topic, or an Azure function.

Then, create an event subscription for the partner topic using the event handler you created. 

#### Create an event handler
To test your partner topic, you'll need an event handler. Go to your Azure subscription and spin up a service that's supported as an [event handler](event-handlers.md) such as an [Azure Function](custom-event-to-function.md). For an example, see [Event Grid Viewer sample](custom-event-quickstart-portal.md#create-a-message-endpoint) that you can as an event handler via webhooks. 

#### Subscribe to the partner topic
Subscribing to the partner topic tells Event Grid where you want your partner events to be delivered.

1. In the Azure portal, type **Event Grid Partner Topics** in the search box, and select **Event Grid Partner Topics**. 
1. On the **Event Grid Partner Topics** page, select the partner topic in the list. 

    :::image type="content" source="./media/subscribe-to-partner-events/select-partner-topic.png" alt-text="Image showing the selection of a partner topic in the partner topic list in the Azure portal.":::
1. On the **Event Grid Partner Topic** page for the partner topic, select **+ Event Subscription** on the command bar. 

    :::image type="content" source="./media/subscribe-to-partner-events/select-add-event-subscription.png" alt-text="Image showing the selection of Add Event Subscription button on the command bar of the Event Grid Partner Topic page.":::    
1. On the **Create Event Subscription** page, do the following steps:
    1. Enter a **name** for the event subscription.
    1. For **Filter to Event Types**, select types of events that you the subscription to receive.
    1. For **Endpoint Type**, select an Azure service (Azure Function, Storage Queues, Event Hubs, Service Bus Queue, Service Bus Topic, Hybrid Connections. etc.), Web Hook, or Partner Destination.
    1. Click the **Select an endpoint** link. 
    1. On the **Select Partner Destination** page, select configurations for the endpoint, and then select **Confirm Selection**. 
    
        :::image type="content" source="./media/subscribe-to-partner-events/select-endpoint.png" lightbox="./media/subscribe-to-partner-events/select-endpoint.png" alt-text="Image showing the configuration of an endpoint for an event subscription.":::        
    1. Now on the **Create Event Subscription** page, select **Create**. 
    
        :::image type="content" source="./media/subscribe-to-partner-events/create-event-subscription.png" alt-text="Image showing the Create Event Subscription page with example configurations.":::
        


