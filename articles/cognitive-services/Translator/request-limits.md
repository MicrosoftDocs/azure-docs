---
title: Request limits - Translator
titleSuffix: Azure Cognitive Services
description: This article lists request limits for the Translator. Charges are incurred based on character count, not request frequency with a limit of 5,000 characters per request. Character limits are subscription based, with F0 limited to 2 million characters per hour.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 05/26/2020
ms.author: swmachan
---

# Request limits for Translator

This article provides throttling limits for the Translator. Services include translation, transliteration, sentence length detection, language detection, and alternate translations.

## Character and array limits per request

Each translate request is limited to 5,000 characters, across all the target languages you are translating to. For example, sending a translate request of 1,500 characters to translate to 3 different languages results in a request size of 1,500x3 = 4,500 characters, which satisfies the request limit. You're charged per character, not by the number of requests. It's recommended to send shorter requests.

The following table lists array element and character limits for each operation of the Translator.

| Operation | Maximum Size of Array Element |    Maximum Number of Array Elements |    Maximum Request Size (characters) |
|:----|:----|:----|:----|
| Translate | 5,000    | 100    | 5,000 |
| Transliterate | 5,000    | 10    | 5,000 |
| Detect | 10,000 |    100 |    50,000 |
| BreakSentence | 10,000    | 100 |    50,000 |
| Dictionary Lookup| 100 |    10    | 1,000 |
| Dictionary Examples | 100 for text and 100 for translation (200 total)| 10|    2,000 |

## Character limits per hour

Your character limit per hour is based on your Translator subscription tier. 

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

These limits are restricted to Microsoft's standard translation models. Custom translation models that use Custom Translator are limited to 1,800 characters per second.

## Latency

The Translator has a maximum latency of 15 seconds using standard models and 120 seconds when using custom models. Typically, responses *for text within 100 characters* are returned in 150 milliseconds to 300 milliseconds. The custom translator models have similar latency characteristics on sustained request rate and may have a higher latency when your request rate is intermittent. Response times will vary based on the size of the request and language pair. If you don't receive a translation or an [error response](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference#errors) within that timeframe, please check your code, your network connection and retry. 

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
* [v3 Translator reference](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference)
