---
title: Bing Local Search API overview | Microsoft Docs
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

The Local Search query can specify an entity such as "El Gaucho in Bellevue", or it can use a category such as "Italian restaurants near me".

Search parameters can also specify longitude/latitude center and radius to limit the results geographically. There is also a bounding box defined by the southeast and northwest corners of a local map.

After the user enters query terms, URL encode the terms before setting the `q=""` query parameter. For example, if the user enters restaurant in Bellevue, set `q=restaurant+Bellevue` or `q=restaurant%20Bellevue`. 

## Request
To create the request URL, append `q="requestString` to the Local Search endpoint as shown in the following example. Include the `Ocp-Apim-Subscription-Key` header.

GET:
````
https://api.cognitive.microsoft.com/bing/localbusinesses/v7.0/search[?q][&localCategories][&cc][&mkt][&safesearch][&setlang][&count][&first][&localCircularView][&localMapView]

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
https://api.cognitive.microsoft.com/bing/localbusinesses/v7.0/search?q=restaurant+in+Bellevue&mkt=en-us

````

## Response

The JSON response includes places specified by `?q=restaurant+in+Bellevue`.

````
Vary: Accept-Encoding
BingAPIs-TraceId: 2A09420075714C3A89A67F6A028F37B3
BingAPIs-SessionId: 6F12CCE6D7DB46B7AEAE2C5DB9C75319
X-MSEdge-ClientID: 19E06CE7535F6D9B245A606152136C46
X-MSAPI-UserState: c4ef
BingAPIs-Market: en-US
X-Search-ResponseInfo: InternalResponseTime=694,MSDatacenter=CO4
X-MSEdge-Ref: Ref A: 2A09420075714C3A89A67F6A028F37B3 Ref B: BY3EDGE0205 Ref C: 2018-10-12T22:13:35Z
apim-request-id: 49c328c0-b8b7-44c1-9fdb-80d6f6f3b17f
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
Cache-Control: max-age=0, private
Date: Fri, 12 Oct 2018 22:13:35 GMT
P3P: CP="NON UNI COM NAV STA LOC CURa DEVa PSAa PSDa OUR IND"
Content-Length: 7438
Content-Type: application/json; charset=utf-8
Expires: Fri, 12 Oct 2018 22:12:35 GMT

{
  "_type": "SearchResponse",
  "queryContext": {
    "originalQuery": "restaurant in Bellevue"
  },
  "places": {
    "totalEstimatedMatches": 10,
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
    }, {
      "_type": "LocalBusiness",
      "id": "https:\/\/cognitivegblppe.azure-api.net\/api\/v7\/#Places.1",
      "name": "Seastar Restaurant & Raw Bar",
      "url": "http:\/\/seastarrestaurant.com\/",
      "entityPresentationInfo": {
        "entityScenario": "ListItem",
        "entityTypeHints": ["Place", "LocalBusiness", "Restaurant"]
      },
      "geo": {
        "latitude": 47.6123886108398,
        "longitude": -122.196937561035
      },
      "routablePoint": {
        "latitude": 47.6123962402344,
        "longitude": -122.196243286133
      },
      "address": {
        "streetAddress": "205 108th Ave NE",
        "addressLocality": "Bellevue",
        "addressRegion": "WA",
        "postalCode": "98004",
        "addressCountry": "US",
        "neighborhood": "Bellevue",
        "text": "205 108th Ave NE, Bellevue, WA, 98004"
      },
      "telephone": "(425) 456-0010"
    }, {
      "_type": "LocalBusiness",
      "id": "https:\/\/cognitivegblppe.azure-api.net\/api\/v7\/#Places.2",
      "name": "Palomino",
      "url": "http:\/\/www.palomino.com\/location.php?c=bellevue",
      "entityPresentationInfo": {
        "entityScenario": "ListItem",
        "entityTypeHints": ["Place", "LocalBusiness", "Restaurant"]
      },
      "geo": {
        "latitude": 47.6165084838867,
        "longitude": -122.201179504395
      },
      "routablePoint": {
        "latitude": 47.6165046691895,
        "longitude": -122.201698303223
      },
      "address": {
        "streetAddress": "610 Bellevue Way NE",
        "addressLocality": "Bellevue",
        "addressRegion": "WA",
        "postalCode": "98004",
        "addressCountry": "US",
        "neighborhood": "Downtown",
        "text": "610 Bellevue Way NE, Bellevue, WA, 98004"
      },
      "telephone": "(425) 455-7600"
    }, {
      "_type": "LocalBusiness",
      "id": "https:\/\/cognitivegblppe.azure-api.net\/api\/v7\/#Places.3",
      "name": "Earls Kitchen + Bar",
      "url": "https:\/\/earls.ca\/locations\/bellevue",
      "entityPresentationInfo": {
        "entityScenario": "ListItem",
        "entityTypeHints": ["Place", "LocalBusiness", "Restaurant"]
      },
      "geo": {
        "latitude": 47.6169700622559,
        "longitude": -122.201232910156
      },
      "routablePoint": {
        "latitude": 47.6169662475586,
        "longitude": -122.201713562012
      },
      "address": {
        "streetAddress": "700 Bellevue Way NE Ste 130",
        "addressLocality": "Bellevue",
        "addressRegion": "WA",
        "postalCode": "98004",
        "addressCountry": "US",
        "neighborhood": "Bellevue",
        "text": "700 Bellevue Way NE Ste 130, Bellevue, WA, 98004"
      },
      "telephone": "(425) 452-3275"
    }, {
      "_type": "LocalBusiness",
      "id": "https:\/\/cognitivegblppe.azure-api.net\/api\/v7\/#Places.4",
      "name": "JOEY Restaurant",
      "url": "http:\/\/joeyrestaurants.com\/",
      "entityPresentationInfo": {
        "entityScenario": "ListItem",
        "entityTypeHints": ["Place", "LocalBusiness", "Restaurant"]
      },
      "geo": {
        "latitude": 47.6176681518555,
        "longitude": -122.201263427734
      },
      "routablePoint": {
        "latitude": 47.61767578125,
        "longitude": -122.201713562012
      },
      "address": {
        "streetAddress": "800 Bellevue Way NE",
        "addressLocality": "Bellevue",
        "addressRegion": "WA",
        "postalCode": "98004",
        "addressCountry": "US",
        "neighborhood": "Bellevue",
        "text": "800 Bellevue Way NE, Bellevue, WA, 98004"
      },
      "telephone": "(425) 637-1177"
    }, {
      "_type": "LocalBusiness",
      "id": "https:\/\/cognitivegblppe.azure-api.net\/api\/v7\/#Places.5",
      "name": "Cactus Restaurants",
      "url": "http:\/\/www.cactusrestaurants.com\/location\/bellevue-square",
      "entityPresentationInfo": {
        "entityScenario": "ListItem",
        "entityTypeHints": ["Place", "LocalBusiness", "Restaurant"]
      },
      "geo": {
        "latitude": 47.616569519043,
        "longitude": -122.203987121582
      },
      "routablePoint": {
        "latitude": 47.6165962219238,
        "longitude": -122.201705932617
      },
      "address": {
        "streetAddress": "535 Bellevue Sq",
        "addressLocality": "Bellevue",
        "addressRegion": "WA",
        "postalCode": "98004",
        "addressCountry": "US",
        "neighborhood": "Bellevue",
        "text": "535 Bellevue Sq, Bellevue, WA, 98004"
      },
      "telephone": "(425) 455-4321"
    }, {
      "_type": "LocalBusiness",
      "id": "https:\/\/cognitivegblppe.azure-api.net\/api\/v7\/#Places.6",
      "name": "McCormick & Schmick's Seafood & Steaks",
      "url": "http:\/\/www.mccormickandschmicks.com\/locations\/seattle-washington\/bellevue-washington\/bellevuewayne.aspx",
      "entityPresentationInfo": {
        "entityScenario": "ListItem",
        "entityTypeHints": ["Place", "LocalBusiness", "Restaurant"]
      },
      "geo": {
        "latitude": 47.6169700622559,
        "longitude": -122.201232910156
      },
      "routablePoint": {
        "latitude": 47.6169662475586,
        "longitude": -122.201713562012
      },
      "address": {
        "streetAddress": "700 Bellevue Way NE Ste 115",
        "addressLocality": "Bellevue",
        "addressRegion": "WA",
        "postalCode": "98004",
        "addressCountry": "US",
        "neighborhood": "Downtown",
        "text": "700 Bellevue Way NE Ste 115, Bellevue, WA, 98004"
      },
      "telephone": "(425) 454-2606"
    }, {
      "_type": "LocalBusiness",
      "id": "https:\/\/cognitivegblppe.azure-api.net\/api\/v7\/#Places.7",
      "name": "Boiling Point",
      "url": "http:\/\/www.bpgroupusa.com\/",
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
        "streetAddress": "1075 Bellevue Way NE",
        "addressLocality": "Bellevue",
        "addressRegion": "WA",
        "postalCode": "98004",
        "addressCountry": "US",
        "neighborhood": "North Bellevue",
        "text": "1075 Bellevue Way NE, Bellevue, WA, 98004"
      },
      "telephone": "(425) 455-8375"
    }, {
      "_type": "LocalBusiness",
      "id": "https:\/\/cognitivegblppe.azure-api.net\/api\/v7\/#Places.8",
      "name": "Top Gun Seafood Restaurant",
      "url": "http:\/\/topgunrestaurants.com\/",
      "entityPresentationInfo": {
        "entityScenario": "ListItem",
        "entityTypeHints": ["Place", "LocalBusiness", "Restaurant"]
      },
      "geo": {
        "latitude": 47.5780410766602,
        "longitude": -122.172653198242
      },
      "routablePoint": {
        "latitude": 47.5773887634277,
        "longitude": -122.17301940918
      },
      "address": {
        "streetAddress": "12450 SE 38th St",
        "addressLocality": "Bellevue",
        "addressRegion": "WA",
        "postalCode": "98006",
        "addressCountry": "US",
        "neighborhood": "Bellevue",
        "text": "12450 SE 38th St, Bellevue, WA, 98006"
      },
      "telephone": "(425) 641-3386"
    }, {
      "_type": "LocalBusiness",
      "id": "https:\/\/cognitivegblppe.azure-api.net\/api\/v7\/#Places.9",
      "name": "Flo Japanese Restaurant & Sushi Bar",
      "url": "http:\/\/florestaurant.com\/",
      "entityPresentationInfo": {
        "entityScenario": "ListItem",
        "entityTypeHints": ["Place", "LocalBusiness", "Restaurant"]
      },
      "geo": {
        "latitude": 47.6202201843262,
        "longitude": -122.198852539062
      },
      "routablePoint": {
        "latitude": 47.6202201843262,
        "longitude": -122.199119567871
      },
      "address": {
        "streetAddress": "1150 106th Ave NE",
        "addressLocality": "Bellevue",
        "addressRegion": "WA",
        "postalCode": "98004",
        "addressCountry": "US",
        "neighborhood": "Bellevue",
        "text": "1150 106th Ave NE, Bellevue, WA, 98004"
      },
      "telephone": "(425) 453-4005"
    }],
    "searchAction": {}
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


## Data attribution  

Bing Local Search API responses contain information owned by third parties. You are responsible to ensure your use is appropriate, for example by complying with any creative commons license your user experience may rely on.  
  
If an answer or result includes the `contractualRules`, `attributions`, or `provider` fields, you must attribute the data. If the answer does not include any of these fields, no attribution is required. If the answer includes the `contractualRules` field and the `attributions` and/or `provider` fields, you must use the contractual rules to attribute the data.  
  
The following example shows an entity that includes a MediaAttribution contractual rule and an Image that includes a `provider` field. The MediaAttribution rule identifies the image as the target of the rule, so you'd ignore the image's `provider` field and instead use the MediaAttribution rule to provide attribution.  
  
```  
        "value" : [{
            "contractualRules" : [
                . . .
                {
                    "_type" : "ContractualRules\/MediaAttribution",
                    "targetPropertyName" : "image",
                    "mustBeCloseToContent" : true,
                    "url" : "http:\/\/en.wikipedia.org\/wiki\/Space_Needle"
                }
            ],
            . . .
            "image" : {
                "name" : "Space Needle",
                "thumbnailUrl" : "https:\/\/www.bing.com\/th?id=A46378861201...",
                "provider" : [{
                    "_type" : "Organization",
                    "url" : "http:\/\/en.wikipedia.org\/wiki\/Space_Needle"
                }],
                "hostPageUrl" : "http:\/\/www.citydictionary.com\/Uploaded...",
                "width" : 110,
                "height" : 110
            },
            . . .
        }]
```  
  
If a contractual rule includes the `targetPropertyName` field, the rule applies only to the targeted field. Otherwise, the rule applies to the parent object that contains the `contractualRules` field.  
  
  
In the following example, the `LinkAttribution` rule includes the `targetPropertyName` field, so the rule applies to the `description` field. For rules that apply to specific fields, you must include a line immediately following the targeted data that contains a hyperlink to the provider's website. For example, to attribute the description, include a line immediately following the description text that contains a hyperlink to the data on the provider's website, in this case create a link to en.wikipedia.org.  
  
```  
"entities" : {  
    "value" : [{  
            . . .  
            "description" : "Peyton Williams Manning is a former American....",  
            . . .  
            "contractualRules" : [{  
                    "_type" : "ContractualRules\/LinkAttribution",  
                    "targetPropertyName" : "description",  
                    "mustBeCloseToContent" : true,  
                    "text" : "en.wikipedia.org",  
                    "url" : "http:\/\/www.bing.com\/cr?IG=B8AD73..."  
                 },  
            . . .  
  
```  

### License Attribution  

If the list of contractual rules includes a [LicenseAttribution](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#licenseattribution) rule, you must display the notice on the line immediately following the content that the license applies to. The `LicenseAttribution` rule uses the `targetPropertyName` field to identify the property that the license applies to.  
  
The following shows an example that includes a `LicenseAttribution` rule.  
  
![License attribution](licenseattribution.png)  
  
The license notice that you display must include a hyperlink to the website that contains information about the license. Typically, you make the name of the license a hyperlink. For example, if the notice is **Text under CC-BY-SA license** and CC-BY-SA is the name of the license, you would make CC-BY-SA a hyperlink.  
  
### Link and Text Attribution  

The [LinkAttribution](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#linkattribution) and [TextAttribution](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#textattribution) rules are typically used to identify the provider of the data. The `targetPropertyName` field identifies the field that the rule applies to.  
  
To attribute the providers, include a line immediately following the content that the attributions apply to (for example, the targeted field). The line should be clearly labeled to indicate that the providers are the source of the data. For example, "Data from: en.wikipedia.org". For `LinkAttribution` rules, you must create a hyperlink to the provider's website.  
  
The following shows an example that includes `LinkAttribution` and `TextAttribution` rules.  
  
![Link text attribution](linktextattribution.png)  

### Media Attribution  

If the entity includes an image and you display it, you must provide a click-through link to the provider's website. If the entity includes a [MediaAttribution](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference#mediaattribution) rule, use the rule's URL to create the click-through link. Otherwise, use the URL included in the image's `provider` field to create the click-through link.  
  
The following shows an example that includes an image's `provider` field and contractual rules. Because the example includes the contractual rule, you will ignore the image's `provider` field and apply the `MediaAttribution` rule.  
  
![Media attribution](mediaattribution.png)  


## Next steps
- [Local Search quickstart](local-quickstart.md)
- [Local Search Java quickstart](local-search-java-quickstart.md)
- [Local Search Node quickstart](local-search-node-quickstart.md)
- [Local Search Python quickstart](local-search-python-quickstart.md)