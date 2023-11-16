---
title: Theming the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services UI Library for Mobile native to set up Theming
author: garchiro7
ms.author: jorgegarc
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 10/27/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android

#Customer intent: As a developer, I want to set up the Theming of my application
---

# Theming the UI Library

Azure Communication Services UI Library is a set of components, icons and composites designed to make it easier for you to build high-quality user interfaces for your projects. The UI Library uses components and icons from [Fluent UI](https://developer.microsoft.com/fluentui), the cross-platform design system that's used by Microsoft. As a result, the components are built with usability, accessibility, and localization in mind.

The UI Library is fully documented for developers on a separate site. Our documentation is interactive and designed to make it easy to understand how the APIs work by giving you the ability to try them out directly from a web page. See the [UI Library documentation](https://azure.github.io/communication-ui-library/?path=/docs/overview--page) for more information. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../quickstarts/identity/access-tokens.md)
- Optional: Complete the quickstart for [getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md)

::: zone pivot="platform-web"
[!INCLUDE [Theming the Web UI library](./includes/theming/web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Theming the Android UI library](./includes/theming/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Theming the iOS UI library](./includes/theming/ios.md)]
::: zone-end

## Next steps

- [Learn more about UI Library](../../concepts/ui-library/ui-library-overview.md)
- [Learn more about UI Library Design Kit](../../quickstarts/ui-library/get-started-ui-kit.md)
