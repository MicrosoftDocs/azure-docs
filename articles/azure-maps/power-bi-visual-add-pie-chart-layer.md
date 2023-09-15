---
title: Add a pie chart layer to an Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps
description: This article describes how to use the pie chart layer in an Azure Maps Power BI visual.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 07/17/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Add a pie chart layer

This article describes how to add a pie chart layer to an Azure Maps Power BI visual.

A pie chart is a visual representation of data in the form of a circular chart or *pie* where each slice represents an element of the dataset that is shown as a percentage of the whole. A list of numerical variables along with categorical (location) variables are required to represent data in the form of a pie chart.

:::image type="content" source="./media/power-bi-visual/pie-chart-layer.png" alt-text="A Power B I visual showing the pie chart layer.":::

> [!NOTE]
> The data used in this article comes from the [Power BI Sales and Marketing Sample].

## Prerequisites

- [Get started with Azure Maps Power BI visual].
- Understand [Layers in the Azure Maps Power BI visual].

## Add the pie chart layer

The pie chart layer is added automatically based on what fields in the **Visualizations** pane have values, these fields include location, size and legend.

:::image type="content" source="./media/power-bi-visual/visualizations-settings-pie-chart.png" alt-text="A screenshot showing the fields required for the pie chart layer Power B I.":::

The following steps walk you through creating a pie chart layer.

1. Select two location sources from the **Fields** pane, such as city/state, to add to the **Location** field.
1. Select a numerical field from your table, such as sales, and add it to the **Size** field in the **Visualizations** pane. This field must contain the numerical values used in the pie chart.
1. Select a data field from your table that can be used as the category that the numerical field applies to, such as *manufacturer*, and add it to the **Legend** field in the **Visualizations** pane. This appears as the slices of the pie, the size of each slice is a percentage of the whole based on the value in the size field, such as the number of sales broken out by manufacturer.
1. Next, in the **Format** tab of the **Visualizations** pane, switch the **Bubbles** toggle to **On**.

The pie chart layer should now appear. Next you can adjust the Pie chart settings such as size and transparency.

## Pie chart layer settings

Pie Chart layer is an extension of the bubbles layer, so all settings are made in the **Bubbles** section. If a field is passed into the **Legend** bucket of the **Fields** pane, the pie charts are populated and colored based on their categorization. The outline of the pie chart is white by default but can be changed to a new color. The following are the settings in the **Format** tab of the **Visualizations** pane that are available to a **Pie Chart layer**.

:::image type="content" source="./media/power-bi-visual/visualizations-settings-bubbles.png" alt-text="A screenshot showing the pie chart settings that appear in the bubbles section when the format tab is selected in the visualization pane in power B I.":::

| Setting               | Description                                                       |
|-----------------------|-------------------------------------------------------------------|
| Size                  | The size of each bubble.                                          |
| Fill transparency     | Transparency of each pie chart.                                   |
| Outline color         | Color that outlines the pie chart.                                |
| Outline transparency  | Transparency of the outline.                                      |
| Outline width         | Width of the outline in pixels.                                   |
| Min zoom              | Minimum zoom level tiles are available.                           |
| Max zoom              | Maximum zoom level tiles are available.                           |
| Layer position        | Specifies the position of the layer relative to other map layers. |

## Next steps

Change how your data is displayed on the map:

> [!div class="nextstepaction"]
> [Add a 3D column layer]

> [!div class="nextstepaction"]
> [Add a heat map layer]

[Power BI Sales and Marketing Sample]: /power-bi/create-reports/sample-datasets#download-original-sample-power-bi-files
[Get started with Azure Maps Power BI visual]: power-bi-visual-get-started.md
[Layers in the Azure Maps Power BI visual]: power-bi-visual-understanding-layers.md
[Add a 3D column layer]: power-bi-visual-add-3d-column-layer.md
[Add a heat map layer]: power-bi-visual-add-heat-map-layer.md
