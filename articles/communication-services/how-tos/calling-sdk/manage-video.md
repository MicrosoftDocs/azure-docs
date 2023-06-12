---
title: Manage video during calls
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to manage video calls.
author: tophpalmer
ms.author: chpalm
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 08/10/2021
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows

#Customer intent: As a developer, I want to manage video calls with the acs sdks so that I can create a calling application that provides video capabilities.
---

# Manage video during calls

Learn how to manage video calls with the Azure Communication Services SDKS. We'll learn how to manage receiving and sending video within a call.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

::: zone pivot="platform-web"
[!INCLUDE [Manage Video Calls JavaScript](./includes/manage-video/manage-video-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Manage Video Calls Android](./includes/manage-video/manage-video-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Manage Video Calls iOS](./includes/manage-video/manage-video-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Manage Video Calls Windows](./includes/manage-video/manage-video-windows.md)]
::: zone-end

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)
