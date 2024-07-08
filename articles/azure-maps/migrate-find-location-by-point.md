---
title: Migrate Bing Maps Find a Location by Point API to Azure Maps Get Reverse Geocoding API
titleSuffix: Microsoft Azure Maps
description: Learn how to Migrate the Bing Maps Find a Location by Point API to the Azure Maps Get Reverse Geocoding API.
author: pbrasil
ms.author: peterbr 
ms.date: 05/16/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Migrate Bing Maps Find a Location by Point API

This article explains how to migrate the Bing Maps [Find a Location by Point] API to the Azure Maps [Get Reverse Geocoding] API. The Azure Maps Get Reverse Geocoding API is used to translate longitude and latitude coordinates into a human understandable street address.

## Prerequisites

- An [Azure Account]
- An [Azure Maps account]
- A [subscription key] or other form of [Authentication with Azure Maps]

## Notable differences

- Bing Maps Find a Location by Point API supports XML and JSON response formats. Azure Maps Get Reverse Geocoding API supports the [GeoJSON] response format.
- Bing Maps Find a Location by Point API uses coordinates in the latitude/longitude format. Azure Maps Get Reverse Geocoding API uses coordinates in the longitude/latitude format, as defined by [GeoJSON].
- Unlike Bing Maps Find a Location by Point API, Azure Maps Get Reverse Geocoding API doesn’t currently support address or street level data for China, Japan or South Korea.
- Unlike Bing Maps Find a Location by Point API, Azure Maps Get Reverse Geocoding API has a `view` input parameter, which is a string that represents an [ISO 3166-1 Alpha-2 region/country code]. The `view` input parameter will alter geopolitical disputed borders and labels to align with the specified user region. For more information, see [URI Parameters].
- Unlike Bing Maps for Enterprise, Azure Maps is a global service that supports specifying a geographic scope, which allows you to limit data residency to the European (EU) or United States (US) geographic areas (geos). All requests (including input data) are processed exclusively in the specified geographic area. For more information, see [Azure Maps service geographic scope].

## Security and authentication

Bing Maps for Enterprise only supports API key authentication. Azure Maps supports multiple ways to authenticate your API calls, such as a [subscription key](azure-maps-authentication.md#shared-key-authentication), [Microsoft Entra ID], and [Shared Access Signature (SAS) Token]. For more information on security and authentication in Azure Maps, See [Authentication with Azure Maps] and the [Security section] in the Azure Maps Get Geocoding documentation.

## Request parameters

The following table lists the Bing Maps _Find a Location by Point_ request parameters and the Azure Maps equivalent:

| Bing Maps request parameter | Bing Maps request parameter alias | Azure Maps request parameter | Required in Azure Maps | Azure Maps data type | Description |
|-----------------------------|-----------------------------------|------------------------------|------------------------|----------------------|-------------|
| culture | c | Request Header: Accept-Language | False | string | In Azure Maps Get Reverse Geocoding API, this is the language in which search results should be returned. This is specified in the Azure Maps [request header]. Please refer to [Supported Languages] for details. |
| include | incl | Not needed | Not needed | Not needed | In Bing Maps Find a Location by Point, the ‘include’ input parameter is required to get a two-letter ISO country code for the location result in the response. In Azure Maps Get Reverse Geocoding API, the two-letter ISO country code is returned by default. |
| includeEntityTypes | | resultTypes | False | query | |
| includeNeighborhood | inclnb | Not needed | Not needed | Not needed | In Azure Maps Get Reverse Geocoding API, neighborhood info is returned in the response by default, when available. |
| point | | coordinates | True | number[] | In Bing Maps Find a Location by Point API, the coordinates in the request and the response are in latitude/longitude format, whereas Azure Maps Get Reverse Geocoding API requires the coordinates in the request and the coordinates in the response use longitude/latitude format, as defined by [GeoJSON]. |
| userRegion | ur | view | False | string | A string that represents an [ISO 3166-1 Alpha-2 region/country code]. This will alter geopolitical disputed borders and labels to align with the specified user region. By default, the View parameter is set to “Auto” even if you haven’t defined it in the request.<br><br> Please refer to [Supported Views] for details and to see the available Views. |
| verboseplacenames | vbpn | Not supported | Not supported | Not supported | Azure Maps Get Reverse Geocoding API only supports returning [adminDistricts] short name (FL instead of Florida). |

For more information about the Azure Maps Get Reverse Geocoding API request parameters, see [URI Parameters].

## Request examples

Bing Maps _Find a Location by Point_ API request:

``` http
https://dev.virtualearth.net/REST/v1/Locations/48.830345,2.338166&key={BingMapsKey}  
```

Azure Maps _Get Reverse Geocoding_ API request:

``` http
http://atlas.microsoft.com/reverseGeocode?api-version=2023-06-01&coordinates=2.338166,48.830345&subscription-key={Your-Azure-Maps-Subscription-key}
```

## Response fields

The following table lists the fields that can appear in the HTTP response when running the Bing Maps _Find a Location by Point_ request and the Azure Maps equivalent:

| Bing Maps response        | Azure Maps response    | Description                   |
|---------------------------|------------------------|-------------------------------|
| address: addressLine (JSON)<br>Address: AddressLine (XML) | address: addressLine | |
| address: adminDistrict (JSON)<br>Address: AdminDistrict (XML) | address: adminDistricts | |
| address: adminDistrict2 (JSON)<br>Address: AdminDistrict2 (XML) | address: adminDistricts | |
| address: countryRegion (JSON)<br>Address: CountryRegion (XML) | address: countryRegion | |
| address: countryRegionIso2 (JSON)<br>Address: CountryRegionIso2 (XML) | address: countryRegion - iso | |
| address: neighborhood (JSON)<br>Address: Neighborhood (XML) | address: neighborhood | |
| address: formattedAddress (JSON)<br>Address: FormattedAddress (XML) | address: formattedAddress | |
| address: locality (JSON)<br>Address: Locality (XML) | address: locality | |
| address: postalCode (JSON)<br>Address: PostalCode (XML) | address: postalCode | |
| address: Intersection – baseStreet (JSON)<br>Address: Intersection – BaseStreet (XML) | address: intersection -baseStreet | |
| address: Intersection – secondaryStreet1 (JSON)<br>Address: Intersection – SecondaryStreet1 (XML) | address: intersection - secondaryStreet1 | |
| address: Intersection – secondaryStreet2 (JSON)<br>Address: Intersection – SecondaryStreet2 (XML) | address: intersection - secondaryStreet2 | |
| address: Intersection – intersectionType (JSON)<br>Address: Intersection – IntersectionType (XML) | address: intersection - intersectionType | |
| address: Intersection – displayName (JSON)<br>Address: Intersection – DisplayName (XML) | address: intersection - displayName | |
| bbox (JSON)<br>BoundingBox (XML) | features: bbox | In Bing Maps Find a Location by Point API, the coordinates in the response are in latitude/longitude format. In Azure Maps Get Reverse Geocoding API the coordinates in the response use longitude/latitude, as defined by [GeoJSON]. |
| calculationMethod (JSON)<br>CalculationMethod (XML) | properties: geocodePoints - calculationMethod | |
| confidence (JSON)<br>Confidence (XML) | properties: confidence | |
| entityType (JSON)<br>EntityType (XML) | properties: type | |
| geocodePoints (JSON)<br>GeocodePoint (XML) | properties: geocodePoints - coordinates | |
| matchCodes (JSON)<br>MatchCode (XML) | properties: matchCodes | |
| name (JSON)<br>Name (XML) | Not supported | Azure Maps `formattedAddress` provides a similar value to Bing Maps `name` |
| point (JSON)<br>Point (XML) | features: coordinates | In Bing Maps Find a Location by Point API, the coordinates in the response are in latitude/longitude format. In Azure Maps Get Reverse Geocoding API the coordinates in the response use longitude/latitude format, as defined by [GeoJSON]. |
| usageTypes (JSON)<br>usageType (XML) | properties: geocodePoints: usageTypes |

For more information about the Azure Maps Get Reverse Geocoding API response fields, see [Definitions].

### Response examples

The following JSON sample shows what is returned in the body of the HTTP response when executing the Bing Maps _Find a Location by Point_ request:

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
                        48.826534682429326,
                        2.330334564829834,
                        48.83426011757068,
                        2.345980835170166
                    ],
                    "name": "30 Rue Cabanis, 75014 Paris, France",
                    "point": {
                        "type": "Point",
                        "coordinates": [
                            48.8303974,
                            2.3381577
                        ]
                    },
                    "address": {
                        "addressLine": "30 Rue Cabanis",
                        "adminDistrict": "Île-de-France",
                        "adminDistrict2": "Paris",
                        "countryRegion": "France",
                        "formattedAddress": "30 Rue Cabanis, 75014 Paris, France",
                        "intersection": {
                            "baseStreet": "Rue Cabanis",
                            "secondaryStreet1": "Villa de Lourcine",
                            "intersectionType": "Near",
                            "displayName": "Rue Cabanis and Villa de Lourcine"
                        },
                        "locality": "Paris",
                        "neighborhood": "14th Arrondissement",
                        "postalCode": "75014"
                    },
                    "confidence": "High",
                    "entityType": "Address",
                    "geocodePoints": [
                        {
                            "type": "Point",
                            "coordinates": [
                                48.8303974,
                                2.3381577
                            ],
                            "calculationMethod": "Rooftop",
                            "usageTypes": [
                                "Display"
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
    "traceId": "c525b02f7f1e9e4ee3d7b81cce266671"
```

The following JSON sample shows what is returned in the body of the HTTP response when executing an Azure Maps _Get Reverse Geocoding_ request:

```JSON
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    2.3381577,
                    48.8303974
                ]
            },
            "properties": {
                "geocodePoints": [
                    {
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                2.3381577,
                                48.8303974
                            ]
                        },
                        "calculationMethod": "Rooftop",
                        "usageTypes": [
                            "Display"
                        ]
                    }
                ],
                "address": {
                    "addressLine": "30 Rue Cabanis",
                    "adminDistricts": [
                        {
                            "shortName": "Île-de-France"
                        },
                        {
                            "shortName": "Paris"
                        }
                    ],
                    "countryRegion": {
                        "name": "France",
                        "iso": "FR"
                    },
                    "intersection": {
                        "baseStreet": "Rue Cabanis",
                        "displayName": "Rue Cabanis and Villa de Lourcine",
                        "intersectionType": "Near",
                        "secondaryStreet1": "Villa de Lourcine",
                        "secondaryStreet2": null
                    },
                    "locality": "Paris",
                    "neighborhood": "14th Arrondissement",
                    "postalCode": "75014",
                    "formattedAddress": "30 Rue Cabanis, 75014 Paris, France"
                },
                "confidence": "High",
                "matchCodes": [
                    "Good"
                ],
                "type": "Address"
            },
            "bbox": [
                2.330334564829834,
                48.826534682429326,
                2.345980835170166,
                48.83426011757068
            ]
        }
    ]
}
```

## Transactions usage

Like Bing Maps Find a Location by Point API, Azure Maps Get Reverse Geocoding API logs one billable transaction per request. For more information on Azure Maps transactions, see [Understanding Azure Maps Transactions].

## Additional information

- Azure Maps [Get Reverse Geocoding Batch] API: Use to send a batch of queries to the Azure Maps [Get Reverse Geocoding] API in a single request.

Support

- [Microsoft Q&A Forum]

[adminDistricts]: /rest/api/maps/search/get-reverse-geocoding#admindistricts
[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Account]: https://azure.microsoft.com/
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps service geographic scope]: geographic-scope.md
[Definitions]: /rest/api/maps/search/get-reverse-geocoding#definitions
[Find a Location by Point]: /bingmaps/rest-services/locations/find-a-location-by-point
[GeoJSON]: https://geojson.org
[Get Reverse Geocoding Batch]: /rest/api/maps/search/get-reverse-geocoding-batch
[Get Reverse Geocoding]: /rest/api/maps/search/get-reverse-geocoding
[ISO 3166-1 Alpha-2 region/country code]: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
[Microsoft Entra ID]: azure-maps-authentication.md#microsoft-entra-authentication
[Microsoft Q&A Forum]: /answers/tags/209/azure-maps
[request header]: /rest/api/maps/search/get-reverse-geocoding?#request-headers
[Security section]: /rest/api/maps/search/get-reverse-geocoding#security
[Shared Access Signature (SAS) Token]: azure-maps-authentication.md#shared-access-signature-token-authentication
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Supported Languages]: supported-languages.md
[Supported Views]: supported-languages.md#azure-maps-supported-views
[Understanding Azure Maps Transactions]: understanding-azure-maps-transactions.md
[URI Parameters]: /rest/api/maps/search/get-reverse-geocoding#uri-parameters
