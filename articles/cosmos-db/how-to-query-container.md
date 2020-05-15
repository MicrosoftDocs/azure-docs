---
title: Query containers in Azure Cosmos DB
description: Learn how to query containers in Azure Cosmos DB using in-partition and cross-partition queries
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 3/18/2019
ms.author: mjbrown
---

# Query an Azure Cosmos container

This article explains how to query a container (collection, graph, or table) in Azure Cosmos DB. In particular, it covers how in-partition and cross-partition queries work in Azure Cosmos DB.

## In-partition query

When you query data from containers, if the query has a partition key filter specified, Azure Cosmos DB automatically optimizes the query. It routes the query to the [physical partitions](partition-data.md#physical-partitions) corresponding to the partition key values specified in the filter.

For example, consider the below query with an equality filter on `DeviceId`. If we run this query on a container partitioned on `DeviceId`, this query will filter to a single physical partition.

```sql
    SELECT * FROM c WHERE c.DeviceId = 'XMS-0001'
```

As with the earlier example,  this query will also filter to a single partition. Adding the additional filter on `Location` does not change this:

```sql
    SELECT * FROM c WHERE c.DeviceId = 'XMS-0001' AND c.Location = 'Seattle'
```

Here's a query that has a range filter on the partition key and won't be scoped to a single physical partition. In order to be an in-partition query, the query must have an equality filter that includes the partition key:

```sql
    SELECT * FROM c WHERE c.DeviceId > 'XMS-0001'
```

## Cross-partition query

The following query doesn't have a filter on the partition key (`DeviceId`). Therefore, it must fan-out to all physical partitions where it is run against each partition's index:

```sql
    SELECT * FROM c WHERE c.Location = 'Seattle`
```

Each physical partition has its own index. Therefore, when you run a cross-partition query on a container, you are effectively running one query *per* physical partition. Azure Cosmos DB will automatically aggregate results across different physical partitions.

The indexes in different physical partitions are independent from one another. There is no global index in Azure Cosmos DB.

## Parallel cross-partition query

The Azure Cosmos DB SDKs 1.9.0 and later support parallel query execution options. Parallel cross-partition queries allow you to perform low latency, cross-partition queries.

You can manage parallel query execution by tuning the following parameters:

- **MaxConcurrency**: Sets the maximum number of simultaneous network connections to the container's partitions. If you set this property to `-1`, the SDK manages the degree of parallelism. If the `MaxConcurrency` set to `0`, there is a single network connection to the container's partitions.

- **MaxBufferedItemCount**: Trades query latency versus client-side memory utilization. If this option is omitted or to set to -1, the SDK manages the number of items buffered during parallel query execution.

Because of the Azure Cosmos DB's ability to parallelize cross-partition queries, query latency will generally scale well as the system adds [physical partitions](partition-data.md#physical-partitions). However, RU charge will increase significantly as the total number of physical partitions increases.

When you run a cross-partition query, you are essentially doing a separate query per individual physical partition. While cross-partition queries queries will use the index, if available, they are still not nearly as efficient as in-partition queries.

## Useful example

Here's an analogy to better understand cross-partition queries:

Let's imagine you are a delivery driver that has to deliver packages to different apartment complexes. Each apartment complex has a list on the premises that has all of the resident's unit numbers. We can compare each apartment complex to a physical partition and each list to the physical partition's index.

We can compare in-partition and cross-partition queries using this example:

### In-partition query

If the delivery driver knows the correct apartment complex (physical partition), then they can immediately drive to the correct building. The driver can check the apartment complex's list of the resident's unit numbers (the index) and quickly deliver the appropriate packages. In this case, the driver does not waste any time or effort driving to an apartment complex to check and see if any package recipients live there.

### Cross-partition query (fan-out)

If the delivery driver does not know the correct apartment complex (physical partition), they'll need to drive to every single apartment building and check the list with all of the resident's unit numbers (the index). Once they arrive at each apartment complex, they'll still be able to use the list of the addresses of each resident. However, they will need to check every apartment complex's list, whether any package recipients live there or not. This is how cross-partition queries work. While they can use the index (don't need to knock on every single door), they must separately check the index for every physical partition.

### Cross-partition query (scoped to only a few physical partitions)

If the delivery driver knows that all package recipients live within a certain few apartment complexes, they won't need to drive to every single one. While driving to a few apartment complexes will still require more work than visiting just a single building, the delivery driver still saves significant time and effort. If a query has the partition key in its filter with the `IN` keyword, it will only check the relevant physical partition's indexes for data.

## Avoiding cross-partition queries

For most containers, it's inevitable that you will have some cross-partition queries. Having some cross-partition queries is ok! Nearly all query operations are supported across partitions (both logical partition keys and physical partitions). Azure Cosmos DB also has many optimizations in the query engine and client SDKs to parallelize query execution across physical partitions.

For most read-heavy scenarios, we recommend simply selecting the most common property in your query filters. You should also make sure your partition key adheres to other [partition key selection best practices](partitioning-overview.md#choose-partitionkey).

Avoiding cross-partition queries typically only matters with large containers. You are charged a minimum of about 2.5 RU's each time you check a physical partition's index for results, even if no items in the physical partition match the query's filter. As such, if you have only one (or just a few) physical partitions, cross-partition queries will not consume significantly more RU's than in-partition queries.

The number of physical partitions is tied to the amount of provisioned RU's. Each physical partition allows for up to 10,000 provisioned RU's and can store up to 50 GB of data. Azure Cosmos DB will automatically manage physical partitions for you. The number of physical partitions in your container is dependent on your provisioned throughput and consumed storage.

You should try to avoid cross-partition queries if your workload meets the criteria below:
- You plan to have over 30,000 RU's provisioned
- You plan to store over 100 GB of data

## Next steps

See the following articles to learn about partitioning in Azure Cosmos DB:

- [Partitioning in Azure Cosmos DB](partitioning-overview.md)
- [Synthetic partition keys in Azure Cosmos DB](synthetic-partition-keys.md)
