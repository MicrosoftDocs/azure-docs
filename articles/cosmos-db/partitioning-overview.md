---
title: Partitioning and horizontal scaling in Azure Cosmos DB
description: Learn about partitioning, logical, physical partitions in Azure Cosmos DB, best practices when choosing a partition key, and how to manage logical partitions
author: deborahc
ms.author: dech
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/12/2020

---

# Partitioning and horizontal scaling in Azure Cosmos DB
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Azure Cosmos DB uses partitioning to scale individual containers in a database to meet the performance needs of your application. In partitioning, the items in a container are divided into distinct subsets called *logical partitions*. Logical partitions are formed based on the value of a *partition key* that is associated with each item in a container. All the items in a logical partition have the same partition key value.

For example, a container holds items. Each item has a unique value for the `UserID` property. If `UserID` serves as the partition key for the items in the container and there are 1,000 unique `UserID` values, 1,000 logical partitions are created for the container.

In addition to a partition key that determines the item's logical partition, each item in a container has an *item ID* (unique within a logical partition). Combining the partition key and the *item ID* creates the item's *index*, which uniquely identifies the item. [Choosing a partition key](#choose-partitionkey) is an important decision that will affect your application's performance.

This article explains the relationship between logical and physical partitions. It also discusses best practices for partitioning and gives an in-depth view at how horizontal scaling works in Azure Cosmos DB. It's not necessary to understand these internal details to select your partition key but we have covered them so you have clarity on how Azure Cosmos DB works.

## Logical partitions

A logical partition consists of a set of items that have the same partition key. For example, in a container that contains data about food nutrition, all items contain a `foodGroup` property. You can use `foodGroup` as the partition key for the container. Groups of items that have specific values for `foodGroup`, such as `Beef Products`, `Baked Products`, and `Sausages and Luncheon Meats`, form distinct logical partitions. You don't have to worry about deleting a logical partition when the underlying data is deleted.

A logical partition also defines the scope of database transactions. You can update items within a logical partition by using a [transaction with snapshot isolation](database-transactions-optimistic-concurrency.md). When new items are added to a container, new logical partitions are transparently created by the system.

There is no limit to the number of logical partitions in your container. Each logical partition can store up to 20GB of data. Good partition key choices have a wide range of possible values. For example, in a container where all items contain a `foodGroup` property, the data within the `Beef Products` logical partition can grow up to 20 GB. [Selecting a partition key](#choose-partitionkey) with a wide range of possible values ensures that the container is able to scale.

## Physical partitions

A container is scaled by distributing data and throughput across physical partitions. Internally, one or more logical partitions are mapped to a single physical partition. Typically smaller containers have many logical partitions but they only require a single physical partition. Unlike logical partitions, physical partitions are an internal implementation of the system and they are entirely managed by Azure Cosmos DB.

The number of physical partitions in your container depends on the following:

* The number of throughput provisioned (each individual physical partition can provide a throughput of up to 10,000 request units per second).
* The total data storage (each individual physical partition can store up to 50GB data).

> [!NOTE]
> Physical partitions are an internal implementation of the system and they are entirely managed by Azure Cosmos DB. When developing your solutions, don't focus on physical partitions because you can't control them. Instead, focus on your partition keys. If you choose a partition key that evenly distributes throughput consumption across logical partitions, you will ensure that throughput consumption across physical partitions is balanced.

There is no limit to the total number of physical partitions in your container. As your provisioned throughput or data size grows, Azure Cosmos DB will automatically create new physical partitions by splitting existing ones. Physical partition splits do not impact your application's availability. After the physical partition split, all data within a single logical partition will still be stored on the same physical partition. A physical partition split simply creates a new mapping of logical partitions to physical partitions.

Throughput provisioned for a container is divided evenly among physical partitions. A partition key design that doesn't distribute requests evenly might result in too many requests directed to a small subset of partitions that become "hot." Hot partitions lead to inefficient use of provisioned throughput, which might result in rate-limiting and higher costs.

You can see your container's physical partitions in the **Storage** section of the **Metrics blade** of the Azure portal:

:::image type="content" source="./media/partitioning-overview/view-partitions-zoomed-out.png" alt-text="Viewing number of physical partitions" lightbox="./media/partitioning-overview/view-partitions-zoomed-in.png" ::: 

In the above screenshot, a container has `/foodGroup` as the partition key. Each of the three bars in the graph represents a physical partition. In the image, **partition key range** is the same as a physical partition. The selected physical partition contains the top 3 most significant size logical partitions: `Beef Products`, `Vegetable and Vegetable Products`, and `Soups, Sauces, and Gravies`.

If you provision a throughput of 18,000 request units per second (RU/s), then each of the three physical partition can utilize 1/3 of the total provisioned throughput. Within the selected physical partition, the logical partition keys `Beef Products`, `Vegetable and Vegetable Products`, and `Soups, Sauces, and Gravies` can, collectively, utilize the physical partition's 6,000 provisioned RU/s. Because provisioned throughput is evenly divided across your container's physical partitions, it's important to choose a partition key that evenly distributes throughput consumption by [choosing the right logical partition key](#choose-partitionkey). 

## Managing logical partitions

Azure Cosmos DB transparently and automatically manages the placement of logical partitions on physical partitions to efficiently satisfy the scalability and performance needs of the container. As the throughput and storage requirements of an application increase, Azure Cosmos DB moves logical partitions to automatically spread the load across a greater number of physical partitions. You can learn more about [physical partitions](partitioning-overview.md#physical-partitions).

Azure Cosmos DB uses hash-based partitioning to spread logical partitions across physical partitions. Azure Cosmos DB hashes the partition key value of an item. The hashed result determines the physical partition. Then, Azure Cosmos DB allocates the key space of partition key hashes evenly across the physical partitions.

Transactions (in stored procedures or triggers) are allowed only against items in a single logical partition.

You can learn more about [how Azure Cosmos DB manages partitions](partitioning-overview.md). (It's not necessary to understand the internal details to build or run your applications, but added here for a curious reader.)

## Replica sets

Each physical partition consists of a set of replicas, also referred to as a [*replica set*](global-dist-under-the-hood.md). Each replica set hosts an instance of the database engine. A replica set makes the data stored within the physical partition durable, highly available, and consistent. Each replica that makes up the physical partition inherits the partition's storage quota. All replicas of a physical partition collectively support the throughput that's allocated to the physical partition. Azure Cosmos DB automatically manages replica sets.

Typically, smaller containers only require a single physical partition, but they will still have at least 4 replicas.

The following image shows how logical partitions are mapped to physical partitions that are distributed globally:

:::image type="content" source="./media/partitioning-overview/logical-partitions.png" alt-text="An image that demonstrates Azure Cosmos DB partitioning" border="false":::

## <a id="choose-partitionkey"></a>Choosing a partition key

A partition key has two components: **partition key path** and the **partition key value**. For example, consider an item { "userId" : "Andrew", "worksFor": "Microsoft" } if you choose "userId" as the partition key, the following are the two partition key components:

* The partition key path (For example: "/userId"). The partition key path accepts alphanumeric and underscore(_) characters. You can also use nested objects by using the standard path notation(/).

* The partition key value (For example: "Andrew"). The partition key value can be of string or numeric types.

To learn about the limits on throughput, storage, and length of the partition key, see the [Azure Cosmos DB service quotas](concepts-limits.md) article.

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

The system property *item ID* exists in every item in your container. You may have other properties that represent a logical ID of your item. In many cases, these are also great partition key choices for the same reasons as the *item ID*.

The *item ID* is a great partition key choice for the following reasons:

* There are a wide range of possible values (one unique *item ID* per item).
* Because there is a unique *item ID* per item, the *item ID* does a great job at evenly balancing RU consumption and data storage.
* You can easily do efficient point reads since you'll always know an item's partition key if you know its *item ID*.

Some things to consider when selecting the *item ID* as the partition key include:

* If the *item ID* is the partition key, it will become a unique identifier throughout your entire container. You won't be able to have items that have a duplicate *item ID*.
* If you have a read-heavy container that has a lot of [physical partitions](partitioning-overview.md#physical-partitions), queries will be more efficient if they have an equality filter with the *item ID*.
* You can't run stored procedures or triggers across multiple logical partitions.

## Next steps

* Learn about [provisioned throughput in Azure Cosmos DB](request-units.md).
* Learn about [global distribution in Azure Cosmos DB](distribute-data-globally.md).
* Learn how to [provision throughput on an Azure Cosmos container](how-to-provision-container-throughput.md).
* Learn how to [provision throughput on an Azure Cosmos database](how-to-provision-database-throughput.md).
