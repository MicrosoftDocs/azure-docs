---
title: Monitor operations and activity
titleSuffix: Azure Cognitive Search
description: Enable logging, get query activity metrics, resource usage, and other system data from an Azure Cognitive Search service.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/30/2020
---

# Monitor operations and activity of Azure Cognitive Search

This article introduces monitoring at the service (resource) level, at the workload level (queries and indexing), and suggests a framework for monitoring user access.

You can use a combination of built-in infrastructure and foundational services like Azure Monitor, as well as service APIs that return statistics, counts, and status. Understanding the range of capabilities can help you construct a feedback loop so that you can address problems as they emerge.

## Built-in monitoring

Azure Cognitive Search uses internal data for reporting on storage consumption, query metrics, and service health information in the portal. Links in the main Overview page provide system information at a glance.

The following screenshot helps you locate Azure Monitor features in the portal. This information becomes available as soon as you start using the service, with no configuration required, and the page is refreshed every few minutes. 

+ **Monitoring** tab, located in the main overview page, you can check query volumes, latency, and whether the service had to drop queries due to pressure. No configuration steps are required for this level of monitoring. The data used for these metrics is internal to your service, with service health metrics for up to 30 days.
+ **Activity log**, just below Overview, is connected to Azure Resource Manager. The activity log reports on resource-level actions: service health, service provisioning and decommissioning, capacity adjustments, and API key request notifications.
+ **Monitoring** settings, further down the left navigation pane, provides configurable alerts, metrics, and diagnostic logs. Create these when you need them. Once data is collected and stored, you can query or visualize the information for insights.

![Azure Monitor integration in a search service](./media/search-monitor-usage/azure-monitor-search.png
 "Azure Monitor integration in a search service")

> [!NOTE]
> Portal pages are refreshed every few minutes. As such, numbers reported in the portal are approximate, intended to give you a general sense of how well your system is servicing requests. Actual metrics, such as queries per second (QPS) may be higher or lower than the number shown on the page.

### Activity logs and service health

The [**Activity log**](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view) page in the portal collects information from Azure Resource Manager and reports on changes to service health. You can monitor the activity log for critical, error, and warning conditions related to service health.

One of the more common activities are references to API keys - generic informational notifications like *Get Admin Key* and *Get Query keys*. These activities indicate requests using the admin key (create or delete objects) and queries, but do not show the request itself. For information of this grain, you must configure diagnostic logging.

You can access the **Activity log** from the left-navigation pane, or from Notifications in the top window command bar, or from the **Diagnose and solve problems** page.

### Monitor storage in the Usage tab

For visual monitoring in the portal, the **Usage** tab shows you resource availability relative to current [limits](search-limits-quotas-capacity.md) imposed by the service tier. If you are finalizing decisions about [which tier to use for production workloads](search-sku-tier.md), or whether to [adjust the number of active replicas and partitions](search-capacity-planning.md), these metrics can help you with those decisions by showing you how quickly resources are consumed and how well the current configuration handles the existing load.

The following illustration is for the free service, which is capped at 3 objects of each type and 50 MB of storage. A Basic or Standard service has higher limits, and if you increase the partition counts, maximum storage goes up proportionally.

![Usage status relative to tier limits](./media/search-monitor-usage/usage-tab.png
 "Usage status relative to tier limits")

> [!NOTE]
> Storage monitoring is limited to visuals in the portal and diagnostic logging. Alerts related to storage are not currently available; storage consumption is not aggregated or logged into the **AzureMetrics** table in Azure Monitor. To get storage alerts, you would need to [build a custom solution](https://docs.microsoft.com/azure/azure-monitor/insights/solutions-creating) that emits resource-related notifications, where your code checks for storage size and handles the response. For more information about storage metrics, see [Get Service Statistics](https://docs.microsoft.com/rest/api/searchservice/get-service-statistics#response).

## Add-on monitoring with Azure Monitor

Many services, including Azure Cognitive Search, integrate with [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/) for additional alerts, metrics, and logging diagnostic data. Azure Monitor has its own billing structure. For more information, see [Usage and estimated costs in Azure Monitor](../azure-monitor/platform/usage-estimated-costs.md).

### Monitor query and indexing workloads

Logged events captured by Azure Monitor include those related to indexing and queries. The **AzureDiagnostics** table in Log Analytics collects operational data related to queries and indexing.

Most of the logged data is for read-only operations ([query monitoring](search-monitor-queries.md)). For other create-update-delete operations not captured in the log, you can query the search service for system information.

| OperationName | Description |
|---------------|-------------|
| ServiceStats | This operation is a routine call to [Get Service Statistics](https://docs.microsoft.com/rest/api/searchservice/get-service-statistics), either called directly or implicitly to populate a portal overview page when it is loaded or refreshed. |
| Query.Search |  Query requests against an index See [Monitor queries](search-monitor-queries.md) for information about logged queries.|
| Indexing.Index  | This operation is a call to [Add, Update or Delete Documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents). |
| indexes.Prototype | This is an index created by the Import Data wizard. |
| Indexers.Create | Create an indexer explicitly or implicitly through the Import Data wizard. |
| Indexers.Get | Returns the name of an indexer whenever the indexer is run. |
| Indexers.Status | Returns the status of an indexer whenever the indexer is run. |
| DataSources.Get | Returns the name of the data source whenever an indexer is run.|
| Indexes.Get | Returns the name of an index whenever an indexer is run. |

### Kusto queries about workloads

If you enabled diagnostic logging, you can query **AzureDiagnostics** for a list of operations that ran on your service and when. You can also correlate activity to investigate changes in performance.

#### Example: List operations 

Return a list of operations and a count of each one.

```
AzureDiagnostics
| summarize count() by OperationName
```

#### Example: Correlate operations

Correlate query request with indexing operations, and render the data points across a time chart to see operations coincide.

```
AzureDiagnostics
| summarize OperationName, Count=count()
| where OperationName in ('Query.Search', 'Indexing.Index')
| summarize Count=count(), AvgLatency=avg(DurationMs) by bin(TimeGenerated, 1h), OperationName
| render timechart
```

### Use search APIs

Both the Azure Cognitive Search REST API and the .NET SDK provide programmatic access to service metrics, index and indexer information, and document counts.

+ [GET Service Statistics](/rest/api/searchservice/get-service-statistics)
+ [GET Index Statistics](/rest/api/searchservice/get-index-statistics)
+ [GET Document Counts](/rest/api/searchservice/count-documents)
+ [GET Indexer Status](/rest/api/searchservice/get-indexer-status)

## Monitor user access

Because search indexes are a component of a larger client application, there is no built-in methodology for controlling or monitoring per-user access to an index. Requests are assumed to come from a client application, for either admin or query requests. Admin read-write operations include creating, updating, deleting objects across the entire service. Read-only operations are queries against the documents collection, scoped to a single index. 

As such, what you'll see in the activity logs are references to calls using admin keys or query keys. The appropriate key is included in requests originating from client code. The service is not equipped to handle identity tokens or impersonation.

When business requirements do exist for per-user authorization, the recommendation is integration with Azure Active Directory. You can use $filter and user identities to [trim search results](search-security-trimming-for-azure-search-with-aad.md) of documents that a user should not see. 

There is no way to log this information separately from the query string that includes the $filter parameter. See [Monitor queries](search-monitor-queries.md) for details on reporting query strings.

## Next steps

Fluency with Azure Monitor is essential for oversight of any Azure service, including resources like Azure Cognitive Search. If you are not familiar with Azure Monitor, take the time to review articles related to resources. In addition to tutorials, the following article is a good place to start.

> [!div class="nextstepaction"]
> [Monitoring Azure resources with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/insights/monitor-azure-resource)
