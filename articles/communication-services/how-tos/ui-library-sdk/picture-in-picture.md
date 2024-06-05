---
title: Turn on picture-in-picture by using the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use picture-in-picture in the Azure Communication Services UI Library.
author: pavelprystinka
ms.author: pprystinka
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 12/12/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want to turn on picture-in-picture in my application.
---

# Turn on picture-in-picture in an application

While a user is on a call, a full-screen UI can prevent the user from multitasking in an app. There are two ways to enable the user to multitask in the app:

- Enable the user to select the **Back** button and return to the previous screen. No calling UI is visible while the user is still on the call.
- Turn on picture-in-picture.

This article shows you how to turn on picture-in-picture in the Azure Communication Services UI Library. The picture-in-picture feature is system provided and is subject to feature support on the device, including CPU load, RAM availability, and battery state.


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/identity/access-tokens.md).
- Optional: Completion of the [quickstart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Turn on the feature

::: zone pivot="platform-android"
[!INCLUDE [Picture-in-picture for the Android UI Library](./includes/pip/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Picture-in-picture for the iOS UI Library](./includes/pip/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
