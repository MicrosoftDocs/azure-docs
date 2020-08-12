---
title: What is the Bing Entity Search API?
titleSuffix: Azure Cognitive Services
description: Use the Bing Entity Search API to extract and search for entities and places from search queries.
services: cognitive-services
author: swhite-msft
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-entity-search
ms.topic: overview
ms.date: 12/18/2019
ms.author: scottwhi
---

# What is Bing Entity Search API?

The Bing Entity Search API sends a search query to Bing and gets results that include entities and places. Place results include restaurants, hotel, or other local businesses. Bing returns places if the query specifies the name of the local business or asks for a type of business (for example, restaurants near me). Bing returns entities if the query specifies well-known people, places (tourist attractions, states, countries/regions, etc.), or things.

|Feature  |Description  |
|---------|---------|
|[Real-time search suggestions](concepts/search-for-entities.md#suggest-search-terms-with-the-bing-autosuggest-api)     | Provide search suggestions that can be displayed as a dropdown list as your users type.       | 
| [Entity disambiguation](concepts/search-for-entities.md#the-bing-entity-search-api-response)  | Get multiple entities for queries with multiple possible meanings. |
| [Find places](concepts/search-for-entities.md#find-places) | Search for and return information on local businesses and entities  |

## Workflow

The Bing Entity Search API is a RESTful web service, making it easy to call from any programming language that can make HTTP requests and parse JSON. You can use the service using either the REST API, or the SDK.

1. Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with access to the Bing Search APIs. If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/free/cognitive-services/) for free.
2. Send a request to the API, with a valid search query.
3. Process the API response by parsing the returned JSON message.

## Next steps

* Try the [interactive demo](https://azure.microsoft.com/services/cognitive-services/bing-entity-search-api/) for the Bing Entity Search API. 
* To get started quickly with your first request, try a [Quickstart](quickstarts/csharp.md).
* The [Bing Entity Search API v7](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-entities-api-v7-reference) reference section.
* The [Bing Use and Display Requirements](./use-display-requirements.md) specify acceptable uses of the content and information gained through the Bing search APIs.
* Visit the [Bing Search API hub page](../bing-web-search/search-the-web.md) to explore the other available APIs.