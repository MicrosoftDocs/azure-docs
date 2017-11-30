---
title: Image search endpoint | Microsoft Docs
description: Summary of the Image search API endpoint.
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.technology: bing-image-search
ms.topic: article
ms.date: 11/30/2017
ms.author: mikedodaro
---

# Image Search endpoint
The **Image Search API** returns images from the Web based on a query specification.
##Endpoint
To get Web search results using the Bing API, send a `GET` request to one of the following endpoints. The headers and URL parameters define further specifications.

Endpoint 1: 
https://api.cognitive.microsoft.com/bing/v7.0/images/search
Returns images that are relevant to the users search query.
Endpoint 2: 
https://api.cognitive.microsoft.com/bing/v7.0/images/details
Returns insights about an image, such as webpages that include the image.
Endpoint 3: 
https://api.cognitive.microsoft.com/bing/v7.0/images/trending
Returns images that are trending based on search requests made by others. The images are separated into different categories. For example, based on noteworthy people or events.

For a list of markets that support trending images, see [Trending Images](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-image-search/trending-images).

For details about headers, parameters, market codes, response objects, errors, etc., see the [Bing Web API v7](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference) reference.
##Response JSON
The response to an image search request includes results as JSON objects. For examples of parsing the results see the [tutorial](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-image-search/tutorial-bing-web-search-single-page-app) and [source code](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-web-search/tutorial-bing-web-search-single-page-app-source) for examples.

##Next steps
The **Bing** APIs support search actions that return results according to their type. All search endpoints return results as JSON response objects.  All endpoints support queries that return a specific language and/or location by longitude, latitude, and search radius.

For complete information about the parameters supported by each endpoint, see the reference pages for each type.
For examples of basic requests using the Web search API, see [Search the Web Quick-starts](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/search-the-web).