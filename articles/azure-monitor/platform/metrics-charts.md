---
title: Advanced features of Azure Metrics Explorer
description: Learn about advanced features of Azure Monitor Metrics Explorer.
author: vgorbenko
services: azure-monitor

ms.topic: conceptual
ms.date: 01/22/2019
ms.author: vitalyg
ms.subservice: metrics
---

# Advanced features of Azure Metrics Explorer

> [!NOTE]
> This article assumes that you're familiar with basic features of Azure Metrics Explorer. If you're a new user and want to learn how to create your first metric chart, see [Getting started with Azure Metrics Explorer](metrics-getting-started.md).

## Metrics in Azure

In Azure Monitor, [metrics](data-platform-metrics.md) are a series of measured values and counts that are collected and stored over time. Metrics can be standard (or *platform*) or custom. 

Standard metrics are provided by the Azure platform. They reflect the health and usage statistics of your Azure resources. 

Custom metrics are sent to Azure by your applications by using the [Application Insights API for custom events and metrics](../app/api-custom-events-metrics.md), [Windows Azure Diagnostics (WAD) extension](./diagnostics-extension-overview.md), or [Azure Monitor REST API](./metrics-store-custom-rest-api.md).

## Multiple metric lines and charts

You can create charts that plot multiple metric lines or show multiple metric charts at once. This functionality allows you to:

- Correlate related metrics on the same graph to see how one value relates to another.
- Display metrics that use different units of measure in close proximity.
- Visually aggregate and compare metrics from multiple resources.

For example, if you have five storage accounts and you want to know how much space they consume together, you can create a (stacked) area chart that shows the individual values and the sum of all the values at particular points in time.

### Multiple metrics on the same chart

To view multiple metrics on the same chart, first [create a new chart](metrics-getting-started.md#create-your-first-metric-chart). Then select **Add metric**. Repeat this step to add another metric on the same chart.

   > [!NOTE]
   > Typically, your charts shouldn't mix metrics that use different units of measure. For example, avoid mixing one metric that uses milliseconds with another that uses kilobytes. Also avoid metrics whose scales differ significantly. 
   >
   > In these cases, consider using multiple charts instead. In Metrics Explorer, select **Add chart** to create a new chart.

### Multiple charts

To create another chart that uses a different metric, select **Add chart**.

To reorder or delete multiple charts, select the ellipsis (**...**) button to open the chart menu. Then choose **Move up**, **Move down**, or **Delete**.

## Aggregation

When you add a metric to a chart, Metrics Explorer automatically applies a default aggregation. The default makes sense in basic scenarios. But you can use a different aggregation to gain additional insights about the metric. Viewing different aggregations on a chart requires that you understand how Metrics Explorer handles them. 

Metrics are a series of measurements (or "metric values") captured over a time period. When you plot a chart, the values of the selected metric are separately aggregated over the *time grain*. 

You select the size of the time grain by using the Metrics Explorer [time picker panel](metrics-getting-started.md#select-a-time-range). If you don't explicitly select the time grain, the currently selected time range is used by default. After the time grain is determined, the metric values that were captured during each time grain are aggregated on the chart, one data point per time grain.

For example, suppose a chart shows the **Server Response Time** metric. It uses the **Average** aggregation over time span of the **last 24 hours**:

- If the time granularity is set to 30 minutes, the chart is drawn from 48 aggregated data points. That is, the line chart connects 48 dots in the chart plot area (24 hours x 2 data points per hour). Each data point represents the *average* of all captured response times for server requests that occurred during each of the relevant 30-minute time periods.
- If you switch the time granularity to 15 minutes, you get 96 aggregated data points.  That is, you get 24 hours x 4 data points per hour.

Metrics Explorer has five basic statistical aggregation types: sum, count, min, max, and average. The *sum* aggregation is sometimes called the *total* aggregation. For many metrics, Metrics Explorer hides the aggregations that are totally irrelevant and can't be used.

* **Sum**: The sum of all values captured over the aggregation interval.

    ![Screenshot of a sum request.](./media/metrics-charts/request-sum.png)

* **Count**: The number of measurements captured over the aggregation interval. 
    
    When the metric is always captured with the value of 1, the Count is equal to the Sum. This scenario is common when the metric tracks the count of distinct events and each measurement represents one event. That is, the code emits a metric record every time a new request arrives.

    ![Screenshot of a count request.](./media/metrics-charts/request-count.png)

* **Average**: The average of the metric values captured over the aggregation interval.

    ![Screenshot of an average request.](./media/metrics-charts/request-avg.png)

* **Min**: The smallest value captured over the aggregation interval.

    ![Screenshot of a minimum request.](./media/metrics-charts/request-min.png)

* **Max**: The largest value captured over the aggregation interval.

    ![Screenshot of a maximum request.](./media/metrics-charts/request-max.png)

## Chart filters

You can apply filters to charts that show metrics that have dimensions. For example, imagine a "Transaction count" metric that has a "Response type" dimension. This dimension indicates whether the response from transactions succeeded or failed. If you filter on this dimension, you'll see a chart line for only successful (or only failed) transactions. 

### Add a filter

1. Above the chart, select **Add filter**.

2. Select a dimension (property) to filter.

   ![Screenshot that shows the dimensions (properties) you can filter.](./media/metrics-charts/028.png)

3. Select the dimension values you want to include when you plot the chart. The following example filters out the successful storage transactions:

   ![Screenshot that shows the successful filtered storage transactions.](./media/metrics-charts/029.png)

4. Select away from the **Filter Selector** to close the selector. Now the chart shows how many storage transactions have failed:

   ![Screenshot that shows how many storage transactions have failed.](./media/metrics-charts/030.png)

You can repeat these steps to apply multiple filters to the same charts.



## Apply splitting to a chart

You can split a metric by dimension to visualize how different segments of the metric compare and to identify the outlying segments of a dimension.

### Apply splitting

1. Above the chart, select **Apply splitting**.
 
   > [!NOTE]
   > Charts that have multiple metrics can't use the splitting functionality. Also, although a chart can have multiple filters, it can have only one splitting dimension.

2. Choose a dimension on which to segment your chart:

   ![Screenshot that shows the selected dimension on which to segment the chart.](./media/metrics-charts/031.png)

   Now the chart now shows multiple lines, one for each dimension segment:

   ![Screenshot that shows multiple lines, one for each dimension segment.](./media/metrics-charts/032.png)

3. Select away from the **Grouping Selector** to close it.

   > [!NOTE]
   > To hide segments that are irrelevant for your scenario and to make your charts easier to read, use both filtering and splitting on the same dimension.

## Lock boundaries of the y-axis

Locking the range of the value (y) axis becomes important in charts that show small fluctuations of large values. 

For example, a drop in the volume of successful requests from 99.99 percent to 99.5 percent might represent a significant reduction in the quality of service. But noticing a small numeric value fluctuation would be difficult or even impossible if you're using the default chart settings. In this case, you could lock the lowest boundary of the chart to 99 percent to make a small drop more apparent. 

Another example is a fluctuation in the available memory, where the value will technically never reach 0. Fixing the range to a higher value might make drops in available memory easier to spot. 

To control the y-axis range, open the chart menu (**...**). Then select **Chart settings** to access advanced chart settings.

![Screenshot that highlights the chart settings.](./media/metrics-charts/033.png)

 Modify the values in the **Y-axis range**  section, or use the **Auto** button to revert to the defaults.
 
 ![Screenshot that highlights the Y-axis range section.](./media/metrics-charts/034.png)

> [!WARNING]
> If you need to lock the boundaries of the y-axis for charts that track counts or sums over a period of time (by using count, sum, min, or max aggregations), you should usually specify a fixed time granularity. In this case, you shouldn't rely on the automatic defaults. 
>
> You choose a fixed time granularity because chart values change when the time granularity is automatically modified after a user resizes a browser window or changes screen resolution. The resulting change in time granularity affects the look of the chart, invalidating the current selection of the y-axis range.

## Chart line colors

After you configure the charts, the chart lines are automatically assigned a color from a default palette. You can change those colors.

To change the color of a chart line, select the colored bar in the legend that corresponds to the chart. The color picker dialog box opens. Use the color picker to configure the line color.

![Screenshot that shows how to change color.](./media/metrics-charts/035.png)

Your customized colors are preserved when you pin the chart to a dashboard. The following section shows how to pin a chart.

## Pinning charts to dashboards

After you configure a chart, you might want to add it to dashboards. By pinning a chart to a dashboard, you can make it accessible to your team. You can also gain insights by viewing it in the context of other monitoring telemetry.

To pin a configured chart to a dashboard:

After configuring your chart, select **Pin to dashboard** in the right top corner of the chart.

![Screenshot that shows you how to pin to chart](./media/metrics-charts/036.png)

## Alert rules

You can use the criteria you have set to visualize your metrics as the basis of a metric based alert rule. The new alerting rule will include your target resource, metric, splitting, and filter dimensions from your chart. You will be able to modify these settings later on the alert rule creation pane.

### To create a new alert rule, select **New Alert rule**

![New alert rule button highlighted in red](./media/metrics-charts/042.png)

You will be taken to the alert rule creation pane with the underlying metric dimensions from your chart pre-populated to make it easier to generate custom alert rules.

![Create alert rule](./media/metrics-charts/041.png)

Check out this [article](alerts-metric.md) to learn more about setting up metric alerts.

## Troubleshooting

*I don't see any data on my chart.*

* Filters apply to all the charts on the pane. Make sure that, while you're focusing on one chart, you didn't set a filter that excludes all the data on another.

* If you want to set different filters on different charts, create them in different blades, save them as separate favorites. If you want, you can pin them to the dashboard so that you can see them alongside each other.

* If you segment a chart by a property that is not defined on the metric, then there will be nothing on the chart. Try clearing the segmentation (splitting), or choose a different property.

## Next steps

  Read [Creating custom KPI dashboards](../learn/tutorial-app-dashboards.md) to learn about the best practices for creating actionable dashboards with metrics.



