---
title: Send client events to Event Hubs
description: Guidance about how to configure Event Hubs as event listener to send client events to Event Hubs.
author: Y-Sindo
ms.author: zityang
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 09/30/2022
---

# Send client events to Event Hubs

> [!NOTE]
> Event listener feature is in preview.

## Overview

If you want to listen to your [client events](concept-service-internals.md#terms) without exposing a publicly accessible endpoint, you can configure an "event listener" rule with an [event hub](https://azure.microsoft.com/products/event-hubs/) endpoint, and a filter to specify which kinds of events it concerns. You can configure multiple event listeners at the same time. Web PubSub service notifies all concerning event listeners in parallel when a client event comes.

This tutorial shows you how to authorize your Web PubSub service to connect to Event Hubs and how to add an event listener rule to your service settings.

Web PubSub service uses Microsoft Entra ID with managed identity to connect to Event Hubs. Therefore, you should enable the managed identity of the service and make sure it has proper permissions to connect to Event Hubs. You can grant the built-in [Azure Event Hubs Data sender](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-sender) role to the managed identity so that it has enough permissions.

To configure an Event Hubs listener, you need to:

- [Send client events to Event Hubs](#send-client-events-to-event-hubs)
  - [Overview](#overview)
  - [Configure an event listener](#configure-an-event-listener)
    - [Add a managed identity to your Web PubSub service](#add-a-managed-identity-to-your-web-pubsub-service)
    - [Grant the managed identity an `Azure Event Hubs Data sender` role](#grant-the-managed-identity-an-azure-event-hubs-data-sender-role)
    - [Add an event listener rule to your service settings](#add-an-event-listener-rule-to-your-service-settings)
  - [Test your configuration with live demo](#test-your-configuration-with-live-demo)
  - [Next steps](#next-steps)

## Configure an event listener

### Add a managed identity to your Web PubSub service

Find your Azure Web PubSub service from **Azure portal**. Navigate to **Identity**. To add a system-assigned identity, on the **System assigned** tab, switch **Status** to **On**. Select **Save**. For more information about managed identities, see [Managed identities in Azure Web PubSub](./howto-use-managed-identity.md).

:::image type="content" source="media/howto-use-managed-identity/system-identity-portal.png" alt-text="Screenshot of adding a system-assigned identity in the portal":::

### Grant the managed identity an `Azure Event Hubs Data sender` role

1. Find your Azure Event Hubs resource in **Azure portal**. You could choose to grant the role in the Event Hubs namespace level or entity level. The following steps choose the namespace level.

1. Navigate to **Access Control**. Select **Add role assignment**.
   :::image type="content" source="media/howto-develop-event-listener/event-hub-access-control.png" alt-text="Screenshot of granting access to Event Hubs namespace":::

1. Select **Azure Event Hubs Data Sender** role in the **Role** tab. Then select **Next**.
   :::image type="content" source="media/howto-develop-event-listener/event-hub-data-sender-role.png" alt-text="Screenshot of selecting Azure EventHubs Data Sender role":::

1. In the **Members** tab, choose to assign access to **Managed identity**. Select **Select members** to select your Web PubSub service. Then you can **Review + assign** your role assignment.
   :::image type="content" source="media/howto-develop-event-listener/event-hub-select-identity.png" alt-text="Screenshot of selecting your Web PubSub service identity":::

### Add an event listener rule to your service settings

1. Find your service from **Azure portal**. Navigate to **Settings**. Then select **Add** to configure your event listener. For an existing hub configuration, select **...** on right side will navigate to the same editing page.
   :::image type="content" source="media/howto-develop-event-listener/web-pubsub-settings.png" alt-text="Screenshot of Web PubSub settings":::

1. Then in the below editing page, you'd need to configure hub name, and select **Add** to add an event listener.
   :::image type="content" source="media/howto-develop-event-listener/configure-hub-settings.png" alt-text="Screenshot of configuring hub settings":::

1. On the **Configure Event Listener** page, first configure an event hub endpoint. You can select **Select Event Hub from your subscription** to select, or directly input the fully qualified namespace and the event hub name. Then select `user` and `system` events you'd like to listen to. Finally select **Confirm** when everything is done.
   :::image type="content" source="media/howto-develop-event-listener/configure-event-hub-listener.png" alt-text="Screenshot of configuring Event Hubs Listener":::

## Test your configuration with live demo

1. Open this [Event Hubs Consumer Client](https://awpseventlistenerdemo.blob.core.windows.net/eventhub-consumer/index.html) web app, input the Event Hubs connection string to connect to an event hub as a consumer. If you get the Event Hubs connection string from an Event Hubs namespace resource instead of an event hub instance, then you need to specify the event hub name. This event hub consumer client is connected with the mode that only reads new events; the events published before aren't seen here. You can change the consumer client connection mode to read all the available events in the production environment.

1. Use this [WebSocket Client](https://awpseventlistenerdemo.blob.core.windows.net/webpubsub-client/websocket-client.html) web app to generate client events. If you've configured to send system event `connected` to that event hub, you should be able to see a printed `connected` event in the Event Hubs consumer client after connecting to Web PubSub service successfully. You can also generate a user event with the app.
   :::image type="content" source="media/howto-develop-event-listener/eventhub-consumer-connected-event.png" alt-text="Screenshot of a printed connected event in the Event Hubs consumer client app.":::
   :::image type="content" source="media/howto-develop-event-listener/web-pubsub-client-specify-event-name.png" alt-text="Screenshot showing the area of the WebSocket client app to generate a user event.":::

## Next steps

In this article, you learned how event listeners work and how to configure an event listener with an event hub endpoint. To learn the data format sent to Event Hubs, read the following specification.

> [!div class="nextstepaction"] 
> [Specification: CloudEvents AMQP extension for Azure Web PubSub](./reference-cloud-events-amqp.md)

<!--TODO: Add demo-->
