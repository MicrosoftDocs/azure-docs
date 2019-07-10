---
title: Page through available webpages - Bing Custom Search
titlesuffix: Azure Cognitive Services
description: Shows how to page through all of the webpages that Bing Custom Search can return.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-custom-search
ms.topic: conceptual
ms.date: 02/12/2019
ms.author: maheshb
---

# Paging webpages 

When you call the Custom Search API, Bing returns a list of results. The list is a subset of the total number of results that may be relevant to the query. To get the estimated total number of available results, access the answer object's [totalEstimatedMatches](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-custom-search-api-v7-reference#totalestimatedmatches) field.  
  
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
  
To page through the available webpages, use the [count](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-custom-search-api-v7-reference#count) and [offset](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-custom-search-api-v7-reference#offset) query parameters.  
  
The `count` parameter specifies the number of results to return in the response. The maximum number of results that you may request in the response is 50. The default is 10. The actual number delivered may be less than requested.

The `offset` parameter specifies the number of results to skip. The `offset` is zero-based and should be less than (`totalEstimatedMatches` - `count`).  
  
If you want to display 15 webpages per page, you would set `count` to 15 and `offset` to 0 to get the first page of results. For each subsequent page, you would increment `offset` by 15 (for example, 15, 30).  
  
The following shows an example that requests 15 webpages beginning at offset 45.  
  
```  
GET https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?q=sailing+dinghies&count=15&offset=45&mkt=en-us&customConfig=123456 HTTP/1.1  
Ocp-Apim-Subscription-Key: <subscription ID>
Host: api.cognitive.microsoft.com  
```  

If the default `count` value works for your implementation, you only need to specify the `offset` query parameter.  
  
```  
GET https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?q=sailing+dinghies&offset=45&mkt=en-us&customConfig=123456 HTTP/1.1  
Ocp-Apim-Subscription-Key: <subscription ID>  
Host: api.cognitive.microsoft.com  
```  

> [!NOTE]
> The `TotalEstimatedAnswers` field is an estimate of the total number of search results you can retrieve for the current query.  When you set `count` and `offset` parameters, the `TotalEstimatedAnswers` number may change. 

