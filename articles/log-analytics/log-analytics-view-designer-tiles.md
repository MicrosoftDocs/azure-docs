---
title: A reference guide to the View Designer tiles in Azure Log Analytics | Microsoft Docs
description: By using View Designer in Log Analytics, you can create custom views in the Azure portal that display a variety of data visualizations in your Log Analytics workspace. This article is a reference guide to the settings for the tiles that are available in your custom views.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''

ms.assetid: 41787c8f-6c13-4520-b0d3-5d3d84fcf142
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 01/17/2018
ms.author: bwren
ms.component: 
---

# Reference guide to View Designer tiles in Log Analytics
By using View Designer in Azure Log Analytics, you can create custom views in the Azure portal that present a variety of data visualizations in your Log Analytics workspace. This article is a reference guide to the settings for the tiles that are available in your custom views.

For more information about View Designer, see:

* [View Designer](log-analytics-view-designer.md): Provides an overview of View Designer and procedures for creating and editing custom views.
* [Visualization part reference](log-analytics-view-designer-parts.md): Provides a reference guide to the settings for the visualization parts that are available in your custom views.


The available View Designer tiles are described in the following table:  

| Tile | Description |
|:--- |:--- |
| [Number](#number-tile) |The count of records from a query. |
| [Two numbers](#two-numbers-tile) |The counts of records from two different queries. |
| [Donut](#donut-tile) | A chart that's based on a query, with a summary value in the center. |
| [Line chart and callout](#line-chart-amp-callout-tile) | A line chart that's based on a query, and a callout with a summary value. |
| [Line chart](#line-chart-tile) |A line chart that's based on a query. |
| [Two timelines](#two-timelines-tile) | A column chart with two series, each based on a separate query. |

The next sections describe the tile types and their properties in detail.

## Number tile
The **Number** tile displays both the count of records from a log query and a label.

![Number tile](media/log-analytics-view-designer/tile-number.png)

| Setting | Description |
|:--- |:--- |
| Name |The text that's displayed at the top of the tile. |
| Description |The text that's displayed under the tile name. |
| **Tile** | |
| Legend |The text that's displayed under the value. |
| Query |The query that's run. The count of the records that are returned by the query is displayed. |
| **Advanced** |**> Data-flow verification** |
| Enabled |Select this link if data-flow verification should be enabled for the tile. This approach provides an alternate message if data is unavailable. You ordinarily use the approach to provide a message during the temporary period when the view is installed and the data becomes available. |
| Query |The query that's run to determine whether data is available for the view. If the query returns no results, a message is displayed in place of the value of the main query. |
| Message |The message that's displayed if the data-flow verification query returns no data. If you provide no message, a *Performing Assessment* status message is displayed. |


## Two Numbers tile
This tile displays the count of records from two different log queries and a label for each.

![Two Numbers tile](media/log-analytics-view-designer/tile-two-numbers.png)

| Setting | Description |
|:--- |:--- |
| Name |The text that's displayed at the top of the tile. |
| Description |The text that's displayed under the tile name. |
| **First Tile** | |
| Legend |The text that's displayed under the value. |
| Query |The query that's run. The count of the records that are returned by the query is displayed. |
| **Second Tile** | |
| Legend |The text that's displayed under the value. |
| Query |The query that's run. The count of the records that are returned by the query is displayed. |
| **Advanced** |**> Data-flow verification** |
| Enabled |Select this link if data-flow verification should be enabled for the tile. This approach provides an alternate message if data is unavailable. You ordinarily use the approach to provide a message during the temporary period when the view is installed and the data becomes available. |
| Query |The query that's run to determine whether data is available for the view. If the query returns no results, a message is displayed in place of the value of the main query. |
| Message |The message that's displayed if the data-flow verification query returns no data. If you provide no message, a *Performing Assessment* status message is displayed. |


## Donut tile
The **Donut** tile displays a single number that summarizes a value column in a log query. The donut graphically displays results of the top three records.

![Donut tile](media/log-analytics-view-designer/tile-donut.png)

| Setting | Description |
|:--- |:--- |
| Name |The text that's displayed at the top of the tile. |
| Description |The text that's displayed under the tile name. |
| **Donut** | |
| Query |The query that's run for the donut. The first property is a text value, and the second property is a numeric value. This query ordinarily uses the *measure* keyword to summarize results. |
| **Donut** |**> Center** |
| Text |The text that's displayed under the value inside the donut. |
| Operation |The operation that's performed on the value property to summarize it as a single value.<ul><li>Sum: Add the values of all records with the property value.</li><li>Percentage: Percentage of the summed values from records with the property value compared to the summed values of all records.</li></ul> |
| Result values used in center operation |Optionally, select the plus sign (+) to add one or more values. The results of the query are limited to records with the property values you specify. If no values are added, all records are included in the query. |
| **Donut** |**> Additional options** |
| Colors |The color that's displayed for each of the three top properties. To specify alternate colors for specific property values, use *Advanced Color Mapping*. |
| Advanced Color Mapping |Displays a color that represents specific property values. If the value you specify is in the top three, the alternate color is displayed instead of the standard color. If the property is not in the top three, the color is not displayed. |
| **Advanced** |**> Data-flow verification** |
| Enabled |Select this link if data-flow verification should be enabled for the tile. This approach provides an alternate message if data is unavailable. You ordinarily use the approach to provide a message during the temporary period when the view is installed and the data becomes available. |
| Query |The query that's run to determine whether data is available for the view. If the query returns no results, a message is displayed in place of the value of the main query. |
| Message |The message that's displayed if the data-flow verification query returns no data. If you provide no message, a *Performing Assessment* status message is displayed. |


## Line chart tile
This tile is a line chart that displays multiple series from a log query over time. 

![Line chart and callout tile](media/log-analytics-view-designer/tile-line-chart.png)

| Setting | Description |
|:--- |:--- |
| Name |The text that's displayed at the top of the tile. |
| Description |The text that's displayed under the tile name. |
| **Line chart** | |
| Query |The query that's run for the line chart. The first property is a text value, and the second property is a numeric value. This query ordinarily uses the *measure* keyword to summarize results. If the query uses the *interval* keyword, the x-axis uses this time interval. If the query doesn't use the *interval* keyword, the x-axis uses hourly intervals. |
| **Line chart** |**> Y-axis** |
| Use Logarithmic Scale |Select this link to use a logarithmic scale for the y-axis. |
| Units |Specify the units for the values returned by the query. This information is used to display labels on the chart indicating the value types and optionally for converting the values. The **Unit Type** specifies the category of the unit and defines the **Current Unit Type** values that are available. If you select a value in **Convert to** then the numeric values are converted from the **Current Unit** type to the **Convert to** type. |
| Custom label |The text that's displayed for the y-axis next to the label for the *Unit* type. If no label is specified, only the *Unit* type is displayed. |
| **Advanced** |**> Data-flow verification** |
| Enabled |Select this link if data-flow verification should be enabled for the tile. This approach provides an alternate message if data is unavailable. You ordinarily use the approach to provide a message during the temporary period when the view is installed and the data becomes available. |
| Query |The query that's run to determine whether data is available for the view. If the query returns no results, a message is displayed in place of the value of the main query. |
| Message |The message that's displayed if the data-flow verification query returns no data. If you provide no message, a *Performing Assessment* status message is displayed. |


## Line chart and callout tile
This tile has both a line chart that displays multiple series from a log query over time and a callout with a summarized value. 

![Line chart and callout tile](media/log-analytics-view-designer/tile-line-chart-callout.png)

| Setting | Description |
|:--- |:--- |
| Name |The text that's displayed at the top of the tile. |
| Description |The text that's displayed under the tile name. |
| **Line chart** | |
| Query |The query that's run for the line chart. The first property is a text value, and the second property is a numeric value. This query ordinarily uses the *measure* keyword to summarize results. If the query uses the *interval* keyword, the x-axis uses this time interval. If the query doesn't use the *interval* keyword, the x-axis uses hourly intervals. |
| **Line chart** |**> Callout** |
| Callout title | The text that's displayed above the callout value. |
| Series name |The series property value to be used as the callout value. If no series is provided, all records from the query are used. |
| Operation |The operation that's performed on the value property to summarize it as a single value for the callout.<ul><li>Average: The average of the values from all records.</li><li>Count: The count of all records that are returned by the query.</li><li>Last sample: The value of the last interval that's included in the chart.</li><li>Max: The maximum value of the intervals that are included in the chart.</li><li>Min: The minimum value of the intervals that are included in the chart.</li><li>Sum: The sum of the values from all records.</li></ul> |
| **Line chart** |**> Y-axis** |
| Use Logarithmic Scale |Select this link to use a logarithmic scale for the y-axis. |
| Units |Specify the units for the values to be returned by the query. This information is used to display chart labels that indicate the value types and, optionally, to convert the values. The *Unit* type specifies the category of the unit and defines the available *Current Unit* type values. If you select a value in *Convert to*, the numeric values are converted from the *Current Unit* type to the *Convert to* type. |
| Custom label |The text that's displayed for the y-axis next to the label for the *Unit* type. If no label is specified, only the *Unit* type is displayed. |
| **Advanced** |**> Data-flow verification** |
| Enabled |Select this link if data-flow verification should be enabled for the tile. This approach provides an alternate message if data is unavailable. You ordinarily use the approach to provide a message during the temporary period when the view is installed and the data becomes available. |
| Query |The query that's run to determine whether data is available for the view. If the query returns no results, a message is displayed in place of the value of the main query. |
| Message |The message that's displayed if the data-flow verification query returns no data. If you provide no message, a *Performing Assessment* status message is displayed. |


## Two timelines tile
The **Two timelines** tile displays the results of two log queries over time as column charts. A callout is displayed for each series. 

![Two timelines tile](media/log-analytics-view-designer/tile-two-timelines.png)

| Setting | Description |
|:--- |:--- |
| Name |The text that's displayed at the top of the tile. |
| Description |The text that's displayed under the tile name. |
| First Chart | |
| Legend |The text that's displayed under the callout for the first series. |
| Color |The color that's used for the columns in the first series. |
| Chart query |The query that's run for the first series. The count of the records over each time interval is represented by the chart columns. |
| Operation |The operation that's performed on the value property to summarize it as a single value for the callout.<ul><li>Average: The average of the values from all records.</li><li>Count: The count of all records that are returned by the query.</li><li>Last sample: The value of the last interval that's included in the chart.</li><li>Max: The maximum value of the intervals that are included in the chart.</li></ul> |
| **Second chart** | |
| Legend |The text that's displayed under the callout for the second series. |
| Color |The color that's used for the columns in the second series. |
| Chart Query |The query that's run for the second series. The count of the records over each time interval is represented by the chart columns. |
| Operation |The operation that's performed on the value property to summarize it as a single value for the callout.<ul><li>Average: The average of the values from all records.</li><li>Count: The count of all records that are returned by the query.</li><li>Last sample: The value of the last interval that's included in the chart.</li><li>Max: The maximum value of the intervals that are included in the chart. |
| **Advanced** |**> Data-flow verification** |
| Enabled |Select this link if data-flow verification should be enabled for the tile. This approach provides an alternate message if data is unavailable. You ordinarily use the approach to provide a message during the temporary period when the view is installed and the data becomes available. |
| Query |The query that's run to determine whether data is available for the view. If the query returns no results, a message is displayed in place of the value of the main query. |
| Message |The message that's displayed if the data-flow verification query returns no data. If you provide no message, a *Performing Assessment* status message is displayed. |


## Next steps
* Learn about [log searches](log-analytics-log-searches.md) to support the queries in tiles.
* Add [visualization parts](log-analytics-view-designer-parts.md) to your custom view.
