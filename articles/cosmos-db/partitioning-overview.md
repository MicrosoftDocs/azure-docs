---
title: Partitioning in Azure Cosmos DB
description: Learn about partitioning in Azure Cosmos DB, best practices when choosing a partition key, and how to manage logical partitions
author: deborahc
ms.author: dech
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/06/2020

---

# Partitioning in Azure Cosmos DB

Azure Cosmos DB uses partitioning to scale individual containers in a database to meet the performance needs of your application. In partitioning, the items in a container are divided into distinct subsets called *logical partitions*. Logical partitions are formed based on the value of a *partition key* that is associated with each item in a container. All items in a logical partition have the same partition key value.

For example, a container holds items. Each item has a unique value for the `UserID` property. If `UserID` serves as the partition key for the items in the container and there are 1,000 unique `UserID` values, 1,000 logical partitions are created for the container.

In addition to a partition key that determines the item's logical partition, each item in a container has an *item ID* (unique within a logical partition). Combining the partition key and the *item ID* creates the item's *index*, which uniquely identifies the item.

[Choosing a partition key](partitioning-overview.md#choose-partitionkey) is an important decision that will affect your application's performance.

## Managing logical partitions

Azure Cosmos DB transparently and automatically manages the placement of logical partitions on physical partitions to efficiently satisfy the scalability and performance needs of the container. As the throughput and storage requirements of an application increase, Azure Cosmos DB moves logical partitions to automatically spread the load across a greater number of physical partitions. You can learn more about [physical partitions](partition-data.md#physical-partitions).

Azure Cosmos DB uses hash-based partitioning to spread logical partitions across physical partitions. Azure Cosmos DB hashes the partition key value of an item. The hashed result determines the physical partition. Then, Azure Cosmos DB allocates the key space of partition key hashes evenly across the physical partitions.

Transactions (in stored procedures or triggers) are allowed only against items in a single logical partition.

You can learn more about [how Azure Cosmos DB manages partitions](partition-data.md). (It's not necessary to understand the internal details to build or run your applications, but added here for a curious reader.)

## <a id="choose-partitionkey"></a>Choosing a partition key

Selecting your partition key is a simple but important design choice in Azure Cosmos DB. Once you select your partition key, it is not possible to change it in-place. If you need to change your partition key, you should move your data to a new container with your new desired partition key.

For **all** containers, your partition key should:

* Be a property that has a value which does not change. If a property is your partition key, you can't update that property's value.
* Have a high cardinality. In other words, the property should have a wide range of possible values.
* Spread request unit (RU) consumption and data storage evenly across all logical partitions. This ensures even RU consumption and storage distribution across your physical partitions.

If you need [multi-item ACID transactions](database-transactions-optimistic-concurrency.md#multi-item-transactions) in Azure Cosmos DB, you will need to use [stored procedures or triggers](how-to-write-stored-procedures-triggers-udfs.md#stored-procedures). All JavaScript-based stored procedures and triggers are scoped to a single logical partition.

## Partition keys for read-heavy containers

For most containers, the above criteria is all you need to consider when picking a partition key. For large read-heavy containers, however, you might want to choose a partition key that appears frequently as a filter in your queries. Queries can be [efficiently routed to only the relevant physical partitions](how-to-query-container.md#in-partition-query) by including the partition key in the filter predicate.

If most of your workload's requests are queries and most of your queries have an equality filter on the same property, this property can be a good partition key choice. For example, if you frequently run a query that filters on `UserID`, then selecting `UserID` as the partition key would reduce the number of [cross-partition queries](how-to-query-container.md#avoiding-cross-partition-queries).

However, if your container is small, you probably don't have enough physical partitions to need to worry about the performance impact of cross-partition queries. Most small containers in Azure Cosmos DB only require one or two physical partitions.

If your container could grow to more than a few physical partitions, then you should make sure you pick a partition key that minimizes cross-partition queries. Your container will require more than a few physical partitions when either of the following are true:

* Your container will have over 30,000 RU's provisioned
* Your container will store over 100 GB of data

## Using item ID as the partition key

If your container has a property that has a wide range of possible values, it is likely a great partition key choice. One possible example of such a property is the *item ID*. For small read-heavy containers or write-heavy containers of any size, the *item ID* is naturally a great choice for the partition key.

The system property *item ID* is guaranteed to exist in every item in your Cosmos container. You may have other properties that represent a logical ID of your item. In many cases, these are also great partition key choices for the same reasons as the *item ID*.

The *item ID* is a great partition key choice for the following reasons:

* There are a wide range of possible values (one unique *item ID* per item).
* Because there is a unique *item ID* per item, the *item ID* does a great job at evenly balancing RU consumption and data storage.
* You can easily do efficient point reads since you'll always know an item's partition key if you know its *item ID*.

Some things to consider when selecting the *item ID* as the partition key include:

* If the *item ID* is the partition key, it will become a unique identifier throughout your entire container. You won't be able to have items that have a duplicate *item ID*.
* If you have a read-heavy container that has a lot of [physical partitions](partition-data.md#physical-partitions), queries will be more efficient if they have an equality filter with the *item ID*.
* You can't run stored procedures or triggers across multiple logical partitions.

## Next steps

* Learn about [partitioning and horizontal scaling in Azure Cosmos DB](partition-data.md).
* Learn about [provisioned throughput in Azure Cosmos DB](request-units.md).
* Learn about [global distribution in Azure Cosmos DB](distribute-data-globally.md).
