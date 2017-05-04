---
title: What are elastic pools? Manage multiple SQL databases - Azure | Microsoft Docs
description: Manage and scale multiple SQL databases - hundreds and thousands - using elastic pools. One price for resources you can distribute where needed.
keywords: multiple databases, database resources, database performance
services: sql-database
documentationcenter: ''
author: ddove
manager: jhubbard
editor: ''

ms.assetid: b46e7fdc-2238-4b3b-a944-8ab36c5bdb8e
ms.service: sql-database
ms.custom: multiple databases
ms.devlang: NA
ms.date: 03/06/2017
ms.author: ddove
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA

---

# How elastic pools help you manage and scale multiple SQL databases

SQL Database elastic pools are a simple, cost-effective solution for managing and scaling multiple databases that have varying and unpredictable usage demands. The databases in an elastic pool are on a single Azure SQL Database server and share a set number of resources at a set price.

You can create and manage an elastic pool using the [Azure portal](sql-database-elastic-pool-manage-portal.md), [PowerShell](sql-database-elastic-pool-manage-powershell.md), [Transact-SQL](sql-database-elastic-pool-manage-tsql.md), [C#](sql-database-elastic-pool-manage-csharp.md), and the REST API. Elastic pool resources are measured in [eDTUs](sql-database-what-is-a-dtu.md).


> [!NOTE]
> Elastic pools are generally available (GA) in all Azure regions except West India where it is currently in preview.  GA of elastic pools in this region will occur as soon as possible.
>
>


## How do elastic pools help manage database resources?

A common SaaS application pattern is the single-tenant database model: each customer (database) is given their own database. Each customer has unpredictable resource requirements for memory, IO, and CPU. With these peaks and valleys of demand, how do you allocate resources efficiently and cost-effectively? Traditionally, you had two options: (1) over-provision resources based on peak usage and over pay, or (2) under-provision to save cost, at the expense of performance and customer satisfaction during peaks. Elastic pools solve this problem by ensuring that databases get the performance resources they need and when they need it. They provide a simple resource allocation mechanism within a predictable budget. To learn more about design patterns for SaaS applications using elastic pools, see [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md).

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Elastic-databases-helps-SaaS-developers-tame-explosive-growth/player]
>

In SQL Database, the relative measure of a database's ability to handle resource demands is expressed in Database Transaction Units (DTUs) for single databases and elastic Database Transaction Units (eDTUs) for databases in an elastic pool. See [Introduction to SQL Database](sql-database-technical-overview.md) to learn more about DTUs and eDTUs.

An elastic pool is given a set number of eDTUs, for a set price. Within the pool, individual databases are given the flexibility to auto-scale within set parameters. Under heavy load, a database can consume more eDTUs to meet demand. Databases under light loads consume less, and databases under no load consume no eDTUs. Provisioning resources for the entire pool rather than for single databases simplifies your management tasks. Plus you have a predictable budget for the pool.

Additional eDTUs can be added to an existing pool with no database downtime, except that the databases may need to be moved to provide the additional compute resources for the new eDTU reservation. Similarly, if extra eDTUs are no longer needed they can be removed from an existing pool at any point in time.

And you can add or subtract databases to the pool. If a database is predictably under-utilizing resources, move it out.

## Which databases go in a pool?
![SQL databases sharing eDTUs in an elastic pool.][1]

Databases that are great candidates for elastic pools typically have periods of activity and other periods of inactivity. In the example above you see the activity of a single database, 4 databases, and finally an elastic pool with 20 databases. Databases with varying activity over time are great candidates for elastic pools because they are not all active at the same time and can share eDTUs. Not all databases fit this pattern. Databases that have a more constant resource demand are better suited to the Basic, Standard, and Premium service tiers where resources are individually assigned.

[Price and performance considerations for an elastic pool](sql-database-elastic-pool-guidance.md).

## eDTU and storage limits for elastic pools

The following table describes the characteristics of Basic, Standard, and Premium elastic pools.

[!INCLUDE [SQL DB service tiers table for elastic pools](../../includes/sql-database-service-tiers-table-elastic-pools.md)]

If all DTUs of an elastic pool are used, then each database in the pool receives an equal amount of resources to process queries.  The SQL Database service provides resource sharing fairness between databases by ensuring equal slices of compute time. Elastic pool resource sharing fairness is in addition to any amount of resource otherwise guaranteed to each database when the DTU min per database is set to a non-zero value.

## Elastic pool properties

The following tables describe the limits for elastic pools and pooled databases.

### Limits for elastic pools
| Property | Description |
|:--- |:--- |
| Service tier |Basic, Standard, or Premium. The service tier determines the range in performance and storage limits that can be configured as well as business continuity choices. Every database within a pool has the same service tier as the pool. “Service tier” is also referred to as “edition.” |
| eDTUs per pool |The maximum number of eDTUs that can be shared by databases in the pool. The total eDTUs used by databases in the pool cannot exceed this limit at the same point in time. |
| Max storage per pool (GB) |The maximum amount of storage in GBs that can be shared by databases in the pool. The total storage used by databases in the pool cannot exceed this limit. This limit is determined by the eDTUs per pool. If this limit is exceeded, all databases become read-only. Max storage per pool refers to the maximum storage of the data files in the pool and does not include space used by log files. |
| Max number of databases per pool |The maximum number of databases allowed per pool. |
| Max concurrent workers per pool |The maximum number of concurrent workers (requests) available for all databases in the pool. |
| Max concurrent logins per pool |The maximum number of concurrent logins for all databases in the pool. |
| Max concurrent sessions per pool |The maximum number of sessions available for all databases in the pool. |
|||

### Limits for pooled databases
| Property | Description |
|:--- |:--- |
| Max eDTUs per database |The maximum number of eDTUs that any database in the pool may use, if available based on utilization by other databases in the pool.  Max eDTU per database is not a resource guarantee for a database.  This setting is a global setting that applies to all databases in the pool. Set max eDTUs per database high enough to handle peaks in database utilization. Some degree of overcommitting is expected since the pool generally assumes hot and cold usage patterns for databases where all databases are not simultaneously peaking. For example, suppose the peak utilization per database is 20 eDTUs and only 20% of the 100 databases in the pool are peak at the same time.  If the eDTU max per database is set to 20 eDTUs, then it is reasonable to overcommit the pool by 5 times, and set the eDTUs per pool to 400. |
| Min eDTUs per database |The minimum number of eDTUs that any database in the pool is guaranteed.  This setting is a global setting that applies to all databases in the pool. The min eDTU per database may be set to 0, and is also the default value. This property is set to anywhere between 0 and the average eDTU utilization per database. The product of the number of databases in the pool and the min eDTUs per database cannot exceed the eDTUs per pool.  For example, if a pool has 20 databases and the eDTU min per database set to 10 eDTUs, then the eDTUs per pool must be at least as large as 200 eDTUs. |
| Max storage per database (GB) |The maximum storage for a database in a pool. Pooled databases share pool storage, so database storage is limited to the smaller of remaining pool storage and max storage per database. Max storage per database refers to the maximum size of the data files and does not include the space used by log files. |
|||

## Elastic jobs
With a pool, management tasks are simplified by running scripts in **[elastic jobs](sql-database-elastic-jobs-overview.md)**. An elastic job eliminates most of tedium associated with large numbers of databases. To begin, see [Getting started with Elastic jobs](sql-database-elastic-jobs-getting-started.md).

For more information about other database tools for working with multiple databases, see [Scaling out with Azure SQL Database](sql-database-elastic-scale-introduction.md).

## Business continuity features for databases in a pool
Pooled databases generally support the same [business continuity features](sql-database-business-continuity.md) that are available to single databases.

### Point in time restore
Point-in-time-restore uses automatic database backups to recover a database in a pool to a specific point in time. See [Point-In-Time Restore](sql-database-recovery-using-backups.md#point-in-time-restore)

### Geo-Restore
Geo-Restore provides the default recovery option when a database is unavailable because of an incident in the region where the database is hosted. See [Restore an Azure SQL Database or failover to a secondary](sql-database-disaster-recovery.md)

### Active Geo-Replication
For applications that have more aggressive recovery requirements than Geo-Restore can offer, configure Active Geo-Replication using the [Azure portal](sql-database-geo-replication-portal.md), [PowerShell](sql-database-geo-replication-powershell.md), or [Transact-SQL](sql-database-geo-replication-transact-sql.md).

## Next steps

* You can create and manage an elastic pool using the [Azure portal](sql-database-elastic-pool-manage-portal.md), [PowerShell](sql-database-elastic-pool-manage-powershell.md), [Transact-SQL](sql-database-elastic-pool-manage-tsql.md), [C#](sql-database-elastic-pool-manage-csharp.md), and the REST API.
* For guidance on when to use elastic pools, see [Elastic pool guidance](sql-database-elastic-pool-guidance.md).
* For a video, see [Microsoft Virtual Academy video course on Azure SQL Database elastic capabilities](https://mva.microsoft.com/training-courses/elastic-database-capabilities-with-azure-sql-db-16554)

<!--Image references-->
[1]: ./media/sql-database-elastic-pool/databases.png
