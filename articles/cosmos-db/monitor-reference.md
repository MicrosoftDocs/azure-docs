---
title: Monitoring data reference for Azure Cosmos DB
description: This article contains important reference material you need when you monitor Azure Cosmos DB.
ms.date: 03/02/2024
ms.custom: horz-monitor
ms.topic: reference
ms.author: esarroyo
author: StefArroyo
ms.service: cosmos-db
---

# Azure Cosmos DB monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Cosmos DB](monitor.md) for details on the data you can collect for Azure Cosmos DB and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]
For a list of all Azure Monitor supported metrics, including Azure Cosmos DB, see [Azure Monitor supported metrics](/azure/azure-monitor/essentials/metrics-supported).

### Supported metrics for Microsoft.DocumentDB/DatabaseAccounts
The following table lists the metrics available for the Microsoft.DocumentDB/DatabaseAccounts resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [microsoft-documentdb-databaseaccounts-metrics-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-documentdb-databaseaccounts-metrics-include.md)]

### Supported metrics for Microsoft.DocumentDB/cassandraClusters
The following table lists the metrics available for the Microsoft.DocumentDB/cassandraClusters resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [microsoft-documentdb-cassandraclusters-metrics-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-documentdb-cassandraclusters-metrics-include.md)]

### Supported metrics for Microsoft.DocumentDB/mongoClusters
The following table lists the metrics available for the Microsoft.DocumentDB/mongoClusters resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [microsoft-documentdb-mongoclusters-metrics-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-documentdb-mongoclusters-metrics-include.md)]

### Metrics by category

The following tables list Azure Cosmos DB metrics categorized by metric type.

#### Request metrics

- TotalRequests (Total Requests)
- MetadataRequests (Metadata Requests)
- MongoRequests (Mongo Requests)

#### Request Unit metrics

- MongoRequestCharge (Mongo Request Charge)
- TotalRequestUnits (Total Request Units)
- ProvisionedThroughput (Provisioned Throughput)
- AutoscaleMaxThroughput (Autoscale Max Throughput)
- PhysicalPartitionThroughputInfo (Physical Partition Throughput Info)

#### Storage metrics

- AvailableStorage (Available Storage)
- DataUsage (Data Usage)
- IndexUsage (Index Usage)
- DocumentQuota (Document Quota)
- DocumentCount (Document Count)
- PhysicalPartitionSizeInfo (Physical Partition Size Info)

#### Latency metrics

- ReplicationLatency (Replication Latency)
- Server Side Latency

#### Availability metrics

- ServiceAvailability (Service Availability)

#### API for Cassandra metrics

- CassandraRequests (Cassandra Requests)
- CassandraRequestCharges (Cassandra Request Charges)
- CassandraConnectionClosures (Cassandra Connection Closures)

### Error codes for Cassandra

The following table lists error codes for your API for Cassandra account. For sample queries, see [Server diagnostics for Azure Cosmos DB for Apache Cassandra](cassandra/error-codes-solution.md)

|Status code | Error code           | Description  |
|------------|----------------------|--------------|
| 200 | -1 | Successful |
| 400 |	8704 | The query is correct but an invalid syntax. |
| 400 |	8192 | The submitted query has a syntax error. Review your query. |
| 400 |	8960 | The query is invalid because of some configuration issue. |
| 401 |8448 | The logged user does not have the right permissions to perform the query. |
| 403 |	8448 | Forbidden response as the user may not have the necessary permissions to carry out the request. |
| 404 | 5376 | A non-timeout exception during a write request as a result of response not found. |
| 405 |	0 | Server-side Cassandra error. The error rarely occurs, open a support ticket. |
| 408 | 4608 | Timeout during a read request. |
| 408 |	4352 | Timeout exception during a write serviceRequest. |
| 409 |	9216 | Attempting to create a keyspace or table that already exist. |
| 412 | 5376 | Precondition failure. To ensure data integrity, we ensure that the write request based on the read response is true. A non-timeout write request exception is returned. |
| 413 | 5376 | This non-timeout exception during a write request is because of payload maybe too large. Currently, there is a limit of 2MB per row. |
| 417 | 9472 | The exception is thrown when a prepared statement is not cached on the server node. It should be transient/non-blocking. |
| 423 | 5376 | There is a lock because a write request that is currently processing. |
| 429 | 4097| Overload exception is as a result of RU shortage or high request rate. Probably need more RU to handle the higher volume request. In, native Cassandra this can be interpreted as one of the VMs not having enough CPU. We advise reviewing current data model to ensure that you do not have excessive skews that might be causing hot partitions. |
| 449 |	5376 | Concurrent execution exception. This occurs to ensure only one write update at a time for a given row. |
| 500 |	0 |	Server cassandraError: something unexpected happened. This indicates a server-side bug. |
| 503 |	4096 | Service unavailable. |
| 	| 256 | This may be because of invalid connection credentials. Please check your connection credentials. |
| 	| 10 | A client message triggered protocol violation. An example is query message sent before a startup one has been sent. |

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]
[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

### Microsoft.DocumentDB/DatabaseAccounts

- ApiKindResourceType
- APIType
- ApplicationType
- BuildType
- CacheEntryType
- CacheExercised
- CacheHit
- CapacityType
- ChildResourceName
- ClosureReason
- CommandName
- ConnectionMode
- DiagnosticSettingsName
- Error
- ErrorCode
- IsExternal
- IsSharedThroughputOffer
- IsThroughputRequest
- KeyType
- MetricType
- NotStarted
- OfferOwnerRid
- PartitionKeyRangeId
- PhysicalPartitionId
- PhysicalPartitionId
- PriorityLevel
- PublicAPIType
- ReplicationInProgress
- ResourceGroupName
- ResourceName
- Role
- SourceRegion
- TargetContainerName
- TargetRegion

### Microsoft.DocumentDB/cassandraClusters

- cassandra_datacenter
- cassandra_node
- cache_name

### Microsoft.DocumentDB/mongoClusters

- ServerName

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.DocumentDB/DatabaseAccounts
[!INCLUDE [microsoft-documentdb-databaseaccounts-logs-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-documentdb-databaseaccounts-logs-include.md)]

### Supported resource logs for Microsoft.DocumentDB/cassandraClusters
[!INCLUDE [microsoft-documentdb-cassandraclusters-logs-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-documentdb-cassandraclusters-logs-include.md)]

### Supported resource logs for Microsoft.DocumentDB/mongoClusters
[!INCLUDE [microsoft-documentdb-mongoclusters-logs-include](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-documentdb-mongoclusters-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

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
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/AzureDiagnostics#columns). Logs are collected in the **AzureDiagnostics** table under the resource provider name of `MICROSOFT.DOCUMENTDB`.

### Azure Managed Instance for Apache Cassandra
Microsoft.DocumentDB/cassandraClusters

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [CassandraAudit](/azure/azure-monitor/reference/tables/CassandraAudit#columns)
- [CassandraLogs](/azure/azure-monitor/reference/tables/CassandraLogs#columns)

### Azure Cosmos DB for MongoDB (vCore)
Microsoft.DocumentDB/mongoClusters

- [VCoreMongoRequests](/azure/azure-monitor/reference/tables/VCoreMongoRequests#columns)

### Azure Cosmos DB resource logs properties

The following table lists properties of resource logs in Azure Cosmos DB. The resource logs are collected into Azure Monitor Logs or Azure Storage.

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

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.DocumentDB resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftdocumentdb)

## Related content

- See [Monitor Azure Cosmos DB](monitor.md) for a description of monitoring Azure Cosmos DB.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
