---
title: Language support - Translator Text API
titleSuffix: Azure Cognitive Services
description: A list of natural languages supported by the Translator Text API.
services: cognitive-services
author: Jann-Skotdal
manager: cgronlun
ms.service: cognitive-services
ms.component: translator-text
ms.topic: article
ms.date: 09/25/2018
ms.author: v-jansko
---
# Language and region support for the Translator Text API

The Translator Text API supports the following languages for text to text translation. Neural Machine Translation (NMT) is the new standard for high-quality AI-powered machine translations and is available as the default using V3 of the Translator Text API when a neural system is available. Neural machine translation is available in V2 by using the "generalnn" category.

[Learn more about how machine translation works](https://www.microsoft.com/translator/mt.aspx)

| Language    | Translation Type |Language code |
|:----------- |:-------:|:-------------:|
| Afrikaans      | Statistical |`af`          |
| Arabic      | Neural | `ar`          |
| Arabic, Levantine    | Neural | `apc`
| Bangla      | Neural |`bn`          |
| Bosnian (Latin)      | Statistical |`bs`          |
| Bulgarian     |  Neural |`bg`          |
| Cantonese (Traditional)      | Statistical |`yue`          |
| Catalan      | Statistical |`ca`          |
| Chinese Simplified        |  Neural |`zh-Hans`          |
| Chinese Traditional        |  Neural |`zh-Hant`          |
| Croatian      | Neural |`hr`          |
| Czech        |  Neural |`cs`          |
| Danish        |  Neural |`da`          |
| Dutch        |  Neural |`nl`          |
| English       |  Neural |`en`          |
| Estonian      | Neural |`et`          |
| Fijian      | Statistical |`fj`          |
| Filipino      | Statistical |`fil`          |
| Finnish      | Neural |`fi`          |
| French        |  Neural |`fr`          |
| German       |  Neural |`de`          |
| Greek      | Neural |`el`          |
| Haitian Creole      | Statistical |`ht`          |
| Hebrew      | Neural |`he`          |
| Hindi        |  Neural |`hi`          |
| Hmong Daw      | Statistical |`mww`          |
| Hungarian      | Neural |`hu`          |
| Icelandic      |  Neural |`is`           |
| Indonesian      | Statistical |`id`          |
| Italian        |  Neural |`it`          |
| Japanese        |  Neural |`ja`          |
| Kiswahili      | Statistical |`sw`          |
| Klingon      | Statistical |`tlh`          |
| Klingon (plqaD)      | Statistical |`tlh-Qaak`          |
| Korean        |  Neural |`ko`          |
| Latvian      | Neural |`lv`          |
| Lithuanian      | Neural |`lt`          |
| Malagasy      | Statistical |`mg`          |
| Malay      | Statistical |`ms`          |
| Maltese      | Statistical |`mt`          |
| Norwegian        |  Neural |`nb`          |
| Persian      | Statistical |`fa`          |
| Polish        |  Neural |`pl`          |
| Portuguese        |  Neural |`pt`          |
| Queretaro Otomi      | Statistical |`otq`          |
| Romanian        |  Neural |`ro`          |
| Russian        |  Neural |`ru`          |
| Samoan      | Statistical |`sm`          |
| Serbian (Cyrillic)      | Statistical |`sr-Cyrl`          |
| Serbian (Latin)      | Statistical |`sr-Latn`          |
| Slovak     | Neural |`sk`          |
| Slovenian      | Neural |`sl`          |
| Spanish        |  Neural |`es`          |
| Swedish        |  Neural |`sv`          |
| Tahitian      | Statistical |`ty`          |
| Tamil      | Statistical |`ta`          |
| Telugu   | Neural   | `te` |
| Thai      | Neural |`th`          |
| Tongan      | Statistical |`to`          |
| Turkish       |  Neural |`tr`          |
| Ukrainian      | Neural |`uk`          |
| Urdu      | Statistical |`ur`          |
| Vietnamese      | Neural |`vi`          |
| Welsh      | Neural |`cy`          |
| Yucatec Maya      | Statistical |`yua`          |

## Transliteration

The Transliterate method supports the following languages. In the "To/From", "<-->" indicates that the language can be transliterated from or to either of the scripts listed. The "-->" indicates that the language can only be transliterated from one script to the other.

| Language    | Language code | Script | To/From | Script|
|:----------- |:-------------:|:-------------:|:-------------:|:-------------:|
| Arabic | ar | Arabic | <--> | Latin |
|Bangla  | bn | Bengali | <--> | Latin |
| Chinese (Simplified) | zh-Hans | Chinese Simplified | <--> | Latin |
| Chinese (Simplified) | zh-Hans | Chinese Simplified | <--> | Chinese Traditional |
| Chinese (Traditional) | zh-Hant | Chinese Traditional | <--> | Latin |
| Chinese (Traditional) | zh-Hant | Chinese Traditional | <--> | Chinese Simplified |
| Gujarati | gu  | Gujarati | --> | Latin |
| Hebrew | he | Hebrew | <--> | Latin |
| Hindi | hi | Devanagari | <--> | Latin |
| Japanese | ja | Japanese | <--> | Latin |
| Kannada | kn | Kannada | --> | Latin |
| Malasian | ml | Malayalam | --> | Latin |
| Marathi | mr | Devanagari | --> | Latin |
| Oriya | or | Oriya | <--> | Latin |
| Punjabi | pa | Gurmukhi | <--> | Latin  |
| Serbian (Cyrillic) | sr-Cyrl | Cyrillic  | --> | Latin |
| Serbian (Latin) | sr-Latn | Latin | --> | Cyrillic |
| Tamil | ta | Tamil | --> | Latin |
| Telugu | te | Telugu | --> | Latin |
| Thai | th | Thai | <--> | Latin |

## Dictionary

The dictionary supports the following languages to or from English using the Lookup and Examples methods.

| Language    | Language code |
|:----------- |:-------------:|
| Afrikaans      | `af`          |
| Arabic       | `ar`          |
| Bangla      | `bn`          |
| Bosnian (Latin)      | `bs`          |
| Bulgarian      | `bg`          |
| Catalan      | `ca`          |
| Chinese Simplified      | `zh-Hans`          |
| Croatian      | `hr`          |
| Czech      | `cs`          |
| Danish      | `da`          |
| Dutch      | `nl`          |
| Estonian      | `et`          |
| Finnish      | `fi`          |
| French      | `fr`          |
| German      | `de`          |
| Greek      | `el`          |
| Haitian Creole      | `ht`          |
| Hebrew      | `he`          |
| Hindi      | `hi`          |
| Hmong Daw      | `mww`          |
| Hungarian      | `hu`          |
| Icelandic    | `is`  |
| Indonesian      | `id`          |
| Italian      | `it`          |
| Japanese      | `ja`          |
| Kiswahili      | `sw`          |
| Klingon      | `tlh`          |
| Korean      | `ko`          |
| Latvian      | `lv`          |
| Lithuanian      | `lt`          |
| Malay      | `ms`          |
| Maltese      | `mt`          |
| Norwegian      | `nb`          |
| Persian      | `fa`          |
| Polish      | `pl`          |
| Portuguese      | `pt`          |
| Romanian      | `ro`          |
| Russian      | `ru`          |
| Serbian (Latin)      | `sr-Latn`          |
| Slovak     | `sk`          |
| Slovenian      | `sl`          |
| Spanish      | `es`          |
| Swedish      | `sv`          |
| Tamil      | `ta`          |
| Thai      | `th`          |
| Turkish      | `tr`          |
| Ukrainian      | `uk`          |
| Urdu      | `ur`          |
| Vietnamese      | `vi`          |
| Welsh      | `cy`          |

## Languages detected by the Detect method

The following languages can be detected by the Detect method. Detect may detect languages that Microsoft Translator can't translate.

| Language    |
|:----------- |
| Afrikaans |
| Albanian |
| Arabic |
| Basque |
| Belarusian |
| Bulgarian |
| Catalan |
| Chinese |
| Chinese (Simplified) |
| Chinese (Traditional) |
| Croatian |
| Czech |
| Danish |
| Dutch |
| English |
| Esperanto |
| Estonian |
| Finnish |
| French |
| Galician |
| German |
| Greek |
| Haitian Creole |
| Hebrew |
| Hindi |
| Hungarian |
| Icelandic |
| Indonesian |
| Irish |
| Italian |
| Japanese |
| Korean |
| Kurdish (Arabic) |
| Kurdish (Latin) |
| Latin |
| Latvian |
| Lithuanian |
| Macedonian |
| Malay |
| Maltese |
| Norwegian |
| Norwegian (Nynorsk) |
| Pashto |
| Persian |
| Polish |
| Portuguese |
| Romanian |
| Russian |
| Serbian (Cyrillic) |
| Serbian (Latin) |
| Slovak |
| Slovenian |
| Somali |
| Spanish |
| Swahili |
| Swedish |
| Tagalog |
| Telugu |
| Thai |
| Turkish |
| Ukrainian |
| Urdu |
| Uzbek (Cyrillic) |
| Uzbek (Latin) |
| Vietnamese |
| Welsh |
| Yiddish |

## Access the list programmatically

You can access the list of supported languages programmatically using the Languages operation of the V3.0 Text API. You can view the list by feature, language code, as well as the language name in English or any other supported language. This list is automatically updated by the Microsoft Translator service as new languages become available.

[View Languages operation reference documentation](reference/v3-0-languages.md)

## Access the list on the Microsoft Translator website

For a quick look at the languages, the Microsoft Translator website shows all the languages supported by the Translator Text and Speech APIs. This list doesn't include developer-specific information such as language codes.

[See the list of languages](https://www.microsoft.com/translator/languages.aspx)
