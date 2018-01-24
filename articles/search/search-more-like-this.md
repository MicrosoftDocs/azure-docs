---
title: moreLikeThis in Azure Search (preview) | Microsoft Docs
description: Preliminary documentation for the moreLikeThis (preview) feature, exposed in the Azure Search REST API.
services: search
documentationCenter: na
authors: mhko
manager: jlembicz
editor: na

ms.service: search
ms.devlang: rest-api
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: "na"
ms.date: 10/27/2016
ms.author: nateko
---
# moreLikeThis in Azure Search (preview)

`moreLikeThis=[key]` is a query parameter in the [Search API](https://docs.microsoft.com/rest/api/searchservice/search-documents). By specifying the  `moreLikeThis` parameter in a search query, you can find documents that are similar to the document specified by the document key. When a search request is made with `moreLikeThis`, a query is generated with search terms extracted from the given document that describe that document best. The generated query is then used to make the search request. By default, the contents of all `searchable` fields are considered unless the `searchFields` parameter is used to restrict the fields. The `moreLikeThis` parameter cannot be used with the search parameter, `search=[string]`.

## Examples 

Below is an example of a moreLikeThis query. The query finds documents whose description fields are most similar to the field of the source document as specified by the `moreLikeThis` parameter.

```  
Get /indexes/hotels/docs?moreLikeThis=1002&searchFields=description&api-version=2016-09-01-Preview
```  

```  
POST /indexes/hotels/docs/search?api-version=2016-09-01-Preview
    {  
      "moreLikeThis": "1002",  
      "searchFields": "description"  
    }  
```  

## Feature availability

The moreLikeThis feature is currently in preview and only supported in the preview api-versions, `2015-02-28-Preview` and `2016-09-01-Preview`. Because the API version is specified on the request, it's possible to combine generally available (GA) and preview APIs in the same app. However, preview APIs are not under SLA and features may change, so we do not recommend using them in production applications.