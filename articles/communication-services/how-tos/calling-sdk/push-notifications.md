---
title: Enable push notifications for calls
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to enable push notifications for calls.
author: tophpalmer
ms.author: chpalm
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 08/10/2021
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows

#Customer intent: As a developer, I want to enable push notifications with the Azure Communication Services sdks so that I can create a calling application that provides push notifications to its users.
---

# Enable push notifications for calls

Here, we learn how to enable push notifications for Azure Communication Services calls. Setting up the push notifications let your users know when they have an incoming call, which they can then answer.

## Push notification

Push notifications allow you to send information from your application to users' devices. You can use push notifications to show a dialog, play a sound, or display incoming call into the app UI layer. Azure Communication Services provides integrations with [Azure Event Grid](../../../event-grid/overview.md) and [Azure Notification Hubs](../../../notification-hubs/notification-hubs-push-notification-overview.md) that enable you to add push notifications to your apps.

### TTL token

The Time To Live (TTL) token is a setting that determines the length of time a notification token stays valid before becoming invalid. This setting is useful for applications where user engagement doesn't require daily interaction but remains critical over longer periods.

The TTL configuration allows the management of push notifications' lifecycle, reducing the need for frequent token renewals while ensuring that the communication channel between the application and its users remains open and reliable for extended durations.

Currently, the maximum value for TTL is **180 days (15,552,000 seconds)**, and the min value is **5 minutes (300 seconds)**. You can enter this value and adjust it accordingly to your needs. If you don't provide a value, the default value is **24 hours (86,400 seconds)**.

Once the register push notification API is called when the device token information is saved in Registrar. After TTL lifespan ends, the device endpoint information is deleted. Any incoming calls on those devices can't be delivered to the devices if those devices don't call the register push notification API again.

In case that you want to revoke an identity you need to follow [this process](../../concepts/identity-model.md#revoke-or-update-access-token), once the identity is revoked the Registrar entry should be deleted.

>[!Note]
>For CTE (Custom Teams Endpoint) the max TTL value is **24 hrs (86,400 seconds)** there's no way to increase this value.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

::: zone pivot="platform-web"
[!INCLUDE [Enable push notifications Web](./includes/push-notifications/push-notifications-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Enable push notifications Android](./includes/push-notifications/push-notifications-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Enable push notifications iOS](./includes/push-notifications/push-notifications-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Enable push notifications Windows](./includes/push-notifications/push-notifications-windows.md)]
::: zone-end

## Next steps
- [Learn how to subscribe to events](./events.md)
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)

## Related topics

- [Migrate Android SDK push notifications to FCM v1](../../tutorials/call-chat-migrate-android-push-fcm-v1.md)
- [Register for Android SDK push notifications using FCM v1](../../tutorials/call-chat-register-android-push-fcm-v1.md)
