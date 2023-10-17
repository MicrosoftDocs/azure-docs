---
title: Search the web for trending videos using the Bing Video Search API
titleSuffix: Azure AI services
description: Learn how to use the Bing Video Search API to search the web for trending videos.
services: cognitive-services

manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-video-search
ms.topic: conceptual
ms.date: 01/31/2019

---

# Get trending videos with the Bing Video Search API 

[!INCLUDE [Bing move notice](../bing-web-search/includes/bing-move-notice.md)]

The Bing Video Search API enables you to find today's trending videos from across the web, and in different categories. 

## GET request

To get today's trending videos from the Bing Video Search API, send the following GET request:  
  
```cURL
GET https://api.cognitive.microsoft.com/bing/v7.0/videos/trending?mkt=en-us HTTP/1.1
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-MSEdge-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357;long:-122.3295;re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```

## Market support

The following markets support trending videos.  
 
-   en-AU (English, Australia)  
-   en-CA (English, Canada)  
-   en-GB (English, Great Britain)  
-   en-ID (English, Indonesia)  
-   en-IE (English, Ireland)  
-   en-IN (English, India)  
-   en-NZ (English, New Zealand)  
-   en-PH (English, Philippines)  
-   en-SG (English, Singapore)  
-   en-US (English, United States)  
-   en-WW (English, Worldwide aggregate code)  
-   en-ZA (English, South Africa)  
-   zh-CN (Chinese, China)

## Example JSON response  

The following example shows an API response that contains trending videos, which are listed by category and subcategory. The response also contains banner videos, which are the most popular trending videos, and can come from one or more categories.  

```json
{  
    "_type" : "TrendingVideos",  
    "bannerTiles" : [
        {  
            "query" : {  
                "text" : "Hello - Smith",  
                "displayText" : "Hello - Smith",  
                "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=3E8F5..."
            },  
            "image" : {  
                "description" : "Image from: contosowallpapers.com",  
                "thumbnailUrl" : "https:\/\/tse4.mm.bing.net\/th?id=RsA%2fdPlTmx4zS...",  
                "headLine" : "\"Hello\" is a song by...",  
                "contentUrl" : "http:\/\/www.contosowallpapers.com\/wp-content..."  
            }  
        },  
        . . .  
    ],  
    "categories" : [
        {  
            "title" : "Music videos",  
            "subcategories" : [
                {  
                    "tiles" : [
                        {  
                            "query" : {  
                                "text" : "Song Title - Artist Name",  
                                "displayText" : "Song Title - Artist Name",  
                                "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=3E8F5..."
                            },  
                            "image" : {  
                                "description" : "Image from: contoso.com",  
                                "thumbnailUrl" : "https:\/\/tse2.mm.bing.net\/th?id=...",  
                                "contentUrl" : "http:\/\/images6.contoso.com\/image..."  
                            }  
                        },  
                        . . .  
                    ],
                    "title" : "Top "  
                },
                {
                    "tiles" : [...],
                    "title" : "Trending"
                },
                . . .
            ],  
        },
        {
            "title" : "Viral videos",
            "subcategories" : [
                {
                    "tiles" : [...],
                    "title" : "Trending"
                },
                . . .
            ],  
        },
        . . .  
    ]  
}  
  
```

## Next steps

> [!div class="nextstepaction"]
> [Get video insights](video-insights.md)
