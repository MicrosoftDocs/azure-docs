---
title: Speech devices overview - Speech service
titleSuffix: Azure AI services
description: Get started with the Speech devices. The Speech service works with a wide variety of devices and audio sources. 
#services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 12/27/2021
ms.author: eur
---

# What are Speech devices?

The [Speech service](overview.md) works with a wide variety of devices and audio sources. You can use the default audio processing available on a device. Otherwise, the Speech SDK has an option for you to use our advanced audio processing algorithms that are designed to work well with the [Speech service](overview.md). It provides accurate far-field [speech recognition](speech-to-text.md) via noise suppression, echo cancellation, beamforming, and dereverberation.

## Audio processing
Audio processing is enhancements applied to a stream of audio to improve the audio quality. Examples of common enhancements include automatic gain control (AGC), noise suppression, and acoustic echo cancellation (AEC). The Speech SDK integrates [Microsoft Audio Stack (MAS)](audio-processing-overview.md), allowing any application or product to use its audio processing capabilities on input audio.

## Microphone array recommendations
The Speech SDK works best with a microphone array that has been designed according to our recommended guidelines. For details, see [Microphone array recommendations](speech-sdk-microphone.md).

## Device development kits
The Speech SDK is designed to work with purpose-built development kits, and varying microphone array configurations. For example, you can use one of these Azure development kits. 

- [Azure Percept DK](../../azure-percept/overview-azure-percept-dk.md) contains a preconfigured audio processor and a four-microphone linear array. You can use voice commands, keyword spotting, and far field speech with the help of Azure AI services. 
- [Azure Kinect DK](../../kinect-dk/about-azure-kinect-dk.md) is a spatial computing developer kit with advanced AI sensors that provide sophisticated Azure AI Vision and speech models. As an all-in-one small device with multiple modes, it contains a depth sensor, spatial microphone array with a video camera, and orientation sensor. 

## Next steps

* [Audio processing concepts](audio-processing-overview.md)
