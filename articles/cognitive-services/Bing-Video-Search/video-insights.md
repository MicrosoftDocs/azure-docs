---
title: Get video insights | Microsoft Docs
description: Shows how to use the Bing Video Search API to get more information about a video.
services: cognitive-services
author: swhite-msft
manager: ehansen

ms.assetid: 30ECF4E2-E4F0-491B-9FA8-971BC96AB7B6
ms.service: cognitive-services
ms.technology: bing-video-search
ms.topic: article
ms.date: 04/15/2017
ms.author: scottwhi
---

# Get Insights about a Video

Each video includes a video ID that you can use to get more information about the video, such as related videos.  
  
To get insights about a video, capture its [videoId](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v5-reference#video-videoid) token in the response. 

```
    "value" : [
        {
            . . .
            "name" : "How to sail - What to Wear for Dinghy Sailing",
            "description" : "An informative video on what to wear...",
            "contentUrl" : "https:\/\/www.youtube.com\/watch?v=vzmPjHBZ--g",
            "videoId" : "6DB795E11A6E3CBAAD636DB795E11A6E3CBAAD63",
            . . .
        }
    ],
```

Next, send the following GET request to the Video Details endpoint. Set the [id](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v5-reference#id) query parameter to the `videoId` token. To specify the insights that you want to get, set the [modulesRequested](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v5-reference#modulesrequested) query parameter. To get all insights, set `modulesRequested` to All. The response includes all insights that you requested, if available.

```
GET https://api.cognitive.microsoft.com/bing/v5.0/videos/details?q=sailiing+dinghies&id=6DB795E11A6E3CBAAD636DB795E11A6E3CBAAD63&modulesRequested=All&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-MSEdge-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com
``` 

> [!NOTE]
> Version 7 Preview request:
>
> To get all video insights, set the [modules](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#modulesrequested) query parameter to All.
>
> ```  
> GET https://api.cognitive.microsoft.com/bing/v7.0/videos/details?q=sailiing+dinghies&id=6DB795E11A6E3CBAAD636DB795E11A6E3CBAAD63&modules=All&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com  
> ```  

## Getting Related Videos Insights  

To get videos that are related to the specified video, set the [modulesRequested](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v5-reference#modulesrequested) query parameter to RelatedVideos.
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/videos/details?q=sailiing+dinghies&id=6DB795E11A6E3CBAAD636DB795E11A6E3CBAAD63&modulesRequested=RelatedVideos&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  
  
The following is the response to the previous request. The top-level object is a [VideoDetails](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v5-reference#videodetails) object instead of a [Videos](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v5-reference#videos) object.  
  
```  
{
    "_type" : "Api.VideoDetails.VideoDetails",
    "relatedVideos" : [
        {
            "name" : "How to sail - Reefing a Sail",
            "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=7284B07...",
            "thumbnailUrl" : "https:\/\/tse3.mm.bing.net\/th?id=OVP.zt...",
            "datePublished" : "2014-03-04T16:11:09",
            "publisher" : [
                {
                    "name" : "YouTube"
                }
            ],
            "contentUrl" : "https:\/\/www.youtube.com\/watch?v=...",
            "hostPageUrl" : "https:\/\/www.bing.com\/cr?IG=7284B07...",
            "hostPageDisplayUrl" : "https:\/\/www.youtube.com\/watch?...",
            "duration" : "PT4M56S",
            "motionThumbnailUrl" : "https:\/\/tse1.mm.bing.net\/th?id=OM...",
            "allowHttpsEmbed" : true,
            "viewCount" : 21756,
            "videoId" : "AC1A157A4DDB571D03D6AC157A4DDB571D03D6",
            "allowMobileEmbed" : false,
            "isSuperfresh" : false
        },
        . . .
    ]
}
```

> [!NOTE]
> Version 7 Preview request:
>
> To get related video insights, set the [modules](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#modulesrequested) query parameter to RelatedVideos.
>
> ```  
> GET https://api.cognitive.microsoft.com/bing/v7.0/videos/details?q=sailiing+dinghies&id=6DB795E11A6E3CBAAD636DB795E11A6E3CBAAD63&modules=RelatedVideos&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com  
> ```  
>
> The following shows the response to the previous query. Things to note:
>
> - Added a level of indirection to `relatedVideos`. The field's data type in v5 was an array of `Video` objects. In v7, it is a [VideosModule](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#videosmodule) object that contains a `value` field whose type is an array of `Video` objects.  
>
>```
>{
>    "_type" : "Api.VideoDetails.VideoDetails",
>    "relatedVideos" : {
>        "value" : [
>            {
>                "webSearchUrl" : "https:\/\/www.bing.com\/videos\/search?q=&view=detail&mid=9D1...",
>                "name" : "Gaff rigged sailing along Garden Island...",
>                "thumbnailUrl" : "https:\/\/tse1.mm.bing.net\/th?id=OIP.Mda2a86...",
>                "contentUrl" : "https:\/\/www.youtube.com\/watch?v=a68ldS4c0",
>                 . . .
>            }
>        ]
>    }
>```
