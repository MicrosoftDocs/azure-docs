---
title: Text-to-speech overview - Speech service
titleSuffix: Azure Cognitive Services
description: The text-to-speech feature in the Speech service enables your applications, tools, or devices to convert text into natural human-like synthesized speech. This article is an overview of the benefits and capabilities of the text-to-speech service.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/16/2022
ms.author: eur
ms.custom: cog-serv-seo-aug-2020
keywords: text to speech
---

# What is Text-to-Speech?

In this overview, you learn about the benefits and capabilities of the Text-to-Speech service, which enables your applications, tools, or devices to convert text into human-like synthesized speech. Use human-like prebuilt neural voices out-of-the-box, or create a custom neural voice unique to your product or brand. For a full list of supported voices, languages, and locales, see [supported languages](language-support.md#text-to-speech).

> [!NOTE]
>
> Bing Speech was decommissioned on October 15, 2019. If your applications, tools, or products are using the Bing Speech APIs or Custom Speech, see [Migrate from Bing Speech to the Speech service](how-to-migrate-from-bing-speech.md).

## Core features

The Text-to-Speech service includes the following features.  

| Feature| Summary | Demo |
|--------|----|------|
| Prebuilt Neural Voice (referred as *Neural* on [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/)) | Highly natural out-of-the-box voices powered by deep neural networks. Create an Azure account and Speech service subscription, then use the [Speech SDK](./get-started-text-to-speech.md) or visit the [Speech Studio portal](https://speech.microsoft.com/portal), and select prebuilt neural voices to get started. Go to the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) and check the pricing details. | Check the voice samples [here](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#overview) and determine the right voice for your business needs. |
| Custom Neural Voice (referred as *Custom Neural* on [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/)) | Easy-to-use self-service for creating a natural brand voice, with limited access for responsible use. Create an Azure account and Speech service subscription (with S0 tier), and [apply](https://aka.ms/customneural) to use custom neural feature. After you've been granted the access, visit the [Speech Studio portal](https://speech.microsoft.com/portal) and then select Custom Voice to get started. Go to the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) and check the pricing details. | Check the voice samples [here](https://aka.ms/customvoice). |

### Learn more about neural Text-to-Speech features
Text-to-Speech (TTS), also known as speech synthesis, enables your applications to speak. The Text-to-Speech feature of Speech service on Azure has been fully upgraded to the neural TTS engine, which uses deep neural networks to make the voices of computers nearly indistinguishable from the recordings of people. With the human-like natural prosody and clear articulation of words, neural Text-to-Speech has significantly reduced listening fatigue when you interact with AI systems.

The patterns of stress and intonation in spoken language are called _prosody_. Traditional Text-to-Speech systems break down prosody into separate linguistic analysis and acoustic prediction steps that are governed by independent models. That can result in muffled, buzzy voice synthesis. Microsoft neural Text-to-Speech capability does prosody prediction and voice synthesis simultaneously, uses deep neural networks to overcome the limits of traditional Text-to-Speech systems in matching the patterns of stress and intonation in spoken language, and synthesizes the units of speech into a computer voice. The result is a more fluid and natural-sounding voice.

* Real-time speech synthesis - Use the [Speech SDK](./get-started-text-to-speech.md) or [REST API](rest-text-to-speech.md) to convert Text-to-Speech using [prebuilt neural voices](language-support.md#text-to-speech) or [custom neural voices](custom-neural-voice.md).

* Asynchronous synthesis of long audio - Use the [Long Audio API](long-audio-api.md) to asynchronously synthesize Text-to-Speech files longer than 10 minutes (for example audio books or lectures). Unlike synthesis performed using the Speech SDK or speech-to-text REST API, responses aren't returned in real time. The expectation is that requests are sent asynchronously, responses are polled for, and that the synthesized audio is downloaded when made available from the service.

* Prebuilt neural voices - Deep neural networks are used to overcome the limits of traditional speech synthesis with regard to stress and intonation in spoken language. Prosody prediction and voice synthesis are performed simultaneously, which results in more fluid and natural-sounding outputs. Neural voices can be used to make interactions with chatbots and voice assistants more natural and engaging, convert digital texts such as e-books into audiobooks, and enhance in-car navigation systems. With the human-like natural prosody and clear articulation of words, neural voices significantly reduce listening fatigue when you interact with AI systems. For a full list of platform neural voices, see [supported languages](language-support.md#text-to-speech).

* Fine-tune Text-to-Speech output with SSML - Speech Synthesis Markup Language (SSML) is an XML-based markup language used to customize Text-to-Speech outputs. With SSML, you can not only adjust pitch, add pauses, improve pronunciation, change speaking rate, adjust volume, and attribute multiple voices to a single document, but also define your own lexicons or switch to different speaking styles. With the [multi-lingual voices](https://techcommunity.microsoft.com/t5/azure-ai/azure-text-to-speech-updates-at-build-2021/ba-p/2382981), you can also adjust the speaking languages via SSML. See [how to use SSML](speech-synthesis-markup.md) to fine-tune the voice output for your scenario.

* Visemes - [Visemes](how-to-speech-synthesis-viseme.md) are the key poses in observed speech, including the position of the lips, jaw and tongue when producing a particular phoneme. Visemes have a strong correlation with voices and phonemes. Using viseme events in Speech SDK, you can generate facial animation data, which can be used to animate faces in lip-reading communication, education, entertainment, and customer service. Viseme is currently only supported for the `en-US` English (United States) [neural voices](language-support.md#text-to-speech).

> [!NOTE]
>
> The traditional/standard voices and non-neural custom voice will be retired and no longer be supported in 2024. If your applications, tools, or products are using any of the standard voices and custom voices, we've created guides to help you migrate to the neural version.
>
> * [Migrate to neural voices](migration-overview-neural-voice.md)

## Get started

See the [quickstart](get-started-text-to-speech.md) to get started with Text-to-Speech. The Text-to-Speech service is available via the [Speech SDK](speech-sdk.md), the [REST API](rest-text-to-speech.md), and the [Speech CLI](spx-overview.md)

## Sample code

Sample code for Text-to-Speech is available on GitHub. These samples cover Text-to-Speech conversion in most popular programming languages.

* [Text-to-Speech samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
* [Text-to-Speech samples (REST)](https://github.com/Azure-Samples/Cognitive-Speech-TTS)

## Custom neural voice

In addition to prebuilt neural voices, you can create and fine-tune custom neural voices unique to your product or brand. All it takes to get started are a handful of audio files and the associated transcriptions. For more information, see [Get started with custom neural voice](how-to-custom-voice.md)

## Pricing note

When using the Text-to-Speech service, you are billed for each character that is converted to speech, including punctuation. While the SSML document itself is not billable, optional elements that are used to adjust how the text is converted to speech, like phonemes and pitch, are counted as billable characters. Here's a list of what's billable:

* Text passed to the Text-to-Speech service in the SSML body of the request
* All markup within the text field of the request body in the SSML format, except for `<speak>` and `<voice>` tags
* Letters, punctuation, spaces, tabs, markup, and all white-space characters
* Every code point defined in Unicode

For detailed information, see [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

> [!IMPORTANT]
> Each Chinese, Japanese, and Korean language character is counted as two characters for billing.

## Reference docs

* [Speech SDK](speech-sdk.md)
* [REST API: Text-to-Speech](rest-text-to-speech.md)

## Next steps

* [Get a free Speech service subscription](overview.md#try-the-speech-service-for-free)
* [Get the Speech SDK](speech-sdk.md)
