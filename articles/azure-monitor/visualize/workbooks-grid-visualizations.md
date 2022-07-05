---
title: Azure Monitor workbook grid visualizations
description: Learn about all the Azure Monitor workbook grid visualizations.
services: azure-monitor
ms.topic: conceptual
ms.date: 07/05/2022
ms.author: abbyweisberg
---

# Grid visualizations

Grids or tables are a common way to present data to users. Workbooks allow users to individually style the columns of the grid to provide a rich UI for their reports.

The example below shows a grid that combines icons, heatmaps, and spark-bars to present complex information. The workbook also provides sorting, a search box and a go-to-analytics button.

[![Screenshot of log based grid](./media/workbooks-grid-visualizations/grid.png)](./media/workbooks-grid-visualizations/grid.png#lightbox)

## Adding a log-based grid

1. Switch the workbook to edit mode by selecting **Edit** in the toolbar.
2. Select **Add query** to add a log query control to the workbook.
3. Select the query type as **Log**, resource type (for example, Application Insights) and the resources to target.
4. Use the Query editor to enter the KQL for your analysis (for example, VMs with memory below a threshold)
5. Set the visualization to **Grid**
6. Set other parameters if needed - like time range, size, color palette, and legend.

[![Screenshot of log based grid query](./media/workbooks-grid-visualizations/grid-query.png)](./media/workbooks-grid-visualizations/grid-query.png#lightbox)

## Log chart parameters

| Parameter | Explanation | Example |
| ------------- |:-------------|:-------------|
|Query Type| The type of query to use. | Log, Azure Resource Graph, etc. |
|Resource Type| The resource type to target. | Application Insights, Log Analytics, or Azure-first |
|Resources| A set of resources to get the metrics value from. | MyApp1 |
|Time Range| The time window to view the log chart. | Last hour, Last 24 hours, etc. |
|Visualization| The visualization to use. | Grid |
|Size| The vertical size of the control. | Small, medium, large, or full |
|Query| Any KQL query that returns data in the format expected by the chart visualization. | _requests \| summarize Requests = count() by name_ |

## Simple Grid

Workbooks can render KQL results as a simple table. The grid below shows the count of requests and unique users per requests type in an app.

```kusto
requests
| where name !endswith('.eot')
| summarize Requests = count(), Users = dcount(user_Id) by name
| order by Requests desc
```

[![Screenshot of a log based grid in edit mode](./media/workbooks-grid-visualizations/log-chart-simple-grid.png)](./media/workbooks-grid-visualizations/log-chart-simple-grid.png#lightbox)

## Grid styling

While a plain table shows data, it is hard to read and insights won't always be apparent. Styling the grid can help make it easier to read and interpret the data.

Below is the same grid from the previous section styled as heatmaps.

[![Screenshot of a log based grid with columns styled as heatmaps](./media/workbooks-grid-visualizations/log-chart-grid-heatmap.png)](./media/workbooks-grid-visualizations/log-chart-grid-heatmap.png#lightbox)

Here is the same grid styled as bars:
[![Screenshot of a log based grid with columns styled as bars](./media/workbooks-grid-visualizations/log-chart-grid-bar.png)](./media/workbooks-grid-visualizations/log-chart-grid-bar.png#lightbox)

### Styling a grid column

1. Select the **Column Setting** button on the query control toolbar.
2. In the **Edit column settings**, select the column to style.
3. Choose a column renderer (for example heatmap, bar, bar underneath, etc.) and related settings to style your column.

Below is an example that styles the **Request** column as a bar:

[![Screenshot of a log based grid with request column styled as a bar.](./media/workbooks-grid-visualizations/log-chart-grid-column-settings-start.png)](./media/workbooks-grid-visualizations/log-chart-grid-column-settings-start.png#lightbox)

This usually is taking the user to some other view with context coming from the cell or may open up a url.

### Custom formatting

Workbooks also allow users to set the number formatting of their cell values. They can do so by clicking on the **Custom formatting** checkbox when available.

| Formatting option | Explanation |
|:------------- |:-------------|
|Units| The units for the column - various options for percentage, counts, time, byte, count/time, bytes/time, etc. For example, the unit for a value of 1234 can be set to milliseconds and it's rendered as 1.234 s. |
|Style| The format to render it as - decimal, currency, percent. |
|Show group separator| Checkbox to show group separators. Renders 1234 as 1,234 in the US. |
|Minimum integer digits| Minimum number of integer digits to use (default 1). |
|Minimum fractional digits| Minimum number of fractional digits to use (default 0).  |
|Maximum fractional digits| Maximum number of fractional digits to use. |
|Minimum significant digits| Minimum number of significant digits to use (default 1). |
|Maximum significant digits| Maximum number of significant digits to use. |
|Custom text for missing values| When a data point does not have a value, show this custom text instead of a blank. |

### Custom date formatting

When the author has specified that a column is set to the Date/Time renderer, the author can specify custom date formatting options by using the *Custom date formatting* checkbox.

| Formatting option | Explanation |
|:------------- |:-------------|
|Style| The format to render a date as short, long, full formats, or a time as short or long time formats. |
|Show time as| Allows the author to decide between showing the time in local time (default), or as UTC. Depending on the date format style selected, the UTC/time zone information may not be displayed. |

## Custom column width setting

The author can customize the width of any column in the grid using the **Custom Column Width** field in **Column Settings**.

![Screenshot of column settings with the custom column width field indicated in a red box](./media/workbooks-grid-visualizations/custom-column-width-setting.png)

If the field is left blank, then the width will be automatically determined based on the number of characters in the column and the number of visible columns. The default unit is "ch" (characters).

Selecting the blue **(Current Width)** button in the label will fill the text field with the selected column's current width. If a value is present in the custom width field with no unit of measurement, then the default will be used.

The units of measurement available are:

| Unit of measurement | Definition           |
|:--------------------|:---------------------|
| ch                  | characters (default) |ep
| px                  | pixels               |
| fr                  | fractional units     |
| %                   | percentage           |

Input validation - if validation fails, a red guidance message will popup below the field, but the user can still apply the width. If a value is present in the input, it will be parsed out. If no valid unit of measure is found, then the default will be used.

There is no minimum/maximum width as this is left up to the author's discretion. The custom column width field is disabled for hidden columns.

## Examples

### Spark lines and bar underneath

The example below shows requests counts and its trend by request name.

```kusto
requests
| make-series Trend = count() default = 0 on timestamp from ago(1d) to now() step 1h by name
| project-away timestamp
| join kind = inner (requests
    | summarize Requests = count() by name
    ) on name
| project name, Requests, Trend
| order by Requests desc
```

[![Screenshot of a log based grid with a bar underneath and a spark line](./media/workbooks-grid-visualizations/log-chart-grid-spark-line.png)](./media/workbooks-grid-visualizations/log-chart-grid-spark-line.png#lightbox)

### Heatmap with shared scales and custom formatting

This example shows various request duration metrics and its counts. The heatmap renderer uses the minimum values set in settings or calculates a minimum and maximum value for the column, and assigns a background color from the selected palette for the cell based on the value of the cell relative to the minimum and maximum value of the column.

```
requests
| summarize Mean = avg(duration), (Median, p80, p95, p99) = percentiles(duration, 50, 80, 95, 99), Requests = count() by name
| order by Requests desc
```

[![Screenshot of a log based grid with a heatmap having a shared scale across columns](./media/workbooks-grid-visualizations/log-chart-grid-shared-scale.png)](./media/workbooks-grid-visualizations/log-chart-grid-shared-scale.png#lightbox)

In the above example, a shared palette (green or red) and scale is used to color the columns (mean, median, p80, p95, and p99). A separate palette (blue) used for the request column.

#### Shared scale

To get a shared scale:

1. Use regular expressions to select more than one column to apply a setting to. For example, set the column name to `Mean|Median|p80|p95|p99` to select them all.
2. Delete default settings for the individual columns.

This will cause the new multi-column setting to apply its settings to include a shared scale.

[![Screenshot of a log based grid setting to get a shared scale across columns](./media/workbooks-grid-visualizations/log-chart-grid-shared-scale-settings.png)](./media/workbooks-grid-visualizations/log-chart-grid-shared-scale-settings.png#lightbox)

### Icons to represent status

The example below shows custom  status of requests based on the p95 duration.

```
requests
| summarize p95 = percentile(duration, 95) by name
| order by p95 desc
| project Status = case(p95 > 5000, 'critical', p95 > 1000, 'error', 'success'), name, p95
```

[![Screenshot of a log based grid with a heatmap having a shared scale across columns using the query above.](./media/workbooks-grid-visualizations/log-chart-grid-icons.png)](./media/workbooks-grid-visualizations/log-chart-grid-icons.png#lightbox)

Supported icon names include:
- cancelled
- critical
- disabled
- error
- failed
- info
- none
- pending
- stopped
- question
- success
- unknown
- warning
- uninitialized
- resource
- up
- down
- left
- right
- trendup
- trenddown
- 4
- 3
- 2
- 1
- Sev0
- Sev1
- Sev2
- Sev3
- Sev4
- Fired
- Resolved
- Available
- Unavailable
- Degraded
- Unknown
- Blank


## Fractional units percentages

The fractional unit (fr) is a commonly used dynamic unit of measurement in various types of grids. As the window size/resolution changes, the fr width changes as well.

The screenshot below shows a table with eight columns that are 1fr width each and all equal widths. As the window size changes, the width of each column changes proportionally.

[![Screenshot of columns in grid with column width value of 1fr each](./media/workbooks-grid-visualizations/custom-column-width-fr.png)](./media/workbooks-grid-visualizations/custom-column-width-fr.png#lightbox)

The image below shows the same table, except the first column is set to 50% width. This will set the column to half of the total grid width dynamically. Resizing the window will continue to retain the 50% width unless the window size gets too small. These dynamic columns have a minimum width based on their contents. The remaining 50% of the grid is divided up by the eight total fractional units. The "kind" column below is set to 2fr, so it takes up one-fourth of the remaining space. As the other columns are 1fr each, they each take up one-eighth of the right half of the grid.

[![Screenshot of columns in grid with 1 column width value of 50% and the rest as 1fr each](./media/workbooks-grid-visualizations/custom-column-width-fr2.png)](./media/workbooks-grid-visualizations/custom-column-width-fr2.png#lightbox)

Combining fr, %, px, and ch widths is possible and works similarly to the previous examples. The widths that are set by the static units (ch and px) are hard constants that won't change even if the window/resolution is changed. The columns set by % will take up their percentage based on the total grid width (might not be exact due to previously minimum widths). The columns set with fr will just split up the remaining grid space based on the number of fractional units they are allotted.

[![Screenshot of columns in grid with assortment of different width units used](./media/workbooks-grid-visualizations/custom-column-width-fr3.png)](./media/workbooks-grid-visualizations/custom-column-width-fr3.png#lightbox)
