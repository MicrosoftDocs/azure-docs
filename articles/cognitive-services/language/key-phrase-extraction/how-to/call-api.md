---
title: Key Phrase Extraction using Language Services
titleSuffix: Azure Cognitive Services
description: How to extract key phrases by using the Key Phrase Extraction API from Language Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: article
ms.date: 07/06/2021
ms.author: aahi
---

# How to extract key phrases 

The Key Phrase Extraction API evaluates unstructured text, and for each JSON document, returns a list of key phrases.

This capability is useful if you need to quickly identify the main points in a collection of documents. For example, given input text "The food was delicious and there were wonderful staff", the service returns the main talking points: "food" and "wonderful staff".

## Language and document specification

Document size must be under 5,120 characters per document. For the maximum number of documents permitted in a collection. The collection is submitted in the body of the request. The API may return offsets in the response to support different [multilingual and emoji encodings](../../concepts/multilingual-emoji-support.md). 

## Submit data to the service


Key Phrase Extraction works best when you give it bigger amounts of text to work on. This is opposite from sentiment analysis, which performs better on smaller amounts of text. To get the best results from both operations, consider restructuring the inputs accordingly.

To send an API request, You will need your Language service resource endpoint and key.

> [!NOTE]
> You can find the key and endpoint for your Language service resource on the Azure portal. They will be located on the resource's **Key and endpoint** page, under **resource management**. 

Analysis is performed upon receipt of the request. For information on the size and number of requests you can send per minute and second, see the data limits article.

The Sentiment Analysis and Opinion Mining API is stateless. No data is stored in your account, and results are returned immediately in the response.

## View results

All POST requests return a JSON formatted response with the IDs and detected properties. The order of the returned key phrases is determined internally, by the model.

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system, and then import it into an application that allows you to sort, search, and manipulate the data.

## Data limits

> [!NOTE]
> * If you need to analyze larger documents than the limit allows, you can break the text into smaller chunks of text before sending them to the API. 
> * A document is a single string of text characters.  

| Limit | Value | 
|------------------------|---------------|
| Maximum size of a single document | 5,120 characters as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements). |
| Maximum size of a single document (Asynchronous)  | 125K characters as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements). |
| Maximum size of entire request | 1 MB.  |
| Max Documents Per Request |  10 |

If a document exceeds the character limit, the API will behave differently depending on the endpoint you're using:

* Asynchronous: The API will reject the entire request and return a `400 bad request` error if any document within it exceeds the maximum size.
* Synchronous:  The API won't process a document that exceeds the maximum size, and will return an invalid document error for it. If an API request has multiple documents, the API will continue processing them if they are within the character limit.

### Rate limits

Your rate limit will vary with your [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/).

| Tier          | Requests per second | Requests per minute |
|---------------|---------------------|---------------------|
| S / Multi-service | 1000                | 1000                |
| S0 / F0         | 100                 | 300                 |

## Next steps

[Key Phrase Extraction overview](../overview.md)

