---
title: Private Atlas for indoor maps| Microsoft Azure Maps 
description: In this article, you'll learn how the workflow for managing your Private Atlas indoor maps.
author: anastasia-ms
ms.author: v-stharr
ms.date: 03/30/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---


# Private Atlas for indoor maps

Private Atlas makes it possible to develop applications based on your own private indoor map data using Azure Maps API and SDK. To begin, first create a Private Atlas in an Azure Maps account. For more information on creating a Private Atlas account, see [How to manage Private Atlas](how-to-manage-private-atlas.md).

In this concept article, we will walk you through both the workflow for managing your indoor maps in Private Atlas and the tools for developing applications. We will cover the data processing pipeline from gathering data into Azure Maps, to curating and using that data in applications, and finally to administering Private Atlas resources.

The following diagram describes the end to end process. 

[!Private-Atlas-pipelin]()

## Gathering map data

Private Atlas gathers indoor map data by converting a DWG package that represents a facility. The DWG package contains the DWG files that were typically produced by means of CAD tools during the facility construction or remodeling phase of the facility.

In addition, the DWG package contains a manifest.json file that defines the DWG file names, layer names, and additional metadata to be included in the indoor map data.  The manifest.json can also be useful if necessary data can be programmatically accessed during automated processes.

The minimum set of data required is defined by the mandatory elements of the DWG package. However, depending on data availability and solution requirements, those mandatory elements can be expanded further to include, for example, space names, categories and zones. 

For further information on DWG Package requirements, see [DWG Package requirements](dwg-requirements.md).

