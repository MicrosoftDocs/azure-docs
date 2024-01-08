---
title: Localize the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Set up localization for the Azure Communication Services UI Library.
author: jorgegarc
ms.author: jorgegarc
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 04/03/2022
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android

#Customer intent: As a developer, I want to set up the localization of the UI Library in my application.
---

# Localize the UI Library in an application

Localization is a key to making products that can be used across the world and by people who speak different languages. The Azure Communication Services UI Library provides out-of-the-box support for some languages and capabilities, such as right to left (RTL). Developers can provide their own localization files for the UI Library.

In this article, you learn how to set up localization correctly by using the UI Library in your application.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/identity/access-tokens.md).
- Optional: Completion of the [quickstart for getting started with UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Set up localization

::: zone pivot="platform-web"
[!INCLUDE [Localization over the Web UI Library](./includes/localization/web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Localization over the Android UI Library](./includes/localization/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Localization over the iOS UI Library](./includes/localization/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
