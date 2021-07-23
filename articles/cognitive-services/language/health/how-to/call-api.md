---
title: How to call the health API
titleSuffix: Azure Cognitive Services
description: Learn how to extract and label medical information from unstructured clinical text with the health API. 
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 06/18/2021
ms.author: aahi
---

# How to call the health API

> [!IMPORTANT] 
> The health API is a capability provided “AS IS” and “WITH ALL FAULTS.” The health API is not intended or made available for use as a medical device, clinical support, diagnostic tool, or other technology intended to be used in the diagnosis, cure, mitigation, treatment, or prevention of disease or other conditions, and no license or right is granted by Microsoft to use this capability for such purposes. This capability is not designed or intended to be implemented or deployed as a substitute for professional medical advice or healthcare opinion, diagnosis, treatment, or the clinical judgment of a healthcare professional, and should not be used as such. The customer is solely responsible for any use of the health API. The customer must separately license any and all source vocabularies it intends to use under the terms set for that [UMLS Metathesaurus License Agreement Appendix](https://www.nlm.nih.gov/research/umls/knowledge_sources/metathesaurus/release/license_agreement_appendix.html) or any future equivalent link. The customer is responsible for ensuring compliance with those license terms, including any geographic or other applicable restrictions.


The health API is a feature of the Language Services that extracts and labels relevant medical information from unstructured texts such as doctor's notes, discharge summaries, clinical documents, and electronic health records.  There are two ways to utilize this service: 

* The web-based API and client libraries (asynchronous)
* A Docker container (synchronous)

## Features

The health API performs Named Entity Recognition (NER), relation extraction, entity negation and entity linking on English-language text to uncover insights in unstructured clinical and biomedical text. 
See the [entity categories](../concepts/health-entity-categories.md) returned by Text Analytics for health for a full list of supported entities. For information on confidence scores, see the [Text Analytics transparency note](/legal/cognitive-services/text-analytics/transparency-note#general-guidelines-to-understand-and-improve-performance?context=/azure/cognitive-services/text-analytics/context/context). 



## Submit data to the service

> [!TIP]
> There are examples of how to use the REST API and client libraries for this feature in the quickstart article. You can also make example requests and see the JSON output using [Language Studio](https://language.azure.com/tryout/sentiment) 
> 
> To run the Text Analytics for health container in your own environment, follow these [instructions to download and install the container](use-containers.md).

You submit text to the health API.  Document size must be under 5,120 characters per document. For the maximum number of documents permitted in a collection, see the data limits article. The collection is submitted in the body of the request. If your text exceeds this limit, consider splitting the text into separate requests. For best results, split text between sentences.


## Get results from the service

Depending on what text you submit to the health API, you will get:

### Named Entity Recognition

Named Entity Recognition detects words and phrases mentioned in unstructured text that can be associated with one or more semantic types, such as diagnosis, medication name, symptom/sign, or age.

### Relation Extraction

Relation extraction identifies meaningful connections between concepts mentioned in text. For example, a "time of condition" relation is found by associating a condition name with a time or between an abbreviation and the full description.  

### Entity Linking

Entity Linking disambiguates distinct entities by associating named entities mentioned in text to concepts found in a predefined database of concepts including the Unified Medical Language System (UMLS). Medical concepts are also assigned preferred naming, as an additional form of normalization.

The health API supports linking to the health and biomedical vocabularies found in the Unified Medical Language System ([UMLS](https://www.nlm.nih.gov/research/umls/sourcereleasedocs/index.html)) Metathesaurus Knowledge Source.

### Assertion Detection

The meaning of medical content is highly affected by modifiers, such as negative or conditional assertions which can have critical implications if misrepresented. The health API supports three categories of assertion detection for entities in the text: 

* certainty
* conditional
* association


## Data limits

> [!NOTE]
> * If you need to analyze larger documents than the limit allows, you can break the text into smaller chunks of text before sending them to the API. For best results, split text between sentences.
> * A document is a single string of text characters.  

| Limit | Value |
|------------------------|---------------|
| Maximum size of a single document | 5,120 characters as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements). |
| Maximum size of entire request | 1 MB |
| Max Documents Per Request | 10 for the web-based API, 1000 for the container. |

If a document exceeds the character limit, the API won't process a document that exceeds the maximum size, and will return an invalid document error for it. If an API request has multiple documents, the API will continue processing them if they are within the character limit.

### Rate limits

Your rate limit will vary with your [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/). These limits are the same for both versions of the API. These rate limits don't apply to the Text Analytics for health container, which does not have a set rate limit.

| Tier          | Requests per second | Requests per minute |
|---------------|---------------------|---------------------|
| S / Multi-service | 1000                | 1000                |
| F0         | 100                 | 300                 |

## See also

* [Text Analytics overview](../overview.md)
* [health entity categories](../concepts/health-entity-categories.md)
