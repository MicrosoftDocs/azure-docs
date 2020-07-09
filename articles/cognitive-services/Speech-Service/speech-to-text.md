---
title: Speech-to-text - Speech service
titleSuffix: Azure Cognitive Services
description: The speech-to-text feature enables real-time transcription of audio streams into text. Your applications, tools, or devices can consume, display, and take action on this text input. This service works seamlessly with the text-to-speech (speech synthesis), and speech translation features.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/12/2020
ms.author: trbye
---

# What is speech-to-text?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

Speech-to-text from the Speech service, also known as speech recognition, enables real-time transcription of audio streams into text. Your applications, tools, or devices can consume, display, and take action on this text as command input. This service is powered by the same recognition technology that Microsoft uses for Cortana and Office products. It seamlessly works with the <a href="./speech-translation.md" target="_blank">translation <span class="docon docon-navigate-external x-hidden-focus"></span></a> and <a href="./text-to-speech.md" target="_blank">text-to-speech <span class="docon docon-navigate-external x-hidden-focus"></span></a> service offerings. For a full list of available speech-to-text languages, see [supported languages](language-support.md#speech-to-text).

The speech-to-text service defaults to using the Universal language model. This model was trained using Microsoft-owned data and is deployed in the cloud. It's optimal for conversational and dictation scenarios. When using speech-to-text for recognition and transcription in a unique environment, you can create and train custom acoustic, language, and pronunciation models. Customization is helpful for addressing ambient noise or industry-specific vocabulary.

With additional reference text as input, speech-to-text service also enables [pronunciation assessment](rest-speech-to-text.md#pronunciation-assessment-parameters) capability to evaluate speech pronunciation and gives speakers feedback on the accuracy and fluency of spoken audio. With pronunciation assessment, language learners can practice, get instant feedback, and improve their pronunciation so that they can speak and present with confidence. Educators can use the capability to evaluate pronunciation of multiple speakers in real-time. The feature currently supports US English, and correlates highly with speech assessments conducted by experts.

> [!NOTE]
> Bing Speech was decommissioned on October 15, 2019. If your applications, tools, or products are using the Bing Speech APIs, we've created guides to help you migrate to the Speech service.
> - [Migrate from Bing Speech to the Speech service](how-to-migrate-from-bing-speech.md)

## Get started with speech-to-text

The speech-to-text service is available via the [Speech SDK](speech-sdk.md). There are several common scenarios available as quickstarts, in various languages and platforms:

 - [Quickstart: Recognize speech with microphone input](quickstarts/speech-to-text-from-microphone.md)
 - [Quickstart: Recognize speech from a file](quickstarts/speech-to-text-from-file.md)
 - [Quickstart: Recognize speech stored in blob storage](quickstarts/from-blob.md)

If you prefer to use the speech-to-text REST service, see [REST APIs](rest-speech-to-text.md).

 - [Quickstart: Pronunciation assessment with reference input](rest-speech-to-text.md#pronunciation-assessment-parameters)

## Tutorials and sample code

After you've had a chance to use the Speech service, try our tutorial that teaches you how to recognize intents from speech using the Speech SDK and LUIS.

- [Tutorial: Recognize intents from speech with the Speech SDK and LUIS, using C#](how-to-recognize-intents-from-speech-csharp.md)

Sample code for the Speech SDK is available on GitHub. These samples cover common scenarios like reading audio from a file or stream, continuous and single-shot recognition, and working with custom models.

- [Speech-to-text samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
- [Batch transcription samples (REST)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch)
- [Pronunciation assessment samples (REST)](rest-speech-to-text.md#pronunciation-assessment-parameters)

## Customization

In addition to the standard Speech service model, you can create custom models. Customization helps to overcome speech recognition barriers such as speaking style, vocabulary and background noise, see [Custom Speech](how-to-custom-speech.md). Customization options vary by language/locale, see [supported languages](supported-languages.md) to verify support.

[!INCLUDE [speech-reference-doc-links](includes/speech-reference-doc-links.md)]

## Next steps

- [Get a Speech service subscription key for free](get-started.md)
- [Get the Speech SDK](speech-sdk.md)
