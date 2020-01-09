---
title: Troubleshoot query issues when using Azure Cosmos DB 
description: Learn how to identify, diagnose, and troubleshoot Azure Cosmos DB SQL query issues.
author: ginamr
ms.service: cosmos-db
ms.topic: troubleshooting
ms.date: 01/08/2020
ms.author: girobins
ms.subservice: cosmosdb-sql
ms.reviewer: sngun
---
# Guide for Optimizing Queries in Azure Cosmos DB

This document walks through a general recommended approach for troubleshooting queries in Azure Cosmos DB. While the steps outlined in this document should not be considered a “catch all” for potential query issues, we have consolidated most performance tips here. You should use this document as a starting place for troubleshooting for Azure Cosmos DB’s core (SQL) API.

You can broadly categorize query optimizations in Azure Cosmos DB: Optimizations that reduce the Request Unit (RU) charge of the query and optimizations that just reduce latency. By reducing the RU charge of a query, you will almost certainly decrease latency as well.
This document will use examples that can be recreated using the [nutrition](https://github.com/CosmosDB/labs/blob/master/dotnet/setup/NutritionData.json) data set.

You can reference the below section to understand the relevant query optimizations for your scenario:

### Query's RU charge is too high

<br>
<br>

#### Loaded Document Count is significantly greater than Retrieved Document Count

a. [Ensure that the indexing policy includes necessary paths](troubleshoot-query-performance.md#Ensure-that-the-indexing-policy-includes-necessary-paths)

b. [Understand which system functions utilize the index](troubleshoot-query-performance.md#Understand-which-system-functions-utilize-the-index)

c. [Optimize queries with both a filter and an ORDER BY clause](troubleshoot-query-performance.md#Optimize-queries-with-both-a-filter-and-an-ORDER-BY-clause)

d. [Optimize queries that use DISTINCT](#Optimize-queries-that-use-DISTINCT)

e. [Optimize JOIN expressions by using a subquery](troubleshoot-query-performance.md#Optimize-JOIN-expressions-by-using-a-subquery)

<br>

#### Loaded Document Count is approximately equal to Retrieved Document Count

a. [Avoid cross partition queries](troubleshoot-query-performance.md#Avoid-cross-partition-queries)

b. [Optimize queries that have a filter on multiple properties](troubleshoot-query-performance.md#Optimize-queries-that-have-a-filter-on-multiple-properties)

c. [Optimize queries with both a filter and an ORDER BY clause](troubleshoot-query-performance.md#Optimize-queries-with-both-a-filter-and-an-ORDER-BY-clause)

<br>

### Query's RU charge is acceptable but latency is still too high

a. [Improving proximity between your app and Azure Cosmos DB](troubleshoot-query-performance.md#Improving-proximity-between-your-app-and-Azure-Cosmos-DB)

b. [Increasing provisioned throughput](troubleshoot-query-performance.md#Increasing-provisioned-throughput)

c. [Increasing MaxConcurrency](troubleshoot-query-performance.md#Increasing-MaxConcurrency)

d. [Increasing MaxBufferedItemCount](troubleshoot-query-performance.md#Increasing-MaxBufferedItemCount)

### Obtaining query metrics:

When optimizing a query in Azure Cosmos DB, the first step is always to [obtain the query metrics](https://docs.microsoft.com/en-us/azure/cosmos-db/sql-api-sql-query-metrics#query-execution-metrics) for your query These are also available through the Azure Portal as shown below:

![Obtaining query metrics](./media/troubleshoot-query-performance/obtain-query-metrics.jpg)

## Optimizations for queries where Loaded Document Count significantly exceeds Retrieved Document Count:

After obtaining query metrics, compare the Retrieved Document Count with the Loaded Document Count for your query. The Retrieved Document Count is the number of documents that will show up in the results of your query. The Loaded Document Count is the number of documents that needed to be scanned. If the Loaded Document Count is significantly higher than the Retrieved Document Count, then there was at least one part of your query that was unable to utilize the index.

## Ensure that the indexing policy includes necessary paths

Your indexing policy should cover any properties included in WHERE clauses, ORDER BY clauses, JOINs, and most System Functions. The path specified in the index policy should match (case-sensitive) the property in the JSON documents.

If we run a simple query on the nutrition data set, we observe a much lower RU charge when the property in the WHERE clause is indexed.

### Original

Query:

```sql
SELECT * FROM c WHERE c.description = "Malabar spinach, cooked"
```

Indexing policy:

```json
{
    "indexingMode": "consistent",
    "automatic": true,
    "includedPaths": [],
    "excludedPaths": [
        {
            "path": "/*"
        },
        {
            "path": "/\"_etag\"/?"
        }
    ]
}
```

**RU Charge:** 409.51 RU's

### Optimized

Updated indexing policy:

```json
{
    "indexingMode": "consistent",
    "automatic": true,
    "includedPaths": [
        {
            "path": "/description/*"
        }
    ],
    "excludedPaths": [
        {
            "path": "/*"
        }
    ]
}
```

**RU Charge:** 2.98 RU's

You can add additional properties to the indexing policy at any time, with no impact to write availability or performance. If you add a new property to the index, queries that use this property will immediately utilize the new available index. The query will utilize the new index while it is being built. As a result, query results may be inconsistent as the index rebuild is in progress. If a new property is indexed, queries that only utilize existing indexes will not be affected during the index rebuild. You can [track index transformation progress](https://docs.microsoft.com/azure/cosmos-db/how-to-manage-indexing-policy#use-the-net-sdk-v3).

## Understand which system functions utilize the index

If the expression can be translated into a range of string values, then it can utilize the index; otherwise, it cannot. Here is the list of string functions that can utilize the index:

-	STARTSWITH(str_expr, str_expr)
-	LEFT(str_expr, num_expr) = str_expr
-	SUBSTRING(str_expr, num_expr, num_expr) = str_expr, but only if first num_expr is 

Some common system functions that must load each document are shown below:

| **System Function**                     | **Ideas   for Optimization**             |
| --------------------------------------- |------------------------------------------------------------ |
| CONTAINS                                | Use Azure Search for full text search                        |
| UPPER/LOWER                             | Instead of using the system function to normalize data each time for comparisons, instead normalize the casing upon insertion. Then a query such as ```SELECT * FROM c WHERE UPPER(c.name) = 'BOB'``` simply becomes ```SELECT * FROM c WHERE c.name = 'BOB'``` |
| Mathematical functions (non-aggregates) | If you need to frequently compute a value in your query, consider storing this value as a property in your JSON document. |

------

Other parts of the query may still utilize the index despite the system functions not using the index.

## Optimize queries with both a filter and an ORDER BY clause

While queries with a filter and an ORDER BY clause will normally utilize a range index, they will be more efficient if they can be served from a composite index.

### Original

Query:

```sql
SELECT * FROM c WHERE c.foodGroup = “Soups, Sauces, and Gravies” ORDER BY c._ts ASC
```

Indexing policy:

```json
{

        "automatic":true,
    "indexingMode":"Consistent",
        "includedPaths":[  
            {  
                "path":"/*"
            }
        ],
        "excludedPaths":[]
}
```

**RU Charge:** 44.28 RU's

### Optimized

Updated query:

```sql
SELECT * FROM c WHERE c.foodGroup = “Soups, Sauces, and Gravies” ORDER BY c.foodGroup, c._ts ASC
```

Updated indexing policy:

```json
{  
        "automatic":true,
        "indexingMode":"Consistent",
        "includedPaths":[  
            {  
                "path":"/*"
            }
        ],
        "excludedPaths":[],
        "compositeIndexes":[  
            [  
                {  
                    "path":"/foodGroup",
                    "order":"ascending"
        },
                {  
                    "path":"/_ts",
                    "order":"ascending"
                }
            ]
        ]
    }

```

**RU Charge:** 8.86 RU's

## Optimize queries that use DISTINCT

It will be more efficient to find the DISTINCT set of results if the duplicate results are consecutive. Adding an ORDER BY clause to the query and a composite index will ensure that duplicate results are consecutive. If you need to ORDER BY multiple properties, add a composite index.

### Original

Query:

```sql
SELECT DISTINCT c.foodGroup FROM c
```

Indexing policy:

```json
{  
        "automatic":true,
        "indexingMode":"Consistent",
        "includedPaths":[  
            {  
                "path":"/*"
            }
        ],
        "excludedPaths":[]
 }

```

**RU Charge:** 32.39 RU's

### Optimized

Updated query:

```sql
SELECT DISTINCT c.foodGroup FROM c ORDER BY c.foodGroup
```

**RU Charge:** 3.38 RU's

## Optimize JOIN expressions by using a subquery
Multi-value subqueries can optimize JOIN expressions by pushing predicates after each select-many expression rather than after all cross-joins in the WHERE clause.

Consider the following query:

```sql
SELECT Count(1) AS Count
FROM c
JOIN t IN c.tags
JOIN n IN c.nutrients
JOIN s IN c.servings
WHERE t.name = 'infant formula' AND (n.nutritionValue > 0
AND n.nutritionValue < 10) AND s.amount > 1
```

For this query, the index will match any document that has a tag with the name "infant formula." It's a nutrient item with a value between 0 and 10, and a serving item with an amount greater than 1. The JOIN expression here will perform the cross-product of all items of tags, nutrients, and servings arrays for each matching document before any filter is applied.
The WHERE clause will then apply the filter predicate on each <c, t, n, s> tuple.

For instance, if a matching document had 10 items in each of the three arrays, it will expand to 1 x 10 x 10 x 10 (that is, 1,000) tuples. Using subqueries here can help in filtering out joined array items before joining with the next expression.
This query is equivalent to the preceding one but uses subqueries:

```sql
SELECT Count(1) AS Count
FROM c
JOIN (SELECT VALUE t FROM t IN c.tags WHERE t.name = 'infant formula')
JOIN (SELECT VALUE n FROM n IN c.nutrients WHERE n.nutritionValue > 0 AND n.nutritionValue < 10)
JOIN (SELECT VALUE s FROM s IN c.servings WHERE s.amount > 1)
```

Assume that only one item in the tags array matches the filter, and there are five items for both nutrients and servings arrays. The JOIN expressions will then expand to 1 x 1 x 5 x 5 = 25 items, as opposed to 1,000 items in the first query.

## Optimizations for queries where Loaded Document Count is approximately equal to Retrieved Document Count:

If the Loaded Document Count is approximately equal to the Retrieved Document Count, it means the query did not have to scan many unnecessary documents. For many queries, such as those that use the TOP keyword, Loaded Document Count may exceed Retrieved Document Count by 1. This should not be cause for concern.

## Avoid cross partition queries

Azure Cosmos DB uses partitioning to scale individual containers as Request Unit and data storage needs increase. Each physical partition has a separate and independent index. If your query has an equality filter that matches your container’s partition key, you will only need to check the relevant partition’s index. This optimization reduces the total number of RU’s that the query requires.

If you have a large number of provisioned RU’s (over 30,000) or a large amount of data stored (over ~100 GB), you likely have a large enough container to see a significant reduction in query RU charges.

For example, if we create a container with the partition key foodGroup, the following queries would only need to check a single physical partition:

```sql
SELECT * FROM c WHERE c.foodGroup = “Soups, Sauces, and Gravies” and c.description = "Mushroom, oyster, raw"
```

These queries would also be optimized by including the partition key in the query:

```sql
SELECT * FROM c WHERE c.foodGroup IN(“Soups, Sauces, and Gravies”, “"Vegetables and Vegetable Products”) and  c.description = "Mushroom, oyster, raw"
```

Queries that have range filters on the partition key or don’t have any filters on the partition key, will need to “fan-out” and check every physical partition’s index for results.

```sql
SELECT * FROM c WHERE c.description = "Mushroom, oyster, raw"
```

```sql
SELECT * FROM c WHERE c.foodGroup > “Soups, Sauces, and Gravies” and c.description = "Mushroom, oyster, raw"
```

## Optimize queries that have a filter on multiple properties

While queries with filters on multiple properties will normally utilize a range index, they will be more efficient if they can be served from a composite index. For small amounts of data, this optimization will not have a significant impact. It may prove useful, however, with large amounts of data. You can only optimize, at most, one non-equality filter per composite index. If your query has multiple non-equality filters, you should pick one of them that will utilize the composite index. The remainder will continue to utilize range indexes. The non-equality filter must be defined last in the composite index.

Here are some examples of queries which could be optimized with a composite index:

```sql
SELECT * FROM c WHERE c.foodGroup = "Vegetables and Vegetable Products" AND c._ts = 1575503264
```

```sql
SELECT * FROM c WHERE c.foodGroup = "Vegetables and Vegetable Products" AND c._ts > 1575503264
```

Here is the relevant composite index:

```json
{  
        "automatic":true,
        "indexingMode":"Consistent",
        "includedPaths":[  
            {  
                "path":"/*"
            }
        ],
        "excludedPaths":[],
        "compositeIndexes":[  
            [  
                {  
                    "path":"/foodGroup",
                    "order":"ascending"
                },
                {  
                    "path":"/_ts",
                    "order":"ascending"
                }
            ]
        ]
}
```

## Common optimizations that reduce query latency (no impact on RU charge):

In many cases, RU charge may be acceptable but query latency is still too high. The below sections give an overview of tips for reducing query latency. A query's RU charge is deterministic - give 

## Improving proximity between your app and Azure Cosmos DB

Queries that are run from a different region than the Azure Cosmos DB account will have a higher latency than if they were run inside the same region. For example, if you were running code on your desktop computer, you should expect latency to be tens or hundreds (or more) milliseconds greater than if the query came from a Virtual Machine within the same Azure region as Azure Cosmos DB. It is simple to globally distribute data in Azure Cosmos DB to ensure you can bring your data closer to your app.

## Increasing provisioned throughput

In Azure Cosmos DB, your provisioned throughput is measured in Request Units (RU’s). Let’s imagine you have a query that consumes 5 RU’s of throughput. For example, if you provision 1,000 RU’s, you would be able to run that query 200 times per second. If you attempted to run the query when there was not enough throughput available, Azure Cosmos DB would return an HTTP 429 error. Any of the current Core (SQL) API sdk's will automatically retry this query after waiting a brief period. Throttled requests take a longer amount of time, so increasing provisioned throughput can improve query latency. You can observe the [total number of requests throttled requests(use-metrics.md#understand-how-many-requests-are-succeeding-or-causing-errors in the Metrics blade of the Azure Portal.

## Increasing MaxConcurrency
Parallel queries work by querying multiple partitions in parallel. However, data from an individual partitioned collection is fetched serially with respect to the query. So, adjust the MaxConcurrency to set the number of partitions that has the maximum chance of achieving the most performant query, provided all other system conditions remain the same. If you don't know the number of partitions, you can set the MaxConcurrency (or MaxDegreesOfParallelism in older sdk versions) to set a high number, and the system chooses the minimum (number of partitions, user provided input) as the maximum degree of parallelism.

## Increasing MaxBufferedItemCount

Parallel query is designed to pre-fetch results while the current batch of results is being processed by the client. The pre-fetching helps in overall latency improvement of a query. Setting the MaxBufferedItemCount limits the number of pre-fetched results. By setting this value to the expected number of results returned (or a higher number), the query can receive maximum benefit from pre-fetching.

## Next steps
Refer to documents below on how to measure RUs per query, get execution statistics to tune your queries, and more:

* [Get SQL query execution metrics using .NET SDK](profile-sql-api-query.md)
* [Tuning query performance with Azure Cosmos DB](sql-api-sql-query-metrics.md)
* [Performance tips for .NET SDK](performance-tips.md)
