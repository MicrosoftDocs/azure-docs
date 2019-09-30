---
title: Supported map styles in Azure Maps| Microsoft Docs
description: Map styles supported by Azure Maps
author: walsehgal
ms.author: v-musehg
ms.date: 05/06/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Azure Maps supported map styles
Azure Maps supports several different built-in map styles as described below.

## road
A **road** map is a standard map that displays roads, natural and artificial features along with the labels for those features.

![road](./media/supported-map-styles/road.png)

**Applicable APIs:**
* [Map image](https://docs.microsoft.com/rest/api/maps/render/getmapimage)
* [Map tile](https://docs.microsoft.com/rest/api/maps/render/getmaptile)
* Web SDK map control
* Android map control

## blank and blank_accessible

The **blank** and **blank_accessible** map styles provide a blank canvas on which to visualize data on. The **blank_accessible** style will continue to provide screen reader updates with location details of where the map is located, even though the base map is not displayed.

> [!Note]
> In the web SDK you can change the background color of the map by setting the CSS `background-color` style of map DIV element.

**Applicable APIs:**
* Web SDK map control

## satellite 
The **satellite** style is a combination of satellite and aerial imagery.

![satellite](./media/supported-map-styles/satellite.png)

**Applicable APIs:**
* [Satellite tile](https://docs.microsoft.com/rest/api/maps/render/getmapimagerytilepreview)
* Web SDK map control
* Android map control

## satellite_road_labels
This map style is a hybrid of roads and labels overlaid on top of satellite and aerial imagery.

![satellite_road_labels](./media/supported-map-styles/satellite_road_labels.png)

**Applicable APIs:**
* Web SDK map control
* Android map control

## grayscale_dark
**grayscale dark** is a dark version of the road map style.

![gray_scale](./media/supported-map-styles/grayscale_dark.png)

**Applicable APIs:**
* Web SDK map control 
* Android map control


## grayscale_light
**grayscale light** is a light version of the road map style.

![grayscale light](./media/supported-map-styles/grayscale_light.png)

**Applicable APIs:**
* Web SDK map control
* Android map control


## night
**night** is a dark version of the road map style with colored roads and symbols.

![night](./media/supported-map-styles/night.png)

**Applicable APIs:**
* Web SDK map control
* Android map control

## road_shaded_relief
**road shaded relief** is an Azure Maps main style completed with contours of the Earth.

![shaded relief](./media/supported-map-styles/shaded-relief.png)

**Applicable APIs:**
* [Map tile](https://docs.microsoft.com/rest/api/maps/render/getmaptile)
* Web SDK map control
* Android map control
