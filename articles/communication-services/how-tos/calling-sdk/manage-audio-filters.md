---
title: Outgoing Audio Filters
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to set outgoing audio filters.
author: t-leejiyoon
ms.author: t-leejiyoon
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 07/27/2023
ms.custom: template-how-to
---

# Manage audio filters

Learn how to manage audio processing features with the Azure Communication Services SDKS. We'll learn how to apply different audio features before and during calls using audio filters.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

::: zone pivot="platform-android"
[!INCLUDE [Manage Audio Filters Android](./includes/manage-audio-filters/manage-audio-filters-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Manage Audio Filters iOS](./includes/manage-audio-filters/manage-audio-filters-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Manage Audio Filters Windows](./includes/manage-audio-filters/manage-audio-filters-windows.md)]
::: zone-end

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)
