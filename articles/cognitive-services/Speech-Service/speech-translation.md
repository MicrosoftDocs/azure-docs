---
title: Speech translation overview - Speech service
titleSuffix: Azure Cognitive Services
description: Speech translation allows you to add end-to-end, real-time, multi-language translation of speech to your applications, tools, and devices. The same API can be used for both speech-to-speech and speech-to-text translation. This article is an overview of the benefits and capabilities of the speech translation service.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 09/01/2020
ms.author: erhopf
ms.custom: devx-track-csharp, cog-serv-seo-aug-2020
keywords: speech translation
---

# What is speech translation?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

In this overview, you learn about the benefits and capabilities of the speech translation service, which enables real-time, [multi-language speech-to-speech](language-support.md#speech-translation) and speech-to-text translation of audio streams. With the Speech SDK, your applications, tools, and devices have access to source transcriptions and translation outputs for provided audio. Interim transcription and translation results are returned as speech is detected, and final results can be converted into synthesized speech.

This documentation contains the following article types:

* **Quickstarts** are getting-started instructions to guide you through making requests to the service.
* **How-to guides** contain instructions for using the service in more specific or customized ways.
* **Concepts** provide in-depth explanations of the service functionality and features.
* **Tutorials** are longer guides that show you how to use the service as a component in broader business solutions.

## Core features

* Speech-to-text translation with recognition results.
* Speech-to-speech translation.
* Support for translation to multiple target languages.
* Interim recognition and translation results.

## Get started 

See the [quickstart](get-started-speech-translation.md) to get started with speech translation. The speech translation service is available via the [Speech SDK](speech-sdk.md) and the [Speech CLI](spx-overview.md).

## Sample code

Sample code for the Speech SDK is available on GitHub. These samples cover common scenarios like reading audio from a file or stream, continuous and single-shot recognition/translation, and working with custom models.

* [Speech-to-text and translation samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)

## Migration guides

If your applications, tools, or products are using the [Translator Speech API](./how-to-migrate-from-translator-speech-api.md), we've created guides to help you migrate to the Speech service.

* [Migrate from the Translator Speech API to the Speech service](how-to-migrate-from-translator-speech-api.md)

## Reference docs

* [Speech SDK](./speech-sdk.md)
* [Speech Devices SDK](speech-devices-sdk.md)
* [REST API: Speech-to-text](rest-speech-to-text.md)
* [REST API: Text-to-speech](rest-text-to-speech.md)
* [REST API: Batch transcription and customization](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0)

## Next steps

* Complete the speech translation [quickstart](get-started-speech-translation.md)
* [Get a Speech service subscription key for free](overview.md#try-the-speech-service-for-free)
* [Get the Speech SDK](speech-sdk.md)