---
title: Service quotas and default limits
titleSuffix: Azure Cosmos DB
description: Service quotas and default limits on operations, storage, and throughput with various resource types within Azure Cosmos DB.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/15/2023
ms.custom: ignite-2022, build-2023
---

# Azure Cosmos DB service quotas

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

This article provides an overview of the default quotas offered to different resources in the Azure Cosmos DB.

## Storage and database operations

After you create an Azure Cosmos DB account under your subscription, you can manage data in your account by [creating databases, containers, and items](resource-model.md).

### Provisioned throughput

You can allocate throughput at a container-level or a database-level in terms of [request units (RU/s or RUs)](request-units.md). The following table lists the limits for storage and throughput per container/database. Storage refers to the combined amount of data and index storage.

| Resource | Limit |
| --- | --- |
| Maximum RUs per container ([dedicated throughput provisioned mode](resource-model.md#azure-cosmos-db-containers)) | 1,000,000 ¹ |
| Maximum RUs per database ([shared throughput provisioned mode](resource-model.md#azure-cosmos-db-containers)) | 1,000,000 ¹ |
| Maximum RUs per partition (logical & physical) | 10,000 |
| Maximum storage across all items per (logical) partition | 20 GB ²|
| Maximum number of distinct (logical) partition keys | Unlimited |
| Maximum storage per container | Unlimited |
| Maximum attachment size per Account (Attachment feature is being deprecated) | 2 GB |
| Minimum RU/s required per 1 GB | 1 RU/s |

¹ You can increase Maximum RUs per container or database by [filing an Azure support ticket](create-support-request-quota-increase.md).

² To learn about best practices for managing workloads that have partition keys requiring higher limits for storage or throughput, see [Create a synthetic partition key](synthetic-partition-keys.md). If your workload has already reached the logical partition limit of 20 GB in production, it's recommended to rearchitect your application with a different partition key as a long-term solution. To help give time to rearchitect your application, you can request a temporary increase in the logical partition key limit for your existing application. [File an Azure support ticket](create-support-request-quota-increase.md) and select quota type **Temporary increase in container's logical partition key size**. Requesting a temporary increase is intended as a temporary mitigation and not recommended as a long-term solution, as **SLA guarantees are not honored when the limit is increased**. To remove the configuration, file a support ticket and select quota type **Restore container’s logical partition key size to default (20 GB)**. Filing this support ticket can be done after you have either deleted data to fit the 20-GB logical partition limit or have rearchitected your application with a different partition key.

### Minimum throughput limits

An Azure Cosmos DB container (or shared throughput database) using manual throughput must have a minimum throughput of 400 RU/s. As the container grows, Azure Cosmos DB requires a minimum throughput to ensure the resource (database or container) has sufficient resource for its operations.

The current and minimum throughput of a container or a database can be retrieved from the Azure portal or the SDKs. For more information, see [Allocate throughput on containers and databases](set-throughput.md).

The actual minimum RU/s may vary depending on your account configuration. You can use [Azure Monitor metrics](monitor.md#view-operation-level-metrics-for-azure-cosmos-db) to view the history of provisioned throughput (RU/s) and storage on a resource.

#### Minimum throughput on container

To estimate the minimum throughput required of a container with manual throughput, find the maximum of:

* 400 RU/s 
* Current storage in GB * 1 RU/s
* Highest RU/s ever provisioned on the container / 100

For example, you have a container provisioned with 400 RU/s and 0-GB storage. You increase the throughput to 50,000 RU/s and import 20 GB of data. The minimum RU/s is now `MAX(400, 20 * 1 RU/s per GB, 50,000 RU/s / 100)` = 500 RU/s. Over time, the storage grows to 2000 GB. The minimum RU/s is now `MAX(400, 2000 * 1 RU/s per GB, 50,000 / 100)` = 2000 RU/s.

#### Minimum throughput on shared throughput database

To estimate the minimum throughput required of a shared throughput database with manual throughput, find the maximum of:

* 400 RU/s 
* Current storage in GB * 1 RU/s
* Highest RU/s ever provisioned on the database / 100
* 400 + MAX(Container count - 25, 0) * 100 RU/s

For example, you have a database provisioned with 400 RU/s, 15 GB of storage, and 10 containers. The minimum RU/s is `MAX(400, 15 * 1 RU/s per GB, 400 / 100, 400 + 0 )` = 400 RU/s. If there were 30 containers in the database, the minimum RU/s would be `400 + MAX(30 - 25, 0) * 100 RU/s` = 900 RU/s. 

In summary, here are the minimum provisioned RU limits when using manual throughput.

| Resource | Limit |
| --- | --- |
| Minimum RUs per container ([dedicated throughput provisioned mode with manual throughput](./resource-model.md#azure-cosmos-db-containers)) | 400 |
| Minimum RUs per database ([shared throughput provisioned mode with manual throughput](./resource-model.md#azure-cosmos-db-containers)) | 400 RU/s for first 25 containers. |

Azure Cosmos DB supports programmatic scaling of throughput (RU/s) per container or database via the SDKs or portal.

Depending on the current RU/s provisioned and resource settings, each resource can scale synchronously and immediately between the minimum RU/s to up to 100x the minimum RU/s. If the requested throughput value is outside the range, scaling is performed asynchronously. Asynchronous scaling may take minutes to hours to complete depending on the requested throughput and data storage size in the container.  [Learn more.](scaling-provisioned-throughput-best-practices.md#background-on-scaling-rus)

### Serverless

[Serverless](serverless.md) lets you use your Azure Cosmos DB resources in a consumption-based fashion. The following table lists the limits for storage and throughput burstability per container/database. These limits can't be increased. It's recommended to allocate extra serverless accounts for more storage needs.

| Resource | Limit |
| --- | --- |
| Maximum RU/s per container | 20,000* |
| Maximum storage across all items per (logical) partition | 20 GB |
| Maximum storage per container (API for NoSQL, MongoDB, Table, and Gremlin)| 1 TB  |
| Maximum storage per container (API for Cassandra)| 1 TB  |

*Maximum RU/sec availability is dependent on data stored in the container. See, [Serverless Performance](serverless-performance.md)

## Control plane

Azure Cosmos DB maintains a resource provider that offers a management layer to create, update, and delete resources in your Azure Cosmos DB account. The resource provider interfaces with the overall Azure Resource Management layer, which is the deployment and management service for Azure. You can [create and manage Azure Cosmos DB resources](how-to-manage-database-account.md) using the Azure portal, Azure PowerShell, Azure CLI, Azure Resource Manager and Bicep templates, Rest API, Azure Management SDKs as well as 3rd party tools such as Terraform and Pulumi.

This management layer can also be accessed from the Azure Cosmos DB data plane SDKs used in your applications to create and manage resources within an account. Data plane SDKs also make control plane requests during initial connection to the service to do things like enumerating databases and containers, as well as requesting account keys for authentication.

Each account for Azure Cosmos DB has a `master partition` which contains all of the metadata for an account. It also has a small amount of throughput to support control plane operations. Control plane requests that create, read, update or delete this metadata consumes this throughput. When the amount of throughput consumed by control plane operations exceeds this amount, operations are rate-limited, same as data plane operations within Azure Cosmos DB. However, unlike throughput for data operations, throughput for the master partition cannot be increased.

Some control plane operations do not consume master partition throughput, such as Get or List Keys. However, unlike requests on data within your Azure Cosmos DB account, resource providers within Azure are not designed for high request volumes. **Control plane operations that exceed the documented limits at sustained levels over consecutive 5-minute periods here may experience request throttling as well failed or incomplete operations on Azure Cosmos DB resources**. 

Control plane operations can be monitored by navigating the Insights tab for an Azure Cosmos DB account. To learn more see [Monitor Control Plane Requests](use-metrics.md#monitor-control-plane-requests). Users can also customize these, use Azure Monitor and create a workbook to monitor [Metadata Requests](monitor-reference.md#request-metrics) and set alerts on them.

### Resource limits

The following table lists resource limits per subscription or account.

| Resource | Limit |
| --- | --- |
| Maximum number of accounts per subscription | 50 by default. ¹ |
| Maximum number of databases & containers per account | 500 ² |
| Maximum throughput supported by an account for metadata operations | 240 RU/s |

¹ You can increase these limits by creating an [Azure Support request](create-support-request-quota-increase.md) up to 1,000 max.
² This limit cannot be increased. Total count of both with an account. (1 database and 499 containers, 250 databases and 250 containers, etc.)

### Request limits

The following table lists request limits per 5 minute interval, per account, unless otherwise specified.

| Operation | Limit |
| --- | --- |
| Maximum List or Get Keys | 500 ¹ | 
| Maximum Create database & container | 500 |
| Maximum Get or List database & container | 500 ¹ |
| Maximum Update provisioned throughput | 25 |
| Maximum regional failover | 10 (per hour) ² |
| Maximum number of all operations (PUT, POST, PATCH, DELETE, GET) not defined above | 500 |

¹ Users should use [singleton client](nosql/best-practice-dotnet.md#checklist) for SDK instances and cache keys and database and container references between requests for the lifetime of that instance.
² Regional failovers only apply to single region writes accounts. Multi-region write accounts don't require or allow changing the write region.

Azure Cosmos DB automatically takes backups of your data at regular intervals. For details on backup retention intervals and windows, see [Online backup and on-demand data restore in Azure Cosmos DB](online-backup-and-restore.md).

## Per-account limits

Here's a list of limits per account.

### Provisioned throughput

| Resource | Limit |
| --- | --- |
| Maximum number of databases and containers per account | 500¹ |
| Maximum number of containers per database with shared throughput | 25 |
| Maximum number of regions | No limit (All Azure regions) |

### Serverless

| Resource | Limit |
| --- | --- |
| Maximum number of databases and containers per account  | 100¹ |
| Maximum number of regions | 1 (Any Azure region) |

¹ You can increase any of these per-account limits by creating an [Azure Support request](create-support-request-quota-increase.md).

## Per-container limits

Depending on which API you use, an Azure Cosmos DB container can represent either a collection, a table, or graph. Containers support configurations for [unique key constraints](unique-keys.md), [stored procedures, triggers, and UDFs](stored-procedures-triggers-udfs.md), and [indexing policy](how-to-manage-indexing-policy.md). The following table lists the limits specific to configurations within a container.

| Resource | Limit |
| --- | --- |
| Maximum length of database or container name | 255 |
| Maximum number of stored procedures per container | 100 ¹ |
| Maximum number of UDFs per container | 50 ¹ |
| Maximum number of unique keys per container|10 ¹ |
| Maximum number of paths per unique key constraint|16 ¹ |
| Maximum TTL value |2147483647 |

¹ You can increase any of these per-container limits by creating an [Azure Support request](create-support-request-quota-increase.md).

## Per-item limits

An Azure Cosmos DB item can represent either a document in a collection, a row in a table, or a node or edge in a graph; depending on which API you use. The following table shows the limits per item in Azure Cosmos DB.

| Resource | Limit |
| --- | --- |
| Maximum size of an item | 2 MB (UTF-8 length of JSON representation) ¹ |
| Maximum length of partition key value | 2048 bytes (101 bytes if large partition-key isn't enabled) |
| Maximum length of ID value | 1023 bytes |
| Allowed characters for ID value | Service-side all Unicode characters except for '/' and '\\' are allowed. <br/>**WARNING: But for best interoperability we STRONGLY RECOMMEND to only use alpha-numerical ASCII characters in the ID value only**. <br/>There are several known limitations in some versions of the Cosmos DB SDK, as well as connectors (ADF, Spark, Kafka etc.) and http-drivers/libraries etc. that can prevent successful processing when the ID value contains non-alphanumerical ASCII characters. So, to increase interoperability, please encode the ID value - [for example via Base64 + custom encoding of special characters allowed in Base64](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/78fc16c35c521b4f9a7aeef11db4df79c2545dee/Microsoft.Azure.Cosmos.Encryption/src/EncryptionProcessor.cs#L475-L489). - if you have to support non-alphanumerical ASCII characters in your service/application. |
| Maximum number of properties per item | No practical limit |
| Maximum length of property name | No practical limit |
| Maximum length of property value | No practical limit |
| Maximum length of string property value | No practical limit |
| Maximum length of numeric property value | IEEE754 double-precision 64-bit |
| Maximum level of nesting for embedded objects / arrays | 128 |
| Maximum TTL value |2147483647 |
| Maximum precision/range for numbers in [JSON (to ensure safe interoperability)](https://www.rfc-editor.org/rfc/rfc8259#section-6) | [IEEE 754 binary64](https://www.rfc-editor.org/rfc/rfc8259#ref-IEEE754) |

¹ Large document sizes up to 16 MB are supported with Azure Cosmos DB for MongoDB only. Read the [feature documentation](../cosmos-db/mongodb/feature-support-42.md#data-types) to learn more.

There are no restrictions on the item payloads (like number of properties and nesting depth), except for the length restrictions on partition key and ID values, and the overall size restriction of 2 MB. You may have to configure indexing policy for containers with large or complex item structures to reduce RU consumption. See [Modeling items in Azure Cosmos DB](nosql/model-partition-example.md) for a real-world example, and patterns to manage large items.

## Per-request limits

Azure Cosmos DB supports [CRUD and query operations](/rest/api/cosmos-db/) against resources like containers, items, and databases. It also supports [transactional batch requests](/dotnet/api/microsoft.azure.cosmos.transactionalbatch) against items with the same partition key in a container.

| Resource | Limit |
| --- | --- |
| Maximum execution time for a single operation (like a stored procedure execution or a single query page retrieval)| 5 sec |
| Maximum request size (for example, stored procedure, CRUD)| 2 MB |
| Maximum response size (for example, paginated query) | 4 MB |
| Maximum number of operations in a transactional batch | 100 |

Azure Cosmos DB supports execution of triggers during writes. The service supports a maximum of one pre-trigger and one post-trigger per write operation.

Once an operation like query reaches the execution timeout or response size limit, it returns a page of results and a continuation token to the client to resume execution. There's no practical limit on the duration a single query can run across pages/continuations.

Azure Cosmos DB uses HMAC for authorization. You can use either a primary key, or a [resource token](secure-access-to-data.md) for fine-grained access control to resources. These resources can include containers, partition keys, or items. The following table lists limits for authorization tokens in Azure Cosmos DB.

| Resource | Limit |
| --- | --- |
| Maximum primary token expiry time | 15 min  |
| Minimum resource token expiry time | 10 min  |
| Maximum resource token expiry time | 24 h by default ¹ |
| Maximum clock skew for token authorization| 15 min |

¹ You can increase it by [filing an Azure support ticket](create-support-request-quota-increase.md)

## Limits for autoscale provisioned throughput

See the [Autoscale](./provision-throughput-autoscale.md#autoscale-limits) article and [FAQ](./autoscale-faq.yml#how-do-i-lower-the-maximum-ru-s-) for more detailed explanation of the throughput and storage limits with autoscale.

| Resource | Limit |
| --- | --- |
| Maximum RU/s the system can scale to |  `Tmax`, the autoscale max RU/s set by user|
| Minimum RU/s the system can scale to | `0.1 * Tmax`|
| Current RU/s the system is scaled to  |  `0.1*Tmax <= T <= Tmax`, based on usage|
| Minimum billable RU/s per hour| `0.1 * Tmax` <br></br>Billing is done on a per-hour basis, where you're billed for the highest RU/s the system scaled to in the hour, or `0.1*Tmax`, whichever is higher. |
| Minimum autoscale max RU/s for a container  |  `MAX(1000, highest max RU/s ever provisioned / 10, current storage in GB * 10)` rounded up to nearest 1000 RU/s |
| Minimum autoscale max RU/s for a database  |  `MAX(1000, highest max RU/s ever provisioned / 10, current storage in GB * 10,  1000 + (MAX(Container count - 25, 0) * 1000))`, rounded up to the nearest 1000 RU/s. <br></br>Note if your database has more than 25 containers, the system increments the minimum autoscale max RU/s by 1000 RU/s per extra container. For example, if you have 30 containers, the lowest autoscale maximum RU/s you can set is 6000 RU/s (scales between 600 - 6000 RU/s).|

## SQL query limits

Azure Cosmos DB supports querying items using [SQL](nosql/query/getting-started.md). The following table describes restrictions in query statements, for example in terms of number of clauses or query length.

| Resource | Limit |
| --- | --- |
| Maximum length of SQL query| 512 KB |
| Maximum JOINs per query| 10 ¹ |
| Maximum UDFs per query| 10 ¹ |
| Maximum points per polygon| 4096 |
| Maximum explicitly included paths per container| 1500 ¹ |
| Maximum explicitly excluded paths per container| 1500 ¹ |
| Maximum properties in a composite index| 8 |
| Maximum number of paths in a composite index| 100 |

¹ You can increase any of these SQL query limits by creating an [Azure Support request](create-support-request-quota-increase.md).

## API for MongoDB-specific limits

Azure Cosmos DB supports the MongoDB wire protocol for applications written against MongoDB. You can find the supported commands and protocol versions at [Supported MongoDB features and syntax](mongodb/feature-support-32.md).

The following table lists the limits specific to MongoDB feature support. Other service limits mentioned for the API for NoSQL also apply to the API for MongoDB.

| Resource | Limit |
| --- | --- |
| Maximum size of a document | 16 MB (UTF-8 length of JSON representation) ¹ |
| Maximum MongoDB query memory size (This limitation is only for 3.2 server version) | 40 MB |
| Maximum execution time for MongoDB operations (for 3.2 server version)| 15 seconds|
| Maximum execution time for MongoDB operations (for 3.6 and 4.0 server version)| 60 seconds|
| Maximum level of nesting for embedded objects / arrays on index definitions | 6 |
| Idle connection timeout for server side connection closure ² | 30 minutes |

¹ Large document sizes up to 16 MB require feature enablement in Azure portal. Read the [feature documentation](../cosmos-db/mongodb/feature-support-42.md#data-types) to learn more.

² We recommend that client applications set the idle connection timeout in the driver settings to 2-3 minutes because the [default timeout for Azure LoadBalancer is 4 minutes](../load-balancer/load-balancer-tcp-idle-timeout.md).  This timeout ensures that an intermediate load balancer idle doesn't close connections between the client machine and Azure Cosmos DB.

## Try Azure Cosmos DB Free limits

The following table lists the limits for the [Try Azure Cosmos DB for Free](https://azure.microsoft.com/try/cosmosdb/) trial.

| Resource | Limit |
| --- | --- |
| Duration of the trial | 30 days (a new trial can be requested after expiration) <br> After expiration, the information stored is deleted. |
| Maximum containers per subscription (NoSQL, Gremlin, API for Table) | 1 |
| Maximum containers per subscription (API for MongoDB) | 3 |
| Maximum throughput per container | 5000 |
| Maximum throughput per shared-throughput database | 20000 |
| Maximum total storage per account | 10 GB |

Try Azure Cosmos DB supports global distribution in only the Central US, North Europe, and Southeast Asia regions. Azure support tickets can't be created for Try Azure Cosmos DB accounts. However, support is provided for subscribers with existing support plans.

## Azure Cosmos DB free tier account limits

The following table lists the limits for [Azure Cosmos DB free tier accounts.](optimize-dev-test.md#azure-cosmos-db-free-tier)

| Resource | Limit |
| --- | --- |
| Number of free tier accounts per Azure subscription | 1 |
| Duration of free-tier discount | Lifetime of the account. Must opt in during account creation. |
| Maximum RU/s for free | 1000 RU/s |
| Maximum storage for free | 25 GB |
| Maximum number of shared throughput databases | 5 |
| Maximum number of containers in a shared throughput database | 25 <br>In free tier accounts, the minimum RU/s for a shared throughput database with up to 25 containers is 400 RU/s. |

In addition to the previous table, the [Per-account limits](#per-account-limits) also apply to free tier accounts. To learn more, see how to create a [free tier account](free-tier.md).

## Next steps

* Read more about [global distribution](distribute-data-globally.md)
* Read more about [partitioning](partitioning-overview.md) and [provisioned throughput](request-units.md).
