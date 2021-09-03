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
ms.date: 06/10/2021
ms.author: aahi
---

# How to: Sentiment analysis and Opinion Mining using Language Services

The Language service provides two ways for detecting positive and negative sentiment. Using Sentiment Analysis, you can get sentiment labels (such as "negative", "neutral" and "positive") and confidence scores at the sentence and document-level. You can use Opinion Mining, which provides granular information about the opinions related to words (such as the attributes of products or services) in the text.

The AI models used by the API are provided by the service, you just have to send content for analysis.

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

> [!TIP]
> There are examples of how to use this feature in the quickstart article. You can also make example requests and see the JSON output using [Language Studio](https://language.azure.com/tryout/sentiment) 

### Language and document specification

<!--
Sentiment Analysis and Opinion Mining accept a variety of languages. See [Supported languages](../language-support.md) for more information. 
-->

Document size must be under 5,120 characters per document. For the maximum number of documents permitted in a collection. The collection is submitted in the body of the request. The API may return offsets in the response to support different [multilingual and emoji encodings](../../concepts/multilingual-emoji-support.md). 

## Submit data to the service

Sentiment Analysis and Opinion Mining produce a higher-quality result when you give it smaller amounts of text to work on. This is opposite from some features, like key phrase extraction which performs better on larger blocks of text. To get the best results from both operations, consider restructuring the inputs accordingly.

To send an API request, You will need your Language service resource endpoint and key.

> [!NOTE]
> You can find the key and endpoint for your Language service resource on the Azure portal. They will be located on the resource's **Key and endpoint** page, under **resource management**. 

Analysis is performed upon receipt of the request. For information on the size and number of requests you can send per minute and second, see the data limits article.

The Sentiment Analysis and Opinion Mining API is stateless. No data is stored in your account, and results are returned immediately in the response.

### View the results

Output is returned immediately. You can stream the results to an application that accepts JSON or the output of the client libraries, or save the output to a file on the local system. Then, import the output into an application that you can use to sort, search, and manipulate the data. Due to multilingual and emoji support, the response may contain text offsets. See [how to process offsets](../../concepts/multilingual-emoji-support.md) for more information.

### Sentiment Analysis and Opinion Mining response

The Sentiment Analysis API can return response objects for both Sentiment Analysis and Opinion Mining.
  
Sentiment analysis returns a sentiment label and confidence score for the entire document, and each sentence within it. Scores closer to 1 indicate a higher confidence in the label's classification, while lower scores indicate lower confidence. A document can have multiple sentences, and the confidence scores within each document or sentence add up to 1.

Opinion Mining will locate targets (nouns or verbs) in the text, and their associated assessment (adjective). In the below response, the sentence *The restaurant had great food and our waiter was friendly* has two targets: *food* and *waiter*. Each target's `relations` property contains a `ref` value with the URI-reference to the associated `documents`, `sentences`, and `assessments` objects.

The API returns opinions as a target (noun or verb) and an assessment (adjective).

See the [Azure Language Studio](https://language.azure.com/) to see example input and output for this API.


## Data limits

> [!NOTE]
> * If you need to analyze larger documents than the limit allows, you can break the text into smaller chunks of text before sending them to the API. 
> * A document is a single string of text characters.  

| Limit | Value |
|------------------------|---------------|
| Maximum size of a single document | 5,120 characters as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements).  |
| Maximum size of a single document (`/analyze` endpoint)  | 125K characters as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements).  |
| Maximum size of entire request | 1 MB. |
| Max documents per request | 10 |

If a document exceeds the character limit, the API will behave differently depending on the feature you're using:

* Asynchronous:
  * The API will reject the entire request and return a `400 bad request` error if any document within it exceeds the maximum size.
* Synchronous:  
  * The API won't process a document that exceeds the maximum size, and will return an invalid document error for it. If an API request has multiple documents, the API will continue processing them if they are within the character limit.

Exceeding the maximum number of documents you can send in a single request will generate an HTTP 400 error code.


## Summary

In this article, you learned concepts and workflow for sentiment analysis and opinion mining using Language services. In summary:

+ Sentiment Analysis and Opinion Mining is available for select languages.
+ Documents in the request include an ID, text, and language code.
+ requests are sent using a personalized [access key and an endpoint](../../../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource) that's valid for your subscription.
+ Response output, which consists of a sentiment score for each document ID, can be streamed to any app that accepts JSON or the client library output. For example, Excel and Power BI.

## See also

* [Language Services overview](../overview.md)
