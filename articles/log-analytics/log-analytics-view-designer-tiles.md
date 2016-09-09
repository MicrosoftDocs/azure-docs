<properties
	pageTitle="Log Analytics View Designer Tile Reference | Microsoft Azure"
	description="View Designer in Log Analytics allows you to create custom Views in the OMS console that contain different visualizations of data in the OMS repository. This article provides a reference of the settings for each of the tiles available to use in your custom views."
	services="log-analytics"
	documentationCenter=""
	authors="bwren"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/01/2016"
	ms.author="bwren"/>

# Log Analytics View Designer Tile Reference
The View Designer in Log Analytics allows you to create custom Views in the OMS console that contain different visualizations of data in the OMS repository. This article provides a reference of the settings for each of the tiles available to use in your custom views.

Other articles available for View Designer are:

- [View Designer](log-analytics-view-designer.md) - Overview of the View Designer and procedures for creating and editing custom views.
- [Visualization part reference](log-analytics-view-designer-parts.md) - Reference of the settings for each of the tiles available to use in your custom views. 


The following table lists the different types of tiles available in the View Designer.  The sections below describe each tile type in detail and their properties.

| Tile | Description |
|:--|:--|
| [Number](#number-tile) | Single number showing count of records from a query. |
| [Two numbers](#two-numbers-tile) | Two single numbers showing counts of records from two different queries. |
| [Donut](#donut-tile) | Donut chart based on a query with a summary value in the center. |
| [Line chart & callout](#line-chart-amp-callout-tile) | Line chart based on a query and a callout with a summary value. |
| [Line chart](#line-chart-tile) | Line chart based on a query. |
| [Two timelines](#two-timelines-tile) | Column chart with two series each based on a separate query. |



## Number tile

The **Number** tile displays a single number showing the count of records from a log query and a label.

![Number tile](media/log-analytics-view-designer/tile-number.png)

| Setting | Description |
|:--|:--|
| Name        | Text to display at the top of the tile. |
| Description | Text to display under the tile name.    |
| **Tile** |
| Legend | Text to display under the value. |
| Query | Query to run.  The count of the number of records returned by the query will be displayed. |
| **Advanced** |  **> Data-flow verification** |
| Enabled | Select if data-flow verification should be enabled for the tile.  This provides an alternate message if data is not available for the tile.  This is typically used to provide a message during the temporary period when the view is installed and data comes available. |
| Query | Query to run to check if data is available for the view.  If the query returns no results, then a message is displayed instead of the value from the main query. |
| Message | Message to display if the data-flow verification query returns no data.  If you provide no message, *Performing Assessment* is displayed. |
| **Time Interval** |
| Duration | Duration from the current date to use for the time interval of the query.  For example, if **7 days** is specified, then the query is limited to records created from 7 days ago to the current date. |
| End data offset | Optional offset from the current data to use for the time interval of the main query.  For example, if **-1 day** is used for the **End date offset** and **7 days** used for the **Duration**, then the query is limited to records created from 8 days ago to yesterday. |

## Two Numbers tile

The **Two Number** tile displays two numbers showing the count of records from two different log queries and a label for each.

![Two Numbers tile](media/log-analytics-view-designer/tile-two-numbers.png)

| Setting | Description |
|:--|:--|
| Name        | Text to display at the top of the tile. |
| Description | Text to display under the tile name.    |
| **First Tile** |
| Legend | Text to display under the value. |
| Query | Query to run.  The count of the number of records returned by the query will be displayed. |
| **Second Tile** |
| Legend | Text to display under the value. |
| Query | Query to run.  The count of the number of records returned by the query will be displayed. |
| **Advanced** | **> Data-flow verification** |
| Enabled | Select if data-flow verification should be enabled for the tile.  This provides an alternate message if data is not available for the tile.  This is typically used to provide a message during the temporary period when the view is installed and data comes available. |
| Query | Query to run to check if data is available for the view.  If the query returns no results, then a message is displayed instead of the value from the main query. |
| Message | Message to display if the data-flow verification query returns no data.  If you provide no message, *Performing Assessment* is displayed. |
| **Time Interval** |
| Duration | Duration from the current date to use for the time interval of the query.  For example, if **7 days** is specified, then the query is limited to records created from 7 days ago to the current date. |
| End data offset | Optional offset from the current data to use for the time interval of the main query.  For example, if **-1 day** is used for the **End date offset** and **7 days** used for the **Duration**, then the query is limited to records created from 8 days ago to yesterday. |

## Donut tile

The **Donut** tile displays a single number summarized from a value column in a log query.  The donut graphically displays results of the top three records.

![Donut tile](media/log-analytics-view-designer/tile-donut.png)

| Setting | Description |
|:--|:--|
| Name        | Text to display at the top of the tile. |
| Description | Text to display under the tile name.    |
| **Donut** |
| Query | Query to run for the donut.  The first property should be a text value and the second property a numeric value.  This is typically a query that uses the **measure** keyword to summarize results. |
| **Donut** | **> Center** |
| Text | Text to display under the value inside the donut. |
| Operation | The operation to perform on the value property to summarize to a single value.<br><br>- Sum: Add the values of all records with the property value.<br>- Percentage: Percentage of the summed values from records with the property value compared to the summed values of all records. |
| Result values used in center operation | Optionally click the plus sign to add one or more values.  The results of the query will be limited to records with the property values you specify.  If no values are added, than all records are included in the query. |
| **Donut** | **> Additional options** |
| Colors | The color to display for each of the three top properties.  If you want to specify alternate colors for specific property values, then use Advanced Color Mapping. |
| Advanced Color Mapping | Displays a color for specific property values.  If the value you specify is in the top three, then the alternate color is displayed instead of the standard color.  If the property is not in the top three, then the color is not displayed. |
| **Advanced** | **> Data-flow verification** |
| Enabled | Select if data-flow verification should be enabled for the tile.  This provides an alternate message if data is not available for the tile.  This is typically used to provide a message during the temporary period when the view is installed and data comes available. |
| Query | Query to run to check if data is available for the view.  If the query returns no results, then a message is displayed instead of the value from the main query. |
| Message | Message to display if the data-flow verification query returns no data.  If you provide no message, *Performing Assessment* is displayed. |
| **Time Interval** |
| Duration | Duration from the current date to use for the time interval of the query.  For example, if **7 days** is specified, then the query is limited to records created from 7 days ago to the current date. |
| End data offset | Optional offset from the current data to use for the time interval of the main query.  For example, if **-1 day** is used for the **End date offset** and **7 days** used for the **Duration**, then the query is limited to records created from 8 days ago to yesterday. |

## Line chart tile

The **Line chart** tile displays a line chart with multiple series from a log query over time.  

![Line Chart & Callout tile](media/log-analytics-view-designer/tile-line-chart.png)

| Setting | Description |
|:--|:--|
| Name        | Text to display at the top of the tile. |
| Description | Text to display under the tile name.    |
| **Line Chart** |	
| Query | Query to run for the line chart.  The first property should be a text value and the second property a numeric value.  This is typically a query that uses the **measure** keyword to summarize results.  If the query uses the **interval** keyword then the X-Axis of the chart will use this time interval.  If the query does not include the **interval** keyword then hourly intervals are used for the X-Axis. |
| **Line Chart** | **> Y Axis** |
| Use Logarithmic Scale | Select to use a logarithmic scale for the Y-Axis. |
| Units | Specify the units for the values returned by the query.  This information is used to display labels on the chart indicating the value types and optionally for converting the values.  The **Unit Type** specifies the category of the unit and defines the **Current Unit Type** values that are available.  If you select a value in **Convert to** then the numeric values are converted from the **Current Unit** type to the **Convert to** type. |
| Custom Label | Text to display for the Y Axis next to the label for the unit type.  If no label is specified, then only the unit type is displayed. |
| **Advanced** | **> Data-flow verification** |
| Enabled | Select if data-flow verification should be enabled for the tile.  This provides an alternate message if data is not available for the tile.  This is typically used to provide a message during the temporary period when the view is installed and data comes available. |
| Query | Query to run to check if data is available for the view.  If the query returns no results, then a message is displayed instead of the value from the main query. |
| Message | Message to display if the data-flow verification query returns no data.  If you provide no message, *Performing Assessment* is displayed. |
| **Time Interval** |
| Duration | Duration from the current date to use for the time interval of the query.  For example, if **7 days** is specified, then the query is limited to records created from 7 days ago to the current date. |
| End data offset | Optional offset from the current data to use for the time interval of the main query.  For example, if **-1 day** is used for the **End date offset** and **7 days** used for the **Duration**, then the query is limited to records created from 8 days ago to yesterday. |


## Line chart & callout tile

The **Line chart & callout** tile displays a line chart with multiple series from a log query over time and a callout with a summarized value.  

![Line Chart & Callout tile](media/log-analytics-view-designer/tile-line-chart-callout.png)

| Setting | Description |
|:--|:--|
| Name        | Text to display at the top of the tile. |
| Description | Text to display under the tile name.    |
| **Line Chart** |	
| Query | Query to run for the line chart.  The first property should be a text value and the second property a numeric value.  This is typically a query that uses the **measure** keyword to summarize results.  If the query uses the **interval** keyword then the X-Axis of the chart will use this time interval.  If the query does not include the **interval** keyword then hourly intervals are used for the X-Axis. |
| **Line Chart** | **> Callout** |
| Callout | Title	Text to display above the callout value. |
| Series Name | Property value for the series to use for the callout value.  If no series is provided, all records from the query are used. |
| Operation | The operation to perform on the value property to summarize to a single value for the callout.<br>- Average: Average of the value from all records.<br><br>- Count: Count of all records returned by the query.<br>- Last Sample: Value from the last interval included in the chart.<br>- Max: Maximum value from the intervals included in the chart.<br>- Min: Minimum value from the intervals included in the chart.<br>- Sum: Sum of the value from all records. |
| **Line Chart** | **> Y Axis** |
| Use Logarithmic Scale | Select to use a logarithmic scale for the Y-Axis. |
| Units | Specify the units for the values returned by the query.  This information is used to display labels on the chart indicating the value types and optionally for converting the values.  The **Unit Type** specifies the category of the unit and defines the **Current Unit Type** values that are available.  If you select a value in **Convert to** then the numeric values are converted from the **Current Unit** type to the **Convert to** type. |
| Custom Label | Text to display for the Y Axis next to the label for the unit type.  If no label is specified, then only the unit type is displayed. |
| **Advanced** | **> Data-flow verification** |
| Enabled | Select if data-flow verification should be enabled for the tile.  This provides an alternate message if data is not available for the tile.  This is typically used to provide a message during the temporary period when the view is installed and data comes available. |
| Query | Query to run to check if data is available for the view.  If the query returns no results, then a message is displayed instead of the value from the main query. |
| Message | Message to display if the data-flow verification query returns no data.  If you provide no message, *Performing Assessment* is displayed. |
| **Time Interval** |
| Duration | Duration from the current date to use for the time interval of the query.  For example, if **7 days** is specified, then the query is limited to records created from 7 days ago to the current date. |
| End data offset | Optional offset from the current data to use for the time interval of the main query.  For example, if **-1 day** is used for the **End date offset** and **7 days** used for the **Duration**, then the query is limited to records created from 8 days ago to yesterday. |

## Two timelines tile

The **Two timelines** tile displays the results of two log queries over time as column charts.  A callout is displayed for each series.  

![Two timelines tile](media/log-analytics-view-designer/tile-two-timelines.png)

| Setting | Description |
|:--|:--|
| Name        | Text to display at the top of the tile. |
| Description | Text to display under the tile name.    |
| First Chart	
| Legend | Text to display under the callout for the first series.
| Color | Color to use for the columns in the first series.
| Chart Query | Query to run for the first series.  The count of the number of records over each time interval will be represented by the chart columns.
| Operation | The operation to perform on the value property to summarize to a single value for the callout.<br><br>- Average: Average of the value from all records.<br>- Count: Count of all records returned by the query.<br>- Last Sample: Value from the last interval included in the chart.<br>- Max: Maximum value from the intervals included in the chart.
| **Second Chart** |
| Legend | Text to display under the callout for the second series.
| Color | Color to use for the columns in the second series.
| Chart Query | Query to run for the second series.  The count of the number of records over each time interval will be represented by the chart columns.
| Operation | The operation to perform on the value property to summarize to a single value for the callout.<br><br>- Average: Average of the value from all records.<br>- Count: Count of all records returned by the query.<br>- Last Sample: Value from the last interval included in the chart.<br>- Max: Maximum value from the intervals included in the chart. |
| **Advanced** | **> Data-flow verification** |
| Enabled | Select if data-flow verification should be enabled for the tile.  This provides an alternate message if data is not available for the tile.  This is typically used to provide a message during the temporary period when the view is installed and data comes available. |
| Query | Query to run to check if data is available for the view.  If the query returns no results, then a message is displayed instead of the value from the main query. |
| Message | Message to display if the data-flow verification query returns no data.  If you provide no message, *Performing Assessment* is displayed. |
| **Time Interval** |
| Duration | Duration from the current date to use for the time interval of the query.  For example, if **7 days** is specified, then the query is limited to records created from 7 days ago to the current date. |
| End data offset | Optional offset from the current data to use for the time interval of the main query.  For example, if **-1 day** is used for the **End date offset** and **7 days** used for the **Duration**, then the query is limited to records created from 8 days ago to yesterday. |

## Next steps

- Learn about [log searches](log-analytics-log-searches.md) to support the queries in tiles.
- Add [Visualization Parts](log-analytics-view-designer-parts.md) to your custom view.