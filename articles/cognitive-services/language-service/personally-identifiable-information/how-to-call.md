---
title: How to detect Personally Identifiable Information (PII)
titleSuffix: Azure Cognitive Services
description: This article will show you how to extract PII and health information (PHI) from text and detect identifiable information.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/01/2022
ms.author: aahi
ms.custom: language-service-pii, ignite-fall-2021
---


# How to detect and redact Personally Identifying Information (PII)

The PII feature can evaluate unstructured text, extract extract sensitive information (PII) and health information (PHI) in text across several pre-defined categories.

## Determine how to process the data (optional)

### Specify the PII detection model

By default, this feature will use the latest available AI model on your text. You can also configure your API requests to use a specific [model version](../concepts/model-lifecycle.md).

### Input languages

When you submit documents to be processed, you can specify which of [the supported languages](language-support.md) they're written in. if you don't specify a language, key phrase extraction will default to English. The API may return offsets in the response to support different [multilingual and emoji encodings](../concepts/multilingual-emoji-support.md). 

## Submitting data

Analysis is performed upon receipt of the request. Using the PII detection feature synchronously is stateless. No data is stored in your account, and results are returned immediately in the response.

[!INCLUDE [asynchronous-result-availability](../includes/async-result-availability.md)]

The API will attempt to detect the [defined entity categories](concepts/entity-categories.md) for a given document language. If you want to specify which entities will be detected and returned, use the optional `piiCategories` parameter with the appropriate entity categories. This parameter can also let you detect entities that aren't enabled by default for your document language. The following URL example would detect a French driver's license number that might occur in English text, along with the default English entities.

> [!TIP]
> If you don't include `default` when specifying entity categories, The API will only return the entity categories you specify.

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1/entities/recognition/pii?piiCategories=default,FRDriversLicenseNumber`

## Getting PII results

When you get results from PII detection, you can stream the results to an application or save the output to a file on the local system. The API response will include [recognized entities](concepts/entity-categories.md), including their categories and sub-categories, and confidence scores. The text string with the PII entities redacted will also be returned.

## Service and data limits

[!INCLUDE [service limits article](../includes/service-limits-link.md)]

## Next steps

[Named Entity Recognition overview](overview.md)
