<properties
	pageTitle="Elastic database pool for SQL databases | Microsoft Azure"
	description="Manage hundreds or thousands of databases using a pool. One price for a set of performance units can be distributed over the pool. Move databases in or out at will."
	keywords="elastic database,sql databases"
	services="sql-database"
	documentationCenter=""
	authors="sidneyh"
	manager="jhubbard"
	editor="cgronlun"/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="04/04/2016"
	ms.author="sidneyh"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# What is an Azure elastic database pool?

A SaaS developer must create and manage tens, hundreds, or even thousands of SQL databases. An elastic database pool simplifies the creation, maintenance, and performance management across many databases. Add or subtract databases from the pool at will. See [Create a scalable elastic database pool for SQL databases in Azure portal](sql-database-elastic-pool-create-portal.md), or [using PowerShell](sql-database-elastic-pool-create-powershell.md), or [C#](sql-database-elastic-pool-csharp.md).

For API and error details, see [Elastic database pool reference](sql-database-elastic-pool-reference.md).

## How it works

A common SaaS application pattern is the single-tenant database model: each customer is given a database. Each customer (database) has unpredictable resource requirements for memory, IO, and CPU. With these peaks and valleys of demand, how do you allocate resources? Traditionally, you had two options: (1) over-provision resources based on peak usage and over pay, or (2) under-provision to save cost, at the expense of performance and customer satisfaction during peaks. Elastic database pools solve this problem by ensuring that databases get the performance resources they need, when they need it, while  providing a simple resource allocation mechanism within a predictable budget.

> [AZURE.VIDEO elastic-databases-helps-saas-developers-tame-explosive-growth]

In SQL Database, the relative measure of a database's ability to handle resource demands is expressed in Database Transaction Units (DTUs) for single databases and elastic DTUs (eDTUs) for elastic database pools. See the [Introduction to SQL Database](sql-database-technical-overview.md#understand-dtus) to learn more about DTUs and eDTUs.

A pool is given a set number of eDTUs, for a set price. Within the pool, individual databases are given the flexibility to auto-scale within set parameters. Under heavy load a database can consume more eDTUs to meet demand. Databases under light loads consume less, and databases under no load don’t consume any eDTUs. Provisioning resources for the entire pool rather than for single databases simplifies your management tasks. Plus you have a predictable budget for the pool.

Additional eDTUs can be added to an existing pool with no database downtime or negative impact on the databases. Similarly, if extra eDTUs are no longer needed they can be removed from an existing pool at any point in time.

And you can add or subtract databases to the pool. If a database is predictably under-utilizing resources, move it out.

## Which databases go in a pool?

![SQL databases sharing eDTUs in an elastic database pool.][1]

Databases that are great candidates for elastic database pools typically have periods of activity and other periods of inactivity. In the example above you see the activity of a single database, 4 databases and finally an elastic database pool with 20 databases. Databases with varying activity over time are great candidates for elastic pools because they are not all active at the same time and can share eDTUs. Not all databases fit this pattern. Databases that have a more constant resource demand are better suited to the Basic, Standard, and Premium service tiers where resources are individually assigned.

[Price and performance considerations for an elastic database pool](sql-database-elastic-pool-guidance.md).


> [AZURE.NOTE] Elastic database pools are currently in preview and only available with SQL Database V12 servers.

## eDTU and storage limits for elastic pools and elastic databases

[AZURE.INCLUDE [SQL DB service tiers table for elastic databases](../../includes/sql-database-service-tiers-table-elastic-db-pools.md)]

## Elastic database pool properties

### Limits for elastic pools

| Property | Description |
| :-- | :-- |
| Service tier | Basic, Standard, or Premium. The service tier determines the range in performance and storage limits that can be configured as well as business continuity choices. Every database within a pool has the same service tier as the pool. “Service tier” is also referred to as “edition.” |
| eDtus per pool | Maximum number of eDTUs that can be shared by databases in the pool. The total eDTUs used by databases in the pool cannot exceed this limit at the same point in time. For every eDTU that you allocate to the pool, you get a fixed amount of database storage, and vice versa. |
| Max storage per pool (GB) | Maximum amount of storage in GBs that can be shared by databases in the pool. The total storage used by databases in the pool cannot exceed this limit. This limit is determined by the eDTUs per pool. If this limit is exceeded, all databases become read-only. |
| Max number of databases per pool | Maximum number of databases per pool. |
| Max concurrent workers per pool | The maximum number of concurrent worker threads available for SQL processes in the pool. |
| Max concurrent logins per pool | The maximum number of concurrent logins for all databases in the pool. |
| Max concurrent sessions per pool | The maximum number of sessions available for all databases in the pool. |


### Limits for elastic databases

| Property | Description |
| :-- | :-- |
| Max eDTUs per database | Maximum number of eDTUs that any database in the pool may use, and applies to all databases in the pool. The **max eDTUs** is not a resource guarantee for a database, it is an eDTU ceiling that can be hit if available. This is a global setting that applies to all databases in the pool. Set max eDTUs per database high enough to handle spikes to the database's peak utilization. Some degree of overcommitting is expected since the pool generally assumes hot and cold usage patterns for databases where all databases are not simultaneously peaking. For example, suppose the peak utilization per database is 50 eDTUs and only 20% of the 100 databases in the group simultaneously spike to the peak. If the eDTU cap per database is set to 50 eDTUs, then it is reasonable to overcommit the pool by 5 times, and set the **eDTUs per pool** to 1,000. |
| Min eDTUs per database | Minimum number of eDTUs that any database in the pool is guaranteed; this applies to all databases in the pool. The min eDTUs may be set to 0.  This property is usually set to anywhere between 0 and the average historical eDTU utilization per database. Note that the product of the number of databases in the pool and the min eDTUs per database cannot exceed the eDTUs per pool. |
| Max storage per database (GB) | The maximum storage for a database in a pool. |


## Elastic database jobs

With a pool, management tasks are simplified by running scripts in **[elastic jobs](sql-database-elastic-jobs-overview.md)**. An elastic database job eliminates most of tedium associated with large numbers of databases. To begin, see [Getting started with Elastic Database jobs](sql-database-elastic-jobs-getting-started.md).

For more information about other tools, see the [Elastic database tools learning map](https://azure.microsoft.com/documentation/learning-paths/sql-database-elastic-scale/).

## Business continuity features for databases in a pool

Currently in the preview, elastic databases support most [business continuity features](sql-database-business-continuity.md) that are available to single databases on V12 servers.


### Point in time restore

Point-in-time-restore uses automatic database backups to recover a database in a pool to a specific point in time. See [Recover an Azure SQL Database from a user error](sql-database-user-error-recovery.md)

### Geo-Restore

Geo-Restore provides the default recovery option when a database is unavailable because of an incident in the region where the database is hosted. See [Recover an Azure SQL Database from an outage](sql-database-disaster-recovery.md) 

### Active Geo-Replication

For applications that have more aggressive recovery requirements than Geo-Restore can offer, configure Active Geo-Replication using the [Azure portal](sql-database-geo-replication-portal.md), [PowerShell](sql-database-geo-replication-powershell.md), or [Transact-SQL](sql-database-geo-replication-transact-sql.md).


<!--Image references-->
[1]: ./media/sql-database-elastic-pool/databases.png
