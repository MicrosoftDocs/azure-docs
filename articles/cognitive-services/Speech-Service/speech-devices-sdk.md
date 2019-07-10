---
title: About the Speech Devices SDK - Speech Services
titleSuffix: Azure Cognitive Services
description: Get started with the Speech Devices SDK. The Speech Services work with a wide variety of devices and audio sources. Now, you can take your speech applications to the next level with matched hardware and software. The Speech Devices SDK is a pre-tuned library that's paired with purpose-built, microphone array development kits.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: erhopf
---
# About the Speech Devices SDK

The [Speech Services](overview.md) work with a wide variety of devices and audio sources. Now, you can take your speech applications to the next level with matched hardware and software. The Speech Devices SDK is a pretuned library that's paired with purpose-built, microphone array development kits.

The Speech Devices SDK can help you:

* Rapidly test new voice scenarios.
* More easily integrate the cloud-based Speech Services into your device.
* Create an exceptional user experience for your customers.

The Speech Devices SDK consumes the [Speech SDK](speech-sdk.md). It uses the Speech SDK to send the audio that's processed by our advanced audio processing algorithm from the device's microphone array to the [Speech Services](overview.md). It uses multichannel audio to provide more accurate far-field [speech recognition](speech-to-text.md) via noise suppression, echo cancellation, beamforming, and dereverberation.

You can also use the Speech Devices SDK to build ambient devices that have your own [customized wake word](speech-devices-sdk-create-kws.md) so the cue that initiates a user interaction is unique to your brand.

The Speech Devices SDK facilitates a variety of voice-enabled scenarios, such as [Custom Voice-First Virtual Assistants](https://aka.ms/bots/speech/va), drive-thru ordering systems, [conversation transcription](conversation-transcription-service.md), and smart speakers. You can respond to users with text, speak back to them in a default or [custom voice](how-to-customize-voice-font.md), provide search results, [translate](speech-translation.md) to other languages, and more. We look forward to seeing what you build!

## Get the Speech Devices SDK

### Android

For Android devices download the latest version of the [Android Speech Devices SDK](https://aka.ms/sdsdk-download-android).

### Windows

For Windows the sample application is provided as a cross-platform Java application. Download the latest version of the [JRE Speech Devices SDK](https://aka.ms/sdsdk-download-JRE).
The application is built with the Speech SDK package, and the Eclipse Java IDE (v4) on 64-bit Windows. It runs on a 64-bit Java 8 runtime environment (JRE).

### Linux

For Linux the sample application is provided as a cross-platform Java application. Download the latest version of the [JRE Speech Devices SDK](https://aka.ms/sdsdk-download-JRE).
The application is built with the Speech SDK package, and the Eclipse Java IDE (v4) on 64-bit Linux (Ubuntu 16.04, Ubuntu 18.04, Debian 9). It runs on a 64-bit Java 8 runtime environment (JRE).

## Next steps

> [!div class="nextstepaction"]
> [Choose your Speech Device](get-speech-devices-sdk.md)
>
> [!div class="nextstepaction"]
> [Get a Speech Services subscription key for free](get-started.md)
