---
title: Video search endpoints - Bing Video Search
titlesuffix: Azure Cognitive Services
description: Summary of the Bing Video Search API endpoint.
services: cognitive-services
author: mikedodaro
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-video-search
ms.topic: conceptual
ms.date: 12/04/2017
ms.author: rosh
---

# Video Search endpoints
The **Video Search API**  includes three endpoints.  Endpoint 1 returns videos from the Web based on a query. Endpoint 2 returns insights about a video based on the `modules` URL parameter.  Endpoint 3 returns trending images.

## Endpoints
To get video results using the Bing API, send a `GET` request to one of the following endpoints. Use the headers and URL parameters to define further specifications.

**Endpoint1:** Returns videos that are relevant to the user's search query defined by `?q=""`.
``` 
GET https://api.cognitive.microsoft.com/bing/v7.0/videos/search
```

**Endpoint 2:** Returns insights about a video, such as related videos. Include the `modules` [query parameter](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#query-parameters), which is a comma-delimited list of insights to request.
``` 
GET https://api.cognitive.microsoft.com/bing/v7.0/videos/details
```

**Endpoint 3:** Returns videos that are trending based on search requests made by others. The videos are separated into different categories, for example, based on noteworthy people or events.
```
GET https://api.cognitive.microsoft.com/bing/v7.0/videos/trending
```

For details about headers, parameters, market codes, response objects, errors, etc., see the [Bing Video Search API v7](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference) reference.
## Response JSON
The response to a videos search request includes results as JSON objects. For examples of parsing the results see the [tutorial](https://docs.microsoft.com/azure/cognitive-services/bing-video-search/tutorial-bing-video-search-single-page-app) and [source code](https://docs.microsoft.com/azure/cognitive-services/bing-video-search/tutorial-bing-video-search-single-page-app-source).

## Next steps
The **Bing** APIs support search actions that return results according to their type. All search endpoints return results as JSON response objects.  All endpoints support queries that return a specific language and/or location by longitude, latitude, and search radius.

For complete information about the parameters supported by each endpoint, see the reference pages for each type.
For examples of basic requests using the Video search API, see [Video Search Quick-starts](https://docs.microsoft.com/azure/cognitive-services/bing-video-search).