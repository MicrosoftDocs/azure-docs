---
title: News Search API quick start | Microsoft Docs
description: Shows how to get started using the Bing News Search API.
services: cognitive-services
author: swhite-msft
manager: ehansen

ms.assetid: 9CF6EAF3-42D8-4321-983C-4AC3896E8E03
ms.service: cognitive-services
ms.technology: bing-news-search
ms.topic: article
ms.date: 04/15/2017
ms.author: scottwhi
---

# Your first news search query

Before you can make your first call, you need to get a Cognitive Services subscription key. To get a key, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-news-search-api).

To get News-only search results, you'd send a GET request to the following endpoint:  
  
```
https://api.cognitive.microsoft.com/bing/v5.0/news/search
```

> [!NOTE]
> V7 Preview endpoint:
> 
> ```
> https://api.cognitive.microsoft.com/bing/v7.0/news/search
> ```  
  
The request must use the HTTPS protocol.

We recommend that all requests originate from a server. Distributing the key as part of a client application provides more opportunity for a malicious third-party to access it. Also, making calls from a server provides a single upgrade point for future versions of the API.

The request must specify the [q](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#query) query parameter, which contains the user's search term. Although it's optional, the request should also specify the [mkt](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#mkt) query parameter, which identifies the market where you want the results to come from. For a list of optional query parameters such as `freshness` and `textDecorations`, see [Query Parameters](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#query-parameters). All query parameter values must be URL encoded.  
  
The request must specify the [Ocp-Apim-Subscription-Key](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#subscriptionkey) header. Although optional, you are encouraged to also specify the following headers:  
  
-   [User-Agent](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#useragent)  
-   [X-MSEdge-ClientID](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#clientid)  
-   [X-Search-ClientIP](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#clientip)  
-   [X-Search-Location](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#location)  

The client IP and location headers are important for returning location aware content.  

For a list of all request and response headers, see [Headers](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#headers).

## The request

The following shows a news request that includes all the suggested query parameters and headers. If it's your first time calling any of the Bing APIs, don't include the client ID header. Only include the client ID if you've previously called a Bing API and Bing returned a client ID for the user and device combination. 

```  
GET https://api.cognitive.microsoft.com/bing/v5.0/news/search?q=sailing+dinghies&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357;long:-122.3295;re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  

> [!NOTE]
> V7 Preview request:
>
> ```  
> GET https://api.cognitive.microsoft.com/bing/v7.0/news/search?q=sailing+dinghies&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357;long:-122.3295;re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com  
> ```  

The following shows the response to the previous request. The example also shows the Bing-specific response headers.

```
BingAPIs-TraceId: 76DD2C2549B94F9FB55B4BD6FEB6AC
X-MSEdge-ClientID: 1C3352B306E669780D58D607B96869
BingAPIs-Market: en-US

{
    "_type" : "News",
    "readLink" : "https:\/\/api.cognitive.microsoft.com\/bing\/v5\/news\/search?q=sailing+dinghies",
    "totalEstimatedMatches" : 88400,
    "value" : [{
        "name" : "Sailing Vies for Four Trophies",
        "url" : "http:\/\/www.bing.com\/cr?IG=CCE2F06CA...",
        "image" : {
            "thumbnail" : {
                "contentUrl" : "https:\/\/www.bing.com\/th?id=ON.9C23AA5...",
                "width" : 650,
                "height" : 341
            }
        },
        "description" : "Sailing World's College Rankings, presented by Zim...",
        "provider" : [{
            "_type" : "Organization",
            "name" : "gocrimson.com"
        }],
        "datePublished" : "2017-04-14T15:28:00"
    },
    {
        "name" : "Reunion at Narrabeen Lakes Sailing Club, celebrates 50 years...",
        "url" : "http:\/\/www.bing.com\/cr?IG=CCE2F06CA750455891F...",
        "image" : {
            "thumbnail" : {
                "contentUrl" : "https:\/\/www.bing.com\/th?id=ON.38210...",
                "width" : 650,
                "height" : 366
            }
        },
        "description" : "The reunion on April 29, at Narrabeen Lakes Sailing...",
        "provider" : [{
            "_type" : "Organization",
            "name" : "The Telegraph"
        }],
        "datePublished" : "2017-04-14T13:08:00"
    },
    {
        "name" : "Restronguet Sailing Club to host Mirror Dinghy Sailing World...",
        "url" : "http:\/\/www.bing.com\/cr?IG=CCE2F06CA750455891FE99...",
        "image" : {
            "thumbnail" : {
                "contentUrl" : "https:\/\/www.bing.com\/th?id=ON.364AB41...",
                "width" : 448,
                "height" : 300
            }
        },
        "description" : "The Cornish sailing club that trained Olympian Ben...",
        "provider" : [{
            "_type" : "Organization",
            "name" : "Cornish Guardian"
        }],
        "datePublished" : "2017-04-04T11:02:00",
        "category" : "Sports"
    },
    {
        "name" : "A 24-Carat Nesting Dinghy",
        "url" : "http:\/\/www.bing.com\/cr?IG=CCE2F06CA750455891F...",
        "image" : {
            "thumbnail" : {
                "contentUrl" : "https:\/\/www.bing.com\/th?id=ON.6CC2...",
                "width" : 700,
                "height" : 466
            }
        },
        "description" : "“Hard dinghies are for purists, the kind of people who...",
        "provider" : [{
            "_type" : "Organization",
            "name" : "yachtworld.com"
        }],
        "datePublished" : "2017-04-03T12:14:00",
        "category" : "Politics"
    }]
}
```

> [!NOTE]
> V7 Preview response changes:
>
> Added the `mentions` field to the [NewsArticle](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v7-reference#newsarticle) object. The `mentions` field contains a list of entities (persons or places) that were found in the article.  
> 
>     {
>         "name" : "How Celebs Shacked Up at Coachella: Inside the Rental Mansions...",
>         "mentions" : [
>             {
>                 "name" : "Lady Gaga"
>             },
>             {
>                 "name" : "Kendrick Lamar"
>             },
>             {
>                 "name" : "Coachella Valley Music and Arts Festival"
>             }
>         ],
>         . . .
>     }
> 
> Added the `video` field to the [NewsArticle](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v7-reference#newsarticle) object. The `video` field contains a video that's related to the news article. The video is either an \<iframe\> that you can embed or a motion thumbnail.   
>
>         "video" : {
>             "name" : "How Rock Stars do Coachella! Inside Gaga",
>             "motionThumbnailUrl" : "http:\/\/prod-video-cms-amp-microsoft-com...",
>             "thumbnail" : {
>                 "width" : 320,
>                 "height" : 180
>             }
>         },
>
>         "video" : {
>             "name" : "Watch Bob Weir, Trey Anastasio Cover Lady Gaga's 'Million Reasons'",
>             "thumbnailUrl" : "https:\/\/www.bing.com\/th?id=ON.FCC9C67B9191...",
>             "embedHtml" : "<iframe width=\"1280\" height=\"720\" src=\"https:...><\/iframe>",
>             "allowHttpsEmbed" : true,
>             "thumbnail" : {
>                 "width" : 480,
>                 "height" : 252
>             }
>         },
>  
> Added the `sort` field to the [News](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v7-reference#news) object. The `sort` field shows the sort order of the articles in the response. For example, the articles are sorted by relevance (default) or date. The `isSelected` field identifies the sort order that Bing applied. You can use `url` to send a request with a different sort order.
>
> {
>     "_type" : "News",
>     "readLink" : "https:\/\/api.cognitive.microsoft.com\/bing\/v5\/news\/search?q=sailing+dinghies",
>     "totalEstimatedMatches" : 82600,
>     "sort" : [
>         {
>             "name" : "Best match",
>             "id" : "relevance",
>             "isSelected" : true,
>             "url" : "https:\/\/api.cognitive.microsoft.com\/bing\/v5\/news\/search?q=sailing+dinghies"
>         },
>         {
>             "name" : "Most recent",
>             "id" : "date",
>             "isSelected" : false,
>             "url" : "https:\/\/api.cognitive.microsoft.com\/bing\/v5\/news\/search?q=sailing+dinghies&sortby=date"
>         }
>     ],
>     "value" : [...]
> }


## Next steps

Try out the API. Go to [News Search API Testing Console](https://dev.cognitive.microsoft.com/docs/services/56b43f72cf5ff8098cef380a/operations/56f02400dbe2d91900c68553). 

For details about consuming the response objects, see [Searching the Web for News](./search-the-web.md).

See the following articles about getting:

- [Top News](./search-the-web.md#top-news)
- [News by Category](./search-the-web.md#news-by-category)
- [Trending Topics](./search-the-web.md#trending-news)
