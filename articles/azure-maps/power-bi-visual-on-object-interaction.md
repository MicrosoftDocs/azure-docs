---
title: Contextual on-object interaction with Azure Maps Power BI visuals
titleSuffix: Azure Maps
description: How to format elements by selecting the element directly on the map to bring up the available formatting options.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 03/13/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Contextual on-object interaction with Azure Maps Power BI visual (preview)

The Azure Maps Power BI Visual now features on-object interaction, an
intuitive and efficient way to update the formatting of any element on the map.
With on-object interaction, you can interact with the Azure Maps Power BI
Visual like you interact with other Microsoft products or web applications.

## Use on-object interaction in your Power BI Visual

On-object interaction can be used to edit chart titles, legends, bubble
layers, Map style and Map controls.

### Formatting objects on the map

A context sensitive menu appears when you right-click an object in the map,
with formatting options for that object, which eliminates the need to search for
the correct setting in the **Format** pane.

To exit edit mode, select the **Esc** key or select anywhere on
the canvas outside of the Azure Maps Visual.

:::image type="content" source="./media/power-bi-visual/on-object-interaction/format-menu.png" alt-text="A screenshot showing the format option in a context menu in Power BI." lightbox="./media/power-bi-visual/on-object-interaction/format-menu.png":::

### Edit a chart tile or legend

To edit chart tile or legend, you can right-click on the text to edit
title or font style/size.

:::image type="content" source="./media/power-bi-visual/on-object-interaction/legend-title.png" alt-text="A screenshot showing in-place formatting of a chart or legend title in Power BI." lightbox="./media/power-bi-visual/on-object-interaction/legend-title.png":::

### The format pane

While you're using on-object interaction, the format pane is expanded, and the corresponding card appears to enable a review of the completed settings.

:::image type="content" source="./media/power-bi-visual/on-object-interaction/format-pane-expanded.png" alt-text="A screenshot showing in-place formatting of a chart or legend title with the format pane expanded in Power BI." lightbox="./media/power-bi-visual/on-object-interaction/format-pane-expanded.png":::

You may also use on-object interaction on the bubble layer. By selecting
bubbles, you can set bubble layer's position or its formatting such as
size or color.

:::image type="content" source="./media/power-bi-visual/on-object-interaction/bubble-layer.png" alt-text="A screenshot showing in-place formatting in the bubble layer." lightbox="./media/power-bi-visual/on-object-interaction/bubble-layer.png":::

### Select Map styles

You can also select the map background to bring up a context menu showing all available map styles such as road, satellite, hybrid etc.

:::image type="content" source="./media/power-bi-visual/on-object-interaction/map-style-menu.png" alt-text="A screenshot showing the map style popup menu.":::

On-object interaction applies to the Map control as well.

:::image type="content" source="./media/power-bi-visual/on-object-interaction/map-control.png" alt-text="A screenshot showing the map control.":::

The on-object interaction feature available in Azure Maps Visual is a
user-friendly and innovative method for adjusting map settings.
Additionally, other Power BI Visuals also offer on-object interaction
capabilities, providing users with efficient tools to personalize their
Power BI reports.

## Next steps

Change how your data is displayed on the map:

> [!div class="nextstepaction"]
> [Add a bubble layer](power-bi-visual-add-bubble-layer.md)
