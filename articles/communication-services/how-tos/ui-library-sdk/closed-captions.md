---
title: Enable scenarios using close captions and the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Enable scenarios using closed captions and Azure Communication Services UI Library.
author: garchiro7
ms.author: jorgegarc
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 07/01/2024
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want setup closed captions into a call using the UI Library.
---

# Closed captions

Closed captions play a critical role in video voice calling apps, providing numerous benefits that enhance the accessibility, usability, and overall user experience of these platforms.

The Azure Communication Services UI Library offers the capabilities to enable closed captions in the calling composite and set up the default language, but the end users are always capable to select the language via UI interaction.

:::image type="content" source="./includes/closed-captions/mobile-ui-closed-captions.png" alt-text="Closed captions looks like into the UI Library":::

In this article, you learn how to enable closed captions scenarios using the UI Library.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/access-tokens.md).
- Optional: Completion of the [quickstart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Set up the feature

::: zone pivot="platform-android"
[!INCLUDE [Enable closed captions in the Android UI Library](./includes/closed-captions/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Enable closed captions in the iOS UI Library](./includes/closed-captions/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
