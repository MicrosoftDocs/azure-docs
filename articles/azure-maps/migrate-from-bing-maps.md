---
title: 'Tutorial: Migrate from Bing Maps to Azure Maps'
titleSuffix: Microsoft Azure Maps
description:  A tutorial on how to migrate from Bing Maps to Microsoft Azure Maps. Guidance walks you through how to switch to Azure Maps APIs and SDKs.
author: eriklindeman
ms.author: eriklind
ms.date: 12/1/2021
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
ms.custom: 
---

# Tutorial: Migrate from Bing Maps to Azure Maps

This guide provides insights on how to migrate web, mobile and server-based applications from Bing Maps to the Azure Maps platform. This guide includes comparative code samples, migration suggestions, and best practices for migrating to Azure Maps.

In this tutorial, you'll learn:

> [!div class="checklist"]
>
> * High-level comparison for equivalent Bing Maps features available in Azure Maps.
> * What licensing differences to take into consideration.
> * How to plan your migration.
> * Where to find technical resources and support.

## Prerequisites

If you don't have an Azure subscription, create a [free Azure account] before you begin.

* An [Azure Maps account]
* A [subscription key]

> [!NOTE]
> For more information on authentication in Azure Maps, see [manage authentication in Azure Maps].

## Azure Maps platform overview

Azure Maps provides developers from all industries powerful geospatial capabilities, packed with the freshest mapping data available to provide geographic context for web and mobile applications. Azure Maps is an Azure One API compliant set of REST APIs for Maps, Search, Routing, Traffic, Time Zones, Geofencing, Map Data, Weather Data, and many more services accompanied by both Web and Android SDKs to make development easy, flexible, and portable across multiple platforms. [Azure Maps is also available in Power BI].

## High-level platform comparison

The following table provides a high-level list of Bing Maps features and the relative support for those features in Azure Maps. This list doesn’t include other Azure Maps features such as accessibility, geofencing APIs, traffic services, spatial operations, direct map tile access, and batch services.

| Bing Maps feature                     | Azure Maps support |
|---------------------------------------|:------------------:|
| Web SDK                               | ✓                  |
| Android SDK                           | ✓                  |
| iOS SDK                               | Planned            |
| UWP SDK                               | N/A                |
| WPF SDK                               | N/A                |
| REST Service APIs                     | ✓                  |
| Autosuggest                           | ✓                  |
| Directions (including truck)          | ✓                  |
| Distance Matrix                       | ✓                  |
| Imagery – Static Map                  | ✓                  |
| Imagery Metadata                      | ✓                  |
| Isochrones                            | ✓                  |
| Local Insights                        | ✓                  |
| Local Search                          | ✓                  |
| Location Recognition                  | ✓                  |
| Locations (forward/reverse geocoding) | ✓                  |
| Optimized Itinerary Routes            | Planned            |
| Snap to roads                         | <sup>1</sup>       |
| Spatial Data Services (SDS)           | Partial            |
| Time Zone                             | ✓                  |
| Traffic Incidents                     | ✓                  |
| Configuration driven maps             | N/A                |

<sup>1</sup> While there's no direct replacement for the Bing Maps *Snap to road* service, this functionality can be implemented using the Azure Maps [Route - Get Route Directions] REST API. For a complete code sample demonstrating the snap to road functionality, see the [Basic snap to road logic] sample that demonstrates how to snap individual points to the rendered roads on the map. Also see the [Snap points to logical route path] sample that shows how to snap points to the road network to form a logical path.

Bing Maps provides basic key-based authentication. Azure Maps provides both basic key-based authentication and highly secure, Microsoft Entra authentication.

## Licensing considerations

When migrating to Azure Maps from Bing Maps, the following information should be considered regarding licensing.

* Azure Maps charges for the usage of interactive maps based on the number of map tiles loaded, whereas Bing Maps charges for the loading of the map control (sessions). To reduce  costs for developers, Azure Maps automatically caches map tiles. One Azure Maps transaction is generated for every 15 map tiles that are loaded. The interactive Azure Maps SDKs use 512-pixel tiles, and on average generates one or less transactions per page view.

* Azure Maps allows data from its platform to be stored in Azure. Caching and storing results locally is only permitted when the purpose of caching is to reduce latency times of Customer’s application, see [Microsoft Azure terms of use] for more information.

Here are some licensing-related resources for Azure Maps:

* [Azure Maps pricing page]
* [Azure pricing calculator]
* [Azure Maps term of use] (Scroll down to the Azure Maps section)

## Suggested migration plan

Here's an example of a high-level migration plan.

1. Take inventory of what Bing Maps SDKs and services your application is using and verify that Azure Maps provides alternative SDKs and services for you to migrate to.
1. Create an Azure subscription (if you don’t already have one) at [azure.com]).
1. Create an [Azure Maps account].
1. Setup authentication using an Azure Maps [subscription key] or [Microsoft Entra authentication].
1. Migrate your application code.
1. Test your migrated application.
1. Deploy your migrated application to production.

## Create an Azure Maps account

To create an Azure Maps account and get access to the Azure Maps platform, follow these steps:

1. If you don't have an Azure subscription, create a [free Azure account] before you begin.
2. Sign in to the [Azure portal].
3. Create an [Azure Maps account].
4. Get your Azure Maps [subscription key] or setup [Microsoft Entra authentication] for enhanced security.

## Azure Maps technical resources

Here's a list of useful technical resources for Azure Maps.

* [Azure Maps product page]
* [Azure Maps product documentation]
* [Azure Maps code samples]
* [Azure Maps developer forums]
* [Microsoft learning center shows]
* [Azure Maps Blog]
* [Azure Maps Feedback (UserVoice)]

## Migration support

Developers can seek migration support through the [Azure Maps Q&A] or through one of the many [Azure support options].

## New terminology

The following list contains common Bing Maps terms and their corresponding Azure Maps terms.

| Bing Maps Term                    | Azure Maps Term                                                |
|-----------------------------------|----------------------------------------------------------------|
| Aerial                            | Satellite or Aerial                                            |
| Directions                        | Might also be referred to as Routing                             |
| Entities                          | Geometries or Features                                         |
| `EntityCollection`                | Data source or Layer                                           |
| `Geopoint`                        | Position                                                       |
| `GeoXML`                          | XML files in the Spatial IO module                             |
| Ground Overlay                    | Image layer                                                    |
| Hybrid (in reference to map type) | Satellite with roads                                           |
| Infobox                           | Popup                                                          |
| Location                          | Position                                                       |
| `LocationRect`                    | Bounding box                                                   |
| Map Type                          | Map style                                                      |
| Navigation bar                    | Map style picker, Zoom control, Pitch control, Compass control |
| Pushpin                           | Bubble layer, Symbol layer, or HTML Marker                      |

## Clean up resources

There are no resources that require cleanup.

## Next steps

Learn the details of how to migrate your Bing Maps application with these articles:

> [!div class="nextstepaction"]
> [Migrate a web app]

[Azure Active Directory authentication]: azure-maps-authentication.md#azure-ad-authentication
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps Blog]: https://aka.ms/AzureMapsTechBlog
[Azure Maps code samples]: https://samples.azuremaps.com/
[Azure Maps developer forums]: https://aka.ms/AzureMapsForums
[Azure Maps Feedback (UserVoice)]: https://aka.ms/AzureMapsFeedback
[Azure Maps is also available in Power BI]: power-bi-visual-get-started.md
[Azure Maps pricing page]: https://azure.microsoft.com/pricing/details/azure-maps/
[Azure Maps product documentation]: https://aka.ms/AzureMapsDocs
[Azure Maps product page]: https://azure.com/maps
[Azure Maps Q&A]: /answers/topics/azure-maps.html
[Azure Maps term of use]: https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/MCA
[Azure portal]: https://portal.azure.com/
[Azure pricing calculator]: https://azure.microsoft.com/pricing/calculator/?service=azure-maps
[Azure support options]: https://azure.microsoft.com/support/options/
[azure.com]: https://azure.com
[Basic snap to road logic]: https://samples.azuremaps.com/?search=Snap%20to%20road&sample=basic-snap-to-road-logic
[free Azure account]: https://azure.microsoft.com/free/
[manage authentication in Azure Maps]: how-to-manage-authentication.md
[Microsoft Azure terms of use]: https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31
[Microsoft learning center shows]: https://aka.ms/AzureMapsVideos
[Migrate a web app]: migrate-from-bing-maps-web-app.md
[Route - Get Route Directions]: /rest/api/maps/route/get-route-directions
[Snap points to logical route path]: https://samples.azuremaps.com/?search=Snap%20to%20road&sample=snap-points-to-logical-route-path
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
