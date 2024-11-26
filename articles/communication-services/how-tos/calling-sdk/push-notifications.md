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

#Customer intent: As a developer, I want to enable push notifications by using the Azure Communication Services SDKs so that I can create a calling application that provides push notifications to its users.
---

# Enable push notifications for calls

Push notifications send information from your application to users' devices. You can use push notifications to show a dialog, play a sound, or display incoming call into the app's UI layer.

In this article, you learn how to enable push notifications for Azure Communication Services calls. Communication Services provides integrations with [Azure Event Grid](../../../event-grid/overview.md) and [Azure Notification Hubs](../../../notification-hubs/notification-hubs-push-notification-overview.md) that enable you to add push notifications to your apps.

## <a name = "ttl-token"></a> Overview of TTL tokens

The time-to-live (TTL) token is a setting that determines the length of time that a notification token stays valid before becoming invalid. This setting is useful for applications where user engagement doesn't require daily interaction but remains critical over longer periods.

The TTL configuration allows the management of push notifications' life cycle. It reduces the need for frequent token renewals while helping to ensure that the communication channel between the application and its users remains open and reliable for extended durations.

Currently, the maximum value for TTL is **180 days (15,552,000 seconds)**, and the minimum value is **5 minutes (300 seconds)**. You can enter this value and adjust it to fit your needs. If you don't provide a value, the default value is **24 hours (86,400 seconds)**.

After the Register Push Notification API is called, the device token information is saved in the registrar. After the TTL duration ends, the device endpoint information is deleted. Any incoming calls on those devices can't be delivered to the devices if those devices don't call the Register Push Notification API again.

If you want to revoke an identity, follow [this process](../../concepts/identity-model.md#revoke-or-update-access-token). After the identity is revoked, the registrar entry should be deleted.

> [!NOTE]
> For a Microsoft Teams user, the maximum TTL value is **24 hrs (86,400 seconds)**. There's no way to increase this value. You should wake up the application every 24 hours in the background and register the device token.
>
> To wake up the application, fetch the new token, and perform the registration, follow the [instructions for the iOS platform](https://developer.apple.com/documentation/uikit/app_and_environment/scenes/preparing_your_ui_to_run_in_the_background/using_background_tasks_to_update_your_app) or the [instructions for the Android platform](https://developer.android.com/develop/background-work/background-tasks).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).

- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).

- Optional: Completion of the [quickstart to add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md).

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

## Related content

- [Subscribe to SDK events](./events.md)
- [Manage calls](./manage-calls.md)
- [Manage video during calls](./manage-video.md)
- [Migrate Android SDK push notifications to Firebase Cloud Messaging HTTP v1](../../tutorials/call-chat-migrate-android-push-fcm-v1.md)
- [Register for Android SDK push notifications using Firebase Cloud Messaging HTTP v1](../../tutorials/call-chat-register-android-push-fcm-v1.md)
