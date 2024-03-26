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

<!-- 
IMPORTANT 
To make this template easier to use, first:
1. Search and replace AI Search with the official name of your service.
2. Search and replace azure-cognitive-search with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_01
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- Most services can use the following sections unchanged. All headings are required unless otherwise noted.
The sections use #included text you don't have to maintain, which changes when Azure Monitor functionality changes. Add info into the designated service-specific places if necessary. Remove #includes or template content that aren't relevant to your service.

At a minimum your service should have the following two articles:

1. The primary monitoring article (based on the template monitor-service-template.md)
   - Title: "Monitor AI Search"
   - TOC title: "Monitor"
   - Filename: "monitor-azure-cognitive-search.md"

2. A reference article that lists all the metrics and logs for your service (based on this template).
   - Title: "AI Search monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-azure-cognitive-search-data-reference.md".
-->

# Azure AI Search monitoring data reference

<!-- Intro. Required. -->
[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure AI Search](monitor-azure-cognitive-search.md) for details on the data you can collect for Azure AI Search and how to use it.

<!-- ## Metrics. Required section. -->
[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

<!-- Repeat the following section for each resource type/namespace in your service. -->
### Supported metrics for Microsoft.Search/searchServices
The following table lists the metrics available for the Microsoft.Search/searchServices resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Search/searchServices](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-search-searchservices-metrics-include.md)]

SearchQueriesPerSecond shows the average of the search queries per second (QPS) for the search service. It's common for queries to execute in milliseconds, so only queries that measure as seconds appear in a metric like QPS. The minimum is the lowest value for search queries per second that was registered during that minute. Maximum is the highest value. Average is the aggregate across the entire minute.

For example, within one minute, you might have a pattern like this: one second of high load that is the maximum for SearchQueriesPerSecond, followed by 58 seconds of average load, and finally one second with only one query, which is the minimum.

<!-- ## Metric dimensions. Required section. -->
[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

Azure AI Search has the following dimensions associated with the metrics that capture a count of documents or skills that were executed, "Document processed count" and "Skill execution invocation count".

| Dimension Name | Description |
| -------------- | ----------- |
| **DataSourceName** | A named data source connection used during indexer execution. Valid values are one of the [supported data source types](search-indexer-overview.md#supported-data-sources). |
| **Failed** | Indicates whether the instance failed. |
| **IndexerName** | Name of an indexer.|
| **IndexName** | Name of an index.|
| **SkillsetName** | Name of a skillset used during indexer execution. |
| **SkillName** | Name of a skill within a skillset. |
| **SkillType** | The @odata.type of the skill. |

<!-- ## Resource logs. Required section. -->
[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

<!-- Add at least one resource provider/resource type here. Example: ### Supported resource logs for Microsoft.Storage/storageAccounts/blobServices
Repeat this section for each resource type/namespace in your service. -->
### Supported resource logs for Microsoft.Search/searchServices
[!INCLUDE [Microsoft.Search/searchServices](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-search-searchservices-logs-include.md)]

<!-- ## Azure Monitor Logs tables. Required section. -->
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

<!-- ## Activity log. Required section. -->
[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

The following table lists common operations related to Azure AI Search that may be recorded in the activity log. For a complete listing of all Microsoft.Search operations, see [Microsoft.Search resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftsearch).

| Operation | Description |
|:----------|:------------|
| Get Admin Key | Any operation that requires administrative rights is logged as a "Get Admin Key" operation.  |
| Get Query Key | Any read-only operation against the documents collection of an index.  |
| Regenerate Admin Key | A request to regenerate either the primary or secondary admin API key. |

Common entries include references to API keys - generic informational notifications like *Get Admin Key* and *Get Query keys*. These activities indicate requests that were made using the admin key (create or delete objects) or query key, but don't show the request itself. For information of this grain, you must configure resource logging. 

Alternatively, you might gain some insight through change history. In the Azure portal, select the activity to open the detail page and then select "Change history" for information about the underlying operation.

<!-- Refer to https://learn.microsoft.com/azure/role-based-access-control/resource-provider-operations and link to the possible operations for your service, using the format - [<Namespace> resource provider operations](/azure/role-based-access-control/resource-provider-operations#<namespace>).
If there are other operations not in the link, list them here in table form. -->

<!-- ## Other schemas. Optional section. Please keep heading in this order. If your service uses other schemas, add the following include and information. -->
<a name="schemas"></a>
[!INCLUDE [horz-monitor-ref-other-schemas](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-other-schemas.md)]
<!-- List other schemas and their usage here. These can be resource logs, alerts, event hub formats, etc. depending on what you think is important. You can put JSON messages, API responses not listed in the REST API docs, and other similar types of info here.  -->
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
| OperationVersion | String | The api-version used on the request. For example: `2020-06-30` |
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
| Query_s | String | The query parameters used in the request. For example: `?search=beach access&$count=true&api-version=2020-06-30` |

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
