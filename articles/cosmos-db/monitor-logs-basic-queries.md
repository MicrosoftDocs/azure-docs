---
title: Troubleshoot issues with diagnostics queries
titleSuffix: Azure Cosmos DB
description: Query diagnostics logs using the Kusto query language (KQL) to troubleshoot queries and operations in Azure Cosmos DB.
author: StefArroyo
ms.author: esarroyo
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: reference
ms.date: 08/22/2023
ms.custom: ignite-2022
---

# Troubleshoot issues with diagnostics queries

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

In this article, we cover how to write simple queries to help troubleshoot issues with your Azure Cosmos DB account using diagnostics logs sent to **AzureDiagnostics (legacy)** and **Resource-specific (preview)** tables.

For Azure Diagnostics tables, all data is written into one single table and users need to specify which category they'd like to query.

For resource-specific tables, data is written into individual tables for each category of the resource (not available for table API). We recommend this mode since it makes it much easier to work with the data, provides better discoverability of the schemas, and improves performance across both ingestion latency and query times.

## Common queries

Here's a list of common troubleshooting queries.

### Query for operations that are taking longer than 3 milliseconds to run

Find operations that have a duration greater than 3 milliseconds.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```Kusto
AzureDiagnostics 
| where toint(duration_s) > 3 and ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests" 
| summarize count() by clientIpAddress_s, TimeGenerated
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBDataPlaneRequests 
| where toint(DurationMs) > 3
| summarize count() by ClientIpAddress, TimeGenerated
```

---

### Query for user agents that are running operations

Find user agents associated with each operation.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```Kusto
AzureDiagnostics 
| where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests" 
| summarize count() by OperationName, userAgent_s
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBDataPlaneRequests
| summarize count() by OperationName, UserAgent
```

---
### Query for long-running operations

Find operations that ran for a long time by binning their runtime into five-second intervals.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```Kusto
AzureDiagnostics 
| where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests" 
| project TimeGenerated , duration_s 
| summarize count() by bin(TimeGenerated, 5s)
| render timechart
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBDataPlaneRequests
| project TimeGenerated , DurationMs 
| summarize count() by bin(TimeGenerated, 5s)
| render timechart
```

---

### Get partition key statistics to evaluate skew across top three partitions for a database account

Measure skew by getting common statistics for physical partitions.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```Kusto
AzureDiagnostics 
| where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="PartitionKeyStatistics" 
| project SubscriptionId, regionName_s, databaseName_s, collectionName_s, partitionKey_s, sizeKb_d, ResourceId 
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBPartitionKeyStatistics
| project RegionName, DatabaseName, CollectionName, PartitionKey, SizeKb
```

---

### Get the request charges for expensive queries

Measure the request charge (in RUs) for the largest queries.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```Kusto
AzureDiagnostics
| where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests" and todouble(requestCharge_s) > 10.0
| project activityId_g, requestCharge_s
| join kind= inner (
AzureDiagnostics
| where ResourceProvider =="MICROSOFT.DOCUMENTDB" and Category == "QueryRuntimeStatistics"
| project activityId_g, querytext_s
) on $left.activityId_g == $right.activityId_g
| order by requestCharge_s desc
| limit 100
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBDataPlaneRequests
| where todouble(RequestCharge) > 10.0
| project ActivityId, RequestCharge
| join kind= inner (
CDBQueryRuntimeStatistics
| project ActivityId, QueryText
) on $left.ActivityId == $right.ActivityId
| order by RequestCharge desc
| limit 100
```

---

### Find which operations are taking most RU/s

Sort operations by the amount of RU/s they're using.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```kusto
AzureDiagnostics
| where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests"
| where TimeGenerated >= ago(2h) 
| summarize max(responseLength_s), max(requestLength_s), max(requestCharge_s), count = count() by OperationName, requestResourceType_s, userAgent_s, collectionRid_s, bin(TimeGenerated, 1h)
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBDataPlaneRequests
| where TimeGenerated >= ago(2h) 
| summarize max(ResponseLength), max(RequestLength), max(RequestCharge), count = count() by OperationName, RequestResourceType, UserAgent, CollectionName, bin(TimeGenerated, 1h)
```

---

### Get all queries that are consuming more than 100 RU/s

Find queries that consume more RU/s than a baseline amount.

#### [Azure Diagnostics](#tab/azure-diagnostics)

This query joins with data from ``DataPlaneRequests`` and ``QueryRunTimeStatistics``.

```kusto
AzureDiagnostics
| where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests" and todouble(requestCharge_s) > 100.0
| project activityId_g, requestCharge_s
| join kind= inner (
        AzureDiagnostics
        | where ResourceProvider =="MICROSOFT.DOCUMENTDB" and Category == "QueryRuntimeStatistics"
        | project activityId_g, querytext_s
) on $left.activityId_g == $right.activityId_g
| order by requestCharge_s desc
| limit 100
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBDataPlaneRequests
| where todouble(RequestCharge) > 100.0
| project ActivityId, RequestCharge
| join kind= inner (
CDBQueryRuntimeStatistics
| project ActivityId, QueryText
) on $left.ActivityId == $right.ActivityId
| order by RequestCharge desc
| limit 100
```

---

### Get the request charges and the execution duration of a query

Get statistics in both request charge and duration for a specific query.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```kusto
AzureDiagnostics
| where TimeGenerated >= ago(24hr)
| where Category == "QueryRuntimeStatistics"
| join (
AzureDiagnostics
| where TimeGenerated >= ago(24hr)
| where Category == "DataPlaneRequests"
) on $left.activityId_g == $right.activityId_g
| project databasename_s, collectionname_s, OperationName1 , querytext_s,requestCharge_s1, duration_s1, bin(TimeGenerated, 1min)
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBQueryRuntimeStatistics
| join kind= inner (
CDBDataPlaneRequests
) on $left.ActivityId == $right.ActivityId
| project DatabaseName, CollectionName, OperationName , QueryText, RequestCharge, DurationMs, bin(TimeGenerated, 1min)
```

---

### Get the distribution for different operations

Group operations by the resource distribution.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```kusto
AzureDiagnostics
| where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests"
| where TimeGenerated >= ago(2h) 
| summarize count = count()  by OperationName, requestResourceType_s, bin(TimeGenerated, 1h) 
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBDataPlaneRequests
| where TimeGenerated >= ago(2h) 
| summarize count = count()  by OperationName, RequestResourceType, bin(TimeGenerated, 1h)
```

---

### Get the maximum throughput that a partition has consumed

Get the maximum throughput for a physical partition.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```kusto
AzureDiagnostics
| where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests"
| where TimeGenerated >= ago(2h) 
| summarize max(requestCharge_s) by bin(TimeGenerated, 1h), partitionId_g
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBDataPlaneRequests
| where TimeGenerated >= ago(2h) 
| summarize max(RequestCharge) by bin(TimeGenerated, 1h), PartitionId
```

---

### Get information about the partition keys RU/s consumption per second

Measure RU/s consumption on a per-second basis per partition key.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```kusto
AzureDiagnostics 
| where ResourceProvider == "MICROSOFT.DOCUMENTDB" and Category == "PartitionKeyRUConsumption" 
| summarize total = sum(todouble(requestCharge_s)) by databaseName_s, collectionName_s, partitionKey_s, TimeGenerated 
| order by TimeGenerated asc 
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBPartitionKeyRUConsumption 
| summarize total = sum(todouble(RequestCharge)) by DatabaseName, CollectionName, PartitionKey, TimeGenerated 
| order by TimeGenerated asc 
```

---

### Get request charge for a specific partition key

Measure request charge per partition key.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```kusto
AzureDiagnostics 
| where ResourceProvider == "MICROSOFT.DOCUMENTDB" and Category == "PartitionKeyRUConsumption" 
| where parse_json(partitionKey_s)[0] == "2" 
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBPartitionKeyRUConsumption  
| where parse_json(PartitionKey)[0] == "2" 
```

---

### Get top partition keys with most RU/s consumed in a specific period

Sort partition keys based on request unit consumption within a time window.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```kusto
AzureDiagnostics 
| where ResourceProvider == "MICROSOFT.DOCUMENTDB" and Category == "PartitionKeyRUConsumption" 
| where TimeGenerated >= datetime("11/26/2019, 11:20:00.000 PM") and TimeGenerated <= datetime("11/26/2019, 11:30:00.000 PM") 
| summarize total = sum(todouble(requestCharge_s)) by databaseName_s, collectionName_s, partitionKey_s 
| order by total desc
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBPartitionKeyRUConsumption
| where TimeGenerated >= datetime("02/12/2021, 11:20:00.000 PM") and TimeGenerated <= datetime("05/12/2021, 11:30:00.000 PM") 
| summarize total = sum(todouble(RequestCharge)) by DatabaseName, CollectionName, PartitionKey 
| order by total desc
```

---

### Get logs for the partition keys whose storage size is greater than 8 GB

Find logs for partition keys filtered by the size of storage per partition key.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```kusto
AzureDiagnostics
| where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="PartitionKeyStatistics"
| where todouble(sizeKb_d) > 800000
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBPartitionKeyStatistics
| where todouble(SizeKb) > 800000
```

---

### Get P99 or P50 latencies for operations, request charge, or the length of the response

Measure performance for; operation latency, RU/s usage, and response length.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```kusto
AzureDiagnostics
| where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests"
| where TimeGenerated >= ago(2d)
| summarize percentile(todouble(responseLength_s), 50), percentile(todouble(responseLength_s), 99), max(responseLength_s), percentile(todouble(requestCharge_s), 50), percentile(todouble(requestCharge_s), 99), max(requestCharge_s), percentile(todouble(duration_s), 50), percentile(todouble(duration_s), 99), max(duration_s), count() by OperationName, requestResourceType_s, userAgent_s, collectionRid_s, bin(TimeGenerated, 1h)
```

#### [Resource-specific](#tab/resource-specific)

```kusto
CDBDataPlaneRequests
| where TimeGenerated >= ago(2d)
| summarize percentile(todouble(ResponseLength), 50), percentile(todouble(ResponseLength), 99), max(ResponseLength), percentile(todouble(RequestCharge), 50), percentile(todouble(RequestCharge), 99), max(RequestCharge), percentile(todouble(DurationMs), 50), percentile(todouble(DurationMs), 99), max(DurationMs),count() by OperationName, RequestResourceType, UserAgent, CollectionName, bin(TimeGenerated, 1h)
```

---

### Get control plane logs

Get control plane long using ``ControlPlaneRequests``.

> [!TIP]
> Remember to switch on the flag described in [Disable key-based metadata write access](audit-control-plane-logs.md#disable-key-based-metadata-write-access), and execute the operations by using Azure PowerShell, the Azure CLI, or Azure Resource Manager.

#### [Azure Diagnostics](#tab/azure-diagnostics)

```kusto  
AzureDiagnostics 
| where Category =="ControlPlaneRequests"
| summarize by OperationName 
```

#### [Resource-specific](#tab/resource-specific)

```kusto  
CDBControlPlaneRequests
| summarize by OperationName 
```

---

## Next steps

- For more information on how to create diagnostic settings for Azure Cosmos DB, see [Creating Diagnostics settings](monitor-resource-logs.md).
- For detailed information about how to create a diagnostic setting by using the Azure portal, CLI, or PowerShell, see [create diagnostic setting to collect platform logs and metrics in Azure](../azure-monitor/essentials/diagnostic-settings.md).
