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

## Multiple language support

With custom entity extraction, your dataset doesn't have to be entirely in the same language. You can have multiple files, each with different supported languages.

> [!NOTE]
> If your files are in multiple languages you need to enable this option when [creating your project](quickstart.md).

## Regional availability

Custom entity extraction is only available in the following regions:

* West US 2
* West Europe

## Next steps

[Custom NER overview](overview.md)
