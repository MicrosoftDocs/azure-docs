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

# C# Tutorial: Use Azure Search for geospatial queries

Learn how to implement a geospatial query, searching not on text but on a latitude, longitude and a specified radius from that point. If a geographical location of every piece of data (hotel, on our example) is known, then very valuable searches for your users can be carried out trying to locate a suitable result.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Search based on a given latitude, longitude and radius
> * Order results based on distance and perhaps other criteria

## Prerequisites

To complete this tutorial, you need to:

Have the [C# Tutorial: Page the results of an Azure Search](tutorial-csharp-paging.md) project up and running.

# [\.NET](#tab/dotnet)

## Install and run the project from GitHub


## Build a geospatial query into an Azure Search

## Add code to order Azure Search results


---

## Takeaways

Great job finishing the fifth and final tutorial in this series.

You should consider the following takeaways from this project:

* Geospatial searches provide a lot of valuable context to many user searches. Location is important.
* To fully develop spatial searches additional APIs providing city locations should be investigated, so a user can search on "20 kilometers from the center of New York" rather than having to know and enter latitude and longitude.
* Ordering should rarely, if ever, be left to the order of the data. Entering one or more **OrderBy** criteria is good practice.

## Next steps

You have completed this series of C# tutorials, well done! 

For further reference and tutorials, consider:
TBD