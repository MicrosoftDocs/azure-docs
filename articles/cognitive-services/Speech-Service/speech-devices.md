---
title: Speech devices overview - Speech service
titleSuffix: Azure Cognitive Services
description: Get started with the Speech devices. The Speech service works with a wide variety of devices and audio sources. 
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/18/2021
ms.author: eur
---

# Speech devices overview

The [Speech service](overview.md) works with a wide variety of devices and audio sources. Now, you can take your speech applications to the next level with matched hardware and software. 

The Speech SDK can help you:

- Rapidly test new voice scenarios.
- More easily integrate the cloud-based Speech service into your device.
- Create an exceptional user experience for your customers.

The Speech SDK uses our advanced audio processing algorithms with the device's microphone array to send the audio to the [Speech service](overview.md). It provides accurate far-field [speech recognition](speech-to-text.md) via noise suppression, echo cancellation, beamforming, and dereverberation.

You can also use the Speech SDK to build ambient devices that have your own [customized keyword](./custom-keyword-basics.md). A Custom Keyword provides a cue that starts a user interaction which is unique to your brand.

The Speech SDK enables a variety of voice-enabled scenarios, such as [voice assistants](./voice-assistants.md), drive-thru ordering systems, [conversation transcription](./conversation-transcription.md), and smart speakers. You can respond to users with text, speak back to them in a default or [custom voice](./how-to-custom-voice-create-voice.md), provide search results, [translate](speech-translation.md) to other languages, and more. We look forward to seeing what you build!


## Device development kits
The Speech SDK is designed to work with purpose-built development kits, and varying microphone array configurations. For example, you can use one of these Azure development kits. 

- [Azure Percept DK](../../azure-percept/overview-azure-percept-dk.md) contains a preconfigured audio processor and a four-microphone linear array and audio processing via XMOS Codec. You can use voice commands, keyword spotting, and far field speech with the help of Azure Cognitive Services. 
- [Azure Kinect DK](../../kinect-dk/about-azure-kinect-dk.md) is a spatial computing developer kit with advanced AI sensors that provide sophisticated computer vision and speech models. As an all-in-one small device with multiple modes, it contains a depth sensor, spatial microphone array with a video camera, and orientation sensor. 

## Next steps

> [!div class="nextstepaction"]
> [Audio processing concepts](audio-processing-overview.md)
