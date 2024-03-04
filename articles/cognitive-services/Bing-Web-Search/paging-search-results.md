---
title: How to page through search results - Bing Search APIs
titleSuffix: Azure AI services
description: Learn how to page through search results from the Bing Search APIs.
services: cognitive-services
author: aahill
manager: nitinme
ms.assetid: 26CA595B-0866-43E8-93A2-F2B5E09D1F3B
ms.service: cognitive-services
ms.subservice: bing-web-search
ms.topic: conceptual
ms.date: 10/31/2019
ms.author: aahi
---

# How to page through results from the Bing Search APIs

[!INCLUDE [Bing move notice](../bing-web-search/includes/bing-move-notice.md)]

When you send a call to the Bing Web, Custom, Image, News or Video Search APIs, Bing returns a subset of the total number of results that may be relevant to the query. To get the estimated total number of available results, access the answer object's `totalEstimatedMatches` field. 

For example: 

```json
{
    "_type" : "SearchResponse",
    "webPages" : {
        "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=3A43CA...",
        "totalEstimatedMatches" : 262000,
        "value" : [...]
    }
}  
```

## Paging through search results

To page through the available results, use the `count` and `offset` query parameters when sending your request.  

> [!NOTE]
>
> * Paging with the Bing Video, Image, and News APIs applies only to general video (`/video/search`), news (`/news/search`) and image (`/image/search`) searches. Paging through trending topics and categories is not supported.  
> * The `TotalEstimatedMatches` field is an estimate of the total number of search results for the current query. When you set the `count` and `offset` parameters, this estimate may change.

| Parameter | Description                                                                                                                                                                |
|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `count`   | Specifies the number of results to return in the response. Note that the default value of `count`, and the maximum number of results that you may request varies by API. You can find these values in the reference documentation under [Next steps](#next-steps). |
| `offset`  | Specifies the number of results to skip. The `offset` is zero-based and should be less than (`totalEstimatedMatches` - `count`).                                           |

As an example, if you want to display 15 results per page, you would set `count` to 15 and `offset` to 0 to get the first page of results. For each subsequent API call, you would increment `offset` by 15. The following example requests 15 webpages beginning at offset 45.

```  
GET https://api.cognitive.microsoft.com/bing/v7.0/search?q=sailing+dinghies&count=15&offset=45&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
Host: api.cognitive.microsoft.com  
```

If you use the default `count` value, you only need to specify the `offset` query parameter in your API calls.  

```  
GET https://api.cognitive.microsoft.com/bing/v7.0/search?q=sailing+dinghies&offset=45&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
Host: api.cognitive.microsoft.com  
```

When using the Bing Image and Video APIs, you can use the `nextOffset` value to avoid duplicate search results. Get the value from the `Images` or `Videos` response objects, and use it in your requests with the `offset` parameter.  

> [!NOTE]
> The Bing Web Search API returns search results that can include webpages, images, videos, and news. When you page through search results from the Bing Web Search API, you are paging only [WebPages](/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#webpage), and not other answer types such as images or news. Search results in `WebPage` objects may include results that appear in other answer types as well.
>
> If you use the `responseFilter` query parameter without specifying any filter values, don't use the `count` and `offset` parameters. 

## Next steps

* [What are the Bing Web Search APIs?](bing-api-comparison.md)
* [Bing Web Search API v7 reference](/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference)
* [Bing Custom Search API v7 reference](/rest/api/cognitiveservices-bingsearch/bing-custom-search-api-v7-reference)
* [Bing News Search API v7 reference](/rest/api/cognitiveservices-bingsearch/bing-news-api-v7-reference)
* [Bing Video Search API v7 reference](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference)
* [Bing Image Search API v7 reference](/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference)
