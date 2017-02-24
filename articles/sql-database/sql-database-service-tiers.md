---
title: 'SQL Database performance: Service tiers | Microsoft Docs'
description: Compare SQL Database service tiers.
keywords: database options,database performance
services: sql-database
documentationcenter: ''
author: janeng
manager: jhubbard
editor: ''

ms.assetid: f5c5c596-cd1e-451f-92a7-b70d4916e974
ms.service: sql-database
ms.custom: overview
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 02/09/2017
ms.author: janeng

---
# SQL Database options and performance: Understand what's available in each service tier
[Azure SQL Database](sql-database-technical-overview.md) offers three service tiers, **Basic**, **Standard**, and **Premium**, with multiple performance levels to handle different workloads. Higher performance levels provide increasings resources designed to deliver increasingly higher throughput. You can change [service tiers and performance levels dynamically](sql-database-service-tiers.md) without downtime. Basic, Standard, and Premium service tiers all have an uptime SLA of 99.99%, flexible business continuity options, security features, and hourly billing. 

You can create single databases with dedicated resource on the [performance level](sql-database-service-tiers.md#single-database-service-tiers-and-performance-levels) selected. You can also manage multiple databases in an [elastic pool](sql-database-service-tiers.md#elastic-pool-service-tiers-and-performance-in-edtus) in which the resources are shared across the databases. The resources available for single databases are expressed in terms of Database Transaction Units (DTUs) and for elastic pools in terms of elastic DTUs (eDTUs). For more on DTUs and eDTUs, see [What is a DTU?](sql-database-what-is-a-dtu.md) 

In both cases, the service tiers include **Basic**, **Standard**, and **Premium**. 

## Choosing a service tier
The following table provides examples of the tiers best suited for different application workloads.

| Service tier | Target workloads |
| :--- | --- |
| **Basic** | Best suited for a small database, supporting typically one single active operation at a given time. Examples include databases used for development or testing, or small-scale infrequently used applications. |
| **Standard** |The go-to option for cloud applications with low to medium IO performance requirements, supporting multiple concurrent queries. Examples include workgroup or web applications. |
| **Premium** | Designed for high transactional volume with high IO performance requirements, supporting many concurrent users. Examples are databases supporting mission critical applications. |

First decide if you want to run a single database or if you want to group databases that shares resources. Review the [elastic pool considerations](sql-database-elastic-pool-guidance.md). To decide on a service tier, start by determining the minimum database features that you need:

* Max database size for individual databases (2 GB maximum for Basic, 250 GB maximum for Standard, and 500 GB to 1 TB maximum for Premium in the high end performance levels)
* Maximum total storage in an elastic pool (117 GB for Basic, 1200 GB for Standard, and 750 GB for Premium)
* Maximum number of databases per pool (400 for Basic, 400 for Standard, and 50 for Premium)
* Database backup retention period (7 days for Basic, 35 days for Standard and Premium)

Once you have determined the minimum service tier, you are ready to determine the performance level for the database (the number of DTUs). The standard S2 and S3 performance levels are often a good starting point. For databases with high CPU or IO requirements, the Premium performance levels are the right starting point. Premium offers more CPU and starts at 10x more IO compared to the highest Standard performance level.

## Single database service tiers and performance levels
For single databases, there are multiple performance levels within each service tier. You have the flexibility to choose the level that best meets your workload’s demands. If you need to scale up or down, you can easily change the tiers of your database. See [Changing Database Service Tiers and Performance Levels](sql-database-service-tiers.md) for details.

Regardless of the number of databases hosted, your database gets a guaranteed set of resources and the expected performance characteristics of your database are not affected.

[!INCLUDE [SQL DB service tiers table](../../includes/sql-database-service-tiers-table.md)]

> [!NOTE]
> For a detailed explanation of all other rows in this service tiers table, see [Service tier capabilities and limits](sql-database-performance-guidance.md#service-tier-capabilities-and-limits).
> 

## Scaling up or scaling down a single database

After initially picking a service tier and performance level, you can scale a single database up or down dynamically based on actual experience. 

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Azure-SQL-Database-dynamically-scale-up-or-scale-down/player]
>

Changing the service tier and/or performance level of a database creates a replica of the original database at the new performance level, and then switches connections over to the replica. No data is lost during this process but during the brief moment when we switch over to the replica, connections to the database are disabled, so some transactions in flight may be rolled back. This window varies, but is on average under 4 seconds, and in more than 99% of cases is less than 30 seconds. If there are large numbers of transactions in flight at the moment connections are disabled, this window may be longer.  

The duration of the entire scale-up process depends on both the size and service tier of the database before and after the change. For example, a 250 GB database that is changing to, from, or within a Standard service tier, should complete within 6 hours. For a database of the same size that is changing performance levels within the Premium service tier, it should complete within 3 hours.

* To downgrade a database, the database should be smaller than the maximum allowed size of the target service tier. 
* When upgrading a database with [Geo-Replication](sql-database-geo-replication-portal.md) enabled, you must first upgrade its secondary databases to the desired performance tier before upgrading the primary database.
* When downgrading from a Premium service tier, you must first terminate all Geo-Replication relationships. You can follow the steps described in the [Recover from an outage](sql-database-disaster-recovery.md) topic to stop the replication process between the primary and the active secondary databases.
* The restore service offerings are different for the various service tiers. If you are downgrading you may lose the ability to restore to a point in time, or have a lower backup retention period. For more information, see [Azure SQL Database Backup and Restore](sql-database-business-continuity.md).
* The new properties for the database are not applied until the changes are complete.

> [!IMPORTANT]
> For detailed steps, see [Managing single databases with the Azure portal](sql-database-manage-single-databases-portal.md), [Managing single databases with Powershell](sql-database-manage-single-databases-powershell.md), or [Managing single databases with Transact-SQL](sql-database-manage-single-databases-tsql.md).
>

## Elastic pool service tiers and performance in eDTUs

Pools allow databases to share and consume eDTU resources without needing to assign a specific performance level to each database in the pool. For example, a single database in a Standard pool can go from using 0 eDTUs to the maximum database eDTU you set up when you configure the pool. Pools allow multiple databases with varying workloads to efficiently use eDTU resources available to the entire pool. See [Price and performance considerations for an elastic pool](sql-database-elastic-pool-guidance.md) for details.

The following table describes the characteristics of pool service tiers.

[!INCLUDE [SQL DB service tiers table for elastic pools](../../includes/sql-database-service-tiers-table-elastic-pools.md)]

Each database within a pool also adheres to the single database characteristics for that tier. For example, the Basic pool has a limit for max sessions per pool of 4800 - 28800, but an individual database within a Basic pool has a database limit of 300 sessions.

## Scaling up or scaling down an elastic pool

After initially picking a service tier and performance level, you can scale the elastic pool up or down dynamically based on actual experience. 

* Changing the min eDTUs per database or max eDTUs per database typically completes in five minutes or less.
* Time to change the pool size (eDTUs) depends on the combined size of all databases in the pool. Changes average 90 minutes or less per 100 GB. For example, if the total space of all databases in the pool is 200 GB, then the expected latency for changing the pool eDTU per pool is 3 hours or less.

> [!IMPORTANT]
> For detailed steps, see [Managing elastic pools with the Azure portal](sql-database-elastic-pool-manage-portal.md), [Managing elastic pools with Powershell](sql-database-elastic-pool-manage-powershell.md), [Managing elastic pools with Transact-SQL](sql-database-elastic-pool-manage-tsql.md), or [Managing elastic pools with C#](sql-database-elastic-pool-manage-csharp.md).
>

## Next steps

* Learn the details of [elastic pools](sql-database-elastic-pool-guidance.md) and [price and performance considerations for elastic pools](sql-database-elastic-pool-guidance.md).
* Learn how to [Monitor, manage, and resize elastic pools](sql-database-elastic-pool-manage-portal.md) and [Monitor the performance of single databases](sql-database-single-database-monitor.md).
* Now that you know about the SQL Database tiers, try them out with a [free account](https://azure.microsoft.com/pricing/free-trial/) and learn [how to create your first SQL database](sql-database-get-started.md).
* For migration scenarios, use the [DTU Calculator](http://dtucalculator.azurewebsites.net/) to approximate the number of DTUs needed. 

