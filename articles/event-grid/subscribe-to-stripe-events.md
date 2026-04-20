---
title: Subscribe to Stripe events - Azure Event Grid | Microsoft Learn
description: This article explains how to subscribe to events published by Stripe.
ms.topic: how-to
ms.date: 03/31/2026
ms.service: azure-event-grid
author: robece
ms.author: robece
---

# Subscribe to Stripe events using Azure Event Grid (preview)

This article describes steps to subscribe to events published by [Stripe](https://stripe.com), the financial infrastructure platform for businesses.

> [!NOTE]
> Stripe partner topics for Azure Event Grid are currently in **Preview**.

## Prerequisites

Following are the prerequisites that your system needs to meet before attempting to configure your Stripe account to send events to Azure Event Grid.

- An Azure subscription to use Azure Event Grid.
- A Stripe account with access to the Stripe Dashboard and permissions to configure event destinations.

## High-level steps

1. Register the Event Grid resource provider with your Azure subscription.
1. Authorize Stripe to create a partner topic in your resource group.
1. Enable Stripe events to flow to a partner topic.
1. Activate the partner topic so that your events start flowing.
1. Subscribe to events.

## Register the Event Grid resource provider

Unless you've used Event Grid before, you need to register the Event Grid resource provider. If you've used Event Grid before, skip to the next section.

In the Azure portal, do the following steps:

1. On the left menu, select **Subscriptions**.
1. Select the **subscription** you want to use for Event Grid from the subscription list.
1. On the **Subscription** page, select **Resource providers** under **Settings** on the left menu.
1. Search for **Microsoft.EventGrid**, and confirm that the **Status** is **Not Registered**.
1. Select **Microsoft.EventGrid** in the provider list.
1. Select **Register** on the command bar.

    :::image type="content" source="media/subscribe-to-stripe-events/register-provider.png" alt-text="Screenshot of the registration of Microsoft.EventGrid provider with the Azure subscription.":::
1. Refresh to make sure the status of **Microsoft.EventGrid** is changed to **Registered**.

    :::image type="content" source="media/subscribe-to-stripe-events/registered.png" alt-text="Screenshot of the successful registration of Microsoft.EventGrid provider with the Azure subscription.":::

## Authorize partner to create a partner topic

You must grant your consent to Stripe to create partner topics in a resource group that you designate. This authorization has an expiration time. It's effective for the time period you specify between 1 to 365 days.

> [!IMPORTANT]
> For a greater security stance, specify the minimum expiration time that offers the partner enough time to configure your events to flow to Event Grid and to provision your partner topic. Your partner won't be able to create resources (partner topics) in your Azure subscription after the authorization expiration time.

> [!NOTE]
> Event Grid started enforcing authorization checks to create partner topics around June 30, 2022.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar at the top, enter **Partner Configurations**, and select **Event Grid Partner Configurations** under **Services** in the results.
1. On the **Event Grid Partner Configurations** page, select **Create Event Grid partner configuration** button on the page (or) select **+ Create** on the command bar.

    :::image type="content" source="media/subscribe-to-stripe-events/partner-configurations.png" alt-text="Screenshot of the Event Grid Partner Configurations page with the list of partner configurations and the link to create a partner registration.":::
1. On the **Create Partner Configuration** page, do the following steps:

    1. In the **Project Details** section, select the **Azure subscription** and the **resource group** where you want to allow the partner to create a partner topic.
    1. In the **Partner Authorizations** section, specify a default expiration time for partner authorizations defined in this configuration.
    1. To provide your authorization for Stripe to create partner topics in the specified resource group, select **+ Partner Authorization** link.

        :::image type="content" source="media/subscribe-to-stripe-events/partner-authorization-configuration.png" alt-text="Screenshot of the Create Partner Configuration page with the Partner Authorization link selected.":::
1. On the **Add partner authorization to create resources** page, you see a list of **verified partners**. A verified partner is a partner whose identity has been validated by Microsoft. Follow these steps to authorize **Stripe** to create a partner topic.

    1. Select **Stripe** from the list of verified partners.
    1. Specify **authorization expiration time**.
    1. Select **Add**.

        :::image type="content" source="media/subscribe-to-stripe-events/add-verified-partner.png" alt-text="Screenshot of the page that allows you to grant a verified partner the authorization to create resources in your resource group.":::

        > [!IMPORTANT]
        > Your partner won't be able to create resources (partner topics) in your Azure subscription after the authorization expiration time.
1. Back on the **Create Partner Configuration** page, verify that Stripe is added to the partner authorization list at the bottom.
1. Select **Review + create** at the bottom of the page.
1. On the **Review** page, review all settings, and then select **Create** to create the partner configuration.

## Enable Stripe events to flow to your partner topic

Follow these steps to configure Azure Event Grid as an event destination in your Stripe Dashboard:

1. Sign in to your [Stripe Dashboard](https://dashboard.stripe.com).
1. Navigate to **Developers** > **Destinations**.
1. Select **+ Add destination** and choose **Azure Event Grid** as the destination type.
1. Enter the **partner topic channel** URL provided by Azure Event Grid.
1. Select the **event types** you want to send to Azure Event Grid, such as `payment_intent.succeeded`, `invoice.paid`, or `customer.subscription.updated`.
1. Save the destination configuration.

Once configured and active, Stripe creates a partner topic in your designated Azure resource group.

## Activate a partner topic

1. In the search bar of the Azure portal, search for and select **Event Grid Partner Topics**.
1. On the **Event Grid Partner Topics** page, select the partner topic in the list.

    :::image type="content" source="media/subscribe-to-stripe-events/select-partner-topic-activate.png" lightbox="media/subscribe-to-stripe-events/select-partner-topic-activate.png" alt-text="Screenshot of the selection of a partner topic in the Event Grid Partner Topics page.":::
1. Review the activated message, and select **Activate** on the page or on the command bar to activate the partner topic before the expiration time mentioned on the page.

    :::image type="content" source="media/subscribe-to-stripe-events/activate-partner-topic-button.png" lightbox="media/subscribe-to-stripe-events/activate-partner-topic-button.png" alt-text="Screenshot of the selection of the Activate button on the command bar or on the page.":::
1. Confirm that the activation status is set to **Activated** and then create event subscriptions for the partner topic by selecting **+ Event Subscription** on the command bar.

    :::image type="content" source="media/subscribe-to-stripe-events/partner-topic-activation-status.png" lightbox="media/subscribe-to-stripe-events/partner-topic-activation-status.png" alt-text="Screenshot of the activation state of a partner topic as Activated.":::

## Subscribe to events

First, create an event handler that handles events from Stripe. For example, create an event hub, Service Bus queue or topic, or an Azure function. Then, create an event subscription for the partner topic using the event handler you created.

### Create an event handler

To test your partner topic, you need an event handler. Go to your Azure subscription and spin up a service that's supported as an [event handler](event-handlers.md) such as an [Azure Function](custom-event-to-function.md). For an example, see [Event Grid Viewer sample](custom-event-quickstart-portal.md#create-a-message-endpoint) that you can use as an event handler via webhooks.

### Subscribe to the partner topic

Subscribing to the partner topic tells Event Grid where you want your Stripe events to be delivered.

1. In the Azure portal, type **Event Grid Partner Topics** in the search box, and select **Event Grid Partner Topics**.
1. On the **Event Grid Partner Topics** page, select the partner topic in the list.

    :::image type="content" source="media/subscribe-to-stripe-events/select-partner-topic-subscribe.png" lightbox="media/subscribe-to-stripe-events/select-partner-topic-subscribe.png" alt-text="Screenshot of the selection of a partner topic on the Event Grid Partner Topics page.":::
1. On the **Event Grid Partner Topic** page for the partner topic, select **+ Event Subscription** on the command bar.

    :::image type="content" source="media/subscribe-to-stripe-events/select-add-event-subscription.png" alt-text="Screenshot of the selection of Add Event Subscription button on the Event Grid Partner Topic page.":::
1. On the **Create Event Subscription** page, do the following steps:

    1. Enter a **name** for the event subscription.
    1. For **Filter to Event Types**, select the Stripe event types that your subscription receives, such as `payment_intent.succeeded`, `charge.failed`, or `customer.subscription.updated`.
    1. For **Endpoint Type**, select an Azure service (Azure Function, Storage Queues, Event Hubs, Service Bus Queue, Service Bus Topic, Hybrid Connections, etc.), or webhook.
    1. Select the **Configure an endpoint** link. In this example, let's use Azure Event Hubs as the destination endpoint.

        :::image type="content" source="media/subscribe-to-stripe-events/select-endpoint.png" lightbox="media/subscribe-to-stripe-events/select-endpoint.png" alt-text="Screenshot of the configuration of an endpoint for an event subscription.":::
    1. On the **Select Event Hub** page, select configurations for the endpoint, and then select **Confirm Selection**.

        :::image type="content" source="media/subscribe-to-stripe-events/select-event-hub.png" lightbox="media/subscribe-to-stripe-events/select-event-hub.png" alt-text="Screenshot of the configuration of an Event Hubs endpoint.":::
    1. Now on the **Create Event Subscription** page, select **Create**.

        :::image type="content" source="media/subscribe-to-stripe-events/create-event-subscription.png" alt-text="Screenshot of the Create Event Subscription page with example configurations.":::

## Next steps

- [Stripe partner topics overview](stripe-overview.md)
- [Event handlers in Azure Event Grid](event-handlers.md)
- [Azure Event Grid partner topics overview](partner-events-overview.md)
