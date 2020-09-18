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

This document describes how to use notifications in Azure Communication Services.

## Concepts 

An **event** is the smallest amount of information that fully describes something that happened within your Communication Services resource. Every event contains specific information that describes the type of event being triggered. For example, you may want your application to update a database, create a work item, and deliver an email notification every time an SMS message is sent to a phone number that you've provisioned using Communication Services.

A **notification** is a form of app-to-user communication that notifies users of your Communication Services applications when certain events are triggered. These notifications are usually experienced in the form of a pop-up or dialog box on their device.

## Communication Services events through Azure Event Grid 

All Communication Services events are fired into Azure Event Grid, where they can be ingested into Azure Data Explorer, fire Webhooks, and otherwise be connected to your own systems. You can build your own service or use server-less computing (such as Azure Functions) to process events and trigger push notifications. 

:::image type="content" source="./media/notifications/acs-events-int.png" alt-text="Diagram showing how Communication Services integrates with Event Grid.":::

Event Grid notifications can be configured through your Event Grid resource. For more information see the topic on [Event Handling in Azure Communication Services](./event-handling.md).

## Platform push notifications

When an application is **in the background and non-active**, you may still want to pop a push notification on the end-user device. An example of this is call initiation. When User A wants to start a voice or video call with User B, User B is not likely going to have the application idly open before the call starts. These push notifications need to use platform systems such as Apple Push Notification Service or Google Firebase to initiate the notification on the client device.

:::image type="content" source="./media/notifications/acs-anh-int.png" alt-text="Diagram showing how communication services integrates with Azure Notifications Hub.":::

When an application is **active and using the Calling or Chat client libraries**, those client libraries provide events for actions such as `SMS Received` and `Chat Message Received`. These client library events allow for a real-time foreground application experience with limited polling. These events are powered by non-public client-to-service connections managed internally by these client libraries.

To learn more about the SMS client library, please see the topic on [SMS concepts](./telephony-sms/concepts.md).

To learn more about the Chat client library, please see the topic on [Chat concepts](./chat/concepts.md).

## Delivering notifications to devices

Communication Services uses push notifications to notify client devices about calling events (such as incoming call notification). These notifications are sent to client devices as wake-up push notifications using platform-specific push notification services, such as Apple Push Notification Service (APNS) and Firebase cloud Messaging (FCM). This can be achieved with Azure Notification Hubs.

Communication Services uses [Direct Send](https://docs.microsoft.com/rest/api/notificationhubs/direct-send) on Notification Hubs to send client notifications. When using [Direct Send](https://docs.microsoft.com/rest/api/notificationhubs/direct-send), Azure Notification Hubs is used solely as a pass-through service to communicate with the various platform-specific push notification services. This option has the smallest latency and is most reliable way of sending notifications.

### Notification Hub provisioning 

To deliver notification to client devices using Notification Hubs, we need to create a Notification Hub within the same subscription as your Communication Services resource. We'll then associate that hub to the Communication Services resource using the Azure Resource Manager Client or through the Azure portal.

To create notification hub, please follow [Create an Azure notification hub in the Azure portal](https://docs.microsoft.com/azure/notification-hubs/create-notification-hub-portal) or [Create an Azure notification hub using the Azure CLI](https://docs.microsoft.com/azure/notification-hubs/create-notification-hub-azure-cli).

#### Using the Azure Resource Manager client to configure the Notification Hub

To log into Azure Resource Manager, execute the following:

```console
armclient login
```

Sign in using your credentials by running `armclient login`. Once successfully logged in execute the following to provision the notification hub:

```console
armclient POST /subscriptions/<sub_id>/resourceGroups/<resource_group>/providers/Microsoft.Communication/CommunicationServices/<resource_id>/linkNotificationHub?api-version=2020-08-20-preview "{'connectionString': '<connection_string>','resourceId': '<resource_id>'}"
```

#### Using the Azure portal to configure the Notification Hub

In the portal, navigate to your Azure Communication Services resource. Inside the Communication Services resource, select Push Notifications from the left menu of the Communication Services page and connect the Notification Hub that you provisioned earlier. You'll need to provide your connection string and resource ID here:

:::image type="content" source="./media/notifications/acs-anh-portal-int.png" alt-text="Screenshot showing the Push Notifications settings within the Azure Portal.":::

<!-- potentially de-scoped until post-ignite ### Device registration 

This captures the registration of your device handle with Communication Services. Please see [Register Push Notifications](./voice-video-calling/post-ignite/mobile-push-notifications.md#tab/registerPushNotification) -->


## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](https://docs.microsoft.com/azure/event-grid/overview)
* To learn more on the Azure Notification Hub Concepts, see [Azure Notification Hubs documentation?](https://docs.microsoft.com/azure/notification-hubs/)
