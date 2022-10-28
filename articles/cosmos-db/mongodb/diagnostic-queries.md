---
title: Troubleshoot issues with advanced diagnostics queries for API for MongoDB
titleSuffix: Azure Cosmos DB
description: Learn how to query diagnostics logs for troubleshooting data stored in Azure Cosmos DB for the API for MongoDB.
services: cosmos-db
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 06/12/2021
ms.author: esarroyo
author: StefArroyo 
---

# Troubleshoot issues with advanced diagnostics queries for the API for MongoDB

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin](../includes/appliesto-nosql-mongodb-cassandra-gremlin.md)]

> [!div class="op_single_selector"]
> * [API for NoSQL](../advanced-queries.md)
> * [API for MongoDB](diagnostic-queries.md)
> * [API for Cassandra](../cassandra/diagnostic-queries.md)
> * [API for Gremlin](../queries-gremlin.md)
>

In this article, we'll cover how to write more advanced queries to help troubleshoot issues with your Azure Cosmos DB account by using diagnostics logs sent to **Azure Diagnostics (legacy)** and **resource-specific (preview)** tables.

For Azure Diagnostics tables, all data is written into one single table. Users specify which category they want to query. If you want to view the full-text query of your request, see [Monitor Azure Cosmos DB data by using diagnostic settings in Azure](../monitor-resource-logs.md#full-text-query) to learn how to enable this feature.

For [resource-specific tables](../monitor-resource-logs.md#create-setting-portal), data is written into individual tables for each category of the resource. We recommend this mode because it:

- Makes it much easier to work with the data. 
- Provides better discoverability of the schemas.
- Improves performance across both ingestion latency and query times.

## Common queries
Common queries are shown in the resource-specific and Azure Diagnostics tables.

### Top N(10) Request Unit (RU) consuming requests or queries in a specific time frame

# [Resource-specific](#tab/resource-specific)
   ```Kusto
   //Enable full-text query to view entire query text
   CDBMongoRequests
   | where TimeGenerated > ago(24h)
   | project PIICommandText, ActivityId, DatabaseName , CollectionName, RequestCharge
   | order by RequestCharge desc
   | take 10
   ```

# [Azure Diagnostics](#tab/azure-diagnostics)
   ```Kusto
   AzureDiagnostics
   | where Category == "MongoRequests"
   | where TimeGenerated > ago(24h)
   | project piiCommandText_s, activityId_g, databaseName_s , collectionName_s, requestCharge_s
   | order by requestCharge_s desc
   | take 10
   ```    
---

### Requests throttled (statusCode = 429 or 16500) in a specific time window 

# [Resource-specific](#tab/resource-specific)
   ```Kusto
   CDBMongoRequests
   | where TimeGenerated > ago(24h)
   | where ErrorCode == "429" or ErrorCode == "16500"
   | project DatabaseName, CollectionName, PIICommandText, OperationName, TimeGenerated
   ```

# [Azure Diagnostics](#tab/azure-diagnostics)
   ```Kusto
   AzureDiagnostics
   | where Category == "MongoRequests" and TimeGenerated > ago(24h)
   | where ErrorCode == "429" or ErrorCode == "16500"
   | project databaseName_s , collectionName_s , piiCommandText_s , OperationName, TimeGenerated
   ```    
---

### Timed-out requests (statusCode = 50) in a specific time window 

# [Resource-specific](#tab/resource-specific)
   ```Kusto
   CDBMongoRequests
   | where TimeGenerated > ago(24h)
   | where ErrorCode == "50"
   | project DatabaseName, CollectionName, PIICommandText, OperationName, TimeGenerated
   ```
# [Azure Diagnostics](#tab/azure-diagnostics)
   ```Kusto
   AzureDiagnostics
   | where Category == "MongoRequests" and TimeGenerated > ago(24h)
   | where ErrorCode == "50"
   | project databaseName_s , collectionName_s , piiCommandText_s , OperationName, TimeGenerated
   ```    
---

### Queries with large response lengths (payload size of the server response)

# [Resource-specific](#tab/resource-specific)
   ```Kusto
   CDBMongoRequests
   //specify collection and database
   //| where DatabaseName == "DB NAME" and CollectionName == "COLLECTIONNAME"
   | summarize max(ResponseLength) by PIICommandText, RequestCharge, DurationMs, OperationName, TimeGenerated
   | order by max_ResponseLength desc
   ```
# [Azure Diagnostics](#tab/azure-diagnostics)
   ```Kusto
   AzureDiagnostics
   | where Category == "MongoRequests"
   //specify collection and database
   //| where databaseName_s == "DB NAME" and collectionName_s == "COLLECTIONNAME"
   | summarize max(responseLength_s) by piiCommandText_s, OperationName, duration_s, requestCharge_s
   | order by max_responseLength_s desc
   ```    
---

### RU consumption by physical partition (across all replicas in the replica set)

# [Resource-specific](#tab/resource-specific)
   ```Kusto
   CDBPartitionKeyRUConsumption
   | where TimeGenerated >= now(-1d)
   //specify collection and database
   //| where DatabaseName == "DB NAME" and CollectionName == "COLLECTIONNAME"
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
   //| where databaseName_s == "DB NAME" and collectionName_s == "COLLECTIONNAME"
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
   //| where DatabaseName == "DB NAME" and CollectionName == "COLLECTIONNAME"
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
   //| where databaseName_s == "DB NAME" and collectionName_s == "COLLECTIONNAME"
   // filter by operation type
   //| where operationType_s == 'Create'
   | summarize sum(todouble(requestCharge_s)) by partitionKey_s, partitionKeyRangeId_s
   | render columnchart  
   ```
---

## Next steps 
* For more information on how to create diagnostic settings for Azure Cosmos DB, see [Create diagnostic settings](../monitor-resource-logs.md).
* For detailed information about how to create a diagnostic setting by using the Azure portal, the Azure CLI, or PowerShell, see [Create diagnostic settings to collect platform logs and metrics in Azure](../../azure-monitor/essentials/diagnostic-settings.md).
