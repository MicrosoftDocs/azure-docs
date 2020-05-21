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
ms.date: 05/13/2020
ms.author: aahi
---
# Text Analytics API v3 language support 

> [!IMPORTANT]
> Version 3.x of the Text Analytics API is currently unavailable in the following regions: Central India, UAE North, South Africa North, China North 2, China East 2.


#### [Sentiment Analysis](#tab/sentiment-analysis)

| Language              | Language code | v2 support | v3 support | Starting v3 model version: |              Notes |
|:----------------------|:-------------:|:----------:|:----------:|:--------------------------:|-------------------:|
| Chinese-Simplified    |   `zh-hans`   |     ✓      |     ✓      |         10-01-2019         | `zh` also accepted |
| Chinese-Traditional   |   `zh-hant`   |            |     ✓      |         10-01-2019         |                    |
| Danish*               |     `da`      |     ✓      |            |                            |                    |
| Dutch                 |     `nl`      |     ✓      |            |                            |                    |
| English               |     `en`      |     ✓      |     ✓      |         10-01-2019         |                    |
| Finnish               |     `fi`      |     ✓      |            |                            |                    |
| French                |     `fr`      |     ✓      |     ✓      |         10-01-2019         |                    |
| German                |     `de`      |     ✓      |     ✓      |         10-01-2019         |                    |
| Greek                 |     `el`      |     ✓      |            |                            |                    |
| Italian               |     `it`      |     ✓      |     ✓      |         10-01-2019         |                    |
| Japanese              |     `ja`      |     ✓      |     ✓      |         10-01-2019         |                    |
| Korean                |     `ko`      |            |     ✓      |         10-01-2019         |                    |
| Norwegian  (Bokmål)   |     `no`      |     ✓      |            |                            |                    |
| Polish                |     `pl`      |     ✓      |            |                            |                    |
| Portuguese (Portugal) |    `pt-PT`    |     ✓      |     ✓      |         10-01-2019         | `pt` also accepted |
| Russian               |     `ru`      |     ✓      |            |                            |                    |
| Spanish               |     `es`      |     ✓      |     ✓      |         10-01-2019         |                    |
| Swedish               |     `sv`      |     ✓      |            |                            |                    |
| Turkish               |     `tr`      |     ✓      |            |                            |                    |

### Opinion mining (v3.1-preview only)

| Language              | Language code | Starting with v3 model version: |              Notes |
|:----------------------|:-------------:|:------------------------------------:|-------------------:|
| English               |     `en`      |              04-01-2020              |                    |


#### [Named Entity Recognition (NER)](#tab/named-entity-recognition)

> [!NOTE]
> * NER v3 currently only supports the English language. If you call NER v3 with a different language,  The API will return v2.1 results, provided the language is supported in version 2.1.
> * v2.1 only returns the full set of available entities for the English, Chinese-Simplified, French, German, and Spanish languages. the "Person", "Location" and "Organization" entities are returned for other languages.

| Language               | Language code | v2.1 support | v3 support | Starting with v3 model version: |       Notes        |
|:-----------------------|:-------------:|:----------:|:----------:|:-------------------------------:|:------------------:|
| Arabic*                |     `ar`      |     ✓      |            |                                 |                    |
| Czech*                 |     `cs`      |     ✓      |            |                                 |                    |
| Chinese-Simplified     |   `zh-hans`   |     ✓      |            |                                 | `zh` also accepted |
| Chinese-Traditional*   |   `zh-hant`   |     ✓      |            |                                 |                    |
| Danish*                |     `da`      |     ✓      |            |                                 |                    |
| Dutch*                 |     `nl`      |     ✓      |            |                                 |                    |
| English                |     `en`      |     ✓      |     ✓      |           10-01-2019            |                    |
| Finnish*               |     `fi`      |     ✓      |            |                                 |                    |
| French                 |     `fr`      |     ✓      |            |                                 |                    |
| German                 |     `de`      |     ✓      |            |                                 |                    |
| Hebrew*                |     `he`      |     ✓      |            |                                 |                    |
| Hungarian*             |     `hu`      |     ✓      |            |                                 |                    |
| Italian*               |     `it`      |     ✓      |            |                                 |                    |
| Japanese*              |     `ja`      |     ✓      |            |                                 |                    |
| Korean*                |     `ko`      |     ✓      |            |                                 |                    |
| Norwegian  (Bokmål)*   |     `no`      |     ✓      |            |                                 | `nb` also accepted |
| Polish*                |     `pl`      |     ✓      |            |                                 |                    |
| Portuguese (Portugal)* |    `pt-PT`    |     ✓      |            |                                 | `pt` also accepted |
| Portuguese (Brazil)*   |    `pt-BR`    |     ✓      |            |                                 |                    |
| Russian*               |     `ru`      |     ✓      |            |                                 |                    |
| Spanish*               |     `es`      |     ✓      |            |                                 |                    |
| Swedish*               |     `sv`      |     ✓      |            |                                 |                    |
| Turkish*               |     `tr`      |     ✓      |            |                                 |                    |

#### [Key phrase extraction](#tab/key-phrase-extraction)

| Language              | Language code | v2 support | v3 support | Available starting with v3 model version: |       Notes        |
|:----------------------|:-------------:|:----------:|:----------:|:-----------------------------------------:|:------------------:|
| Dutch                 |     `nl`      |     ✓      |     ✓      |                10-01-2019                 |                    |
| English               |     `en`      |     ✓      |     ✓      |                10-01-2019                 |                    |
| Finnish               |     `fi`      |     ✓      |     ✓      |                10-01-2019                 |                    |
| French                |     `fr`      |     ✓      |     ✓      |                10-01-2019                 |                    |
| German                |     `de`      |     ✓      |     ✓      |                10-01-2019                 |                    |
| Italian               |     `it`      |     ✓      |     ✓      |                10-01-2019                 |                    |
| Japanese              |     `ja`      |     ✓      |     ✓      |                10-01-2019                 |                    |
| Korean                |     `ko`      |     ✓      |     ✓      |                10-01-2019                 |                    |
| Norwegian  (Bokmål)   |     `no`      |     ✓      |     ✓      |                10-01-2019                 | `nb` also accepted |
| Polish                |     `pl`      |     ✓      |     ✓      |                10-01-2019                 |                    |
| Portuguese (Portugal) |    `pt-PT`    |     ✓      |     ✓      |                10-01-2019                 | `pt` also accepted |
| Portuguese (Brazil)   |    `pt-BR`    |     ✓      |     ✓      |                10-01-2019                 |                    |
| Russian               |     `ru`      |     ✓      |     ✓      |                10-01-2019                 |                    |
| Spanish               |     `es`      |     ✓      |     ✓      |                10-01-2019                 |                    |
| Swedish               |     `sv`      |     ✓      |     ✓      |                10-01-2019                 |                    |

#### [Entity linking](#tab/entity-linking)

| Language | Language code | v2 support | v3 support | Available starting with v3 model version: | Notes |
|:---------|:-------------:|:----------:|:----------:|:-----------------------------------------:|:-----:|
| English  |     `en`      |     ✓      |     ✓      |                10-01-2019                 |       |
| Spanish  |     `es`      |     ✓      |     ✓      |                10-01-2019                 |       |

#### [Language Detection](#tab/language-detection)

The Text Analytics API can detect a wide range of languages, variants, dialects, and some regional/cultural languages.  Language Detection returns the "script" of a language. For instance, for the phrase "I have a dog" it will return  `en` instead of  `en-US`. The only special case is Chinese, where the language detection capability will return `zh_CHS` or `zh_CHT` if it can determine the script given the text provided. In situations where a specific script cannot be identified for a Chinese document, it will return simply `zh`.

We don't publish the exact list of languages for this feature, but it can detect a wide range of languages, variants, dialects, and some regional/cultural languages. 

If you have content expressed in a less frequently used language, you can try Language Detection to see if it returns a code. The response for languages that cannot be detected is `unknown`.

---

## See also

* [What is the Text Analytics API?](overview.md)   
