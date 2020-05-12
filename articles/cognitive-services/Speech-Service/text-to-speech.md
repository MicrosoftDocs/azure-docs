---
title: Text-to-speech - Speech service
titleSuffix: Azure Cognitive Services
description: The text-to-speech feature in the Speech service enables your applications, tools, or devices to convert text into natural human-like synthesized speech. Choose preset voices or create your own custom voice.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/23/2020
ms.author: trbye
---

# What is text-to-speech?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

Text-to-speech from the Speech service enables your applications, tools, or devices to convert text into human-like synthesized speech. Choose from standard and neural voices, or create a custom voice unique to your product or brand. 75+ standard voices are available in more than 45 languages and locales, and 5 neural voices are available in a select number of languages and locales. For a full list of supported voices, languages, and locales, see [supported languages](language-support.md#text-to-speech).

> [!NOTE]
> Bing Speech was decommissioned on October 15, 2019. If your applications, tools, or products are using the Bing Speech APIs or Custom Speech, we've created guides to help you migrate to the Speech service.
> - [Migrate from Bing Speech to the Speech service](how-to-migrate-from-bing-speech.md)

## Core features

* Speech synthesis - Use the [Speech SDK](quickstarts/text-to-speech-audio-file.md) or [REST API](rest-text-to-speech.md) to convert text-to-speech using standard, neural, or custom voices.

* Asynchronous synthesis of long audio - Use the [Long Audio API](long-audio-api.md) to asynchronously synthesize text-to-speech files longer than 10 minutes (for example audio books or lectures). Unlike synthesis performed using the Speech SDK or speech-to-text REST API, responses aren't returned in real time. The expectation is that requests are sent asynchronously, responses are polled for, and that the synthesized audio is downloaded when made available from the service. Only custom neural voices are supported.

* Standard voices - Created using Statistical Parametric Synthesis and/or Concatenation Synthesis techniques. These voices are highly intelligible and sound natural. You can easily enable your applications to speak in more than 45 languages, with a wide range of voice options. These voices provide high pronunciation accuracy, including support for abbreviations, acronym expansions, date/time interpretations, polyphones, and more. For a full list of standard voices, see [supported languages](language-support.md#text-to-speech).

* Neural voices - Deep neural networks are used to overcome the limits of traditional speech synthesis with regards to stress and intonation in spoken language. Prosody prediction and voice synthesis are performed simultaneously, which results in more fluid and natural-sounding outputs. Neural voices can be used to make interactions with chatbots and voice assistants more natural and engaging, convert digital texts such as e-books into audiobooks, and enhance in-car navigation systems. With the human-like natural prosody and clear articulation of words, neural voices significantly reduce listening fatigue when you interact with AI systems. For a full list of neural voices, see [supported languages](language-support.md#text-to-speech).

* Speech Synthesis Markup Language (SSML) - An XML-based markup language used to customize speech-to-text outputs. With SSML, you can adjust pitch, add pauses, improve pronunciation, speed up or slow down speaking rate, increase or decrease volume, and attribute multiple voices to a single document. See [SSML](speech-synthesis-markup.md).

## Get started

The text-to-speech service is available via the [Speech SDK](speech-sdk.md). There are several common scenarios available as quickstarts, in various languages and platforms:

* [Synthesize speech into an audio file](quickstarts/text-to-speech-audio-file.md)
* [Synthesize speech to a speaker](quickstarts/text-to-speech.md)
* [Asynchronously synthesize long-form audio](quickstarts/text-to-speech/async-synthesis-long-form-audio.md)

If you prefer, the text-to-speech service is accessible via [REST](rest-text-to-speech.md).

## Sample code

Sample code for text-to-speech is available on GitHub. These samples cover text-to-speech conversion in most popular programming languages.

- [Text-to-speech samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
- [Text-to-speech samples (REST)](https://github.com/Azure-Samples/Cognitive-Speech-TTS)

## Customization

In addition to standard and neural voices, you can create and fine-tune custom voices unique to your product or brand. All it takes to get started are a handful of audio files and the associated transcriptions. For more information, see [Get started with Custom Voice](how-to-custom-voice.md)

## Pricing note

When using the text-to-speech service, you are billed for each character that is converted to speech, including punctuation. While the SSML document itself is not billable, optional elements that are used to adjust how the text is converted to speech, like phonemes and pitch, are counted as billable characters. Here's a list of what's billable:

- Text passed to the text-to-speech service in the SSML body of the request
- All markup within the text field of the request body in the SSML format, except for `<speak>` and `<voice>` tags
- Letters, punctuation, spaces, tabs, markup, and all white-space characters
- Every code point defined in Unicode

For detailed information, see [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

> [!IMPORTANT]
> Each Chinese, Japanese, and Korean language character is counted as two characters for billing.

## Reference docs

- [Speech SDK](speech-sdk.md)
- [REST API: Text-to-speech](rest-text-to-speech.md)

## Next steps

- [Get a free Speech service subscription](get-started.md)
- [Get the Speech SDK](speech-sdk.md)
