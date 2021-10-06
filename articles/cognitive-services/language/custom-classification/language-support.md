---
title: Language support in custom entity extraction 
titleSuffix: Azure Cognitive Services
description: Learn about which languages are supported by custom entity extraction, which is a part of Language Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 07/15/2021
ms.author: aahi
---

# Language support

Custom text classification gives you the option to leverage data from multiple languages. You can have multiple files in your dataset of different languages. Also, you can train your model in one language and use it to query text in other languages. If you want to use the multilingual option, you have to enable this during [project creation](quickstart.md). If you notice low scores in a certain language consider adding more data in this language to your training set.

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
* [Data limits](concepts/data-limits.md)
