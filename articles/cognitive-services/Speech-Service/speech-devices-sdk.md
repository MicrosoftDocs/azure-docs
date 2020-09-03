---
title: Speech Devices SDK - Speech service
titleSuffix: Azure Cognitive Services
description: Get started with the Speech Devices SDK. The Speech service works with a wide variety of devices and audio sources. The Speech Devices SDK is a pre-tuned library that's paired with purpose-built, microphone array development kits.
services: cognitive-services
author: erhopf
manager: nitinme

ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/11/2020
ms.author: erhopf
---

# What is the Speech Devices SDK?

The [Speech service](overview.md) works with a wide variety of devices and audio sources. Now, you can take your speech applications to the next level with matched hardware and software. The Speech Devices SDK is a pre-tuned library that's paired with purpose-built, microphone array development kits.

The Speech Devices SDK can help you:

- Rapidly test new voice scenarios.
- More easily integrate the cloud-based Speech service into your device.
- Create an exceptional user experience for your customers.

The Speech Devices SDK consumes the [Speech SDK](speech-sdk.md). Using our advanced audio processing algorithms with the device's microphone array to send the audio to the [Speech service](overview.md). It provides accurate far-field [speech recognition](speech-to-text.md) via noise suppression, echo cancellation, beamforming, and dereverberation.

You can also use the Speech Devices SDK to build ambient devices that have your own [customized keyword](speech-devices-sdk-create-kws.md). A Custom Keyword provides a cue that starts a user interaction which is unique to your brand.

The Speech Devices SDK enables a variety of voice-enabled scenarios, such as [voice assistants](https://aka.ms/bots/speech/va), drive-thru ordering systems, [conversation transcription](conversation-transcription-service.md), and smart speakers. You can respond to users with text, speak back to them in a default or [custom voice](how-to-customize-voice-font.md), provide search results, [translate](speech-translation.md) to other languages, and more. We look forward to seeing what you build!

## Get the Speech Devices SDK

### Android

The Speech Devices SDK for Android supports the [Roobo v1](speech-devices-sdk-roobo-v1.md) and equivalent devices, for these download the latest version of the [Android Speech Devices SDK](https://aka.ms/sdsdk-download-android).


If you have a different Android device, like a phone or mobile, start with the [Android Speech SDK](speech-sdk.md)


### Windows

For Windows, the sample application is provided as a cross-platform Java application. Download the latest version of the [JRE Speech Devices SDK](https://aka.ms/sdsdk-download-JRE).
The application is built with the Speech SDK package, and the Eclipse Java IDE (v4) on 64-bit Windows. It runs on a 64-bit Java 8 runtime environment (JRE).

### Linux

For Linux, the sample application is provided as a cross-platform Java application. Download the latest version of the [JRE Speech Devices SDK](https://aka.ms/sdsdk-download-JRE).
The application is built with the Speech SDK package, and the Eclipse Java IDE (v4) on 64-bit Linux (Ubuntu 16.04, Ubuntu 18.04, Debian 9, RHEL 8, CentOS 8). It runs on a 64-bit Java 8 runtime environment (JRE).

Additional binaries are provided to support upcoming devices, [Roobo v2 DDK](https://aka.ms/sdsdk-download-roobov2), [Urbetter DDK](https://aka.ms/sdsdk-download-urbetter), [GGEC Speaker](https://aka.ms/sdsdk-download-speaker), [Linux ARM32](https://aka.ms/sdsdk-download-linux-arm32), and [Linux ARM64](https://aka.ms/sdsdk-download-linux-arm64).

## Next steps

> [!div class="nextstepaction"]
> [Choose your speech device](get-speech-devices-sdk.md)
> [!div class="nextstepaction"]
> [Get a Speech service subscription key for free](get-started.md)
