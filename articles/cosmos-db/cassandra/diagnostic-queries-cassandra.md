---
title: Troubleshoot issues with advanced diagnostics queries for Cassandra API
titleSuffix: Azure Cosmos DB
description: Learn how to use Azure Log Analytics to improve the performance and health of your Azure Cosmos DB Cassandra API account.
author: StefArroyo
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: how-to
ms.date: 06/12/2021
ms.author: esarroyo 
---

# Troubleshoot issues with advanced diagnostics queries for the Cassandra API

[!INCLUDE[appliesto-all-apis-except-table](../includes/appliesto-all-apis-except-table.md)]

> [!div class="op_single_selector"]
> * [SQL (Core) API](../cosmos-db-advanced-queries.md)
> * [MongoDB API](../mongodb/diagnostic-queries-mongodb.md)
> * [Cassandra API](diagnostic-queries-cassandra.md)
> * [Gremlin API](../queries-gremlin.md)


In this article, we'll cover how to write more advanced queries to help troubleshoot issues with your Azure Cosmos DB Cassansra API account by using diagnostics logs sent to **resource-specific** tables.

For Azure Diagnostics tables, all data is written into one single table. Users specify which category they want to query. If you want to view the full-text query of your request, see [Monitor Azure Cosmos DB data by using diagnostic settings in Azure](../cosmosdb-monitor-resource-logs.md#full-text-query) to learn how to enable this feature.

For [resource-specific tables](../cosmosdb-monitor-resource-logs.md#create-setting-portal), data is written into individual tables for each category of the resource. We recommend this mode because it:

- Makes it much easier to work with the data. 
- Provides better discoverability of the schemas.
- Improves performance across both ingestion latency and query times.


## Prerequisites

- Create [Cassandra API account](create-account-java.md)
- Create a [Log Analytics Workspace](../../azure-monitor/logs/quick-create-workspace.md).
- Create [Diagnostic Settings](../cosmosdb-monitor-resource-logs.md).

> [!WARNING]
> When creating a Diagnostic Setting for the Cassandra API account, ensure that "DataPlaneRequests" remain unselected. In addition, for the Destination table, ensure "Resource specific" is chosen as it offers significant cost savings over "Azure diagnostics.

> [!NOTE]
> Note that enabling full text diagnostics, the queries returned will contain PII data.
> This feature will not only log the skeleton of the query with obfuscated parameters but log the values of the parameters themselves. 
> This can help in diagnosing whether queries on a specific Primary Key (or set of Primary Keys) are consuming far more RUs than queries on other Primary Keys.

## Log Analytics queries with different scenarios

:::image type="content" source="./media/cassandra-log-analytics/log-analytics-questions-bubble.png" alt-text="Image of a bubble word map with possible questions on how to leverage Log Analytics within Cosmos DB":::

### RU consumption
- Cassandra operations that are consuming high RU/s.
```kusto
CDBCassandraRequests 
| where DatabaseName=="azure_comos" and CollectionName=="user" 
| project TimeGenerated, RequestCharge, OperationName,
requestType=split(split(PIICommandText,'"')[3], ' ')[0]
| summarize max(RequestCharge) by bin(TimeGenerated, 10m), tostring(requestType), OperationName;
```

- Monitoring RU consumption per operation on logical partition keys.
```kusto
CDBPartitionKeyRUConsumption
| where DatabaseName=="azure_comos" and CollectionName=="user"
| summarize TotalRequestCharge=sum(todouble(RequestCharge)) by PartitionKey, PartitionKeyRangeId
| order by TotalRequestCharge;

CDBPartitionKeyRUConsumption
| where DatabaseName=="azure_comos" and CollectionName=="user"
| summarize TotalRequestCharge=sum(todouble(RequestCharge)) by OperationName, PartitionKey
| order by TotalRequestCharge;

CDBPartitionKeyRUConsumption
| where DatabaseName=="azure_comos" and CollectionName=="user"
| summarize TotalRequestCharge=sum(todouble(RequestCharge)) by bin(TimeGenerated, 1m), PartitionKey
| render timechart;
```

- What are the top queries impacting RU consumption?
```kusto
CDBCassandraRequests
| where DatabaseName=="azure_cosmos" and CollectionName=="user"
| where TimeGenerated > ago(24h)
| project ActivityId, DatabaseName, CollectionName, queryText=split(split(PIICommandText,'"')[3], ' ')[0], RequestCharge, TimeGenerated
| order by RequestCharge desc;
```
- RU consumption based on variations in payload sizes for read and write operations.
```kusto
// This query is looking at read operations
CDBCassandraRequests
| where DatabaseName=="azure_cosmos" and CollectionName=="user"
| project ResponseLength, TimeGenerated, RequestCharge, cassandraOperationName=split(split(PIICommandText,'"')[3], ' ')[0]
| where cassandraOperationName =="SELECT"
| summarize maxResponseLength=max(ResponseLength), maxRU=max(RequestCharge) by bin(TimeGenerated, 10m), tostring(cassandraOperationName)

// This query is looking at write operations
CDBCassandraRequests
| where DatabaseName=="azure_cosmos" and CollectionName=="user"
| project ResponseLength, TimeGenerated, RequestCharge, cassandraOperationName=split(split(PIICommandText,'"')[3], ' ')[0]
| where cassandraOperationName in ("CREATE", "UPDATE", "INSERT", "DELETE", "DROP")
| summarize maxResponseLength=max(ResponseLength), maxRU=max(RequestCharge) by bin(TimeGenerated, 10m), tostring(cassandraOperationName)

// Write operations over a time period.
CDBCassandraRequests
| where DatabaseName=="azure_cosmos" and CollectionName=="user"
| project ResponseLength, TimeGenerated, RequestCharge, cassandraOperationName=split(split(PIICommandText,'"')[3], ' ')[0]
| where cassandraOperationName in ("CREATE", "UPDATE", "INSERT", "DELETE", "DROP")
| summarize maxResponseLength=max(ResponseLength), maxRU=max(RequestCharge) by bin(TimeGenerated, 10m), tostring(cassandraOperationName)
| render timechart;

// Read operations over a time period.
CDBCassandraRequests
| where DatabaseName=="azure_cosmos" and CollectionName=="user"
| project ResponseLength, TimeGenerated, RequestCharge, cassandraOperationName=split(split(PIICommandText,'"')[3], ' ')[0]
| where cassandraOperationName =="SELECT"
| summarize maxResponseLength=max(ResponseLength), maxRU=max(RequestCharge) by bin(TimeGenerated, 10m), tostring(cassandraOperationName)
| render timechart;
```

- RU consumption based on read and write operations by logical partition.
```kusto
CDBPartitionKeyRUConsumption
| where DatabaseName=="azure_cosmos" and CollectionName=="user"
| where OperationName in ("Delete", "Read", "Upsert")
| summarize totalRU=max(RequestCharge) by OperationName, PartitionKeyRangeId
```

- RU consumption by physical and logical partition.
```kusto
CDBPartitionKeyRUConsumption
| where DatabaseName=="azure_cosmos" and CollectionName=="user"
| summarize totalRequestCharge=sum(RequestCharge) by PartitionKey, PartitionKeyRangeId;
```

- Is a hot partition leading to high RU consumption?
```kusto
CDBPartitionKeyStatistics
| where DatabaseName=="azure_cosmos" and CollectionName=="user"
| where  TimeGenerated > now(-8h)
| summarize StorageUsed = sum(SizeKb) by PartitionKey
| order by StorageUsed desc
```

- How does the partition key affect RU consumption?
```kusto
let storageUtilizationPerPartitionKey = 
CDBPartitionKeyStatistics
| project AccountName=tolower(AccountName), PartitionKey, SizeKb;
CDBCassandraRequests
| project AccountName=tolower(AccountName),RequestCharge, ErrorCode, OperationName, ActivityId, DatabaseName, CollectionName, PIICommandText, RegionName
| where DatabaseName=="azure_cosmos" and CollectionName=="user"
| join kind=inner storageUtilizationPerPartitionKey  on $left.AccountName==$right.AccountName
| where ErrorCode != -1 //successful
| project AccountName, PartitionKey,ErrorCode,RequestCharge,SizeKb, OperationName, ActivityId, DatabaseName, CollectionName, PIICommandText, RegionName;
```

### Latency
- Number of server-side timeouts (Status Code - 408) seen in the time window.
```kusto
CDBCassandraRequests
| where DatabaseName=="azure_cosmos" and CollectionName=="user"
| where ErrorCode in (4608, 4352) //Corresponding code in Cassandra
| summarize max(DurationMs) by bin(TimeGenerated, 10m), ErrorCode
| render timechart;
```

- Do we observe spikes in server-side latencies in the specified time window?
```kusto
CDBCassandraRequests
| where TimeGenerated > now(-6h)
| DatabaseName=="azure_cosmos" and CollectionName=="user"
| summarize max(DurationMs) by bin(TimeGenerated, 10m)
| render timechart;
```

- Operations that are getting throttled.
```kusto
CDBCassandraRequests
| where DatabaseName=="azure_cosmos" and CollectionName=="user"
| project RequestLength, ResponseLength,
RequestCharge, DurationMs, TimeGenerated, OperationName,
query=split(split(PIICommandText,'"')[3], ' ')[0]
| summarize max(DurationMs) by bin(TimeGenerated, 10m), RequestCharge, tostring(query),
RequestLength, OperationName
| order by RequestLength, RequestCharge;
```

### Throttling
- Is your application experiencing any throttling?
```kusto
CDBCassandraRequests
| where RetriedDueToRateLimiting != false and RateLimitingDelayMs > 0;
```
- What queries are causing your application to throttle with a specified time period looking specifically at 429.
```kusto
CDBCassandraRequests
| where DatabaseName=="azure_cosmos" and CollectionName=="user"
| where ErrorCode==4097 // Corresponding error code in Cassandra
| project DatabaseName , CollectionName , CassandraCommands=split(split(PIICommandText,'"')[3], ' ')[0] , OperationName, TimeGenerated;
```


## Next steps
- Enable [log analytics](../../azure-monitor/logs/log-analytics-overview.md) on your Cassandra API account.
- Overview [error code definition](error-codes-solution.md).