---
title: Geocoding in Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps
description: This article describes geocoding in Azure Maps Power BI visual.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 03/16/2022
ms.topic: how-to
ms.service: azure-maps
ms.subservice: power-bi-visual
---

# Geocoding in Azure Maps Power BI Visual

Azure Maps uses the latitude and longitude coordinate system to locate places. The Azure Maps Power BI Visual allows pinpointing a specific location on the map with latitude and longitude fields. However, most data sources use an address rather than latitude and longitude values to locate a place.

The Azure Maps Power BI Visual now provides a **Location** field that accepts address values that can be used to pinpoint a location on the map using geocoding.

Geocoding converts an address into corresponding latitude and longitude coordinates. The address details determine the geocoding granularity, such as a city versus a specific street address.

:::image type="content" source="media/power-bi-visual/geocode.png" alt-text="A screenshot showing the Visualizations and fields panes in Power BI desktop with the Azure Maps visual location field highlighted.":::

## The location field

The **Location** field in the Azure Maps Power BI Visual can accept multiple values, such as country/region, state, city, street address and zip code. By providing multiple sources of location information in the Location field, you help ensure more accurate results and eliminate ambiguity that would prevent a specific location to be determined. For example, there are over 20 different cities in the United States named *Franklin*.

## Use geo-hierarchies to drill down

Entering multiple values into the **Location** field creates a geo-hierarchy. Geo-hierarchies enable hierarchical drill-down features on the map, allowing you to explore different 'levels' of location.

:::image type="content" source="media/power-bi-visual/drill-down-buttons.png" alt-text="A screenshot showing the drill down buttons in Power BI desktop.":::

| Button  | Description |
|:-:|-------------------------------------------------------------------------------------------|
| 1 | The drill button on the far right, called Drill Mode, allows you to select a map Location and drill down into that specific location one level at a time. For example, if you turn on the drill-down option and select North America, you move down in the hierarchy to the next level--states in North America. For geocoding, Power BI sends Azure Maps country and state data for North America only. The button on the left takes you back up one level. |
| 2 | The double arrow drills down to the next level of the hierarchy for all locations simultaneously. For example, if you're currently looking at countries/regions and then use this option to move to the next level (states), Power BI displays state data for all countries/regions. For geocoding, Power BI sends Azure Maps state data (excluding country/region data) for all locations. This option is useful if each level of your hierarchy is unrelated to the level above it. |
| 3 | Similar to the drill-down option, except that you don't need to select the map. It expands down to the next level of the hierarchy remembering the current level's context. For example, if you're currently looking at countries/regions and select this icon, you move down in the hierarchy to the next level--states. For geocoding, Power BI sends data for each state and its corresponding country/region to help Azure Maps geocode more accurately. In most maps, you'll either use this option or the drill-down option on the far right. This sends Azure as much information as possible and result in more accurate location information. |

## Categorize geographic fields in Power BI

To ensure fields are correctly geocoded, you can set the Data Category on the data fields in Power BI. In Data view, select the desired column. From the ribbon, select the Modeling tab and then set the Data Category to one of the following properties: Address, Place, City, County, State or Province, Postal Code, Country, Continent, Latitude, or Longitude. These categories help Azure correctly encode the data. To learn more, see [Data categorization in Power BI Desktop]. If you're live connecting to SQL Server Analysis Services, set the data categorization outside of Power BI using [SQL Server Data Tools (SSDT)].

:::image type="content" source="media/power-bi-visual/data-category.png" alt-text="A screenshot showing the data category drop-down list in Power BI desktop.":::

> [!NOTE]
> When categorizing geographic fields in Power BI, be sure to enter **State** and **County** data separately for accurate geocoding. Incorrect categorization, such as entering both **State** and **County** data into either category, might work currently but can lead to issues in the future.
>
> For instance:
> - Correct Usage: State = GA, County = Decatur County
> - Incorrect Usage: State = Decatur County, GA or County = Decatur County, GA

## Next steps

Learn more about the Azure Maps Power BI visual:

> [!div class="nextstepaction"]
> [Get started with Azure Maps Power BI visual](power-bi-visual-get-started.md)

> [!div class="nextstepaction"]
> [Understanding layers in the Azure Maps Power BI visual](power-bi-visual-understanding-layers.md)

Learn about the Azure Maps Power BI visual Pie Chart layer that uses geocoding:

> [!div class="nextstepaction"]
> [Add a pie chart layer](power-bi-visual-add-pie-chart-layer.md)

[Data categorization in Power BI Desktop]: /power-bi/transform-model/desktop-data-categorization
[SQL Server Data Tools (SSDT)]: /sql/ssdt/download-sql-server-data-tools-ssdt
