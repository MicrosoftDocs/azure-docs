---
title: Migrate from Bing Maps to Azure Maps overview
titleSuffix: Microsoft Azure Maps
description: Overview for the migration guides that show how to migrate code from Bing Maps to Azure Maps.
author: eriklindeman
ms.author: eriklind
ms.date: 05/16/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Migrate from Bing Maps to Azure Maps overview

This article provides the information needed to migrate applications created in Bing Maps for Enterprise to Azure Maps, including links to specific Bing Maps API and SDK migration guides, platform comparisons, and best practices.

Covered in this article:

- A list comparing Bing Maps for Enterprise services that are available in Azure Maps.
- Information on features in Azure Maps that are unavailable in Bing Maps for Enterprise.
- Differences in licensing and billing between Bing Maps for Enterprise and Azure Maps.
- Migration planning.
- Links to more resources and support.

## Azure Maps platform overview

Azure Maps is a set of mapping and geospatial services that enable developers and organizations to build intelligent location-based experiences for applications across many different industries and use cases. Use Azure Maps to bring maps, geocoding, location search, routing, real-time traffic, geolocation, time zone info, weather, and custom indoor maps into your web, mobile and server-side solutions. Azure Maps is an Azure service, so it inherently includes many of the Azure security and compliance promises that are important to enterprise customers. Azure Maps includes many of the same features as Bing Maps for Enterprise, along with more functionality, like:

- Multiple service authentication method options. For more information on security and authentication in Azure Maps, See [Authentication with Azure Maps].
- Data residency compliance support. For more information, see [Azure Maps service geographic scope].
- Azure regulatory compliance standards (GDPR, ISO, FedRAMP, HIPAA, etc.). For more information, see [Microsoft Compliance].
- Support for programmatically creating and managing Azure Maps accounts (resources). For more information, see [Create your Azure Maps account using an ARM template].
- Azure Maps Weather maps. For more information, see Weather infrared and radar tiles in [Get Map Tile].
- Azure Maps Weather APIs. For more information, see [Weather].
- Azure Maps Geolocation APIs. For more information, see [Geolocation - Get IP To Location].
- Azure Maps Creator (custom indoor maps). For more information, see [Azure Maps Creator].

## High-level platform comparison

The following table provides a high-level summary of Bing Maps for Enterprise features and equivalent support in Azure Maps.

| Bing Maps for Enterprise                         | Azure Maps                         |
|--------------------------------------------------|------------------------------------|
| [Autosuggest]                                    | [Search: Fuzzy (typehead)]         |
| [Imagery: Static Maps]                           | [Render: Map Static Image]         |
| [Imagery: Map Tiles & Metadata]                  | [Render: Map Tile]                 |
| [Locations: Forward Geocoding (unstructured)]    | [Search: Forward Geocoding]        |
| [Locations: Forward Geocoding (structured)]      | [Search: Forward Geocoding]        |
| [Locations: Reverse Geocoding]                   | [Search: Reverse Geocoding]        |
| [Locations: Points of Interest Search]           | [Search: Fuzzy Search (typeahead)] |
| [Routes: Directions (auto)]                      | [Route Directions]                 |
| [Routes: Directions (truck)]                     | [Route Directions]                 |
| [Routes: Distance Matrix]                        | [Route Matrix]                     |
| [Routes: Isochrones]                             | [Route Range]                      |
| [SDS: Geocode Dataflow] | [Search: Forward Geocoding Batch]<br>[Search: Reverse Geocoding Batch] |
| [SDS: Geodata]                                   | [Search: Polygon]                  |
| [SDS: Points of Interest Search]                 | [Search: Fuzzy]<br>[Search: POI]   |
| [Time Zone]                                      | [Timezone]                         |
| [Traffic Incidents]                              | [Traffic Incident Detail]          |
| [Web Map Control (SDK)](/bingmaps/v8-web-control)| [Web Map Control (SDK)]            |

### Azure portal

With Bing Maps for Enterprise, the [Bing Maps Account Center] is where you manage your API keys, view your transaction usage reports, see service announcements, etc. In Azure Maps, the [Azure portal] is where you manage your Azure Maps account. Specifically, the Azure portal is where you go to manage your Azure Maps authentication ([shared key authentication] and [Shared access signature token authentication]) and access control options, set up [Cross-Origin Resource Sharing (CORS)] rules, view transaction usage reports, create budget alerts, provide map data feedback, access technical support resources, get current service health status update, and more.

### Security and authentication

Bing Maps for Enterprise only supports API key authentication. Azure Maps supports multiple authentication methods, such as a [Shared Key], [Microsoft Entra ID], or [Shared access signature token authentication]. For more information on security and authentication in Azure Maps, See [Authentication with Azure Maps].

## Licensing and billing considerations

When migrating to Azure Maps from Bing Maps for Enterprise, the following aspects should be considered regarding licensing and billing.

- Azure Maps is a transactions-based usage offering for all use case types and doesn't require special licensing, such as known users or tracked assets-based licensing for certain use cases.
- Unlike Bing Maps for Enterprise, Azure Maps is a pay-as-you-go offering – you only pay for the services that you use.
- With Azure Maps, billing (invoicing) happens monthly and doesn’t require an annual commitment.
- Azure Maps has a free monthly allotment of transactions. For more information, see the [Azure Maps pricing].
- Azure Maps charges for the usage of web control (SDK) based on the number of map tiles loaded, with one Azure Maps transaction being generated for every 15 map tiles loaded.
- The Azure Maps web control (SDK) uses 512 x 512 pixels map tiles, and typically generates one or less transactions per map load.

Licensing and billing related resources for Azure Maps:

- [Azure Licensing]
- [Azure Maps pricing]
- [Azure pricing calculator]
- [Understanding Azure Maps Transactions]
- [View Azure Maps API usage metrics]
- [Azure Maps terms of use]. To get the terms of use that applies to your situation, select the appropriate licensing program from the **Select a Program to View Terms** drop-down list then scroll down to the Azure Maps section.

## Suggested migration plan

Here are the suggested high-level migration steps:

1. Take an inventory of the specific Bing Maps for Enterprise APIs and SDKs that your application is using and confirm that Azure Maps has equivalent services to migrate to.
1. Confirm the transaction calculation differences between the Bing Maps for Enterprise services and the Azure Maps services that you are migrating to in order to understand any possible cost and pricing differences.
1. Create an [Azure subscription] and [Azure Maps account].
1. Migrate your application code using the Bing Maps for Enterprise to Azure Maps REST API and SDK migration resources.
1. Test and deploy your new Azure Maps application.

## Create an Azure Maps account

To create an Azure Maps account and get access to the Azure Maps platform, follow these steps:

- Create a free [Azure subscription] if you don't already have one.
- Sign in to the [Azure portal].
- Create an [Azure Maps account].
- Get your [Azure Maps subscription key] to try the Azure Maps APIs and SDK.
- Follow the [Authentication best practices].

## Bing Maps for Enterprise migration guides

### REST API migration guides

Bing Maps Imagery Services

- [Get Imagery Metadata]

 Bing Maps Locations Services

- [Find a Location by Address]
- [Find a Location by Point]
- [Find a Location by Query]

Bing Maps Routes Services

- [Calculate a Route]
- [Calculate a Truck Route]

Bing Maps Spatial Data Services (SDS)

- [Data Source Management & Query]
- [Geocode Dataflow]
- [Geodata]

Bing Maps Time Zone Services

- [Find Time Zone]

Bing Maps Traffic Services

- [Get Traffic Incidents]

### Web SDK migration guides

Bing Maps for Enterprise to Azure Maps Web SDK migration guides

- [Web SDK]
- [Copilot Bing Maps Web SDK to Azure Maps Web SDK migration guide]

## General Azure Maps resources

More Azure Maps resources:

- [Azure Maps product web site]
- [Azure Maps product documentation]
- [Azure Maps code samples]
- [Azure Maps blog]
- [Azure Maps data feedback]
- [Azure Maps Q&A]
- [Azure support options]

## Migration support

Developers can get migration support through the [Azure Maps Q&A] or through one of the many [Azure support options].

[Authentication with Azure Maps]: azure-maps-authentication.md
[Authentication best practices]: authentication-best-practices.md
[Autosuggest]: /bingmaps/rest-services/autosuggest
[Azure Licensing]: https://azure.microsoft.com/pricing/purchase-options/azure-account
[Azure Maps account]: how-to-manage-account-keys.md#create-a-new-account
[Azure Maps blog]: https://aka.ms/AzureMapsTechBlog
[Azure Maps code samples]: https://samples.azuremaps.com/
[Azure Maps Creator]: /rest/api/maps-creator
[Azure Maps data feedback]: https://aka.ms/azuremapsdatafeedback
[Azure Maps pricing]: https://azure.microsoft.com/pricing/details/azure-maps
[Azure Maps product documentation]: /azure/azure-maps
[Azure Maps product web site]: https://azure.microsoft.com/products/azure-maps
[Azure Maps Q&A]: /answers/topics/azure-maps.html
[Azure Maps service geographic scope]: geographic-scope.md
[Azure Maps subscription key]: azure-maps-authentication.md#shared-key-authentication
[Azure Maps terms of use]: https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure
[Azure Portal]: https://portal.azure.com
[Azure pricing calculator]: https://azure.microsoft.com/pricing/calculator/?service=azure-maps
[Azure subscription]: https://azure.microsoft.com/free/
[Azure support options]: https://azure.microsoft.com/support/options/
[Bing Maps Account Center]: https://www.bingmapsportal.com
[Calculate a Route]: migrate-calculate-route.md
[Calculate a Truck Route]: migrate-calculate-truck-route.md
[Copilot Bing Maps Web SDK to Azure Maps Web SDK migration guide]: migrate-help-using-copilot.md
[Create your Azure Maps account using an ARM template]: how-to-create-template.md
[Cross-Origin Resource Sharing (CORS)]: azure-maps-authentication.md#cross-origin-resource-sharing-cors
[Data Source Management & Query]: migrate-sds-data-source-management.md 
[Find a Location by Address]: migrate-find-location-address.md
[Find a Location by Point]: migrate-find-location-by-point.md
[Find a Location by Query]: migrate-find-location-query.md
[Find Time Zone]: migrate-find-time-zone.md
[Geocode Dataflow]: migrate-geocode-dataflow.md
[Geodata]: migrate-geodata.md
[Geolocation - Get IP To Location]: /rest/api/maps/geolocation/get-ip-to-location
[Get Imagery Metadata]: migrate-get-imagery-metadata.md
[Get Map Tile]: /rest/api/maps/render/get-map-tile
[Get Traffic Incidents]: migrate-get-traffic-incidents.md
[Imagery: Map Tiles & Metadata]: /bingmaps/rest-services/imagery/get-imagery-metadata
[Imagery: Static Maps]: /bingmaps/rest-services/imagery/get-a-static-map
[Locations: Forward Geocoding (structured)]: /bingmaps/rest-services/locations/find-a-location-by-address
[Locations: Forward Geocoding (unstructured)]: /bingmaps/rest-services/locations/find-a-location-by-query
[Locations: Points of Interest Search]: /bingmaps/spatial-data-services/public-data-sources/pointsofinterest
[Locations: Reverse Geocoding]: /bingmaps/rest-services/locations/find-a-location-by-point
[Microsoft Compliance]: /compliance/
[Microsoft Entra ID]: azure-maps-authentication.md#microsoft-entra-authentication
[Render: Map Static Image]: /rest/api/maps/render/get-map-static-image
[Render: Map Tile]: /rest/api/maps/render/get-map-tile
[Route Directions]: /rest/api/maps/route/get-route-directions
[Route Matrix]: /rest/api/maps/route/get-route-matrix
[Route Range]: /rest/api/maps/route/get-route-range
[Routes: Directions (auto)]: /bingmaps/rest-services/routes/calculate-a-route
[Routes: Directions (truck)]: /bingmaps/rest-services/routes/calculate-a-truck-route
[Routes: Distance Matrix]: /bingmaps/rest-services/routes/calculate-a-distance-matrix
[Routes: Isochrones]: /bingmaps/rest-services/routes/calculate-an-isochrone 
[SDS: Geocode Dataflow]: /bingmaps/spatial-data-services/geocode-dataflow-api
[SDS: Geodata]: /bingmaps/spatial-data-services/geodata-api
[SDS: Points of Interest Search]: /bingmaps/spatial-data-services/public-data-sources/pointsofinterest
[Search: Forward Geocoding Batch]: /rest/api/maps/search/get-geocoding-batch
[Search: Forward Geocoding]: /rest/api/maps/search/get-geocoding
[Search: Fuzzy (typehead)]: /rest/api/maps/search/get-search-fuzzy
[Search: Fuzzy Search (typeahead)]: /rest/api/maps/search/get-search-fuzzy
[Search: Fuzzy]: /rest/api/maps/search/get-search-fuzzy
[Search: POI]: /rest/api/maps/search/get-search-poi
[Search: Polygon]: /rest/api/maps/search/get-polygon
[Search: Reverse Geocoding Batch]: /rest/api/maps/search/get-reverse-geocoding-batch
[Search: Reverse Geocoding]: /rest/api/maps/search/get-reverse-geocoding
[Shared access signature token authentication]: azure-maps-authentication.md#shared-access-signature-token-authentication
[shared key authentication]: azure-maps-authentication.md#shared-key-authentication
[Shared Key]: azure-maps-authentication.md#shared-key-authentication
[Time Zone]: /bingmaps/rest-services/timezone/find-time-zone
[Timezone]: /rest/api/maps/timezone/get-timezone-by-coordinates
[Traffic Incident Detail]: /rest/api/maps/traffic/get-traffic-incident-detail
[Traffic Incidents]: /bingmaps/rest-services/traffic/get-traffic-incidents
[Understanding Azure Maps Transactions]: understanding-azure-maps-transactions.md
[View Azure Maps API usage metrics]: how-to-view-api-usage.md
[Weather]: /rest/api/maps/weather
[Web Map Control (SDK)]: /azure/azure-maps/how-to-use-map-control
[Web SDK]: migrate-from-bing-maps-web-app.md
