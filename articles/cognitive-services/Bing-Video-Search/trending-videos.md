---
title: Search the web for trending videos - Bing Video Search
titlesuffix: Azure Cognitive Services
description: Shows how to use the Bing Video Search API to search the web for trending videos.
services: cognitive-services
author: swhite-msft
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-video-search
ms.topic: conceptual
ms.date: 04/15/2017
ms.author: scottwhi
---

# Get trending videos  

To get today's trending videos, send the following GET request:  
  
```
GET https://api.cognitive.microsoft.com/bing/v7.0/videos/trending?mkt=en-us HTTP/1.1
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-MSEdge-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357;long:-122.3295;re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```

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

  
The following example shows a response that contains trending videos.  

```  
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
The response contains a list of videos by category and subcategory. For example, if the list of categories contained a Music Videos category and one of its subcategories was Top, you could create a Top Music Videos category in your user experience. You could then use the `thumbnailUrl`, `displayText`, and `webSearchUrl` fields to create a clickable tile under each category (for example, Top Music Videos). When the user clicks the tile, they're taken to Bing's video browser where the video is played.

The response also contains banner videos, which are the most popular trending videos. The banner videos may come from one or more of the categories.  
  
