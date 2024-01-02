---
title: Add a 3D column layer to an Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps
description: This article demonstrates how to use the 3D column layer in an Azure Maps Power BI visual.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 09/15/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Add a 3D column layer

The **3D column layer** is useful for taking data to the next dimension by allowing visualization of location data as 3D cylinders on the map. Similar to the bubble layer, the 3D column chart can easily visualize two metrics at the same time using color and relative height. In order for the columns to have height, a measure needs to be added to the **Size** bucket of the **Fields** pane. If a measure isn't provided, columns with no height show as flat squares or circles depending on the **Shape** option.

:::image type="content" source="./media/power-bi-visual/3d-column-layer-styled.png" alt-text="A map displaying point data using the 3D column layer." lightbox="./media/power-bi-visual/3d-column-layer-styled.png":::

Users can tilt and rotate the map to view your data from different perspectives. The map can be tilted or pitched using one of the following methods.

- Turn on the **Navigation controls** option in the **Map settings** of the **Format** pane to add a button that tilts the map.
- Hold down the right mouse button and drag the mouse up or down.
- Using a touch screen, touch the map with two fingers and drag them up or down together.
- With the map focused, hold the **Shift** key, and press the **Up** or **Down arrow** keys.

The map can be rotated using one of the following methods.

- Turn on the **Navigation controls** option in the **Map settings** of the **Format** pane to add a button that rotates the map.
- Hold down the right mouse button and drag the mouse left or right.
- Using a touch screen, touch the map with two fingers and rotate.
- With the map focused, hold the **Shift** key, and press the **Left** or **Right arrow** keys.

The following are all settings in the **Format** pane that are available in the **3D column layer** section.

| Setting              | Description      |
|----------------------|------------------|
| Column shape         | The shape of the 3D column.<br><br>&nbsp;&nbsp;&nbsp;&nbsp;• Box – columns rendered as rectangular boxes.<br>&nbsp;&nbsp;&nbsp;&nbsp;• Cylinder – columns rendered as cylinders. |
| Height               | The height of each column. If a field is passed into the **Size** bucket of the **Fields** pane, columns are scaled relative to this height value. |
| Scale height on zoom | Specifies if the height of the columns should scale relative to the zoom level. |
| Width                | The width of each column.  |
| Scale width on zoom  | Specifies if the width of the columns should scale relative to the zoom level.  |
| Fill color           | Color of each column. This option is hidden when a field is passed into the **Legend** bucket of the **Fields** pane and a separate **Data colors** section appears in the **Format** pane. |
| Transparency         | Transparency of each column. |
| Min zoom             | Minimum zoom level tiles are available. |
| Max zoom             | Maximum zoom level tiles are available. |
| Layer position       | Specifies the position of the layer relative to other map layers. |

> [!NOTE]
> If the columns have a small width value and the **Scale width on zoom** option is disabled, they may disappear when zoomed out a lot as their rendered width would be less than a pixel in size. However, when the **Scale width on zoom** option is enabled, additional calculations are performed when the zoom level changes which can impact performance of large data sets.

## Next steps

Change how your data is displayed on the map:

> [!div class="nextstepaction"]
> [Add a bubble layer](power-bi-visual-add-bubble-layer.md)

> [!div class="nextstepaction"]
> [Add a heat map layer](power-bi-visual-add-heat-map-layer.md)

Add more context to the map:

> [!div class="nextstepaction"]
> [Add a reference layer](power-bi-visual-add-reference-layer.md)

> [!div class="nextstepaction"]
> [Add a tile layer](power-bi-visual-add-tile-layer.md)

> [!div class="nextstepaction"]
> [Show real-time traffic](power-bi-visual-show-real-time-traffic.md)

Customize the visual:

> [!div class="nextstepaction"]
> [Tips and tricks for color formatting in Power BI](/power-bi/visuals/service-tips-and-tricks-for-color-formatting)

> [!div class="nextstepaction"]
> [Customize visualization titles, backgrounds, and legends](/power-bi/visuals/power-bi-visualization-customize-title-background-and-legend)
