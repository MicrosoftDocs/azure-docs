---
title: Monitoring data reference for Azure Cosmos DB
description: This article contains important reference material you need when you monitor Azure Cosmos DB.
ms.date: 02/14/2024
ms.custom: horz-monitor
ms.topic: reference
ms.author: esarroyo
author: StefArroyo
ms.service: cosmos-db
---

<!-- 
IMPORTANT 
To make this template easier to use, first:
1. Search and replace Azure Cosmos DB with the official name of your service.
2. Search and replace [TODO-replace-with-service-filename] with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_01
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- Most services can use the following sections unchanged. All headings are required unless otherwise noted.
The sections use #included text you don't have to maintain, which changes when Azure Monitor functionality changes. Add info into the designated service-specific places if necessary. Remove #includes or template content that aren't relevant to your service.
At a minimum your service should have the following two articles:
1. The primary monitoring article (based on the template monitor-service-template.md)
   - Title: "Monitor Azure Cosmos DB"
   - TOC title: "Monitor"
   - Filename: "monitor.md"
2. A reference article that lists all the metrics and logs for your service (based on this template).
   - Title: "Azure Cosmos DB monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-reference.md".
-->

# Azure Cosmos DB monitoring data reference

<!-- Intro. Required. -->
[!INCLUDE [horz-monitor-ref-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Cosmos DB](monitor.md) for details on the data you can collect for Azure Cosmos DB and how to use it.

<!-- ## Metrics. Required section. -->
[!INCLUDE [horz-monitor-ref-metrics-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]
For a list of all Azure Monitor supported metrics, including Azure Cosmos DB, see [Azure Monitor supported metrics](/azure/azure-monitor/essentials/metrics-supported).

<!-- Repeat the following section for each resource type/namespace in your service. -->
### Supported metrics for Microsoft.DocumentDB/DatabaseAccounts
The following table lists the metrics available for the Microsoft.DocumentDB/DatabaseAccounts resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[Microsoft.DocumentDB/DatabaseAccounts](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-documentdb-databaseaccounts-metrics-include.md)]

### Supported metrics for Microsoft.DocumentDB/cassandraClusters
The following table lists the metrics available for the Microsoft.DocumentDB/cassandraClusters resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[Microsoft.DocumentDB/cassandraClusters](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-documentdb-cassandraclusters-metrics-include.md)]

### Supported metrics for Microsoft.DocumentDB/mongoClusters
The following table lists the metrics available for the Microsoft.DocumentDB/mongoClusters resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[Microsoft.DocumentDB/mongoClusters](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-documentdb-mongoclusters-metrics-include.md)]

### Request metrics

|Metric (Metric Display Name)|Unit (Aggregation Type) |Description|Dimensions| Time granularities| Legacy metric mapping | Usage |
|---|---|---|---| ---| ---| ---|
| TotalRequests (Total Requests) | Count (Count) | Number of requests made| DatabaseName, CollectionName, Region, StatusCode| All | TotalRequests, Http 2xx, Http 3xx, Http 400, Http 401, Internal Server error, Service Unavailable, Throttled Requests, Average Requests per Second | Used to monitor requests per status code, container at a minute granularity. To get average requests per second, use Count aggregation at minute and divide by 60. |
| MetadataRequests (Metadata Requests) |Count (Count) | Count of Azure Resource Manager metadata requests. Metadata has request limits. See [Control Plane Limits](concepts-limits.md#control-plane) for more information. | DatabaseName, CollectionName, Region, StatusCode| All | | Used to monitor metadata requests in scenarios where requests are being throttled. See [Monitor Control Plane Requests](use-metrics.md#monitor-control-plane-requests) for more information. |
| MongoRequests (Mongo Requests) | Count (Count) | Number of Mongo Requests Made | DatabaseName, CollectionName, Region, CommandName, ErrorCode| All |Mongo Query Request Rate, Mongo Update Request Rate, Mongo Delete Request Rate, Mongo Insert Request Rate, Mongo Count Request Rate| Used to monitor Mongo request errors, usages per command type. |

### Request Unit metrics

|Metric (Metric Display Name)|Unit (Aggregation Type)|Description|Dimensions| Time granularities| Legacy metric mapping | Usage |
|---|---|---|---| ---| ---| ---|
| MongoRequestCharge (Mongo Request Charge) | Count (Total) |Mongo Request Units Consumed| DatabaseName, CollectionName, Region, CommandName, ErrorCode| All |Mongo Query Request Charge, Mongo Update Request Charge, Mongo Delete Request Charge, Mongo Insert Request Charge, Mongo Count Request Charge| Used to monitor Mongo resource RUs in a minute.|
| TotalRequestUnits (Total Request Units)| Count (Total) | Request Units consumed| DatabaseName, CollectionName, Region, StatusCode |All| TotalRequestUnits| Used to monitor Total RU usage at a minute granularity. To get average RU consumed per second, use Sum aggregation at minute interval/level and divide by 60.|
| ProvisionedThroughput (Provisioned Throughput)| Count (Maximum) |Provisioned throughput at container granularity| DatabaseName, ContainerName| 5M| | Used to monitor provisioned throughput per container.|
| AutoscaleMaxThroughput (Autoscale Max Throughput)| Count (Maximum) |Autoscale max throughput at container granularity| DatabaseName, ContainerName| 5M| | Used to monitor autoscale max throughput per container.|
| PhysicalPartitionThroughputInfo (Physical Partition Throughput Info)| Count (Maximum) |Provisioned throughput at physical partition granularity| DatabaseName, ContainerName, PhysicalPartitionId, Region| 5M| | Used to monitor provisioned throughput per physical partition. If resource is autoscale, represents autoscale max RU/s per physical partition. To see provisioned throughput for all physical partitions, split by dimension Physical Partition Id.|

### Storage metrics

|Metric (Metric Display Name)|Unit (Aggregation Type)|Description|Dimensions| Time granularities| Legacy metric mapping | Usage |
|---|---|---|---| ---| ---| ---|
| AvailableStorage (Available Storage) |Bytes (Total) | Total available storage reported at 5-minutes granularity per region| DatabaseName, CollectionName, Region| 5M| Available Storage| Used to monitor available storage capacity (applicable only for fixed storage collections) Minimum granularity should be 5 minutes.| 
| DataUsage (Data Usage) |Bytes (Total) |Total data usage reported at 5-minutes granularity per region| DatabaseName, CollectionName, Region| 5M |Data size | Used to monitor total data usage at container and region, minimum granularity should be 5 minutes.|
| IndexUsage (Index Usage) | Bytes (Total) |Total Index usage reported at 5-minutes granularity per region| DatabaseName, CollectionName, Region| 5M| Index Size| Used to monitor total data usage at container and region, minimum granularity should be 5 minutes. |
| DocumentQuota (Document Quota) | Bytes (Total) | Total storage quota reported at 5-minutes granularity per region.| DatabaseName, CollectionName, Region| 5M |Storage Capacity| Used to monitor total quota at container and region, minimum granularity should be 5 minutes.|
| DocumentCount (Document Count) | Count (Total) |Total document count reported at 5-minutes granularity per region| DatabaseName, CollectionName, Region| 5M |Document Count|Used to monitor document count at container and region, minimum granularity should be 5 minutes.|
| PhysicalPartitionSizeInfo (Physical Partition Size Info) | Count (Maximum) | Storage at physical partition granularity| DatabaseName, ContainerName, PhysicalPartitionId, Region| 5M | |Used to monitor physical partition size (bytes) at physical partition granularity. To see storage for all physical partitions, split by dimension Physical Partition Id.|

### Latency metrics

|Metric (Metric Display Name)|Unit (Aggregation Type)|Description|Dimensions| Time granularities| Usage |
|---|---|---|---| ---| ---|
| ReplicationLatency (Replication Latency)| MilliSeconds (Minimum, Maximum, Average) | P99 Replication Latency across source and target regions for geo-enabled account| SourceRegion, TargetRegion| All | Used to monitor P99 replication latency between any two regions for a geo-replicated account. |
| Server Side Latency| MilliSeconds (Average) | Time taken by the server to process the request. | CollectionName, ConnectionMode, DatabaseName, OperationType, PublicAPIType, Region |	All	| Used to monitor the request latency on the Azure Cosmos DB server. |

### Availability metrics

|Metric (Metric Display Name) |Unit (Aggregation Type)|Description| Time granularities| Legacy metric mapping | Usage |
|---|---|---|---| ---| ---|
| ServiceAvailability (Service Availability)| Percent (Minimum, Maximum) | Account requests availability at one hour granularity| 1H | Service Availability | Represents the percent of total passed requests. A request is considered to be failed due to system error if the status code is 410, 500 or 503 Used to monitor availability of the account at hour granularity. |

### API for Cassandra metrics

|Metric (Metric Display Name)|Unit (Aggregation Type)|Description|Dimensions| Time granularities| Usage |
|---|---|---|---| ---| ---|
| CassandraRequests (Cassandra Requests) | Count (Count) | Number of API for Cassandra requests made| DatabaseName, CollectionName, ErrorCode, Region, OperationType, ResourceType| All| Used to monitor Cassandra requests at a minute granularity. To get average requests per second, use Count aggregation at minute and divide by 60.|
| CassandraRequestCharges (Cassandra Request Charges) | Count (Sum, Min, Max, Avg) | Request units consumed by the API for Cassandra | DatabaseName, CollectionName, Region, OperationType, ResourceType| All| Used to monitor RUs used per minute by a API for Cassandra account.|
| CassandraConnectionClosures (Cassandra Connection Closures) |Count (Count) |Number of Cassandra Connections closed| ClosureReason, Region| All | Used to monitor the connectivity between clients and the Azure Cosmos DB API for Cassandra.|

<!-- ## Metric dimensions. Required section. -->
[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]
<!-- Use one of the following includes, depending on whether you have metrics with dimensions.
- If you have metrics with dimensions, use the following include and list the metrics with dimensions after the include. For an example, see https://learn.microsoft.com/azure/storage/common/monitor-storage-reference#metrics-dimensions. Questions: email azmondocs@microsoft.com. -->
[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]
**Microsoft.DocumentDB/DatabaseAccounts:** CollectionName, DatabaseName, OperationType, Region, StatusCode, ApiKind, ApiKindResourceType, APIType, ApplicationType, BuildType, CacheEntryType, CacheExercised, CacheHit, CapacityType, ChildResourceName, ClosureReason, CommandName, ConnectionMode, DiagnosticSettingsName, Error, ErrorCode, IsExternal, IsSharedThroughputOffer, IsThroughputRequest, KeyType, MetricType, NotStarted, OfferOwnerRid, PartitionKeyRangeId, PhysicalPartitionId, PriorityLevel, PublicAPIType, ReplicationInProgress, ResourceGroupName, ResourceName, Role, SourceRegion, TargetContainerName, TargetRegion

**Microsoft.DocumentDB/cassandraClusters:** cassandra_datacenter, cassandra_node, cache_name

**Microsoft.DocumentDB/mongoClusters:** ServerName

<!-- ## Resource logs. Required section. -->
[!INCLUDE [horz-monitor-ref-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

<!-- Add at least one resource provider/resource type here. Repeat this section for each resource type/namespace in your service. Example: ### Supported resource logs for Microsoft.Storage/storageAccounts/blobServices -->
### Supported resource logs for Microsoft.DocumentDB/DatabaseAccounts
[!INCLUDE [Microsoft.DocumentDB/DatabaseAccounts](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-documentdb-databaseaccounts-logs-include.md)]

### Supported resource logs for Microsoft.DocumentDB/cassandraClusters
[!INCLUDE [Microsoft.DocumentDB/cassandraClusters](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-documentdb-cassandraclusters-logs-include.md)]

### Supported resource logs for Microsoft.DocumentDB/DatabaseAccounts
[!INCLUDE [Microsoft.DocumentDB/mongoClusters](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-documentdb-mongoclusters-logs-include.md)]

<!-- ## Azure Monitor Logs tables. Required section. -->
[!INCLUDE [horz-monitor-ref-logs-tables](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Azure Cosmos DB
Microsoft.DocumentDb/databaseAccounts

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [CDBDataPlaneRequests](/azure/azure-monitor/reference/tables/CDBDataPlaneRequests#columns)
- [CDBPartitionKeyStatistics](/azure/azure-monitor/reference/tables/CDBPartitionKeyStatistics#columns)
- [CDBPartitionKeyRUConsumption](/azure/azure-monitor/reference/tables/CDBPartitionKeyRUConsumption#columns)
- [CDBQueryRuntimeStatistics](/azure/azure-monitor/reference/tables/CDBQueryRuntimeStatistics#columns)
- [CDBMongoRequests](/azure/azure-monitor/reference/tables/CDBMongoRequests#columns)
- [CDBCassandraRequests](/azure/azure-monitor/reference/tables/CDBCassandraRequests#columns)
- [CDBGremlinRequests](/azure/azure-monitor/reference/tables/CDBGremlinRequests#columns)
- [CDBControlPlaneRequests](/azure/azure-monitor/reference/tables/CDBControlPlaneRequests#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/AzureMetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/AzureDiagnostics#columns)
  Logs are collected in the **AzureDiagnostics** table under the resource provider name of `MICROSOFT.DOCUMENTDB`.
  
## Azure CosmosDB resource logs properties

The following table lists the properties of resource logs in Azure Cosmos DB. The resource logs are collected into Azure Monitor Logs or Azure Storage.

| Azure Storage field or property | Azure Monitor Logs property | Description |
| --- | --- | --- |
| **time** | **TimeGenerated** | The date and time (UTC) when the operation occurred. |
| **resourceId** | **Resource** | The Azure Cosmos DB account for which logs are enabled.|
| **category** | **Category** | For Azure Cosmos DB, **DataPlaneRequests**, **MongoRequests**, **QueryRuntimeStatistics**, **PartitionKeyStatistics**, **PartitionKeyRUConsumption**, **ControlPlaneRequests**, **CassandraRequests**, **GremlinRequests** are the available log types. |
| **operationName** | **OperationName** | Name of the operation. The operation name can be  `Create`, `Update`, `Read`, `ReadFeed`, `Delete`, `Replace`, `Execute`, `SqlQuery`, `Query`, `JSQuery`, `Head`, `HeadFeed`, or `Upsert`.   |
| **properties** | n/a | The contents of this field are described in the rows that follow. |
| **activityId** | **activityId_g** | The unique GUID for the logged operation. |
| **userAgent** | **userAgent_s** | A string that specifies the client user agent from which, the request was sent. The format of user agent is `{user agent name}/{version}`.|
| **requestResourceType** | **requestResourceType_s** | The type of the resource accessed. This value can be database, container, document, attachment, user, permission, stored procedure, trigger, user-defined function, or  an offer. |
| **statusCode** | **statusCode_s** | The response status of the operation. |
| **requestResourceId** | **ResourceId** | The resourceId that pertains to the request. Depending on the operation performed, this value may point to `databaseRid`, `collectionRid`, or `documentRid`.|
| **clientIpAddress** | **clientIpAddress_s** | The client's IP address. |
| **requestCharge** | **requestCharge_s** | The number of RUs that are used by the operation |
| **collectionRid** | **collectionId_s** | The unique ID for the collection.|
| **duration** | **duration_d** | The duration of the operation, in milliseconds. |
| **requestLength** | **requestLength_s** | The length of the request, in bytes. |
| **responseLength** | **responseLength_s** | The length of the response, in bytes.|
| **resourceTokenPermissionId** | **resourceTokenPermissionId_s** | This property indicates the resource token permission ID that you have specified. To learn more about permissions, see the [Secure access to your data](./secure-access-to-data.md#permissions) article. |
| **resourceTokenPermissionMode** | **resourceTokenPermissionMode_s** | This property indicates the permission mode that you have set when creating the resource token. The permission mode can have values such as "all" or "read". To learn more about permissions, see the [Secure access to your data](./secure-access-to-data.md#permissions) article. |
| **resourceTokenUserRid** | **resourceTokenUserRid_s** | This value is non-empty when [resource tokens](./secure-access-to-data.md#resource-tokens) are used for authentication. The value points to the resource ID of the user. |
| **responseLength** | **responseLength_s** | The length of the response, in bytes.|

<!-- ## Activity log. Required section. -->
[!INCLUDE [horz-monitor-ref-activity-log](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.DocumentDB resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftdocumentdb)

<!-- ## Other schemas. Optional section. Please keep heading in this order. If your service uses other schemas, add the following include and information. 
[!INCLUDE [horz-monitor-ref-other-schemas](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-other-schemas.md)]
List other schemas and their usage here. These can be resource logs, alerts, event hub formats, etc. depending on what you think is important. You can put JSON messages, API responses not listed in the REST API docs, and other similar types of info here.  -->

## Related content

- See [Monitor Azure Cosmos DB](monitor.md) for a description of monitoring Azure Cosmos DB.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
