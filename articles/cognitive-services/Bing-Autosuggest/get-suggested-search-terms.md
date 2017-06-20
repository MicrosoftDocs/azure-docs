---
title: Get suggested search query terms | Microsoft Docs
description: Shows how to use the Bing Autosuggest API to get search terms used by others.
services: cognitive-services
author: swhite-msft
manager: ehansen

ms.assetid: 6F4AFEDA-71A7-48C1-B3E2-D0D430428CDC
ms.service: cognitive-services
ms.technology: bing-autosuggest
ms.topic: article
ms.date: 01/12/2017
ms.author: scottwhi
---

# Getting Suggested Search Query Terms

Your user experience must provide a search box where the user enters a search query term. To improve the search box experience, you'd call the Autosuggest API to get back a list of suggested queries based on the partial query string the user has entered. You'd then display the suggestions in a drop-down list. The suggested terms are based on suggested queries that other users have searched on and user intent. 

You'd call this API each time the user types a new character in the search box. The completeness of the query string impacts the relevance of the suggested query terms that the API returns. The more complete the query string, the more relevant the list of suggested query terms are. For example, the suggestions that the API may return for *s* are likely to be less relevant than the queries it returns for *sailing dinghies*. 

The following example shows a request that returns the suggested query strings for *sail*. Remember to URL encode the user's partial query term when you set the [q](https://docs.microsoft.com/rest/api/cognitiveservices/bing-autosuggest-api-v5-reference#query) query parameter. For example, if the user entered *sailing les*, set `q` to *sailing+les* or *sailing%20les*.
  
```  
GET https://api.cognitive.microsoft.com/bing/v5.0/suggestions?q=sail&mkt=en-us HTTP/1.1  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
X-MSEdge-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357,long:-122.3295,re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
```  


> [!NOTE]
> Version 7 Preview request:

> ```  
> GET https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q=sail&mkt=en-us HTTP/1.1  
> Ocp-Apim-Subscription-Key: 123456789ABCDE  
> X-MSEdge-ClientIP: 999.999.999.999  
> X-Search-Location: lat:47.60357,long:-122.3295,re:100  
> X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
> Host: api.cognitive.microsoft.com  
> ```  


The response contains a list of [SearchAction](https://docs.microsoft.com/rest/api/cognitiveservices/bing-autosuggest-api-v5-reference#searchaction) objects that contain the suggested query terms.

```
        {  
            "url" : "https:\/\/www.bing.com\/search?q=sailing+lessons+seattle&FORM=USBAPI",  
            "displayText" : "sailing lessons seattle",  
            "query" : "sailing lessons seattle",  
            "searchKind" : "WebSearch"  
        },  
```

Each suggestion includes a `displayText`, `query` and, `url` field. The `displayText` field contains the suggested query that you use to populate your search box's drop-down list. You must display all suggestions that the response includes, and in the given order.  

The following shows an example of drop-down search box with suggested query terms. 

![Autosuggest drop-down search box list](./media/cognitive-services-bing-autosuggest-api/bing-autosuggest-drop-down-list.PNG)

If the user selects a suggested query from the drop-down list, you'd use the query term in the `query` field to call the [Bing Search API](../bing-web-search/search-the-web.md) and display the results yourself. Or, you could use the URL in the `url` field to send the user to the Bing search results page instead.  
  

## Throttling Requests

[!INCLUDE [cognitive-services-bing-throttling-requests](../../../includes/cognitive-services-bing-throttling-requests.md)]


## Next Steps

To get started quickly with your first request, see [Making Your First Query](./quick-start.md).

Familiarize yourself with the [Autosuggest API Reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-autosuggest-api-v5-reference). The reference contains the list of endpoints, headers, and query parameters that you'd use to request suggested query terms, and the definitions of the response objects. 

Learn how to search the web by using the [Web Search API](../bing-web-search/search-the-web.md).

Be sure to read [Bing Use and Display Requirements](./useanddisplayrequirements.md) so you don't break any of the rules about using the search results.

