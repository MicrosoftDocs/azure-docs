---
title: "Bing Custom Search: Get started | Microsoft Docs"
description: Describes how to create a custom search instance
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 09/28/2017
ms.author: v-brapel
---

# Your first Bing Custom Search instance
To use Bing Custom Search, you need to create a custom search instance that defines your view or slice of the web. The instance contains settings that specify the public domains, subsites, and webpages that you want Bing to search, and any ranking adjustments. To create the instance, use the Bing Custom Search [portal](https://customsearch.ai). 

## Create a custom search instance

To create a Bing Custom Search instance:

1.	Sign in to the portal using a Microsoft account (MSA). Click the Sign in button. If you don’t have an MSA, click **Create a Microsoft account**. Since it’s your first time using the portal, it’ll ask for permissions to access your data. Click **Yes**.
2.	After signing in, click **New search instance** and name the instance. Use a name that’s meaningful and describes the type of content the search returns. You can change the name at any time. 
3.	In the **Definition Editor**, click the **Active** tab and enter the URL of one or more sites you want to include in your search.
4.	To confirm that your instance returns results, enter a query in the preview pane on the right. If there are no results, specify new site. Bing returns results only for public sites that it has indexed.
5.	 Click the **API Endpoint** tab and copy the **Custom Configuration ID**. You need this ID to call the Custom Search API.

## Create a search request
Before making your first call to the Custom Search API to get search results for your instance, you need to get a Cognitive Services subscription key. To get a key for Custom Search API, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search-api). Use the same MSA that you used to create your instance in the portal.
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

The following shows the answers that the JSON response may contain.
 
```
{ 
    "_type" : "SearchResponse", 
    "queryContext" : {...}, 
    "webPages" : {
        "webSearchUrl": "https://www.bing.com/search?q=<SEARCH-TERM>",
        "totalEstimatedMatches": 667000000,
        "value": [
            ...           
            "openGraphImage": {
              "contentUrl": "http://mw2.wsj.net/mw5/content/logos/mw_logo_social.png",
              "width": 0,
              "height": 0
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
For examples, see [C#](./call-endpoint-csharp.md) | [Java](./call-endpoint-java.md) | [Node.js](./call-endpoint-nodejs.md) | [Python](call-endpoint-python.md).


## Next steps
- [Hosted UI](./hosted-ui.md)
- [Define your custom view](./define-your-custom-view.md)
- [Hit highlighting](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)
