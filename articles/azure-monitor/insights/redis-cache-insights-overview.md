---
title: Azure Monitor for Azure Cache for Redis (preview)| Microsoft Docs
description: This article describes the Azure Monitor for Redis Cache feature that provides Azure Cache for Redis owners with a quick understanding of performance and utilization issues.
ms.topic: conceptual
author: mrbullwinkle    
ms.author: mbullwin
ms.date: 05/07/2020

---

# Explore Azure Monitor for Azure Cache for Redis (preview)

Azure Monitor for Azure Cache for Redis (preview) provides a view of the overall performance, failures, capacity, and operational health of all your Azure Cache for Redis resources in a unified interactive experience. This article will help you understand the benefits of this new monitoring experience, and how you can modify and adapt the experience to fit the unique needs of your organization.

## Introduction

Before diving into the experience, you should understand how it presents and visualizes information.

It delivers:

* **At scale perspective** of your Azure Cache for Redis resources across all your subscriptions in a single location, with the ability to selectively scope to only those subscriptions and resources you are interested in evaluating.

* **Drill down analysis** of a particular Azure Cache for Redis resource to help diagnose issues or perform detailed analysis by category - utilization, failures, capacity, and operations. Selecting any one of those options provides an in-depth view of the relevant.  

* **Customizable** - This experience is built on top of Azure Monitor workbook templates allowing you to change what metrics are displayed, modify or set thresholds that align with your limits, and then save into a custom workbook. Charts in the workbooks can then be pinned to Azure dashboards.  

This feature does not require you to enable or configure anything, these Azure Cache for Redis are collected by default.

>[!NOTE]
>There is no charge to access this feature and you will only be charged for the Azure Monitor essential features you configure or enable, as described on the [Azure Monitor pricing details](https://azure.microsoft.com/pricing/details/monitor/) page.

## View utilization and performance metrics for Azure Cache for Redis

To view the utilization and performance of your storage accounts across all of your subscriptions, perform the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Monitor** and select **Monitor**.

    ![Search box with the word "Monitor" and a dropdown that says Services "Monitor" with a speedometer style image](./media/cosmosdb-insights-overview/search-monitor.png)

3. Select **Azure Cache for Redis (preview)**.

If this option is not present click **More** and select **Azure Cache for Redis**.

### Overview

On **Overview**, the table displays interactive Azure Cache for Redis metrics. You can filter the results based on the options you select from the following drop-down lists:

* **Subscriptions** - only subscriptions that have an Azure Cache for Redis resource are listed.  

* **Azure Cache for Redis** - You can select all, a subset, or single Azure Cache for Redis resource.

* **Time Range** - by default, displays the last 4 hours of information based on the corresponding selections made.

The counter tile under the drop-down lists rolls-up the total number of Azure Cache for Redis resources are in the selected subscriptions. There is conditional color-coding or heatmaps for columns in the workbook that report transaction metrics. The deepest color has the highest value and a lighter color is based on the lowest values.

Selecting a drop-down arrow next to one of the Azure Cache for Redis resources will reveal a breakdown of the performance metrics at the individual resource level:

![Screenshot of the overview experience](./media/redis-cache-insights-overview/overview.png)

Selecting the Azure Cache for Redis resource name highlighted in blue will take you to the default **Overview** for the associated account. It shows `Used Memory`, `Used Memory Percentage`, `Server Load`, `Server Load Timeline`, `CPU`, `Connected Clients`, `Cache Misses`, `Errors (Max)`.

### Operations

Select **Operations** at the top of the page and the **Operations** portion of the workbook template opens. It shows `Total Operations`, `Total Operations Timeline`, `Operations Per Second`, `Gets`, `Sets`.

![Screenshot of the overview experience](./media/redis-cache-insights-overview/operations.png)

### Usage

Select **Usage** at the top of the page and the **Usage** portion of the workbook template opens. It shows `Cache Read`, `Cache Read Timeline`, `CacheWrite`, `CacheHits`, `Cache Misses`.

![Screenshot of the overview experience](./media/redis-cache-insights-overview/usage.png)

Select **Failures** at the top of the page and the **Failures** portion of the workbook template opens. It shows `Total Errors`, `Failover/Errors`, `UnresponsiveClient/Errors`, `RDB/Errors`, `AOF/Errors`, `Export/Errors`, `Dataloss/Errors`, `Import/Errors`.

![Screenshot of failures with breakdown by HTTP request type](./media/redis-cache-insights-overview/failures.png)

### Metric definitions

For a full list of the metric definitions that comprise these workbooks check out the [available metrics and reporting intervals article](https://docs.microsoft.com/azure/azure-cache-for-redis/cache-how-to-monitor#available-metrics-and-reporting-intervals).

## Pin, export, and expand

You can pin any one of the metric sections to an [Azure Dashboard](https://docs.microsoft.com/azure/azure-portal/azure-portal-dashboards) by selecting the pushpin icon at the top right of the section.

![Metric section pin to dashboard example](./media/cosmosdb-insights-overview/pin.png)

To export your data into the Excel format, select the down arrow icon to the left of the pushpin 
icon.

![Export workbook icon](./media/cosmosdb-insights-overview/export.png)

To expand or collapse all drop-down views in the workbook, select the expand icon to the left of the export icon:

![Expand workbook icon](./media/cosmosdb-insights-overview/expand.png)

## Customize Azure Monitor for Azure Cache for Redis (preview)

Since this experience is built on top of Azure Monitor workbook templates, you have the ability to **Customize** > **Edit** and **Save** a copy of your modified version into a custom workbook. 

![Customize bar](./media/cosmosdb-insights-overview/customize.png)

Workbooks are saved within a resource group, either in the **My Reports** section that's private to you or in the **Shared Reports** section that's accessible to everyone with access to the resource group. After you save the custom workbook, you need to go to the workbook gallery to launch it.

![Launch workbook gallery from command bar](./media/cosmosdb-insights-overview/gallery.png)

## Next steps

* Configure [metric alerts](../platform/alerts-metric.md) and [service health notifications](../../service-health/alerts-activity-log-service-notifications.md) to set up automated alerting to aid in detecting issues.

* Learn the scenarios workbooks are designed to support, how to author new and customize existing reports, and more by reviewing [Create interactive reports with Azure Monitor workbooks](../app/usage-workbooks.md).
