---
title: The Bing Entity Search API endpoint
titleSuffix: Azure Cognitive Services
description: The Bing Entity Search API has one endpoint that returns entities from the Web based on a query. These search results are returned in JSON.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-entity-search
ms.topic: conceptual
ms.date: 02/01/2019
ms.author: aahi
---

# Bing Entity Search API endpoint


The Bing Entity Search API has one endpoint that returns entities from the Web based on a query. These search results are returned in JSON.

## Get entity results from the endpoint

To get entity results using the **Bing API**, send a `GET` request to the following endpoint. Use [headers](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-entities-api-v7-reference#headers) and [query parameters](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-entities-api-v7-reference#query-parameters) to customize your search request. Search requests can be sent using the `?q=` parameter.

```cURL
 GET https://api.cognitive.microsoft.com/bing/v7.0/entities
```

## Next steps

> [!div class="nextstepaction"]
> [What is the Bing Entity Search API?](overview.md)

## See also 

For more information about headers, parameters, market codes, response objects, errors and more, see the [Bing Entity Search API v7](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-entities-api-v7-reference) reference article.
