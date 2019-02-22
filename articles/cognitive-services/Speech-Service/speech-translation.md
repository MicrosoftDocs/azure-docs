---
title: About Speech Translation - Speech Services
titlesuffix: Azure Cognitive Services
description: The Speech Service API lets you add end-to-end, real-time, multi-language translation of speech to your applications, tools, and devices. The same API can be used for both speech-to-speech and speech-to-text translation.
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

# What is speech translation?

Speech translation from Azure Speech Services, enables real-time, multi-language speech-to-speech and speech-to-text translation of audio streams. With the Speech SDK, your applications, tools, and devices have access to source transcriptions and translation outputs for provided audio. Interim transcription and translation results are returned as speech is detected, and finals results can be converted into synthesized speech.

Microsoft's translation engine is powered by two different approaches: statistical machine translation (SMT) and neural machine translation (NMT). SMT uses advanced statistical analysis to estimate the best possible translations given the context of a few words. With NMT, neural networks are used to provide more accurate, fluent and natural-sounding translations by using the full context of sentences to translate words.

Today, Microsoft uses NMT for most popular languages. All [languages available for speech-to-speech translation](language-support.md#speech-translation) are powered by NMT. Speech-to-text translation may use SMT or NMT depending on the language pair. If the target language is supported by NMT, the full translation is NMT-powered. If the target language isn't supported by NMT, the translation is a hybrid of NMT and SMT, using English as a "pivot" between the two languages.

## Core features

Here are the features available via the Speech SDK and REST APIs:

| Use case | SDK | REST |
|----------|-----|------|

## Get started with speech translation

We offer quickstarts designed to have you running code in less than 10 minutes. This table includes a list of speech translation quickstarts organized by language.

| Quickstart | Platform | API reference |
|------------|----------|---------------|

## Sample code

## Migration guides

> [!WARNING]
> Bing Speech will be decommissioned on October 15, 2019.

If your applications, tools, or products are using Translator Speech, we've created guides to help you migrate to Speech Services.

* [Migrate from the Translator Speech API to the Speech Service](how-to-migrate-from-translator-speech-api.md)

## Next steps

* [Get a Speech Services subscription key for free](get-started.md)
* [Get the Speech SDK](speech-sdk.md)
