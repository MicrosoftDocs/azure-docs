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
ms.date: 08/21/2022
ms.author: eur
ms.custom: references_regions, ignite-fall-2021
---

# Language and voice support for the Speech service

The following tables summarize language support for [speech-to-text](speech-to-text.md), [text-to-speech](text-to-speech.md), [pronunciation assessment](how-to-pronunciation-assessment.md), [speech translation](speech-translation.md), [speaker recognition](speaker-recognition-overview.md), and additional service features.

## Supported languages

Language support varies by Speech service functionality. 

**Choose a service or feature**

# [Speech-to-text and Text-to-speech](#tab/stt-tts)

The following table summarizes locale and voice support for Speech-to-text and Text-to-speech. Please see the table footnotes for additional information.

[!INCLUDE [Language support include](includes/language-support/stt-tts.md)]

### Speech-to-text

To improve accuracy, customization is available for some languages and base model versions by uploading audio + human-labeled transcripts, plain text, structured text, and pronunciation. By default, plain text customization is supported for all available base models. To learn more about customization, see [Custom Speech](./custom-speech-overview.md).

### Text-to-speech

Each prebuilt neural voice supports a specific language and dialect, identified by locale. You can try the demo and hear the voices on [this website](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#features).

You can also get a full list of languages and voices supported for each specific region or endpoint through the [voices list API](rest-text-to-speech.md#get-a-list-of-voices). To learn how you can configure and adjust neural voices, such as Speaking Styles, see [Speech Synthesis Markup Language](speech-synthesis-markup.md#adjust-speaking-styles).

> [!IMPORTANT]
> Pricing varies for Prebuilt Neural Voice (referred to as *Neural* on the pricing page) and Custom Neural Voice (referred to as *Custom Neural* on the pricing page). For more information, see the [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) page.

#### Custom Neural Voice

Custom Neural Voice lets you create synthetic voices that are rich in speaking styles. You can create a unique brand voice in multiple languages and styles by using a small set of recording data. There are two Custom Neural Voice (CNV) project types: CNV Pro and CNV Lite (preview). 

Select the right locale that matches your training data to train a custom neural voice model. For example, if the recording data is spoken in English with a British accent, select `en-GB`. 

With the cross-lingual feature (preview), you can transfer your custom neural voice model to speak a second language. For example, with the `zh-CN` data, you can create a voice that speaks `en-AU` or any of the languages with Cross-lingual support.  

#### Prebuilt neural voices

Prebuilt neural voices are created from samples that use a 24-khz sample rate. All voices can upsample or downsample to other sample rates when synthesizing.

Please note that the following neural voices are retired.

- The English (United Kingdom) voice `en-GB-MiaNeural` retired on October 30, 2021. All service requests to `en-GB-MiaNeural` will be redirected to `en-GB-SoniaNeural` automatically as of October 30, 2021. If you're using container Neural TTS, [download](speech-container-howto.md#get-the-container-image-with-docker-pull) and deploy the latest version. Starting from October 30, 2021, all requests with previous versions will not succeed.
- The `en-US-JessaNeural` voice is retired and replaced by `en-US-AriaNeural`. If you were using "Jessa" before, convert  to "Aria." 

#### Voice styles and roles

In some cases, you can adjust the speaking style to express different emotions like cheerfulness, empathy, and calm. You can optimize the voice for different scenarios like customer service, newscast, and voice assistant. With roles, the same voice can act as a different age and gender.

To learn how you can configure and adjust neural voice styles and roles, see [Speech Synthesis Markup Language](speech-synthesis-markup.md#adjust-speaking-styles).

Use the following table to determine supported styles and roles for each neural voice.

[!INCLUDE [Language support include](includes/language-support/voice-styles-and-roles.md)]

# [Pronunciation assessment](#tab/pronunciation-assessment)

The following table lists the released languages and public preview languages.

[!INCLUDE [Language support include](includes/language-support/pronunciation-assessment.md)]

# [Speech translation](#tab/speech-translation)

Speech Translation supports different languages for speech-to-speech and speech-to-text translation. The available target languages depend on whether the translation target is speech or text. 

#### Translate from language

To set the input speech recognition language, specify the full locale with a dash (`-`) separator. See the [speech-to-text language table](?tabs=stt-tts#supported-languages). The default language is `en-US` if you don't specify a language.

#### Translate to text language

To set the translation target language, with few exceptions you only specify the language code that precedes the locale dash (`-`) separator. For example, use `es` for Spanish (Spain) instead of `es-ES`. See the speech translation target language table below. The default language is `en` if you don't specify a language.

[!INCLUDE [Language support include](includes/language-support/speech-translation.md)]

# [Language identification](#tab/language-identification)

With language identification, the Speech service compares speech at the language level, such as English and German. If you include multiple locales of the same language, for example, `en-IN` and `en-US`, we'll only compare English (`en`) with the other candidate languages. The supported languages and locales are listed in the following table.

[!INCLUDE [Language support include](includes/language-support/language-identification.md)]

# [Speaker recognition](#tab/speaker-recognition)

Speaker recognition is mostly language agnostic. We built a universal model for text-independent speaker recognition by combining various data sources from multiple languages. We've tuned and evaluated the model on the languages and locales that appear in the following table. For more information on speaker recognition, see the [overview](speaker-recognition-overview.md).

[!INCLUDE [Language support include](includes/language-support/speaker-recognition.md)]

# [Custom keyword](#tab/custom-keyword)

The following table outlines supported languages for custom keyword and keyword verification.

[!INCLUDE [Language support include](includes/language-support/custom-keyword.md)]

# [Intent Recognition](#tab/intent-recognizer-pattern-matcher)

The Intent Recognizer Pattern Matcher supports the following locales:

[!INCLUDE [Language support include](includes/language-support/intent-recognizer-pattern-matcher.md)]

***

## Next steps

* [Region support](regions.md)
