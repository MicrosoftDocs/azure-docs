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

## Elastic database pool properties
Limits for elastic pools and elastic databases.

| Property | Description |
| :-- | :-- |
| Service tier | Basic, Standard, or Premium. The service tier determines the range in performance and storage limits that can be configured as well as business continuity choices. Every database within a pool has the same service tier as the pool. “Service tier” is also referred to as “edition”.|
| eDtu per pool | Maximum number of eDTUs that can be shared by databases in the pool. The total eDTUs used by databases in the pool cannot exceed this limit at the same point in time. |
| Storage per pool | Maximum amount of storage that can be shared by databases in the pool. The total storage used by databases in the pool cannot exceed this limit. This limit is determined by the eDTUs per pool. If this limit is exceeded, all databases become read-only. |
| Max eDTU per database | Maximum number of eDTUs that any database in the pool may use, and applies to all databases in the pool. The max eDTU per database is not a resource guarantee. |
| Min eDTU per database | Minimum number of eDTUs that any database in the pool is guaranteed, and applies to all databases in the pool. The min eDTU per database may be set to 0.  Note that the product of the number of databases in the pool and the min eDTU per database cannot exceed the eDTU per pool. |


## eDTU and storage limits for elastic pools and elastic databases


[AZURE.INCLUDE [SQL DB service tiers table for elastic databases](../../includes/sql-database-service-tiers-table-elastic-db-pools.md)]

## Elastic database jobs

With a pool, management tasks are simplified by running scripts in **[elastic jobs](sql-database-elastic-jobs-overview.md)**. An elastic database job eliminates most of tedium associated with large numbers of databases. To begin, see [Getting started with Elastic Database jobs](sql-database-elastic-jobs-getting-started.md).

For more information about other tools, see the [Elastic database tools learning map](https://azure.microsoft.com/documentation/learning-paths/sql-database-elastic-scale/).

## Business continuity features for databases in a pool

Currently in the preview, elastic databases support most [business continuity features](sql-database-business-continuity.md) that are available to single databases on V12 servers.

### Point in Time Restore

Databases in an elastic database pool are backed up automatically by the system and the backup retention policy is the same as the corresponding service tier for single databases. In sum, databases in  each tier has a different restore range:

* **Basic pool**: Restore-able to any point within the last 7 days.
* **Standard pool**: Restore-able to any point within the last 14 days.
* **Premium pool**: Restore-able to any point within the last 35 days.

During preview, databases in a pool will be restored to a new database in the same pool. Dropped databases will always be restored as a standalone database outside the pool into the lowest performance level for that service tier. For example, an elastic database in a Standard pool that is dropped will be restored as an S0 database. You can perform database restore operations through the Azure Portal or programmatically using REST API. PowerShell cmdlet support is coming soon.

### Geo-Restore

Geo-Restore allows you to recover a database in a pool to a server in a different region. During the preview, to restore a database in a pool on a different server, the target server needs to have a pool with the same name as the source pool. If needed, create a new pool on the target server and give it the same name prior to restoring the database. If a pool with the same name on the target server doesn’t exist the Geo-Restore operation will fail. For details, see [Recover using Geo-Restore](sql-database-disaster-recovery.md#recover-using-geo-restore).


### Geo-Replication

Geo-replication is available for any database in a Standard or Premium elastic database pool.  One or all databases in a geo-replication partnership can be in an elastic database pool as long as the service tiers are the same. You can configure geo-replication for elastic database pools using the [Azure portal](sql-database-geo-replication-portal.md), [PowerShell](sql-database-geo-replication-powershell.md), or [Transact-SQL](sql-database-geo-replication-transact-sql.md).

### Import and Export

Export of a database from within a pool is supported. Currently, import of a database directly into a pool is not supported, but you can import into a single database and then move the database into a pool.


<!--Image references-->
[1]: ./media/sql-database-elastic-pool/databases.png
