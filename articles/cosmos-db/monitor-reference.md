---
title: Monitoring Azure Cosmos DB data reference | Microsoft Docs
description: Important reference material needed when you monitor logs and metrics in Azure Cosmos DB.
ms.author: esarroyo
author: StefArroyo 
ms.service: cosmos-db
ms.topic: how-to
ms.date: 04/14/2023
ms.custom: subject-monitoring, ignite-2022
---

# Monitoring Azure Cosmos DB data reference

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

This article provides a reference of log and metric data collected to analyze the performance and availability of Azure Cosmos DB. See the [Monitor Azure Cosmos DB](monitor.md) article for details on collecting and analyzing monitoring data for Azure Cosmos DB.

## Metrics

All the metrics corresponding to Azure Cosmos DB are stored in the namespace **Azure Cosmos DB standard metrics**. For a list of all Azure Monitor support metrics (including Azure Cosmos DB), see [Azure Monitor supported metrics](../azure-monitor/essentials/metrics-supported.md). This section lists all the automatically collected platform metrics collected for Azure Cosmos DB.  

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

### Storage metrics

|Metric (Metric Display Name)|Unit (Aggregation Type)|Description|Dimensions| Time granularities| Legacy metric mapping | Usage |
|---|---|---|---| ---| ---| ---|
| AvailableStorage (Available Storage) |Bytes (Total) | Total available storage reported at 5-minutes granularity per region| DatabaseName, CollectionName, Region| 5M| Available Storage| Used to monitor available storage capacity (applicable only for fixed storage collections) Minimum granularity should be 5 minutes.| 
| DataUsage (Data Usage) |Bytes (Total) |Total data usage reported at 5-minutes granularity per region| DatabaseName, CollectionName, Region| 5M |Data size | Used to monitor total data usage at container and region, minimum granularity should be 5 minutes.|
| IndexUsage (Index Usage) | Bytes (Total) |Total Index usage reported at 5-minutes granularity per region| DatabaseName, CollectionName, Region| 5M| Index Size| Used to monitor total data usage at container and region, minimum granularity should be 5 minutes. |
| DocumentQuota (Document Quota) | Bytes (Total) | Total storage quota reported at 5-minutes granularity per region.| DatabaseName, CollectionName, Region| 5M |Storage Capacity| Used to monitor total quota at container and region, minimum granularity should be 5 minutes.|
| DocumentCount (Document Count) | Count (Total) |Total document count reported at 5-minutes granularity per region| DatabaseName, CollectionName, Region| 5M |Document Count|Used to monitor document count at container and region, minimum granularity should be 5 minutes.|

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

For more information, see a list of [all platform metrics supported in Azure Monitor](../azure-monitor/essentials/metrics-supported.md).

## Resource logs

The following table lists the properties of resource logs in Azure Cosmos DB. The resource logs are collected into Azure Monitor Logs or Azure Storage. In Azure Monitor, logs are collected in the **AzureDiagnostics** table under the resource provider** name of `MICROSOFT.DOCUMENTDB`.

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

For a list of all Azure Monitor log categories and links to associated schemas, see [Azure Monitor Logs categories and schemas](../azure-monitor/essentials/resource-logs-schema.md). 

## Azure Monitor Logs tables

Azure Cosmos DB uses Kusto tables from Azure Monitor Logs. You can query these tables with Log analytics. For a list of Kusto tables Azure Cosmos DB uses, see the [Azure Monitor Logs table reference](/azure/azure-monitor/reference/tables/tables-resourcetype#azure-cosmos-db) article.

## See Also

- See [Monitoring Azure Cosmos DB](monitor.md) for a description of monitoring Azure Cosmos DB.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.
