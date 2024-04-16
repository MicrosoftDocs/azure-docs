---
title: Theme the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Set up theming for the Azure Communication Services UI Library.
author: garchiro7
ms.author: jorgegarc
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 10/27/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android

#Customer intent: As a developer, I want to set up the theming of the UI Library in my application.
---

# Theme the UI Library in an application

The Azure Communication Services UI Library is a set of components, icons, and composites that make it easier for you to build high-quality user interfaces for your projects. The UI Library uses components and icons from [Fluent UI](https://developer.microsoft.com/fluentui), the cross-platform design system that Microsoft uses. As a result, the components are built with usability, accessibility, and localization in mind.

In this article, you learn how to change the theme for UI Library components as you configure an application.

The UI Library is fully documented for developers on a separate site. The documentation is interactive and helps you understand how the APIs work by giving you the ability to try them directly from a webpage. For more information, see the [UI Library documentation](https://azure.github.io/communication-ui-library/?path=/docs/overview--page).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/identity/access-tokens.md).
- Optional: Completion of the [quickstart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Set up theming

::: zone pivot="platform-web"
[!INCLUDE [Theming the Web UI Library](./includes/theming/web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Theming the Android UI Library](./includes/theming/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Theming the iOS UI Library](./includes/theming/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
- [Learn more about the UI Library Design Kit](../../quickstarts/ui-library/get-started-ui-kit.md)
