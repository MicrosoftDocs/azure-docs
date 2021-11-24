---
title: Azure Cognitive Search monitoring data reference
description: Log and metrics reference for monitoring data from Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist

ms.service: cognitive-search
ms.topic: reference
ms.date: 11/24/2021
ms.custom: subject-monitoring
---

# Azure Cognitive Search monitoring data reference

This article provides a reference of log and metric data collected to analyze the performance and availability of Azure Cognitive Search. See [Monitoring Azure Cognitive Search](monitor-azure-cognitive-search.md) for details on collecting and analyzing monitoring data for your search service.

## Metrics

This section lists all the automatically collected platform metrics collected for Azure Cognitive Search ([Microsoft.Search/searchServices](../azure-monitor/essentials/metrics-supported.md#microsoftsearchsearchservices)).  

| Metric | Unit | Description |
|:-------|:-----|:------------|
| Document processed count | Count | Total of the number of documents successfully processed in an indexing operation (either by an indexer or by pushing documents directly). |
| Search Latency | Seconds | Average search latency for queries that execute on the search service. |
| Search queries per second | CountPerSecond | Average of the search queries per second (QPS) for the search service. It's common for queries to execute in milliseconds, so only queries that measure as seconds will appear in a metric like QPS. </br>The minimum is the lowest value for search queries per second that was registered during that minute. The same applies to the maximum value. Average is the aggregate across the entire minute. For example, within one minute, you might have a pattern like this: one second of high load that is the maximum for SearchQueriesPerSecond, followed by 58 seconds of average load, and finally one second with only one query, which is the minimum.|
| Skill execution invocation count | Count | Total number of skill executions processed during an indexer operation. |
| Throttled search queries percentage | Percent | Average percentage of the search queries that were throttled from the total number of search queries that executed during a one-minute interval.|

For more information, see a list of [all platform metrics supported in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported).

## Metric Dimensions

Dimensions of a metric are name/value pairs that carry additional data to describe the metric value. Azure Cognitive Search has the following dimensions associated with its metrics that capture a count of documents or skills that were executed ("Document processed count" and "Skill execution invocation count").

| Dimension Name | Description |
| -------------- | ----------- |
| **DataSourceName** | A named data source connection used during indexer execution. Valid values are one of the [supported data source types](search-indexer-overview.md#supported-data-sources). |
| **Failed** | Indicates whether the instance failed. |
| **IndexerName** | Name of an indexer.|
| **IndexName** | Name of an index.|
| **SkillsetName** | Name of a skillset used during indexer execution. |
| **SkillName** | Name of a skill within a skillset. |
| **SkillType** | The @odata.type of the skill. |

For more information on what metric dimensions are, see [Multi-dimensional metrics](../azure-monitor/platform/data-platform-metrics.md#multi-dimensional-metrics).

## Resource logs

This section lists the types of resource logs you can collect for Azure Cognitive Search.

[Resource logs](../azure-monitor/essentials/resource-logs.md) are platform logs that provide insight into operations that were performed within an Azure resource. Resource logs are not collected by default. You must create a diagnostic setting for each Azure resource to send its resource logs to a Log Analytics workspace to use with Azure Monitor Logs, Azure Event Hubs to forward outside of Azure, or to Azure Storage for archiving.

Azure Cognitive Search generates resource logs within the [Operations category](../azure-monitor/essentials/resource-logs-categories.md#microsoftsearchsearchservices). For reference, see a list of [all resource logs category types supported in Azure Monitor](../azure-monitor/platform/resource-logs-schema.md).

## Azure Monitor Logs table

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Azure Cognitive Search and available for query by Log Analytics and Metrics Explorer in the Azure portal.

| Table | Description |
|-------|-------------|
| [AzureActivity](../azure-monitor/reference/tables/azureactivity.md) | Entries from the Azure Activity log that provide insight into control plane operations. The most common entry is "Get Admin key" which indicates that the operation used an admin API key. |
| [AzureDiagnostics](../azure-monitor/reference/tables/azurediagnostics.md) | Logged query and indexing operations.|
| [AzureMetrics](../azure-monitor/reference/tables/azuremetrics.md) | Metric data emitted by Azure services that measure their health and performance. |

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](../azure-monitor/reference/tables/tables-resourcetype.md#search-services).

### Diagnostics tables

Azure Cognitive Search uses the [**Azure Diagnostics**](../azure-monitor/reference/tables/azurediagnostics.md) table to collect resource logs related to queries and indexing on your search service.

Queries against this table in Metrics Explorer can include the common properties, the [search-specific properties](#resource-log-search-props), and the [search-specific operations](#resource-log-search-ops) listed in the schema reference section.

For examples of Kusto queries useful for Azure Cognitive Search, see [Monitoring Azure Cognitive Search](monitor-azure-cognitive-search.md) and [Analyze performance in Azure Cognitive Search](search-performance-analysis.md).

## Activity log

The following table lists common operations related to Azure Cognitive Search that may be created in the Activity log.

| Operation | Description |
|:----------|:------------|
| Get Admin Key | Any operation that requires administrative rights will be logged as a "Get Admin Key" operation. In Azure portal, select the entry and then select "Change history" for information about the underlying operation. Tasks invoked on the control plane, such as adding or removing replicas and partitions, will be represented through a "Get Admin Key" activity. |
| Regenerate Admin Key | A request to regenerate either the primary or secondary admin API key. |

For more information on the schema of Activity Log entries, see [Activity  Log schema](../azure-monitor/essentials/activity-log-schema.md).

## Schemas

The following schemas are in use by Azure Cognitive Search. If you are building custom reports, the data structures that contain Azure Cognitive Search resource logs conform to the schema below. For resource logs sent to blob storage, each blob has one root object called **records** containing an array of log objects. Each blob contains records for all the operations that took place during the same hour.

<a name="resource-log-schema"></a>

### Resource log schema

All resource logs available through Azure Monitor share a [common top-level schema](../azure-monitor/essentials/resource-logs-schema.md#top-level-common-schema). Below is partial list of schema elements, where the example is based on a hypothetical search operation.

| Name | Type | Example | Description |
| ---- | ---- | ------- | ----------- |
| TimeGenerated | Datetime |"2021-12-07T00:00:43.6872559Z" |Timestamp of the operation |
| Resource | String |"/SUBSCRIPTIONS/11111111-1111-1111-1111-111111111111/ <br/>RESOURCEGROUPS/DEFAULT/PROVIDERS/ <br/> MICROSOFT.SEARCH/SEARCHSERVICES/SEARCHSERVICE" | Your ResourceId |
| Category | String |"OperationLogs" | Constant |
| OperationName | String | "Query.Search" | The name of the operation.|
| OperationVersion |String |"2020-06-30" |The api-version used |
| ResultType |String |"Success" |Possible values: Success or Failure |
| ResultSignature |Int |200 |HTTP result code |
| DurationMS |Int |50 |Duration of the operation in milliseconds |
| Properties |object |See the following table |Object containing operation-specific data |

<a name="resource-log-search-props"></a>

#### Properties schema

The properties below are specific to Azure Cognitive Search.

| Name | Type | Example | Notes |
| --- | --- | --- | --- |
| Description_s |String |"GET /indexes('content')/docs" |The operation's endpoint |
| Documents_d |Int |42 |Number of documents processed |
| IndexName_s |String |"test-index" |Name of the index associated with the operation |
| Query_s |String |"?search=AzureSearch&$count=true&api-version=2020-06-30" |The query parameters |

<a name="resource-log-search-ops"></a>

#### OperationName schema (logged operations)

For the OperationName, specify any of the following operations.

| OperationName | Description |
|:------------- |:------------|
| Indexing.Index  | This operation is a call to [Add, Update or Delete Documents](/rest/api/searchservice/addupdate-or-delete-documents). |
| Indexers.Create | Create an indexer explicitly or implicitly through the Import Data wizard. |
| Indexers.Get | Returns the name of an indexer whenever the indexer is run. |
| Indexers.Status | Returns the status of an indexer whenever the indexer is run. |
| DataSources.Get | Returns the name of the data source whenever an indexer is run.|
| Indexes.Get | Returns the name of an index whenever an indexer is run. |
| indexes.Prototype | This is an index created by the Import Data wizard. |
| Query.Autocomplete |  An autocomplete query against an index. See [Query types and composition](search-query-overview.md). |
| Query.Lookup |  A lookup query against an index. See [Query types and composition](search-query-overview.md). |
| Query.Search |  A full text search request against an index. See [Query types and composition](search-query-overview.md). |
| Query.Suggest |  Type-ahead query against an index. See [Query types and composition](search-query-overview.md). |
| ServiceStats | This operation is a routine call to [Get Service Statistics](/rest/api/searchservice/get-service-statistics), either called directly or implicitly to populate a portal overview page when it is loaded or refreshed. |


<!-- Diagnostic or operational logs provide insight into the detailed operations of Azure Cognitive Search and are useful for monitoring service health and processes. Internally, Microsoft preserves system information on the backend for a short period of time (about 30 days), sufficient for investigation and analysis if you file a support ticket. However, if you want ownership over operational data, you should configure a diagnostic setting to specify where logging information is collected.

Diagnostic logging is enabled through back-end integration with [Azure Monitor](../azure-monitor/index.yml). When you set up diagnostic logging, you will be asked to specify a storage option for persisting the log. The following table enumerates your options.

| Resource | Used for |
|----------|----------|
| [Send to Log Analytics workspace](../azure-monitor/essentials/tutorial-resource-logs.md) | Events and metrics are sent to a Log Analytics workspace, which can be queried in the portal to return detailed information. For an introduction, see [Get started with Azure Monitor logs](../azure-monitor/logs/log-analytics-tutorial.md) |
| [Archive with Blob storage](../storage/blobs/storage-blobs-overview.md) | Events and metrics are archived to a Blob container and stored in JSON files. Logs can be quite granular (by the hour/minute), useful for researching a specific incident but not for open-ended investigation. Use a JSON editor to view a raw log file or Power BI to aggregate and visualize log data.|
| [Stream to Event Hub](../event-hubs/index.yml) | Events and metrics are streamed to an Azure Event Hubs service. Choose this as an alternative data collection service for very large logs. |

## Prerequisites

Create resources in advance so that you can select one or more when configuring diagnostic logging.

+ [Create a log analytics workspace](../azure-monitor/logs/quick-create-workspace.md)

+ [Create a storage account](../storage/common/storage-account-create.md)

+ [Create an Event Hub](../event-hubs/event-hubs-create.md)

## Enable data collection

Diagnostic settings specify how logged events and metrics are collected.

1. Under **Monitoring**, select **Diagnostic settings**.

   ![Diagnostic settings](./media/search-monitor-usage/diagnostic-settings.png "Diagnostic settings")

1. Select **+ Add diagnostic setting**

1. Check **Log Analytics**, select your workspace, and select **OperationLogs** and **AllMetrics**.

   ![Configure data collection](./media/search-monitor-usage/configure-storage.png "Configure data collection")

1. Save the setting.

1. After logging is enabled, your search service will start generating logs and metrics. It can take some time before logged events and metrics become available.

For Log Analytics, expect to wait several minutes before data is available, after which you can run Kusto queries to return data. For more information, see [Monitor query requests](search-monitor-logs.md).

For Blob storage, it takes one hour before the containers will appear in Blob storage. There is one blob, per hour, per container. Containers are only created when there is an activity to log or measure. When the data is copied to a storage account, the data is formatted as JSON and placed in two containers:

+ insights-logs-operationlogs: for search traffic logs
+ insights-metrics-pt1m: for metrics

## Query log information

Two tables contain logs and metrics for Azure Cognitive Search: **AzureDiagnostics** and **AzureMetrics**.

1. Under **Monitoring**, select **Logs**.

1. In the query window, type **AzureMetrics**, check the scope (your search service) and time range, and then click **Run** to get acquainted with the data collected in this table.

   Scroll across the table to view metrics and values. Notice the record count at the top. If your service has been collecting metrics for a while, you might want to adjust the time interval to get a manageable data set.

   ![AzureMetrics table](./media/search-monitor-usage/azuremetrics-table.png "AzureMetrics table")

1. Enter the following query to return a tabular result set.

   ```kusto
   AzureMetrics
   | project MetricName, Total, Count, Maximum, Minimum, Average
   ```

1. Repeat the previous steps, starting with **AzureDiagnostics** to return all columns for informational purposes, followed by a more selective query that extracts more interesting information.

   ```kusto
   AzureDiagnostics
   | project OperationName, resultSignature_d, DurationMs, Query_s, Documents_d, IndexName_s
   | where OperationName == "Query.Search" 
   ```

   ![AzureDiagnostics table](./media/search-monitor-usage/azurediagnostics-table.png "AzureDiagnostics table")

## Kusto query examples

If you enabled diagnostic logging, you can query **AzureDiagnostics** for a list of operations that ran on your service and when. You can also correlate activity to investigate changes in performance.

#### Example: List operations 

Return a list of operations and a count of each one.

```kusto
AzureDiagnostics
| summarize count() by OperationName
```

#### Example: Correlate operations

Correlate query request with indexing operations, and render the data points across a time chart to see operations coincide.

```kusto
AzureDiagnostics
| summarize OperationName, Count=count()
| where OperationName in ('Query.Search', 'Indexing.Index')
| summarize Count=count(), AvgLatency=avg(durationMs) by bin(TimeGenerated, 1h), OperationName
| render timechart
```




## View raw log files

Blob storage is used for archiving log files. You can use any JSON editor to view the log file. If you don't have one, we recommend [Visual Studio Code](https://code.visualstudio.com/download).

1. In Azure portal, open your Storage account. 

2. In the left-navigation pane, click **Blobs**. You should see **insights-logs-operationlogs** and **insights-metrics-pt1m**. These containers are created by Azure Cognitive Search when the log data is exported to Blob storage.

3. Click down the folder hierarchy until you reach the .json file.  Use the context-menu to download the file.

Once the file is downloaded, open it in a JSON editor to view the contents.
 -->

## See also

+ See [Monitoring Azure Cognitive Search](monitor-azure-cognitive-search.md) for concepts and instructions.

+ See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
