---
title: Use entity linking with Language Services
titleSuffix: Azure Cognitive Services
description: Learn how to identify and link entities found in text with the entity linking API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: article
ms.date: 11/02/2021
ms.author: aahi
---

# How to use entity linking

The entity linking feature can be used to identify and disambiguate the identity of an entity found in text (for example, determining whether an occurrence of the word "*Mars*" refers to the planet, or to the Roman god of war). It will return the entities in the text with links to [Wikipedia](https://www.wikipedia.org/) as a knowledge base.

> [!TIP]
> If you want to start using this feature, you can follow the [quickstart article](../quickstart.md) to get started. You can also make example requests using [Language Studio](../../language-studio.md) without needing to write code.

## Determine how to process the data (optional)

### Specify the entity linking model

By default, entity linking will use the latest available AI model on your text. You can also configure your API requests to use a previous model version, if you determine one performs better on your data. The model you specify will be used to perform entity linking operations.

| Supported Versions | latest version |
|--|--|
| `2019-10-01`, `2020-02-01` | `2020-02-01` |

### Input languages

When you submit documents to be processed by entity linking, you can specify which of [the supported languages](../language-support.md) they're written in. if you don't specify a language, entity linking will default to English. Due to [multilingual and emoji support](../../concepts/multilingual-emoji-support.md), the response may contain text offsets. 

## Submitting data

Entity linking produces a higher-quality result when you give it smaller amounts of text to work on. This is opposite from some features, like key phrase extraction which performs better on larger blocks of text. To get the best results from both operations, consider restructuring the inputs accordingly.

To send an API request, You will need your Text Analytics resource endpoint and key.

> [!NOTE]
> You can find the key and endpoint for your Text Analytics resource on the Azure portal. They will be located on the resource's **Key and endpoint** page, under **resource management**. 

Analysis is performed upon receipt of the request. For information on the size and number of requests you can send per minute and second, see the data limits below.

Using entity linking synchronously is stateless. No data is stored in your account, and results are returned immediately in the response.

When using this feature asynchronously, the API results are available for 24 hours from the time the request was ingested, and is indicated in the response. After this time period, the results are purged and are no longer available for retrieval.

### Getting entity linking results  

You can stream the results to an application, or save the output to a file on the local system.

## Data limits

> [!NOTE]
> * If you need to analyze larger documents than the limit allows, you can break the text into smaller chunks of text before sending them to the API. 
> * A document is a single string of text characters.  

| Limit | Value |
|------------------------|---------------|
| Maximum size of a single document | 5,120 characters as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements). |
| Maximum number of characters per request (asynchronous)  | 125K characters across all submitted documents, as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements). |
| Maximum size of entire request | 1 MB |
| Max Documents Per Request | 5 |

If a document exceeds the character limit, the API will behave differently depending on whether you're using it synchronously or asynchronously:

* Asynchronous: The API will reject the entire request and return a `400 bad request` error if any document within it exceeds the maximum size.
* Synchronous: The API won't process a document that exceeds the maximum size, and will return an invalid document error for it. If an API request has multiple documents, the API will continue processing them if they are within the character limit.

### Rate limits

Your rate limit will vary with your [pricing tier](https://aka.ms/unifiedLanguagePricing).

| Tier          | Requests per second | Requests per minute |
|---------------|---------------------|---------------------|
| S / Multi-service | 1000                | 1000                |
| S0 / F0         | 100                 | 300                 |

## See also

* [What is the Text Analytics API](../overview.md)
