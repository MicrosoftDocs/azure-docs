---
title: Speech-to-text overview - Speech service
titleSuffix: Azure Cognitive Services
description: Get an overview of the benefits and capabilities of the speech-to-text feature of the Speech Service.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: overview
ms.date: 01/16/2022
ms.author: eur
ms.custom: cog-serv-seo-aug-2020
keywords: speech to text, speech to text software
---

# What is speech-to-text?

In this overview, you learn about the benefits and capabilities of the speech-to-text feature of the Speech service, which is part of Azure Cognitive Services.

Speech-to-text, also known as speech recognition, enables real-time or offline transcription of audio streams into text. For a full list of available speech-to-text languages, see [Language and voice support for the Speech service](language-support.md#speech-to-text).

> [!NOTE]
> Microsoft uses the same recognition technology for Cortana and Office products.

## Get started

To get started with speech-to-text, see the [quickstart](get-started-speech-to-text.md). Speech-to-text is available via the [Speech SDK](speech-sdk.md), the [REST API](rest-speech-to-text.md), and the [Speech CLI](spx-overview.md).

Sample code for the Speech SDK is available on GitHub. These samples cover common scenarios like reading audio from a file or stream for continuous and single-shot recognition, and working with custom models:

- [Speech-to-text samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
- [Batch transcription samples (REST)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch)

## Batch transcription

Batch transcription is a set of REST API operations that enable you to transcribe a large amount of audio in storage. You can point to audio files with a shared access signature (SAS) URI and asynchronously receive transcription results. For more information on how to use the batch transcription API, see [How to use batch transcription](batch-transcription.md).

## Custom Speech

The Azure speech-to-text service analyzes audio in real-time or batch to transcribe the spoken word into text. Out of the box, speech to text utilizes a Universal Language Model as a base model that is trained with Microsoft-owned data and reflects commonly used spoken language. This base model is pre-trained with dialects and phonetics representing a variety of common domains. The base model works well in most scenarios.

The base model may not be sufficient if the audio contains ambient noise or includes a lot of industry and domain-specific jargon. In these cases, building a custom speech model makes sense by training with additional data associated with that specific domain. You can create and train custom acoustic, language, and pronunciation models. For more information, see [Custom Speech](./custom-speech-overview.md).

Customization options vary by language or locale. To verify support, see [Language and voice support for the Speech service](./language-support.md).

### REST API

In some cases, you can't or shouldn't use the [Speech SDK](speech-sdk.md). For speech-to-text REST APIs, see the following documentation:

- [Speech-to-text REST API v3.0](rest-speech-to-text.md): You should use the REST API for [batch transcription](batch-transcription.md) and [Custom Speech](custom-speech-overview.md). 
- [Speech-to-text REST API for short audio](rest-speech-to-text-short.md): Use it only in cases where you can't use the [Speech SDK](speech-sdk.md).


## Next steps

- [Get started with speech-to-text](get-started-speech-to-text.md)
- [Get the Speech SDK](speech-sdk.md)
