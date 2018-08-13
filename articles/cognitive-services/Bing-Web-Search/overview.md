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
ms.date: 10/11/2017
ms.author: scottwhi, erhopf
---

# What is Bing Web Search?

The Bing Web Search API is a RESTful services that enables an application to use Bing's web search capabilities. Requests can be configured to return results that include web pages, images, videos, news, entities, related search queries, spelling corrections, unit conversion, translations, and calculations. Results are based on relevance and subscriptions to Bing Search APIs.

This API should be used when an application needs access to all relevant content to a user's query. If you are building an application that requires only a specific type of content, use the [Bing Image Search API](../Bing-Image-Search/), [Bing Video Search API](../Bing-Video-Search/), or [Bing News Search API](../Bing-News-Search/). See [Cognitive Services APIs](../#cognitive-services-apis) for a complete list of Bing Search APIs.

Want to see how it works? Try our [Bing Web Search API demo](https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/).

## Bing Web Search features  

The Bing Web Search API ... << something about constructing a query to use specific features... >>

| Feature | Description |  
|---------|-------------|  
| Filter and restrict search results | ... |  

## Workflow

The Bing Web Search API is easy to call from any programming language that can make HTTP requests and parse JSON responses. You can access the service using the [REST API](), or the [SDK]().  

1. Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with access to the Bing Search APIs. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/en-us/try/cognitive-services/?api=bing-web-search-api).  
2. Send a request to the Bing Web Search API. Use the [Web Search API v7 reference](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference) to construct a query.
3. Parse the JSON response.

## Next steps

* Use a quickstart guide to make your first request to the Bing Web Search API.
* Follow the tutorial to [build a single-page web app](tutorial-bing-web-search-single-page-app.md).
* Review [Web Search API v7 reference](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference) documentation.  
* Learn more about [use and display requirements](UseAndDisplayRequirements.md) for Bing Web Search.  
