---
title: Bing Autosuggest endpoint
titlesuffix: Azure Cognitive Services
description: Summary of the Bing Autosuggest API endpoint.
services: cognitive-services
author: mikedodaro
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-autosuggest
ms.topic: conceptual
ms.date: 12/05/2017
ms.author: v-gedod
---
# Bing Autosuggest endpoint

The **Bing Autosuggest API**  includes one endpoint, which returns a list of suggested queries from a partial search term.

## Endpoint

To get suggested queries using the Bing API, send a `GET` request to the following endpoint. Use the headers and URL parameters to define further specifications.

**Endpoint:** Returns search suggestions as JSON results that are relevant to the user's input defined by `?q=""`.

```http
GET https://api.cognitive.microsoft.com/bing/v7.0/Suggestions 
```

For details about headers, parameters, market codes, response objects, errors, etc., see the [Bing Autosuggest API v7](https://docs.microsoft.com/rest/api/cognitiveservices/bing-autosuggest-api-v7-reference) reference.

## Response JSON

The response to an autosuggest request includes results as JSON objects. For examples of parsing the results see the [tutorial](tutorials/autosuggest.md) and [source code](tutorials/autosuggest-source.md).

## Next steps

The **Bing** APIs support search actions that return results according to their type. All search endpoints return results as JSON response objects.
All endpoints support queries that return a specific language and/or location by longitude, latitude, and search radius.

For complete information about the parameters supported by each endpoint, see the reference pages for each type.
For examples of basic requests using the Autosuggest API, see [Autosuggest Quickstarts](https://docs.microsoft.com/azure/cognitive-services/Bing-Autosuggest).