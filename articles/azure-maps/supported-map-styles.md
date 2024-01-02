---
title: Supported built-in Azure Maps map styles
description: Learn about the built-in map styles that Azure Maps supports, such as road, blank_accessible, satellite, satellite_road_labels, road_shaded_relief, and night.
author: eriklindeman
ms.author: eriklind
ms.date: 11/01/2023
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps

---

# Azure Maps supported built-in map styles

Azure Maps supports several different built-in map styles as described in this article.

## road

A **road** map is a standard map that displays roads. It also displays natural and artificial features, and the labels for those features.

:::image type="content" source="./media/supported-map-styles/road.png" lightbox="./media/supported-map-styles/road.png" alt-text="A screenshot of map using the road style.":::

**Applicable APIs:**

* [Get Map Static Image]
* [Get Map Tile]
* [Web SDK map control]
* [Android map control]
* [Power BI visual]

## blank and blank_accessible

The **blank** and **blank_accessible** map styles provide a blank canvas for visualizing data. The **blank_accessible** style continues to provide screen reader updates with map's location details, even though the base map isn't displayed.

> [!NOTE]
> In the Web SDK, you can change the background color of the map by setting the CSS `background-color` style of map DIV element.

**Applicable APIs:**

* [Web SDK map control]

## satellite

The **satellite** style is a combination of satellite and aerial imagery.

:::image type="content" source="./media/supported-map-styles/satellite.png" lightbox="./media/supported-map-styles/satellite.png" alt-text="A screenshot of map using the satellite style.":::

**Applicable APIs:**

* [Get Map Tile]
* [Web SDK map control]
* [Android map control]
* [Power BI visual]

## satellite_road_labels

This map style is a hybrid of roads and labels overlaid on top of satellite and aerial imagery.

:::image type="content" source="./media/supported-map-styles/satellite-road-labels.png" lightbox="./media/supported-map-styles/satellite-road-labels.png" alt-text="A screenshot of map using the satellite-road-labels style.":::

**Applicable APIs:**

* [Web SDK map control]
* [Android map control]
* [Power BI visual]

## grayscale_dark

**grayscale dark** is a dark version of the road map style.

:::image type="content" source="./media/supported-map-styles/grayscale-dark.png" lightbox="./media/supported-map-styles/grayscale-dark.png" alt-text="A screenshot of map using the grayscale-dark style.":::

**Applicable APIs:**

* [Get Map Static Image]
* [Get Map Tile]
* [Web SDK map control]
* [Android map control]
* [Power BI visual]

## grayscale_light

**grayscale light** is a light version of the road map style.

:::image type="content" source="./media/supported-map-styles/grayscale-light.jpg" lightbox="./media/supported-map-styles/grayscale-light.jpg" alt-text="A screenshot of map using the grayscale light style.":::

**Applicable APIs:**

* [Web SDK map control]
* [Android map control]
* [Power BI visual]

## night

**night** is a dark version of the road map style with colored roads and symbols.

:::image type="content" source="./media/supported-map-styles/night.png" lightbox="./media/supported-map-styles/night.png" alt-text="A screenshot of map using the night style.":::

**Applicable APIs:**

* [Web SDK map control]
* [Android map control]
* [Power BI visual]

## road_shaded_relief

**road shaded relief** is an Azure Maps main style completed with contours of the Earth.

:::image type="content" source="./media/supported-map-styles/shaded-relief.png" lightbox="./media/supported-map-styles/shaded-relief.png" alt-text="A screenshot of map using the shaded relief map style.":::

**Applicable APIs:**

* [Get Map Tile]
* [Web SDK map control]
* [Android map control]
* [Power BI visual]

## high_contrast_dark

**high_contrast_dark** is a dark map style with a higher contrast than the other styles.

:::image type="content" source="./media/supported-map-styles/high-contrast-dark.png" lightbox="./media/supported-map-styles/high-contrast-dark.png" alt-text="A screenshot of map using the high contrast dark map style.":::

**Applicable APIs:**

* [Web SDK map control]
* [Android map control]
* [Power BI visual]

## high_contrast_light

**high_contrast_light** is a light map style with a higher contrast than the other styles.

:::image type="content" source="./media/supported-map-styles/high-contrast-light.jpg" lightbox="./media/supported-map-styles/high-contrast-light.jpg" alt-text="A screenshot of map using the high contrast light map style.":::

**Applicable APIs:**

* [Web SDK map control]
* [Android map control]
* [Power BI visual]

## Map style accessibility

The interactive Azure Maps map controls use vector tiles in the map styles to power the screen reader to describe the area the map is displaying. Several map styles are also designed to be fully accessible when it comes to color contrast. The following table provides details on the accessibility features supported by each map style.

| Map style  | Color contrast | Screen reader | Notes |
|------------|----------------|---------------|-------|
| `blank` | N/A | No | A blank canvas useful for developers who want to use their own tiles as the base map, or want to view their data without any background. The screen reader doesn't rely on the vector tiles for descriptions.  |
| `blank_accessible` | N/A  | Yes | This map style continues to load the vector tiles used to render the map, but makes that data transparent. This way the data still loads, and can be used to power the screen reader. |
| `grayscale_dark` | Partial | Yes | Primarily designed for business intelligence scenarios. Also useful for overlaying colorful layers such as weather radar imagery. |
| `grayscale_light` | Partial | Yes | This map style is primarily designed for business intelligence scenarios. |
| `high_contrast_dark` | Yes | Yes | Fully accessible map style for users in high contrast mode with a dark setting. When the map loads, high contrast settings are automatically detected. |
| `high_contrast_light` | Yes | Yes | Fully accessible map style for users in high contrast mode with a light setting. When the map loads, high contrast settings are automatically detected. |
| `night` | Partial | Yes | This style is designed for when the user is in low light conditions and you don’t want to overwhelm their senses with a bright map. |
| `road` | Partial | Yes | The main colorful road map style in Azure Maps. Due to the number of different colors and possible overlapping color combinations, it's nearly impossible to make it 100% accessible. That said, this map style goes through regular accessibility testing and is improved as needed to make labels clearer to read. |
| `road_shaded_relief` | Partial | Yes | Similar to the main road map style, but has an added tile layer in the background that adds shaded relief of mountains and land cover coloring when zoomed out. |
| `satellite` | N/A | Yes | Purely satellite and aerial imagery, no labels, or road lines. The vector tiles are loaded behind the scenes to power the screen reader and to make for a smoother transition when switching to `satellite_with_roads`. |
| `satellite_with_roads` | No | Yes | Satellite and aerial imagery, with labels and road lines overlaid. On a global scale, there's an unlimited number of color combinations that might occur between the overlaid data and the imagery. A focus on making labels readable in most common scenarios, however, in some places the color contrast with the background imagery might make labels difficult to read. |

## Next steps

Learn about how to set a map style in Azure Maps:

> [!div class="nextstepaction"]
> [Choose a map style]

[Android map control]: how-to-use-android-map-control-library.md
[Choose a map style]: choose-map-style.md
[Get Map Static Image]: /rest/api/maps/render-v2/get-map-static-image
[Get Map Tile]: /rest/api/maps/render-v2/get-map-tile
[Power BI visual]: power-bi-visual-get-started.md
[Web SDK map control]: how-to-use-map-control.md
