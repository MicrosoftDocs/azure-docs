---
title: Language support - Text Analytics API
titleSuffix: Azure Cognitive Services
description: "A list of natural languages supported by the Text Analytics API. This article explains which languages are supported for each operation."
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 10/07/2020
ms.author: aahi
---
# Text Analytics API v3 language support 

> [!IMPORTANT]
> Version 3.x of the Text Analytics API is currently unavailable in the following regions: Central India, UAE North, China North 2, China East.


#### [Sentiment Analysis](#tab/sentiment-analysis)

| Language              | Language code | v2 support | v3 support | Starting v3 model version: |              Notes |
|:----------------------|:-------------:|:----------:|:----------:|:--------------------------:|-------------------:|
| Chinese-Simplified    |   `zh-hans`   |     ✓      |     ✓      |         2019-10-01         | `zh` also accepted |
| Chinese-Traditional   |   `zh-hant`   |            |     ✓      |         2019-10-01         |                    |
| Danish               |     `da`      |     ✓      |            |                            |                    |
| Dutch                 |     `nl`      |     ✓      |            |                            |                    |
| English               |     `en`      |     ✓      |     ✓      |         2019-10-01         |                    |
| Finnish               |     `fi`      |     ✓      |            |                            |                    |
| French                |     `fr`      |     ✓      |     ✓      |         2019-10-01         |                    |
| German                |     `de`      |     ✓      |     ✓      |         2019-10-01         |                    |
| Greek                 |     `el`      |     ✓      |            |                            |                    |
| Hindi                 |     `hi`      |           |      ✓      |          2020-04-01                  |                    |
| Italian               |     `it`      |     ✓      |     ✓      |         2019-10-01         |                    |
| Japanese              |     `ja`      |     ✓      |     ✓      |         2019-10-01         |                    |
| Korean                |     `ko`      |            |     ✓      |         2019-10-01         |                    |
| Norwegian  (Bokmål)   |     `no`      |     ✓      |     ✓       |        2020-07-01         |                    |
| Polish                |     `pl`      |     ✓      |            |                            |                    |
| Portuguese (Portugal) |    `pt-PT`    |     ✓      |     ✓      |         2019-10-01         | `pt` also accepted |
| Russian               |     `ru`      |     ✓      |            |                            |                    |
| Spanish               |     `es`      |     ✓      |     ✓      |         2019-10-01         |                    |
| Swedish               |     `sv`      |     ✓      |            |                            |                    |
| Turkish               |     `tr`      |     ✓      |     ✓       |         2020-07-01        |                    |

### Opinion mining (v3.1-preview only)

| Language              | Language code | Starting with v3 model version: |              Notes |
|:----------------------|:-------------:|:------------------------------------:|-------------------:|
| English               |     `en`      |              2020-04-01              |                    |


#### [Named Entity Recognition (NER)](#tab/named-entity-recognition)

> [!NOTE]
> * NER v3 currently only supports English and Spanish languages. If you call NER v3 with a different language, the API will return v2.1 results, provided the language is supported in version 2.1.
> * v2.1 only returns the full set of available entities for the English, Chinese-Simplified, French, German, and Spanish languages.  The "Person", "Location" and "Organization" entities are returned for the other supported languages.

| Language               | Language code | v2.1 support | v3 support | Starting with v3 model version: |       Notes        |
|:-----------------------|:-------------:|:----------:|:----------:|:-------------------------------:|:------------------:|
| Arabic                |     `ar`      |     ✓      |            |                                 |                    |
| Czech                 |     `cs`      |     ✓      |            |                                 |                    |
| Chinese-Simplified     |   `zh-hans`   |     ✓      |            |                                 | `zh` also accepted |
| Chinese-Traditional   |   `zh-hant`   |     ✓      |            |                                 |                    |
| Danish                |     `da`      |     ✓      |            |                                 |                    |
| Dutch                 |     `nl`      |     ✓      |            |                                 |                    |
| English                |     `en`      |     ✓      |     ✓      |           2019-10-01            |                    |
| Finnish               |     `fi`      |     ✓      |            |                                 |                    |
| French                 |     `fr`      |     ✓      |            |                                 |                    |
| German                 |     `de`      |     ✓      |            |                                 |                    |
| Hebrew                |     `he`      |     ✓      |            |                                 |                    |
| Hungarian             |     `hu`      |     ✓      |            |                                 |                    |
| Italian               |     `it`      |     ✓      |            |                                 |                    |
| Japanese              |     `ja`      |     ✓      |            |                                 |                    |
| Korean                |     `ko`      |     ✓      |            |                                 |                    |
| Norwegian  (Bokmål)   |     `no`      |     ✓      |            |                                 | `nb` also accepted |
| Polish                |     `pl`      |     ✓      |            |                                 |                    |
| Portuguese (Portugal) |    `pt-PT`    |     ✓      |            |                                 | `pt` also accepted |
| Portuguese (Brazil)   |    `pt-BR`    |     ✓      |            |                                 |                    |
| Russian              |     `ru`      |     ✓      |            |                                 |                    |
| Spanish               |     `es`      |     ✓      |     ✓       |              2020-04-01                   |                    |
| Swedish               |     `sv`      |     ✓      |            |                                 |                    |
| Turkish               |     `tr`      |     ✓      |            |                                 |                    |

#### [Key phrase extraction](#tab/key-phrase-extraction)

> [!NOTE]
> Model versions of Key Phrase Extraction prior to 2020-07-01 have a 64 character limit. This limit is not present in later model versions.

| Language              | Language code | v2 support | v3 support | Available starting with v3 model version: |       Notes        |
|:----------------------|:-------------:|:----------:|:----------:|:-----------------------------------------:|:------------------:|
| Dutch                 |     `nl`      |     ✓      |     ✓      |                2019-10-01                 |                    |
| English               |     `en`      |     ✓      |     ✓      |                2019-10-01                 |                    |
| Finnish               |     `fi`      |     ✓      |     ✓      |                2019-10-01                 |                    |
| French                |     `fr`      |     ✓      |     ✓      |                2019-10-01                 |                    |
| German                |     `de`      |     ✓      |     ✓      |                2019-10-01                 |                    |
| Italian               |     `it`      |     ✓      |     ✓      |                2019-10-01                 |                    |
| Japanese              |     `ja`      |     ✓      |     ✓      |                2019-10-01                 |                    |
| Korean                |     `ko`      |     ✓      |     ✓      |                2019-10-01                 |                    |
| Norwegian  (Bokmål)   |     `no`      |     ✓      |     ✓      |                2019-10-01                 | `nb` also accepted |
| Polish                |     `pl`      |     ✓      |     ✓      |                2019-10-01                 |                    |
| Portuguese (Portugal) |    `pt-PT`    |     ✓      |     ✓      |                2019-10-01                 | `pt` also accepted |
| Portuguese (Brazil)   |    `pt-BR`    |     ✓      |     ✓      |                2019-10-01                 |                    |
| Russian               |     `ru`      |     ✓      |     ✓      |                2019-10-01                 |                    |
| Spanish               |     `es`      |     ✓      |     ✓      |                2019-10-01                 |                    |
| Swedish               |     `sv`      |     ✓      |     ✓      |                2019-10-01                 |                    |

#### [Entity linking](#tab/entity-linking)

| Language | Language code | v2 support | v3 support | Available starting with v3 model version: | Notes |
|:---------|:-------------:|:----------:|:----------:|:-----------------------------------------:|:-----:|
| English  |     `en`      |     ✓      |     ✓      |                2019-10-01                 |       |
| Spanish  |     `es`      |     ✓      |     ✓      |                2019-10-01                 |       |

#### [Language Detection](#tab/language-detection)

The Text Analytics API can detect a wide range of languages, variants, dialects, and some regional/cultural languages.  Language Detection returns the "script" of a language. For instance, for the phrase "I have a dog" it will return  `en` instead of  `en-US`. The only special case is Chinese, where the language detection capability will return `zh_CHS` or `zh_CHT` if it can determine the script given the text provided. In situations where a specific script cannot be identified for a Chinese document, it will return simply `zh`.

Text Analytics Language Detection API returns detected languages with their name and code. Text Analytics language code parameteres conform to [BCP-47](https://tools.ietf.org/html/bcp47) standard with most of them conforming to [ISO-639-1](https://en.wikipedia.org/wiki/ISO_639-1) identifiers. 

If you have content expressed in a less frequently used language, you can try Language Detection to see if it returns a code. The response for languages that cannot be detected is `unknown`.

| Language | Language Code |  v3 support | Available starting with v3 model version: | Code Standard    |
|:---------|:-------------:|:----------:|:-----------------------------------------:|:--------:|
|Afrikaans|`af`|✓|    |iso639-1|
|Albanian|`sq`|✓|    |iso639-1|
|Arabic|`ar`|✓|    |iso639-1|
|Armenian|`hy`|✓|    |iso639-1|
|Basque|`eu`|✓|    |iso639-1|
|Belarusian|`be`|✓|    |iso639-1|
|Bengali|`bn`|✓|    |iso639-1|
|Bosnian|`bs`|✓|9/1/2020|iso639-1|
|Bulgarian|`bg`|✓|    |iso639-1|
|Burmese|`my`|✓|    |iso639-1|
|Catalan,Valencian|`ca`|✓|    |iso639-1|
|Central Khmer|`km`|✓|    |iso639-1|
|Chinese|`zh`|✓|    |iso639-1|
|Chinese Simplified|`zh_chs`|✓|    |BCP-47|
|Chinese Traditional|`zh_cht`|✓|    |BCP-47|
|Croatian|`hr`|✓|    |iso639-1|
|Czech|`cs`|✓|    |iso639-1|
|Danish|`da`|✓|    |iso639-1|
|Dari|`prs`|✓|9/1/2020|BCP-47|
|Divehi, Dhivehi, Maldivian|`dv`|✓|    |iso639-1|
|Dutch, Flemish|`nl`|✓|    |iso639-1|
|English|`en`|✓|    |iso639-1|
|Esperanto|`eo`|✓|    |iso639-1|
|Estonian|`et`|✓|    |iso639-1|
|Fijian|`fj`|✓|9/1/2020|iso639-1|
|Finnish|`fi`|✓|    |iso639-1|
|French|`fr`|✓|    |iso639-1|
|Galician|`gl`|✓|    |iso639-1|
|Georgian|`ka`|✓|    |iso639-1|
|German|`de`|✓|    |iso639-1|
|Greek|`el`|✓|    |iso639-1|
|Gujarati|`gu`|✓|    |iso639-1|
|Haitian, Haitian Creole|`ht`|✓|    |iso639-1|
|Hebrew|`he`|✓|    |iso639-1|
|Hindi|`hi`|✓|    |iso639-1|
|Hmong Daw|`mww`|✓|9/1/2020|BCP-47|
|Hungarian|`hu`|✓|    |iso639-1|
|Icelandic|`is`|✓|    |iso639-1|
|Indonesian|`id`|✓|    |iso639-1|
|Inuktitut|`iu`|✓|    |iso639-1|
|Irish|`ga`|✓|    |iso639-1|
|Italian|`it`|✓|    |iso639-1|
|Japanese|`ja`|✓|    |iso639-1|
|Kannada|`kn`|✓|    |iso639-1|
|Kazakh|`kk`|✓|9/1/2020|iso639-1|
|Korean|`ko`|✓|    |iso639-1|
|Kurdish|`ku`|✓|    |iso639-1|
|Lao|`lo`|✓|    |iso639-1|
|Latin|`la`|✓|    |iso639-1|
|Latvian|`lv`|✓|    |iso639-1|
|Lithuanian|`lt`|✓|    |iso639-1|
|Macedonian|`mk`|✓|    |iso639-1|
|Malagasy|`mg`|✓|9/1/2020|iso639-1|
|Malay|`ms`|✓|    |iso639-1|
|Malayalam|`ml`|✓|    |iso639-1|
|Maltese|`mt`|✓|    |iso639-1|
|Maori|`mi`|✓|9/1/2020|iso639-1|
|Marathi|`mr`|✓|9/1/2020|iso639-1|
|Norwegian|`no`|✓|    |iso639-1|
|Norwegian Nynorsk|`nn`|✓|    |iso639-1|
|Oriya|`or`|✓|    |iso639-1|
|Pashto, Pushto|`ps`|✓|    |iso639-1|
|Persian|`fa`|✓|    |iso639-1|
|Polish|`pl`|✓|    |iso639-1|
|Portuguese|`pt`|✓|    |iso639-1|
|Punjabi, Panjabi|`pa`|✓|    |iso639-1|
|Queretaro Otomi|`otq`|✓|9/1/2020|BCP-47|
|Romanian, Moldavian, Moldovan|`ro`|✓|    |iso639-1|
|Russian|`ru`|✓|    |iso639-1|
|Samoan|`sm`|✓|9/1/2020|iso639-1|
|Serbian|`sr`|✓|    |iso639-1|
|Sinhala, Sinhalese|`si`|✓|    |iso639-1|
|Slovak|`sk`|✓|    |iso639-1|
|Slovenian|`sl`|✓|    |iso639-1|
|Somali|`so`|✓|    |iso639-1|
|Spanish, Castilian|`es`|✓|    |iso639-1|
|Swahili|`sw`|✓|    |iso639-1|
|Swedish|`sv`|✓|    |iso639-1|
|Tagalog|`tl`|✓|    |iso639-1|
|Tahitian|`ty`|✓|9/1/2020|iso639-1|
|Tamil|`ta`|✓|    |iso639-1|
|Telugu|`te`|✓|    |iso639-1|
|Thai|`th`|✓|    |iso639-1|
|Tongan|`to`|✓|9/1/2020|iso639-1|
|Turkish|`tr`|✓|    |iso639-1|
|Ukrainian|`uk`|✓|    |iso639-1|
|Urdu|`ur`|✓|    |iso639-1|
|Uzbek|`uz`|✓|    |iso639-1|
|Vietnamese|`vi`|✓|    |iso639-1|
|Welsh|`cy`|✓|    |iso639-1|
|Yiddish|`yi`|✓|    |iso639-1|
|Yucatec Maya|`yua`|✓|    |BCP-47|


## See also

* [What is the Text Analytics API?](overview.md)   
