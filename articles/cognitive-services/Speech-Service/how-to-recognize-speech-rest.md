---
title: Recognize speech by using the REST API
description: Learn how to use Speech to Text in the Speech service
titleSuffix: Microsoft Cognitive Services
services: cognitive-services
author: v-jerkin

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 07/16/2018
ms.author: v-jerkin
---

# Recognize speech by using the REST API

[!include[Selector](../../../includes/cognitive-services-speech-service-how-to-recognize-speech-selector.md)]

The REST API can be used to recognize short utterances using an HTTP POST request.

The REST API is the simplest way to recognize speech if you are not using a language supported by the SDK.
You make an HTTP POST request to the service endpoint, passing the entire utterance in the body of the request.
You receive a response containing the recognized text.

> [!NOTE]
> Utterances are limited to 15 seconds or less when using the REST API.
> Check out the [Speech SDK](how-to-recognize-speech-csharp.md) for recognition of longer utterances.

For more information on the **Speech to Text** REST API, see [REST APIs](rest-apis.md#speech-to-text). To see it in action, download the [REST API samples](https://github.com/Azure-Samples/SpeechToText-REST) from GitHub.

## Next steps

- [See the REST API overview](rest-apis.md)
