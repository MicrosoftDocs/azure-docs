---
title: General-purpose service tier - Azure SQL Database | Microsoft Docs
description: Learn about the Azure SQL Database general-purpose tier
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein
manager: craigg
ms.date: 02/07/2019
---
# General purpose service tier - Azure SQL Database

> [!NOTE]
> The general-purpose service tier in the vCore-based purchasing model is called the standard service tier in the DTU-based purchasing model. For a comparison of the vCore-based purchasing model with the DTU-based purchasing model, see [Azure SQL Database purchasing models and resources](sql-database-purchase-models.md).

Azure SQL Database is based on SQL Server database engine architecture adapted for the cloud environment in order to ensure 99.99% availability even in the cases of infrastructure failures. There are three service tiers that are used in Azure SQL Database, each with different architectural models. These service tiers are:

- General purpose
- Business critical
- Hyperscale

The architectural model for the general-purpose service tier is based on a separation of compute and storage. This architectural model relies on high availability and reliability of Azure Blob storage that transparently replicates database files and guarantees no data loss if underlying infrastructure failure happens.

The following figure shows four nodes in standard architectural model with the separated compute and storage layers.

![Separation of compute and storage](media/sql-database-managed-instance/general-purpose-service-tier.png)

In the architectural model for the general-purpose service tier, there are two layers:

- A stateless compute layer that is running the `sqlserver.exe` process and contains only transient and cached data (for example – plan cache, buffer pool, column store pool). This stateless SQL Server node is operated by Azure Service Fabric that initializes process, controls health of the node, and performs failover to another place if necessary.
- A stateful data layer with database files (.mdf/.ldf) that are stored in Azure Blob storage. Azure Blob storage guarantees that there will be no data loss of any record that is placed in any database file. Azure Storage has built-in data availability/redundancy that ensures that every record in log file or page in data file will be preserved even if SQL Server process crashes.

Whenever database engine or operating system is upgraded, some part of underlying infrastructure fails, or if some critical issue is detected in SQL Server process, Azure Service Fabric will move the stateless SQL Server process to another stateless compute node. There is a set of spare nodes that is waiting to run new compute service if a failover of the primary node happens in order to minimize failover time. Data in Azure storage layer is not affected, and data/log files are attached to newly initialized SQL Server process. This process guarantees 99.99% availability, but it might have some performance impacts on heavy workload that is running due to transition time and the fact the new SQL Server node starts with cold cache.

## When to choose this service tier

General Purpose service tier is a default service tier in Azure SQL Database that is designed for most of the generic workloads. If you need a fully managed database engine with 99.99% SLA with storage latency between 5 and 10 ms that match Azure SQL IaaS in most of the cases, General Purpose tier is the option for you.

## Next steps

- Find resource characteristics (number of cores, IO, memory) of General Purpose/Standard tier in [Managed Instance](sql-database-managed-instance-resource-limits.md#service-tier-characteristics), Single database in [vCore model](sql-database-vcore-resource-limits-single-databases.md#general-purpose-service-tier-storage-sizes-and-compute-sizes) or [DTU model](sql-database-dtu-resource-limits-single-databases.md#single-database-storage-sizes-and-compute-sizes), or Elastic pool in [vCore model](sql-database-vcore-resource-limits-elastic-pools.md#general-purpose-service-tier-storage-sizes-and-compute-sizes) and [DTU model](sql-database-dtu-resource-limits-elastic-pools.md#standard-elastic-pool-limits).
- Learn about [Business Critical](sql-database-service-tier-business-critical.md) and [Hyperscale](sql-database-service-tier-hyperscale.md) tiers.
- Learn about [Service Fabric](../service-fabric/service-fabric-overview.md).
- For more options for high availability and disaster recovery, see [Business Continuity](sql-database-business-continuity.md).
