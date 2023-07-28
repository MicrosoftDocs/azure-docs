---
title: "Search for videos using the Bing Video Search API"
titleSuffix: Azure AI services
description: The Bing Video Search APIfinds and returns relevant videos from the web, it provides several features for intelligent and focused video retrieval on the web.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-video-search
ms.topic: conceptual
ms.date: 06/24/2019
ms.author: aahi
---

# Search for videos with the Bing Video Search API

[!INCLUDE [Bing move notice](../../bing-web-search/includes/bing-move-notice.md)]

The Bing Video Search API makes it easy to integrate Bing's cognitive news searching capabilities into your applications. While the API primarily finds and returns relevant videos from the web, it provides several features for intelligent and focused video retrieval on the web.

## Getting videos

To get videos related to the user's search term from the web, send the following GET request:

```http
GET https://api.cognitive.microsoft.com/bing/v7.0/videos/search?q=sailing+dinghies&mkt=en-us HTTP/1.1
Ocp-Apim-Subscription-Key: 123456789ABCDE
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)
X-Search-ClientIP: 999.999.999.999
X-Search-Location: lat:47.60357;long:-122.3295;re:100
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>
Host: api.cognitive.microsoft.com
```

All requests must be made from a server.

If it's your first time calling any of the Bing APIs, don't include the client ID header. Only include the client ID if you've previously called a Bing API and Bing returned a client ID for the user and device combination.

To get videos from a specific domain, use the [site:](/previous-versions/bing/search/ff795613(v=msdn.10)) query operator.

```http
GET https://api.cognitive.microsoft.com/bing/v7.0/videos/search?q=sailing+dinghies+site:contososailing.com&mkt=en-us HTTP/1.1
```

The response contains a [Videos](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#videos) answer that contains a list of videos that Bing thought were relevant to the query. Each [Video](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#video) object in the list includes the URL of the video, its duration, its dimensions, and its encoding format among other attributes. The video object also includes the URL of a thumbnail of the video and the thumbnail's dimensions.

```json
{
    "_type" : "Videos",
    "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=81EF7545...",
    "totalEstimatedMatches" : 1000,
    "value" : [
        {
            "name" : "How to sail - What to Wear for Dinghy Sailing",
            "description" : "An informative video on what to wear when...",
            "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=81EF7...",
            "thumbnailUrl" : "https:\/\/tse4.mm.bing.net\/th?id=OVP.DYW...",
            "datePublished" : "2014-03-04T11:51:53",
            "publisher" : [
                {
                    "name" : "Fabrikam"
                }
            ],
            "creator" : 
            {
                "name" : "Marcus Appel"
            },
            "contentUrl" : "https:\/\/www.fabrikam.com\/watch?v=vzmPjZ--g",
            "hostPageUrl" : "https:\/\/www.bing.com\/cr?IG=81EF7545D569...",
            "encodingFormat" : "h264",
            "hostPageDisplayUrl" : "https:\/\/www.fabrikam.com\/watch?v=vzmPjZ--g",
            "width" : 1280,
            "height" : 720,
            "duration" : "PT2M47S",
            "motionThumbnailUrl" : "https:\/\/tse3.mm.bing.net\/th?id=OM.Y62...",
            "embedHtml" : "<iframe width=\"1280\" height=\"720\" src=\"https:...><\/iframe>",
            "allowHttpsEmbed" : true,
            "viewCount" : 8743,
            "thumbnail" : 
            {
                "width" : 300,
                "height" : 168
            },
            "videoId" : "6DB795E11A6E3CBAAD636DB795E113CBAAD63",
            "allowMobileEmbed" : true,
            "isSuperfresh" : false
        },
        ...
    ],
    "queryExpansions" : [...],
    "nextOffsetAddCount" : 0,
    "pivotSuggestions" : [...]
}
```

## Video thumbnails

You can display all, or a subset of the video thumbnails returned by the Bing Video Search API. If you display a subset, provide the user an option to view the remaining videos. as part of the Bing API [use and display requirements](../../bing-web-search/use-display-requirements.md), You must display the videos in the order provided in the response. For information about resizing the thumbnail, see [Resizing and Cropping Thumbnails](../../bing-web-search/resize-and-crop-thumbnails.md). 

As the user hovers over the thumbnail you can use [motionThumbnailUrl](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#video-motionthumbnailurl) to play a thumbnail version of the video. Be sure to attribute the motion thumbnail when you display it.

<!-- Removing until the images can be sanitized.
![Motion thumbnail of a video](../bing-web-search/media/cognitive-services-bing-web-api/bing-web-video-motion-thumbnail.PNG)
-->

When a thumbnail is clicked, there are three options for viewing the video:

- Use [hostPageUrl](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#video-hostpageurl) to view the video on the host website (for example, YouTube)
- Use [webSearchUrl](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#video-websearchurl) to view the video in the Bing video browser
- Use [embdedHtml](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#video-embedhtml) to embed the video in your own experience 

Be sure to use the publisher and creator to attribute the video when you play it.

For details about using [videoId](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#video-videoid) to get insights about the video, see [Video Insights](../video-insights.md).

## Filtering videos

By default, the Video Search API returns all videos that are relevant to the query. If you only want free videos or videos less than five minutes in length, you'd use the following filter query parameters:

- [pricing](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#pricing)&mdash;Filter videos by pricing (for example, videos that are free or that you have to pay for)
- [resolution](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#resolution)&mdash;Filter videos by resolution (for example, videos with a 720p or higher resolution)
- [videoLength](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#videolength)&mdash;Filter videos by video length (for example, videos that are less than five minutes in length)
- [freshness](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#freshness)&mdash;Filter videos by age (for example, videos discovered by Bing in the past week)

To get videos from a specific domain, include the [site:](/previous-versions/bing/search/ff795613(v=msdn.10)) query operator in the query string.

> [!NOTE]
> Depending on the query, if you use the `site:` query operator, there is the chance that the response contains adult content regardless of the [safeSearch](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#safesearch) setting. You should use `site:` only if you are aware of the content on the site and your scenario supports the possibility of adult content.

The following example shows how to get free videos from ContosoSailing.com that have a resolution of 720p or better and that Bing has discovered in the past month.

```http
GET https://api.cognitive.microsoft.com/bing/v7.0/videos/search?q=sailing+dinghies+site:contososailing.com&pricing=free&freshness=month&resolution=720p&mkt=en-us HTTP/1.1
Ocp-Apim-Subscription-Key: 123456789ABCDE
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)
X-MSEdge-ClientIP: 999.999.999.999
X-Search-Location: lat:47.60357;long:-122.3295;re:100
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>
Host: api.cognitive.microsoft.com
```

## Expanding the query

If Bing can expand the query to narrow the original search, the [Videos](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#videos) object contains the `queryExpansions` field. For example, if the query was *Cleaning Gutters*, the expanded queries might be: Gutter Cleaning **Tools**, Cleaning Gutters **From the Ground**, Gutter Cleaning **Machine**, and **Easy** Gutter Cleaning.

The following example shows the expanded queries for *Cleaning Gutters*.

```json
{
    "_type" : "Videos",
    "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=B52FBC5...",
    "totalEstimatedMatches" : 1000,
    "value" : [...],
    "nextOffsetAddCount" : 4,
    "queryExpansions" : [
        {
            "text" : "Gutter Cleaning Tools",
            "displayText" : "Tools",
            "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=B52FB....",
            "searchLink" : "https:\/\/api.cognitive.microsoft.com\/api\/v5...",
            "thumbnail" : {
                "thumbnailUrl" : "https:\/\/tse4.mm.bing.net\/th?q=Gutter..."
            }
        },
        ...
    ]
    "pivotSuggestions" : [...],
}
```

The `queryExpansions` field contains a list of [Query](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#query_obj) objects. The `text` field contains the expanded query and the `displayText` field contains the expansion term. You can use the text and thumbnail fields to display the expanded query strings to the user in case the expanded query string is really what they're looking for. Make the thumbnail and text clickable using the `webSearchUrl` URL or `searchLink` URL. Use `webSearchUrl` to send the user to the Bing search results, or `searchLink` if you provide your own results page.

## Pivoting the query

If Bing can segment the original search query, the [Videos](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#videos) object contains the `pivotSuggestions` field. For example, if the original query was *Cleaning Gutters*, Bing might segment the query into *Cleaning* and *Gutters*.

The following example shows the pivot suggestions for *Cleaning Gutters*.

```json
{
    "_type" : "Videos",
    "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=B52FBC...",
    "totalEstimatedMatches" : 1000,
    "value" : [...],
    "nextOffsetAddCount" : 0,
    "queryExpansions" : [...],
    "pivotSuggestions" : [
        {
            "pivot" : "cleaning",
            "suggestions" : [
                {
                    "text" : "Gutter Repair",
                    "displayText" : "Repair",
                    "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=B52...",
                    "searchLink" : "https:\/\/api.cognitive.microsoft.com\/api\/v5\/videos...",
                    "thumbnail" : {
                        "thumbnailUrl" : "https:\/\/tse3.mm.bing.net\/th?q=Gutter..."
                    }
                },
                ...
            ]
        },
        {
            "pivot" : "gutters",
            "suggestions" : [
                {
                    "text" : "Window Cleaning",
                    "displayText" : "Window",
                    "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=B52FBC59...",
                    "searchLink" : "https:\/\/api.cognitive.microsoft.com\/api\/v5...",
                    "thumbnail" : {
                        "thumbnailUrl" : "https:\/\/tse2.mm.bing.net\/th?q=Window..."
                    }
                },
                ...
            ]
        }
    ]
}
```

For each pivot, the response contains a list of [Query](/rest/api/cognitiveservices-bingsearch/bing-video-api-v7-reference#query_obj) objects that contain suggested queries. The `text` field contains the suggested query and the `displayText` field contains the term that replaces the pivot in the original query. For example, Window Cleaning.

You can use the `text` and `thumbnail` fields to display the expanded query strings to the user in case the expanded query string is really what they're looking for. Make the thumbnail and text clickable using the `webSearchUrl` URL or `searchLink` URL. Use `webSearchUrl` to send the user to the Bing search results, or `searchLink` if you provide your own results page.

## Throttling requests

[!INCLUDE [cognitive-services-bing-throttling-requests](../../../../includes/cognitive-services-bing-throttling-requests.md)]
