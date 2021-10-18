---
title: Language and region support for Custom Named Entity Recognition (NER)
titleSuffix: Azure Cognitive Services
description: Learn about the languages and regions supported by Custom Named Entity Recognition (NER).
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 11/02/2021
ms.custom: references_regions
ms.author: aahi
---

# Language support for Custom Named Entity Recognition (NER)

Use this article to learn about the languages and regions currently supported by Custom Named Entity Recognition (NER).

## Multiple language support

With custom NER, you can train a model in one language and test in another language. This feature is very powerful because it helps you save time and effort, instead of building separate projects for every language, you can handle multi-lingual dataset in one project. Your dataset doesn't have to be entirely in the same language but you have to specify this option at project creation. If you notice your model performing poorly in certain languages during the evaluation process, consider adding more data in this language to your training set.

> [!NOTE]
> To enable support for multiple languages, you need to enable this option when [creating your project](how-to/project-requirements.md).

## Language support

Custom NER supports `.txt` files in the following languages:

| Language | Locale |  
|--|--|
| English (United States) |`en-US` |
| French (France) |`fr-FR` |
| German |`de-DE` |
| Italian |`it-IT` |
| Spanish (Spain) |`es-ES` |
| Portuguese (Portugal) | `pt-PT` |
| Portuguese (Brazil) | `pt-BR` |

## Next steps

[Custom NER overview](overview.md)
