---
title: Search efficiently by using Azure Maps Search Service  | Microsoft Azure Maps 
description: Follow best practices for Azure Maps Search Service.
author: walsehgal
ms.author: v-musehg
ms.date: 04/08/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Best practices for Azure Maps Search Service

Azure Maps [Search Service](https://docs.microsoft.com/rest/api/maps/search) includes APIs that offer various capabilities. You can search anything from addresses to point-of-interest (POI) data around a target location. 

In this article, you'll learn best practices to call data through Azure Maps Search Services. You'll learn how to:

* Build queries to return relevant matches.
* Limit search results.
* Learn the differences between result types.
* Read the address search-response structure.

## Prerequisites

To call to the Azure Maps service APIs, you need an account and a key. For more information, see [Create an account](quick-demo-map-app.md#create-an-account-with-azure-maps) and [Get the primary key](quick-demo-map-app.md#get-the-primary-key-for-your-account). The primary key is the subscription for your account. 

For details about authentication, see [Manage authentication in Azure Maps](./how-to-manage-authentication.md).

> [!TIP]
> To query Search Service, you can use the [Postman app](https://www.getpostman.com/apps) to build REST calls. Or you can use any API development environment that you prefer.

## Best practices to geocode addresses

When you search for a full or partial address, Azure Maps Search Service returns the longitude and latitude coordinates of the address. This process is called *geocoding*. The ability to geocode in a country depends on the available road data and the precision of the geocoding service.

For more information about Azure Maps geocoding capabilities by country or region, see [Geocoding coverage](https://docs.microsoft.com/azure/azure-maps/geocoding-coverage).

### Limit search results

In this section, you learn how to use Azure Maps APIs to limit search results. 

> [!NOTE]
> Not all search APIs fully support the following parameters.

#### Geobiased search results

To geobias results to the relevant area for your user, always add as many location details as possible. You might want to restrict the search results by specifying some input types:

* Set the `countrySet` parameter. By default, the service searches the entire world. So if your query includes no `countrySet` parameter, then the search might return unnecessary or inaccurate results. 

    For example, if you set the `countrySet` parameter to `US,FR`, then a search for a city named *Bellevue* will return results from the USA and France. Both countries have cities named Bellevue.

* Use the `btmRight` parameter and `topleft` parameter to set the bounding box. These parameters restrict the search to a specific area on the map.

* To influence the area of relevance for the results, define the `lat` and `lon` coordinate parameters. Use the `radius` parameter to set the radius of the search area.


#### Fuzzy search parameters

Use the Azure Maps [Search Fuzzy API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) when you don't know your user inputs for a search query. The Search Fuzzy API combines POI searching and geocoding into a canonical *single-line search*: 

* The `minFuzzyLevel` and `maxFuzzyLevel` parameters help return relevant matches even when query parameters don't exactly correspond to the information that the user wants. Most search queries default to `minFuzzyLevel=1` and `maxFuzzyLevel=2`. These default settings increase performance and reduce unusual results. 

    For example, when the `maxFuzzyLevel` parameter is set to 2, the search term *restrant*, is matched to *restaurant*. You can override the default fuzzy levels when you need to. 

* Use the `idxSet` parameter to prioritize the exact set of result types. To prioritize an exact set of results, you can submit a comma-separated list of indexes. In your list, the item order doesn't matter. Azure Maps supports the following indexes:

    * `Addr` - **Address ranges**: Address points that are interpolated from the beginning and end of the street. These points are represented as address ranges.
    * `Geo` - **Geographies**: Administrative divisions of land. A geography can be a country, state, or city, for example.
    * `PAD` - **Point addresses**: Addresses that include a street name and number. Point addresses can be found in an index. An example is *Soquel Dr 2501*. A point address provides the highest level of accuracy available for addresses.  
    * `POI` - **Points of interest**: Points on a map that are considered to be worth attention or that might be interesting. The [Search Address API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddress) doesn't return POIs.  
    * `Str` - **Streets**: Streets on the map.
    * `XStr` - **Cross streets or intersections**: Junctions or places where two streets intersect.


#### Usage examples

* `idxSet=POI` - Search POIs only. 

* `idxSet=PAD,Addr` - Search addresses only. `PAD` indicates the point address, and `Addr` indicates the address range.

### Reverse-geocode and filter for a geography entity type

When you do a reverse-geocode search in the [Search Address Reverse API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse), the service can return polygons for the administrative areas. If your request includes the `entityType` parameter, then you can narrow the search for specific geography entity types. The resulting response contains the geography ID and the entity type that was matched. If you provide more than one entity, then the endpoint returns the *smallest entity available*. 

You can use the returned geometry ID to get the geography's geometry through the [Search Polygon service](https://docs.microsoft.com/rest/api/maps/search/getsearchpolygon).

#### Sample request

```HTTP
https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&subscription-key={subscription-key}&query=47.6394532,-122.1304551&language=en-US&entityType=Municipality
```

#### Response

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

### Set the results language

Use the `language` parameter to set the language for the returned search results. If the request doesn't set the language, then Search Service automatically defaults to the most common language in the country or region. When no data is available in the specified language, the default language is used. 

For more information, see [Azure Maps supported languages](https://docs.microsoft.com/azure/azure-maps/supported-languages).


### Use predictive mode (automatic suggestions)

To find more matches for partial queries, set the `typeahead` parameter to `true`. This query is interpreted as a partial input, and the search enters predictive mode. If you don't set the `typeahead` parameter to `true`, then the service assumes that all relevant information has been passed in.

In the following sample query, the Search Address service is queried for *Microso*. Here, the `typeahead` parameter set to `true`. The response shows that the search service interpreted the query as partial query. The response contains results for an automatically suggested query.

#### Sample query

```HTTP
https://atlas.microsoft.com/search/address/json?subscription-key={subscription-key}&api-version=1.0&typeahead=true&countrySet=US&lat=47.6370891183&lon=-122.123736172&query=Microsoft
```

#### Response

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


### Encode a URI to handle special characters 

Special characters sometimes appear in cross-street addresses, such as *1st Avenue & Union Street, Seattle*. For this kind of address, encode the ampersand character (`&`) before you send the request. 

We recommend that you encode character data in a URI. In a URI, you encode all characters by using a percentage sign (`%`) and a two-character hexadecimal value that corresponds to the characters' UTF-8 code.

#### Usage examples

Start with this address:

```
query=1st Avenue & E 111th St, New York
```

Encode the address:

```
query=1st%20Avenue%20%26%20E%20111th%20St%2C%20New%20York
```

You can use the following methods.

JavaScript or TypeScript:
```Javascript
encodeURIComponent(query)
```

C# or Visual Basic:
```csharp
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


## Best practices for POI searching

In a POI search, you can request POI results by name. For example, you can search for a business by name. 

We strongly recommend that you use the `countrySet` parameter to specify countries where your application needs coverage. The default behavior is to search the entire world. This broad search might return unnecessary results, and the search might take a long time.

### Brand search

To improve the relevance of the results and the information in the response, a POI search response includes brand information. You can use this information to further to parse the response.

In a request, you can submit a comma-separated list of brand names. Use the list to restrict the results to specific brands by setting the `brandSet` parameter. In your list, item order doesn't matter. When you provide multiple brand lists, the results that are returned must belong to at least one of your lists.

To explore brand searching, let's make a [POI category search](https://docs.microsoft.com/rest/api/maps/search/getsearchpoicategory) request. In the following example, we look for gas stations near the Microsoft campus in Redmond, Washington. The response shows brand information for each POI that was returned.


#### Sample query

```HTTP
https://atlas.microsoft.com/search/poi/json?subscription-key={subscription-key}&api-version=1.0&query=gas%20station&limit=3&lat=47.6413362&lon=-122.1327968
```

#### Response

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

By using the Search POI API, you can look for airports by using their official code. For example, you can use *SEA* to find the Seattle-Tacoma International Airport: 

```HTTP
https://atlas.microsoft.com/search/poi/json?subscription-key={subscription-key}&api-version=1.0&query=SEA 
```

### Nearby search

To retrieve POI results around a specific location, you can try using the [Search Nearby API](https://docs.microsoft.com/rest/api/maps/search/getsearchnearby). The endpoint returns only POI results. It doesn't take in a search query parameter. 

To limit the results, we recommend that you set the radius.

## Understanding the responses

Let's find an address in Seattle by making an address-search request to the Azure Maps Search Service. In the following request URL, we set the `countrySet` parameter to `US` to search for the address in the USA.

### Sample query

```HTTP
https://atlas.microsoft.com/search/address/json?subscription-key={subscription-key}&api-version=1&query=400%20Broad%20Street%2C%20Seattle%2C%20WA&countrySet=US
```

Let's also look at the response structure that follows. In the response, the types of the result objects are different. If you look carefully, you see three types of result objects:

* Point Address
* Street
* Cross Street

Notice that the address search doesn't return POIs.  

The `Score` parameter for each response object indicates how the matching score relates to the scores of other objects in the same response. For more information about response object parameters, see [Get Search Address](https://docs.microsoft.com/rest/api/maps/search/getsearchaddress).

### Supported types of results

* **Point Address**: Points on a map that have a specific address with a street name and number. Point Address provides the highest level of accuracy for addresses. 

* **Address Range**: The range of address points that are interpolated from the beginning and end of the street.  

* **Geography**: Areas on a map that represent administrative divisions of a land, for example, country, state, or city. 

* **POI**: Points on a map that are worth attention and that might be interesting.

* **Street**: Streets on the map. Addresses are resolved to the latitude and longitude coordinates of the street that contains the address. The house number might not be processed. 

* **Cross Street**: Intersections. Cross streets represent junctions where two streets intersect.

### Response

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

A response type of *Geometry* can include the geometry ID that's returned in the `dataSources` object under `geometry` and `id`. For example, you can use the [Search Polygon service](https://docs.microsoft.com/rest/api/maps/search/getsearchpolygon) to request the geometry data in a GeoJSON format. In this format, you can get a city or airport outline for a set of entities. You can then use this boundary data to [Set up a geofence](https://docs.microsoft.com/azure/azure-maps/tutorial-geofence) or [Search POIs inside the geometry](https://docs.microsoft.com/rest/api/maps/search/postsearchinsidegeometry).


Responses for the [Search Address](https://docs.microsoft.com/rest/api/maps/search/getsearchaddress) API or the [Search Fuzzy](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) API can include the geometry ID that's returned in the `dataSources` object under `geometry` and `id`:


```JSON 
"dataSources": { 
        "geometry": { 
            "id": "00005557-4100-3c00-0000-000059690938" // The geometry ID is returned in the dataSources object under "geometry" and "id".
        }
} 
```

## Next steps

* Learn [how to build Azure Maps Search Service requests](https://docs.microsoft.com/azure/azure-maps/how-to-search-for-address).
* Explore the Azure Maps [Search Service API documentation](https://docs.microsoft.com/rest/api/maps/search). 
