---
title: Screen orientation over the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services UI library for Mobile native to set orientation for different library screen.
author: mbellah
ms.author: mbellah
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 05/24/2022
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want to set the orientation of my pages in my application
---

# Orientation 

Azure Communication Services UI Library enables developers to set the orientation of the UI Library screens. Developers can now specify screen orientation mode in call setup screen and in call screen of the UI Library.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../quickstarts/identity/access-tokens.md)
- Optional: Complete the quickstart for [getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md)

::: zone pivot="platform-android"
[!INCLUDE [Screen orientation over the Android UI library](./includes/orientation/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Screen orientation over the iOS UI library](./includes/orientation/ios.md)]
::: zone-end

## Next steps

- [Learn more about UI Library](../../concepts/ui-library/ui-library-overview.md)
