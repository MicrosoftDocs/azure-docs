---
title: What are the Azure Speech Services?
titleSuffix: Azure Cognitive Services
description: The Azure Speech Services are the unification of speech recognition, speech translation, and speech synthesis into a single Azure subscription. It's easy to add speech your applications, tools, and devices with the Speech SDK, Speech Devices SDK, or REST APIs. Add speech functionality to an existing chat bot, convert text-to-speech in a translation application, or transcribe large volumes of call center data.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: overview
ms.date: 03/29/2019
ms.author: erhopf
---

# What are the Speech Services?

Azure Speech Services are the unification of speech recognition, speech translation, and speech synthesis into a single Azure subscription. It's easy to speech enable your applications, tools, and devices with the [Speech SDK](speech-sdk-reference.md), [Speech Devices SDK](speech-devices-sdk-qsg.md), or [REST APIs](rest-apis.md).

> [!IMPORTANT]
> Speech Services have replaced Bing Speech API, Translator Speech, and Custom Voice. See *How-to guides > Migrate* for migration instructions.

These features make up the Azure Speech Services. Use the links in this table to learn more about common use cases for each feature or browse the API reference.

| Feature | Description | SDK | REST |
|---------|-------------|-----|------|
| [Speech Recognition](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-to-text) | Speech recognition, or speech-to-text, transcribes audio streams in real time to text that your applications, tools, or devices can consume or display. Use speech recognition with [Language Understanding (LUIS)](https://docs.microsoft.com/azure/cognitive-services/luis/) to derive user intents from transcribed speech and act on voice commands. | [Yes](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) | [Yes](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis) |
| [Speech Translation](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-translation) | Speech translation enables real-time, multi-language translation of speech to your applications, tools, and devices. Use this service for speech-to-speech and speech-to-text translation. | [Yes](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) | No |
| [Speech Synthesis](https://docs.microsoft.com/azure/cognitive-services/speech-service/text-to-speech) | Speech synthesis, or text-to-speech, converts input text into human-like speech. This service offers more than 75 voices in more than 45 languages and locales with multi-gender support. Choose from standard and neural voices, or create a custom voice unique to your product or brand. | No | [Yes](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis) |
| [Batch Transcription](https://docs.microsoft.com/azure/cognitive-services/speech-service/batch-transcription) | Batch transcription enables asynchronous speech-to-text transcription. This service is only available via REST. | No | [Yes](https://westus.cris.ai/swagger/ui/index) |

## News and updates

Learn what's new with the Azure Speech Services.

* December 2018 - Released Speech SDK 1.2.0 with support for [Python](quickstart-python.md) and [Node.js](quickstart-js-node.md), as well as Ubuntu 18.04 LTS. For more information, see [Release notes](releasenotes.md).
* December 2018 - Speech synthesis quickstarts added for [.NET Core](quickstart-dotnet-text-to-speech.md), [Python](quickstart-python-text-to-speech.md), [Node.js](quickstart-nodejs-text-to-speech.md). Additional samples are available on [GitHub](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/Samples-Http).
* November 2018 - Released Speech SDK 1.1.0 with support for Android x86/64. It also adds improved error messaging. For a complete list of enhancements and known issues, see [Release notes](https://docs.microsoft.com/azure/cognitive-services/speech-service/releasenotes#speech-sdk-110).

## Try Speech Services

We offer quickstarts in most popular programming languages, each designed to have you running code in less than 10 minutes. This table contains the most popular quickstarts for each feature. Use the left-hand navigation to explore additional languages and platforms.

| Recognition (SDK) | Translation (SDK) | Synthesis (REST) |
|-------------------|-------------------|------------------|
| [C#, .NET Core (Windows)](quickstart-csharp-dotnet-windows.md) | [Java (Windows, Linux)](quickstart-translate-speech-java-jre.md) | [Python (Windows, Linux, macOS)](quickstart-python-text-to-speech.md) |
| [Javascript (Browser)](quickstart-js-browser.md) | [C#, .NET Core (Windows)](quickstart-translate-speech-dotnetcore-windows.md) | [C#, .NET Core (Windows, Linux, macOS)](quickstart-dotnet-text-to-speech.md) |
| [Python (Windows, Linux, macOS)](quickstart-python.md) | [C#, .NET Framework (Windows)](quickstart-translate-speech-dotnetframework-windows.md) | [Node.js (Windows, Linux, macOS)](quickstart-nodejs-text-to-speech.md) |
| [Java (Windows, Linux)](quickstart-java-jre.md) | [C++ (Windows)](quickstart-translate-speech-cpp-windows.md) | |

After you've had a chance to use the Speech Services, try our tutorial that teaches you how to recognize intents from speech using the Speech SDK and LUIS.

* [Tutorial: Recognize intents from speech with the Speech SDK and LUIS, C#](how-to-recognize-intents-from-speech-csharp.md)

## Get sample code

Sample code is available on GitHub for each of the Azure Speech Services. These samples cover common scenarios like reading audio from a file or stream, continuous and single-shot recognition, and working with custom models. Use these links to view SDK and REST samples:

* [Speech Recognition and Translation samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
* [Speech Synthesis samples (REST)](https://github.com/Azure-Samples/Cognitive-Speech-TTS)

## Customize your speech experience

Azure Speech Services works well with built-in models, however, you may want to further customize and tune the experience for your product or environment. Customization options range from acoustic model tuning to unique voice fonts for your brand. After you've built a custom model, you can use it with any of the Azure Speech Services.

| Speech Service | Model | Description |
|----------------|-------|-------------|
| Speech Recognition | [Acoustic model](how-to-customize-acoustic-models.md) | Creating a custom acoustic model is helpful if your applications, tools, or devices are used in a particular environments like in a car or on a factory floor, each with specific recording conditions. Examples include accented speech, specific background noises, or using a specific microphone for recording. |
| | [Language model](how-to-customize-language-model.md) | Create a custom language model to improve transcription of field-specific vocabulary and grammar, such as medical terminology, or IT jargon. |
| | [Pronunciation model](how-to-customize-pronunciation.md) | With a custom pronunciation model, you can define the phonetic form and display of a word or term. It's useful for handling customized terms, such as product names or acronyms. All you need to get started is a pronunciation file -- a simple .txt file. |
| Speech Synthesis | [Voice font](how-to-customize-voice-font.md) | Custom voice fonts allow you to create a recognizable, one-of-a-kind voice for your brand. It only takes a small amount of data to get started. The more data that you provide, the more natural and human-like your voice font will sound. |

## Reference docs

* [Speech SDK](speech-sdk-reference.md)
* [Speech Devices SDK](speech-devices-sdk.md)
* [Speech recognition and synthesis REST APIs](rest-apis.md)
* [Batch transcription and customization REST APIs](https://westus.cris.ai/swagger/ui/index)

## Next steps

> [!div class="nextstepaction"]
> [Get a Speech Services subscription key for free](get-started.md)
