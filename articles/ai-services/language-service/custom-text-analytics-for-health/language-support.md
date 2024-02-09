---
title: Language and region support for custom Text Analytics for health
titleSuffix: Azure AI services
description: Learn about the languages and regions supported by custom Text Analytics for health
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 04/14/2023
ms.custom: language-service-custom-ta4h
ms.author: aahi
---

# Language support for custom text analytics for health

Use this article to learn about the languages currently supported by custom Text Analytics for health.

## Multilingual option

With custom Text Analytics for health, you can train a model in one language and use it to extract entities from documents other languages. This feature saves you the trouble of building separate projects for each language and instead combining your datasets in a single project, making it easy to scale your projects to multiple languages. You can train your project entirely with English documents, and query it in: French, German, Italian, and others. You can enable the multilingual option as part of the project creation process or later through the project settings.

You aren't expected to add the same number of documents for every language. You should build the majority of your project in one language, and only add a few documents in languages you observe aren't performing well. If you create a project that is primarily in English, and start testing it in French, German, and Spanish, you might observe that German doesn't perform as well as the other two languages. In that case, consider adding 5% of your original English documents in German, train a new model and test in German again. In the [data labeling](how-to/label-data.md) page in Language Studio, you can select the language of the document you're adding. You should see better results for German queries. The more labeled documents you add, the more likely the results are going to get better. When you add data in another language, you shouldn't expect it to negatively affect other languages. 

Hebrew is not supported in multilingual projects. If the primary language of the project is Hebrew, you will not be able to add training data in other languages, or query the model with other languages. Similarly, if the primary language of the project is not Hebrew, you will not be able to add training data in Hebrew, or query the model in Hebrew.

## Language support

Custom Text Analytics for health supports `.txt` files in the following languages:

| Language | Language code |
| --- | --- |
| English | `en` |
| French | `fr` |
| German | `de` |
| Spanish | `es` |
| Italian | `it` |
| Portuguese (Portugal) | `pt-pt` |
| Hebrew | `he` |


## Next steps

* [Custom Text Analytics for health overview](overview.md)
* [Service limits](reference/service-limits.md)
