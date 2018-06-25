---
title: "Bing Custom Search: Get Custom Autosuggest suggestions | Microsoft Docs"
description: Describes how to retrieve custom Autosuggest suggestions
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-custom-search
ms.topic: article
ms.date: 09/28/2017
ms.author: v-brapel
---

# Get custom suggestions
Before sending queries to Bing Custom Search, call the Custom Autosuggest API to make search term suggestions and enhance the search experience. The Custom Autosuggest API returns a list of suggested queries based on a partial query string that the user provides. Any relevant custom query terms that you specify appear before the suggestions that Autosuggest generates. For more information, see [Define custom search suggestions](define-custom-suggestions.md).

## Endpoint
To get suggested queries using the Bing Custom Search API, send a `GET` request to the following endpoint.

```
GET https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/Suggestions 
```

## Response JSON
The response contains a list of SearchAction objects that contain the suggested query terms.

```
        {  
            "displayText" : "sailing lessons seattle",  
            "query" : "sailing lessons seattle",  
            "searchKind" : "CustomSearch"  
        },  
```

Each suggestion includes a `displayText` and `query` field. The `displayText` field contains the suggested query that you use to populate your search box's drop-down list.

If the user selects a suggested query from the drop-down list, use the query term in the `query` field when calling the [Bing Custom Search API](overview.md).

## Throttling requests

[!INCLUDE [cognitive-services-bing-throttling-requests](../../../includes/cognitive-services-bing-throttling-requests.md)]

## Next steps

- [Call your custom search](./search-your-custom-view.md)
- [Configure your hosted UI experience](./hosted-ui.md)