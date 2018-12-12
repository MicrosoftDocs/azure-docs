---
title: Request limits - Translator Text API
titleSuffix: Azure Cognitive Services
description: This article lists request limits for the Translator Text API. Charges are incurred based on character count, not request frequency with a limit of 5,000 characters per request. Character limits are subscription based, with F0 limited to 2 million characters per hour.
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: translator-text
ms.topic: conceptual
ms.date: 11/15/2018
ms.author: erhopf
---

# Request limits for Translator Text

This article provides throttling limits for the Translator Text API. Services include translation, transliteration, sentence length detection, language detection, and alternate translations.

## Character limits per request

Each request is limited to 5,000 characters. You're charged per character, not by the number of requests. It's recommended to send shorter requests, and to have some requests outstanding at any given time.

There's no limit on the number of outstanding requests to the Translator Text API.

## Character limits per hour

Your character limit per hour is based on your Translator Text subscription tier. If you reach or surpass these limits, you'll likely receive an out of quota response:

| Tier | Character limit |
|------|-----------------|
| F0 | 2 million characters per hour |
| S1 | 40 million characters per hour |
| S2 | 40 million characters per hour |
| S3 | 120 million characters per hour |
| S4 | 200 million characters per hour |

These limits are restricted to Microsoft's generic systems. Custom translation systems that use Microsoft's Translator Hub are limited to 1,800 character per second.

## Latency

Translator Text has a maximum latency of 13 seconds. By this time you'll have received a result or a timeout response. Typically, responses are returned in 150 milliseconds to 300 milliseconds. Response times will vary based on the size or the request and language pair.

## Sentence length limits

When using the [BreakSentence](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-break-sentence) function, sentence length is limited to 275 characters. There are exceptions for these languages:

| Language | Code | Character limit |
|----------|------|-----------------|
| Chinese | zh | 132 |
| German | de | 290 |
| Italian | it | 280 |
| Japanese | ja | 150 |
| Portuguese | pt | 290 |
| Spanish | es | 280 |
| Italian | it | 280 |
| Thai | th | 258 |

> [!NOTE]
> This limit doesn't apply to translations.

## Next steps

* [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/translator-text-api/)
* [Regional availability](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services)
* [v3 Translator Text API reference](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference)
