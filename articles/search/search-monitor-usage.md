---
title: Monitor operations and activity
titleSuffix: Azure Cognitive Search
description: Enable logging, get query activity metrics, resource usage, and other system data from an Azure Cognitive Search service.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/11/2020
---

# Monitor operations and activity of Azure Cognitive Search

This article introduces monitoring at the service (resource) level, at the workload level (queries and indexing), and suggests a framework for monitoring user access. 

Across the spectrum, you'll use a combination of built-in infrastructure and foundational services like Azure Monitor, as well as service APIs that return statistics, counts, and status. Understanding the range of capabilities will help you configure or create an effective communication system for proactive responses to problems as they emerge.

## Use Azure Monitor

Many services, including Azure Cognitive Search, leverage [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/) for alerts, metrics, and logging diagnostic data. For Azure Cognitive Search, the built-in monitoring infrastructure is used primarily for resource-level monitoring (service health) and [query monitoring](search-monitor-queries.md).

The following screenshot helps you locate Azure Monitor features in the portal.

+ **Monitoring** tab, located in the main overview page, shows key metrics at a glance.
+ **Activity log**, just below Overview, reports on resource-level actions: service health and API key request notifications.
+ **Monitoring**, further down the list, provides configurable alerts, metrics, and diagnostic logs. Create these when you need them. Once data is collected and stored, you can query or visualize the information for insights.

![Azure Monitor integration in a search service](./media/search-monitor-usage/azure-monitor-search.png
 "Azure Monitor integration in a search service")

### Precision of reported numbers

Portal pages are refreshed every few minutes. As such, numbers reported in the portal are approximate, intended to give you a general sense of how well your system is servicing requests. Actual metrics, such as queries per second (QPS) may be higher or lower than the number shown on the page.

## Activity logs

The [**Activity log**](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view) collects information from Azure Resource Manager and reports on changes to service health. You can monitor the activity log for critical, error, and warning conditions related to service health.

For in-service tasks - such as queries, indexing, or creating objects - you'll see generic informational notifications like *Get Admin Key* and *Get Query keys* for each request, but not the specific action itself. For information of this grain, you must configure diagnostic logging.

You can access the **Activity log** from the left-navigation pane, or from Notifications in the top window command bar, or from the **Diagnose and solve problems** page.

## Resource consumption

Tabbed pages built into the Overview page report out on resource consumption. This information becomes available as soon as you start using the service, with no configuration required. This page is refreshed every few minutes. If you are finalizing decisions about [which tier to use for production workloads](search-sku-tier.md), or whether to [adjust the number of active replicas and partitions](search-capacity-planning.md), these metrics can help you with those decisions by showing you how quickly resources are consumed and how well the current configuration handles the existing load.

The **Usage** tab shows you resource availability relative to current [limits](search-limits-quotas-capacity.md) imposed by the service tier. 

The following illustration is for the free service, which is capped at 3 objects of each type and 50 MB of storage. A Basic or Standard service has higher limits, and if you increase the partition counts, maximum storage goes up proportionally.

![Usage status relative to tier limits](./media/search-monitor-usage/usage-tab.png
 "Usage status relative to tier limits")

## View log files

You can use any JSON editor to view the log file. If you don't have one, we recommend [Visual Studio Code](https://code.visualstudio.com/download).

1. In Azure portal, open your Storage account. 

2. In the left-navigation pane, click **Blobs**. You should see **insights-logs-operationlogs** and **insights-metrics-pt1m**. These containers are created by Azure Cognitive Search when the log data is exported to Blob storage.

3. Click down the folder hierarchy until you reach the .json file.  Use the context-menu to download the file.

Once the file is downloaded, open it in a JSON editor to view the contents.

## Next steps

Fluency with Azure Monitor is essential for oversight of any Azure service, including resources like Azure Cognitive Search. If you are not familiar with Azure Monitor, take the time to review articles related to resources. In addition to tutorials, the following article is a good place to start.

> [!div class="nextstepaction"]
> [Monitoring Azure resources with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/insights/monitor-azure-resource)
