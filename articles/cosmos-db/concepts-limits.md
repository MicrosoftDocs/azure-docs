---
title: Azure Cosmos DB service quotas
description: Azure Cosmos DB service quotas and default limits on different resource types.
author: arramac
ms.author: arramac
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/10/2019
---

# Azure Cosmos DB service quotas

This article provides an overview of the default quotas offered to different resources in the Azure Cosmos DB.

## Storage and throughput

After you create an Azure Cosmos account under your subscription, you can manage data in your account by [creating databases, containers, and items](databases-containers-items.md). You can provision throughput at a container-level or a database-level in terms of [request units (RU/s or RUs)](request-units.md). The following table lists the limits for storage and throughput per container/database.

| Resource | Default limit |
| --- | --- |
| Maximum RUs per container ([dedicated throughput provisioned mode](databases-containers-items.md#azure-cosmos-containers)) | 1,000,000 by default. You can increase it by [filing an Azure support ticket](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request) or contacting us via [Ask Cosmos DB](mailto:askcosmosdb@microsoft.com) |
| Maximum RUs per database ([shared throughput provisioned mode](databases-containers-items.md#azure-cosmos-containers)) | 1,000,000 by default. You can increase it by [filing an Azure support ticket](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request) or contacting us via [Ask Cosmos DB](mailto:askcosmosdb@microsoft.com) |
| Maximum RUs per (logical) partition key | 10,000 |
| Maximum storage across all items per (logical) partition key| 10 GB |
| Maximum number of distinct (logical) partition keys | Unlimited |
| Maximum storage per container | Unlimited |
| Maximum storage per database | Unlimited |

> [!NOTE]
> For best practices to manage workloads that have partition keys that need higher limits for storage or throughput, see [Designing for Hot Partition Keys](synthetic-partition-keys.md)
>

A Cosmos container (or shared throughput database) must have a minimum throughput of 400 RUs. As the container grows, the minimum supported throughput also depends on the following factors:

* The maximum throughput ever provisioned on the container. The service supports lowering throughput of a container to 10% of the provisioned maximum. For example, if your throughput was increased to 10000 RUs, then the lowest possible provisioned throughput would be 1000 RUs
* The total number of containers that you have ever created in a shared throughput database, measured at 100 RUs per container. For example, if you have created five containers within a shared throughput database, then the throughput must be at least 500 RUs

The current and minimum throughput of a container or a database can be retrieved from the Azure portal or the SDKs. For more information, see [Provision throughput on containers and databases](set-throughput.md). In summary, here are the minimum provisioned RU limits. 

| Resource | Default limit |
| --- | --- |
| Minimum  RUs per container ([dedicated throughput provisioned mode](databases-containers-items.md#azure-cosmos-containers)) | 400 |
| Minimum  RUs per database ([shared throughput provisioned mode](databases-containers-items.md#azure-cosmos-containers)) | 400 |
| Minimum  RUs per container within a shared throughput database | 100 |

Cosmos DB supports elastic scaling of throughput (RUs) per container or database via the SDKs or portal. Each container can scale synchronously and immediately within a scale range of 10 to 100 times, between minimum and maximum values. If the requested throughput value is outside the range, scaling is performed asynchronously. Asynchronous scaling may take minutes to hours to complete depending on the requested throughput and data storage size in the container.  

## Control plane operations

You can [provision and manage your Azure Cosmos account](how-to-manage-database-account.md) using the Azure portal, Azure PowerShell, Azure CLI, and Azure Resource Manager templates. The following table lists the limits per subscription, account, and number of operations.

| Resource | Default limit |
| --- | --- |
| Maximum database accounts per subscription | 50 by default. You can increase it by [filing an Azure support ticket](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request) or contacting us via [Ask Cosmos DB](mailto:askcosmosdb@microsoft.com)|
| Maximum number of regional failovers | 1/hour by default. You can increase it by [filing an Azure support ticket](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request) or contacting us via [Ask Cosmos DB](mailto:askcosmosdb@microsoft.com)|

> [!NOTE]
> Regional failovers only apply to single region writes accounts. Multi-region write accounts do not require or have any limits on changing the write region.

Cosmos DB automatically takes backups of your data at regular intervals. For details on backup retention intervals and windows, see [Online backup and on-demand data restore in Azure Cosmos DB](online-backup-and-restore.md).

## Per-container limits

Depending on which API you use, an Azure Cosmos container can represent either a collection, a table, or graph. Containers support configurations for [unique key constraints](unique-keys.md), [stored procedures, triggers, and UDFs](stored-procedures-triggers-udfs.md), and [indexing policy](how-to-manage-indexing-policy.md). The following table lists the limits specific to configurations within a container. 

| Resource | Default limit |
| --- | --- |
| Maximum length of database or container name | 255 |
| Maximum stored procedures per container | 100 <sup>*</sup>|
| Maximum UDFs per container | 25 <sup>*</sup>|
| Maximum number of paths in indexing policy| 100 <sup>*</sup>|
| Maximum number of unique keys per container|10 <sup>*</sup>|
| Maximum number of paths per unique key constraint|16 <sup>*</sup>|

<sup>*</sup> You can increase any of these per-container limits by contacting Azure Support or contacting us via [Ask Cosmos DB](mailto:askcosmosdb@microsoft.com).

## Per-item limits

Depending on which API you use, an Azure Cosmos item can represent either a document in a collection, a row in a table, or a node or edge in a graph. The following table shows the limits per item in Cosmos DB. 

| Resource | Default limit |
| --- | --- |
| Maximum size of an item | 2 MB (UTF-8 length of JSON representation) |
| Maximum length of partition key value | 2048 bytes |
| Maximum length of id value | 1024 bytes |
| Maximum number of properties per item | No practical limit |
| Maximum nesting depth | No practical limit |
| Maximum length of property name | No practical limit |
| Maximum length of property value | No practical limit |
| Maximum length of string property value | No practical limit |
| Maximum length of numeric property value | IEEE754 double-precision 64-bit |

There are no restrictions on the item payloads like number of properties and nesting depth, except for the length restrictions on partition key and id values, and the overall size restriction of 2 MB. You may have to configure indexing policy for containers with large or complex item structures to reduce RU consumption. See [Modeling items in Cosmos DB](how-to-model-partition-example.md) for a real-world example, and patterns to manage large items.

## Per-request limits

Cosmos DB supports [CRUD and query operations](https://docs.microsoft.com/rest/api/cosmos-db/) against resources like containers, items, and databases.  

| Resource | Default limit |
| --- | --- |
| Maximum execution time for a single operation (like a stored procedure execution or a single query page retrieval)| 5 sec |
| Maximum request size (stored procedure, CRUD)| 2 MB |
| Maximum response size (for example, paginated query) | 4 MB |

Once an operation like query reaches the execution timeout or response size limit, it returns a page of results and a continuation token to the client to resume execution. There is no practical limit on the duration a single query can run across pages/continuations.

Cosmos DB uses HMAC for authorization. You can use either a master key, or a [resource tokens](secure-access-to-data.md) for fine-grained access control to resources like containers, partition keys, or items. The following table lists limits for authorization tokens in Cosmos DB.

| Resource | Default limit |
| --- | --- |
| Maximum master token expiry time | 15 min  |
| Minimum resource token expiry time | 10 min  |
| Maximum resource token expiry time | 24 h by default. You can increase it by [filing an Azure support ticket](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request) or contacting us via [Ask Cosmos DB](mailto:askcosmosdb@microsoft.com)|
| Maximum clock skew for token authorization| 15 min |

Cosmos DB supports execution of triggers during writes. The service supports a maximum of one pre-trigger and one post-trigger per write operation. 

## SQL query limits

Cosmos DB supports querying items using [SQL](how-to-sql-query.md). The following table describes restrictions in query statements, for example in terms of number of clauses or query length.

| Resource | Default limit |
| --- | --- |
| Maximum length of SQL query| 256 KB <sup>*</sup>|
| Maximum JOINs per query| 5 <sup>*</sup>|
| Maximum ANDs per query| 2000 <sup>*</sup>|
| Maximum ORs per query| 2000 <sup>*</sup>|
| Maximum UDFs per query| 10 <sup>*</sup>|
| Maximum arguments per IN expression| 6000 <sup>*</sup>|
| Maximum points per polygon| 4096 <sup>*</sup>|

<sup>*</sup> You can increase any of these SQL query limits by contacting Azure Support or contacting us via [Ask Cosmos DB](mailto:askcosmosdb@microsoft.com).

## MongoDB API-specific limits

Cosmos DB supports the MongoDB wire protocol for applications written against MongoDB. You can find the supported commands and protocol versions at [Supported MongoDB features and syntax](mongodb-feature-support.md).

The following table lists the limits specific to MongoDB feature support. Other service limits mentioned for the SQL (core) API also apply to the MongoDB API.

| Resource | Default limit |
| --- | --- |
| Maximum MongoDB query memory size | 40 MB |
| Maximum execution time for MongoDB operations| 30s |

## Try Cosmos DB Free limits

The following table lists the limits for the [Try Azure Cosmos DB for Free](https://azure.microsoft.com/try/cosmosdb/) trial.

| Resource | Default limit |
| --- | --- |
| Duration of the trial | 30 days (can be renewed any number of times) |
| Maximum containers per subscription (SQL, Gremlin, Table API) | 1 |
| Maximum containers per subscription (MongoDB API) | 3 |
| Maximum throughput per container | 5000 |
| Maximum throughput per shared-throughput database | 20000 |
| Maximum total storage per account | 10 GB |

Try Cosmos DB supports global distribution in only the Central US, North Europe, and Southeast Asia regions. Azure support tickets can't be created for Try Azure Cosmos DB accounts. However, support is provided for subscribers with existing support plans.

## Next steps

Read more about Cosmos DB's core concepts [global distribution](distribute-data-globally.md) and [partitioning](partitioning-overview.md) and [provisioned throughput](request-units.md).

Get started with Azure Cosmos DB with one of our quickstarts:

* [Get started with Azure Cosmos DB SQL API](create-sql-api-dotnet.md)
* [Get started with Azure Cosmos DB's API for MongoDB](create-mongodb-nodejs.md)
* [Get started with Azure Cosmos DB Cassandra API](create-cassandra-dotnet.md)
* [Get started with Azure Cosmos DB Gremlin API](create-graph-dotnet.md)
* [Get started with Azure Cosmos DB Table API](create-table-dotnet.md)

> [!div class="nextstepaction"]
> [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/)
