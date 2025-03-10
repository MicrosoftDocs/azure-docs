---
title: 'Tutorial - Migrate from Google Maps to Azure Maps | Microsoft Azure Maps'
description:  Tutorial on how to migrate from Google Maps to Microsoft Azure Maps. Guidance walks you through how to switch to Azure Maps APIs and SDKs.
author: jkebeck
ms.author: jokebeck
ms.date: 09/23/2020
ms.topic: tutorial
ms.service: azure-maps
ms.subservice: general
---

# Tutorial: Migrate from Google Maps to Azure Maps

This article provides insights on how to migrate web, mobile and server-based applications from Google Maps to the Microsoft Azure Maps platform. This tutorial includes comparative code samples, migration suggestions, and best practices for migrating to Azure Maps. This tutorial demonstrates:

> [!div class="checklist"]
> * High-level comparison for equivalent Google Maps features available in Azure Maps.
> * What licensing differences to take into consideration.
> * How to plan your migration.
> * Where to find technical resources and support.

## Prerequisites

If you don't have an Azure subscription, create a [free account] before you begin.

* An [Azure Maps account]
* A [subscription key]

> [!NOTE]
> For more information on authentication in Azure Maps, see [Manage authentication in Azure Maps].

## Azure Maps platform overview

Azure Maps provides developers from all industries powerful geospatial capabilities. The capabilities are packed with regularly updated map data to provide geographic context for web, and mobile applications. Azure Maps has an Azure One API compliant set of REST APIs. The REST APIs offer Maps Rendering, Search, Routing, Traffic, Time Zones, Geolocation, Geofencing, Map Data, and Weather. Operations are accompanied by both Web and Android SDKs to make development easy, flexible, and portable across multiple platforms.

## High-level platform comparison

The table provides a high-level list of Azure Maps features, which correspond to Google Maps features. This list doesn't show all Azure Maps features. Other Azure Maps features include: accessibility, geofencing, isochrones, direct map tile access, batch services, and data coverage comparisons (that is, imagery coverage).

| Google Maps feature         | Azure Maps support                     |
|-----------------------------|:--------------------------------------:|
| Web SDK                     | ✓                                      |
| Android SDK                 | ✓<sup>1</sup>                          |
| iOS SDK                     | N/A<sup>2</sup>                        |
| REST Service APIs           | ✓                                      |
| Directions (Routing)        | ✓                                      |
| Distance Matrix             | ✓                                      |
| Geocoding (Forward/Reverse) | ✓                                      |
| Geolocation                 | ✓                                      |
| Nearest Roads               | ✓                                      |
| Places Search               | ✓                                      |
| Places Details              | N/A – website & phone number available |
| Places Photos               | N/A                                    |
| Place Autocomplete          | ✓                                      |
| Snap to Road                | ✓                                      |
| Speed Limits                | ✓                                      |
| Static Maps                 | ✓                                      |
| Static Street View          | N/A                                    |
| Time Zone                   | ✓                                      |
| Maps Embedded API           | N/A                                    |
| Map URLs                    | N/A                                    |

<sup>1</sup> The Azure Maps Native SDK for Android is now deprecated and will be retired on 3/31/25. To avoid service disruptions, migrate to the Azure Maps Web SDK by 3/31/25. For more information, see [The Azure Maps Android SDK migration guide](android-sdk-migration-guide.md).
<sup>2</sup> The Azure Maps Native SDK for iOS is now deprecated and will be retired on 3/31/25. To avoid service disruptions, migrate to the Azure Maps Web SDK by 3/31/25. For more information, see [The Azure Maps iOS SDK migration guide](ios-sdk-migration-guide.md).

Google Maps provides basic key-based authentication. Azure Maps provides both basic key-based authentication and Microsoft Entra authentication. Microsoft Entra authentication provides more security features, compared to the basic key-based authentication.

## Licensing considerations

When migrating to Azure Maps from Google Maps, consider the following points about licensing.

* Azure Maps charges for the usage of interactive maps, which is based on the number of loaded map tiles. On the other hand, Google Maps charges for loading the map control. In the interactive Azure Maps SDKs, map tiles are automatically cached to reduce the development cost. One Azure Maps transaction is generated for every 15 map tiles that are loaded. The interactive Azure Maps SDKs uses 512-pixel tiles, and on average, it generates one or less transactions per page view.
* Often, it's more cost effective to replace static map images from Google Maps web services with the Azure Maps Web SDK. The Azure Maps Web SDK uses map tiles. Unless the user pans and zooms the map, the service often generates only a fraction of a transaction per map load. The Azure Maps web SDK has options for disabling panning and zooming, if desired. Additionally, the Azure Maps web SDK provides a lot more visualization options than the static map web service.
* Azure Maps allows data from its platform to be stored in Azure. Also, data can be cached elsewhere for up to six months as per the [terms of use].

Here are some related resources for Azure Maps:

* [Azure Maps pricing page]
* [Azure pricing calculator]
* [Azure Maps term of use] - included in the Microsoft Online Services Terms.

## Suggested migration plan

A high-level migration plan includes.

1. Take inventory of the Google Maps SDKs and services that your application uses. Verify that Azure Maps provides alternative SDKs and services.
2. If you don't already have one, create an [Azure subscription].
3. Create an [Azure Maps account] and [subscription key] or [Microsoft Entra authentication].
4. Migrate your application code.
5. Test your migrated application.
6. Deploy your migrated application to production.

## Create an Azure Maps account

To create an Azure Maps account and get access to the Azure Maps platform, follow these steps:

1. If you don't have an Azure subscription, create a [free account] before you begin.
2. Sign in to the [Azure portal].
3. Create an [Azure Maps account].
4. Get your Azure Maps [subscription key] or [Microsoft Entra authentication] for enhanced security.

## Azure Maps technical resources

Here's a list of useful technical resources for Azure Maps.

* [Azure Maps product page]
* [Azure Maps product documentation]
* [Azure Maps Web SDK code samples]
* [Azure Maps developer forums]
* [Microsoft learning center shows]
* [Azure Maps Blog]
* [Azure Maps Q&A]

## Migration support

Developers can seek migration support through the [Azure Maps developer forums] or through one of the many [Azure support options].

## Clean up resources

No resources to be cleaned up.

## Next steps

Learn the details of how to migrate your Google Maps application with these articles:

> [!div class="nextstepaction"]
> [Migrate a web app](migrate-from-google-maps-web-app.md)

[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps Blog]: https://aka.ms/AzureMapsBlog
[Azure Maps developer forums]: https://aka.ms/AzureMapsForums
[Azure Maps pricing page]: https://azure.microsoft.com/pricing/details/azure-maps/
[Azure Maps product documentation]: https://aka.ms/AzureMapsDocs
[Azure Maps product page]: https://azure.com/maps
[Azure Maps Q&A]: https://aka.ms/AzureMapsFeedback
[Azure Maps term of use]: https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=46
[Azure Maps Web SDK code samples]: https://samples.azuremaps.com/
[Azure portal]: https://portal.azure.com/
[Azure pricing calculator]: https://azure.microsoft.com/pricing/calculator/?service=azure-maps
[Azure subscription]: https://azure.com
[Azure support options]: https://azure.microsoft.com/support/options
[free account]: https://azure.microsoft.com/free/
[Manage authentication in Azure Maps]: how-to-manage-authentication.md
[Microsoft Entra authentication]: azure-maps-authentication.md#microsoft-entra-authentication
[Microsoft learning center shows]: https://aka.ms/AzureMapsVideos
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[terms of use]: https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=46
