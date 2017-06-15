---
title: 'SQL Database: What is a DTU? | Microsoft Docs'
description: Understanding what an Azure SQL Database transaction unit is.
keywords: database options,database performance
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: CarlRabeler

ms.assetid: 89e3e9ce-2eeb-4949-b40f-6fc3bf520538
ms.service: sql-database
ms.custom: DBs & servers
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: NA
ms.date: 04/13/2017
ms.author: carlrab

---
# Explaining Database Transaction Units (DTUs) and elastic Database Transaction Units (eDTUs)
This article explains Database Transaction Units (DTUs) and elastic Database Transaction Units (eDTUs) and what happens when you hit the maximum DTUs or eDTUs.  

## What are Database Transaction Units (DTUs)
For a single Azure SQL database at a specific performance level within a [service tier](sql-database-service-tiers.md#single-database-service-tiers-and-performance-levels), Microsoft guarantees a certain level of resources for that database (independent of any other database in the Azure cloud) and providing a predictable level of performance. This amount of resources is calculated as a number of Database Transaction Units or DTUs, and is a blended measure of CPU, memory, I/O (data and transaction log I/O). The ratio amongst these resources was originally determined by an [OLTP benchmark workload](sql-database-benchmark-overview.md) designed to be typical of real-world OLTP workloads. When your workload exceeds the amount of any of these resources, your throughput is throttled - resulting in slower performance and timeouts. The resources used by your workload do not impact the resources available to other SQL databases in the Azure cloud, and the resource used by other workloads do not impact the resources available to your SQL database.

![bounding box](./media/sql-database-what-is-a-dtu/bounding-box.png)

DTUs are most useful for understanding the relative amount of resources between Azure SQL Databases at different performance levels and service tiers. For example, doubling the DTUs by increasing the performance level of a database equates to doubling the set of resource available to that database. For example, a Premium P11 database with 1750 DTUs provides 350x more DTU compute power than a Basic database with 5 DTUs.  

To gain deeper insight into the resource (DTU) consumption of your workload, use [Azure SQL Database Query Performance Insight](sql-database-query-performance.md) to:

- Identify the top queries by CPU/Duration/Execution count that can potentially be tuned for improved performance. For example, an I/O intensive query might benefit from the use of [in-memory optimization techniques](sql-database-in-memory.md) to make better use of the available memory at a certain service tier and performance level.
- Drill down into the details of a query, view its text and history of resource utilization.
- Access performance tuning recommendations that show actions performed by [SQL Database Advisor](sql-database-advisor.md).

You can [change service tiers](sql-database-service-tiers.md) at any time with minimal downtime to your application (generally averaging under four seconds). For many businesses and apps, being able to create databases and dial performance up or down on demand is enough, especially if usage patterns are relatively predictable. But if you have unpredictable usage patterns, it can make it hard to manage costs and your business model. For this scenario, you use an elastic pool with a certain number of eDTUs that are shared among multiple database in the pool.

![Intro to SQL Database: Single database DTUs by tier and level](./media/sql-database-what-is-a-dtu/single_db_dtus.png)

## What are elastic Database Transaction Units (eDTUs)
Rather than provide a dedicated set of resources (DTUs) to a SQL Database that is always available regardless of whether needed not, you can place databases into an [elastic pool](sql-database-elastic-pool.md) on a SQL Database server that shares a pool of resources among those database. The shared resources in an elastic pool measured by elastic Database Transaction Units or eDTUs. Elastic pools provide a simple cost effective solution to manage the performance goals for multiple databases that have widely varying and unpredictable usage patterns. In an elastic pool, you can guarantee that no one database uses all of the resources in the pool and also that a minimum amount of resources is always available to a database in an elastic pool. See [elastic pools and service tiers](sql-database-service-tiers.md#elastic-pool-service-tiers-and-performance-in-edtus) for more information.

![Intro to SQL Database: eDTUs by tier and level](./media/sql-database-what-is-a-dtu/sqldb_elastic_pools.png)

A pool is given a set number of eDTUs, for a set price. Within the elastic pool, individual databases are given the flexibility to auto-scale within the configured boundaries. Under heavy load, a database can consume more eDTUs to meet demand while databases under light loads consume less, up to the point that databases under no load consume no eDTUs. By provisioning resources for the entire pool, rather than per database, management tasks are simplified and you have a predictable budget for the pool.

Additional eDTUs can be added to an existing pool with no database downtime and with no impact on the databases in the pool. Similarly, if extra eDTUs are no longer needed, they can be removed from an existing pool at any point in time. You can add or subtract databases to the pool, or limit the amount of eDTUs a database can use under heavy load to reserve eDTUs for other databases. If a database is predictably under-utilizing resources, you can move it out of the pool and configure it as a single database with predictable amount of resources it requires.

## How can I determine the number of DTUs needed by my workload?
If you are looking to migrate an existing on-premises or SQL Server virtual machine workload to Azure SQL Database, you can use the [DTU Calculator](http://dtucalculator.azurewebsites.net/) to approximate the number of DTUs needed. For an existing Azure SQL Database workload, you can use [SQL Database Query Performance Insight](sql-database-query-performance.md) to understand your database resource consumption (DTUs) to get deeper insight into how to optimize your workload. You can also use the [sys.dm_db_ resource_stats](https://msdn.microsoft.com/library/dn800981.aspx) DMV to get the resource consumption information for the last one hour. Alternatively, the catalog view [sys.resource_stats](http://msdn.microsoft.com/library/dn269979.aspx) can also be queried to get the same data for the last 14 days, although at a lower fidelity of five-minute averages.

## How do I know if I could benefit from an elastic pool of resources?
Pools are suited for a large number of databases with specific utilization patterns. For a given database, this pattern is characterized by low average utilization with relatively infrequent utilization spikes. SQL Database automatically evaluates the historical resource usage of databases in an existing SQL Database server and recommends the appropriate pool configuration in the Azure portal. For more information, see [when should an elastic pool be used?](sql-database-elastic-pool.md)

## What happens when I hit my maximum DTUs
Performance levels are calibrated and governed to provide the needed resources to run your database workload up to the max limits allowed for your selected service tier/performance level. If your workload is hitting the limits in one of CPU/Data IO/Log IO limits, you continue to receive the resources at the maximum allowed level, but you are likely to see increased latencies for your queries. These limits do not result in any errors, but rather a slowdown in the workload, unless the slowdown becomes so severe that queries start timing out. If you are hitting limits of maximum allowed concurrent user sessions/requests (worker threads), you see explicit errors. See [Azure SQL Database resource limits](sql-database-resource-limits.md) for information on limit on resources other than CPU, memory, data I/O, and transaction log I/O.

## Next steps
* See [Service tier](sql-database-service-tiers.md) for information on the DTUs and eDTUs available for single databases and for elastic pools.
* See [Azure SQL Database resource limits](sql-database-resource-limits.md) for information on limit on resources other than CPU, memory, data I/O, and transaction log I/O.
* See [SQL Database Query Performance Insight](sql-database-query-performance.md) to understand your (DTUs) consumption.
* See [SQL Database benchmark overview](sql-database-benchmark-overview.md) to understand the methodology behind the OLTP benchmark workload used to determine the DTU blend.
