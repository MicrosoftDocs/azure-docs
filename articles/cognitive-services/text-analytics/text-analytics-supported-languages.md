---
title: Supported languages in Text Analytics API (Microsoft Cognitive Services on Azure) | Microsoft Docs
description: List of generally available and preview language support for Text Analytics API operations. Applies to sentiment analysis, key phrase extraction, and language detection.
services: cognitive-services
author: luiscabrer
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 09/05/2017
ms.author: luisca
---

# Supported languages in Text Analytics API 

This article explains which languages are supported for each operation: sentiment analysis, key phrase extraction, and language detection.

**Language Detection**

Text Analytics API can detect up to 120 different languages. Language Detection returns the "script" of a language. For instance, for the phrase "I have a dog" it will return  `en` instead of  `en-US`. The only special case is Chinese, where the language detection capability will return `zh_CHS` or `zh_CHT` if it can determine the script given the text provided. In situations where a specific script cannot be identified for a Chinese document, it will return simply `zh`.
 
**Sentiment Analysis and Key Phrase Extraction**

For sentiment analysis and key phrase extraction, the list of supported languages is more selective as we refine the analyzers to accommodate the linguistic rules of additional languages.

## Language list and status

Language support is initially rolled out in preview, graduating to generally available (GA) status, independently of each other and of the Text Analytics service overall. It's possible for languages to remain in preview, even while Text Analytics API transitions to generally available.


| Language    | Language code | Sentiment | Key phrases | Notes       |
|:----------- |:-------------:|:---------:|:-----------:|:-----------:|
| Danish      | `da`          | ✔ \*     |             |             |
| Dutch       | `nl`          | ✔ \*     | ✔          |             |
| English     | `en`          | ✔        | ✔           |             | 
| Finnish     | `fi`          | ✔ \*     | ✔           |             |
| French      | `fr`          | ✔        | ✔           |             |
| German      | `de`          | ✔ \*     | ✔           |            |
| Greek       | `el`          | ✔ \*     |             |            |
| Italian     | `it`          | ✔ \*     | ✔           |             |
| Japanese    | `ja`          |          | ✔           |            |
| Norwegian   | `no`          | ✔ \*     |             |             |
| Polish      | `pl`          | ✔ \*     |  ✔          |             |
| Portuguese (Portugal) | `pt-PT`| ✔        |  ✔          |`pt` also accepted |
| Portuguese (Brazil)   | `pt-BR`|          |  ✔   |         |
| Russian     | `ru`          | ✔ \*     |             |             |
| Spanish     | `es`          | ✔        | ✔           |             |
| Swedish     | `sv`          | ✔ \*     | ✔           |             |
| Turkish     | `tr`          | ✔ \*     |             |             |


\* indicates language support in preview

## See also

 [Cognitive Services Documentation page](https://docs.microsoft.com/azure/cognitive-services/)   
 [Cognitive Services Product page](https://azure.microsoft.com/services/cognitive-services/)
