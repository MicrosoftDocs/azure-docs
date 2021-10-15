---
title: Language support in custom classification
titleSuffix: Azure Cognitive Services
description: Learn about which languages are supported by custom entity extraction, which is a part of Language Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 11/02/2021
ms.author: aahi
---

# Language support

Custom text classification lets you have multiple files in your dataset of different languages. You can also train your model in one language and use it to query text in other languages. If you want to use this multilingual option, you have to enable it during [project creation](quickstart.md). If you notice your model performing poorly and scoring low in certain languages during the evaluation process, consider adding more data in this language to your training set.

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

## Multiple language support

With custom entity extraction, your dataset doesn't have to be entirely in the same language. You can have multiple files, each with different supported languages.

> [!NOTE]
> To enable support for multiple languages, you need to enable this option when [creating your project](how-to/use-azure-resources.md#create-a-project.md).

## Next steps

* [Custom text classification overview](overview.md)
* [Data limits](concepts/data-limits.md)
