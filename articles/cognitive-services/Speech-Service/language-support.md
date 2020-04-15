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

Both the Microsoft Speech SDK and the REST API support the following languages (locales). To improve accuracy, customization is offered for a subset of the languages through uploading Audio + Human-labeled Transcripts or Related Text: Sentences. Pronunciation customization is currently only available for `en-US` and `de-DE`. Learn more about customization [here](how-to-custom-speech.md).

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
| `ar-KW` | Arabic (Kuwait)                   | Yes       | No                                                |
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
| `te-IN` | Telugu (India)                    | Yes       | No                                                |
| `th-TH` | Thai (Thailand)                   | Yes       | No                                                |
| `tr-TR` | Turkish (Turkey)                  | Yes       | No                                                |
| `zh-CN` | Chinese (Mandarin, simplified)    | Yes       | Acoustic model<br>Language model                  |
| `zh-HK` | Chinese (Cantonese, Traditional)  | Yes       | Language model                                    |
| `zh-TW` | Chinese (Taiwanese Mandarin)      | Yes       | Language model                                    |

## Text-to-speech

Both the Microsoft Speech SDK and REST APIs support these voices, each of which supports a specific language and dialect, identified by locale.

> [!IMPORTANT]
> Pricing varies for standard, custom and neural voices. Please visit the [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) page for additional information.

### Neural voices

Neural text-to-speech is a new type of speech synthesis powered by deep neural networks. When using a neural voice, synthesized speech is nearly indistinguishable from the human recordings.

Neural voices can be used to make interactions with chatbots and voice assistants more natural and engaging, convert digital texts such as e-books into audiobooks and enhance in-car navigation systems. With the human-like natural prosody and clear articulation of words, neural voices significantly reduce listening fatigue when users interact with AI systems.

For more information about regional availability, see [regions](regions.md#standard-and-neural-voices).

| Locale  | Language            | Gender | Full service name mapping                                               | Short voice name        |
|---------|---------------------|--------|-------------------------------------------------------------------------|-------------------------|
| `de-DE` | German (Germany)    | Female | "Microsoft Server Speech Text to Speech Voice (de-DE, KatjaNeural)"     | "de-DE-KatjaNeural"     |
| `en-US` | English (US)        | Female | "Microsoft Server Speech Text to Speech Voice (en-US, AriaNeural)"      | "en-US-AriaNeural"      |
| `en-US` | English (US)        | Male   | "Microsoft Server Speech Text to Speech Voice (en-US, GuyNeural)"       | "en-US-GuyNeural"       |
| `it-IT` | Italian (Italy)     | Female | "Microsoft Server Speech Text to Speech Voice (it-IT, ElsaNeural)"      | "it-IT-ElsaNeural"      |
| `pt-BR` | Portuguese (Brazil) | Female | "Microsoft Server Speech Text to Speech Voice (pt-BR, FranciscaNeural)" | "pt-BR-FranciscaNeural" |
| `zh-CN` | Chinese (Mandarin, simplified)  | Female | "Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoxiaoNeural)"  | "zh-CN-XiaoxiaoNeural"  |

> [!IMPORTANT]
> The `en-US-JessaNeural` voice has changed to `en-US-AriaNeural`. If you were using "Jessa" before, convert over to "Aria".

To learn how you can configure and adjust neural voices, see [Speech synthesis markup language](speech-synthesis-markup.md#adjust-speaking-styles).

> [!TIP]
> You can use either the full service name mapping or the short voice name in your speech synthesis requests.

### Standard voices

More than 75 standard voices are available in over 45 languages and locales, which allow you to convert text into synthesized speech. For more information about regional availability, see [regions](regions.md#standard-and-neural-voices).

| Locale | Language | Gender | Full service name mapping | Short name |
|--|--|--|--|--|
| <sup>1</sup>`ar-EG` | Arabic (Egypt) | Female | "Microsoft Server Speech Text to Speech Voice (ar-EG, Hoda)" | "ar-EG-Hoda" |
| `ar-SA` | Arabic (Saudi Arabia) | Male | "Microsoft Server Speech Text to Speech Voice (ar-SA, Naayf)" | "ar-SA-Naayf" |
| `bg-BG` | Bulgarian | Male | "Microsoft Server Speech Text to Speech Voice (bg-BG, Ivan)" | "bg-BG-Ivan" |
| `ca-ES` | Catalan (Spain) | Female | "Microsoft Server Speech Text to Speech Voice (ca-ES, HerenaRUS)" | "ca-ES-HerenaRUS" |
| `cs-CZ` | Czech | Male | "Microsoft Server Speech Text to Speech Voice (cs-CZ, Jakub)" | "cs-CZ-Jakub" |
| `da-DK` | Danish | Female | "Microsoft Server Speech Text to Speech Voice (da-DK, HelleRUS)" | "da-DK-HelleRUS" |
| `de-AT` | German (Austria) | Male | "Microsoft Server Speech Text to Speech Voice (de-AT, Michael)" | "de-AT-Michael" |
| `de-CH` | German (Switzerland) | Male | "Microsoft Server Speech Text to Speech Voice (de-CH, Karsten)" | "de-CH-Karsten" |
| `de-DE` | German (Germany) | Female | "Microsoft Server Speech Text to Speech Voice (de-DE, Hedda)" | "de-DE-Hedda" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (de-DE, HeddaRUS)" | "de-DE-HeddaRUS" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (de-DE, Stefan, Apollo)" | "de-DE-Stefan-Apollo" |
| `el-GR` | Greek | Male | "Microsoft Server Speech Text to Speech Voice (el-GR, Stefanos)" | "el-GR-Stefanos" |
| `en-AU` | English (Australia) | Female | "Microsoft Server Speech Text to Speech Voice (en-AU, Catherine)" | "en-AU-Catherine" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (en-AU, HayleyRUS)" | "en-AU-HayleyRUS" |
| `en-CA` | English (Canada) | Female | "Microsoft Server Speech Text to Speech Voice (en-CA, Linda)" | "en-CA-Linda" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (en-CA, HeatherRUS)" | "en-CA-HeatherRUS" |
| `en-GB` | English (UK) | Female | "Microsoft Server Speech Text to Speech Voice (en-GB, Susan, Apollo)" | "en-GB-Susan-Apollo" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (en-GB, HazelRUS)" | "en-GB-HazelRUS" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (en-GB, George, Apollo)" | "en-GB-George-Apollo" |
| `en-IE` | English (Ireland) | Male | "Microsoft Server Speech Text to Speech Voice (en-IE, Sean)" | "en-IE-Sean" |
| `en-IN` | English (India) | Female | "Microsoft Server Speech Text to Speech Voice (en-IN, Heera, Apollo)" | "en-IN-Heera-Apollo" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (en-IN, PriyaRUS)" | "en-IN-PriyaRUS" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (en-IN, Ravi, Apollo)" | "en-IN-Ravi-Apollo" |
| `en-US` | English (US) | Female | "Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)" | "en-US-ZiraRUS" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (en-US, AriaRUS)" | "en-US-AriaRUS" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (en-US, BenjaminRUS)" | "en-US-BenjaminRUS" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (en-US, Guy24kRUS)" | "en-US-Guy24kRUS" |
| `es-ES` | Spanish (Spain) | Female | "Microsoft Server Speech Text to Speech Voice (es-ES, Laura, Apollo)" | "es-ES-Laura-Apollo" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (es-ES, HelenaRUS)" | "es-ES-HelenaRUS" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (es-ES, Pablo, Apollo)" | "es-ES-Pablo-Apollo" |
| `es-MX` | Spanish (Mexico) | Female | "Microsoft Server Speech Text to Speech Voice (es-MX, HildaRUS)" | "es-MX-HildaRUS" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (es-MX, Raul, Apollo)" | "es-MX-Raul-Apollo" |
| `fi-FI` | Finnish | Female | "Microsoft Server Speech Text to Speech Voice (fi-FI, HeidiRUS)" | "fi-FI-HeidiRUS" |
| `fr-CA` | French (Canada) | Female | "Microsoft Server Speech Text to Speech Voice (fr-CA, Caroline)" | "fr-CA-Caroline" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (fr-CA, HarmonieRUS)" | "fr-CA-HarmonieRUS" |
| `fr-CH` | French (Switzerland) | Male | "Microsoft Server Speech Text to Speech Voice (fr-CH, Guillaume)" | "fr-CH-Guillaume" |
| `fr-FR` | French (France) | Female | "Microsoft Server Speech Text to Speech Voice (fr-FR, Julie, Apollo)" | "fr-FR-Julie-Apollo" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (fr-FR, HortenseRUS)" | "fr-FR-HortenseRUS" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (fr-FR, Paul, Apollo)" | "fr-FR-Paul-Apollo" |
| `he-IL` | Hebrew (Israel) | Male | "Microsoft Server Speech Text to Speech Voice (he-IL, Asaf)" | "he-IL-Asaf" |
| `hi-IN` | Hindi (India) | Female | "Microsoft Server Speech Text to Speech Voice (hi-IN, Kalpana, Apollo)" | "hi-IN-Kalpana-Apollo" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (hi-IN, Kalpana)" | "hi-IN-Kalpana" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (hi-IN, Hemant)" | "hi-IN-Hemant" |
| `hr-HR` | Croatian | Male | "Microsoft Server Speech Text to Speech Voice (hr-HR, Matej)" | "hr-HR-Matej" |
| `hu-HU` | Hungarian | Male | "Microsoft Server Speech Text to Speech Voice (hu-HU, Szabolcs)" | "hu-HU-Szabolcs" |
| `id-ID` | Indonesian | Male | "Microsoft Server Speech Text to Speech Voice (id-ID, Andika)" | "id-ID-Andika" |
| `it-IT` | Italian | Male | "Microsoft Server Speech Text to Speech Voice (it-IT, Cosimo, Apollo)" | "it-IT-Cosimo-Apollo" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (it-IT, LuciaRUS)" | "it-IT-LuciaRUS" |
| `ja-JP` | Japanese | Female | "Microsoft Server Speech Text to Speech Voice (ja-JP, Ayumi, Apollo)" | "ja-JP-Ayumi-Apollo" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (ja-JP, Ichiro, Apollo)" | "ja-JP-Ichiro-Apollo" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (ja-JP, HarukaRUS)" | "ja-JP-HarukaRUS" |
| `ko-KR` | Korean | Female | "Microsoft Server Speech Text to Speech Voice (ko-KR, HeamiRUS)" | "ko-KR-HeamiRUS" |
| `ms-MY` | Malay | Male | "Microsoft Server Speech Text to Speech Voice (ms-MY, Rizwan)" | "ms-MY-Rizwan" |
| `nb-NO` | Norwegian | Female | "Microsoft Server Speech Text to Speech Voice (nb-NO, HuldaRUS)" | "nb-NO-HuldaRUS" |
| `nl-NL` | Dutch | Female | "Microsoft Server Speech Text to Speech Voice (nl-NL, HannaRUS)" | "nl-NL-HannaRUS" |
| `pl-PL` | Polish | Female | "Microsoft Server Speech Text to Speech Voice (pl-PL, PaulinaRUS)" | "pl-PL-PaulinaRUS" |
| `pt-BR` | Portuguese (Brazil) | Female | "Microsoft Server Speech Text to Speech Voice (pt-BR, HeloisaRUS)" | "pt-BR-HeloisaRUS" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (pt-BR, Daniel, Apollo)" | "pt-BR-Daniel-Apollo" |
| `pt-PT` | Portuguese (Portugal) | Female | "Microsoft Server Speech Text to Speech Voice (pt-PT, HeliaRUS)" | "pt-PT-HeliaRUS" |
| `ro-RO` | Romanian | Male | "Microsoft Server Speech Text to Speech Voice (ro-RO, Andrei)" | "ro-RO-Andrei" |
| `ru-RU` | Russian | Female | "Microsoft Server Speech Text to Speech Voice (ru-RU, Irina, Apollo)" | "ru-RU-Irina-Apollo" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (ru-RU, Pavel, Apollo)" | "ru-RU-Pavel-Apollo" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (ru-RU, EkaterinaRUS)" | ru-RU-EkaterinaRUS |
| `sk-SK` | Slovak | Male | "Microsoft Server Speech Text to Speech Voice (sk-SK, Filip)" | "sk-SK-Filip" |
| `sl-SI` | Slovenian | Male | "Microsoft Server Speech Text to Speech Voice (sl-SI, Lado)" | "sl-SI-Lado" |
| `sv-SE` | Swedish | Female | "Microsoft Server Speech Text to Speech Voice (sv-SE, HedvigRUS)" | "sv-SE-HedvigRUS" |
| `ta-IN` | Tamil (India) | Male | "Microsoft Server Speech Text to Speech Voice (ta-IN, Valluvar)" | "ta-IN-Valluvar" |
| `te-IN` | Telugu (India) | Female | "Microsoft Server Speech Text to Speech Voice (te-IN, Chitra)" | "te-IN-Chitra" |
| `th-TH` | Thai | Male | "Microsoft Server Speech Text to Speech Voice (th-TH, Pattara)" | "th-TH-Pattara" |
| `tr-TR` | Turkish (Turkey) | Female | "Microsoft Server Speech Text to Speech Voice (tr-TR, SedaRUS)" | "tr-TR-SedaRUS" |
| `vi-VN` | Vietnamese | Male | "Microsoft Server Speech Text to Speech Voice (vi-VN, An)" | "vi-VN-An" |
| `zh-CN` | Chinese (Mandarin, simplified) | Female | "Microsoft Server Speech Text to Speech Voice (zh-CN, HuihuiRUS)" | "zh-CN-HuihuiRUS" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (zh-CN, Yaoyao, Apollo)" | "zh-CN-Yaoyao-Apollo" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (zh-CN, Kangkang, Apollo)" | "zh-CN-Kangkang-Apollo" |
| `zh-HK` | Chinese (Cantonese, Traditional) | Female | "Microsoft Server Speech Text to Speech Voice (zh-HK, Tracy, Apollo)" | "zh-HK-Tracy-Apollo" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (zh-HK, TracyRUS)" | "zh-HK-TracyRUS" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (zh-HK, Danny, Apollo)" | "zh-HK-Danny-Apollo" |
| `zh-TW` | Chinese (Taiwanese Mandarin) | Female | "Microsoft Server Speech Text to Speech Voice (zh-TW, Yating, Apollo)" | "zh-TW-Yating-Apollo" |
|  |  | Female | "Microsoft Server Speech Text to Speech Voice (zh-TW, HanHanRUS)" | "zh-TW-HanHanRUS" |
|  |  | Male | "Microsoft Server Speech Text to Speech Voice (zh-TW, Zhiwei, Apollo)" | "zh-TW-Zhiwei-Apollo" |

**1** *ar-EG supports Modern Standard Arabic (MSA).*

> [!IMPORTANT]
> The `en-US-Jessa` voice has changed to `en-US-Aria`. If you were using "Jessa" before, convert over to "Aria".

> [!TIP]
> You can use either the full service name mapping or the short voice name in your speech synthesis requests.

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

## Next steps

* [Get your Speech service trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](~/articles/cognitive-services/Speech-Service/quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-chsarp)
