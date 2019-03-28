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

# Best practices to use Azure Maps Search Service

Azure Maps [Search Service](https://docs.microsoft.com/rest/api/maps/search) includes APIs with various capabilities, e.g from address search to searching Point of Interest data around a specific location. In this article, we will share the best practices to call data via Azure Maps Search Services. You will learn how to:

* Build queries to return relevant matches
* Limit search results
* Learn difference between various result types
* Read the address search response structure


## Prerequisites

To make any calls to the Maps service APIs, you need a Maps account and key. For information on creating an account and retrieving a key, see [How to manage your Azure Maps account and keys](how-to-manage-account-keys.md).

This article uses the [Postman app](https://www.getpostman.com/apps) to build REST calls. You can use any API development environment that you prefer.


## Best practices for Geocoding

When you search for a full or partial address using Azure Maps Search Service, it takes your search term and returns the latitude and longitude coordinates of the address. This process is called geocoding. The ability to geocode in a country is dependent upon the road data coverage and the geocoding precision of the geocoding service.

See [geocoding coverage](https://docs.microsoft.com/azure/azure-maps/geocoding-coverage) to know more about Azure Maps geocoding capabilities by country/region.

### Limit search results

In this section, you will learn how to use Azure Maps search APIs to limit search results. 

> [!Note]
> Not all search APIs fully support parameters listed below

**Geo-bias search results**

In order to geo-bias your results to the relevant area for your user, you should always add the maximum possible detailed location input. To restrict the search results, consider adding the following input types:

1. Set the `countrySet` parameter, for example "US, FR". The default search behavior is to search the entire world, potentially returning unnecessary results. If your query does not include `countrySet` parameter, the search may return inaccurate results. For example, search for a city named **Bellevue** will return results from USA and France, since there are cities named **Bellevue** in France and in the USA.

2. You can use the `btmRight` and `topleft` parameters to set the bounding box to restrict the search to a specific area on the map.

3. To influence the area of relevance for the results, you can define the `lat`and `lon` coordinate parameters and set the radius of the search area using the `radius` parameter.


**Fuzzy search parameters**

1. The `minFuzzyLevel` and `maxFuzzyLevel`, help return relevant matches even when query parameter does not exactly correspond to the desired information. Most search queries default to `minFuzzyLevel=1` and `maxFuzzyLevel=2` to gain performance and reduce unusual results. Take and example of a search term "restrant", it is matched to "restaurant" when the `maxFuzzyLevel` is set to be 2. The default fuzzy levels can be overridden as per request needs. 

2. You can also specify the exact set of result Types to be returned by using the `idxSet` parameter. For this purpose you can submit comma-separated list of indexes, the item order does not matter. Following the are the supported indexes:

    1. `Addr` **Address Ranges**: For some streets, there are address points that are interpolated from the beginning and end of the street; those points are represented as address ranges.
    2. `Geo` **Geographies**: Areas on a map that represent administrative division of a land, that is, country, state, city.
    3. `PAD` **Point Address**:  Points on a map where specific address with a street name and number can be found in an index, for example, Soquel Dr 2501. It is the highest level of accuracy available for addresses.  
    4. `POI` **Points of Interest**: Points on a map that are worth attention and may be interesting.  [Get Search Address](https://docs.microsoft.com/rest/api/maps/search/getsearchaddress) won't return POIs.  
    5. `Str` **Streets**: Representation of streets on the map.
    6. `XStr` **Cross Streets/intersections**:  Representation of junctions; places where two streets intersect.


    **Usage Examples**:
        * idxSet=POI (search Points Of Interest only) 
        * idxSet=PAD,Addr (search addresses only, PAD= Point Address, Addr= Address Range)


### Search results language

The `language` parameter allows you to set in which language search results should be returned. If the language is not set in the request, search service automatically defaults to neutral ground truth language in the country/region. Also, when data in the specified language is not available, the default language is used. See [supported languages](https://docs.microsoft.com/azure/azure-maps/supported-languages) for a list of supported languages with respect to Azure Maps services by country/region.


### Predictive mode (Auto-suggest)

To find more matches for partial queries, such as, "Microsoft", `typeHead` parameter should be set to be 'true'. The query will be interpreted as a partial input and the search will enter predictive mode. Otherwise the service will assume all relevant information has been passed in.


### URI encoding to handle special characters 

To find cross street addresses, that is, 1st Avenue & Union Street, Seattle, special character '&' needs to be encoded before sending the request. We recommend encoding character data in a URI, where all characters are encoded using a '%' character and a two-character hex value corresponding to their UTF-8 character.

**Usage Examples**:

* Get Search Address:


```
query=1st Avenue & E 111th St, New York shall be encoded as query"=1st%20Avenue%20%26%20E%20111th%20St%2C%20New%20York 
```


Here are the different methods to use for different languages: 

JavaScript/TypeScript:
```Javascript
encodeURIComponent(query)
```

C#/VB:
```C#
Uri.EscapeDataString(query)
```

Java:
```Java
URLEncoder.encode(query, "UTF-8") 
```

Python:
```Python
import urllib.parse 
urllib.parse.quote(query)
```

C++:
```C++
#include <curl/curl.h>
curl_easy_escape(query)
```

PHP:
```PHP
urlencode(query)
```

Ruby:
```Ruby
CGI::escape(query) 
```

Swift:
```Swift
query.stringByAddingPercentEncodingWithAllowedCharacters(.URLHostAllowedCharacterSet()) 
```

Go:
```Go
import ("net/url") 
url.QueryEscape(query)
```


## Best practices for POI search

We strongly advise you to use the `countrySet` parameter to specify countries where your application needs coverage, as the default behavior will be to search the entire world, potentially returning unnecessary results and/or result in longer search times.

### Airport search

POI Search supports searching Airports by using the official Airport codes. For example, **SEA** (Seattle-Tacoma International Airport). 

```
https://atlas.microsoft.com/search/poi/json?subscription-key=[you_key]&api-version=1.0&query=SEA 
```

### Nearby search

To retrieve only POI results around a specific location, the nearby search method may be the right choice. This endpoint will only return POI results, and does not take in a search query parameter. To limit the results, it is recommended to set the radius.

### Understanding the responses
Lets make a fuzzy search request to the Azure Maps search service for the geographic region and Point of interests with name Seattle. If you look carefully at the request URL below, we have used the `idxSet` parameter to define the result type we want in the response.

```
https://atlas.microsoft.com/search/fuzzy/json?subscription-key={subscription-key}&api-version=1.0&query=Seattle&countrySet=US&radius=20&idxSet=Geo,POI
```

Further lets have a look at the response structure below. The result type of both the result objects in the response are different. One of them is a POI object with name seattle in it and the other is the Geographic region representing the city of Seattle. See [Get Search fuzzy](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy#definitions) to know more about response object parameters. 

Supported types of result:

**Point Address:** Points on a map where specific address with a street name and number. The highest level of accuracy available for addresses. 

**Address Range:**  For some streets, there are address points that are interpolated from the beginning and end of the street; those points are represented as address ranges. 

**Geography:** Areas on a map that represent administrative division of a land, that is, country, state, city. 

**POI - (Points of Interest):** Points on a map that are worth attention and may be interesting.

**Street:** Representation of streets on the map. Addresses are resolved to the latitude/longitude coordinate of the street that contains the address. The house number may not be processed. 

**Cross Street:** Intersections. Representations of junctions; places where two streets intersect.

The `Score` parameter for each response object indicates the relative matching score to scores of other objects in the same response.


```JSON
{
    "summary": {
        "query": "seattle",
        "queryType": "NON_NEAR",
        "queryTime": 24,
        "numResults": 2,
        "offset": 0,
        "totalResults": 2,
        "fuzzyLevel": 1,
        "geoBias": {
            "lat": 47.6101,
            "lon": -122.33596
        }
    },
    "results": [
        {
            "type": "POI",
            "id": "US/POI/p0/7442170",
            "score": 2.359,
            "dist": 13.899993284447241,
            "info": "search:ta:840539000253054-US",
            "poi": {
                "name": "Taphandles",
                "phone": "+(1)-(206)-4626800",
                "url": "www.taphandles.com",
                "categories": [
                    "advertising/marketing",
                    "company"
                ],
                "classifications": [
                    {
                        "code": "COMPANY",
                        "names": [
                            {
                                "nameLocale": "en-US",
                                "name": "advertising/marketing"
                            },
                            {
                                "nameLocale": "en-US",
                                "name": "company"
                            }
                        ]
                    }
                ]
            },
            "address": {
                "streetNumber": "1424",
                "streetName": "4th Ave",
                "municipalitySubdivision": "Seattle, Central Business District",
                "municipality": "Seattle",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle",
                "countrySubdivision": "WA",
                "postalCode": "98101",
                "extendedPostalCode": "981011431",
                "countryCode": "US",
                "country": "United States Of America",
                "countryCodeISO3": "USA",
                "freeformAddress": "1424 4th Ave, Seattle, WA 98101",
                "countrySubdivisionName": "Washington"
            },
            "position": {
                "lat": 47.61013,
                "lon": -122.33614
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.61103,
                    "lon": -122.33747
                },
                "btmRightPoint": {
                    "lat": 47.60923,
                    "lon": -122.33481
                }
            },
            "entryPoints": [
                {
                    "type": "main",
                    "position": {
                        "lat": 47.61,
                        "lon": -122.33644
                    }
                }
            ]
        },
        {
            "type": "Geography",
            "id": "US/GEO/p0/192486",
            "score": 2.351,
            "dist": 0,
            "entityType": "MunicipalitySubdivision",
            "address": {
                "municipalitySubdivision": "Seattle, Pioneer Square, Pike Market, First Hill, Downtown, Central Business District, Broadway, Belltown",
                "municipality": "Seattle",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle",
                "countrySubdivision": "WA",
                "countryCode": "US",
                "country": "United States Of America",
                "countryCodeISO3": "USA",
                "freeformAddress": "Seattle, WA",
                "countrySubdivisionName": "Washington"
            },
            "position": {
                "lat": 47.6101,
                "lon": -122.33596
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.61846,
                    "lon": -122.34426
                },
                "btmRightPoint": {
                    "lat": 47.60174,
                    "lon": -122.32766
                }
            },
            "boundingBox": {
                "topLeftPoint": {
                    "lat": 47.61846,
                    "lon": -122.34426
                },
                "btmRightPoint": {
                    "lat": 47.60174,
                    "lon": -122.32766
                }
            },
            "dataSources": {
                "geometry": {
                    "id": "00005557-4100-4600-0000-00004788a7a1"
                }
            }
        }
    ]
}
```

### Geometry Data

Search Address or Search Fuzzy APIs response can include the geometry ID that is returned in the dataSources object under "geometry" and "id".  For example, Get Polygon  service allows you to request the geometry data such as a city or airport outline for a set of entities, previously retrieved from an Online Search request in GeoJSON format. You can also use boundary data with Geofencing service. 


```JSON 
"dataSources": { 

        "geometry": { 

            "id": "00005557-4100-3c00-0000-000059690938" // The geometry ID is returned in the dataSources object under "geometry" and "id" in either a Search Address or Search Fuzzy call. 

        }

} 
```

## Next steps

* Learn [how to build Azure Maps Search service requests](https://docs.microsoft.com/azure/azure-maps/how-to-search-for-address).
* Explore the Azure Maps [search service API documentation](https://docs.microsoft.com/rest/api/maps/search). 