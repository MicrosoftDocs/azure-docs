---
title: Partitioning and horizontal scaling in Azure Cosmos DB
description: Learn about how partitioning works in Azure Cosmos DB, how to configure partitioning and partition keys, and how to pick the right partition key for your application.
services: cosmos-db
author: aliuy
manager: kfile

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: andrl

---

# Logical partitions
In Azure Cosmos DB, a Cosmos container is the fundamental unit of scalability. The items that you add to the container and the throughput that you provision are both automatically (horizontally) partitioned across a set of logical partitions, based on the partition key you specify for the Cosmos container. See [how to specify the partition key for your Cosmos container](TBD).

A logical partition consists of a set of items all with the identical values for the partition key. Consider you have a container with all the items containing a `City` property, then you can use `City` as the partition key for the container. Groups of items with specific values of the `City` property (for example, "London", "Paris", "NYC") each will form a distinct logical partition.

A logical partition is the scope of database transactions. You can update items within a logical partition using a transaction with snapshot isolation. For more information about transactions, see [multi-item transactions](TBD).

As new items get added to the container or the provisioned throughput on the container is increased, new logical partitions get created transparently by the system.

## Physical partitions

A Cosmos container is scaled by distributing the data and the throughput across a large number of logical partitions. Internally, one or more logical partitions are mapped onto a **resource partition** that consists of a set of replicas (referred to as a replica-set), each hosting an instance of the Cosmos database engine. The replica-set makes the data within the resource partition, durable, highly available, and strongly consistent. A resource partition can support a fixed, maximum amount of storage and RUs – each replica comprising the resource partition inherits the storage quota and all replicas of a resource partition jointly support the throughput supported by the resource partition.

![Azure Cosmos DB partitioning](./media/partition-data/logical-partitions.png)
**Logical partitions are mapped to resource partitions that are distributed globally**

Provisioned throughput (RUs) for a container is divided evenly among the resource partitions. Therefore a partition key design that doesn't distribute the throughput requests evenly can lead to creating "hot" partitions.  Hot partitions can result in rate-limiting and inefficient use of your provisioned throughput.

Unlike logical partitions, resource partitions are an internal implementation detail of the system. You can't control their size, placement, and the number or can you control how the logical partitions are mapped onto the resource partitions. You can control the number of logical partitions and the distribution of data and throughput by choosing a partition key.

## Next steps
In this article, we provided an overview of concepts and best practices for scaling and partitioning in Azure Cosmos DB. 

* Learn about [provisioned throughput in Azure Cosmos DB](request-units.md)
* Learn about [global distribution in Azure Cosmos DB](distribute-data-globally.md)
* Learn about [choosing a partition-key](TBD)
* Learn [how to configure provisioned throughput on a Cosmos container](TBD)
* Learn [how to configure provisioned throughput on a Cosmos database](TBD)
* Learn [how to find out the consumed RUs for a database operation](TBD)
* Learn [how to estimate the provisioned-throughput capacity](TBD)
