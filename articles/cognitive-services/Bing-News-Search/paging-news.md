---
title: How to page through Bing News Search results
titlesuffix: Azure Cognitive Services
description: Learn how to page through the news articles that the Bing News Search API returns.
services: cognitive-services
author: swhite-msft
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-news-search
ms.topic: conceptual
ms.date: 01/10/2019
ms.author: scottwhi
---

# How to page through news search results

When you call the News Search API, Bing returns a list of results that are relevant to your query. To get the estimated total number of available results, access the answer object's [totalEstimatedMatches](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-news-api-v7-reference#news-totalmatches) field.  
  
The following example shows the `totalEstimatedMatches` field that a News answer includes.  

```json
{  
    "_type" : "News",  
    "readLink" : "https:\/\/api.cognitive.microsoft.com\/bing\/v7\/news\/search?q=sailing+dinghies",  
    "totalEstimatedMatches" : 88400,  
    "value" : [...]  
}  
```  
  
To page through the available articles, use the [count](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-news-api-v7-reference#count) and [offset](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-news-api-v7-reference#offset) query parameters.  
 

|Parameter  |Description  |
|---------|---------|
|`count`     | Specifies the number of results to return in the response. The maximum number of results that you may request in the response is 100. The default is 10. The actual number delivered may be less than requested.        |
|`offset`     | Specifies the number of results to skip. The `offset` is zero-based and should be less than (`totalEstimatedMatches` - `count`).          |

For example, if you want to display 20 articles per page, you would set `count` to 20 and `offset` to 0 to get the first page of results. For each subsequent page, you would increment `offset` by 20 (for example, 20, 40).  
  
The following example requests 20 news articles beginning at offset 40.  

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

> [!NOTE]
> The `TotalEstimatedAnswers` field is an estimate of the total number of search results you can retrieve for the current query.  When you set `count` and `offset` parameters, the `TotalEstimatedAnswers` number may change. 
