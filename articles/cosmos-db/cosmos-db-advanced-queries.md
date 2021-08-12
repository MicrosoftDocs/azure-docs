---
title: Troubleshoot issues with advanced diagnostics queries (SQL API)
titleSuffix: Azure Cosmos DB
description: Learn how to query diagnostics logs to troubleshoot data stored in Azure Cosmos DB - SQL API.
author: StefArroyo
services: cosmos-db
ms.service: cosmos-db
ms.topic: how-to
ms.date: 06/12/2021
ms.author: esarroyo 
---

# Troubleshoot issues with advanced diagnostics queries for the SQL (Core) API

[!INCLUDE[appliesto-all-apis-except-table](includes/appliesto-all-apis-except-table.md)]

> [!div class="op_single_selector"]
> * [SQL (Core) API](cosmos-db-advanced-queries.md)
> * [MongoDB API](mongodb/diagnostic-queries-mongodb.md)
> * [Cassandra API](cassandra/diagnostic-queries-cassandra.md)
> * [Gremlin API](queries-gremlin.md)
>

In this article, we'll cover how to write more advanced queries to help troubleshoot issues with your Azure Cosmos DB account by using diagnostics logs sent to Azure Diagnostics (legacy) and resource-specific (preview) tables.

For Azure Diagnostics tables, all data is written into one single table. Users specify which category they want to query. If you want to view the full-text query of your request, see [Monitor Azure Cosmos DB data by using diagnostic settings in Azure](cosmosdb-monitor-resource-logs.md#full-text-query) to learn how to enable this feature.

For [resource-specific tables](cosmosdb-monitor-resource-logs.md#create-setting-portal), data is written into individual tables for each category of the resource. We recommend this mode because it:

- Makes it much easier to work with the data. 
- Provides better discoverability of the schemas.
- Improves performance across both ingestion latency and query times.

## Common queries
Common queries are shown in the resource-specific and Azure Diagnostics tables.

### Top N(10) queries ordered by Request Unit (RU) consumption in a specific time frame

# [Resource-specific](#tab/resource-specific)

   ```Kusto
   let topRequestsByRUcharge = CDBDataPlaneRequests 
   | where TimeGenerated > ago(24h)
   | project  RequestCharge , TimeGenerated, ActivityId;
   CDBQueryRuntimeStatistics
   | project QueryText, ActivityId, DatabaseName , CollectionName
   | join kind=inner topRequestsByRUcharge on ActivityId
   | project DatabaseName , CollectionName , QueryText , RequestCharge, TimeGenerated
   | order by RequestCharge desc
   | take 10
   ```
# [Azure Diagnostics](#tab/azure-diagnostics)

   ```Kusto
   let topRequestsByRUcharge = AzureDiagnostics
   | where Category == "DataPlaneRequests" and TimeGenerated > ago(24h)
   | project  requestCharge_s , TimeGenerated, activityId_g;
   AzureDiagnostics
   | where Category == "QueryRuntimeStatistics"
   | project querytext_s, activityId_g, databasename_s , collectionname_s
   | join kind=inner topRequestsByRUcharge on activityId_g
   | project databasename_s , collectionname_s , querytext_s , requestCharge_s, TimeGenerated
   | order by requestCharge_s desc
   | take 10
   ```    
---

### Requests throttled (statusCode = 429) in a specific time window 

# [Resource-specific](#tab/resource-specific)

   ```Kusto
   let throttledRequests = CDBDataPlaneRequests
   | where StatusCode == "429"
   | project  OperationName , TimeGenerated, ActivityId;
   CDBQueryRuntimeStatistics
   | project QueryText, ActivityId, DatabaseName , CollectionName
   | join kind=inner throttledRequests on ActivityId
   | project DatabaseName , CollectionName , QueryText , OperationName, TimeGenerated
   ```
# [Azure Diagnostics](#tab/azure-diagnostics)

   ```Kusto
   let throttledRequests = AzureDiagnostics
   | where Category == "DataPlaneRequests" and statusCode_s == "429"
   | project  OperationName , TimeGenerated, activityId_g;
   AzureDiagnostics
   | where Category == "QueryRuntimeStatistics"
   | project querytext_s, activityId_g, databasename_s , collectionname_s
   | join kind=inner throttledRequests on activityId_g
   | project databasename_s , collectionname_s , querytext_s , OperationName, TimeGenerated
   ```    
---

### Queries with the largest response lengths (payload size of the server response)

# [Resource-specific](#tab/resource-specific)

   ```Kusto
   let operationsbyUserAgent = CDBDataPlaneRequests
   | project OperationName, DurationMs, RequestCharge, ResponseLength, ActivityId;
   CDBQueryRuntimeStatistics
   //specify collection and database
   //| where DatabaseName == "DBNAME" and CollectionName == "COLLECTIONNAME"
   | join kind=inner operationsbyUserAgent on ActivityId
   | summarize max(ResponseLength) by QueryText
   | order by max_ResponseLength desc
   ```
# [Azure Diagnostics](#tab/azure-diagnostics)

   ```Kusto
   let operationsbyUserAgent = AzureDiagnostics
   | where Category=="DataPlaneRequests"
   | project OperationName, duration_s, requestCharge_s, responseLength_s, activityId_g;
   AzureDiagnostics
   | where Category == "QueryRuntimeStatistics"
   //specify collection and database
   //| where databasename_s == "DBNAME" and collectioname_s == "COLLECTIONNAME"
   | join kind=inner operationsbyUserAgent on activityId_g
   | summarize max(responseLength_s1) by querytext_s
   | order by max_responseLength_s1 desc
   ```    
---

### RU consumption by physical partition (across all replicas in the replica set)

# [Resource-specific](#tab/resource-specific)

   ```Kusto
   CDBPartitionKeyRUConsumption
   | where TimeGenerated >= now(-1d)
   //specify collection and database
   //| where DatabaseName == "DBNAME" and CollectionName == "COLLECTIONNAME"
   // filter by operation type
   //| where operationType_s == 'Create'
   | summarize sum(todouble(RequestCharge)) by toint(PartitionKeyRangeId)
   | render columnchart
   ```
# [Azure Diagnostics](#tab/azure-diagnostics)

   ```Kusto
   AzureDiagnostics
   | where TimeGenerated >= now(-1d)
   | where Category == 'PartitionKeyRUConsumption'
   //specify collection and database
   //| where databasename_s == "DBNAME" and collectioname_s == "COLLECTIONNAME"
   // filter by operation type
   //| where operationType_s == 'Create'
   | summarize sum(todouble(requestCharge_s)) by toint(partitionKeyRangeId_s)
   | render columnchart  
   ```    
---

### RU consumption by logical partition (across all replicas in the replica set)

# [Resource-specific](#tab/resource-specific)

   ```Kusto
   CDBPartitionKeyRUConsumption
   | where TimeGenerated >= now(-1d)
   //specify collection and database
   //| where DatabaseName == "DBNAME" and CollectionName == "COLLECTIONNAME"
   // filter by operation type
   //| where operationType_s == 'Create'
   | summarize sum(todouble(RequestCharge)) by PartitionKey, PartitionKeyRangeId
   | render columnchart  
   ```
# [Azure Diagnostics](#tab/azure-diagnostics)

   ```Kusto
   AzureDiagnostics
   | where TimeGenerated >= now(-1d)
   | where Category == 'PartitionKeyRUConsumption'
   //specify collection and database
   //| where databasename_s == "DBNAME" and collectioname_s == "COLLECTIONNAME"
   // filter by operation type
   //| where operationType_s == 'Create'
   | summarize sum(todouble(requestCharge_s)) by partitionKey_s, partitionKeyRangeId_s
   | render columnchart  
   ```
---

## Next steps
* For more information on how to create diagnostic settings for Azure Cosmos DB, see [Create diagnostic settings](cosmosdb-monitor-resource-logs.md).
* For detailed information about how to create a diagnostic setting by using the Azure portal, the Azure CLI, or PowerShell, see [Create diagnostic settings to collect platform logs and metrics in Azure](../azure-monitor/essentials/diagnostic-settings.md).
