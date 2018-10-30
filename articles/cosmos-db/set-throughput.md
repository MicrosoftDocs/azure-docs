---
title: Provision throughput for Azure Cosmos DB | Microsoft Docs
description: Learn how to set provisioned throughput for your Azure Cosmos DB containers and databases.
services: cosmos-db
author: aliuy
manager: kfile

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: andrl

---

# Provisioning throughput for Cosmos DB containers and databases

Azure Cosmos DB allows you to configure throughput at two granularities: Cosmos containers and Cosmos databases.

A Cosmos database is a unit of management for a set of containers. A database consists of a set of schema-agnostic containers. A Cosmos container is the unit of scalability for both throughput and storage. A container is horizontally partitioned across a set of machines within an Azure region and is distributed across the Azure regions associated with your Cosmos account.

# Setting provisioned throughput on a Cosmos container  

The provisioned throughput configured explicitly on a Cosmos container is exclusively reserved for the given container. You are guaranteed to receive the provisioned throughput for that container at all times. The provisioned throughput on a container is financially backed by SLAs. See [how to configure provisioned throughput on a Cosmos container](TBD).

Setting provisioned throughput on a container is the most widely used option among Cosmos DB customers. With this option, you are guaranteed to receive the provisioned throughput for a given container at all times. While you can elastically scale throughput for a container by provisioning any amount of throughput (RUs) for that container, you cannot selectively specify the provisioned throughput for specific logical partition(s). Once the actual workload targeted at a logical partition consumes more than the throughput that was allocated to the specific logical partition, your operations will get rate-limited and you will need to either (a) increase the throughput for the entire container or (b) retry the operation. For more information, see [Logical Partitions](partition-data.md).

It is recommended that you configure throughput at a container granularity when you want guaranteed performance for the container.

Provisioned throughput configured on a Cosmos container is uniformly distributed across all of the logical partitions of the container. Since one or more logical partitions of such a container are hosted by a resource partition, the resource partitions belong exclusively to the container and support the throughput provisioned on the container.

![Resource partition](./media/partition-data/resource-partition.png)
**A resource partition hosts one or more logical partitions of a container**

# Setting provisioned throughput on a Cosmos database

When you provision throughput explicitly on a Cosmos database, it is shared across all of its containers, unless you’ve specified a provisioned throughput on specific containers. Sharing provisioned throughput of the database among its containers is analogous to hosting a database on a cluster of machines. Since all containers within a database share the resources available on a machine, you naturally do not expect (or get) predictable performance on any specific container. See [how to configure provisioned throughput on a Cosmos database](TBD).

While you are guaranteed to receive throughput provisioned on a database at all times, since all containers within such a database share the provisioned throughput amongst themselves, Cosmos DB does not provide any predictable throughput guarantees for any particular container in that database. The portion of the provisioned throughput on a database that a specific container can receive is dependent on the number of containers, the choice of partition keys for various containers and the distribution of the workload across various logical partitions of the containers that are sharing the provisioned throughput of the database.

It is recommended that you configure throughput on a database when you want to share the throughput across multiple containers, but do not want to dedicate the throughput to any particular container.

For example:

* Sharing a database’s provisioned throughput across a set of containers is useful for a multi-tenant application. Each user can be represented by a distinct Cosmos container.

* Sharing a database’s provisioned throughput across a set of containers is useful when you are migrating a NoSQL database (such as MongoDB, Cassandra) hosted on a cluster of VMs or on physical servers on-premises to Cosmos DB. You can think of the provisioned throughput configured on your Cosmos database as a logical equivalent (but more cost-effective and elastic) to that of the compute capacity of your MongoDB or Cassandra cluster.  

At any given point in time, whatever is the throughput allotted (by Cosmos DB) to a given container within a database, it is distributed across all the logical partitions of that container. When your containers are sharing provisioned throughput on a database, you can't selectively apply the provisioned throughput either to a specific container or to a logical partition. Once the actual workload targeted at a logical partition consumes more than the throughput that was allocated to that specific logical partition, your operations will get rate-limited and you will need to either (a) increase the throughput on the database or (b) retry the operation. For more information, see [Logical Partitions](partition-data.md).

Multiple logical partitions of containers sharing the provisioned throughput of a database could be hosted by a single resource partition. While a single logical partition of a container is always scoped within a resource partition, L logical partitions across C containers sharing the provisioned throughput of a database can be mapped and hosted on R resource partitions.

![Resource partition](./media/partition-data/resource-partition2.png)
**A resource partition may host one or more logical partitions belonging to potentially different containers within a database with shared provisioned throughput**

## Mixed configuration

Mixing the two models - provisioning throughput on both database and container - is allowed.

For example:

* You can have a Cosmos database Z with provisioned throughput of K RUs configured on it.
* You can have five containers A, B, C, D, and E in the database.
* You can explicitly configure provisioned throughput of P RUs on the B container.
* The provisioned throughput of K RUs will be shared across the four containers – A, C, D, and E. The exact amount of throughput available to A, C, D or E will vary and there are no SLAs for each individual container’s throughput, i.e., A, C, D, E.
* B will be guaranteed to get the provisioned throughput of P RUs at all times and is backed by SLAs.

## Comparison of models

   |**Quota**  |**Provisioned throughput on a database**  |**Provisioned throughput on a container**|
   |---------|---------|---------|
   |Unit of scalability|Container|Container|
|Minimum RUs |400 |400|
|Minimum RUs per container|100|400|
|Required minimum RUs per 1 GB of consumed storage|40|40|
|Maximum RUs|Unlimited, on the database|Unlimited, on the container|
|RUs assigned/available to a specific container|No guarantees. RUs assigned to a given container depend on the choice of partition keys across all the containers sharing the throughput, distribution of workload, number of containers, etc. |All the RUs configured on the container are exclusively reserved for the container.|
|Maximum storage for the container|Unlimited|Unlimited|
|Maximum throughput per logical partition of a container|10K RUs|10K RUs|
|Maximum storage (data + index) per logical partition of a container|10 GB|10 GB|

## Next steps

* Learn more about [Logical Partitions](partition-data.md)
* Learn [how to configure provisioned throughput on a Cosmos container](TBD)
* Learn [how to configure provisioned throughput on a Cosmos database](TBD)
* Learn [how to find out the consumed RUs for a database operation](TBD)
* Learn [how to estimate provisioned throughput capacity](TBD)
