---
title: What is Bing Image Search? | Microsoft Docs
description: Learn how to use the Bing Images Search API to search the web for images.
services: cognitive-services
author: aahill
manager: cgronlun
ms.assetid: 1446AD8B-A685-4F5F-B4AA-74C8E9A40BE9
ms.service: cognitive-services
ms.component: bing-image-search
ms.topic: overview
ms.date: 10/11/2017
ms.author: aahi
#Customer intent: As a developer, I want to integrate Bing's image search capabilities into my app, so that I can provide relevant, engaging images to my users.
---

# What is Bing Image Search?

The Bing Image Search API enables you to use Bing's cognitive image search capabilities in your application. By sending user search queries with the API, you can get and display relevant and high-quality images similar to [Bing Images](https://www.bing.com/images).

Be aware that the Bing Image Search API provides image-only search results. Use the [Bing Web Search API](../bing-web-search/search-the-web.md), [Video Search API](https://docs.microsoft.com/azure/cognitive-services/Bing-Video-Search) and [News Search API](https://review.docs.microsoft.com/en-us/azure/cognitive-services/bing-news-search) for other types of web content.

## Bing Image Search features

While Bing Image Search primarily finds and returns relevant images from a search query, the service also provides several additional features for intelligent, and focused image retrieval on the web.


| Feature                             | Description                                                                                                                                                            |
|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Suggest search terms in real-time   | Improve your app experience by using the [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md) to display suggested search terms as they're typed. |
| Filter and restrict image results   | Filter the images that Bing returns by editing query parameters.                                                                                                       |
| Crop, resize, and display thumbnails | Display thumbnail previews for the images returned by Bing Image Search.                                                                                               |
| Pivot & expand user search queries | Expand your search capabilities by including and displaying Bing-suggested search terms to queries.                                                                    |
| Get trending images                | Expand your search capabilities by including Bing-suggested search-terms in queries.                                                                                   |

## Workflow

TBD

## Next steps

First, try the Bing Image Search API [interactive demo](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/).
This demo shows how you can quickly customize a search query and scour the web for images.

When you are ready to call the API, create a [Cognitive services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account). If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) for free.

To quickly get started with your first API request, you can learn to:

* [Send search queries to Bing](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/quickstarts/csharp) using the REST API, or
* [Request and filter](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/image-search-sdk-quickstart) the images Bing returns using the SDK.

## See also

The [Bing Image Search API v7](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference) reference section contains definitions and information on the endpoints, headers, API responses, and query parameters that you can use to request image-based search results.

The [Bing Use and Display Requirements](./useanddisplayrequirements.md) topic specifies acceptable uses of the content and information gained through the Bing search APIs.
