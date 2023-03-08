---
title: Localization over the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services UI Library for Mobile native to set up localization
author: jorgegarc
ms.author: jorgegarc
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 04/03/2022
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android

#Customer intent: As a developer, I want to set up the localization of my application
---

# Localization

Localization is a key to making products that can be used across the world and by people who speak different languages. UI Library will provide out of the box support for some languages and capabilities such as RTL. Developers can provide their own localization files to be used for the UI Library.

Learn how to set up the localization correctly using the UI Library in your application.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../quickstarts/identity/access-tokens.md)
- Optional: Complete the quickstart for [getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md)

::: zone pivot="platform-web"
[!INCLUDE [Localization over the Web UI library](./includes/localization/web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Localization over the Android UI library](./includes/localization/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Localization over the iOS UI library](./includes/localization/ios.md)]
::: zone-end

## Next steps

- [Learn more about UI Library](../../concepts/ui-library/ui-library-overview.md)
