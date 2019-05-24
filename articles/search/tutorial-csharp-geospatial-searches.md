---
title: Tutorial on geospatial queries in Azure Search
description: This tutorial builds on the Create your first app in Azure Search tutorial and the paging tutorial, to add geospatial searches (searches based on the distance a location is away from a given latitude and longitude).
services: search
ms.service: search
ms.topic: tutorial
ms.author: v-pettur
author: PeterTurcan
ms.date: 05/01/2019
---

# C# Tutorial: Add geospatial filters to an Azure Search

Learn how to implement a geospatial filter, searching both on text and on a latitude, longitude and a radius from that point. If a geographical location of every piece of data (hotel, in our example) is known, then very valuable searches for your users can be carried out trying to locate a suitable result.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Search based on text then filtered on a given latitude, longitude and radius
> * Order results based on distance and other criteria

## Prerequisites

To complete this tutorial, you need to:

Have the [C# Tutorial: Page the results of an Azure Search](tutorial-csharp-paging.md) project up and running.

# [\.NET](#tab/dotnet)

## Install and run the project from GitHub


## Build a geospatial filter into an Azure Search

## Add code to order Azure Search results


# [Java](#tab/java)

## Install and run the project from GitHub


## Build a geospatial filter into an Azure Search

## Add code to order Azure Search results


---
## Takeaways

Great job finishing the fifth and final tutorial in this series.

You should consider the following takeaways from this project:

* Geospatial filters provide a lot of valuable context to many user searches. Location is important.
* To fully develop spatial filters additional APIs providing city locations should be investigated, so a user can search on "20 kilometers from the center of New York" rather than having to know and enter latitude and longitude.
* Ordering should rarely, if ever, be left to the order of the data. Entering one or more **OrderBy** criteria is good practice.

Of course, entering latitude and longitude is not the preferred user experience for most people. To take this example further consider either entering a city name with a radius, or perhaps even locating a point on a map and selecting a radius. To investigate these options try the following resources:

* [Azure Maps Documentation](https://docs.microsoft.com/en-us/azure/azure-maps/)
* [Find an address using the Azure Maps search service](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-search-for-address)


## Next steps

You have completed this series of C# tutorials, well done! 

For further reference and tutorials, consider:
TBD