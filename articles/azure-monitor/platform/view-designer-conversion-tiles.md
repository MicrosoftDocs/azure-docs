---
title: Azure Monitor view designer to workbooks conversion options
description: 
author: austonli
ms.author: aul
ms.service: azure-monitor
ms.subservice: visualization
ms.topic: conceptual
ms.date: 02/07/2020

---

# Azure Monitor view designer tile conversions

## Donut & list
View Designer has the Donut & List tile as shown below:

![Donut List](media/view-designer-conversion-tiles/donut-list.png)

Recreating the tile in workbooks involves two separate visualizations, for the Donut portion there are two options.\
Select **Add query** and paste the original query from View Designer into the cell

**Option 1:** Select Pie Chart from the Visualization Dropdown
 ![Pie Chart Visualization Menu](media/view-designer-conversion-tiles/pie-chart.png)
**Option 2:** Add a line to the KQL
**Add:** `| render piechart`
Note that the Visualization setting should be set to **Set by query**
 ![Visualization Menu](media/view-designer-conversion-tiles/set-by-query.png)
**Example:**\
**Original:** `search * | summarize AggregatedValue = count() by Type | order by AggregatedValue desc`
**Updated:** `search * | summarize AggregatedValue = count() by Type | order by AggregatedValue desc | render piechart`

For creating a list and enabling sparklines please reference the section on [CommonSteps](./Examples/CommonSteps.md)

The following is an example of how the Donut & List tile might be reinterpreted in Workbooks

![Donut List Workbooks](media/view-designer-conversion-tiles/donut-workbooks.png)

## Linechart & List
The original Linechart & List in View Designer looks like the following:
 
![Linechart List](media/view-designer-conversion-tiles/line-list.png) 

To recreate the Linechart portion we update the query as follows:\
**Original:** _search * | summarize AggregatedValue = count() by Type_\
**Updated:** _search * **| make-series Count = count() default=0 on TimeGenerated from {TimeRange:start} to {TimeRange:end} step {TimeRange:grain} by Type**_

There are two options for visualizing the line chart

**Option 1:** Select Line chart from the Visualization dropdown
 
 ![Linechart Menu](media/view-designer-conversion-tiles/line-visualization.png)

**Option 2:** Add a line to the KQL
Add: `| render linechart`
Note that the Visualization setting should be set to Set by query

 ![Visualization Menu](media/view-designer-conversion-tiles/set-by-query.png)

**Example:**
```KQL
search * 
| make-series Count = count() default=0 on TimeGenerated from {TimeRange:start} to {TimeRange:end} step {TimeRange:grain} by Type 
| render linechart_
```

For creating a list and enabling sparklines please reference the section on [Common Steps](./Examples/CommonSteps.md)

The following is an example of how the Linechart & List tile might be reinterpreted in Workbooks

![Linechart List Workbooks](media/view-designer-conversion-tiles/line-workbooks.png)

## Number & List
The original View Designer Number & List looks as such:
 ![Tile List](media/view-designer-conversion-tiles/tile-list-example.png)
For the number tile, update the query as such:

**Original:** _search * | summarize AggregatedValue = count() by Computer | count_\
**Updated:** _search *| summarize AggregatedValue = count() by Computer **| summarize Count = count()**_

Then change the Visualization dropdown to Tiles
 ![Tile Visualization](media/view-designer-conversion-tiles/tile-visualization.png)
Select Tile Settings
 ![Tile Settings](media/view-designer-conversion-tiles/tile-set.png)

From the sidebar menu, set Visualization to Tiles.

Underneath Tile Settings: 

Leave the Title section blank, and change Left to Use Column: Count, and the Column Renderer as Big Number


![Tile Settings](media/view-designer-conversion-tiles/tile-settings.png)
Advanced Settings \ Settings \ Chart title:  Computers sending data
 
For creating a list and enabling sparklines please reference the section on [Common Steps](./Examples/CommonSteps.md)

The following is an example of how the Number & List tile might be reinterpreted in Workbooks

![Number List Workbooks](media/view-designer-conversion-tiles/number-workbooks.png)

## Timeline & List
The Timeline & List in View Designer is shown below:

 ![Timeline List](media/view-designer-conversion-tiles/time-list.png)

For the timeline simple update your query:

**Original:** `search * | sort by TimeGenerated desc`
**Updated:** `search * | summarize Count = count() by Computer, bin(TimeGenerated,{TimeRange:grain})`

There are two options for visualizing as a bar chart

**Option 1:** Select Bar chart from the Visualization dropdown
 ![Barchart Visualization](media/view-designer-conversion-tiles/bar-visualization.png)
 
**Option 2:** Add a line to the KQL
Add: | render barchart
Note that the Visualization setting should be set to Set by query
 ![Visualization Menu](media/view-designer-conversion-tiles/set-by-query.png)

 
For creating a list and enabling sparklines please reference the section on [Common Steps](./Examples/CommonSteps.md)

The following is an example of how the Timeline & List tile might be reinterpreted in Workbooks

![Timeline List Workbooks](media/view-designer-conversion-tiles/time-workbooks.png)


### [Return to start](view-designer-overview.md)
