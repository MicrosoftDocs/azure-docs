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
ms.date: 04/15/2020
ms.author: aahi
---
# Language support for the Text Analytics API

> [!NOTE]
> This article only describes v3 of the Text Analytics API. If you don't see your desired language listed, it may be supported in [version 2.1](migration-guide.md#version-2-language-support).

#### [Sentiment Analysis](#tab/sentiment-analysis)

| Language              | Language code | Available starting with v3 model version: |              Notes |
|:----------------------|:-------------:|:------------------------------------:|-------------------:|
| Chinese-Simplified    |   `zh-hans`   |              10-01-2019              | `zh` also accepted |
| Chinese-Traditional   |   `zh-hant`   |              10-01-2019              |                    |
| English               |     `en`      |              10-01-2019              |                    |
| French                |     `fr`      |              10-01-2019              |                    |
| German                |     `de`      |              10-01-2019              |                    |
| Italian               |     `it`      |              10-01-2019              |                    |
| Japanese              |     `ja`      |              10-01-2019              |                    |
| Korean                |     `ko`      |              10-01-2019              |                    |
| Portuguese (Portugal) |    `pt-PT`    |              10-01-2019              | `pt` also accepted |
| Spanish               |     `es`      |              10-01-2019              |                    |

### Opinion mining (preview)

| Language              | Language code | Available starting with v3 model version: |              Notes |
|:----------------------|:-------------:|:------------------------------------:|-------------------:|
| English               |     `en`      |              04-01-2020              |                    |


#### [Named Entity Recognition(NER)](#tab/named-entity-recognition)

| Language              | Language code | Available starting with v3 model version: |       Notes        |
|:----------------------|:-------------:|:---------------------------------------:|:------------------:|
| English               |     `en`      |               10-01-2019                |                    |
| Spanish               |     `es`      |               10-01-2019                |                    |

#### [Key phrase extraction](#tab/key-phrase-extraction)

| Language              | Language code | Available starting with v3 model version: |       Notes        |
|:----------------------|:-------------:|:-----------------------------------------:|:------------------:|
| Dutch                 |     `nl`      |                10-01-2019                 |                    |
| English               |     `en`      |                10-01-2019                 |                    |
| Finnish               |     `fi`      |                10-01-2019                 |                    |
| French                |     `fr`      |                10-01-2019                 |                    |
| German                |     `de`      |                10-01-2019                 |                    |
| Italian               |     `it`      |                10-01-2019                 |                    |
| Japanese              |     `ja`      |                10-01-2019                 |                    |
| Korean                |     `ko`      |                10-01-2019                 |                    |
| Norwegian  (Bokmål)   |     `no`      |                10-01-2019                 | `nb` also accepted |
| Polish                |     `pl`      |                10-01-2019                 |                    |
| Portuguese (Portugal) |    `pt-PT`    |                10-01-2019                 | `pt` also accepted |
| Portuguese (Brazil)   |    `pt-BR`    |                10-01-2019                 |                    |
| Russian               |     `ru`      |                10-01-2019                 |                    |
| Spanish               |     `es`      |                10-01-2019                 |                    |
| Swedish               |     `sv`      |                10-01-2019                 |                    |

#### [Entity linking](#tab/entity-linking)

| Language              | Language code | Available starting with v3 model version: |       Notes        |
|:----------------------|:-------------:|:-----------------------------------------:|:------------------:|
| English               |     `en`      |                10-01-2019                 |                    |
| Spanish               |     `es`      |                10-01-2019                 |                    |

#### [Language Detection](#tab/language-detection)

The Text Analytics API can detect a wide range of languages, variants, dialects, and some regional/cultural languages.  Language Detection returns the "script" of a language. For instance, for the phrase "I have a dog" it will return  `en` instead of  `en-US`. The only special case is Chinese, where the language detection capability will return `zh_CHS` or `zh_CHT` if it can determine the script given the text provided. In situations where a specific script cannot be identified for a Chinese document, it will return simply `zh`.

We don't publish the exact list of languages for this feature, but it can detect a wide range of languages, variants, dialects, and some regional/cultural languages. 

If you have content expressed in a less frequently used language, you can try Language Detection to see if it returns a code. The response for languages that cannot be detected is `unknown`.

---

## See also

[Cognitive Services Documentation page](https://docs.microsoft.com/azure/cognitive-services/)   
[Cognitive Services Product page](https://azure.microsoft.com/services/cognitive-services/)
