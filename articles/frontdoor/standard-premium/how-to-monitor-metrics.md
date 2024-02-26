---
title: Monitoring metrics for Azure Front Door
description: This article describes the Azure Front Door monitoring metrics.
services: frontdoor
author: duongau
manager: KumudD
ms.service: frontdoor
ms.topic: how-to
ms.date: 02/23/2023
ms.author: yuajia
---

# Real-time monitoring in Azure Front Door

Azure Front Door is integrated with Azure Monitor.  You can use metrics in real time to measure traffic to your application, and to track, troubleshoot, and debug issues.  

You can also configure alerts for each metric such as a threshold for 4XXErrorRate or 5XXErrorRate. When the error rate exceeds the threshold, it will trigger an alert as configured. For more information, see [Create, view, and manage metric alerts using Azure Monitor](../../azure-monitor/alerts/alerts-metric.md). 

## Access metrics in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Front Door Standard/Premium profile.

1. Under **Monitoring**, select **Metrics**.

1. In **Metrics**, select the metric to add:

   :::image type="content" source="../media/how-to-monitoring-metrics/front-door-metrics-1.png" alt-text="Screenshot of metrics page." lightbox="../media/how-to-monitoring-metrics/front-door-metrics-1-expanded.png":::

1. Select **Add filter** to add a filter:

    :::image type="content" source="../media/how-to-monitoring-metrics/front-door-metrics-2.png" alt-text="Screenshot of adding filters to metrics." lightbox="../media/how-to-monitoring-metrics/front-door-metrics-2-expanded.png":::
    
1. Select **Apply splitting** to split data by different dimensions:

   :::image type="content" source="../media/how-to-monitoring-metrics/front-door-metrics-4.png" alt-text="Screenshot of adding dimensions to metrics." lightbox="../media/how-to-monitoring-metrics/front-door-metrics-4-expanded.png":::

1. Select **New chart** to add a new chart:

## Configure alerts in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Front Door Standard/Premium profile.

1. Under **Monitoring**, select **Alerts**.

1. Select **New alert rule** for metrics listed in Metrics section.

Alert will be charged based on Azure Monitor. For more information about alerts, see [Azure Monitor alerts](../../azure-monitor/alerts/alerts-overview.md).

## Next steps

- Learn about [Azure Front Door reports](how-to-reports.md).
- Learn about [Azure Front Door logs](how-to-logs.md).
