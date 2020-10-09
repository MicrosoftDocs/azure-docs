---
title: 'Tutorial: Migrate from Bing Maps to Azure Maps | Microsoft Azure Maps'
description:  A tutorial on how to migrate from Bing Maps to Microsoft Azure Maps. Guidance walks you through how to switch to Azure Maps APIs and SDKs.
author: rbrundritt
ms.author: richbrun
ms.date: 9/10/2020
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: cpendle
ms.custom: 
---

# Tutorial - Migrate from Bing Maps to Azure Maps

This guide provides insights on how to migrate web, mobile and server-based applications from Bing Maps to the Azure Maps platform. This guide includes comparative code samples, migration suggestions, and best practices for migrating to Azure Maps.

## Azure Maps platform overview

Azure Maps provides developers from all industries powerful geospatial capabilities, packed with the freshest mapping data available to provide geographic context for web and mobile applications. Azure Maps is an Azure One API compliant set of REST APIs for Maps, Search, Routing, Traffic, Time Zones, Geofencing, Map Data, Weather Data, and many more services accompanied by both Web and Android SDKs to make development easy, flexible, and portable across multiple platforms. [Azure Maps is also available in Power BI](power-bi-visual-getting-started.md).

## High-level platform comparison

The following table provides a high-level list of Bing Maps features and the relative support for those features in Azure Maps. This list doesn’t include additional Azure Maps features such as accessibility, geofencing APIs, traffic services, spatial operations, direct map tile access, and batch services.

| Bing Maps feature                     | Azure Maps support |
|---------------------------------------|:------------------:|
| Web SDK                               | ✓                  |
| Android SDK                           | ✓                  |
| iOS SDK                               | Planned            |
| UWP SDK                               | Planned            |
| WPF SDK                               | Planned            |
| REST Service APIs                     | ✓                  |
| Autosuggest                           | ✓                  |
| Directions (including truck)          | ✓                  |
| Distance Matrix                       | ✓                  |
| Elevations                            | Planned            |
| Imagery – Static Map                  | ✓                  |
| Imagery Metadata                      | ✓                  |
| Isochrones                            | ✓                  |
| Local Insights                        | ✓                  |
| Local Search                          | ✓                  |
| Location Recognition                  | ✓                  |
| Locations (forward/reverse geocoding) | ✓                  |
| Optimized Itinerary Routes            | Planned            |
| Snap to roads                         | ✓                  |
| Spatial Data Services (SDS)           | Partial            |
| Time Zone                             | ✓                  |
| Traffic Incidents                     | ✓                  |
| Configuration driven maps             | N/A                |

Bing Maps provides basic key-based authentication. Azure Maps provides both basic key-based authentication as well as highly secure, Azure Active Directory authentication.

## Licensing considerations

When migrating to Azure Maps from Bing Maps, the following should be considered with regards to licensing.

-   Azure Maps charges for the usage of interactive maps based on the number of map tiles loaded, whereas Bing Maps charges for the loading of the map control (sessions). On Azure Maps, map tiles are automatically cached to reduce the cost for the developer. One Azure Maps transaction is generated for every 15 map tiles that are loaded. The interactive Azure Maps SDKs use 512-pixel tiles, and on average generates one or less transactions per page view.

-   Azure Maps allows data from its platform to be stored in Azure. It can also be cached elsewhere for up to six months as per the [terms of use](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31).

Here is some licensing related resources for Azure Maps:

-   [Azure Maps pricing page](https://azure.microsoft.com/pricing/details/azure-maps/)
-   [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=azure-maps)
-   [Azure Maps term of use](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31) (included in the Microsoft Online Services Terms)
-   [Choose the right pricing tier in Azure Maps](https://docs.microsoft.com/azure/azure-maps/choose-pricing-tier)

## Suggested migration plan

The following is a high-level migration plan.

1.  Take inventory of what Bing Maps SDKs and services your application is using and verify that Azure Maps provides alternative SDKs and services for you to migrate to.
2.  Create an Azure subscription (if you don’t already have one) at <https://azure.com>.
3.  Create an Azure Maps account ([documentation](https://docs.microsoft.com/azure/azure-maps/how-to-manage-account-keys))
    and authentication key or Azure Active Directory ([documentation](https://docs.microsoft.com/azure/azure-maps/how-to-manage-authentication)).
4.  Migrate your application code.
5.  Test your migrated application.
6.  Deploy your migrated application to production.

## Create an Azure Maps account

To create an Azure Maps account and get access to the Azure Maps platform, follow these steps:

1. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
2. Sign in to the [Azure portal](https://portal.azure.com/).
3. Create an [Azure Maps account](https://docs.microsoft.com/azure/azure-maps/how-to-manage-account-keys). 
4. [Get your Azure Maps subscription key](https://docs.microsoft.com/azure/azure-maps/how-to-manage-authentication#view-authentication-details) or setup Azure Active Directory authentication for enhanced security.

## Azure Maps technical resources

Here is a list of useful technical resources for Azure Maps.

-   Overview: https://azure.com/maps
-   Documentation: <https://aka.ms/AzureMapsDocs>
-   Web SDK Code Samples: <https://aka.ms/AzureMapsSamples>
-   Developer Forums: <https://aka.ms/AzureMapsForums>
-   Videos: <https://aka.ms/AzureMapsVideos>
-   Blog: <https://aka.ms/AzureMapsBlog>
-   Azure Maps Feedback (UserVoice): <https://aka.ms/AzureMapsFeedback>

## Migration support

Developers can seek migration support through the [forums](https://aka.ms/AzureMapsForums) or through one of the many Azure support options: <https://azure.microsoft.com/support/options/>

## New terminology 

The following is a list of common Bing Maps terms and that are known by a different term in Azure Maps.

| Bing Maps Term                    | Azure Maps Term                                                |
|-----------------------------------|----------------------------------------------------------------|
| Aerial                            | Satellite or Aerial                                            |
| Directions                        | May also be referred to as Routing                             |
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

## Next steps

Learn the details of how to migrate your Bing Maps application with these articles:

> [!div class="nextstepaction"]
> [Migrate a web app](migrate-from-bing-maps-web-app.md)

> [!div class="nextstepaction"]
> [Migrate a web service](migrate-from-bing-maps-web-services.md)
