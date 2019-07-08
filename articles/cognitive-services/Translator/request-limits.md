---
title: Request limits - Translator Text API
titleSuffix: Azure Cognitive Services
description: This article lists request limits for the Translator Text API. Charges are incurred based on character count, not request frequency with a limit of 5,000 characters per request. Character limits are subscription based, with F0 limited to 2 million characters per hour.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 06/04/2019
ms.author: swmachan
---

# Request limits for Translator Text

This article provides throttling limits for the Translator Text API. Services include translation, transliteration, sentence length detection, language detection, and alternate translations.

## Character and array limits per request

Each Translate request is limited to 5,000 characters. You're charged per character, not by the number of requests. It's recommended to send shorter requests.

The following table lists array element and character limits for each operation of the Translator Text API.

| Operation | Maximum Size of Array Element |	Maximum Number of Array Elements |	Maximum Request Size (characters) |
|:----|:----|:----|:----|
| Translate | 5,000	| 100	| 5,000 |
| Transliterate | 5,000	| 10	| 5,000 |
| Detect | 10,000 |	100 |	50,000 |
| BreakSentence | 10,000	| 100 |	5,0000 |
| Dictionary Lookup| 100 |	10	| 1,000 |
| Dictionary Examples | 100 for text and 100 for translation (200 total)| 10|	2,000 |

## Character limits per hour

Your character limit per hour is based on your Translator Text subscription tier. 

The hourly quota should be consumed evenly throughout the hour. For example, at the F0 tier limit of 2 million characters per hour, characters should be consumed no faster than roughly 33,300 characters per minute sliding window (2 million characters divided by 60 minutes).

If you reach or surpass these limits, or send too large of a portion of the quota in a short period of time, you'll likely receive an out of quota response. There are no limits on concurrent requests.

| Tier | Character limit |
|------|-----------------|
| F0 | 2 million characters per hour |
| S1 | 40 million characters per hour |
| S2 / C2 | 40 million characters per hour |
| S3 / C3 | 120 million characters per hour |
| S4 / C4 | 200 million characters per hour |

Limits for [multi-service subscriptions](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference#authentication) are the same as the S1 tier.

These limits are restricted to Microsoft's standard translation models. Custom translation models that use Custom Translator are limited to 1,800 character per second.

## Latency

The Translator Text API has a maximum latency of 15 seconds using standard models. Translation using custom models has a maximum latency of 25 seconds. By this time you'll have received a result or a timeout response. Typically, responses are returned in 150 milliseconds to 300 milliseconds. Response times will vary based on the size of the request and language pair. If you don’t receive a translation or an [error response](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference#errors) within that timeframe, you should check your network connection and retry.

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
