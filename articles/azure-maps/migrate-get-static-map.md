---
title: Migrate Bing Maps Get a Static Map API to Azure Maps Get Map Static Image API
titleSuffix: Microsoft Azure Maps
description: Learn how to Migrate the Bing Maps Get a Static Map API to the Azure Maps Get Map Static Image API.
author: faterceros
ms.author: aterceros 
ms.date: 06/26/2024
ms.topic: how-to
ms.service: azure-maps
ms.subservice: render
---

# Migrate Bing Maps Get a Static Map API

This article explains how to migrate the Bing Maps [Get a Static Map] API to the Azure Maps [Get Map Static Image] API. Azure Maps Get Map Static Image API renders a user-defined, rectangular Road, Satellite/Aerial, or Traffic style map image.

## Prerequisites

- An [Azure Account]
- An [Azure Maps account]
- A [subscription key] or other form of [Authentication with Azure Maps]

## Notable differences

- Bing Maps Get a Static Map API offers Road, Satellite/Aerial, Traffic, Streetside, Birds Eye and Ordnance Survey maps styles. Azure Maps Get Map Static Image API offers the same styles except for Streetside, Birds Eye and Ordnance Survey.
- Bing Maps Get a Static Map API supports getting a static map using coordinates, street address or place name as the location input. Azure Maps Get Map Static Image API supports only coordinates as the location input.
- Bing Maps Get a Static Map API supports getting a static map of a driving, walking, or transit route natively. Azure Maps Get Map Static Image API doesn't provide route map functionality natively.
- Bing Maps Get a Static Map API provides static maps in PNG, JPEG and GIF image formats. Azure Maps Get Map Static Image API provides static maps in PNG and JPEG image formats.
- Bing Maps Get a Static Map API supports XML and JSON response formats. Azure Maps Get Map Static Image API supports only JSON response format.
- Bing Maps Get a Static Map API supports HTTP GET and POST requests. Azure Maps Get Map Static Image API supports HTTP GET requests.
- Bing Maps Get a Static Map API uses coordinates in the latitude & longitude format. Azure Maps Get Map Static Image API uses coordinates in the longitude & latitude format, as defined in [GeoJSON].
- Unlike Bing Maps for Enterprise, Azure Maps is a global service that supports specifying a geographic scope, which allows you to limit data residency to the European (EU) or United States (US) geographic areas (geos). All requests (including input data) are processed exclusively in the specified geographic area. For more information, see [Azure Maps service geographic scope].

## Security and authentication

Bing Maps for Enterprise only supports API key authentication. Azure Maps supports multiple ways to authenticate your API calls, such as a [subscription key](azure-maps-authentication.md#shared-key-authentication), [Microsoft Entra ID], and [Shared Access Signature (SAS) Token]. For more information on security and authentication in Azure Maps, See [Authentication with Azure Maps] and the [Security] section in the Azure Maps Get Map Static Image documentation.

## Request parameters

The following table lists the Bing Maps _Get a Static Map_ request parameters and the Azure Maps equivalent:

| Bing Maps request parameter| Parameter Alias  | Azure Maps request parameter | Required in Azure Maps     | Azure Maps data type  | Description  |
|----------------------------|------------------|------------------------------|----------------------------|-----------------------|--------------|
| centerPoint | | center | True (if not using bbox) | number[] | Bing Maps Get a Static Map API requires coordinates be in latitude & longitude format, whereas Azure Maps Get Map Static Image API requires longitude & latitude format, as defined in the [GeoJSON] format. <br><br>`longitude,latitude` range from [-90, 90]​. Note: Either `center` or `bbox` are required parameters. They're mutually exclusive. |
| culture | c | language | FALSE | String | In Azure Maps Get Map Static Image API, this is the language in which search results should be returned and is specified in the Azure Maps [request header]. For more information, see [Supported Languages]. |
| declutterPins | dcl | Not supported   | Not supported | Not supported | |
| dpi | dir | Not supported | Not supported | Not supported | |
| drawCurve | dv | Path | FALSE | String | |
| fieldOfView | fov | Not supported | Not supported | Not supported | In Bing Maps, this parameter is used for `imagerySet` Birdseye, `BirdseyeWithLabels`, `BirdseyeV2`, `BirdseyeV2WithLabels`, `OrdnanceSurvey`, `Streetside`. Azure Maps doesn't support these maps styles. |
| format | fmt | format | TRUE | String | Bing Maps Get a Static Map API provides static maps in PNG, JPEG and GIF image formats. Azure Maps Get Map Static Image API provides static maps in PNG and JPEG image formats. |
| heading | | Not supported | Not supported | Not supported | In Bing Maps, this parameter is used for imagerySet Birdseye, BirdseyeWithLabels, BirdseyeV2, BirdseyeV2WithLabels, OrdnanceSurvey, Streetside. Azure Maps doesn't support these maps styles. |
| highlightEntity | he | Not supported | Not supported | Not supported | In Bing Maps Get a Static Map API, this parameter is used to get a polygon of the location input (entity) displayed on the map natively. Azure Maps Get a Map Static Image API doesn't support this feature, however, you can get a polygon of a location (locality) from the Azure Maps [Get Polygon] API and then display that on the static map. |
| imagerySet | | tilesetID | TRUE | [TilesetId] | |
| mapArea | ma | bbox | True (if not using center) | number[] | A bounding box, defined by two longitudes and two latitudes, represents the four sides of a rectangular area on the Earth, in the format of `minLon, minLat, maxLon, maxLat`. <br><br>Note: Either `center` or `bbox` are required parameters. They're mutually exclusive. `bbox` shouldn’t be used with `height` or `width`. |
| mapLayer | ml | trafficLayer | FALSE | TrafficTilesetId | Optional. If `TrafficLayer` is provided, it returns map image with corresponding traffic layer. For more information, see [tilesetId]. |
| mapSize | ms | height | TRUE | integer int32 | |
| | | width | | | |
| mapMetadata | mmd | Not supported | Not supported | Not supported | |
| orientation | dir | Not supported | Not supported | Not supported | In Bing Maps Get a Static Map API, this parameter is used for 'imagerySet' Birdseye, BirdseyeWithLabels, BirdseyeV2, BirdseyeV2WithLabels, OrdnanceSurvey, Streetside. Azure Maps doesn't support these maps styles |
| pitch | | Not supported | Not supported | Not supported | In Bing Maps Get a Static Map API, this parameter is used for 'imagerySet' Birdseye, BirdseyeWithLabels, BirdseyeV2, BirdseyeV2WithLabels, OrdnanceSurvey, Streetside. Azure Maps doesn't support these maps styles |
| pushpin | pp | pins | FALSE | String | In Bing Maps Get a Static Map API, an HTTP GET request is limited to 18 pins and an HTTP POST request is limited to 100 pins per static map. Azure Maps Get Map Static Image API HTTP GET request doesn’t have a limit on the number of pins per static map. However, the number of pins supported on the static map is based on the maximum number of characters supported in the HTTP GET request. See Azure Maps Get Map Static Image API ‘pins’ parameter in [URI Parameters] for more details on pushpin support. |
| query | | Not supported | Not supported | Not supported | Azure Maps Get Map Static Image API supports only coordinates as the location input, not street address or place name. Use the Azure Maps Get Geocoding API to convert a street address or place name to coordinates. |
| Route Parameters: avoid | None | Not supported | Not supported | Not supported | Azure Maps Get Maps Static Image API doesn’t provide route map functionality natively. To get a static map with a route path on it, use the Azure Maps [Get Route Directions] or [Post Route Directions] API to get route path coordinates of a given route and then use the Azure Maps [Get Map Static Image] API `drawCurve` feature to overlay the route path coordinates on the static map. |
| Route Parameters: distanceBeforeFirstTurn | dbft | Not supported | Not supported | Not supported | Azure Maps Get Maps Static Image API doesn’t provide route map functionality natively. To get a static map with a route path on it, you can use the Azure Maps [Get Route Directions] or [Post Route Directions] API to get route path coordinates of a given route and then use the Azure Maps [Get Map Static Image] API `drawCurve` feature to overlay the route path coordinates on the static map. |
| Route Parameters: dateTime | dt | Not supported | Not supported | Not supported | Azure Maps Get Maps Static Image API doesn’t provide route map functionality natively. To get a static map with a route path on it, you can use the Azure Maps [Get Route Directions] or [Post Route Directions] API to get route path coordinates of a given route and then use the Azure Maps [Get Map Static Image] API `drawCurve` feature to overlay the route path coordinates on the static map. |
| Route Parameters: maxSolutions | maxSolns | Not supported | Not supported | Not supported | Azure Maps Get Maps Static Image API doesn’t provide route map functionality natively. To get a static map with a route path on it, you can use the Azure Maps [Get Route Directions] or [Post Route Directions] API to get route path coordinates of a given route and then use the Azure Maps [Get Map Static Image] API `drawCurve` feature to overlay the route path coordinates on the static map. |
| Route Parameters: optimize | optmz | Not supported | Not supported | Not supported | Azure Maps Get Maps Static Image API doesn’t provide route map functionality natively. To get a static map with a route path on it, you can use the Azure Maps [Get Route Directions] or [Post Route Directions] API to get route path coordinates of a given route and then use the Azure Maps [Get Map Static Image] API `drawCurve` feature to overlay the route path coordinates on the static map. |
| Route Parameters: timeType | tt | Not supported | Not supported | Not supported | Azure Maps Get Maps Static Image API doesn’t provide route map functionality natively. To get a static map with a route path on it, you can use the Azure Maps [Get Route Directions] or [Post Route Directions] API to get route path coordinates of a given route and then use the Azure Maps [Get Map Static Image] API `drawCurve` feature to overlay the route path coordinates on the static map. |
| Route Parameters: travelMode | None | Not supported | Not supported | Not supported | Azure Maps Get Maps Static Image API doesn’t provide route map functionality natively. To get a static map with a route path on it, you can use the Azure Maps [Get Route Directions] or [Post Route Directions] API to get route path coordinates of a given route and then use the Azure Maps [Get Map Static Image] API `drawCurve` feature to overlay the route path coordinates on the static map. |
| Route Parameters: waypoint.n | wp.n | Not supported | Not supported | Not supported | Azure Maps Get Maps Static Image API doesn’t provide route map functionality natively. To get a static map with a route path on it, you can use the Azure Maps [Get Route Directions] or [Post Route Directions] API to get route path coordinates of a given route and then use the Azure Maps [Get Map Static Image] API `drawCurve` feature to overlay the route path coordinates on the static map. |
| style | st | Not supported | Not supported | Not supported | |
| userRegion | ur | view | FALSE | String | A string that represents an [ISO 3166-1 Alpha-2 region/country code]. This alters geopolitical disputed borders and labels to align with the specified user region. By default, the View parameter is set to “Auto” even if not defined in the request. For more information, see [Supported Views]. |
| zoomLevel | | Zoom | FALSE | String | Desired zoom level of the map. Zoom value must be in the range: 0-20 (inclusive). Default value is 12. |
| highlightEntity | he | Not supported | Not supported | Not supported | In Bing Maps Get a Static Map API, this parameter is used to get a polygon of the location input (entity) displayed on the map natively. Azure Maps Get a Map Static Image API doesn't support this feature, however, you can get a polygon of a location (locality) from the Azure Maps [Get Polygon] API and then display that on the static map. |

For more information about the Azure Maps Get Map Static Image API request parameters, see [URI Parameters].

## Request examples

Bing Maps _Get a Static Map_ API sample GET request:

``` http
https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/51.504810,-0.113629/15?mapSize=500,500&pp=51.504810,-0.113629;45&key={BingMapsKey}
```

Azure Maps _Get Map Static Image_ API sample GET request:

``` http
https://atlas.microsoft.com/map/static?api-version=2024-04-01&tilesetId=microsoft.base.road&zoom=15&center=-0.113629,51.504810&subscription-key={Your-Azure-Maps-Subscription-key}
```

## Response examples

The following screenshot shows what is returned in the body of the HTTP response when executing the Bing Maps _Get a Static Map_ request:

:::image type="content" source="./media/migration-guides/bing-maps-get-static-map.png" alt-text="A screenshot of the map displaying the results of the Bing Maps Get a Static Map request." lightbox="./media/migration-guides/bing-maps-get-static-map.png":::

The following JSON sample shows what is returned in the body of the HTTP response when executing an Azure Maps _Get Map Static Image_ request:

:::image type="content" source="./media/migration-guides/azure-maps-get-map-static-image.png" alt-text="A screenshot of the map displaying the results of the Azure Maps Get Map Static Image request." lightbox="./media/migration-guides/azure-maps-get-map-static-image.png":::

## Transactions usage

Like Bing Maps Get a Static Map API, Azure Maps Get Map Static Image API logs one billable transaction per request. For more information on Azure Maps transactions, see [Understanding Azure Maps Transactions].

## Additional information

- [Render custom data on a raster map]

Support

- [Microsoft Q&A Forum]

[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Account]: https://azure.microsoft.com/
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps service geographic scope]: geographic-scope.md
[GeoJSON]: https://geojson.org
[Get a Static Map]: /bingmaps/rest-services/imagery/get-a-static-map
[Get Map Static Image]: /rest/api/maps/render/get-map-static-image
[Get Polygon]: /rest/api/maps/search/get-polygon
[Get Route Directions]: /rest/api/maps/route/get-route-directions
[ISO 3166-1 Alpha-2 region/country code]: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
[Microsoft Entra ID]: azure-maps-authentication.md#microsoft-entra-authentication
[Microsoft Q&A Forum]: /answers
[Post Route Directions]: /rest/api/maps/route/post-route-directions
[Render custom data on a raster map]: how-to-render-custom-data.md
[request header]: /rest/api/maps/render/get-map-static-image?#request-headers
[Security]: /rest/api/maps/render/get-map-static-image#security
[Shared Access Signature (SAS) Token]: azure-maps-authentication.md#shared-access-signature-token-authentication
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Supported Languages]: supported-languages.md
[Supported Views]: supported-languages.md#azure-maps-supported-views
[TilesetId]: /rest/api/maps/render/get-map-static-image#tilesetid
[Understanding Azure Maps Transactions]: understanding-azure-maps-transactions.md
[URI Parameters]: /rest/api/maps/render/get-map-static-image#uri-parameters
