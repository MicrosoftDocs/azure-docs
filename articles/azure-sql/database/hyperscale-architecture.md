---
title: Hyperscale distributed functions architecture
description: Learn how Hyperscale databases are architected to scale out storage and compute resources for Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: service-overview
ms.topic: conceptual
author: dimitri-furman
ms.author: dfurman
ms.reviewer: kendralittle, mathoma
ms.date: 2/17/2022
---

# Hyperscale distributed functions architecture

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

The [Hyperscale service tier](service-tier-hyperscale.md) utilizes an architecture with highly scalable storage and compute performance tiers. This article describes the components that enable customers to quickly scale Hyperscale databases while benefiting from 

## Hyperscale architecture overview

Traditional database engines centralize data management functions in a single location/process: even so called distributed databases in production today have multiple copies of a monolithic data engine.

Hyperscale databases follow a different approach. Hyperscale separates the query processing engine, where the semantics of various data engines diverge, from the components that provide long-term storage and durability for the data. In this way, storage capacity can be smoothly scaled out as far as needed (initial target is 100 TB).

High availability and named replicas share the same storage components, so no data copy is required to spin up a new replica.

The following diagram illustrates the different types of nodes in a Hyperscale database:

:::image type="content" source="./media/service-tier-Hyperscale/Hyperscale-architecture.png" alt-text="Hyperscale's compute tier consists of a primary compute note and secondary compute nodes, each with RBPEX data cache. The log service communicates both with compute notes and page servers. Page servers exist in their own tier, and also have RBPEX data cache." lightbox="./media/service-tier-Hyperscale/Hyperscale-architecture.png":::

A Hyperscale database contains the following types of components: compute nodes, page servers, the log service, and Azure storage.

## Compute

The compute node is where the relational engine lives. The compute node is where language, query, and transaction processing occur. All user interactions with a Hyperscale database happen through compute nodes.

Compute nodes have SSD-based caches called Resilient Buffer Pool Extension (RBPEX Data Cache) to minimize the number of network round trips required to fetch a page of data. 

Hyperscale databases have one primary compute node where the read-write workload and transactions are processed. One or more secondary compute nodes act as hot standby nodes for failover purposes. Secondary compute nodes can serve as read-only compute nodes to offload read workloads when desired.

The database engine running on Hyperscale compute nodes is the same as in other Azure SQL Database service tiers. When users interact with the database engine on Hyperscale compute nodes, the supported surface area and engine behavior are the same as in other service tiers, with the exception of [known limitations](service-tier-hyperscale.md#known-limitations).

## Page server

Page servers are systems representing a scaled-out storage engine. Each page server is responsible for a subset of the pages in the database. Nominally, each page server controls either up to 128 GB or up to 1 TB of data. No data is shared on more than one page server, outside of page server replicas that are kept for redundancy and availability.

The job of a page server is to serve database pages out to the compute nodes on demand, and to keep the pages updated as transactions update data. Page servers are kept up to date by playing transaction log records from the log service. 

Page servers also maintain covering SSD-based caches to enhance performance. Long-term storage of data pages is kept in Azure Storage for additional reliability.

## Log service

The log service accepts transaction log records from the primary compute replica and persists them in a durable cache. The log service  forwards log records to the rest of the compute replicas, so they can update their caches, as well as the relevant page servers, so that the data can be updated there. In this way, all data changes from the primary compute replica are propagated through the log service to all the secondary compute replicas and page servers. 

Finally, transaction log records are pushed out to long-term storage in Azure Storage, which is a virtually infinite storage repository. This mechanism removes the need for frequent log truncation. 

The log service has local memory and SSD caches to speed up access to log records.

The log on Hyperscale is practically infinite, with the restriction that a single transaction cannot generate more than 1 TB of log. Additionally, if using [Change Data Capture](/sql/relational-databases/track-changes/about-change-data-capture-sql-server), at most 1 TB of log can be generated since the start of the oldest active transaction. Avoid unnecessarily large transactions to stay below this limit.

## Azure storage

Azure Storage contains all data files in a database. Page servers keep data files in Azure Storage up to date. This storage is used for backup purposes, and for replication between Azure regions.

Backups are implemented using storage snapshots of data files. Restore operations using snapshots are fast regardless of data size. A database can be restored to any point in time within its backup retention period.

## Next steps

Learn more about Hyperscale in the following articles:

- [Hyperscale service tier](service-tier-hyperscale.md)
- [Azure SQL Database Hyperscale FAQ](service-tier-hyperscale-frequently-asked-questions-faq.yml)
- [Quickstart: Create a Hyperscale database in Azure SQL Database](hyperscale-database-create-quickstart.md)
- [Azure SQL Database Hyperscale named replicas FAQ](service-tier-hyperscale-named-replicas-faq.yml)
