---
title: What is the Speech service (preview)? | Microsoft Docs
description: "The Speech service, part of Microsoft's Cognitive Services, unites several Azure speech services that were previously available separately: Bing Speech (comprising speech recognition and text to speech), Custom Speech, and Speech Translation."
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin
manager: noellelacharite

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 05/07/2018
ms.author: v-jerkin
---
# What is the Speech service (preview)?

The Speech service is powered by the technologies used in other Microsoft products, including Cortana and Microsoft Office.  This same service is available to any customer as a Cognitive Service. 

> [!NOTE]
> The Speech service is currently in public preview. Return here regularly for updates to documentation, additional code samples, and more.

With one subscription, our Speech service gives developers an easy way to give their applications powerful speech-enabled features. Your apps can now feature voice command, transcription, dictation, speech synthesis, and translation.

|Function|Description|
|-|-|
|Speech to Text|Converts continuous human speech to text that can be used as input to your application. Can integrate with the [Language Understanding service](https://docs.microsoft.com/azure/cognitive-services/luis/) (LUIS) to derive user intent from utterances.|
|Text to Speech|Converts text to audio files of natural-sounding synthesized speech.|
|Speech&nbsp;Translation|Provide translations of speech to other languages, with text or speech output.|

## Using the Speech service

The Speech service is made available in two ways. [The SDK](speech-sdk.md) abstracts away the details of the network protocols. The [REST API](rest-apis.md) works with any programming language but does not offer all the functions offered by the SDK.

|<br>Method|Speech<br>to Text|Text to<br>Speech|Speech<br>Translation|<br>Description|
|-|-|-|-|-|
|[SDKs](speech-sdk.md)|Yes|No|Yes|Libraries for specific programming languages that simplify development.|
|[REST](rest-apis.md)|Yes|Yes|No|A simple HTTP-based API that makes it easy to add speech to your application.|

* The [Speech to Text](speech-to-text.md) (STT), or speech recognition, API transcribes audio streams into text that your application can accept as input. 

* The [Text to Speech](text-to-speech.md) (TTS), or speech synthesis, API converts plain text to natural-sounding speech, delivered to your application in an audio file. Multiple voices, varying in gender or accent, are available for many supported languages.

* The [Speech Translation](speech-translation.md) API can be used either to translate streaming audio in near-real-time or to process recorded speech. 

* With the introduction of the unified Speech service, Microsoft and its partners offer an integrated hardware/software platform optimized for developing speech-enabled devices: the [Speech Devices SDK](speech-devices-sdk.md). 

## Next steps

Get a free trial subscription key for the Speech service.

> [!div class="nextstepaction"]
> [Try the Speech service for free](get-started.md)
