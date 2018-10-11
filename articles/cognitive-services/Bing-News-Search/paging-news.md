---
title: How to page through the available news articles - Bing News Search
titlesuffix: Azure Cognitive Services
description: Shows how to page through all of the news articles that Bing New Search can return.
services: cognitive-services
author: swhite-msft
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-news-search
ms.topic: conceptual
ms.date: 04/15/2017
ms.author: scottwhi
---

# Paging news

When you call the News Search API, Bing returns a list of results. The list is a subset of the total number of results that may be relevant to the query. To get the estimated total number of available results, access the answer object's [totalEstimatedMatches](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v7-reference#news-totalmatches) field.  
  
The following example shows the `totalEstimatedMatches` field that a News answer includes.  
  
```  
{  
    "_type" : "News",  
    "readLink" : "https:\/\/api.cognitive.microsoft.com\/bing\/v7\/news\/search?q=sailing+dinghies",  
    "totalEstimatedMatches" : 88400,  
    "value" : [...]  
}  
```  
  
To page through the available articles, use the [count](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v7-reference#count) and [offset](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v7-reference#offset) query parameters.  
  
The `count` parameter specifies the number of results to return in the response. The maximum number of results that you may request in the response is 100. The default is 10. The actual number delivered may be less than requested.

The `offset` parameter specifies the number of results to skip. The `offset` is zero-based and should be less than (`totalEstimatedMatches` - `count`).  

If you want to display 20 articles per page, you would set `count` to 20 and `offset` to 0 to get the first page of results. For each subsequent page, you would increment `offset` by 20 (for example, 20, 40).  
  
The following shows an example that requests 20 news articles beginning at offset 40.  
  
```  
GET https://api.cognitive.microsoft.com/bing/v7.0/news/search?q=sailing+dinghies&count=20&offset=40&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
Host: api.cognitive.microsoft.com  
```  
  
If the default `count` value works for your implementation, specify only the `offset` query parameter as shown in the following example:  
  
```  
GET https://api.cognitive.microsoft.com/bing/v7.0/news/search?q=sailing+dinghies&offset=40&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
Host: api.cognitive.microsoft.com  
```  
  
> [!NOTE]
> Paging applies only to news search (/news/search), and not to trending topics (/news/trendingtopics) or news categories (/news).