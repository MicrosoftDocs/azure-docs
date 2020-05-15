---
title: What are the Bing Search APIs?
titleSuffix: Azure Cognitive Services
description: Use this article to learn about the Bing Search APIs, and how you can enable cognitive internet searches in your apps and services.  
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-web-search
ms.topic: conceptual
ms.date: 03/12/2019
ms.author: aahi
---

# What are the Bing Search APIs?

The Bing Search APIs let you build web-connected apps and services that find webpages, images, news, locations, and more without advertisements. By sending search requests using the Bing Search REST APIs or SDKs, you can get relevant information and content for web searches. Use this article to learn about the different Bing search APIs and how you can integrate cognitive searches into your applications and services. Pricing and rate limits may vary between APIs.

## The Bing Web Search API

The [Bing Web Search API](../Bing-Web-Search/overview.md) returns webpages, images, video, news, and more. You can filter the search queries sent to this API to include or exclude certain content types.

Consider using the Bing Web Search API in applications that may need to search for all types of relevant web content. If your application searches for a specific type of online content, consider one of the search APIs below:

## Content-specific Bing search APIs

The following Bing search APIs return specific content from the web like images, news, local businesses, and videos.

| Bing API | Description |
| -- | -- |
| [Entity Search](../Bing-Entities-Search/overview.md) | The Bing Entity Search API returns search results containing entities, which can be people, places, or things. Depending on the query, the API will return one or more entities that satisfy the search query. The search query can include noteworthy individuals, local businesses, landmarks, destinations, and more. |
| [Image Search](../Bing-Image-Search/overview.md) | The Bing Image Search API lets you search for and find high-quality static and animated images similar to [Bing.com/images](https://www.Bing.com/images). You can refine searches to include or exclude images by attribute, including size, color, license, and freshness. You can also search for trending images, upload images to gain insights about them, and display thumbnail previews. |
| [News Search](../Bing-News-Search/search-the-web.md) | The Bing News Search API lets you find news stories similar to [Bing.com/news](https://www.Bing.com/news). The API returns news articles from either multiple sources or specific domains. You can search across categories to get trending articles, top stories, and headlines. |
| [Video Search](../Bing-Video-Search/overview.md) | The Bing Video Search API lets you find videos across the web. Get trending videos, related content, and thumbnail previews. |
| [Visual Search](../Bing-visual-search/overview.md) | Upload an image or use a URL to get insightful information about it, like visually similar products, images, and related searches. |
 [Local Business Search](../bing-local-business-search/overview.md) | The Bing Local Business Search API lets your applications find contact and location information about local businesses based on search queries. |

## The Bing Custom Search API

Creating a custom search instance with the [Bing Custom Search](../Bing-Custom-Search/overview.md) API lets you create a search experience focused only on content and topics you care about. For example, after you specify the domains, websites, and specific webpages that Bing will search, Bing Custom Search will tailor the results to that specific content. You can incorporate the Bing Custom Autosuggest, Image, and Video Search APIs to further customize your search experience.

## Additional Bing Search APIs

The following Bing Search APIs let you improve your search experience by combining them with other Bing search APIs.

| API | Description |
| -- | -- |
| [Bing Autosuggest](../Bing-Autosuggest/get-suggested-search-terms.md) | Improve your application's search experience with the Bing Autosuggest API by returning suggested searches in real time.  |
| [Bing Statistics](bing-web-stats.md) | Bing Statistics provides analytics for the Bing Search APIs your application uses. Some of the available analytics include call volume, top query strings, and geographic distribution. |

## Next steps

* Bing Search API [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/search-api/)
* The [Bing Use and Display Requirements](./use-display-requirements.md) specify acceptable uses of the content and information gained through the Bing search APIs.
