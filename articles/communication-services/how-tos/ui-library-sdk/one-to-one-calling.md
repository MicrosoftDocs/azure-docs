---
title: One to one calling of the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services UI Library for Mobile native to one-to-one calling
author: iaulakh
ms.author: iaulakh
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 12/19/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want to enable push notifications with the Azure Communication Services UI Library so that I can create a calling application that provides push notifications to its users.
---

# One to One Calling and Push Notifications

UI Library provides out of the box support for making one to one call by Azure Communication Services participant identifiers. To support one to one calling, UI Libraries provide register incoming call notifications or Azure Communication Service Event Grid can be used.

Learn how to make one to one calls correctly using the UI Library in your application.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../quickstarts/identity/access-tokens.md)
- Optional: Complete the quickstart for [getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md)

::: zone pivot="platform-android"
[!INCLUDE [One to One Calling and Push notifications over the Android UI library](./includes/pushandonetoone/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [One to One Calling and Push notifications over the iOS UI library](./includes/pushandonetoone/ios.md)]
::: zone-end

## Next steps

- [Learn more about UI Library](../../concepts/ui-library/ui-library-overview.md)