---
title: Disable the left call confirmation prompt when clicking the end call button in the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Disable the left call confirmation prompt in the Azure Communication Services UI Library.
author: garchiro7
ms.author: jorgegarc
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 05/01/2024
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want disable the leave call confirmation prompt when clicking the end call button in the UI Library.
---

# Disable the call confirmation prompt in an application

The Azure Communication Services UI Library offers the option to disable the left call confirmation prompt, by default the UI Library show a prompt asking the user to confirm the end of the call; one common customization might involve streamlining the user experience, such as disabling the left call confirmation prompt when a user decide to end the call. This adjustment can make the call termination process quicker and reduce friction for users who are accustomed to instant actions.

In this article, you learn how to disable the left call confirmation prompt.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/access-tokens.md).
- Optional: Completion of the [quickstart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Set up the feature

::: zone pivot="platform-android"
[!INCLUDE [Disable the leave call confirmation prompt in the Android UI Library](./includes/leave-call-confirmation/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Disable the leave call confirmation prompt in the iOS UI Library](./includes/leave-call-confirmation/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
