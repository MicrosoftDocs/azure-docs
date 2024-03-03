---
title: Manage the audio filters on Calling Native SDKs
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services Calling SDKs to set the audio filters.
author: t-leejiyoon
ms.author: zehangzheng
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 07/27/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android-windows
---

# Manage audio filters

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

Learn how to manage audio processing features with the Azure Communication Services SDKS. You learn how to apply different audio features before and during calls using audio filters. 

Currently, there are five different filters available to control.

## Analog Automatic gain control

Analog automatic gain control is a filter available before a call. By default, this filter is enabled.

## Digital Automatic gain control

Digital automatic gain control is a filter available before a call. By default, this filter is enabled.

## Music Mode

Music mode is a filter available before and during a call. Learn more about music mode [here](../../concepts/voice-video-calling/music-mode.md). Note that music mode only works in 1:1 calls on native platforms and group calls. Currently, music mode doesn't work in 1:1 calls between native and web. By default, music mode is disabled.

## Echo cancellation

Echo cancellation is a filter available before and during a call. You can only toggle echo cancellation only if music mode is enabled. By default, this filter is enabled.

## Noise suppression

Noise suppression is a filter available before and during a call. The currently available modes are `Off`, `Auto`, `Low`, and `High`. By default, this feature is set to `High` mode.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md)
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
