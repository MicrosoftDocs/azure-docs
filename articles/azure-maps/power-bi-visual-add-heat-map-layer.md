---
title: Add a heat map layer to the Azure Maps visual for Power BI | Microsoft Azure Maps
description: In this article, you will learn how to use the heat map layer in the Microsoft Azure Maps visual for Power BI.
author: stevemunk
ms.author: v-munksteve
ms.date: 10/11/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: eriklind
ms.custom: 
---

# Add a heat map layer to the Azure Maps visual for Power BI

In this article you will learn how to add a heat map layer to an Azure Maps visual in Power BI.

Heat maps, also known as density maps, are a type of overlay on a map used to represent the density of data using different colors. Heat maps are often used to show the data “hot spots” on a map. Heat maps are a great way to render datasets with large number of points. If you were to display tens of thousands of points on a map you will likely experience a degradation in performance and due to the large number, the majority, if not all of the map may be covered with overlapping symbols, making the map unusable. Rendering the data as a heat map results not only in better performance, it helps you make better sense of the data by making it easy to see the relative density of each data point.

A heat map is useful when users want to visualize vast comparative data:

- Comparing customer satisfaction rates or shop performance among regions or countries.
- Measuring the frequency which customers visit shopping malls in different locations.
- Visualizing vast statistical and geographical data sets.

## Prerequisites

- An Azure Maps visual in Power BI as described in [Getting started with the Azure Maps visual for Power BI](/power-bi-visual-getting-started.md).
- [Understanding layers in the Azure Maps visual for Power BI](/power-bi-visual-understanding-layers.md).

## Add the heat map layer

To create the Heat map layer, switch the **Heat map** toggle to **On** in the **Format** pane.

:::image type="content" source="media/power-bi-visual/heat-map.png" alt-text="Heat map layer in Azure Maps Visual for Power BI":::

<!--
The heat map format pane provides the flexibility for user to customize and design the heat map visualizations the way they preferred. The format pane allows users to:

- Configure the radius of each data point and users may choose to use pixels or meters as units.
- Customize the opacity and intensity of the heat map layer.  
- Specify if the value in size field should be used as the weight of each data point.
- Pick different colors from color pickers.
- Set the minimum and maximum zoom level for heat map layer to be visible.
- Decide the heat map layer position amongst different layers, e.g., 3D bar chart layer and bubble layer.  

A heat map is useful when users want to visualize vast comparative data:

- Comparing customer satisfaction rates or shop performance among regions or countries.
- Measuring the frequency which customers visit shopping malls in different locations.
- Visualizing vast statistical and geographical data sets.
-->

## Heat map layer settings

The **Heat map** section of the **Format** pane provides flexibility to customize and design the heat map visualizations to meet your specific requirements. The **Heat map** section enables you to:

- Configure the radius of each data point using either pixels or meters as unit of measurement.
- Customize the opacity and intensity of the heat map layer.  
- Specify if the value in size field should be used as the weight of each data point.
- Pick different colors from color pickers.
- Set the minimum and maximum zoom level for heat map layer to be visible.
- Decide the heat map layer position amongst different layers, e.g., 3D bar chart layer and bubble layer.

The following table shows the primary settings that are available in the **Heat map** section of the **Format** pane:

| Setting              | Description      |
|----------------------|------------------|
| Radius | The radius of each data point in the heat map.<br /><br />Valid values when Unit = ‘pixels’: 1 - 200. Default: **20**<br />Valid values when Unit = ‘meters’: 1 - 4,000,000|
| Units  | The distance units of the radius. Possible values are:<br /><br />**pixels**. When set to pixels the size of each data point will always be the same, regardless of zoom level.<br />**meters**. When set to meters, the size of the data points will scale based on zoom level, ensuring the radius is spatially accurate.<br /><br /> Default: **pixels**  |
| Opacity | Sets the opacity of the heat map layer. Default: **1**<br/>Value should be a decimal between 0 and 1. |
| Intensity | The intensity of each heat point. This is a decimal value between 0 and 1. This is used to specify how "hot" a single data point should be. Default: **0.5** |
| Use size as weight | This boolean value determines if the size field value should be used as the weight of each data point. This will cause the layer to render as a weighted heat map. Default: **Off** |
| Gradient |Color pick for users to pick 3 colors for low (0 %), center (50%) and high (100%) gradient colors. |
| Min zoom |Minimum zoom level the layer is visible at. Valid values are 1 to 22. Default: **0** |
|Max zoom |Maximum zoom level the layer is visible at.  Valid values are 1 to 22. Default: **22**|
|Layer position |Specify the position of the layer relative to other map layers. Valid values include **Above labels**, **Below labels** and **Below roads** |
