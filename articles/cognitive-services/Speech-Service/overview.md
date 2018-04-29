---
title: Speech service overview | Microsoft Docs
description: Introduction to the capabilities of the Speech service.
services: cognitive-services
author: v-jerkin
manager: wolfma

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 04/27/2018
ms.author: v-jerkin
---
# Speech service overview (Preview)

The Speech service, part of Microsoft's Cognitive Services, unites several Azure speech services that were previously available separately: Bing Speech (comprising speech recognition and text to speech), Custom Speech, and Speech Translation. Like its precursors, the Speech service is powered by the technologies used in other Microsoft products, including Cortana and Microsoft Office.

> [!NOTE]
> The Speech service is currently in public preview. Return here regularly for updates to documentation, additional code samples, and more.

With one subscription, the unified Speech service gives developers an easy way to give their applications powerful speech-enabled features. Your apps can now feature voice command, transcription, dictation, speech synthesis, and translation.

|Function|Description|
|-|-|
|Speech to text|Converts continuous human speech to text that can be used as input to your application. Can integrate with the [Language Understanding service](https://docs.microsoft.com/azure/cognitive-services/luis/) (LUIS) to derive user intent from utterances.|
|Text to speech|Converts text to audio files of natural-sounding synthesized speech.|
|Speech&nbsp;translation|Combines speech to text, text translation, and text to speech to provide translations of speech.|

> [!NOTE]
> If you have been using the separately-available services, there is no pressing need to migrate to the unified Speech service. These pre-existing services will continue to be available for some time. However, migration is straightforward and brings you additional functionality. If you are considering migrating, or just want to know what has changed, see [How to Migrate to the Speech Service](how-to-migrate.md).

## Using the Speech service

The function of the Speech service is made available in as many as three ways, depending on the function, including [native client SDKs](speech-sdk.md) that abstract away the details of the network and protocols.

|<br>Method|Speech<br>to Text|Text to<br>Speech|Speech<br>Translation|Description|
|-|-|-|-|-|
|[REST](rest-apis.md)|Yes|Yes|No|A simple HTTP-based API that makes it easy to add speech to your application.|
|[WebSockets](websockets.md)|Yes|No|Yes|Provides advanced functionality such as streaming real-time audio.|
|[SDKs](speech-sdk.md)|Yes|No|Yes|Native clients that simplify development by doing the networking for you.|

## Speech to text

The [Speech to Text](./speech-to-text) (STT), or speech recognition, API transcribes audio streams into text that your application can accept as input. Your application can then, for example, enter the text into a document or act upon it as a command.

Speech to Text has been separately optimized for interactive, conversation, and dictation scenarios. The following are common use cases for the Speech to Text API. 

> [!div class="checklist"]
> * Recognize brief a utterance, such as a command, without interim results
> * Transcribe a long, previously-recorded utterance, such as a voicemail message
> * Transcribe streaming speech in real-time, with partial results, for dictation
> * Determine what users want to do based on a spoken natural-language request

The Speech to Text API supports interactive speech transcription with real-time continuous recognition and interim results. It also supports end-of-speech detection, optional automatic capitalization and punctuation, profanity masking, and text normalization.

You can customize Speech to Text acoustic and language models to accommodate specialized vocabulary, noisy environments, and different ways of speaking.

## Text to speech

The [Text to Speech](./text-to-speech) (TTS), or speech synthesis, API converts plain text to natural-sounding speech, delivered to your application in an audio file. Multiple voices, varying in gender or accent, are available for many supported languages.

The API supports Speech Synthesis Markup Language (SSML) tags, so you can specify exact phonetic pronunciation for troublesome words. SSML can also indicate speech characteristics (including emphasis, rate, volume, gender, and pitch) right in the text.

The following are common use cases for the Text to Speech API.

> [!div class="checklist"]
> * Speech output as an alternative screen output for visually-impaired users
> * Voice prompting for in-car applications such as navigation
> * Conversational user interfaces in concert with the Speech to Text API

If you need to an unsupported dialect or just want a unique voice for your application, the Text to Speech API supports custom voice models.

## Speech translation

The [Speech translation](speech-translation.md) API can be used either to translate streaming audio in near-real-time or to process recorded speech. In streaming translation, the service returns interim results that can be displayed to the user to indicate translation progress. The results may be returned either as text or as voice.

Use cases for speech translation include the following.

> [!div class="checklist"] 
> * Implement a "conversational" translation mobile app or device for travelers 
> * Provide automatic translations for subtitling of audio and video recordings
 
## Speech Devices SDK

With the introduction of the unified Speech service, Microsoft and its partners now offer an integrated hardware/software platform optimized for developing speech-enabled devices: the [Speech Devices SDK](speech-devices-sdk.md). This SDK is suitable for developing smart speech devices for all types of applications.

The Speech Devices SDK allows you to build your own ambient devices with a customized wake word—so the cue that triggers audio capture is unique to your brand. It also provides superior audio processing from multi-channel sources for more accurate speech recognition, including noise suppression, far-field voice, and beamforming.

## Next steps

Start your free trial of the Speech service.

> [!div class="nextstepaction"]
> [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)

Download an SDK and some sample code to play around with.

> [!div class="nextstepaction"]
> [Speech SDKs](speech-sdk.md)

> [!div class="nextstepaction"]
> [Sample code](samples.md)
