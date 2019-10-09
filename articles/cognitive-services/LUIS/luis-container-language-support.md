---
title: Container language support - LUIS
titleSuffix: Azure Cognitive Services
description: The LUIS container languages that are supported.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: dapine
---

# Languages supported

LUIS containers support a subset of the [languages supported](luis-language-support.md#languages-supported) by LUIS proper. The LUIS containers are capable of understanding utterances in the following languages:

| Language | Locale | Prebuilt domain | Prebuilt entity | Phrase list recommendations | **[Text analytics](../text-analytics/language-support.md)<br>(Sentiment and<br>Keywords)|
|--|--|:--:|:--:|:--:|:--:|
| American English | `en-US` | ✔️ | ✔️ | ✔️ | ✔️ |
| *[Chinese](#chinese-support-notes) |`zh-CN` | ✔️ | ✔️ | ✔️ | ❌ |
| French (France) |`fr-FR` | ✔️ | ✔️ | ✔️ | ✔️ |
| French (Canada) |`fr-CA` | ❌ | ❌ | ❌ | ✔️ |
| German |`de-DE` | ✔️ | ✔️ | ✔️ | ✔️ |
| Hindi | `hi-IN`| ❌ | ❌ | ❌ | ❌ |
| Italian |`it-IT` | ✔️ | ✔️ | ✔️ | ✔️ |
| Korean |`ko-KR` | ✔️ | ❌ | ❌ | *Key phrase* only |
| Portuguese (Brazil) |`pt-BR` | ✔️ | ✔️ | ✔️ | not all sub-cultures |
| Spanish (Spain) |`es-ES` | ✔️ | ✔️ |✔️|✔️|
| Spanish (Mexico)|`es-MX` | ❌ | ❌ |✔️|✔️|
| Turkish | `tr-TR` |✔️| ❌ | ❌ | *Sentiment* only |

[!INCLUDE [Chinese language support notes](includes/chinese-language-support-notes.md)]

[!INCLUDE [Text Analytics support notes](includes/text-analytics-support-notes.md)]