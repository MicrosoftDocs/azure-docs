---
title: Speech translation overview - Speech service
titleSuffix: Azure Cognitive Services
description: With speech translation, you can add end-to-end, real-time, multi-language translation of speech to your applications, tools, and devices.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: overview
ms.date: 01/16/2022
ms.author: eur
ms.custom: devx-track-csharp, cog-serv-seo-aug-2020
keywords: speech translation
---

# What is speech translation?

In this article, you learn about the benefits and capabilities of the speech translation service, which enables real-time, multi-language speech-to-speech and speech-to-text translation of audio streams. By using the Speech SDK, you can give your applications, tools, and devices access to source transcriptions and translation outputs for the provided audio. Interim transcription and translation results are returned as speech is detected, and the final results can be converted into synthesized speech.

For a list of languages that the Speech Translation API supports, see the "Speech translation" section of [Language and voice support for the Speech service](language-support.md#speech-translation).

## Core features

* Speech-to-text translation with recognition results.
* Speech-to-speech translation.
* Support for translation to multiple target languages.
* Interim recognition and translation results.

## Before you begin 

As your first step, see [Get started with speech translation](get-started-speech-translation.md). The speech translation service is available via the [Speech SDK](speech-sdk.md) and the [Speech CLI](spx-overview.md).

## Sample code

You'll find [Speech SDK speech-to-text and translation samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk) on GitHub. These samples cover common scenarios, such as reading audio from a file or stream, continuous and single-shot recognition and translation, and working with custom models.

## Migration guides

If your applications, tools, or products are using the [Translator Speech API](./how-to-migrate-from-translator-speech-api.md), see [Migrate from the Translator Speech API to Speech service](how-to-migrate-from-translator-speech-api.md).

## Reference docs

* [Speech SDK](./speech-sdk.md)
* [REST API: Speech-to-text](rest-speech-to-text.md)
* [REST API: Text-to-speech](rest-text-to-speech.md)
* [REST API: Batch transcription and customization](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0)

## Next steps

* Complete the [speech translation quickstart](get-started-speech-translation.md)
* Get the [Speech SDK](speech-sdk.md)
