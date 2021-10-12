---
title: How to perform sentiment analysis and opinion mining 
titleSuffix: Azure Cognitive Services
description: This article will show you how to detect sentiment, and mine for opinions in text using the Azure Language Services API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: sample
ms.date: 11/02/2021
ms.author: aahi
---

# How to: Sentiment analysis and Opinion Mining using Language Services

Sentiment analysis and opinion mining are two ways of detecting positive and negative sentiment. Using sentiment analysis, you can get sentiment labels (such as "negative", "neutral" and "positive") and confidence scores at the sentence and document-level. Opinion Mining provides granular information about the opinions related to words (such as the attributes of products or services) in the text.

> [!TIP]
> If you want to start using this feature, you can follow the [quickstart article](../quickstart.md) to get started. You can also make example requests using [Language Studio](../../language-studio.md) without needing to write code.


## Sentiment Analysis

Sentiment Analysis applies sentiment labels to text, which are returned at a sentence and document level, with a confidence score for each. 

The labels are *positive*, *negative*, and *neutral*. At the document level, the *mixed* sentiment label also can be returned. The sentiment of the document is determined below:

| Sentence sentiment                                                                            | Returned document label |
|-----------------------------------------------------------------------------------------------|-------------------------|
| At least one `positive` sentence is in the document. The rest of the sentences are `neutral`. | `positive`              |
| At least one `negative` sentence is in the document. The rest of the sentences are `neutral`. | `negative`              |
| At least one `negative` sentence and at least one `positive` sentence are in the document.    | `mixed`                 |
| All sentences in the document are `neutral`.                                                  | `neutral`               |

Confidence scores range from 1 to 0. Scores closer to 1 indicate a higher confidence in the label's classification, while lower scores indicate lower confidence. For each document or each sentence, the predicted scores associated with the labels (positive, negative and neutral) add up to 1. For more information, see the [Responsible AI transparency note](/legal/cognitive-services/text-analytics/transparency-note?context=/azure/cognitive-services/text-analytics/context/context). 

## Opinion Mining

Opinion Mining is a feature of Sentiment Analysis. Also known as Aspect-based Sentiment Analysis in Natural Language Processing (NLP), this feature provides more granular information about the opinions related to attributes of products or services in text. The API surfaces opinions as a target (noun or verb) and an assessment (adjective).

For example, if a customer leaves feedback about a hotel such as "The room was great, but the staff was unfriendly.", Opinion Mining will locate targets (aspects) in the text, and their associated assessments (opinions) and sentiments. Sentiment Analysis might only report a negative sentiment.

:::image type="content" source="../../../text-analytics/media/how-tos/opinion-mining.png" alt-text="A diagram of the Opinion Mining example" lightbox="../../../text-analytics/media/how-tos/opinion-mining.png":::

If you're using the REST API, to get Opinion Mining in your results, you must include the `opinionMining=true` flag in a request for sentiment analysis. The Opinion Mining results will be included in the sentiment analysis response. Opinion mining is an extension of Sentiment Analysis and is included in your current [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/).

## Determine how to process the data (optional)

### Specify the sentiment analysis model

By default, sentiment analysis will use the latest available AI model on your text. You can also configure your API requests to use a previous model version, if you determine one performs better on your data. The model you specify will be used to perform sentiment analysis operations.

| Supported Versions | latest version |
|--|--|
| `2019-10-01`, `2020-04-01` | `2020-04-01`   |

### Input languages

When you submit documents to be processed by sentiment analysis, you can specify which of [the supported languages](../language-support.md) they're written in. if you don't specify a language, sentiment analysis will default to English. The API may return offsets in the response to support different [multilingual and emoji encodings](../../concepts/multilingual-emoji-support.md). 

## Submitting data

Sentiment analysis and opinion mining produce a higher-quality result when you give it smaller amounts of text to work on. This is opposite from some features, like key phrase extraction which performs better on larger blocks of text. 

To send an API request, You will need your Language service resource endpoint and key.

> [!NOTE]
> You can find the key and endpoint for your Language service resource on the Azure portal. They will be located on the resource's **Key and endpoint** page, under **resource management**. 

Analysis is performed upon receipt of the request. For information on the size and number of requests you can send per minute and second, see the data limits section below.

using the sentiment analysis and opinion mining features synchronously is stateless. No data is stored in your account, and results are returned immediately in the response.

When using the features asynchronously, the API results are available for 24 hours from the time the request was ingested, and is indicated in the response. After this time period, the results are purged and are no longer available for retrieval.

## Getting sentiment analysis and opinion mining results

When you receive results from the API, the order of the returned key phrases is determined internally, by the model. You can stream the results to an application, or save the output to a file on the local system.

Sentiment analysis returns a sentiment label and confidence score for the entire document, and each sentence within it. Scores closer to 1 indicate a higher confidence in the label's classification, while lower scores indicate lower confidence. A document can have multiple sentences, and the confidence scores within each document or sentence add up to 1.

Opinion Mining will locate targets (nouns or verbs) in the text, and their associated assessment (adjective). for example, the sentence "*The restaurant had great food and our waiter was friendly*" has two targets: *food* and *waiter*. Each target has an assessment. For example, the assessment for *food* would be *great*, and the assessment for *waiter* would be *friendly*.

The API returns opinions as a target (noun or verb) and an assessment (adjective).


## Data limits

> [!NOTE]
> * If you need to analyze larger documents than the limit allows, you can break the text into smaller chunks of text before sending them to the API. 
> * A document is a single string of text characters.  

| Limit | Value |
|------------------------|---------------|
| Maximum size of a single document (synchronous) | 5,120 characters as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements).  |
| Maximum number of characters per request (asynchronous) | 125K characters across all submitted documents, as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements).  |
| Maximum size of entire request | 1 MB. |
| Max documents per request | 10 |

If a document exceeds the character limit, the API will behave differently depending on the feature you're using:

* Asynchronous:
  * The API will reject the entire request and return a `400 bad request` error if any document within it exceeds the maximum size.
* Synchronous:  
  * The API won't process a document that exceeds the maximum size, and will return an invalid document error for it. If an API request has multiple documents, the API will continue processing them if they are within the character limit.

Exceeding the maximum number of documents you can send in a single request will generate an HTTP 400 error code.

### Rate limits

Your rate limit will vary with your [pricing tier](https://aka.ms/unifiedLanguagePricing).

| Tier          | Requests per second | Requests per minute |
|---------------|---------------------|---------------------|
| S / Multi-service | 1000                | 1000                |
| S0 / F0         | 100                 | 300                 |

## See also

* [Sentiment analysis and opinion mining overview](../overview.md)
