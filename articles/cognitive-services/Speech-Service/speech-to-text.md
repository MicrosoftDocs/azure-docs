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

< TODO ERIK - Provide introduction >

| Use case | SDK | REST |
|----------|-----|------|
| Transcribe short utterances, less than 15 seconds in length. Final results only. | Yes | Yes |
| Continuous transcription of long utterances, more than 15 seconds in length. | Yes | No |
| Transcribe streaming audio with optional interim results | Yes | No |
| Derive intents from recognition results with [LUIS](https://docs.microsoft.com/azure/cognitive-services/luis/what-is-luis). | Yes | No\* |
| Run batch transcription on large volumes of audio data. | No | Yes\** |
| Create accuracy tests to measure the accuracy of baseline versus custom models. | No | Yes\** |
| Upload datasets for model customization and adaptation. | No | Yes\** |
| Create and manage speech models. | No | Yes\** |
| Create and manage custom model deployments. | No | Yes\** |
| Manage subscriptions. | No | Yes\** |

\* *LUIS intents and entities can be derived using a separate LUIS subscription. With this subscription, the SDK can call LUIS for you and provide entity and intent results as well as speech transcriptions. With the REST API, you can call LUIS yourself to derive intents and entities with your LUIS subscription.*

\** *The services are avaialbe using the cris.ai endpoint. For more information, see [Swagger reference](https://westus.cris.ai/swagger/ui/index).*

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

* [Speech recognition samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)

## Customization

In addition to the baseline models available for speech recognition, you can create custom acoustic, language, and pronunciation models.

| Model | Description |
|----------------|-------|-------------|
| [Acoustic model](how-to-customize-acoustic-models.md) | Creating a custom acoustic model is helpful if your application, tools, or devices are used in a particular environment, like a car or factory floor, with specific recording conditions. Examples involve accented speech, specific background noises, or using a specific microphone for recording. |
| [Language model](how-to-customize-language-model.md) | Create a custom language model to improve transcription of field-specific vocabulary and grammar, such as medical terminology, or IT jargon. |
| [Pronunciation model](how-to-customize-pronunciation.md) | With a custom pronunciation model, you can define the phonetic form and display of a word or term. It's useful for handling customized terms, such as product names or acronyms. All you need to get started is a pronunciation file -- a simple .txt file. |

Customization options vary by language.

[!INCLUDE [Customization options for supported languages](../../../includes/cognitive-services-speech-service-stt-language-list.md)]

## Migration guides

< Add info for migration from shut down services. >

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [Quickstart: recognize speech in C#](quickstart-csharp-dotnet-windows.md)
* [See how to recognize intents from speech in C#](how-to-recognize-intents-from-speech-csharp.md)
