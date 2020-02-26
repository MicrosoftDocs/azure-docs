---
title: Language support - Translator Text API
titleSuffix: Azure Cognitive Services
description: The Translator Text API supports the following languages for text to text translation using Neural Machine Translation (NMT).
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 02/10/2020
ms.author: swmachan
---
# Language and region support for the Translator Text API

The Translator Text API supports the following languages for text to text translation. Neural Machine Translation (NMT) is the new standard for high-quality AI-powered machine translations and is available as the default using V3 of the Translator Text API when a neural system is available.

[Learn more about how machine translation works](https://www.microsoft.com/translator/mt.aspx)

## Translation

**V2 Translator API**

> [!NOTE]
> V2 was deprecated on April 30, 2018. Please migrate your applications to V3 in order to take advantage of new functionality available exclusively in V3.

* Statistical only: No neural system is available for this language.
* Neural available: A neural system is available. Use the parameter `category=generalnn` to access the neural system.
* Neural default: Neural is the default translation system. Use the parameter `category=smt` to access the statistical system for use with the Microsoft Translator Hub.
* Neural only: Only neural translation is available.

**V3 Translator API**
The V3 Translator API is neural by default and statistical systems are only available when no neural system exists.

> [!NOTE]
> Currently, a subset of the neural languages are available in Custom Translator and we are gradually adding additional ones. [View languages currently available in Custom Translator](#customization).

|Language|	Language code|	V3 API|
|:-----|:-----:|:-----|
|Afrikaans|	`af`|	Neural|
|Arabic|	`ar`	|	Neural|
|Bangla|	`bn`	|	Neural|
|Bosnian (Latin)|	`bs`	|	Neural|
|Bulgarian|	`bg`	|	Neural|
|Cantonese (Traditional)|	`yue`|	Statistical|
|Catalan|	`ca`	|	Statistical|
|Chinese Simplified|	`zh-Hans`|Neural|
|Chinese Traditional|	`zh-Hant`		|Neural|
|Croatian|	`hr`	|Neural|
|Czech|	`cs`	|	Neural|
|Danish|	`da`		|Neural|
|Dutch|	`nl`|	Neural|
|English|	`en`	|	Neural|
|Estonian|	`et`	|	Neural|
|Fijian|	`fj`	|	Statistical|
|Filipino|	`fil`	|	Statistical|
|Finnish|	`fi`	|	Neural|
|French|	`fr`	|	Neural|
|German|	`de`	|	Neural|
|Greek|	`el`	|	Neural|
|Haitian Creole|	`ht`		|Statistical|
|Hebrew	|`he`	|Neural
|Hindi|	`hi`	|	Neural|
|Hmong Daw|	`mww`	|	Statistical|
|Hungarian|	`hu`	|	Neural|
|Icelandic|	`is`	|	Neural|
|Indonesian|	`id`	|	Statistical|
|Irish | `ga`| Neural
|Italian|	`it`	|	Neural|
|Japanese|	`ja`	|	Neural|
|Kannada|`kn`| Neural
|Kiswahili|	`sw`	|	Statistical|
|Klingon|	`tlh`	|	Statistical|
|Klingon (plqaD)|	`tlh-Qaak`	|	Statistical|
|Korean	|`ko`	|	Neural|
|Latvian|	`lv`	|	Neural|
|Lithuanian|	`lt`	|	Neural|
|Malagasy|	`mg`	|	Statistical|
|Malay|	`ms`		|Statistical|
|Malayalam| `ml` | Neural
|Maltese|	`mt`	|	Statistical|
|Maori| `mi`  | Neural|
|Norwegian|	`nb`	|	Neural|
|Persian|	`fa`	|	Neural|
|Polish|	`pl`	|	Neural|
|Portuguese (Brazil)|	`pt-br`	|	Neural|
|Portuguese (Portugal)| `pt-pt` | Neural
|Punjabi|`pa`|Neural
|Queretaro Otomi|	`otq`	|	Statistical|
|Romanian|	`ro`	|	Neural|
|Russian|	`ru`	|	Neural|
|Samoan|	`sm`	|	Statistical|
|Serbian (Cyrillic)|	`sr-Cyrl`|	Statistical|
|Serbian (Latin)|	`sr-Latn`		|Statistical|
|Slovak|	`sk`	|	Neural|
|Slovenian|	`sl`	|	Neural|
|Spanish|	`es`	|	Neural|
|Swedish|	`sv`	|Neural|
|Tahitian|	`ty`	|Statistical|
|Tamil|	`ta`	|	Neural|
|Telugu|	`te`	|	Neural|
|Thai|	`th`	|	Neural|
|Tongan|	`to`	|	Statistical|
|Turkish|	`tr`		|Neural|
|Ukrainian|	`uk`	|	Neural|
|Urdu|	`ur`	|	Statistical|
|Vietnamese|	`vi`	|	Neural|
|Welsh|	`cy`	|	Neural|
|Yucatec Maya|	`yua`	|	Statistical|

> [!NOTE]
> Language code `pt` will default to `pt-br`, Portuguese (Brazil).

## Transliteration

The Transliterate method supports the following languages. In the "To/From", "<-->" indicates that the language can be transliterated from or to either of the scripts listed. The "-->" indicates that the language can only be transliterated from one script to the other.

| Language    | Language code | Script | To/From | Script|
|:----------- |:-------------:|:-------------:|:-------------:|:-------------:|
| Arabic | `ar` | Arabic `Arab` | <--> | Latin `Latn` |
|Bangla  | `bn` | Bengali `Beng` | <--> | Latin `Latn` |
| Chinese (Simplified) | `zh-Hans` | Chinese Simplified `Hans`| <--> | Latin `Latn` |
| Chinese (Simplified) | `zh-Hans` | Chinese Simplified `Hans`| <--> | Chinese Traditional `Hant`|
| Chinese (Traditional) | `zh-Hant` | Chinese Traditional `Hant`| <--> | Latin `Latn` |
| Chinese (Traditional) | `zh-Hant` | Chinese Traditional `Hant`| <--> | Chinese Simplified `Hans` |
| Gujarati | `gu`  | Gujarati `Gujr` | --> | Latin `Latn` |
| Hebrew | `he` | Hebrew `Hebr` | <--> | Latin `Latn` |
| Hindi | `hi` | Devanagari `Deva` | <--> | Latin `Latn` |
| Japanese | `ja` | Japanese `Jpan` | <--> | Latin `Latn` |
| Kannada | `kn` | Kannada `Knda` | --> | Latin `Latn` |
| Malayalam | `ml` | Malayalam `Mlym` | --> | Latin `Latn` |
| Marathi | `mr` | Devanagari `Deva` | --> | Latin `Latn` |
| Oriya | `or` | Oriya `Orya` | <--> | Latin `Latn` |
| Punjabi | `pa` | Gurmukhi `Guru`  | <--> | Latin `Latn`  |
| Serbian (Cyrillic) | `sr-Cyrl` | Cyrillic `Cyrl`  | --> | Latin `Latn` |
| Serbian (Latin) | `sr-Latn` | Latin `Latn` | --> | Cyrillic `Cyrl`|
| Tamil | `ta` | Tamil `Taml` | --> | Latin `Latn` |
| Telugu | `te` | Telugu `Telu` | --> | Latin `Latn` |
| Thai | `th` | Thai `Thai` | --> | Latin `Latn` |

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
| Portuguese (Brazil)     | `pt-br`          |
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

## Detect

Translator Text API detects all languages available for translation and transliteration.


## Access the Translator Text API language list programmatically

You can retrieve a list of supported languages for the Translator Text API v3.0 using the Languages method. You can view the list by feature, language code, as well as the language name in English or any other supported language. This list is automatically updated by the Microsoft Translator service as new languages are made available.

[View Languages operation reference documentation](reference/v3-0-languages.md)

## Customization

The following languages are available for customization to or from English using [Custom Translator](https://aka.ms/CustomTranslator).

| Language    | Language code |
|:----------- |:-------------:|
| Arabic       | `ar`          |
| Bangla      | `bn`          |
| Bosnian (Latin)      | `bs`          |
| Bulgarian      | `bg`          |
| Chinese Simplified      | `zh-Hans`          |
|Chinese Traditional|	`zh-Hant`	|
| Croatian      | `hr`          |
| Czech      | `cs`          |
| Danish      | `da`          |
| Dutch      | `nl`          |
| English    | `en`     |
| Estonian      | `et`          |
| Finnish      | `fi`          |
| French      | `fr`          |
| German      | `de`          |
| Greek      | `el`          |
| Hebrew      | `he`          |
| Hindi      | `hi`          |
| Hungarian      | `hu`          |
| Icelandic | `is` |
| Indonesian|	`id`	|
| Irish | `ga`	|
| Italian      | `it`          |
| Japanese      | `ja`          |
| Kiswahili|	`sw`	|
| Korean      | `ko`          |
| Latvian      | `lv`          |
| Lithuanian      | `lt`          |
| Malagasy|	`mg`	|
| Maori| `mi`  |
| Norwegian      | `nb`          |
| Persian      | `fa`          |
| Polish      | `pl`          |
| Portuguese (Brazil) | `pt-br` |
| Romanian      | `ro`          |
| Russian      | `ru`          |
| Samoan|	`sm`	|
| Serbian (Latin)      | `sr-Latn`          |
| Slovak     | `sk`          |
| Slovenian      | `sl`          |
| Spanish      | `es`          |
| Swedish      | `sv`          |
| Thai      | `th`          |
| Turkish      | `tr`          |
| Ukrainian      | `uk`          |
| Vietnamese      | `vi`          |
| Welsh | `cy` |

## Access the list on the Microsoft Translator website

For a quick look at the languages, the Microsoft Translator website shows all the languages supported by the Translator Text and Speech APIs. This list doesn't include developer-specific information such as language codes.

[See the list of languages](https://www.microsoft.com/translator/languages.aspx)
