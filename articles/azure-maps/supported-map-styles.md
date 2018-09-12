---
title: Supported map styles in Azure Maps| Microsoft Docs
description: Map styles supported by Azure Maps
author: walsehgal
ms.author: v-musehg
ms.date: 08/28/2018
ms.topic: concepts
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: mvc
---

# Azure Maps supported map styles
Azure maps support four different built-in map styles. The styles along with their descriptions are listed below.

## Road
A **road** map is a standard map that displays roads, natural and man-made features along with the labels for those features.

![road](./media/supported-map-styles/road.png)

**Applicable APIs:**
* [Map image](https://docs.microsoft.com/rest/api/maps/render/getmapimage)
* [Map tile](https://docs.microsoft.com/rest/api/maps/render/getmaptile)
* JS map control

## Satellite 
The **satellite** style is a combination of satellite and aerial imagery.

![satellite](./media/supported-map-styles/satellite.png)

**Applicable APIs:**
* [Satellite tile](https://docs.microsoft.com/rest/api/maps/render/getmapimagerytilepreview)
* JS map control

## Satellite_Road_Labels
This map style is a hybrid of roads and labels overlaid on top of satellite and aerial imagery.

![satellite_road_labels](./media/supported-map-styles/satellite_road_labels.png)

**Applicable APIs:**
* JS map control

## Grayscale_Dark
**Grayscale dark** is a dark version of the road map style.

![gray_scale](./media/supported-map-styles/grayscale_dark.png)

**Applicable APIs:**
* JS map control 