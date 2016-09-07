<properties
	pageTitle="SQL Database: What is a DTU? | Microsoft Azure"
	description="Understanding what an Azure SQL Database transaction unit is."
	keywords="database options,database performance"
	services="sql-database"
	documentationCenter=""
	authors="CarlRabeler"
	manager="jhubbard"
	editor="CarlRabeler"/>

<tags
	ms.service="sql-database"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.workload="NA"
	ms.date="09/06/2016"
	ms.author="carlrab"/>

# Explaining Database Transaction Units (DTUs) and elastic Database Transaction Units (eDTUs)

This article explains Database Transaction Units (DTUs) and elastic Database Transaction Units (eDTUs) and what happens when you hit the maximum DTUs or eDTUs.  

## What are Database Transaction Units (DTUs)

A DTU is a unit of measure of the resources that are guaranteed to be available to a standalone Azure SQL database at a specific performance level within a [standalone database service tier](sql-database-service-tiers.md#standalone-database-service-tiers-and-performance-levels). A DTU is a blended measure of CPU, memory, and data I/O and transaction log I/O in a ratio determined by an OLTP benchmark workload designed to be typical of real-world OLTP workloads. Doubling the DTUs by increasing the performance level of a database equates to doubling the set of resource available to that database. For example, a Premium P11 database with 1750 DTUs provides 350x more DTU compute power than a Basic database with 5 DTUs. To understand the methodology behind the OLTP benchmark workload used to determine the DTU blend, see [SQL Database benchmark overview](sql-database-benchmark-overview.md).

![Intro to SQL Database: Single database DTUs by tier and level](./media/sql-database-what-is-a-dtu/single_db_dtus.png)

You can [change service tiers](sql-database-scale-up.md) at any time with minimal downtime to your application (generally averaging under four seconds). For many businesses and apps, being able to create databases and dial single database performance up or down on demand is enough, especially if usage patterns are relatively predictable. But if you have unpredictable usage patterns, it can make it hard to manage costs and your business model. For this scenario, you use an elastic pool with a certain number of eDTUs.

## What are elastic Database Transaction Units (eDTUs)

An eDTU is a unit of measure of the set of resources (DTUs) that can be shared between a set of databases on an Azure SQL server - called an [elastic pool](sql-database-elastic-pool.png). Elastic pools provide a simple cost effective solution to manage the performance goals for multiple databases that have widely varying and unpredictable usage patterns. See [elastic pools and service tiers](sql-database-service-tiers.md#elastic-pool-service-tiers-and-performance-in-edtus) for more information.

![Intro to SQL Database: eDTUs by tier and level](./media/sql-database-what-is-a-dtu/sqldb_elastic_pools.png)

A pool is given a set number of eDTUs, for a set price. Within the pool, individual databases are given the flexibility to auto-scale within set parameters. Under heavy load, a database can consume more eDTUs to meet demand. Databases under light loads consume less, and databases under no load consume no eDTUs. Provisioning resources for the entire pool rather than for single databases simplifies your management tasks. Plus you have a predictable budget for the pool.

Additional eDTUs can be added to an existing pool with no database downtime or no impact on the databases in the elastic pool. Similarly, if extra eDTUs are no longer needed they can be removed from an existing pool at any point in time. You can add or subtract databases to the pool. If a database is predictably under-utilizing resources, move it out.

## How can I determine the number of DTUs needed by my workload?

If you are looking to migrate an existing on-premises or SQL Server virtual machine workload to Azure SQL Database, you can use the [DTU Calculator](http://dtucalculator.azurewebsites.net/) to approximate the number of DTUs needed. For an existing Azure SQL Database workload, you can use [SQL Database Query Performance Insight](sql-database-query-performance.md) to understand your database resource consumption (DTUs) to get deeper insight into how to optimize your workload. You can also use the [sys.dm_db_ resource_stats](https://msdn.microsoft.com/library/dn800981.aspx) DMV to get the resource consumption information for the last one hour. Alternatively, the catalog view [sys.resource_stats](http://msdn.microsoft.com/library/dn269979.aspx) can also be queried to get the same data for the last 14 days, although at a lower fidelity of five-minute averages.

## How do I know if I could benefit from an elastic pool of resources?

Pools are suited for a large number of databases with specific utilization patterns. For a given database, this pattern is characterized by low average utilization with relatively infrequent utilization spikes. SQL Database automatically evaluates the historical resource usage of databases in an existing SQL Database server and recommends the appropriate pool configuration in the Azure portal. For more information, see [when should an elastic database pool be used?](sql-database-elastic-pool-guidance.md)

## What happens when I hit my maximum DTUs

Performance levels are calibrated and governed to provide the needed resources to run your database workload up to the max limits allowed for your selected service tier/performance level. If your workload is hitting the limits in one of CPU/Data IO/Log IO limits, you continue to receive the resources at the maximum allowed level, but you are likely to see increased latencies for your queries. These limits do not result in any errors, but rather a slowdown in the workload, unless the slowdown becomes so severe that queries start timing out. If you are hitting limits of maximum allowed concurrent user sessions/requests (worker threads), you see explicit errors. See [Azure SQL Database resource limits](sql-database-resource-limits.md) for information on limit on resources other than CPU, memory, data I/O, and transaction log I/O.

## Next steps

- See [Service tier](sql-database-service-tiers.md) for information on the DTUs and eDTUs available for standalone databases and for elastic pools.
- See [Azure SQL Database resource limits](sql-database-resource-limits.md) for information on limit on resources other than CPU, memory, data I/O, and transaction log I/O.
- See [SQL Database Query Performance Insight](sql-database-query-performance.md) to understand your (DTUs) consumption.
- See [SQL Database benchmark overview](sql-database-benchmark-overview.md) to understand the methodology behind the OLTP benchmark workload used to determine the DTU blend.