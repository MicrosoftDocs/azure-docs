---
title: Partitioning and horizontal scaling in Azure Cosmos DB
description: Learn about how partitioning works in Azure Cosmos DB, how to configure partitioning and partition keys, and how to pick the right partition key for your application.
author: aliuy

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/30/2018
ms.author: andrl

---

# Partitioning and horizontal scaling in Azure Cosmos DB

This article explains about physical and logical partitions in Azure Cosmos DB, and the best practices for scaling and partitioning. 

## Logical partitions

A logical partition consists of a set of items with the same partition key. For example, consider a container where all the items contain a `City` property, then you can use `City` as the partition key for the container. Groups of items with specific values for the `City` such as, "London", "Paris", "NYC" etc. will form a distinct logical partition.

In Azure Cosmos DB, a container is the fundamental unit of scalability. The data added to the container and the throughput that you provision on the container are automatically (horizontally) partitioned across a set of logical partitions. They are partitioned based on the partition key you specify for the Cosmos container. To learn more, see [how to specify the partition key for your Cosmos container](how-to-create-container.md) article.

A logical partition defines the scope of database transactions. You can update items within a logical partition by using a transaction with snapshot isolation.

When new items are added to the container or if the throughput provisioned on the container is increased, new logical partitions are transparently created by the system.

## Physical partitions

A Cosmos container is scaled by distributing the data and the throughput across a large number of logical partitions. Internally, one or more logical partitions are mapped to a **resource partition** that consists of a set of replicas also referred to as a replica-set. Each replica-set hosts an instance of the Cosmos database engine. A replica-set makes the data stored within the resource partition durable, highly available, and consistent. A resource partition supports a fixed, maximum amount of storage and RUs. Each replica comprising the resource partition inherits the storage quota. And all replicas of a resource partition collectively support the throughput allocated to the resource partition. The following image shows how logical partitions are mapped to physical partitions that are distributed globally:

![Azure Cosmos DB partitioning](./media/partition-data/logical-partitions.png)

Throughput provisioned for a container is divided evenly among the physical partitions. Therefore a partition key design that doesn't distribute the throughput requests evenly can create "hot" partitions. Hot partitions can result in rate-limiting and inefficient use of the provisioned throughput.

Unlike logical partitions, physical partitions are an internal implementation of the system. You can't control their size, placement, the count, or the mapping between the logical partitions and the physical partitions. However, you can control the number of logical partitions and the distribution of data and throughput by choosing the right partition key.

## Next steps

In this article, provided an overview of data partitioning and best practices for scaling and partitioning in Azure Cosmos DB. 

* Learn about [provisioned throughput in Azure Cosmos DB](request-units.md)
* Learn about [global distribution in Azure Cosmos DB](distribute-data-globally.md)
* Learn about [choosing a partition-key](partitioning-overview.md#choose-partitionkey)
* Learn [how to provision throughput on a Cosmos container](how-to-provision-container-throughput.md)
* Learn [how to provision throughput on a Cosmos database](how-to-provision-database-throughput.md)
