---
title:  Quickstart - Troubleshoot issues with diagnostics queries
description: Learn how to query diagnostics logs for troubleshooting data stored in Azure Cosmos DB
author: StefArroyo
services: cosmos-db
ms.service: cosmos-db
ms.topic: quickstart
ms.date: 05/12/2021
ms.author: esarroyo 
---

# Troubleshoot issues with diagnostics queries

In this article, we'll cover how to write simple queries to help troubleshoot issues with your Azure Cosmos DB account using diagnostics logs sent to **AzureDiagnostics** and **Resource specific** tables.

## AzureDiagnostics Queries

1. How to query for the operations that are taking longer than 3 milliseconds to run:

   ```Kusto
   AzureDiagnostics 
   | where toint(duration_s) > 3 and ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests" 
   | summarize count() by clientIpAddress_s, TimeGenerated
   ```

2. How to query for the user agent that is running the operations:

   ```Kusto
   AzureDiagnostics 
   | where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests" 
   | summarize count() by OperationName, userAgent_s
   ```

3. How to query for the long running operations:

   ```Kusto
   AzureDiagnostics 
   | where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests" 
   | project TimeGenerated , duration_s 
   | summarize count() by bin(TimeGenerated, 5s)
   | render timechart
   ```
    
4. How to get partition key statistics to evaluate skew across top 3 partitions for a database account:

   ```Kusto
   AzureDiagnostics 
   | where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="PartitionKeyStatistics" 
   | project SubscriptionId, regionName_s, databaseName_s, collectionName_s, partitionKey_s, sizeKb_d, ResourceId 
   ```

5. How to get the request charges for expensive queries?

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

6. How to find which operations are taking most of RU/s?

    ```Kusto
   AzureDiagnostics
   | where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests"
   | where TimeGenerated >= ago(2h) 
   | summarize max(responseLength_s), max(requestLength_s), max(requestCharge_s), count = count() by OperationName, requestResourceType_s, userAgent_s, collectionRid_s, bin(TimeGenerated, 1h)
   ```

7. How to get all queries that are consuming more then 100 RU/s joined with data from **DataPlaneRequests** and **QueryRunTimeStatistics**.

   ```Kusto
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

8. How to get the request charges and the execution duration of a query?

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


9. How to get the distribution for different operations?

   ```Kusto
   AzureDiagnostics
   | where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests"
   | where TimeGenerated >= ago(2h) 
   | summarize count = count()  by OperationName, requestResourceType_s, bin(TimeGenerated, 1h) 
   ```

10. What is the maximum throughput that a partition has consumed?

   ```Kusto
   AzureDiagnostics
   | where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests"
   | where TimeGenerated >= ago(2h) 
   | summarize max(requestCharge_s) by bin(TimeGenerated, 1h), partitionId_g
   ```

11. How to get the information about the partition keys RU/s consumption per second?

   ```Kusto
   AzureDiagnostics 
   | where ResourceProvider == "MICROSOFT.DOCUMENTDB" and Category == "PartitionKeyRUConsumption" 
   | summarize total = sum(todouble(requestCharge_s)) by databaseName_s, collectionName_s, partitionKey_s, TimeGenerated 
   | order by TimeGenerated asc 
   ```

12. How to get the request charge for a specific partition key

   ```Kusto
   AzureDiagnostics 
   | where ResourceProvider == "MICROSOFT.DOCUMENTDB" and Category == "PartitionKeyRUConsumption" 
   | where parse_json(partitionKey_s)[0] == "2" 
   ```

13. How to get the top partition keys with most RU/s consumed in a specific period?

   ```Kusto
   AzureDiagnostics 
   | where ResourceProvider == "MICROSOFT.DOCUMENTDB" and Category == "PartitionKeyRUConsumption" 
   | where TimeGenerated >= datetime("11/26/2019, 11:20:00.000 PM") and TimeGenerated <= datetime("11/26/2019, 11:30:00.000 PM") 
   | summarize total = sum(todouble(requestCharge_s)) by databaseName_s, collectionName_s, partitionKey_s 
   | order by total desc
    ```

14. How to get the logs for the partition keys whose storage size is greater than 8 GB?

   ```Kusto
   AzureDiagnostics
   | where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="PartitionKeyStatistics"
   | where todouble(sizeKb_d) > 800000
   ```

15. How to get P99 or P50 replication latencies for operations, request charge or the length of the response?

   ```Kusto
   AzureDiagnostics
   | where ResourceProvider=="MICROSOFT.DOCUMENTDB" and Category=="DataPlaneRequests"
   | where TimeGenerated >= ago(2d)
   | summarize
   percentile(todouble(responseLength_s), 50), percentile(todouble(responseLength_s), 99), max(responseLength_s),
   percentile(todouble(requestCharge_s), 50), percentile(todouble(requestCharge_s), 99), max(requestCharge_s),
   percentile(todouble(duration_s), 50), percentile(todouble(duration_s), 99), max(duration_s),
   count()
   by OperationName, requestResourceType_s, userAgent_s, collectionRid_s, bin(TimeGenerated, 1h)
   ```
 
16. How to get ControlPlane logs?
 
   Remember to switch on the flag as described in the [Disable key-based metadata write access](audit-control-plane-logs.md#disable-key-based-metadata-write-access) article, and execute the operations by using Azure PowerShell, the Azure CLI, or Azure Resource Manager.
 
   ```Kusto  
   AzureDiagnostics 
   | where Category =="ControlPlaneRequests"
   | summarize by OperationName 
   ```


## Resource specific Queries

1. How to query for the operations that are taking longer than 3 milliseconds to run:

    ```Kusto
    CDBDataPlaneRequests 
    | where toint(DurationMs) > 3
    | summarize count() by ClientIpAddress, TimeGenerated
    ```

2. How to query for the user agent that is running the operations:

   ```Kusto
    CDBDataPlaneRequests
    | summarize count() by OperationName, UserAgent
   ```

3. How to query for the long running operations:

   ```Kusto
    CDBDataPlaneRequests
    | project TimeGenerated , DurationMs 
    | summarize count() by bin(TimeGenerated, 5s)
    | render timechart
   ```
    
4. How to get partition key statistics to evaluate skew across top 3 partitions for a database account:

   ```Kusto
    CDBPartitionKeyStatistics
    | project RegionName, DatabaseName, CollectionName, PartitionKey, SizeKb
   ```

5. How to get the request charges for expensive queries?

   ```Kusto
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

6. How to find which operations are taking most of RU/s?

    ```Kusto
    CDBDataPlaneRequests
    | where TimeGenerated >= ago(2h) 
    | summarize max(ResponseLength), max(RequestLength), max(RequestCharge), count = count() by OperationName, RequestResourceType, UserAgent, CollectionName, bin(TimeGenerated, 1h)
   ```

7. How to get all queries that are consuming more then 100 RU/s joined with data from **DataPlaneRequests** and **QueryRunTimeStatistics**.

   ```Kusto
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

8. How to get the request charges and the execution duration of a query?

   ```kusto
    CDBQueryRuntimeStatistics
    | join kind= inner (
    CDBDataPlaneRequests
    ) on $left.ActivityId == $right.ActivityId
    | project DatabaseName, CollectionName, OperationName , QueryText, RequestCharge, DurationMs, bin(TimeGenerated, 1min)
   ```


9. How to get the distribution for different operations?

   ```Kusto
    CDBDataPlaneRequests
    | where TimeGenerated >= ago(2h) 
    | summarize count = count()  by OperationName, RequestResourceType, bin(TimeGenerated, 1h)
   ```

10. What is the maximum throughput that a partition has consumed?

   ```Kusto
    CDBDataPlaneRequests
    | where TimeGenerated >= ago(2h) 
    | summarize max(RequestCharge) by bin(TimeGenerated, 1h), PartitionId
   ```

11. How to get the information about the partition keys RU/s consumption per second?

   ```Kusto
    CDBPartitionKeyRUConsumption 
    | summarize total = sum(todouble(RequestCharge)) by DatabaseName, CollectionName, PartitionKey, TimeGenerated 
    | order by TimeGenerated asc 
   ```

12. How to get the request charge for a specific partition key?

   ```Kusto
    CDBPartitionKeyRUConsumption  
    | where parse_json(PartitionKey)[0] == "2" 
   ```

13. How to get the top partition keys with most RU/s consumed in a specific period? 

   ```Kusto
    CDBPartitionKeyRUConsumption
    | where TimeGenerated >= datetime("02/12/2021, 11:20:00.000 PM") and TimeGenerated <= datetime("05/12/2021, 11:30:00.000 PM") 
    | summarize total = sum(todouble(RequestCharge)) by DatabaseName, CollectionName, PartitionKey 
    | order by total desc
    ```

14. How to get the logs for the partition keys whose storage size is greater than 8 GB?

   ```Kusto
    CDBPartitionKeyStatistics
    | where todouble(SizeKb) > 800000
   ```

15. How to get P99 or P50 replication latencies for operations, request charge or the length of the response?

   ```Kusto
    CDBDataPlaneRequests
    | where TimeGenerated >= ago(2d)
    | summarize
    percentile(todouble(ResponseLength), 50), percentile(todouble(ResponseLength), 99), max(ResponseLength),
    percentile(todouble(RequestCharge), 50), percentile(todouble(RequestCharge), 99), max(RequestCharge),
    percentile(todouble(DurationMs), 50), percentile(todouble(DurationMs), 99), max(DurationMs),
    count()
    by OperationName, RequestResourceType, UserAgent, CollectionName, bin(TimeGenerated, 1h)
   ```
 
16. How to get ControlPlane logs?
 
   Remember to switch on the flag as described in the [Disable key-based metadata write access](audit-control-plane-logs.md#disable-key-based-metadata-write-access) article, and execute the operations by using Azure PowerShell, the Azure CLI, or Azure Resource Manager.
 
   ```Kusto  
    CDBControlPlaneRequests
    | summarize by OperationName 
   ```
