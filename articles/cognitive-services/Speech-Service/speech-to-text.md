---
title: About Speech to Text | Microsoft Docs
description: An overview of the capabilities of Speech to Text.
services: cognitive-services
author: v-jerkin
manager: wolfma

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 03/22/2018
ms.author: v-jerkin
---
# About Speech to Text

The Speech to Text API *transcribes* audio streams into text that your application can display to the user or act upon as command input. The APIs can be used either with an SDK client library (for supported platforms and languages) or a REST or WebSockets API.

The Speech to Text API offers the following features:

- Advanced speech recognition technology from Microsoft—the same used by Cortana, Office, and other Microsoft products.

- Real-time continuous recognition. Speech to Text allows users to transcribe audio into text in real time. It also supports receiving intermediate results of the words that have been recognized so far. The service automatically recognizes the end of speech. Users can also choose additional formatting options, including capitalization and punctuation, profanity masking, and text normalization.

- Optimized Speech to Text results for interactive, conversation, and dictation scenarios. 

- Support for many spoken languages in multiple dialects. For the full list of supported languages in each recognition mode, see [supported languages](supported-languages.md#speech-to-text).

- Customized language and acoustic models, so you can tailor your application to your users' way of speaking, speaking environment, and specialized vocabulary.

- Natural-language understanding. Through integration with [Language Understanding](https://docs.microsoft.com/azure/cognitive-services/luis/) (LUIS), you can derive intents and entities from speech. Users don't have to know your app's vocabulary, but can describe what they want in their own words.

Some capabilities of the Speech to Text API are not available via REST. The following table summarizes the capabilities of each method of accessing the API.

| Use case | REST | WebSockets | SDKs |
|-----|-----|-----|----|
| Transcribe a short utterance, such as a command (length < 15 s); no interim results | Yes | Yes | Yes |
| Transcribe a longer utterance (> 15 s) | No | Yes | Yes |
| Transcribe streaming audio with optional interim results | No | Yes | Yes |
| Understand speaker intents via LUIS | No\* | No\* | Yes |

\* *The SDK can call LUIS for you and provide entity and intent results, all under your Speech subscription. With REST and WebSockets APIs, you can call LUIS yourself to derive intents and entities, but you need a separate LUIS subscription.

## Next steps

> [!div class="nextstepaction"]
> [Start your free trial](https://azure.microsoft.com/en-us/try/cognitive-services/)

> [!div class="nextstepaction"]
> [Start your free trial](https://azure.microsoft.com/en-us/try/cognitive-services/)
