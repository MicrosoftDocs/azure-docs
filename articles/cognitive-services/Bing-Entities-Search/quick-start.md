---
title: "Quickstart: Bing Entity Search API"
description: Shows how to get started using the Bing Entity Search API.
services: cognitive-services
author: swhite-msft
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-entity-search
ms.topic: quickstart
ms.date: 07/06/2017
ms.author: scottwhi
---

# Quickstart: Making your first Bing Entity Search request

The Bing Entity Search API sends a search query to Bing and gets results that include entities and places. Place results include restaurants, hotel, or other local businesses. For places, the query can specify the name of the local business or it can ask for a list (for example, restaurants near me). Entity results include persons, places, or things. Place in this context is tourist attractions, states, countries, etc. 

## First steps

Before you can make your first call, you need to get a Cognitive Services subscription key. To get a key, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-entities-search-api). (If the Entities Search API isn't visible at the top, click the **Search** tab and scroll down until you see it.)

## The endpoint

To get entity and place search results, send a GET request to the following endpoint:  
  
```
https://api.cognitive.microsoft.com/bing/v7.0/entities
```

The request must use the HTTPS protocol.

We recommend that all requests originate from a server. Distributing the key as part of a client application provides more opportunity for a malicious third party to access it. Also, making calls from a server provides a single upgrade point for future versions of the API.

## Specifying query parameters and headers

The request must specify the [q](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#query) query parameter, which contains the user's search term. The request must also specify the [mkt](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#mkt) query parameter, which identifies the market where you want the results to come from. For a list of optional query parameters, see [Query Parameters](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#query-parameters). URL encode all query parameters.  
  
The request must specify the [Ocp-Apim-Subscription-Key](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#subscriptionkey) header. Although optional, you are encouraged to also specify the following headers:  
  
-   [User-Agent](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#useragent)  
-   [X-MSEdge-ClientID](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#clientid)  
-   [X-MSEdge-ClientIP](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#clientip)  
-   [X-Search-Location](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#location)  

The client IP and location headers are important for returning location aware content.  

For a list of all request and response headers, see [Headers](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#headers).

## The request

The following shows an entities request that includes all the suggested query parameters and headers. 

```  
GET https://api.cognitive.microsoft.com/bing/v7.0/entities?q=mount+rainier&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 822)  
X-Search-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357;long:-122.3295;re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  

If it's your first time calling any of the Bing APIs, don't include the client ID header. Only include the client ID if you've previously called a Bing API and Bing returned a client ID for the user and device combination.

## The response

The following shows the response to the previous request. The example also shows the Bing-specific response headers. For information about the response object, see [SearchResponse](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#searchresponse).

```
BingAPIs-TraceId: 76DD2C2549B94F9FB55B4BD6FEB6AC
X-MSEdge-ClientID: 1C3352B306E669780D58D607B96869
BingAPIs-Market: en-US

{
    "_type" : "SearchResponse",
    "queryContext" : {
        "originalQuery" : "mount rainier"
    },
    "entities" : {
        "queryScenario" : "DominantEntity",
        "value" : [{
            "contractualRules" : [{
                "_type" : "ContractualRules\/LicenseAttribution",
                "targetPropertyName" : "description",
                "mustBeCloseToContent" : true,
                "license" : {
                    "name" : "CC-BY-SA",
                    "url" : "http:\/\/creativecommons.org\/licenses\/by-sa\/3.0\/"
                },
                "licenseNotice" : "Text under CC-BY-SA license"
            },
            {
                "_type" : "ContractualRules\/LinkAttribution",
                "targetPropertyName" : "description",
                "mustBeCloseToContent" : true,
                "text" : "en.wikipedia.org",
                "url" : "http:\/\/en.wikipedia.org\/wiki\/Mount_Rainier"
            },
            {
                "_type" : "ContractualRules\/MediaAttribution",
                "targetPropertyName" : "image",
                "mustBeCloseToContent" : true,
                "url" : "http:\/\/en.wikipedia.org\/wiki\/Mount_Rainier"
            }],
            "webSearchUrl" : "https:\/\/www.bing.com\/search?q=Mount%20Rainier...",
            "name" : "Mount Rainier",
            "image" : {
                "name" : "Mount Rainier",
                "thumbnailUrl" : "https:\/\/www.bing.com\/th?id=A21890c0e1f...",
                "provider" : [{
                    "_type" : "Organization",
                    "url" : "http:\/\/en.wikipedia.org\/wiki\/Mount_Rainier"
                }],
                "hostPageUrl" : "http:\/\/upload.wikimedia.org\/wikipedia...",
                "width" : 110,
                "height" : 110
            },
            "description" : "Mount Rainier, Mount Tacoma, or Mount Tahoma is the highest...",
            "entityPresentationInfo" : {
                "entityScenario" : "DominantEntity",
                "entityTypeHints" : ["Attraction"],
                "entityTypeDisplayHint" : "Mountain"
            },
            "bingId" : "9ae3e6ca-81ea-6fa1-ffa0-42e1d78906"
        }]
    }
}
```



## Next steps

Try out the API. Go to [Entities Search API Testing Console](https://dev.cognitive.microsoft.com/docs/services/7a3fb374be374859a823b79fd938cc65/). 

For details about consuming the response objects, see [Searching the Web for entities and places](./search-the-web.md).

Be sure to read [Bing Use and Display Requirements](./use-display-requirements.md) so you don't break any of the rules about using the search results.
