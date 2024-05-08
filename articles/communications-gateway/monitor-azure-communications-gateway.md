---
title: Monitor Azure Communications Gateway
description: Start here to learn how to monitor Azure Communications Gateway. Use Azure Monitor and Azure Resource Health to monitor your Azure Communications Gateway.
ms.date: 05/08/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: conceptual
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
---

<!-- 
According to the Content Pattern guidelines all comments must be removed before publication!!!

IMPORTANT 
To make this template easier to use, first:
1. Search and replace [TODO-replace-with-service-name] with the official name of your service.
2. Search and replace [TODO-replace-with-service-filename] with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_07
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- All sections are required unless otherwise noted. Add service-specific information after the includes.

Your service should have the following two articles:

1. The overview monitoring article (based on this template)
   - Title: "Monitor [TODO-replace-with-service-name]"
   - TOC title: "Monitor"
   - Filename: "monitor-[TODO-replace-with-service-filename].md"

2. A reference article that lists all the metrics and logs for your service (based on the template data-reference-template.md).
   - Title: "[TODO-replace-with-service-name] monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-[TODO-replace-with-service-filename]-reference.md".
-->

# Monitor Azure Communications Gateway

<!-- Intro -->
[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

This article also describes how to use Azure Resource Health to monitor your Azure Communications Gateway.

If you notice any concerning resource health indicators or metrics, you can [raise a support ticket](request-changes.md).

<!-- ## Insights. OPTIONAL. If your service has Azure Monitor insights, add the following include and add information about what your insights provide. You can refer to another article that gives details or add a screenshot. 
[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)] -->

## What is Azure Monitor?

Azure Communications Gateway creates monitoring data using [Azure Monitor](../azure-monitor/overview.md), which is a full stack monitoring service in Azure. Azure Monitor provides a complete set of features to monitor your Azure resources. It can also monitor resources in other clouds and on-premises.

Start with the article [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md), which describes the following concepts:

- What is Azure Monitor?
- Costs associated with monitoring
- Monitoring data collected in Azure
- Configuring data collection
- Standard tools in Azure for analyzing and alerting on monitoring data

The following sections build on this article by describing the specific data gathered for Azure Communications Gateway. These sections also provide examples for configuring data collection and analyzing this data with Azure tools.

> [!TIP]
> To understand costs associated with Azure Monitor, see [Azure Monitor cost and usage](../azure-monitor/cost-usage.md).

<!-- ## Resource types -->
[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure Communications Gateway, see [Azure Communications Gateway monitoring data reference](monitoring-azure-communications-gateway-data-reference.md).

<!-- ## Data storage -->
[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

<!-- ## Azure Monitor platform metrics -->
[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Azure Communications Gateway, see [Azure Communications Gateway monitoring data reference](monitoring-azure-communications-gateway-data-reference.md#metrics).

<!-- ## OPTIONAL [TODO-replace-with-service-name] metrics
If your service uses any non-Azure Monitor based metrics, add the following include and more information.
[!INCLUDE [horz-monitor-custom-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)] -->

## Analyzing, filtering and splitting metrics in Azure Monitor

You can analyze metrics for Azure Communications Gateway, along with metrics from other Azure services, by opening **Metrics** from the **Azure Monitor** menu. See [Analyze metrics with Azure Monitor metrics explorer](../azure-monitor/essentials/analyze-metrics.md) for details on using this tool.

Azure Communications Gateway metrics support the **Region** dimension, allowing you to filter any metric by the Service Locations defined in your Azure Communications Gateway resource. Connectivity metrics also support the **OPTIONS or INVITE** dimension.

You can also split a metric by these dimensions to visualize how different segments of the metric compare with each other.

For more information on filtering and splitting, see [Advanced features of Azure Monitor](../azure-monitor/essentials/metrics-charts.md).

[!INCLUDE [horz-monitor-no-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)]

<!-- ## Activity log -->
[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

<!-- ## Analyze monitoring data -->
[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

<!-- ### Azure Monitor export tools -->
[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

<!-- ## Kusto queries -->
[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]
<!-- No Kusto queries in existing content -->
<!-- REQUIRED. Add sample Kusto queries for your service here. -->

<!-- ## Alerts -->
[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

<!-- OPTIONAL. ONLY if your service (Azure VMs, AKS, or Log Analytics workspaces) offer out-of-the-box recommended alerts, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-recommended-alert-rules.md)]

<!-- OPTIONAL. ONLY if applications run on your service that work with Application Insights, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

<!-- ### [TODO-replace-with-service-name] alert rules. REQUIRED. -->

## What is Azure Resource Health?

Azure Resource Health provides a personalized dashboard of the health of your resources. This dashboard helps you diagnose and get support for service problems that affect your Azure resources. It reports on the current and past health of your resources.

Resource Health reports one of the following statuses for each resource.

- *Available*: there are no known problems with your resource.
- *Degraded*: a problem with your resource is reducing its performance.
- *Unavailable*: there's a significant problem with your resource or with the Azure platform. For Azure Communications Gateway, this status usually means that calls can't be handled.
- *Unknown*: Resource Health hasn't received information about the resource for more than 10 minutes.

For more information, see [Resource Health overview](../service-health/resource-health-overview.md).

## Using Azure Resource Health

To access Resource Health for Azure Communications Gateway:

1. Sign in to the [Azure portal](https://azure.microsoft.com/).
1. In the search bar at the top of the page, search for your Communications Gateway resource.
1. Select your Communications Gateway resource.
1. In the menu in the left pane, select **Resource health**.

You can also [configure Resource Health alerts in the Azure portal](../service-health/resource-health-alert-monitor-guide.md). These alerts can notify you in near real-time when these resources have a change in their health status.

### Azure Communications Gateway alert rules

The following table lists some suggested alert rules for Azure Communications Gateway. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [Azure Communications Gateway monitoring data reference](monitoring-azure-communications-gateway-data-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
| | | |
| | | |

<!-- ### Advisor recommendations -->
[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure Communications Gateway monitoring data reference](monitoring-azure-communications-gateway-data-reference.md) for a reference of the metrics, logs, and other important values created for Azure Communications Gateway.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
- See [Resource Health overview](../service-health/resource-health-overview.md) for an overview of Resource Health.
