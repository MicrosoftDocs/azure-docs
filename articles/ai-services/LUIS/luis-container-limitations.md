---
title: Container limitations - LUIS
titleSuffix: Azure AI services
description: The LUIS container languages that are supported.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: conceptual
ms.date: 10/28/2021
ms.author: aahi
---

# Language Understanding (LUIS) container limitations

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


The LUIS containers have a few notable limitations. From unsupported dependencies, to a subset of languages supported, this article details these restrictions.

## Supported dependencies for `latest` container

The latest LUIS container supports:

* [New prebuilt domains](luis-reference-prebuilt-domains.md): these enterprise-focused domains include entities, example utterances, and patterns. Extend these domains for your own use.

## Unsupported dependencies for `latest` container

To [export for container](luis-container-howto.md#export-packaged-app-from-luis), you must remove unsupported dependencies from your LUIS app. When you attempt to export for container, the LUIS portal reports these unsupported features that you need to remove.

You can use a LUIS application if it **doesn't include** any of the following dependencies:

Unsupported app configurations|Details|
|--|--|
|Unsupported container cultures| The Dutch (`nl-NL`), Japanese (`ja-JP`) and German (`de-DE`) languages are only supported with the [1.0.2 tokenizer](luis-language-support.md#custom-tokenizer-versions).|
|Unsupported entities for all cultures|[KeyPhrase](luis-reference-prebuilt-keyphrase.md) prebuilt entity for all cultures|
|Unsupported entities for English (`en-US`) culture|[GeographyV2](luis-reference-prebuilt-geographyV2.md) prebuilt entities|
|Speech priming|External dependencies are not supported in the container.|
|Sentiment analysis|External dependencies are not supported in the container.|
|Bing spell check|External dependencies are not supported in the container.|

## Languages supported

LUIS containers support a subset of the [languages supported](luis-language-support.md#languages-supported) by LUIS proper. The LUIS containers are capable of understanding utterances in the following languages:

| Language | Locale | Prebuilt domain | Prebuilt entity | Phrase list recommendations | **[Sentiment analysis](../language-service/sentiment-opinion-mining/language-support.md) and [key phrase extraction](../language-service/key-phrase-extraction/language-support.md)|
|--|--|:--:|:--:|:--:|:--:|
| English (United States) | `en-US` | ✔️ | ✔️ | ✔️ | ✔️ |
| Arabic (preview - modern standard Arabic) |`ar-AR`|❌|❌|❌|❌|
| *[Chinese](#chinese-support-notes) |`zh-CN` | ✔️ | ✔️ | ✔️ | ❌ |
| French (France) |`fr-FR` | ✔️ | ✔️ | ✔️ | ✔️ |
| French (Canada) |`fr-CA` | ❌ | ❌ | ❌ | ✔️ |
| German |`de-DE` | ✔️ | ✔️ | ✔️ | ✔️ |
| Hindi | `hi-IN`| ❌ | ❌ | ❌ | ❌ |
| Italian |`it-IT` | ✔️ | ✔️ | ✔️ | ✔️ |
| Korean |`ko-KR` | ✔️ | ❌ | ❌ | *Key phrase* only |
| Marathi | `mr-IN`|❌|❌|❌|❌|
| Portuguese (Brazil) |`pt-BR` | ✔️ | ✔️ | ✔️ | not all sub-cultures |
| Spanish (Spain) |`es-ES` | ✔️ | ✔️ |✔️|✔️|
| Spanish (Mexico)|`es-MX` | ❌ | ❌ |✔️|✔️|
| Tamil | `ta-IN`|❌|❌|❌|❌|
| Telugu | `te-IN`|❌|❌|❌|❌|
| Turkish | `tr-TR` |✔️| ❌ | ❌ | *Sentiment* only |

[!INCLUDE [Chinese language support notes](includes/chinese-language-support-notes.md)]

[!INCLUDE [Language service support notes](includes/text-analytics-support-notes.md)]
