---
title: Supported map styles in Azure Maps| Microsoft Docs
description: Map styles supported by Azure Maps
author: walsehgal
ms.author: v-musehg
ms.date: 10/02/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Azure Maps supported map styles
Azure maps support four different built-in map styles. The styles with their descriptions are listed below.

## road
A **road** map is a standard map that displays roads, natural and artificial features along with the labels for those features.

![road](./media/supported-map-styles/road.png)

**Applicable APIs:**
* [Map image](https://docs.microsoft.com/rest/api/maps/render/getmapimage)
* [Map tile](https://docs.microsoft.com/rest/api/maps/render/getmaptile)
* JS map control

## satellite 
The **satellite** style is a combination of satellite and aerial imagery.

![satellite](./media/supported-map-styles/satellite.png)

**Applicable APIs:**
* [Satellite tile](https://docs.microsoft.com/rest/api/maps/render/getmapimagerytilepreview)
* JS map control

## satellite_road_labels
This map style is a hybrid of roads and labels overlaid on top of satellite and aerial imagery.

![satellite_road_labels](./media/supported-map-styles/satellite_road_labels.png)

**Applicable APIs:**
* JS map control

## grayscale_dark
**grayscale dark** is a dark version of the road map style.

![gray_scale](./media/supported-map-styles/grayscale_dark.png)

**Applicable APIs:**
* JS map control 