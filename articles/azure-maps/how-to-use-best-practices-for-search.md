---
title: Search efficiently using the Azure Maps Search Service  | Microsoft Azure Maps 
description: Learn how to apply best practices for the Search service using Microsoft Azure Maps

author: walsehgal
ms.author: v-musehg
ms.date: 01/23/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Best practices to use Azure Maps Search Service

Azure Maps [Search Service](https://docs.microsoft.com/rest/api/maps/search) includes APIs with various capabilities. For example, the Address Search API is used to search Point of Interest (POI) or data around a specific location. This article demonstrates sound practices to apply when calling data from Azure Maps Search Services. You will learn how to:

* Build queries to return relevant matches
* Limit search results
* Learn difference between various result types
* Read the address search response structure


## Prerequisites

To make any calls to the Maps service APIs, you need an Azure Maps account and a key. If you need to, follow instructions in [Create an account](quick-demo-map-app.md#create-an-account-with-azure-maps) and [get a primary key](quick-demo-map-app.md#get-the-primary-key-for-your-account). For more information on authentication in Azure Maps, see [manage authentication in Azure Maps](./how-to-manage-authentication.md).

> [!Tip]
> To query the search service, you can use the [Postman app](https://www.getpostman.com/apps) to build REST calls or you can use any API development environment that you prefer.


## Best practices for Geocoding (Address Search)

When you search for a full or a partial address using Azure Maps Search Service, the API reads keywords from your search query and returns the longitude and latitude coordinates of the address. This process is called geocoding. The ability to geocode in a country is dependent upon the road data coverage and the geocoding precision of the geocoding service.

See [geocoding coverage](https://docs.microsoft.com/azure/azure-maps/geocoding-coverage) to know more about Azure Maps geocoding capabilities by country/region.

### Limit search results

 Azure Maps Search API can help you limit search results appropriately, so you can display relevant data to your users.

   > [!Note]
   > Not all of the search APIs supported parameters are listed below

   **Geo-bias search results**

   In order to geo-bias your results to the relevant area for your user, you should always add the maximum possible detailed location input. To restrict the search results, consider adding the following input types:

   1. Set the `countrySet` parameter, for example "US,FR". The default search behavior is to search the entire world, potentially returning unnecessary results. If your query does have the `countrySet` parameter, the search may return inaccurate results. For example, search for a city named **Bellevue** will return results from USA and France, since there are cities named **Bellevue** in broth the France and the USA.

   2. You can use the `btmRight` and `topleft` parameters to set the bounding box, to restrict the search to a specific area on the map.

   3. To influence the area of relevance for the results, you can define the `lat`and `lon` coordinate parameters and set the radius of the search area using the `radius` parameter.


   **Fuzzy search parameters**
   
  Azure Maps [Fuzzy Search API](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) is the recommended service to use when you don't know what your user inputs are for a search query. The API combines Point of Interest (POI) search and geocoding into a canonical *single-line search*.

   1. The `minFuzzyLevel` and `maxFuzzyLevel` help return relevant matches even when query parameters do not match exactly to the wanted information. To gain performance and reduce unusual results, default search queries to `minFuzzyLevel=1` and `maxFuzzyLevel=2` . Take an example of a search term "restrant", it is matched to "restaurant" when the `maxFuzzyLevel` is set to be 2. The default fuzzy levels can be overridden as needed.  

   2. You can also prioritize the exact set of result types to be returned by using the `idxSet` parameter. For this purpose, you can submit a comma-separated list of indexes; the item order does not matter. The following indexes are supported:

       * `Addr` - **Address Ranges**: For some streets, there are address points, which are interpolated from the beginning and end of the street. Those points are represented as address ranges.
       * `Geo` - **Geographies**: Areas on a map that represent administrative division of a land, that is, country, state, city.
       * `PAD` - **Point Address**:  Points on a map where specific address with a street name and number can be found in an index, for example, Soquel Dr 2501. This idxSet value is the highest level of accuracy available for addresses.  
       * `POI` - **Points of Interest**: Points on a map that are worth attention and may be interesting.  [Get Search Address](https://docs.microsoft.com/rest/api/maps/search/getsearchaddress) won't return POIs.  
       * `Str` - **Streets**: Representation of streets on the map.
       * `XStr` - **Cross Streets/intersections**:  Representation of junctions; places where two streets intersect.


       **Usage Examples**:

       * idxSet=POI (search Points Of Interest only) 

       * idxSet=PAD,Addr (search addresses only, PAD= Point Address, Addr= Address Range)

### Reverse geocode and geography entity type filter

When doing a reverse geocode search with [Search Address Reverse API](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse), the service has capability to return polygons for the administrative areas. By providing the parameter `entityType` in the request, you can narrow the search for specified geography entity types. The resulting response will contain the geography ID and the entity type matched. If you provide more than one entity, endpoint will return the **smallest entity available**. Returned Geometry ID can be used to get the geometry of that geography via [Get Polygon service](https://docs.microsoft.com/rest/api/maps/search/getsearchpolygon).

**Sample request:**

```HTTP
https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&subscription-key={subscription-key}&query=47.6394532,-122.1304551&language=en-US&entityType=Municipality
```

**Response:**

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

The `language` parameter allows you to select the language of the results, returned by the API. If the language is not set in the request, the search service automatically defaults to the most common language in the country/region. Also, when data in the specified language is not available, the default language is used. See [supported languages](https://docs.microsoft.com/azure/azure-maps/supported-languages) for a list of supported languages from Azure Maps services by country/region.


### Predictive mode (Autosuggest)

To find more matches for partial queries, `typeahead` parameter should be set to be 'true'. The query will be interpreted as a partial input and the search will enter predictive mode. Otherwise the service will assume all relevant information has been passed in.

In the sample query below, you can see that the search Address service is queried for "Microso" with the `typeahead` parameter set to **true**. If you observe the response, you can see that the search service interpreted the query as partial query. The response contains results for autosuggested query.

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


### URI encoding to handle special characters 

To find cross street addresses, you must encode the URI to handle special characters in the address. Consider this address example: "1st Avenue & Union Street, Seattle". The special character '&' needs to be encoded before sending the request. We recommend encoding character data in a URI, where all characters are encoded using a '%' character and a two-character hex value corresponding to their UTF-8 character.

**Usage Examples**:

Get Search Address:

```
query=1st Avenue & E 111th St, New York
```

 shall be encoded as:

```
query=1st%20Avenue%20%26%20E%20111th%20St%2C%20New%20York
```


Here are the different methods to use for different languages: 

JavaScript/TypeScript:
```Javascript
encodeURIComponent(query)
```

C#/VB:
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


## Best practices for POI search

Points of Interest (POI) Search allows you to request POI results by name, for example, search business by name. We strongly advise you to use the `countrySet` parameter to specify countries where your application needs coverage, as the default behavior will be to search the entire world, potentially returning unnecessary results and/or result in longer search times.

### Brand search

To improve the relevance of the results and the information in the response, Point of Interest (POI) search response includes the brand information that can be used further to parse the response.

You also can submit a comma-separated list of brand names in the request. You can use the list to restrict the results to specific brands by using the `brandSet` parameter. Item order does not matter. When multiple brands are provided, only results that belong to (at least) one of the provided lists is returned.

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

When the response type is **Geometry**, it can include the geometry ID that is returned in the **dataSources** object under "geometry" and "id". For example, [Get Polygon service](https://docs.microsoft.com/rest/api/maps/search/getsearchpolygon) allows you to request the geometry data in GeoJSON format. Such as a city or airport outline for a set of entities. You can use this boundary data for [Geofencing](https://docs.microsoft.com/azure/azure-maps/tutorial-geofence) or [Search POIs inside the geometry](https://docs.microsoft.com/rest/api/maps/search/postsearchinsidegeometry).


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
