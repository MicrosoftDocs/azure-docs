---
title: What is the Bing Video Search API?
titlesuffix: Azure Cognitive Services
description: Learn how to search for videos across the web, using the Bing Video Search API.
services: cognitive-services
author: swhite-msft
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-video-search
ms.topic: overview
ms.date: 01/07/2019
ms.author: scottwhi
---
# What is the Bing Video Search API?

The Bing Video Search API makes it easy to add video searching capabilities to your services and applications. By sending user search queries with the API, you can get and display relevant and high-quality images similar to [Bing Video](https://www.bing.com/video). Use this API for search results that only contain videos. The [Bing Web Search API](../bing-web-search/search-the-web.md) can return other types of web content, including webpages, news and images.

## Bing Video Search API features

| Feature                                                                                                                                                                                 | Description                                                                                                                                                            |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Suggest search terms in real-time](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/concepts/bing-image-search-sending-queries#using-and-suggesting-search-terms) | Improve your app experience by using the [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md) to display suggested search terms as they're typed. |
| [Filter and restrict video results](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/concepts/bing-image-search-get-images#filtering-images)                       | Filter the images that Bing returns by editing query parameters.                                                                                                       |
| [Crop, resize, and display thumbnails](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/resize-and-crop-thumbnails)                                                | Edit and display thumbnail previews for the images returned by Bing Image Search.                                                                                      |
| [Pivot & expand user search queries](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/concepts/bing-image-search-sending-queries#pivoting-the-query)               | Expand your search capabilities by including and displaying Bing-suggested search terms to queries.                                                                    |
| [Get trending videos](trending-videos.md) | Search for trending videos from around the world.                                                                                                          |
| [Get video insights](video-insights.md) | Customize a search for trending images from around the world.                                                                                                          |

## Workflow

The Bing Video Search API is a RESTful web service, making it easy to call from any programming language that can make HTTP requests and parse JSON. You can use the service using either the [REST API](csharp.md), or the [SDK](video-search-sdk-quickstart.md).

1. Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with access to the Bing Search APIs. If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) for free.
2. Send a request to the API, with a valid search query.
3. Process the API response by parsing the returned JSON message.


## Next steps

The Bing Image Search API [interactive demo](https://azure.microsoft.com/en-us/services/cognitive-services/bing-video-search-api/) shows how you can quickly customize a search query and search the web for videos.

When you are ready to call the API, create a [Cognitive services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account). If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) for free.

Use the [quickstart](csharp.md) to quickly get started with your first API request.

## See also

* The [Bing Video Search API v7](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference) reference page contains the list of endpoints, headers, and query parameters used to request search results.

* The [Bing Use and Display Requirements](./useanddisplayrequirements.md) specify acceptable uses of the content and information gained through the Bing search APIs.