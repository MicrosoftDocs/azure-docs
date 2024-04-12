---
title: Links to the Azure Maps Rest API
titleSuffix: Microsoft Azure Maps
description: Links to the Azure Maps Rest API.
author: eriklindeman
ms.author: eriklind
ms.date: 02/05/2024
ms.topic: reference
ms.service: azure-maps
services: azure-maps
---

# Azure Maps Rest API

Azure Maps is a set of mapping and geospatial services that enable developers and organizations to build intelligent location-based experiences for applications across many different industries and use cases. Use Azure Maps to bring maps, geocoding, location search, routing, real-time traffic, geolocation, time zone information and weather data into your web, mobile and server-side solutions.

The following tables show overviews of the services that Azure Maps offers:

## Latest release

The most recent stable release of the Azure Maps services.

| API | API version | Description |
|-----|-------------|-------------|
| [Data] |  2.0  | The Azure Maps Data v2 service is deprecated and will be retired on 9/16/24. To avoid service disruptions, all calls to the Data service need to be updated to use the Azure Maps [Data registry] service by 9/16/24. For more information, see [How to create data registry]. |
| [Data Registry] |  2023-06-01  | Programmatically store and update geospatial data to use in spatial operations. |
| [Geolocation] |  1.0  | Convert IP addresses to country/region ISO codes. |
| [Render] |  2022-08-01  | Get road, satellite/aerial, weather, traffic map tiles, and static map images. |
| [Route] |  1.0  | Calculate optimized travel times and distances between locations for multiple modes of transportation and get localized travel instructions. |
| [Search] |  2023-06-01  | Geocode addresses and coordinates, search for business listings and places by name or category and get administrative boundary polygons. |
| [Spatial] |  2022-08-01  | Use geofences, great circle distances and other spatial operations to analyze location data. |
| [Timezone] |  1.0  | Get time zone and sunrise/sunset information for specified locations. |
| [Traffic] |  1.0  | Get current traffic information including traffic flow and traffic incident details. |
| [Weather] |  1.1  | Get current, forecasted, and historical weather conditions, air quality, tropical storm details and weather along a route. |

## Previous release

A previous stable release of an Azure Maps service that is still in use. The services in this list will generally have a more recent version available, and are slated for retirement. If using a previous release, update to the latest version before it's retired to avoid disruption of service.

| API | API version | Description |
|-----|-------------|-------------|
| [Data][Data-v1] |  1.0  | The Azure Maps Data v1 service is deprecated and will be retired on 9/16/24. To avoid service disruptions, all calls to the Data service need to be updated to use the Azure Maps [Data registry] service by 9/16/24. For more information, see [How to create data registry]. |
| [Render][Render v1] |  1.0  | Get road, satellite/aerial, weather, traffic map tiles and static map images.<BR>The Azure Maps [Render v1] service is now deprecated and will be retired on 9/17/26. To avoid service disruptions, all calls to Render v1 API needs to be updated to use the latest version of the [Render] API by 9/17/26. |
| [Search][Search-v1] |  1.0  | Geocode addresses and coordinates, search for business listings and places by name or category and get administrative boundary polygons. This is version 1.0 of the Search service. For the latest version, see [Search]. |

## Latest preview

Prerelease version of an Azure Maps service. Preview releases contain new functionality or updates to existing functionality that will be included in a future release.

| API | API version | Description |
|-----|-------------|-------------|
| [Route][Route-2023-10-01-preview] | 2023-10-01-preview | Returns the ideal route in GeoJSON between locations for multiple modes of transportation.<BR><BR>Some of the updates in this version of the Route service include:<ul><li>Routes with "via" waypoints that the route must pass through.</li><li>More geographies</li><li>More languages available for localized travel instructions.</li></ul> |

<!--- Links to latest versions of each service ---------------------------------->
[Data]: /rest/api/maps/data
[How to create data registry]: /azure/azure-maps/how-to-create-data-registries
[Data Registry]: /rest/api/maps/data-registry
[Geolocation]: /rest/api/maps/geolocation
[Render]: /rest/api/maps/render
[Route]: /rest/api/maps/route
[Search]: /rest/api/maps/search
[Spatial]: /rest/api/maps/spatial
[Timezone]: /rest/api/maps/timezone
[Traffic]: /rest/api/maps/traffic
[Weather]: /rest/api/maps/weather

<!--- Links to previous versions of each service -------------------------------->
[Data-v1]: /rest/api/maps/data?view=rest-maps-1.0
[Render v1]: /rest/api/maps/render?view=rest-maps-1.0
[Search-v1]: /rest/api/maps/search?view=rest-maps-1.0

<!--- 2023-10-01-preview is the latest preview release of the Route service,
      currently the only Azure Maps service in Preview -------------------------->
[Route-2023-10-01-preview]: /rest/api/maps/route?view=rest-maps-2023-10-01-preview
