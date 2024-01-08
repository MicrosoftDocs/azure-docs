---
title: Skip the setup screen by using the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use the Azure Communication Services UI Library to skip the setup screen in an application.
author: mbellah
ms.author: mbellah
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 03/21/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want to skip the setup screen in my application so users can join a call directly.
---

# Skip the setup screen in an application

The Azure Communication Services UI Library offers the option to join a call without passing through the setup screen. It empowers developers to build a communication application in a way that enables users to join a call directly, without any user interaction. The feature also provides the capability to configure the default state of the camera and microphone (on or off) before users join a call.

In this article, you learn how to set up the feature correctly in your application.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/access-tokens.md).
- Optional: Completion of the [quickstart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Set up the feature

::: zone pivot="platform-android"
[!INCLUDE [Skip setup screen over the Android UI Library](./includes/skip-setup-screen/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Skip setup screen over the iOS UI Library](./includes/skip-setup-screen/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
