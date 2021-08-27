---
title: Introduction to the Azure Cosmos DB Table API
description: Learn how you can use Azure Cosmos DB to store and query massive volumes of key-value data with low latency by using the Azure Tables API.
author: SnehaGunda
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.topic: overview
ms.date: 01/08/2021
ms.author: sngun

---
# Introduction to Azure Cosmos DB: Table API
[!INCLUDE[appliesto-table-api](../includes/appliesto-table-api.md)]

[Azure Cosmos DB](introduction.md) provides the Table API for applications that are written for Azure Table storage and that need premium capabilities like:

* [Turnkey global distribution](../distribute-data-globally.md).
* [Dedicated throughput](../partitioning-overview.md) worldwide (when using provisioned throughput).
* Single-digit millisecond latencies at the 99th percentile.
* Guaranteed high availability.
* Automatic secondary indexing.

Applications written for Azure Table storage can migrate to Azure Cosmos DB by using the Table API with no code changes and take advantage of premium capabilities. The Table API has client SDKs available for .NET, Java, Python, and Node.js.

> [!NOTE]
> The [serverless capacity mode](../serverless.md) is now available on Azure Cosmos DB's Table API.

> [!IMPORTANT]
> The .NET Framework SDK [Microsoft.Azure.CosmosDB.Table](https://www.nuget.org/packages/Microsoft.Azure.CosmosDB.Table) is in maintenance mode and it will be deprecated soon. Please upgrade to the new .NET Standard library [Microsoft.Azure.Cosmos.Table](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table) to continue to get the latest features supported by the Table API.

## Table offerings
If you currently use Azure Table Storage, you gain the following benefits by moving to the Azure Cosmos DB Table API:

| Feature | Azure Table storage | Azure Cosmos DB Table API |
| --- | --- | --- |
| Latency | Fast, but no upper bounds on latency. | Single-digit millisecond latency for reads and writes, backed with <10 ms latency for reads and writes at the 99th percentile, at any scale, anywhere in the world. |
| Throughput | Variable throughput model. Tables have a scalability limit of 20,000 operations/s. | Highly scalable with [dedicated reserved throughput per table](../request-units.md) that's backed by SLAs. Accounts have no upper limit on throughput and support >10 million operations/s per table. |
| Global distribution | Single region with one optional readable secondary read region for high availability. | [Turnkey global distribution](../distribute-data-globally.md) from one to any number of regions. Support for [automatic and manual failovers](../high-availability.md) at any time, anywhere in the world. Multiple write regions to let any region accept write operations. |
| Indexing | Only primary index on PartitionKey and RowKey. No secondary indexes. | Automatic and complete indexing on all properties by default, with no index management. |
| Query | Query execution uses index for primary key, and scans otherwise. | Queries can take advantage of automatic indexing on properties for fast query times. |
| Consistency | Strong within primary region. Eventual within secondary region. | [Five well-defined consistency levels](../consistency-levels.md) to trade off availability, latency, throughput, and consistency based on your application needs. |
| Pricing | Consumption-based. | Available in both [consumption-based](../serverless.md) and [provisioned capacity](../set-throughput.md) modes. |
| SLAs | 99.9% to 99.99% availability, depending on the replication strategy. | 99.999% read availability, 99.99% write availability on a single-region account and 99.999% write availability on multi-region accounts. [Comprehensive SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/) covering availability, latency, throughput and consistency. |

## Get started

Create an Azure Cosmos DB account in the [Azure portal](https://portal.azure.com). Then get started with our [Quick Start for Table API by using .NET](create-table-dotnet.md). 

> [!IMPORTANT]
> If you created a Table API account during the preview, please create a [new Table API account](create-table-dotnet.md#create-a-database-account) to work with the generally available Table API SDKs.
>

## Next steps

Here are a few pointers to get you started:
* [Build a .NET application by using the Table API](create-table-dotnet.md)
* [Develop with the Table API in .NET](tutorial-develop-table-dotnet.md)
* [Query table data by using the Table API](tutorial-query-table.md)
* [Learn how to set up Azure Cosmos DB global distribution by using the Table API](tutorial-global-distribution-table.md)
* [Azure Cosmos DB Table .NET Standard SDK](dotnet-standard-sdk.md)
* [Azure Cosmos DB Table .NET SDK](dotnet-sdk.md)
* [Azure Cosmos DB Table Java SDK](java-sdk.md)
* [Azure Cosmos DB Table Node.js SDK](nodejs-sdk.md)
* [Azure Cosmos DB Table SDK for Python](python-sdk.md)
