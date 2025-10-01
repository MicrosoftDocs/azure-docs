---
title: Links to the Azure Maps REST API
titleSuffix: Microsoft Azure Maps
description: Links to the Azure Maps REST API.
author: sinnypan
ms.author: sipa
ms.date: 02/25/2025
ms.topic: reference
ms.service: azure-maps
ms.subservice: rest-api
---

# Azure Maps REST API

Azure Maps is a set of mapping and geospatial services that enable developers and organizations to build intelligent location-based experiences for applications across many different industries and use cases. Use Azure Maps to bring maps, geocoding, location search, routing, real-time traffic, geolocation, time zone information, and weather data into your web, mobile and server-side solutions.

The following tables show overviews of the services that Azure Maps offers:

## Latest release

The most recent stable release of the Azure Maps services.

| API | API version | Description |
|-----|-------------|-------------|
| [Geolocation] |  1.0  | Convert IP addresses to country/region ISO codes. |
| [Render] |  2024-04-01  | Get road, satellite/aerial, weather, traffic map tiles, and static map images. |
| [Route] |  2025-01-01  | Calculate optimized travel times and distances between locations for multiple modes of transportation and returns localized travel instructions. Now supports [Snap to Roads] API that snaps GPS data to road aligned coordinates. |
| [Search] |  2025-01-01  | Geocode addresses and coordinates, search for business listings and places by name or category and get administrative boundary polygons. |
| [Timezone] |  1.0  | Get time zone and sunrise/sunset information for specified locations. |
| [Traffic] |  2025-01-01  | Provides traffic incident data, such as construction, traffic congestion, accidents, and more, within a specified bounding box. |
| [Weather] |  1.1  | Get current, forecasted, and historical weather conditions, air quality, tropical storm details, and weather along a route. |

## Previous releases

There are previous stable releases of an Azure Maps service that are still in use. The services in this list have a more recent version available, and some are slated for retirement. If using a previous release, update to the latest version before it's retired to avoid disruption of service.

| API | API version | Description |
|-----|-------------|-------------|
| [Render][Render v1] |  1.0  | Get road, satellite/aerial, weather, traffic map tiles, and static map images.<BR>The Azure Maps [Render v1] service is now deprecated and will be retired on 9/17/26. To avoid service disruptions, all calls to Render v1 API need to be updated to use the latest version of the [Render] API. |
| [Render][render-2022-08-01] |  2022-08-01  | Get road, satellite/aerial, weather, traffic map tiles, and static map images. |
| [Route][Route v1] |  1.0  | Calculate optimized travel times and distances between locations for multiple modes of transportation and get localized travel instructions. |
| [Search][Search v1] |  1.0  | Geocode addresses and coordinates, search for business listings and places by name or category and get administrative boundary polygons. This is version 1.0 of the Search service. For the latest version, see [Search]. |
| Search |  2023-06-01  | Geocode addresses and coordinates, search for business listings and places by name or category and get administrative boundary polygons.  For the latest version, see [Search].|
| [Traffic][Traffic v1] |  1.0  | Get current traffic information including traffic flow and traffic incident details. |

## Latest preview

Prerelease version of an Azure Maps service. Preview releases contain new functionality or updates to existing functionality that will be included in a future release.

| API | API version | Description |
|-----|-------------|-------------|
| [Route][Route-2024-07-01-preview] | 2024-07-01-preview | The Route Range API supports high definition isochrone polygons. |
| [Search][Search-2025-06-01-preview]  |  2025-06-01-preview  | The new Autocomplete (preview) API enhances user experience by providing real-time suggestions as users type queries for addresses or places. |

<!--- Links to latest versions of each service ---------------------------------->
[Geolocation]: /rest/api/maps/geolocation
[Render]: /rest/api/maps/render
[Route]: /rest/api/maps/route
[Search]: /rest/api/maps/search
[Snap to Roads]: /azure/azure-maps/tutorial-snap-to-road
[Timezone]: /rest/api/maps/timezone
[Traffic]: /rest/api/maps/traffic
[Weather]: /rest/api/maps/weather

<!--- Links to previous versions of each service -------------------------------->
[render-2022-08-01]: /rest/api/maps/render?view=rest-maps-2022-08-01

[Render v1]: /rest/api/maps/render?view=rest-maps-1.0
[Route v1]: /rest/api/maps/route?view=rest-maps-1.0
[Search v1]: /rest/api/maps/search?view=rest-maps-1.0
[Traffic v1]: /rest/api/maps/traffic?view=rest-maps-1.0

<!--- 2024-07-01-preview is the latest preview release of the Route service,
      currently the only Azure Maps service in Preview -------------------------->
[Route-2024-07-01-preview]: /rest/api/maps/route?view=rest-maps-2024-07-01-preview
[Search-2025-06-01-preview]: /rest/api/maps/search?view=rest-maps-2025-06-01-preview
