---
title: Search the web for news | Microsoft Docs
description: Shows how to use the Bing News Search API to search the web for news.
services: cognitive-services
author: swhite-msft
manager: ehansen

ms.assetid: 4B35B035-34FB-403A-9F52-6470AF726FB6
ms.service: cognitive-services
ms.technology: bing-news-search
ms.topic: article
ms.date: 06/21/2016
ms.author: scottwhi
---

# Searching the Web for News

The News API provides a similar (but not exact) experience to Bing.com/News. The News API lets you send a search query to Bing and get back a list of relevant news articles.  

If you're building a news-only search results page to find news that's relevant to the user's search query, call this API instead of calling the more general [Web Search API](../bing-web-search/search-the-web.md). If you want news and other types of content such as webpages, images, and videos, then call the Web Search API.


## Search Query Term

If you're requesting general news from Bing, your user experience must provide a search box where the user enters a search query term. You can determine the maximum length of the term that you allow, but the maximum length of all your query parameters should be less than 1,500 characters.

After the user enters their query term, you need to URL encode the term before setting the [q](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#query) query parameter. For example, if the user entered *sailing competitions*, you would set `q` to *sailing+competitions* or *sailing%20competitions*.

If the query term contains a spelling mistake, the search response includes a [QueryContext](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#querycontext) object. The object shows the original spelling and the corrected spelling that Bing used for the search. 

```
  "queryContext":{  
    "originalQuery":"sialing competitions",  
    "alteredQuery":"sailing competitions",  
    "alterationOverrideQuery":"+sialing competitions"  
  },  
```

You could use `originalQuery` and `alteredQuery` to let the user know the actual query term that Bing used.

## General News

To get general news articles related to the user's search term from the web, send the following GET request:

```  
GET https://api.cognitive.microsoft.com/bing/v5.0/news/search?q=sailing+dinghies&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  

> [!NOTE]
> Version 7 Preview request:
>
> ```  
> GET https://api.cognitive.microsoft.com/bing/v7.0/news/search?q=sailing+dinghies&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com  
> ```  

If it's your first time calling any of the Bing APIs, don't include the client ID header. Only include the client ID if you've previously called a Bing API and Bing returned a client ID for the user and device combination.

To get news from a specific domain, use the [site:](http://msdn.microsoft.com/library/ff795613.aspx) query operator.  
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/news/search?q=sailing+dinghies+site:contososailing.com&mkt=en-us HTTP/1.1  
```

The following shows the response to the previous query. You must display each news article in the order provided in the response. If the article contains clustered articles, you should indicate that related articles exist and display them if the user requests to see them.  

```
{
    "_type" : "News",
    "readLink" : "https:\/\/api.cognitive.microsoft.com\/bing\/v5\/news\/search?q=sailing+dinghies",
    "totalEstimatedMatches" : 88400,
    "value" : [{
        "name" : "Sailing Vies for Four Trophies",
        "url" : "http:\/\/www.bing.com\/cr?IG=CCE2F06CA750455891FE99A72...",
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

    . . .

    {
        "name" : "Restronguet Sailing Club to host Mirror Dinghy...",
        "url" : "http:\/\/www.bing.com\/cr?IG=CCE2F06CA750455891F...",
        "image" : {
            "thumbnail" : {
                "contentUrl" : "https:\/\/www.bing.com\/th?id=ON.36...",
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
    }]
}    
```

The [news](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#news) answer lists the news articles that Bing thought were relevant to the query. The `totalEstimatedMatches` field contains an estimate of the number of articles available to view. For information about paging through the articles, see [Paging News](./paging-news.md).

Each [news article](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#newsarticle) in the list includes the article's name, description, and URL to the article on the host's website. If the article contains an image, the object includes a thumbnail of the image. Use `name` and `url` to create a hyperlink that takes the user to the news article on the host's site. If the article includes an image, also make the image clickable using `url`. Be sure to use `provider` to attribute the article. 

If Bing can determine the category of news article, the article includes the `category` field.

## Top News

To get today's top news articles, you'd make the same request as getting general news except that you'd leave `q` unset.

```  
GET https://api.cognitive.microsoft.com/bing/v5.0/news/search?q=&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
``` 

> [!NOTE]
> Version 7 Preview request:
>
> ```  
> GET https://api.cognitive.microsoft.com/bing/v7.0/news/search?q=&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com  
> ```  

The response is the same response that general news returns except that the `news` answer does not include the `totalEstimatedMatches` field because there's a set number of results. The number of top news articles may vary depending on the news cycle. Be sure to use `provider` to attribute the article.

## News by Category

To get news articles by category, such as the top sports or entertainment articles, send the following GET request to Bing:

```  
GET https://api.cognitive.microsoft.com/bing/v5.0/news?category=sports&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  

> [!NOTE]
> Version 7 Preview request:
>
> ```  
> GET https://api.cognitive.microsoft.com/bing/v7.0/news?category=sports&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com  
> ```  

Use the [category](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#category) query parameter to specify the category of articles to get. For a list of possible news categories that you may specify, see [News Categories by Market](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#news-categories-by-market).

The response is the same as top news except that the articles are all the specified category.


## Headline News

To request headline news articles and get articles from all news categories, send the following GET request to Bing: 
 
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/news?mkt=en-us HTTP/1.1  
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
> ```  
> GET https://api.cognitive.microsoft.com/bing/v7.0/news?mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com  
> ```  

Do not include the [category](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#category) query parameter. 

The response is the same as top news response. If the article is a headline article, its `headline` field is set to **true**.

By default, the response includes up to 12 headline articles. To change the number of headline articles to return, specify the [headlineCount](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#headlinecount) query parameter. The response also includes up to four non-headline articles per news category. 
  
The response counts clusters as one article. Because a cluster may contain multiple articles, the response may include more than 12 headline articles and more than four non-headline articles per category.  


## Trending News

To get news topics that are trending on social networks, send the following GET request to Bing:  
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/news/trendingtopics?mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
X-MSAPI-UserState: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  

> [!NOTE]
> Version 7 Preview request:
>
> ```  
> GET https://api.cognitive.microsoft.com/bing/v7.0/news/trendingtopics?mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com  
> ```  

> [!NOTE] 
> Trending Topics is available only in the en-US and zh-CN markets.

The following is the response to the preceding request. Each trending news topic includes a related image, breaking news flag, and a URL to the Bing search results for the topic. Use the URL in the `webSearchUrl` field to take the user to the Bing search results page. Or, use the query text to call the [Web Search API](../bing-web-search/search-the-web.md) to display the results yourself.  

```
{
    "_type" : "TrendingTopics",
    "value" : [{
        "name" : "Canada pot measure",
        "image" : {
            "url" : "https:\/\/www.bing.com\/th?id=OPN.RTNews_hHD...",
            "provider" : [{
                "_type" : "Organization",
                "name" : "© CHRIS ROUSSAKIS\/AFP\/Getty Images"
            }]
        },
        "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=070292D8CEDD...",
        "isBreakingNews" : false,
        "query" : {
            "text" : "Canada marijuana"
        }
    },
    {
        "name" : "Down on Vegas move",
        "image" : {
            "url" : "https:\/\/www.bing.com\/th?id=OPN.RTNews_Bfbmg8h...",
            "provider" : [{
                "_type" : "Organization",
                "name" : "© Ben Margot\/AP"
            }]
        },
        "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=070292D8CEDD...",
        "isBreakingNews" : false,
        "query" : {
            "text" : "John Madden Las Vegas"
        }
    },

    ...

    ]
}    
```

## Clustered News Article
  
If there are other articles that are related to a news article, the news article may include the [clusteredArticles](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#newsarticle-clusteredarticles) field. The following shows an article with clustered articles.

```
    {
        "name" : "NBA playoffs 2017: Betting lines, point spreads...",
        "url" : "http:\/\/www.bing.com\/cr?IG=4B7056CEC271408997D115...",
        "image" : {
            "thumbnail" : {
                "contentUrl" : "https:\/\/www.bing.com\/th?id=ON.D7B1...",
                "width" : 700,
                "height" : 393
            }
        },
        "description" : "April 14, 2017 3:37pm EDT April 14, 2017 3:34pm...",
        "provider" : [{
            "_type" : "Organization",
            "name" : "Sporting News"
        }],
        "datePublished" : "2017-04-14T19:43:00",
        "category" : "Sports",
        "clusteredArticles" : [{
            "name" : "NBA playoffs 2017: Betting odds, favorites to win...",
            "url" : "http:\/\/www.bing.com\/cr?IG=4B7056CEC271408997D1159E...",
            "description" : "April 14, 2017 3:30pm EDT April 14, 2017 3:27pm...",
            "provider" : [{
                "_type" : "Organization",
                "name" : "Sporting News"
            }],
            "datePublished" : "2017-04-14T19:37:00",
            "category" : "Sports"
        }]
    },
```


## Throttling Requests

[!INCLUDE [cognitive-services-bing-throttling-requests](../../../includes/cognitive-services-bing-throttling-requests.md)]


## Next Steps

To get started quickly with your first request, see [Making Your First Request](./quick-start.md).

Familiarize yourself with the [News Search API Reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference). The reference contains the list of endpoints, headers, and query parameters that you'd use to request search results. It also includes definitions of the response objects. 

To improve your search box user experience, see [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md). As the user enters their query term, you can call this API to get relevant query terms that were used by others.

Be sure to read [Bing Use and Display Requirements](./useanddisplayrequirements.md) so you don't break any of the rules about using the search results.

