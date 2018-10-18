---
title: How to page through the available images - Bing Image Search API
titleSuffix: Azure Cognitive Services
description: Learn how to page through all of the images that Bing can return.
services: cognitive-services
author: swhite-msft
manager: cgonlun
ms.assetid: 3C8423F8-41E0-4F89-86B6-697E840610A7
ms.service: cognitive-services
ms.component: bing-image-search
ms.topic: conceptual
ms.date: 04/15/2017
ms.author: scottwhi
---

# Paging results

When you call the Image Search API, Bing returns a list of results. The list is a subset of the total number of results that are relevant to the query. To get the estimated total number of available results, access the answer object's [totalEstimatedMatches](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#totalestimatedmatches) field.  

The following example shows the `totalEstimatedMatches` field that an Images answer includes.  

```json
{
    "_type" : "Images",
    "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=73118C8...",
    "totalEstimatedMatches" : 838,
    "value" : [...]  
}  
```  

To page through the available images, use the [count](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#count) and [offset](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#offset) query parameters.  

The `count` parameter specifies the number of results to return in the response. The maximum number of results that you may request in the response is 150. The default is 35. The actual number delivered may be less than requested.

The `offset` parameter specifies the number of results to skip. The `offset` is zero-based and should be less than (`totalEstimatedMatches` - `count`).  

If you want to display 20 images per page, you would set `count` to 20 and `offset` to 0 to get the first page of results. The following shows an example that requests 20 images beginning at offset 40.  

```  
GET https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=sailing+dinghies&count=20&offset=40&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
Host: api.cognitive.microsoft.com  
```  

If the default `count` value works for your implementation, you only need to specify the `offset` query parameter.  

```  
GET https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=sailing+dinghies&offset=40&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
Host: api.cognitive.microsoft.com  
```  

You might expect that if you page 35 images at a time, you would set the `offset` query parameter to 0 on your first request, and then increment `offset` by 35 on each subsequent request. However, some of the results in the subsequent response may be duplicates of the previous response. For example, the first two images in the response may be the same as the last two images from the previous response.

To eliminate duplicate results, use the [nextOffset](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#nextoffset) field of the `Images` object. The `nextOffset` field tells you the `offset` to use for your next request. For example, if you want to page 30 images at a time, you'd set `count` to 30 and `offset` to 0 in your first request. In your next request, you'd set `count` to 30 and `offset` to the value of the previous response's `nextOffset`. To page backward, we suggest maintaining a stack of the previous offsets and popping the most recent.

> [!NOTE]
> Paging applies only to image search (/images/search), and not to image insights or trending images (/images/trending).
