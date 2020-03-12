---
title: Web search endpoint
titleSuffix: Azure Cognitive Services
description: To get web search results, send a `GET` request to the following endpoint. The headers and URL parameters define further specifications.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-web-search
ms.topic: conceptual
ms.date: 11/14/2018
ms.author: aahi
---

# Web Search endpoint

The **Web Search API** returns Web pages, news, images, videos, and [entities](https://docs.microsoft.com/azure/cognitive-services/bing-entities-search/search-the-web). Entities have summary information about a person, place, or topic.

## Endpoint

To get Web search results using the Bing API, send a `GET` request to the following endpoint. The headers and URL parameters define further specifications.

**Endpoint**: Returns Web results that are relevant to the user's search query defined by `?q=""`.

```http
GET https://api.cognitive.microsoft.com/bing/v7.0/search
```

Endpoint: For details about headers, parameters, market codes, response objects, errors, and more, see the [Bing Web API v7](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference) reference.

## Response JSON

The response to a Web search request includes all results as JSON objects. Parsing the result requires procedures that handle the elements of each type. See the [tutorial](https://docs.microsoft.com/azure/cognitive-services/bing-web-search/tutorial-bing-web-search-single-page-app) and [source code](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/tree/master/Tutorials/Bing-Web-Search) for examples.

## Next steps

The **Bing** APIs support search actions that return results according to their type. All search endpoints return results as JSON response objects.  All endpoints support queries that return a specific language and location by longitude, latitude, and search radius.

For complete information about the parameters supported by each endpoint, see the reference pages for each type.
For examples of basic requests using the Web search API, see [Search the Web Quick-starts](https://docs.microsoft.com/azure/cognitive-services/bing-web-search/search-the-web).
