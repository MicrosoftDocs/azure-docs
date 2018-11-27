---
title: Bing Entity Search endpoint
titlesuffix: Azure Cognitive Services
description: Summary of the Bing Entity Search API endpoint.
services: cognitive-services
author: mikedodaro
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-entity-search
ms.topic: conceptual
ms.date: 12/05/2017
ms.author: v-gedod
---

# Entity Search endpoint
The **Entity Search API**  includes one endpoint that returns entities from the Web based on a query.

## Endpoint
To get entity results using the **Bing API**, send a `GET` request to the following endpoint. Use the headers and URL parameters to define further specifications.

**Endpoint:** Returns entities that are relevant to the user's search query defined by `?q=""`.
```
 GET https://api.cognitive.microsoft.com/bing/v7.0/entities
```

For details about headers, parameters, market codes, response objects, errors, etc., see the [Bing Entity Search API v7](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference) reference.

## Response JSON
The response to a entity search request includes results as JSON objects. For examples of the results, see [Get started](https://docs.microsoft.com/azure/cognitive-services/bing-entities-search/quick-start).

## Next steps
The **Bing** APIs support search actions that return results according to their type. All search endpoints return results as JSON response objects.  All endpoints support queries that return a specific language and/or location by longitude, latitude, and search radius.

For complete information about the parameters supported by each endpoint, see the reference pages for each type.
For examples using the Entity search API, see [Get started](https://docs.microsoft.com/azure/cognitive-services/bing-entities-search/quick-start) and [Resizing and cropping thumbnail images](https://docs.microsoft.com/azure/cognitive-services/bing-entities-search/resize-and-crop-thumbnails).