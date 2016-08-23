<properties
	pageTitle="What is an Azure elastic database pool? | Microsoft Azure"
	description="Manage hundreds or thousands of databases using a pool. One price for a set of performance units can be distributed over the pool. Move databases in or out at will."
	keywords="elastic database,sql databases"
	services="sql-database"
	documentationCenter=""
	authors="CarlRabeler"
	manager="jhubbard"
	editor="cgronlun"/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="07/12/2016"
	ms.author="CarlRabeler"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# What is an Azure elastic database pool?

Elastic pools provide a simple cost effective solution to manage the performance goals for multiple databases that have widely varying and unpredictable usage patterns.

> [AZURE.NOTE] Elastic pools are generally available (GA) in all Azure regions except North Central US and West India where it is currently in preview.  GA of elastic pools in these regions will be provided as soon as possible. Also, elastic pools do not currently support databases using [in-memory OLTP or in-memory analytics](sql-database-in-memory.md).

## How it works

A common SaaS application pattern is the single-tenant database model: each customer is given their own database. Each customer (database) has unpredictable resource requirements for memory, IO, and CPU. With these peaks and valleys of demand, how do you allocate resources efficiently and cost-effectively? Traditionally, you had two options: (1) over-provision resources based on peak usage and over pay, or (2) under-provision to save cost, at the expense of performance and customer satisfaction during peaks. Elastic database pools solve this problem by ensuring that databases get the performance resources they need and when they need it. They provide a simple resource allocation mechanism within a predictable budget. To learn more about design patterns for SaaS applications using elastic pools, see [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md).

> [AZURE.VIDEO elastic-databases-helps-saas-developers-tame-explosive-growth]

In SQL Database, the relative measure of a database's ability to handle resource demands is expressed in Database Transaction Units (DTUs) for single databases and elastic DTUs (eDTUs) for elastic database pools. See the [Introduction to SQL Database](sql-database-technical-overview.md#understand-dtus) to learn more about DTUs and eDTUs.

A pool is given a set number of eDTUs, for a set price. Within the pool, individual databases are given the flexibility to auto-scale within set parameters. Under heavy load, a database can consume more eDTUs to meet demand. Databases under light loads consume less, and databases under no load consume no eDTUs. Provisioning resources for the entire pool rather than for single databases simplifies your management tasks. Plus you have a predictable budget for the pool.

Additional eDTUs can be added to an existing pool with no database downtime or no impact on the databases in the elastic pool. Similarly, if extra eDTUs are no longer needed they can be removed from an existing pool at any point in time.

And you can add or subtract databases to the pool. If a database is predictably under-utilizing resources, move it out.

## Which databases go in a pool?

![SQL databases sharing eDTUs in an elastic database pool.][1]

Databases that are great candidates for elastic database pools typically have periods of activity and other periods of inactivity. In the example above you see the activity of a single database, 4 databases, and finally an elastic database pool with 20 databases. Databases with varying activity over time are great candidates for elastic pools because they are not all active at the same time and can share eDTUs. Not all databases fit this pattern. Databases that have a more constant resource demand are better suited to the Basic, Standard, and Premium service tiers where resources are individually assigned.

[Price and performance considerations for an elastic database pool](sql-database-elastic-pool-guidance.md).


> [AZURE.NOTE] Elastic database pools are currently in preview and only available with SQL Database V12 servers.

## eDTU and storage limits for elastic pools and elastic databases

[AZURE.INCLUDE [SQL DB service tiers table for elastic databases](../../includes/sql-database-service-tiers-table-elastic-db-pools.md)]

If all DTUs of an elastic pool are used, then each database in the pool receives an equal amount of resources to process queries.  The SQL Database service provides resource sharing fairness between databases by ensuring equal slices of compute time. Elastic pool resource sharing fairness is in addition to any amount of resource otherwise guaranteed to each database when the DTU min per database is set to a non-zero value.

## Elastic database pool properties

### Limits for elastic pools

| Property | Description |
| :-- | :-- |
| Service tier | Basic, Standard, or Premium. The service tier determines the range in performance and storage limits that can be configured as well as business continuity choices. Every database within a pool has the same service tier as the pool. “Service tier” is also referred to as “edition.” |
| eDTUs per pool | The maximum number of eDTUs that can be shared by databases in the pool. The total eDTUs used by databases in the pool cannot exceed this limit at the same point in time. |
| Max storage per pool (GB) | The maximum amount of storage in GBs that can be shared by databases in the pool. The total storage used by databases in the pool cannot exceed this limit. This limit is determined by the eDTUs per pool. If this limit is exceeded, all databases become read-only. |
| Max number of databases per pool | The maximum number of databases allowed per pool. |
| Max concurrent workers per pool | The maximum number of concurrent workers (requests) available for all databases in the pool. |
| Max concurrent logins per pool | The maximum number of concurrent logins for all databases in the pool. |
| Max concurrent sessions per pool | The maximum number of sessions available for all databases in the pool. |


### Limits for elastic databases

| Property | Description |
| :-- | :-- |
| Max eDTUs per database | The maximum number of eDTUs that any database in the pool may use, if available based on utilization by other databases in the pool.  Max eDTU per database is not a resource guarantee for a database.  This setting is a global setting that applies to all databases in the pool. Set max eDTUs per database high enough to handle peaks in database utilization. Some degree of overcommitting is expected since the pool generally assumes hot and cold usage patterns for databases where all databases are not simultaneously peaking. For example, suppose the peak utilization per database is 20 eDTUs and only 20% of the 100 databases in the pool are peak at the same time.  If the eDTU max per database is set to 20 eDTUs, then it is reasonable to overcommit the pool by 5 times, and set the eDTUs per pool to 400. |
| Min eDTUs per database | The minimum number of eDTUs that any database in the pool is guaranteed.  This setting is a global setting that applies to all databases in the pool. The min eDTU per database may be set to 0, and is also the default value. This property is set to anywhere between 0 and the average eDTU utilization per database. The product of the number of databases in the pool and the min eDTUs per database cannot exceed the eDTUs per pool.  For example, if a pool has 20 databases and the eDTU min per database set to 10 eDTUs, then the eDTUs per pool must be at least as large as 200 eDTUs. |
| Max storage per database (GB) | The maximum storage for a database in a pool. Elastic databases share pool storage, so database storage is limited to the smaller of remaining pool storage and max storage per database.|


## Elastic database jobs

With a pool, management tasks are simplified by running scripts in **[elastic jobs](sql-database-elastic-jobs-overview.md)**. An elastic database job eliminates most of tedium associated with large numbers of databases. To begin, see [Getting started with Elastic Database jobs](sql-database-elastic-jobs-getting-started.md).

For more information about other tools, see the [Elastic database tools learning map](https://azure.microsoft.com/documentation/learning-paths/sql-database-elastic-scale/).

## Business continuity features for databases in a pool

Elastic databases generally support the same [business continuity features](sql-database-business-continuity.md) that are available to single databases in V12 servers.


### Point in time restore

Point-in-time-restore uses automatic database backups to recover a database in a pool to a specific point in time. See [Point-In-Time Restore](sql-database-recovery-using-backups.md#point-in-time-restore)

### Geo-Restore

Geo-Restore provides the default recovery option when a database is unavailable because of an incident in the region where the database is hosted. See [Restore an Azure SQL Database or failover to a secondary](sql-database-disaster-recovery.md) 

### Active Geo-Replication

For applications that have more aggressive recovery requirements than Geo-Restore can offer, configure Active Geo-Replication using the [Azure portal](sql-database-geo-replication-portal.md), [PowerShell](sql-database-geo-replication-powershell.md), or [Transact-SQL](sql-database-geo-replication-transact-sql.md).


<!--Image references-->
[1]: ./media/sql-database-elastic-pool/databases.png
