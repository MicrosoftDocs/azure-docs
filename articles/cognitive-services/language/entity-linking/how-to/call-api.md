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
ms.date: 06/15/2021
ms.author: aahi
---

# How to use entity linking

Entity linking is the ability to identify and disambiguate the identity of an entity found in text (for example, determining whether an occurrence of the word "Mars" refers to the planet, or to the Roman god of war). This process requires the presence of a knowledge base in an appropriate language, to link recognized entities in text. Entity Linking uses [Wikipedia](https://www.wikipedia.org/) as this knowledge base.

> [!TIP]
> There are examples of how to use this feature in the quickstart article. You can also make example requests and see the JSON output using [Language Studio](https://language.azure.com/tryout/sentiment) 

### Language and document specification

Entity linking accepts a variety of languages. See [Supported languages](../language-support.md) for more information. 


Document size must be under 5,120 characters per document. For the maximum number of documents permitted in a collection. The collection is submitted in the body of the request. The API may return offsets in the response to support different multilingual and emoji encodings. 

## Submit data to the service

Entity linking produces a higher-quality result when you give it smaller amounts of text to work on. This is opposite from some features, like key phrase extraction which performs better on larger blocks of text. To get the best results from both operations, consider restructuring the inputs accordingly.

To send an API request, You will need your Language Service resource endpoint and key.

> [!NOTE]
> You can find the key and endpoint for your Language Service resource on the Azure portal. They will be located on the resource's **Key and endpoint** page, under **resource management**. 

Analysis is performed upon receipt of the request. For information on the size and number of requests you can send per minute and second, see the data limits article.

The entity linking API is stateless. No data is stored in your account, and results are returned immediately in the response.

### View the results

Output is returned immediately. You can stream the results to an application that accepts JSON or the output of the client libraries, or save the output to a file on the local system. Then, import the output into an application that you can use to sort, search, and manipulate the data. Due to multilingual and emoji support, the response may contain text offsets. 

## Data limits

> [!NOTE]
> * If you need to analyze larger documents than the limit allows, you can break the text into smaller chunks of text before sending them to the API. 
> * A document is a single string of text characters.  

| Limit | Value |
|------------------------|---------------|
| Maximum size of a single document | 5,120 characters as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements). |
| Maximum size of a single document (`/analyze` endpoint)  | 125K characters as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements). |
| Maximum size of entire request | 1 MB |
| Max Documents Per Request | 5 |

If a document exceeds the character limit, the API will behave differently depending on the endpoint you're using:

* Asynchronous: The API will reject the entire request and return a `400 bad request` error if any document within it exceeds the maximum size.
* Synchronous: The API won't process a document that exceeds the maximum size, and will return an invalid document error for it. If an API request has multiple documents, the API will continue processing them if they are within the character limit.

### Rate limits

Your rate limit will vary with your [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/).

| Tier          | Requests per second | Requests per minute |
|---------------|---------------------|---------------------|
| S / Multi-service | 1000                | 1000                |
| S0 / F0         | 100                 | 300                 |

## See also

* [What is the Text Analytics API](../overview.md)
