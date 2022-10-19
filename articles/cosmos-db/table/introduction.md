---
title: Introduction to the Azure Cosmos DB for Table
description: Learn how you can use Azure Cosmos DB to store and query massive volumes of key-value data with low latency by using the Azure Tables API.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: table
ms.custom: ignite-2022
ms.topic: overview
ms.date: 11/03/2021
---
# Introduction to Azure Cosmos DB: API for Table
[!INCLUDE[Table](../includes/appliesto-table.md)]

[Azure Cosmos DB](introduction.md) provides the API for Table for applications that are written for Azure Table storage and that need premium capabilities like:

* [Turnkey global distribution](../distribute-data-globally.md).
* [Dedicated throughput](../partitioning-overview.md) worldwide (when using provisioned throughput).
* Single-digit millisecond latencies at the 99th percentile.
* Guaranteed high availability.
* Automatic secondary indexing.

[Azure Tables SDKs](https://devblogs.microsoft.com/azure-sdk/announcing-the-new-azure-data-tables-libraries/) are available for .NET, Java, Python, Node.js, and Go. These SDKs can be used to target either Table Storage or Azure Cosmos DB Tables. Applications written for Azure Table storage using the Azure Tables SDKs can be migrated to the Azure Cosmos DB for Table with no code changes to take advantage of premium capabilities.

> [!NOTE]
> The [serverless capacity mode](../serverless.md) is now available on Azure Cosmos DB's API for Table.

> [!IMPORTANT]
> The .NET Azure Tables SDK [Azure.Data.Tables](https://www.nuget.org/packages/Azure.Data.Tables/) offers latest features supported by the API for Table. The Azure Tables client library can seamlessly target either Azure Table storage or Azure Cosmos DB table service endpoints with no code changes.

## Table offerings

If you currently use Azure Table Storage, you gain the following benefits by moving to the Azure Cosmos DB for Table:

| Feature | Azure Table storage | Azure Cosmos DB for Table |
| --- | --- | --- |
| Latency | Fast, but no upper bounds on latency. | Single-digit millisecond latency for reads and writes, backed with <10 ms latency for reads and writes at the 99th percentile, at any scale, anywhere in the world. |
| Throughput | Variable throughput model. Tables have a scalability limit of 20,000 operations/s. | Highly scalable with [dedicated reserved throughput per table](../request-units.md) that's backed by SLAs. Accounts have no upper limit on throughput and support >10 million operations/s per table. |
| Global distribution | Single region with one optional readable secondary read region for high availability. | [Turnkey global distribution](../distribute-data-globally.md) from one to any number of regions. Support for [service-managed and manual failovers](../high-availability.md) at any time, anywhere in the world. Multiple write regions to let any region accept write operations. |
| Indexing | Only primary index on PartitionKey and RowKey. No secondary indexes. | Automatic and complete indexing on all properties by default, with no index management. |
| Query | Query execution uses index for primary key, and scans otherwise. | Queries can take advantage of automatic indexing on properties for fast query times. |
| Consistency | Strong within primary region. Eventual within secondary region. | [Five well-defined consistency levels](../consistency-levels.md) to trade off availability, latency, throughput, and consistency based on your application needs. |
| Pricing | Consumption-based. | Available in both [consumption-based](../serverless.md) and [provisioned capacity](../set-throughput.md) modes. |
| SLAs | 99.9% to 99.99% availability, depending on the replication strategy. | 99.999% read availability, 99.99% write availability on a single-region account and 99.999% write availability on multi-region accounts. [Comprehensive SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/) covering availability, latency, throughput and consistency. |

## Get started

Create an Azure Cosmos DB account in the [Azure portal](https://portal.azure.com). Then get started with our [Quick Start for API for Table by using .NET](quickstart-dotnet.md).

## Next steps

Here are a few pointers to get you started:
* [Build a .NET application by using the API for Table](quickstart-dotnet.md)
* [Develop with the API for Table in .NET](tutorial-develop-table-dotnet.md)
* [Query table data by using the API for Table](tutorial-query.md)
* [Learn how to set up Azure Cosmos DB global distribution by using the API for Table](tutorial-global-distribution.md)
* [Azure Cosmos DB Table .NET Standard SDK](dotnet-standard-sdk.md)
* [Azure Cosmos DB Table .NET SDK](dotnet-sdk.md)
* [Azure Cosmos DB Table Java SDK](java-sdk.md)
* [Azure Cosmos DB Table Node.js SDK](nodejs-sdk.md)
* [Azure Cosmos DB Table SDK for Python](python-sdk.md)
