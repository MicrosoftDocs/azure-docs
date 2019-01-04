---
title: What is the Bing Entity Search API?
titlesuffix: Azure Cognitive Services
description: Use the Bing Entity Search API to extract and search for entities and places from search queries.
services: cognitive-services
author: swhite-msft
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-entity-search
ms.topic: overview
ms.date: 07/06/2016
ms.author: scottwhi
---

# What is Bing Entity Search API?

The Bing Entity Search API sends a search query to Bing and gets results that include entities and places. Place results include restaurants, hotel, or other local businesses. Bing returns places if the query specifies the name of the local business or asks for a type of business (for example, restaurants near me). Bing returns entities if the query specifies well-known people, places (tourist attractions, states, countries, etc.), or things.

|Feature  |Description  |
|---------|---------|
|[Real-time search suggestions](define-custom-suggestions.md)     | Provide search suggestions that can be displayed as a dropdown list as your users type.       | 

## Workflow

The Bing Entity Search API is a RESTful web service, making it easy to call from any programming language that can make HTTP requests and parse JSON. You can use the service using either the REST API, or the SDK.

1. Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with access to the Bing Search APIs. If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) for free.
2. Send a request to the API, with a valid search query.
3. Process the API response by parsing the returned JSON message.

## Next steps

To get started quickly with your first request, see [Making Your First Request](./quick-start.md).

Familiarize yourself with the [Bing Entity Search API v7](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference) reference. The reference contains the headers and query parameters that you use to request search results. It also includes definitions of the response objects. 

To improve your search box user experience, see [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md). As the user enters their query term, you can call this API to get relevant query terms that were used by others.

Be sure to read [Bing Use and Display Requirements](./use-display-requirements.md) so you don't break any of the rules about using the search results.

## See also

* The [Bing Entity Search API v7](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-entities-api-v7-reference) reference section contains definitions and information on the endpoints, headers, API responses, and query parameters that you can use to request image-based search results.
* The [Bing Use and Display Requirements](./use-and-display-requirements.md) specify acceptable uses of the content and information gained through the Bing search APIs.
