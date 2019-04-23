---
title: Troubleshooting Azure metric charts
description: Troubleshoot the issues with creating, customizing, or interpreting metric charts
author: vgorbenko
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 04/23/2019
ms.author: vitalyg
ms.subservice: metrics
---

# Troubleshooting metrics charts

Use this article if you are unsure how to interpret the data shown in Metrics Explorer or if you run into issues with creating or customizing your charts. If you are new to metrics, learn about [getting started with Metrics Explorer](metrics-getting-started.md) and [advanced features of Metrics Explorer](metrics-charts.md). You can also see [examples](metric-chart-samples.md) of the configured metric charts.

## My chart shows unexpected drop in values

In many cases, the perceived drop in the metric values is a matter of the incorrect interpretation of the data shown on the chart. You might be misled by a drop in sums or counts when the chart shows the most-recent minutes because the last metric data points haven’t been received or processed by Azure yet. Depending on the service, the latency of processing metrics may be within a couple minutes range. For charts showing a recent time range with a 1- or 5- minute granularity, a drop of the value over the last few minutes becomes more noticeable:
    ![metric image](./media/metrics-troubleshoot/drop-in-values.png)

**Solution:** This behavior is by design. We believe that showing data as soon as we receive it is beneficial even when the data is *partial* or *incomplete*. Doing so allows you to make important conclusion sooner and start investigation right away. For example, for a metric that shows the number of failures, seeing a partial value X tells you that there were at least X failures on a given minute. You can start investigating the problem right away, rather than waiting to see the exact count of failures that happened on this minute, which might not be as important. The chart will update once we receive the entire set of data (but at that time you may have another more recent incomplete data point for the next minute that was rendered based on partial data).

## My chart shows no data

Sometimes the chart may show no data after selecting correct resource and metric. This may be due to several reasons outlined below.

### Your resource didn't emit metrics during the selected time range

Some resources don’t constantly emit their metrics. For example, Azure will not collect metrics for stopped virtual machines. Other resources might emit their metrics only when some condition occurs. For example, a metric showing processing time of a transaction requires at least one transaction. If there were no transactions in the selected time range, the chart will naturally be empty. Additionally, while most of the metrics in Azure are collected every minute, there are some that are collected less frequently. See the metric documentation to get more details about the metric that you are trying to explore.

**Solution:** Change the time of the chart to a wider range. You may start from “Last 30 days” using a larger time granularity (or relying on the “Automatic time granularity” option).

### All metric values fall outside of the locked y-axis range

By [locking the boundaries of chart y-axis](metrics-charts.md#lock-boundaries-of-chart-y-axis), you can inadvertently make the chart display area misaligned with the chart line. For example, if the y-axis is locked to a range between 0% and 50%, and the metric has a constant value of 100%, the line is always rendered outside of the visible area, making the chart appear blank.

**Solution:** Verify that the y-axis boundaries of the chart aren’t locked outside of the range of the metric values. If the y-axis boundaries are locked, you may want to temporarily reset them to ensure that the metric values don’t fall outside of the chart range. Locking the y-axis range isn’t recommended with automatic granularity for the charts with **sum**, **min**, and **max** aggregation because their values will change with granularity by resizing browser window or going from one screen resolution to another. Switching granularity may leave the display area of your chart empty.

### You are looking at a Guest OS metric but didn’t enable Diagnostic Extension

Collection of Guest OS metrics requires configuring the Azure Diagnostic Extension or enabling it using the Diagnostic Settings panel on your resource.

## I see “Error retrieving data” message over a metric chart on dashboard

This problem is common when your dashboard is created with a metric that was deprecated and removed from Azure. To verify that it is the case, open the Metrics tab of your resource, and check the available metrics in the metric picker. If the metric is not shown, the metric has been removed from Azure. Usually, when a metric is deprecated, there is a better new metric that provides with a similar perspective on the resource health.

**Solution:** Update the failing tile by picking an alternative metric for your chart on dashboard. You can [review a list of available metrics for Azure services](metrics-supported.md).

## I see a dashed line on the chart

Azure metrics charts use dashed line style to indicate that there is a missing value (also known as “null value”) between two known time grain data points. For example, if in the time selector you picked “1 minute” time granularity but the metric was reported at 12:01, 12:02, 12:04, and 12:05 (note a minute gap between second and third data points), then a dashed line will connect 12:02 and 12:04 and a solid line will connect all other data points. The dashed line drops down to zero when the metric uses “Count” and “Sum” aggregation. For the “Average”, “Minimum” or “Maximum” aggregations, the dashed line simply connects two nearest known data points. Also, when the data is missing on the rightmost or leftmost side of the chart, the dashed line expands to the direction of the missing data point.
  ![metric image](./media/metrics-troubleshoot/missing-data-point-line-chart.png)

**Solution:** This behavior is by design. The line chart is a superior choice for visualizing trends or high-density metrics but often may be difficult to interpret for the metrics with sparse values, especially when corelating values with time grain is important. The dashed line makes reading these charts easier but if your chart is still unclear, consider viewing your metrics with a different chart type. For example, a scattered plot chart for the same metric clearly shows each time grain by only visualizing a dot when there is a value and skipping the data point altogether when the value is missing:
  ![metric image](./media/metrics-troubleshoot/missing-data-point-scatter-chart.png)

   > [!NOTE]
   > If you still prefer to use a line chart, moving your mouse over the chart may help you assess the time granularity by highlighting the data point at the location of the mouse pointer.
