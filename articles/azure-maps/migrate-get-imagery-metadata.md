---
title: Migrate Bing Maps Get Imagery Metadata API to Azure Maps Get Map Tile API
titleSuffix: Microsoft Azure Maps
description: Learn how to Migrate the Bing Maps Get Imagery Metadata API to the Azure Maps Get Map Tile API.
author: faterceros
ms.author: aterceros 
ms.date: 05/16/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Migrate Bing Maps Get Imagery Metadata API

This article explains how to migrate the Bing Maps [Get Imagery Metadata] API to the Azure Maps [Get Map Tile] API.

The Azure Maps Get Map Tile API provides map tiles in vector or raster formats to be used in the [Azure Maps Web SDK] or 3rd party map controls. Some example tiles that can be requested are Azure Maps road, satellite/aerial, weather radar or indoor map tiles (generated using [Azure Maps Creator]).  

## Prerequisites

- An [Azure Account]
- An [Azure Maps account]
- A [subscription key] or other form of [Authentication with Azure Maps]

## Notable differences

- Bing Maps Get Imagery Metadata API provides map tile metadata in the body of the HTML response, including a URL to get the map tile image (`ImageUrl`). Azure Maps Get Map Tile API provides the map tile image directly in the HTML response, but doesn't include metadata.  
- Bing Maps Get Imagery Metadata API provides map tile metadata in the body of the HTML response, including map tile vintage information (`vintageStart` and `vintageEnd`). Azure Maps Get Map Tile API provides map tile vintage information in the response header (Data-Capture-Date-Range), rather than in the body of the HTML response.
- Bing Maps Get Imagery Metadata API provides map tile metadata in the body of the HTML response, including copyright information for the map tiles. For Azure Maps Get Map Tile API, map copyright attribution information can be obtained from Azure Maps [Get Map Attribution] API. Copyright attribution information should be displayed on the map as per the [Azure Maps Product Terms].
- Azure Maps Get Map Tile API doesn't offer the following Bing Maps Get Imagery Metadata API map styles: Streetside, Birdseye, and Ordnance Survey.
- Azure Maps Get Map Tile API doesn't currently offer a satellite/aerial map style with road labels, like Bing Maps Get Imagery Metadata API [AerialWithLabelsOnDemand] map style. However, the Azure Maps Web SDK does offer a similar map style called [satellite_road_labels].  
- Bing Maps Get Imagery Metadata API offers 256 x 256 pixel tile size. Azure Maps Get Map Tile API offers 256 x 256 pixel tile size and 512 x 512 pixel tile size. For more information, see [MapTileSize].
- Bing Maps Get Imagery Metadata API supports XML and JSON response formats, while Azure Maps Get Map Tile API only supports JSON.
- Bing Maps Get Imagery Metadata API offers map style basemaps such as _roads_ and _satellite/ hybrid_ using the `imagerySet` URI parameter. Azure Maps Get Map Tile API provides similar offerings basemaps by using the [TilesetID] URI parameter. Azure Maps `TilesetID` doesn't support `AerialWithLabelsOnDemand` or `AerialWithLabels` tiles in Get Map Tiles. _Hybrid_ tiles are only available in the Azure Maps Web SDK Map Control.
- Unlike Bing Maps for Enterprise, Azure Maps is a global service that supports specifying a geographic scope, which allows you to limit data residency to the European (EU) or United States (US) geographic areas (geos). All requests (including input data) are processed exclusively in the specified geographic area. For more information, see [Azure Maps service geographic scope].

## Security and authentication

Bing Maps for Enterprise only supports API key authentication. Azure Maps supports multiple ways to authenticate your API calls, such as a [subscription key](azure-maps-authentication.md#shared-key-authentication), [Microsoft Entra ID], and [Shared Access Signature (SAS) Token]. For more information on security and authentication in Azure Maps, See [Authentication with Azure Maps] and the [Security section] in the Azure Maps Get Map Tile documentation.

## Request parameters

The following table lists the Bing Maps _Get Imagery Metadata_ request parameters and the Azure Maps equivalent:

| Bing Maps request parameter  | Bing Maps request parameter alias  | Azure Maps request parameter  | Required in Azure Maps  | Azure Maps data type  | Description|
|------------------------------|------------------------------------|-------------------------------|-------------------------|-----------------------|------------|
| imagerySet   | None   | tilesetId  | True   | TilesetID      | Azure Maps has some map styles that Bing Maps Get Imagery Metadata API doesn’t have. Bing Maps Get Imagery Metadata API has some map styles that Azure Maps doesn’t have. For more information on the map styles offered by Azure Maps, see [TilesetID].|
| centerPoint  | None   | x<br>y    | True   | integer int32  | For more information on X, Y coordinates, see [Zoom levels and tile grid]. |
| culture      | c      | language   | False  | string         | For more information, see [Azure Maps Supported Languages].|
| include      | incl   | NA         | NA     | NA             | The only option for this parameter in Bing Maps is `ImageryProviders`. When specified, attribution information about the imagery providers is returned in the response, which should be displayed on the map. For Azure Maps Get Map Tile API, map copyright attribution information can be obtained from Azure Maps [Get Map Attribution] API. Copyright attribution information should be displayed on the map as per the [Azure Maps Product Terms]. |
| mapLayer     | ml     | NA         | N/A    | NA             ||
| orientation  | dir    | NA         | NA     | NA             | Applies to Bing Maps Birdseye map style, which isn't supported in Azure Maps. |
| uriScheme    |        | NA         | NA     | NA             ||
| zoomLevel    | zl     | zoom       | True   | integer int32  | For more information on X, Y coordinates, see [Zoom levels and tile grid]. |

For more information about the Azure Maps request parameters, see [URI Parameters].

## Request examples

Bing Maps _Get Imagery Metadata_ API request:

``` http
http://dev.virtualearth.net/REST/V1/Imagery/Metadata/road/37.770864,-122.467217?zl=15&key={YourBingMapsKey}
```

Azure Maps _Get Map Tile_ API request:

``` http
https://atlas.microsoft.com/map/tile?api-version=2022-08-01&tilesetId=microsoft.base.&zoom=15&x=5236&y=12665&tileSize=256&subscription-key={Your-Azure-Maps-Subscription-key}
```

## Response fields

The following table lists the fields that can appear in the HTTP response when running the Bing Maps *Get Imagery Metadata* API and the Azure Maps equivalent:

| Bing Maps response field                | Azure Maps response field       | Description |
|-----------------------------------------|---------------------------------|-------------|
| imageHeight (Json)<BR>ImageWidth (XML)  | Not supported  | Azure Maps Get Map Tile API provides the map tile image directly in the HTML response (binary image string) and offers 256 x 256 and 512 x 512 pixel tile sizes.  |
| imageUrl (Json)<BR>ImageUrl (XML)       | Not supported  | Azure Maps Get Map Tile API provides the map tile image directly in the HTML response (binary image string), as oppsed to an image URL. |
| imageUrlSubdomains (Json)<BR>ImageUrlSubdomains (XML)  | Not supported  | Azure Maps Get Map Tile API provides the map tile image directly in the HTML response (binary image string), as oppsed to an image URL. |
| imageWidth (Json)<BR>ImageWidth (XML)   | Not supported  | Azure Maps Get Map Tile API provides the map tile image directly in the HTML response (binary image string) and offers 256 x 256 and 512 x 512 pixel tile sizes.  |
| vintageEnd (Json)<BR>VintageEnd (XML)    | Not supported  | Azure Maps Get Map Tile API provides map tile vintage information in the response header (Data-Capture-Date-Range<SUP>**1**</SUP>), rather than in the response body. |
| vintageStart (Json)<BR>VintageStart (XML)| Not supported  | Azure Maps Get Map Tile API provides map tile vintage information in the response header (Data-Capture-Date-Range<SUP>**1**</SUP>), rather than in the response body. |
| zoomMax (Json)<BR>ZoonMax (XML)          | Not supported  | For information on zoom levels and maximum zoom supported by map tile styles, see [Zoom levels and tile grid] and [TilesetID].|
| zoomMin (Json)<BR>ZoomMin (XML)          | Not supported  | For information on zoom levels and maximum zoom supported by map tile styles, see [Zoom levels and tile grid] and [TilesetID].  |

<SUP>**1**</SUP> When using Azure Maps API to obtain RGB satellite images, you can also retrieve information about the acquisition date. The HTTP response includes a header called **Data-Capture-Date-Range**, which provides a date range indicating when the image was captured. For instance, it might appear as “7/31/2022-9/1/2023”. Keep in mind that satellite imagery often spans a date range due to batch processing and the stitching together of multiple images from different dates to create seamless maps. So, while a single date isn’t always applicable, the date range gives you insight into when the image data was collected.

For more information about the Azure Maps Get Map Tile API response fields, see [Response].

## Response examples

The following JSON sample shows what is returned in the body of the HTTP response when executing the Bing Maps _Get Imagery Metadata_ request:

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
                    "__type": "ImageryMetadata:http://schemas.microsoft.com/search/local/ws/rest/v1", 
                    "imageHeight": 256, 
                    "imageUrl": "http://ecn.t2.tiles.virtualearth.net/tiles/r023010203332102.jpeg?g=14374&mkt={culture}&shading=hill", 
                    "imageUrlSubdomains": null, 
                    "imageWidth": 256, 
                    "imageryProviders": null, 
                    "vintageEnd": "02 Dec 2019 GMT", 
                    "vintageStart": "02 Dec 2019 GMT", 
                    "zoomMax": 15, 
                    "zoomMin": 15 
                } 
            ] 
        } 
    ], 
    "statusCode": 200, 
    "statusDescription": "OK", 
    "traceId": "c0630758c8475d6f60d65af81b548c6f|MWH0032BEB|0.0.0.1" 
} 
```

The following JSON sample shows what is returned in the body of the HTTP response when executing an Azure Maps _Get Map Tile_ request:

Status code: 200

```HTTP
Content-Type: application/vnd.mapbox-vector-tile
```

Response Body

```JSON
"binary image string"
```

## Transactions usage

Bing Maps Get Imagery Metadata API generates one billable transaction per API request. Azure Maps Get Map Tile API generates one billable transaction for every 15 tiles. For more information on Azure Maps transactions, see [Understanding Azure Maps Transactions].

## Additional information

For more Azure Maps Render APIs see:

- [Get Map Attribution]: Use to get map copyright attribution information for tiles.
- [Get Map Static Image]: Use to render a user-defined, rectangular image containing a map section.

### Support

- [Microsoft Q&A Forum]

[AerialWithLabelsOnDemand]: /bingmaps/rest-services/imagery/get-imagery-metadata#template-parameters
[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Account]: https://azure.microsoft.com/
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps Creator]: about-creator.md
[Azure Maps Product Terms]: https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure
[Azure Maps service geographic scope]: geographic-scope.md
[Azure Maps Supported Languages]: supported-languages.md
[Azure Maps Web SDK]: how-to-use-map-control.md
[Get Imagery Metadata]: /bingmaps/rest-services/imagery/get-imagery-metadata
[Get Map Attribution]: /rest/api/maps/render/get-map-attribution
[Get Map Static Image]: /rest/api/maps/render/get-map-static-image
[Get Map Tile]: /rest/api/maps/render/get-map-tile
[MapTileSize]: /rest/api/maps/render/get-map-tile#maptilesize
[Microsoft Entra ID]: azure-maps-authentication.md#microsoft-entra-authentication
[Microsoft Q&A Forum]: /answers/tags/209/azure-maps
[Response]: /rest/api/maps/render/get-map-tile#response
[satellite_road_labels]: supported-map-styles.md#satellite_road_labels
[Security section]: /rest/api/maps/render/get-map-tile#security
[Shared Access Signature (SAS) Token]: azure-maps-authentication.md#shared-access-signature-token-authentication
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[TilesetID]: /rest/api/maps/render/get-map-tile#tilesetid
[Understanding Azure Maps Transactions]: understanding-azure-maps-transactions.md
[URI Parameters]: /rest/api/maps/render/get-map-tile#uri-parameters
[Zoom levels and tile grid]: zoom-levels-and-tile-grid.md
