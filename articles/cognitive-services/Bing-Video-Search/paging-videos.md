---
title: How to page through the available videos - Bing Video Search
titlesuffix: Azure Cognitive Services
description: Learn how to page through all of the videos returned by the Bing Video Search API.
services: cognitive-services
author: swhite-msft
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-video-search
ms.topic: conceptual
ms.date: 01/31/2019
ms.author: scottwhi
---

# Paging through video search results

The Bing Video Search API returns a subset of all search results it found for your query. By paging through these results with subsequent calls to the API, you can get and display them in your application.

> [!NOTE]
> Paging applies only to videos search (/videos/search), and not to video insights (/videos/details) or trending videos (/videos/trending).

## Total estimated matches

To get the estimated number of found search results, use the [totalEstimatedMatches](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#videos-totalestimatedmatches) field in the JSON response.   
  
```json  
{
    "_type" : "Videos",
    "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=81EF7545D56...",
    "totalEstimatedMatches" : 1000,
    "value" : [...]
}  
```  
  
## Paging through videos

To page through the available videos, use the [count](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#count) and [offset](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#offset) query parameters when sending your request.  
  

|Parameter  |Description  |
|---------|---------|
|`count`     | Specifies the number of results to return in the response. The maximum number of results that you may request in the response is 100. The default is 10. The actual number delivered may be less than requested.        |
|`offset`     | Specifies the number of results to skip. The `offset` is zero-based and should be less than (`totalEstimatedMatches` - `count`).          |

For example, if you want to display 20 articles per page, you would set `count` to 20 and `offset` to 0 to get the first page of results. For each subsequent page, you would increment `offset` by 20 (for example, 20, 40).  
  
The following example requests 20 videos, beginning at offset 40.  
  
```cURL  
GET https://api.cognitive.microsoft.com/bing/v7.0/videos/search?q=sailing+dinghies&count=20&offset=40&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
Host: api.cognitive.microsoft.com  
```  

If you use the default value for the [count](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#count), you only need to specify the `offset` query parameter, as in the following example.  
  
```cURL  
GET https://api.cognitive.microsoft.com/bing/v7.0/videos/search?q=sailing+dinghies&offset=40&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
Host: api.cognitive.microsoft.com  
```  

If you page through 35 videos at a time, you would set the `offset` query parameter to 0 on your first request, and then increment `offset` by 35 on each subsequent request. However, some results in the next response may contain duplicate video results from the previous response. For example, the first two videos in a response may be the same as the last two videos from the previous response.

To eliminate duplicate results, use the [nextOffset](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#videos-nextoffset) field of the `Videos` object.

For example, if you want to page 30 videos at a time, you can set `count` to 30 and `offset` to 0 in your first request. In your next request, you would set the `offset` query parameter to the `nextOffset` value.

> [!NOTE]
> The `TotalEstimatedAnswers` field is an estimate of the total number of search results you can retrieve for the current query.  When you set `count` and `offset` parameters, the `TotalEstimatedAnswers` number may change. 
  
## Next steps

> [!div class="nextstepaction"]
> [Get video insights](video-insights.md)
