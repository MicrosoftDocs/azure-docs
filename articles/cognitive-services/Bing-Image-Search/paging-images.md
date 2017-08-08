---
title: How to page through the available images | Microsoft Docs
description: Shows how to page through all of the images that Bing can return.
services: cognitive-services
author: swhite-msft
manager: ehansen

ms.assetid: 3C8423F8-41E0-4F89-86B6-697E840610A7
ms.service: cognitive-services
ms.technology: bing-image-search
ms.topic: article
ms.date: 04/15/2017
ms.author: scottwhi
---

# Paging results

When you call the Image Search API, Bing returns a list of results. The list is a subset of the total number of results that are relevant to the query. To get the estimated total number of available results, access the answer object's [totalEstimatedMatches](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#totalestimatedmatches) field.  
  
The following example shows the `totalEstimatedMatches` field that an Images answer includes.  
  
```  
{
    "_type" : "Images",
    "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=73118C8...",
    "totalEstimatedMatches" : 838,
    "value" : [...]  
}  
```  
  
To page through the available images, use the [count](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#count) and [offset](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#offset) query parameters.  
  
The `count` parameter specifies the number of results to return in the response. The maximum number of results that you may request in the response is 150. The default is 35. The actual number delivered may be less than requested.

The `offset` parameter specifies the number of results to skip. The `offset` is zero-based and should be less than (`totalEstimatedMatches` - `count`).  
  
If you want to display 20 images per page, you would set `count` to 20 and `offset` to 0 to get the first page of results. For each subsequent page, you would increment `offset` by 20 (for example, 20, 40).  

The following shows an example that requests 20 images beginning at offset 40.  
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=sailing+dinghies&count=20&offset=40&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
Host: api.cognitive.microsoft.com  
```  

> [!NOTE]
> V7 Preview request:

> ```  
> GET https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=sailing+dinghies&count=20&offset=40&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> Host: api.cognitive.microsoft.com  
> ```  

If the default `count` value works for your implementation, you only need to specify the `offset` query parameter.  
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=sailing+dinghies&offset=40&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
Host: api.cognitive.microsoft.com  
```  

> [!NOTE]
> V7 Preview request:

> ```  
> GET https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=sailing+dinghies&offset=40&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> Host: api.cognitive.microsoft.com  
> ```  
  
Typically, if you page 35 images at a time, you would set the `offset` query parameter to 0 on your first request, and then increment `offset` by 35 on each subsequent request. However, some of the results in the subsequent response may be duplicates of the previous response. For example, the first two images in the response may be the same as the last two images from the previous response.

To eliminate duplicate results, use the [nextOffsetAddCount](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#nextoffsetaddcount) field of the `Images` object. The `nextOffsetAddCount` field tells you the number to add to your next `offset`.

For example, if you want to page 30 images at a time, you'd set `count` to 30 and `offset` to 0 in your first request. In your next request, you'd set 'count' to 30 and `offset` to 30 plus the value of `nextOffsetAddCount`. The value of `nextOffsetAddCount` is zero (0) if there are no duplicates or it may be 2 if there are two duplicates.

> [!NOTE]
> V7 Preview changes to paging:
>
> Renamed the `nextOffsetAddCount` field of [Images](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#images) to `nextOffset`. In v7, you set the `offset` query parameter to the `nextOffset` value.

> [!NOTE]
> Paging applies only to image search (/images/search), and not to image insights or trending images (/images/trending).