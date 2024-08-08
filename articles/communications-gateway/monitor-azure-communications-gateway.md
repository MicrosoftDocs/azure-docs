---
title: Monitor Azure Communications Gateway
description: Start here to learn how to monitor Azure Communications Gateway. Use Azure Monitor and Azure Resource Health to monitor your Azure Communications Gateway.
ms.date: 06/17/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: rcdun
ms.author: rdunstan
ms.service: azure-communications-gateway
---

# Monitor Azure Communications Gateway

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

This article also describes how to use Azure Resource Health to monitor your Azure Communications Gateway.

If you notice any concerning resource health indicators or metrics, you can [raise a support ticket](request-changes.md).

The following sections describe the specific data gathered for Azure Communications Gateway. These sections also discuss how to configure data collection and analyze this data with Azure tools.

> [!TIP]
> To understand costs associated with Azure Monitor, see [Azure Monitor cost and usage](../azure-monitor/cost-usage.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure Communications Gateway, see [Azure Communications Gateway monitoring data reference](monitoring-azure-communications-gateway-data-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Azure Communications Gateway, see [Azure Communications Gateway monitoring data reference](monitoring-azure-communications-gateway-data-reference.md#metrics).

## Analyzing, filtering and splitting metrics in Azure Monitor

You can analyze metrics for Azure Communications Gateway, along with metrics from other Azure services, by opening **Metrics** from the **Azure Monitor** menu. See [Analyze metrics with Azure Monitor metrics explorer](../azure-monitor/essentials/analyze-metrics.md) for details on using this tool.

Azure Communications Gateway metrics support the **Region** dimension, allowing you to filter any metric by the Service Locations defined in your Azure Communications Gateway resource. Connectivity metrics also support the **OPTIONS** or **INVITE** dimension.

You can also split a metric by these dimensions to visualize how different segments of the metric compare with each other.

For more information on filtering and splitting, see [Advanced features of Azure Monitor](../azure-monitor/essentials/metrics-charts.md).

[!INCLUDE [horz-monitor-no-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)]

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

## What is Azure Resource Health?

Azure Resource Health provides a personalized dashboard of the health of your resources. This dashboard helps you diagnose and get support for service problems that affect your Azure resources. It reports on the current and past health of your resources.

Resource Health reports one of the following statuses for each resource.

- *Available*: there are no known problems with your resource.
- *Degraded*: a problem with your resource is reducing its performance.
- *Unavailable*: there's a significant problem with your resource or with the Azure platform. For Azure Communications Gateway, this status usually means that calls can't be handled.
- *Unknown*: Resource Health doesn't receive information about the resource for more than 10 minutes.

For more information, see [Resource Health overview](../service-health/resource-health-overview.md).

## Using Azure Resource Health

To access Resource Health for Azure Communications Gateway:

1. Sign in to the [Azure portal](https://azure.microsoft.com/).
1. In the search bar at the top of the page, search for your Communications Gateway resource.
1. Select your Communications Gateway resource.
1. In the menu in the left pane, select **Resource health**.

You can also [configure Resource Health alerts in the Azure portal](../service-health/resource-health-alert-monitor-guide.md). These alerts can notify you in near real-time when these resources have a change in their health status.

Azure Communications Gateway supports the following [resource health checks](../service-health/resource-health-checks-resource-types.md#microsoftvoiceservicescommunicationsgateway).

## Related content

- See [Azure Communications Gateway monitoring data reference](monitoring-azure-communications-gateway-data-reference.md) for a reference of the metrics, logs, and other important values created for Azure Communications Gateway.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
- See [Resource Health overview](../service-health/resource-health-overview.md) for an overview of Resource Health.
