---
title: Speech Recognition with Azure Speech Services
titleSuffix: Azure Cognitive Services
description: The Speech-to-Text API transcribes audio streams into text that your app can display or act on as an input. The service is available via the SDK and a RESTful endpoint.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/29/2019
ms.author: erhopf
ms.custom: seodec18
---

# What is speech recognition?

Speech recognition from Azure Speech Services (speech-to-text), transcribes audio streams in real time to text that your applications, tools, or devices can consume, display, and act on. It's powered by Microsoft's recognition technology used in Cortana and Office products.

Speech recognition is available through the Speech SDK and REST APIs.

> [!IMPORTANT]
> Batch transcription is only available via REST and requires an S0 subscription. Batch transcription will not work with the an Azure free trial.

## Core features

| Use case | SDK | REST |
|----------|-----|------|
| Transcribe short utterances, less than 15 seconds in length. Final results only. | Yes | Yes |
| Continuous transcription of long utterances, more than 15 seconds in length. | Yes | No |
| Transcribe streaming audio with optional interim results | Yes | No |
| Derive intents from recognition results with [LUIS](https://docs.microsoft.com/azure/cognitive-services/luis/what-is-luis). | Yes | No\* |
| Run batch transcription on large volumes of audio data. | No | Yes |
| Create accuracy tests to measure the accuracy of baseline versus custom model. | No | Yes |
| Upload datasets for model customization and adaptation. | No | Yes |
| Create and manage speech models. | No | Yes |
| Create and manage custom model deployments. | No | Yes |
| Manage subscriptions. | No | Yes |

\* *LUIS intents and entities can be derived using a separate LUIS subscription. With this subscription, the SDK can call LUIS for you and provide entity and intent results as well as speech transcriptions. With the REST API, you can call LUIS yourself to derive intents and entities with your LUIS subscription.*

## Get started with speech recognition

We offer quickstarts in most popular programming languages, each designed to have you running code in less than 10 minutes. This table includes a complete list of Speech SDK quickstarts organized by language.

| Quickstart | Platform | API reference |
|------------|----------|---------------|
| [C#, .NET Core](https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstart-csharp-dotnetcore-windows) | Windows | [Browse](https://aka.ms/csspeech/csharpref) |
| [C#, .NET Framework](https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstart-csharp-dotnet-windows) | Windows | [Browse](https://aka.ms/csspeech/csharpref) |
| [C#, UWP](https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstart-csharp-uwp) | Windows | [Browse](https://aka.ms/csspeech/csharpref) |
| [C++](https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstart-cpp-windows) | Windows | [Browse](https://aka.ms/csspeech/cppref)|
| [C++](https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstart-cpp-linux) | Linux | [Browse](https://aka.ms/csspeech/cppref) |
| [Java](https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstart-java-android) | Android | [Browse](https://aka.ms/csspeech/javaref) |
| [Java](https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstart-java-jre) | Windows, Linux | [Browse](https://aka.ms/csspeech/javaref) |
| [Javascript, Browser](https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstart-js-browser) | Browser, Windows, Linux, macOS | [Browse](https://aka.ms/AA434tv) |
| [Javascript, Node.js](https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstart-js-node) | Windows, Linux, macOS | [Browse](https://aka.ms/AA434tv) |
| [Objective-C](https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstart-objectivec-ios) | iOS | [Browse](https://aka.ms/csspeech/objectivecref) |
| [Python](https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstart-python) | Windows, Linux, macOS | [Browse](https://aka.ms/AA434tr)  |

If you prefer to use the speech-to-text REST service, see [REST APIs](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis).

## Tutorials and sample code

After you've had a chance to use the Speech Services, try our tutorial that teaches you how to recognize intents from speech using the Speech SDK and LUIS.

* [Tutorial: Recognize intents from speech with the Speech SDK and LUIS, C#](how-to-recognize-intents-from-speech-csharp.md)

Sample code for the Speech SDK is available on GitHub. These samples cover common scenarios like reading audio from a file or stream, continuous and single-shot recognition, and working with custom models.

* [Speech Recognition and Translation samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)

## Customization

## Migration guides

## Sample code and API reference

# About the Speech to Text API

The **Speech to Text** API *transcribes* audio streams into text that your application can display to the user or act upon as command input. The APIs can be used either with an SDK client library (for supported platforms and languages) or a REST API.

The **Speech to Text** API offers the following features:

- Advanced speech recognition technology from Microsoft—the same used by Cortana, Office, and other Microsoft products.

- Real-time continuous recognition. **Speech to Text** allows users to transcribe audio into text in real time. It also supports receiving intermediate results of the words that have been recognized so far. The service automatically recognizes the end of speech. Users can also choose additional formatting options, including capitalization and punctuation, profanity masking, and inverse text normalization.

- Results returned in both Lexical and Display forms (for Lexical results, see DetailedSpeechRecognitionResult in the examples or API).

- Support for many spoken languages and dialects. For the full list of supported languages in each recognition mode, see [Supported languages](language-support.md#speech-to-text).

- Customized language and acoustic models, so you can tailor your application to your users' specialized domain vocabulary, speaking environment and way of speaking.

- Natural-language understanding. Through integration with [Language Understanding](https://docs.microsoft.com/azure/cognitive-services/luis/) (LUIS), you can derive intents and entities from speech. Users don't have to know your app's vocabulary, but can describe what they want in their own words.

- Confidence score is returned back from the service if you specify a detailed output on the speech configuration object (SpeechConfig.OutputFormat property). Then you can use either Best() method on the result or get it the score directly from JSON returned from the service (something like result.Properties.GetProperty(PropertyId.SpeechServiceResponse_JsonResult)).

## API capabilities

Some of the capabilities of the **Speech to Text** API, especially around customization, are available via REST. The following table summarizes the capabilities of each method of accessing the API. For a full list of capabilities and API details, see [Swagger reference](https://westus.cris.ai/swagger/ui/index).

| Use case | REST | SDKs |
|-----|-----|-----|----|
| Transcribe a short utterance, such as a command (length < 15 s); no interim results | Yes | Yes |
| Transcribe a longer utterance (> 15 s) | No | Yes |
| Transcribe streaming audio with optional interim results | No | Yes |
| Understand speaker intents via LUIS | No\* | Yes |
| Create Accuracy Tests | Yes | No |
| Upload datasets for model adaptation | Yes | No |
| Create & manage speech models | Yes | No |
| Create & manage model deployments | Yes | No |
| Manage Subscriptions | Yes | No |
| Create & manage model deployments | Yes | No |
| Create & manage model deployments | Yes | No |

> [!NOTE]
> The REST API implements throttling that limits the API requests to 25 per 5 second. Message headers will inform of the limits

\* *LUIS intents and entities can be derived using a separate LUIS subscription. With this subscription, the SDK can call LUIS for you and provide entity and intent results as well as speech transcriptions. With the REST API, you can call LUIS yourself to derive intents and entities with your LUIS subscription.*

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [Quickstart: recognize speech in C#](quickstart-csharp-dotnet-windows.md)
* [See how to recognize intents from speech in C#](how-to-recognize-intents-from-speech-csharp.md)
