---
title: What is the Bing Web Search API?
titleSuffix: Azure Cognitive Services
description: The Bing Web Search API is a RESTful service that provides instant answers to web search queries. Configure results to include web pages, images, videos, news, and more. Results are provided as JSON and based on search relevance and your Bing Web Search subscriptions.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-web-search
ms.topic: overview
ms.date: 03/31/2020
ms.author: aahi
ms.custom: seodec2018
---

# What is the Bing Web Search API?

The Bing Web Search API is a RESTful service that provides instant answers to user queries. Search results are easily configured to include web pages, images, videos, news, translations, and more. Bing Web Search provides the results as JSON based on search relevance and your Bing Web Search subscriptions.

This API is optimal for applications that need access to all content that is relevant to a user's search query. If you're building an application that requires only a specific type of result, consider using the [Bing Image Search API](../Bing-Image-Search/overview.md), [Bing Video Search API](../Bing-Video-Search/search-the-web.md), or [Bing News Search API](../Bing-News-Search/search-the-web.md). See [Cognitive Services APIs](https://docs.microsoft.com/azure/cognitive-services) for a complete list of Bing Search APIs.

Want to see how it works? Try our [Bing Web Search API demo](https://azure.microsoft.com/services/cognitive-services/bing-web-search-api/).

## Features  

Bing Web Search doesn't only give you access to instant answers. It also provides additional features and functionality that allow you to customize search results for your users.

| Feature | Description |
|---------|-------------|
| [Suggest search terms in real time](../bing-autosuggest/get-suggested-search-terms.md) | Improve your application experience by using the Bing Autosuggest API to display suggested search terms as they're typed. |
| [Filter and restrict results by content type](filter-answers.md) | Customize and refine search results with filters and query parameters for web pages, images, videos, safe search, and more. |
| [Hit highlighting for unicode characters](hit-highlighting.md) | Identify and remove unwanted unicode characters from search results before displaying them to users with  hit highlighting. |
| [Localize search results by country, region, and/or market](supported-countries-markets.md) | Bing Web Search supports more than three dozen countries or regions. Use this feature to refine search results for a specific country/region or market. |
| [Analyze search metrics with Bing Statistics](bing-web-stats.md) | Bing Statistics is a paid subscription that provides analytics on call volume, top query strings, geographic distribution, and more. |

## Workflow

The Bing Web Search API is easy to call from any programming language that can make HTTP requests and parse JSON responses. The service is accessible using the [REST API](quickstarts/python.md) or the [Bing Web Search client libraries](./quickstarts/client-libraries.md).

1. [Create an Azure resource](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) for the Bing Search APIs. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/cognitive-services/).  
2. Send a [request to the Bing Web Search API](quickstarts/python.md).
3. Parse the JSON response.

## Next steps

* Use our [Python quickstart](./quickstarts/client-libraries.md?pivots=programming-language-python) to make your first call to the Bing Web Search API.  
* [Build a single-page web app](tutorial-bing-web-search-single-page-app.md).
* Review [Web Search API v7 reference](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference) documentation.  
* Learn more about [use and display requirements](UseAndDisplayRequirements.md) for Bing Web Search.  
