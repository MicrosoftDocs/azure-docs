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
ms.author: scottwhi
---

# What is Bing Web Search?

The Bing Web Search API enables an application to use Bing's web search capabilities. Requests can be configured to return results that include web pages, images, videos, news, entities, related search queries, spelling corrections, unit conversion, translations, and calculations. Results are based on relevance and subscriptions to Bing Search APIs.

This API should be used when an application needs access to all relevant content to a user's query. If you are building an application that requires only a specific type of content use the [Bing Image Search API](../Bing-Image-Search/), [Bing Video Search API](../Bing-Video-Search/), or [Bing News Search API](../Bing-News-Search/). See [Cognitive Services APIs](../#cognitive-services-apis) for a complete list of Bing Search APIs.

## Features  

The Bing Web Search API ... << something about constructing a query to use specific features... >>

| Feature | Description |  
|---------|-------------|  
| Web pages | Returns a list of relevant web pages based on the user's query. Each object in the list includes page name, URL, display URL, a short description, and the date the content was found. |
| Related searches | |
| Images | Returns a list of relevant images based on the user's query. Each object in the list includes URL, size, dimensions, and format. A thumbnail URL and dimensions are also provided. |
| Videos | Returns a list of relevant videos based on the user's query. Each object in the list includes the URL, duration, dimensions, and encoding format. A thumbnail URL and dimensions are also provided. |
| News | Returns a list of relevant articles based on the user's query. Each object in the list includes the article name, description, and URL. If the article contains an image, the object will include a thumbnail URL. |
| Time zone | Returns location, time, and UTC offset for implicit and explicit time queries. |
| Computation | Returns the answer to a mathematical expression or unit conversion query made by the user. Each object includes the expression and value. |
| Query suggestions | Returns a list of related queries made by other users based on the user's query. Each object in the list includes text, display text, and a URL to Bing search results for the suggested query. |  
| Spelling suggestions | Returns a list of spelling suggestions if Bing determines that the user may be looking for something else based on the query. |


## Workflow

The Bing Web Search API is a RESTful service that is easy to call from any programming language that can make HTTP requests and parse JSON responses. You can access the service using the [REST API](), or the [SDK]().

1. Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with access to the Bing Search APIs. If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/en-us/try/cognitive-services/?api=bing-web-search-api) for free.
2. Send a request to the API, with a valid [search query](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/concepts/bing-image-search-sending-queries).
3. Process the API response by parsing the returned JSON message.

## Next steps

To get started quickly with your first request, see [the C# quickstart](quickstarts/csharp.md).

Familiarize yourself with the [Bing Web Search API v7](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference) reference. The reference contains the list of endpoints, headers, and query parameters that you'd use to request search results. It also includes definitions of the response objects.

Bing requires you to display the results in the order given. To learn how to use the ranking response to display the results, see [Ranking Results](./rank-results.md).

Bing returns only a subset of the possible results in each response. If you want to receive more than just the first page of results, see [Paging Webpages](./paging-webpages.md).

To improve your search box user experience, see [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md). As the user enters their query term, you can call this API to get relevant query terms that were used by others.

Be sure to read [Bing Use and Display Requirements](./useanddisplayrequirements.md) so you don't break any of the rules about using the search results.
