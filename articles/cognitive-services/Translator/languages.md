---
title: Supported languages in the Microsoft Translator API | Microsoft Docs
description: View languages supported by the Microsoft Translator Text API.
services: cognitive-services
author: Jann-Skotdal
manager: chriswendt1
ms.service: cognitive-services
ms.component: translator-text
ms.topic: article
ms.date: 10/30/2017
ms.author: v-jansko
---

# Supported languages in the Microsoft Translator Text API 
The Microsoft Translator Text API supports the following languages for text to text translation using statistical machine translation (SMT). 

| Language    | Language code |
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

## Neural Machine Translation systems

The following languages are supported for Neural Machine Translation. The neural system can be used by adding "generalnn" to the category parameter of the API call. You may use the "generalnn" category for any of the supported languages, even if there's no neural translation system handling it. 

| Language    | Language code |
|:----------- |:-------------:|
| Arabic       | `ar`          |
| Bulgarian       | `bg`          |
| Chinese Simplified      | `zh-Hans`          | 
| Czech      | `cs`          |
| Danish      | `da`          |
| Dutch      | `nl`          |
| English      | `en`          |
| French      | `fr`          |
| German      | `de`          |
| Hindi      | `hi`          |
| Italian      | `it`          |
| Japanese      | `ja`          |
| Korean      | `ko`          |
| Norwegian      | `nb`          |
| Polish      | `pl`          |
| Portuguese      | `pt`          |
| Romanian      | `ro`          |
| Russian      | `ru`          |
| Spanish      | `es`          |
| Swedish      | `sv`          |
| Turkish      | `tr`          |

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
| Icelandic    | is  |
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
| Chinese_Simplified |
| Chinese_Traditional |
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
| Haitian_Creole |
| Hebrew |
| Hindi |
| Hungarian |
| Icelandic |
| Indonesian |
| Irish |
| Italian |
| Japanese |
| Korean |
| Kurdish_Arabic |
| Kurdish_Latin |
| Latin |
| Latvian |
| Lithuanian |
| Macedonian |
| Malay |
| Maltese |
| Norwegian |
| Norwegian_Nynorsk |
| Pashto |
| Persian |
| Polish |
| Portuguese |
| Romanian |
| Russian |
| Serbian_Cyrillic |
| Serbian_Latin |
| Slovak |
| Slovenian |
| Somali |
| Spanish |
| Swahili |
| Swedish |
| Tagalog |
| Thai |
| Turkish |
| Ukrainian |
| Urdu |
| Uzbek_Cyrillic |
| Uzbek_Latin |
| Vietnamese |
| Welsh |
| Yiddish |

## Access the list programmatically

You can access the list of supported languages programmatically using the Languages operation of the V3.0 Text API. You can view the list by feature, language code, as well as the language name in English or any other supported language. This list is automatically updated by the Microsoft Translator service as new languages become available.

[View Languages operation reference documentation](/reference/languages.md)

## Access the list on the Microsoft Translator website

For a quick look at the languages, the Microsoft Translator website shows all the languages supported by the Translator Text and Speech APIs. This list doesn't include developer-specific information such as language codes.

[See the list of languages](https://www.microsoft.com/translator/languages.aspx)
