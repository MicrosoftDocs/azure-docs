---
title: How to perform Named Entity Recognition 
titleSuffix: Azure Cognitive Services
description: This article will show you how to extract named entities from text and detect identifying information.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 06/10/2021
ms.author: aahi
---


# How to use Named Entity Recognition and detect Personally Identifying Information (PII)

Language services lets you takes unstructured text and returns a list of disambiguated entities, with links to more information on the web. The API supports both named entity recognition (NER) for several entity categories, and the identification of personally identifying information.

## Named Entity Recognition (NER)

Named Entity Recognition (NER) is the ability to identify different entities in text and categorize them into pre-defined classes or types such as: person, location, event, product, and organization.  

## Personally Identifiable Information (PII)

The PII feature is part of NER and it can identify and redact sensitive entities in text that are associated with an individual person such as: phone number, email address, mailing address, passport number.

## Features and versions

| Feature                                                         | NER | PII |
|-----------------------------------------------------------------|--------|----------|
| Methods for single, and batch requests                          | X      | X        |
| Expanded entity recognition across several categories           | X      | X        |
| Recognition of personal (`PII`) and health (`PHI`) information entities        |        | X        |
| Redaction of `PII`        |        | X        |

See [entity categories](named-entity-types.md) for the full list of entities that can be identified.

## Language and document specifications

Sentiment Analysis and Opinion Mining accept a variety of languages. See [Supported languages](../language-support.md) for more information. The API may return offsets in the response to support different [multilingual and emoji encodings](multilingual-emoji-support.md). 

Document size must be under 5,120 characters per document, and you can have up to 1,000 items (IDs) per collection. For the maximum number of documents permitted in a collection, see the [data limits](../overview.md) article. The collection is submitted in the body of the request.

## Submit data to the service

To send an API request, You will need your Language service resource endpoint and key.

> [!NOTE]
> You can find the key and endpoint for your Language service resource on the Azure portal. They will be located on the resource's **Key and endpoint** page, under **resource management**. 

Analysis is performed upon receipt of the request. For information on the size and number of requests you can send per minute and second, see the [data limits](../data-limits.md) section in the overview.

The NER API is stateless. No data is stored in your account, and results are returned immediately in the response.

The API will attempt to detect the [listed entity categories](named-entity-types.md) for a given document language. If you want to specify which entities will be detected and returned, use the optional `piiCategories` parameter with the appropriate entity categories. This parameter can also let you detect entities that aren't enabled by default for your document language. The following URL example would detect a French driver's license number that might occur in English text, along with the default English entities.

> [!TIP]
> If you don't include `default` when specifying entity categories, The API will only return the entity categories you specify.

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1-preview.5/entities/recognition/pii?piiCategories=default,FRDriversLicenseNumber`


## Post the request

Analysis is performed upon receipt of the request. See the [data limits](../data-limits.md) article for information on the size and number of requests you can send per minute and second.

The Text Analytics API is stateless. No data is stored in your account, and results are returned immediately in the response.

### View results

All POST requests return a response with the IDs and detected entity properties.

Output is returned immediately. You can stream the results to an application that accepts JSON or the output of the client libraries, or save the output to a file on the local system. Then, import the output into an application that you can use to sort, search, and manipulate the data. Due to multilingual and emoji support, the response may contain text offsets. See [how to process offsets](../multilingual-emoji-support.md) for more information.

### NER and PII responses

The API can return response objects for both NER and PII. The response will contain...

## Summary

In this article, you learned concepts and workflow for entity linking using Text Analytics in Cognitive Services. In summary:

* JSON documents in the request body include an ID, text, and language code.
* POST requests are sent to one or more endpoints, using a personalized [access key and an endpoint](../../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource) that is valid for your subscription.
* Response output, which consists of linked entities (including confidence scores, offsets, and web links, for each document ID) can be used in any application

## Next steps

TBD