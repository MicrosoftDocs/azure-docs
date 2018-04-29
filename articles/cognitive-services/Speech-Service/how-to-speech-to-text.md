---
title: How to use Speech to Text | Microsoft Docs
description: How to use Speech to Text in the Speech service.
services: cognitive-services
author: v-jerkin
manager: wolfma

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 03/22/2018
ms.author: v-jerkin
---
# How to use Speech to Text

You can use Speech to Text in your applications in three different ways.

| Method | Description |
|-|-|
| SDK | Simplest method for C/C++, C#, and Java developers |
| REST | Recognize short utterances using an HTTP POST request | 
| WebSockets | Allows recognition of long, streaming utterances from any language |

## Using the SDK

The [Speech SDK](speech-sdk.md) provides the simplest way to use Speech to Text in your application. The SDK gives you full functionality, with the limitations of the REST or WebSockets methods. The basic process is as follows.

1. Create a speech factory by providing a Speech service subscription key or an authorization token. You can also configure options, such as the recognition language, at this point.

2. Get a recognizer from the factory. Three different types of recognizers are available. Each type can use your device's default microphone, an audio stream, or audio from a file.

Recognizer | Function
-|-
Speech recognizer|Provides text transcription of speech
Intent recognizer|Derives speaker intent via [LUIS](https://docs.microsoft.com/azure/cognitive-services/luis/) after recognition
Translation recognizer|Translates the transcribed text to another language

4. Hook up events for asynchronous operation, if desired. The recognizer will then call your event handlers when it has interim and final results.

* Start recognition.

### SDK samples

You can download code samples demonstrating the use of the SDK using the links below.

- [Download samples for Windows](https://aka.ms/csspeech/winsample)
- [Download samples for Linux](https://aka.ms/csspeech/linuxsample)

## Using the REST API

The REST API is the simplest way to recognize speech if you are not using a language supported by the SDK. You make an HTTP POST request to the service endpoint, passing the entire utterance in the body of the request. You receive a response containing the recognized text.

> [!NOTE]
> Utterances are limited to 15 seconds or less when using the REST API.

For more information on the Speech to Text REST API, see [REST APIs](rest-apis.md#speech-to-text). To see it in action, download the [REST API samples](https://github.com/Azure-Samples/SpeechToTeext-REST) from GitHub.

## Using the WebSockets API

The WebSockets API is the most flexible way to work with Speech to Text if you are not using a language supported by the Speech SDK. You must, however, build all the "plumbing" yourself, including the following tasks.

* Get the audio from some source, such as microphone or a file
* Transmit the audio to the Speech to Text endpoint
* Deal with the interim and final results returned by the Speech service

See [WebSockets protocols](websockets.md#speech-to-text) for more information on the Speech to Text WebSockets API. To see it in action, download the [WebSockets API samples](https://github.com/Azure-Samples/SpeechToTeext-REST) from GitHub.
