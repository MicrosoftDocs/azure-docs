---
title: Recognize speech by using the REST API
description: Learn how to use the Speech to Text API in the Cognitive Services Speech service.
titleSuffix: Microsoft Cognitive Services
services: cognitive-services
author: erhopf

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 07/16/2018
ms.author: erhopf
---

# Recognize speech by using the REST API

[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-how-to-recognize-speech-selector.md)]

The REST API can be used to recognize short utterances by using an HTTP POST request.

The REST API is the simplest way to recognize speech if you aren't using a language that's supported by the [SDK](speech-sdk.md). You make an HTTP POST request to the service endpoint and pass the entire utterance in the body of the request. You receive a response that has the recognized text.

> [!NOTE]
> Utterances are limited to 15 seconds or less when you use the REST API.
> Check out the [Speech SDK](how-to-recognize-speech-csharp.md) for recognition of longer utterances.

For more information on the **Speech to Text** REST API, see the [REST APIs](rest-apis.md#speech-to-text) article. To see the API in action, download the [REST API samples](https://github.com/Azure-Samples/SpeechToText-REST) from GitHub.

## Next steps

- See the [REST API overview](rest-apis.md).
