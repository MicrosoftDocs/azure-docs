---
title: What are the Bing Search APIs?
titleSuffix: Azure Cognitive Services
description: Use this article to learn about the Bing Search APIs, and how you can enable cognitive internet searches in your apps and services.  
services: cognitive-services
author: aahill
manager: cgronlun
ms.service: cognitive-services
ms.component: bing-web-search
ms.topic: overview
ms.date: 09/27/2018
ms.author: aahi
---

# What are the Bing Search APIs?

The Bing Search APIs enable you to quickly build web-connected apps and services that can find webpages, images, news, translations, and more without advertisements. Use this article to learn about the various Bing search APIs, and how you can integrate cognitive searches into your applications and services.  

By sending queries to the Bing search REST APIs or SDKs, you can get instant, relevant answers to user web searches in a variety of content types. These queries can be modified to narrow a search's scope, filter results and more, improving the search experience. Below are the search APIs available. Note that pricing and rate limits may vary between APIs.

## Bing Web Search and Custom Search

The [Bing Web Search API](../Bing-Web-Search/index.yml) can return search results containing webpages, in addition to the content formats listed below. The search queries sent to this API can be filtered to include or exclude certain content formats.

By creating a custom search instance with [Bing Custom Search](../Bing-Custom-Search/index.yml), you can create a search experience focused only on content and topics you care about. For example, after specifying the domains, websites, and specific webpages that Bing will search, your users will see results tailored to that specific content. 

Use these APIs in applications that may need to search for all types of relevant web content. If your application searches for a specific type of content, consider one of the search APIs below: 

## Content-specific Bing Search APIs

| Bing API | Description |
| -- | -- | 
| [Entity Search](../Bing-Entities-Search/index.yml) | The Bing Entity Search API  returns search results containing *entities* which can be people, places, or things. Depending on the search query sent to the API, it will return one or more entities that satisfy the search query, which can include noteworthy individuals, local businesses, landmarks, destinations, and more. |
| [Image Search](../Bing-Image-Search/index.yml) | The Bing Image Search API enables you search for, and find high-quality static and animated images similar to [Bing.com/images](www.Bing.com/images). You can refine searches to include or exclude images by attribute, including: size, color, license, and freshness. You can also search for trending images, upload images to gain insights about them, and display thumbnail previews. |
| [News Search](../Bing-News-Search/index.yml) | The Bing News Search API enables you find news stories similar to [Bing.com/news](www.Bing.com/news). Sending a search query to the API will return a general news search from either multiple sources or a specific domain, if specified. Additionally, you can search all news or by category to get trending articles, top stories, and headlines.
| [Video Search](../Bing-Video-Search/index.yml) | The Bing Video Search API enables you to find videos across the web, similar to [Bing.com/videos](www.Bing.com/videos). |
| [Visual Search](..Bing-visual-saerch/index.yml) | TBD |

## Additional Bing Search APIs

| API | Description |
| -- | -- | 
| [Bing Autosuggest](../Bing-Autosuggest/index.yml) | TBD |
| [Bing Analytics](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-news-search/bing-news-stats) | TBD |

## Next steps

## See also