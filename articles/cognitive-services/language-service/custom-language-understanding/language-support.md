---
title: Conversational Language Understanding language support 
titleSuffix: Azure Cognitive Services
description: This article explains which natural languages are supported by the Conversational Language Understanding feature of Azure Cognitive Service for Language.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 09/10/2021
ms.author: aahi
---

# Conversational Language Understanding language support 

Use this article to learn which natural languages are supported by the Custom Language Understanding feature of Language Services.

### Supported languages for conversation Projects

When creating a conversation project in CLU, you can specify the primary language of your project. The primary language is used as the default language of the project.

The supported languages for conversation projects are:

| **Language** | **Language Code** |
| --- | --- |
| Brazilian Portuguese | `pt-br` |
| Chinese | `zh-cn` |
| Dutch | `nl-nl` |
| English | `en-us` |
| French | `fr-fr` |
| German | `de-de` |
| Gujarati | `gu-in` |
| Hindi | `hi-in` |
| Italian | `it-it` |
| Japanese | `ja-jp` |
| Korean | `ko-kr` |
| Marathi | `mr-in` |
| Spanish | `es-es` |
| Tamil | `ta-in` |
| Telugu | `te-in` |
| Turkish | `tr-tr` |

#### Multilingual Conversation Projects

When you enable multiple languages in a project, you can add data in multiple languages to your project. You can also train the project in one language and immediately predict it in other languages. The quality of predictions may vary between languages – and certain language groups work better than others with respect to multilingual predictions.

## Supported languages for orchestration workflow projects

|Language| Language code |
|---|---|
| Brazilian Portuguese | `pt-br` |
| English | `en-us` |
| French | `fr-fr` |
| German | `de-de` |
| Italian | `it-it` |
| Spanish | `es-es` |

Orchestration workflow projects are not available for use in multiple languages.

## Next steps

[Conversational language understanding overview](overview.md)
