---
title: Handle Advanced Messaging events
titleSuffix: Azure Communication Services
description: "In this quickstart, you learn how to subscribe for AdvancedMessaging for WhatsApp events."
author: shamkh
manager: camilo.ramirez
ms.author: shamkh
ms.service: azure-communication-services
ms.topic: quickstart 
ms.date: 07/03/2023
ms.custom: template-quickstart
---

# Quickstart: Handle Advanced Messaging events

[!INCLUDE [Public Preview Disclaimer](../../../includes/public-preview-include-document.md)]

Azure Communication Services now enables you to send and receive WhatsApp messages using the Advanced Messaging SDK. Get started with setting up Event Grid events for receiving WhatsApp messages send/receive status reports. Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- [Azure account with an active subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Register Event Grid Resource Provider](../../sms/handle-sms-events.md#register-an-event-grid-resource-provider).
- [Create an Azure Communication Services resource](../../create-communication-resource.md).

## About Event Grid

[Event Grid](../../../../event-grid/overview.md) is a cloud-based eventing service. In this article, you learn how to subscribe to [communication service events](../../../../event-grid/event-schema-communication-services.md), and trigger an event to view the result. Typically, you send events to an endpoint that processes the event data and takes actions. In this article, we send the events to a web app that collects and displays the messages.

## Set up Event Grid Viewer

The Event Grid Viewer is a sample site that allows you to view incoming events from Event Grid.

1.  Go to this Link [Azure Event Grid Viewer - Code Samples \| Microsoft Learn](/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/). Deploy the Event Grid Viewer sample by clicking the "Deploy to Azure" button.
    
    :::image type="content" source="./media/handle-advanced-messaging-events/event-grid-viewer.png" alt-text="Screenshot that shows the Event Grid Viewer Sample Page with Deploy To Azure option.":::

2.  After clicking the "Deploy to Azure" button, fill in the required fields (since the site name needs to be globally unique as it creates a DNS entry, it's recommended to include your alias in the name for this step). While this quickstart doesn't require any special setup for this step, here are suggestions for filling out the deployment details:
  - `Subscription` - Select the subscription that contains your Azure Communication Services resource. This specific subscription isn't required, but it will make it easier to clean up after you're done with the quickstart.
  - `Resource Group` - Select the resource group that contains your Azure Communication Services resource. This specific resource group isn't required, but it will make it easier to clean up after you're done with the quickstart.
  - `Region` - Select the resource group that contains your Azure Communication Services resource. This specific region isn't required, but is recommended.
  - 'Site Name' - Create a name that is globally unique. This site name is used to create a domain to connect to your Event Grid Viewer.
  - 'Hosting Plan Name' - Create any name to identify your hosting plan.
  - 'Sku' - The sku F1 can be used for development and testing purposes. If you encounter validation errors creating your Event Grid Viewer that say there's no more capacity for the F1 plan, try selecting a different region. For more information about skus, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/)

    :::image type="content" source="./media/handle-advanced-messaging-events/custom-deployment.png" alt-text="Screenshot that shows Custom deployment of Events Viewer web app and properties you need to provide to successfully deploy.":::

3.  Then select **Review + Create**.

4.  After the deployment completes, select on the App Service resource to open it.

    :::image type="content" source="./media/handle-advanced-messaging-events/event-viewer-web-app.png" alt-text="Screenshot that shows Events Viewer web app.":::

5.  On the resource overview page, select on the copy button next to the "Default Domain" property.

    :::image type="content" source="./media/handle-advanced-messaging-events/default-domain.png" alt-text="Screenshot that shows URL of Events Viewer web app.":::

6.  The URL for the Event Grid Viewer is the Site Name you used to create the deployment with the path "/api/update" appended.
    For example: "https://{{site-name}}.azurewebsites.net/api/updates". You'll need it in the next step and during the creation of the demo app.

## Subscribe to Advanced Messaging events

1.  Open your Communication Services resource in the Azure portal, navigate to the **Events** option in left panel, and select **+Event Subscription**.
    
    :::image type="content" source="./media/handle-advanced-messaging-events/event-subscription.png" alt-text="Screenshot that shows Azure Communication Services Events subscription option and allows you to subscribe to Advanced Messaging events.":::

2.  Fill in the details for the new event subscription:

    -  Subscription name.

    -  System topic name - Enter a unique name, unless this name is already prefilled with a topic from your subscription.

    -  Event types - Select the two Advanced messaging events from the list.

        :::image type="content" source="./media/handle-advanced-messaging-events/create-event-subscription.png" alt-text="Screenshot that shows create event subscription properties.":::

    -  For endpoint type, select **"Webhook"** and enter the URL for the Event Grid Viewer we created in the "Setup Event Grid Viewer" step with the path "/api/updates" appended. For example: https://{{site-name}}.azurewebsites.net/api/updates.

        :::image type="content" source="./media/handle-advanced-messaging-events/event-webhook-details.png" alt-text="Screenshot that shows how to update webhook url of event subscription to receive events.":::

    -  Select **Create**.

3.  Now if you navigate back to the "Events" option in left panel of your ACS resource, you should be able to see the new event subscription with the Advanced Messaging events.

    :::image type="content" source="./media/handle-advanced-messaging-events/verify-events.png" alt-text="Screenshot that shows two Advanced messaging events subscribed.":::

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../create-communication-resource.md#clean-up-resources).

## Next steps

Advance to the next article to learn how to use Advanced Messaging SDK for WhatsApp messaging.
> [!div class="nextstepaction"]
> [Get Started With Advanced Communication Messages SDK](./get-started.md).

