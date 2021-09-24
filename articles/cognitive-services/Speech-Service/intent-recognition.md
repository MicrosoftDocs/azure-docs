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
keywords: intent recognition
---

# What is intent recognition?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

In this overview, you will learn about the benefits and capabilities of intent recognition. The Cognitive Services Speech SDK provides two ways to recognize intents, both described below. An intent is something the user wants to do: book a flight, check the weather, or make a call. Using intent recognition, your applications, tools, and devices can determine what the user wants to initiate or do based on options you define in the Intent Recognizer or LUIS.

## Pattern matching
The SDK provides an embedded pattern matcher that you can use to recognize intents in a very strict way. This is useful for when you need a quick offline solution. This works especially well when the user is going to be trained in some way or can be expected to use specific phrases to trigger intents. For example: "Go to floor seven", or "Turn on the lamp" etc. It is recommended to start here and if it no longer meets your needs, switch to using LUIS or a combination of the two. 

## LUIS (Language Understanding Intent Service)
The Microsoft LUIS service is available as a complete AI intent service that works well when your domain of possible intents is large and you are not really sure what the user will say. It supports many complex scenarios, intents, and entities.

### LUIS key required

* LUIS integrates with the Speech service to recognize intents from speech. You don't need a Speech service subscription, just LUIS.
* Speech intent recognition is integrated with the Speech SDK. You can use a LUIS key with the Speech service.
* Intent recognition through the Speech SDK is [offered in a subset of regions supported by LUIS](./regions.md#intent-recognition).

## Get started
See this [how-to](how-to-use-simple-language-pattern-matching.md) to get started with pattern matching.

See this [quickstart](get-started-intent-recognition.md) to get started with LUIS intent recognition.

## Sample code

Sample code for intent recognition:

* [Quickstart: Use prebuilt Home automation app](../luis/luis-get-started-create-app.md)
* [Recognize intents from speech using the Speech SDK for C#](./how-to-recognize-intents-from-speech-csharp.md)
* [Intent recognition and other Speech services using Unity in C#](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/unity/speechrecognizer)
* [Recognize intents using Speech SDK for Python](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/python/console)
* [Intent recognition and other Speech services using the Speech SDK for C++ on Windows](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/cpp/windows/console)
* [Intent recognition and other Speech services using the Speech SDK for Java on Windows or Linux](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/java/jre/console)
* [Intent recognition and other Speech services using the Speech SDK for JavaScript on a web browser](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/js/browser)

## Reference docs

* [Speech SDK](./speech-sdk.md)

## Next steps

* Complete the intent recognition [quickstart](get-started-intent-recognition.md)
* [Get a Speech service subscription key for free](overview.md#try-the-speech-service-for-free)
* [Get the Speech SDK](speech-sdk.md)
