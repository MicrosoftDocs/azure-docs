---
title: "include file" 
description: "include file" 
services: azure-monitor
author: bwren
tags: azure-service-management
ms.topic: "include"
ms.date: 08/26/2021
ms.author: bwren
ms.custom: "include file"
---

Use [metrics explorer](../articles/azure-monitor/essentials/metrics-getting-started.md) to interactively analyze metric data collected from Azure resources. This includes any platform metrics 

Select **Metrics** from the virtual machine's menu in the Azure portal to open metrics explorer. The **Scope** will already be set to the current resource. 

:::image type="content" source="./media/azure-monitor-horizontal/metrics-explorer-open.png alt-text="Open metrics explorer":::

Select a **Metric Namespace**. Namespaces are a way to organize similar sets of metrics. Some resources will have a single namespace while others will have multiple namespaces. 

:::image type="content" source="./media/azure-monitor-horizontal/metrics-explorer-open.png alt-text="Select a namespace":::

Select a **Metric** to add to the chart and then click **Add metric**.

:::image type="content" source="./media/azure-monitor-horizontal/metrics-explorer-metric.png alt-text="Select a metric":::

Optionally, change the [aggregation](../articles/azure-monitor/essentials/metrics-charts.md#aggregation) which defines how each value on the chart is calculated from the values collected in each time grain. The aggregations that are available depend on the metric value that you selected. 

:::image type="content" source="./media/azure-monitor-horizontal/metrics-explorer-aggregation.png alt-text="Select a metric":::

Change the **time range** and **time granularity** for the graph by selecting the time picker.

:::image type="content" source="./media/azure-monitor-horizontal/metrics-explorer-time-range.png alt-text="Change the time range and granularity":::



