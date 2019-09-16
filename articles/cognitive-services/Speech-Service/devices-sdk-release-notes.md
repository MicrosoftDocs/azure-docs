---
title: Speech Devices SDK documentation
titleSuffix: Azure Cognitive Services
description: Release notes - what has changed in the most recent releases
services: cognitive-services
author: wsturman
manager: nitinme

ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/10/2019
ms.author: wellsi
---

# Release notes of Cognitive Services Speech Devices SDK
The following sections list changes in the most recent releases.

## Speech Devices SDK 1.6.0:

*	Support [Azure Kinect DK](https://azure.microsoft.com/services/kinect-dk/) on Windows and Linux with common [sample application](https://aka.ms/sdsdk-download)
*	Updated the [Speech SDK](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) component to version 1.6.0. For more information, see its [release notes](https://aka.ms/csspeech/whatsnew).

## Speech Devices SDK 1.5.1:

*	Include [Conversation Transcription](conversation-transcription-service.md) in the sample app.
*	Updated the [Speech SDK](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) component to version 1.5.1. For more information, see its [release notes](https://aka.ms/csspeech/whatsnew).

## Cognitive Services Speech Devices SDK 1.5.0: 2019-May release

*	Speech Devices SDK is now GA and no longer a gated preview.
*	Updated the [Speech SDK](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) component to version 1.5.0. For more information, see its [release notes](https://aka.ms/csspeech/whatsnew).
*	New wake word technology brings significant quality improvements, see Breaking Changes.
*	New audio processing pipeline for improved far-field recognition.

**Breaking changes**

*	Due to the new wake word technology all wake words must be re-created at our improved wake word portal. To fully remove old keywords from the device uninstall the old app.
	- adb uninstall com.microsoft.coginitiveservices.speech.samples.sdsdkstarterapp

## Cognitive Services Speech Devices SDK 1.4.0: 2019-Apr release

* Updated the [Speech SDK](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) component to version 1.4.0. For more information, see its [release notes](https://aka.ms/csspeech/whatsnew).

## Cognitive Services Speech Devices SDK 1.3.1: 2019-Mar release

* Updated the [Speech SDK](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) component to version 1.3.1. For more information, see its [release notes](https://aka.ms/csspeech/whatsnew).
*	Updated wake word handling, see Breaking Changes.
*	Sample application adds choice of language for both speech recognition and translation.

**Breaking changes**

*	[Installing a wake word](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-devices-sdk-create-kws) has been simplified, it is now part of the app and does not need separate installation on the device.
*	The wake word recognition has changed, and two events are supported.
    - RecognizingKeyword, indicates the speech result contains (unverified) keyword text.
    - RecognizedKeyword, indicates that keyword recognition completed recognizing the given keyword.


## Cognitive Services Speech Devices SDK 1.1.0: 2018-Nov release

* Updated the [Speech SDK](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) component to version 1.1.0. For more information, see its [release notes](https://aka.ms/csspeech/whatsnew).
* Far Field Speech recognition accuracy has been improved with our enhanced audio processing algorithm.
* Sample application added Chinese speech recognition support.

## Cognitive Services Speech Devices SDK 1.0.1: 2018-Oct release

* Updated the [Speech SDK](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) component to version 1.0.1. For more information, see its [release notes](https://aka.ms/csspeech/whatsnew).
* Speech recognition accuracy will be improved with our improved audio processing algorithm  
* One continuous recognition audio session bug is fixed.

**Breaking changes**

* With this release a number of breaking changes are introduced. Please check [this page](https://aka.ms/csspeech/breakingchanges_1_0_0) for details relating to the APIs.
* The KWS model files are not compatible with Speech Devices SDK 1.0.1. The existing Wake Word files will be deleted after the new Wake Word files are written to the device.

## Cognitive Services Speech Devices SDK 0.5.0: 2018-Aug release

* Improved the accuracy of speech recognition by fixing a bug in the audio processing code.
* Updated the [Speech SDK](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) component to version 0.5.0. For more information, see its
[release notes](releasenotes.md#cognitive-services-speech-sdk-050-2018-july-release).

## Cognitive Services Speech Devices SDK 0.2.12733: 2018-May release

The first public preview release of the Cognitive Services Speech Devices SDK.
