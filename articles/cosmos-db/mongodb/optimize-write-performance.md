---
title: Optimize write performance in the Azure Cosmos DB for MongoDB
description: This article describes how to optimize write performance in the Azure Cosmos DB for MongoDB to get the most throughput possible for the lowest cost. 
author: gahl-levy
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 08/26/2021
ms.author: gahllevy
---

# Optimize write performance in Azure Cosmos DB for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Optimizing write performance helps you get the most out of Azure Cosmos DB for MongoDB's unlimited scale. Unlike other managed MongoDB services, the API for MongoDB automatically and transparently shards your collections for you (when using sharded collections) to scale infinitely. 

The way you write data needs to be mindful of this by parallelizing and spreading data across shards to get the most writes out of your databases and collections. This article explains best practices to optimize write performance.

## Spread the load across your shards
When writing data to a sharded API for MongoDB collection, your data is split up (sharded) into tiny slices and it is written to each shard based on the value of your shard key field. You can think of each slice as a small portion of a virtual machine that only stores the documents containing one unique shard key value. 

If your application writes a massive amount of data to a single shard, this won't be efficient because the app would be maxing out the throughput of only one shard instead of spreading the load across all of your shards. Your write load will be evenly spread across your collection by writing in parallel to many documents with unique shard key values.

One example of doing this would be a product catalog application that is sharded on the category field. Instead of writing to one category (shard) at a time, it's better write to all categories simultaneously to achieve the maximum write throughput. 

## Reduce the number of indexes
[Indexing](../mongodb/indexing.md) is a great feature to drastically reduce the time it takes to query your data. For the most flexible query experience, the API for MongoDB enables a wildcard index on your data by default to make queries against all fields blazing-fast. However, all indexes, which include wildcard indexes introduce additional load when writing data because writes change the collection and indexes. 

Reducing the number of indexes to only the indexes you need to support your queries will make your writes faster and cheaper. As a general rule, we recommend the following:

* Any field that you filter on should have a corresponding single-field index for it. This option also enables multi-field filtering.
* Any group of fields that you sort on should have a composite index for that group. 

## Set ordered to false in the MongoDB drivers
By default, the MongoDB drivers set the ordered option to "true" when writing data, which writes each document in order one by one. This option reduces write performance since each write request has to wait for the previous one to complete. When writing data, set this option to false to improve performance. 

```JavaScript
db.collection.insertMany(
   [ <doc1> , <doc2>, ... ],
   {
      ordered: false
   }
)
```

## Tune for the optimal batch size and thread count
Parallelization of write operations across many threads/processes is key to scaling writes. The API for MongoDB accepts writes in batches of up to 1,000 documents for each process/thread. 

If you are writing more than 1,000 documents at a time per process/thread, client functions such as `insertMany()` should be limited to roughly 1,000 documents. Otherwise, the client will wait for each batch to commit before moving on to the next batch. In some cases, splitting up the batches with fewer or slightly more than 1,000 documents will be faster.



## Next steps

* Learn more about [indexing in the API for MongoDB](../mongodb/indexing.md).
* Learn more about [Azure Cosmos DB's sharding/partitioning](../partitioning-overview.md).
* Learn more about [troubleshooting common issues](error-codes-solutions.md).
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
