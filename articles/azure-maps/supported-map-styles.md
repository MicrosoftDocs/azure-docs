---
title: Supported built-in Azure Maps map styles
description: Learn about the built-in map styles that Azure Maps supports, such as road, blank_accessible, satellite, satellite_road_labels, road_shaded_relief, and night.
author: anastasia-ms
ms.author: v-stharr
ms.date: 07/24/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Azure Maps supported built-in map styles

Azure Maps supports several different built-in map styles as described below.

## road

A **road** map is a standard map that displays roads. It also displays natural and artificial features, and the labels for those features.

![road map style](./media/supported-map-styles/road.png)

**Applicable APIs:**

* [Map image](https://docs.microsoft.com/rest/api/maps/render/getmapimage)
* [Map tile](https://docs.microsoft.com/rest/api/maps/render/getmaptile)
* Web SDK map control
* Android map control
* Power BI visual

## blank and blank_accessible

The **blank** and **blank_accessible** map styles provide a blank canvas for visualizing data. The **blank_accessible** style will continue to provide screen reader updates with map's location details, even though the base map isn't displayed.

> [!Note]
> In the Web SDK, you can change the background color of the map by setting the CSS `background-color` style of map DIV element.

**Applicable APIs:**

* Web SDK map control

## satellite

The **satellite** style is a combination of satellite and aerial imagery.

![satellite tile map style](./media/supported-map-styles/satellite.png)

**Applicable APIs:**

* [Satellite tile](https://docs.microsoft.com/rest/api/maps/render/getmapimagerytilepreview)
* Web SDK map control
* Android map control
* Power BI visual

## satellite_road_labels

This map style is a hybrid of roads and labels overlaid on top of satellite and aerial imagery.

![satellite_road_labels map style](./media/supported-map-styles/satellite-road-labels.png)

**Applicable APIs:**

* Web SDK map control
* Android map control
* Power BI visual

## grayscale_dark

**grayscale dark** is a dark version of the road map style.

![gray_scale map style](./media/supported-map-styles/grayscale-dark.png)

**Applicable APIs:**

* [Map image](https://docs.microsoft.com/rest/api/maps/render/getmapimage)
* [Map tile](https://docs.microsoft.com/rest/api/maps/render/getmaptile)
* Web SDK map control
* Android map control
* Power BI visual

## grayscale_light

**grayscale light** is a light version of the road map style.

![grayscale light map style](./media/supported-map-styles/grayscale-light.png)

**Applicable APIs:**
* Web SDK map control
* Android map control
* Power BI visual

## night

**night** is a dark version of the road map style with colored roads and symbols.

![night map style](./media/supported-map-styles/night.png)

**Applicable APIs:**

* Web SDK map control
* Android map control
* Power BI visual

## road_shaded_relief

**road shaded relief** is an Azure Maps main style completed with contours of the Earth.

![shaded relief map style](./media/supported-map-styles/shaded-relief.png)

**Applicable APIs:**

* [Map tile](https://docs.microsoft.com/rest/api/maps/render/getmaptile)
* Web SDK map control
* Android map control
* Power BI visual

## high_contrast_dark

**high_contrast_dark** is a dark map style with a higher contrast than the other styles.

![high contrast dark map style](./media/supported-map-styles/high-contrast-dark.png)

**Applicable APIs:**

* Web SDK map control
* Power BI visual

## Next steps

Learn about how to set a map style in Azure Maps:

> [!div class="nextstepaction"]
> [Choose a map style](https://docs.microsoft.com/azure/azure-maps/choose-map-style)
