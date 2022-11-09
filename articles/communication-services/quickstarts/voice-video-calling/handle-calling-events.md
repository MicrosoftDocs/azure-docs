---
title: Quickstart - Handle voice and video calling events
titleSuffix: An Azure Communication Services quickstart
description: Learn how to handle voice and video calling events using Azure Communication Services.
author: laithrodan
manager: micahvivion
services: azure-communication-services
ms.author: laithrodan
ms.date: 12/10/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling 
ms.custom: mode-other
---
# Quickstart: Handle voice and video calling events
[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

Get started with Azure Communication Services by using Azure Event Grid to handle Communication Services voice and video calling events.

## About Azure Event Grid

[Azure Event Grid](../../../event-grid/overview.md) is a cloud-based eventing service. In this article, you'll learn how to subscribe to events for [communication service events](../../../event-grid/event-schema-communication-services.md), and trigger an event to view the result. Typically, you send events to an endpoint that processes the event data and takes actions. In this article, we'll send the events to a web app that collects and displays the messages.

## Prerequisites
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Communication Service resource. Further details can be found in the [Create an Azure Communication Services resource](../create-communication-resource.md) quickstart.
- An Azure Communication Services voice and video calling enabled client. [Add voice calling to your app](../voice-video-calling/getting-started-with-calling.md).

## Setting up

### Enable Event Grid resource provider

If you haven't previously used Event Grid in your Azure subscription, you may need to register the Event Grid resource provider following the steps below:

In the Azure portal:

1. Select **Subscriptions** on the left menu.
2. Select the subscription you're using for Event Grid.
3. On the left menu, under **Settings**, select **Resource providers**.
4. Find **Microsoft.EventGrid**.
5. If not registered, select **Register**.

It may take a moment for the registration to finish. Select **Refresh** to update the status. When **Status** is **Registered**, you're ready to continue.

### Event Grid Viewer deployment

For this quickstart, we will use the [Azure Event Grid Viewer Sample](/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/) to view events in near-real time. This will provide the user with the experience of a real-time feed. In addition, the payload of each event should be available for inspection as well.

## Subscribe to voice and video calling events using web hooks

In the portal, navigate to your Azure Communication Services Resource that you created. Inside the Communication Service resource, select **Events** from the left menu of the **Communication Services** page.

:::image type="content" source="./../sms/media/handle-sms-events/select-events.png" alt-text="Screenshot showing selecting the event subscription button within a resource's events page.":::

Press **Add Event Subscription** to enter the creation wizard.

On the **Create Event Subscription** page, Enter a **name** for the event subscription.

You can subscribe to specific events, to tell Event Grid which of the voice and video events you want to subscribe to, and where to send the events. Select the events you'd like to subscribe to from the dropdown menu. For voice and video calling you'll have the option to choose `Call Started`, `Call Ended`, `Call Participant added` and `Call Participant Removed`.

If you're prompted to provide a **System Topic Name**, feel free to provide a unique string. This field has no impact on your experience and is used for internal telemetry purposes.

Check out the full list of [events supported by Azure Communication Services](../../../event-grid/event-schema-communication-services.md).

:::image type="content" source="./media/handle-calling-events/select-events-voice-video-calling.png" alt-text="Screenshot showing the calling event types being selected.":::

Select **Web Hook** for **Endpoint type**.

:::image type="content" source="./../sms/media/handle-sms-events/select-events-create-linkwebhook.png" alt-text="Screenshot showing the Endpoint Type field being set to Web Hook.":::

For **Endpoint**, click **Select an endpoint**, and enter the URL of your web app.

In this case, we will use the URL from the [Azure Event Grid Viewer Sample](/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/) we set up earlier in the quickstart. The URL for the sample will be in the format: `https://{{site-name}}.azurewebsites.net/api/updates`

Then select **Confirm Selection**.

:::image type="content" source="./../sms/media/handle-sms-events/select-events-create-selectwebhook-epadd.png" alt-text="Screenshot showing confirming a Web Hook Endpoint.":::

## Viewing voice and video calling events

### Triggering voice and video calling events

To view event triggers, we must first generate the events.

- `Call Started` events are generated when a Azure Communication Services voice and video call is started. To trigger this event, just start a call attached to your Communication Services resource.
- `Call Ended` events are generated when a Azure Communication Services voice and video call is ended. To trigger this event, just end a call attached to your Communication Services resource.
- `Call Participant Added` events are generated when a participant is added to an Azure Communication Services voice and video call. To trigger this event, add a participant to an Azure Communication Services voice and video call attached to your Communication Services resource.
- `Call Participant Removed` events are generated when a participant is removed from an Azure Communication Services voice and video call. To trigger this event, remove a participant from an Azure Communication Services voice and video call attached to your Communication Services resource.

Check out the full list of [events supported by Azure Communication Services](../../../event-grid/event-schema-communication-services.md).

### Receiving voice and video calling events

Once you complete either action above you will notice that voice and video calling events are sent to your endpoint. These events will show up in the [Azure Event Grid Viewer Sample](/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/) we set up at the beginning. You can press the eye icon next to the event to see the entire payload.

Learn more about the [event schemas and other eventing concepts](../../../event-grid/event-schema-communication-services.md).

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).


You may also want to:

 - [Learn about event handling concepts](../../../event-grid/event-schema-communication-services.md)
 - [Learn about Event Grid](../../../event-grid/overview.md)
