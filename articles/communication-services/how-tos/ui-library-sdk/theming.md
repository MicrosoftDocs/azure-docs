---
title: Theming over the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services UI Library for Mobile native to set up Theming
author: garchiro7
ms.author: jorgegarc
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 05/24/2022
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android

#Customer intent: As a developer, I want to set up the Theming of my application
---

# Theming

ACS UI Library uses components and icons from both [Fluent UI](https://developer.microsoft.com/fluentui), the cross-platform design system that's used by Microsoft. As a result, the components are built with usability, accessibility, and localization in mind.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../quickstarts/identity/access-tokens.md)
- Optional: Complete the quickstart for [getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md)

::: zone pivot="platform-web"
[!INCLUDE [Theming over the Web UI library](./includes/theming/web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Theming over the Android UI library](./includes/theming/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Theming over the iOS UI library](./includes/theming/ios.md)]
::: zone-end

## Next steps

- [Learn more about UI Library](../../concepts/ui-library/ui-library-overview.md)
- [Learn more about UI Library Design Kit](../../quickstarts/ui-library/get-started-ui-kit.md)
