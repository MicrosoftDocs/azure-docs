---
title: Business Critical service tier
titleSuffix:  Azure SQL Database & Azure SQL Managed Instance
description: Learn about the Business Critical service tier for Azure SQL Database and Azure SQL Managed Instance. 
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
# Business Critical tier - Azure SQL Database and Azure SQL Managed Instance 
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

Azure SQL Database and Azure SQL Managed Instance are both based on the SQL Server database engine architecture adjusted for the cloud environment in order to ensure default SLA availability even in cases of infrastructure failures. 

This article describes and compares the Business Critical service tier used by Azure SQL Database and Azure SQL Managed instance. The Business Critical service tier is best used for applications requiring high transaction rate, low IO latency, and high IO throughput. This service tier offers the highest resilience to failures and fast failovers using multiple synchronously updated replicas.

## Overview

The Business Critical service tier model is based on a cluster of database engine processes. This architectural model relies on a fact that there is always a quorum of available database engine nodes and has minimal performance impact on your workload even during maintenance activities. 

Azure upgrades and patches underlying operating system, drivers, and SQL Server database engine transparently with the minimal down-time for end users. 

Premium availability is enabled in the Business Critical service tier and is designed for intensive workloads that cannot tolerate reduced availability due to the ongoing maintenance operations.

Compute and storage is integrated on the single node in the premium model. High availability in this architectural model is achieved by replication of compute (SQL Server database engine process) and storage (locally attached SSD) deployed to a  four node cluster, using technology similar to SQL Server [Always On availability groups](/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server).

![Cluster of database engine nodes](./media/service-tier-business-critical/business-critical-service-tier.png)

Both the SQL Server database engine process and underlying .mdf/.ldf files are placed on the same node with locally attached SSD storage providing low latency to your workload. High availability is implemented using technology similar to SQL Server [Always On availability groups](/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server). Every database is a cluster of database nodes with one primary database that is accessible for customer workloads, and a three secondary processes containing copies of data. The primary node constantly pushes changes to the secondary nodes in order to ensure that the data is available on secondary replicas if the primary node fails for any reason. Failover is handled by the SQL Server database engine – one secondary replica becomes the primary node and a new secondary replica is created to ensure there are enough nodes in the cluster. The workload is automatically redirected to the new primary node.

In addition, the Business Critical cluster has built-in [Read Scale-Out](read-scale-out.md) capability that provides free-of charge built-in read-only replica that can be used to run read-only queries (for example reports) that should not affect performance of your primary workload.

## When to choose this service tier

The Business Critical service tier is designed for applications that require low-latency responses from the underlying SSD storage (1-2 ms in average), fast recovery if the underlying infrastructure fails, or need to off-load reports, analytics, and read-only queries to the free of charge readable secondary replica of the primary database.

The key reasons why you should choose Business Critical service tier instead of General Purpose tier are:
-    **Low I/O latency requirements** – workloads that need a fast response from the storage layer (1-2 milliseconds in average) should use Business Critical tier. 
-    **Workload with reporting and analytic queries** that can be redirected to the free-of-charge secondary read-only replica.
- **Higher resiliency and faster recovery from failures**. In a case of system failure, the database on primary instance will be disabled and one of the secondary replicas will be immediately became new read-write primary database that is ready to process queries. The database engine doesn't need to analyze and redo transactions from the log file and load all data in the memory buffer.
- **Advanced data corruption protection**. The Business Critical tier leverages database replicas behind-the-scenes for business continuity purposes, and so the service also then leverages automatic page repair, which is the same technology used for SQL Server database [mirroring and availability groups](/sql/sql-server/failover-clusters/automatic-page-repair-availability-groups-database-mirroring). In the event that a replica cannot read a page due to a data integrity issue, a fresh copy of the page will be retrieved from another replica, replacing the unreadable page without data loss or customer downtime. This functionality is applicable in General Purpose tier if the database has geo-secondary replica.
- **Higher availability** - The Business Critical tier in Multi-AZ configuration provides resiliency to zonal failures and a higher availability SLA.
- **Fast geo-recovery** - The Business Critical tier configured with geo-replication has a guaranteed Recovery Point Objective (RPO) of 5 seconds and Recovery Time Objective (RTO) of 30 seconds for 100% of deployed hours.
 
## Compare Business Critical resource limits 

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

Review the table in this section for a brief overview comparison of the resource limits for Azure SQL Database and Azure SQL managed Instance in the Business Critical service tier. 

For comprehensive details about resource limits, review:
- Azure SQL Database: [vCore single database](resource-limits-vcore-single-databases.md), [vCore pooled database ](resource-limits-vcore-elastic-pools.md), [Hyperscale](service-tier-hyperscale.md), [DTU single database](resource-limits-dtu-single-databases.md) and [DTU pooled databases](resource-limits-dtu-elastic-pools.md)
- Azure SQL Managed Instance: [vCore instance limits](../managed-instance/resource-limits.md)

To compare features between SQL Database and SQL Managed Instance, see the [database engine features](features-comparison.md). 

The following table shows resource limits for both Azure SQL Database and Azure SQL Managed Instance in the Business Critical service tier. 

| **Category** | **Azure SQL Database** | **Azure SQL Managed Instance** |
|:--|:--|:--|
| **Compute size**|1 to 128 vCores  | 4, 8, 16, 24, 32, 40, 64, 80 vCores| 
| **Storage type** |Local SSD storage|Local SSD storage | 
| **Storage size** | 1 GB – 4 TB |32 GB – 16 TB | 
| **Tempdb size** | [32 GB per vCore](resource-limits-vcore-single-databases.md) |Up to 4 TB - [limited by storage size](../managed-instance/resource-limits.md#service-tier-characteristics) |
| **Log write throughput** | Single databases: [12 MB/s per vCore (max 96 MB/s)](resource-limits-vcore-single-databases.md) <br> Elastic pools: [15 MB/s per vCore (max 120 MB/s)](resource-limits-vcore-elastic-pools.md) | [4 MB/s per vCore (max 48 MB/s)](../managed-instance/resource-limits.md#service-tier-characteristics) |
| **Availability** | [Default SLA](https://azure.microsoft.com/support/legal/sla/azure-sql-database/)  | [Default SLA](https://azure.microsoft.com/support/legal/sla/azure-sql-sql-managed-instance/)|
| **Backups** | RA-GRS, 1-35 days (7 days by default) | RA-GRS, 1-35 days (7 days by default)| 
| **Read-only replicas** |1 built-in, included in price <br> 0 - 4 using [geo-replication](active-geo-replication-overview.md) |1 built-in, included in price <br> 0 - 1 using [auto-failover groups](auto-failover-group-overview.md#best-practices-for-sql-managed-instance)  | 
| **Pricing/Billing** |[vCore, reserved storage, and backup storage](https://azure.microsoft.com/pricing/details/sql-database/single/) are charged. <br/>IOPS is not charged. |[vCore, reserved storage, and backup storage](https://azure.microsoft.com/pricing/details/sql-database/managed/) is charged. <br/>IOPS is not charged.  | 
| **Discount models** |[Reserved instances](reserved-capacity-overview.md)<br/>[Azure Hybrid Benefit](../azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions|[Reserved instances](reserved-capacity-overview.md)<br/>[Azure Hybrid Benefit](../azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions | 
| | |


## Next steps

- Find resource characteristics (number of cores, I/O, memory) of Business Critical tier in [SQL Managed Instance](../managed-instance/resource-limits.md#service-tier-characteristics), Single database in [vCore model](resource-limits-vcore-single-databases.md) or [DTU model](resource-limits-dtu-single-databases.md#premium-service-tier), or Elastic pool in [vCore model](resource-limits-vcore-elastic-pools.md) and [DTU model](resource-limits-dtu-elastic-pools.md#premium-elastic-pool-limits).
- Learn about [General Purpose](service-tier-general-purpose.md) and [Hyperscale](service-tier-hyperscale.md) service tiers.
- Learn about [Service Fabric](../../service-fabric/service-fabric-overview.md).
- For more options for high availability and disaster recovery, see [Business Continuity](business-continuity-high-availability-disaster-recover-hadr-overview.md).
