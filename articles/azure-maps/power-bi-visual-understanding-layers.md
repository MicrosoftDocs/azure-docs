---
title: Layers in an Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps
description: In this article, you will learn about the different layers available in an Azure Maps Power BI visual.
author: eriklindeman
ms.author: eriklind
ms.date: 11/29/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Layers in Azure Maps Power BI visual

There are two types of layers available in an Azure Maps Power BI visual. The first type focuses on rendering data that is passed into the **Fields** pane of the visual and consist of the following layers, let's call these data rendering layers.

:::row:::
    :::column span="":::
        **Bubble layer**

        Renders points as scaled circles on the map.

        ![Bubble layer on map](media/power-bi-visual/bubble-layer-thumb.png)
    :::column-end:::
    :::column span="":::
        **Bar chart layer**

        Renders points as 3D bars on the map.
        
        ![Bar chart layer on map](media/power-bi-visual/bar-chart-layer-thumb.png)
    :::column-end:::
:::row-end:::

The second type of layer connects addition external sources of data to map to provide more context and consists of the following layers.

:::row:::
    :::column span="":::
        **Reference layer**

        Overlay an uploaded GeoJSON file on top of the map.

        ![Reference layer on map](media/power-bi-visual/reference-layer-thumb.png)
    :::column-end:::
    :::column span="":::
        **Tile layer**

        Overlay a custom tile layer on top of the map.
        
        ![Tile layer on map](media/power-bi-visual/tile-layer-thumb.png)
    :::column-end:::
    :::column span="":::
        **Traffic layer**

        Overlay real-time traffic information on the map.
        
        ![Traffic layer on map](media/power-bi-visual/traffic-layer-thumb.png)
    :::column-end:::
:::row-end:::

All the data rendering layers, as well as the **Tile layer**, have options for min and max zoom levels that are used to specify a zoom level range these layers should be displayed at. This allows one type of rendering layer to be used at one zoom level and a transition to another rendering layer at another zoom level.

These layers also have an option to be positioned relative to other layers in the map. When multiple data rendering layers are used, the order in which they are added to the map determines their relative layering order when they have the same **Layer position** value.

## General layer settings

The general layer section of the **Format** pane are common settings that apply to the layers that are connected to the Power BI dataset in the **Fields** pane (Bubble layer, Bar chart).

| Setting     | Description   |
|-------------|---------------|
| Unselected transparency | The transparency of shapes that are not selected, when one or more shapes are selected.  |
| Show zeros              | Specifies if points that have a size value of zero should be shown on the map using the minimum radius. |
| Show negatives          | Specifies if absolute value of negative size values should be plotted.   |
| Min data value          | The minimum value of the input data to scale against. Good for clipping outliers.  |
| Max data value          | The maximum value of the input data to scale against. Good for clipping outliers.  |

## Next steps

Change how your data is displayed on the map:

> [!div class="nextstepaction"]
> [Add a bubble layer](power-bi-visual-add-bubble-layer.md)

> [!div class="nextstepaction"]
> [Add a bar chart layer](power-bi-visual-add-bar-chart-layer.md)

Add more context to the map:

> [!div class="nextstepaction"]
> [Add a reference layer](power-bi-visual-add-reference-layer.md)

> [!div class="nextstepaction"]
> [Add a tile layer](power-bi-visual-add-tile-layer.md)

> [!div class="nextstepaction"]
> [Show real-time traffic](power-bi-visual-show-real-time-traffic.md)
