---
title: Filled map in Azure Maps Power BI Visual
titleSuffix: Microsoft Azure Maps
description: In this article, you'll learn about the Filled map feature in Azure Maps Power BI Visual.
author: eriklindeman
ms.author: eriklind
ms.date: 04/11/2022
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Filled map in Azure Maps Power BI Visual (Preview)

Filled maps use varying degrees of shading, tinting or different patterns to provide a visual display that quickly shows differences in values across a geography or region. Showing these relative differences with shading that ranges from light (less-frequent/lower) to dark (more-frequent/more) is a useful way to quickly convey pertinent information to viewers.

<!--
![A screenshot showing a map of America with states colored in teal with varying degrees of shading depending on the amount of sales attained in each state.](media/power-bi-visual/filled-map-us-teal.png)
-->

:::image type="content" source="media/power-bi-visual/filled-map-us-teal.png" lightbox="media/power-bi-visual/filled-map-us-teal.png" alt-text="A screenshot showing a map of America with states colored in varying degrees depending on the amount of sales attained in each.":::

The image above shows an example of a filled map. The map of America shows each state with a different shade that represents the sales by state. A viewer can immediately see that California has the most sales followed by Texas, then Florida.

## When to use a filled map

Filled maps can be a great choice:

* To display quantitative information on a map.
* To show spatial patterns and relationships.
* When your data is standardized.
* When working with socioeconomic data.
* When defined regions are important.
* To get an overview of the distribution across geographic locations.

Some common uses for filled maps include:

* Visualize sales or revenue results by country or state.
* Visualize election results where the color represents the party that won and the shading represent the margin of victory.
* Visualize unemployment rates  by region, state or county.

## Prerequisites

This article uses [Sales and Marketing Sample PBIX](https://download.microsoft.com/download/9/7/6/9767913A-29DB-40CF-8944-9AC2BC940C53/Sales%20and%20Marketing%20Sample%20PBIX.pbix) as the data source for demonstration purposes. You can create a new report using this data before continuing if you wish to follow along.

## Filled map settings

There are two places where you can adjust filled maps settings: Build and format visuals. Both are located in the **Visualizations** pane.

### Build visuals

| Setting Name | Description                                                         | Setting values                                                      |
|--------------|---------------------------------------------------------------------|---------------------------------------------------------------------|
| Shape        | Configure fill transparency in a geometry on the map                | 0-100%                                                              |
| Colors       | Use meters or pixels as unit to visualize the data. Default: Pixels | Set colors for different data category or gradient for numeric data.|
| Border       | Sets the border color, width and transparency                       | Color picker<BR>Width 1-10 pixels<BR>Transparency 0-100%            |
| Min zoom     | Minimum zoom level the layer is visible at. Default: 0              | Integer (0 - 22)                                                    |
| Max zoom     | Maximum zoom level the layer is visible at. Default: 22             | Integer (0 - 22)                                                    |
| Options      | Specify the position of the layer relative to other map layers      | Drop down menu:<BR>Above labels<BR>Below labels<BR>Below roads      |

> [!TIP]
> You can use **Conditional formatting** in the **Colors** setting to set the field that your map is based on, as demonstrated in the [Create a filled map](#create-a-filled-map) section below.

### Format visuals

| Bucket               | Description                                                                                     |
|----------------------|-------------------------------------------------------------------------------------------------|
| Location             | Geospatial area with a boundary, such as country, state, city, county or postal code. Street and address aren't supported in filled map. |
| Legend               | Categorical data that will be used to shade the map.                                            |
| Tool Tips (optional) | Determined the data/columns that would be shown in tool tips                                    |

## Create a filled map

1. From the **Fields** pane, select the **Geo > State** field. Notice that it populates the **Location** field in the **Visualizations** pane.
    <!--
    ![A screenshot showing the selection of the state field from the geo table.](media/power-bi-visual/filled-map-geo-state.png)
    -->

    :::image type="content" source="media/power-bi-visual/filled-map-geo-state.png" alt-text="A screenshot showing the selection of the state field from the geo table.":::

1. Select **Sales $** from the **SalesFact** table and drag it to the **Tooltips** field in the **Visualizations** pane.

1. In the **Visualizations** pane, select **Format your visual**

1. Set **Filled map** to **On**
    <!--
    ![A screenshot showing the filled maps option in the visualizations pane in the Format your visual view.](media/power-bi-visual/filled-map-visualization-setting.png)
    -->

    :::image type="content" source="media/power-bi-visual/filled-map-visualization-setting.png" alt-text="A screenshot showing the filled maps option in the visualizations pane in the Format your visual view.":::

1. Select **Filled maps** to expand that section then select **Colors**.

1. Select **Conditional formatting**.
    <!--
    ![A screenshot showing the Conditional formatting button in the colors section.](media/power-bi-visual/filled-map-conditional-formatting.png)
    -->

    :::image type="content" source="media/power-bi-visual/filled-map-conditional-formatting.png" alt-text="A screenshot showing the Conditional formatting button in the colors section.":::

1. The **Default color - Filled map** dialog should appear, select the **What field should we base this on?** Drop down, then select **Sales $** from the **SalesFact** table.
    <!--
    ![A screenshot showing Default color - Filled map dialog box with sales selected from the What field should we base this on? Drop down.](media/power-bi-visual/filled-map-sales.png)
    -->

    :::image type="content" source="media/power-bi-visual/filled-map-sales.png" lightbox="media/power-bi-visual/filled-map-sales.png" alt-text="A screenshot showing Default color - Filled map dialog box with sales selected from the What field should we base this on? Drop down.":::

1. Set the **Minimum** color to white then select the **OK** button.

    > The map should appear with varying degrees of shading depicting the relative sales. Since this data only includes numbers for the continental United States, you can filter out Alaska if you wish.

1. Filter the map to display only the continental United States.

    a. To the left of the "Visualizations" pane, look for the "Filters" pane. Expand it if it's minimized.

    b. Hover over **State** and select the expand chevron.

    c. Place a check mark next to **Select all** and remove the check mark next to **AK**.

    :::image type="content" source="media/power-bi-visual/filled-map-us-minus-alaska.png" lightbox="media/power-bi-visual/filled-map-us-minus-alaska.png" alt-text="A screenshot showing a map of America with states colored in teal with varying degrees of shading depending on the amount of sales attained in each state.":::

    <!--
    ![A screenshot showing a map of America with states colored in teal with varying degrees of shading depending on the amount of sales attained in each state.](media/power-bi-visual/filled-map-us-minus-alaska.png)
    -->

## Next steps

Change how your data is displayed on the map:

> [!div class="nextstepaction"]
> [Add a bar chart layer](power-bi-visual-add-bar-chart-layer.md)

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
