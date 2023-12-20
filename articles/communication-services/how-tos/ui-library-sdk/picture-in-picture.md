---
title: Picute-in-Picture for the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services UI library for Mobile native with Picute-in-Picture.
author: pprystinka
ms.author: pprystinka
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 12/12/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want to turn on Picute-in-Picture in my application
---

# Picture-in-Picture 

While being in the call, user is presented with full screen UI, which prevents user from multitasking in the App while still on the call.

There are two ways to enable user to multitask in the App:
- Enabling multitasking - user is able to click Back button which takes user back to the preivious screen. No Calling UI is visible to user while still on the call.
- Enable Picute-in-Picture, in additions, will display a system Picute-in-Picture with ougoing call. Please note Picute-in-Picture is using system provided Picute-in-Picture feature and is a subject of the feature support on the device, CPU load, RAM availability, battery state etc.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../quickstarts/identity/access-tokens.md)
- Optional: Complete the quickstart for [getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md)

::: zone pivot="platform-android"
[!INCLUDE [Picute-in-picture for the Android UI library](./includes/picture-in-picture/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Picute-in-picture for the iOS UI library](./includes/picture-in-picture/ios.md)]
::: zone-end

## Next steps

- [Learn more about UI Library](../../concepts/ui-library/ui-library-overview.md)