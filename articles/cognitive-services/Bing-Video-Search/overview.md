---
title: What is the Bing Video Search API?
titleSuffix: Azure AI services
description: Learn how to search for videos across the web, using the Bing Video Search API.
services: cognitive-services

manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-video-search
ms.topic: overview
ms.date: 12/18/2019

---
# What is the Bing Video Search API?

[!INCLUDE [Bing move notice](../bing-web-search/includes/bing-move-notice.md)]

The Bing Video Search API makes it easy to add video searching capabilities to your services and applications. By sending user search queries with the API, you can get and display relevant and high-quality videos similar to [Bing Video](https://www.bing.com/video). Use this API for search results that only contain videos. The [Bing Web Search API](../bing-web-search/overview.md) can return other types of web content, including webpages, videos, news and images.

## Bing Video Search API features

| Feature                                                                                                                                                                                 | Description                                                                                                                                                            |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Suggest search terms in real-time](concepts/sending-requests.md#suggest-search-terms-with-the-bing-autosuggest-api) | Improve your app experience by using the [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md) to display suggested search terms as they're typed. |
| [Filter and restrict video results](concepts/get-videos.md#filtering-videos)                      | Filter the videos returned by editing query parameters.                                                                                                       |
| [Crop, resize, and display thumbnails](../bing-web-search/resize-and-crop-thumbnails.md)                                                | Edit and display thumbnail previews for the videos returned by Bing Video Search API.                                                                                      |
| [Get trending videos](trending-videos.md) | Search for trending videos from around the world.                                                                                                          |
| [Get video insights](video-insights.md) | Customize a search for trending videos from around the world.                                                                                                          |

## Workflow

The Bing Video Search API is a RESTful web service, making it easy to call from any programming language that can make HTTP requests and parse JSON. You can use the service using either the [REST API](./quickstarts/csharp.md), or the [SDK](./quickstarts/client-libraries.md?pivots=programming-language-csharp%253fpivots%253dprogramming-language-csharp).

1. Create an [Azure AI services API account](../cognitive-services-apis-create-account.md) with access to the Bing Search APIs. If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/free/cognitive-services/) for free.
2. Send a request to the API, with a valid search query.
3. Process the API response by parsing the returned JSON message.


## Next steps

The Bing Video Search API [interactive demo](https://azure.microsoft.com/services/cognitive-services/bing-video-search-api/) shows how you can customize a search query and search the web for videos.

Use the [quickstart](./quickstarts/csharp.md) to quickly get started with your first API request.

## See also

* The [Bing Video Search API v7](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference) reference page contains the list of endpoints, headers, and query parameters used to request search results.

* The [Bing Use and Display Requirements](../bing-web-search/use-display-requirements.md) specify acceptable uses of the content and information gained through the Bing search APIs.

* Visit the [Bing Search API hub page](../bing-web-search/overview.md) to explore the other available APIs.
