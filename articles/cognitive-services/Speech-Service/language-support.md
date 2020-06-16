---
title: Language support - Speech service
titleSuffix: Azure Cognitive Services
description: The Speech service supports numerous languages for speech-to-text and text-to-speech conversion, along with speech translation. This article provides a comprehensive list of language support by service feature.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/26/2020
ms.author: trbye
ms.custom: seodec18
---

# Language and voice support for the Speech service

Language support varies by Speech service functionality. The following tables summarize language support for [Speech-to-text](#speech-to-text), [Text-to-speech](#text-to-speech), and [Speech translation](#speech-translation) service offerings.

## Speech-to-text

Both the Microsoft Speech SDK and the REST API support the following languages (locales). 

To improve accuracy, customization is offered for a subset of the languages through uploading **Audio + Human-labeled Transcripts** or **Related Text: Sentences**. To learn more about customization, see [Get started with Custom Speech](how-to-custom-speech.md).

<!--
To get the AM and ML bits:
https://westus.cris.ai/swagger/ui/index#/Custom%20Speech%20models%3A/GetSupportedLocalesForModels

To get pronunciation bits:
https://cris.ai -> Click on Adaptation Data -> scroll down to section "Pronunciation Datasets" -> Click on Import -> Locale: the list of locales there correspond to the supported locales
-->

| Locale  | Language                          | Supported | Customizations                                    |
|---------|-----------------------------------|-----------|---------------------------------------------------|
| `ar-AE` | Arabic (UAE)                      | Yes       | No                                                |
| `ar-BH` | Arabic (Bahrain), modern standard | Yes       | Language model                                    |
| `ar-EG` | Arabic (Egypt)                    | Yes       | Language model                                    |
| `ar-IL` | Arabic (Israel)                   | Yes       | No                                                |
| `ar-JO` | Arabic (Jordan)                   | Yes       | No                                                |
| `ar-KW` | Arabic (Kuwait)                   | Yes       | No                                                |
| `ar-LB` | Arabic (Lebanon)                  | Yes       | No                                                |
| `ar-PS` | Arabic (Palestine)                | Yes       | No                                                |
| `ar-QA` | Arabic (Qatar)                    | Yes       | No                                                |
| `ar-SA` | Arabic (Saudi Arabia)             | Yes       | No                                                |
| `ar-SY` | Arabic (Syria)                    | Yes       | Language model                                    |
| `ca-ES` | Catalan                           | Yes       | Language model                                    |
| `da-DK` | Danish (Denmark)                  | Yes       | Language model                                    |
| `de-DE` | German (Germany)                  | Yes       | Acoustic model<br>Language model<br>Pronunciation |
| `en-AU` | English (Australia)               | Yes       | Acoustic model<br>Language model                  |
| `en-CA` | English (Canada)                  | Yes       | Acoustic model<br>Language model                  |
| `en-GB` | English (United Kingdom)          | Yes       | Acoustic model<br>Language model<br>Pronunciation |
| `en-IN` | English (India)                   | Yes       | Acoustic model<br>Language model                  |
| `en-NZ` | English (New Zealand)             | Yes       | Acoustic model<br>Language model                  |
| `en-US` | English (United States)           | Yes       | Acoustic model<br>Language model<br>Pronunciation |
| `es-ES` | Spanish (Spain)                   | Yes       | Acoustic model<br>Language model                  |
| `es-MX` | Spanish (Mexico)                  | Yes       | Acoustic model<br>Language model                  |
| `fi-FI` | Finnish (Finland)                 | Yes       | Language model                                    |
| `fr-CA` | French (Canada)                   | Yes       | Acoustic model<br>Language model                  |
| `fr-FR` | French (France)                   | Yes       | Acoustic model<br>Language model<br>Pronunciation |
| `gu-IN` | Gujarati (Indian)                 | Yes       | Language model                                    |
| `hi-IN` | Hindi (India)                     | Yes       | Acoustic model<br>Language model                  |
| `it-IT` | Italian (Italy)                   | Yes       | Acoustic model<br>Language model<br>Pronunciation |
| `ja-JP` | Japanese (Japan)                  | Yes       | Language model                                    |
| `ko-KR` | Korean (Korea)                    | Yes       | Language model                                    |
| `mr-IN` | Marathi (India)                   | Yes       | Language model                                    |
| `nb-NO` | Norwegian (Bokmål) (Norway)       | Yes       | Language model                                    |
| `nl-NL` | Dutch (Netherlands)               | Yes       | Language model                                    |
| `pl-PL` | Polish (Poland)                   | Yes       | Language model                                    |
| `pt-BR` | Portuguese (Brazil)               | Yes       | Acoustic model<br>Language model<br>Pronunciation |
| `pt-PT` | Portuguese (Portugal)             | Yes       | Language model                                    |
| `ru-RU` | Russian (Russia)                  | Yes       | Acoustic model<br>Language model                  |
| `sv-SE` | Swedish (Sweden)                  | Yes       | Language model                                    |
| `ta-IN` | Tamil (India)                     | Yes       | Language model                                    |
| `te-IN` | Telugu (India)                    | Yes       | Language model                                    |
| `th-TH` | Thai (Thailand)                   | Yes       | No                                                |
| `tr-TR` | Turkish (Turkey)                  | Yes       | Language model                                    |
| `zh-CN` | Chinese (Mandarin, simplified)    | Yes       | Acoustic model<br>Language model                  |
| `zh-HK` | Chinese (Cantonese, Traditional)  | Yes       | Language model                                    |
| `zh-TW` | Chinese (Taiwanese Mandarin)      | Yes       | Language model                                    |

## Text-to-speech

Both the Microsoft Speech SDK and REST APIs support these voices, each of which supports a specific language and dialect, identified by locale. You can also get a full list of languages and voices supported for each specific region/endpoint through the [voices/list API](rest-text-to-speech.md#get-a-list-of-voices). 

> [!IMPORTANT]
> Pricing varies for standard, custom and neural voices. Please visit the [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) page for additional information.

### Neural voices

Neural text-to-speech is a new type of speech synthesis powered by deep neural networks. When using a neural voice, synthesized speech is nearly indistinguishable from the human recordings.

Neural voices can be used to make interactions with chatbots and voice assistants more natural and engaging, convert digital texts such as e-books into audiobooks and enhance in-car navigation systems. With the human-like natural prosody and clear articulation of words, neural voices significantly reduce listening fatigue when users interact with AI systems.

For more information about regional availability, see [regions](regions.md#standard-and-neural-voices).

|Locale  | Language            | Gender | Voice name | Style support |
|--|--|--|--|--|
| `de-DE` | German (Germany)                | Female | "de-DE-KatjaNeural"      | General |
| `en-AU` | English (Australia)             | Female | "en-AU-NatashaNeural"    | General |
| `en-CA` | English (Canada)                | Female | "en-CA-ClaraNeural"      | General |
| `en-GB` | English (UK)                    | Female | "en-GB-LibbyNeural"      | General |
|         |                                 | Female | "en-GB-MiaNeural"        | General |
| `en-US` | English (US)                    | Female | "en-US-AriaNeural"       | General, multiple voice styles available |
|         |                                 | Male   | "en-US-GuyNeural"        | General |
| `es-ES` | Spanish (Spain)                 | Female | "es-ES-ElviraNeural"     | General |
| `es-MX` | Spanish (Mexico)                | Female | "es-MX-DaliaNeural"      | General |
| `fr-CA` | French (Canada)                 | Female | "fr-CA-SylvieNeural"     | General |
| `fr-FR` | French (France)                 | Female | "fr-FR-DeniseNeural"     | General |
| `it-IT` | Italian (Italy)                 | Female | "it-IT-ElsaNeural"       | General |
| `ja-JP` | Japanese                        | Female | "ja-JP-NanamiNeural"     | General |
| `ko-KR` | Korean                          | Female | "ko-KR-SunHiNeural"      | General |
| `nb-NO` | Norwegian                       | Female | "nb-NO-IselinNeural"     | General |
| `pt-BR` | Portuguese (Brazil)             | Female | "pt-BR-FranciscaNeural"  | General |
| `tr-TR` | Turkish                         | Female | "tr-TR-EmelNeural"       | General |
| `zh-CN` | Chinese (Mandarin, simplified)  | Female | "zh-CN-XiaoxiaoNeural"   | General, multiple voice styles available |
|         |                                 | Female | "zh-CN-XiaoyouNeural"    | Kid voice, optimized for story narrating |
|         |                                 | Male   | "zh-CN-YunyangNeural"    | Optimized for news reading,  multiple voice styles available |
|         |                                 | Male   | "zh-CN-YunyeNeural"      | Optimized for story narrating |

> [!IMPORTANT]
> The `en-US-JessaNeural` voice has changed to `en-US-AriaNeural`. If you were using "Jessa" before, convert over to "Aria".

To learn how you can configure and adjust neural voices, see [Speech synthesis markup language](speech-synthesis-markup.md#adjust-speaking-styles).

> [!TIP]
> You can continue to use the full service name mapping like "Microsoft Server Speech Text to Speech Voice (en-US, AriaNeural)" in your speech synthesis requests.

### Standard voices

More than 75 standard voices are available in over 45 languages and locales, which allow you to convert text into synthesized speech. For more information about regional availability, see [regions](regions.md#standard-and-neural-voices).

| Locale | Language | Gender | Voice name |
|--|--|--|--|
| <sup>1</sup>`ar-EG` | Arabic (Egypt) | Female | "ar-EG-Hoda" |
| `ar-SA` | Arabic (Saudi Arabia) | Male | "ar-SA-Naayf" |
| `bg-BG` | Bulgarian | Male |  "bg-BG-Ivan" |
| `ca-ES` | Catalan | Female |  "ca-ES-HerenaRUS" |
| `cs-CZ` | Czech | Male | "cs-CZ-Jakub" |
| `da-DK` | Danish | Female |  "da-DK-HelleRUS" |
| `de-AT` | German (Austria) | Male | "de-AT-Michael" |
| `de-CH` | German (Switzerland) | Male |  "de-CH-Karsten" |
| `de-DE` | German (Germany) | Female |  "de-DE-Hedda" |
|  |  | Female | "de-DE-HeddaRUS" |
|  |  | Male |  "de-DE-Stefan-Apollo" |
| `el-GR` | Greek | Male | "el-GR-Stefanos" |
| `en-AU` | English (Australia) | Female |  "en-AU-Catherine" |
|  |  | Female |  "en-AU-HayleyRUS" |
| `en-CA` | English (Canada) | Female |  "en-CA-Linda" |
|  |  | Female |  "en-CA-HeatherRUS" |
| `en-GB` | English (UK) | Female |  "en-GB-Susan-Apollo" |
|  |  | Female |  "en-GB-HazelRUS" |
|  |  | Male |  "en-GB-George-Apollo" |
| `en-IE` | English (Ireland) | Male | "en-IE-Sean" |
| `en-IN` | English (India) | Female | "en-IN-Heera-Apollo" |
|  |  | Female |  "en-IN-PriyaRUS" |
|  |  | Male |  "en-IN-Ravi-Apollo" |
| `en-US` | English (US) | Female |  "en-US-ZiraRUS" |
|  |  | Female | "en-US-AriaRUS" |
|  |  | Male | "en-US-BenjaminRUS" |
|  |  | Male |  "en-US-Guy24kRUS" |
| `es-ES` | Spanish (Spain) | Female |  "es-ES-Laura-Apollo" |
|  |  | Female | "es-ES-HelenaRUS" |
|  |  | Male | "es-ES-Pablo-Apollo" |
| `es-MX` | Spanish (Mexico) | Female |  "es-MX-HildaRUS" |
|  |  | Male | "es-MX-Raul-Apollo" |
| `fi-FI` | Finnish | Female | "fi-FI-HeidiRUS" |
| `fr-CA` | French (Canada) | Female | "fr-CA-Caroline" |
|  |  | Female | "fr-CA-HarmonieRUS" |
| `fr-CH` | French (Switzerland) | Male | "fr-CH-Guillaume" |
| `fr-FR` | French (France) | Female |  "fr-FR-Julie-Apollo" |
|  |  | Female |"fr-FR-HortenseRUS" |
|  |  | Male |  "fr-FR-Paul-Apollo" |
| `he-IL` | Hebrew (Israel) | Male |  "he-IL-Asaf" |
| `hi-IN` | Hindi (India) | Female | "hi-IN-Kalpana-Apollo" |
|  |  | Female |  "hi-IN-Kalpana" |
|  |  | Male |  "hi-IN-Hemant" |
| `hr-HR` | Croatian | Male | "hr-HR-Matej" |
| `hu-HU` | Hungarian | Male |  "hu-HU-Szabolcs" |
| `id-ID` | Indonesian | Male | "id-ID-Andika" |
| `it-IT` | Italian | Male |  "it-IT-Cosimo-Apollo" |
|  |  | Female |  "it-IT-LuciaRUS" |
| `ja-JP` | Japanese | Female |  "ja-JP-Ayumi-Apollo" |
|  |  | Male | "ja-JP-Ichiro-Apollo" |
|  |  | Female |  "ja-JP-HarukaRUS" |
| `ko-KR` | Korean | Female | "ko-KR-HeamiRUS" |
| `ms-MY` | Malay | Male |  "ms-MY-Rizwan" |
| `nb-NO` | Norwegian | Female |  "nb-NO-HuldaRUS" |
| `nl-NL` | Dutch | Female |  "nl-NL-HannaRUS" |
| `pl-PL` | Polish | Female |  "pl-PL-PaulinaRUS" |
| `pt-BR` | Portuguese (Brazil) | Female | "pt-BR-HeloisaRUS" |
|  |  | Male |  "pt-BR-Daniel-Apollo" |
| `pt-PT` | Portuguese (Portugal) | Female | "pt-PT-HeliaRUS" |
| `ro-RO` | Romanian | Male | "ro-RO-Andrei" |
| `ru-RU` | Russian | Female |  "ru-RU-Irina-Apollo" |
|  |  | Male | "ru-RU-Pavel-Apollo" |
|  |  | Female |  ru-RU-EkaterinaRUS |
| `sk-SK` | Slovak | Male | "sk-SK-Filip" |
| `sl-SI` | Slovenian | Male |  "sl-SI-Lado" |
| `sv-SE` | Swedish | Female | "sv-SE-HedvigRUS" |
| `ta-IN` | Tamil (India) | Male |  "ta-IN-Valluvar" |
| `te-IN` | Telugu (India) | Female |  "te-IN-Chitra" |
| `th-TH` | Thai | Male |  "th-TH-Pattara" |
| `tr-TR` | Turkish (Turkey) | Female | "tr-TR-SedaRUS" |
| `vi-VN` | Vietnamese | Male |  "vi-VN-An" |
| `zh-CN` | Chinese (Mandarin, simplified) | Female |  "zh-CN-HuihuiRUS" |
|  |  | Female | "zh-CN-Yaoyao-Apollo" |
|  |  | Male | "zh-CN-Kangkang-Apollo" |
| `zh-HK` | Chinese (Cantonese, Traditional) | Female |  "zh-HK-Tracy-Apollo" |
|  |  | Female | "zh-HK-TracyRUS" |
|  |  | Male |  "zh-HK-Danny-Apollo" |
| `zh-TW` | Chinese (Taiwanese Mandarin) | Female |  "zh-TW-Yating-Apollo" |
|  |  | Female | "zh-TW-HanHanRUS" |
|  |  | Male |  "zh-TW-Zhiwei-Apollo" |

**1** *ar-EG supports Modern Standard Arabic (MSA).*

> [!IMPORTANT]
> The `en-US-Jessa` voice has changed to `en-US-Aria`. If you were using "Jessa" before, convert over to "Aria".

> [!TIP]
> You can continue to use the full service name mapping like "Microsoft Server Speech Text to Speech Voice (en-US, AriaRUS)" in your speech synthesis requests.

### Customization

Voice customization is available for `de-DE`, `en-GB`, `en-IN`, `en-US`, `es-MX`, `fr-FR`, `it-IT`, `pt-BR`, and `zh-CN`. Select the right locale that matches the training data you have to train a custom voice model. For example, if the recording data you have is spoken in English with a British accent, select `en-GB`.

> [!NOTE]
> We do not support bi-lingual model training in Custom Voice, except for the Chinese-English bi-lingual. Select "Chinese-English bilingual" if you want to train a Chinese voice that can speak English as well. Voice training in all locales starts with a data set of 2,000+ utterances, except for the `en-US` and `zh-CN` where you can start with any size of training data.

## Speech translation

The **Speech Translation** API supports different languages for speech-to-speech and speech-to-text translation. The source language must always be from the Speech-to-text language table. The available target languages depend on whether the translation target is speech or text. You may translate incoming speech into more than [60 languages](https://www.microsoft.com/translator/business/languages/). A subset of languages are available for [speech synthesis](language-support.md#text-languages).

### Text languages

| Text language           | Language code |
|:------------------------|:-------------:|
| Afrikaans               | `af`          |
| Arabic                  | `ar`          |
| Bangla                  | `bn`          |
| Bosnian (Latin)         | `bs`          |
| Bulgarian               | `bg`          |
| Cantonese (Traditional) | `yue`         |
| Catalan                 | `ca`          |
| Chinese Simplified      | `zh-Hans`     |
| Chinese Traditional     | `zh-Hant`     |
| Croatian                | `hr`          |
| Czech                   | `cs`          |
| Danish                  | `da`          |
| Dutch                   | `nl`          |
| English                 | `en`          |
| Estonian                | `et`          |
| Fijian                  | `fj`          |
| Filipino                | `fil`         |
| Finnish                 | `fi`          |
| French                  | `fr`          |
| German                  | `de`          |
| Greek                   | `el`          |
| Gujarati                | `gu`          |
| Haitian Creole          | `ht`          |
| Hebrew                  | `he`          |
| Hindi                   | `hi`          |
| Hmong Daw               | `mww`         |
| Hungarian               | `hu`          |
| Indonesian              | `id`          |
| Irish                   | `ga`          |
| Italian                 | `it`          |
| Japanese                | `ja`          |
| Kannada                 | `kn`          |
| Kiswahili               | `sw`          |
| Klingon                 | `tlh`         |
| Klingon (plqaD)         | `tlh-Qaak`    |
| Korean                  | `ko`          |
| Latvian                 | `lv`          |
| Lithuanian              | `lt`          |
| Malagasy                | `mg`          |
| Malay                   | `ms`          |
| Malayalam               | `ml`          |
| Maltese                 | `mt`          |
| Maori                   | `mi`          |
| Marathi                 | `mr`          |
| Norwegian               | `nb`          |
| Persian                 | `fa`          |
| Polish                  | `pl`          |
| Portuguese (Brazil)     | `pt-br`       |
| Portuguese (Portugal)   | `pt-pt`       |
| Punjabi                 | `pa`          |
| Queretaro Otomi         | `otq`         |
| Romanian                | `ro`          |
| Russian                 | `ru`          |
| Samoan                  | `sm`          |
| Serbian (Cyrillic)      | `sr-Cyrl`     |
| Serbian (Latin)         | `sr-Latn`     |
| Slovak                  | `sk`          |
| Slovenian               | `sl`          |
| Spanish                 | `es`          |
| Swedish                 | `sv`          |
| Tahitian                | `ty`          |
| Tamil                   | `ta`          |
| Telugu                  | `te`          |
| Thai                    | `th`          |
| Tongan                  | `to`          |
| Turkish                 | `tr`          |
| Ukrainian               | `uk`          |
| Urdu                    | `ur`          |
| Vietnamese              | `vi`          |
| Welsh                   | `cy`          |
| Yucatec Maya            | `yua`         |

## Speaker Recognition

See the following table for supported languages for the various Speaker Recognition APIs. See the [overview](speaker-recognition-overview.md) for additional information on Speaker Recognition.

| Locale | Language | Text-dependent verification | Text-independent verification | Text-independent identification |
|----|----|----|----|----|
| en-US | English (US) | yes | yes | yes |
|zh-CN	|Chinese (Mandarin, simplified)|	n/a|	yes|	yes|
|de-DE	|German (Germany)	|n/a	|yes	|yes|
|en-GB	|English (UK)	|n/a	|yes	|yes|
|fr-FR	|French (France)	|n/a	|yes	|yes|
|en-AU	|English (Australia)	|n/a	|yes	|yes|
|en-CA	|English (Canada)	|n/a|	yes|	yes|
|fr-CA	|French (Canada)	|n/a	|yes|	yes|
|it-IT	|Italian|	n/a	|yes|	yes|
|es-ES|	Spanish (Spain)	|n/a	|yes|	yes|
|es-MX	|Spanish (Mexico)	|n/a|	yes|	yes|
|ja-JP|	Japanese	|n/a	|yes	|yes|
|pt-BR|	Portuguese (Brazil)|	n/a|	yes|	yes|
|ko-KR|	Korean	|n/a	|yes|	yes|

## Next steps

* [Get your Speech service trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](~/articles/cognitive-services/Speech-Service/quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-chsarp)
