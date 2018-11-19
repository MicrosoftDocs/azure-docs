---
title: Bing News Search endpoints
titlesuffix: Azure Cognitive Services
description: Summary of the News search API endpoint.
services: cognitive-services
author: mikedodaro
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-news-search
ms.topic: conceptual
ms.date: 11/28/2017
ms.author: v-gedod
---

# Bing News Search endpoints
The **News Search API** returns news articles, Web pages, images, videos, and [entities](https://docs.microsoft.com/azure/cognitive-services/bing-entities-search/search-the-web). Entities contain summary information about a person, place, or topic.
## Endpoints
To get News search results using the Bing API, send a `GET` request to one of the following endpoints. The headers and URL parameters define further specifications.

**Endpoint 1:** Returns news items based on the user's search query. If the search query is empty, the call returns the top news articles. The query `?q=""` option can also be used with the `/news` URL. For availability, see [Supported countries and markets](language-support.md#supported-markets-for-news-search-endpoint).
```
GET https://api.cognitive.microsoft.com/bing/v7.0/news/search
```

**Endpoint 2:** Returns the top news items by category. You can specifically request the top business, sports, or entertainment articles using `category=business`, `category=sports`, or `category=entertainment`.  The `category` parameter can only be used with the `/news` URL. There are some formal requirements for specifying categories; refer to `category` in the [query parameter](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v7-reference#query-parameters) documentation. For availability, see [Supported countries and markets](language-support.md#supported-markets-for-news-endpoint).
```
GET https://api.cognitive.microsoft.com/bing/v7.0/news  
```

**Endpoint 3:** Returns news topics that are currently trending on social networks. When the `/trendingtopics` option is included, Bing search ignores several other parameters, such as `freshness` and `?q=""`. For availability, see [Supported countries and markets](language-support.md#supported-markets-for-news-trending-endpoint).
```
GET https://api.cognitive.microsoft.com/bing/v7.0/news/trendingtopics
```

For details about headers, parameters, market codes, response objects, errors, etc., see the [Bing News search API v7](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v7-reference) reference.
## Response JSON
The response to a News search request includes results as JSON objects. Parsing the results requires procedures that handle elements of each type. See the [tutorial](https://docs.microsoft.com/azure/cognitive-services/bing-news-search/tutorial-bing-news-search-single-page-app) and [source code](https://docs.microsoft.com/azure/cognitive-services/bing-news-search/tutorial-bing-news-search-single-page-app-source) for examples.

## Next steps
The **Bing** APIs support search actions that return results according to their type. All search endpoints return results as JSON response objects.  All endpoints support queries that return a specific language and/or location by longitude, latitude, and search radius.

For complete information about the parameters supported by each endpoint, see the reference pages for each type.
For examples of basic requests using the News search API, see [Bing News Search Quick-starts](https://docs.microsoft.com/azure/cognitive-services/bing-news-search).
