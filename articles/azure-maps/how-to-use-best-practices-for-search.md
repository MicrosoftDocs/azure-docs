---
title: Best practices for Azure Maps Search service
titleSuffix: Microsoft Azure Maps
description: Learn how to apply the best practices when using the Search service from Microsoft Azure Maps.
author: eriklindeman
ms.author: eriklind
ms.date: 10/28/2021
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps

---

# Best practices for Azure Maps Search service

Azure Maps [Search service] includes API that offers various capabilities to help developers to search addresses, places, business listings by name or category, and other geographic information. For example, [Search Fuzzy] allows users to search for an address or Point of Interest (POI).

This article explains how to apply sound practices when you call data from Azure Maps Search service. You'll learn how to:
> [!div class="checklist"]
>
> * Build queries to return relevant matches
> * Limit search results
> * Learn the differences between result types
> * Read the address search-response structure

## Prerequisites

* An [Azure Maps account]
* A [subscription key]

This article uses the [Postman] application to build REST calls, but you can choose any API development environment.

## Best practices to geocode addresses

When you search for a full or partial address by using Azure Maps Search service, the API reads keywords from your search query. Then it returns the longitude and latitude coordinates of the address. This process is called *geocoding*.

The ability to geocode in a country/region depends on the availability of road data and the precision of the geocoding service. For more information about Azure Maps geocoding capabilities by country or region, see [Geocoding coverage].

### Limit search results

 Azure Maps Search API can help you limit search results appropriately. You limit results so that you can display relevant data to your users.

> [!NOTE]
> The search APIs support more parameters than just the ones that this article discusses.

#### Geobiased search results

To geobias results to the relevant area for your user, always add as many location details as possible. You might want to restrict the search results by specifying some input types:

* Set the `countrySet` parameter. You can set it to `US,FR`, for example. By default, the API searches the entire world, so it can return unnecessary results. If your query has no `countrySet` parameter, then the search might return inaccurate results. For example, a search for a city named *Bellevue* returns results from the USA and France because both countries/regions contain a city named *Bellevue*.

* You can use the `btmRight` and `topleft` parameters to set the bounding box. These parameters restrict the search to a specific area on the map.

* To influence the area of relevance for the results, define the `lat` and `lon` coordinate parameters. Use the `radius` parameter to set the radius of the search area.

#### Fuzzy search parameters

We recommend that you use [Search Fuzzy] when you don't know your user inputs for a search query. For example, input from the user could be an address or the type of Point of Interest (POI), like *shopping mall*. The API combines POI searching and geocoding into a canonical *single-line search*:

* The `minFuzzyLevel` and `maxFuzzyLevel` parameters help return relevant matches even when query parameters don't exactly match the information that the user wants. To maximize performance and reduce unusual results, set search queries to defaults of `minFuzzyLevel=1` and `maxFuzzyLevel=2`.

    For example, when the `maxFuzzyLevel` parameter is set to 2, the search term *restrant* is matched to *restaurant*. You can override the default fuzzy levels when you need to.

* Use the `idxSet` parameter to prioritize the exact set of result types. To prioritize an exact set of results, you can submit a comma-separated list of indexes. In your list, the item order doesn't matter. Azure Maps supports the following indexes:

* `Addr` - **Address ranges**: Address points that are interpolated from the beginning and end of the street. These points are represented as address ranges.
* `Geo` - **Geographies**: Administrative divisions of land. A geography can be a country/region, state, or city, for example.
* `PAD` - **Point addresses**: Addresses that include a street name and number. Point addresses can be found in an index. An example is *Soquel Dr 2501*. A point address provides the highest level of accuracy available for addresses.  
* `POI` - **Points of interest**: Points on a map that are considered to be worth attention or that might be interesting. [Search Address] doesn't return POIs.  
* `Str` - **Streets**: Streets on the map.
* `XStr` - **Cross streets or intersections**: Junctions or places where two streets intersect.

#### Usage examples

* `idxSet=POI` - Search POIs only.

* `idxSet=PAD,Addr` - Search addresses only. `PAD` indicates the point address, and `Addr` indicates the address range.

### Reverse-geocode and filter for a geography entity type

When you do a reverse-geocode search using [Search Address Reverse], the service can return polygons for administrative areas. For example, you might want to fetch the area polygon for a city. To narrow the search to specific geography entity types, include the `entityType` parameter in your requests.

The resulting response contains the geography ID and the entity type that was matched. If you provide more than one entity, then the endpoint returns the *smallest entity available*. You can use the returned geometry ID to get the geography's geometry through the [Search Polygon service].

#### Sample request

```HTTP
https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&subscription-key={Your-Azure-Maps-Subscription-key}&query=47.6394532,-122.1304551&language=en-US&entityType=Municipality
```

#### Response

```JSON
{
    "summary": {
        "queryTime": 14,
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

Use the `language` parameter to set the language for the returned search results. If the request doesn't set the language, then by default Search service uses the most common language in the country or region. When no data is available in the specified language, the default language is used.

For more information, see [Azure Maps supported languages].


### Use predictive mode (automatic suggestions)

To find more matches for partial queries, set the `typeahead` parameter to `true`. This query is interpreted as a partial input, and the search enters predictive mode. If you don't set the `typeahead` parameter to `true`, then the service assumes that all relevant information has been passed in.

In the following sample query, the Search Address service is queried for *Microso*. Here, the `typeahead` parameter set to `true`. The response shows that the search service interpreted the query as partial query. The response contains results for an automatically suggested query.

#### Sample query

```HTTP
https://atlas.microsoft.com/search/address/json?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=1.0&typeahead=true&countrySet=US&lat=47.6370891183&lon=-122.123736172&query=Microsoft
```

#### Response

```JSON
{
    "summary": {
        "query": "microsoft",
        "queryType": "NON_NEAR",
        "queryTime": 18,
        "numResults": 7,
        "offset": 0,
        "totalResults": 7,
        "fuzzyLevel": 1,
        "geoBias": {
            "lat": 47.6370891183,
            "lon": -122.123736172
        }
    },
    "results": [
        {
            "type": "Street",
            "id": "US/STR/p0/9438784",
            "score": 2.594099998474121,
            "dist": 314.0590106663596,
            "address": {
                "streetName": "Microsoft Way",
                "municipalitySubdivision": "Redmond",
                "municipality": "Redmond",
            },
            "position": {
                "lat": 47.63988,
                "lon": -122.12438
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.64223,
                    "lon": -122.1256,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 47.63748,
                    "lon": -122.12309,
                    "valid": true
                }
            }
        },
        {
            "type": "Street",
            "id": "US/STR/p0/1756074",
            "score": 2.592679977416992,
            "dist": 876.0272035824189,
            "address": {
                "streetName": "Microsoft Road",
                "municipalitySubdivision": "Redmond",
                "municipality": "Redmond",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle East",
                "countrySubdivision": "WA",
                "countrySubdivisionName": "Washington",
                "postalCode": "98052",
                "countryCode": "US",
                "country": "United States",
                "countryCodeISO3": "USA",
                "freeformAddress": "Microsoft Road, Redmond, WA 98052"
            },
            "position": {
                "lat": 47.64032,
                "lon": -122.1344
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.64253,
                    "lon": -122.13535,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 47.63816,
                    "lon": -122.13305,
                    "valid": true
                }
            }
        },
        {
            "type": "Street",
            "id": "US/STR/p0/1470668",
            "score": 2.5290400981903076,
            "dist": 2735.4883918101486,
            "address": {
                "streetName": "Microsoft West Campus Road",
                "municipalitySubdivision": "Redmond",
                "municipality": "Bellevue",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle East",
                "countrySubdivision": "WA",
                "countrySubdivisionName": "Washington",
                "postalCode": "98007",
                "countryCode": "US",
                "country": "United States",
                "countryCodeISO3": "USA",
                "freeformAddress": "Microsoft West Campus Road, Bellevue, WA 98007"
            },
            "position": {
                "lat": 47.65784,
                "lon": -122.14335
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.65785,
                    "lon": -122.14335,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 47.65784,
                    "lon": -122.14325,
                    "valid": true
                }
            }
        },
        {
            "type": "Street",
            "id": "US/STR/p0/12812615",
            "score": 2.527509927749634,
            "dist": 2870.9579016916873,
            "address": {
                "streetName": "Microsoft West Campus Road",
                "municipalitySubdivision": "Redmond",
                "municipality": "Redmond",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle East",
                "countrySubdivision": "WA",
                "countrySubdivisionName": "Washington",
                "postalCode": "98052",
                "countryCode": "US",
                "country": "United States",
                "countryCodeISO3": "USA",
                "freeformAddress": "Microsoft West Campus Road, Redmond, WA 98052"
            },
            "position": {
                "lat": 47.66034,
                "lon": -122.1404
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.66039,
                    "lon": -122.14325,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 47.65778,
                    "lon": -122.13749,
                    "valid": true
                }
            }
        },
        {
            "type": "Street",
            "id": "US/STR/p0/197588",
            "score": 2.4630401134490967,
            "dist": 878.1404663812472,
            "address": {
                "streetName": "157th Avenue Northeast",
                "municipalitySubdivision": "Redmond",
                "municipality": "Redmond",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle East",
                "countrySubdivision": "WA",
                "countrySubdivisionName": "Washington",
                "postalCode": "98052",
                "extendedPostalCode": "980525344, 980525398, 980525399",
                "countryCode": "US",
                "country": "United States",
                "countryCodeISO3": "USA",
                "freeformAddress": "157th Avenue Northeast, Redmond, WA 98052"
            },
            "position": {
                "lat": 47.64351,
                "lon": -122.13056
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.64473,
                    "lon": -122.13058,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 47.6425,
                    "lon": -122.13016,
                    "valid": true
                }
            }
        },
        {
            "type": "Street",
            "id": "US/STR/p0/3033991",
            "score": 2.0754499435424805,
            "dist": 3655467.8844475765,
            "address": {
                "streetName": "Microsoft Way",
                "municipalitySubdivision": "Yorkmount, Charlotte",
            },
            "position": {
                "lat": 35.14267,
                "lon": -80.91824
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 35.14287,
                    "lon": -80.91839,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 35.14267,
                    "lon": -80.91814,
                    "valid": true
                }
            }
        },
        {
            "type": "Street",
            "id": "US/STR/p0/8395877",
            "score": 2.0754499435424805,
            "dist": 3655437.0037482483,
            "address": {
                "streetName": "Microsoft Way",
                "municipalitySubdivision": "Charlotte",
                "municipality": "Charlotte",
                "countrySecondarySubdivision": "Mecklenburg",
                "countryTertiarySubdivision": "Township 1 Charlotte",
                "countrySubdivision": "NC",
                "countrySubdivisionName": "North Carolina",
                "postalCode": "28273",
                "extendedPostalCode": "282738105, 282738106, 282738108, 2827382, 282738200",
                "countryCode": "US",
                "country": "United States",
                "countryCodeISO3": "USA",
                "freeformAddress": "Microsoft Way, Charlotte, NC 28273"
            },
            "position": {
                "lat": 35.14134,
                "lon": -80.9198
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 35.14274,
                    "lon": -80.92159,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 35.14002,
                    "lon": -80.91824,
                    "valid": true
                }
            }
        }
    ]
}
```


### Encode a URI to handle special characters 

To find cross street addresses, you must encode the URI to handle special characters in the address. Consider this address example: *1st Avenue & Union Street, Seattle*. Here, encode the ampersand character (`&`) before you send the request.

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

```javascript
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

We strongly recommend that you use the `countrySet` parameter to specify countries/regions where your application needs coverage. The default behavior is to search the entire world. This broad search might return unnecessary results, and the search might take a long time.

### Brand search

To improve the relevance of the results and the information in the response, a POI search response includes brand information. You can use this information to further to parse the response.

In a request, you can submit a comma-separated list of brand names. Use the list to restrict the results to specific brands by setting the `brandSet` parameter. In your list, item order doesn't matter. When you provide multiple brand lists, the results that are returned must belong to at least one of your lists.

To explore brand searching, let's make a [POI category search] request. In the following example, we look for gas stations near the Microsoft campus in Redmond, Washington. The response shows brand information for each POI that was returned.

#### Sample query

```HTTP
https://atlas.microsoft.com/search/poi/json?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=1.0&query=gas%20station&limit=3&lat=47.6413362&lon=-122.1327968
```

#### Response

```JSON
{
    "summary": {
        "query": "gas station",
        "queryType": "NON_NEAR",
        "queryTime": 276,
        "numResults": 3,
        "offset": 0,
        "totalResults": 762680,
        "fuzzyLevel": 1,
        "geoBias": {
            "lat": 47.6413362,
            "lon": -122.1327968
        }
    },
    "results": [
        {
            "type": "POI",
            "id": "US/POI/p0/8831765",
            "score": 5.6631999015808105,
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
                "categorySet": [
                    {
                        "id": 7311
                    }
                ],
                "url": "www.chevron.com",
                "categories": [
                    "petrol station"
                ],
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
            },
            "position": {
                "lat": 47.63201,
                "lon": -122.13281
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.63291,
                    "lon": -122.13414,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 47.63111,
                    "lon": -122.13148,
                    "valid": true
                }
            },
            "entryPoints": [
                {
                    "type": "main",
                    "position": {
                        "lat": 47.63222,
                        "lon": -122.13312,
                        "valid": true
                    }
                }
            ]
        },
        {
            "type": "POI",
            "id": "US/POI/p0/8831752",
            "score": 5.662710189819336,
            "dist": 1330.1278248163273,
            "info": "search:ta:840539001100326-US",
            "poi": {
                "name": "76",
                "phone": "+(1)-(425)-7472126",
                "brands": [
                    {
                        "name": "76"
                    }
                ],
                "categorySet": [
                    {
                        "id": 7311
                    }
                ],
                "url": "www.76.com",
                "categories": [
                    "petrol station"
                ],
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
                "streetNumber": "2421",
                "streetName": "148Th Ave Ne",
                "municipalitySubdivision": "Redmond, Bridle Trails, Bellevue",
                "municipality": "Redmond, Bellevue",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle East",
                "countrySubdivision": "WA",
                "countrySubdivisionName": "Washington",
                "postalCode": "98007",
                "countryCode": "US",
                "country": "United States",
                "countryCodeISO3": "USA",
                "freeformAddress": "2421 148Th Ave Ne, Bellevue, WA 98007",
                "localName": "Bellevue"
            },
            "position": {
                "lat": 47.63187,
                "lon": -122.14365
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.63277,
                    "lon": -122.14498,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 47.63097,
                    "lon": -122.14232,
                    "valid": true
                }
            },
            "entryPoints": [
                {
                    "type": "minor",
                    "position": {
                        "lat": 47.63187,
                        "lon": -122.14374,
                        "valid": true
                    }
                },
                {
                    "type": "main",
                    "position": {
                        "lat": 47.63186,
                        "lon": -122.14313,
                        "valid": true
                    }
                }
            ]
        },
        {
            "type": "POI",
            "id": "US/POI/p0/8831764",
            "score": 5.662449836730957,
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
                "categorySet": [
                    {
                        "id": 7311
                    }
                ],
                "url": "www.texaco.com/",
                "categories": [
                    "petrol station"
                ],
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
            },
            "position": {
                "lat": 47.62843,
                "lon": -122.13628
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.62933,
                    "lon": -122.13761,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 47.62753,
                    "lon": -122.13495,
                    "valid": true
                }
            },
            "entryPoints": [
                {
                    "type": "main",
                    "position": {
                        "lat": 47.62827,
                        "lon": -122.13628,
                        "valid": true
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
https://atlas.microsoft.com/search/poi/json?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=1.0&query=SEA 
```

### Nearby search

To retrieve POI results around a specific location, you can try using [Search Nearby]. The endpoint returns only POI results. It doesn't take in a search query parameter.

To limit the results, we recommend that you set the radius.

## Understanding the responses

Let's find an address in Seattle by making an address-search request to the Azure Maps Search service. In the following request URL, we set the `countrySet` parameter to `US` to search for the address in the USA.

### Sample query

```HTTP
https://atlas.microsoft.com/search/address/json?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=1&query=400%20Broad%20Street%2C%20Seattle%2C%20WA&countrySet=US
```

### Supported types of results

* **Point Address**: Points on a map that have a specific address with a street name and number. Point Address provides the highest level of accuracy for addresses.

* **Address Range**: The range of address points that are interpolated from the beginning and end of the street.  

* **Geography**: Areas on a map that represent administrative divisions of a land, for example, country/region, state, or city.

* **POI**: Points on a map that are worth attention and that might be interesting.

* **Street**: Streets on the map. Addresses are resolved to the latitude and longitude coordinates of the street that contains the address. The house number might not be processed.

* **Cross Street**: Intersections. Cross streets represent junctions where two streets intersect.

### Response

Let's look at the response structure. In the response that follows, the types of the result objects are different. If you look carefully, you see three types of result objects:

* Point Address
* Street
* Cross Street

Notice that the address search doesn't return POIs.  

The `Score` parameter for each response object indicates how the matching score relates to the scores of other objects in the same response. For more information about response object parameters, see [Get Search Address].

```JSON
{
    "summary": {
        "query": "400 broad street seattle wa",
        "queryType": "NON_NEAR",
        "queryTime": 146,
        "numResults": 6,
        "offset": 0,
        "totalResults": 7,
        "fuzzyLevel": 1
    },
    "results": [
        {
            "type": "Point Address",
            "id": "US/PAD/p0/28725082",
            "score": 9.893799781799316,
            "address": {
                "streetNumber": "400",
                "streetName": "Broad Street",
            },
            "position": {
                "lat": 47.62039,
                "lon": -122.34928
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.62129,
                    "lon": -122.35061,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 47.61949,
                    "lon": -122.34795,
                    "valid": true
                }
            },
            "entryPoints": [
                {
                    "type": "main",
                    "position": {
                        "lat": 47.61982,
                        "lon": -122.34886,
                        "valid": true
                    }
                }
            ]
        },
        {
            "type": "Street",
            "id": "US/STR/p0/6700384",
            "score": 8.129190444946289,
            "address": {
                "streetName": "Broad Street",
            },
            "position": {
                "lat": 47.61724,
                "lon": -122.35207
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.61825,
                    "lon": -122.35336,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 47.61626,
                    "lon": -122.35078,
                    "valid": true
                }
            }
        },
        {
            "type": "Street",
            "id": "US/STR/p0/9701953",
            "score": 8.129190444946289,
            "address": {
                "streetName": "Broad Street",
            },
            "position": {
                "lat": 47.61965,
                "lon": -122.349
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.62066,
                    "lon": -122.35041,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 47.61857,
                    "lon": -122.34761,
                    "valid": true
                }
            }
        },
        {
            "type": "Street",
            "id": "US/STR/p0/11721297",
            "score": 8.129190444946289,
            "address": {
                "streetName": "Broad Street",
                "municipalitySubdivision": "Seattle, Downtown Seattle, Denny Regrade, Belltown",
                "municipality": "Seattle",
                "countrySecondarySubdivision": "King",
                "countryTertiarySubdivision": "Seattle",
                "countrySubdivision": "WA",
                "countrySubdivisionName": "Washington",
                "postalCode": "98121",
                "extendedPostalCode": "981211237",
                "countryCode": "US",
                "country": "United States",
                "countryCodeISO3": "USA",
                "freeformAddress": "Broad Street, Seattle, WA 98121"
            },
            "position": {
                "lat": 47.61825,
                "lon": -122.35078
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.61857,
                    "lon": -122.35078,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 47.61825,
                    "lon": -122.35041,
                    "valid": true
                }
            }
        },
        {
            "type": "Cross Street",
            "id": "US/XSTR/p1/232144",
            "score": 6.754479885101318,
            "address": {
                "streetName": "Broad Street & Valley Street",
                "municipalitySubdivision": "South Lake Union, Seattle",
            },
            "position": {
                "lat": 47.62545,
                "lon": -122.33974
            },
            "viewport": {
                "topLeftPoint": {
                    "lat": 47.62635,
                    "lon": -122.34107,
                    "valid": true
                },
                "btmRightPoint": {
                    "lat": 47.62455,
                    "lon": -122.33841,
                    "valid": true
                }
            }
        }
    ]
}
```

### Geometry

A response type of *Geometry* can include the geometry ID that's returned in the `dataSources` object under `geometry` and `id`. For example, you can use the [Search Polygon service] to request the geometry data in a GeoJSON format. By using this format, you can get a city or airport outline for a set of entities. You can then use this boundary data to [Set up a geofence] or [Search POIs inside the geometry].

Responses for [Search Address] or the [Search Fuzzy] can include the geometry ID that's returned in the `dataSources` object under `geometry` and `id`:

```JSON
"dataSources": { 
        "geometry": { 
            "id": "00005557-4100-3c00-0000-000059690938" // The geometry ID is returned in the dataSources object under "geometry" and "id".
        }
} 
```

## Next steps

To learn more, please see:

> [!div class="nextstepaction"]
> [How to build Azure Maps Search service requests](./how-to-search-for-address.md)

> [!div class="nextstepaction"]
> [Search service API documentation](/rest/api/maps/search)

[Search service]: /rest/api/maps/search
[Search Fuzzy]: /rest/api/maps/search/getsearchfuzzy
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Postman]: https://www.postman.com/downloads/
[Geocoding coverage]: geocoding-coverage.md
[Search Address Reverse]: /rest/api/maps/search/getsearchaddressreverse
[POI category search]: /rest/api/maps/search/getsearchpoicategory
[Search Nearby]: /rest/api/maps/search/getsearchnearby
[Get Search Address]: /rest/api/maps/search/getsearchaddress

[Azure Maps supported languages]: supported-languages.md
[Search Address]: /rest/api/maps/search/getsearchaddress
[Search Polygon service]: /rest/api/maps/search/getsearchpolygon
[Set up a geofence]: tutorial-geofence.md
[Search POIs inside the geometry]: /rest/api/maps/search/postsearchinsidegeometry
