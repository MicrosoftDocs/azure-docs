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
ms.date: 07/06/2021
ms.author: aahi
---
# Text Analytics API v3 language support 

#### [Sentiment Analysis](#tab/sentiment-analysis)

> [!NOTE]
> Languages are added as new [model versions](concepts/model-versioning.md) are released for specific Text Analytics features. The current model version for Sentiment Analysis is `2020-04-01`.

| Language              | Language code | v3.x support | Starting v3 model version: |              Notes |
|:----------------------|:-------------:|:----------:|:--------------------------:|-------------------:|
| Chinese-Simplified    |   `zh-hans`   |     ✓      |         2019-10-01         | `zh` also accepted |
| Chinese-Traditional   |   `zh-hant`   |    ✓      |         2019-10-01         |                    |
| Dutch                 |     `nl`      |     ✓      |         2019-10-01        |                    |
| English               |     `en`      |     ✓      |         2019-10-01         |                    |
| French                |     `fr`      |     ✓      |         2019-10-01         |                    |
| German                |     `de`      |     ✓      |         2019-10-01         |                    |
| Hindi                 |    `hi`       |     ✓      |         2020-04-01         |                    |
| Italian               |     `it`      |     ✓      |         2019-10-01         |                    |
| Japanese              |     `ja`      |     ✓      |         2019-10-01         |                    |
| Korean                |     `ko`      |    ✓      |         2019-10-01         |                    |
| Norwegian  (Bokmål)   |     `no`      |     ✓      |         2020-04-01         |                    |
| Portuguese (Brazil)   |    `pt-BR`    |     ✓      |         2020-04-01         |                    |
| Portuguese (Portugal) |    `pt-PT`    |     ✓      |         2019-10-01         | `pt` also accepted |
| Spanish               |     `es`      |     ✓      |         2019-10-01         |                    |
| Turkish               |     `tr`      |     ✓       |         2020-04-01        |                    |

### Opinion mining (v3.1 only)

| Language              | Language code | Starting with v3 model version: |              Notes |
|:----------------------|:-------------:|:------------------------------------:|-------------------:|
| English               |     `en`      |              2020-04-01              |                    |


#### [Named Entity Recognition (NER)](#tab/named-entity-recognition)

> [!NOTE]
> * Only "Person", "Location" and "Organization" entities are returned for languages marked with *.
> * Languages are added as new [model versions](concepts/model-versioning.md) are released for specific Text Analytics features. The current model version for NER is `2021-06-01`.

| Language               | Language code | v3.x support | Starting with v3 model version: |       Notes        |
|:-----------------------|:-------------:|:----------:|:-------------------------------:|:------------------:|
| Arabic                 |     `ar`      |      ✓*    |               2019-10-01        |                    |
| Chinese-Simplified     |   `zh-hans`   |     ✓      |               2021-01-15        | `zh` also accepted |
| Chinese-Traditional   |   `zh-hant`   |     ✓*      |               2019-10-01        |                    |
| Czech                 |     `cs`      |     ✓*      |               2019-10-01        |                    |
| Danish                |     `da`      |     ✓*      |               2019-10-01        |                    |
| Dutch                 |     `nl`      |     ✓*      |               2019-10-01        |                    |
| English                |     `en`      |     ✓      |               2019-10-01        |                    |
| Finnish               |     `fi`      |     ✓*      |               2019-10-01        |                    |
| French                 |     `fr`      |     ✓      |               2021-01-15        |                    |
| German                 |     `de`      |     ✓      |               2021-01-15        |                    |
| Hebrew                |     `he`      |     ✓*      |               2019-10-01        |                    |
| Hungarian             |     `hu`      |     ✓*      |               2019-10-01        |                    |
| Italian               |     `it`      |     ✓       |               2021-01-15        |                    |
| Japanese              |     `ja`      |     ✓       |               2021-01-15        |                    |
| Korean                |     `ko`      |     ✓       |               2021-01-15        |                    |
| Norwegian  (Bokmål)   |     `no`      |     ✓*      |               2019-10-01        | `nb` also accepted |
| Polish                |     `pl`      |     ✓*      |               2019-10-01        |                    |
| Portuguese (Brazil)   |    `pt-BR`    |     ✓       |               2021-01-15        |                    |
| Portuguese (Portugal) |    `pt-PT`    |     ✓       |               2021-01-15        | `pt` also accepted |
| Russian              |     `ru`      |     ✓*       |               2019-10-01        |                    |
| Spanish               |     `es`      |     ✓       |               2020-04-01        |                    |
| Swedish               |     `sv`      |     ✓*      |               2019-10-01        |                    |
| Turkish               |     `tr`      |     ✓*      |               2019-10-01        |                    |

#### [Key Phrase Extraction](#tab/key-phrase-extraction)

> [!NOTE]
> Languages are added as new [model versions](concepts/model-versioning.md) are released for specific Text Analytics features. The current model version for Key Phrase Extraction is `2021-06-01`.

| Language              | Language code |  v3.x support | Starting with v3 model version: |       Notes        |
|:----------------------|:-------------:|:----------:|:-----------------------------------------:|:------------------:|
| Afrikaans             |     `af`      |     ✓      |                2020-07-01                 |                    |
| Bulgarian             |     `bg`      |     ✓      |                2020-07-01                 |                    |
| Catalan               |     `ca`      |     ✓      |                2020-07-01                 |                    |
| Chinese-Simplified    |     `zh-hans` |     ✓      |                2021-06-01                 |                    |
| Croatian              |     `hr`      |     ✓      |                2020-07-01                 |                    |
| Danish                |     `da`      |     ✓      |                2019-10-01                 |                    |
| Dutch                 |     `nl`      |     ✓      |                2019-10-01                 |                    |
| English               |     `en`      |     ✓      |                2019-10-01                 |                    |
| Estonian              |     `et`      |     ✓      |                2020-07-01                 |                    |
| Finnish               |     `fi`      |     ✓      |                2019-10-01                 |                    |
| French                |     `fr`      |     ✓      |                2019-10-01                 |                    |
| German                |     `de`      |     ✓      |                2019-10-01                 |                    |
| Greek                 |     `el`      |     ✓      |                2020-07-01                 |                    |
| Hungarian             |     `hu`      |     ✓      |                2020-07-01                 |                    |
| Italian               |     `it`      |     ✓      |                2019-10-01                 |                    |
| Indonesian            |     `id`      |     ✓      |                2020-07-01                 |                    |
| Japanese              |     `ja`      |     ✓      |                2019-10-01                 |                    |
| Korean                |     `ko`      |     ✓      |                2019-10-01                 |                    |
| Latvian               |     `lv`      |     ✓      |                2020-07-01                 |                    |
| Norwegian  (Bokmål)   |     `no`      |     ✓      |                2020-07-01                 | `nb` also accepted |
| Polish                |     `pl`      |    ✓      |                2019-10-01                 |                    |
| Portuguese (Brazil)   |    `pt-BR`    |     ✓      |                2019-10-01                 |                    |
| Portuguese (Portugal) |    `pt-PT`    |    ✓      |                2019-10-01                 | `pt` also accepted |
| Romanian              |     `ro`      |     ✓      |                2020-07-01                 |                    |
| Russian               |     `ru`      |     ✓      |                2019-10-01                 |                    |
| Spanish               |     `es`      |     ✓      |                2019-10-01                 |                    |
| Slovak                |     `sk`      |     ✓      |                2020-07-01                 |                    |
| Slovenian             |     `sl`      |     ✓      |                2020-07-01                 |                    |
| Swedish               |     `sv`      |     ✓      |                2019-10-01                 |                    |
| Turkish               |     `tr`      |     ✓      |                2020-07-01                 |                    |

#### [Entity Linking](#tab/entity-linking)

> [!NOTE]
> Languages are added as new [model versions](concepts/model-versioning.md) are released for specific Text Analytics features. The current model version for Entity Linking is `2020-02-01`.

| Language | Language code |  v3.x support | Starting with v3 model version: | Notes |
|:---------|:-------------:|:----------:|:-----------------------------------------:|:-----:|
| English  |     `en`      |     ✓      |                2019-10-01                 |       |
| Spanish  |     `es`      |    ✓      |                2019-10-01                 |       |

#### [Text Analytics for health](#tab/health)

> [!NOTE]
> * The container uses different model versions than the API endpoints and SDK.
> * Languages are added as new model versions are released for specific Text Analytics features. The current [model versions](concepts/model-versioning.md) for Text Analytics for health are:
>    * API and SDK: `2021-05-15`
>    * Container: `2021-03-01`


| Language | Language code |  v3.x support | Starting with v3 model version: | Notes |
|:---------|:-------------:|:----------:|:-----------------------------------------:|:-----:|
| English  |     `en`      |     ✓      |                API endpoint: 2019-10-01 <br> Container: 2020-04-16                |       |

#### [Personally Identifiable Information (PII)](#tab/pii)

> [!NOTE]
> Languages are added as new [model versions](concepts/model-versioning.md) are released for specific Text Analytics features. The current model version for PII is `2021-01-15`.

| Language               | Language code | v3.x support | Starting with v3 model version: |       Notes        |
|:-----------------------|:-------------:|:----------:|:-------------------------------:|:------------------:|
| Chinese-Simplified     |   `zh-hans`   |     ✓      |               2021-01-15        | `zh` also accepted |
| English                |     `en`      |     ✓      |               2020-07-01        |                    |
| French                 |     `fr`      |     ✓      |               2021-01-15        |                    |
| German                 |     `de`      |     ✓      |               2021-01-15        |                    |
| Italian               |     `it`      |     ✓       |               2021-01-15        |                    |
| Japanese              |     `ja`      |     ✓       |               2021-01-15        |                    |
| Korean                |     `ko`      |     ✓       |               2021-01-15        |                    |
| Portuguese (Brazil)   |    `pt-BR`    |     ✓       |               2021-01-15        |                    |
| Portuguese (Portugal) |    `pt-PT`    |     ✓       |               2021-01-15        | `pt` also accepted |
| Spanish               |     `es`      |     ✓       |               2020-04-01        |                    |

#### [Language Detection](#tab/language-detection)

> [!NOTE]
> Languages are added as new [model versions](concepts/model-versioning.md) are released for specific Text Analytics features. The current model version for Language Detection is `2021-01-05`.

The Text Analytics API can detect a wide range of languages, variants, dialects, and some regional/cultural languages, and return detected languages with their name and code. Text Analytics Language Detection language code parameters conform to [BCP-47](https://tools.ietf.org/html/bcp47) standard with most of them conforming to [ISO-639-1](https://www.iso.org/iso-639-language-codes.html) identifiers. 

If you have content expressed in a less frequently used language, you can try Language Detection to see if it returns a code. The response for languages that cannot be detected is `unknown`.

| Language | Language Code | v3.x support | Starting with v3 model version: |
|:-|:-:|:-:|:-:|
|Afrikaans|`af`|✓|    |
|Albanian|`sq`|✓|    |
|Amharic|`am`|✓|2021-01-05|
|Arabic|`ar`|✓|    |
|Armenian|`hy`|✓|    |
|Assamese|`as`|✓|2021-01-05|
|Azerbaijani|`az`|✓|2021-01-05|
|Basque|`eu`|✓|    |
|Belarusian|`be`|✓|    |
|Bengali|`bn`|✓|    |
|Bosnian|`bs`|✓|2020-09-01|
|Bulgarian|`bg`|✓|    |
|Burmese|`my`|✓|    |
|Catalan|`ca`|✓|    |
|Central Khmer|`km`|✓|    |
|Chinese|`zh`|✓|    |
|Chinese Simplified|`zh_chs`|✓|    |
|Chinese Traditional|`zh_cht`|✓|    |
|Corsican|`co`|✓|2021-01-05|
|Croatian|`hr`|✓|    |
|Czech|`cs`|✓|    |
|Danish|`da`|✓|    |
|Dari|`prs`|✓|2020-09-01|
|Divehi|`dv`|✓|    |
|Dutch|`nl`|✓|    |
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
|Haitian|`ht`|✓|    |
|Hausa|`ha`|✓|2021-01-05|
|Hebrew|`he`|✓|    |
|Hindi|`hi`|✓|    |
|Hmong Daw|`mww`|✓|2020-09-01|
|Hungarian|`hu`|✓|    |
|Icelandic|`is`|✓|    |
|Igbo|`ig`|✓|2021-01-05|
|Indonesian|`id`|✓|    |
|Inuktitut|`iu`|✓|    |
|Irish|`ga`|✓|    |
|Italian|`it`|✓|    |
|Japanese|`ja`|✓|    |
|Javanese|`jv`|✓|2021-01-05|
|Kannada|`kn`|✓|    |
|Kazakh|`kk`|✓|2020-09-01|
|Kinyarwanda|`rw`|✓|2021-01-05|
|Kirghiz|`ky`|✓|2021-01-05|
|Korean|`ko`|✓|    |
|Kurdish|`ku`|✓|    |
|Lao|`lo`|✓|    |
|Latin|`la`|✓|    |
|Latvian|`lv`|✓|    |
|Lithuanian|`lt`|✓|    |
|Luxembourgish|`lb`|✓|2021-01-05|
|Macedonian|`mk`|✓|    |
|Malagasy|`mg`|✓|2020-09-01|
|Malay|`ms`|✓|    |
|Malayalam|`ml`|✓|    |
|Maltese|`mt`|✓|    |
|Maori|`mi`|✓|2020-09-01|
|Marathi|`mr`|✓|2020-09-01|
|Mongolian|`mn`|✓|2021-01-05|
|Nepali|`ne`|✓|2021-01-05|
|Norwegian|`no`|✓|    |
|Norwegian Nynorsk|`nn`|✓|    |
|Oriya|`or`|✓|    |
|Pasht|`ps`|✓|    |
|Persian|`fa`|✓|    |
|Polish|`pl`|✓|    |
|Portuguese|`pt`|✓|    |
|Punjabi|`pa`|✓|    |
|Queretaro Otomi|`otq`|✓|2020-09-01|
|Romanian|`ro`|✓|    |
|Russian|`ru`|✓|    |
|Samoan|`sm`|✓|2020-09-01|
|Serbian|`sr`|✓|    |
|Shona|`sn`|✓|2021-01-05|
|Sindhi|`sd`|✓|2021-01-05|
|Sinhala|`si`|✓|    |
|Slovak|`sk`|✓|    |
|Slovenian|`sl`|✓|    |
|Somali|`so`|✓|    |
|Spanish|`es`|✓|    |
|Sundanese|`su`|✓|2021-01-05|
|Swahili|`sw`|✓|    |
|Swedish|`sv`|✓|    |
|Tagalog|`tl`|✓|    |
|Tahitian|`ty`|✓|2020-09-01|
|Tajik|`tg`|✓|2021-01-05|
|Tamil|`ta`|✓|    |
|Tatar|`tt`|✓|2021-01-05|
|Telugu|`te`|✓|    |
|Thai|`th`|✓|    |
|Tibetan|`bo`|✓|2021-01-05|
|Tigrinya|`ti`|✓|2021-01-05|
|Tongan|`to`|✓|2020-09-01|
|Turkish|`tr`|✓|2021-01-05|
|Turkmen|`tk`|✓|2021-01-05|
|Ukrainian|`uk`|✓||
|Urdu|`ur`|✓||
|Uzbek|`uz`|✓||
|Vietnamese|`vi`|✓||
|Welsh|`cy`|✓||	
|Xhosa|`xh`|✓|2021-01-05|
|Yiddish|`yi`|✓||
|Yoruba|`yo`|✓|2021-01-05|
|Yucatec Maya| `yua` | ✓| |
|Zulu|`zu`|✓|2021-01-05|


#### [Text summarization](#tab/summarization)

| Language | Language code |  v3.x support | Starting with v3 model version: | Notes |
|:---------|:-------------:|:----------:|:-----------------------------------------:|:-----:|
| Chinese-Simplified     |   `zh-hans`   |     ✓      |               2021-08-01        | `zh` also accepted |
| English  |     `en`      |     ✓      |                2021-08-01                 |       |
| French                 |     `fr`      |     ✓      |               2021-08-01        |                    |
| German                 |     `de`      |     ✓      |               2021-08-01        |                    |
| Italian               |     `it`      |     ✓       |               2021-08-01        |                    |
| Japanese              |     `ja`      |     ✓       |               2021-08-01        |                    |
| Korean                |     `ko`      |     ✓       |               2021-08-01        |                    |
| Spanish               |     `es`      |     ✓       |               2021-08-01        |                    |
| Portuguese (Brazil)   |    `pt-BR`    |     ✓       |               2021-08-01        |                    |
| Portuguese (Portugal) |    `pt-PT`    |     ✓       |               2021-08-01        | `pt` also accepted |

---

## See also

* [What is the Text Analytics API?](overview.md)   
* [Model versions](concepts/model-versioning.md)
