---
title: Troubleshoot query issues when using Azure Cosmos DB 
description: Learn how to identify, diagnose, and troubleshoot Azure Cosmos DB SQL query issues.
author: seesharprun
ms.service: cosmos-db
ms.topic: troubleshooting
ms.date: 04/04/2022
ms.author: sidandrews
ms.reviewer: jucocchi
ms.subservice: nosql
---
# Troubleshoot query issues when using Azure Cosmos DB
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article walks through a general recommended approach for troubleshooting queries in Azure Cosmos DB. Although you shouldn't consider the steps outlined in this article a complete defense against potential query issues, we've included the most common performance tips here. You should use this article as a starting place for troubleshooting slow or expensive queries in the Azure Cosmos DB for NoSQL. You can also use [diagnostics logs](../monitor-resource-logs.md) to identify queries that are slow or that consume significant amounts of throughput. If you are using Azure Cosmos DB's API for MongoDB, you should use [Azure Cosmos DB's API for MongoDB query troubleshooting guide](../mongodb/troubleshoot-query-performance.md)

Query optimizations in Azure Cosmos DB are broadly categorized as follows:

- Optimizations that reduce the Request Unit (RU) charge of the query
- Optimizations that just reduce latency

If you reduce the RU charge of a query, you'll typically decrease latency as well.

This article provides examples that you can re-create by using the [nutrition dataset](https://github.com/CosmosDB/labs/blob/master/dotnet/setup/NutritionData.json).

## Common SDK issues

Before reading this guide, it is helpful to consider common SDK issues that aren't related to the query engine.

- Follow these [SDK Performance tips for query](performance-tips-query-sdk.md).
- Sometimes queries may have empty pages even when there are results on a future page. Reasons for this could be:
    - The SDK could be doing multiple network calls.
    - The query might be taking a long time to retrieve the documents.
- All queries have a continuation token that will allow the query to continue. Be sure to drain the query completely. Learn more about [handling multiple pages of results](query/pagination.md#handle-multiple-pages-of-results)

## Get query metrics

When you optimize a query in Azure Cosmos DB, the first step is always to [get the query metrics](query-metrics-performance.md) for your query. These metrics are also available through the Azure portal. Once you run your query in the Data Explorer, the query metrics are visible next to the **Results** tab:

:::image type="content" source="./media/troubleshoot-query-performance/obtain-query-metrics.png" alt-text="Getting query metrics" lightbox="./media/troubleshoot-query-performance/obtain-query-metrics.png":::

After you get the query metrics, compare the **Retrieved Document Count** with the **Output Document Count** for your query. Use this comparison to identify the relevant sections to review in this article.

The **Retrieved Document Count** is the number of documents that the query engine needed to load. The **Output Document Count** is the number of documents that were needed for the results of the query. If the **Retrieved Document Count** is significantly higher than the **Output Document Count**, there was at least one part of your query that was unable to use an index and needed to do a scan.

Refer to the following sections to understand the relevant query optimizations for your scenario.

### Query's RU charge is too high

#### Retrieved Document Count is significantly higher than Output Document Count

- [Include necessary paths in the indexing policy.](#include-necessary-paths-in-the-indexing-policy)

- [Understand which system functions use the index.](#understand-which-system-functions-use-the-index)

- [Improve string system function execution.](#improve-string-system-function-execution)

- [Understand which aggregate queries use the index.](#understand-which-aggregate-queries-use-the-index)

- [Optimize queries that have both a filter and an ORDER BY clause.](#optimize-queries-that-have-both-a-filter-and-an-order-by-clause)

- [Optimize JOIN expressions by using a subquery.](#optimize-join-expressions-by-using-a-subquery)

<br>

#### Retrieved Document Count is approximately equal to Output Document Count

- [Minimize cross partition queries.](#minimize-cross-partition-queries)

- [Optimize queries that have filters on multiple properties.](#optimize-queries-that-have-filters-on-multiple-properties)

- [Optimize queries that have both a filter and an ORDER BY clause.](#optimize-queries-that-have-both-a-filter-and-an-order-by-clause)

<br>

### Query's RU charge is acceptable but latency is still too high

- [Improve proximity.](#improve-proximity)

- [Increase provisioned throughput.](#increase-provisioned-throughput)

- [Increase MaxConcurrency.](#increase-maxconcurrency)

- [Increase MaxBufferedItemCount.](#increase-maxbuffereditemcount)

## Queries where Retrieved Document Count exceeds Output Document Count

 The **Retrieved Document Count** is the number of documents that the query engine needed to load. The **Output Document Count** is the number of documents returned by the query. If the **Retrieved Document Count** is significantly higher than the **Output Document Count**, there was at least one part of your query that was unable to use an index and needed to do a scan.

Here's an example of scan query that wasn't entirely served by the index:

Query:

```sql
SELECT VALUE c.description
FROM c
WHERE UPPER(c.description) = "BABYFOOD, DESSERT, FRUIT DESSERT, WITHOUT ASCORBIC ACID, JUNIOR"
```

Query metrics:

```
Retrieved Document Count                 :          60,951
Retrieved Document Size                  :     399,998,938 bytes
Output Document Count                    :               7
Output Document Size                     :             510 bytes
Index Utilization                        :            0.00 %
Total Query Execution Time               :        4,500.34 milliseconds
  Query Preparation Times
    Query Compilation Time               :            0.09 milliseconds
    Logical Plan Build Time              :            0.05 milliseconds
    Physical Plan Build Time             :            0.04 milliseconds
    Query Optimization Time              :            0.01 milliseconds
  Index Lookup Time                      :            0.01 milliseconds
  Document Load Time                     :        4,177.66 milliseconds
  Runtime Execution Times
    Query Engine Times                   :          322.16 milliseconds
    System Function Execution Time       :           85.74 milliseconds
    User-defined Function Execution Time :            0.00 milliseconds
  Document Write Time                    :            0.01 milliseconds
Client Side Metrics
  Retry Count                            :               0
  Request Charge                         :        4,059.95 RUs
```

The **Retrieved Document Count** (60,951) is significantly higher than the **Output Document Count** (7), implying that this query resulted in a document scan. In this case, the system function [UPPER()](query/upper.md) doesn't use an index.

### Include necessary paths in the indexing policy

Your indexing policy should cover any properties included in `WHERE` clauses, `ORDER BY` clauses, `JOIN`, and most system functions. The desired paths specified in the index policy should match the properties in the JSON documents.

> [!NOTE]
> Properties in Azure Cosmos DB indexing policy are case-sensitive

If you run the following simple query on the [nutrition](https://github.com/CosmosDB/labs/blob/master/dotnet/setup/NutritionData.json) dataset, you will observe a much lower RU charge when the property in the `WHERE` clause is indexed:

#### Original

Query:

```sql
SELECT *
FROM c
WHERE c.description = "Malabar spinach, cooked"
```

Indexing policy:

```json
{
    "indexingMode": "consistent",
    "automatic": true,
    "includedPaths": [
        {
            "path": "/*"
        }
    ],
    "excludedPaths": [
        {
            "path": "/description/*"
        }
    ]
}
```

**RU charge:** 409.51 RUs

#### Optimized

Updated indexing policy:

```json
{
    "indexingMode": "consistent",
    "automatic": true,
    "includedPaths": [
        {
            "path": "/*"
        }
    ],
    "excludedPaths": []
}
```

**RU charge:** 2.98 RUs

You can add properties to the indexing policy at any time, with no effect on write or read availability. You can [track index transformation progress](./how-to-manage-indexing-policy.md#dotnet-sdk).

### Understand which system functions use the index

Most system functions use indexes. Here's a list of some common string functions that use indexes:

- StartsWith
- Contains
- RegexMatch
- Left
- Substring - but only if the first num_expr is 0

Following are some common system functions that don't use the index and must load each document when used in a `WHERE` clause:

| **System function**                     | **Ideas   for optimization**             |
| --------------------------------------- |------------------------------------------------------------ |
| Upper/Lower                         | Instead of using the system function to normalize data for comparisons, normalize the casing upon insertion. A query like ```SELECT * FROM c WHERE UPPER(c.name) = 'BOB'``` becomes ```SELECT * FROM c WHERE c.name = 'BOB'```. |
| GetCurrentDateTime/GetCurrentTimestamp/GetCurrentTicks | Calculate the current time before query execution and use that string value in the `WHERE` clause. |
| Mathematical functions (non-aggregates) | If you need to compute a value frequently in your query, consider storing the value as a property in your JSON document. |

These system functions can use indexes, except when used in queries with aggregates:

| **System function**                     | **Ideas   for optimization**             |
| --------------------------------------- |------------------------------------------------------------ |
| Spatial system functions                        | Store the query result in a real-time materialized view |

When used in the `SELECT` clause, inefficient system functions will not affect how queries can use indexes.

### Improve string system function execution

For some system functions that use indexes, you can improve query execution by adding an `ORDER BY` clause to the query. 

More specifically, any system function whose RU charge increases as the cardinality of the property increases may benefit from having `ORDER BY` in the query. These queries do an index scan, so having the query results sorted can make the query more efficient.

This optimization can improve execution for the following system functions:

- StartsWith (where case-insensitive = true)
- StringEquals (where case-insensitive = true)
- Contains
- RegexMatch
- EndsWith

For example, consider the below query with `CONTAINS`. `CONTAINS` will use indexes but sometimes, even after adding the relevant index, you may still observe a very high RU charge when running the below query.

Original query:

```sql
SELECT *
FROM c
WHERE CONTAINS(c.town, "Sea")
```

You can improve query execution by adding `ORDER BY`:

```sql
SELECT *
FROM c
WHERE CONTAINS(c.town, "Sea")
ORDER BY c.town
```

The same optimization can help in queries with additional filters. In this case, it's best to also add properties with equality filters to the `ORDER BY` clause.

Original query:

```sql
SELECT *
FROM c
WHERE c.name = "Samer" AND CONTAINS(c.town, "Sea")
```

You can improve query execution by adding `ORDER BY` and [a composite index](../index-policy.md#composite-indexes) for (c.name, c.town):

```sql
SELECT *
FROM c
WHERE c.name = "Samer" AND CONTAINS(c.town, "Sea")
ORDER BY c.name, c.town
```

### Understand which aggregate queries use the index

In most cases, aggregate system functions in Azure Cosmos DB will use the index. However, depending on the filters or additional clauses in an aggregate query, the query engine may be required to load a high number of documents. Typically, the query engine will apply equality and range filters first. After applying these filters,
the query engine can evaluate additional filters and resort to loading remaining documents to compute the aggregate, if needed.

For example, given these two sample queries, the query with both an equality and `CONTAINS` system function filter will generally be more efficient than a query with just a `CONTAINS` system function filter. This is because the equality filter is applied first and uses the index before documents need to be loaded for the more expensive `CONTAINS` filter.

Query with only `CONTAINS` filter - higher RU charge:

```sql
SELECT COUNT(1)
FROM c
WHERE CONTAINS(c.description, "spinach")
```

Query with both equality filter and `CONTAINS` filter - lower RU charge:

```sql
SELECT AVG(c._ts)
FROM c
WHERE c.foodGroup = "Sausages and Luncheon Meats" AND CONTAINS(c.description, "spinach")
```

Here are additional examples of aggregate queries that will not fully use the index:

#### Queries with system functions that don't use the index

You should refer to the relevant [system function's page](query/system-functions.yml) to see if it uses the index.

```sql
SELECT MAX(c._ts)
FROM c
WHERE CONTAINS(c.description, "spinach")
```

#### Aggregate queries with user-defined functions(UDF's)

```sql
SELECT AVG(c._ts)
FROM c
WHERE udf.MyUDF("Sausages and Luncheon Meats")
```

#### Queries with GROUP BY

The RU charge of queries with `GROUP BY` will increase as the cardinality of the properties in the `GROUP BY` clause increases. In the below query, for example, the RU charge of the query will increase as the number unique descriptions increases.

The RU charge of an aggregate function with a `GROUP BY` clause will be higher than the RU charge of an aggregate function alone. In this example, the query engine must load every document that matches the `c.foodGroup = "Sausages and Luncheon Meats"` filter so the RU charge is expected to be high.

```sql
SELECT COUNT(1)
FROM c
WHERE c.foodGroup = "Sausages and Luncheon Meats"
GROUP BY c.description
```

If you plan to frequently run the same aggregate queries, it may be more efficient to build a real-time materialized view with the [Azure Cosmos DB change feed](../change-feed.md) than running individual queries.

### Optimize queries that have both a filter and an ORDER BY clause

Although queries that have a filter and an `ORDER BY` clause will normally use a range index, they'll be more efficient if they can be served from a composite index. In addition to modifying the indexing policy, you should add all properties in the composite index to the `ORDER BY` clause. This change to the query will ensure that it uses the composite index.  You can observe the impact by running a query on the [nutrition](https://github.com/CosmosDB/labs/blob/master/dotnet/setup/NutritionData.json) dataset:

#### Original

Query:

```sql
SELECT *
FROM c
WHERE c.foodGroup = "Soups, Sauces, and Gravies"
ORDER BY c._ts ASC
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

**RU charge:** 44.28 RUs

#### Optimized

Updated query (includes both properties in the `ORDER BY` clause):

```sql
SELECT *
FROM c
WHERE c.foodGroup = "Soups, Sauces, and Gravies"
ORDER BY c.foodGroup, c._ts ASC
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

**RU charge:** 8.86 RUs

### Optimize JOIN expressions by using a subquery

Multi-value subqueries can optimize `JOIN` expressions by pushing predicates after each select-many expression rather than after all cross joins in the `WHERE` clause.

Consider this query:

```sql
SELECT Count(1) AS Count
FROM c
JOIN t IN c.tags
JOIN n IN c.nutrients
JOIN s IN c.servings
WHERE t.name = 'infant formula' AND (n.nutritionValue > 0
AND n.nutritionValue < 10) AND s.amount > 1
```

**RU charge:** 167.62 RUs

For this query, the index will match any document that has a tag with the name `infant formula`, `nutritionValue` greater than 0, and `amount` greater than 1. The `JOIN` expression here will perform the cross-product of all items of tags, nutrients, and servings arrays for each matching document before any filter is applied. The `WHERE` clause will then apply the filter predicate on each `<c, t, n, s>` tuple.

For example, if a matching document has 10 items in each of the three arrays, it will expand to 1 x 10 x 10 x 10 (that is, 1,000) tuples. The use of subqueries here can help to filter out joined array items before joining with the next expression.

This query is equivalent to the preceding one but uses subqueries:

```sql
SELECT Count(1) AS Count
FROM c
JOIN (SELECT VALUE t FROM t IN c.tags WHERE t.name = 'infant formula')
JOIN (SELECT VALUE n FROM n IN c.nutrients WHERE n.nutritionValue > 0 AND n.nutritionValue < 10)
JOIN (SELECT VALUE s FROM s IN c.servings WHERE s.amount > 1)
```

**RU charge:** 22.17 RUs

Assume that only one item in the tags array matches the filter and that there are five items for both the nutrients and servings arrays. The `JOIN` expressions will expand to 1 x 1 x 5 x 5 = 25 items, as opposed to 1,000 items in the first query.

## Queries where Retrieved Document Count is equal to Output Document Count

If the **Retrieved Document Count** is approximately equal to the **Output Document Count**, the query engine didn't have to scan many unnecessary documents. For many queries, like those that use the `TOP` keyword, **Retrieved Document Count** might exceed **Output Document Count** by 1. You don't need to be concerned about this.

### Minimize cross partition queries

Azure Cosmos DB uses [partitioning](../partitioning-overview.md) to scale individual containers as Request Unit and data storage needs increase. Each physical partition has a separate and independent index. If your query has an equality filter that matches your container's partition key, you'll need to check only the relevant partition's index. This optimization reduces the total number of RUs that the query requires.

If you have a large number of provisioned RUs (more than 30,000) or a large amount of data stored (more than approximately 100 GB), you probably have a large enough container to see a significant reduction in query RU charges.

For example, if you create a container with the partition key foodGroup, the following queries will need to check only a single physical partition:

```sql
SELECT *
FROM c
WHERE c.foodGroup = "Soups, Sauces, and Gravies" and c.description = "Mushroom, oyster, raw"
```

Queries that have an `IN` filter with the partition key will only check the relevant physical partition(s) and will not "fan-out":

```sql
SELECT *
FROM c
WHERE c.foodGroup IN("Soups, Sauces, and Gravies", "Vegetables and Vegetable Products") and c.description = "Mushroom, oyster, raw"
```

Queries that have range filters on the partition key, or that don't have any filters on the partition key, will need to "fan-out" and check every physical partition's index for results:

```sql
SELECT *
FROM c
WHERE c.description = "Mushroom, oyster, raw"
```

```sql
SELECT *
FROM c
WHERE c.foodGroup > "Soups, Sauces, and Gravies" and c.description = "Mushroom, oyster, raw"
```

### Optimize queries that have filters on multiple properties

Although queries that have filters on multiple properties will normally use a range index, they'll be more efficient if they can be served from a composite index. For small amounts of data, this optimization won't have a significant impact. It could be useful, however, for large amounts of data. You can only optimize, at most, one non-equality filter per composite index. If your query has multiple non-equality filters, pick one of them that will use the composite index. The rest will continue to use range indexes. The non-equality filter must be defined last in the composite index. [Learn more about composite indexes](../index-policy.md#composite-indexes).

Here are some examples of queries that could be optimized with a composite index:

```sql
SELECT *
FROM c
WHERE c.foodGroup = "Vegetables and Vegetable Products" AND c._ts = 1575503264
```

```sql
SELECT *
FROM c
WHERE c.foodGroup = "Vegetables and Vegetable Products" AND c._ts > 1575503264
```

Here's the relevant composite index:

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

## Optimizations that reduce query latency

In many cases, the RU charge might be acceptable when query latency is still too high. The following sections give an overview of tips for reducing query latency. If you run the same query multiple times on the same dataset, it will typically have the same RU charge each time. But query latency might vary between query executions.

### Improve proximity

Queries that are run from a different region than the Azure Cosmos DB account will have higher latency than if they were run inside the same region. For example, if you're running code on your desktop computer, you should expect latency to be tens or hundreds of milliseconds higher (or more) than if the query came from a virtual machine within the same Azure region as Azure Cosmos DB. It's simple to [globally distribute data in Azure Cosmos DB](../distribute-data-globally.md) to ensure you can bring your data closer to your app.

### Increase provisioned throughput

In Azure Cosmos DB, your provisioned throughput is measured in Request Units (RUs). Imagine you have a query that consumes 5 RUs of throughput. For example, if you provision 1,000 RUs, you would be able to run that query 200 times per second. If you tried to run the query when there wasn't enough throughput available, Azure Cosmos DB would return an HTTP 429 error. Any of the current API for NoSQL SDKs will automatically retry this query after waiting for a short time. Throttled requests take longer, so increasing provisioned throughput can improve query latency. You can observe the [total number of throttled requests](../use-metrics.md#understand-how-many-requests-are-succeeding-or-causing-errors) on the **Metrics** blade of the Azure portal.

### Increase MaxConcurrency

Parallel queries work by querying multiple partitions in parallel. But data from an individual partitioned collection is fetched serially with respect to the query. So, if you set MaxConcurrency to the number of partitions, you have the best chance of achieving the most performant query, provided all other system conditions remain the same. If you don't know the number of partitions, you can set MaxConcurrency (or MaxDegreesOfParallelism in older SDK versions) to a high number. The system will choose the minimum (number of partitions, user provided input) as the maximum degree of parallelism.

### Increase MaxBufferedItemCount

Queries are designed to pre-fetch results while the current batch of results is being processed by the client. Pre-fetching helps to improve the overall latency of a query. Setting MaxBufferedItemCount limits the number of pre-fetched results. If you set this value to the expected number of results returned (or a higher number), the query can get the most benefit from pre-fetching. If you set this value to -1, the system will automatically determine the number of items to buffer.

## Next steps
See the following articles for information on how to measure RUs per query, get execution statistics to tune your queries, and more:

* [Get SQL query execution metrics by using .NET SDK](query-metrics-performance.md)
* [Tuning query performance with Azure Cosmos DB](./query-metrics.md)
* [Performance tips for .NET SDK](performance-tips.md)
* [Performance tips for Java v4 SDK](performance-tips-java-sdk-v4.md)