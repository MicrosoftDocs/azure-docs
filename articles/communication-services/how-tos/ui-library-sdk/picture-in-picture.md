---
title: Picute-in-Picture for the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services UI library for Mobile native with Picute-in-Picture.
author: pavelprystinka
ms.author: pavelprystinka
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 12/12/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want to turn on Picture-in-Picture in my application
---

# Picture-in-Picture 

While being in the call, user is presented with full screen UI, which prevents user from multitasking in the App while still on the call.

There are two ways to enable user to multitask in the App:
- Enabling multitasking - user is able to click Back button which, takes user back to the previous screen. No Calling UI is visible to user while still on the call.
- Enable Picture-in-Picture, in additions, will display a system Picture-in-Picture with outgoing call. Please note Picture-in-Picture is using system provided Picture-in-Picture feature and is a subject of the feature support on the device, CPU load, RAM availability, battery state etc.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../quickstarts/identity/access-tokens.md)
- Optional: Complete the quickstart for [getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md)

::: zone pivot="platform-android"
[!INCLUDE [Picture-in-Picture for the Android UI library](./includes/pip/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Picture-in-Picture for the iOS UI library](./includes/pip/ios.md)]
::: zone-end

## Next steps

- [Learn more about UI Library](../../concepts/ui-library/ui-library-overview.md)