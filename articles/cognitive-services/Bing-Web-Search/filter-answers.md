---
title: How to filter search results - Bing Web Search API
titleSuffix: Azure Cognitive Services
description: You can filter the types of answers that Bing includes in the response (for example images, videos, and news) by using the 'responseFilter' query parameter.
services: cognitive-services
author: swhite-msft
manager: nitinme
ms.assetid: 8B837DC2-70F1-41C7-9496-11EDFD1A888D
ms.service: cognitive-services
ms.subservice: bing-web-search
ms.topic: conceptual
ms.date: 07/08/2019
ms.author: scottwhi
---

# Filtering the answers that the search response includes  

When you query the web, Bing returns all the relevant content it finds for the search. For example, if the search query is "sailing+dinghies", the response might contain the following answers:

```json
{
    "_type" : "SearchResponse",
    "webPages" : {
        "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=3A43C...",
        "totalEstimatedMatches" : 262000,
        "value" : [...]
    },
    "images" : {
        "id" : "https:\/\/api.cognitive.microsoft.com\/api\/v7\/#Images",
        "readLink" : "https:\/\/api.cognitive.microsoft.com\/api\/v7\/images\/search?q=sail...",
        "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=3A43CA5CA6464E5D...",
        "isFamilyFriendly" : true,
        "value" : [...]
    },
    "rankingResponse" : {
        "mainline" : {
            "items" : [...]
        }
    }
}    
```

## Query parameters

To filter the answers returned by Bing, use the below query parameters when calling the API.  

### ResponseFilter

You can filter the types of answers that Bing includes in the response (for example images, videos, and news) by using the [responseFilter](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#responsefilter) query parameter, which is a comma-delimited list of answers. An answer will be included in the response if Bing finds relevant content for it. 

To exclude specific answers from the response such as images, prepend a `-` character to the answer type. For example:

```
&responseFilter=-images,-videos
```

The following shows how to use `responseFilter` to request images, videos, and news of sailing dinghies. When you encode the query string, the commas change to %2C.  

```  
GET https://api.cognitive.microsoft.com/bing/v7.0/search?q=sailing+dinghies&responseFilter=images%2Cvideos%2Cnews&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location:  47.60357;long:-122.3295;re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  

The following shows the response to the previous query. Because Bing didn't find relevant video and news results, the response doesn't include them.

```json
{
    "_type" : "SearchResponse",
    "images" : {
        "id" : "https:\/\/api.cognitive.microsoft.com\/api\/v7\/#Images",
        "readLink" : "https:\/\/api.cognitive.microsoft.com\/api\/v7\/images\/search?q=sail...",
        "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=3AD78B183C56456C...",
        "isFamilyFriendly" : true,
        "value" : [...]
    },
    "rankingResponse" : {
        "mainline" : {
            "items" : [{
                "answerType" : "Images",
                "value" : {
                    "id" : "https:\/\/api.cognitive.microsoft.com\/api\/v7\/#Images"
                }
            }]
        }
    }
}
```

Although Bing did not return video and news results in the previous response, it does not mean that video and news content does not exist. It simply means that the page didn't include them. However, if you [page](./paging-webpages.md) through more results, the subsequent pages would likely include them. Also, if you call the [Video Search API](../bing-video-search/search-the-web.md) and [News Search API](../bing-news-search/search-the-web.md) endpoints directly, the response would likely contain results.

You are discouraged from using `responseFilter` to get results from a single API. If you want content from a single Bing API, call that API directly. For example, to receive only images, send a request to the Image Search API endpoint, `https://api.cognitive.microsoft.com/bing/v7.0/images/search` or one of the other [Images](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#endpoints) endpoints. Calling the single API is important not only for performance reasons but because the content-specific APIs offer richer results. For example, you can use filters that are not available to the Web Search API to filter the results.  

### Site

To get search results from a specific domain, include the `site:` query parameter in the query string.  

```
https://api.cognitive.microsoft.com/bing/v7.0/search?q=sailing+dinghies+site:contososailing.com&mkt=en-us
```

> [!NOTE]
> Depending on the query, if you use the `site:` query operator, there is the chance that the response may contain adult content regardless of the [safeSearch](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#safesearch) setting. You should use `site:` only if you are aware of the content on the site and your scenario supports the possibility of adult content.

### Freshness

To limit the web answer results to webpages that Bing discovered during a specific period, set the [freshness](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#freshness) query parameter to one of the following case-insensitive values:

* `Day` — Return webpages that Bing discovered within the last 24 hours
* `Week` — Return webpages that Bing discovered within the last 7 days
* `Month` — Return webpages that discovered within the last 30 days

You may also set this parameter to a custom date range in the form, `YYYY-MM-DD..YYYY-MM-DD`. 

`https://<host>/bing/v7.0/search?q=ipad+updates&freshness=2019-02-01..2019-05-30`

To limit the results to a single date, set the freshness parameter to a specific date:

`https://<host>/bing/v7.0/search?q=ipad+updates&freshness=2019-02-04`

The results may include webpages that fall outside the specified period if the number of webpages that Bing matches to your filter criteria is less than the number of webpages you requested (or the default number that Bing returns).

## Limiting the number of answers in the response

Bing can return multiple answer types in the JSON response. For example, if you query *sailing+dinghies*, Bing might return `webpages`, `images`, `videos`, and `relatedSearches`.

```json
{
    "_type" : "SearchResponse",
    "queryContext" : {
        "originalQuery" : "sailing dinghies"
    },
    "webPages" : {...},
    "images" : {...},
    "relatedSearches" : {...},
    "videos" : {...},
    "rankingResponse" : {...}
}
```

To limit the number of answers that Bing returns to the top two answers (webpages and images), set the [answerCount](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#answercount) query parameter to 2.

```  
GET https://api.cognitive.microsoft.com/bing/v7.0/search?q=sailing+dinghies&answerCount=2&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location:  47.60357;long:-122.3295;re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  

The response includes only `webPages` and `images`.

```json
{
    "_type" : "SearchResponse",
    "queryContext" : {
        "originalQuery" : "sailing dinghies"
    },
    "webPages" : {...},
    "images" : {...},
    "rankingResponse" : {...}
}
```

If you add the `responseFilter` query parameter to the previous query and set it to webpages and news, the response contains only webpages because news is not ranked.

```json
{
    "_type" : "SearchResponse",
    "queryContext" : {
        "originalQuery" : "sailing dinghies"
    },
    "webPages" : {...},
    "rankingResponse" : {...}
}
```

## Promoting answers that are not ranked

If the top ranked answers that Bing returns for a query are webpages, images, videos, and relatedSearches, the response would include those answers. If you set [answerCount](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#answercount) to two (2), Bing returns the top two ranked answers: webpages and images. If you want Bing to include images and videos in the response, specify the [promote](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference#promote) query parameter and set it to images and videos.

```  
GET https://api.cognitive.microsoft.com/bing/v7.0/search?q=sailing+dinghies&answerCount=2&promote=images%2Cvideos&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location:  47.60357;long:-122.3295;re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  

The following is the response to the above request. Bing returns the top two answers, webpages and images, and promotes videos into the answer.

```json
{
    "_type" : "SearchResponse",
    "queryContext" : {
        "originalQuery" : "sailiing dinghies"
    },
    "webPages" : {...},
    "images" : {...},
    "videos" : {...},
    "rankingResponse" : {...}
}
```

If you set `promote` to news, the response doesn't include the news answer because it is not a ranked answer&mdash;you can promote only ranked answers.

The answers that you want to promote do not count against the `answerCount` limit. For example, if the ranked answers are news, images, and videos, and you set `answerCount` to 1 and `promote` to news, the response contains news and images. Or, if the ranked answers are videos, images, and news, the response contains videos and news.

You may use `promote` only if you specify the `answerCount` query parameter.
