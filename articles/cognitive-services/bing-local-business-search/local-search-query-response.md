---
title: Bing Local Business Search query and response | Microsoft Docs
description: How to use the Bing Local Business Search API to search the web.
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.component: bing-local-business
ms.topic: article
ms.date: 10/18/2018
ms.author: rosh; v-gedod
---

# Bing Local Business Search request
To create the request URL, append `q=<requestString>` to the Local Search endpoint as shown in the following examples. You must include the `Ocp-Apim-Subscription-Key` header.

GET:
````
https://api.cognitive.microsoft.com/bing/localbusinesses/v7.0/search[?q][&localCategories][&cc][&mkt][&safesearch][&setlang][&count][&first][&localCircularView][&localMapView]
````
Example:
````
https://api.cognitive.microsoft.com/bing/localbusinesses/v7.0/search?q=restaurant+in+Bellevue

````
Complete request syntax and code scenarios are shown in the quickstarts:
- [Local Business Search quickstart](quickstarts/local-quickstart.md)
- [Local Business Search Java quickstart](quickstarts/local-search-java-quickstart.md)
- [Local Business Search Node quickstart](quickstarts/local-search-node-quickstart.md)
- [Local Business Search Python quickstart](quickstarts/local-search-python-quickstart.md)

The response contains a `SearchResponse` object. If Bing finds places that are relevant, the object includes the `places` field. If Bing does not find relevant entities, the response object will not include the `places` field.

````
{
   "_type": "SearchResponse",
   "queryContext": {
      "originalQuery": "restaurant in Bellevue"
   },
   "places": {
      "totalEstimatedMatches": 10,

. . . 

````

## Local Business Search endpoint
The **Local Business Search API**  includes one endpoint that returns results from the Web based on a query. 

## Endpoint
To get localized results, use the endpoint and include the `Ocp-Apim-Subscription-Key` header. There are several ways to specify the results.  See [Headers](local-search-reference.md#headers) and [Parameters](local-search-reference.md#query-parameters) for the options. This example uses the `count` parameter to limit results to one, beginning with the first result as specified by `first=0`.

GET:
````
https://api.cognitive.microsoft.com/bing/localbusinesses/v7.0/search?q=restaurant+Bellevue&mkt=en-us&count=1&first=0

````

## Response

The JSON response includes places specified by `?q=restaurant+in+Bellevue`.

````
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
 
````

## Attributes of Places response objects

The JSON results include the following attributes:
* _type
* address
* entityPresentationInfo
* geo
* id
* name
* routeablePoint
* telephone
* url

For general information about headers, parameters, market codes, response objects, errors, etc., see the [Bing Local Business Search API v7](local-search-reference.md) reference.

> [!NOTE]
> You, or a third party on your behalf, may not use, retain, store, cache, share, or distribute any data from the Local Business Search API for the purpose of testing, developing, training, distributing or making available any non-Microsoft service or feature. 

## Throttling requests

[!INCLUDE [cognitive-services-bing-throttling-requests](../../../includes/cognitive-services-bing-throttling-requests.md)]


## Next steps
- [Local Business Search quickstart](quickstarts/local-quickstart.md)
- [Local Business Search Java quickstart](quickstarts/local-search-java-quickstart.md)
- [Local Business Search Node quickstart](quickstarts/local-search-node-quickstart.md)
- [Local Business Search Python quickstart](quickstarts/local-search-python-quickstart.md)