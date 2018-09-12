---
title: About Speech to Text
description: An overview of the capabilities of Speech to Text API.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 05/07/2018
ms.author: v-jerkin
---
# About the Speech to Text API

The **Speech to Text** API *transcribes* audio streams into text that your application can display to the user or act upon as command input. The APIs can be used either with an SDK client library (for supported platforms and languages) or a REST API.

The **Speech to Text** API offers the following features:

- Advanced speech recognition technology from Microsoft—the same used by Cortana, Office, and other Microsoft products.

- Real-time continuous recognition. **Speech to Text** allows users to transcribe audio into text in real time. It also supports receiving intermediate results of the words that have been recognized so far. The service automatically recognizes the end of speech. Users can also choose additional formatting options, including capitalization and punctuation, profanity masking, and inverse text normalization.

- Optimized **Speech to Text** results for interactive, conversation, and dictation scenarios.

- Support for many spoken languages and dialects. For the full list of supported languages in each recognition mode, see [Supported languages](language-support.md#speech-to-text).

- Customized language and acoustic models, so you can tailor your application to your users' specialized domain vocabulary, speaking environment and way of speaking.

- Natural-language understanding. Through integration with [Language Understanding](https://docs.microsoft.com/azure/cognitive-services/luis/) (LUIS), you can derive intents and entities from speech. Users don't have to know your app's vocabulary, but can describe what they want in their own words.

## API capabilities

A lot of the capabilities of the **Speech to Text** API -especially around customization- are available via REST. The following table summarizes the capabilities of each method of accessing the API. For a full list of capabilities and API details please consult [Swagger](https://swagger/service/11ed9226-335e-4d08-a623-4547014ba2cc#/)

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
> The REST API implements throttling that limits the API requests to 25 per 5 second. Message hearders will inform of the limits

\* *LUIS intents and entities can be derived using a separate LUIS subscription. With this subscription, the SDK can call LUIS for you and provide entity and intent results as well as speech transcriptions. With the REST API, you can call LUIS yourself to derive intents and entities with your LUIS subscription.*

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [Quickstart: recognize speech in C#](quickstart-csharp-dotnet-windows.md)
* [See how to recognize intents from speech in C#](how-to-recognize-intents-from-speech-csharp.md)
