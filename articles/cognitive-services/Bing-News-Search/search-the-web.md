---
title: What is the Bing News Search API?
titleSuffix: Azure AI services
description: Learn how to use the Bing News Search API to search the web for current headlines across categories, including headlines and trending topics.
services: cognitive-services

manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-news-search
ms.topic: overview
ms.date: 12/18/2019

ms.custom: seodec2018
---
# What is the Bing News Search API?

[!INCLUDE [Bing move notice](../bing-web-search/includes/bing-move-notice.md)]

The Bing News Search API makes it easy to integrate Bing's cognitive news searching capabilities into your applications. The API provides a similar experience to [Bing News](https://www.bing.com/news), letting you send search queries and receive relevant news articles.

Be aware that the Bing News Search API provides news search results only. Use the [Bing Web Search API](../bing-web-search/overview.md), [Video Search API](../bing-video-search/overview.md) and [Image Search API](../bing-image-search/overview.md) for other types of web content.

## Bing News Search API features

While the Bing News Search API primarily finds and returns relevant news articles, it provides several features for intelligent, and focused news retrieval on the web.

|Feature  |Description  |
|---------|---------|
|[Suggesting and using search terms](concepts/search-for-news.md#suggest-and-use-search-terms)     | Improve your search experience by using the [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md) to display suggested search terms as they're typed.         |
|[Get general news](concepts/search-for-news.md#get-general-news)     | Find news by sending a search query to the Bing News Search API, and getting back a list of relevant news articles.           |
|[Today's top news](concepts/search-for-news.md#get-todays-top-news)      | Get the top news stories for the day, across all categories.       |
|[News by category](concepts/search-for-news.md)     | Search for news in specific categories.        | 
|[Headline news](concepts/search-for-news.md)     | Search for top headlines across all categories.         |

## Workflow

The Bing News Search API is a RESTful web service, making it easy to call from any programming language that can make HTTP requests and parse JSON. You can use the service using either the REST API, or the SDK.

1. Create an [Azure AI services API account](../cognitive-services-apis-create-account.md) with access to the Bing Search APIs. If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/free/cognitive-services/) for free.
2. Send a request to the API, with a valid search query.
3. Process the API response by parsing the returned JSON message.

## Next steps

First, try the [interactive demo](https://azure.microsoft.com/services/cognitive-services/bing-news-search-api/) for the Bing News Search API. This demo shows how you can quickly customize a search query and find news on the web.

To quickly get started with your first API request, try a quickstart for the [REST API](./csharp.md) or one of the [SDKs](./quickstarts/client-libraries.md?pivots=programming-language-csharp).

## See also

* The [Bing News Search API v7](/rest/api/cognitiveservices-bingsearch/bing-news-api-v7-reference) reference section contains definitions and information on the endpoints, headers, API responses, and query parameters that you can use to request image-based search results.
* The [Bing Use and Display Requirements](../bing-web-search/use-display-requirements.md) specify acceptable uses of the content and information gained through the Bing search APIs.
* Visit the [Bing Search API hub page](../bing-web-search/overview.md) to explore the other available APIs.
