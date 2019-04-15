---
title: Language support - Speech Services
titleSuffix: Azure Cognitive Services
description: The Azure Speech Services support numerous languages for speech-to-text and text-to-speech conversion, along with speech translation. This article provides a comprehensive list of language support by service.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/19/2019
ms.author: erhopf
ms.custom: seodec18
---

# Language and region support for the Speech Services

Different languages are supported for different Speech Services functions. The following tables summarize language support.

## Speech-to-text

The Microsoft speech recognition API supports the following languages. Different levels of customization are available for each language.

  Code | Language | [Acoustic adaptation](how-to-customize-acoustic-models.md) | [Language adaptation](how-to-customize-language-model.md) | [Pronunciation adaptation](how-to-customize-pronunciation.md)
 ------|----------|---------------------|---------------------|-------------------------
 ar-EG | Arabic (Egypt), modern standard | No | Yes | No
 ca-ES | Catalan (Spain) | No | No | No
 da-DK | Danish (Denmark) | No | No | No
 de-DE | German (Germany) | Yes | Yes | No
 en-AU | English (Australia) | No | Yes | Yes
 en-CA | English (Canada) | No | Yes | Yes
 en-GB | English (United Kingdom) | No | Yes | Yes
 en-IN | English (India) | Yes | Yes | Yes
 en-NZ | English (New Zealand) | No | Yes | Yes  
 en-US | English (United States) | Yes | Yes | Yes
 es-ES | Spanish (Spain) | Yes | Yes | No
 es-MX | Spanish (Mexico) | No | Yes | No
 fi-FI | Finnish (Finland) | No | No | No
 fr-CA | French (Canada) | No | Yes | No
 fr-FR | French (France) | Yes | Yes | No
 hi-IN | Hindi (India) | No | Yes | No
 it-IT | Italian (Italy) | Yes | Yes | No
 ja-JP | Japanese (Japan) | No | Yes | No
 ko-KR | Korean (Korea) | No | Yes | No
 nb-NO | Norwegian (Bokmål) (Norway) | No | No | No
 nl-NL | Dutch (Netherlands) | No | Yes | No
 pl-PL | Polish (Poland) | No | No | No
 pt-BR | Portuguese (Brazil) | Yes | Yes | No
 pt-PT | Portuguese (Portugal) | No | Yes | No
 ru-RU | Russian (Russia) | Yes | Yes | No
 sv-SE | Swedish (Sweden) | No | No | No
 zh-CN | Chinese (Mandarin, simplified) | Yes | Yes | No
 zh-HK | Chinese (Cantonese, Traditional) | No | Yes | No
 zh-TW | Chinese (Taiwanese Mandarin) | No | Yes | No
 th-TH | Thai (Thailand) | No | No | No


## Text-to-speech

The text-to-speech REST API supports these voices, each of which supports a specific language and dialect, identified by locale.

> [!IMPORTANT]
> Pricing varies for standard, custom and neural voices. Please visit the [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) page for additional information.

### Neural voices 

Neural text-to-speech is a new type of speech synthesis powered by deep neural networks. When using a neural voice, synthesized speech is nearly indistinguishable from the human recordings.

Neural voices can be used to make interactions with chatbots and virtual assistants more natural and engaging, convert digital texts such as e-books into audiobooks and enhance in-car navigation systems. With the human-like natural prosody and clear articulation of words, neural voices significantly reduce listening fatigue when users interact with AI systems.

For a full list of neural voices and regional availability, see [regions](regions.md#standard-and-neural-voices).

| Locale | Language | Gender | Voice Name |
|--------|----------|--------|---------------------|
| de-DE | German (Germany) | Female | de-DE-KatjaNeural |
| en-US | English (US) | Male | en-US-GuyNeural |
| en-US | English (US) | Female | en-US-JessaNeural |
| it-IT | Italian (Italy) | Female | it-IT-ElsaNeural |
| zh-CN | Chinese | Female | zh-CN-XiaoxiaoNeural |

### Standard voices

More than 75 standard voices are available in over 45 languages and locales, which allow you to convert text into synthesized speech. For more information about regional availability, see [regions](regions.md#standard-and-neural-voices).

Locale | Language | Gender | Service name mapping
-------|----------|---------|--------------------
ar-EG\* | Arabic (Egypt) | Female | ar-EG-Hoda
ar-SA | Arabic (Saudi Arabia) | Male | ar-SA-Naayf
bg-BG | Bulgarian | Male | bg-BG-Ivan
ca-ES | Catalan (Spain) | Female | ca-ES-HerenaRUS
cs-CZ | Czech | Male | cs-CZ-Jakub
da-DK | Danish | Female | da-DK-HelleRUS
de-AT | German (Austria) | Male | de-AT-Michael
de-CH | German (Switzerland) | Male | de-CH-Karsten
de-DE | German (Germany) | Female | de-DE-Hedda
| | | Female | de-DE-HeddaRUS
| | | Male | de-DE-Stefan-Apollo
el-GR | Greek | Male | el-GR-Stefanos
en-AU | English (Australia) | Female | en-AU-Catherine
| | | Female | en-AU-HayleyRUS
en-CA | English (Canada) | Female | en-CA-Linda
| | | Female | en-CA-HeatherRUS
en-GB | English (UK) | Female | en-GB-Susan-Apollo
| | | Female | en-GB-HazelRUS
| | | Male | en-GB-George-Apollo
en-IE | English (Ireland) | Male | en-IE-Sean
en-IN | English (India) | Female | en-IN-Heera-Apollo
| | | Female | en-IN-PriyaRUS
| | | Male | en-IN-Ravi-Apollo
en-US | English (US) | Female | en-US-ZiraRUS
| | | Female | en-US-JessaRUS
| | | Male | en-US-BenjaminRUS
| | | Female | en-US-Jessa24kRUS
| | | Male | en-US-Guy24kRUS
es-ES | Spanish (Spain) |Female | es-ES-Laura-Apollo
| | | Female | es-ES-HelenaRUS
| | | Male | es-ES-Pablo-Apollo
es-MX | Spanish (Mexico) | Female | es-MX-HildaRUS
| | | Male | es-MX-Raul-Apollo
fi-FI | Finnish | Female | fi-FI-HeidiRUS
fr-CA | French (Canada) |Female | fr-CA-Caroline
| | | Female | fr-CA-HarmonieRUS
fr-CH | French (Switzerland)| Male | fr-CH-Guillaume
fr-FR | French (France)| Female | fr-FR-Julie-Apollo
| | | Female | fr-FR-HortenseRUS
| | | Male | fr-FR-Paul-Apollo
he-IL| Hebrew (Israel) | Male| he-IL-Asaf
hi-IN | Hindi (India) | Female | hi-IN-Kalpana-Apollo
| | |Female | hi-IN-Kalpana
| | | Male | hi-IN-Hemant
hr-HR | Croatian | Male | hr-HR-Matej
hu-HU | Hungarian | Male | hu-HU-Szabolcs
id-ID | Indonesian| Male | id-ID-Andika
it-IT | Italian | Male | it-IT-Cosimo-Apollo
| | | Female | it-IT-LuciaRUS
ja-JP | Japanese | Female | ja-JP-Ayumi-Apollo
| | | Male | ja-JP-Ichiro-Apollo
| | | Female | ja-JP-HarukaRUS
ko-KR | Korean | Female | ko-KR-HeamiRUS
ms-MY | Malay | Male | ms-MY-Rizwan
nb-NO | Norwegian | Female | nb-NO-HuldaRUS
nl-NL | Dutch | Female | nl-NL-HannaRUS
pl-PL | Polish | Female | pl-PL-PaulinaRUS
pt-BR | Portuguese (Brazil) | Female | pt-BR-HeloisaRUS
| | | Male |pt-BR-Daniel-Apollo
pt-PT | Portuguese (Portugal) | Female | pt-PT-HeliaRUS
ro-RO | Romanian | Male | ro-RO-Andrei
ru-RU |Russian| Female | ru-RU-Irina-Apollo
| | | Male | ru-RU-Pavel-Apollo
| | | Female | ru-RU-EkaterinaRUS
sk-SK | Slovak | Male | sk-SK-Filip
sl-SI | Slovenian | Male | sl-SI-Lado
sv-SE | Swedish | Female | sv-SE-HedvigRUS
ta-IN | Tamil (India) | Male | ta-IN-Valluvar
te-IN | Telugu (India) | Female | te-IN-Chitra
th-TH | Thai | Male | th-TH-Pattara
tr-TR | Turkish | Female | tr-TR-SedaRUS
vi-VN | Vietnamese | Male | vi-VN-An
zh-CN | Chinese (Mainland) | Female | zh-CN-HuihuiRUS
| | | Female | zh-CN-Yaoyao-Apollo
| | | Male | zh-CN-Kangkang-Apollo
zh-HK | Chinese (Hong Kong) | Female | zh-HK-Tracy-Apollo
| | | Female | zh-HK-TracyRUS
| | | Male | zh-HK-Danny-Apollo
zh-TW | Chinese (Taiwan) | Female | zh-TW-Yating-Apollo
| | | Female | zh-TW-HanHanRUS
| | | Male | zh-TW-Zhiwei-Apollo

\* *ar-EG supports Modern Standard Arabic (MSA).*

> [!NOTE]
> Full service name mapping in the format of "Microsoft Server Speech Text to Speech Voice (locale, voice name)" is still supported. For example, the service name "Microsoft Server Speech Text to Speech Voice (ar-EG, Hoda)" will be mapped to "ar-EG-Hoda". 

### Customization

Voice customization is available for de-DE, en-GB, en-IN, en-US, es-MX, fr-FR, it-IT, pt-BR, and zh-CN. Select the right locale that matches the training data you have to train a custom voice model. For example, if the recording data you have is spoken in English with a British accent, select en-GB.  

> [!NOTE]
> We do not support bi-lingual model training in Custom Voice, except for the Chinese-English bi-lingual. Select 'Chinese-English bilingual' if you want to train a Chinese voice that can speak English as well. Voice training in all locales starts with a data set of 2,000+ utterances, except for the en-US and zh-CN where you can start with any size of training data. 

## Speech translation

The **Speech Translation** API supports different languages for speech-to-speech and speech-to-text translation. The source language must always be from the Speech-to-Text language table. The available target languages depend on whether the translation target is speech or text. You may translate incoming speech into more than [60 languages](https://www.microsoft.com/translator/business/languages/). A subset of these languages are available for [speech synthesis](language-support.md#text-languages).

### Text languages

| Text language    | Language code |
|:----------- |:-------------:|
| Afrikaans      | `af`          |
| Arabic       | `ar`          |
| Bangla      | `bn`          |
| Bosnian (Latin)      | `bs`          |
| Bulgarian      | `bg`          |
| Cantonese (Traditional)      | `yue`          |
| Catalan      | `ca`          |
| Chinese Simplified      | `zh-Hans`          |
| Chinese Traditional      | `zh-Hant`          |
| Croatian      | `hr`          |
| Czech      | `cs`          |
| Danish      | `da`          |
| Dutch      | `nl`          |
| English      | `en`          |
| Estonian      | `et`          |
| Fijian      | `fj`          |
| Filipino      | `fil`          |
| Finnish      | `fi`          |
| French      | `fr`          |
| German      | `de`          |
| Greek      | `el`          |
| Haitian Creole      | `ht`          |
| Hebrew      | `he`          |
| Hindi      | `hi`          |
| Hmong Daw      | `mww`          |
| Hungarian      | `hu`          |
| Indonesian      | `id`          |
| Italian      | `it`          |
| Japanese      | `ja`          |
| Kiswahili      | `sw`          |
| Klingon      | `tlh`          |
| Klingon (plqaD)      | `tlh-Qaak`          |
| Korean      | `ko`          |
| Latvian      | `lv`          |
| Lithuanian      | `lt`          |
| Malagasy      | `mg`          |
| Malay      | `ms`          |
| Maltese      | `mt`          |
| Norwegian      | `nb`          |
| Persian      | `fa`          |
| Polish      | `pl`          |
| Portuguese      | `pt`          |
| Queretaro Otomi      | `otq`          |
| Romanian      | `ro`          |
| Russian      | `ru`          |
| Samoan      | `sm`          |
| Serbian (Cyrillic)      | `sr-Cyrl`          |
| Serbian (Latin)      | `sr-Latn`          |
| Slovak     | `sk`          |
| Slovenian      | `sl`          |
| Spanish      | `es`          |
| Swedish      | `sv`          |
| Tahitian      | `ty`          |
| Tamil      | `ta`          |
| Thai      | `th`          |
| Tongan      | `to`          |
| Turkish      | `tr`          |
| Ukrainian      | `uk`          |
| Urdu      | `ur`          |
| Vietnamese      | `vi`          |
| Welsh      | `cy`          |
| Yucatec Maya      | `yua`          |


## Next steps

* [Get your Speech Services trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-dotnet-windows.md)
