---
title: Diagnose and troubleshoot query issues when using Azure Cosmos DB 
description: Learn how to identify, diagnose, and troubleshoot Azure Cosmos DB SQL query issues.
author: ginamr
ms.service: cosmos-db
ms.topic: troubleshooting
ms.date: 07/03/2019
ms.author: girobins
ms.subservice: cosmosdb-sql
ms.reviewer: sngun
---
# Troubleshoot query performance for Azure Cosmos DB
This article covers how to identify, diagnose, and troubleshoot Azure Cosmos DB SQL query issues and is broken up into three major sections:

* [How to solve most query issues](#solve-most-issues)
* [Common reasons for slow/expensive queries](#common-reasons) 
* [Recommended steps](#recommended-steps)

## <a name="solve-most-issues"></a> Most query issues can be solved via:

1. [Logging Query Metrics](#log-query-metrics)
2. [Draining Continuations Fully](#drain-continuations-fully) (Use continuation token until you get all the results) 
3. [Tuning Feed Options](#tune-feed-options)
4. [Updating Indexing Policy (Included/Excluded Paths)](#update-indexing-policy)
5. [Check Ordering of Points for Spatial data](#spatial-ordering-of-points)
6. [Slow Queries: Finding where time is spent](#slow-queries)
7. [Understanding why expensive queries can have no results](#expensive-queries-no-results)
8. Updating To Latest SDK

### <a name="log-query-metrics"></a> Log query metrics
Use [QueryMetrics](https://docs.microsoft.com/azure/cosmos-db/profile-sql-api-query) to troubleshoot slow or expensive queries.

* You need to set `FeedOptions.PopulateQueryMetrics = true` to have `QueryMetrics` in the response.
* `QueryMetrics` class has an overloaded `.ToString()` function which can be invoked to get the string representation of `QueryMetrics`. 
* For cross partition queries the `FeedResponse` will consist of a dictionary of `QueryMetrics` where the keys are partitions that your query fanned out to and the values are the `QueryMetrics` for that partition. 
* The `QueryMetrics` class has an overloaded + operator which can be used to aggregate `QueryMetrics` across continuations, partitions, and queries. 
* The metrics can be utilized to derive the following insights, among others: 

    * Whether any specific component of the query pipeline took abnormally long to complete (in order of hundreds of milliseconds or more). 
    * Whether there were false positives in the documents analyzed (if Output Document Count is much less than Retrieved Document Count).  
    * How individual round-trips fared (See `QueryMetrics` "Partition Execution Timeline"). 
    * Whether the query consumed high request charge. 

### <a name="drain-continuations-fully"></a> Drain continuations fully
Don't think you're getting all the results? Be sure to drain the continuation fully. In other words, use the continuation token to drain all the results.

This can be achieved with either of the following patterns:

  * Continue processing results while continuation not empty (i.e. while continuation token != null).
  * Continue processing while query has more results. 
  ```csharp
            // using AsDocumentQuery you get access to whether or not the query HasMoreResults
            // If it does, just call ExecuteNextAsync until there are no more results
            // No need to supply a continuation token here as the server keeps track of progress
            var query = client.CreateDocumentQuery<Family>(collectionLink, options).AsDocumentQuery();
            while (query.HasMoreResults)
            {
                foreach (Family family in await query.ExecuteNextAsync())
                {
                    families.Add(family);
                }
            }
 ```

### <a name="tune-feed-options"></a> Tune feed options
Query performance can be tuned via the request's [Feed Options](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.feedoptions?view=azure-dotnet) Parameters. 

Try setting the below options:

  * Set `MaxDegreeOfParallelism` to -1 first and then compare performance across different values. 
  * Set `MaxBufferedItemCount` to -1 first and then compare performance across different values. 
  * Set `MaxItemCount` to -1.

### <a name="update-indexing-policy"></a> Update indexing policy
To verify that the current [Indexing Policy]((https://docs.microsoft.com/en-us/azure/cosmos-db/how-to-manage-indexing-policy)) is optimal:

  * Ensure all JSON paths from the query are included in the index policy for faster reads.
  * Exclude unused paths for faster writes.

### <a name="spatial-ordering-of-points"></a> Spatial data: Check ordering of points
Note that points within a Polygon must be specified in counter-clockwise order. A Polygon specified in clockwise order represents the inverse of the region within it.

### <a name="slow-queries"></a> Slow queries: Identify where time is spent 

Use `QueryMetrics` to determine where the time is being spent:

1. Look at the `TotalExecutionTime` from the `QueryMetrics`. 
2. If this time does not account for the total end to end time, then the issue is not with the query execution itself. 
3. If the issue is persistent, it is likely the time is being spent in client side transport/network.
4. Double check that the client and Azure region are collocated. 
 
### <a name="expensive-queries-no-results"></a> Expensive queries with no results

Note that the RUs charged on the query are not only from the size of the response, 
but the work done by the entire query processing pipeline. 

For example, the query could have done a lot of work in evaluating multiple filter conditions before deriving the fact that there are no documents that satisfy the query. 

Example query: 

```sql

SELECT * FROM root 
WHERE root.timestamp > "2018-01-01"
      and root.personnelNumber > 10000
      and root.personnelNumber < 1000000

```

Each of the individual predicates themselves may be very expensive to evaluate from the index, whereas the intersection of these predicates may return 0 results. 

However, the query has performed significant work in this case, and thus this will reflect in the request charges. 

## <a name="common-reasons"></a> Common reasons for slow/expensive queries

* Non-optimal Indexing Policy (Included/Excluded Paths)

  * Include paths used in queries for more performant reads
  * Exclude paths not used in queries for more performant writes

* Low provisioned throughput

  * Increase RU budget for impacted collection(s)

* Low parallelism (for cross partition queries)

  * Increase Feed Options `MaxDegreeOfParallelism` value to match number of partitions or set to -1 fot the SDK to choose a default value

* Non-optimal `MaxItemCount` value

  * Optimal value for `MaxItemCount` is usually -1 

* Using operators that can only be served via scans like `CONTAINS`

  * When possible, write queries to use a filter on partition key

* ORDER BY on sparse/non-indexed fields

  * Decrease the search space as much as possible with filters

* JOIN expanding out into large cross product

  * Narrower filter or move filter higher up in the query when possible

* Many large documents being loaded and processed

  * Time and RUs increase proportionally to work being done. The amount of work done for large documents, is larger. Thus more time and RUs are required to load and process large documents. 

* Query pipeline component took abnormally long to complete (in order of hundreds of milliseconds or more)

  * Use `QueryMetrics` to identify where the time is being spent. 

* Performance of individual round trips

  * Populate `QueryMetrics` and use the "Partition Execution Timeline" to troubleshoot.

* False positive documents analyzed (Output Document Count is much less than Retrieved Document Count)

  * Limit the number of documents being retrieved with narrower filters

## <a name="recommended-steps"></a> Recommended Steps

In order to achieve optimal performance for Azure Cosmos DB queries, there are a few common troubleshooting steps you can try:

1. Try upgrading to the latest SDK version
2. If you are using Lazy indexing mode, we recommend Consistent
3. Collocate clients in same Azure region 

  * Make sure that clients are querying against collocated regions 

4. Log Query Metrics

  * Look at `Index utilization`

      * Index Utilization = (# returned documents / # loaded documents)

  * Look at `TotalExecutionTime`

      * If the `TotalExecutionTime` of the query is less than the end to end execution time, then the time is being spent in client side or network

5. Tune Query Feed Options Parameters 

  * Set `MaxDegreeOfParallelism` to -1 first and then compare performance across different values 
  * Set `MaxBufferedItemCount` to -1 first and then compare performance across different values 
  * Set `MaxItemCount` to -1

6. Check Indexing policy

  * Ensure all JSON paths from the query are included in the index policy for faster reads
  * Exclude unused paths for faster writes

7. Consistency Level

  * Consistency level can impact performance and charges. Make sure your consistency level is appropriate for the given scenario.

8. Filter before and between JOINS (rather than after)

9. Note that not all string system functions can utilize the index. If the expression can be translated into a range of string values, then it can utilize the index; otherwise, it cannot. 

    Here is the list of string functions that can utilize the index: 
    
    * STARTSWITH(str_expr, str_expr) 
    * LEFT(str_expr, num_expr) = str_expr 
    * SUBSTRING(str_expr, num_expr, num_expr) = str_expr, but only if first num_expr is 0 
    
    Here are few query examples: 
    
    ```sql

    -- If there is a range index on r.name, STARTSWITH will utilize the index while ENDSWITH won't 
    SELECT * 
    FROM c 
    WHERE STARTSWITH(c.name, 'J') AND ENDSWITH(c.name, 'n')

    ```
    
    ```sql

    -- LEFT will utilize the index while RIGHT won't 
    SELECT * 
    FROM c 
    WHERE LEFT(c.name, 2) = 'Jo' AND RIGHT(c.name, 2) = 'hn'

    ```

  * Avoid system functions in the filter/WHERE clause which are not served by the index e.g. CONTAINS, UPPER, LOWER. 
  * To achieve performant queries for UPPER/LOWER filters, insert and 
maintain the desired casing. 

    For example:
    
    ```sql

    SELECT * FROM c WHERE UPPER(c.name) = "JOE"

    ```
    
    Store the JSON data in all caps or store both casings i.e. "Joe" and "JOE". 
    
    Then the query becomes:
    
    ```sql

    SELECT * FROM c WHERE c.name = "JOE"

    ```

## **Recommended Documents**
Please refer to documents below on how to measure RUs per query, get execution statistics to tune your queries, and more:

* [Get SQL query execution metrics using .NET SDK](https://docs.microsoft.com/azure/cosmos-db/profile-sql-api-query)
* [Tuning query performance with Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/sql-api-sql-query-metrics)
* [Feed Options for .NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.feedoptions?view=azure-dotnet)
* [Indexing Policies](https://docs.microsoft.com/azure/cosmos-db/indexing-policies)
* [How To Manage Indexing Policy](https://docs.microsoft.com/azure/cosmos-db/how-to-manage-indexing-policy)
* [Consistency Levels Overview](https://docs.microsoft.com/azure/cosmos-db/consistency-levels)
* [Choosing Consistency Level](https://docs.microsoft.com/azure/cosmos-db/consistency-levels-choosing)
* [Performance tips for .NET SDK](https://docs.microsoft.com/azure/cosmos-db/performance-tips)
* [Getting started with SQL queries](https://docs.microsoft.com/azure/cosmos-db/sql-api-sql-query)