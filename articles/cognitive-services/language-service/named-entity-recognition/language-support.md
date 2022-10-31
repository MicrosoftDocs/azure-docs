---
title: Named Entity Recognition (NER) language support
titleSuffix: Azure Cognitive Services
description: This article explains which natural languages are supported by the NER feature of Azure Cognitive Service for Language.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 06/27/2022
ms.author: aahi
ms.custom: language-service-ner, ignite-fall-2021, ignite-2022
---

# Named Entity Recognition (NER) language support 

Use this article to learn which natural languages are supported by the NER feature of Azure Cognitive Service for Language.

> [!NOTE]
> * Languages are added as new [model versions](how-to-call.md#specify-the-ner-model) are released. 
> * Only "Person", "Location" and "Organization" entities are returned for languages marked with *.
> * The current model version for NER is `2021-06-01`.

## NER language support

| Language              | Language code | Starting with model version: | Supports entity resolution | Notes              |
|:----------------------|:-------------:|:----------------------------:|:--------------------------:|:------------------:|
| Arabic*               | `ar`          | 2019-10-01                   |                            |                    |
| Chinese-Simplified    | `zh-hans`     | 2021-01-15                   | ✓                         | `zh` also accepted |
| Chinese-Traditional*  | `zh-hant`     | 2019-10-01                   |                            |                    |
| Czech*                | `cs`          | 2019-10-01                   |                            |                    |
| Danish*               | `da`          | 2019-10-01                   |                            |                    |
| Dutch*                | `nl`          | 2019-10-01                   | ✓                         |                    |
| English               | `en`          | 2019-10-01                   | ✓                         |                    |
| Finnish*              | `fi`          | 2019-10-01                   |                            |                    |
| French                | `fr`          | 2021-01-15                   | ✓                         |                    |
| German                | `de`          | 2021-01-15                   | ✓                         |                    |
| Hebrew                | `he`          | 2022-10-01                   |                            |                    |
| Hindi                 | `hi`          | 2022-10-01                   | ✓                         |                    |
| Hungarian*            | `hu`          | 2019-10-01                   |                            |                    |
| Italian               | `it`          | 2021-01-15                   | ✓                         |                    |
| Japanese              | `ja`          | 2021-01-15                   | ✓                         |                    |
| Korean                | `ko`          | 2021-01-15                   |                            |                    |
| Norwegian  (Bokmål)*  | `no`          | 2019-10-01                   |                            | `nb` also accepted |
| Polish*               | `pl`          | 2019-10-01                   |                            |                    |
| Portuguese (Brazil)   | `pt-BR`       | 2021-01-15                   | ✓                         |                    |
| Portuguese (Portugal) | `pt-PT`       | 2021-01-15                   |                            | `pt` also accepted |
| Russian*              | `ru`          | 2019-10-01                   |                            |                    |
| Spanish               | `es`          | 2020-04-01                   | ✓                         |                    |
| Swedish*              | `sv`          | 2019-10-01                   |                            |                    |
| Turkish*              | `tr`          | 2019-10-01                   | ✓                         |                    |

## Next steps

[NER feature overview](overview.md)
