---
title: Troubleshoot issues with advanced diagnostics queries with Azure Cosmos DB for Apache Gremlin
description: Learn how to query diagnostics logs for troubleshooting data stored in Azure Cosmos DB for Apache Gremlin.
author: seesharprun
ms.author: sidandrews
ms.reviewer: esarroyo
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 11/08/2022
---

# Troubleshoot issues with advanced diagnostics queries with Azure Cosmos DB for Apache Gremlin

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin](../includes/appliesto-nosql-mongodb-cassandra-gremlin.md)]

[!INCLUDE[Diagnostic queries selector](../includes/diagnostic-queries-selector.md)]

In this article, we'll cover how to write more advanced queries to help troubleshoot issues with your Azure Cosmos DB account by using diagnostics logs sent to **Azure Diagnostics (legacy)** and **resource-specific (preview)** tables.

[!INCLUDE[Diagnostic tables](../includes/diagnostics-tables.md)]

## Common queries

Common queries are shown in the resource-specific and Azure Diagnostics tables.

### Top N(10) Request Unit (RU) consuming requests or queries in a specific time frame

#### [Resource-specific](#tab/resource-specific)

   ```Kusto
   CDBGremlinRequests
   | project PIICommandText, ActivityId, DatabaseName , CollectionName
   | join kind=inner topRequestsByRUcharge on ActivityId
   | project DatabaseName , CollectionName , PIICommandText , RequestCharge, TimeGenerated
   | order by RequestCharge desc
   | take 10
   ```

#### [Azure Diagnostics](#tab/azure-diagnostics)

   ```Kusto
   AzureDiagnostics
   | where Category == "GremlinRequests"
   | project piiCommandText_s, activityId_g, databasename_s , collectionname_s
   | join kind=inner topRequestsByRUcharge on activityId_g
   | project databasename_s , collectionname_s , piiCommandText_s , requestCharge_s, TimeGenerated
   | order by requestCharge_s desc
   | take 10
   ```

---

### Requests throttled (statusCode = 429) in a specific time window

#### [Resource-specific](#tab/resource-specific)

   ```Kusto
   CDBGremlinRequests
   | project PIICommandText, ActivityId, DatabaseName , CollectionName
   | join kind=inner throttledRequests on ActivityId
   | project DatabaseName , CollectionName , PIICommandText , OperationName, TimeGenerated
   ```

#### [Azure Diagnostics](#tab/azure-diagnostics)

   ```Kusto
   AzureDiagnostics
   | where Category == "GremlinRequests"
   | project piiCommandText_s, activityId_g, databasename_s , collectionname_s
   | join kind=inner throttledRequests on activityId_g
   | project databasename_s , collectionname_s , piiCommandText_s , OperationName, TimeGenerated
   ```

---

### Queries with large response lengths (payload size of the server response)

#### [Resource-specific](#tab/resource-specific)

   ```Kusto
   CDBGremlinRequests
   //specify collection and database
    //| where DatabaseName == "DB NAME" and CollectionName == "COLLECTIONNAME"
   | join kind=inner operationsbyUserAgent on ActivityId
   | summarize max(ResponseLength) by PIICommandText
   | order by max_ResponseLength desc
   ```

#### [Azure Diagnostics](#tab/azure-diagnostics)

   ```Kusto
   AzureDiagnostics
   | where Category == "GremlinRequests"
   //| where databasename_s == "DB NAME" and collectioname_s == "COLLECTIONNAME"
   | join kind=inner operationsbyUserAgent on activityId_g
   | summarize max(responseLength_s1) by piiCommandText_s
   | order by max_responseLength_s1 desc
   ```

---

### RU consumption by physical partition (across all replicas in the replica set)

#### [Resource-specific](#tab/resource-specific)

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

#### [Azure Diagnostics](#tab/azure-diagnostics)

   ```Kusto
   AzureDiagnostics
   | where TimeGenerated >= now(-1d)
   | where Category == 'PartitionKeyRUConsumption'
   //specify collection and database
   //| where databasename_s == "DB NAME" and collectioname_s == "COLLECTIONNAME"
   // filter by operation type
   //| where operationType_s == 'Create'
   | summarize sum(todouble(requestCharge_s)) by toint(partitionKeyRangeId_s)
   | render columnchart  
   ```

---

### RU consumption by logical partition (across all replicas in the replica set)

#### [Resource-specific](#tab/resource-specific)

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

#### [Azure Diagnostics](#tab/azure-diagnostics)

   ```Kusto
   AzureDiagnostics
   | where TimeGenerated >= now(-1d)
   | where Category == 'PartitionKeyRUConsumption'
   //specify collection and database
   //| where databasename_s == "DB NAME" and collectioname_s == "COLLECTIONNAME"
   // filter by operation type
   //| where operationType_s == 'Create'
   | summarize sum(todouble(requestCharge_s)) by partitionKey_s, partitionKeyRangeId_s
   | render columnchart  
   ```

---

## Next steps

- For more information on how to create diagnostic settings for Azure Cosmos DB, see [Create diagnostic settings](../monitor-resource-logs.md).
- For detailed information about how to create a diagnostic setting by using the Azure portal, the Azure CLI, or PowerShell, see [Create diagnostic settings to collect platform logs and metrics in Azure](../../azure-monitor/essentials/diagnostic-settings.md).
