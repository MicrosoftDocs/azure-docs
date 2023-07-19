---
title: Troubleshooting over the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services UI Library for Mobile native to get debug information.
author: pavelprystinka
ms.author: pprystinka
ms.service: azure-communication-services
ms.topic: how-to 
ms.custom: template-how-to
ms.date: 11/23/2022
zone_pivot_groups: acs-plat-web-ios-android

#Customer intent: As a developer, I want to get debug information for troubleshooting 
---

# Troubleshooting over the Calling UI Library

When troubleshooting happens for voice or video calls, you may be asked to provide a CallID; this ID is used to identify Communication Services calls.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../quickstarts/identity/access-tokens.md)
- Optional: Complete the quickstart for [getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md)

::: zone pivot="platform-web"
> [!NOTE]
> For detailed documentation and quickstarts about the Web UI Library visit the [**Web UI Library Storybook**](https://azure.github.io/communication-ui-library).
### You can access the following link to learn more
- [Troubleshooting](https://azure.github.io/communication-ui-library/?path=/docs/troubleshooting--page)
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Troubloshooting Android UI library](./includes/troubleshooting/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Troubloshooting over the iOS UI library](./includes/troubleshooting/ios.md)]
::: zone-end

User may find Call ID via the action bar on the bottom of the call screen. See more [Troubleshooting guide](../../concepts/ui-library/ui-library-use-cases.md?&pivots=platform-mobile#troubleshooting-guide)

## Next steps

- [Learn more about UI Library](../../concepts/ui-library/ui-library-overview.md)
- [Learn more about UI Library Design Kit](../../quickstarts/ui-library/get-started-ui-kit.md)
