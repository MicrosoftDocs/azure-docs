---
title: Endpoints for the Bing Image Search API
titleSuffix: Azure Cognitive Services
description: The Image Search API includes three endpoints. Endpoint 1 returns images from the web. Endpoint 2 returns ImageInsights. Endpoint 3 returns trending images.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-image-search
ms.topic: conceptual
ms.date: 03/04/2019
ms.author: aahi
---

# Endpoints for the Bing Image Search API

The **Image Search API**  includes three endpoints.  Endpoint 1 returns images from the Web based on a query. Endpoint 2 returns [ImageInsights](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#imageinsightsresponse).  Endpoint 3 returns trending images.

## Endpoints

To get image results using the Bing API, send a request to one of the following endpoints. Use the headers and URL parameters to define further specifications.

**Endpoint 1:** Returns images that are relevant to the user's search query defined by `?q=""`.
```
GET https://api.cognitive.microsoft.com/bing/v7.0/images/search
```

**Endpoint 2:** Returns insights about an image, using either `GET` or `POST`.
```
 GET or POST https://api.cognitive.microsoft.com/bing/v7.0/images/details
```
A GET request returns insights about an image, such as Web pages that include the image. Include the [insightsToken](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#insightstoken) parameter with a `GET` request.

Or, you can include a binary image in the body of a `POST` request and set the [modules](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#modulesrequested) parameter to `RecognizedEntities`. This will return an [insightsToken](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v5-reference#insightstoken) to use as a parameter in a subsequent `GET` request, which returns information about people in the image.  Set `modules` to `All` to get all insights, except `RecognizedEntities` in the results of the `POST` without making another call using the `insightsToken`.


**Endpoint 3:** Returns images that are trending based on search requests made by others. The images are separated into different categories, for example, based on noteworthy people or events.
```
GET https://api.cognitive.microsoft.com/bing/v7.0/images/trending
```

For a list of markets that support trending images, see [Trending Images](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/trending-images).

For details about headers, parameters, market codes, response objects, errors, etc., see the [Bing Image Search API v7](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference) reference.
## Response JSON
The response to an image search request includes results as JSON objects. For examples of parsing the results see the [tutorial](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/tutorial-bing-image-search-single-page-app) and [source code](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/tutorial-bing-image-search-single-page-app-source).

## Next steps
The **Bing** APIs support search actions that return results according to their type. All search endpoints return results as JSON response objects.  All endpoints support queries that return a specific language and/or location by longitude, latitude, and search radius.

For complete information about the parameters supported by each endpoint, see the reference pages for each type.
For examples of basic requests using the Image search API, see [Image Search Quick-starts](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/search-the-web).
