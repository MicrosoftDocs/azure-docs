---
title: Language support - Speech Service API
description: A list of natural languages supported by Speech Service.
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 09/25/2018
ms.author: erhopf
---

# Language and region support for Speech Service API

Different languages are supported for different Speech service functions. The following tables summarize language support.

## Speech to Text

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
 es-ES | Spanish (Spain) | No | Yes | No
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
 pt-BR | Portuguese (Brazil) | No | Yes | No
 pt-PT | Portuguese (Portugal) | No | Yes | No
 ru-RU | Russian (Russia) | Yes | Yes | No
 sv-SE | Swedish (Sweden) | No | No | No
 zh-CN | Chinese (Mandarin, simplified) | Yes | Yes | No
 zh-HK | Chinese (Mandarin, Traditional) | No | Yes | No
 zh-TW | Chinese (Taiwanese Mandarin) | No | Yes | No
 th-TH | Thai (Thailand) | No | No | No


## Text to Speech

The speech synthesis API offers the following voices, each of which supports a specific language and dialect, identified by locale.

Locale | Language | Gender | Service name mapping
-------|----------|---------|--------------------
ar-EG\* | Arabic (Egypt) | Female | "Microsoft Server Speech Text to Speech Voice (ar-EG, Hoda)"
ar-SA | Arabic (Saudi Arabia) | Male | "Microsoft Server Speech Text to Speech Voice (ar-SA, Naayf)"
bg-BG | Bulgarian | Male | "Microsoft Server Speech Text to Speech Voice (bg-BG, Ivan)"
ca-ES | Catalan (Spain) | Female | "Microsoft Server Speech Text to Speech Voice (ca-ES, HerenaRUS)"
cs-CZ | Czech | Male | "Microsoft Server Speech Text to Speech Voice (cs-CZ, Jakub)"
cs-CZ | Czech | Male | "Microsoft Server Speech Text to Speech Voice (cs-CZ, Vit)"
da-DK | Danish | Female | "Microsoft Server Speech Text to Speech Voice (da-DK, HelleRUS)"
de-AT | German (Austria) | Male | "Microsoft Server Speech Text to Speech Voice (de-AT, Michael)"
de-CH | German (Switzerland) | Male | "Microsoft Server Speech Text to Speech Voice (de-CH, Karsten)"
de-DE | German (Germany) | Female | "Microsoft Server Speech Text to Speech Voice (de-DE, Hedda)"
| | | Female | "Microsoft Server Speech Text to Speech Voice (de-DE, HeddaRUS)"
| | | Male | "Microsoft Server Speech Text to Speech Voice (de-DE, Stefan, Apollo)"
el-GR | Greek | Male | "Microsoft Server Speech Text to Speech Voice (el-GR, Stefanos)"
en-AU | English (Australia) | Female | "Microsoft Server Speech Text to Speech Voice (en-AU, Catherine)"
| | | Female | "Microsoft Server Speech Text to Speech Voice (en-AU, HayleyRUS)"
en-CA | English (Canada) | Female | "Microsoft Server Speech Text to Speech Voice (en-CA, Linda)"
| | | Female | "Microsoft Server Speech Text to Speech Voice (en-CA, HeatherRUS)"
en-GB | English (UK) | Female | "Microsoft Server Speech Text to Speech Voice (en-GB, Susan, Apollo)"
| | |Female | "Microsoft Server Speech Text to Speech Voice (en-GB, HazelRUS)"
| | |Male | "Microsoft Server Speech Text to Speech Voice (en-GB, George, Apollo)"
en-IE | English (Ireland) |Male | "Microsoft Server Speech Text to Speech Voice (en-IE, Sean)"
en-IE | English (Ireland) |Male | "Microsoft Server Speech Text to Speech Voice (en-IE, Shaun)"
en-IN | English (India) | Female | "Microsoft Server Speech Text to Speech Voice (en-IN, Heera, Apollo)"
| | |Female | "Microsoft Server Speech Text to Speech Voice (en-IN, PriyaRUS)"
| | |Male | "Microsoft Server Speech Text to Speech Voice (en-IN, Ravi, Apollo)"
en-US | English (US) |Female | "Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)"
| | |Female | "Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)"
| | |Male | "Microsoft Server Speech Text to Speech Voice (en-US, BenjaminRUS)"
| | |Female | "Microsoft Server Speech Text to Speech Voice (en-US, Jessa24kRUS)"
| | |Male | "Microsoft Server Speech Text to Speech Voice (en-US, Guy24kRUS)"
es-ES | Spanish (Spain) |Female | "Microsoft Server Speech Text to Speech Voice (es-ES, Laura, Apollo)"
| | |Female | "Microsoft Server Speech Text to Speech Voice (es-ES, HelenaRUS)"
| | |Male | "Microsoft Server Speech Text to Speech Voice (es-ES, Pablo, Apollo)"
es-MX | Spanish (Mexico) | Female | "Microsoft Server Speech Text to Speech Voice (es-MX, HildaRUS)"
| | | Male | "Microsoft Server Speech Text to Speech Voice (es-MX, Raul, Apollo)"
fi-FI | Finnish | Female | "Microsoft Server Speech Text to Speech Voice (fi-FI, HeidiRUS)"
fr-CA | French (Canada) |Female | "Microsoft Server Speech Text to Speech Voice (fr-CA, Caroline)"
| | | Female | "Microsoft Server Speech Text to Speech Voice (fr-CA, HarmonieRUS)"
fr-CH | French (Switzerland)|Male | "Microsoft Server Speech Text to Speech Voice (fr-CH, Guillaume)"
fr-FR | French (France)|Female | "Microsoft Server Speech Text to Speech Voice (fr-FR, Julie, Apollo)"
| | |Female | "Microsoft Server Speech Text to Speech Voice (fr-FR, HortenseRUS)"
| | |Male | "Microsoft Server Speech Text to Speech Voice (fr-FR, Paul, Apollo)"
he-IL| Hebrew (Israel) | Male| "Microsoft Server Speech Text to Speech Voice (he-IL, Asaf)"
hi-IN | Hindi (India) | Female | "Microsoft Server Speech Text to Speech Voice (hi-IN, Kalpana, Apollo)"
| | |Female | "Microsoft Server Speech Text to Speech Voice (hi-IN, Kalpana)"
| | | Male | "Microsoft Server Speech Text to Speech Voice (hi-IN, Hemant)"
hr-HR | Croatian | Male | "Microsoft Server Speech Text to Speech Voice (hr-HR, Matej)"
hu-HU | Hungarian | Male | "Microsoft Server Speech Text to Speech Voice (hu-HU, Szabolcs)"
id-ID | Indonesian| Male | "Microsoft Server Speech Text to Speech Voice (id-ID, Andika)"
it-IT | Italian |Male | "Microsoft Server Speech Text to Speech Voice (it-IT, Cosimo, Apollo)"
| | |Female | "Microsoft Server Speech Text to Speech Voice (it-IT, LuciaRUS)"
ja-JP | Japanese |Female | "Microsoft Server Speech Text to Speech Voice (ja-JP, Ayumi, Apollo)"
| | |Male | "Microsoft Server Speech Text to Speech Voice (ja-JP, Ichiro, Apollo)"
| | |Female | "Microsoft Server Speech Text to Speech Voice (ja-JP, HarukaRUS)"
ko-KR | Korean |Female | "Microsoft Server Speech Text to Speech Voice (ko-KR, HeamiRUS)"
ms-MY | Malay | Male | "Microsoft Server Speech Text to Speech Voice (ms-MY, Rizwan)"
nb-NO | Norwegian | Female | "Microsoft Server Speech Text to Speech Voice (nb-NO, HuldaRUS)"
nl-NL | Dutch | Female | "Microsoft Server Speech Text to Speech Voice (nl-NL, HannaRUS)"
pl-PL | Polish | Female | "Microsoft Server Speech Text to Speech Voice (pl-PL, PaulinaRUS)"
pt-BR | Portuguese (Brazil) | Female | "Microsoft Server Speech Text to Speech Voice (pt-BR, HeloisaRUS)"
| | |Male | "Microsoft Server Speech Text to Speech Voice (pt-BR, Daniel, Apollo)"
pt-PT | Portuguese (Portugal) | Female | "Microsoft Server Speech Text to Speech Voice (pt-PT, HeliaRUS)"
ro-RO | Romanian | Male | "Microsoft Server Speech Text to Speech Voice (ro-RO, Andrei)"
ru-RU |Russian| Female | "Microsoft Server Speech Text to Speech Voice (ru-RU, Irina, Apollo)"
| | |Male | "Microsoft Server Speech Text to Speech Voice (ru-RU, Pavel, Apollo)"
| | |Female | "Microsoft Server Speech Text to Speech Voice (ru-RU, EkaterinaRUS)"
sk-SK | Slovak|Male | "Microsoft Server Speech Text to Speech Voice (sk-SK, Filip)"
sl-SI | Slovenian|Male | "Microsoft Server Speech Text to Speech Voice (sl-SI, Lado)"
sv-SE | Swedish|Female | "Microsoft Server Speech Text to Speech Voice (sv-SE, HedvigRUS)"
ta-IN | Tamil (India) |Male | "Microsoft Server Speech Text to Speech Voice (ta-IN, Valluvar)"
te-IN | Telugu (India) |Female | "Microsoft Server Speech Text to Speech Voice (te-IN, Chitra)"
th-TH | Thai|Male | "Microsoft Server Speech Text to Speech Voice (th-TH, Pattara)"
tr-TR |Turkish| Female | "Microsoft Server Speech Text to Speech Voice (tr-TR, SedaRUS)"
vi-VN | Vietnamese|Male | "Microsoft Server Speech Text to Speech Voice (vi-VN, An)"
zh-CN | Chinese (Mainland)|Female | "Microsoft Server Speech Text to Speech Voice (zh-CN, HuihuiRUS)"
| | |Female | "Microsoft Server Speech Text to Speech Voice (zh-CN, Yaoyao, Apollo)"
| | |Male | "Microsoft Server Speech Text to Speech Voice (zh-CN, Kangkang, Apollo)"
zh-HK | Chinese (Hong Kong)|Female | "Microsoft Server Speech Text to Speech Voice (zh-HK, Tracy, Apollo)"
| | |Female | "Microsoft Server Speech Text to Speech Voice (zh-HK, TracyRUS)"
| || Male | "Microsoft Server Speech Text to Speech Voice (zh-HK, Danny, Apollo)"
zh-TW | Chinese (Taiwan)|Female | "Microsoft Server Speech Text to Speech Voice (zh-TW, Yating, Apollo)"
| || Female | "Microsoft Server Speech Text to Speech Voice (zh-TW, HanHanRUS)"
| || Male | "Microsoft Server Speech Text to Speech Voice (zh-TW, Zhiwei, Apollo)"

\* *ar-EG supports Modern Standard Arabic (MSA).*

### Customization

Voice customization is available for US English (en-US), mainland Chinese (zh-CN), and Italian (it-IT).

> [!NOTE]
> Italian voice training starts with a data set of 2,000+ utterances. Chinese-English bilingual models also are supported with an initial data set of 2,000+ utterances.

## Speech Translation

The **Speech Translation** API supports different languages for speech-to-speech and speech-to-text translation. The source language must always be from the following Speech language table. The available target languages depend on whether the translation target is speech or text.

### Speech languages

| Speech language   | Language code |
|:----------- |-|
| Arabic (Modern Standard)      | `ar` |
| Chinese (Mandarin)      | `zh` |
| English      | `en` |
| French      | `fr` |
| German      | `de` |
| Italian      | `it` |
| Japanese      | `jp` |
| Portuguese (Brazilian)     | `pt` |
| Russian      | `ru` |
| Spanish      |  `es` |

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

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-dotnet-windows.md)
