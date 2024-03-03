---
title: Music Mode on Native Calling SDK
titleSuffix: An Azure Communication Services Calling concept doc
description: Use Azure Communication Services Calling to review Music Mode
author: t-leejiyoon
ms.author: zehangzheng
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 07/27/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android-windows
---

# Music Mode

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]


This option enables high-fidelity audio transmission and currently supports a 32-kHz sampling rate at 128 kbps when network bandwidth allows, when network bandwidth is insufficient, the bitrate can be reduced to as low as 48 kbps. This enhancement is designed to elevate the audio quality for calls, ensuring that audio is crispy, offering a richer and more immersive audio experience. Once music mode is enabled, you should consider:

- Input and output audio devices that allow high bitrate and sampling rate (two channels, 32 kHz or higher)
- Enable Control Noise suppression

**Note:** music mode only works in 1:1 calls on native platforms and group calls. Currently, music mode doesn't work in 1:1 calls between native and web. By default, music mode is disabled.

Calling Native SDK provides an additional set of audio filters that will bring a richer experience during the call.

### Analog Automatic gain control

Analog automatic gain control is a filter available before a call.

### Digital Automatic gain control

Digital automatic gain control is a filter available before a call.

### Echo cancellation

Echo cancellation is a filter available before and during a call. You can only toggle echo cancellation only if music mode is enabled.

### Noise suppression

Noise suppression is a filter available before and during a call. The currently available modes are `Off`, `Auto`, `Low`, and `High`.

## Next steps
- [Learn how to setup adio filters](../../how-tos/calling-sdk/manage-audio-filters.md)
