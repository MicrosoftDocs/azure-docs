---
title: Azure Cosmos DB resource model
description: This article describes Azure Cosmos DB resource model which includes the Azure Cosmos account, database, container, and the items. It also covers the hierarchy of these elements in an Azure Cosmos account. 
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/12/2021
ms.reviewer: sngun

---

# Azure Cosmos DB resource model
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Azure Cosmos DB is a fully managed platform-as-a-service (PaaS). To begin using Azure Cosmos DB, you should initially create an Azure Cosmos account in your Azure resource group in the required subscription, and then databases, containers, items under it. This article describes the Azure Cosmos DB resource model and different entities in the resource model hierarchy.

The Azure Cosmos account is the fundamental unit of global distribution and high availability. Your Azure Cosmos account contains a unique DNS name and you can manage an account by using the Azure portal or the Azure CLI, or by using different language-specific SDKs. For more information, see [how to manage your Azure Cosmos account](how-to-manage-database-account.md). For globally distributing your data and throughput across multiple Azure regions, you can add and remove Azure regions to your account at any time. You can configure your account to have either a single region or multiple write regions. For more information, see [how to add and remove Azure regions to your account](how-to-manage-database-account.md). You can configure the [default consistency](consistency-levels.md) level on an account.

## Elements in an Azure Cosmos account

An Azure Cosmos container is the fundamental unit of scalability. You can virtually have an unlimited provisioned throughput (RU/s) and storage on a container. Azure Cosmos DB transparently partitions your container using the logical partition key that you specify in order to elastically scale your provisioned throughput and storage.

Currently, you can create a maximum of 50 Azure Cosmos accounts under an Azure subscription (this is a soft limit that can be increased via support request). A single Azure Cosmos account can virtually manage an unlimited amount of data and provisioned throughput. To manage your data and provisioned throughput, you can create one or more Azure Cosmos databases under your account and within that database, you can create one or more containers. The following image shows the hierarchy of elements in an Azure Cosmos account:

:::image type="content" source="./media/account-databases-containers-items/hierarchy.png" alt-text="Hierarchy of an Azure Cosmos account" border="false":::

After you create an account under your Azure subscription, you can manage the data in your account by creating databases, containers, and items. 

The following image shows the hierarchy of different entities in an Azure Cosmos DB account:

:::image type="content" source="./media/account-databases-containers-items/cosmos-entities.png" alt-text="Azure Cosmos account entities" border="false":::

## Azure Cosmos databases

You can create one or multiple Azure Cosmos databases under your account. A database is analogous to a namespace. A database is the unit of management for a set of Azure Cosmos containers. The following table shows how a database is mapped to various API-specific entities:

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

An Azure Cosmos container is the unit of scalability both for provisioned throughput and storage. A container is horizontally partitioned and then replicated across multiple regions. The items that you add to the container are automatically grouped into logical partitions, which are distributed across physical partitions, based on the partition key. The throughput on a container is evenly distributed across the physical partitions. To learn more about partitioning and partition keys, see [Partition data](partitioning-overview.md). 

When you create a container, you configure throughput in one of the following modes:

* **Dedicated provisioned throughput mode**: The throughput provisioned on a container is exclusively reserved for that container and it is backed by the SLAs. To learn more, see [How to provision throughput on a container](how-to-provision-container-throughput.md).

* **Shared provisioned throughput mode**: These containers share the provisioned throughput with the other containers in the same database (excluding containers that have been configured with dedicated provisioned throughput). In other words, the provisioned throughput on the database is shared among all the “shared throughput” containers. To learn more, see [How to provision throughput on a database](how-to-provision-database-throughput.md).

> [!NOTE]
> You can configure shared and dedicated throughput only when creating the database and container. To switch from dedicated throughput mode to shared throughput mode (and vice versa) after the container is created, you have to create a new container and migrate the data to the new container. You can migrate the data by using the Azure Cosmos DB change feed feature.

An Azure Cosmos container can scale elastically, whether you create containers by using dedicated or shared provisioned throughput modes.

A container is a schema-agnostic container of items. Items in a container can have arbitrary schemas. For example, an item that represents a person and an item that represents an automobile can be placed in the *same container*. By default, all items that you add to a container are automatically indexed without requiring explicit index or schema management. You can customize the indexing behavior by configuring the [indexing policy](index-overview.md) on a container. 

You can set [Time to Live (TTL)](time-to-live.md) on selected items in a container or for the entire container to gracefully purge those items from the system. Azure Cosmos DB automatically deletes the items when they expire. It also guarantees that a query performed on the container doesn't return the expired items within a fixed bound. To learn more, see [Configure TTL on your container](how-to-time-to-live.md).

You can use [change feed](change-feed.md) to subscribe to the operations log that is managed for each logical partition of your container. Change feed provides the log of all the updates performed on the container, along with the before and after images of the items. For more information, see [Build reactive applications by using change feed](serverless-computing-database.md). You can also configure the retention duration for the change feed by using the change feed policy on the container.

You can register [stored procedures, triggers, user-defined functions (UDFs)](stored-procedures-triggers-udfs.md), and [merge procedures](how-to-manage-conflicts.md) for your container.

You can specify a [unique key constraint](unique-keys.md) on your Azure Cosmos container. By creating a unique key policy, you ensure the uniqueness of one or more values per logical partition key. If you create a container by using a unique key policy, no new or updated items with values that duplicate the values specified by the unique key constraint can be created. To learn more, see [Unique key constraints](unique-keys.md).

A container is specialized into API-specific entities as shown in the following table:

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
|Azure Cosmos item | Item | Row | Document | Node or edge | Item |

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

Learn how to manage your Azure Cosmos account and other concepts:

* To learn more, see the [Azure Cosmos DB SQL API](/learn/modules/intro-to-azure-cosmos-db-core-api/) learn module.
* [How-to manage your Azure Cosmos account](how-to-manage-database-account.md)
* [Global distribution](distribute-data-globally.md)
* [Consistency levels](consistency-levels.md)
* [VNET service endpoint for your Azure Cosmos account](how-to-configure-vnet-service-endpoint.md)
* [IP-firewall for your Azure Cosmos account](how-to-configure-firewall.md)
* [How-to add and remove Azure regions to your Azure Cosmos account](how-to-manage-database-account.md)
* [Azure Cosmos DB SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_2/)
