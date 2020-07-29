---
title: Data limits for the Text Analytics API
titleSuffix: Azure Cognitive Services
description: Data limitations for the Text Analytics API from Azure Cognitive Services.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 04/27/2020
ms.author: aahi
ms.reviewer: chtufts
---

# Data and rate limits for the Text Analytics API
<a name="data-limits"></a>

Use this article to find the limits for the size, and rates that you can send data to Text Analytics API. 

## Data limits

> [!NOTE]
> * If you need to analyze larger documents than the limit allows, you can break the text into smaller chunks of text before sending them to the API. 
> * A document is a single string of text characters.  

| Limit | Value |
|------------------------|---------------|
| Maximum size of a single document | 5,120 characters as measured by [StringInfo.LengthInTextElements](https://docs.microsoft.com/dotnet/api/system.globalization.stringinfo.lengthintextelements). |
| Maximum size of entire request | 1 MB |

The maximum number of documents you can send in a single request will depend on the API version and feature you're using.

#### [Version 3](#tab/version-3)

> [!NOTE]
> If your v3 API request exceeds these limits, but is within the v2 limits, a warning will be returned in the API response. Starting 7/15/2020, a 400 error code will be returned instead. 

The following limits have changed in v3 of the API. Exceeding the limits below will generate a warning in the API response.


| Feature | Max Documents Per Request | 
|----------|-----------|
| Language Detection | 1000 |
| Sentiment Analysis | 10 |
| Key Phrase Extraction | 10 |
| Named Entity Recognition | 5 |
| Entity Linking | 5 |

#### [Version 2](#tab/version-2)

| Feature | Max Documents Per Request | 
|----------|-----------|
| Language Detection | 1000 |
| Sentiment Analysis | 1000 |
| Key Phrase Extraction | 1000 |
| Named Entity Recognition | 1000 |
| Entity Linking | 1000 |

---

## Rate limits

Your rate limit will vary with your [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/). These limits are the same for both versions of the API.

| Tier          | Requests per second | Requests per minute |
|---------------|---------------------|---------------------|
| S / Multi-service | 1000                | 1000                |
| S0 / F0         | 100                 | 300                 |
| S1            | 200                 | 300                 |
| S2            | 300                 | 300                 |
| S3            | 500                 | 500                 |
| S4            | 1000                | 1000                |

Requests are measured for each Text Analytics feature separately. For example, you can send the maximum number of requests for your pricing tier to each feature, at the same time.  


## See also

* [What is the Text Analytics API](../overview.md)
* [Pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/)
