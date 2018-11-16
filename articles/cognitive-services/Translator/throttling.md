---
title: Throttling limits - Translator Text API
titleSuffix: Azure Cognitive Services
description: This article lists throttling limits for the Translator Text API. Charges are incurred based on character count, not request frequency with a limit of 5,000 characters per request. Character limits are subscription based, with F0 limited to 2 million characters per hour.
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: translator-text
ms.topic: conceptual
ms.date: 11/15/2018
ms.author: erhopf
---

# Throttling Limits for Translator Text

This article provides throttling limits for the Translator Text API, which includes translation, transliteration, sentence length detection, language detection, and alternate translation services.

## Character limit per request

Each request is limited to 5,000 characters. You are charged per character, not by the number of requests. Therefore, it's recommended to send shorter requests, and to have some requests outstanding at any given time.

There is no limit on the number of outstanding requests to the Translator Text API.

## Character limit per hour

The number of characters that you can send to the Translator Text API per hour are based on your Translator Text subscription tier in the Azure portal. If you reach or surpass these limits, you'll likely receive an out of quota response:

| Tier | Character limit |
|------|-----------------|
| F0 | 2 million characters per hour |
| S1 | 40 million characters per hour |
| S2 | 40 million characters per hour |
| S3 | 120 million characters per hour |
| S4 | 200 million characters per hour |

These limits are restricted to Microsoft's generic systems. Custom translation systems that use Microsoft's Translator Hub are limited to 1,800 character per second.

## Latency

Translator Text has a maximum latency of 13 seconds. By this time you'll have received a result or a timeout response. Typically, responses are returned in 150 to 300 milliseconds. Response times will vary based on the size or the request and language pair.

## BreakSentence length limits

When using the BreakSentence function, sentence length is limited to 275 characters. There are exceptions for these languages:

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
