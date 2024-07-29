---
title: Music Mode on Native Calling SDK
titleSuffix: An Azure Communication Services Calling concept doc
description: Use Azure Communication Services Calling to review Music Mode.
author: garchiro7
ms.author: jorgegarc
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 03/01/2024
ms.custom: template-how-to
---

# Music Mode

The **music mode** enhances the audio quality for music playback and performance within virtual environments, ensuring clarity and depth in sound reproduction; currently supports a 32-kHz sampling rate at 128 kbps when network bandwidth allows; when network bandwidth is insufficient, the bitrate can be reduced to as low as 48 kbps.

This feature is designed to elevate the audio quality for calls, ensuring the audio is crispy and offering a richer and more immersive audio experience. Also, it reduces audio compression to maintain the original sound, making it ideal for applications ranging from live musical performances and remote music education or music sessions.

Once music mode is enabled, you should consider:

- Input and output audio devices that allow high bitrate and sampling rate (two channels, 32 kHz or higher)
- Enable Control Noise suppression

We recommend using high-quality external loudspeakers, professional microphones, or headsets instead of Bluetooth devices to optimize the music mode.

**Note:** music mode only works in 1:1 calls on native platforms and group calls. Currently, music mode doesn't work in 1:1 calls between native and web. By default, music mode is disabled.

The Calling native SDK provides an additional set of audio filters that bring a richer experience during the call:

- Echo cancellation. *You can only toggle echo cancellation only if music mode is enabled*
- Noise suppression. *The currently available modes are `Off`, `Auto`, `Low`, and `High`*
- Analog Automatic gain control
- Digital Automatic gain control

## Next steps
- [Learn how to setup audio filters](../../tutorials/audio-quality-enhancements/add-noise-supression.md)
