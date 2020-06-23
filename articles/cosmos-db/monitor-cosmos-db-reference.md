---
title: Azure Cosmos DB monitoring data reference | Microsoft Docs
description: Log and metrics reference for monitoring data from Azure Cosmos DB.
author: bwren
services: azure-monitor
ms.service: azure-monitor
ms.topic: reference
ms.date: 11/11/2019
ms.author: bwren
ms.custom: subject-monitoring 
ms.subservice: logs
---

# Azure Cosmos DB monitoring data reference
This article provides a reference of log and metric data collected to analyze the performance and availability of Azure Cosmos DB. See [Monitoring Cosmos DB](monitor-cosmos-db.md) for details on collecting and analyzing monitoring data for Azure Cosmos DB.


## Resource logs
The following table lists the properties for Azure Cosmos DB resource logs when they're collected in Azure Monitor Logs or Azure Storage. In Azure Monitor Logs, they're collected in the **AzureDiagnostics** table with a **ResourceProvider** value of *MICROSOFT.DOCUMENTDB*. 

| Azure Storage field or property | Azure Monitor Logs property | Description |
| --- | --- | --- |
| **time** | **TimeGenerated** | The date and time (UTC) when the operation occurred. |
| **resourceId** | **Resource** | The Azure Cosmos DB account for which logs are enabled.|
| **category** | **Category** | For Azure Cosmos DB logs, **DataPlaneRequests**, **MongoRequests**, **QueryRuntimeStatistics**, **PartitionKeyStatistics**, **PartitionKeyRUConsumption**, **ControlPlaneRequests** are the available log types. |
| **operationName** | **OperationName** | Name of the operation. This value can be any of the following operations: Create, Update, Read, ReadFeed, Delete, Replace, Execute, SqlQuery, Query, JSQuery, Head, HeadFeed, or Upsert.   |
| **properties** | n/a | The contents of this field are described in the rows that follow. |
| **activityId** | **activityId_g** | The unique GUID for the logged operation. |
| **userAgent** | **userAgent_s** | A string that specifies the client user agent that's performing the request. The format is {user agent name}/{version}.|
| **requestResourceType** | **requestResourceType_s** | The type of the resource accessed. This value can be any of the following resource types: Database, Container, Document, Attachment, User, Permission, StoredProcedure, Trigger, UserDefinedFunction, or Offer. |
| **statusCode** | **statusCode_s** | The response status of the operation. |
| **requestResourceId** | **ResourceId** | The resourceId that pertains to the request. The value may point to databaseRid, collectionRid, or documentRid depending on the operation performed.|
| **clientIpAddress** | **clientIpAddress_s** | The client's IP address. |
| **requestCharge** | **requestCharge_s** | The number of RUs that are used by the operation |
| **collectionRid** | **collectionId_s** | The unique ID for the collection.|
| **duration** | **duration_s** | The duration of the operation, in milliseconds. |
| **requestLength** | **requestLength_s** | The length of the request, in bytes. |
| **responseLength** | **responseLength_s** | The length of the response, in bytes.|
| **resourceTokenUserRid** | **resourceTokenUserRid_s** | This value is non-empty when [resource tokens](https://docs.microsoft.com/azure/cosmos-db/secure-access-to-data#resource-tokens) are used for authentication. The value points to the resource ID of the user. |
| **responseLength** | **responseLength_s** | The length of the response, in bytes.|

For a list of all Azure Monitor log categories and links to associated schemas, see [Azure Monitor Logs categories and schemas](../azure-monitor/platform/diagnostic-logs-schema.md). 

## Metrics
The following tables list the platform metrics collected for Azure CosmOS DB. All metrics are stored in the namespace **Cosmos DB standard metrics**.

For a list of all Azure Monitor support metrics (including CosmosDB), see [Azure Monitor supported metrics](../azure-monitor/platform/metrics-supported.md). 

#### Request metrics
			
|Metric (Metric Display Name)|Unit (Aggregation Type) |Description|Dimensions| Time granularities| Legacy metric mapping | Usage |
|---|---|---|---| ---| ---| ---|
| TotalRequests (Total Requests) | Count (Count) | Number of requests made| DatabaseName, CollectionName, Region, StatusCode| All | TotalRequests, Http 2xx, Http 3xx, Http 400, Http 401, Internal Server error, Service Unavailable, Throttled Requests, Average Requests per Second | Used to monitor requests per status code, container at a minute granularity. To get average requests per second, use Count aggregation at minute and divide by 60. |
| MetadataRequests (Metadata Requests) |Count (Count) | Count of metadata requests. Azure Cosmos DB maintains system metadata container for each account, that allows you to enumerate collections, databases, etc., and their configurations, free of charge. | DatabaseName, CollectionName, Region, StatusCode| All| |Used to monitor throttles due to metadata requests.|
| MongoRequests (Mongo Requests) | Count (Count) | Number of Mongo Requests Made | DatabaseName, CollectionName, Region, CommandName, ErrorCode| All |Mongo Query Request Rate, Mongo Update Request Rate, Mongo Delete Request Rate, Mongo Insert Request Rate, Mongo Count Request Rate| Used to monitor Mongo request errors, usages per command type. |

#### Request Unit metrics

|Metric (Metric Display Name)|Unit (Aggregation Type)|Description|Dimensions| Time granularities| Legacy metric mapping | Usage |
|---|---|---|---| ---| ---| ---|
| MongoRequestCharge (Mongo Request Charge) | Count (Total) |Mongo Request Units Consumed| DatabaseName, CollectionName, Region, CommandName, ErrorCode| All |Mongo Query Request Charge, Mongo Update Request Charge, Mongo Delete Request Charge, Mongo Insert Request Charge, Mongo Count Request Charge| Used to monitor Mongo resource RUs in a minute.|
| TotalRequestUnits (Total Request Units)| Count (Total) | Request Units consumed| DatabaseName, CollectionName, Region, StatusCode |All| TotalRequestUnits| Used to monitor Total RU usage at a minute granularity. To get average RU consumed per second, use Total aggregation at minute and divide by 60.|
| ProvisionedThroughput (Provisioned Throughput)| Count (Maximum) |Provisioned throughput at container granularity| DatabaseName, ContainerName| 5M| | Used to monitor provisioned throughput per container.|

#### Storage metrics

|Metric (Metric Display Name)|Unit (Aggregation Type)|Description|Dimensions| Time granularities| Legacy metric mapping | Usage |
|---|---|---|---| ---| ---| ---|
| AvailableStorage (Available Storage) |Bytes (Total) | Total available storage reported at 5-minutes granularity per region| DatabaseName, CollectionName, Region| 5M| Available Storage| Used to monitor available storage capacity (applicable only for fixed storage collections) Minimum granularity should be 5 minutes.| 
| DataUsage (Data Usage) |Bytes (Total) |Total data usage reported at 5-minutes granularity per region| DatabaseName, CollectionName, Region| 5M |Data size | Used to monitor total data usage at container and region, minimum granularity should be 5 minutes.|
| IndexUsage (Index Usage) | Bytes (Total) |Total Index usage reported at 5-minutes granularity per region| DatabaseName, CollectionName, Region| 5M| Index Size| Used to monitor total data usage at container and region, minimum granularity should be 5 minutes. |
| DocumentQuota (Document Quota) | Bytes (Total) | Total storage quota reported at 5-minutes granularity per region.| DatabaseName, CollectionName, Region| 5M |Storage Capacity| Used to monitor total quota at container and region, minimum granularity should be 5 minutes.|
| DocumentCount (Document Count) | Count (Total) |Total document count reported at 5-minutes granularity per region| DatabaseName, CollectionName, Region| 5M |Document Count|Used to monitor document count at container and region, minimum granularity should be 5 minutes.|

#### Latency metrics

|Metric (Metric Display Name)|Unit (Aggregation Type)|Description|Dimensions| Time granularities| Usage |
|---|---|---|---| ---| ---|
| ReplicationLatency (Replication Latency)| MilliSeconds (Minimum, Maximum, Average) | P99 Replication Latency across source and target regions for geo-enabled account| SourceRegion, TargetRegion| All | Used to monitor P99 replication latency between any two regions for a geo-replicated account. |
| Server Side Latency| MilliSeconds (Average) | Time taken by the server to process the request. | CollectionName, ConnectionMode, DatabaseName, OperationType, PublicAPIType, Region |	All	| Used to monitor the request latency on the Azure Cosmos DB server. |



#### Availability metrics

|Metric (Metric Display Name) |Unit (Aggregation Type)|Description| Time granularities| Legacy metric mapping | Usage |
|---|---|---|---| ---| ---|
| ServiceAvailability (Service Availability)| Percent (Minimum, Maximum) | Account requests availability at one hour granularity| 1H | Service Availability | Represents the percent of total passed requests. A request is considered to be failed due to system error if the status code is 410, 500 or 503 Used to monitor availability of the account at hour granularity. |


#### Cassandra API metrics

|Metric (Metric Display Name)|Unit (Aggregation Type)|Description|Dimensions| Time granularities| Usage |
|---|---|---|---| ---| ---|
| CassandraRequests (Cassandra Requests) | Count (Count) | Number of Cassandra API requests made| DatabaseName, CollectionName, ErrorCode, Region, OperationType, ResourceType| All| Used to monitor Cassandra requests at a minute granularity. To get average requests per second, use Count aggregation at minute and divide by 60.|
| CassandraRequestCharges (Cassandra Request Charges) | Count (Sum, Min, Max, Avg) | Request Units consumed by Cassandra API requests| DatabaseName, CollectionName, Region, OperationType, ResourceType| All| Used to monitor RUs used per minute by a Cassandra API account.|
| CassandraConnectionClosures (Cassandra Connection Closures) |Count (Count) |Number of Cassandra Connections closed| ClosureReason, Region| All | Used to monitor the connectivity between clients and the Azure Cosmos DB Cassandra API.|

## See Also

- See [Monitoring Azure Cosmos DB](monitor-cosmos-db.md) for a description of monitoring Azure Cosmos DB.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/insights/monitor-azure-resource.md) for details on monitoring Azure resources.
