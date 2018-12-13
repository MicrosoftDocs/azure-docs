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

The Translator Text API supports the following languages for text to text translation. Neural Machine Translation (NMT) is the new standard for high-quality AI-powered machine translations and is available as the default using V3 of the Translator Text API when a neural system is available. 

[Learn more about how machine translation works](https://www.microsoft.com/translator/mt.aspx)

**V2 Translator API**

> [!NOTE]
> V2 was deprecated on April 30, 2018 and will be discontinued on April 30, 2019.

* Statistical only: No neural system is available for this language.
* Neural available: A neural system is available. Use the parameter `category=generalnn` to access the neural system.
* Neural default: Neural is the default translation system. Use the parameter `category=smt` to access the statistical system for use with the Microsoft Translator Hub.
* Neural only: Only neural translation is available.

**V3 Translator API**
The V3 Translator API is neural by default and statistical systems are only available when no neural system exists. Custom Translator can only be used with neural languages. 

|Language|	Language code|	V2 API|	V3 API|
|:-----|:-----:|:-----|:-----|
|Afrikaans|	`af`	|Statistical only|	Neural|
|Arabic|	`ar`	|Neural available|	Neural|
|Arabic, Levantine|	`apc`	|Neural available|	Neural|
|Bangla|	`bn`	|Neural available|	Neural|
|Bosnian (Latin)|	`bs`	|Statistical only|	Statistical|
|Bulgarian|	`bg`	|Neural available|	Neural|
|Cantonese (Traditional)|	`yue`	|Statistical only|	Statistical|
|Catalan|	`ca`	|Statistical only|	Statistical|
|Chinese Simplified|	`zh-Hans`	|Neural default	|Neural|
|Chinese Traditional|	`zh-Hant`	|Neural default	|Neural|
|Croatian|	`hr`	|Neural available|	Neural|
|Czech|	`cs`	|Neural available|	Neural|
|Danish|	`da`	|Neural available	|Neural|
|Dutch|	`nl`	|Neural available|	Neural|
|English|	`en`	|Neural available|	Neural|
|Estonian|	`et`	|Neural available|	Neural|
|Fijian|	`fj`	|Statistical only|	Statistical|
|Filipino|	`fil`	|Statistical only|	Statistical|
|Finnish|	`fi`	|Neural available|	Neural|
|French|	`fr`	|Neural available|	Neural|
|German|	`de`	|Neural available|	Neural|
|Greek|	`el`	|Neural available|	Neural|
|Haitian Creole|	`ht`	|Statistical only	|Statistical|
|Hebrew	|`he`	|Neural available	|Neural|
|Hindi|	`hi`	|Neural default|	Neural|
|Hmong Daw|	`mww`	|Statistical only|	Statistical|
|Hungarian|	`hu`	|Neural available|	Neural|
|Icelandic|	`is`	|Neural only|	Neural|
|Indonesian|	`id`	|Statistical only|	Statistical|
|Italian|	`it`	|Neural available|	Neural|
|Japanese|	`ja`	|Neural available|	Neural|
|Kiswahili|	`sw`	|Statistical only|	Statistical|
|Klingon|	`tlh`	|Statistical only|	Statistical|
|Klingon (plqaD)|	`tlh-Qaak`	|Statistical only|	Statistical|
|Korean	|`ko`	|Neural available|	Neural|
|Latvian|	`lv`	|Neural available|	Neural|
|Lithuanian|	`lt`	|Neural available|	Neural|
|Malagasy|	`mg`	|Statistical only|	Statistical|
|Malay|	`ms`	|Statistical only	|Statistical|
|Maltese|	`mt`	|Statistical only|	Statistical|
|Norwegian|	`nb`	|Neural available|	Neural|
|Persian|	`fa`	|Statistical only|	Statistical|
|Polish|	`pl`	|Neural available|	Neural|
|Portuguese|	`pt`	|Neural available|	Neural|
|Queretaro Otomi|	`otq`	|Statistical only|	Statistical|
|Romanian|	`ro`	|Neural available|	Neural|
|Russian|	`ru`	|Neural available|	Neural|
|Samoan|	`sm`	|Statistical only|	Statistical|
|Serbian (Cyrillic)|	`sr-Cyrl`	|Statistical only|	Statistical|
|Serbian (Latin)|	`sr-Latn`	|Statistical only	|Statistical|
|Slovak|	`sk`	|Neural available|	Neural|
|Slovenian|	`sl`	|Neural available|	Neural|
|Spanish|	`es`	|Neural available|	Neural|
|Swedish|	`sv`	|Neural available	|Neural|
|Tahitian|	`ty`	|Statistical only|	Statistical|
|Tamil|	`ta`	|Statistical only|	Statistical|
|Telugu|	`te`	|Neural only|	Neural|
|Thai|	`th`	|Neural available|	Neural|
|Tongan|	`to`	|Statistical only|	Statistical|
|Turkish|	`tr`	|Neural available	|Neural|
|Ukrainian|	`uk`	|Neural available|	Neural|
|Urdu|	`ur`	|Statistical only|	Statistical|
|Vietnamese|	`vi`	|Neural available|	Neural|
|Welsh|	`cy`	|Neural available|	Neural|
|Yucatec Maya|	`yua`	|Statistical only|	Statistical|

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
| Malayalam | ml | Malayalam | --> | Latin |
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
