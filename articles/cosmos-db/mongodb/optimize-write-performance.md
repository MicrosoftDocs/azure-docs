---
title: Optimize write performance in the Azure Cosmos DB API for MongoDB
description: This article describes how to optimize write performance in the Azure Cosmos DB API for MongoDB to get the most throughput possible for the lowest cost. 
author: gahl-levy
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: how-to
ms.date: 06/25/2021
ms.author: gahllevy

---

# Optimize write performance in the Azure Cosmos DB API for MongoDB
[!INCLUDE[appliesto-sql-api](../includes/appliesto-mongodb-api.md)]

Optimizing write performance is essential to getting the most throughput out of the Azure Cosmos DB API for MongoDB's unlimited scale. Unlike other managed MongoDB services, the API for MongoDB automatically and transparently shards your collections for you (when using sharded collections) to scale infinitely. 

The way you write data needs to be mindful of this by parallelizing and spreading data across shards to get the most writes out of your databases and collections. The following tips illustrate how to do so.

## Spreading the load across your shards (sharded collections only)
When writing data to a sharded API for MongoDB collection, your data gets split up (sharded) into tiny slices and is written to each shard based on the value of your shard key field. You can think of each slice as a small portion of a virtual machine that only stores the documents containing one unique shard key value. 

If your application writes a massive amount of data to a single shard, this won't be efficient because the app would be maxing out the throughput of only one shard instead of spreading the load across all of your shards. By writing in parallel to many documents with unique shard key values, your write load will be evenly spread across your collection.

One example of doing this would be to write to a collection that is sharded on the _id field. Because the _id value is generated randomly, writes will be randomly distributed across database shards. However, one caveat of this is that if your collection is sharded on the _id field, queries will only be efficient if they include the _id value in them. In most use cases, it's better to choose a shard key that fits your query model and evenly distributes your data across your sharded collection. 

## Reduce the number of indexes
[Indexes]](../mongodb-indexing.md) are a great tool to drastically reduce the time it takes to query your data. For the best query experience, the API for MongoDB enables a wildcard index on your data by default to make queries blazing-fast. However, all indexes (including wildcard indexes) introduce additional load when writing data since the index needs to be written to in addition to the collection itself. 

Reducing the number of indexes to only the indexes you need to support your queries will make your writes faster and cheaper. As a general rule, we recommend that any field that you filter on should have a corresponding single-field index (which also enables multi-field filtering) for it and any group of fields that you sort (only for sorting) on should have a composite index for that group. 

## Set ordered to false in the MongoDB drivers
By default, the MongoDB drivers sets the ordered option to true when writing data, which writes each document in order one by one. This option reduces write performance since each write has to wait for the previous one to complete. When writing data, set this option to false to improve performance. 

## Tune for the optimal batch size
Cosmos DB accepts writes in batches of up to 1,000 documents. In cases where you are writing more than 1,000 documents at a time, client functions such as insertMany() should not be called with more than 1,000 documents. Otherwise, the client will wait for each batch to commit before moving on to the next. 

Instead, make multiple calls on seperate processes/threads to insertMany() with batches of 1,000 or less. In some cases, splitting the batches up with fewer than 1,000 documents will be faster.



## Next steps

* Create a new [Cosmos account, database, and collection](../create-cosmosdb-resources-portal.md).
* Learn more about [indexing in the API for MongoDB](../mongodb-indexing.md).
* Learn more about [Azure Cosmos DB's sharding/partitioning](../partitioning-overview.md).
* Learn more about [troubleshooting common issues](../mongodb-troubleshoot.md).


