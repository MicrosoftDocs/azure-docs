---
title: Databases, containers, and items
titleSuffix: Azure Cosmos DB
description: Learn about the hierarchy of an account's elements in an Azure Cosmos DB resource model.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/27/2023
---

# Databases, containers, and items in Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Cosmos DB is a fully managed platform as a service (PaaS). To begin using Azure Cosmos DB, create an Azure Cosmos DB account in an Azure resource group in your subscription. Then, create databases and containers within the account.

Your Azure Cosmos DB account contains a unique Domain Name System (DNS) name. You can manage the DNS name by using many tools, including:

- Azure portal
- Azure Resource Manager templates
- Bicep templates
- Azure PowerShell
- Azure CLI
- Azure Management SDKs
- Azure REST API

For replicating your data and throughput across multiple Azure regions, you can add and remove Azure regions to your account at any time. You can configure your account to have either a single region or multiple write regions. For more information, see [Manage an Azure Cosmos DB account by using the Azure portal](how-to-manage-database-account.yml). You can also configure the [default consistency level](consistency-levels.md) on an account.

## Elements in an Azure Cosmos DB account

Currently, you can create a maximum of 50 Azure Cosmos DB accounts under an Azure subscription. You can increase this limit by making a support request.

You can manage a virtually unlimited amount of data and provisioned throughput by using a single Azure Cosmos DB account. To manage your data and provisioned throughput, you create one or more databases within your account and then create one or more containers to store your data.

The following image shows the hierarchy of elements in an Azure Cosmos DB account.

:::image type="content" source="./media/account-databases-containers-items/hierarchy.png" alt-text="Diagram of the hierarchy of an Azure Cosmos DB account, including an account, database, and container." :::

The following image shows the hierarchy of entities in an Azure Cosmos DB account.

:::image type="content" source="./media/account-databases-containers-items/cosmos-entities.png" alt-text="Diagram of the relationship between a container and items, including sibling entities such as stored procedures, user-defined functions, and triggers." :::

## Azure Cosmos DB databases

In Azure Cosmos DB, a database is similar to a namespace. A database is simply a group of containers. The following table shows how a database is mapped to various API-specific entities:

| Azure Cosmos DB entity | API for NoSQL | API for Apache Cassandra | API for MongoDB | API for Apache Gremlin | API for Table |
| --- | --- | --- | --- | --- | --- |
|Azure Cosmos DB database | Database | Keyspace | Database | Database | Not applicable |

> [!NOTE]
> With API for Table accounts, tables in Azure Cosmos DB are created at the account level to maintain compatibility with Azure Table Storage.

## Azure Cosmos DB containers

An Azure Cosmos DB container is where data is stored. Unlike most relational databases, which scale up with larger sizes of virtual machines, Azure Cosmos DB scales out.

Data is stored on one or more servers called *partitions*. To increase partitions, you increase throughput, or they grow automatically as storage increases. This relationship provides a virtually unlimited amount of throughput and storage for a container.

When you create a container, you need to supply a partition key. The partition key is a property that you select from your items to help Azure Cosmos DB distribute the data efficiently across partitions. Azure Cosmos DB uses the value of this property to route data to the appropriate partition to be written, updated, or deleted. You can also use the partition key in the `WHERE` clause in queries for efficient data retrieval.

The underlying storage mechanism for data in Azure Cosmos DB is called a *physical partition*. Physical partitions can have a throughput amount up to 10,000 Request Units per second, and they can store up to 50 GB of data. Azure Cosmos DB abstracts this partitioning concept with a logical partition, which can store up to 20 GB of data.

Logical partitions allow the service to provide greater elasticity and better management of data on the underlying physical partitions as you add more partitions. To learn more about partitioning and partition keys, see [Partitioning and horizontal scaling in Azure Cosmos DB](partitioning-overview.md).

When you create a container, you configure throughput in one of the following modes:

- **Dedicated throughput**: The throughput on a container is exclusively reserved for that container. There are two types of dedicated throughput: standard and autoscale. To learn more, see [Provision standard (manual) throughput on an Azure Cosmos DB container](how-to-provision-container-throughput.md).
- **Shared throughput**: Throughput is specified at the database level and then shared with up to 25 containers within the database. Sharing of throughput excludes containers that are configured with their own dedicated throughput.

  Shared throughput can be a good option when all of the containers in the database have similar requests and storage needs, or when you don't need predictable performance on the data. To learn more, see [Provision standard (manual) throughput on a database in Azure Cosmos DB](how-to-provision-database-throughput.md).

> [!NOTE]
> You can't switch between dedicated and shared throughput. Containers that you created in a shared throughput database can't be updated to have dedicated throughput. To change a container from shared to dedicated throughput, you must create a new container and copy data to it. The [container copy](/azure/cosmos-db/container-copy) feature in Azure Cosmos DB can make this process easier.

Containers are schema agnostic. Items within a container can have arbitrary schemas or different entities, as long as they share the same partition key. For example, a container can contain an item or document that has customer profile information, along with one or more items or documents that represent all of the customer's sales orders. You can put similar information for all customers in the *same container*.

By default, all data that you add to a container is automatically indexed without requiring explicit indexing. You can customize the indexing for a container by configuring its [indexing policy](index-overview.md).

To avoid affecting performance, you can set a [time to live (TTL)](time-to-live.md) on selected items in a container or on the entire container to delete those items automatically in the background with unused throughput. However, even if expired data isn't deleted, it doesn't appear in any read operations. To learn more, see [Configure time to live in Azure Cosmos DB](how-to-time-to-live.md).

Azure Cosmos DB provides a built-in capability for change data capture called [change feed](change-feed.md). You can use it to subscribe to all the changes to data within your container.

You can register [stored procedures, triggers, user-defined functions (UDFs)](stored-procedures-triggers-udfs.md), and [merge procedures](how-to-manage-conflicts.md) for your container.

Each document within a container must have an `id` property that's unique within a logical key's property value for that container. You can use this combination of properties to provide a unique constraint within a container, without having to explicitly define one.

You can also specify a [unique key constraint](unique-keys.md) on your Azure Cosmos DB container that uses one or more properties. A unique key constraint ensures the uniqueness of one or more values per logical partition key. If you create a container by using a unique key policy, you can't create any new or updated items with values that duplicate the values that the unique key constraint specifies.

A container is specialized into API-specific entities, as shown in the following table:

| Azure Cosmos DB entity | API for NoSQL | API for Cassandra | API for MongoDB | API for Gremlin | API for Table |
| --- | --- | --- | --- | --- | --- |
|Azure Cosmos DB container | Container | Table | Collection | Graph | Table |

> [!NOTE]
> Make sure that you don't create two containers that have the same name but different casing. Some parts of the Azure platform are not case-sensitive, and this kind of naming can result in confusion or collision of diagnostic data and actions on containers.

### Properties of an Azure Cosmos DB container

An Azure Cosmos DB container has a set of system-defined properties. Depending on which API you use, some properties might not be directly exposed. The following table describes the system-defined properties:

| System-defined property | System generated or user configurable | Purpose | API for NoSQL | API for Cassandra | API for MongoDB | API for Gremlin | API for Table |
| --- | --- | --- | --- | --- | --- | --- | --- |
|`_rid` | System generated | Unique identifier of a container. | Yes | No | No | No | No |
|`_etag` | System generated | Entity tag used for optimistic concurrency control. | Yes | No | No | No | No |
|`_ts` | System generated | Last updated time stamp of the container. | Yes | No | No | No | No |
|`_self` | System generated | Addressable URI of the container. | Yes | No | No | No | No |
|`id` | User configurable | Name of the container. | Yes | Yes | Yes | Yes | Yes |
|`indexingPolicy` | User configurable | Policy for building the index for the container. | Yes | No | Yes | Yes | Yes |
|`TimeToLive` | User configurable | Automatic deletion of an item from a container after a set time period. For details, see [Time to live](time-to-live.md). | Yes | No | No | No | Yes |
|`changeFeedPolicy` | User configurable | Policy for reading changes made to items in a container. For details, see [Change feed](change-feed.md). | Yes | No | No | No | Yes |
|`uniqueKeyPolicy` | User configurable | Policy for ensuring the uniqueness of one or more values in a logical partition. For more information, see [Unique key constraints](unique-keys.md). | Yes | No | No | No | Yes |
|`AnalyticalTimeToLive` | User configurable | Automatic deletion of an item from a container after a set time period, in the context of an analytical store. For details, see [Analytical store](analytical-store-introduction.md). | Yes | No | Yes | No | No |

## Azure Cosmos DB items

Depending on which API you use, individual data entities can be represented in various ways:

| Azure Cosmos DB entity | API for NoSQL | API for Cassandra | API for MongoDB | API for Gremlin | API for Table |
| --- | --- | --- | --- | --- | --- |
| Azure Cosmos DB item | Item | Row | Document | Node or edge | Item |

### Properties of an item

Every Azure Cosmos DB item has the following system-defined properties. Depending on which API you use, some of them might not be directly exposed.

| System-defined property | System generated or user defined | Purpose | API for NoSQL | API for Cassandra | DB API for MongoDB | API for Gremlin | API for Table |
| --- | --- | --- | --- | --- | --- | --- | --- |
|`_rid` | System generated | Unique identifier of the item | Yes | No | No | No | No |
|`_etag` | System generated | Entity tag used for optimistic concurrency control | Yes | No | No | No | No |
|`_ts` | System generated | Time stamp of the last update of the item | Yes | No | No | No | No |
|`_self` | System generated | Addressable URI of the item | Yes | No | No | No | No |
|`id` | Either | User-defined unique name in a logical partition | Yes | Yes | Yes | Yes | Yes |
|Arbitrary user-defined properties | User defined | User-defined properties in API-native representation (including JSON, BSON, and CQL) | Yes | Yes | Yes | Yes | Yes |

> [!NOTE]
> Uniqueness of the `id` property is enforced within each logical partition. Multiple documents can have the same `id` property value with different partition key values.

### Operations on items

Azure Cosmos DB items support the following operations. You can use any of the Azure Cosmos DB APIs to perform the operations.

| Operation | API for NoSQL | API for Cassandra | API for MongoDB | API for Gremlin | API for Table |
| --- | --- | --- | --- | --- | --- |
| Insert, replace, delete, upsert, read | Yes | Yes | Yes | Yes | Yes |

## Next steps

Learn about how to manage your Azure Cosmos DB account and other concepts:

- [Manage an Azure Cosmos DB account by using the Azure portal](how-to-manage-database-account.yml)
- [Distribute your data globally with Azure Cosmos DB](distribute-data-globally.md)
- [Consistency levels in Azure Cosmos DB](consistency-levels.md)
