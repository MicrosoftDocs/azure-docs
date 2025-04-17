---
title: Add a bubble layer to an Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps
description: In this article, you learn how to use the bubble layer in an Azure Maps Power BI visual.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 01/17/2025
ms.topic: how-to
ms.service: azure-maps
ms.subservice: power-bi-visual
---

# Add a bubble layer

The **Bubble layer** renders location data as scaled circles on the map.

:::image type="content" source="./media/power-bi-visual/bubble-layer-no-legend.png" lightbox="./media/power-bi-visual/bubble-layer-no-legend.png"alt-text="A map displaying point data using the bubble layer, all bubbles are blue.":::

Initially all bubbles have the same fill color. If a field is passed into the **Legend** bucket of the **Fields** pane, the bubbles are colored based on their categorization.

:::image type="content" source="./media/power-bi-visual/bubble-layer-with-legend-color.png" lightbox="./media/power-bi-visual/bubble-layer-with-legend-color.png"alt-text="A map displaying point data using the bubble layer, the bubbles are colored based on their categorization with a legend showing what color is associated with which business.":::

The outline of the bubbles is white be default but can be changed to a new color or by enabling the high-contrast outline option. The **High-contrast outline** option dynamically assigns an outline color that is a high-contrast variant of the fill color. This helps to ensure the bubbles are clearly visible regardless of the style of the map. The following are the primary settings in the **Format** pane that are available in the **Bubble layer** section.

| Setting        | Description    |
|----------------|----------------|
| Size           | The size of each bubble. This option is hidden when a field is passed into the **Size** bucket of the **Fields** pane. More options appear as outlined in the [Bubble size scaling](#bubble-size-scaling) section further down in this article. |
| Range scaling | Used to define how the bubble layer scales the bubbles.<br><br>• **Magnitude**: Bubble size scales by magnitude. Negative values are automatically converted to positive values.<br>• **DataRange**: Bubble size scales from min-of-data to max-of-data. There's no anchoring to zero.<br>• **Automatic**: Bubble size scales automatically into one of the two types, as follows:<br>&nbsp;&nbsp;&nbsp;&nbsp;• **Magnitude**: Positive or negative only data.<br>&nbsp;&nbsp;&nbsp;&nbsp;• **DataRange**: data that contains both positive and negative values.<br>• **(Deprecated)**: Applies to reports created prior to the range scaling property, to provide backward-compatibility. It's recommended that you change this to use any one of the three preceding options. |
| Shape          | Transparency. The fill transparency of each bubble. |
| Color          | Fill color of each bubble. This option is hidden when a field is passed into the **Legend** bucket of the **Fields** pane and a separate **Data colors** section appears in the **Format** pane. |
| Border         | Settings for the border include color, width, transparency and blur.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Color specifies the color that outlines the bubble. This option is hidden when the **High-contrast outline** option is enabled.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Width specifies the width of the outline in pixels.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Transparency specifies the transparency of each bubble.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Blur specifies the amount of blur applied to the outline of the bubble. A value of one blurs the bubbles such that only the center point has no transparency. A value of 0 apply any blur effect.|
| Zoom           | Settings for the zoom property include scale, maximum and minimum.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Maximum zoom level tiles are available.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Minimum zoom level tiles are available.     |
| Options        | Settings for the options property include pitch alignment and layer position.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• Pitch alignment specifies how the bubbles look when the map is pitched.<br/>&nbsp;&nbsp;&nbsp;&nbsp;• layer position specifies the position of the layer relative to other map layers.   |

## Bubble size scaling

If a field is passed into the **Size** bucket of the **Fields** pane, the bubbles are scaled relatively to the measure value of each data point. The **Size** option in the **Bubble layer** section of the **Format** pane disappears when a field is passed into the **Size** bucket, as the bubbles have their radius scaled between a min and max value. The following options appear in the **Bubble layer** section of the **Format** pane when a **Size** bucket has a field specified.

| Setting             | Description  |
|---------------------|--------------|
| Min size            | Minimum bubble size when scaling the data.|
| Max size            | Maximum bubble size when scaling the data.|

## Category labels

When the **bubble layer** displays on a map, the **Category labels** settings become active in the **Format visual** pane.

The **Category labels** settings enable you to customize font setting such as font type, size and color as well as the category labels background color and transparency.

:::image type="content" source="./media/power-bi-visual/category-labels-example.png" alt-text="A screenshot showing the category labels on an Azure Maps map in Power BI." lightbox="./media/power-bi-visual/category-labels-example.png":::

## Next steps

Change how your data is displayed on the map:

> [!div class="nextstepaction"]
> [Add a cluster bubble layer](power-bi-visual-cluster-bubbles.md)

> [!div class="nextstepaction"]
> [Add a 3D column layer](power-bi-visual-add-3d-column-layer.md)

Add more context to the map:

> [!div class="nextstepaction"]
> [Add a reference layer](power-bi-visual-add-reference-layer.md)

> [!div class="nextstepaction"]
> [Add a tile layer](power-bi-visual-add-tile-layer.md)

Customize the visual:

> [!div class="nextstepaction"]
> [Tips and tricks for color formatting in Power BI](/power-bi/visuals/service-tips-and-tricks-for-color-formatting)

> [!div class="nextstepaction"]
> [Customize visualization titles, backgrounds, and legends](/power-bi/visuals/power-bi-visualization-customize-title-background-and-legend)
