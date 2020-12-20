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

> [!WARNING]
> Bing Search APIs are moving from Cognitive Services to Bing Search Services. Starting **October 30, 2020**, any new instances of Bing Search need to be provisioned following the process documented [here](/bing/search-apis/bing-web-search/create-bing-search-service-resource).
> Bing Search APIs provisioned using Cognitive Services will be supported for the next three years or until the end of your Enterprise Agreement, whichever happens first.
> For migration instructions, see [Bing Search Services](/bing/search-apis/bing-web-search/create-bing-search-service-resource).


The Bing Entity Search API has one endpoint that returns entities from the Web based on a query. These search results are returned in JSON.

## Get entity results from the endpoint

To get entity results using the **Bing API**, send a `GET` request to the following endpoint. Use [headers](/rest/api/cognitiveservices-bingsearch/bing-entities-api-v7-reference#headers) and [query parameters](/rest/api/cognitiveservices-bingsearch/bing-entities-api-v7-reference#query-parameters) to customize your search request. Search requests can be sent using the `?q=` parameter.

```cURL
 GET https://api.cognitive.microsoft.com/bing/v7.0/entities
```

## Next steps

> [!div class="nextstepaction"]
> [What is the Bing Entity Search API?](overview.md)

## See also 

For more information about headers, parameters, market codes, response objects, errors and more, see the [Bing Entity Search API v7](/rest/api/cognitiveservices-bingsearch/bing-entities-api-v7-reference) reference article.