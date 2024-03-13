---
title: Enable push notifications for calls.
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to enable push notifications for calls.
author: tophpalmer
ms.author: chpalm
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 08/10/2021
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android

#Customer intent: As a developer, I want to enable push notifications with the Azure Communication Services sdks so that I can create a calling application that provides push notifications to its users.
---

# Enable push notifications for calls

Here, we'll learn how to enable push notifications for Azure Communication Services calls. Setting these up will let your users know when they have an incoming call which they can then answer.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

::: zone pivot="platform-web"
[!INCLUDE [Enable push notifications Web](./includes/push-notifications/push-notifications-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Enable push notifications Android](./includes/push-notifications/push-notifications-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Enable push notifications iOS](./includes/push-notifications/push-notifications-ios.md)]
::: zone-end

## Next steps
- [Learn how to subscribe to events](./events.md)
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
