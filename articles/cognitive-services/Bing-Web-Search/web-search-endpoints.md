---
title: Web search endpoint
titleSuffix: Azure Cognitive Services
description: Summary of the Web search API endpoint.
services: cognitive-services
author: mikedodaro
manager: cgronlun
ms.service: cognitive-services
ms.component: bing-web-search
ms.topic: article
ms.date: 11/28/2017
ms.author: v-gedod
---

# Web Search endpoint
The **Web Search API** returns Web pages, news, images, videos, and [entities](https://docs.microsoft.com/azure/cognitive-services/bing-entities-search/search-the-web). Entities contain summary information about a person, place, or topic.
## Endpoint
To get Web search results using the Bing API, send a `GET` request to the following endpoint. The headers and URL parameters define further specifications.

**Endpoint**: Returns Web results that are relevant to the user's search query defined by `?q=""`.
```
GET https://api.cognitive.microsoft.com/bing/v7.0/search
```
Endpoint: For details about headers, parameters, market codes, response objects, errors, etc., see the [Bing Web API v7](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference) reference.

## Response JSON
The response to a Web search request includes all results as JSON objects. Parsing the result requires procedures that handle the elements of each type. See the [tutorial](https://docs.microsoft.com/azure/cognitive-services/bing-web-search/tutorial-bing-web-search-single-page-app) and [source code](https://docs.microsoft.com/azure/cognitive-services/bing-web-search/tutorial-bing-web-search-single-page-app-source) for examples.

## Next steps
The **Bing** APIs support search actions that return results according to their type. All search endpoints return results as JSON response objects.  All endpoints support queries that return a specific language and/or location by longitude, latitude, and search radius.

For complete information about the parameters supported by each endpoint, see the reference pages for each type.
For examples of basic requests using the Web search API, see [Search the Web Quick-starts](https://docs.microsoft.com/azure/cognitive-services/bing-web-search/search-the-web).
