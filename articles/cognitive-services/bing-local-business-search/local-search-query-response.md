---
title: Sending and using Bing Local Business Search API queries and responses | Microsoft Docs
titleSuffix: Azure Cognitive Services
description: Use this article to learn how to send and use search queries with the Bing Local Business Search API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: article
ms.date: 06/26/2018
ms.author: rosh
---

# Sending and using Bing Local Business Search API queries and responses

You can get local results from the Bing Local Business Search API by sending a search query to its endpoint and including the `Ocp-Apim-Subscription-Key` header, which is required. Along with available [headers](local-search-reference.md#headers) and [parameters](local-search-reference.md#query-parameters), Searches can be customized by specifying [geographic boundaries](specify-geographic-search.md) for the area to be searched, and the [categories](local-search-query-response.md) of places returned.

## Creating a request

To send a request to the Bing Local Business Search API, append a search term to the `q=` parameter before adding it to the API endpoint, and including the `Ocp-Apim-Subscription-Key` header. For example:

`https://api.cognitive.microsoft.com/bing/localbusinesses/v7.0/search?q=restaurant+in+Bellevue`

The full request URL syntax is shown below. See the Bing Local Business Search API [quickstarts](quickstarts/local-quickstart.md), and reference content for [headers](local-search-reference.md#headers) and [parameters](local-search-reference.md#query-parameters) for more information on sending requests. 

For information on local search categories, see [Search categories for the Bing Local Business Search API](local-categories.md).

```
https://api.cognitive.microsoft.com/bing/v7.0/localbusinesses/search[?q][&localCategories][&cc][&mkt][&safesearch][&setlang][&count][&first][&localCircularView][&localMapView]
```

## Using responses

JSON responses from the Bing Local Business Search API contain a `SearchResponse` object. The API will return relevant search results in the `places` field. if no results are found, the `places` field will not be included in the response.

[!INCLUDE [cognitive-services-bing-url-note](../../../includes/cognitive-services-bing-url-note.md)]

```
{
   "_type": "SearchResponse",
   "queryContext": {
      "originalQuery": "restaurant in Bellevue"
   },
   "places": {
      "totalEstimatedMatches": 10,
. . . 
```

### Search result attributes

The JSON results returned by the API include the following attributes:

* _type
* address
* entityPresentationInfo
* geo
* id
* name
* routeablePoint
* telephone
* url

For general information about headers, parameters, market codes, response objects, errors, etc., see the [Bing Local Search API v7](local-search-reference.md) reference.

> [!NOTE]
> You, or a third party on your behalf, may not use, retain, store, cache, share, or distribute any data from the Local Search API for the purpose of testing, developing, training, distributing or making available any non-Microsoft service or feature. 


## Example JSON response

The following JSON response includes search results specified by the query `?q=restaurant+in+Bellevue`.

```json
Vary: Accept-Encoding
BingAPIs-TraceId: 5376FFEB65294E24BB9F91AD70545826
BingAPIs-SessionId: 06ED7CEC80F746AA892EDAAC97CB0CB4
X-MSEdge-ClientID: 112C391E72C0624204153594738C63DE
X-MSAPI-UserState: aeab
BingAPIs-Market: en-US
X-Search-ResponseInfo: InternalResponseTime=659,MSDatacenter=CO4
X-MSEdge-Ref: Ref A: 5376FFEB65294E24BB9F91AD70545826 Ref B: BY3EDGE0306 Ref C: 2018-10-16T16:26:15Z
apim-request-id: fe54f585-7c54-4bf5-8b92-b9bede2b710a
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
Cache-Control: max-age=0, private
Date: Tue, 16 Oct 2018 16:26:15 GMT
P3P: CP="NON UNI COM NAV STA LOC CURa DEVa PSAa PSDa OUR IND"
Content-Length: 978
Content-Type: application/json; charset=utf-8
Expires: Tue, 16 Oct 2018 16:25:15 GMT

{
  "_type": "SearchResponse",
  "queryContext": {
    "originalQuery": "restaurant Bellevue"
  },
  "places": {
    "totalEstimatedMatches": 50,
    "value": [{
      "_type": "LocalBusiness",
      "id": "https:\/\/cognitivegblppe.azure-api.net\/api\/v7\/#Places.0",
      "name": "Facing East Taiwanese Restaurant",
      "url": "http:\/\/litadesign.wix.com\/facingeastrestaurant",
      "entityPresentationInfo": {
        "entityScenario": "ListItem",
        "entityTypeHints": ["Place", "LocalBusiness", "Restaurant"]
      },
      "geo": {
        "latitude": 47.6199188232422,
        "longitude": -122.202796936035
      },
      "routablePoint": {
        "latitude": 47.6199188232422,
        "longitude": -122.201713562012
      },
      "address": {
        "streetAddress": "1075 Bellevue Way NE Ste B2",
        "addressLocality": "Bellevue",
        "addressRegion": "WA",
        "postalCode": "98004",
        "addressCountry": "US",
        "neighborhood": "Bellevue",
        "text": "1075 Bellevue Way NE Ste B2, Bellevue, WA 98004"
      },
      "telephone": "(425) 688-2986"
    }],
    "searchAction": {
      "location": [{
        "name": "Bellevue, Washington"
      }],
      "query": "restaurant"
    }
  }
}
 
```

## Throttling requests

[!INCLUDE [cognitive-services-bing-throttling-requests](../../../includes/cognitive-services-bing-throttling-requests.md)]


## Next steps
- [Local Business Search quickstart](quickstarts/local-quickstart.md)
- [Local Business Search Java quickstart](quickstarts/local-search-java-quickstart.md)
- [Local Business Search Node quickstart](quickstarts/local-search-node-quickstart.md)
- [Local Business Search Python quickstart](quickstarts/local-search-python-quickstart.md)
