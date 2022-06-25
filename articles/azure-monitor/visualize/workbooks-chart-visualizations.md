---
title: Azure Monitor workbook chart visualizations
description: Learn about all the Azure Monitor workbook chart visualizations.
services: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 09/04/2020
---

# Chart visualizations

Workbooks allow monitoring data to be presented as charts. Supported chart types include line, bar, bar categorical, area, scatter plots, pie, and time. You can choose to customize the height, width, color palette, legend, titles, no-data message, and other characteristics. You can also customize axis types and series colors by using chart settings.

Workbooks support charts for both logs and metric data sources.

## Log charts

Azure Monitor logs give resource owners detailed information about the workings of their apps and infrastructure. Unlike metrics, log information isn't collected by default and requires some kind of collection onboarding. When logs are present, they provide information about the state of the resource and data that's useful for diagnostics. Workbooks allow presenting log data as visual charts for user analysis.

### Add a log chart

The following example shows the trend of requests to an app over the previous days.

1. Switch the workbook to edit mode by selecting the **Edit** toolbar item.
1. Use the **Add query** link to add a log query control to the workbook.
1. Select **Query type** as **Logs**. Select **Resource type**, for example, as **Application Insights**, and select the resources to target.
1. Use the query editor to enter the [KQL](/azure/kusto/query/) for your analysis. An example is the trend of requests.
1. Set **Visualization** to **Area**, **Bar**, **Bar (categorical)**, **Line**, **Pie**, **Scatter**, or **Time**.
1. Set other parameters like the time range, size, color palette, and legend, if needed.

[![Screenshot that shows a log chart in edit mode.](./media/workbooks-chart-visualizations/log-chart.png)](./media/workbooks-chart-visualizations/log-chart.png#lightbox)

### Log chart parameters

| Parameter | Explanation | Examples |
| ------------- |:-------------|:-------------|
| Query Type | The type of query to use. | Log, Azure Resource Graph |
| Resource Type | The resource type to target. | Application Insights, Log Analytics, or Azure-first |
| Resources | A set of resources to get the metrics value from. | MyApp1 |
| Time Range | The time window to view the log chart. | Last hour, Last 24 hours |
| Visualization | The visualization to use. | Area, Bar, Line, Pie, Scatter, Time, Bar (categorical) |
| Size | The vertical size of the control. | Small, medium, large, or full |
| Color palette | The color palette to use in the chart. Ignored in multi-metric or segmented mode. | Blue, green, red |
| Legend | The aggregation function to use for the legend. | Sum or Average of values or Max, Min, First, Last value |
| Query | Any KQL query that returns data in the format expected by the chart visualization. | _requests \| make-series Requests = count() default = 0 on timestamp from ago(1d) to now() step 1h_ |

### Time-series charts

Time-series charts like area, bar, line, scatter, and time can be easily created by using the query control in workbooks. The key is having time and metric information in the result set.

#### Simple time series

The following query returns a table with two columns: `timestamp` and `Requests`. The query control uses `timestamp` for the x-axis and `Requests` for the y-axis.

```kusto
requests
| summarize Requests = count() by bin(timestamp, 1h)
```

[![Screenshot that shows a simple time-series log line chart.](./media/workbooks-chart-visualizations/log-chart-line-simple.png)](./media/workbooks-chart-visualizations/log-chart-line-simple.png#lightbox)

#### Time series with multiple metrics

The following query returns a table with three columns: `timestamp`, `Requests`, and `Users`. The query control uses `timestamp` for the x-axis and `Requests` and `Users` as separate series on the y-axis.

```kusto
requests
| summarize Requests = count(), Users = dcount(user_Id) by bin(timestamp, 1h)
```

[![Screenshot that shows a time series with multiple metrics log line chart.](./media/workbooks-chart-visualizations/log-chart-line-multi-metric.png)](./media/workbooks-chart-visualizations/log-chart-line-multi-metric.png#lightbox)

#### Segmented time series

The following query returns a table with three columns: `timestamp`, `Requests`, and `RequestName` where `RequestName` is a categorical column with the names of requests. The query control here uses `timestamp` for the x-axis and adds a series per value of `RequestName`.

```
requests
| summarize Request = count() by bin(timestamp, 1h), RequestName = name
```

[![Screenshot that shows a segmented time-series log line chart.](./media/workbooks-chart-visualizations/log-chart-line-segmented.png)](./media/workbooks-chart-visualizations/log-chart-line-segmented.png#lightbox)

### Summarize vs. make-series

The examples in the previous section use the `summarize` operator because it's easier to understand. The `summarize` operator does have a major limitation because it omits the results row if there are no items in the bucket. It can have the effect of shifting the chart time window depending on whether the empty buckets are in the front or backside of the time range.

It's usually better to use the `make-series` operator to create time-series data, which has the option to provide default values for empty buckets.

The following query uses the `make-series` operator:

```kusto
requests
| make-series Requests = count() default = 0 on timestamp from ago(1d) to now() step 1h by RequestName = name
```

The following query shows a similar chart with the `summarize` operator:

```kusto
requests
| summarize Request = count() by bin(timestamp, 1h), RequestName = name
```

Even though the queries return results in different formats, when you set the visualization to area, line, bar, or time, workbooks understand how to handle the data to create the visualization.

[![Screenshot that shows a log line chart made from a make-series query.](./media/workbooks-chart-visualizations/log-chart-line-make-series.png)](./media/workbooks-chart-visualizations/log-chart-line-make-series.png#lightbox)

### Categorical bar chart or histogram

Categorical charts allow you to represent a dimension or column on the x-axis of a chart, which is especially useful in histograms. The following example shows the distribution of requests by their result code:

```kusto
requests
| summarize Requests = count() by Result = strcat('Http ', resultCode)
| order by Requests desc
```

The query returns two columns: `Requests` metric and `Result` category. Each value of the `Result` column gets its own bar in the chart with height proportional to the `Requests metric`.

[![Screenshot that shows a categorical bar chart for requests by result code.](./media/workbooks-chart-visualizations/log-chart-categorical-bar.png)](./media/workbooks-chart-visualizations/log-chart-categorical-bar.png#lightbox)

### Pie charts

Pie charts allow the visualization of numerical proportion. The following example shows the proportion of requests by their result code:

```kusto
requests
| summarize Requests = count() by Result = strcat('Http ', resultCode)
| order by Requests desc
```

The query returns two columns: `Requests` metric and `Result` category. Each value of the `Result` column gets its own slice in the pie with size proportional to the `Requests` metric.

[![Screenshot that shows a pie chart with slices representing result code.](./media/workbooks-chart-visualizations/log-chart-pie-chart.png)](./media/workbooks-chart-visualizations/log-chart-pie-chart.png#lightbox)

## Metric charts

Most Azure resources emit metric data about state and health. Examples include CPU utilization, storage availability, count of database transactions, and failing app requests. Workbooks allow the visualization of this data as time-series charts.

### Add a metric chart

The following example shows the number of transactions in a storage account over the prior hour. This information allows the storage owner to see the transaction trend and look for anomalies in behavior.

1. Switch the workbook to edit mode by selecting the **Edit** toolbar item.
1. Use the **Add metric** link to add a metric control to the workbook.
1. Select a **Resource type**, for example, **Storage Account**. Select the resources to target, the metric namespace and name, and the aggregation to use.
1. Set other parameters like time range, split by, visualization, size, and color palette, if needed.

[![Screenshot that shows a metric chart in edit mode.](./media/workbooks-chart-visualizations/metric-chart.png)](./media/workbooks-chart-visualizations/metric-chart.png#lightbox)

### Metric chart parameters

| Parameter | Explanation | Examples |
| ------------- |:-------------|:-------------|
| Resource Type | The resource type to target. | Storage or virtual machine |
| Resources | A set of resources to get the metrics value from. | MyStorage1 |
| Namespace | The namespace with the metric. | Storage > Blob |
| Metric | The metric to visualize. | Storage > Blob > Transactions |
| Aggregation | The aggregation function to apply to the metric. | Sum, Count, Average |
| Time Range | The time window to view the metric in. | Last hour, Last 24 hours |
| Visualization | The visualization to use. | Area, Bar, Line, Scatter, Grid |
| Split By | Optionally split the metric on a dimension. | Transactions by Geo type |
| Size | The vertical size of the control. | Small, medium, or large |
| Color palette | The color palette to use in the chart. Ignored if the *Split by* parameter is used. | Blue, green, red |

### Examples

Transactions split by API name as a line chart:

[![Screenshot that shows a metric line chart for storage transactions split by API name.](./media/workbooks-chart-visualizations/metric-chart-storage-split-line.png)](./media/workbooks-chart-visualizations/metric-chart-storage-split-line.png#lightbox)

Transactions split by response type as a large bar chart:

[![Screenshot that shows a large metric bar chart for storage transactions split by response type.](./media/workbooks-chart-visualizations/metric-chart-storage-bar-large.png)](./media/workbooks-chart-visualizations/metric-chart-storage-bar-large.png#lightbox)

Average latency as a scatter chart:

[![Screenshot that shows a metric scatter chart for storage latency.](./media/workbooks-chart-visualizations/metric-chart-storage-scatter.png)](./media/workbooks-chart-visualizations/metric-chart-storage-scatter.png#lightbox)

## Chart settings

You can use chart settings to customize which fields are used in the chart axes, the axis units, custom formatting, ranges, grouping behaviors, legends, and series colors.

### The Settings tab

The **Settings** tab controls:

- The axis settings, including which fields. Custom formatting that allows you to set the number formatting to the axis values and custom ranges.
- Grouping settings, including which field. The limits before an "Others" group is created.
- Legend settings, including showing metrics like series name, colors, and numbers at the bottom, and/or a legend like series names and colors.

![Screenshot that shows chart settings.](./media/workbooks-chart-visualizations/chart-settings.png)

#### Custom formatting

Number formatting options include:

| Formatting option             | Explanation                                                                                           |
|:---------------------------- |:-------------------------------------------------------------------------------------------------------|
| Units                      | The units for the column, such as various options for percentage, counts, time, byte, count/time, and bytes/time. For example, the unit for a value of 1234 can be set to milliseconds and it's rendered as 1.234s.                                  |
| Style                      | The format to render it as, such as decimal, currency, and percent.                                               |
| Show grouping separators       | Checkbox to show group separators. Renders 1234 as 1,234 in the US.                                    |
| Minimum integer digits     | Minimum number of integer digits to use (default 1).                                                   |
| Minimum fractional digits  | Minimum number of fractional digits to use (default 0).                                                |
| Maximum fractional digits  | Maximum number of fractional digits to use.                                                            |
| Minimum significant digits | Minimum number of significant digits to use (default 1).                                               |
| Maximum significant digits | Maximum number of significant digits to use.                                                           |

![Screenshot that shows x-axis settings.](./media/workbooks-chart-visualizations/number-format-settings.png)

### The Series Settings tab

With the **Series Settings** tab, you can adjust the labels and colors shown for series in the chart:

- **Series name**: This field is used to match a series in the data and, if matched, the display label and color are displayed.
- **Comment**: This field is useful for template authors because this comment might be used by translators to localize the display labels.

![Screenshot that shows the Series Settings tab.](./media/workbooks-chart-visualizations/series-settings.png)

## Next steps

- Learn how to create a [tile in workbooks](workbooks-tile-visualizations.md).
- Learn how to create [interactive workbooks](workbooks-interactive.md).
