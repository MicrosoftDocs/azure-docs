---
title: Get active speakers
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to render the active speakers in a call.
author: jsaurezlee-msft
ms.author: jsaurezlee
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 08/10/2021
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows

#Customer intent: As a developer, I want to get a list of active speakers within a call.
---

# Get active speakers within a call


During an active call, you may want to get a list of active speakers in order to render or display them differently. Here's how.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

::: zone pivot="platform-web"
[!INCLUDE [Dominant Speaker JavaScript](./includes/dominant-speaker/dominant-speaker-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Dominant Speaker Android](./includes/dominant-speaker/dominant-speaker-android.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Dominant Speaker Windows](./includes/dominant-speaker/dominant-speaker-windows.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Dominant Speaker iOS](./includes/dominant-speaker/dominant-speaker-ios.md)]
::: zone-end

## Next steps
- [Learn how to manage video](./manage-video.md)
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to record calls](./record-calls.md)
