---
title: "Bing Custom Search: Search a custom view | Microsoft Docs"
description: Describes how to search a custom view of the web
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 09/28/2017
ms.author: v-brapel
---

# Search your custom instance
Before making your first call to the Custom Search API to get search results for your instance, you need to get a Cognitive Services subscription key. To get a key for Custom Search API, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search-api).

> [!NOTE]
> Existing Bing Custom Search customers who have a preview key provisioned on or before October 15 2017 will be able to use their keys until November 30 2017, or until they have exhausted the maximum number of queries allowed. Afterward, they need to migrate to the generally available version on Azure.

To get search results for your custom search instance, send an HTTP GET request to:

`https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search`

The request must specify the following query parameters:

- [q](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-search-api-v7-reference#query) &mdash; Contains the user's search term
- [customConfig](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-custom-search-api-v7-reference#customconfig) &mdash; Identifies your custom search instance. 

Although optional, the request should also specify the [mkt](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-search-api-v7-reference#mkt) query parameter, which identifies the market where you want the results to come from. For a list of optional query parameters, see [Query Parameters](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-search-api-v7-reference#queryparameters). All query parameter values must be URL encoded. 

The request must specify the [Ocp-Apim-Subscription-Key](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-search-api-v7-reference#subscriptionkey) header. For a list of all request and response headers, see [Headers](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-search-api-v7-reference#headers). 

The following shows a search request that includes all the suggested query parameters and headers. If it's your first time calling any of the Bing APIs, don't include the client ID header. Only include the client ID if you've previously called a Bing API and Bing returned a client ID for the user and device combination.  

```
GET https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?q=sailing+dinghies &customConfig=1234ABCD&mkt=en-us HTTP/1.1 
Ocp-Apim-Subscription-Key: 123456789ABCDE   
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)   
X-Search-ClientIP: 999.999.999.999   
X-Search-Location: lat:47.60357;long:-122.3295;re:100   
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>   
Host: api.cognitive.microsoft.com 
```

The request returns a JSON response that limits the results to the content found in your custom search instance.   

The following shows the answers that the JSON response may contain.  For a list of all response objects see [Response objects](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-custom-search-api-v7-reference#response-objects).
 
```
{ 
    "_type" : "SearchResponse",  
    "webPages" : {
        "webSearchUrl": "https://www.bing.com/search?q=<SEARCH-TERM>",
        "totalEstimatedMatches": 667000000,
        "value": [
            {
                "id": "https://cognitivegblppe.azure-api.net/api/v7/#WebPages.0",
                "name": "Contosos - Official Home Page",
                "url": "http://www.contoso.com/en-us",
                "displayUrl": ...,
                "snippet": "At contoso our mission and values ...",            
                "dateLastCrawled": "2017-09-29T22:32:00",
                "openGraphImage": {
                    "contentUrl": ...,
                    "width": 0,
                    "height": 0
                }
            },
            {
                ...
            }            
        ]
    }     
} 
```

The [webPages](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-search-api-v7-reference#search-response-webpages) answer contains a list of webpages that Bing thought were relevant to the query. Each webpage includes the page's name, URL, display URL, short description of the content and the date Bing found the content. 

```
{ 
    "name" : "Dinghy sailing - Wikipedia", 
    "url" : "https:\/\/www.bing.com\/cr?IG=3A43CA5...", 
    "displayUrl" : "https:\/\/en.wikipedia.org\/wiki\/Dinghy_sailing", 
    "snippet" : "Dinghy sailing is the activity of sailing small boats...", 
    "dateLastCrawled" : "2017-04-05T16:25:00" 
}, 
```

Use `name` and `url` to create a hyperlink that takes the user to the webpage.

### Next steps
- [Call your custom view with C#](./call-endpoint-csharp.md)
- [Call your custom view with Java](./call-endpoint-java.md)
- [Call your custom view with NodeJs](./call-endpoint-nodejs.md)
- [Call your custom view with Python](./call-endpoint-python.md)