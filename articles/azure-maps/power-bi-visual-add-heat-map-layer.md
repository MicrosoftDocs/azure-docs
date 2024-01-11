---
title: Add a heat map layer to an Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps Power BI visual
description: This article describes how to use the heat map layer in an Azure Maps Power BI visual.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 09/15/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Add a heat map layer

This article describes how to add a heat map layer to an Azure Maps Power BI visual.

:::image type="content" source="media/power-bi-visual/heat-map.png" alt-text="Heat map layer in an Azure Maps Power BI visual." lightbox="media/power-bi-visual/heat-map.png" :::

Heat maps, also known as density maps, are a type of overlay on a map used to represent the density of data using different colors. Heat maps are often used to show the data "hot spots" on a map. Heat maps are a great way to render datasets with large number of points. Displaying a large number of data points on a map results in a degradation in performance and can cover it with overlapping symbols, making it unusable. Rendering the data as a heat map results not only in better performance, it helps you make better sense of the data by making it easy to see the relative density of each data point.

A heat map is useful when users want to visualize vast comparative data:

- Comparing customer satisfaction rates or shop performance among countries/regions.
- Measuring the frequency which customers visit shopping malls in different locations.
- Visualizing vast statistical and geographical data sets.

## Prerequisites

- [Get started with Azure Maps Power BI visual].
- Understand [layers in the Azure Maps Power BI visual].

## Add the heat map layer

1. In Power BI Desktop, select the Azure map that you created.
1. In the **Format** pane, switch the **Heat map** toggle to **On**.

Now you can adjust all the Heat map layer settings to suit your report.

## Heat map layer settings

The **Heat map** section of the **Format** pane provides flexibility to customize and design the heat map visualizations to meet your specific requirements. The **Heat map** section enables you to:

- Configure the radius of each data point using either pixels or meters as unit of measurement.
- Customize the opacity and intensity of the heat map layer.  
- Specify if the value in size field should be used as the weight of each data point.
- Pick different colors from color pickers.
- Set the minimum and maximum zoom level for heat map layer to be visible.
- Decide the heat map layer position amongst different layers, such as the 3D column and bubble layer.

The following table shows the primary settings that are available in the **Heat map** section of the **Format** pane:

| Setting              | Description      |
|----------------------|------------------|
| Size | The radius of each data point in the heat map.<br><br>Valid values when Unit = ‘pixels’: 1 - 200. Default: **20**<br>Valid values when Unit = ‘meters’: 1 - 4,000,000|

| Setting              | Description      |
|----------------------|------------------|
| Radius | The radius of each data point in the heat map.<br><br>Valid values when Unit = ‘pixels’: 1 - 200. Default: **20**<br>Valid values when Unit = ‘meters’: 1 - 4,000,000|
| Units  | The distance units of the radius. Possible values are:<br><br>**pixels**. When set to pixels the size of each data point is the same, regardless of zoom level.<br>**meters**. When set to meters, the size of the data points scale based on zoom level based on the equivalent pixel distance at the equator, providing better relativity between neighboring points. However, due to the Mercator projection, the actual radius of coverage in meters at a given latitude are smaller than this specified radius.<br><br> Default: **pixels**  |
| Transparency | Sets the Transparency of the heat map layer. Default: **1**<br>Value should be from 0% to 100%. |
| Intensity | The intensity of each heat point. Intensity is a decimal value between 0 and 1, used to specify how "hot" a single data point should be. Default: **0.5** |
| Use size as weight | A boolean value that determines if the size field value should be used as the weight of each data point. When `On`, the layer renders as a weighted heat map. Default: `Off` |
| Gradient |A color picker for users to pick three colors for low (0%), center (50%) and high (100%) gradient colors. |
| Min zoom |Minimum zoom level the layer is visible at. Valid values are 1 to 22. Default: **0** |
|Max zoom |Maximum zoom level the layer is visible at.  Valid values are 1 to 22. Default: **22**|
|Layer position |Specify the position of the layer relative to other map layers. Valid values include **Above labels**, **Below labels** and **Below roads** |

## Next steps

Change how your data is displayed on the map:

> [!div class="nextstepaction"]
> [Add a 3D column layer]

Add more context to the map:

> [!div class="nextstepaction"]
> [Add a reference layer]

> [!div class="nextstepaction"]
> [Add a tile layer]

> [!div class="nextstepaction"]
> [Show real-time traffic]

Customize the visual:

> [!div class="nextstepaction"]
> [Tips and tricks for color formatting in Power BI]

> [!div class="nextstepaction"]
> [Customize visualization titles, backgrounds, and legends]

[Add a 3D column layer]: power-bi-visual-add-3d-column-layer.md
[Add a reference layer]: power-bi-visual-add-reference-layer.md
[Add a tile layer]: power-bi-visual-add-tile-layer.md
[Customize visualization titles, backgrounds, and legends]: /power-bi/visuals/power-bi-visualization-customize-title-background-and-legend
[Get started with Azure Maps Power BI visual]: power-bi-visual-get-started.md
[layers in the Azure Maps Power BI visual]: power-bi-visual-understanding-layers.md
[Show real-time traffic]: power-bi-visual-show-real-time-traffic.md
[Tips and tricks for color formatting in Power BI]: /power-bi/visuals/service-tips-and-tricks-for-color-formatting
