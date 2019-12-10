---
title: Speech-to-text - Speech service
titleSuffix: Azure Cognitive Services
description: The speech-to-text feature enables real-time transcription of audio streams into text. Your applications, tools, or devices can consume, display, and take action on this text input. This service works seamlessly with the text-to-speech (speech synthesis), and speech translation features.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 12/10/2019
ms.author: erhopf
---

# What is speech-to-text?

Speech-to-text from the Speech service, also known as speech recognition, enables real-time transcription of audio streams into text. Your applications, tools, or devices can consume, display, and take action on this text as command input. This service is powered by the same recognition technology that Microsoft uses for Cortana and Office products. It seamlessly works with the translation and text-to-speech service offerings. For a full list of available speech-to-text languages, see [supported languages](https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#speech-to-text).

The speech-to-text service defaults to using the Universal language model. This model was trained using Microsoft-owned data and is deployed in the cloud. It's optimal for conversational and dictation scenarios. When using speech-to-text for recognition and transcription in a unique environment, you can create and train custom acoustic, language, and pronunciation models. Customization is helpful for addressing ambient noise or industry-specific vocabulary.

## Core features

The Speech service offers REST APIs and SDK support. Here are the core features available:

| Use case | SDK | REST API |
|----------|-----|------|
| Transcribe short utterances (<15 seconds). Only supports one final transcription result. | Yes | Yes <sup>1</sup> |
| Continuous transcription of long utterances and streaming audio (>15 seconds). Supports interim and final transcription results. | Yes | No |
| Derive intents from recognition results with [LUIS](https://docs.microsoft.com/azure/cognitive-services/luis/what-is-luis). | Yes | No <sup>2</sup> |
| Batch transcription of audio files asynchronously. | No  | Yes <sup>3</sup> |
| Create and manage speech models. | No | Yes <sup>3</sup> |
| Create and manage custom model deployments. | No  | Yes <sup>3</sup> |
| Create accuracy tests to measure the accuracy of the baseline model versus custom models. | No | Yes <sup>3</sup> |
| Manage subscriptions. | No  | Yes <sup>3</sup> |

<sup>1</sup> _Using the REST functionality you can transfer up to 60 seconds of audio and will receive one final transcription result._

<sup>2</sup> _LUIS intents and entities can be derived using a separate LUIS subscription. With this subscription, the SDK calls LUIS for you and provides entity and intent results. With the REST API, you call LUIS yourself to derive intents and entities with your LUIS subscription._

<sup>3</sup> _These services are available using the cris.ai endpoint. See [Swagger reference](https://cris.ai/swagger/ui/index)._

## Get started with speech-to-text

We offer quickstarts in most popular programming languages, each designed to have you running code in less than 10 minutes. [This table](https://aka.ms/csspeech#5-minute-quickstarts) includes a complete list of Speech SDK quickstarts organized by platform and language. API reference can also be found [here](https://aka.ms/csspeech#reference).

If you prefer to use the speech-to-text REST service, see [REST APIs](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis).

## Tutorials and sample code

After you've had a chance to use the Speech service, try our tutorial that teaches you how to recognize intents from speech using the Speech SDK and LUIS.

- [Tutorial: Recognize intents from speech with the Speech SDK and LUIS, C#](how-to-recognize-intents-from-speech-csharp.md)

Sample code for the Speech SDK is available on GitHub. These samples cover common scenarios like reading audio from a file or stream, continuous and single-shot recognition, and working with custom models.

- [Speech-to-text samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
- [Batch transcription samples (REST)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch)

## Customization

In addition to the standard Speech service model, you can create custom models. Customization helps to overcome speech recognition barriers such as speaking style, vocabulary and background noise, see [Custom Speech](how-to-custom-speech.md)

> [!NOTE]
> Customization options vary by language/locale (see [Supported languages](supported-languages.md)).

## Migration guides

> [!WARNING]
> Bing Speech was decommissioned on October 15, 2019.

If your applications, tools, or products are using the Bing Speech APIs or Custom Speech, we've created guides to help you migrate to the Speech service.

- [Migrate from Bing Speech to the Speech service](https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-migrate-from-bing-speech)
- [Migrate from Custom Speech to the Speech service](https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-migrate-from-custom-speech-service)

[!INCLUDE [speech-reference-doc-links](includes/speech-reference-doc-links.md)]

## Next steps

- [Get a Speech service subscription key for free](get-started.md)
- [Get the Speech SDK](speech-sdk.md)
