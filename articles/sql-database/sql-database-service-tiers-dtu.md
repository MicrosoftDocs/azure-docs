---
title: 'Azure SQL Database service tiers - DTU | Microsoft Docs'
description: Learn about service tiers for single and pool databases to provide performance levels and storage sizes.  
services: sql-database
author: sachinpMSFT
ms.service: sql-database
ms.custom: DBs & servers
ms.topic: conceptual
ms.date: 08/01/2018
manager: craigg
ms.author: carlrab

---
# Choosing a DTU-based service tier, performance level, and storage resources 

Service tiers are differentiated by a range of performance levels with a fixed amount of included storage, fixed retention period for backups, and fixed price. All service tiers provide flexibility of changing performance levels without downtime. Single databases and elastic pools are billed hourly based on service tier and performance level.

> [!IMPORTANT]
> SQL Database Managed Instance, currently in public preview does not support a DTU-based purchasing model. For more information, see [Azure SQL Database Managed Instance](sql-database-managed-instance.md). 

## Choosing a DTU-based service tier

Choosing a service tier depends primarily on business continuity, storage, and performance requirements.
||Basic|Standard|Premium|
| :-- | --: |--:| --:| --:| 
|Target workload|Development and production|Development and production|Development and production||
|Uptime SLA|99.99%|99.99%|99.99%|N/A while in preview|
|Backup retention|7 days|35 days|35 days|
|CPU|Low|Low, Medium, High|Medium, High|
|IO throughput (approximate) |2.5 IOPS per DTU| 2.5 IOPS per DTU | 48 IOPS per DTU|
|IO latency (approximate)|5 ms (read), 10 ms (write)|5 ms (read), 10 ms (write)|2 ms (read/write)|
|Columnstore indexing |N/A|S3 and above|Supported|
|In-memory OLTP|N/A|N/A|Supported|
|||||

## Single database DTU and storage limits

Performance levels are expressed in terms of Database Transaction Units (DTUs) for single databases and elastic Database Transaction Units (eDTUs) for elastic pools. For more on DTUs and eDTUs, see [What are DTUs and eDTUs](sql-database-service-tiers.md#what-are-database-transaction-units-dtus)?

||Basic|Standard|Premium|
| :-- | --: | --: | --: | --: |
| Maximum storage size | 2 GB | 1 TB | 4 TB  | 
| Maximum DTUs | 5 | 3000 | 4000 | |
||||||

> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](sql-database-file-space-management.md).

## Elastic pool eDTU, storage, and pooled database limits

| | **Basic** | **Standard** | **Premium** | 
| :-- | --: | --: | --: | --: |
| Maximum storage size per database  | 2 GB | 1 TB | 1 TB | 
| Maximum storage size per pool | 156 GB | 4 TB | 4 TB | 
| Maximum eDTUs per database | 5 | 3000 | 4000 | 
| Maximum eDTUs per pool | 1600 | 3000 | 4000 | 
| Maximum number of databases per pool | 500  | 500 | 100 | 
||||||

> [!IMPORTANT]
> More than 1 TB of storage in the Premium tier is currently available in all regions except the following: West Central US, China East, USDoDCentral, Germany Central, USDoDEast, US Gov Southwest, USGov Iowa, Germany Northeast,  China North. In other regions, the storage max in the Premium tier is limited to 1 TB. See [P11-P15 Current Limitations](sql-database-dtu-resource-limits-single-databases.md#single-database-limitations-of-p11-and-p15-when-the-maximum-size-greater-than-1-tb).  

> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](sql-database-file-space-management.md).

## Next steps

- For details on specific performance levels and storage size choices available for single databases, see [SQL Database DTU-based resource limits for single databases](sql-database-dtu-resource-limits-single-databases.md#single-database-storage-sizes-and-performance-levels).
- For details on specific performance levels and storage size choices available for elastic pools, see [SQL Database DTU-based resource limits](sql-database-dtu-resource-limits-elastic-pools.md#elastic-pool-storage-sizes-and-performance-levels).
