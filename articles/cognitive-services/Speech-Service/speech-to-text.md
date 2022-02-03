---
title: Speech-to-text overview - Speech service
titleSuffix: Azure Cognitive Services
description: Get an overview of the benefits and capabilities of the speech-to-text feature of the Speech Service.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/16/2022
ms.author: eur
ms.custom: cog-serv-seo-aug-2020
keywords: speech to text, speech to text software
---

# What is speech-to-text?

In this overview, you learn about the benefits and capabilities of the speech-to-text feature of the Speech service, which is part of Azure Cognitive Services.

Speech-to-text, also known as speech recognition, enables real-time transcription of audio streams into text. Your applications, tools, or devices can consume, display, and take action on this text as command input. 

This feature uses the same recognition technology that Microsoft uses for Cortana and Office products. It seamlessly works with the <a href="./speech-translation.md" target="_blank">translation </a> and <a href="./text-to-speech.md" target="_blank">text-to-speech </a> offerings of the Speech service. For a full list of available speech-to-text languages, see [Language and voice support for the Speech service](language-support.md#speech-to-text).

The speech-to-text feature defaults to using the Universal Language Model. This model was trained through Microsoft-owned data and is deployed in the cloud. It's optimal for conversational and dictation scenarios. 

When you're using speech-to-text for recognition and transcription in a unique environment, you can create and train custom acoustic, language, and pronunciation models. Customization is helpful for addressing ambient noise or industry-specific vocabulary.

> [!NOTE]
> Bing Speech was decommissioned on October 15, 2019. If your applications, tools, or products are using the Bing Speech APIs, see [Migrate from Bing Speech to the Speech service](how-to-migrate-from-bing-speech.md).

## Get started

To get started with speech-to-text, see the [quickstart](get-started-speech-to-text.md). Speech-to-text is available via the [Speech SDK](speech-sdk.md), the [REST API](rest-speech-to-text.md#pronunciation-assessment-parameters), and the [Speech CLI](spx-overview.md).

## Sample code

Sample code for the Speech SDK is available on GitHub. These samples cover common scenarios like reading audio from a file or stream, continuous and at-start recognition, and working with custom models:

- [Speech-to-text samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
- [Batch transcription samples (REST)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch)
- [Pronunciation assessment samples (REST)](rest-speech-to-text.md#pronunciation-assessment-parameters)

## Customization

In addition to the standard Speech service model, you can create custom models. Customization helps to overcome speech recognition barriers such as speaking style, vocabulary, and background noise. For more information, see [Custom Speech](./custom-speech-overview.md). 

Customization options vary by language or locale. To verify support, see [Language and voice support for the Speech service](./language-support.md).

## Batch transcription

Batch transcription is a set of REST API operations that enable you to transcribe a large amount of audio in storage. You can point to audio files with a shared access signature (SAS) URI and asynchronously receive transcription results. For more information on how to use the batch transcription API, see [How to use batch transcription](batch-transcription.md).

## Reference docs

The [Speech SDK](speech-sdk.md) provides most of the functionalities that you need to interact with the Speech service. For scenarios such as model development and batch transcription, you can use the REST API.

### Speech SDK reference docs

Use the following list to find the appropriate Speech SDK reference docs:

- <a href="https://aka.ms/csspeech/csharpref" target="_blank" rel="noopener">C# SDK </a>
- <a href="https://aka.ms/csspeech/cppref" target="_blank" rel="noopener">C++ SDK </a>
- <a href="https://aka.ms/csspeech/javaref" target="_blank" rel="noopener">Java SDK </a>
- <a href="https://aka.ms/csspeech/pythonref" target="_blank" rel="noopener">Python SDK</a>
- <a href="https://aka.ms/csspeech/javascriptref" target="_blank" rel="noopener">JavaScript SDK</a>
- <a href="https://aka.ms/csspeech/objectivecref" target="_blank" rel="noopener">Objective-C SDK </a>

> [!TIP]
> The Speech service SDK is actively maintained and updated. To track changes, updates, and feature additions, see the [Speech SDK release notes](releasenotes.md).

### REST API references

For speech-to-text REST APIs, see the following resources:

- [REST API: Speech-to-text](rest-speech-to-text.md)
- [REST API: Pronunciation assessment](rest-speech-to-text.md#pronunciation-assessment-parameters)
- <a href="https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0" target="_blank" rel="noopener">REST API: Batch transcription and customization </a>

## Next steps

- [Get a Speech service subscription key for free](overview.md#try-the-speech-service-for-free)
- [Get the Speech SDK](speech-sdk.md)
