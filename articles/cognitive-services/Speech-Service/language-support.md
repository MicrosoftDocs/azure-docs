---
title: Language support - Speech service
titleSuffix: Azure Cognitive Services
description: The Speech service supports numerous languages for speech-to-text and text-to-speech conversion, along with speech translation. This article provides a comprehensive list of language support by service feature.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/12/2023
ms.author: eur
ms.custom: references_regions
---

# Language and voice support for the Speech service

The following tables summarize language support for [speech-to-text](speech-to-text.md), [text-to-speech](text-to-speech.md), [pronunciation assessment](how-to-pronunciation-assessment.md), [speech translation](speech-translation.md), [speaker recognition](speaker-recognition-overview.md), and additional service features.

You can also get a list of locales and voices supported for each specific region or endpoint through the [Speech SDK](speech-sdk.md), [Speech-to-text REST API](rest-speech-to-text.md), [Speech-to-text REST API for short audio](rest-speech-to-text-short.md) and [Text-to-speech REST API](rest-text-to-speech.md#get-a-list-of-voices).

## Supported languages

Language support varies by Speech service functionality. 

> [!NOTE]
> See [Speech Containers](speech-container-overview.md#available-speech-containers) and [Embedded Speech](embedded-speech.md#models-and-voices) separately for their supported languages.

**Choose a Speech feature**

# [Speech-to-text](#tab/stt)

The table in this section summarizes the locales and voices supported for Speech-to-text. Please see the table footnotes for more details. 

Additional remarks for Speech-to-text locales are included in the [Custom Speech](#custom-speech) section below. 

> [!TIP]
> Try out the [Real-time Speech-to-text tool](https://speech.microsoft.com/portal/speechtotexttool) without having to use any code.

[!INCLUDE [Language support include](includes/language-support/stt.md)]

### Custom Speech

To improve Speech-to-text recognition accuracy, customization is available for some languages and base models. Depending on the locale, you can upload audio + human-labeled transcripts, plain text, structured text, and pronunciation data. By default, plain text customization is supported for all available base models. To learn more about customization, see [Custom Speech](./custom-speech-overview.md).

# [Text-to-speech](#tab/tts)

The tables in this section summarizes the locales and voices supported for Text-to-speech. Please see the table footnotes for more details.

Additional remarks for Text-to-speech locales are included in the [Voice styles and roles](#voice-styles-and-roles), [Prebuilt neural voices](#prebuilt-neural-voices), and [Custom Neural Voice](#custom-neural-voice) sections below. 

> [!TIP]
> Check the the [Voice Gallery](https://speech.microsoft.com/portal/voicegallery) and determine the right voice for your business needs. 

[!INCLUDE [Language support include](includes/language-support/tts.md)]

### Voice styles and roles

In some cases, you can adjust the speaking style to express different emotions like cheerfulness, empathy, and calm. You can optimize the voice for different scenarios like customer service, newscast, and voice assistant. With roles, the same voice can act as a different age and gender.

To learn how you can configure and adjust neural voice styles and roles, see [Speech Synthesis Markup Language](speech-synthesis-markup-voice.md#speaking-styles-and-roles).

Use the following table to determine supported styles and roles for each neural voice.

[!INCLUDE [Language support include](includes/language-support/voice-styles-and-roles.md)]

### Prebuilt neural voices

Each prebuilt neural voice supports a specific language and dialect, identified by locale. You can try the demo and hear the voices in the [Voice Gallery](https://speech.microsoft.com/portal/voicegallery).

> [!IMPORTANT]
> Pricing varies for Prebuilt Neural Voice (see *Neural* on the pricing page) and Custom Neural Voice (see *Custom Neural* on the pricing page). For more information, see the [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) page.

Each prebuilt neural voice model is available at 24kHz and high-fidelity 48kHz. Other sample rates can be obtained through upsampling or downsampling when synthesizing.

Please note that the following neural voices are retired.

- The English (United Kingdom) voice `en-GB-MiaNeural` retired on October 30, 2021. All service requests to `en-GB-MiaNeural` will be redirected to `en-GB-SoniaNeural` automatically as of October 30, 2021. If you're using container Neural TTS, [download](speech-container-ntts.md#get-the-container-image-with-docker-pull) and deploy the latest version. Starting from October 30, 2021, all requests with previous versions will not succeed.
- The `en-US-JessaNeural` voice is retired and replaced by `en-US-AriaNeural`. If you were using "Jessa" before, convert  to "Aria." 

### Custom Neural Voice

Custom Neural Voice lets you create synthetic voices that are rich in speaking styles. You can create a unique brand voice in multiple languages and styles by using a small set of recording data. There are two Custom Neural Voice (CNV) project types: CNV Pro and CNV Lite (preview). 

Select the right locale that matches your training data to train a custom neural voice model. For example, if the recording data is spoken in English with a British accent, select `en-GB`. 

With the cross-lingual feature (preview), you can transfer your custom neural voice model to speak a second language. For example, with the `zh-CN` data, you can create a voice that speaks `en-AU` or any of the languages with Cross-lingual support.

[!INCLUDE [Language support include](includes/language-support/tts-cnv.md)]

# [Pronunciation assessment](#tab/pronunciation-assessment)

The table in this section summarizes the locales supported for Pronunciation assessment, and each language is available on all [Speech-to-text regions](regions.md#speech-service).

[!INCLUDE [Language support include](includes/language-support/pronunciation-assessment.md)]

# [Speech translation](#tab/speech-translation)

The table in this section summarizes the locales supported for Speech translation. Speech translation supports different languages for speech-to-speech and speech-to-text translation. The available target languages depend on whether the translation target is speech or text. 

#### Translate from language

To set the input speech recognition language, specify the full locale with a dash (`-`) separator. See the [speech-to-text language table](?tabs=stt#supported-languages). The default language is `en-US` if you don't specify a language.

#### Translate to text language

To set the translation target language, with few exceptions you only specify the language code that precedes the locale dash (`-`) separator. For example, use `es` for Spanish (Spain) instead of `es-ES`. See the speech translation target language table below. The default language is `en` if you don't specify a language.

[!INCLUDE [Language support include](includes/language-support/speech-translation.md)]

# [Language identification](#tab/language-identification)

The table in this section summarizes the locales supported for [Language identification](language-identification.md).
> [!NOTE]
> Language Identification compares speech at the language level, such as English and German. Do not include multiple locales of the same language in your candidate list.

[!INCLUDE [Language support include](includes/language-support/language-identification.md)]

# [Speaker recognition](#tab/speaker-recognition)

The table in this section summarizes the locales supported for Speaker recognition. Speaker recognition is mostly language agnostic. The universal model for text-independent speaker recognition combines various data sources from multiple languages. We've tuned and evaluated the model on these languages and locales. For more information on speaker recognition, see the [overview](speaker-recognition-overview.md).

[!INCLUDE [Language support include](includes/language-support/speaker-recognition.md)]

# [Custom keyword](#tab/custom-keyword)

The table in this section summarizes the locales supported for custom keyword and keyword verification.

[!INCLUDE [Language support include](includes/language-support/custom-keyword.md)]

# [Intent Recognition](#tab/intent-recognizer-pattern-matcher)

The table in this section summarizes the locales supported for the Intent Recognizer Pattern Matcher.

[!INCLUDE [Language support include](includes/language-support/intent-recognizer-pattern-matcher.md)]

***

## Next steps

* [Region support](regions.md)
