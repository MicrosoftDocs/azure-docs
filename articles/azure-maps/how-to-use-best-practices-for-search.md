---
title: How to search efficiently using the Azure Maps Search service  | Microsoft Docs 
description: Learn how to use best practices for search using the Azure Maps Search service
author: walsehgal
ms.author: v-musehg
ms.date: 04/08/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Best practices to use Azure Maps Search Service

Azure Maps [Search Service](https://docs.microsoft.com/rest/api/maps/search) includes APIs with various capabilities, for example, from address search to searching Point of Interest (POI) data around a specific location. In this article, we will share the best practices to call data via Azure Maps Search Services. You will learn how to:

* Build queries to return relevant matches
* Limit search results
* Learn difference between various result types
* Read the address search response structure


## Prerequisites

To make any calls to the Maps service APIs, you need a Maps account and key. For information on creating an account and retrieving a key, see [How to manage your Azure Maps account and keys](how-to-manage-account-keys.md).

> [!Tip]
> To query the search service, you can use the [Postman app](https://www.getpostman.com/apps) to build REST calls or you can use any API development environment that you prefer.


## Best practices for Geocoding

When you search for a full or partial address using Azure Maps Search Service, it takes your search term and returns the longitude and latitude coordinates of the address. This process is called geocoding. The ability to geocode in a country is dependent upon the road data coverage and the geocoding precision of the geocoding service.

See [geocoding coverage](https://docs.microsoft.com/azure/azure-maps/geocoding-coverage) to know more about Azure Maps geocoding capabilities by country/region.

### Limit search results

   In this section, you will learn how to use Azure Maps search APIs to limit search results. 

   > [!Note]
   > Not all search APIs fully support parameters listed below

   **Geo-bias search results**

   In order to geo-bias your results to the relevant area for your user, you should always add the maximum possible detailed location input. To restrict the search results, consider adding the following input types:

   1. Set the `countrySet` parameter, for example "US,FR". The default search behavior is to search the entire world, potentially returning unnecessary results. If your query does not include `countrySet` parameter, the search may return inaccurate results. For example, search for a city named **Bellevue** will return results from USA and France, since there are cities named **Bellevue** in France and in the USA.

   2. You can use the `btmRight` and `topleft` parameters to set the bounding box to restrict the search to a specific area on the map.

   3. To influence the area of relevance for the results, you can define the `lat`and `lon` coordinate parameters and set the radius of the search area using the `radius` parameter.


   **Fuzzy search parameters**

   1. The `minFuzzyLevel` and `maxFuzzyLevel`, help return relevant matches even when query parameters do not exactly correspond to the desired information. Most search queries default to `minFuzzyLevel=1` and `maxFuzzyLevel=2` to gain performance and reduce unusual results. Take an example of a search term "restrant", it is matched to "restaurant" when the `maxFuzzyLevel` is set to be 2. The default fuzzy levels can be overridden as per request needs. 

   2. You can also specify the exact set of result types to be returned by using the `idxSet` parameter. For this purpose you can submit comma-separated list of indexes, the item order does not matter. The following are the supported indexes:

       * `Addr` - **Address Ranges**: For some streets, there are address points that are interpolated from the beginning and end of the street; those points are represented as address ranges.
       * `Geo` - **Geographies**: Areas on a map that represent administrative division of a land, that is, country, state, city.
       * `PAD` - **Point Address**:  Points on a map where specific address with a street name and number can be found in an index, for example, Soquel Dr 2501. It is the highest level of accuracy available for addresses.  
       * `POI` - **Points of Interest**: Points on a map that are worth attention and may be interesting.  [Get Search Address](https://docs.microsoft.com/rest/api/maps/search/getsearchaddress) won't return POIs.  
       * `Str` - **Streets**: Representation of streets on the map.
       * `XStr` - **Cross Streets/intersections**:  Representation of junctions; places where two streets intersect.


       **Usage Examples**:

       * idxSet=POI (search Points Of Interest only) 

       * idxSet=PAD,Addr (search addresses only, PAD= Point Address, Addr= Address Range)

### Reverse geocode and geography entity type filter

When performing a reverse geocode search with [Search Address Reverse API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse), the service has capability to return polygons for the administrative areas. By providing the parameter `entityType` in the request, you can narrow the search for specified geography entity types. The resulting response will contain the geography ID as well as the entity type matched. If you provide more than one entity, endpoint will return the **smallest entity available**. Returned Geometry ID can be used to get the geometry of that geography via [Get Polygon service](https://docs.microsoft.com/rest/api/maps/search/getsearchpolygon).

**Sample request:**

```HTTP
https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&subscription-key={subscription-key}&query=47.6394532,-122.1304551&language=en-US&entityType=Municipality
```

**Response:**

```JSON
{
    "summary": {
        "queryTime": 8,
        "numResults": 1
    },
    "addresses": [
        {
            "address": {
                "routeNumbers": [],
                "countryCode": "US",
                "countrySubdivision": "WA",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle East",
                "municipality": "Redmond",
                "country": "United States",
                "countryCodeISO3": "USA",
                "freeformAddress": "Redmond, WA",
                "boundingBox": {
                    "northEast": "47.717105,-122.034537",
                    "southWest": "47.627016,-122.164998",
                    "entity": "position"
                },
                "countrySubdivisionName": "Washington"
            },
            "position": "47.639454,-122.130455",
            "dataSources": {
                "geometry": {
                    "id": "00005557-4100-3c00-0000-0000596ae571"
                }
            },
            "entityType": "Municipality"
        }
    ]
}
```

### Search results language

The `language` parameter allows you to set in which language search results should be returned. If the language is not set in the request, search service automatically defaults to the most common language in the country/region. Also, when data in the specified language is not available, the default language is used. See [supported languages](https://docs.microsoft.com/azure/azure-maps/supported-languages) for a list of supported languages with respect to Azure Maps services by country/region.


### Predictive mode (Auto-suggest)

To find more matches for partial queries, `typeahead` parameter should be set to be 'true'. The query will be interpreted as a partial input and the search will enter predictive mode. Otherwise the service will assume all relevant information has been passed in.

In the sample query below you can see that the search Address service is queried for "Microso" with the `typeahead` parameter set to **true**. If you observe the response, you can see that the search service interpreted the query as partial query and response contains results for auto-suggested query.

**Sample query:**

```HTTP
https://atlas.microsoft.com/search/address/json?subscription-key={subscription-key}&api-version=1.0&typeahead=true&countrySet=US&lat=47.6370891183&lon=-122.123736172&query=Microsoft
```

**Response:**

```JSON
{
    "summary": {
        "query": "microsoft",
        "queryType": "NON_NEAR",
        "queryTime": 25,
        "numResults": 6,
        "offset": 0,
        "totalResults": 6,
        "fuzzyLevel": 1,
        "geoBias": {
            "lat": 47.6370891183,
            "lon": -122.123736172
        }
    },
    "results": [
        {
            "type": "Street",
            "id": "US/STR/p0/10294417",
            "score": 2.594,
            "dist": 327.546040632591,
            "address": {
                "streetName": "Microsoft Way",
                "municipalitySubdivision": "Redmond",
                "municipality": "Redmond",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle East",
                "countrySubdivision": "WA",
                "postalCode": "98052",
                "extendedPostalCode": "980526399,980528300",
                "countryCode": "US",
                "country": "United States Of America",
                "countryCodeISO3": "USA",
                "freeformAddress": "Microsoft Way, Redmond, WA 98052",
                "countrySubdivisionName": "Washington"
            },
            "position": {
                "lat": 47.63989,
                "lon": -122.12509
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.63748,
                    "lon": -122.12309
                },
                "btmRightPoint": {
                    "lat": 47.64223,
                    "lon": -122.13061
                }
            }
        },
        ...,
        ...,
        ...,
        ...,
        {
            "type": "Street",
            "id": "US/STR/p0/9063400",
            "score": 2.075,
            "dist": 3655467.6406921702,
            "address": {
                "streetName": "Microsoft Way",
                "municipalitySubdivision": "Yorkmount, Charlotte",
                "municipality": "Charlotte",
                "countrySecondarySubdivision": "Mecklenburg",
                "countryTertiarySubdivision": "Township 1 Charlotte",
                "countrySubdivision": "NC",
                "postalCode": "28217",
                "countryCode": "US",
                "country": "United States Of America",
                "countryCodeISO3": "USA",
                "freeformAddress": "Microsoft Way, Charlotte, NC 28217",
                "countrySubdivisionName": "North Carolina"
            },
            "position": {
                "lat": 35.14279,
                "lon": -80.91814
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 35.14267,
                    "lon": -80.91814
                },
                "btmRightPoint": {
                    "lat": 35.14279,
                    "lon": -80.91824
                }
            }
        }
    ]
}
```


### URI encoding to handle special characters 

To find cross street addresses, that is, "1st Avenue & Union Street, Seattle", special character '&' needs to be encoded before sending the request. We recommend encoding character data in a URI, where all characters are encoded using a '%' character and a two-character hex value corresponding to their UTF-8 character.

**Usage Examples**:

Get Search Address:

```
query=1st Avenue & E 111th St, New York
```

 shall be encoded as:

```
query"=1st%20Avenue%20%26%20E%20111th%20St%2C%20New%20York
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

Points of Interest (POI) Search allows you to request POI results by name, for example, search business by name. We strongly advise you to use the `countrySet` parameter to specify countries where your application needs coverage, as the default behavior will be to search the entire world, potentially returning unnecessary results and/or result in longer search times.

### Brand search

To improve the relevance of the results and the information in the response, Point of Interest (POI) search response includes the brand information that can be used further to parse the response.

Let's make a [POI Category Search](https://docs.microsoft.com/rest/api/maps/search/getsearchpoicategory) request for gas stations near Microsoft campus (Redmond, WA). If you observe the response, you can see brand information for each POI returned.

**Sample query:**

```HTTP
https://atlas.microsoft.com/search/poi/json?subscription-key={subscription-key}&api-version=1.0&query=gas%20station&limit=3&lat=47.6413362&lon=-122.1327968
```

**Response:**

```JSON
{
    "summary": {
        "query": "gas station",
        "queryType": "NON_NEAR",
        "queryTime": 206,
        "numResults": 3,
        "offset": 0,
        "totalResults": 742169,
        "fuzzyLevel": 1,
        "geoBias": {
            "lat": 47.6413362,
            "lon": -122.1327968
        }
    },
    "results": [
        {
            "type": "POI",
            "id": "US/POI/p0/245813",
            "score": 5.663,
            "dist": 1037.0280221303253,
            "info": "search:ta:840531000004190-US",
            "poi": {
                "name": "Chevron",
                "phone": "+(1)-(425)-6532200",
                "brands": [
                    {
                        "name": "Chevron"
                    }
                ],
                "url": "www.chevron.com",
                "classifications": [
                    {
                        "code": "PETROL_STATION",
                        "names": [
                            {
                                "nameLocale": "en-US",
                                "name": "petrol station"
                            }
                        ]
                    }
                ]
            },
            "address": {
                "streetNumber": "2444",
                "streetName": "Bel Red Rd",
                "municipalitySubdivision": "Northeast Bellevue, Bellevue",
                "municipality": "Bellevue",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle East",
                "countrySubdivision": "WA",
                "postalCode": "98007",
                "countryCode": "US",
                "country": "United States Of America",
                "countryCodeISO3": "USA",
                "freeformAddress": "2444 Bel Red Rd, Bellevue, WA 98007",
                "countrySubdivisionName": "Washington"
            },
            "position": {
                "lat": 47.63201,
                "lon": -122.13281
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.63291,
                    "lon": -122.13414
                },
                "btmRightPoint": {
                    "lat": 47.63111,
                    "lon": -122.13148
                }
            },
            "entryPoints": [
                {
                    "type": "main",
                    "position": {
                        "lat": 47.63223,
                        "lon": -122.13311
                    }
                }
            ]
        },
        ...,
        {
            "type": "POI",
            "id": "US/POI/p0/7727106",
            "score": 5.662,
            "dist": 1458.645407416307,
            "info": "search:ta:840539000488527-US",
            "poi": {
                "name": "BROWN BEAR CAR WASH",
                "phone": "+(1)-(425)-6442868",
                "brands": [
                    {
                        "name": "Texaco"
                    }
                ],
                "url": "www.texaco.com/",
                "classifications": [
                    {
                        "code": "PETROL_STATION",
                        "names": [
                            {
                                "nameLocale": "en-US",
                                "name": "petrol station"
                            }
                        ]
                    }
                ]
            },
            "address": {
                "streetNumber": "15248",
                "streetName": "Bel Red Rd",
                "municipalitySubdivision": "Redmond",
                "municipality": "Redmond",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle East",
                "countrySubdivision": "WA",
                "postalCode": "98052",
                "extendedPostalCode": "980525511",
                "countryCode": "US",
                "country": "United States Of America",
                "countryCodeISO3": "USA",
                "freeformAddress": "15248 Bel Red Rd, Redmond, WA 98052",
                "countrySubdivisionName": "Washington"
            },
            "position": {
                "lat": 47.62843,
                "lon": -122.13628
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.62933,
                    "lon": -122.13761
                },
                "btmRightPoint": {
                    "lat": 47.62753,
                    "lon": -122.13495
                }
            },
            "entryPoints": [
                {
                    "type": "main",
                    "position": {
                        "lat": 47.62826,
                        "lon": -122.13626
                    }
                }
            ]
        }
    ]
}
```


### Airport search

POI Search supports searching Airports by using the official Airport codes. For example, **SEA** (Seattle-Tacoma International Airport). 

```HTTP
https://atlas.microsoft.com/search/poi/json?subscription-key={subscription-key}&api-version=1.0&query=SEA 
```

### Nearby search

To retrieve only POI results around a specific location, the [Nearby search API](https://docs.microsoft.com/rest/api/maps/search/getsearchnearby) may be the right choice. This endpoint will only return POI results, and does not take in a search query parameter. To limit the results, it is recommended to set the radius.

## Understanding the responses

Let's make an Address search request to the Azure Maps [search service](https://docs.microsoft.com/rest/api/maps/search) for an address in Seattle. If you look carefully at the request URL below, we have set the `countrySet` parameter to **US** to search for the address in the United States of America.

**Sample query:**

```HTTP
https://atlas.microsoft.com/search/address/json?subscription-key={subscription-key}&api-version=1&query=400%20Broad%20Street%2C%20Seattle%2C%20WA&countrySet=US
```

Further let's have a look at the response structure below. The result types of the result objects in the response are different. If you observe carefully you can see we have three different types of result objects, that are "Point Address", "Street", and "Cross Street". Notice that address search does not return POIs. The `Score` parameter for each response object indicates the relative matching score to scores of other objects in the same response. See [Get Search Address](https://docs.microsoft.com/rest/api/maps/search/getsearchaddress) to know more about response object parameters.

**Supported types of result:**

* **Point Address:** Points on a map with specific address with a street name and number. The highest level of accuracy available for addresses. 

* **Address Range:**  For some streets, there are address points that are interpolated from the beginning and end of the street; those points are represented as address ranges. 

* **Geography:** Areas on a map that represent administrative division of a land, that is, country, state, city. 

* **POI - (Points of Interest):** Points on a map that are worth attention and may be interesting.

* **Street:** Representation of streets on the map. Addresses are resolved to the latitude/longitude coordinate of the street that contains the address. The house number may not be processed. 

* **Cross Street:** Intersections. Representations of junctions; places where two streets intersect.

**Response:**

```JSON
{
    "summary": {
        "query": "400 broad street seattle wa",
        "queryType": "NON_NEAR",
        "queryTime": 129,
        "numResults": 6,
        "offset": 0,
        "totalResults": 6,
        "fuzzyLevel": 1
    },
    "results": [
        {
            "type": "Point Address",
            "id": "US/PAD/p0/43076024",
            "score": 9.894,
            "address": {
                "streetNumber": "400",
                "streetName": "Broad Street",
                "municipalitySubdivision": "Seattle, South Lake Union, Lower Queen Anne",
                "municipality": "Seattle",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle",
                "countrySubdivision": "WA",
                "postalCode": "98109",
                "countryCode": "US",
                "country": "United States Of America",
                "countryCodeISO3": "USA",
                "freeformAddress": "400 Broad Street, Seattle, WA 98109",
                "countrySubdivisionName": "Washington"
            },
            "position": {
                "lat": 47.62039,
                "lon": -122.34928
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.62129,
                    "lon": -122.35061
                },
                "btmRightPoint": {
                    "lat": 47.61949,
                    "lon": -122.34795
                }
            },
            "entryPoints": [
                {
                    "type": "main",
                    "position": {
                        "lat": 47.61982,
                        "lon": -122.34886
                    }
                }
            ]
        },
        {
            "type": "Street",
            "id": "US/STR/p0/2440854",
            "score": 8.129,
            "address": {
                "streetName": "Broad Street",
                "municipalitySubdivision": "Seattle, Westlake, South Lake Union",
                "municipality": "Seattle",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle",
                "countrySubdivision": "WA",
                "postalCode": "98109",
                "extendedPostalCode": "981094347,981094700,981094701,981094702",
                "countryCode": "US",
                "country": "United States Of America",
                "countryCodeISO3": "USA",
                "freeformAddress": "Broad Street, Seattle, WA 98109",
                "countrySubdivisionName": "Washington"
            },
            "position": {
                "lat": 47.62553,
                "lon": -122.33936
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.62545,
                    "lon": -122.33861
                },
                "btmRightPoint": {
                    "lat": 47.62574,
                    "lon": -122.33974
                }
            }
        },
        {
            "type": "Street",
            "id": "US/STR/p0/8450985",
            "score": 8.129,
            "address": {
                "streetName": "Broad Street",
                "municipalitySubdivision": "Seattle, Belltown",
                "municipality": "Seattle",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle",
                "countrySubdivision": "WA",
                "postalCode": "98109,98121",
                "extendedPostalCode": "981094991,981211117,981211237,981213206",
                "countryCode": "US",
                "country": "United States Of America",
                "countryCodeISO3": "USA",
                "freeformAddress": "Broad Street, Seattle, WA",
                "countrySubdivisionName": "Washington"
            },
            "position": {
                "lat": 47.61691,
                "lon": -122.35251
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.61502,
                    "lon": -122.35041
                },
                "btmRightPoint": {
                    "lat": 47.61857,
                    "lon": -122.35484
                }
            }
        },
        ...,
        ...,
        {
            "type": "Cross Street",
            "id": "US/XSTR/p1/3816818",
            "score": 6.759,
            "address": {
                "streetName": "Broad Street & Valley Street",
                "municipalitySubdivision": "South Lake Union, Seattle",
                "municipality": "Seattle",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle",
                "countrySubdivision": "WA",
                "postalCode": "98109",
                "countryCode": "US",
                "country": "United States Of America",
                "countryCodeISO3": "USA",
                "freeformAddress": "Broad Street & Valley Street, Seattle, WA 98109",
                "countrySubdivisionName": "Washington"
            },
            "position": {
                "lat": 47.62574,
                "lon": -122.33861
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.62664,
                    "lon": -122.33994
                },
                "btmRightPoint": {
                    "lat": 47.62484,
                    "lon": -122.33728
                }
            }
        }
    ]
}
```

### Geometry

When the response type is **Geometry**, it can include the geometry ID that is returned in the **dataSources** object under "geometry" and "id". For example, [Get Polygon service](https://docs.microsoft.com/rest/api/maps/search/getsearchpolygon) allows you to request the geometry data in GeoJSON format, such as a city or airport outline for a set of entities. You can use this boundary data for [Geofencing](https://docs.microsoft.com/azure/azure-maps/tutorial-geofence) or [Search POIs inside the geometry](https://docs.microsoft.com/rest/api/maps/search/postsearchinsidegeometry).


[Search Address](https://docs.microsoft.com/rest/api/maps/search/getsearchaddress) or [Search Fuzzy](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) API responses can include the **geometry ID** that is returned in the dataSources object under "geometry" and "id".


```JSON 
"dataSources": { 
        "geometry": { 
            "id": "00005557-4100-3c00-0000-000059690938" // The geometry ID is returned in the dataSources object under "geometry" and "id".
        }
} 
```

## Next steps

* Learn [how to build Azure Maps Search service requests](https://docs.microsoft.com/azure/azure-maps/how-to-search-for-address).
* Explore the Azure Maps [search service API documentation](https://docs.microsoft.com/rest/api/maps/search). 
