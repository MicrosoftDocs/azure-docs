---
title: Troubleshoot query issues when using the Azure Cosmos DB for MongoDB
description: Learn how to identify, diagnose, and troubleshoot Azure Cosmos DB's API for MongoDB query issues.
ms.service: cosmos-db
ms.topic: troubleshooting
ms.subservice: mongodb
ms.custom: ignite-2022
ms.date: 08/26/2021
author: gahl-levy
ms.author: gahllevy
ms.reviewer: mjbrown
---

# Troubleshoot query issues when using the Azure Cosmos DB for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This article walks through a general recommended approach for troubleshooting queries in Azure Cosmos DB. Although you shouldn't consider the steps outlined in this article a complete defense against potential query issues, we've included the most common performance tips here. You should use this article as a starting place for troubleshooting slow or expensive queries in Azure Cosmos DB's API for MongoDB. If you are using the Azure Cosmos DB for NoSQL, see the [API for NoSQL query troubleshooting guide](troubleshoot-query-performance.md) article.

Query optimizations in Azure Cosmos DB are broadly categorized as follows:

- Optimizations that reduce the Request Unit (RU) charge of the query
- Optimizations that just reduce latency

If you reduce the RU charge of a query, you'll typically decrease latency as well.

This article provides examples that you can re-create by using the [nutrition dataset](https://github.com/CosmosDB/labs/blob/master/dotnet/setup/NutritionData.json).

> [!NOTE] 
> This article assumes you are using Azure Cosmos DB's API for MongoDB accounts with version 3.6 and higher. Some queries that perform poorly in version 3.2 have significant improvements in versions 3.6+. Upgrade to version 3.6 by filing a [support request](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Use $explain command to get metrics

When you optimize a query in Azure Cosmos DB, the first step is always to [obtain the RU charge](find-request-unit-charge.md) for your query. As a rough guideline, you should explore ways to lower the RU charge for queries with charges greater than 50 RUs. 

In addition to obtaining the RU charge, you should use the `$explain` command to obtain the query and index usage metrics. Here is an example that runs a query and uses the `$explain` command to show query and index usage metrics:

**$explain command:**

```
db.coll.find({foodGroup: "Baby Foods"}).explain({"executionStatistics": true })
```

**Output:**

```json
{
    "stages" : [ 
        {
            "stage" : "$query",
            "timeInclusiveMS" : 905.2888,
            "timeExclusiveMS" : 905.2888,
            "in" : 362,
            "out" : 362,
            "details" : {
                "database" : "db-test",
                "collection" : "collection-test",
                "query" : {
                    "foodGroup" : {
                        "$eq" : "Baby Foods"
                    }
                },
                "pathsIndexed" : [],
                "pathsNotIndexed" : [ 
                    "foodGroup"
                ],
                "shardInformation" : [ 
                    {
                        "activityId" : "e68e6bdd-5e89-4ec5-b053-3dbbc2428140",
                        "shardKeyRangeId" : "0",
                        "durationMS" : 788.5867,
                        "preemptions" : 1,
                        "outputDocumentCount" : 362,
                        "retrievedDocumentCount" : 8618
                    }
                ],
                "queryMetrics" : {
                    "retrievedDocumentCount" : 8618,
                    "retrievedDocumentSizeBytes" : 104963042,
                    "outputDocumentCount" : 362,
                    "outputDocumentSizeBytes" : 2553535,
                    "indexHitRatio" : 0.0016802042237178,
                    "totalQueryExecutionTimeMS" : 777.72,
                    "queryPreparationTimes" : {
                        "queryCompilationTimeMS" : 0.19,
                        "logicalPlanBuildTimeMS" : 0.14,
                        "physicalPlanBuildTimeMS" : 0.09,
                        "queryOptimizationTimeMS" : 0.03
                    },
                    "indexLookupTimeMS" : 0,
                    "documentLoadTimeMS" : 687.22,
                    "vmExecutionTimeMS" : 774.09,
                    "runtimeExecutionTimes" : {
                        "queryEngineExecutionTimeMS" : 37.45,
                        "systemFunctionExecutionTimeMS" : 10.82,
                        "userDefinedFunctionExecutionTimeMS" : 0
                    },
                    "documentWriteTimeMS" : 49.42
                }
            }
        }
    ],
    "estimatedDelayFromRateLimitingInMilliseconds" : 0.0,
    "continuation" : {
        "hasMore" : false
    },
    "ok" : 1.0
}
```

The `$explain` command output is lengthy and has detailed information about query execution. In general, though, there are a few sections where you should focus when optimizing query performance:

| Metric | Description | 
| ------ | ----------- |
| `timeInclusiveMS` | Backend query latency |
| `pathsIndexed` | Shows indexes that the query used | 
| `pathsNotIndexed` | Shows indexes that the query could have used, if available | 
| `shardInformation` | Summary of query performance for a particular [physical partition](../partitioning-overview.md#physical-partitions) | 
| `retrievedDocumentCount` | Number of documents loaded by the query engine | 
| `outputDocumentCount` | Number of documents returned in the query results | 
| `estimatedDelayFromRateLimitingInMilliseconds` | Estimated additional query latency due to rate limiting | 

After you get the query metrics, compare the `retrievedDocumentCount` with the `outputDocumentCount` for your query. Use this comparison to identify the relevant sections to review in this article. The `retrievedDocumentCount`  is the number of documents that the query engine needs to load. The `outputDocumentCount` is the number of documents that were needed for the results of the query. If the `retrievedDocumentCount`  is significantly higher than the `outputDocumentCount`, there was at least one part of your query that was unable to use an index and needed to do a scan.

Refer to the following sections to understand the relevant query optimizations for your scenario.

### Query's RU charge is too high

#### Retrieved Document Count is significantly higher than Output Document Count

- [Include necessary indexes.](#include-necessary-indexes)

- [Understand which aggregation operations use the index.](#understand-which-aggregation-operations-use-the-index)

#### Retrieved Document Count is approximately equal to Output Document Count

- [Minimize cross partition queries.](#minimize-cross-partition-queries)

### Query's RU charge is acceptable but latency is still too high

- [Improve proximity.](#improve-proximity)

- [Increase provisioned throughput.](#increase-provisioned-throughput)

## Queries where retrieved document count exceeds output document count

 The `retrievedDocumentCount` is the number of documents that the query engine needed to load. The `outputDocumentCount` is the number of documents returned by the query. If the `retrievedDocumentCount` is significantly higher than the `outputDocumentCount`, there was at least one part of your query that was unable to use an index and needed to do a scan.

Here's an example of scan query that wasn't entirely served by the index:

**$explain command:**

```
db.coll.find(
  {
    $and : [
            { "foodGroup" : "Cereal Grains and Pasta"}, 
            { "description" : "Oat bran, cooked"}
        ]
  }
).explain({"executionStatistics": true })
```

**Output:**

```json
{
    "stages" : [ 
        {
            "stage" : "$query",
            "timeInclusiveMS" : 436.5716,
            "timeExclusiveMS" : 436.5716,
            "in" : 1,
            "out" : 1,
            "details" : {
                "database" : "db-test",
                "collection" : "indexing-test",
                "query" : {
                    "$and" : [ 
                        {
                            "foodGroup" : {
                                "$eq" : "Cereal Grains and Pasta"
                            }
                        }, 
                        {
                            "description" : {
                                "$eq" : "Oat bran, cooked"
                            }
                        }
                    ]
                },
                "pathsIndexed" : [],
                "pathsNotIndexed" : [ 
                    "foodGroup", 
                    "description"
                ],
                "shardInformation" : [ 
                    {
                        "activityId" : "13a5977e-a10a-4329-b68e-87e4f0081cac",
                        "shardKeyRangeId" : "0",
                        "durationMS" : 435.4867,
                        "preemptions" : 1,
                        "outputDocumentCount" : 1,
                        "retrievedDocumentCount" : 8618
                    }
                ],
                "queryMetrics" : {
                    "retrievedDocumentCount" : 8618,
                    "retrievedDocumentSizeBytes" : 104963042,
                    "outputDocumentCount" : 1,
                    "outputDocumentSizeBytes" : 6064,
                    "indexHitRatio" : 0.0,
                    "totalQueryExecutionTimeMS" : 433.64,
                    "queryPreparationTimes" : {
                        "queryCompilationTimeMS" : 0.12,
                        "logicalPlanBuildTimeMS" : 0.09,
                        "physicalPlanBuildTimeMS" : 0.1,
                        "queryOptimizationTimeMS" : 0.02
                    },
                    "indexLookupTimeMS" : 0,
                    "documentLoadTimeMS" : 387.44,
                    "vmExecutionTimeMS" : 432.93,
                    "runtimeExecutionTimes" : {
                        "queryEngineExecutionTimeMS" : 45.36,
                        "systemFunctionExecutionTimeMS" : 16.86,
                        "userDefinedFunctionExecutionTimeMS" : 0
                    },
                    "documentWriteTimeMS" : 0.13
                }
            }
        }
    ],
    "estimatedDelayFromRateLimitingInMilliseconds" : 0.0,
    "continuation" : {
        "hasMore" : false
    },
    "ok" : 1.0
}
```

The `retrievedDocumentCount` (8618) is significantly higher than the `outputDocumentCount` (1), implying that this query required a document scan. 

### Include necessary indexes

You should check the `pathsNotIndexed` array and add these indexes. In this example, the paths `foodGroup` and `description` should be indexed.

```json
"pathsNotIndexed" : [ 
                    "foodGroup", 
                    "description"
                ]
```

Indexing best practices in Azure Cosmos DB's API for MongoDB are different from MongoDB. In Azure Cosmos DB's API for MongoDB, compound indexes are only used in queries that need to efficiently sort by multiple properties. If you have queries with filters on multiple properties, you should create single field indexes for each of these properties. Query predicates can use multiple single field indexes.

[Wildcard indexes](indexing.md#wildcard-indexes) can simplify indexing. Unlike in MongoDB, wildcard indexes can support multiple fields in query predicates. There will not be a difference in query performance if you use one single wildcard index instead of creating a separate index for each property. Adding a wildcard index for all properties is the easiest way to optimize all of your queries.

You can add new indexes at any time, with no effect on write or read availability. You can [track index transformation progress](../how-to-manage-indexing-policy.md#dotnet-sdk).

### Understand which aggregation operations use the index

In most cases, aggregation operations in Azure Cosmos DB's API for MongoDB will partially use indexes. Typically, the query engine will apply equality and range filters first and use indexes. After applying these filters, the query engine can evaluate additional filters and resort to loading remaining documents to compute the aggregate, if needed. 

Here's an example:

```
db.coll.aggregate( [
   { $match: { foodGroup: 'Fruits and Fruit Juices' } },
   {
     $group: {
        _id: "$foodGroup",
        total: { $max: "$version" }
     }
   }
] )
```

In this case, indexes can optimize the `$match` stage. Adding an index for `foodGroup` will significantly improve query performance. Like in MongoDB, you should place `$match` as early in the aggregation pipeline as possible to maximize usage of indexes.

In Azure Cosmos DB's API for MongoDB, indexes are not used for the actual aggregation, which in this case is `$max`. Adding an index on `version` will not improve query performance.

## Queries where retrieved document count is equal to Output Document Count

If the `retrievedDocumentCount` is approximately equal to the `outputDocumentCount`, the query engine didn't have to scan many unnecessary documents.

### Minimize cross partition queries

Azure Cosmos DB uses [partitioning](../partitioning-overview.md) to scale individual containers as Request Unit and data storage needs increase. Each physical partition has a separate and independent index. If your query has an equality filter that matches your container's partition key, you'll need to check only the relevant partition's index. This optimization reduces the total number of RUs that the query requires. [Learn more about the differences between in-partition queries and cross-partition queries](../how-to-query-container.md).

If you have a large number of provisioned RUs (more than 30,000) or a large amount of data stored (more than approximately 100 GB), you probably have a large enough container to see a significant reduction in query RU charges. 

You can check the `shardInformation` array to understand the query metrics for each individual physical partition. The number of unique `shardKeyRangeId` values is the number of physical partitions where the query needed to be executed. In this example, the query was executed on four physical partitions. It's important to understand that execution is completely independent from index utilization. In other words, cross-partition queries can still use indexes.

```json
  "shardInformation" : [ 
                    {
                        "activityId" : "42f670a8-a201-4c58-8023-363ac18d9e18",
                        "shardKeyRangeId" : "5",
                        "durationMS" : 24.3859,
                        "preemptions" : 1,
                        "outputDocumentCount" : 463,
                        "retrievedDocumentCount" : 463
                    }, 
                    {
                        "activityId" : "a8bf762a-37b9-4c07-8ed4-ae49961373c0",
                        "shardKeyRangeId" : "2",
                        "durationMS" : 35.8328,
                        "preemptions" : 1,
                        "outputDocumentCount" : 905,
                        "retrievedDocumentCount" : 905
                    }, 
                    {
                        "activityId" : "3754e36b-4258-49a6-8d4d-010555628395",
                        "shardKeyRangeId" : "1",
                        "durationMS" : 67.3969,
                        "preemptions" : 1,
                        "outputDocumentCount" : 1479,
                        "retrievedDocumentCount" : 1479
                    }, 
                    {
                        "activityId" : "a69a44ee-db97-4fe9-b489-3791f3d52878",
                        "shardKeyRangeId" : "0",
                        "durationMS" : 185.1523,
                        "preemptions" : 1,
                        "outputDocumentCount" : 867,
                        "retrievedDocumentCount" : 867
                    }
                ]
```

## Optimizations that reduce query latency

In many cases, the RU charge might be acceptable when query latency is still too high. The following sections give an overview of tips for reducing query latency. If you run the same query multiple times on the same dataset, it will typically have the same RU charge each time. But query latency might vary between query executions.

### Improve proximity

Queries that are run from a different region than the Azure Cosmos DB account will have higher latency than if they were run inside the same region. For example, if you're running code on your desktop computer, you should expect latency to be tens or hundreds of milliseconds higher (or more) than if the query came from a virtual machine within the same Azure region as Azure Cosmos DB. It's simple to [globally distribute data in Azure Cosmos DB](tutorial-global-distribution.md) to ensure you can bring your data closer to your app.

### Increase provisioned throughput

In Azure Cosmos DB, your provisioned throughput is measured in Request Units (RUs). Imagine you have a query that consumes 5 RUs of throughput. For example, if you provision 1,000 RUs, you would be able to run that query 200 times per second. If you tried to run the query when there wasn't enough throughput available, Azure Cosmos DB will rate limit the requests. Azure Cosmos DB's API for MongoDB will automatically retry this query after waiting for a short time. Throttled requests take longer, so increasing provisioned throughput can improve query latency.

The value `estimatedDelayFromRateLimitingInMilliseconds` gives a sense of the potential latency benefits if you increase throughput.

## Next steps

* [Troubleshoot query performance (API for NoSQL)](troubleshoot-query-performance.md)
* [Manage indexing in Azure Cosmos DB's API for MongoDB](indexing.md)
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
