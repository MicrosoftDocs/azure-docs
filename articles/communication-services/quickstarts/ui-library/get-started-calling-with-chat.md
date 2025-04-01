---
title: Add calling and chat functionality
titleSuffix: An Azure Communication Services how-to guide
description: Add calling and chat functionality by using the Azure Communication Services UI Library.
author: pavelprystinka

ms.author: pprystinka
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 10/28/2024
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want to add calling and chat functionality to my app.
---

# Integrate calling and chat by using the UI Library

In this article, you learn how to integrate calling and chat functionality in your Android or iOS app by using the Azure Communication Services UI Library.

::: zone pivot="platform-android"
[!INCLUDE [Integrate Calling with Chat in the Android UI Library](./includes/get-started-calling-with-chat/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Integrate Calling with Chat in the iOS UI Library](./includes/get-started-calling-with-chat/ios.md)]
::: zone-end

## Run the code

Run the code to build and run your app on the device.

### More features

The [list of use cases](../../concepts/ui-library/ui-library-use-cases.md?branch=main&pivots=platform-mobile) has detailed information about more features.

## Add notifications to your mobile app

Azure Communication Services integrates with [Azure Event Grid](../../../event-grid/overview.md) and [Azure Notification Hubs](../../../notification-hubs/notification-hubs-push-notification-overview.md), so you can [add push notifications](../../concepts/notifications.md) to your apps in Azure. You can use push notifications to send information from your application to users' mobile devices. A push notification can show a dialog, play a sound, or display an incoming call UI.

## Related content

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
