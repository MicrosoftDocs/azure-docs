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
This article covers how to identify, diagnose, and troubleshoot Azure Cosmos DB SQL query issues. In order to achieve optimal performance for Azure Cosmos DB queries, follow the troubleshooting steps below. 

## Collocate clients in same Azure region 
The lowest possible latency is achieved by ensuring the calling application is located within the same Azure region as the provisioned Azure Cosmos DB endpoint. For a list of available regions, see [Azure Regions](https://azure.microsoft.com/global-infrastructure/regions/#services) article.

## Check consistency level
[Consistency level](consistency-levels.md) can impact performance and charges. Make sure your consistency level is appropriate for the given scenario. For more details see [Choosing Consistency Level](consistency-levels-choosing.md).

## Log query metrics
Use `QueryMetrics` to troubleshoot slow or expensive queries. 

  * Set `FeedOptions.PopulateQueryMetrics = true` to have `QueryMetrics` in the response.
  * `QueryMetrics` class has an overloaded `.ToString()` function that can be invoked to get the string representation of `QueryMetrics`. 
  * The metrics can be utilized to derive the following insights, among others: 
  
      * Whether any specific component of the query pipeline took abnormally long to complete (in order of hundreds of milliseconds or more). 

          * Look at `TotalExecutionTime`.
          * If the `TotalExecutionTime` of the query is less than the end to end execution time, then the time is being spent in client side or network. Double check that the client and Azure region are collocated.
      
      * Whether there were false positives in the documents analyzed (if Output Document Count is much less than Retrieved Document Count).  

          * Look at `Index Utilization`.
          * `Index Utilization` = (Number of returned documents / Number of loaded documents)
          * If the number of returned documents is much less than the number loaded, then false positives are being analyzed.
          * Limit the number of documents being retrieved with narrower filters.  

      * How individual round-trips fared (see the `Partition Execution Timeline` from the string representation of `QueryMetrics`). 
      * Whether the query consumed high request charge. 

For more details see [How to get SQL query execution metrics](profile-sql-api-query.md) article.
      
## Tune Query Feed Options Parameters 
Query performance can be tuned via the request's [Feed Options](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.feedoptions?view=azure-dotnet) Parameters. Try setting the below options:

  * Set `MaxDegreeOfParallelism` to -1 first and then compare performance across different values. 
  * Set `MaxBufferedItemCount` to -1 first and then compare performance across different values. 
  * Set `MaxItemCount` to -1.

When comparing performance of different values, try values such as 2, 4, 8, 16, and others.
 
## Read all results from continuations
If you think you are not getting all the results, make sure to drain the continuation fully. In other words, keep reading results while the continuation token has more documents to yield.

Fully draining can be achieved with either of the following patterns:

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

## Choose system functions that utilize index
If the expression can be translated into a range of string values, then it can utilize the index; otherwise, it cannot. 

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

  * Avoid system functions in the filter (or the WHERE clause) that are not served by the index. Some examples of such system functions include Contains, Upper, Lower.
  * When possible, write queries to use a filter on partition key.
  * To achieve performant queries avoid calling UPPER/LOWER in the filter. Instead, normalize casing of values upon insertion. For each of the values insert the value with desired casing, or insert both the original value and the value with the desired casing. 

    For example:
    
    ```sql

    SELECT * FROM c WHERE UPPER(c.name) = "JOE"

    ```
    
    For this case, store "JOE" capitalized or store both "Joe" the original value and "JOE". 
    
    If the JSON data casing is normalized the query becomes:
    
    ```sql

    SELECT * FROM c WHERE c.name = "JOE"

    ```

    The second query will be more performant as it does not require performing transformations on each of the values in order to compare the values to "JOE".

For more system function details see [System Functions](sql-query-system-functions.md) article.

## Check Indexing policy
To verify that the current [Indexing Policy](index-policy.md) is optimal:

  * Ensure all JSON paths used in queries are included in the indexing policy for faster reads.
  * Exclude paths not used in queries for more performant writes.

For more details see [How To Manage Indexing Policy](how-to-manage-indexing-policy.md) article.

## Spatial data: Check ordering of points
Points within a Polygon must be specified in counter-clockwise order. A Polygon specified in clockwise order represents the inverse of the region within it.

## Optimize JOIN expressions
`JOIN` expressions can expand into large cross products. When possible, query against a smaller search space via a more narrow filter.

Multi-value subqueries can optimize `JOIN` expressions by pushing predicates after each select-many expression rather than after all cross-joins in the `WHERE` clause. For a detailed example see [Optimize Join Expressions](https://docs.microsoft.com/azure/cosmos-db/sql-query-subquery#optimize-join-expressions) article.

## Optimize ORDER BY expressions 
`ORDER BY` query performance may suffer if the fields are sparse or not included in the index policy.

  * For sparse fields such as time, decrease the search space as much as possible with filters. 
  * For single property `ORDER BY`, include property in index policy. 
  * For multiple property `ORDER BY` expressions, define a [composite index](https://docs.microsoft.com/azure/cosmos-db/index-policy#composite-indexes) on fields being sorted.  

## Many large documents being loaded and processed
The time and RUs that are required by a query are not only dependent on the size of the response, they are also dependent on the work that is done by the query processing pipeline. Time and RUs increase proportionally with the amount of work done by the entire query processing pipeline. More work is performed for large documents, thus more time and RUs are required to load and process large documents.

## Low provisioned throughput
Ensure provisioned throughput can handle workload. Increase RU budget for impacted collections.

## Try upgrading to the latest SDK version
To determine the latest SDK see [SDK Download and release notes](sql-api-sdk-dotnet.md) article.

## Next steps
Refer to documents below on how to measure RUs per query, get execution statistics to tune your queries, and more:

* [Get SQL query execution metrics using .NET SDK](profile-sql-api-query.md)
* [Tuning query performance with Azure Cosmos DB](sql-api-sql-query-metrics.md)
* [Performance tips for .NET SDK](performance-tips.md)