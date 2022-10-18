---
title: Quickstart - Handle SMS and delivery report events
titleSuffix: Azure Communication Services
description: "In this quickstart, you'll learn how to handle Azure Communication Services events. See how to create, receive, and subscribe to SMS and delivery report events."
author: tophpalmer
manager: chpalm
services: azure-communication-services
ms.author: chpalm
ms.date: 05/25/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: sms
ms.custom:
   - mode-other
   - kr2b-contr-experiment
---
# Quickstart: Handle SMS and delivery report events

Get started with Azure Communication Services by using Azure Event Grid to handle Communication Services SMS events. After subscribing to SMS events such as inbound messages and delivery reports, you generate and receive these events. Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Communication Services resource. For detailed information, see [Create an Azure Communication Services resource](../create-communication-resource.md).
- An SMS-enabled telephone number. [Get a phone number](../telephony/get-phone-number.md).

## About Event Grid

[Event Grid](../../../event-grid/overview.md) is a cloud-based eventing service. In this article, you'll learn how to subscribe to [communication service events](../../../event-grid/event-schema-communication-services.md), and trigger an event to view the result. Typically, you send events to an endpoint that processes the event data and takes actions. In this article, we'll send the events to a web app that collects and displays the messages.

## Set up the environment

To set up the environment that we'll use to generate and receive events, take the steps in the following sections.

### Register an Event Grid resource provider

If you haven't previously used Event Grid in your Azure subscription, you might need to register your Event Grid resource provider. To register the provider, follow these steps:

1. Go to the Azure portal.
1. On the left menu, select **Subscriptions**.
1. Select the subscription that you use for Event Grid.
1. On the left menu, under **Settings**, select **Resource providers**.
1. Find **Microsoft.EventGrid**.
1. If your resource provider isn't registered, select **Register**.

It might take a moment for the registration to finish. Select **Refresh** to update the status. When **Registered** appears under **Status**, you're ready to continue.

### Deploy the Event Grid viewer

For this quickstart, we'll use an Event Grid viewer to view events in near-real time. The viewer provides the user with the experience of a real-time feed. Also, the payload of each event should be available for inspection.

To set up the viewer, follow the steps in [Azure Event Grid Viewer](/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/).

## Subscribe to SMS events by using web hooks

You can subscribe to specific events to provide Event Grid with information about where to send the events that you want to track.

1. In the portal, go to the Communication Services resource that you created.

1. Inside the Communication Services resource, on the left menu of the **Communication Services** page, select **Events**.

1. Select **Add Event Subscription**.

   :::image type="content" source="./media/handle-sms-events/select-events.png" alt-text="Screenshot that shows the Events page of an Azure Communication Services resource. The Event Subscription button is called out.":::

1. On the **Create Event Subscription** page, enter a **name** for the event subscription.

1.  Under **Event Types**, select the events that you'd like to subscribe to. For SMS, you can choose `SMS Received` and `SMS Delivery Report Received`.

1. If you're prompted to provide a **System Topic Name**, feel free to provide a unique string. This field has no impact on your experience and is used for internal telemetry purposes.

   :::image type="content" source="./media/handle-sms-events/select-events-create-eventsub.png" alt-text="Screenshot that shows the Create Event Subscription dialog. Under Event Types, SMS Received and SMS Delivery Report Received are selected.":::

1. For **Endpoint type**, select **Web Hook**.

   :::image type="content" source="./media/handle-sms-events/select-events-create-linkwebhook.png" alt-text="Screenshot that shows a detail of the Create Event Subscription dialog. In the Endpoint Type list, Web Hook is selected.":::

1. For **Endpoint**, select **Select an endpoint**, and then enter the URL of your web app.

   In this case, we'll use the URL from the [Event Grid viewer](/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/) that we set up earlier in the quickstart. The URL for the sample has this format: `https://{{site-name}}.azurewebsites.net/api/updates`

1. Select **Confirm Selection**.

   :::image type="content" source="./media/handle-sms-events/select-events-create-selectwebhook-epadd.png" alt-text="Screenshot that shows the Select Web Hook dialog. The Subscriber Endpoint box contains a U R L, and a Confirm Selection button is visible.":::

## View SMS events

To generate and receive SMS events, take the steps in the following sections.

### Trigger SMS events

To view event triggers, we need to generate some events.

- `SMS Received` events are generated when the Communication Services phone number receives a text message. To trigger an event, send a message from your phone to the phone number that's attached to your Communication Services resource.
- `SMS Delivery Report Received` events are generated when you send an SMS to a user by using a Communication Services phone number. To trigger an event, you need to turn on the `Delivery Report` option of the [SMS that you send](../sms/send.md). Try sending a message to your phone with `Delivery Report` turned on. Completing this action incurs a small cost of a few USD cents or less in your Azure account.

Check out the full list of [events that Communication Services supports](../../../event-grid/event-schema-communication-services.md).

### Receive SMS events

After you generate an event, you'll notice that `SMS Received` and `SMS Delivery Report Received` events are sent to your endpoint. These events show up in the [Event Grid viewer](/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/) that we set up at the beginning of this quickstart. Select the eye icon next to the event to see the entire payload. Events should look similar to the following data:

:::image type="content" source="./media/handle-sms-events/sms-received.png" alt-text="Screenshot of the Azure Event Grid viewer that shows the Event Grid schema for an SMS received event.":::

:::image type="content" source="./media/handle-sms-events/sms-delivery-report-received.png" alt-text="Screenshot of the Azure Event Grid viewer that shows the Event Grid schema for an SMS delivery report event.":::

Learn more about the [event schemas and other eventing concepts](../../../event-grid/event-schema-communication-services.md).

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

In this quickstart, you learned how to consume SMS events. You can receive SMS messages by creating an Event Grid subscription.

> [!div class="nextstepaction"]
> [Send SMS](../sms/send.md)

You might also want to:

 - [Learn about event handling concepts](../../../event-grid/event-schema-communication-services.md)
 - [Learn about Event Grid](../../../event-grid/overview.md)
