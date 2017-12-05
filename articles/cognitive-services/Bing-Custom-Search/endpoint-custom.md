---
title: Custom Search endpoint | Microsoft Docs
description: Summary of the Custom Search API endpoint.
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.technology: bing-custom-search
ms.topic: article
ms.date: 12/05/2017
ms.author: v-gedod
---

# Custom Search endpoint

The **Custom Search API**  includes one endpoint, which returns results from the Web based on a [user-defined set](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-custom-search/tutorials/custom-search-web-page) of sources. 

##Endpoint
To get results using the Bing Custom Search API, send a `GET` request to the following endpoint. Use the headers and URL parameters to define further specifications.

Endpoint `GET`:
```  
https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search  
```
Returns search suggestions as JSON results that are relevant to the users input defined by `?q=""`.


For examples that describe how to set up Custom Search sources, see the [tutorial](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-custom-search/tutorials/custom-search-web-page). For details about headers, parameters, market codes, response objects, errors, etc., see the [Bing Custom Search API v7](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-custom-search-api-v7-reference) reference.

##Response JSON
The response to a videos search request includes results as JSON objects. 

##Next steps
The **Bing** APIs support search actions that return results according to their type. All search endpoints return results as JSON response objects.  All endpoints support queries that return a specific language and/or location by longitude, latitude, and search radius.

For complete information about the parameters supported by each endpoint, see the reference pages for each type.
For examples of basic requests using the Custom Search API, see [Custom Search Quick-starts](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-custom-search/)