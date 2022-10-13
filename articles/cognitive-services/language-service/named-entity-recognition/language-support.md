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
ms.date: 10/13/2022
ms.author: aahi
ms.custom: language-service-ner, ignite-fall-2021
---

# Named Entity Recognition (NER) language support 

Use this article to learn which natural languages are supported by the NER feature of Azure Cognitive Service for Language.

> [!NOTE]
> * Languages are added as new [model versions](how-to-call.md#specify-the-ner-model) are released. 
> * The current stable model version for NER is `2021-06-01`. The latest preview model version for NER is `2022-10-01-preview`

## NER language support

| Language              | Language code | Starting with model version: | Supports resolution | Notes              |
|-----------------------|---------------|------------------------------|---------------------|--------------------|
| Arabic                | `ar`          | 10/1/2019                    |                     |                    |
| Chinese-Simplified    | `zh-hans`     | 1/15/2021                    | ✓                   | `zh` also accepted |
| Chinese-Traditional   | `zh-hant`     | 10/1/2019                    |                     |                    |
| Czech                 | `cs`          | 10/1/2019                    |                     |                    |
| Danish                | `da`          | 10/1/2019                    |                     |                    |
| Dutch                 | `nl`          | 10/1/2019                    | ✓                   |                    |
| English               | `en`          | 10/1/2019                    | ✓                   |                    |
| Finnish               | `fi`          | 10/1/2019                    |                     |                    |
| French                | `fr`          | 1/15/2021                    | ✓                   |                    |
| German                | `de`          | 1/15/2021                    | ✓                   |                    |
| Hebrew                | `he`          | 2022-10-01-preview           |                     |                    |
| Hindi                 | `hi`          | 2022-10-01-preview           | ✓                   |                    |
| Hungarian             | `hu`          | 10/1/2019                    |                     |                    |
| Italian               | `it`          | 1/15/2021                    | ✓                   |                    |
| Japanese              | `ja`          | 1/15/2021                    | ✓                   |                    |
| Korean                | `ko`          | 1/15/2021                    |                     |                    |
| Norwegian  (Bokmål)   | `no`          | 10/1/2019                    |                     |  `nb` also accepted|
| Polish                | `pl`          | 10/1/2019                    |                     |                    |
| Portuguese (Brazil)   | `pt-BR`       | 1/15/2021                    | ✓                   |                    |
| Portuguese (Portugal) | `pt-PT`       | 1/15/2021                    |                      |`pt` also accepted |
| Russian               | `ru`          | 10/1/2019                    |                     |                    |
| Spanish               | `es`          | 4/1/2020                     | ✓                   |                    |
| Swedish               | `sv`          | 10/1/2019                    |                     |                    |
| Turkish               | `tr`          | 10/1/2019                    | ✓                   |                    |




## Next steps

[NER feature overview](overview.md)