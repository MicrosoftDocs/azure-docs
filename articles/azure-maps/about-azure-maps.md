---
title: Overview for Microsoft Azure Maps
description: Learn about services and capabilities in Microsoft Azure Maps and how to use them in your applications.
author: eriklindeman
ms.author: eriklind
ms.date: 10/21/2022
ms.topic: overview
ms.service: azure-maps
services: azure-maps
ms.custom: mvc, references_regions
---

# What is Azure Maps?

Azure Maps is a collection of geospatial services and SDKs that use fresh mapping data to provide geographic context to web and mobile applications. Azure Maps provides:

* REST APIs to render vector and raster maps in multiple styles and satellite imagery.
* Creator services to create and render maps based on private indoor map data.
* Search services to locate addresses, places, and points of interest around the world.
* Various routing options; such as point-to-point, multipoint, multipoint optimization, isochrone, electric vehicle, commercial vehicle, traffic influenced, and matrix routing.
* Traffic flow view and incidents view, for applications that require real-time traffic information.
* Time zone and Geolocation services.
* Geofencing service and mapping data storage, with location information hosted in Azure.
* Location intelligence through geospatial analytics.

Additionally, Azure Maps services are available through the Web SDK and the Android SDK. These tools help developers quickly develop and scale solutions that integrate location information into Azure solutions.

You can sign up for a free [Azure Maps account] and start developing.

The following video explains Azure Maps in depth:

</br>

> [!VIDEO https://learn.microsoft.com/Shows/Internet-of-Things-Show/Azure-Maps/player?format=ny]

## Map controls

### Web SDK

The Azure Maps Web SDK lets you customize interactive maps with your own content and imagery. You can use this interactive map for both your web or mobile applications. The map control makes use of WebGL, so you can render large data sets with high performance. You can develop with the SDK by using JavaScript or TypeScript.

:::image type="content" source="./media/about-azure-maps/intro_web_map_control.png" lightbox="./media/about-azure-maps/intro_web_map_control.png" alt-text="Example map of population change created by using Azure Maps Web SDK.":::

### Android SDK

Use the Azure Maps Android SDK to create mobile mapping applications.

:::image type="content" source="./media/about-azure-maps/android_sdk.png" lightbox="./media/about-azure-maps/android_sdk.png" border="false" alt-text="Map examples on a mobile device.":::

## Services in Azure Maps

Azure Maps consists of the following services that can provide geographic context to your Azure applications.

### Data registry service

Data is imperative for maps. Use the Data registry service to access geospatial data, used with spatial operations or image composition, previously uploaded to your [Azure Storage].  By bringing customer data closer to the Azure Maps service, you reduce latency and increase productivity. For more information, see [Data registry] in the Azure Maps REST API documentation.

> [!NOTE]
>
> **Azure Maps Data service retirement**
>
> The Azure Maps Data service (both [v1] and [v2]) is now deprecated and will be retired on 9/16/24. To avoid service disruptions, all calls to the Data service will need to be updated to use the Azure Maps [Data registry] service by 9/16/24. For more information, see [How to create data registry].

### Geolocation service

Use the Geolocation service to retrieve the two-letter country/region code for an IP address. This service can help you enhance user experience by providing customized application content based on geographic location.

For more information, see [Geolocation] in the Azure Maps REST API documentation.

### Render service

[Render] service introduces a new version of the [Get Map Tile] API that supports using Azure Maps tiles not only in the Azure Maps SDKs but other map controls as well. It includes raster and vector tile formats, 256x256 or 512x512 tile sizes (where applicable) and numerous map types such as road, weather, contour, or map tiles. For a complete list, see [TilesetID] in the REST API documentation. You're required to display the appropriate copyright attribution on the map anytime you use the Azure Maps Render service, either as basemaps or layers, in any third-party map control. For more information, see [How to use the Get Map Attribution API].

:::image type="content" source="./media/about-azure-maps/intro_map.png" lightbox="./media/about-azure-maps/intro_map.png" alt-text="Example of a map from the Render service.":::

> [!NOTE]
>
> **Azure Maps Render v1 service retirement**
>
> The Azure Maps [Render v1] service is now deprecated and will be retired on 9/17/26. To avoid service disruptions, all calls to Render v1 API will need to be updated to use [Render v2] API by 9/17/26.

### Route service

The route service is used to calculate the estimated arrival times (ETAs) for each requested route. Factors such as real-time traffic information and historic traffic data, like the typical road speeds on the requested day of the week and time of day are considered. The route service returns the shortest or fastest routes available to multiple destinations at a time in sequence or in optimized order, based on time or distance. The service allows developers to calculate directions across several travel modes, such as car, truck, bicycle, or walking, and electric vehicle. The service also considers inputs, such as departure time, weight restrictions, or hazardous material transport.

:::image type="content" source="./media/about-azure-maps/intro_route.png" lightbox="./media/about-azure-maps/intro_route.png" alt-text="Example of a map from the Route service.":::

The Route service offers advanced set features, such as:

* Batch processing of multiple route requests.
* Matrices of travel time and distance between a set of origins and destinations.
* Finding routes or distances that users can travel based on time or fuel requirements.

For more information, see [Route] in the Azure Maps REST API documentation.

### Search service

The Search service helps developers search for addresses, places, business listings by name or category, and other geographic information. Also, services can [reverse geocode] addresses and cross streets based on latitudes and longitudes.

:::image type="content" source="./media/about-azure-maps/intro_search.png" lightbox="./media/about-azure-maps/intro_search.png"  alt-text="Example of a search on a map.":::

The Search service also provides advanced features such as:

* Search along a route.
* Search inside a wider area.
* Batch a group of search requests.
* Search electric vehicle charging stations and Point of Interest (POI) data by brand name.

For more information, see [Search] in the Azure Maps REST API documentation.

### Spatial service

The Spatial service quickly analyzes location information to help inform customers of ongoing events happening in time and space. It enables near real-time analysis and predictive modeling of events.

The service enables customers to enhance their location intelligence with a library of common geospatial mathematical calculations. Common calculations include closest point, great circle distance, and buffers. For more information about the Spatial service and its various features, see [Spatial] in the Azure Maps REST API documentation.

### Timezone service

The Time zone service enables you to query current, historical, and future time zone information. You can use either latitude and longitude pairs or an [IANA ID] as an input. The Time zone service also allows for:

* Converting Microsoft Windows time-zone IDs to IANA time zones.
* Fetching a time-zone offset to UTC.
* Getting the current time in a chosen time zone.

A typical JSON response for a query to the Time zone service looks like the following sample:

```JSON
{
  "Version": "2020a",
  "ReferenceUtcTimestamp": "2020-07-31T19:15:14.4570053Z",
  "TimeZones": [
    {
      "Id": "America/Los_Angeles",
      "Names": {
        "ISO6391LanguageCode": "en",
        "Generic": "Pacific Time",
        "Standard": "Pacific Standard Time",
        "Daylight": "Pacific Daylight Time"
      },
      "ReferenceTime": {
        "Tag": "PDT",
        "StandardOffset": "-08:00:00",
        "DaylightSavings": "01:00:00",
        "WallTime": "2020-07-31T12:15:14.4570053-07:00",
        "PosixTzValidYear": 2020,
        "PosixTz": "PST+8PDT,M3.2.0,M11.1.0"
      }
    }
  ]
}
```

For more information, see [Timezone] in the Azure Maps REST API documentation.

### Traffic service

The Traffic service is a suite of web services that developers can use for web or mobile applications that require traffic information. The service provides two data types:

* Traffic flow: Real-time observed speeds and travel times for all key roads in the network.
* Traffic incidents: An up-to-date view of traffic jams and incidents around the road network.

:::image type="content" source="./media/about-azure-maps/intro_traffic.png" lightbox="./media/about-azure-maps/intro_traffic.png"  alt-text="Example of a map with traffic information.":::

For more information, see [Traffic] in the Azure Maps REST API documentation.

### Weather service

The Weather service offers API to retrieve weather information for a particular location. This information includes observation date and time, weather conditions, precipitation indicator flags, temperature, and wind speed information. Other details such as RealFeel™ Temperature and UV index are also returned.

Developers can use the [Get Weather along route API] to retrieve weather information along a particular route. Also, the service supports the generation of weather notifications for waypoints affected by weather hazards, such as flooding or heavy rain.

The [Get Map Tile] API allows you to request past, current, and future radar and satellite tiles.

:::image type="content" source="./media/about-azure-maps/intro_weather.png" lightbox="./media/about-azure-maps/intro_weather.png"  alt-text="Example of map with real-time weather radar tiles.":::

## Programming model

Azure Maps is built for mobility and can help you develop cross-platform applications. It uses a programming model that's language agnostic and supports JSON output through [REST APIs].

Also, Azure Maps offers a convenient [JavaScript map control] with a simple programming model. The development is quick and easy for both web and mobile applications.

## Power BI visual

The Azure Maps Power BI visual provides a rich set of data visualizations for spatial data on top of a map. It's estimated that over 80% of business data has a location context. The Azure Maps Power BI visual offers a no-code solution for gaining insights into how this location context relates to and influences your business data.

:::image type="content" source="./media/about-azure-maps/intro-power-bi.png" lightbox="./media/about-azure-maps/intro-power-bi.png" border="false" alt-text="Power BI desktop with the Azure Maps Power BI visual displaying business data.":::

For more information, see [Get started with Azure Maps Power BI visual].

## Usage

To access Azure Maps services, go to the [Azure portal] and create an Azure Maps account.

Azure Maps uses a key-based authentication scheme. When you create your account, two keys are generated. To authenticate for Azure Maps services, you can use either key.

> [!NOTE]
> Azure Maps shares customer-provided address/location queries with third-party TomTom for mapping functionality purposes. These queries aren't linked to any customer or end user when shared with TomTom and can't be used to identify individuals.
>
> TomTom is a subprocessor that is authorized to subprocess Azure Maps customer data. For more information, see the Microsoft Online Services [Subprocessor List] located in the [Microsoft Trust Center].

## Supported regions

Azure Maps services are currently available except in the following countries/regions:

* China
* South Korea

Verify that the location of your current IP address is in a supported country/region.

## Next steps

Learn about indoor maps:

[What is Azure Maps Creator?]

Try a sample app that showcases Azure Maps:

[Quickstart: Create a web app]

Stay up to date on Azure Maps:

[Azure Maps blog]

<!---------   learn.microsoft.com links     --------------->
[Azure Storage]: ../storage/common/storage-introduction.md
[Get started with Azure Maps Power BI visual]: power-bi-visual-get-started.md
[How to use the Get Map Attribution API]: how-to-show-attribution.md
[Quickstart: Create a web app]: quick-demo-map-app.md
[What is Azure Maps Creator?]: about-creator.md
[v1]: /rest/api/maps/data
[v2]: /rest/api/maps/data-v2
[How to create data registry]: how-to-create-data-registries.md
<!---------   REST API Links     --------------->
[Data registry]: /rest/api/maps/data-registry
[Geolocation]: /rest/api/maps/geolocation
[Get Map Tile]: /rest/api/maps/render-v2/get-map-tile
[Get Weather along route API]: /rest/api/maps/weather/getweatheralongroute
[Render]: /rest/api/maps/render-v2
[REST APIs]: /rest/api/maps/
[Route]: /rest/api/maps/route
[Search]: /rest/api/maps/search
[Spatial]: /rest/api/maps/spatial
[TilesetID]: /rest/api/maps/render-v2/get-map-tile#tilesetid
[Timezone]: /rest/api/maps/timezone
[Traffic]: /rest/api/maps/traffic
<!---------   JavaScript API Links     --------------->
[JavaScript map control]: /javascript/api/azure-maps-control
<!---------   External Links     --------------->
[Azure Maps account]: https://azure.microsoft.com/services/azure-maps/
[Azure Maps blog]: https://azure.microsoft.com/blog/topics/azure-maps/
[Azure portal]: https://portal.azure.com
[IANA ID]: https://www.iana.org/
[Microsoft Trust Center]: https://www.microsoft.com/trust-center/privacy
[reverse geocode]: https://en.wikipedia.org/wiki/Reverse_geocoding
[Subprocessor List]: https://servicetrust.microsoft.com/DocumentPage/aead9e68-1190-4d90-ad93-36418de5c594
