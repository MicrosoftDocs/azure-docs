---
title: Language support - Text Analytics API
titleSuffix: Azure Cognitive Services
description: "A list of natural languages supported by the Text Analytics API. This article explains which languages are supported for each operation: sentiment analysis, key phrase extraction, language detection, and entity recognition."
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 06/18/2019
ms.author: aahi
---
# Language and region support for the Text Analytics API

This article explains which languages are supported for each operation: sentiment analysis, key phrase extraction, language detection and named entity recognition.

## Language Detection

The Text Analytics API can detect a wide range of languages, variants, dialects, and some regional/cultural languages.  Language Detection returns the "script" of a language. For instance, for the phrase "I have a dog" it will return  `en` instead of  `en-US`. The only special case is Chinese, where the language detection capability will return `zh_CHS` or `zh_CHT` if it can determine the script given the text provided. In situations where a specific script cannot be identified for a Chinese document, it will return simply `zh`.

We don't publish the exact list of languages for this feature, but it can detect a wide range of languages, variants, dialects, and some regional/cultural languages. 

If you have content expressed in a less frequently used language, you can try Language Detection to see if it returns a code. The response for languages that cannot be detected is `unknown`.

## Sentiment Analysis, Key Phrase Extraction, and Named Entity Recognition

For sentiment analysis, key phrase extraction, and entity recognition, the list of supported languages is more selective as the analyzers are refined to accommodate the linguistic rules of additional languages. Support for the full set of [entity types](how-tos/text-analytics-how-to-entity-linking.md#supported-types-for-named-entity-recognition) is currently limited to the following languages: 
* English
* Chinese-Simplified
* French
* German
* Spanish

Only the `Person`, `Location` and `Organization` named entities are returned for the other languages.

## Language list and status

Language support is initially rolled out in preview, graduating to generally available (GA) status, independently of each other and of the Text Analytics service overall. It's possible for languages to remain in preview, even while Text Analytics API transitions to generally available.

| Language    | Language code | Sentiment | Key phrases | Named Entity Recognition |   Notes  |
|:----------- |:-------------:|:---------:|:-----------:|:-----------:|:-----------:
| Arabic      | `ar`          |           |             | ✔ \*                     | |
| Czech       | `cs`          |           |             | ✔ \*                     | |
| Chinese-Simplified | `zh-CN`|           |             | ✔ \*        |    |
| Danish      | `da`          | ✔ \*     | ✔           | ✔ \*            |     |
| Dutch       | `nl`          | ✔ \*     | ✔          |  ✔ \*           |     |
| English     | `en`          | ✔        | ✔           |  ✔ \*\*     |      |
| Finnish     | `fi`          | ✔ \*     | ✔           |  ✔ \*           |     |
| French      | `fr`          | ✔        | ✔           |  ✔ \*           |     |
| German      | `de`          | ✔ \*     | ✔           |  ✔ \*          |     |
| Greek       | `el`          | ✔ \*     |             |            |     |
| Hungarian   | `hu`          |           |             |  ✔ \*          |     | 
| Italian     | `it`          | ✔ \*     | ✔           |  ✔ \*           |     |
| Japanese    | `ja`          |          | ✔           |  ✔ \*          |     |
| Korean      | `ko`          |          | ✔           |  ✔ \*          |     |
| Norwegian  (Bokmål) | `no`  | ✔ \*     |  ✔          | ✔ \*            |     |
| Polish      | `pl`          | ✔ \*     |  ✔          |  ✔ \*           |     |
| Portuguese (Portugal) | `pt-PT`| ✔        |  ✔          | ✔ \*      |`pt` also accepted|
| Portuguese (Brazil)   | `pt-BR`|          |  ✔   |  ✔ \*       |     |
| Russian     | `ru`          | ✔ \*     | ✔           |  ✔ \*           |     |
| Spanish     | `es`          | ✔        | ✔           |   ✔ \*\*      |     | 
| Swedish     | `sv`          | ✔ \*     | ✔           |   ✔ \*          |     |
| Turkish     | `tr`          | ✔ \*     |             |   ✔ \*          |  |

\* Language support is in preview

\*\* [Named Entity Recognition](how-tos/text-analytics-how-to-entity-linking.md#named-entity-recognition-ner) and [Entity linking](how-tos/text-analytics-how-to-entity-linking.md#entity-linking) are both available for this language.    

## See also

[Cognitive Services Documentation page](https://docs.microsoft.com/azure/cognitive-services/)   
[Cognitive Services Product page](https://azure.microsoft.com/services/cognitive-services/)
