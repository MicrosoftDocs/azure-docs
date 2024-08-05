---
title: Monitoring data reference for Azure AI Search
description: This article contains important reference material you need when you monitor Azure AI Search.
ms.date: 02/15/2024
ms.custom: horz-monitor
ms.topic: reference
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
---

# Azure AI Search monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure AI Search](monitor-azure-cognitive-search.md) for details on the data you can collect for Azure AI Search and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Search/searchServices
The following table lists the metrics available for the Microsoft.Search/searchServices resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [microsoft-search-searchservices-metrics-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-search-searchservices-metrics-include.md)]

#### Search queries per second

This metric shows the average of the search queries per second (QPS) for the search service. It's common for queries to execute in milliseconds, so only queries that measure as seconds appear in a metric like QPS. The minimum is the lowest value for search queries per second that was registered during that minute. Maximum is the highest value. Average is the aggregate across the entire minute.

| Aggregation type | Description |
|------------------|-------------|
| Average | The average number of seconds within a minute during which query execution occurred.|
| Count | The number of metrics emitted to the log within the one-minute interval. |
| Maximum | The highest number of search queries per second registered during a minute. |
| Minimum | The lowest number of search queries per second registered during a minute.  |
| Sum | The sum of all queries executed within the minute.  |

For example, within one minute, you might have a pattern like this: one second of high load that is the maximum for SearchQueriesPerSecond, followed by 58 seconds of average load, and finally one second with only one query, which is the minimum.

Another example: if a node emits 100 metrics, where the value of each metric is 40, then "Count" is 100, "Sum" is 4000, "Average" is 40, and "Max" is 40.

#### Search latency

Search latency indicates how long a query takes to complete.

| Aggregation type | Latency |
|------------------|---------|
| Average | Average query duration in milliseconds. |
| Count | The number of metrics emitted to the log within the one-minute interval. |
| Maximum | Longest running query in the sample. |
| Minimum | Shortest running query in the sample.  |
| Total | Total execution time of all queries in the sample, executing within the interval (one minute).  |

#### Throttled search queries percentage

This metric refers to queries that are dropped instead of processed. Throttling occurs when the number of requests in execution exceed capacity. You might see an increase in throttled requests when a replica is taken out of rotation or during indexing. Both query and indexing requests are handled by the same set of resources.

The service determines whether to drop requests based on resource consumption. The percentage of resources consumed across memory, CPU, and disk IO are averaged over a period of time. If this percentage exceeds a threshold, all requests to the index are throttled until the volume of requests is reduced.

Depending on your client, a throttled request is indicated in these ways:

+ A service returns an error `"You are sending too many requests. Please try again later."` 
+ A service returns a 503 error code indicating the service is currently unavailable. 
+ If you're using the portal (for example, Search Explorer), the query is dropped silently and you need to select **Search** again.

To confirm throttled queries, use **Throttled search queries** metric. You can explore metrics in the portal or create an alert metric as described in this article. For queries that were dropped within the sampling interval, use *Total* to get the percentage of queries that didn't execute.

| Aggregation type | Throttling |
|------------------|-----------|
| Average | Percentage of queries dropped within the interval. |
| Count | The number of metrics emitted to the log within the one-minute interval. |
| Maximum | Percentage of queries dropped within the interval.|
| Minimum | Percentage of queries dropped within the interval. |
| Total | Percentage of queries dropped within the interval. |

For **Throttled Search Queries Percentage**, minimum, maximum, average and total, all have the same value: the percentage of search queries that were throttled, from the total number of search queries during one minute.

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

Azure AI Search has dimensions associated with the following metrics that capture a count of documents or skills that were executed.

| Metric name  |  Description | Dimensions  | Sample use cases |
|---|---|---|---|
| **Document processed count**  | Shows the number of indexer processed documents.  | Data source name, failed, index name, indexer name, skillset name  | Can be referenced as a rough measure of throughput (number of documents processed by indexer over time) <br> - Set up to alert on failed documents |
|  **Skill execution invocation count** | Shows the number of skill invocations. | Data source name, failed, index name, indexer name, skill name, skill type, skillset name | Reference to ensure skills are invoked as expected by comparing relative invocation numbers between skills and number of skill invocations to the number of documents. <br> - Set up to alert on failed skill invocations |

| Dimension name | Description |
| -------------- | ----------- |
| **DataSourceName** | A named data source connection used during indexer execution. Valid values are one of the [supported data source types](search-indexer-overview.md#supported-data-sources). |
| **Failed** | Indicates whether the instance failed. |
| **IndexerName** | Name of an indexer.|
| **IndexName** | Name of an index.|
| **SkillsetName** | Name of a skillset used during indexer execution. |
| **SkillName** | Name of a skill within a skillset. |
| **SkillType** | The @odata.type of the skill. |

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Search/searchServices
[!INCLUDE [microsoft-search-searchservices-logs-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-search-searchservices-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Search Services
Microsoft.Search/searchServices

| Table | Description |
|-------|-------------|
| [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity) | Entries from the Azure activity log provide insight into control plane operations. Tasks invoked on the control plane, such as adding or removing replicas and partitions, are represented through a "Get Admin Key" activity. |
| [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) | Logged query and indexing operations. Queries against the AzureDiagnostics table in Log Analytics can include the common properties, the [search-specific properties](#resource-log-search-props), and the [search-specific operations](#resource-log-search-ops) listed in the schema reference section. |
| [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics) | Metric data emitted by Azure AI Search that measures health and performance. |

### Resource log tables

The following table lists the properties of resource logs in Azure AI Search. The resource logs are collected into Azure Monitor Logs or Azure Storage. In Azure Monitor, logs are collected in the AzureDiagnostics table under the resource provider name of `Microsoft.Search`.

| Azure Storage field or property | Azure Monitor Logs property | Description |
|-|-|-|
| time | TIMESTAMP | The date and time (UTC) when the operation occurred. |
| resourceId | Concat("/", "/subscriptions", SubscriptionId, "resourceGroups", ResourceGroupName, "providers/Microsoft.Search/searchServices", ServiceName) | The Azure AI Search resource for which logs are enabled. |
| category | "OperationLogs" | Log categories include `Audit`, `Operational`, `Execution`, and `Request`. |
| operationName | Name | Name of the operation. The operation name can be `Indexes.ListIndexStatsSummaries`, `Indexes.Get`, `Indexes.Stats`, `Indexers.List`, `Query.Search`, `Query.Suggest`, `Query.Lookup`, `Query.Autocomplete`, `CORS.Preflight`, `Indexes.Update`, `Indexes.Prototype`, `ServiceStats`, `DataSources.List`, `Indexers.Warmup`. |
| durationMS | DurationMilliseconds | The duration of the operation, in milliseconds. |
| operationVersion | ApiVersion | The API version used on the request. | 
| resultType | (Failed) ? "Failed" : "Success" | The type of response. |
| resultSignature | Status | The HTTP response status of the operation. |
| properties | Properties | Any extended properties related to this category of events.  |

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

The following table lists common operations related to Azure AI Search that may be recorded in the activity log. For a complete listing of all Microsoft.Search operations, see [Microsoft.Search resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftsearch).

| Operation | Description |
|:----------|:------------|
| Get Admin Key | Any operation that requires administrative rights is logged as a "Get Admin Key" operation.  |
| Get Query Key | Any read-only operation against the documents collection of an index.  |
| Regenerate Admin Key | A request to regenerate either the primary or secondary admin API key. |

Common entries include references to API keys - generic informational notifications like *Get Admin Key* and *Get Query keys*. These activities indicate requests that were made using the admin key (create or delete objects) or query key, but don't show the request itself. For information of this grain, you must configure resource logging. 

Alternatively, you might gain some insight through change history. In the Azure portal, select the activity to open the detail page and then select "Change history" for information about the underlying operation.

<a name="schemas"></a>
[!INCLUDE [horz-monitor-ref-other-schemas](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-other-schemas.md)]

If you're building queries or custom reports, the data structures that contain Azure AI Search resource logs conform to the following schemas.

For resource logs sent to blob storage, each blob has one root object called **records** containing an array of log objects. Each blob contains records for all the operations that took place during the same hour.

<a name="resource-log-schema"></a>
### Resource log schema

All resource logs available through Azure Monitor share a [common top-level schema](/azure/azure-monitor/essentials/resource-logs-schema#top-level-common-schema). Azure AI Search supplements with [more properties](#resource-log-search-props) and [operations](#resource-log-search-ops) that are unique to a search service.

The following example illustrates a resource log that includes common properties (TimeGenerated, Resource, Category, and so forth) and search-specific properties (OperationName and OperationVersion).

| Name | Type | Description and example |
| ---- | ---- | ----------------------- |
| TimeGenerated | Datetime | Timestamp of the operation. For example: `2021-12-07T00:00:43.6872559Z` |
| Resource | String | Resource ID. For example: `/subscriptions/<your-subscription-id>/resourceGroups/<your-resource-group-name>/providers/Microsoft.Search/searchServices/<your-search-service-name>` |
| Category | String | "OperationLogs". This value is a constant. OperationLogs is the only category used for resource logs. |
| OperationName | String |  The name of the operation (see the [full list of operations](#resource-log-search-ops)). An example is `Query.Search` |
| OperationVersion | String | The api-version used on the request. For example: `2024-07-01` |
| ResultType | String |"Success". Other possible values: Success or Failure |
| ResultSignature | Int | An HTTP result code. For example: `200` |
| DurationMS | Int | Duration of the operation in milliseconds. |
| Properties |Object | Object containing operation-specific data. See the following properties schema table.|

<a name="resource-log-search-props"></a>

#### Properties schema

The following properties are specific to Azure AI Search.

| Name | Type | Description and example |
| ---- | ---- | ----------------------- |
| Description_s | String | The operation's endpoint. For example: `GET /indexes('content')/docs` |
| Documents_d | Int | Number of documents processed. |
| IndexName_s | String | Name of the index associated with the operation. |
| Query_s | String | The query parameters used in the request. For example: `?search=beach access&$count=true&api-version=2024-07-01` |

<a name="resource-log-search-ops"></a>

#### OperationName values (logged operations)

The following operations can appear in a resource log.

| OperationName | Description |
|:------------- |:------------|
| DataSources.*  | Applies to indexer data sources. Can be Create, Delete, Get, List.  |
| DebugSessions.* | Applies to a debug session. Can be Create, Delete, Get, List, Start, and Status. |
| DebugSessions.DocumentStructure | An enriched document is loaded into a debug session. |
| DebugSessions.RetrieveIndexerExecutionHistoricalData | A request for indexer execution details. |
| DebugSessions.RetrieveProjectedIndexerExecutionHistoricalData  | Execution history for enrichments projected to a knowledge store. |
| Indexers.* | Applies to an indexer. Can be Create, Delete, Get, List, and Status. |
| Indexes.* | Applies to a search index. Can be Create, Delete, Get, List.  |
| indexes.Prototype | This index is created by the Import Data wizard. |
| Indexing.Index  | This operation is a call to [Add, Update or Delete Documents](/rest/api/searchservice/addupdate-or-delete-documents). |
| Metadata.GetMetadata | A request for search service system data.  |
| Query.Autocomplete | An autocomplete query against an index. See [Query types and composition](search-query-overview.md). |
| Query.Lookup |  A lookup query against an index. See [Query types and composition](search-query-overview.md). |
| Query.Search |  A full text search request against an index. See [Query types and composition](search-query-overview.md). |
| Query.Suggest |  Type ahead query against an index. See [Query types and composition](search-query-overview.md). |
| ServiceStats | This operation is a routine call to [Get Service Statistics](/rest/api/searchservice/get-service-statistics), either called directly or implicitly to populate a portal overview page when it's loaded or refreshed. |
| Skillsets.* | Applies to a skillset. Can be Create, Delete, Get, List. |

## Related content

- See [Monitor Azure AI Search](monitor-azure-cognitive-search.md) for a description of monitoring Azure AI Search.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
