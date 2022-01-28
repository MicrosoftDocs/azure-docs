---
title: General Purpose service tier
titleSuffix: Azure SQL Database & Azure SQL Managed Instance 
description: Learn about the General Purpose service tier for Azure SQL Database and Azure SQL Managed Instance. 
services: sql-database
ms.service: sql-db-mi
ms.subservice: service-overview
ms.custom: sqldbrb=2
ms.devlang: 
ms.topic: conceptual
author: danimir
ms.author: danil
ms.reviewer: kendralittle, mathoma, urmilano
ms.date: 02/02/2022
---
# General Purpose service tier - Azure SQL Database and Azure SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

Azure SQL Database and Azure SQL Managed Instance are based on the SQL Server database engine architecture adapted for the cloud environment in order to ensure default availability even in the cases of infrastructure failures. 

This article describes and compares the General Purpose service tier used by Azure SQL Database and Azure SQL Managed instance. The General Purpose service tier is best used for budget-oriented, balanced compute and storage options. 


## Overview 

The architectural model for the General Purpose service tier is based on a separation of compute and storage. This architectural model relies on high availability and reliability of Azure Blob storage that transparently replicates database files and guarantees no data loss if underlying infrastructure failure happens.

The following figure shows four nodes in standard architectural model with the separated compute and storage layers.

![Separation of compute and storage](./media/service-tier-general-purpose/general-purpose-service-tier.png)

In the architectural model for the General Purpose service tier, there are two layers:

- A stateless compute layer that is running the `sqlservr.exe` process and contains only transient and cached data (for example – plan cache, buffer pool, column store pool). This stateless node is operated by Azure Service Fabric that initializes process, controls health of the node, and performs failover to another place if necessary.
- A stateful data layer with database files (.mdf/.ldf) that are stored in Azure Blob storage. Azure Blob storage guarantees that there will be no data loss of any record that is placed in any database file. Azure Storage has built-in data availability/redundancy that ensures that every record in log file or page in data file will be preserved even if the process crashes.

Whenever the database engine or operating system is upgraded, some part of underlying infrastructure fails, or if some critical issue is detected in the `sqlservr.exe` process, Azure Service Fabric will move the stateless process to another stateless compute node. There is a set of spare nodes that is waiting to run new compute service if a failover of the primary node happens in order to minimize failover time. Data in Azure storage layer is not affected, and data/log files are attached to newly initialized process. This process guarantees 99.99% availability, but it might have some performance impacts on heavy workloads that are running due to transition time and the fact the new node starts with cold cache.

## When to choose this service tier

The General Purpose service tier is a default service tier in Azure SQL Database and Azure SQL Managed Instance that is designed for most of generic workloads. If you need a fully managed database engine with a default SLA and storage latency between 5 and 10 ms, the General Purpose tier is the option for you.

## Compare General Purpose resource limits

<!---
vCore resource limits are listed in the following articles, please be sure to update all of them: 
/database/resource-limits-vcore-single-databases.md
/database/resource-limits-vcore-elastic-pools.md
/database/resource-limits-logical-server.md
/database/service-tier-general-purpose.md
/database/service-tier-business-critical.md
/database/service-tier-hyperscale.md
/managed-instance/resource-limits.md
--->

Review the table in this section for a brief overview comparison of the resource limits for Azure SQL Database and Azure SQL managed Instance in the General Purpose service tier. 

For comprehensive details about resource limits, review:
- Azure SQL Database: [vCore single database](resource-limits-vcore-single-databases.md), [vCore pooled database ](resource-limits-vcore-elastic-pools.md), [Hyperscale](service-tier-hyperscale.md), [DTU single database](resource-limits-dtu-single-databases.md) and [DTU pooled databases](resource-limits-dtu-elastic-pools.md)
- Azure SQL Managed Instance: [vCore instance limits](../managed-instance/resource-limits.md)


To compare features between SQL Database and SQL Managed Instance, see the [database engine features](features-comparison.md). 

The following table shows resource limits for both Azure SQL Database and Azure SQL Managed Instance in the General Purpose service tier: 

| **Category** | **Azure SQL Database** | **Azure SQL Managed Instance** |
|:--|:--|:--|
| **Compute size**| 1 - 80 vCores | 4, 8, 16, 24, 32, 40, 64, 80 vCores| 
| **Storage type** | Remote storage | Remote storage| 
| **Storage size** | 1 GB - 4 TB | 2 GB - 16 TB| 
| **Tempdb size** | [32 GB per vCore](resource-limits-vcore-single-databases.md) | [24 GB per vCore](../managed-instance/resource-limits.md#service-tier-characteristics) |
| **Log write throughput** | Single databases: [4.5 MB/s per vCore (max 50 MB/s)](resource-limits-vcore-single-databases.md) <br> Elastic pools: [6 MB/s per vCore (max 62.5 MB/s)](resource-limits-vcore-elastic-pools.md) | [3 MB/s per vCore (max 22 MB/s)](../managed-instance/resource-limits.md#service-tier-characteristics)|
| **Availability** | [Default SLA](https://azure.microsoft.com/support/legal/sla/azure-sql-database/)  | [Default SLA](https://azure.microsoft.com/support/legal/sla/azure-sql-sql-managed-instance/)|
| **Backups** | 1-35 days (7 days by default) | 1-35 days (7 days by default)| 
| **Read-only replicas** | 0 built-in </br> 0 - 4 using [geo-replication](active-geo-replication-overview.md) | 0 built-in </br> 0 - 1 using [auto-failover groups](auto-failover-group-overview.md#best-practices-for-sql-managed-instance) | 
| **Pricing/Billing** | [vCore, reserved storage, and backup storage](https://azure.microsoft.com/pricing/details/sql-database/single/) are charged. <br/>IOPS is not charged.| [vCore, reserved storage, and backup storage](https://azure.microsoft.com/pricing/details/sql-database/managed/) is charged. <br/>IOPS is not charged. | 
| **Discount models** |[Reserved instances](reserved-capacity-overview.md)<br/>[Azure Hybrid Benefit](../azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions | [Reserved instances](reserved-capacity-overview.md)<br/>[Azure Hybrid Benefit](../azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions| 
| | |
 

## Next steps

- Find resource characteristics (number of cores, I/O, memory) of the General Purpose/standard tier in [SQL Managed Instance](../managed-instance/resource-limits.md#service-tier-characteristics), single database in [vCore model](resource-limits-vcore-single-databases.md) or [DTU model](resource-limits-dtu-single-databases.md#single-database-storage-sizes-and-compute-sizes), or elastic pool in [vCore model](resource-limits-vcore-elastic-pools.md) and [DTU model](resource-limits-dtu-elastic-pools.md#standard-elastic-pool-limits).
- Learn about [Business Critical](service-tier-business-critical.md) and [Hyperscale](service-tier-hyperscale.md) service tiers.
- Learn about [Service Fabric](../../service-fabric/service-fabric-overview.md).
- For more options for high availability and disaster recovery, see [Business Continuity](business-continuity-high-availability-disaster-recover-hadr-overview.md).
