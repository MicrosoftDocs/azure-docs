---
title: Working with Azure Cosmos DB databases, containers and items 
description: This article describes how to create and use Azure Cosmos DB databases, containers and items
author: dharmas-cosmos
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/08/2018
ms.author: dharmas
ms.reviewer: sngun

---

# Working with Azure Cosmos databases, containers and items

After you create an [Azure Cosmos DB account](account-overview.md) under your Azure subscription, you can manage data in your account by creating databases, containers, and items. This article describes each of these entities: databases, containers, and items. The following image shows the hierarchy of different entities in an Azure Cosmos account:

![Azure Cosmos account entities](./media/databases-containers-items/cosmos-entities.png)

## Azure Cosmos databases

You can create one or more Azure Cosmos databases under your account. A database is analogous to a namespace, it is the unit of management for a set of Azure Cosmos containers. The following table shows how an Azure Cosmos database is mapped to various API-specific entities:

| **Azure Cosmos entity** | **SQL API** | **Cassandra API** | **Azure Cosmos DB's API for MongoDB** | **Gremlin API** | **Table API** |
| --- | --- | --- | --- | --- | --- |
|Azure Cosmos database | Database | Keyspace | Database | Database | NA |

> [!NOTE]
> With Table APIs accounts, when you create your first table a default database is automatically created within your Azure Cosmos account.

### Operations on an Azure Cosmos database

You can interact with an Azure Cosmos database using the following Azure Cosmos APIs:

| **Operation** | **Azure CLI**|**SQL API** | **Cassandra API** | **Azure Cosmos DB's API for MongoDB** | **Gremlin API** | **Table API** |
| --- | --- | --- | --- | --- | --- | --- |
|Enumerate all databases| Yes | Yes | Yes (database is mapped to a keyspace) | Yes | NA | NA |
|Read database| Yes | Yes | Yes (database is mapped to a keyspace) | Yes | NA | NA |
|Create new database| Yes | Yes | Yes (database is mapped to a keyspace) | Yes | NA | NA |
|Update database| Yes | Yes | Yes (database is mapped to a keyspace) | Yes | NA | NA |


## Azure Cosmos containers

An Azure Cosmos container is the unit of scalability for both provisioned throughput and storage of items. A container is horizontally partitioned and then replicated across multiple regions. The items that you add to the container and the throughput that you provision on it are automatically distributed across a set of logical partitions based on the partition key. To learn more about partitioning and partition key, see [logical partitions](partition-data.md) article. 

When creating an Azure Cosmos container, you configure throughput in one of the following modes:

* **Dedicated provisioned throughput** mode: Throughput provisioned on a container is exclusively reserved for it and it is backed by the SLAs. To learn more, see [how to provision throughput on an Azure Cosmos container](how-to-provision-container-throughput.md).

* **Shared provisioned throughput** mode: These containers share the provisioned throughput with other containers in the same database (excluding those containers that have been configured with dedicated provisioned throughput). In other words, the provisioned throughput on the database is shared among all the “shared” containers. To learn more, see [how to configure provisioned throughput on an Azure Cosmos database](how-to-provision-database-throughput.md).

An Azure Cosmos container can scale elastically, whether you create containers with either “shared” or “dedicated” provisioned throughput modes.

An Azure Cosmos container is a schema-agnostic container of items. Items within a container can have arbitrary schemas. For example, an item representing a person, an item representing an automobile can be placed in the same container. By default, all items that you add to a container get automatically indexed without requiring any explicit index or schema management. You can customize the indexing behavior by configuring the indexing policy on a container. 

You can set Time To Live (TTL) on selected items within an Azure Cosmos container or for the entire container to gracefully purge those items out of the system. Azure Cosmos DB will automatically delete the items when they expire. It also guarantees that a query performed on the container does not return the expired items within a fixed bound. To learn more, see [How to configure TTL on your container](how-to-time-to-live.md).

By using change feed, you can subscribe to the operations log that is managed for each of the logical partition of your container. The Change Feed provides the log of all the updates performed on the container along with the before and the after images of the items. See [How to build reactive applications using change feed](change-feed.md). You can also configure the retention duration for change feed by using the change feed policy on the container. 

You can register stored procedures, triggers, user-defined functions (UDFs) and merge procedures with your Azure Cosmos container. 

You can specify a unique key on your Azure Cosmos container. By creating a unique key policy, you ensure the uniqueness of one or more values per logical partition key. Once a container has been created with a unique key policy, it prevents the creation of any new or updated items with values that duplicate the values specified by the unique key constraint. To learn more, see [Unique key constraints](unique-keys.md).

An Azure Cosmos container is specialized into API-specific entities as follows:

| **Azure Cosmos entity** | **SQL API** | **Cassandra API** | **Azure Cosmos DB's API for MongoDB** | **Gremlin API** | **Table API** |
| --- | --- | --- | --- | --- | --- |
|Azure Cosmos container | Collection | Table | Collection | Graph | Table |

### Properties of an Azure Cosmos container

An Azure Cosmos container has a set of system defined properties. Depending on the choice of API, some of them may not be directly exposed. The following table describes the list of supported system defined properties:

| **System defined property** | **System generated or user-settable** | **Purpose** | **SQL API** | **Cassandra API** | **Azure Cosmos DB's API for MongoDB** | **Gremlin API** | **Table API** |
| --- | --- | --- | --- | --- | --- | --- | --- |
|_rid | System generated | Unique identifier of container | Yes | No | No | No | No |
|_etag | System generated | Entity tag used for optimistic concurrency control | Yes | No | No | No | No |
|_ts | System generated | Last updated timestamp of the container | Yes | No | No | No | No |
|_self | System generated | Addressable URI of the container | Yes | No | No | No | No |
|id | User configurable | User-defined unique name of the container | Yes | Yes | Yes | Yes | Yes |
|indexingPolicy | User configurable | Provides the ability to change the index path, their precision, and the consistency model. | Yes | No | No | No | Yes |
|TimeToLive | User configurable | Provides the ability to delete items automatically from a container after a certain time period. For more details, see the [Time To Live](time-to-live.md) article. | Yes | No | No | No | Yes |
|changeFeedPolicy | User configurable | Used to read changes made to items in a container. For more details, see the [change feed](change-feed.md) article. | Yes | No | No | No | Yes |
|uniqueKeyPolicy | User configurable | With unique keys, you ensure the uniqueness of one or more values within a logical partition. For more information, see the [unique keys](unique-keys.md) article. | Yes | No | No | No | Yes |

### Operations on an Azure Cosmos container

An Azure Cosmos container supports the following operations using any of the Azure Cosmos APIs.

| **Operation** | **Azure CLI** | **SQL API** | **Cassandra API** | **Azure Cosmos DB's API for MongoDB** | **Gremlin API** | **Table API** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Enumerate containers in a database | Yes* | Yes | Yes | Yes | NA | NA |
| Read a container | Yes | Yes | Yes | Yes | NA | NA |
| Create new container | Yes | Yes | Yes | Yes | NA | NA |
| Update container | Yes | Yes | Yes | Yes | NA | NA |
| Delete container | Yes | Yes | Yes | Yes | NA | NA |

## Azure Cosmos items

Depending on the choice of the API, an Azure Cosmos item can represent either a document in a collection, a row in a table or a node/edge in a graph. The following table shows the mapping between API-specific entities to an Azure Cosmos item:

| **Cosmos entity** | **SQL API** | **Cassandra API** | **Azure Cosmos DB's API for MongoDB** | **Gremlin API** | **Table API** |
| --- | --- | --- | --- | --- | --- |
|Azure Cosmos item | Document | Row | Document | Node or Edge | Item |

### Properties of an item

Every Azure Cosmos item has the following system defined properties. Depending on the choice of API, some of them may not be directly exposed.

|**System defined property** | **System generated or user-settable**| **Purpose** | **SQL API** | **Cassandra API** | **Azure Cosmos DB's API for MongoDB** | **Gremlin API** | **Table API** |
| --- | --- | --- | --- | --- | --- | --- | --- |
|_id | System generated | Unique identifier of item | Yes | No | No | No | No |
|_etag | System generated | Entity tag used for optimistic concurrency control | Yes | No | No | No | No |
|_ts | System generated | Last updated timestamp of the item | Yes | No | No | No | No |
|_self | System generated | Addressable URI of the item | Yes | No | No | No | No |
|id | Either | User-defined unique name within a logical partition. If the user doesn’t specify the id, the system will automatically generate one. | Yes | Yes | Yes | Yes | Yes |
|Arbitrary user-defined properties | User-defined | User-defined properties represented in API-native representation (JSON, BSON, CQL, etc.) | Yes | Yes | Yes | Yes | Yes |

### Operations on items

Azure Cosmos item supports the following operations that can be performed using any of the Azure Cosmos APIs.

| **Operation** | **Azure CLI** | **SQL API** | **Cassandra API** | **Azure Cosmos DB's API for MongoDB** | **Gremlin API** | **Table API** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Insert, Replace, Delete, Upsert, Read | No | Yes | Yes | Yes | Yes | Yes |

## Next steps

You can now proceed to learn how to provision throughput on Azure Cosmos account or see other concepts:

* [How to configure provisioned throughput on a Azure Cosmos database](how-to-provision-database-throughput.md)
* [How to configure provisioned throughput on a Azure Cosmos container](how-to-provision-container-throughput.md)
* [Logical partitions](partition-data.md)
* [How to configure TTL on Azure Cosmos container](how-to-time-to-live.md)
* [How to build reactive applications using Change Feed](change-feed.md)
* [How to configure unique key constraint on your Azure Cosmos container](unique-keys.md)
