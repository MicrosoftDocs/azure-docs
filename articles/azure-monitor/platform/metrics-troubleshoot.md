---
title: Troubleshooting Azure metrics explorer
description: Troubleshoot the issues that you might experience while creating or interpreting metrics charts
author: vgorbenko
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 04/23/2019
ms.author: vitalyg
ms.subservice: metrics
---

# Troubleshooting Azure Metrics Explorer

Use this article if you are unsure how to interpret the data shown in Metrics Explorer or if you run into issues with creating or customizing your charts. If you are new to metrics, learn about [getting started](metrics-getting-started.md) with Metrics Explorer and its  [advanced features](metrics-charts.md). You can also see [examples](metric-chart-samples.md) of the configured metric charts.

## Charts shows unexpected drops in values

In many cases, the perceived drop in the metric values is a matter of the incorrect interpretation of the data shown on the chart. You might be misled by a drop in sums or counts when the chart shows the most-recent minutes because the last metric data points haven’t been received or processed by Azure yet. Depending on the service, the latency of processing metrics may be within a couple minutes range. For charts showing a recent time range with a 1- or 5- minute granularity, a drop of the value over the last few minutes becomes more noticeable to users.

This behavior is by design. We believe that showing data as soon as we receive it is beneficial even when the data is partial or incomplete. Doing so allows you to make important conclusion sooner and start investigation right away. For example, for a metric that shows the number of failures, seeing a partial value X tells you that there were at least X failures on a given minute. You can start investigating the problem right away, rather than waiting to see the exact count of failures that happened on this minute, which might not be as important. The chart will of course update once we receive the entire set of data (but at that time you may have another more recent incomplete data point for the next minute that was rendered based on partial data).

## Chart doesn’t show any data

Some resources don’t constantly emit their metrics. For example, Azure will not collect metrics for stopped virtual machines. Other resources might emit their metrics only when some condition occurs. For example, a metric showing processing time of a transaction requires at least one transaction. If there were no transactions in the selected time range, the chart will naturally be empty. Additionally, while most of the metrics in Azure are collected every minute, there are some that are collected less frequently. See the metric documentation to get more details about the metric that you are trying to explore. If you believe that the metric should have some data, but the chart still renders blank, try the following steps:

   1. Change the time of the chart to a wider range. You may start from “Last 30 days” using a larger time granularity (or relying on the “Automatic time granularity” option).

   1. Verify that the y-axis boundaries of the chart aren’t locked outside of the range of the metric values. If the y-axis boundaries are locked, you may want to temporarily reset them to ensure that the metric values don’t fall outside of the chart range. Note that locking the y-axis range isn’t recommended with automatic granularity for the charts with sum, min, and max aggregation because their values will change with granularity by resizing browser window or going from one screen resolution to another. This may leave your charts display area empty. 

   1. Some of the metrics require additional onboarding steps. Collection of some metrics requires configuring the Azure Diagnostic Extension or enabling it using the Diagnostic Settings. 

## I see “Error retrieving data” message over a metric chart

This problem is common when the dashboard shows a metric that was deprecated and removed from Azure. To verify that it is the case, open the Metrics tab for your resource, and check the available metrics in the metric picker. If the metric is not shown, the metric has been removed. Usually, when a metric is deprecated, there is a better new metric that provides with a similar perspective on the resource health. In this case you can update your erroring tile on the dashboard with a new chart that will show the new metric. For a list of supported metrics for each resource type use this link.

## I see a dashed line on the chart
Azure metrics charts use dashed line style to indicate that there is a missing value (also known as “null value”) between two known time grain datapoints. For example, if in the time selector you picked “1 minute” time granularity but the metric was reported at 12:01, 12:02, 12:04, and 12:05 (note a minute gap between second and third data points), then a dashed line will connect 12:02 and 12:04 and a solid line will connect all other data points. The dashed line drops down to zero when the metrics uses “Count” and “Sum” aggregation. For the “Average”, “Minimum” or “Maximum” aggregations, the dashed line simply connects two nearest known data points. Also, when the data is missing on the rightmost or leftmost side of the chart, the dashed line expands to the direction of the missing data point.

This behavior is by design. The line chart is a superior choice for visualizing trends or high-density metrics but often may be difficult to interpret for the metrics with sparse values, especially when corelating values with time grain is important. The dashed line makes reading these charts easier but if your chart is still unclear, consider viewing your metrics with a different chart type. For example, scattered plots or bar charts clearly show each time grain by only visualizing a dot or a bar when there is a value and skipping the data point altogether when the value is missing. If you still prefer to use a line chart, moving your mouse over the chart may help you assess the time granularity by highlighting the datapoint at the location of the mouse pointer.
