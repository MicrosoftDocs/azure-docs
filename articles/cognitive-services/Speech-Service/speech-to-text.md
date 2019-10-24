---
title: Speech-to-text - Speech Service
titleSuffix: Azure Cognitive Services
description: Speech-to-text feature in Speech Service, also known as speech-to-text, enables real-time transcription of audio streams into text that your applications, tools, or devices can consume, display, and take action on as command input. This service is powered by the same recognition technology that Microsoft uses for Cortana and Office products, and works seamlessly with the translation and text-to-speech.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: erhopf
---

# What is speech-to-text?

Speech-to-text from Azure Speech Services, also known as speech-to-text, enables real-time transcription of audio streams into text that your applications, tools, or devices can consume, display, and take action on as command input. This service is powered by the same recognition technology that Microsoft uses for Cortana and Office products, and works seamlessly with the translation and text-to-speech.  For a full list of available speech-to-text languages, see [supported languages](https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#speech-to-text).

By default, the speech-to-text service uses the Universal language model. This model was trained using Microsoft-owned data and is deployed in the cloud. It's optimal for conversational and dictation scenarios. If you are using speech-to-text for recognition and transcription in a unique environment, you can create and train custom acoustic, language, and pronunciation models to address ambient noise or industry-specific vocabulary.

You can easily capture audio from a microphone, read from a stream, or access audio files from storage with the Speech SDK and REST APIs. The Speech SDK supports WAV/PCM 16-bit, 16 kHz/8 kHz, single-channel audio for speech recognition. Additional audio formats are supported using the [speech-to-text REST endpoint](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis) or the [batch transcription service](https://docs.microsoft.com/azure/cognitive-services/speech-service/batch-transcription#supported-formats).

## Core features

Here are the features available via the Speech SDK and REST APIs:

| Use case | SDK | REST |
|----------|-----|------|
| Transcribe short utterances (<15 seconds). Only supports final transcription result. | Yes | Yes |
| Continuous transcription of long utterances and streaming audio (>15 seconds). Supports interim and final transcription results. | Yes | No |
| Derive intents from recognition results with [LUIS](https://docs.microsoft.com/azure/cognitive-services/luis/what-is-luis). | Yes | No\* |
| Batch transcription of audio files asynchronously. | No | Yes\** |
| Create and manage speech models. | No | Yes\** |
| Create and manage custom model deployments. | No | Yes\** |
| Create accuracy tests to measure the accuracy of the baseline model versus custom models. | No | Yes\** |
| Manage subscriptions. | No | Yes\** |

\* *LUIS intents and entities can be derived using a separate LUIS subscription. With this subscription, the SDK can call LUIS for you and provide entity and intent results. With the REST API, you can call LUIS yourself to derive intents and entities with your LUIS subscription.*

\** *These services are available using the cris.ai endpoint. See [Swagger reference](https://westus.cris.ai/swagger/ui/index).*

## Get started with speech-to-text

We offer quickstarts in most popular programming languages, each designed to have you running code in less than 10 minutes. [This table](https://aka.ms/csspeech#5-minute-quickstarts) includes a complete list of Speech SDK quickstarts organized by platfrom and language.  API reference can also be found [here](https://aka.ms/csspeech#reference).

If you prefer to use the speech-to-text REST service, see [REST APIs](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis).

## Tutorials and sample code

After you've had a chance to use the Speech Services, try our tutorial that teaches you how to recognize intents from speech using the Speech SDK and LUIS.

* [Tutorial: Recognize intents from speech with the Speech SDK and LUIS, C#](how-to-recognize-intents-from-speech-csharp.md)

Sample code for the Speech SDK is available on GitHub. These samples cover common scenarios like reading audio from a file or stream, continuous and single-shot recognition, and working with custom models.

* [Speech-to-text samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
* [Batch transcription samples (REST)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch)

## Customization

In addition to the standard baseline model used by the Speech Services, you can customize models to your needs with available data, to overcome speech recognition barriers such as speaking style, vocabulary and background noise, see [Custom Speech](how-to-custom-speech.md)

> [!NOTE]
> Customization options vary by language/locale (see [Supported languages](supported-languages.md)).

## Migration guides

> [!WARNING]
> Bing Speech will be decommissioned on October 15, 2019.

If your applications, tools, or products are using the Bing Speech APIs or Custom Speech, we've created guides to help you migrate to Speech Services.

* [Migrate from Bing Speech to the Speech Services](https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-migrate-from-bing-speech)
* [Migrate from Custom Speech to the Speech Services](https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-migrate-from-custom-speech-service)

## Reference docs

* [Speech SDK](https://aka.ms/csspeech)
* [Speech Devices SDK](speech-devices-sdk.md)
* [REST API: Speech-to-text](rest-speech-to-text.md)
* [REST API: Text-to-speech](rest-text-to-speech.md)
* [REST API: Batch transcription and customization](https://westus.cris.ai/swagger/ui/index)

## Next steps

* [Get a Speech Services subscription key for free](get-started.md)
* [Get the Speech SDK](speech-sdk.md)
