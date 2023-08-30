---
title: Manage call recording on the client
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to manage call recording on the client.
author: tophpalmer
ms.author: chpalm
ms.service: azure-communication-services
ms.topic: how-to
ms.subservice: calling 
ms.date: 08/10/2021
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows

#Customer intent: As a developer, I want to manage call recording on the client so that my users can record calls.
---

# Manage call recording on the client

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

[Call recording](../../concepts/voice-video-calling/call-recording.md), lets your users record their calls made with Azure Communication Services. Here we learn how to manage recording on the client side. Before this can work, you'll need to set up [server side](../../quickstarts/voice-video-calling/call-recording-sample.md) recording.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

::: zone pivot="platform-web"
[!INCLUDE [Record Calls Client-side JavaScript](./includes/record-calls/record-calls-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Record Calls Client-side Android](./includes/record-calls/record-calls-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Record Calls Client-side iOS](./includes/record-calls/record-calls-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Record Calls Client-side Windows](./includes/record-calls/record-calls-windows.md)]
::: zone-end

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to transcribe calls](./call-transcription.md)
