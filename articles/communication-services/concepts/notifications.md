---
title: Notifications in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Send notifications to users of apps built on Azure Communication Services.
author: tophpalmer
manager: chpalm
services: azure-communication-services

ms.author: chpalm
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
---
# Communication Services notifications

The Azure Communication Services chat and calling SDKs create a real-time messaging channel that allows signaling messages to be pushed to connected clients in an efficient, reliable manner. This enables you to build rich, real-time communication functionality into your applications without the need to implement complicated HTTP polling logic. However, on mobile applications, this signaling channel only remains connected when your application is active in the foreground. If you want your users to receive incoming calls or chat messages while your application is in the background, you should use push notifications.

Push notifications allow you to send information from your application to users' mobile devices. You can use push notifications to show a dialog, play a sound, or display incoming call UI. Azure Communication Services provides integrations with [Azure Event Grid](../../event-grid/overview.md) and [Azure Notification Hubs](../../notification-hubs/notification-hubs-push-notification-overview.md) that enable you to add push notifications to your apps.

## Trigger push notifications via Azure Event Grid

Azure Communication Services integrates with [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) to deliver real-time event notifications in a reliable, scalable and secure manner. You can leverage this integration to create a notification service that delivers mobile push notifications to your users by creating an event grid subscription that triggers an [Azure Function](../../azure-functions/functions-overview.md) or webhook.

:::image type="content" source="./media/notifications/acs-events-int.png" alt-text="Diagram showing how Communication Services integrates with Event Grid.":::

Learn more about [event handling in Azure Communication Services](../../event-grid/event-schema-communication-services.md).

## Deliver push notifications via Azure Notification Hubs

You can connect an Azure Notification Hub to your Communication Services resource in order to automatically send push notifications to a user's mobile device when they receive an incoming call or to notify them about missed chat activity. You should use these push notifications to wake up your application from the background and display UI that lets the user accept or decline the call or read the newly received chat message. 

:::image type="content" source="./media/notifications/acs-anh-int.png" alt-text="Diagram showing how communication services integrates with Azure Notification Hubs.":::

Communication Services uses Azure Notification Hub as a pass-through service to communicate with the various platform-specific push notification services using the [Direct Send](/rest/api/notificationhubs/direct-send) API. This allows you to reuse your existing Azure Notification Hub resources and configurations to deliver low latency, reliable notifications to your applications.

> [!NOTE]
> Currently calling and chat push notifications are supported for both Android and iOS.

### Notification Hub provisioning

To deliver push notifications to client devices using Notification Hubs, [create a Notification Hub](../../notification-hubs/create-notification-hub-portal.md) within the same subscription as your Communication Services resource. You must configure the Azure Notification Hub for the Platform Notification System you want to use. To learn how to get push notifications in your client app from Notification Hubs, see [Getting started with Notification Hubs](../../notification-hubs/notification-hubs-android-push-notification-google-fcm-get-started.md) and select your target client platform from the drop-down list near the top of the page.

> [!NOTE]
> Currently the APNs and FCM platforms are supported.
The APNs platform needs to be configured with token authentication mode. Certificate authentication mode isn't supported as of now.

Once your Notification hub is configured, you can associate it to your Communication Services resource by supplying a connection string for the hub using the Azure Resource Manager Client or through the Azure portal. The connection string should contain `Send` permissions. We recommend creating another access policy with `Send` only permissions specifically for your hub. Learn more about [Notification Hubs security and access policies](../../notification-hubs/notification-hubs-push-notification-security.md)

#### Using the Azure Resource Manager client to link your Notification Hub

To log into Azure Resource Manager, execute the following and sign in using your credentials.

```console
armclient login
```

 Once successfully logged in execute the following to provision the notification hub:

```console
armclient POST /subscriptions/<sub_id>/resourceGroups/<resource_group>/providers/Microsoft.Communication/CommunicationServices/<resource_id>/linkNotificationHub?api-version=2020-08-20-preview "{'connectionString': '<connection_string>','resourceId': '<resource_id>'}"
```

#### Using the Azure portal to link your Notification Hub

1. In the portal, go to your Azure Communication Services resource.

1. Inside the Communication Services resource, select **Push Notifications** from the left menu of the Communication Services page, and connect the Notification Hub that you provisioned earlier.

1. Select **Connect notification hub**. You'll see a list of notification hubs available to connect.
 
1. Select the notification hub that you'd like to use for this resource.
 
   - If you need to create a new hub, select **Create new notification hub** to get a new hub provisioned for this resource.

   :::image type="content" source="./media/notifications/acs-anh-portal-int.png" alt-text="Screenshot showing the Push Notifications settings within the Azure portal.":::

Now you'll see the notification hub that you linked with the connected state.

If you'd like to use a different hub for the resource, select **Disconnect**, and then repeat the steps to link the different notification hub.

> [!NOTE]
> Any change on how the hub is linked is reflected in the data plane (that is, when sending a notification) within a maximum period of 10 minutes. This same behavior applies when the hub is linked for the first time, **if** notifications were sent before the change.

### Device registration

Refer to the [voice calling quickstart](../quickstarts/voice-video-calling/getting-started-with-calling.md) and [chat quickstart](../quickstarts/chat/get-started.md) to learn how to register your device handle with Communication Services.

### Troubleshooting guide for push notifications

When you don't see push notifications on your device, there are three places where the notifications could have been dropped:

- Azure Notification Hubs didn't accept the notification from Azure Communication Services
- The Platform Notification System (for example APNs and FCM) didn't accept the notification from Azure Notification Hubs
- The Platform Notification System didn't deliver the notification to the device.

The first place where a notification can be dropped (Azure Notification Hubs didn't accept the notifications from Azure Communication Services) is covered below. For the other two places, see [Diagnose dropped notifications in Azure Notification Hubs](../../notification-hubs/notification-hubs-push-notification-fixer.md).

One way to see if your Communication Services resource sends notifications to Azure Notification Hubs is by looking at the `incoming messages` metric from the linked [Azure Notification Hub metrics](../../azure-monitor/essentials/metrics-supported.md#microsoftnotificationhubsnamespacesnotificationhubs).

The following are some common misconfigurations that might be the cause why Azure Notification Hub doesn't accept the notifications from your Communication Services resource.

#### Azure Notification Hub not linked to the Communication Services resource

There might be the case that you didn't link your Azure Notification Hub to your Communication Services resource. You can take a look in [Notification Hub provisioning section](#notification-hub-provisioning) to see how to link them.

#### The linked Azure Notification Hub isn't configured

You have to configure the linked Notification Hub with the Platform Notification System credentials for the platform (for example iOS or android) that you would like to use. For more details on how that can be done you can take a look in [Set up push notifications in a notification hub](../../notification-hubs/configure-notification-hub-portal-pns-settings.md).

#### The linked Azure Notification Hub doesn't exist

The Azure Notification Hub linked to your Communication Services resource doesn't exist anymore. Check that the linked Notification Hub still exists.

#### The Azure Notification Hub APNs platform is configured with certificate authentication mode

In case you want to use the APNs platform with certificate authentication mode, it is not currently supported. You should configure the APNs platform with token authentication mode as specified in [Set up push notifications in a notification hub](../../notification-hubs/configure-notification-hub-portal-pns-settings.md).

#### The linked connection string doesn't have `Send` permission

The connection string that you used to link your Notification Hub to your Communication Services resource needs to have the `Send` permission. For more details about how you can create a new connection string or see the current connection string from your Azure Notification Hub you can take a look in [Notification Hubs security and access policies](../../notification-hubs/notification-hubs-push-notification-security.md)

#### The linked connection string or Azure Notification Hub resourceId aren't valid

Make sure that you configure Communication Services resource with the correct connection string and Azure Notification Hub resourceId

#### The linked connection string is regenerated

In case that you regenerated the connection string of your linked Azure Notification Hub, you have to update the connection string with the new one in your Communication Services resource by [relinking the Notification Hub](#notification-hub-provisioning).

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](../../event-grid/overview.md)
* To learn more on the Azure Notification Hub concepts, see [Azure Notification Hubs documentation](../../notification-hubs/index.yml)
