---
title: Partitioning and horizontal scaling in Azure Cosmos DB
description: Learn about how partitioning works in Azure Cosmos DB, how to configure partitioning and partition keys, and how to choose the right partition key for your application.
ms.author: mjbrown
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/30/2018

---

# Partitioning and horizontal scaling in Azure Cosmos DB

This article explains physical and logical partitions in Azure Cosmos DB. It also discusses best practices for scaling and partitioning. 

## Logical partitions

A logical partition consists of a set of items that have the same partition key. For example, in a container where all items contain a `City` property, you can use `City` as the partition key for the container. Groups of items that have specific values for `City`, such as, `London`, `Paris`, and `NYC`, form a distinct logical partition.

In Azure Cosmos DB, a container is the fundamental unit of scalability. Data that's added to the container and the throughput that you provision on the container are automatically (horizontally) partitioned across a set of logical partitions. Data and throughput are partitioned based on the partition key you specify for the Azure Cosmos DB container. For more information, see [Create an Azure Cosmos DB container](how-to-create-container.md).

A logical partition defines the scope of database transactions. You can update items within a logical partition by using a transaction with snapshot isolation. When new items are added to the container, new logical partitions are transparently created by the system.

## Physical partitions

An Azure Cosmos DB container is scaled by distributing data and throughput across a large number of logical partitions. Internally, one or more logical partitions are mapped to a physical partition that consists of a set of replicas, also referred to as a *replica set*. Each replica set hosts an instance of the Azure Cosmos DB database engine. A replica set makes the data stored within the physical partition durable, highly available, and consistent. A physical partition supports the maximum amount of storage and request units (RUs). Each replica that makes up the physical partition inherits the partition's storage quota. All replicas of a physical partition collectively support the throughput that's allocated to the physical partition. 

The following image shows how logical partitions are mapped to physical partitions that are distributed globally:

![An image that demonstrates Azure Cosmos DB partitioning](./media/partition-data/logical-partitions.png)

Throughput provisioned for a container is divided evenly among physical partitions. A partition key design that doesn't distribute the throughput requests evenly might create "hot" partitions. Hot partitions might result in rate-limiting and in inefficient use of the provisioned throughput.

Unlike logical partitions, physical partitions are an internal implementation of the system. You can't control the size, placement, or count of physical partitions, and you can't control the mapping between logical partitions and physical partitions. However, you can control the number of logical partitions and the distribution of data and throughput by choosing the right partition key.

## Next steps

* Learn about [choosing a partition key](partitioning-overview.md#choose-partitionkey).
* Learn about [provisioned throughput in Azure Cosmos DB](request-units.md).
* Learn about [global distribution in Azure Cosmos DB](distribute-data-globally.md).
* Learn how to [provision throughput in an Azure Cosmos DB container](how-to-provision-container-throughput.md).
* Learn how to [provision throughput in an Azure Cosmos DB database](how-to-provision-database-throughput.md).
