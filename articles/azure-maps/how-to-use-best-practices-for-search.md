---
title: How to search efficiently using the Azure Maps Search service  | Microsoft Docs 
description: Learn how to use best practices for search using the Azure Maps Search service
ms.author: v-musehg
ms.date: 03/25/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Best practices for search 

Azure Maps Search Service includes APIs with various capabilities, e.g from address search to searching Point of Interest data around a specific location. I this article we will share the best practices to call data via Azure Maps Search Services. You will learn how to:

* Build queries to return relevant matches
* Limit search results
* Learn difference between various result types
* Read the address search response structure


## Prerequisites

To make any calls to the Maps service APIs, you need a Maps account and key. For information on creating an account and retrieving a key, see [How to manage your Azure Maps account and keys](how-to-manage-account-keys.md).

This article uses the [Postman app](https://www.getpostman.com/apps) to build REST calls. You can use any API development environment that you prefer.


## Best practices for Geocoding

When you search for a full or partial address using Azure Maps Search Service, it takes your search term and returns the latitude and longitude coordinates of the address. This process is called geocoding.


## Limit search results

In this section you will learn how to use Azure Maps search APIs to limit search results. 

> [!Note]
> Not all search APIs support all parameters listed below

### Geo-bias search results

In order to geo-bias your results to the relevant area for your user, you should always add the maximum possible detailed location input. To restrict the search results please consider the following:

1. Set the `countrySet` parameter, e.g. "US, FR". The default search behavior is to search the entire world, potentially returning unnecessary results. If your query does not include `countrySet` parameter, the search may return inaccurate results. For example, search for a city named **Bellevue** will return inaccurate results, since cities named **Bellevue** are in France and the US.

2. You can use the `btmRight` and `topleft` parameters to set the bounding box to restrict the search to a specific area on the map.

3. To influence the area of relevance for the results, you can define the `lat`and `lon` coordinate parameters and set the radius of the search area using the `radius` parameter.


### Fuzzy search parameters

1. The `minFuzzyLevel` and `maxFuzzyLevel`, help return relevant matches even when query parameter does not exactly correspond to the desired information. Most search queries default to `minFuzzyLevel=1` and `maxFuzzyLevel=2` to gain performance and reduce unusual results. Take and example of a search term "restrant", it is matched to "restaurant" when the `maxFuzzyLevel` is set to be 2. The default fuzzy levels can be overridden as per request needs. 

2. You can also specify the exact set of result Types to be returned by using the `idxSet` parameter. For this purpose you can submit comma-separated list of indexes, the item order does not matter. Following the are the supported indexes:

    1. `Addr` (Address Ranges): For some streets there are address points that are interpolated from the beginning and end of the street; those points are represented as address ranges.
    2. `Geo` (Geographies): Areas on a map which represent administrative division of a land, i.e., country, state, city.
    3. `PAD` (Point Address):  Points on a map where specific address with a street name and number can be found in an index, e.g., Soquel Dr 2501. This is the highest level of accuracy available for addresses.  
    4. `POI` (Points of Interest): Points on a map that are worth attention and may be interesting.  [Get Search Address](https://docs.microsoft.com/rest/api/maps/search/getsearchaddress) won't return POIs.  
    5. `Str` (Streets): Representation of streets on the map.
    6. `XStr` (Cross Streets/intersections):  Representation of junctions; places where two streets intersect.
    **Usage Examples**:
        * idxSet=POI (search Points Of Interest only) 
        * idxSet=PAD,Addr (search addresses only, PAD= Point Address, Addr= Address Range)

