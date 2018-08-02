---
title: Local search endpoint | Microsoft Docs
description: Summary of the Local search API endpoint.
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.technology: bing-local-search
ms.topic: article
ms.date: 08/02/2018
ms.author: rosh, v-gedod
---

# Local Search endpoint
The **Local Search API**  includes one endpoint that returns places from the Web based on a query. 

## Endpoint
To get local results using the Bing API, send a request to the following endpoint. Use the headers and URL parameters to define further specifications.

The endpoint returns places that are relevant to the user's search query defined by `?q=""`.

````
GET https://api.cognitive.microsoft.com/bing/v7.0/local/search?q="restaurant+Bellevue"
````

## Response

The response is JSON text that includes places specified by the query parameter. The following example is the response for 
`?q=restaurant in Bellevue`.

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

For details about headers, parameters, market codes, response objects, errors, etc., see the [Bing Local Search API v7](local-search-reference.md) reference.

## Next steps
- [Local Search endpoint](local-search-endpoint.md)
- [Local Search quickstart](local-quickstart.md)
- [Local Search Java quickstart](local-search-java-quickstart.md)
- [Local Search Node quickstart](local-search-node-quickstart.md)
- [Local Search Python quickstart](local-search-python-quickstart.md)