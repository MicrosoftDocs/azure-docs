---
title: Add a bubble layer to an Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps
description: In this article, you'll learn how to use the bubble layer in an Azure Maps Power BI visual.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 11/14/2022
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Add a bubble layer

The **Bubble layer** renders location data as scaled circles on the map.

:::image type="content" source="./media/power-bi-visual/bubble-layer-with-legend-color.png" alt-text="A map displaying point data using the bubble layer":::

Initially all bubbles have the same fill color. If a field is passed into the **Legend** bucket of the **Fields** pane, the bubbles will be colored based on their categorization. The outline of the bubbles is white be default but can be changed to a new color or by enabling the high-contrast outline option. The **High-contrast outline** option dynamically assigns an outline color that is a high-contrast variant of the fill color. This helps to ensure the bubbles are clearly visible regardless of the style of the map. The following are the primary settings in the **Format** pane that are available in the **Bubble layer** section.

| Setting        | Description    |
|----------------|----------------|
| Size           | The size of each bubble. This option is hidden when a field is passed into the **Size** bucket of the **Fields** pane. More options will appear as outlined in the [Bubble size scaling](#bubble-size-scaling) section further down in this article. |
| Shape          | Transparency. The fill transparency of each bubble. |
| Color          | Fill color of each bubble. This option is hidden when a field is passed into the **Legend** bucket of the **Fields** pane and a separate **Data colors** section will appear in the **Format** pane. |
| Border         | Settings for the border include color, width, transparency and blur.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Color specifies the color that outlines the bubble. This option is hidden when the **High-contrast outline** option is enabled.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Width specifies the width of the outline in pixels.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Transparency specifies the transparency of each bubble.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Blur specifies the amount of blur applied to the outline of the bubble. A value of one blurs the bubbles such that only the center point has no transparency. A value of 0 apply any blur effect.|
| Zoom           | Settings for the zoom property include scale, maximum and minimum.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Zoom scale is the amount the bubbles should scale relative to the zoom level. A zoom scale of one means no scaling. Large values will make bubbles smaller when zoomed out and larger when zoomed in. This helps to reduce the clutter on the map when zoomed out, yet ensures points stand out more when zoomed in. A value of 1 doesn't apply any scaling.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Maximum zoom level tiles are available.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Minimum zoom level tiles are available.     |
| Options        | Settings for the options property include pitch alignment and layer position.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Pitch alignment specifies how the bubbles look when the map is pitched.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• layer position specifies the position of the layer relative to other map layers.   |

## Bubble size scaling

If a field is passed into the **Size** bucket of the **Fields** pane, the bubbles will be scaled relatively to the measure value of each data point. The **Size** option in the **Bubble layer** section of the **Format** pane will disappear when a field is passed into the **Size** bucket, as the bubbles will have their radii scaled between a min and max value. The following options will appear in the **Bubble layer** section of the **Format** pane when a **Size** bucket has a field specified.

| Setting             | Description  |
|---------------------|--------------|
| Min size            | Minimum bubble size when scaling the data.|
| Max size            | Maximum bubble size when scaling the data.|
| Size scaling method | Scaling algorithm used to determine relative bubble size.<br/><br/>&nbsp;• Linear: Range of input data linearly mapped to the min and max size. (default)<br/>&nbsp;• Log: Range of input data logarithmically mapped to the min and max size.<br/>&nbsp;• Cubic-Bezier: Specify X1, Y1, X2, Y2 values of a Cubic-Bezier curve to create a custom scaling method. |

When the **Size scaling method** is set to **Log**, the following options will be made available.

| Setting   | Description      |
|-----------|------------------|
| Log scale | The logarithmic scale to apply when calculating the size of the bubbles. |

When the **Size scaling method** is set to **Cubic-Bezier**, the following options will be made available to customize the scaling curve.

| Setting | Description                           |
|---------|---------------------------------------|
| X1      | X1 parameter of a cubic Bezier curve. |
| Y1      | X2 parameter of a cubic Bezier curve. |
| X2      | Y1 parameter of a cubic Bezier curve. |
| Y2      | Y2 parameter of a cubic Bezier curve. |

> [!TIP]
> [https://cubic-bezier.com/](https://cubic-bezier.com/) has a handy tool for creating the parameters for Cubic-Bezier curves.

## Category labels

When displaying a **bubble layer** map, the **Category labels** settings will become active in the **Format visual** pane.

:::image type="content" source="./media/power-bi-visual/category-labels.png" alt-text="A screenshot showing the category labels settings in the format visual section of Power BI." lightbox="./media/power-bi-visual/category-labels.png":::

The **Category labels** settings enable you to customize font setting such as font type, size and color as well as the category labels background color and transparency.

:::image type="content" source="./media/power-bi-visual/category-labels-example.png" alt-text="A screenshot showing the category labels on an Azure Maps map in Power BI." lightbox="./media/power-bi-visual/category-labels-example.png":::

## Next steps

Change how your data is displayed on the map:

> [!div class="nextstepaction"]
> [Add a 3D column layer](power-bi-visual-add-3d-column-layer.md)

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
