---
title: 'Tutorial: Migrate from Google Maps to Azure Maps | Microsoft Azure Maps'
description:  A tutorial on how to migrate from Google Maps to Microsoft Azure Maps. Guidance walks you through how to switch to Azure Maps APIs and SDKs.
author: rbrundritt
ms.author: richbrun
ms.date: 12/17/2019
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: cpendle
ms.custom: 
---

# Migrate from Google Maps to Azure Maps

This tutorial provides insights on how to migrate web, mobile and server-based applications from Google Maps to the Microsoft Azure Maps platform. This tutorial includes comparative code samples, migration suggestions, and best practices for migrating to Azure Maps.

## Azure Maps platform overview

Azure Maps provides developers from all industries powerful geospatial capabilities, packed with the regularly updated map data to provide geographic context for web and mobile applications. Azure Maps has an Azure One API compliant set of REST APIs for Maps, Search, Routing, Traffic, Time Zones, Geolocation, Geofencing, Map Data, Weather, Mobility, and Spatial Operations accompanied by both Web and Android SDKs to make development easy, flexible, and portable across multiple platforms.

## High-level platform comparison

The following table provides a high-level list of Google Maps features and the relative support for those features in Azure Maps. This list does not include additional Azure Maps features such as accessibility, geofencing APIs, isochrones, spatial operations, direct map tile access, batch services, and data coverage comparisons (i.e. imagery coverage).

| Google Maps feature         | Azure Maps support                     |
|-----------------------------|:--------------------------------------:|
| Web SDK                     | ✓                                      |
| Android SDK                 | ✓                                      |
| iOS SDK                     | Planned                                |
| REST Service APIs           | ✓                                      |
| Directions (Routing)        | ✓                                      |
| Distance Matrix             | ✓                                      |
| Elevation                   | Planned                                |
| Geocoding (Forward/Reverse) | ✓                                      |
| Geolocation                 | N/A                                    |
| Places Search               | ✓                                      |
| Places Details              | N/A – website & phone number available |
| Places Photos               | N/A                                    |
| Place Autocomplete          | ✓                                      |
| Static Maps                 | ✓                                      |
| Static Street View          | N/A                                    |
| Time Zone                   | ✓                                      |
| Maps Embedded API           | N/A                                    |
| Map URLs                    | N/A                                    |

Google Maps provides basic key-based authentication. Azure Maps provides both basic key-based authentication as well as highly secure, Azure Active Directory authentication.

## Licensing considerations

When migrating to Azure Maps from Google Maps, the following points should be considered with regards to licensing.

- Azure Maps charges for the usage of interactive maps based on the number of map tiles loaded, whereas Google Maps charges for the loading of the map control. In the interactive Azure Maps SDKs, map tiles are automatically cached to reduce the cost for the developer. One Azure Maps transaction is generated for every 15 map tiles that are loaded. The interactive Azure Maps SDKs use 512-pixel tiles, and on average generates one or less transactions per page view.
- It is often much more cost effective to replace static map images from Google Maps web services with the Azure Maps Web SDK as this uses map tiles and unless the user pans and zooms the map, they will often generate only a fraction of a transaction per map load. The Azure Maps web SDK has options for disabling panning and zooming. Additionally, the Azure Maps web SDK provides a lot more visualization options than a static map web service does.
- Azure Maps allows data from its platform to be stored in Azure. It can also be cached elsewhere for up to six months as per the [terms of use](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=46).

Here are some related resources for Azure Maps:

- [Azure Maps pricing page](https://azure.microsoft.com/pricing/details/azure-maps/)
- [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=azure-maps)
- [Azure Maps term of use](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=46)
    (included in the Microsoft Online Services Terms)
- [Choose the right pricing tier in Azure Maps](https://docs.microsoft.com/azure/azure-maps/choose-pricing-tier)

## Suggested migration plan

The following is a high-level migration plan.

1. Take inventory of what Google Maps SDKs and services your application is using and verify that Azure Maps provides alternative SDKs and services for you to migrate to.
2. Create an Azure subscription (if you don’t already have one) at [https://azure.com](https://azure.com).
3. Create an Azure Maps account ([documentation](https://docs.microsoft.com/azure/azure-maps/how-to-manage-account-keys)) and authentication key or Azure Active Directory ([documentation](https://docs.microsoft.com/azure/azure-maps/how-to-manage-authentication)).
4. Migrate your application code.
5. Test your migrated application.
6. Deploy your migrated application to production.

## Azure Maps technical resources

Here is a list of useful technical resources for Azure Maps.

- Overview: [https://azure.com/maps](https://azure.com/maps)
- Documentation: [https://aka.ms/AzureMapsDocs](https://aka.ms/AzureMapsDocs)
- Web SDK Code Samples: [https://aka.ms/AzureMapsSamples](https://aka.ms/AzureMapsSamples)
- Developer Forums: [https://aka.ms/AzureMapsForums](https://aka.ms/AzureMapsForums)
- Videos: [https://aka.ms/AzureMapsVideos](https://aka.ms/AzureMapsVideos)
- Blog: [https://aka.ms/AzureMapsBlog](https://aka.ms/AzureMapsBlog)
- Azure Maps Feedback (UserVoice): [https://aka.ms/AzureMapsFeedback](https://aka.ms/AzureMapsFeedback)

## Migration support

Developers can seek migration support through the [forums](https://aka.ms/AzureMapsForums) or through one of the many Azure support options: [https://azure.microsoft.com/support/options](https://azure.microsoft.com/support/options)

## Next steps

Learn how to migrate your Google Maps application with these articles:

> [!div class="nextstepaction"]
> [Migrate a web app](migrate-from-google-maps-web-app.md)

> [!div class="nextstepaction"]
> [Migrate an Android app](migrate-from-google-maps-android-app.md)

> [!div class="nextstepaction"]
> [Migrate a web service](migrate-from-google-maps-web-services.md)
