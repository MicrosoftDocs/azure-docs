---
title: What is Bing Image Search? | Microsoft Docs
description: Learn how to use the Bing Images Search API to search the web for images.
services: cognitive-services
author: swhite-msft
manager: ehansen
ms.assetid: 1446AD8B-A685-4F5F-B4AA-74C8E9A40BE9
ms.service: cognitive-services
ms.component: bing-image-search
ms.topic: overview
ms.date: 10/11/2017
ms.author: scottwhi
#Customer intent: As a developer, I want to integrate Bing's image search capabilities into my app, so that I can provide relevant, engaging images to my users.
---

# What is Bing Image Search?

The Bing Image Search API enables you to use Bing's cognitive image service in your application. By sending user search queries with the API, you can get and display relevant and high-quality images results similar to [Bing Images](https://www.bing.com/images).

Be aware that the Bing Image Search API provides image-only search results. Use the [Bing Web Search API](../bing-web-search/search-the-web.md), [Video Search API](https://docs.microsoft.com/azure/cognitive-services/Bing-Video-Search) and [News Search API](https://review.docs.microsoft.com/en-us/azure/cognitive-services/bing-news-search) for other types of web content.



## Bing Image Search features

While Bing Image Search primarily finds and returns relevant images from a search query, the service also provides several additional features for intelligent, and focused image retrieval on the web.


| Feature                             | Description                                                                                                                                                            |
|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Suggest search terms in real-time   | Improve your app experience by using the [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md) to display suggested search terms as they're typed. |
| Filter and restrict image results   | Filter the images that Bing returns by editing query parameters.                                                                                                       |
| Displaying thumbnails               | Display thumbnail previews for the images returned by Bing Image Search.                                                                                               |
| Pivoting & expanding search queries | Expand your search capabilities by including and displaying Bing-suggested search terms to queries.                                                                    |
| Expanding the Query                 | Expand your search capabilities by including Bing-suggested search-terms in queries.                                                                                   |

## Next steps

To get started quickly with your first request, see [the C# quickstart](quickstarts/csharp.md).

Familiarize yourself with the [Bing Image Search API v7](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference) reference. The reference contains the list of endpoints, headers, and query parameters that you'd use to request search results. It also includes definitions of the response objects.

To improve your search box user experience, see [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md). As the user enters their query term, you can call this API to get relevant query terms that were used by others.

Be sure to read [Bing Use and Display Requirements](./useanddisplayrequirements.md) so you don't break any of the rules about using the search results.

When you call the Bing Image Search API, Bing returns a list of results. The list is a subset of the total number of results that are relevant to the query. The response's `totalEstimatedMatches` field contains an estimate of the number of images that are available to view. For details about how you'd page through the remaining images, see [Paging Images](./paging-images.md).
