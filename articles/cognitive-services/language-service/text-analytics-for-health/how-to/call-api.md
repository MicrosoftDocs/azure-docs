---
title: How to call Text Analytics for health
titleSuffix: Azure Cognitive Services
description: Learn how to extract and label medical information from unstructured clinical text with Text Analytics for health.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-health, ignite-fall-2021
---

# How to use Text Analytics for health

> [!IMPORTANT] 
> Text Analytics for health is a capability provided “AS IS” and “WITH ALL FAULTS.” Text Analytics for health is not intended or made available for use as a medical device, clinical support, diagnostic tool, or other technology intended to be used in the diagnosis, cure, mitigation, treatment, or prevention of disease or other conditions, and no license or right is granted by Microsoft to use this capability for such purposes. This capability is not designed or intended to be implemented or deployed as a substitute for professional medical advice or healthcare opinion, diagnosis, treatment, or the clinical judgment of a healthcare professional, and should not be used as such. The customer is solely responsible for any use of Text Analytics for health. The customer must separately license any and all source vocabularies it intends to use under the terms set for that [UMLS Metathesaurus License Agreement Appendix](https://www.nlm.nih.gov/research/umls/knowledge_sources/metathesaurus/release/license_agreement_appendix.html) or any future equivalent link. The customer is responsible for ensuring compliance with those license terms, including any geographic or other applicable restrictions.


Text Analytics for health can be used to extract and label relevant medical information from unstructured texts, such as: doctor's notes, discharge summaries, clinical documents, and electronic health records.  There are two ways to utilize this service: 

* The web-based API and client libraries (asynchronous)
* A [Docker container](use-containers.md) (synchronous)

## Features

Text Analytics for health performs Named Entity Recognition (NER), relation extraction, entity negation and entity linking on English-language text to uncover insights in unstructured clinical and biomedical text. 
See the [entity categories](../concepts/health-entity-categories.md) returned by Text Analytics for health for a full list of supported entities. For information on confidence scores, see the [transparency note](/legal/cognitive-services/text-analytics/transparency-note#general-guidelines-to-understand-and-improve-performance?context=/azure/cognitive-services/text-analytics/context/context). 

> [!TIP]
> If you want to start using this feature, you can follow the [quickstart article](../quickstart.md) to get started. You can also make example requests using [Language Studio](../../language-studio.md) without needing to write code.

## Determine how to process the data (optional)

### Specify the Text Analytics for health model

By default, Text Analytics for health will use the latest available AI model on your text. You can also configure your API requests to use a specific model version. The model you specify will be used to perform operations provided by the Text Analytics for health.

| Supported Versions | latest version |
|--|--|
| `2021-05-15` | `2021-05-15`   |

### Text Analytics for health container

The [Text Analytics for health container](use-containers.md) uses separate model versioning than the REST API and client libraries. Only one model version is available per container image.

| Endpoint                        | Container Image Tag                     | Model version |
|---------------------------------|-----------------------------------------|---------------|
| `/entities/health`              | `3.0.016230002-onprem-amd64` (latest)            | `2021-05-15`  |
| `/entities/health`              | `3.0.015370001-onprem-amd64`            | `2021-03-01`  |
| `/entities/health`              | `1.1.013530001-amd64-preview`           | `2020-09-03`  |
| `/entities/health`              | `1.1.013150001-amd64-preview`           | `2020-07-24`  |
| `/domains/health`               | `1.1.012640001-amd64-preview`           | `2020-05-08`  |
| `/domains/health`               | `1.1.012420001-amd64-preview`           | `2020-05-08`  |
| `/domains/health`               | `1.1.012070001-amd64-preview`           | `2020-04-16`  |

### Input languages

Currently the Text Analytics for health only [supports](../language-support.md) the English language. 

## Submitting data

To send an API request, You will need your Language resource endpoint and key.

> [!NOTE]
> You can find the key and endpoint for your Language resource on the Azure portal. They will be located on the resource's **Key and endpoint** page, under **resource management**. 

Analysis is performed upon receipt of the request. For information on the size and number of requests you can send per minute and second, see the data limits below.

If you send a request using the REST API or client library, the results will be returned asynchronously. If you're using the Docker container, they will be returned synchronously.  


## Getting results from the feature

Depending on your API request, and the data you submit to the Text Analytics for health, you will get:

[!INCLUDE [Text Analytics for health features](../includes/features.md)]


When using this feature asynchronously, the API results are available for 24 hours from the time the request was ingested, and is indicated in the response. After this time period, the results are purged and are no longer available for retrieval.

## Data limits

> [!NOTE]
> * If you need to analyze larger documents than the limit allows, you can break the text into smaller chunks of text before sending them to the API. For best results, split text between sentences.
> * A document is a single string of text characters.  

| Limit | Value |
|------------------------|---------------|
| Maximum size of a single document | 30,720 characters as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements). |
| Maximum size of entire request | 1 MB |
| Max Documents Per Request | 10 for the web-based API, 1000 for the container. |

If a document exceeds the character limit, the API won't process a document that exceeds the maximum size, and will return an invalid document error for it. If an API request has multiple documents, the API will continue processing them if they are within the character limit.

When you send a document larger than 5,120 characters, it will be split by Text Analytics for health into chunks of 5,120 characters. If two entities are present on either side of a split that are related, the model will not be able to detect the relation.

### Rate limits

Your rate limit will vary with your [pricing tier](https://aka.ms/unifiedLanguagePricing). These limits are the same for both versions of the API. These rate limits don't apply to the Text Analytics for health container, which does not have a set rate limit.

| Tier          | Requests per second | Requests per minute |
|---------------|---------------------|---------------------|
| S / Multi-service | 1000                | 1000                |
| F0         | 100                 | 300                 |

## See also

* [Text Analytics for health overview](../overview.md)
* [Text Analytics for health entity categories](../concepts/health-entity-categories.md)
