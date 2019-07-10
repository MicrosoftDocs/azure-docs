---
title: Diagnose and troubleshoot query issues when using Azure Cosmos DB 
description: Learn how to identify, diagnose, and troubleshoot Azure Cosmos DB SQL query issues.
author: ginamr
ms.service: cosmos-db
ms.topic: troubleshooting
ms.date: 07/10/2019
ms.author: girobins
ms.subservice: cosmosdb-sql
ms.reviewer: sngun
---

# Troubleshoot query performance for Azure Cosmos DB
This article covers how to identify, diagnose, and troubleshoot Azure Cosmos DB SQL query issues.

Steps outlined in this article:

1. [Collocate clients in same Azure region](#collocate-clients)
2. [Check consistency level](#consistency-level)
3. [Log query metrics](#query-metrics)
4. [Tune Query Feed Options Parameters](#feed-options) 
5. [Drain continuations fully](#drain-continuations)
6. [Choose system functions that utilize index](#system-functions)
7. [Check Indexing policy](#indexing-policy)
8. [Check ordering of points for Spatial data](#spatial-data)
9. [Optimize JOIN expressions](#optimize-join)
10. [Optimize ORDER BY expressions](#optimize-order-by)
11. [Many large documents being loaded and processed](#many-large-documents)
12. [Low Provisioned Throughput](#low-provisioned-throughput)
13. [Try upgrading to the latest SDK version](#latest-sdk)
14. [Avoid lazy indexing mode](#avoid-lazy-indexing)

## Recommended Steps
In order to achieve optimal performance for Azure Cosmos DB queries, there are a few common troubleshooting steps you can try:

1. <a name="collocate-clients"></a> Collocate clients in same Azure region 

  * The lowest possible latency is achieved by ensuring the calling application is located within the same Azure region as the provisioned Azure Cosmos DB endpoint. For a list of available regions, see [Azure Regions](https://azure.microsoft.com/global-infrastructure/regions/#services).

2. <a name="consistency-level"></a> Check consistency level

  * Consistency level can impact performance and charges. Make sure your consistency level is appropriate for the given scenario.
  * For more details see: [Choosing Consistency Level](https://docs.microsoft.com/azure/cosmos-db/consistency-levels-choosing)

3. <a name="query-metrics"></a> Log query metrics

  * Use `QueryMetrics` to troubleshoot slow or expensive queries. For more details see: [QueryMetrics](https://docs.microsoft.com/azure/cosmos-db/profile-sql-api-query)
  * Set `FeedOptions.PopulateQueryMetrics = true` to have `QueryMetrics` in the response.
  * The metrics can be utilized to derive the following insights, among others: 
  
      * Whether any specific component of the query pipeline took abnormally long to complete (in order of hundreds of milliseconds or more). 

          * Look at `TotalExecutionTime`  
          * If the `TotalExecutionTime` of the query is less than the end to end execution time, then the time is being spent in client side or network. Double check that the client and Azure region are collocated.
      
      * Whether there were false positives in the documents analyzed (if Output Document Count is much less than Retrieved Document Count).  

          * Look at `Index utilization`
          * Index Utilization = (# returned documents / # loaded documents)
          * If # returned documents is much less than the number loaded, then false positives are being analyzed
          * Limit the number of documents being retrieved with narrower filters     

      * How individual round-trips fared (See `QueryMetrics` "Partition Execution Timeline"). 
      * Whether the query consumed high request charge. 
        
4. <a name="feed-options"></a> Tune Query Feed Options Parameters 

  * Query performance can be tuned via the request's [Feed Options](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.feedoptions?view=azure-dotnet) Parameters. 
  * Try setting the below options:

      * Set `MaxDegreeOfParallelism` to -1 first and then compare performance across different values. 
      * Set `MaxBufferedItemCount` to -1 first and then compare performance across different values. 
      * Set `MaxItemCount` to -1.

5. <a name="drain-continuations"></a> Drain continuations fully

  * Don't think you're getting all the results? Be sure to drain the continuation fully. In other words, use the continuation token to drain all the results.
  * Fully draining can be achieved with either of the following patterns:

      * Continue processing results while continuation is not empty.
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

6. <a name="system-functions"></a> Choose system functions that utilize index

  * If the expression can be translated into a range of string values, then it can utilize the index; otherwise, it cannot. 

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

  * Avoid system functions in the filter/WHERE clause that are not served by the index (CONTAINS, UPPER, LOWER).
  * When possible, write queries to use a filter on partition key
  * To achieve performant queries for UPPER/LOWER filters, insert and 
maintain the desired casing. 

    For example:
    
    ```sql

    SELECT * FROM c WHERE UPPER(c.name) = "JOE"

    ```
    
    Store the JSON data in all caps or store both casings. For example, store both "Joe" and "JOE". 
    
    Then the query becomes:
    
    ```sql

    SELECT * FROM c WHERE c.name = "JOE"

    ```
   
7. <a name="indexing-policy"></a> Check Indexing policy

  * To verify that the current [Indexing Policy]((https://docs.microsoft.com/azure/cosmos-db/how-to-manage-indexing-policy)) is optimal:

      * Ensure all JSON paths from the query are included in the indexing policy for faster reads.
      * Exclude unused paths for faster writes.
      * Ensure all JSON paths used in queries are included in the indexing policy for faster reads
      * Exclude paths not used in queries for more performant writes

8. <a name="spatial-data"></a> Spatial data: Check ordering of points

  * Points within a Polygon must be specified in counter-clockwise order. A Polygon specified in clockwise order represents the inverse of the region within it.

9. <a name="optimize-join"></a> Optimize `JOIN` expressions
  
  * `JOIN` expressions can expand into large cross products. 
  * When possible, query against a smaller search space via a more narrow filter.
  * Multi-value subqueries can optimize `JOIN` expressions by pushing predicates after each select-many expression rather than after all cross-joins in the `WHERE` clause. 
  * For a detailed example see: [Optimize Join Expressions](https://docs.microsoft.com/azure/cosmos-db/sql-query-subquery#optimize-join-expressions)

10. <a name="optimize-order-by"></a> Optimize `ORDER BY` expressions 

  * `ORDER BY` query performance may suffer if the fields are sparse or not included in the index policy.
  * For sparse fields such as time, decrease the search space as much as possible with filters. 
  * For single property `ORDER BY`, include property in index policy. 
  * For multiple property `ORDER BY` expressions, define a [composite index](https://docs.microsoft.com/azure/cosmos-db/index-policy#composite-indexes) on fields being sorted.  

11. <a name="many-large-documents"></a> Many large documents being loaded and processed

  * Time and RUs increase proportionally to work being done by the entire query processing pipeline, not only from the size of the response. More work is performed for large documents, thus more time and RUs are required to load and process large documents.
  * Some queries may return no results, but still perform a large amount of work. For example, the query could have done a large amount of work in evaluating multiple filter conditions before deriving the fact that there are no documents that satisfy the query. 

    For example: 
    
    ```sql
    
    SELECT * FROM root 
    WHERE root.timestamp > "2018-01-01"
          and root.personnelNumber > 10000
          and root.personnelNumber < 1000000

    ```

  * Each of the individual predicates themselves may be expensive to evaluate from the index, whereas the intersection of these predicates may return no results. 
  * However, the query has performed significant work in this case, and that will be reflected in the request charges. 

12. <a name="low-provisioned-throughput"></a> Low provisioned throughput
  
  * Ensure provisioned throughput can handle workload. Increase RU budget for impacted collections.

13. <a name="latest-sdk"></a> Try upgrading to the [latest SDK version](https://docs.microsoft.com/azure/cosmos-db/sql-api-sdk-dotnet)

14. <a name="avoid-lazy-indexing"></a> Avoid lazy indexing mode

  * If you are using Lazy indexing mode, we recommend Consistent.

## Recommended Documents
Refer to documents below on how to measure RUs per query, get execution statistics to tune your queries, and more:

* [Get SQL query execution metrics using .NET SDK](https://docs.microsoft.com/azure/cosmos-db/profile-sql-api-query)
* [Tuning query performance with Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/sql-api-sql-query-metrics)
* [Feed Options for .NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.feedoptions?view=azure-dotnet)
* [Indexing Policies](https://docs.microsoft.com/azure/cosmos-db/indexing-policies)
* [How To Manage Indexing Policy](https://docs.microsoft.com/azure/cosmos-db/how-to-manage-indexing-policy)
* [Consistency Levels Overview](https://docs.microsoft.com/azure/cosmos-db/consistency-levels)
* [Choosing Consistency Level](https://docs.microsoft.com/azure/cosmos-db/consistency-levels-choosing)
* [Performance tips for .NET SDK](https://docs.microsoft.com/azure/cosmos-db/performance-tips)
* [Getting started with SQL queries](https://docs.microsoft.com/azure/cosmos-db/sql-api-sql-query)
* [Latest SDK](https://docs.microsoft.com/azure/cosmos-db/sql-api-sdk-dotnet)