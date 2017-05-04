---
title: Bing Web Search API overview | Microsoft Docs
description: Shows how to use the Bing Web Search API to search the web for webpages, images, news, videos, and more.
services: cognitive-services
author: swhite-msft
manager: ehansen

ms.assetid: 3E66B979-A359-4835-865B-5D2E6F8B8454
ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 01/12/2017
ms.author: scottwhi
---

# Search the Web

The Web Search API provides a similar (but not exact) experience to Bing.com/Search by returning search results that Bing determines are relevant to the specified user's query. The results include webpages and may include images, videos, and more. 

If you're building a search results page that displays any content that's relevant to the user's search query, call this API instead of calling the other content-specific Bing APIs. The only time you should need to call the content-specific APIs, such as the [Image Search API](../bing-image-search/search-the-web.md) or [News Search API](../bing-news-search/search-the-web.md), is if you need answers from only that API. For example, if you're building an image-only search results page or a news-only search results page.

If Bing didn't find content from one of the content-specific APIs relevant enough, it would not include it in the search results. For example, the results could include webpages, news articles, and videos but not images. However, it's possible that if you called the Image Search API directly with the same query, it would return images.

If you don't need webpages but you do need answers from more than one of the other APIs, such as images and news, you'd still call this API. For example, if you only wanted Images and News, you'd call this API and set [responseFilter](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#responsefilter) query parameter to limit the results to only Images and News. For more information, see [Filtering Answers](./filter-answers.md).


## Search Query Term

Your user experience must provide a search box where the user enters a search query term. You can determine the maximum length of the term that you allow, but the maximum length of all your query parameters should be less than 1,500 characters.

After the user enters their query term, you need to URL encode the term before setting the [q](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#query) query parameter. For example, if the user entered *sailing lessons near me*, you would set `q` to *sailing+lessons+near+me* or *sailing%20lessons%20near%20me*.

If the query term contains a spelling mistake, the search response includes a [QueryContext](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#querycontext) object. The object shows the original spelling and the corrected spelling that Bing used for the search. 

```
  "queryContext":{  
    "originalQuery":"sialing dingy for sale",  
    "alteredQuery":"sailing dingh for sale",  
    "alterationOverrideQuery":"+sialing dingy for sale"  
  },  
```

You can use this information to let the user know that you modified their query string when you display the search results.

![Query context UX example](./media/cognitive-services-bing-web-api/bing-query-context.PNG)

## The Search Response

When you send Bing a search request, it sends back a response that contains a [SearchResponse](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#searchresponse) object in the body of the response. The object includes a field for each answer that Bing thought was relevant to the user's query term. The following shows an example of the response object if Bing returned all answers.

```
{
    "_type" : "SearchResponse",
    "queryContext" : {...},
    "webPages" : {...},
    "images" : {...},
    "relatedSearches" : {...},
    "videos" : {...},
    "news" : {...},
    "spellSuggestion" : {...},
    "computation" : {...},
    "timeZone" : {...},
    "rankingResponse" : {...}
```

Typically, Bing returns a subset of the answers. For example, if the query term was *sailing dinghies*, the response might include only `webPages`, `images`, and `rankingResponse`. Unless you've used [responseFilter](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#responsefilter) to filter out webpages, the response always includes the `webpages` and `rankingResponse` answers.

### Webpages answer

The [webPages](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#webanswer) answer contains a list of links to webpages that Bing thought were relevant to the query. Each [webpage](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#webpage) in the list includes the page's name, url, display URL, short description of the content and the date Bing found the content.

```
        {
            "id" : "https:\/\/api.cognitive.microsoft.com\/api\/v5\/#WebPages.0",
            "name" : "Dinghy sailing - Wikipedia",
            "url" : "https:\/\/www.bing.com\/cr?IG=3A43CA5...",
            "displayUrl" : "https:\/\/en.wikipedia.org\/wiki\/Dinghy_sailing",
            "snippet" : "Dinghy sailing is the activity of sailing small boats...",
            "dateLastCrawled" : "2017-04-05T16:25:00"
        },
```

Use `name` and `url` to create a hyperlink that takes the user to the webpage. The following shows an example of how you might display the webpage in a search results page. 

![Rendered webpage example](./media/cognitive-services-bing-web-api/bing-rendered-webpage-example.PNG)

### Images answer

The [images](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#images) answer contains a list of images that Bing thought were relevant to the query. Each [image](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v5-reference#image) in the list includes the URL of the image, its size, its dimensions, and its encoding format. The image object also includes the URL of a thumbnail of the image and the thumbnail's dimensions.

```
        {
            "name" : "File:Rich Passage Minto Sailing Dinghy.jpg - Wikipedia",
            "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=3A43CA5CA64...",
            "thumbnailUrl" : "https:\/\/tse1.mm.bing.net\/th?id=OIP....",
            "datePublished" : "2011-10-29T11:26:00",
            "contentUrl" : "http:\/\/upload.wikimedia.org\/wikipedia\/...",
            "hostPageUrl" : "http:\/\/www.bing.com\/cr?IG=3A43CA5CA6464....",
            "contentSize" : "79239 B",
            "encodingFormat" : "jpeg",
            "hostPageDisplayUrl" : "http:\/\/en.wikipedia.org\/wiki\/File...",
            "width" : 526,
            "height" : 688,
            "thumbnail" : {
                "width" : 229,
                "height" : 300
            },
            "insightsSourcesSummary" : {
                "shoppingSourcesCount" : 0,
                "recipeSourcesCount" : 0
            }
        },
```

Depending on the user's device, you'd typically display a subset of the thumbnails with an option for the user to view the remaining images. 

![List of thumbnail images](./media/cognitive-services-bing-web-api/bing-web-image-thumbnails.PNG)

You can also expand the thumbnail as the user hovers the cursor over it. Be sure to attribute the image if you expand it. For example, by extracting the host from `hostPageDisplayUrl` and displaying it below the image. For information about resizing the thumbnail, see [Resizing and Cropping Thumbnails](./resize-and-crop-thumbnails.md).

![Expanded view of thumbnail image](./media/cognitive-services-bing-web-api/bing-web-image-thumbnail-expansion.PNG)

If the user clicks the thumbnail, use `webSearchUrl` to take the user to Bing's search results page for images, which contains a collage of the images.

For details about the image answer and images, see [Image Search API](../bing-image-search/search-the-web.md).


### Related searches answer

The [relatedSearches](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#searchresponse-relatedsearches) answer contains a list of the most popular related queries made by other users. Each [query](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#query_obj) in the list includes a query string (`text`), a query string with hit highlighting characters (`displayText`), and a URL (`webSearchUrl`) to Bing's search results page for that query.

```
        {
            "text" : "porsche racing teams",
            "displayText" : "porsche racing teams",
            "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=96C4CF214A0..."
        },
```

Use the `displayText` query string and the `webSearchUrl` URL to create a hyperlink that takes the user to the Bing search results page for the related query. You could also use the `text` query string in your own Web Search API query and display the results yourself.

For information about how to handle the highlighting markers in `displayText`, see [Hit Highlighting](./hit-highlighting.md).  
  
The following shows an example of the related queries usage in Bing.com.  
  
![Related searches example on Bing](./media/cognitive-services-bing-web-api/bing-web-rendered-relatedsearches.GIF)


### Videos answer

The [videos](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v5-reference#videos) answer contains a list of videos that Bing thought were relevant to the query. Each [video](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v5-reference#video) in the list includes the URL of the video, its duration, its dimensions, and its encoding format. The video object also includes the URL of a thumbnail of the video and the thumbnail's dimensions.

```
        {
            "name" : "Mallard Sailing dinghy",
            "description" : "Davilia is a 12 foot \"Mallard\" gunter rigged...",
            "webSearchUrl" : "https:\/\/www.bing.com\/cr?IG=1CAE739681D84...",
            "thumbnailUrl" : "https:\/\/tse2.mm.bing.net\/th?id=OVP.wsKiL...",
            "datePublished" : "2013-11-06T01:56:28",
            "publisher" : [{
                "name" : "YouTube"
            }],
            "contentUrl" : "https:\/\/www.youtube.com\/watch?v=MrVBWZpJjX",
            "hostPageUrl" : "https:\/\/www.bing.com\/cr?IG=1CAE739681D8400DB...",
            "encodingFormat" : "mp4",
            "hostPageDisplayUrl" : "https:\/\/www.youtube.com\/watch?v=MrBWZpJjXo",
            "width" : 1280,
            "height" : 720,
            "duration" : "PT3M47S",
            "motionThumbnailUrl" : "https:\/\/tse2.mm.bing.net\/th?id=OM.oa...",
            "embedHtml" : "<iframe width=\"1280\" height=\"720\" src=\"http:\/\/www....><\/iframe>",
            "allowHttpsEmbed" : true,
            "viewCount" : 19089,
            "thumbnail" : {
                "width" : 300,
                "height" : 168
            },
            "allowMobileEmbed" : true,
            "isSuperfresh" : false
        },
```

Depending on the user's device, you'd typically display a subset of the videos with an option for the user to view the remaining videos. You'd display a thumbnail of the video with the video's length, description (name), and attribution (publisher). 

![List of video thumbnails](./media/cognitive-services-bing-web-api/bing-web-video-thumbnails.PNG)

As the user hovers over the thumbnail you can use `motionThumbnailUrl` to play a thumbnail version of the video. Be sure to attribute the motion thumbnail when you display it.

![Motion thumbnail of a video](./media/cognitive-services-bing-web-api/bing-web-video-motion-thumbnail.PNG)

If the user clicks the thumbnail, the following are the video viewing options:

- Use `hostPageUrl` to view the video on the host website (for example, YouTube)  
  
- Use `webSearchUrl` to view the video in the Bing video browser  

- Use `embdedHtml` to embed the video in your own experience 

For details about the video answer and videos, see [Video Search API](../bing-video-search/search-the-web.md).


### News answer

The [news](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#news) answer contains a list of news articles that Bing thought were relevant to the query. Each [news article](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v5-reference#newsarticle) in the list includes the article's name, description, and URL to the article on the host's website. If the article contains an image, the object includes a thumbnail of the image.

```
        {
            "name" : "WC Sailing Qualifies for America Trophy with...",
            "url" : "http:\/\/www.bing.com\/cr?IG=3445EEF15DAF4FFFBF7...",
            "image" : {
                "contentUrl" : "http:\/\/www.washingtoncollegesports.com\/sports\/sail...",
                "thumbnail" : {
                    "contentUrl" : "https:\/\/www.bing.com\/th?id=ON.1...",
                    "width" : 400,
                    "height" : 272
                }
            },
            "description" : "The Washington College sailing team qualified for a...",
            "provider" : [{
                "_type" : "Organization",
                "name" : "washingtoncollegesports.com"
            }],
            "datePublished" : "2017-04-16T21:56:00"
        },
```


Depending on the user's device, you'd display a subset of the news articles with an option for the user to view the remaining articles. Use `name` and `url` to create a hyperlink that takes the user to the news article on the host's site. If the article includes an image, make the image clickable using `url`. Be sure to use `provider` to attribute the article. 

The following shows an example of how you might display articles in a search results page.

![List of news articles](./media/cognitive-services-bing-web-api/bing-web-news-list.PNG)

For details about the news answer and news articles, see [News Search API](../bing-news-search/search-the-web.md).


## Computation answer

If the user enters a mathematical expression or a unit conversion query, the response may contain a [Computation](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#computation) answer. The `computation` answer contains the normalized expression and its result.  
  
A unit conversion query is a query that converts one unit to another. For example, *How many feet in 10 meters?* or *How many tablespoons in a 1/4 cup?*  
  
The following shows the `computation` answer for *How many feet in 10 meters?*  
  
```  
"computation" : {  
    "id" : "https:\/\/www.bing.com\/api\/v5\/#Computation",  
    "expression" : "10 meters",  
    "value" : "32.808399 feet"  
},  
```  
  
The following shows examples of mathematical queries and their corresponding `computation` answers.  
  
```  
Query: (5+3)(10/2)+8  
  
Encoded query: %285%2B3%29%2810%2F2%29%2B8  
  
"computation" : {  
        "id" : "https:\/\/www.bing.com\/api\/v5\/#Computation",  
        "expression" : "((5+3)*(10\/2))+8",  
        "value" : "48"  
}  
  
  
  
Query: sqrt(4^2+8^2)  
  
Encoded query: sqrt%284^2%2B8^2%29  
  
"computation" : {  
        "id" : "https:\/\/www.bing.com\/api\/v5\/#Computation",  
        "expression" : "sqrt((4^2)+(8^2))",  
        "value" : "8.94427191"  
}  
  
  
  
Query: 30 6/8 - 18 8/16  
  
Encoded query: 30%206%2F8%20-%2018%208%2F16  
  
"computation" : {  
        "id" : "https:\/\/www.bing.com\/api\/v5\/#WolframAlpha",  
        "expression" : "30 6\/8-18 8\/16",  
        "value" : "12.25"  
}  
  
  
  
  
Query: 8^2+11^2-2*8*11*cos(37)  
  
Encoded query: 8^2%2B11^2-2*8*11*cos%2837%29  
  
"computation" : {  
        "id" : "https:\/\/www.bing.com\/api\/v5\/#Computation",  
        "expression" : "(8^2)+(11^2)-(2*8*11*cos(37))",  
        "value" : "44.4401502"  
}  
```  
  
A mathematical expression may contain the following symbols:  
  
|Symbol|Description|  
|------------|-----------------|  
|+|Addition|  
|-|Subtraction|  
|/|Division|  
|*|Multiplication|  
|^|Power|  
|!|Factorial|  
|.|Decimal|  
|()|Precedence grouping|  
|[]|Function|  
  
A mathematical expression may contain the following constants:  
  
|Symbol|Description|  
|------------|-----------------|  
|Pi|3.14159...|  
|Degree|Degree|  
|I|Imaginary number|  
|E|e, 2.71828...|  
|GoldenRatio|Golden ratio, 1.61803...|  
|EulerGamma|Euler's constant, 0.57721...|  
|Catalan|Catalan's constant, 0.91596...|  
|StieltjesGamma[n]|Stieltjes constants|  
  
A mathematical expression may contain the following functions:  
  
|Symbol|Description|  
|------------|-----------------|  
|Sqrt|Square root|  
|Sin[x], Cos[x], Tan[x]<br /><br /> Csc[x], Sec[x], Cot[x]|Trigonometric functions (with arguments in radians)|  
|ArcSin[x], ArcCos[x], ArcTan[x], ArcTan[x,y]<br /><br /> ArcCsc[x], ArcSec[x], ArcCot[x]|Inverse trigonometric functions (giving results in radians)|  
|Exp[x], E^x|Exponential function|  
|Log[x]|Natural logarithm|  
|Log[b,x]|Logarithm of x to the base b|  
|Sinh[x], Cosh[x], Tanh[x]<br /><br /> Csch[x], Sech[x], Coth[x]|Hyperbolic functions|  
|ArcSinh[x], ArcCosh[x], ArcTanh[x]<br /><br /> ArcCsch[x], ArcSech[x], ArcCoth[x]|Inverse hyperbolic functions|  
  
Mathematical expressions that contain variables (for example, 4x+6=18, where x is the variable) are not supported.  


### TimeZone answer  

If the user enters a time or date query, the response may contain a [TimeZone](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#timezone) answer. This answer supports implicit or explicit queries. An implicit query such as *What time is it?*, returns the local time of the user's location. An explicit query such as *What time is it in Seattle?*, returns the local time of Seattle, WA.  
  
The `timeZone` answer provides the name of the location, the current UTC date and time at the specified location, and the UTC offset. If the boundary of the location is within multiple time zones, the answer contains the current UTC date and time of all time zones within the boundary. For example, because Florida State falls within two time zones, the answer contains the local date and time of both time zones.  
  
If the query requests the time of a state or country, Bing determines the primary city within the location's geographical boundary and returns it in the `primaryCityTime` field. If the boundary contains multiple time zones, the remaining time zones are returned in the `otherCityTimes` field.  
  
The following shows example queries that return the `timeZone` answer.  
  
```  
Query: What time is it?  
  
"timeZone" : {  
        "id" : "https:\/\/www.bing.com\/api\/v5\/#TimeZone",  
        "primaryCityTime" : {  
            "location" : "Redmond, Washington, United States",  
            "time" : "2015-10-27T08:38:12.1189231Z",  
            "utcOffset" : "UTC-7"  
        }  
}  
  


Query: What time is it in the Pacific time zone?  
  
"timeZone" : {  
        "id" : "https:\/\/www.bing.com\/api\/v5\/#TimeZone",  
        "primaryCityTime" : {  
            "location" : "Pacific Time Zone",  
            "time" : "2015-10-23T12:33:19.0728146Z",  
            "utcOffset" : "UTC-7"  
        }  
}  
  


Query: Time in Florida?  
  
"timeZone" : {  
        "id" : "https:\/\/www.bing.com\/api\/v5\/#TimeZone",  
        "primaryCityTime" : {  
            "location" : "Tallahassee, Florida, United States",  
            "time" : "2015-10-23T13:04:56.6774389Z",  
            "utcOffset" : "UTC-4"  
        },  
        "otherCityTimes" : [{  
            "location" : "Pensacola",  
            "time" : "2015-10-23T12:04:56.6664294Z",  
            "utcOffset" : "UTC-5"  
        }]  
}  
  


Query: What time is it in the U.S.  
  
"timeZone" : {  
        "id" : "https:\/\/www.bing.com\/api\/v5\/#TimeZone",  
        "primaryCityTime" : {  
            "location" : "Washington, D.C., United States",  
            "time" : "2015-10-23T15:27:59.8892745Z",  
            "utcOffset" : "UTC-4"  
        },  
        "otherCityTimes" : [{  
            "location" : "Honolulu",  
            "time" : "2015-10-23T09:27:59.8892745Z",  
            "utcOffset" : "UTC-10"  
        },  
        {  
            "location" : "Anchorage",  
            "time" : "2015-10-23T11:27:59.8892745Z",  
            "utcOffset" : "UTC-8"  
        },  
        {  
            "location" : "Phoenix",  
            "time" : "2015-10-23T12:27:59.8892745Z",  
            "utcOffset" : "UTC-7"  
        },  
        {  
            "location" : "Los Angeles",  
            "time" : "2015-10-23T12:27:59.8942788Z",  
            "utcOffset" : "UTC-7"  
        },  
        {  
            "location" : "Denver",  
            "time" : "2015-10-23T13:27:59.8812681Z",  
            "utcOffset" : "UTC-6"  
        },  
        {  
            "location" : "Chicago",  
            "time" : "2015-10-23T14:27:59.8892745Z",  
            "utcOffset" : "UTC-5"  
        }]  
}  
```  

  
### SpellSuggestion answer

If Bing determines that the user may have intended to search for something different, the response includes a [SpellSuggestions](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference#spellsuggestions) object. For example, if the user searches for *carlos pen*, Bing may determine that the user likely intended to search for Carlos Pena instead (based on past searches by others of *carlos pen*). The following shows an example spell response.  
  
```  
    "spellSuggestions" : {  
        "id" : "https:\/\/www.bing.com\/api\/v5\/#SpellSuggestions",  
        "value" : [{  
            "text" : "carlos pena",  
            "displayText" : "carlos pena"  
        }]  
    },  
```  
  
The following shows how Bing uses the spelling suggestion.  
    
![Bing spelling suggestion example](./media/cognitive-services-bing-web-api/bing-web-spellingsuggestion.GIF)


## Throttling Requests

[!INCLUDE [cognitive-services-bing-throttling-requests](../../../includes/cognitive-services-bing-throttling-requests.md)]



## Next Steps

To get started quickly with your first request, see [Making Your First Query](./quick-start.md).

Familiarize yourself with the [Web Search API Reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v5-reference). The reference contains the list of endpoints, headers, and query parameters that you'd use to request search results. It also includes definitions of the response objects. 

Bing requires you to display the results in the order given. To learn how to use the ranking response to display the results, see [Ranking Results](./rank-results.md).

Bing returns only a subset of the possible results in each response. If you want to receive more than just the first page of results, see [Paging Webpages](./paging-webpages.md).

To improve your search box user experience, see [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md). As the user enters their query term, you can call this API to get relevant query terms that were used by others.

Be sure to read [Bing Use and Display Requirements](./useanddisplayrequirements.md) so you don't break any of the rules about using the search results.

