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

The Text Analytics API can detect a wide range of languages, variants, dialects, and some regional/cultural languages, and return detected languages with their name and code. Text Analytics Language Detection language code parameters conform to [BCP-47](https://tools.ietf.org/html/bcp47) standard with most of them conforming to [ISO-639-1](https://www.iso.org/iso-639-language-codes.html) identifiers. 

If you have content expressed in a less frequently used language, you can try Language Detection to see if it returns a code. The response for languages that cannot be detected is `unknown`.

| Language | Language Code |  v3 support | Available starting with v3 model version: |
|:---------|:-------------:|:----------:|:-----------------------------------------:|
|Afrikaans|`af`|✓|    |
|Albanian|`sq`|✓|    |
|Arabic|`ar`|✓|    |
|Armenian|`hy`|✓|    |
|Basque|`eu`|✓|    |
|Belarusian|`be`|✓|    |
|Bengali|`bn`|✓|    |
|Bosnian|`bs`|✓|2020-09-01|
|Bulgarian|`bg`|✓|    |
|Burmese|`my`|✓|    |
|Catalan, Valencian|`ca`|✓|    |
|Central Khmer|`km`|✓|    |
|Chinese|`zh`|✓|    |
|Chinese Simplified|`zh_chs`|✓|    |
|Chinese Traditional|`zh_cht`|✓|    |
|Croatian|`hr`|✓|    |
|Czech|`cs`|✓|    |
|Danish|`da`|✓|    |
|Dari|`prs`|✓|2020-09-01|
|Divehi, Dhivehi, Maldivian|`dv`|✓|    |
|Dutch, Flemish|`nl`|✓|    |
|English|`en`|✓|    |
|Esperanto|`eo`|✓|    |
|Estonian|`et`|✓|    |
|Fijian|`fj`|✓|2020-09-01|
|Finnish|`fi`|✓|    |
|French|`fr`|✓|    |
|Galician|`gl`|✓|    |
|Georgian|`ka`|✓|    |
|German|`de`|✓|    |
|Greek|`el`|✓|    |
|Gujarati|`gu`|✓|    |
|Haitian, Haitian Creole|`ht`|✓|    |
|Hebrew|`he`|✓|    |
|Hindi|`hi`|✓|    |
|Hmong Daw|`mww`|✓|2020-09-01|
|Hungarian|`hu`|✓|    |
|Icelandic|`is`|✓|    |
|Indonesian|`id`|✓|    |
|Inuktitut|`iu`|✓|    |
|Irish|`ga`|✓|    |
|Italian|`it`|✓|    |
|Japanese|`ja`|✓|    |
|Kannada|`kn`|✓|    |
|Kazakh|`kk`|✓|2020-09-01|
|Korean|`ko`|✓|    |
|Kurdish|`ku`|✓|    |
|Lao|`lo`|✓|    |
|Latin|`la`|✓|    |
|Latvian|`lv`|✓|    |
|Lithuanian|`lt`|✓|    |
|Macedonian|`mk`|✓|    |
|Malagasy|`mg`|✓|2020-09-01|
|Malay|`ms`|✓|    |
|Malayalam|`ml`|✓|    |
|Maltese|`mt`|✓|    |
|Maori|`mi`|✓|2020-09-01|
|Marathi|`mr`|✓|2020-09-01|
|Norwegian|`no`|✓|    |
|Norwegian Nynorsk|`nn`|✓|    |
|Oriya|`or`|✓|    |
|Pashto, Pushto|`ps`|✓|    |
|Persian|`fa`|✓|    |
|Polish|`pl`|✓|    |
|Portuguese|`pt`|✓|    |
|Punjabi, Panjabi|`pa`|✓|    |
|Queretaro Otomi|`otq`|✓|2020-09-01|
|Romanian, Moldavian, Moldovan|`ro`|✓|    |
|Russian|`ru`|✓|    |
|Samoan|`sm`|✓|2020-09-01|
|Serbian|`sr`|✓|    |
|Sinhala, Sinhalese|`si`|✓|    |
|Slovak|`sk`|✓|    |
|Slovenian|`sl`|✓|    |
|Somali|`so`|✓|    |
|Spanish, Castilian|`es`|✓|    |
|Swahili|`sw`|✓|    |
|Swedish|`sv`|✓|    |
|Tagalog|`tl`|✓|    |
|Tahitian|`ty`|✓|2020-09-01|
|Tamil|`ta`|✓|    |
|Telugu|`te`|✓|    |
|Thai|`th`|✓|    |
|Tongan|`to`|✓|2020-09-01|
|Turkish|`tr`|✓|    |
|Ukrainian|`uk`|✓|    |
|Urdu|`ur`|✓|    |
|Uzbek|`uz`|✓|    |
|Vietnamese|`vi`|✓|    |
|Welsh|`cy`|✓|    |
|Yiddish|`yi`|✓|    |
|Yucatec Maya|`yua`|✓|    |


---


## See also

* [What is the Text Analytics API?](overview.md)   
