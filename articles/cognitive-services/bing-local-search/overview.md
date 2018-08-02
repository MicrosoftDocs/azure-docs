---
title: Bing Local Search API overview | Microsoft Docs
description: How to use the Bing Local Search API to search the web locally.
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.technology: bing-local-search
ms.topic: article
ms.date: 03/27/2018
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
https://api.cognitive.microsoft.com/bing/v7.0/local/search?q=restaurant_in+Bellevue
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
https://api.cognitive.microsoft.com/bing/v7.0/local/search?q=restaurant+in+Bellevue

````

## Response

The JSON response includes places specified by `?q=restaurant+in+Bellevue`.

````
"places": {
      "totalEstimatedMatches": 10,
      "value": [
         {
            "_type": "Restaurant",
            "id": "https:\/\/www.bingapis.com\/api\/v7\/#Places.0",
            "readLink": "https:\/\/www.bingapis.com\/api\/v7\/localbusinesses\/YN873x131690823",
            "contractualRules": [
               {
                  "_type": "ContractualRules\/LinkAttribution",
                  "text": "Yelp",
                  "url": "https:\/\/www.yelp.com\/biz\/facing-east-bellevue?adjust_creative=bing&utm_campaign=yelp_feed&utm_medium=bingapi&utm_source=4523F7",
                  "urlPingSuffix": "DevEx,5114.1",
                  "optionalForListDisplay": false
               },
               {
                  "_type": "ContractualRules\/LinkAttribution",
                  "text": "Foursquare",
                  "url": "https:\/\/foursquare.com\/v\/facing-east\/485bae80f964a520c5501fe3",
                  "urlPingSuffix": "DevEx,5121.1",
                  "optionalForListDisplay": true
               },
               {
                  "_type": "ContractualRules\/LinkAttribution",
                  "text": "Zomato",
                  "url": "http:\/\/www.urbanspoon.com\/r\/1\/55084\/restaurant\/Seattle\/Facing-East-Taiwanese-Restaurant-Bellevue%2520ForceRecrawl:%25200",
                  "urlPingSuffix": "DevEx,5122.1",
                  "optionalForListDisplay": true
               },
               {
                  "_type": "ContractualRules\/MediaAttribution",
                  "targetPropertyName": "image",
                  "mustBeCloseToContent": true,
                  "url": "https:\/\/s3-media1.fl.yelpcdn.com\/bphoto\/Mv2bJT4-WkU56UD_bJP1RQ\/o.jpg",
                  "urlPingSuffix": "DevEx,5117.1"
               }
            ],
            "webSearchUrl": "https:\/\/www.bing.com\/entityexplore?q=Facing+East+Taiwanese+Restaurant&filters=local_ypid:%22YN873x131690823%22&elv=AXXfrEiqqD9r3GuelwApulpmymQx!ODfuQu*veOQHkvP0!Zbvi5F5tVcMSDJvDEWiQWwrdueYTtIszgj03oFQHykYYLYgq3q5!Sf00QxXGIS",
            "webSearchUrlPingSuffix": "DevEx,5123.1",
            "name": "Facing East Taiwanese Restaurant",
            "url": "http:\/\/litadesign.wix.com\/facingeastrestaurant",
            "urlPingSuffix": "DevEx,5124.1",
            "image": {
               "provider": [
                  {
                     "name": "Yelp",
                     "url": "https:\/\/www.yelp.com\/biz\/facing-east-bellevue?adjust_creative=bing&utm_campaign=yelp_feed&utm_medium=feed_v2&utm_source=bing",
                     "urlPingSuffix": "DevEx,5119.1"
                  }
               ],
               "contentUrl": "https:\/\/www.bing.com\/th?id=AAHMtP+fpeUAGRg480x360&p=0&pid=Local",
               "contentUrlPingSuffix": "DevEx,5118.1",
               "hostPageUrl": "https:\/\/s3-media1.fl.yelpcdn.com\/bphoto\/Mv2bJT4-WkU56UD_bJP1RQ\/o.jpg",
               "hostPageUrlPingSuffix": "DevEx,5117.1",
               "width": 216,
               "height": 288
            },
            "entityPresentationInfo": {
               "entityScenario": "ListItem",
               "entityTypeHints": [
                  "Place",
                  "LocalBusiness",
                  "Restaurant"
               ]
            },
            "bingId": "YN873x131690823",
            "geo": {
               "latitude": 47.6199188232422,
               "longitude": -122.202743530273
            },
            "routablePoint": {
               "latitude": 47.6199188232422,
               "longitude": -122.202743530273
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
            "telephone": "(425) 688-2986",
            "aggregateRating": {
               "text": "8",
               "ratingValue": 8,
               "bestRating": 10,
               "reviewCount": 1557
            },
            "openingHoursSpecification": [
               {
                  "dayOfWeek": "Monday",
                  "opens": {
                     "hour": 11,
                     "minute": 30,
                     "second": 0,
                     "milliSecond": 0
                  },
                  "closes": {
                     "hour": 15,
                     "minute": 0,
                     "second": 0,
                     "milliSecond": 0
                  }
               },
               {
                  "dayOfWeek": "Monday",
                  "opens": {
                     "hour": 17,
                     "minute": 0,
                     "second": 0,
                     "milliSecond": 0
                  },
. . .
 
````

## Attributes of Places response objects

The JSON results include the following attributes:
* Lat/Long
* Name
* Address
* Phone Number
* Website
* Type
* Category
* Rating
* Reviews
* Images
* IsClosed
* open hours
* price level

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