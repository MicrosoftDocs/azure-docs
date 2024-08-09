---
title: Join a Teams meeting
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to join a Teams meeting.
author: tophpalmer
ms.author: chpalm
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.topic: how-to 
ms.date: 08/10/2021
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows

#Customer intent: As a developer, I want to join a Teams meeting.
---

# Join a teams meeting

Azure Communication Services SDKs can allow your users to join regular Microsoft Teams meetings. Here's how!

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

::: zone pivot="platform-web"
[!INCLUDE [Join a Teams Meeting Web](./includes/teams-interopability/teams-interopability-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Join a Teams Meeting Android](./includes/teams-interopability/teams-interopability-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Join a Teams Meeting iOS](./includes/teams-interopability/teams-interopability-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Join a Teams Meeting Windows](./includes/teams-interopability/teams-interopability-windows.md)]
::: zone-end

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to transfer calls](./transfer-calls.md)
