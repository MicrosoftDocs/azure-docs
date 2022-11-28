---
title: Azure Monitor for Azure Cache for Redis | Microsoft Docs
description: This article describes the Azure Monitor for Azure Redis Cache feature, which provides cache owners with a quick understanding of performance and utilization problems.
author: flang-msft

ms.author: franlanglois
ms.topic: conceptual
ms.service: cache
ms.date: 11/22/2022
ms.custom: subject-monitoring, ignite-2022, 

---

# Explore Azure Monitor for Azure Cache for Redis

For all of your Azure Cache for Redis resources, Azure Monitor for Azure Cache for Redis provides a unified, interactive view of:

- Overall performance
- Failures
- Capacity
- Operational health

This article helps you understand the benefits of this new monitoring experience. It also shows how to modify and adapt the experience to fit the unique needs of your organization.

## Introduction

Before starting the experience, you should understand how Azure Monitor for Azure Cache for Redis visually presents information.

It delivers:

- **At scale perspective** of your Azure Cache for Redis resources in a single location across all of your subscriptions. You can selectively scope to only the subscriptions and resources you want to evaluate.

- **Drill-down analysis** of a particular Azure Cache for Redis resource. You can diagnose problems and see detailed analysis of utilization, failures, capacity, and operations. Select any of these categories to see an in-depth view of  relevant information.  

- **Customization** of this experience, which is built atop Azure Monitor workbook templates. The experience lets you change what metrics are displayed and modify or set thresholds that align with your limits. You can save the changes in a custom workbook and then pin workbook charts to Azure dashboards.

This feature doesn't require you to enable or configure anything. Azure Cache for Redis information is collected by default.

>[!NOTE]
>There is no charge to access this feature. You're charged only for the Azure Monitor essential features you configure or enable, as described on the [Azure Monitor pricing details](https://azure.microsoft.com/pricing/details/monitor/) page.

## View utilization and performance metrics for Azure Cache for Redis

To view the utilization and performance of your storage accounts across all of your subscriptions, do the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for **Monitor**, and select **Monitor**.

    :::image type="content" source="../cosmos-db/media/insights-overview/search-monitor.png" alt-text="Search box with the word 'Monitor' and the Services search result that shows 'Monitor' with a speedometer symbol":::

1. Select **Azure Cache for Redis**. If this option isn't present, select **More** > **Azure Cache for Redis**.

### Overview

On **Overview**, the table displays interactive Azure Cache for Redis metrics. You can filter the results based on the options you select from the following drop-down lists:

- **Subscriptions**: Only subscriptions that have an Azure Cache for Redis resource are listed.  

- **Azure Cache for Redis**: You can select all, a subset, or a single Azure Cache for Redis resource.

- **Time Range**: By default, the table displays the last four hours of information based on the corresponding selections.

There's a counter tile under the drop-down lists. The tile shows the total number of Azure Cache for Redis resources in the selected subscriptions. Conditional color codes or heat maps for workbook columns report transaction metrics. The deepest color represents the highest value. Lighter colors represent lower values.

Selecting a drop-down list arrow next to one of the Azure Cache for Redis resources reveals a breakdown of the performance metrics at the individual resource level.

:::image type="content" source="./media/cache-insights-overview/overview.png" alt-text="Screenshot of the overview experience.":::

When you select the Azure Cache for Redis resource name highlighted in blue, you see the default **Overview** table for the associated account. It shows these columns:

- **Used Memory**
- **Used Memory Percentage**
- **Server Load**
- **Server Load Timeline**
- **CPU**
- **Connected Clients**
- **Cache Misses**
- **Errors (Max)**

### Operations

When you select **Operations** at the top of the page, the **Operations** table of the workbook template opens. It shows these columns:

- **Total Operations**
- **Total Operations Timeline**
- **Operations Per Second**
- **Gets**
- **Sets**

:::image type="content" source="./media/cache-insights-overview/operations.png" alt-text="Screenshot of the operations experience.":::

### Usage

When you select **Usage** at the top of the page, the **Usage** table of the workbook template opens. It shows these columns:

- **Cache Read**
- **Cache Read Timeline**
- **Cache Write**
- **Cache Hits**
- **Cache Misses**

:::image type="content" source="./media/cache-insights-overview/usage.png" alt-text="Screenshot of the usage experience.":::

### Failures

When you select **Failures** at the top of the page, the **Failures** table of the workbook template opens. It shows these columns:

- **Total Errors**
- **Failover/Errors**
- **UnresponsiveClient/Errors**
- **RDB/Errors**
- **AOF/Errors**
- **Export/Errors**
- **Dataloss/Errors**
- **Import/Errors**

:::image type="content" source="./media/cache-insights-overview/failures.png" alt-text="Screenshot of failures with a breakdown by HTTP request type.":::

### Metric definitions

For a full list of the metric definitions that form these workbooks, check out the [article on available metrics and reporting intervals](./cache-how-to-monitor.md#create-your-own-metrics).

## View from an Azure Cache for Redis resource

To access Azure Monitor for Azure Cache for Redis directly from an individual resource:

1. In the Azure portal, select Azure Cache for Redis.

2. From the list, choose an individual Azure Cache for Redis resource. In the monitoring section, choose Insights.

    :::image type="content" source="./media/cache-insights-overview/insights.png" alt-text="Screenshot of Menu options with the words 'Insights' highlighted in a red box.":::

These views are also accessible by selecting the resource name of an Azure Cache for Redis resource from the Azure Monitor level workbook.

### Resource-level overview

On the **Overview** workbook for the Azure Redis Cache, it shows several performance metrics that give you access to:

- Interactive performance charts showing the most essential details related to Azure Cache for Redis performance.

- Metrics and status tiles highlighting shard performance, total number of connected clients, and overall latency.

:::image type="content" source="./media/cache-insights-overview/resource-overview.png" alt-text="Screenshot of Insight overview dashboard displaying information such as Server load, CPU performance, used memory, connected clients, errors, expired keys, and evicted keys.":::

Selecting any of the other tabs for **Performance** or **Operations** opens that workbooks.

### Resource-level performance

:::image type="content" source="./media/cache-insights-overview/resource-performance.png" alt-text="Screenshot of Azure cache for Redis graphs on the performance tab.":::

### Resource-level operations

:::image type="content" source="./media/cache-insights-overview/resource-operations.png" alt-text="Screenshot  Azure of cache for Redis graphs on the operations tab.":::

## Pin, export, and expand

To pin any metric section to an [Azure dashboard](../azure-portal/azure-portal-dashboards.md), select the pushpin symbol in the section's upper right.

:::image type="content" source="../cosmos-db/media/insights-overview/pin.png" alt-text="Screenshot of metrics with the pushpin symbol highlighted.":::

To export your data into an Excel format, select the down arrow symbol to the left of the pushpin symbol.

:::image type="content" source="../cosmos-db/media/insights-overview/export.png" alt-text="Screenshot showing a highlighted export-workbook symbol.":::

To expand or collapse all views in a workbook, select the expand symbol to the left of the export symbol.

:::image type="content" source="../cosmos-db/media/insights-overview/expand.png" alt-text="Screenshot of  highlighted expand-workbook symbol.":::

## Customize Azure Monitor for Azure Cache for Redis

Because this experience is built atop Azure Monitor workbook templates, you can select **Customize** > **Edit** > **Save** to save a copy of your modified version into a custom workbook.

:::image type="content" source="../cosmos-db/media/insights-overview/customize.png" alt-text="Screenshot of command bar with customize highlighted.":::

Workbooks are saved within a resource group in either the **My Reports** section or the **Shared Reports** section. **My Reports** is available only to you. **Shared Reports** is available to everyone with access to the resource group.

After you save a custom workbook, go to the workbook gallery to open it.

:::image type="content" source="../cosmos-db/media/insights-overview/gallery.png" alt-text="Screenshot of a command bar with Gallery highlighted.":::

## Troubleshooting

For troubleshooting guidance, refer to the dedicated workbook-based insights [troubleshooting article](../azure-monitor/insights/troubleshoot-workbooks.md).

## Next steps

- Configure [metric alerts](../azure-monitor/alerts/alerts-metric.md) and [service health notifications](../service-health/alerts-activity-log-service-notifications-portal.md) to set up automated alerts that aid in detecting problems.
- Learn the scenarios that workbooks support, how to author or customize reports, and more by reviewing [Create interactive reports with Azure Monitor workbooks](../azure-monitor/visualize/workbooks-overview.md).
