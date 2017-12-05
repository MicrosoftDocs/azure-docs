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
ms.author: v-gedod
---

# Image Search endpoint
The **Image Search API**  includes three endpoints.  Endpoint 1 returns images from the Web based on a query. Endpoint 2 returns [ImageInsights](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#imageinsightsresponse).  Endpoint 3 returns trending images.
##Endpoints
To get image results using the Bing API, send a request to one of the following endpoints. Use the headers and URL parameters to define further specifications.

Endpoint 1 `GET`:  
https://api.cognitive.microsoft.com/bing/v7.0/images/search

Returns images that are relevant to the users search query defined by `?q=""`.

Endpoint 2 `GET` or `POST`:
 
https://api.cognitive.microsoft.com/bing/v7.0/images/details

A GET request returns insights about an image, such as Web pages that include the image. Include the [insightsToken](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#insightstoken) parameter with a `GET` request.

Or, you can include a binary image in the body of a `POST` request and set the [modules](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference#modulesrequested) parameter to `RecognizedEntities`. To specify the image in the body of the `POST` request, you must include the `Content-Type` header and set its value to `multipart/form-data`.


Endpoint 3 `GET`:

https://api.cognitive.microsoft.com/bing/v7.0/images/trending

Returns images that are trending based on search requests made by others. The images are separated into different categories, for example, based on noteworthy people or events.

For a list of markets that support trending images, see [Trending Images](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-image-search/trending-images).

For details about headers, parameters, market codes, response objects, errors, etc., see the [Bing Image Search API v7](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference) reference.
##Response JSON
The response to an image search request includes results as JSON objects. For examples of parsing the results see the [tutorial](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-image-search/tutorial-bing-image-search-single-page-app) and [source code](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-image-search/tutorial-bing-image-search-single-page-app-source).

##Next steps
The **Bing** APIs support search actions that return results according to their type. All search endpoints return results as JSON response objects.  All endpoints support queries that return a specific language and/or location by longitude, latitude, and search radius.

For complete information about the parameters supported by each endpoint, see the reference pages for each type.
For examples of basic requests using the Image search API, see [Image Search Quick-starts](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/search-the-web).