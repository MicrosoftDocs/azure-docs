---
title: Migrate Bing Maps Geocode Dataflow API to Azure Maps Geocoding Batch and Reverse Geocoding Batch API
titleSuffix: Microsoft Azure Maps
description: Learn how to Migrate the Bing Maps Geocode Dataflow API to the Azure Maps Geocoding Batch and Reverse Geocoding Batch API.
author: eriklindeman
ms.author: eriklind
ms.date: 05/15/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Migrate Bing Maps Geocode Dataflow API

This article explains how to migrate the Bing Maps [Geocode Dataflow] API to Azure Maps [Geocoding Batch] and [Reverse Geocoding Batch] API.  Azure Maps Geocoding Batch API is used to get latitude and longitude coordinates of a street address or name of a place in batch mode with a single API call. Azure Maps Geocoding Batch API is an HTTP POST request that sends batches of queries to the Azure Maps [Geocoding] API in a single request. Azure Maps Reverse Geocoding Batch API is used to translate latitude and longitude coordinates into a human understandable street address. Azure Maps Reverse Geocoding Batch API is an HTTP POST request that sends batches of queries to the Azure Maps [Get Reverse Geocoding] API in a single request.

## Prerequisites

- An [Azure Account]
- An [Azure Maps account]
- A [subscription key] or other form of [Authentication with Azure Maps]

## Notable differences

- Bing Maps Geocode Dataflow API supports forward and reverse batch geocoding within the same API. Azure Maps has separate API for forward and reverse geocoding.
- Bing Maps Geocode Dataflow API requires uploading your location data as an XML or text (csv, pipe, or tab delimited) data file. Azure Maps Geocoding Batch and Reverse Geocoding Batch API don’t use a data file upload approach, but rather an HTTP POST request with location data in GeoJSON format in the body of the request.
- Bing Maps Geocode Dataflow API supports up to 200,000 entities per upload. The Azure Maps Geocoding Batch and Reverse Geocoding Batch API supports up to 100 batched queries in a synchronous request, and up to 200,000 in an asynchronous request.
- Bing Maps Geocode Dataflow API requires a series of API calls following the initial data upload to get the status and download results. The Azure Maps Geocoding Batch and Reverse Geocoding Batch API synchronous request don’t require additional API calls. The asynchronous request does require additional calls to get the batch process status and download results.
- Bing Maps Geocode Dataflow coordinates are in latitude/longitude format. Azure Maps Geocoding Batch and Reverse Geocoding Batch API coordinates are in longitude/latitude format (due to being in GeoJSON format).
- Unlike Bing Maps for Enterprise, Azure Maps is a global service that supports specifying a geographic scope, which allows you to limit data residency to the European (EU) or United States (US) geographic areas (geos). All requests (including input data) are processed exclusively in the specified geographic area. For more information, see [Azure Maps service geographic scope].

## Security and authentication

Bing Maps for Enterprise only supports API key authentication. Azure Maps supports multiple ways to authenticate your API calls, such as a [subscription key](azure-maps-authentication.md#shared-key-authentication), [Microsoft Entra ID], or [Shared Access Signature (SAS) Token]. For more information on security and authentication in Azure Maps, See [Authentication with Azure Maps] and the [Security section] in the Azure Maps Geocoding Batch documentation.

## Request parameters

The following table lists the Bing Maps *Geocode Dataflow* request parameters and the Azure Maps equivalent:

| Bing Maps Parameter | Azure Maps Parameter | Description                          |
|---------------------|----------------------|--------------------------------------|
| dataLocation        | Not needed           |                                      |
| input               | Not needed           | Bing Maps Geocode Dataflow API supports XML and Text (csv, tab, and pipe delimited) format for the batch geocoding input data file. Azure Maps supports JSON format for the batch geocoding input data in the HTTP POST request.|
| output              | Not needed           | Bing Maps Geocode Dataflow API supports JSON and XML for the batch geocode output data. Azure Maps supports JSON format for the batch geocoding output data.|

For more information about the Azure Maps URI parameters and request body, see the Azure Maps [Geocoding Batch] and [Reverse Geocoding Batch] documentation.

Bing Maps Data Schema 2.0 input and output comparison to Azure Maps *Geocode Batch* and *Reverse Geocode Batch* API:

| Bing Maps Field  | Bing Maps Operation  | Azure Maps Field  | Azure Maps data type  | Description                                                             |
|------------------|----------------------|-------------------|-----------------------|-------------------------------------------------------------------------|
| Address.AddressLine | Geocode Request<BR>Geocode Response | addressLine | string    ||
| Address.AdminDistrict | Geocode Request<BR>Geocode Response | adminDistrict | string||
| Address.CountryRegion | Geocode Request<BR>Geocode Response | countryRegion | string||
| Address.District | Geocode Request      | adminDistrict2    | string                ||
| Address.FormattedAddress | Geocode Response |               |                       ||
| Address.Landmark | Geocode Response     | Not supported        | Not supported      ||
| Address.Locality | Geocode Request<BR>Geocode Response      | locality | string     ||
| Address.Neighborhood | Geocode Response | neighborhood      | string                ||
| Address.PostalCode | Geocode Request<BR>Geocode Response    | postalCode | string   ||
| Address.PostalTown | Geocode Request    | adminDistrict3       |                    ||
| BoundingBox.SouthLatitude, BoundingBox.EastLongitude, BoundingBox.NorthLatitude, BoundingBox.EastLongitude  | Geocode Response  | bbox  | number[]  | Azure Maps projection used is EPSG:3857. For more information, see [RFC 7946].|
| Confidence       | Geocode Response     | confidence | ConfidenceEnum | For more information, see the Azure Maps [Geocoding Batch] and [Reverse Geocoding Batch] API documentation. |
| ConfidenceFilter.MinimumConfidence      | Geocode Request<BR>Reverse Geocode Request| Not supported  | Not supported ||
| Culture          | Geocode Request<BR>Reverse Geocode Request| Request Header: Accept-Language | string | For more information, see [Azure Maps Supported Languages].|
| EntityType       | Geocode Response     | type  | string  | For more information, see the Azure Maps [Geocoding Batch] and [Reverse Geocoding Batch] API documentation. |
| FaultReason      | Geocode Response     | Not supported     | Not supported         ||
| GeocodeEntity    | XML container        | Not needed        | Not needed            ||
| GeocodeFeed      | XML container        | Not needed        | Not needed            ||
| GeocodePoint     | Geocode Response     | geocodePoints     | GeocodePoints[]       | For more information, see the Azure Maps [Geocoding Batch] and [Reverse Geocoding Batch] API documentation.  |
| GeocodeRequest   | XML container        | Not needed        | Not needed            | Azure Maps has separate APIs for forward geocoding and reverse geocoding.|
| Id               | Geocode Request      | Not needed        | Not needed            ||
| IncludeEntityTypes | Geocode Request<BR>Reverse Geocode Request | Not supported | Not supported ||
| IncludeNeighborhood | Geocode Request<BR>Reverse Geocode Request  | Not needed | Not needed | In Azure Maps, neighborhood info is returned in the response by default when available. |
| IncludeQueryParse| Geocode Request      | Not supported     | Not supported         ||
| Location.Latitude<BR>Location.Longitude | Reverse Geocode Request | coordinates | number[] | Required as input if using Azure Maps Reverse Geocoding Batch API to do reverse geocoding.|
| MatchCodes       | Geocode Response     | matchCodes | MatchCodesEnum        | For more information, see the Azure Maps [Geocoding Batch] and [Reverse Geocoding Batch] API documentation. |
| MaxResults | Geocode Request<BR>Reverse Geocode Request  | top  | integer<BR>int32 | In Azure Maps, the maximum number of responses that are returned. Default is 5, minimum is 1, and maximum is 20. |
| Name             | Geocode Response     | Not supported | Not supported             ||
| Point.Latitude, Point.Longitude | Geocode Response  | coordinates  | number[]  | Bing Maps returns the coordinates in latitude/longitude format. Azure Maps returns coordinates in longitude/latitude format (due to being in GeoJSON format). |
| Query            | Geocode Request      | query             | string                ||
| QueryParseValue  | Geocode Response     | Not supported     | Not supported         ||
| ReverseGeocodeRequest | XML container   | Not needed        | Not needed            | Azure Maps has separate APIs for forward geocoding and reverse geocoding.|
| StatusCode       | Geocode Response     | Not supported     | Not supported         ||
| StrictMatch      | Geocode Request      | Not supported | Not supported             ||
| TraceId          | Geocode Response     | Not supported     | Not supported         ||
| Version          |                      | Not needed        | Not needed            ||

For more information about the Azure Maps Geocoding Batch response fields, see the response [Definitions].

## Request examples

Bing Maps *Geocode Dataflow* API request:

```HTTP
http://spatial.virtualearth.net/REST/v1/Dataflows/Geocode?input=xml&key={BingMapsKey}
```

For examples that show sample input and output data for version 2.0 of the Geocode Dataflow, see [Geocode Dataflow Sample Input and Output Data Version 2.0].

Azure Maps *Geocoding Batch* API request:

```HTTP
POST https://atlas.microsoft.com/geocode:batch?api-version=2023-06-01&subscription-key={Your-Azure-Maps-Subscription-key}
```

To send the geocoding queries, use an HTTP POST request where the body of the request contains the **batchItems** array in JSON format and the **Content-Type** header set to **application/json**.

The following JSON shows a sample request containing two geocoding queries, with one location in *unstructured* format and one location in *structured* format:

```json
{ 
  "batchItems": [ 
    { 
      "addressLine": "One, Microsoft Way, Redmond, WA 98052", 
      "top": 2 
    }, 
    { 
      "addressLine": "Pike Pl", 
      "adminDistrict": "WA", 
      "locality": "Seattle", 
      "top": 3 
    } 
  ] 
} 
```

Sample Azure Maps *Reverse Geocoding Batch* API request:

```HTTP
POST https://atlas.microsoft.com/reverseGeocode:batch?api-version=2023-06-01&subscription-key={Your-Azure-Maps-Subscription-key}
```

To send the reverse geocoding queries, use an HTTP POST request where the body of the request contains a **batchItems** array in JSON format and the **Content-Type** header is set to **application/json**.

The following JSON shows a sample request containing two reverse geocoding queries:

```json
{ 
  "batchItems": [ 
    { 
      "coordinates": [ 
        -122.128275, 
        47.639429 
      ], 
      "resultTypes": [ 
        "Address", 
        "PopulatedPlace" 
      ], 
      "optionalId": "4C3681A6C8AA4AC3441412763A2A25C81444DC8B" 
    }, 
    { 
      "coordinates": [ 
        -122.341979399674, 
        47.6095253501216 
      ], 
      "optionalId": "6M9W39P12SNHGAIZ4JQ7F57NWJLV2BRYEQRD7OH7" 
    } 
  ] 
} 
```

## Response examples

A URL to download the geocode job results is provided when the Bing Maps Geocode Dataflow batch job processes successfully, as shown by the **completed** job status. For an example of a successful Bing Maps Geocode Dataflow output, see [Geocode Dataflow Sample Input and Output Data Version 2.0] in the Bing Maps documentation.

The following sample shows what is returned in the body of the HTTP response when executing an Azure Maps *Geocoding Batch* API request:

```json
{ 
  "summary": { 
    "successfulRequests": 1, 
    "totalRequests": 2 
  }, 
  "batchItems": [ 
    {
      "type": "FeatureCollection", 
      "features": [ 
        { 
          "type": "Feature", 
          "properties": { 
            "type": "Address", 
            "confidence": "High", 
            "matchCodes": [ 
              "Good" 
            ], 
            "address": { 
              "locality": "Redmond", 
              "adminDistricts": [ 
                { 
                  "shortName": "WA" 
                }, 
                { 
                  "shortName": "King" 
                } 
              ], 
              "countryRegion": { 
                "ISO": "US", 
                "name": "United States" 
              }, 
              "postalCode": "98052", 
              "formattedAddress": "1 Microsoft Way, Redmond, WA 98052", 
              "addressLine": "1 Microsoft Way" 
            }, 
            "geocodePoints": [ 
              { 
                "geometry": { 
                  "type": "Point", 
                  "coordinates": [ 
                    -122.128275, 
                    47.639429 
                  ] 
                }, 
                "calculationMethod": "Rooftop", 
                "usageTypes": [ 
                  "Display", 
                  "Route" 
                ] 
              }, 
              { 
                "geometry": { 
                  "type": "Point", 
                  "coordinates": [ 
                    -122.127028, 
                    47.638545 
                  ] 
                }, 
                "calculationMethod": "Rooftop", 
                "usageTypes": [ 
                  "Route" 
                ] 
              } 
            ] 
          }, 
          "geometry": { 
            "type": "Point", 
            "coordinates": [ 
              -122.128275, 
              47.639429 
            ] 
          }, 
          "bbox": [ 
            -122.1359181505759, 
            47.63556628242932, 
            -122.1206318494241, 
            47.643291717570676 
          ] 
        } 
      ]
    },
    {
      "error": {
        "code": "Conflicting Parameters",
        "message": "When 'query' is present, only the following parameters are valid: 'bbox, location, view, top'. 'addressLine' was passed"
      }
    }
  ]
}
```

The following sample shows what is returned in the body of the HTTP response when executing an Azure Maps *Reverse Geocoding Batch* API request:

```json
{ 
    "batchItems": [ 
        { 
            "type": "FeatureCollection", 
            "features": [ 
                { 
                    "type": "Feature", 
                    "geometry": { 
                        "type": "Point", 
                        "coordinates": [ 
                            -122.1294081, 
                            47.6391325 
                        ] 
                    }, 
                    "properties": { 
                        "geocodePoints": [ 
                            { 
                                "geometry": { 
                                    "type": "Point", 
                                    "coordinates": [ 
                                        -122.1294081, 
                                        47.6391325 
                                    ] 
                                }, 
                                "calculationMethod": "Rooftop", 
                                "usageTypes": [ 
                                    "Display" 
                                ] 
                            } 
                        ], 
                        "address": { 
                            "addressLine": "15770 NE 31st St", 
                            "adminDistricts": [ 
                                { 
                                    "shortName": "WA" 
                                }, 
                                { 
                                    "shortName": "King Co." 
                                } 
                            ], 
                            "countryRegion": { 
                                "name": "United States", 
                                "iso": "US" 
                            }, 
                            "locality": "Redmond", 
                            "neighborhood": "Overlake", 
                            "postalCode": "98052", 
                            "formattedAddress": "15770 NE 31st St, Redmond, WA 98052, United States" 
                        }, 
                        "confidence": "High", 
                        "matchCodes": [ 
                            "Good" 
                        ], 
                        "type": "Address" 
                    }, 
                    "bbox": [ 
                        -122.13705120720665, 
                        47.635269782429326, 
                        -122.12176499279336, 
                        47.64299521757068 
                    ] 
                } 
            ] 
        }, 
        { 
            "type": "FeatureCollection", 
            "features": [ 
                { 
                    "type": "Feature", 
                    "geometry": { 
                        "type": "Point", 
                        "coordinates": [ 
                            -122.341979399674, 
                            47.6095253501216 
                        ] 
                    }, 
                    "properties": { 
                        "geocodePoints": [ 
                            { 
                                "geometry": { 
                                    "type": "Point", 
                                    "coordinates": [ 
                                        -122.341979399674, 
                                        47.6095253501216 
                                    ] 
                                }, 
                                "calculationMethod": "Interpolation", 
                                "usageTypes": [ 
                                    "Display", 
                                    "Route" 
                                ] 
                            } 
                        ], 
                        "address": { 
                            "addressLine": "1736 Pike Pl", 
                            "adminDistricts": [ 
                                { 
                                    "shortName": "WA"
                                }, 
                                { 
                                    "shortName": "King Co." 
                                } 
                            ], 
                            "countryRegion": { 
                                "name": "United States", 
                                "iso": "US" 
                            }, 
                            "intersection": { 
                                "baseStreet": "Pike Pl", 
                                "displayName": "Pike Pl and Stewart St", 
                                "intersectionType": "Near", 
                                "secondaryStreet1": "Stewart St", 
                                "secondaryStreet2": null 
                            }, 
                            "locality": "Seattle", 
                            "neighborhood": "Downtown Seattle", 
                            "postalCode": "98101", 
                            "formattedAddress": "1736 Pike Pl, Seattle, WA 98101, United States" 
                        }, 
                        "confidence": "Medium", 
                        "matchCodes": [ 
                            "Good" 
                        ], 
                        "type": "Address" 
                    }, 
                    "bbox": [ 
                        -122.34961817972945, 
                        47.605662632550924, 
                        -122.33434061961856, 
                        47.61338806769228 
                    ] 
                } 
            ] 
        } 
    ], 
    "summary": { 
        "successfulRequests": 2, 
        "totalRequests": 2 
    } 
} 
```

## Transactions usage

Similar to Bing Maps Geocode Dataflow API, Azure Maps Geocoding Batch and Reverse Geocoding Batch APIs log one billable transaction per geocoded item. For example, 100 locations geocoded in the batch request results in 100 billable transactions. For more information on Azure Maps transactions, see [Understanding Azure Maps Transactions].

## Additional information

More Azure Maps Geocoding APIs

- [Get Geocoding]: Use to get latitude and longitude coordinates of a street address or name of a place.
- [Get Reverse Geocoding]: Use to get a street address and location info from latitude and longitude coordinates.

Support

- [Microsoft Q&A Forum]

[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Account]: https://azure.microsoft.com/
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps service geographic scope]: geographic-scope.md
[Azure Maps Supported Languages]: supported-languages.md
[Definitions]: /rest/api/maps/search/get-geocoding-batch#definitions
[Geocode Dataflow Sample Input and Output Data Version 2.0]: /bingmaps/spatial-data-services/geocode-dataflow-api/geocode-dataflow-sample-input-and-output-data-version-2-0
[Geocode Dataflow]: /bingmaps/spatial-data-services/geocode-dataflow-api
[Geocoding Batch]: /rest/api/maps/search/get-geocoding-batch
[Geocoding]: /rest/api/maps/search/get-geocoding
[Get Geocoding]: /rest/api/maps/search/get-geocoding
[Get Reverse Geocoding]: /rest/api/maps/search/get-reverse-geocoding
[Microsoft Entra ID]: azure-maps-authentication.md#microsoft-entra-authentication
[Microsoft Q&A Forum]: /answers/tags/209/azure-maps
[Reverse Geocoding Batch]: /rest/api/maps/search/get-reverse-geocoding-batch
[RFC 7946]: https://tools.ietf.org/html/rfc7946#section-3.1.2
[Security section]: /rest/api/maps/search/get-geocoding-batch#security
[Shared Access Signature (SAS) Token]: azure-maps-authentication.md#shared-access-signature-token-authentication
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Understanding Azure Maps Transactions]: understanding-azure-maps-transactions.md
