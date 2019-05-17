---
title: Limits in Azure Cosmos DB
description: This article describes limits in Azure Cosmos DB.
author: arramac
ms.author: arramac
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/17/2019
---

# Limits in Azure Cosmos DB
Azure Cosmos DB is a globally distributed database service that's designed to provide low latency, elastic scalability of throughput, well-defined semantics for data consistency, and high availability. This article provides an overview of the limits in the Azure Cosmos DB service.

## Storage and throughput

After you create a Cosmos DB account under your Azure subscription, you can manage data in your account by [creating databases, containers, and items](databases-containers-items.md). You can provision throughput at a container-level or a database-level in terms of [request units (RUs)](request-units.md). The following table lists the limits for storage and throughput per container/database.

| Resource | Default limit |
| --- | --- |
| Max RU per container | 1000000 <sup>1</sup>|
| Max RU per shared database | 1000000 <sup>1</sup>|
| Max RU per (logical) partition key | 10000 |
| Max storage across all items per (logical) partition key| 10 GB |
| Max storage per container | Unlimited |
| Max storage per shared database | Unlimited |

> [!NOTE]
> You can increase throughput beyond 1M RU/s by [filing an Azure support ticket](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request).
>
> For best practices to manage workloads that have partition keys that need higher limits for storage or throughput, see [Designing for Hot Partition Keys](how-to-model-partition-example.md)
>

A Cosmos DB container (or share database) must have a minimum throughput of 400 RU/s. The minimum supported throughput depends on the following factors:

* The maximum storage consumed in the container, measured in increments of 40 RU per GB consumed. For example, if a container contains 100 GB of data, then the minimum supported throughput is 4000 RU/s
* The maximum throughput provisioned on the container. The service supports lowering throughput of a container to 10% of the provisioned maximum. For example, if your throughput increases to 10000 RU/s, then the throughput can be lowered to 1000 RU/s
* The maximum number of Azure Cosmos containers that you ever create in a database with shared throughput, measured at 100 RU/s per container. Within a shared database, if you create five containers, then the minimum throughput is 500 RU/s

The current and minimum throughput of a container or a database can be retrieved from the Azure portal or the SDKs. For more information, see [Provision throughput on containers and databases](set-throughput.md). In summary, here are the minimum provisioned RU limits. 

| Resource | Default limit |
| --- | --- |
| Min RU per container with dedicated throughput | 400 |
| Min RU per database with dedicated throughput | 400 |
| Min RU per container within a shared database | 100 |
| Min RU per GB consumed in Cosmos DB | 40 |

Cosmos DB supports elastic scaling of throughput (RUs) per container or database via the SDKs or portal. Each container supports a range of throughput scaling that's synchronous/immediate, typically between 10-100x. If the requested throughput value is outside the range, scaling is performed asynchronously. Asynchronous scaling may take minutes to hours to complete depending on the requested throughput and data storage size in the container.  

## Management operations
You can [provision and manage your Azure Cosmos account](how-to-manage-database-account.md) using the Azure portal, Azure PowerShell, Azure CLI, and Azure Resource Manager templates. The following table lists the limits per subscription, account, and number of operations.

| Resource | Default limit |
| --- | --- |
| Max database accounts per subscription |50 <sup>1</sup>|
| Max regions per database account |30 <sup>1</sup>|
| Max number of regional failovers |1/hour <sup>1</sup>|

> [!NOTE]
> Regional failovers only apply to single-master accounts. Multi-master accounts do not require or have any limits on changing write region.

Cosmos DB automatically takes backups of your data at regular intervals. For details on backup retention intervals and windows, see [Online backup and on-demand data restore in Azure Cosmos DB](online-backup-and-restore.md).

## Per-container limits
Depending on which API you use, an Azure Cosmos container can represent either a collection, a table, or graph. Containers support configurations for [unique key constraints](unique-keys.md), [stored procedures, triggers, and UDFs](stored-procedures-triggers-udfs.md), and [indexing policy](how-to-manage-indexing-policy.md). The following table lists the limits specific to configurations within a container. 

| Resource | Default limit |
| --- | --- |
| Max stored procedures per container |100 <sup>1</sup>|
| Max UDFs per container |25 <sup>1</sup>|
| Max number of paths in indexing policy|100 <sup>1</sup>|
| Max number of unique keys per container|10 <sup>1</sup>|
| Max number of paths per unique key constraint|16 <sup>1</sup>|

## Per-item limits
Depending on which API you use, an Azure Cosmos item can represent either a document in a collection, a row in a table, or a node or edge in a graph. The following table shows the limits per item in Cosmos DB. 

| Resource | Default limit |
| --- | --- |
| Max size of an item |2 MB |
| Max length of partition key value |2048 bytes |
| Max length of id value |1024 bytes |

See [Modeling items in Cosmos DB](how-to-model-partition-example.md) for a real-world example, and patterns to manage large items. 

## Per-request limits
Azure Cosmos DB supports [CRUD and query operations](https://docs.microsoft.com/rest/api/cosmos-db/) against resources like containers, items, and databases. For more information, see [Cosmos DB REST API](https://docs.microsoft.com/rest/api/cosmos-db/restful-interactions-with-cosmosdb-resources) and [Users, permissions, and resource tokens](secure-access-to-data.md). The following table lists the limits per request made to the Cosmos DB service.

| Resource | Default limit |
| --- | --- |
| Max execution time for single operations (CRUD or single paginated query)| 5 s |
| Max request size (stored procedure, CRUD)|2 MB |
| Max response size (for example, paginated query) |4 MB |
| Max pre-triggers per request| 1 |
| Max post-triggers per request| 1 |
| Max master token expiry time |15 min |
| Min resource token expiry time |10 min |
| Max resource token expiry time |24 h <sup>1</sup>|
| Max clock skew for token authorization| 15 min |
 
## SQL query limits
Azure Cosmos DB supports querying items using [SQL](how-to-sql-query.md). The following table describes restrictions in query statements, for example in terms of number of clauses or query length. 

| Resource | Default limit |
| --- | --- |
| Max length of SQL query| 256 kb <sup>1</sup>|
| Max JOINs per query| 5 <sup>1</sup>|
| Max ANDs per query| 2000 <sup>1</sup>|
| Max ORs per query| 2000 <sup>1</sup>|
| Max UDFs per query| 10 <sup>1</sup>|
| Max arguments per IN expression| 6000 <sup>1</sup>|
| Max points per polygon| 4096 <sup>1</sup>|

## Mongo API-specific limits
Cosmos DB supports the MongoDB wire protocol for applications written against MongoDB. You can find the supported commands and protocol versions at [Supported Mongo features and syntax](mongodb-feature-support.md). 

The following table lists the limits specific to Mongo support. Other service limits mentioned for the core (SQL) API also apply to theMongo API. 

| Resource | Default limit |
| --- | --- |
| Max Mongo query memory size | 40 MB |
| Max execution time for Mongo operations| 30s |

<sup>1</sup> You can increase these limits by contacting Azure Support or contacting us via askcosmosdb@microsoft.com.
