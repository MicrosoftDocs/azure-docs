---
title: Intent recognition overview - Speech service
titleSuffix: Azure Cognitive Services
description: Intent recognition allows you to recognize user objectives you have pre-defined. This article is an overview of the benefits and capabilities of the intent recognition service.
services: cognitive-services
author: v-demjoh
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/13/2020
ms.author: v-demjoh
keywords: intent recognotion
---

# What is intent recognition?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

In this overview, you learn about the benefits and capabilities of intent recognition. The Cognitive Services Speech SDK integrates with the Language Understanding service (LUIS) to provide intent recognition. An intent is something the user wants to do: book a flight, check the weather, or make a call.
Using intent recognition, your applications, tools, and devices can determine what the user wishes to initiate or do based on options you define in LUIS.

## Core features

* LUIS integrates with the Speech service to recognize intents from speech. You don't need a Speech service subscription, just LUIS.
* Speech intent recognition is integrated with the SDK. You can use a LUIS key with the Speech service.
* Intent recognition through the Speech SDK is [offered at a subset of regions supported by LUIS](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#intent-recognition).

## Get started

See the [quickstart](quickstarts/intent-recognition.md) to get started with speech translation.

## Sample code

* [Quickstart: Use prebuilt Home automation app](https://docs.microsoft.com/azure/cognitive-services/luis/luis-get-started-create-app)
* [Recognize intents from speech using the Speech SDK for C#](https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-recognize-intents-from-speech-csharp)
* [Intent recognition and other Speech services using Unity in C#](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/unity/speechrecognizer)
* [Recognize intents using Speech SDK for Python](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/python/console)
* [Intent recognition and other Speech services using the Speech SDK for C++ on Windows](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/cpp/windows/console)
* [Intent recognition and other Speech services using the Speech SDK for Java on Windows or Linux](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/java/jre/console)
* [Intent recognition and other Speech services using the Speech SDK for JavaScript on a web browser](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/js/browser)

Sample code for intent recognition:

* [Speech-to-text and translation samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)

## Customization

Yes?

## Pricing note

Yes?

## Migration guides

If your applications, tools, or products are using the [Translator Speech API](https://docs.microsoft.com/azure/cognitive-services/translator-speech/overview), we've created guides to help you migrate to the Speech service.

* [Migrate from the Translator Speech API to the Speech service](how-to-migrate-from-translator-speech-api.md)

## Reference docs

* [Speech SDK](speech-sdk-reference.md)
* [REST API: Intent recognition]()

## Next steps

* Complete the intent recognition [quickstart](quickstarts/intent-recognition.md)
* [Get a Speech service subscription key for free](overview.md#try-the-speech-service-for-free)
* [Get the Speech SDK](speech-sdk.md)
