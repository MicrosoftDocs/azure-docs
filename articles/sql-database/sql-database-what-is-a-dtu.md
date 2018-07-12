---
title: 'SQL Database: What is a DTU? | Microsoft Docs'
description: Understanding what an Azure SQL Database transaction unit is.
keywords: database options,database performance
services: sql-database
author: CarlRabeler
manager: craigg
ms.service: sql-database
ms.custom: DBs & servers
ms.topic: conceptual
ms.date: 04/01/2018
ms.author: carlrab

---
# Database Transaction Units (DTUs) and elastic Database Transaction Units (eDTUs)
This article explains Database Transaction Units (DTUs) and elastic Database Transaction Units (eDTUs) and what happens when you hit the maximum DTUs or eDTUs. For specific pricing information, see [Azure SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/single/).

## What are Database Transaction Units (DTUs)?
For a single Azure SQL database at a specific performance level within a [service tier](sql-database-single-database-resources.md), Microsoft guarantees a certain level of resources for that database (independent of any other database in the Azure cloud), providing a predictable level of performance. The amount of resources is calculated as a number of Database Transaction Units or DTUs and is a bundled measure of compute, storage, and IO resources. The ratio amongst these resources was originally determined by an [OLTP benchmark workload](sql-database-benchmark-overview.md), designed to be typical of real-world OLTP workloads. When your workload exceeds the amount of any of these resources, your throughput is throttled - resulting in slower performance and timeouts. The resources used by your workload do not impact the resources available to other SQL databases in the Azure cloud, and the resources used by other workloads do not impact the resources available to your SQL database.

![bounding box](./media/sql-database-what-is-a-dtu/bounding-box.png)

DTUs are most useful for understanding the relative amount of resources between Azure SQL Databases at different performance levels and service tiers. For example, doubling the DTUs by increasing the performance level of a database equates to doubling the set of resources available to that database. For example, a Premium P11 database with 1750 DTUs provides 350x more DTU compute power than a Basic database with 5 DTUs.  

To gain deeper insight into the resource (DTU) consumption of your workload, use [Azure SQL Database Query Performance Insight](sql-database-query-performance.md) to:

- Identify the top queries by CPU/Duration/Execution count that can potentially be tuned for improved performance. For example, an IO intensive query might benefit from the use of [in-memory optimization techniques](sql-database-in-memory.md) to make better use of the available memory at a certain service tier and performance level.
- Drill down into the details of a query, view its text and history of resource utilization.
- Access performance tuning recommendations that show actions performed by [SQL Database Advisor](sql-database-advisor.md).

You can change [DTU service tiers](sql-database-service-tiers-dtu.md) at any time with minimal downtime to your application (generally averaging under four seconds). For many businesses and apps, being able to create databases and dial performance up or down on demand is enough, especially if usage patterns are relatively predictable. But if you have unpredictable usage patterns, it can make it hard to manage costs and your business model. For this scenario, you use an elastic pool with a certain number of eDTUs that are shared among multiple databases in the pool.

![Intro to SQL Database: Single database DTUs by tier and level](./media/sql-database-what-is-a-dtu/single_db_dtus.png)

## What are elastic Database Transaction Units (eDTUs)?
Rather than provide a dedicated set of resources (DTUs) that may not always be needed for a SQL Database that is always available, you can place databases into an [elastic pool](sql-database-elastic-pool.md) on a SQL Database server that shares a pool of resources among those databases. The shared resources in an elastic pool are measured by elastic Database Transaction Units or eDTUs. Elastic pools provide a simple cost effective solution to manage the performance goals for multiple databases having widely varying and unpredictable usage patterns. An elastic pool guarantees resources cannot be consumed by one database in the pool, while ensuring each database in the pool always has a minimum amount of necessary resources available. 

![Intro to SQL Database: eDTUs by tier and level](./media/sql-database-what-is-a-dtu/sqldb_elastic_pools.png)

A pool is given a set number of eDTUs for a set price. Within the elastic pool, individual databases are given the flexibility to auto-scale within the configured boundaries. A database under heavier load will consume more eDTUs to meet demand. Databases under lighter loads will consume less eDTUs. Databases with no load will consume no eDTUs. By provisioning resources for the entire pool, rather than per database, management tasks are simplified, providing a predictable budget for the pool.

Additional eDTUs can be added to an existing pool with no database downtime and with no impact on the databases in the pool. Similarly, if extra eDTUs are no longer needed, they can be removed from an existing pool at any point in time. You can add or subtract databases to the pool or limit the amount of eDTUs a database can use under heavy load to reserve eDTUs for other databases. If a database is predictably under-utilizing resources, you can move it out of the pool and configure it as a single database with a predictable amount of required resources.

## How can I determine the number of DTUs needed by my workload?
If you are looking to migrate an existing on-premises or SQL Server virtual machine workload to Azure SQL Database, you can use the [DTU Calculator](http://dtucalculator.azurewebsites.net/) to approximate the number of DTUs needed. For an existing Azure SQL Database workload, you can use [SQL Database Query Performance Insight](sql-database-query-performance.md) to understand your database resource consumption (DTUs) to gain deeper insight for optimizing your workload. You can also use the [sys.dm_db_ resource_stats](https://msdn.microsoft.com/library/dn800981.aspx) DMV to view resource consumption for the last hour. Alternatively, the catalog view [sys.resource_stats](http://msdn.microsoft.com/library/dn269979.aspx) displays resource consumption for the last 14 days, but at a lower fidelity of five-minute averages.

## How do I know if I could benefit from an elastic pool of resources?
Pools are suited for a large number of databases with specific utilization patterns. For a given database, this pattern is characterized by a low utilization average with relatively infrequent utilization spikes. SQL Database automatically evaluates the historical resource usage of databases in an existing SQL Database server and recommends the appropriate pool configuration in the Azure portal. For more information, see [when should an elastic pool be used?](sql-database-elastic-pool.md)

## What happens when I hit my maximum DTUs?
Performance levels are calibrated and governed to provide the resources needed to run your database workload up to the maximum allowed for your selected service tier/performance level. If your workload is hitting one of the CPU/Data IO/Log IO limits, you will continue to receive the maximum level of resources allowable, but you will also likely experience increased query latencies. These limits do not result in any errors, but rather a slowdown in the workload, unless the slowdown becomes so severe that queries start timing out. If you reach the  maximum allowed concurrent user sessions/requests (worker threads), you will see explicit errors. See [Azure SQL Database resource limits]( sql-database-dtu-resource-limits.md#what-happens-when-database-and-elastic-pool-resource-limits-are-reached) for information on resource limits not related to CPU, memory, data IO, or transaction log IO.

## Next steps
* See [DTU-based purchasing model](sql-database-service-tiers-dtu.md) for information on the DTUs and eDTUs available for single databases and for elastic pools, as well as limits on resources other than CPU, memory, data IO, and transaction log IO.
* See [vCore-based purchasing model (preview)](sql-database-service-tiers-vcore.md) for information on vCore-based resource allocation and service tiers. 
* See [SQL Database Query Performance Insight](sql-database-query-performance.md) to understand your (DTUs) consumption.
* See [SQL Database benchmark overview](sql-database-benchmark-overview.md) to understand the methodology behind the OLTP benchmark workload used to determine the DTU blend.
