---
title: Skip setup screen of the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services UI Library for Mobile native to skip the setup screen
author: mbellah
ms.author: mbellah
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 03/21/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want to skip setup screen of the library in my application
---

# Skip setup screen

The feature enables the option to join a call without passing through the setup screen. It empowers developers to build their communication application using UI Library in a way that users can join a call directly without any user interaction. The feature also provides capability to configure camera and microphone default state. We're providing APIs to turn the camera and microphone on or off so that developers have the capability to configure the default state of the camera and microphone before joining a call.

Learn how to set up the skip setup screen feature correctly in your application.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../quickstarts/access-tokens.md)
- Optional: Complete the quickstart for [getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md)

::: zone pivot="platform-android"
[!INCLUDE [Skip Setup Screen over the Android UI library](./includes/skip-setup-screen/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Skip Setup Screen over the iOS UI library](./includes/skip-setup-screen/ios.md)]
::: zone-end

## Next steps

- [Learn more about UI Library](../../concepts/ui-library/ui-library-overview.md)
