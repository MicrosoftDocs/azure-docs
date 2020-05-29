---
title: Work with databases, containers, and items in Azure Cosmos DB 
description: This article describes how to create and use databases, containers, and items in Azure Cosmos DB.
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/24/2020
ms.reviewer: sngun

---

# Work with databases, containers, and items in Azure Cosmos DB

After you create an [Azure Cosmos DB account](account-overview.md) under your Azure subscription, you can manage data in your account by creating databases, containers, and items. This article describes each of these entities. 

The following image shows the hierarchy of different entities in an Azure Cosmos DB account:

![Azure Cosmos account entities](./media/databases-containers-items/cosmos-entities.png)

## Azure Cosmos databases

You can create one or multiple Azure Cosmos databases under your account. A database is analogous to a namespace. A database is the unit of management for a set of Azure Cosmos containers. The following table shows how an Azure Cosmos database is mapped to various API-specific entities:

| Azure Cosmos entity | SQL API | Cassandra API | Azure Cosmos DB API for MongoDB | Gremlin API | Table API |
| --- | --- | --- | --- | --- | --- |
|Azure Cosmos database | Database | Keyspace | Database | Database | NA |

> [!NOTE]
> With Table API accounts, when you create your first table, a default database is automatically created in your Azure Cosmos account.

### Operations on an Azure Cosmos database

You can interact with an Azure Cosmos database with Azure Cosmos APIs as described in the following table:

| Operation | Azure CLI | SQL API | Cassandra API | Azure Cosmos DB API for MongoDB | Gremlin API | Table API |
| --- | --- | --- | --- | --- | --- | --- |
|Enumerate all databases| Yes | Yes | Yes (database is mapped to a keyspace) | Yes | NA | NA |
|Read database| Yes | Yes | Yes (database is mapped to a keyspace) | Yes | NA | NA |
|Create new database| Yes | Yes | Yes (database is mapped to a keyspace) | Yes | NA | NA |
|Update database| Yes | Yes | Yes (database is mapped to a keyspace) | Yes | NA | NA |


## Azure Cosmos containers

An Azure Cosmos container is the unit of scalability both for provisioned throughput and storage. A container is horizontally partitioned and then replicated across multiple regions. The items that you add to the container and the throughput that you provision on it are automatically distributed across a set of logical partitions based on the partition key. To learn more about partitioning and partition keys, see [Partition data](partition-data.md). 

When you create an Azure Cosmos container, you configure throughput in one of the following modes:

* **Dedicated provisioned throughput mode**: The throughput provisioned on a container is exclusively reserved for that container and it is backed by the SLAs. To learn more, see [How to provision throughput on an Azure Cosmos container](how-to-provision-container-throughput.md).

* **Shared provisioned throughput mode**: These containers share the provisioned throughput with the other containers in the same database (excluding containers that have been configured with dedicated provisioned throughput). In other words, the provisioned throughput on the database is shared among all the “shared throughput” containers. To learn more, see [How to provision throughput on an Azure Cosmos database](how-to-provision-database-throughput.md).

> [!NOTE]
> You can configure shared and dedicated throughput only when creating the database and container. To switch from dedicated throughput mode to shared throughput mode (and vice versa) after the container is created, you have to create a new container and migrate the data to the new container. You can migrate the data by using the Azure Cosmos DB change feed feature.

An Azure Cosmos container can scale elastically, whether you create containers by using dedicated or shared provisioned throughput modes.

An Azure Cosmos container is a schema-agnostic container of items. Items in a container can have arbitrary schemas. For example, an item that represents a person and an item that represents an automobile can be placed in the *same container*. By default, all items that you add to a container are automatically indexed without requiring explicit index or schema management. You can customize the indexing behavior by configuring the [indexing policy](index-overview.md) on a container. 

You can set [Time to Live (TTL)](time-to-live.md) on selected items in an Azure Cosmos container or for the entire container to gracefully purge those items from the system. Azure Cosmos DB automatically deletes the items when they expire. It also guarantees that a query performed on the container doesn't return the expired items within a fixed bound. To learn more, see [Configure TTL on your container](how-to-time-to-live.md).

You can use [change feed](change-feed.md) to subscribe to the operations log that is managed for each logical partition of your container. Change feed provides the log of all the updates performed on the container, along with the before and after images of the items. For more information, see [Build reactive applications by using change feed](serverless-computing-database.md). You can also configure the retention duration for the change feed by using the change feed policy on the container.

You can register [stored procedures, triggers, user-defined functions (UDFs)](stored-procedures-triggers-udfs.md), and [merge procedures](how-to-manage-conflicts.md) for your Azure Cosmos container.

You can specify a [unique key constraint](unique-keys.md) on your Azure Cosmos container. By creating a unique key policy, you ensure the uniqueness of one or more values per logical partition key. If you create a container by using a unique key policy, no new or updated items with values that duplicate the values specified by the unique key constraint can be created. To learn more, see [Unique key constraints](unique-keys.md).

An Azure Cosmos container is specialized into API-specific entities as shown in the following table:

| Azure Cosmos entity | SQL API | Cassandra API | Azure Cosmos DB API for MongoDB | Gremlin API | Table API |
| --- | --- | --- | --- | --- | --- |
|Azure Cosmos container | Container | Table | Collection | Graph | Table |

> [!NOTE]
> When creating containers, make sure you don’t create two containers with the same name but different casing. That’s because some parts of the Azure platform are not case-sensitive, and this can result in confusion/collision of telemetry and actions on containers with such names.

### Properties of an Azure Cosmos container

An Azure Cosmos container has a set of system-defined properties. Depending on which API you use, some properties might not be directly exposed. The following table describes the list of system-defined properties:

| System-defined property | System-generated or user-configurable | Purpose | SQL API | Cassandra API | Azure Cosmos DB API for MongoDB | Gremlin API | Table API |
| --- | --- | --- | --- | --- | --- | --- | --- |
|\_rid | System-generated | Unique identifier of container | Yes | No | No | No | No |
|\_etag | System-generated | Entity tag used for optimistic concurrency control | Yes | No | No | No | No |
|\_ts | System-generated | Last updated timestamp of the container | Yes | No | No | No | No |
|\_self | System-generated | Addressable URI of the container | Yes | No | No | No | No |
|id | User-configurable | User-defined unique name of the container | Yes | Yes | Yes | Yes | Yes |
|indexingPolicy | User-configurable | Provides the ability to change the index path, index type, and index mode | Yes | No | No | No | Yes |
|TimeToLive | User-configurable | Provides the ability to delete items automatically from a container after a set time period. For details, see [Time to Live](time-to-live.md). | Yes | No | No | No | Yes |
|changeFeedPolicy | User-configurable | Used to read changes made to items in a container. For details, see [Change feed](change-feed.md). | Yes | No | No | No | Yes |
|uniqueKeyPolicy | User-configurable | Used to ensure the uniqueness of one or more values in a logical partition. For more information, see [Unique key constraints](unique-keys.md). | Yes | No | No | No | Yes |

### Operations on an Azure Cosmos container

An Azure Cosmos container supports the following operations when you use any of the Azure Cosmos APIs:

| Operation | Azure CLI | SQL API | Cassandra API | Azure Cosmos DB API for MongoDB | Gremlin API | Table API |
| --- | --- | --- | --- | --- | --- | --- |
| Enumerate containers in a database | Yes | Yes | Yes | Yes | NA | NA |
| Read a container | Yes | Yes | Yes | Yes | NA | NA |
| Create a new container | Yes | Yes | Yes | Yes | NA | NA |
| Update a container | Yes | Yes | Yes | Yes | NA | NA |
| Delete a container | Yes | Yes | Yes | Yes | NA | NA |

## Azure Cosmos items

Depending on which API you use, an Azure Cosmos item can represent either a document in a collection, a row in a table, or a node or edge in a graph. The following table shows the mapping of API-specific entities to an Azure Cosmos item:

| Cosmos entity | SQL API | Cassandra API | Azure Cosmos DB API for MongoDB | Gremlin API | Table API |
| --- | --- | --- | --- | --- | --- |
|Azure Cosmos item | Document | Row | Document | Node or edge | Item |

### Properties of an item

Every Azure Cosmos item has the following system-defined properties. Depending on which API you use, some of them might not be directly exposed.

| System-defined property | System-generated or user-configurable| Purpose | SQL API | Cassandra API | Azure Cosmos DB API for MongoDB | Gremlin API | Table API |
| --- | --- | --- | --- | --- | --- | --- | --- |
|\_rid | System-generated | Unique identifier of the item | Yes | No | No | No | No |
|\_etag | System-generated | Entity tag used for optimistic concurrency control | Yes | No | No | No | No |
|\_ts | System-generated | Timestamp of the last update of the item | Yes | No | No | No | No |
|\_self | System-generated | Addressable URI of the item | Yes | No | No | No | No |
|id | Either | User-defined unique name in a logical partition. | Yes | Yes | Yes | Yes | Yes |
|Arbitrary user-defined properties | User-defined | User-defined properties represented in API-native representation (including JSON, BSON, and CQL) | Yes | Yes | Yes | Yes | Yes |

> [!NOTE]
> Uniqueness of the `id` property is only enforced within each logical partition. Multiple documents can have the same `id` property with different partition key values.

### Operations on items

Azure Cosmos items support the following operations. You can use any of the Azure Cosmos APIs to perform the operations.

| Operation | Azure CLI | SQL API | Cassandra API | Azure Cosmos DB API for MongoDB | Gremlin API | Table API |
| --- | --- | --- | --- | --- | --- | --- |
| Insert, Replace, Delete, Upsert, Read | No | Yes | Yes | Yes | Yes | Yes |

## Next steps

Learn about these tasks and concepts:

* [Provision throughput on an Azure Cosmos database](how-to-provision-database-throughput.md)
* [Provision throughput on an Azure Cosmos container](how-to-provision-container-throughput.md)
* [Work with logical partitions](partition-data.md)
* [Configure TTL on an Azure Cosmos container](how-to-time-to-live.md)
* [Build reactive applications by using change feed](change-feed.md)
* [Configure a unique key constraint on your Azure Cosmos container](unique-keys.md)
