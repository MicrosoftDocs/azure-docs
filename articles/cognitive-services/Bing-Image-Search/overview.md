---
title: What is the Bing Image Search API?
titleSuffix: Azure Cognitive Services
description: The Bing Image Search API enables you to use Bing's cognitive image search capabilities in your application. By sending user search queries with the API, you can get and display relevant and high-quality images similar to Bing Images.
services: cognitive-services
author: aahill
manager: nitinme
ms.assetid: 1446AD8B-A685-4F5F-B4AA-74C8E9A40BE9
ms.service: cognitive-services
ms.subservice: bing-image-search
ms.topic: overview
ms.date: 02/06/2019
ms.author: aahi
#Customer intent: As a developer, I want to integrate Bing's image search capabilities into my app, so that I can provide relevant, engaging images to my users.
ms.custom: seodec2018
---

# What is the Bing Image Search API?

The Bing Image Search API enables you to use Bing's image search capabilities in your application. By sending search queries to the API, you can get high-quality images similar to [bing.com/images](https://www.bing.com/images).

While the Bing Image Search API provides image-only search results, you can combine or use the other available [Bing Search APIs](../bing-web-search/bing-api-comparison.md) to find many types of content on the web.

## Bing Image Search features

| Feature                                                                                                                                                                                 | Description                                                                                                                                                            |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Suggest search terms in real-time](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/concepts/bing-image-search-sending-queries) | Improve your app experience by using the [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md) to display suggested search terms as they're typed. |
| [Filter and restrict image results](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/concepts/bing-image-search-get-images)                       | Filter the images that Bing returns by editing query parameters.                                                                                                       |
| [Crop, resize, and display thumbnails](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/resize-and-crop-thumbnails)                                                | Edit and display thumbnail previews for the images returned by Bing Image Search.                                                                                      |
| [Pivot & expand user search queries](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/concepts/bing-image-search-sending-queries)               | Expand your search capabilities by including and displaying Bing-suggested search terms to queries.                                                                    |
| [Get trending images](https://review.docs.microsoft.com/azure/cognitive-services/bing-image-search/trending-images)                                                                     | Customize a search for trending images from around the world.                                                                                                          |

## Workflow

The Bing Image Search API is a RESTful web service, making it easy to call from any programming language that can make HTTP requests and parse JSON. You can use the service using either the [REST API](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/quickstarts/csharp?), or the [SDK](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/image-search-sdk-quickstart).

1. Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with access to the Bing Search APIs. If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) for free.
2. Send a request to the API, with a valid [search query](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/concepts/bing-image-search-sending-queries).
3. Process the API response by parsing the returned JSON message.

## Next steps

First, try the Bing Image Search API [interactive demo](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/).
This demo shows how you can quickly customize a search query and scour the web for images.

When you're ready to call the API, create a [Cognitive services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account). If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) for free.

To quickly get started with your first API request, you can learn to:

* [Send search queries to Bing](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/quickstarts/csharp) using the REST API, or
* [Request and filter](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/image-search-sdk-quickstart) the images Bing returns using the SDK.

## See also

* [Pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/search-api/) for the Bing Search APIs. 

* The [Bing Image Search API v7](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference) reference section contains information on the API's endpoints, headers, API responses, and query parameters.

* The [Bing Use and Display Requirements](./useanddisplayrequirements.md) specify acceptable uses of the content and information gained through the Bing search APIs.

* The [Getting images from the web with the Bing Image Search API](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/concepts/bing-image-search-get-images) article describes how to search and get images from the web.

* The [Sending and working with search queries](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/concepts/bing-image-search-sending-queries) article describes how to make, customize, and pivot search queries.
