---
title: What is Bing Local Business Search? | Microsoft Docs
description: How to use the Bing Local Search API to search the web locally.
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.technology: bing-local-search
ms.topic: article
ms.date: 08/02/2018
ms.author: rosh
---

# Search the Web locally
The Local Search API is similar to other Bing endpoints, but the Local Search API query gets localized results: businesses or places relevant to the search.  The Local Search API currently only supports en-us market and language.

To get local search results, call this API instead of the more general Web Search API. 

The Local Search query can specify an entity such as "<business-name> in Bellevue", or it can use a category such as "Italian restaurants near me".

Search parameters can also specify longitude/latitude center and radius to limit the results geographically. There is also a bounding box defined by the southeast and northwest corners of a local map.

After the user enters query terms, URL encode the terms before setting the `q=""` query parameter. For example, if the user enters restaurant in Bellevue, set `q=restaurant+Bellevue` or `q=restaurant%20Bellevue`. 

Currently, the only market supported is en-US.  Other options may return results from nearest match.

Set pagination, if needed, using the `count` and `first` parameters. The `count` parameter specifies the number of results.  The `first` parameter specifies the index of the first result.

## Request
To create the request URL, append `q="requestString` to the Local Search endpoint as shown in the following example. Include the `Ocp-Apim-Subscription-Key` header.

GET:
````
https://api.cognitive.microsoft.com/bing/localbusinesses/v7.0/search[?q][&localCategories][&cc][&mkt][&safesearch][&setlang][&count][&first][&localCircularView][&localMapView]
````
Example:
````
https://api.cognitive.microsoft.com/bing/localbusinesses/v7.0/search?q=restaurant+in+Bellevue

````
Complete request syntax is shown in [Local Search quickstart](local-quickstart.md) and [Local Search Java quickstart](local-search-java-quickstart.md).

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

## Local Search endpoint
The **Local Search API**  includes one endpoint that returns places from the Web based on a query. 

## Endpoint
To get local results, use the endpoint. Include the `Ocp-Apim-Subscription-Key` header. Use [headers and URL parameters](local-search-reference.md) to specify other options.

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

For general information about headers, parameters, market codes, response objects, errors, etc., see the [Bing Local Search API v7](local-search-reference.md) reference.

> [!NOTE]
> You, or a third party on your behalf, may not use, retain, store, cache, share, or distribute any data from the Local Search API for the purpose of testing, developing, training, distributing or making available any non-Microsoft service or feature. 

## Throttling requests

[!INCLUDE [cognitive-services-bing-throttling-requests](../../../includes/cognitive-services-bing-throttling-requests.md)]


## Next steps
- [Local Search quickstart](local-quickstart.md)
- [Local Search Java quickstart](local-search-java-quickstart.md)
- [Local Search Node quickstart](local-search-node-quickstart.md)
- [Local Search Python quickstart](local-search-python-quickstart.md)