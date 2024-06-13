---
title: Quickstart - Handle EMAIL and delivery report events
titleSuffix: Azure Communication Services
description: "In this quickstart, you'll learn how to handle Azure Communication Services events. See how to create, receive, and subscribe to Email delivery report and Email engagement tracking events."
author: anmolbohra
manager: komivi.agbakpem
services: azure-communication-services
ms.author: anmolbohra
ms.date: 03/31/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: email
---
# Quickstart: Handle Email events

Get started with Azure Communication Services by using Azure Event Grid to handle Communication Services Email events. After subscribing to Email events such as delivery reports and engagement reports, you generate and receive these events. Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Communication Services resource. For detailed information, see [Create an Azure Communication Services resource](../create-communication-resource.md).
- An Email resource with a provisioned domain. [Create an Email Resource](../email/create-email-communication-resource.md).

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

## Subscribe to Email events by using web hooks

You can subscribe to specific events to provide Event Grid with information about where to send the events that you want to track.

1. In the portal, go to the Communication Services resource that you created.

1. Inside the Communication Services resource, on the left menu of the **Communication Services** page, select **Events**.

1. Select **Add Event Subscription**.

   :::image type="content" source="./media/handle-email-events/select-events.png" alt-text="Screenshot that shows the Events page of an Azure Communication Services resource. The Event Subscription button is called out.":::

1. On the **Create Event Subscription** page, enter a **name** for the event subscription.

1.  Under **Event Types**, select the events that you'd like to subscribe to. For Email, you can choose `Email Delivery Report Received` and `Email Engagement Tracking Report Received`.

1. If you're prompted to provide a **System Topic Name**, feel free to provide a unique string. This field has no impact on your experience and is used for internal telemetry purposes.

   :::image type="content" source="./media/handle-email-events/select-events-create-eventsub.png" alt-text="Screenshot that shows the Create Event Subscription dialog. Under Event Types, Email Delivery Report Received and Email Engagement Tracking Report Received are selected.":::

1. For **Endpoint type**, select **Web Hook**.

   :::image type="content" source="./media/handle-email-events/select-events-create-linkwebhook.png" alt-text="Screenshot that shows a detail of the Create Event Subscription dialog. In the Endpoint Type list, Web Hook is selected.":::

1. For **Endpoint**, select **Select an endpoint**, and then enter the URL of your web app.

   In this case, we'll use the URL from the [Event Grid viewer](/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/) that we set up earlier in the quickstart. The URL for the sample has this format: `https://{{site-name}}.azurewebsites.net/api/updates`

1. Select **Confirm Selection**.

   :::image type="content" source="./media/handle-email-events/select-events-create-selectwebhook-epadd.png" alt-text="Screenshot that shows the Select Web Hook dialog. The Subscriber Endpoint box contains a URL, and a Confirm Selection button is visible.":::

## View Email events

To generate and receive Email events, take the steps in the following sections.

### Trigger Email events

To view event triggers, we need to generate some events. To trigger an event, [send email](../email/send-email.md) using the Email domain resource attached to the Communication Services resource.

- `Email Delivery Report Received` events are generated when the Email status is in terminal state, i.e. Delivered, Failed, FilteredSpam, Quarantined.
- `Email Engagement Tracking Report Received` events are generated when the email sent is either opened or a link within the email is clicked. To trigger an event, you need to turn on the `User Interaction Tracking` option on the Email domain resource

Check out the full list of [events that Communication Services supports](../../../event-grid/event-schema-communication-services.md).

### Receive Email events

After you generate an event, you'll notice that `Email Delivery Report Received` and `Email Engagement Tracking Report Received` events are sent to your endpoint. These events show up in the [Event Grid viewer](/samples/azure-samples/azure-event-grid-viewer/azure-event-grid-viewer/) that we set up at the beginning of this quickstart. Select the eye icon next to the event to see the entire payload. Events should look similar to the following data:

:::image type="content" source="./media/handle-email-events/email-delivery-report-received.png" alt-text="Screenshot of the Azure Event Grid viewer that shows the Event Grid schema for an EMAIL delivery report received event.":::

:::image type="content" source="./media/handle-email-events/email-engagementtracking-report-received.png" alt-text="Screenshot of the Azure Event Grid viewer that shows the Event Grid schema for an EMAIL engagement tracking report event.":::

- `EngagementContext` refers to the link clicked when the engagementType is `Click`.
- `UserAgent` refers to the User-Agent from which this email engagement event originated. Eg. If the user interacted on Edge using a Win10 machine: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246
- `EngagementType` refers to the type of engagement, possible values are 'View' or 'Click'.

Learn more about the [event schemas and other eventing concepts](../../../event-grid/event-schema-communication-services.md).

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

In this quickstart, you learned how to consume Email events. You can receive Email events by creating an Event Grid subscription.

> [!div class="nextstepaction"]
> [Send Email](../email/send-email.md)

For schema information and example events, see [Azure Communication Services - Email events](../../../event-grid/communication-services-email-events.md).

You might also want to see the following articles: 

- [Learn about event handling concepts](../../../event-grid/event-schema-communication-services.md)
- [Learn about Event Grid](../../../event-grid/overview.md)
