---
title: Set screen orientation by using the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use the Azure Communication Services UI Library to set screen orientation in an application.
author: mbellah
ms.author: mbellah
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 05/24/2022
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want to set the orientation of the pages in my application.
---

# Set screen orientation in an application

The Azure Communication Services UI Library enables developers to set the orientation of screens in an application. You can specify screen orientation mode on the call setup screen and on the call screen of the UI Library.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/identity/access-tokens.md).
- Optional: Completion of the [quickstart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Set the screen orientation

::: zone pivot="platform-android"
[!INCLUDE [Screen orientation over the Android UI Library](./includes/orientation/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Screen orientation over the iOS UI Library](./includes/orientation/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
