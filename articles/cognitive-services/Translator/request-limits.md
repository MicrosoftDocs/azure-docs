---
title: Request limits - Translator
titleSuffix: Azure Cognitive Services
description: This article lists request limits for the Translator. Charges are incurred based on character count, not request frequency with a limit of 5,000 characters per request. Character limits are subscription-based, with F0 limited to 2 million characters per hour.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 04/19/2021
ms.author: lajanuar
---

# Request limits for Translator

This article provides throttling limits for the Translator translation, transliteration, sentence length detection, language detection, and alternate translations.

## Character and array limits per request

Each translate request is limited to 10,000 characters, across all the target languages you are translating to. For example, sending a translate request of 3,000 characters to translate to three different languages results in a request size of 3000x3 = 9,000 characters, which satisfy the request limit. You're charged per character, not by the number of requests. It's recommended to send shorter requests.

The following table lists array element and character limits for each operation of the Translator.

| Operation | Maximum Size of Array Element |    Maximum Number of Array Elements |    Maximum Request Size (characters) |
|:----|:----|:----|:----|
| Translate | 10,000| 100| 10,000 |
| Transliterate | 5,000| 10| 5,000 |
| Detect | 50,000 |100 |50,000 |
| BreakSentence | 50,000| 100 |50,000 |
| Dictionary Lookup| 100 |10| 1,000 |
| Dictionary Examples | 100 for text and 100 for translation (200 total)| 10|2,000 |

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

Limits for [multi-service subscriptions](./reference/v3-0-reference.md#authentication) are the same as the S1 tier.

These limits are restricted to Microsoft's standard translation models. Custom translation models that use Custom Translator are limited to 1,800 characters per second, per model.

## Latency

The Translator has a maximum latency of 15 seconds using standard models and 120 seconds when using custom models. Typically, responses *for text within 100 characters* are returned in 150 milliseconds to 300 milliseconds. The custom translator models have similar latency characteristics on sustained request rate and may have a higher latency when your request rate is intermittent. Response times will vary based on the size of the request and language pair. If you don't receive a translation or an [error response](./reference/v3-0-reference.md#errors) within that timeframe, check your code, your network connection, and retry.

## Sentence length limits

When using the [BreakSentence](./reference/v3-0-break-sentence.md) function, sentence length is limited to 275 characters. There are exceptions for these languages:

| Language | Code | Character limit |
|----------|------|-----------------|
| Chinese | zh | 166 |
| German | de | 800 |
| Italian | it | 800 |
| Japanese | ja | 166 |
| Portuguese | pt | 800 |
| Spanish | es | 800 |
| Thai | th | 180 |

> [!NOTE]
> This limit doesn't apply to translations.

## Next steps

* [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/translator-text-api/)
* [Regional availability](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services)
* [v3 Translator reference](./reference/v3-0-reference.md)