---
title: Search categories for the Bing Local Business Search API
titleSuffix: Azure AI services
description: Use this article to learn how to specify search categories for the Bing Local Business search API endpoint.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-local-business
ms.topic: conceptual
ms.date: 11/01/2018
ms.author: rosh
---

# Search categories for the Bing Local Business Search API

[!INCLUDE [Bing move notice](../bing-web-search/includes/bing-move-notice.md)]

The Bing Local Business Search API enables you to search for local business entities in a variety of categories, with priority given to results close a user's location. You can include these searches in searches along with the `localCircularView` and `localMapView` [parameters](specify-geographic-search.md).


## TopLevel Categories 

The following types define major categories of search.  More than one category can be specified using a comma-delimited list assigned to the `localCategories` parameter.  
- EatDrink 
- SeeDo 
- Shop 
- HotelsAndMotels 
- BanksAndCreditUnions 
- Parking 
- Hospitals 

## Sub Categories
Subcategories are passed the same way as `localCategories`. Subcategories are more specific categories. They are subordinate in the sense that if you specify a category C and one of its subcategories S in the same comma-delimited list, you will receive the same results as if you specified C alone.

### Eat Drink

> BreweriesAndBrewPubs, CocktailLounges, AfricanRestaurants, AmericanRestaurants, Bagels, BarbecueRestaurants, Taverns, SportsBars, Bars, BarsGrillsAndPubs, BuffetRestaurants| BelgianRestaurants, BritishRestaurants, CafeRestaurants, CaribbeanRestaurants, ChineseRestaurants, CoffeeAndTea, Delicatessens, DeliveryService, Diners, DiscountStores, Donuts, FastFood, FrenchRestaurants, FrozenYogurt, GermanRestaurants, Supermarkets, GreekRestaurants, Grocers, HawaiianRestaurants, HungarianRestaurants, IceCreamAndFrozenDesserts, IndianRestaurants, ItalianRestaurants, JapaneseRestaurants, Juices, KoreanRestaurants, LiquorStores, MexicanRestaurants, MiddleEasternRestaurants, Pizza, PolishRestaurants, PortugueseRestaurants, Pretzels, Restaurants, RussianAndUkrainianRestaurants, Sandwiches, SeafoodRestaurants, SpanishRestaurants, SteakHouseRestaurants, SushiRestaurants, TakeAway, ThaiRestaurants, TurkishRestaurants, VegetarianAndVeganRestaurants, VietnameseRestaurants

### See Do

> AmusementParks, Attractions, Carnivals, Casinos, LandmarksAndHistoricalSites, MiniatureGolfCourses, MovieTheaters, Museums, Parks, SightseeingTours, TouristInformation, Zoos

### Shop

> AntiqueStores, Bookstores, CDAndRecordStores, ChildrensClothingStores, CigarAndTobaccoShops, ComicBookStores, DepartmentStores, DiscountStores, FleaMarketsAndBazaars, FurnitureStores, HomeImprovementStores, JewelryAndWatchesStores, KitchenwareStores, LiquorStores, MallsAndShoppingCenters, MensClothingStores, MusicStores, OutletStores, PetShops, PetSupplyStores, SchoolAndOfficeSupplyStores, ShoeStores, SportingGoodsStores, ToyAndGameStores, VitaminAndSupplementStores, WomensClothingStores


## Examples of Local Categories search

The following examples GET results according to the `localCategories` parameter:

`https://api.cognitive.microsoft.com/localbusinesses/v7.0/search?&q=&mkt=en-US&localcategories=HotelsAndMotels`

`https://api.cognitive.microsoft.com/localbusinesses/v7.0/search?&q=&mkt=en-US&localcategories=EatDrink`

`https://api.cognitive.microsoft.com/localbusinesses/v7.0/search?&q=&mkt=en-US&localcategories=Shop`

`https://api.cognitive.microsoft.com/localbusinesses/v7.0/search?&q=&mkt=en-US&localcategories=Hospitals`

The following query limits the number of 'hospital' results to first three returned from the Bing Local Business Search API:

`https://api.cognitive.microsoft.com/localbusinesses/v7.0/search?&q=&mkt=en-US&localCategories=Hospitals&count=3&offset=0`

The following example JSON response includes three hospitals in the greater Seattle area:

```json
BingAPIs-TraceId: 68AFB51807C6485CAB8AAF20E232EFFF
BingAPIs-SessionId: F89E7B8539B34BF58AAF811485E83B20
X-MSEdge-ClientID: 1C44E64DBFAA6BCA1270EADDBE7D6A22
BingAPIs-Market: en-US
X-MSEdge-Ref: Ref A: 68AFB51807C6485CAB8AAF20E232EFFF Ref B: CO1EDGE0108 Ref C: 2018-10-22T18:52:28Z

{
   "_type": "SearchResponse",
   "queryContext": {
      "originalQuery": ""
   },
   "places": {
      "readLink": "https:\/\/www.bingapis.com\/api\/v7\/places\/search?q=",
      "totalEstimatedMatches": 0,
      "value": [
         {
            "_type": "LocalBusiness",
            "id": "https:\/\/www.bingapis.com\/api\/v7\/#Places.0",
            "name": "Overlake Hospital Medical Center",
            "url": "http:\/\/www.overlakehospital.org\/",
            "entityPresentationInfo": {
               "entityScenario": "ListItem",
               "entityTypeHints": [
                  "Place",
                  "LocalBusiness"
               ]
            },
            "geo": {
               "latitude": 47.6204986572266,
               "longitude": -122.185829162598
            },
            "routablePoint": {
               "latitude": 47.6204986572266,
               "longitude": -122.185668945312
            },
            "address": {
               "streetAddress": "1035 116th Ave NE",
               "addressLocality": "Bellevue",
               "addressRegion": "WA",
               "postalCode": "98004",
               "addressCountry": "US",
               "neighborhood": "",
               "text": "1035 116th Ave NE, Bellevue, WA, 98004"
            },
            "telephone": "(425) 688-5000"
         },
         {
            "_type": "LocalBusiness",
            "id": "https:\/\/www.bingapis.com\/api\/v7\/#Places.1",
            "name": "Virginia Mason University Village Medical Center",
            "url": "https:\/\/virginiamason.org\/Seattle",
            "entityPresentationInfo": {
               "entityScenario": "ListItem",
               "entityTypeHints": [
                  "Place",
                  "LocalBusiness"
               ]
            },
            "geo": {
               "latitude": 47.6095390319824,
               "longitude": -122.327941894531
            },
            "routablePoint": {
               "latitude": 47.6093978881836,
               "longitude": -122.328277587891
            },
            "address": {
               "streetAddress": "1100 9th Ave",
               "addressLocality": "Seattle",
               "addressRegion": "WA",
               "postalCode": "98101",
               "addressCountry": "US",
               "neighborhood": "University District",
               "text": "1100 9th Ave, Seattle, WA, 98101"
            },
            "telephone": "(206) 223-6600"
         },
         {
            "_type": "LocalBusiness",
            "id": "https:\/\/www.bingapis.com\/api\/v7\/#Places.2",
            "name": "Seattle Children’s Hospital",
            "url": "http:\/\/www.seattlechildrens.org\/",
            "entityPresentationInfo": {
               "entityScenario": "ListItem",
               "entityTypeHints": [
                  "Place",
                  "LocalBusiness"
               ]
            },
            "geo": {
               "latitude": 47.6625061035156,
               "longitude": -122.283760070801
            },
            "routablePoint": {
               "latitude": 47.6631507873535,
               "longitude": -122.284614562988
            },
            "address": {
               "streetAddress": "4800 Sand Point Way NE",
               "addressLocality": "Seattle",
               "addressRegion": "WA",
               "postalCode": "98105",
               "addressCountry": "US",
               "neighborhood": "Laurelhurst",
               "text": "4800 Sand Point Way NE, Seattle, WA, 98105"
            },
            "telephone": "(206) 987-2000"
         }
      ],
      "searchAction": {

      }
   }
}
```

## Next steps
- [Geographic search boundaries](specify-geographic-search.md)
- [Query and response](local-search-query-response.md)
- [Quickstart in C#](quickstarts/local-quickstart.md)
