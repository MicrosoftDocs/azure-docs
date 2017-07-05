---
title: How to page through the available webpages | Microsoft Docs
description: Shows how to page through all of the webpages that Bing can return.
services: cognitive-services
author: swhite-msft
manager: ehansen

ms.assetid: 26CA595B-0866-43E8-93A2-F2B5E09D1F3B
ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 04/15/2017
ms.author: scottwhi
---

# Paging webpages 

When you call the Web Search API, Bing returns a list of results. The list is a subset of the total number of results that may be relevant to the query. To get the estimated total number of available results, access the answer object's [totalEstimatedMatches](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#totalestimatedmatches) field.  
  
The following example shows the `totalEstimatedMatches` field that a Web answer includes.  
  
```  
{
    "_type" : "SearchResponse",
    "webPages" : {
        "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=3A43CA...",
        "totalEstimatedMatches" : 262000,
        "value" : [...]
    }
}  
```  
  
To page through the available webpages, use the [count](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#count) and [offset](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#offset) query parameters.  
  
The `count` parameter specifies the number of results to return in the response. The maximum number of results that you may request in the response is 50. The default is 10. The actual number delivered may be less than requested.

The `offset` parameter specifies the number of results to skip. The `offset` is zero-based and should be less than (`totalEstimatedMatches` - `count`).  
  
If you want to display 15 webpages per page, you would set `count` to 15 and `offset` to 0 to get the first page of results. For each subsequent page, you would increment `offset` by 15 (for example, 15, 30).  
  
The following shows an example that requests 15 webpages beginning at offset 45.  
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/search?q=sailing+dinghies&count=15&offset=45&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
Host: api.cognitive.microsoft.com  
```  

> [!NOTE]
> V7 Preview request:

> ```  
> GET https://api.cognitive.microsoft.com/bing/v7.0/search?q=sailing+dinghies&count=15&offset=45&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> Host: api.cognitive.microsoft.com  
>

If the default `count` value works for your implementation, you only need to specify the `offset` query parameter.  
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/search?q=sailing+dinghies&offset=45&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
Host: api.cognitive.microsoft.com  
```  

> [!NOTE]
> V7 Preview request:

> ```  
> GET https://api.cognitive.microsoft.com/bing/v7.0/search?q=sailing+dinghies&offset=45&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> Host: api.cognitive.microsoft.com  
>
  
The Web Search API returns results that include webpages and may include images, videos, and news. When you page the search results, you are paging the [WebAnswer](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#webanswer) answer and not the other answers such as images or news. For example, if you set `count` to 50, you get back 50 webpage results, but the response may include results for the other answers as well. For example, the response may include 15 images and 4 news articles. It is also possible that the results may include news on the first page but not the second page, or vice versa.   
    
If you specify the `responseFilter` query parameter and do not include Webpages in the filter list, don't use the `count` and `offset` parameters.  
