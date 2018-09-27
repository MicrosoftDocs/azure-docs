---
title: What is Bing Video Search?
titlesuffix: Azure Cognitive Services
description: Shows how to use the Bing Video Search API to search the web for videos.
services: cognitive-services
author: swhite-msft
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-video-search
ms.topic: overview
ms.date: 04/15/2017
ms.author: scottwhi
---
# What is Bing Video Search?

The Bing Video Search API provides a similar (but not exact) experience to [Bing Videos](https://www.bing.com/videos). The Bing Video Search API lets you send a search query to Bing and get back a list of relevant videos.

If you're building a videos-only search results page to find videos that are relevant to the user's search query, call this API instead of calling the more general [Bing Web Search API](../bing-web-search/search-the-web.md). If you want videos and other types of content such as webpages, news, and images, then call the Bing Web Search API.

## Suggesting & using search terms

If you provide a search box where the user enters their search term, use the [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md) to improve the experience. The API returns suggested query strings based on partial search terms as the user types.

After the user enters their search term, URL encode it before setting the [q](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#query) query parameter. For example, if the user enters *sailing dinghies*, set `q` to `sailing+dinghies` or `sailing%20dinghies`.

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

To get videos from a specific domain, use the [site:](http://msdn.microsoft.com/library/ff795613.aspx) query operator.

```http
GET https://api.cognitive.microsoft.com/bing/v7.0/videos/search?q=sailing+dinghies+site:contososailing.com&mkt=en-us HTTP/1.1
```

The response contains a [Videos](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#videos) answer that contains a list of videos that Bing thought were relevant to the query. Each [Video](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#video) object in the list includes the URL of the video, its duration, its dimensions, and its encoding format among other attributes. The video object also includes the URL of a thumbnail of the video and the thumbnail's dimensions.

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

You could display a collage of all the video thumbnails or you could display a subset of the thumbnails. If you display a subset, provide the user an option to view the remaining videos. You must display the videos in the order provided in the response. For information about resizing the thumbnail, see [Resizing and Cropping Thumbnails](./resize-and-crop-thumbnails.md). 

As the user hovers over the thumbnail you can use [motionThumbnailUrl](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#video-motionthumbnailurl) to play a thumbnail version of the video. Be sure to attribute the motion thumbnail when you display it.

<!-- Removing until the images can be sanitized.
![Motion thumbnail of a video](../bing-web-search/media/cognitive-services-bing-web-api/bing-web-video-motion-thumbnail.PNG)
-->

If the user clicks the thumbnail, the following are the video viewing options:

- Use [hostPageUrl](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#video-hostpageurl) to view the video on the host website (for example, YouTube)
- Use [webSearchUrl](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#video-websearchurl) to view the video in the Bing video browser
- Use [embdedHtml](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#video-embedhtml) to embed the video in your own experience 

Be sure to use the publisher and creator to attribute the video when you play it.

For details about using [videoId](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#video-videoid) to get insights about the video, see [Video Insights](./video-insights.md).

## Filtering videos

By default, the Video Search API returns all videos that are relevant to the query. If you only want free videos or videos less than five minutes in length, you'd use the following filter query parameters:

- [pricing](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#pricing)&mdash;Filter videos by pricing (for example, videos that are free or that you have to pay for)
- [resolution](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#resolution)&mdash;Filter videos by resolution (for example, videos with a 720p or higher resolution)
- [videoLength](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#videolength)&mdash;Filter videos by video length (for example, videos that are less than five minutes in length)
- [freshness](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#freshness)&mdash;Filter videos by age (for example, videos discovered by Bing in the past week)

To get videos from a specific domain, include the [site:](http://msdn.microsoft.com/library/ff795613.aspx) query operator in the query string.

> [!NOTE]
> Depending on the query, if you use the `site:` query operator, there is the chance that the response contains adult content regardless of the [safeSearch](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#safesearch) setting. You should use `site:` only if you are aware of the content on the site and your scenario supports the possibility of adult content.

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

If Bing can expand the query to narrow the original search, the [Videos](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#videos) object contains the `queryExpansions` field. For example, if the query was *Cleaning Gutters*, the expanded queries might be: Gutter Cleaning **Tools**, Cleaning Gutters **From the Ground**, Gutter Cleaning **Machine**, and **Easy** Gutter Cleaning.

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

The `queryExpansions` field contains a list of [Query](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#query_obj) objects. The `text` field contains the expanded query and the `displayText` field contains the expansion term. You can use the text and thumbnail fields to display the expanded query strings to the user in case the expanded query string is really what they're looking for. Make the thumbnail and text clickable using the `webSearchUrl` URL or `searchLink` URL. Use `webSearchUrl` to send the user to the Bing search results, or `searchLink` if you provide your own results page.

## Pivoting the query

If Bing can segment the original search query, the [Videos](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#videos) object contains the `pivotSuggestions` field. For example, if the original query was *Cleaning Gutters*, Bing might segment the query into *Cleaning* and *Gutters*.

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

For each pivot, the response contains a list of [Query](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference#query_obj) objects that contain suggested queries. The `text` field contains the suggested query and the `displayText` field contains the term that replaces the pivot in the original query. For example, Window Cleaning.

You can use the `text` and `thumbnail` fields to display the expanded query strings to the user in case the expanded query string is really what they're looking for. Make the thumbnail and text clickable using the `webSearchUrl` URL or `searchLink` URL. Use `webSearchUrl` to send the user to the Bing search results, or `searchLink` if you provide your own results page.

## Throttling requests

[!INCLUDE [cognitive-services-bing-throttling-requests](../../../includes/cognitive-services-bing-throttling-requests.md)]

## Next steps

To get started quickly with your first request, see [Making Your First Request](./quick-start.md).

To get your subscription key, see [Subscription Keys](https://azure.microsoft.com/try/cognitive-services/?api=bing-video-search-api).

Familiarize yourself with the [Bing Video Search API v7](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference) reference. The reference contains the list of endpoints, headers, and query parameters that you'd use to request search results. It also includes definitions of the response objects. 

To improve your search box user experience, see [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md). As the user enters their query term, you can call this API to get relevant query terms that were used by others.

Be sure to read [Bing Use and Display Requirements](./useanddisplayrequirements.md) so you don't break any of the rules about using the search results.

When you call the Video Search API, Bing returns a list of results. The list is a subset of the total number of results that are relevant to the query. The response's `totalEstimatedMatches` field contains an estimate of the number of videos that are available to view. For details about how you'd page through the remaining videos, see [Paging Videos](./paging-videos.md).

For details about getting insights about a video, see [Video Insights](./video-insights.md).

For details about getting trending videos, see [Trending Videos](./trending-videos.md).