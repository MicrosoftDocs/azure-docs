---
title: Intent recognition overview - Speech service
titleSuffix: Azure AI services
description: Intent recognition allows you to recognize user objectives you have pre-defined. This article is an overview of the benefits and capabilities of the intent recognition service.
#services: cognitive-services
author: eric-urban
ms.author: eur
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 02/22/2023
keywords: intent recognition
---

# What is intent recognition?

In this overview, you will learn about the benefits and capabilities of intent recognition. The Azure AI Speech SDK provides two ways to recognize intents, both described below. An intent is something the user wants to do: book a flight, check the weather, or make a call. Using intent recognition, your applications, tools, and devices can determine what the user wants to initiate or do based on options you define in the Intent Recognizer or Conversational Language Understanding (CLU) model.

## Pattern matching

The Speech SDK provides an embedded pattern matcher that you can use to recognize intents in a very strict way. This is useful for when you need a quick offline solution. This works especially well when the user is going to be trained in some way or can be expected to use specific phrases to trigger intents. For example: "Go to floor seven", or "Turn on the lamp" etc. It is recommended to start here and if it no longer meets your needs, switch to using [CLU](#conversational-language-understanding) or a combination of the two. 

Use pattern matching if: 
* You're only interested in matching strictly what the user said. These patterns match more aggressively than [conversational language understanding (CLU)](../language-service/conversational-language-understanding/overview.md).
* You don't have access to a CLU model, but still want intents. 

For more information, see the [pattern matching concepts](./pattern-matching-overview.md) and then:
* Start with [simple pattern matching](how-to-use-simple-language-pattern-matching.md).
* Improve your pattern matching by using [custom entities](how-to-use-custom-entity-pattern-matching.md).

## Conversational Language Understanding

Conversational language understanding (CLU) enables users to build custom natural language understanding models to predict the overall intention of an incoming utterance and extract important information from it.

Both a Speech resource and Language resource are required to use CLU with the Speech SDK. The Speech resource is used to transcribe the user's speech into text, and the Language resource is used to recognize the intent of the utterance. To get started, see the [quickstart](get-started-intent-recognition-clu.md).

> [!IMPORTANT]
> When you use conversational language understanding with the Speech SDK, you are charged both for the Speech to text recognition request and the Language service request for CLU. For more information about pricing for conversational language understanding, see [Language service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-service/).

For information about how to use conversational language understanding without the Speech SDK and without speech recognition, see the [Language service documentation](../language-service/conversational-language-understanding/overview.md).

> [!IMPORTANT]
> LUIS will be retired on October 1st 2025 and starting April 1st 2023 you will not be able to create new LUIS resources. We recommend [migrating your LUIS applications](../language-service/conversational-language-understanding/how-to/migrate-from-luis.md) to [conversational language understanding](../language-service/conversational-language-understanding/overview.md) to benefit from continued product support and multilingual capabilities.
> 
> Conversational Language Understanding (CLU) is available for C# and C++ with the [Speech SDK](speech-sdk.md) version 1.25 or later. See the [quickstart](get-started-intent-recognition-clu.md) to recognize intents with the Speech SDK and CLU.

## Next steps

* [Intent recognition with simple pattern matching](how-to-use-simple-language-pattern-matching.md)
* [Intent recognition with CLU quickstart](get-started-intent-recognition-clu.md)
