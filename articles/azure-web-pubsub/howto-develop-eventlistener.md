---
title: How to configure event listener
description: Guidance about event listener concepts and integration introduction when develop with Azure Web PubSub service.
author: ZiTongYang
ms.author: zityang
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 09/19/2022
---

# Event listener in Azure Web PubSub service

## Overview
The event listener listens to the incoming client events. Each event listener contains a filter to specify which kinds of events it concerns, an endpoint about where to send the events to.

Currently we support [**Event Hubs**](https://azure.microsoft.com/products/event-hubs/) as an event listener endpoint.

You need to register event listeners beforehand, so that when a client event is triggered, the service can push the event to the corresponding event listener.

You can configure multiple event listeners. The order of the event listeners doesn't matter. If an event matches with multiple event listeners, it will be sent to all the listeners it matches. See the following diagram for an example. Let's say you configure four event listeners at the same time. Then a client event that matches with three of those listeners will be sent to three listeners, leaving the rest one untouched.

:::image type="content" source="media/howto-develop-eventlistener/event-listener-data-flow.svg" alt-text="Event listener data flow diagram sample":::

Event listeners are transparent to your clients. They don't respond to the events nor interfere the lifetime of your clients as the [event handlers](.\concept-service-internals.md#event-handler) do. Even though an event fails to be delivered to an expected event listener, your clients won't get disconnected.

To configure an Event Hubs event listener, you need to:

1.  [Add a managed identity to your service](#add-a-managed-identity-to-your-service)
2.  [Grant the `Azure Event Hubs Data sender` role to your service](#grant-the-azure-event-hubs-data-sender-role-to-your-service)
3.  [Add an event listener rule to your service settings](#add-an-event-listener-rule-to-your-service-settings)

## Configure an event listener

### Add a managed identity to your service

The service uses Azure Active Directory (Azure AD) authentication with managed identity to connect to Event Hubs, therefore, you should first enable the managed identity of the service. Find your Azure Web PubSub service from **Azure portal**. Navigate to **Identity**. To add a system-assigned identity, on the **System assigned** tab, switch **Status** to **On**. Select **Save**. For more information about managed identities, see [Managed identities in Azure Web PubSub](./howto-use-managed-identity.md).

:::image type="content" source="media/howto-use-managed-identity/system-identity-portal.png" alt-text="Screenshot of adding a system-assigned identity in the portal":::

### Grant the `Azure Event Hubs Data sender` role to your service

1. Find your Azure Event Hubs resource in **Azure portal**. You could choose to grant the role in the Event Hubs namespace level or entity level. The following steps choose the namespace level.

1. Navigate to **Access Control**. Select **Add role assignment**.
   :::image type="content" source="media/howto-develop-eventlistener/event-hub-access-control.png" alt-text="Screenshot of granting access to Event Hubs namespace":::

1. Select **Azure Event Hubs Data Sender** role in the **Role** tab. Then select **Next**.
   :::image type="content" source="media/howto-develop-eventlistener/event-hub-data-sender-role.png" alt-text="Screenshot of selecting Azure EventHubs Data Sender role":::

1. In the **Members** tab, choose to assign access to **Managed identity**. Select **Select members** to select your Web PubSub service. Then you can **Review + assign** your role assignment.
   :::image type="content" source="media/howto-develop-eventlistener/event-hub-select-identity.png" alt-text="Screenshot of selecting your Web PubSub service identity":::

### Add an event listener rule to your service settings

Currently only Azure portal supports configuring event listener. The support of Azure CLI and Azure PowerShell is still under development.

1. Find your  service from **Azure portal**. Navigate to **Settings**. Then select **Add** to configure your event listener. For an existing hub configuration, select **...** on right side will navigate to the same editing page.
   :::image type="content" source="media/howto-develop-eventlistener/web-pubsub-settings.png" alt-text="Screenshot of Web PubSub settings":::

1. Then in the below editing page, you'd need to configure hub name, and select **Add** to add an event listener.
   :::image type="content" source="media/howto-develop-eventlistener/configure-hub-settings.png" alt-text="Screenshot of configuring hub settings":::

1. On the **Configure Event Listener** page, first configure an event hub endpoint. You can select **Select Event Hub from your subscription** to select, or directly input the fully qualified namespace and the event hub name. Then select `user` and `system` events you'd like to listen to. Finally select **Confirm** when everything is done.
   :::image type="content" source="media/howto-develop-eventlistener/configure-event-hub-listener.png" alt-text="Screenshot of configuring Event Hubs Listener":::


## Next steps

In this article, you learned how event listeners work and how to configure an event listener with an event hub endpoint. To learn the data format sent to Event Hubs and how to process the data in the Event Hubs, read the following specification and documents.

> [!div class="nextstepaction"]
> [Specification: CloudEvents AMQP extension for Azure Web PubSub](./reference-cloud-events-amqp.md)

> [!div class="nextstepaction"]
> [Azure Event Hubs documentation](../event-hubs/event-hubs-about.md)

<!--TODO: Add demo-->