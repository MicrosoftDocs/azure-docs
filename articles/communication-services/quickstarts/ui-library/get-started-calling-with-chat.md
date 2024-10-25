---
title: Add calling and chat functionality
titleSuffix: An Azure Communication Services how-to guide
description: Add calling and chat functionality using the Azure Communication Services UI Library.
author: pprystinka

ms.author: pprystinka
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 10/14/2024
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want to add calling and chat functionality to my App.
---

# Integrate Calling and Chat UI Libraries

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../create-communication-resource.md).
- A user access token to enable the call and chat composites. [Get a user access token](../access-tokens.md).
- Optional: Completion of the [quickstart for getting started with the UI Library composites](get-started-composites.md).

## Set up the feature

::: zone pivot="platform-android"
[!INCLUDE [Customize the actions from the button bar in the Android UI Library](./includes/get-started-calling-with-chat/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Customize the actions from the button bar in the iOS UI Library](./includes/get-started-calling-with-chat/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
