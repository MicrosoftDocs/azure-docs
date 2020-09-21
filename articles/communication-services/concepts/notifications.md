---
title: Notifications in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Send notifications to users of apps built on Azure Communication Services.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-communication-services
---
# Communication Services notifications

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

The Azure Communication Services chat and calling client libraries create a real-time messaging channel that allows signaling messages to be pushed to connected clients in an efficient, reliable manner. This enables you to build rich, real-time communication functionality into your applications without the need to implement complicated HTTP polling logic. However, on mobile applications, this signaling channel only remains connected when your application is active in the foreground. If you want your users to receive incoming calls or chat messages while your application is in the background, you should use push notifications.

Push notifications are a form of app-to-user communication where users of mobile apps are notified of certain desired information. You can use push notifications to show a dialog, play a sound, or display incoming call UI. Azure Communication Services provides integrations with [Azure Event Grid](https://docs.microsoft.com/en-us/azure/event-grid/overview) and [Azure Notification Hubs](https://docs.microsoft.com/en-us/azure/notification-hubs/notification-hubs-push-notification-overview) that enable you to add push notifications to your apps.

## Trigger push notifications via Azure Event Grid

Azure Communication Services integrates with [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) to deliver real-time event notifications in a reliable, scalable and secure manner. You can leverage this integration to create a notification service that delivers mobile push notifications to your users by creating an event grid subscription that triggers an [Azure Function](https://docs.microsoft.com/azure/azure-functions/functions-overview) or webhook.

:::image type="content" source="./media/notifications/acs-events-int.png" alt-text="Diagram showing how Communication Services integrates with Event Grid.":::

Learn more about [event handling in Azure Communication Services](./event-handling.md).

## Deliver push notifications via Azure Notification Hubs

You can connect an Azure Notification Hub to your Communication Services resource in order to automatically send push notifications to a user's mobile device when they receive an incomming call. You should used these push notifications to wake up your application from the background and display UI that let's the user accept or decline the call. 

:::image type="content" source="./media/notifications/acs-anh-int.png" alt-text="Diagram showing how communication services integrates with Azure Notifications Hub.":::

Communication Services uses [Direct Send](https://docs.microsoft.com/rest/api/notificationhubs/direct-send) on Notification Hubs to send client notifications. When using [Direct Send](https://docs.microsoft.com/rest/api/notificationhubs/direct-send), Azure Notification Hubs is used solely as a pass-through service to communicate with the various platform-specific push notification services. This option has the smallest latency and is most reliable way of sending notifications.

### Notification Hub provisioning 

To deliver notification to client devices using Notification Hubs, we need to create a Notification Hub within the same subscription as your Communication Services resource. We'll then associate that hub to the Communication Services resource using the Azure Resource Manager Client or through the Azure portal.

To create notification hub, please follow [Create an Azure notification hub in the Azure portal](https://docs.microsoft.com/azure/notification-hubs/create-notification-hub-portal) or [Create an Azure notification hub using the Azure CLI](https://docs.microsoft.com/azure/notification-hubs/create-notification-hub-azure-cli).

The connection string should contain "Send" permissions. We recommend creating another access policy with "Send" only permissions specifically for your hub. Please see [Notification Hubs security](https://docs.microsoft.com/azure/notification-hubs/notification-hubs-push-notification-security) to learn more about Azure Notification Hub access policy.

To send VOIP notifications, configure a notification hub with the .voip app bundle ID. Please see [Use APNS VOIP through Notification Hubs](https://docs.microsoft.com/azure/notification-hubs/voip-apns).

#### Using the Azure Resource Manager client to configure the Notification Hub

To log into Azure Resource Manager, execute the following and sign in using your credentials.

```console
armclient login
```

 Once successfully logged in execute the following to provision the notification hub:

```console
armclient POST /subscriptions/<sub_id>/resourceGroups/<resource_group>/providers/Microsoft.Communication/CommunicationServices/<resource_id>/linkNotificationHub?api-version=2020-08-20-preview "{'connectionString': '<connection_string>','resourceId': '<resource_id>'}"
```

#### Using the Azure portal to configure the Notification Hub

In the portal, navigate to your Azure Communication Services resource. Inside the Communication Services resource, select Push Notifications from the left menu of the Communication Services page and connect the Notification Hub that you provisioned earlier. You'll need to provide your connection string and resource ID here:

:::image type="content" source="./media/notifications/acs-anh-portal-int.png" alt-text="Screenshot showing the Push Notifications settings within the Azure Portal.":::

#### Device registration 

Refer to the [Register Push Notifications](../quickstarts/voice-video-calling/includes/calling-sdk-ios.md#push-notification) quickstart section to learn how to register your device handle with Communication Services. 

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](https://docs.microsoft.com/azure/event-grid/overview)
* To learn more on the Azure Notification Hub concepts, see [Azure Notification Hubs documentation](https://docs.microsoft.com/azure/notification-hubs/)
