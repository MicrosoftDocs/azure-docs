---
title: Business Critical tier - Azure SQL Database service | Microsoft Docs
description: Learn about the Azure SQL Database Business Critical tier
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
ms.date: 12/04/2018
---
# Business Critical tier - Azure SQL Database

> [!NOTE]
> Business Critical tier is called Premium in DTU purchasing model. For a comparison of the vCore-based purchasing model with the DTU-based purchasing model, see [Azure SQL Database purchasing models and resources](sql-database-purchase-models.md).

Azure SQL Database is based on SQL Server Database Engine architecture that is adjusted for the cloud environment in order to ensure 99.99% availability even in the cases of infrastructure failures. There are three architectural models that are used in Azure SQL Database:
- General Purpose/Standard 
- Business Critical/Premium
- Hyperscale

Premium/Business Critical service tier model is based on a cluster of database engine processes. This architectural model relies on a fact that there is always a quorum of available database engine nodes and has minimal performance impact on your workload even during maintenance activities.

Azure upgrades and patches underlying operating system, drivers, and SQL Server Database Engine transparently with the minimal down-time for end users. 

Premium availability is enabled in Premium and Business Critical service tiers of Azure SQL Database and it is designed for intensive workloads that cannot tolerate any performance impact due to the ongoing maintenance operations.

In the premium model, Azure SQL database integrates compute and storage on the single node. High availability in this architectural model is achieved by replication of compute (SQL Server Database Engine process) and storage (locally attached SSD) deployed in four node cluster, using technology similar to SQL Server [Always On Availability Groups](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server).

![Cluster of database engine nodes](media/sql-database-managed-instance/business-critical-service-tier.png)

Both the SQL database engine process and underlying mdf/ldf files are placed on the same node with locally attached SSD storage providing low latency to your workload. High availability is implemented using technology similar to SQL Server [Always On Availability Groups](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server). Every database is a cluster of database nodes with one primary database that is accessible for customer workload, and a three secondary processes containing copies of data. The primary node constantly pushes the changes to secondary nodes in order to ensure that the data is available on secondary replicas if the primary node crashes for any reason. Failover is handled by the SQL Server Database Engine – one secondary replica becomes the primary node and a new secondary replica is created to ensure enough nodes in the cluster. The workload is automatically redirected to the new primary node.

In addition, Business Critical cluster has built-in [Read Scale-Out](sql-database-read-scale-out.md) capability that provides free-of charge built-in read-only node that can be used to run read-only queries (for example reports) that should not affect performance of your primary workload.

## When to choose this service tier?

Business Critical service tier is designed for the applications that require low-latency responses from the underlying SSD storage (1-2 ms in average), fast recovery if the underlying infrastructure fails, or need to off-load reports, analytics, and read-only queries to the free of charge readable secondary replica of the primary database.

## Next steps

- Find resource characteristics (number of cores, IO, memory) of Business Critical tier in [Managed Instance](sql-database-managed-instance-resource-limits.md#service-tier-characteristics), Single database in [vCore model](sql-database-vcore-resource-limits-single-databases.md#business-critical-service-tier-for-provisioned-compute-tier) or [DTU model](sql-database-dtu-resource-limits-single-databases.md#premium-service-tier), or Elastic pool in [vCore model](sql-database-vcore-resource-limits-elastic-pools.md#business-critical-service-tier-storage-sizes-and-compute-sizes) and [DTU model](sql-database-dtu-resource-limits-elastic-pools.md#premium-elastic-pool-limits).
- Learn about [General Purpose](sql-database-service-tier-general-purpose.md) and [Hyperscale](sql-database-service-tier-hyperscale.md) tiers.
- Learn about [Service Fabric](../service-fabric/service-fabric-overview.md).
- For more options for high availability and disaster recovery, see [Business Continuity](sql-database-business-continuity.md).
