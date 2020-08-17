---
title: Tutorial - Create a metrics chart in Azure Monitor
description: Learn how to create your first metric chart with Azure metrics explorer.
author: bwren
ms.author: bwren
ms.subservice: metrics
ms.topic: tutorial
ms.date: 03/09/2020
---

# Tutorial: Create a metrics chart in Azure Monitor
Metrics explorer is a feature of Azure Monitor in the Azure portal that allows you to create charts from metric values, visually correlate trends, and investigate spikes and dips in metric values. Use the metrics explorer to investigate the health and utilization of your Azure resources or to plot charts from custom metrics. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Select a metric for which you want to plot a chart
> * Perform different aggregations of metric values
> * Modify the time range and granularity for the chart

Following is a video that shows a more extensive scenario than the procedure outlined in this article. If you are new to metrics, we suggest you read through this article first and then view the video to see more specifics. 

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4qO59]

## Prerequisites

To complete this tutorial you need an Azure resource to monitor. You can use any resource in your Azure subscription that supports metrics. To determine whether a resource supports metrics, go to its menu in the Azure portal and verify that there's a **Metrics** option in the **Monitoring** section of the menu.


## Log in to Azure
Log in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Open metrics explorer and select a scope
You can open metrics explorer either from the Azure Monitor menu or from a resource's menu in the Azure portal. Metrics from all resources are available regardless of which option you use. 

1. Select **Metrics** from the **Azure Monitor** menu or from the **Monitoring** section of a resource's menu.

1. Select the **Scope**, which is the resource you want to see metrics for. The scope is already populated if you opened metrics explorer from a resource's menu.

    ![Select a scope](media/tutorial-metrics-explorer/scope-picker.png)

2. Select a **Namespace** if the scope has more than one. The namespace is just a way to organize metrics so that you can easily find them. For example, storage accounts have separate namespaces for storing Files, Tables, Blobs, and Queues metrics. Many resource types only have one namespace.

3. Select a metric from a list of available metrics for the selected scope and namespace.

    ![Select a metric](media/tutorial-metrics-explorer/metric-picker.png)

4. Optionally, change the metric **Aggregation**. This defines how the metric values will aggregated across the time granularity for the graph. For example, if the time granularity is set to 15 minutes and the aggregation is set to sum, then each point in the graph will be the sum of all collected values over each 15 minute segment.

    ![Chart](media/tutorial-metrics-explorer/chart.png)

5. Use the **Add metric** button and repeat these steps if you want to see multiple metrics plotted in the same chart. For multiple charts in one view, select the **New chart** button.

## Select a time range and granularity

By default, the chart shows the most recent 24 hours of metrics data. Use the time picker to change the **Time range** for the chart or the **Time granularity** which defines the time range for each data point. The chart uses the specified aggregation to calculate all sampled values over the time granularity specified.

![Change time range panel](media/tutorial-metrics-explorer/time-picker.png)


Use the **time brush** to investigate an interesting area of the chart such as a spike or a dip. Put the mouse pointer at the beginning of the area, click and hold the left mouse button, drag to the other side of area, and release the button. The chart will zoom in on that time range. 

![Time brush](media/tutorial-metrics-explorer/time-brush.png)

## Apply dimension filters and splitting
See the following references for advanced features that allow you to perform additional analysis on your metrics and identify potential outliers in your data.

- [Filtering](../platform/metrics-charts.md#apply-filters-to-charts) lets you choose which dimension values are included in the chart. For example, you might want to show only successful requests when charting a *server response time* metric. 

- [Splitting](../platform/metrics-charts.md#apply-splitting-to-a-chart) controls whether the chart displays separate lines for each value of a dimension, or aggregates the values into a single line. For example, you might want to see one line for an average response time across all server instances or you may want separate lines for each server. 

See [examples of the charts](../platform/metric-chart-samples.md) that have filtering and splitting applied.

## Advanced chart settings

You can customize chart style, title, and modify advanced chart settings. When done with customization, pin it to a dashboard to save your work. You can also configure metrics alerts. See [Advanced features of Azure Metrics Explorer](../platform/metrics-charts.md#lock-boundaries-of-chart-y-axis) to learn about these and other advanced features of Azure Monitor metrics explorer.


## Next steps
Now that you've learned how to work with metrics in Azure Monitor, learn how to use metrics to send proactive alerts.

> [!div class="nextstepaction"]
> [Create, view, and manage metric alerts using Azure Monitor](../platform/alerts-metric.md)

