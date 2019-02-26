---
title: Getting started with Azure Metrics Explorer
description: Learn how to create your first metric chart with Azure Metrics Explorer.
author: vgorbenko
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 02/25/2019
ms.author: vitalyg
ms.subservice: metrics
---

# Getting started with Azure Metrics Explorer

> [!NOTE] This topic covers key concepts to help new users to get started with Azure Metrics Explorer. Use [this link](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-charts) if you are looking for detailed documentation or information about advanced chart settings.

Use **Azure Metrics Explorer** to create health and utilization charts for your resources. Picking a resource and a metric is all you need to create a simple metric chart.  After that you may need to point the chart to a time range that is relevant for your investigation. Use filtering and splitting capabilities to analyze which segments of the metric contribute to the overall value and identify possible outliers. Use advanced settings to customize the chart before pinning to dashboard. Configure metric alerts to receive notifications when the metric value exceeds or drops below the threshold.

## Creating your first metric chart

To create a metric chart, from your resource, resource group, subscription, or Azure Monitor view, open **Metrics** tab and follow these steps:

1. Using a **resource picker**, select your resource for which you want to see metrics. (The resource is pre-selected if you opened the **Metrics** in the context of a specific resource):

    > ![Select a resource](./media/metrics-getting-started/resource-picker.png)

2. For some resources, you must pick a namespace. The namespace is just a way to organize metrics so that you can easily find them. For example, storage accounts have separate namespaces for storing Files, Tables, Blobs, and Queues metrics. Many resource types only have one namespace.

3. Select a metric from a list of available metrics:

    > ![Select a metric](./media/metrics-getting-started/metric-picker.png)

4. You can optionally change metric aggregation. For example, you might want your chart to show minimum, maximum or average values of the metric.

> [!NOTE] Use the **Add Metric** button and repeat these steps if you want to see multiple metrics plotted in the same chart. For multiple charts in one view, use the **Add Chart** button on top.

## Picking time range

By default, the chart shows the most recent 24 hours of metrics data. Use the **Time Picker** panel to change the time range, or to zoom in and zoom out your chart:

![Change time range panel](./media/metrics-getting-started/time-picker.png)

## Applying dimension filters and splitting

Use filtering and splitting capabilities to analyze which segments of the metric contribute to the overall value and identify possible outliers.

## Advanced chart settings and next steps

You can customize chart style, title, and modify advanced chart settings. When you are done with customization, pin it to a dashboard to save your work.  You can also configure metrics alerts. Follow product documentation to learn about these and other advanced features of Azure Monitor metrics explorer.

## Next steps

* See a list of available metrics for Azure services
* See examples of created charts (metric-chart-samples.md)
* Learn more about [Metric Explorer](metrics-charts.md)