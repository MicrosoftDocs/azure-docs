---
title: Add a cluster bubble layer to an Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps
description: In this article, you learn how to use the cluster bubble layer in an Azure Maps Power BI visual.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 02/27/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Add a cluster bubble layer

Cluster bubble layers enable you to use enhanced data aggregation capabilities based on different zoom levels. Cluster bubble layers are designed to optimize the visualization and analysis of data by allowing dynamic adjustments to granularity as users zoom in or out on the map.

:::image type="content" source="./media/power-bi-visual/cluster-bubble-layer.png" lightbox="./media/power-bi-visual/cluster-bubble-layer.png" alt-text="A screenshot showing an Azure Maps Power BI visual with a cluster bubble layer.":::

Azure Maps Power BI visual offers a range of configuration options to provide flexibility when customizing the appearance of cluster bubbles. With parameters like cluster bubble size, color, text size, text color, border color, and border width, you can tailor the visual representation of clustered data to align with your reporting needs.

:::image type="content" source="./media/power-bi-visual/visualizations-settings-cluster-bubbles.png" alt-text="A screenshot showing the format visual options for a cluster bubble layer.":::

| Setting       | Description                                       | Values  |
|---------------|---------------------------------------------------|---------|
| Bubble Size   | The size of each cluster bubble. Default: 12 px   | 1-50 px |
| Cluster Color | Fill color of each cluster bubble.                |         |
| Text Size     | The size of the number indicating the quantity of clustered bubbles. Default: 18 px.| 1-60 px|
| Text Color    | Text color of the number displayed in the cluster bubbles.| |
| Border Color  | The color of the bubbles outline.                 |         |
| Border Width  | The width of the border in pixels. Default: 2 px  | 1-20 px |

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
