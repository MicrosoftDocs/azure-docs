---
title: Handle events in the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Handle events in the Azure Communication Services UI Library.
author: garchiro7

ms.author: jorgegarc
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 09/01/2024
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want to handle events in the UI Library
---

# Subscribe events in the UI Library

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/access-tokens.md).
- Optional: Completion of the [quickstart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Set up the feature

::: zone pivot="platform-android"
[!INCLUDE [Listen events in the Android UI Library](./includes/events/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Listen events in the iOS UI Library](./includes/events/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
