---
title: "include file"
description: "include file"
services: storage
author: MarkMcGeeAtAquent
ms.service: storage
ms.topic: "include"
ms.date: 04/06/2018
ms.author: mimig
ms.custom: "include file"
---
If you currently use Azure Table Storage, you gain the following benefits by moving to the Azure Cosmos DB Table API:

| | Azure Table storage | Azure Cosmos DB Table API |
| --- | --- | --- |
| Latency | Fast, but no upper bounds on latency. | Single-digit millisecond latency for reads and writes, backed with <10-ms latency reads and <15-ms latency writes at the 99th percentile, at any scale, anywhere in the world. |
| Throughput | Variable throughput model. Tables have a scalability limit of 20,000 operations/s. | Highly scalable with [dedicated reserved throughput per table](../articles/cosmos-db/request-units.md) that's backed by SLAs. Accounts have no upper limit on throughput and support >10 million operations/s per table. |
| Global distribution | Single region with one optional readable secondary read region for high availability. You can't initiate failover. | [Turnkey global distribution](../articles/cosmos-db/distribute-data-globally.md) from one to 30+ regions. Support for [automatic and manual failovers](../articles/cosmos-db/high-availability.md) at any time, anywhere in the world. |
| Indexing | Only primary index on PartitionKey and RowKey. No secondary indexes. | Automatic and complete indexing on all properties, no index management. |
| Query | Query execution uses index for primary key, and scans otherwise. | Queries can take advantage of automatic indexing on properties for fast query times. |
| Consistency | Strong within primary region. Eventual within secondary region. | [Five well-defined consistency levels](../articles/cosmos-db/consistency-levels.md) to trade off availability, latency, throughput, and consistency based on your application needs. |
| Pricing | Storage-optimized. | Throughput-optimized. |
| SLAs | 99.99% availability. | 99.99% availability SLA for all single region accounts and all multi-region accounts with relaxed consistency, and 99.999% read availability on all multi-region database accounts [Industry-leading comprehensive SLAs](https://azure.microsoft.com/support/legal/sla/cosmos-db/) on general availability. |
