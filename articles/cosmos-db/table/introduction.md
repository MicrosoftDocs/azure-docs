---
title: Introduction/Overview
titleSuffix: Azure Cosmos DB for Table
description: Use Azure Cosmos DB for Table to store, manage, and query massive volumes of key-value typed NoSQL data.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: table
ms.topic: overview
ms.date: 02/28/2023
ms.custom: ignite-2022
---

# What is Azure Cosmos DB for Table?

[!INCLUDE[Table](../includes/appliesto-table.md)]

[Azure Cosmos DB](../introduction.md) is a fully managed NoSQL and relational database for modern app development.

Azure Cosmos DB for Table provides applications written for Azure Table storage with premium capabilities like:

- [Turnkey global distribution](../distribute-data-globally.md).
- [Dedicated throughput](../partitioning-overview.md) worldwide (when using provisioned throughput).
- Single-digit millisecond latencies at the 99th percentile.
- Guaranteed high availability.
- Automatic secondary indexing.

Azure Table Storage has [SDKs](https://devblogs.microsoft.com/azure-sdk/announcing-the-new-azure-data-tables-libraries/) available for .NET, Java, Python, Node.js, and Go. These SDKs can be used to target either Azure Table Storage or the API for Table. Applications written for Azure Table Storage using the Azure Tables SDKs can be migrated to the Azure Cosmos DB with no code changes to take advantage of premium capabilities.

Specifically, the .NET Azure Tables SDK [Azure.Data.Tables](https://www.nuget.org/packages/Azure.Data.Tables/) offers the latest features supported by the API for Table. The Azure Tables client library can seamlessly target either Azure Table storage or API for Table service endpoints with no code changes.

> [!TIP]
> Want to try the API for Table with no commitment? Create an Azure Cosmos DB account using [Try Azure Cosmos DB](../try-free.md) for free.

## API for Table benefits

If you currently use Azure Table Storage, you gain the following benefits by moving to the API for Table:

| | Azure Table storage | API for Table |
| --- | --- | --- |
| **Latency** | Fast, but no upper bounds on latency. | Single-digit millisecond latency for reads and writes, backed with <10-ms latency for reads and writes at the 99th percentile, at any scale, anywhere in the world. |
| **Throughput** | Variable throughput model. Tables have a scalability limit of 20,000 operations/s. | Highly scalable with [dedicated reserved throughput per table](../request-units.md) backed by SLAs. Accounts have no upper limit on throughput and support >10 million operations/s per table. |
| **Global distribution** | Single region with one optional readable secondary read region for high availability. | [Turnkey global distribution](../distribute-data-globally.md) from one to any number of regions. Support for [service-managed and manual failovers](../high-availability.md) at any time, anywhere in the world. Multiple write regions to let any region accept write operations. |
| **Indexing** | Only primary index on PartitionKey and RowKey. No secondary indexes. | Automatic and complete indexing on all properties by default, with no index management. |
| **Query** | Query execution uses index for primary key, and scans otherwise. | Queries can take advantage of automatic indexing on properties for fast query times. |
| **Consistency** | Strong within primary region. Eventual within secondary region. | [Five well-defined consistency levels](../consistency-levels.md) to trade off availability, latency, throughput, and consistency based on your application needs. |
| **Pricing** | Consumption-based. | Available in both [consumption-based](../serverless.md) and [provisioned capacity](../set-throughput.md) modes. |
| **SLAs** | 99.9% to 99.99% availability, depending on the replication strategy. | 99.999% read availability, 99.99% write availability on a single-region account and 99.999% write availability on multi-region accounts. [Comprehensive SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/) covering availability, latency, throughput and consistency. |

## Next steps

- [Query table data by using the API for Table](tutorial-query.md)
- [Learn how to set up Azure Cosmos DB global distribution by using the API for Table](tutorial-global-distribution.md)
- [Azure Cosmos DB Table .NET SDK](/dotnet/api/overview/azure/data.tables-readme)
