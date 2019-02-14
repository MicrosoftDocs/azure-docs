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

These features comprise Azure Speech Services. Use the links in this table to learn more about common use cases for each feature or browse the API reference.

| Feature | Description | SDK | REST |
|---------|-------------|-----|------|
| [Speech Recognition](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-to-text) | Speech recognition, or speech-to-text, transcribes audio streams in real-time into text that your applications, tools, or devices can display. Use speech recognition with [Language Understanding (LUIS)](https://docs.microsoft.com/azure/cognitive-services/luis/) to derive user intents from transcribed speech and act on voice commands. | [Yes](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) | [Yes](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis) |
| [Speech Translation](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-translation) | Speech translation enables end-to-end, real-time, multi-language translation of speech to your applications, tools, and devices. Use this service for speech-to-speech and speech-to-text translation. | [Yes](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk-reference) | No |
| [Speech Synthesis](https://docs.microsoft.com/azure/cognitive-services/speech-service/text-to-speech) | Speech synthesis, or text-to-speech, converts input text into human-like speech. This service offers more than 75 voices in more than 45 languages and locales with multi-gender support. Choose from standard or neural voices, which are indistinguishable from human speech, or create a custom voice unique to your product or brand. | No | [Yes](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis) |
| [Batch Transcription](https://docs.microsoft.com/azure/cognitive-services/speech-service/batch-transcription) | Batch transcription enables asynchronous speech-to-text transcription. This service is only available via REST. | No | [Yes](https://westus.cris.ai/swagger/ui/index) |

## News and updates

Learn what's new with the Azure Speech Services.

* December 2018 - Released Speech SDK 1.2.0 with support for [Python](quickstart-python.md) and [Node.js](quickstart-js-node.md), as well as Ubuntu 18.04 LTS. For more information, see [Release notes](releasenotes.md).
* December 2018 - Speech synthesis quickstarts added for [.NET Core](quickstart-dotnet-text-to-speech.md), [Python](quickstart-python-text-to-speech.md), [Node.js](quickstart-nodejs-text-to-speech.md). Additional samples are available on [GitHub](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/Samples-Http).
* November 2018 - Released Speech SDK 1.1.0 with support for Android x86/64. It also adds imporved error messaging. For a complete list of enhancements and known issues, see [Release notes](https://docs.microsoft.com/azure/cognitive-services/speech-service/releasenotes#speech-sdk-110).

## Try Speech Services

We offer quickstarts in most popular programming languages, each designed to have you running code in less than 10 minutes. This table contains the most popular quickstarts for each feature. Use the left-hand navigation to explore additional languages and platforms.

| Recognition (SDK) | Translation (SDK) | Synthesis (REST) |
|-------------------|-------------------|------------------|
| C#, .NET Core (Windows) | Java (Windows, Linux) | Python (Windows, Linux, macOS) |
| Javascript (Browser) | C#, .NET Core (Windows) | C#, .NET Core (Windows, Linux, macOS) |
| Python (Windows, Linux, macOS) | C#, .NET Framework (Windows) | Node.js (Windows, Linux, macOS) |
| Java (Windows, Linux) | C++ (Windows) | |

## Sample code and tutorials

<< Links to sample code on GitHub >>

## Customization

<< THIS NEEDS TO BE REWRITTEN >>

You can use your own data to train the models that underlie the Speech service's Speech-to-Text and Text-to-Speech features.

|Feature|Model|Purpose|
|-|-|-|
|Speech-to-text|[Acoustic model](how-to-customize-acoustic-models.md)|Helps transcribe particular speakers and environments, such as cars or factories.|
||[Language model](how-to-customize-language-model.md)|Helps transcribe field-specific vocabulary and grammar, such as medical or IT jargon.|
||[Pronunciation model](how-to-customize-pronunciation.md)|Helps transcribe abbreviations and acronyms, such as "IOU" for "I owe you." |
|Text-to-speech|[Voice font](how-to-customize-voice-font.md)|Gives your app a voice of its own by training the model on samples of human speech.|

You can use your custom models anywhere you use the standard models in your app's Speech-to-Text or Text-to-Speech functionality.


### Speech Devices SDK

<< WHERE DOES THIS BELONG? >>

The [Speech Devices SDK](speech-devices-sdk.md) is an integrated hardware and software platform for developers of speech-enabled devices. Our hardware partner provides reference designs and development units. Microsoft provides a device-optimized SDK that takes full advantage of the hardware's capabilities.


## Next steps

Get a subscription key for the Speech Services.

> [!div class="nextstepaction"]
> [Try the Speech Services for free](get-started.md)
