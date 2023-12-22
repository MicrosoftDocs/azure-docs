---
title: Data limits for Language service features
titleSuffix: Azure AI services
description: Data and service limitations for Azure AI Language features.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022, ignite-2022
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: aahi
---

# Service limits for Azure AI Language

> [!NOTE]
> This article only describes the limits for preconfigured features in Azure AI Language:
> To see the service limits for customizable features, see the following articles: 
> * [Custom classification](../custom-text-classification/service-limits.md)
> * [Custom NER](../custom-named-entity-recognition/service-limits.md)
> * [Conversational language understanding](../conversational-language-understanding/service-limits.md)
> * [Question answering](../question-answering/concepts/limits.md)

Use this article to find the limits for the size, and rates that you can send data to the following features of the language service. 
* [Named Entity Recognition (NER)](../named-entity-recognition/overview.md) 
* [Personally Identifiable Information (PII) detection](../personally-identifiable-information/overview.md)
* [Key phrase extraction](../key-phrase-extraction/overview.md) 
* [Entity linking](../entity-linking/overview.md)  
* [Text Analytics for health](../text-analytics-for-health/overview.md)
* [Sentiment analysis and opinion mining](../sentiment-opinion-mining/overview.md)
* [Language detection](../language-detection/overview.md)

When using features of the Language service, keep the following information in mind:

* Pricing is independent of data or rate limits. Pricing is based on the number of text records you send to the API, and is subject to your Language resource's [pricing details](https://aka.ms/unifiedLanguagePricing).
    * A text record is measured as 1000 characters. 
* Data and rate limits are based on the number of documents you send to the API. If you need to analyze larger documents than the limit allows, you can break the text into smaller chunks of text before sending them to the API. 
* A document is a single string of text characters.  

## Maximum characters per document

The following limit specifies the maximum number of characters that can be in a single document.

| Feature | Value |
|------------------------|---------------|
| Text Analytics for health | 125,000 characters as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements).  | 
| All other preconfigured features (synchronous) | 5,120 as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements). If you need to submit larger documents, consider using the feature asynchronously. |
| All other preconfigured features ([asynchronous](use-asynchronously.md))  | 125,000 characters across all submitted documents, as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements) (maximum of 25 documents). |

If a document exceeds the character limit, the API behaves differently depending on how you're sending requests.

If you're sending requests synchronously:
* The API doesn't process documents that exceed the maximum size, and returns an invalid document error for it. If an API request has multiple documents, the API continues processing them if they are within the character limit.

If you're sending requests [asynchronously](use-asynchronously.md):
* The API rejects the entire request and returns a `400 bad request` error if any document within it exceeds the maximum size.

## Maximum request size

The following limit specifies the maximum size of documents contained in the entire request.

| Feature | Value |
|------------------------|---------------|
| All preconfigured features  | 1 MB |

## Maximum documents per request

Exceeding the following document limits generates an HTTP 400 error code.

> [!NOTE] 
> When sending asynchronous API requests, you can send a maximum of 25 documents per request.

| Feature | Max Documents Per Request | 
|----------|-----------|
| Conversation summarization | 1 |
| Language Detection | 1000 |
| Sentiment Analysis | 10 |
| Opinion Mining | 10 |
| Key Phrase Extraction | 10 |
| Named Entity Recognition (NER) | 5 |
| Personally Identifying Information (PII) detection | 5 |
| Document summarization | 25 |
| Entity Linking | 5 |
| Text Analytics for health  |25 for the web-based API, 1000 for the container. (125,000 characters in total) |

## Rate limits

Your rate limit varies with your [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/). These limits are the same for both versions of the API. These rate limits don't apply to the Text Analytics for health container, which doesn't have a set rate limit.

| Tier          | Requests per second | Requests per minute |
|---------------|---------------------|---------------------|
| S / Multi-service | 1000                | 1000                |
| S0 / F0         | 100                 | 300                 |

Requests rates are measured for each feature separately. You can send the maximum number of requests for your pricing tier to each feature, at the same time. For example, if you're in the `S` tier and send 1000 requests at once, you wouldn't be able to send another request for 59 seconds.

## See also

* [What is Azure AI Language](../overview.md)
* [Pricing details](https://aka.ms/unifiedLanguagePricing)
