---
title: Service limits - Translator Service
titleSuffix: Azure AI services
description: This article lists service limits for the Translator text and document translation. Charges are incurred based on character count, not request frequency with a limit of 50,000 characters per request. Character limits are subscription-based, with F0 limited to 2 million characters per hour.
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
---

# Service limits for Azure AI Translator Service

This article provides both a quick reference and detailed description of Azure AI Translator Service character and array limits for text and document translation.

## Text translation

Charges are incurred based on character count, not request frequency. Character limits are subscription-based.

### Character and array limits per request

Each translate request is limited to 50,000 characters, across all the target languages. For example, sending a translate request of 3,000 characters to translate to three different languages results in a request size of 3,000 &times; 3 = 9,000 characters and meets the request limit. You're charged per character, not by the number of requests, therefore, it's recommended that you send shorter requests.

The following table lists array element and character limits for each text translation operation.

| Operation | Maximum Size of Array Element |    Maximum Number of Array Elements |    Maximum Request Size (characters) |
|:----|:----|:----|:----|
| **Translate** | 50,000| 1,000| 50,000 |
| **Transliterate** | 5,000| 10| 5,000 |
| **Detect** | 50,000 |100 |50,000 |
| **BreakSentence** | 50,000| 100 |50,000 |
| **Dictionary Lookup** | 100 |10| 1,000 |
| **Dictionary Examples** | 100 for text and 100 for translation (200 total)| 10|2,000 |

### Character limits per hour

Your character limit per hour is based on your Translator subscription tier.

The hourly quota should be consumed evenly throughout the hour. For example, at the F0 tier limit of 2 million characters per hour, characters should be consumed no faster than roughly 33,300 characters per minute. The sliding window range is 2 million characters divided by 60 minutes.

You're likely to receive an out-of-quota response under the following circumstances:

* You've reached or surpass the quota limit.
* You've sent a large portion of the quota in too short a period of time.

There are no limits on concurrent requests.

| Tier | Character limit |
|------|-----------------|
| F0 | 2 million characters per hour |
| S1 | 40 million characters per hour |
| S2 / C2 | 40 million characters per hour |
| S3 / C3 | 120 million characters per hour |
| S4 / C4 | 200 million characters per hour |

Limits for [multi-service subscriptions](./reference/v3-0-reference.md#authentication) are the same as the S1 tier.

These limits are restricted to Microsoft's standard translation models. Custom translation models that use Custom Translator are limited to 3,600 characters per second, per model.

### Latency

The Translator has a maximum latency of 15 seconds using standard models and 120 seconds when using custom models. Typically, responses *for text within 100 characters* are returned in 150 milliseconds to 300 milliseconds. The custom translator models have similar latency characteristics on sustained request rate and may have a higher latency when your request rate is intermittent. Response times vary based on the size of the request and language pair. If you don't receive a translation or an [error response](./reference/v3-0-reference.md#errors) within that time frame, check your code, your network connection, and retry.

## Document Translation

This table lists the content limits for data sent using Document Translation:

|Attribute | Limit|
|---|---|
|Document size| ≤ 40 MB |
|Total number of files.|≤ 1000 |
|Total content size in a batch | ≤ 250 MB|
|Number of target languages in a batch| ≤ 10 |
|Size of Translation memory file| ≤ 10 MB|

> [!NOTE]
> Document Translation can't be used to translate secured documents such as those with an encrypted password or with restricted access to copy content.

## Next steps

* [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/translator-text-api/)
* [Regional availability](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services)
* [v3 Translator reference](./reference/v3-0-reference.md)
