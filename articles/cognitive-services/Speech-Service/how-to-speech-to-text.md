---
title: Use Speech to Text
description: Learn how to use Speech to Text in the Speech service
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 07/16/2018
ms.author: v-jerkin
---
# Use "Speech to Text" in the Speech service

You can use **Speech to Text** in your applications in two different ways.

| Method | Description |
|-|-|
| [SDK](speech-sdk.md) | Simplest method for C/C++, C#, and Java developers |
| [REST](rest-apis.md) | Recognize short utterances using an HTTP POST request | 

## Using the SDK

The [Speech SDK](speech-sdk.md) provides the simplest way to use **Speech to Text** in your application with full functionality.

1. Create a speech factory, providing a Speech service subscription key and [region](regions.md) or an authorization token. You can also configure options, such as the recognition language or a custom endpoint for your own speech recognition models, at this point.

2. Get a recognizer from the factory. Three different types of recognizers are available. Each recognizer type can use your device's default microphone, an audio stream, or audio from a file.

    Recognizer | Function
    -|-
    Speech recognizer|Provides text transcription of speech
    Intent recognizer|Derives speaker intent via [LUIS](https://docs.microsoft.com/azure/cognitive-services/luis/) after recognition\*
    Translation recognizer|Translates the transcribed text to another language (see [Speech Translation](how-to-translate-speech.md))

    \* *For intent recognition, you need to use a separate LUIS subscription key when creating a speech factory for the intent recognizer.*
    
4. Tie up the events for asynchronous operation, if desired. The recognizer then calls your event handlers when it has interim and final results. Otherwise, your application will receive a final transcription result.

5. Start recognition.
   For single-shot recognition, like command or query recognition, use `RecognizeAsync()`, which returns the first utterance being recognized.
   For long-running recognition, like transcription, use `StartContinuousRecognitionAsync()` and tie up the events for asynchronous recognition results.

### SDK samples

For the latest set of samples, see the [Cognitive Services Speech SDK Sample GitHub repository](https://aka.ms/csspeech/samples).

## Using the REST API

The REST API is the simplest way to recognize speech if you are not using a language supported by the SDK. You make an HTTP POST request to the service endpoint, passing the entire utterance in the body of the request. You receive a response containing the recognized text.

> [!NOTE]
> Utterances are limited to 15 seconds or less when using the REST API.

For more information on the **Speech to Text** REST API, see [REST APIs](rest-apis.md#speech-to-text). To see it in action, download the [REST API samples](https://github.com/Azure-Samples/SpeechToText-REST) from GitHub.

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
- [How to recognize speech in C++](quickstart-cpp-windows.md)
- [How to recognize speech in C#](quickstart-csharp-dotnet-windows.md)
- [How to recognize speech in Java](quickstart-java-android.md)
