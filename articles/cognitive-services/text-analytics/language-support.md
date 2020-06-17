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
ms.date: 06/03/2020
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
| Italian               |     `it`      |     ✓      |     ✓      |         2019-10-01         |                    |
| Japanese              |     `ja`      |     ✓      |     ✓      |         2019-10-01         |                    |
| Korean                |     `ko`      |            |     ✓      |         2019-10-01         |                    |
| Norwegian  (Bokmål)   |     `no`      |     ✓      |            |                            |                    |
| Polish                |     `pl`      |     ✓      |            |                            |                    |
| Portuguese (Portugal) |    `pt-PT`    |     ✓      |     ✓      |         2019-10-01         | `pt` also accepted |
| Russian               |     `ru`      |     ✓      |            |                            |                    |
| Spanish               |     `es`      |     ✓      |     ✓      |         2019-10-01         |                    |
| Swedish               |     `sv`      |     ✓      |            |                            |                    |
| Turkish               |     `tr`      |     ✓      |            |                            |                    |

### Opinion mining (v3.1-preview only)

| Language              | Language code | Starting with v3 model version: |              Notes |
|:----------------------|:-------------:|:------------------------------------:|-------------------:|
| English               |     `en`      |              2020-04-01              |                    |


#### [Named Entity Recognition (NER)](#tab/named-entity-recognition)

> [!NOTE]
> * NER v3 currently only supports the English language. If you call NER v3 with a different language, the API will return v2.1 results, provided the language is supported in version 2.1.
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
| Spanish               |     `es`      |     ✓      |            |                                 |                    |
| Swedish               |     `sv`      |     ✓      |            |                                 |                    |
| Turkish               |     `tr`      |     ✓      |            |                                 |                    |

#### [Key phrase extraction](#tab/key-phrase-extraction)

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

We don't publish the exact list of languages for this feature, but it can detect a wide range of languages, variants, dialects, and some regional/cultural languages. 

If you have content expressed in a less frequently used language, you can try Language Detection to see if it returns a code. The response for languages that cannot be detected is `unknown`.

---

## See also

* [What is the Text Analytics API?](overview.md)   
