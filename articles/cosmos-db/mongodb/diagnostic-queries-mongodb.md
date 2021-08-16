---
title: Troubleshoot issues with advanced diagnostics queries for Mongo API
titleSuffix: Azure Cosmos DB
description: Learn how to query diagnostics logs for troubleshooting data stored in Azure Cosmos DB for Mongo API
services: cosmos-db
ms.service: cosmos-db
ms.topic: how-to
ms.date: 06/12/2021
ms.author: esarroyo
author: StefArroyo 
---

# Troubleshoot issues with advanced diagnostics queries for Mongo API

[!INCLUDE[appliesto-all-apis-except-table](../includes/appliesto-all-apis-except-table.md)]

> [!div class="op_single_selector"]
> * [SQL (Core) API](../cosmos-db-advanced-queries.md)
> * [MongoDB API](diagnostic-queries-mongodb.md)
> * [Cassandra API](../cassandra/diagnostic-queries-cassandra.md)
> * [Gremlin API](../queries-gremlin.md)
>

In this article, we'll cover how to write more advanced queries to help troubleshoot issues with your Azure Cosmos DB account using diagnostics logs sent to **AzureDiagnostics (legacy)** and **Resource-specific (preview)** tables.

For Azure Diagnostics tables, all data is written into one single table and users will need to specify which category they'd like to query. If you'd like to view the full-text query of your request, [follow this article](../cosmosdb-monitor-resource-logs.md#full-text-query) to learn how to enable this feature.

For [resource-specific tables](../cosmosdb-monitor-resource-logs.md#create-setting-portal), data is written into individual tables for each category of the resource. We recommend this mode since it makes it much easier to work with the data, provides better discoverability of the schemas, and improves performance across both ingestion latency and query times.

## Common queries

- Top N(10) RU consuming requests/queries in a given time frame

# [Resource-specific](#tab/resource-specific)
   ```Kusto
   let topRequestsByRUcharge = CDBDataPlaneRequests 
   | where TimeGenerated > ago(24h)
   | project  RequestCharge , TimeGenerated, ActivityId;
   CDBMongoRequests
   | project PIICommandText, ActivityId, DatabaseName , CollectionName
   | join kind=inner topRequestsByRUcharge on ActivityId
   | project DatabaseName , CollectionName , PIICommandText , RequestCharge, TimeGenerated
   | order by RequestCharge desc
   | take 10
   ```

# [Azure Diagnostics](#tab/azure-diagnostics)
   ```Kusto
   let topRequestsByRUcharge = AzureDiagnostics
   | where Category == "DataPlaneRequests" and TimeGenerated > ago(1h)
   | project  requestCharge_s , TimeGenerated, activityId_g;
   AzureDiagnostics
   | where Category == "MongoRequests"
   | project piiCommandText_s, activityId_g, databaseName_s , collectionName_s
   | join kind=inner topRequestsByRUcharge on activityId_g
   | project databaseName_s , collectionName_s , piiCommandText_s , requestCharge_s, TimeGenerated
   | order by requestCharge_s desc
   | take 10
   ```    
---

- Requests throttled (statusCode = 429 or 16500) in a given time window 

# [Resource-specific](#tab/resource-specific)
   ```Kusto
   let throttledRequests = CDBDataPlaneRequests
   | where StatusCode == "429" or StatusCode == "16500"
    | project  OperationName , TimeGenerated, ActivityId;
   CDBMongoRequests
   | project PIICommandText, ActivityId, DatabaseName , CollectionName
   | join kind=inner throttledRequests on ActivityId
   | project DatabaseName , CollectionName , PIICommandText , OperationName, TimeGenerated
   ```

# [Azure Diagnostics](#tab/azure-diagnostics)
   ```Kusto
   let throttledRequests = AzureDiagnostics
   | where Category == "DataPlaneRequests"
   | where statusCode_s == "429" or statusCode_s == "16500" 
   | project  OperationName , TimeGenerated, activityId_g;
   AzureDiagnostics
   | where Category == "MongoRequests"
   | project piiCommandText_s, activityId_g, databaseName_s , collectionName_s
   | join kind=inner throttledRequests on activityId_g
   | project databaseName_s , collectionName_s , piiCommandText_s , OperationName, TimeGenerated
   ```    
---

- Timed out requests (statusCode = 50) in a given time window 

# [Resource-specific](#tab/resource-specific)
   ```Kusto
   let throttledRequests = CDBDataPlaneRequests
   | where StatusCode == "50"
   | project  OperationName , TimeGenerated, ActivityId;
   CDBMongoRequests
   | project PIICommandText, ActivityId, DatabaseName , CollectionName
   | join kind=inner throttledRequests on ActivityId
   | project DatabaseName , CollectionName , PIICommandText , OperationName, TimeGenerated
   ```
# [Azure Diagnostics](#tab/azure-diagnostics)
   ```Kusto
   let throttledRequests = AzureDiagnostics
   | where Category == "DataPlaneRequests"
   | where statusCode_s == "50"
   | project  OperationName , TimeGenerated, activityId_g;
   AzureDiagnostics
   | where Category == "MongoRequests"
   | project piiCommandText_s, activityId_g, databaseName_s , collectionName_s
   | join kind=inner throttledRequests on activityId_g
   | project databaseName_s , collectionName_s , piiCommandText_s , OperationName, TimeGenerated
   ```    
---

- Queries with large response lengths (payload size of the server response)

# [Resource-specific](#tab/resource-specific)
   ```Kusto
   let operationsbyUserAgent = CDBDataPlaneRequests
   | project OperationName, DurationMs, RequestCharge, ResponseLength, ActivityId;
   CDBMongoRequests
   //specify collection and database
   //| where DatabaseName == "DBNAME" and CollectionName == "COLLECTIONNAME"
   | join kind=inner operationsbyUserAgent on ActivityId
   | summarize max(ResponseLength) by PIICommandText
   | order by max_ResponseLength desc
   ```
# [Azure Diagnostics](#tab/azure-diagnostics)
   ```Kusto
   let operationsbyUserAgent = AzureDiagnostics
   | where Category=="DataPlaneRequests"
   | project OperationName, duration_s, requestCharge_s, responseLength_s, activityId_g;
   AzureDiagnostics
   | where Category == "MongoRequests"
   //specify collection and database
   //| where databaseName_s == "DBNAME" and collectionName_s == "COLLECTIONNAME"
   | join kind=inner operationsbyUserAgent on activityId_g
   | summarize max(responseLength_s1) by piiCommandText_s
   | order by max_responseLength_s1 desc
   ```    
---

- RU Consumption by physical partition (across all replicas in the replica set)

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
   //| where databaseName_s == "DBNAME" and collectionName_s == "COLLECTIONNAME"
   // filter by operation type
   //| where operationType_s == 'Create'
   | summarize sum(todouble(requestCharge_s)) by toint(partitionKeyRangeId_s)
   | render columnchart  
   ```    
---

- RU Consumption by logical partition (across all replicas in the replica set)

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
   //| where databaseName_s == "DBNAME" and collectionName_s == "COLLECTIONNAME"
   // filter by operation type
   //| where operationType_s == 'Create'
   | summarize sum(todouble(requestCharge_s)) by partitionKey_s, partitionKeyRangeId_s
   | render columnchart  
   ```
---

## Next steps 
* For more information on how to create diagnostic settings for Cosmos DB see [Creating Diagnostics settings](../cosmosdb-monitor-resource-logs.md) article.

* For detailed information about how to create a diagnostic setting by using the Azure portal, CLI, or PowerShell, see [create diagnostic setting to collect platform logs and metrics in Azure](../../azure-monitor/essentials/diagnostic-settings.md) article.
