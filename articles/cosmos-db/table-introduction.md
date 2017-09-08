---
title: Introduction to the Azure Cosmos DB Table API | Microsoft Docs
description: Learn how you can use Azure Cosmos DB to store and query massive volumes of key-value data with low latency by using the popular OSS MongoDB APIs.
services: cosmos-db
author: bhanupr
manager: jhubbard
editor: monicar
documentationcenter: ''

ms.assetid: 
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 08/29/2017
ms.author: arramac

---
# Introduction to Azure Cosmos DB: Table API

[Azure Cosmos DB](introduction.md) provides the Table API (preview) for applications that are written for Azure Table storage and that need premium capabilities like:

* [Turnkey global distribution](distribute-data-globally.md).
* [Dedicated throughput](partition-data.md) worldwide.
* Single-digit millisecond latencies at the 99th percentile.
* Guaranteed high availability.
* [Automatic secondary indexing](http://www.vldb.org/pvldb/vol8/p1668-shukla.pdf).

These applications can migrate to Azure Cosmos DB by using the Table API with no code changes and take advantage of premium capabilities.

We recommend that you watch the following video, where Aravind Ramachandran explains how to get started with the Table API for Azure Cosmos DB:

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Table-API-for-Azure-Cosmos-DB/player]
> 
> 

## Premium and standard Table APIs
If you currently use Table storage, you gain the following benefits by moving to the Azure Cosmos DB "premium table" preview:

| | Azure Table storage | Azure Cosmos DB: Table storage (preview) |
| --- | --- | --- |
| Latency | Fast, but no upper bounds on latency. | Single-digit millisecond latency for reads and writes, backed with <10-ms latency reads and <15-ms latency writes at the 99th percentile, at any scale, anywhere in the world. |
| Throughput | Variable throughput model. Tables have a scalability limit of 20,000 operations/s. | Highly scalable with [dedicated reserved throughput per table](request-units.md) that's backed by SLAs. Accounts have no upper limit on throughput and support >10 million operations/s per table. |
| Global distribution | Single region with one optional readable secondary read region for high availability. You can't initiate failover. | [Turnkey global distribution](distribute-data-globally.md) from one to 30+ regions. Support for [automatic and manual failovers](regional-failover.md) at any time, anywhere in the world. |
| Indexing | Only primary index on PartitionKey and RowKey. No secondary indexes. | Automatic and complete indexing on all properties, no index management. |
| Query | Query execution uses index for primary key, and scans otherwise. | Queries can take advantage of automatic indexing on properties for fast query times. The Azure Cosmos DB database engine is capable of supporting aggregates, geospatial, and sorting. |
| Consistency | Strong within primary region. Eventual within secondary region. | [Five well-defined consistency levels](consistency-levels.md) to trade off availability, latency, throughput, and consistency based on your application needs. |
| Pricing | Storage-optimized. | Throughput-optimized. |
| SLAs | 99.99% availability. | 99.99% availability within a single region, and the ability to add more regions for higher availability. [Industry-leading comprehensive SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/) on general availability. |

## Get started

Create an Azure Cosmos DB account in the [Azure portal](https://portal.azure.com). Then get started with our [Quick Start for Table API by using .NET](create-table-dotnet.md). 

## Next steps

Here are a few pointers to get you started:
* [Build a .NET application by using the Table API](create-table-dotnet.md)
* [Develop with the Table API in .NET](tutorial-develop-table-dotnet.md)
* [Query table data by using the Table API](tutorial-query-table.md)
* [Learn how to set up Azure Cosmos DB global distribution by using the Table API](tutorial-global-distribution-table.md)
* [Azure Cosmos DB Table API SDK for .NET](table-sdk-dotnet.md)
