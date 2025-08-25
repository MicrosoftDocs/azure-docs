---
title: View calling events
titleSuffix: An Azure Communication Services article
description: This article describes how to handle voice and video calling events using Azure Communication Services.
author: laithrodan
manager: micahvivion
services: azure-communication-services
ms.author: laithrodan
ms.date: 06/28/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling 
ms.custom: mode-other
---

# View calling events

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

You can use Azure Event Grid to handle Communication Services voice and video calling events.

## About Azure Event Grid

[Azure Event Grid](../../../event-grid/overview.md) is a cloud-based eventing service. This article describes how to subscribe to events for [communication service events](../../../event-grid/event-schema-communication-services.md), and trigger an event to view the result. Typically, you send events to an endpoint that processes the event data and takes actions. In this article, we send the events to a web app that collects and displays the messages.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Communication Service resource. For more information, see [Create an Azure Communication Services resource](../create-communication-resource.md).
- An Azure Communication Services voice and video calling enabled client. [Add voice calling to your app](../voice-video-calling/getting-started-with-calling.md).

## Set up

### Enable Event Grid resource provider

If you're new to Event Grid, you might need to register the Event Grid resource provider following these steps:

In the Azure portal:

1. Select **Subscriptions** on the left menu.
2. Select the subscription you're using for Event Grid.
3. On the left menu, under **Settings**, select **Resource providers**.
4. Find **Microsoft.EventGrid**.
5. If not registered, select **Register**.

It might take a moment for the registration to finish. Select **Refresh** to update the status. When **Status** is **Registered**, you're ready to continue.

### Event Grid Viewer deployment

In this article, we use the [Azure Event Grid Viewer Sample](/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/) to view events in near-real time. This  provides the user with the experience of a real-time feed. In addition, the payload of each event should be available for inspection as well.

## Subscribe to voice and video calling events using web hooks

In the portal, navigate to your Azure Communication Services Resource that you created. Inside the Communication Service resource, select **Events** from the left menu of the **Communication Services** page.

:::image type="content" source="./../sms/media/handle-sms-events/select-events.png" alt-text="Screenshot showing selecting the event subscription button within a resource's events page.":::

Press **Add Event Subscription** to enter the creation wizard.

On the **Create Event Subscription** page, Enter a **name** for the event subscription.

You can subscribe to specific events, to tell Event Grid which of the voice and video events you want to subscribe to, and where to send the events. Select the events you want to subscribe to from the dropdown menu. For voice and video calling, you can choose `Call Started`, `Call Ended`, `Call Participant added`, or `Call Participant Removed`.

If you're prompted to provide a **System Topic Name**, feel free to provide a unique string. This field has no impact on your experience and is used for internal telemetry purposes.

Check out the full list of [events supported by Azure Communication Services](../../../event-grid/event-schema-communication-services.md).

:::image type="content" source="./media/handle-calling-events/select-events-voice-video-calling.png" alt-text="Screenshot showing the calling event types being selected.":::

Select **Web Hook** for **Endpoint type**.

:::image type="content" source="./../sms/media/handle-sms-events/select-events-create-linkwebhook.png" alt-text="Screenshot showing the Endpoint Type field being set to Web Hook.":::

For **Endpoint**, click **Select an endpoint**, and enter the URL of your web app.

In this case, we use the URL from the [Azure Event Grid Viewer Sample](/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/) we set up earlier in the quickstart. The URL for the sample uses the format: `https://{{site-name}}.azurewebsites.net/api/updates`

Then select **Confirm Selection**.

:::image type="content" source="./../sms/media/handle-sms-events/select-events-create-selectwebhook-epadd.png" alt-text="Screenshot showing confirming a Web Hook Endpoint.":::

## View voice and video calling events

### Trigger voice and video calling events

To view event triggers, we must first generate the events.

- `Call Started` events are generated when an Azure Communication Services voice and video call is started. To trigger this event, just start a call attached to your Communication Services resource.
- `Call Ended` events are generated when an Azure Communication Services voice and video call is ended. To trigger this event, just end a call attached to your Communication Services resource.
- `Call Participant Added` events are generated when a participant is added to an Azure Communication Services voice and video call. To trigger this event, add a participant to an Azure Communication Services voice and video call attached to your Communication Services resource.
- `Call Participant Removed` events are generated when a participant is removed from an Azure Communication Services voice and video call. To trigger this event, remove a participant from an Azure Communication Services voice and video call attached to your Communication Services resource.

Check out the full list of [events supported by Azure Communication Services](../../../event-grid/event-schema-communication-services.md).

### Receive voice and video calling events

Once you complete either action of the previous actions, you notice voice and video calling events are sent to your endpoint. These events show up in the [Azure Event Grid Viewer Sample](/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/) we set up at the beginning. You can press the eye icon next to the event to see the entire payload.

Learn more about the [event schemas and other eventing concepts](../../../event-grid/event-schema-communication-services.md).

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Related articles

- [Learn about event handling concepts](../../../event-grid/event-schema-communication-services.md)
- [Learn about Event Grid](../../../event-grid/overview.md)
