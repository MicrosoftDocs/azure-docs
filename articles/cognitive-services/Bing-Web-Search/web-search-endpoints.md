---
title: Web search endpoint | Microsoft Docs
description: Summary of the Web search API endpoint.
services: cognitive-services
author: v-gedod
manager: rosh
ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 11/28/2017
ms.author: v-gedod
---

# Web Search API
The **Bing** APIs support search actions that return various kinds of results. The **Web Search API** returns Web pages, news items, images, videos, and entities that contain summary information about a person, place, or a identifiable subject. Each of these result types also have endpoints that return results by their type. 

All search endpoints return results as JSON response objects.  All endpoints support queries that return results in a specific language and/or location by longitude, latitude, and search radius. For complete information about the parameters supported by each endpoint, see the [Search API reference](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-news-api-v7-reference).

To request Web search results using the Bing API send the following `GET` request with headers and URL parameters as needed: 

Endpoint: https://api.cognitive.microsoft.com/bing/v7.0/search

The response to a **Bing Web search** request includes all types of results. Parsing the various types will require different procedures for each type. See the [tutorial](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-web-search/tutorial-bing-web-search-single-page-app) and [source code](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-web-search/tutorial-bing-web-search-single-page-app-source) for examples.

For examples of basic requests, see [Search the web](https://docs.microsoft.com/azure/cognitive-services/bing-web-search/search-the-web).
For the details about headers, parameters, market codes, response objects, errors, etc., see the [Bing Web API v7](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference) reference.

