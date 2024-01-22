---
title: Monitoring your Azure Communications Gateway
description: Start here to learn how to monitor Azure Communications Gateway.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: conceptual
ms.custom: subject-monitoring
ms.date: 08/23/2023
---

# Monitoring Azure Communications Gateway

When you have critical applications and business processes relying on Azure resources, you want to monitor those resources for their availability, performance, and operation. This article describes how you can use Azure Monitor and Azure Resource Health to monitor your Azure Communications Gateway.

If you notice any concerning resource health indicators or metrics, you can [raise a support ticket](request-changes.md).

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

## Azure Monitor data for Azure Communications Gateway

Azure Communications Gateway collects metrics. See [Monitoring Azure Communications Gateway data reference](monitoring-azure-communications-gateway-data-reference.md) for detailed information on the metrics created by Azure Communications Gateway. Azure Communications Gateway doesn't collect logs.

 For clarification on the different types of metrics available in Azure Monitor, see [Monitoring data from Azure resources](../azure-monitor/essentials/monitor-azure-resource.md#monitoring-data-from-azure-resources).

## Analyzing, filtering and splitting metrics in Azure Monitor

You can analyze metrics for Azure Communications Gateway, along with metrics from other Azure services, by opening **Metrics** from the **Azure Monitor** menu. See [Analyze metrics with Azure Monitor metrics explorer](../azure-monitor/essentials/analyze-metrics.md) for details on using this tool.

All Azure Communications Gateway metrics support the **Region** dimension, allowing you to filter any metric by the Service Locations defined in your Azure Communications Gateway resource. 

You can also split a metric by the **Region** dimension to visualize how different segments of the metric compare with each other. 

For more information on filtering and splitting, see [Advanced features of Azure Monitor](../azure-monitor/essentials/metrics-charts.md).

## Alerts in Azure Monitor

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. You can set alerts on [metrics](/azure/azure-monitor/alerts/alerts-metric-overview) and the [activity log](/azure/azure-monitor/alerts/activity-log-alerts). Different types of alerts have benefits and drawbacks.

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

## Next steps

- See [Monitoring Azure Communications Gateway data reference](monitoring-azure-communications-gateway-data-reference.md) for a reference of the metrics, logs, and other important values created by Azure Communications Gateway.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for an overview of monitoring Azure resources.
- See [Resource Health overview](../service-health/resource-health-overview.md) for an overview of Resource Health.