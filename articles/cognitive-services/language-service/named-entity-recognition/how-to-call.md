---
title: How to perform Named Entity Recognition (NER)
titleSuffix: Azure Cognitive Services
description: This article will show you how to extract named entities from text.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/01/2022
ms.author: jboback
ms.custom: language-service-ner, ignite-fall-2021
---


# How to use Named Entity Recognition(NER)

The NER feature can evaluate unstructured text, and extract named entities from text in several pre-defined categories, for example: person, location, event, product, and organization.  

## Determine how to process the data (optional)

### Specify the NER model

By default, this feature will use the latest available AI model on your text. You can also configure your API requests to use a specific [model version](../concepts/model-lifecycle.md).


### Input languages

When you submit documents to be processed, you can specify which of [the supported languages](language-support.md) they're written in. if you don't specify a language, key phrase extraction will default to English. The API may return offsets in the response to support different [multilingual and emoji encodings](../concepts/multilingual-emoji-support.md). 

## Submitting data

Analysis is performed upon receipt of the request. Using the NER feature synchronously is stateless. No data is stored in your account, and results are returned immediately in the response.

[!INCLUDE [asynchronous-result-availability](../includes/async-result-availability.md)]

The API will attempt to detect the [defined entity categories](concepts/named-entity-categories.md) for a given document language. 

## Getting NER results

When you get results from NER, you can stream the results to an application or save the output to a file on the local system. The API response will include [recognized entities](concepts/named-entity-categories.md), including their categories and sub-categories, and confidence scores. 

## Service and data limits

[!INCLUDE [service limits article](../includes/service-limits-link.md)]

## Next steps

[Named Entity Recognition overview](overview.md)
