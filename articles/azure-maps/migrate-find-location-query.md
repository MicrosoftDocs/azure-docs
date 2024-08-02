---
title: Migrate Bing Maps Find a Location by Query API to Azure Maps Get Geocoding API
titleSuffix: Microsoft Azure Maps
description: Learn how to Migrate the Bing Maps Find a Location by Query API to the Azure Maps Get Geocoding API.
author: pbrasil
ms.author: peterbr 
ms.date: 05/16/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Migrate Bing Maps Find a Location by Query API

This article explains how to migrate the Bing Maps [Find a Location by Query] API to the Azure Maps [Get Geocoding] API. The Azure Maps Get Geocoding API is used to get longitude and latitude coordinates of a street address, a place or landmark. Azure Maps Get Geocoding API supports geocoding input in an unstructured or structured format. This migration documentation is for scenarios where your geocoding input, such as street address, locality, postal code, or landmark name, is in an unstructured format (query=) - similar to what Bing Maps Find a Location by Query API supports. For information on how to migrate Bing Maps scenarios where the geocoding input is structured to find a location by address, see [Migrate Bing Maps Find a Location by Address API].

## Prerequisites

- An [Azure Account]
- An [Azure Maps account]
- A [subscription key] or other form of [Authentication with Azure Maps]

## Notable differences

- Bing Maps Find a Location by Query API only supports geocoding input in unstructured format, whereas Azure Maps Get Geocoding API supports geocoding input in an unstructured (_query=_) or structured (_addressLine=_) format. For geocoding landmark names, use Azure Maps Get Geocoding API using unstructured input format.
- Bing Maps Find a Location by Query API returns coordinates in latitude/longitude format, while Azure Maps Get Geocoding API returns coordinates in longitude/latitude format, as defined by the [GeoJSON] format.
- Bing Maps Find a Location by Query API supports XML and JSON response format. Azure Maps Get Geocoding API supports GeoJSON.
- Unlike Bing Maps Find a Location by Query API, Azure Maps Get Geocoding API has a `view` input parameter, which is a string that represents an [ISO 3166-1 Alpha-2 region/country code]. The `view` input parameter alters geopolitical disputed borders and labels to align with the specified user region. For more information, see [URI Parameters].
- Unlike Bing Maps Find a Location by Query API, Azure Maps Get Geocoding API doesn’t currently support address geocoding for China, Japan, or South Korea.
- Unlike Bing Maps for Enterprise, Azure Maps is a global service that supports specifying a geographic scope, allowing limits to data residency to the European (EU) or United States (US) geographic areas (geos). All requests (including input data) are processed exclusively in the specified geographic area. For more information, see [geographic scope].

## Security and authentication

Bing Maps for Enterprise only supports API key authentication. Azure Maps supports multiple ways to authenticate your API calls, such as a [subscription key](azure-maps-authentication.md#shared-key-authentication), [Microsoft Entra ID], and [Shared Access Signature (SAS) Token]. For more information on security and authentication in Azure Maps, See [Authentication with Azure Maps] and the [Security section] in the Azure Maps Get Geocoding documentation.

## Request parameters

The following table lists the Bing Maps _Find a Location by Query_ request parameters and the Azure Maps equivalent:

| Bing Maps request parameter | Bing Maps request parameter alias  | Azure Maps request parameter | Required in Azure Maps  | Azure Maps data type  | Description|
|-----------------------------|------------------------------------|------------------------------|-------------------------|-----------------------|------------|
| culture | c | Request Header:  Accept-Language   | False | string | As specified in the Azure Maps [request header], `culture` defines the language used in search results when using the Azure Maps Get Geocoding API. For more information, see [Supported Languages].|
| include | incl    | Not needed  | Not needed     | Not needed | In Bing Maps Find a Location by Query API, the `include` input parameter is required to get a two-letter ISO country code for the location result in the response (_include=ciso2_) and to specify that the response shows how the query string was parsed into address values (_include=queryParse_). In Azure Maps Get Geocoding API, the two-letter ISO country code is returned by default and doesn’t support a queryParse equivalent. |
| includeNeighborhood  | inclnb  | Not needed  | Not needed     | Not needed | In Azure Maps Get Geocoding API, neighborhood info is returned in the response by default, when available.  |
| maxResults | maxRes  | top    | False | Integer (int32)  | In Azure Maps Get Geocoding API, the default number of responses returned is 5. The minimum is 1 and the maximum is 20. |
| query | q | query  | True | string | |
| userIp  | uip     | Not supported | Not supported  | Not supported    | |
| userLocation | ul | coordinates  | False | number[] | In Azure Maps Get Geocoding API, coordinates on the earth specified as in longitude and latitude format (longitude,latitude). When you specify this parameter, the user’s location is taken into account, and the results returned are more relevant to the user.   |
| userMapView | umv     | bbox   | False | number[] | A rectangular area on the earth defined as a bounding box object. The sides of the rectangles are defined by longitude and latitude values (longitude1,latitude1,longitude2,latitude2). Use the following syntax to specify a bounding box:<br><br>West Longitude, South Latitude, East Longitude, North Latitude<br><br>When you specify this parameter, the geographical area is taken into account when computing the results of a location query.  |
| userRegion | ur | view   | False | string | A string that represents an [ISO 3166-1 Alpha-2 region/country code]. This alters geopolitical disputed borders and labels to align with the specified user region. By default, the View parameter is set to _Auto_ even if not defined in the request.<br><br>For more information on available views, see [Supported Views]. |

For more information about the Azure Maps Get Geocoding API request parameters, see [URI Parameters].

## Request examples

Bing Maps _Find a Location by Query_ API POST request:

``` http
http://dev.virtualearth.net/REST/v1/Locations/15127 NE 24th Street Redmond WA&key={BingMapsKey}
```

Azure Maps _Get Geocoding_ API POST request:

``` http
https://atlas.microsoft.com/geocode?api-version=2023-06-01&query=15127 NE 24th Street Redmond WA&subscription-key={Your-Azure-Maps-Subscription-key}
```

## Response fields

The following table lists the fields that can appear in the HTTP response when running the Bing Maps _Find a Location by Query_ request and the Azure Maps equivalent:

| Bing Maps Field        | Azure Maps Field | Description                 |
|------------------------|------------------|-----------------------------|
| address: addressLine (JSON)<br><br>Address: AddressLine (XML)    | address: addressLine  |
| address: adminDistrict (JSON)<br><br>Address: AdminDistrict (XML)  | address: adminDistricts     | |
| address: adminDistrict2 (JSON)<br><br>Address: AdminDistrict2 (XML)  | address: adminDistricts     | |
| address: countryRegion (JSON)<br><br>Address: CountryRegion (XML)  | address: countryRegion      | |
| address: countryRegionIso2 (JSON)<br><br>Address: CountryRegionIso2 (XML)  | address: countryRegion - iso  | |
| address: neighborhood (JSON)<br><br>Address: Neighborhood (XML)  | address: neighborhood  | |
| address: formattedAddress (JSON)<br><br>Address: FormattedAddress (XML)  | address: formattedAddress   | |
| address: locality (JSON)<br><br>Address: Locality (XML)  | address: locality  | |
| address: postalCode (JSON)<br><br>Address: PostalCode (XML)      | address: postalCode  | |
| address: Intersection – baseStreet (JSON)<br><br>Address: Intersection – BaseStreet (XML)   | address: intersection -baseStreet   | |
| address: Intersection – secondaryStreet1 (JSON)<br><br> | address: intersection - secondaryStreet1  | |
| address: Intersection – secondaryStreet2 (JSON)<br><br>Address: Intersection – SecondaryStreet2 (XML)  | address: intersection - secondaryStreet2  | |
| address: Intersection – intersectionType (JSON)<br><br>Address: Intersection – IntersectionType (XML)  | address: intersection - intersectionType  | |
| address: Intersection – displayName (JSON)<br><br>Address: Intersection – DisplayName (XML)   | address: intersection - displayName   | |
| bbox (JSON)<br><br>BoundingBox (XML)  | features: bbox   | In Bing Maps Find a Location by Query API, the coordinates in the response are in latitude/longitude format. The coordinates in the response of the Azure Maps Get Geocoding API are in the longitude/latitude format (since GeoJSON format is used).   |
| calculationMethod (JSON)<br><br>CalculationMethod (XML)  | properties: geocodePoints - calculationMethod  | |
| confidence (JSON)<br><br>Confidence (XML)  | properties: confidence      | |
| entityType (JSON)<br><br>EntityType (XML)  | properties: type   | |
| geocodePoints (JSON)<br><br>GeocodePoint (XML)  | properties: geocodePoints - coordinates  | |
| matchCodes (JSON)<br><br>MatchCode (XML)  | properties: matchCodes      | |
| name (JSON)<br><br>Name (XML)  | Not supported  | `formattedAddress` is the Azure Maps equivalent. |
| point (JSON)<br><br>Point (XML)  | features: coordinates  | In Bing Maps Find a Location by Query API, the coordinates in the response are in latitude/longitude format. The coordinates in the response of the Azure Maps Get Geocoding API are in the longitude/latitude format (since GeoJSON format is used).   |
| queryParse (JSON)<br><br>QueryParse (XML)  | Not supported  | |
| usageTypes (JSON)<br><br>usageType (XML)  | properties: geocodePoints: usageTypes | |

For more information about the Azure Maps Get Geocoding API response fields, see [Definitions].

### Response examples

The following JSON sample shows what is returned in the body of the HTTP response when executing the Bing Maps _Find a Location by Query_ request:

```JSON
{ 
    "authenticationResultCode": "ValidCredentials", 
    "brandLogoUri": "https://dev.virtualearth.net/Branding/logo_powered_by.png", 
    "copyright": "Copyright © 2024 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.", 
    "resourceSets": [ 
        { 
            "estimatedTotal": 1, 
            "resources": [ 
                { 
                    "__type": "Location:http://schemas.microsoft.com/search/local/ws/rest/v1", 
                    "bbox": [ 
                        47.62649628242932, 
                        -122.14631082421619, 
                        47.634221717570675, 
                        -122.1310271757838 
                    ], 
                    "name": "15127 NE 24th St, Redmond, WA 98052", 
                    "point": { 
                        "type": "Point", 
                        "coordinates": [ 
                            47.630359, 
                            -122.138669 
                        ] 
                    }, 
                    "address": { 
                        "addressLine": "15127 NE 24th St", 
                        "adminDistrict": "WA", 
                        "adminDistrict2": "King County", 
                        "countryRegion": "United States", 
                        "formattedAddress": "15127 NE 24th St, Redmond, WA 98052", 
                        "locality": "Redmond", 
                        "postalCode": "98052" 
                    }, 
                    "confidence": "High", 
                    "entityType": "Address", 
                    "geocodePoints": [ 
                        { 
                            "type": "Point", 
                            "coordinates": [ 
                                47.630359, 
                                -122.138669 
                            ], 
                            "calculationMethod": "Rooftop", 
                            "usageTypes": [ 
                                "Display" 
                            ] 
                        }, 
                        { 
                            "type": "Point", 
                            "coordinates": [ 
                                47.630563, 
                                -122.1387383 
                            ], 
                            "calculationMethod": "Rooftop", 
                            "usageTypes": [ 
                                "Route" 
                            ] 
                        } 
                    ], 
                    "matchCodes": [ 
                        "Good" 
                    ] 
                } 
            ] 
        } 
    ], 
    "statusCode": 200, 
    "statusDescription": "OK", 
    "traceId": "7896468b37528ac145ef77cc62484fd6|MWH0032BE2|0.0.0.1|Ref A: 7D01B283F7644D2891600E265FB30B24 Ref B: CO1EDGE2318 Ref C: 2024-04-23T18:29:55Z" 
```

The following JSON sample shows what is returned in the body of the HTTP response when executing an Azure Maps _Get Geocoding_ request:

```JSON
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -122.138679,
                    47.630356
                ]
            },
            "bbox": [
                -122.14632082377759,
                47.62649328242932,
                -122.1310371762224,
                47.634218717570675
            ],
            "properties": {
                "type": "Address",
                "confidence": "High",
                "matchCodes": [
                    "Good"
                ],
                "geocodePoints": [
                    {
                        "calculationMethod": "Rooftop",
                        "usageTypes": [
                            "Display"
                        ],
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                -122.138679,
                                47.630356
                            ]
                        }
                    },
                    {
                        "calculationMethod": "Rooftop",
                        "usageTypes": [
                            "Route"
                        ],
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                -122.138685,
                                47.6305637
                            ]
                        }
                    }
                ],
                "address": {
                    "addressLine": "15127 NE 24th St",
                    "postalCode": "98052",
                    "locality": "Redmond",
                    "formattedAddress": "15127 NE 24th St, Redmond, WA 98052",
                    "countryRegion": {
                        "name": "United States",
                        "ISO": "US"
                    },
                    "adminDistricts": [
                        {
                            "shortName": "WA"
                        },
                        {
                            "shortName": "King County"
                        }
                    ]
                }
            }
        }
    ]
}
```

## Transactions usage

Like Bing Maps Find a Location by Query API, Azure Maps Get Geocoding API logs one billable transaction per request. For more information on Azure Maps transactions, see [Understanding Azure Maps Transactions].

## Additional information

- [Get Geocoding Batch]: Use to send a batch of queries to the Get Geocoding API in a single synchronous request.

Support

- [Microsoft Q&A Forum]

[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Account]: https://azure.microsoft.com/
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Definitions]: /rest/api/maps/search/get-geocoding#definitions
[Find a Location by Query]: /bingmaps/rest-services/locations/find-a-location-by-query
[geographic scope]: geographic-scope.md
[GeoJSON]: https://geojson.org
[Get Geocoding Batch]: /rest/api/maps/search/get-geocoding-batch
[Get Geocoding]: /rest/api/maps/search/get-geocoding
[ISO 3166-1 Alpha-2 region/country code]: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
[Microsoft Entra ID]: azure-maps-authentication.md#microsoft-entra-authentication
[Microsoft Q&A Forum]: /answers/tags/209/azure-maps
[Migrate Bing Maps Find a Location by Address API]: migrate-find-location-address.md
[request header]: /rest/api/maps/search/get-geocoding?#request-headers
[Security section]: /rest/api/maps/search/get-geocoding#security
[Shared Access Signature (SAS) Token]: azure-maps-authentication.md#shared-access-signature-token-authentication
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Supported Languages]: supported-languages.md
[Supported Views]: supported-languages.md#azure-maps-supported-views
[Understanding Azure Maps Transactions]: understanding-azure-maps-transactions.md
[URI Parameters]: /rest/api/maps/search/get-geocoding#uri-parameters
