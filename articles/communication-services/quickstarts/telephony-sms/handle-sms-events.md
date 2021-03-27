---
title: Quickstart - Handle SMS events for Delivery Reports and Inbound Messages
titleSuffix: An Azure Communication Services quickstart
description: Learn how to handle SMS events using Azure Communication Services.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2021
ms.topic: overview
ms.service: azure-communication-services
---
# Quickstart: Handle SMS events for Delivery Reports and Inbound Messages

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]


[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

Get started with Azure Communication Services by using Azure Event Grid to handle Communication Services SMS events.

## About Azure Event Grid

[Azure Event Grid](../../../event-grid/overview.md) is a cloud-based eventing service. In this article, you'll learn how to subscribe to events for [communication service events](../../../event-grid/event-schema-communication-services.md), and trigger an event to view the result. Typically, you send events to an endpoint that processes the event data and takes actions. In this article, we'll send the events to a web app that collects and displays the messages.

## Prerequisites
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Communication Service resource. Further details can be found in the [Create an Azure Communication Resource](../create-communication-resource.md) quickstart.
- An SMS enabled telephone number. [Get a phone number](./get-phone-number.md).

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

## Subscribe to the SMS events using web hooks

In the portal, navigate to your Azure Communication Services Resource that you created. Inside the Communication Service resource, select **Events** from the left menu of the **Communication Services** page.

:::image type="content" source="./media/handle-sms-events/select-events.png" alt-text="Screenshot showing selecting the event subscription button within a resource's events page.":::

Press **Add Event Subscription** to enter the creation wizard.

On the **Create Event Subscription** page, Enter a **name** for the event subscription.

You can subscribe to specific events to tell Event Grid which of the SMS events you want to track, and where to send the events. Select the events you'd like to subscribe to from the dropdown menu. For SMS you'll have the option to choose `SMS Received` and `SMS Delivery Report Received`.

If you're prompted to provide a **System Topic Name**, feel free to provide a unique string. This field has no impact on your experience and is used for internal telemetry purposes.

Check out the full list of [events supported by Azure Communication Services](https://docs.microsoft.com/azure/event-grid/event-schema-communication-services).

:::image type="content" source="./media/handle-sms-events/select-events-create-eventsub.png" alt-text="Screenshot showing the SMS Received and SMS Delivery Report Received event types being selected.":::

Select **Web Hook** for **Endpoint type**.

:::image type="content" source="./media/handle-sms-events/select-events-create-linkwebhook.png" alt-text="Screenshot showing the Endpoint Type field being set to Web Hook.":::

For **Endpoint**, click **Select an endpoint**, and enter the URL of your web app.

In this case, we will use the URL from the [Azure Event Grid Viewer Sample](/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/) we set up earlier in the quickstart. The URL for the sample will be in the format: `https://{{site-name}}.azurewebsites.net/api/updates`

Then select **Confirm Selection**.

:::image type="content" source="./media/handle-sms-events/select-events-create-selectwebhook-epadd.png" alt-text="Screenshot showing confirming a Web Hook Endpoint.":::

## Viewing SMS events

### Triggering SMS events

To view event triggers, we must generate events in the first place.

- `SMS Received` events are generated when the Communication Services phone number receives a text message. To trigger an event, just send a message from your phone to the phone number attached to your Communication Services resource.
- `SMS Delivery Report Received` events are generated when you send an SMS to a user using a Communication Services phone number. To trigger an event, you are required to enable `Delivery Report` in the options of the [sent SMS](../telephony-sms/send.md). Try sending a message to your phone with `Delivery Report`. Completing this action incurs a small cost of a few USD cents or less in your Azure account.

Check out the full list of [events supported by Azure Communication Services](https://docs.microsoft.com/azure/event-grid/event-schema-communication-services).

### Receiving SMS events

Once you complete either action above you will notice that `SMS Received` and `SMS Delivery Report Received` events are sent to your endpoint. These events will show up in the [Azure Event Grid Viewer Sample](/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/) we set up at the beginning. You can press the eye icon next to the event to see the entire payload. Events will look like this:

:::image type="content" source="./media/handle-sms-events/sms-received.png" alt-text="Screenshot showing the Event Grid Schema for an SMS Received Event.":::

:::image type="content" source="./media/handle-sms-events/sms-delivery-report-received.png" alt-text="Screenshot showing the Event Grid Schema for an SMS Delivery Report Event.":::

Learn more about the [event schemas and other eventing concepts](https://docs.microsoft.com/azure/event-grid/event-schema-communication-services).

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

In this quickstart, you learned how to consume SMS events. You can receive SMS messages by creating an Event Grid subscription.

> [!div class="nextstepaction"]
> [Send SMS](../telephony-sms/send.md)

You may also want to:


 - [Learn about event handling concepts](../../../event-grid/event-schema-communication-services.md)
 - [Learn about Event Grid](../../../event-grid/overview.md)
