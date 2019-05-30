---
title: Mobility Service data structures in Azure Maps| Microsoft Docs
description: Data structures in Azure Maps Mobility Service
author: walsehgal
ms.author: v-musehg
ms.date: 05/30/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Data structures in Azure Maps Mobility Service

This article introduces you to some of the common fields returned via the [Azure Maps Mobility Service API](https://aka.ms/AzureMapsMobilityService), when it is queried for public transit stops and lines. We recommend going through this article before starting out with the Mobility Service APIs. We discuss these common fields below.

## Metro Area

Mobility Service data is split into supported metro areas. Metro areas do not follow city boundaries, a metro area can contain multiple cities (e.g a densely populated city and its surrounding cities) and a country/region can support multiple metro areas. Metro area IDs are also subject to change.

The `metroID` is a metro area's ID that can can be used to call the [Get Metro Area Info](https://aka.ms/AzureMapsMobilityMetroAreaInfo) API to request supported transit types and additional details for the metro area such as transit agencies and active alerts. You can use the [Azure Maps Get Metro API](https://aka.ms/AzureMapsMobilityMetro) to request the supported metro areas and metroIDs.

| metroID | Name |
|:---------:|:------|
| 522       | Seattle-Tacoma-Bellevue|

![Seattle-metro-area](./media/mobility-service-data-structure/seattle-metro.png)

## Stop IDs

Transit stops can be referred to two types of IDs: The [General Transit Feed Specification (GFTS)](https://gtfs.org/) ID (referred to as stopKey) and the Azure Maps stop ID (referred to as stopId). When referring to stops over time, it is suggested to use the Azure Maps stop ID, as this ID is more stable it will not likely change as long as the physical stop exists. The GTFS stop ID is updated more often, for example, in case the GTFS provider needs to change it or new GTFS version is released, although the physical the stop had no change.

To start, you can request nearby transit stops by using [Get Nearby Transit API](https://aka.ms/AzureMapsMobilityNearbyTransit).

## Line Groups and Lines

Mobility Service uses a parallel data model for Lines and Line Groups to better deal with changes inherited from [GTFS](https://gtfs.org/) routes and trips data model.


### Line Groups

A Line Group is an entity, which groups together all lines that are logically part of the same group. Usually a line group will contain 2 lines, one going from A to B, and the other returning from B to A, both belonging to the same Public Transport agency and having the same line number. However, there may be cases in which a line group has more than 2 lines or only a single line within it.


### Lines

As discussed above, each line group is comprised of a set of lines. Quite often each line describes a direction and each line group is comprised of two lines. However there are cases in which more lines comprise a line group, for example there is a line that sometimes detours through a certain neighborhood and sometimes does not, and is operated in both cases under the same line number, and there are other cases in which a line group is comprised of a single line, for example a circular line with a single direction.

To begin, you can request line groups by using the [Get Transit Line API](https://aka.ms/AzureMapsMobilityTransitLine) and drill down to lines after that.
