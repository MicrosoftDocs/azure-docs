---
title: What is Bing Web Search? | Microsoft Docs
description: Shows how to use the Bing Web Search API to search the web for webpages, images, news, videos, and more.
services: cognitive-services
author: swhite-msft
manager: rosh
ms.assetid:
ms.service: cognitive-services
ms.component: bing-web-search
ms.topic: overview
ms.date: 08/14/2018
ms.author: scottwhi, erhopf
---

# What is Bing Web Search?

The Bing Web Search API is a RESTful service that enables an application to use Bing's web search capabilities. Requests can be configured to return results that include web pages, images, videos, news, entities, related search queries, spelling corrections, unit conversion, translations, and calculations. Results are based on relevance and subscriptions to Bing Search APIs and provided in JSON.

This API should be used when an application needs access to all relevant content to a user's query. If you are building an application that requires only a specific type of content, use the [Bing Image Search API](../Bing-Image-Search/), [Bing Video Search API](../Bing-Video-Search/), or [Bing News Search API](../Bing-News-Search/). See [Cognitive Services APIs](../#cognitive-services-apis) for a complete list of Bing Search APIs.

Want to see how it works? Try our [Bing Web Search API demo](https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/).

## Key features  

With the Bing Web Search API your application gets has access <TODO: Erik - Some type of intro...>

* Get instant answers from Bing Web Search with our REST API, including web pages, images, videos, news, calculations and more.  
* [Filter search results](filter-answers.md) by content type.
* [Arrange and rank](rank-results.md) search results to fit your application's layout and design.  
* Customize results based on a user's [location or market](supported-countries-markets.md).  
* Analyze search queries with [Bing Statistics](bing-web-stats.md).   
* Pair with the [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md) to provide user's with suggested queries based on partial search terms as the user types.  

## Workflow

The Bing Web Search API is easy to call from any programming language that can make HTTP requests and parse JSON responses. You can access the service using the [REST API](), or available [SDKs]().  

1. Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with access to the Bing Search APIs. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/en-us/try/cognitive-services/?api=bing-web-search-api).  
2. Send a [request to the Bing Web Search API](quick-start.md).
3. Parse the JSON response.

## Next steps

* Use a quickstart to make your first request to the Bing Web Search API.
* [Build a single-page web app](tutorial-bing-web-search-single-page-app.md).
* Review [Web Search API v7 reference](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference) documentation.  
* Learn more about [use and display requirements](UseAndDisplayRequirements.md) for Bing Web Search.  
