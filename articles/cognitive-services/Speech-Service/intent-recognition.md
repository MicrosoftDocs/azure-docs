---
title: Intent recognition overview - Speech service
titleSuffix: Azure Cognitive Services
description: Intent recognition allows you to recognize user objectives you have pre-defined. This article is an overview of the benefits and capabilities of the intent recognition service.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: overview
ms.date: 10/13/2020
keywords: intent recognition
---

# What is intent recognition?

In this overview, you will learn about the benefits and capabilities of intent recognition. The Cognitive Services Speech SDK provides two ways to recognize intents, both described below. An intent is something the user wants to do: book a flight, check the weather, or make a call. Using intent recognition, your applications, tools, and devices can determine what the user wants to initiate or do based on options you define in the Intent Recognizer or LUIS.

## Pattern matching

The SDK provides an embedded pattern matcher that you can use to recognize intents in a very strict way. This is useful for when you need a quick offline solution. This works especially well when the user is going to be trained in some way or can be expected to use specific phrases to trigger intents. For example: "Go to floor seven", or "Turn on the lamp" etc. It is recommended to start here and if it no longer meets your needs, switch to using LUIS or a combination of the two. 

Use pattern matching if: 
* You're only interested in matching strictly what the user said. These patterns match more aggressively than [conversational language understanding (CLU)](../LUIS/index.yml).
* You don't have access to a CLU model, but still want intents. 

For more information, see the [pattern matching overview](./pattern-matching-overview.md).

## Conversational Language Understanding

Conversational language understanding (CLU) enables users to build custom natural language understanding models to predict the overall intention of an incoming utterance and extract important information from it. 

Both a Speech resource and Language resource are required to use CLU with the Speech SDK. The Speech resource is used to transcribe the user's speech into text, and the Language resource is used to recognize the intent of the utterance. To get started, see the [quickstart](get-started-intent-recognition-clu.md).

For information about how to use conversational language understanding without the Speech SDK, see the [Language service documentation](/azure/cognitive-services/language-service/conversational-language-understanding/overview).

> [!IMPORTANT]
> LUIS will be retired on October 1st 2025 and starting April 1st 2023 you will not be able to create new LUIS resources. We recommend [migrating your LUIS applications](/azure/cognitive-services/language-service/conversational-language-understanding/how-to/migrate-from-luis) to [conversational language understanding](/azure/cognitive-services/language-service/conversational-language-understanding/overview) to benefit from continued product support and multilingual capabilities.
> 
> Conversational Language Understanding (CLU) is available for C# and C++ with the [Speech SDK](speech-sdk.md) version 1.25 or later. See the [quickstart](get-started-intent-recognition-clu.md) to recognize intents with the Speech SDK and CLU.

### LUIS key required

* LUIS integrates with the Speech service to recognize intents from speech. You don't need a Speech service subscription, just LUIS.
* Speech intent recognition is integrated with the Speech SDK. You can use a LUIS key with the Speech service.
* Intent recognition through the Speech SDK is [offered in a subset of regions supported by LUIS](./regions.md#intent-recognition).

## Get started
See this [how-to](how-to-use-simple-language-pattern-matching.md) to get started with pattern matching.

See this [quickstart](get-started-intent-recognition-clu.md) to get started with conversational language understanding intent recognition.

## Sample code

Sample code for intent recognition:

* [Quickstart: Use prebuilt Home automation app](../luis/luis-get-started-create-app.md)
* [Recognize intents from speech using the Speech SDK for C#](./how-to-recognize-intents-from-speech-csharp.md)
* [Intent recognition and other Speech services using Unity in C#](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/csharp/unity/speechrecognizer)
* [Recognize intents using Speech SDK for Python](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/python/console)
* [Intent recognition and other Speech services using the Speech SDK for C++ on Windows](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/cpp/windows/console)
* [Intent recognition and other Speech services using the Speech SDK for Java on Windows or Linux](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/java/jre/console)
* [Intent recognition and other Speech services using the Speech SDK for JavaScript on a web browser](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/js/browser)

## Reference docs

* [Speech SDK](./speech-sdk.md)

## Next steps

* [Intent recognition quickstart](get-started-intent-recognition.md)
* [Get the Speech SDK](speech-sdk.md)
