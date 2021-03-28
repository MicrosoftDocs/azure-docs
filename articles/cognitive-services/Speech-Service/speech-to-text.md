---
title: Speech-to-text overview - Speech service
titleSuffix: Azure Cognitive Services
description: Speech-to-text software enables real-time transcription of audio streams into text. Your applications, tools, or devices can consume, display, and take action on this text input. This article is an overview of the benefits and capabilities of the speech-to-text service.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 09/01/2020
ms.author: trbye
ms.custom: cog-serv-seo-aug-2020
keywords: speech to text, speech to text software
---

# What is speech-to-text?

In this overview, you learn about the benefits and capabilities of the speech-to-text service.
Speech-to-text, also known as speech recognition, enables real-time transcription of audio streams into text. Your applications, tools, or devices can consume, display, and take action on this text as command input. This service is powered by the same recognition technology that Microsoft uses for Cortana and Office products. It seamlessly works with the <a href="./speech-translation.md" target="_blank">translation </a> and <a href="./text-to-speech.md" target="_blank">text-to-speech </a> service offerings. For a full list of available speech-to-text languages, see [supported languages](language-support.md#speech-to-text).

The speech-to-text service defaults to using the Universal language model. This model was trained using Microsoft-owned data and is deployed in the cloud. It's optimal for conversational and dictation scenarios. When using speech-to-text for recognition and transcription in a unique environment, you can create and train custom acoustic, language, and pronunciation models. Customization is helpful for addressing ambient noise or industry-specific vocabulary.

With additional reference text as input, speech-to-text service also enables [pronunciation assessment](rest-speech-to-text.md#pronunciation-assessment-parameters) capability to evaluate speech pronunciation and gives speakers feedback on the accuracy and fluency of spoken audio. With pronunciation assessment, language learners can practice, get instant feedback, and improve their pronunciation so that they can speak and present with confidence. Educators can use the capability to evaluate pronunciation of multiple speakers in real-time. The feature currently supports US English, and correlates highly with speech assessments conducted by experts.

> [!NOTE]
> Bing Speech was decommissioned on October 15, 2019. If your applications, tools, or products are using the Bing Speech APIs, we've created guides to help you migrate to the Speech service.
> - [Migrate from Bing Speech to the Speech service](how-to-migrate-from-bing-speech.md)

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

## Get started

See the [quickstart](get-started-speech-to-text.md) to get started with speech-to-text. The service is available via the [Speech SDK](speech-sdk.md), the [REST API](rest-speech-to-text.md#pronunciation-assessment-parameters), and the [Speech CLI](spx-overview.md).

## Sample code

Sample code for the Speech SDK is available on GitHub. These samples cover common scenarios like reading audio from a file or stream, continuous and single-shot recognition, and working with custom models.

- [Speech-to-text samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
- [Batch transcription samples (REST)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch)
- [Pronunciation assessment samples (REST)](rest-speech-to-text.md#pronunciation-assessment-parameters)

## Customization

In addition to the standard Speech service model, you can create custom models. Customization helps to overcome speech recognition barriers such as speaking style, vocabulary and background noise, see [Custom Speech](./custom-speech-overview.md). Customization options vary by language/locale, see [supported languages](./language-support.md) to verify support.

## Batch transcription

Batch transcription is a set of REST API operations that enable you to transcribe a large amount of audio in storage. You can point to audio files with a shared access signature (SAS) URI and asynchronously receive transcription results. See the [how-to](batch-transcription.md) for more information on how to use the batch transcription API.

[!INCLUDE [speech-reference-doc-links](includes/speech-reference-doc-links.md)]

## Next steps

- [Get a Speech service subscription key for free](overview.md#try-the-speech-service-for-free)
- [Get the Speech SDK](speech-sdk.md)