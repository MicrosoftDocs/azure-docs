---
title: Language support in custom text classification
titleSuffix: Azure Cognitive Services
description: Learn about which languages are supported by custom entity extraction.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

# Language support

Use this article to learn which languages are supported by custom text classification.

## Multiple language support

With custom text classification, you can train a model in one language and test in another language. This feature is very powerful because it helps you save time and effort, instead of building separate projects for every language, you can handle multi-lingual dataset in one project.  Your dataset doesn't have to be entirely in the same language but you have to specify this option at project creation. If you notice your model performing poorly in certain languages during the evaluation process, consider adding more data in this language to your training set.

> [!NOTE]
> To enable support for multiple languages, you need to enable this option when [creating your project](how-to/create-project.md) or you can enbale it later form the project settings page.

## Languages supported by custom text classification

Custom text classification supports `.txt` files in the following languages:

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

* [Custom text classification overview](overview.md)
* [Data limits](service-limits.md)
