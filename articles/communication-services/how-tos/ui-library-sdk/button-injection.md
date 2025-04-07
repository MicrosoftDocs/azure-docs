---
title: Customize the actions from the button bar in the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Customize the actions from the button bar in the Azure Communication Services UI Library.
author: garchiro7

ms.author: jorgegarc
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 08/01/2024
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want to customize button actions in the UI Library.
---

# Customize buttons

To implement custom actions or modify the current button layout, you can interact with the Native UI Library's API. This API involves defining custom button configurations, specifying actions, and managing the button bar's current actions. The API provides methods for adding custom actions, and removing existing buttons, all of which are accessible via straightforward function calls.

This functionality provides a high degree of customization, and ensures that the user interface remains cohesive and consistent with the application's overall design.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/access-tokens.md).
- Optional: Completion of the [quickstart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Set up the feature

::: zone pivot="platform-android"
[!INCLUDE [Customize the actions from the button bar in the Android UI Library](./includes/button-injection/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Customize the actions from the button bar in the iOS UI Library](./includes/button-injection/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
