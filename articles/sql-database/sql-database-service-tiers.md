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
ms.custom: resources
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
wms.date: 04/26/2017
ms.author: janeng

---
# SQL Database options and performance: Understand what's available in each service tier

[Azure SQL Database](sql-database-technical-overview.md) offers four service tiers: **Basic**, **Standard**, **Premium**, and **Premium RS**. Each service tier has multiple performance levels to handle different workloads. Higher performance levels provide additional resources designed to deliver increasingly higher throughput. You can change service tiers and performance levels dynamically without downtime. Basic, Standard, and Premium service tiers all have an uptime SLA of 99.99%, flexible business continuity options, security features, and hourly billing. The Premium RS tier provides the same performance levels, security features and business continuity features as the Premium tier albeit at a reduced SLA.

> [!IMPORTANT]
> Premium RS databases run with a lower number of redundant copies than Premium or Standard databases. So, in the event of a service failure, you may need to recover your database from a backup with up to a 5-minute lag.
>

You can create single databases with dedicated resources within a service tier at a specific [performance level](sql-database-service-tiers.md#single-database-service-tiers-and-performance-levels). You can also create databases within an [elastic pool](sql-database-service-tiers.md#elastic-pool-service-tiers-and-performance-in-edtus) in which the resources are shared across multiple databases. The resources available for single databases are expressed in terms of Database Transaction Units (DTUs) and for elastic pools in terms of elastic Database Transaction Units (eDTUs). For more on DTUs and eDTUs, see [What is a DTU?](sql-database-what-is-a-dtu.md) 

## Choosing a service tier
The following table provides examples of the tiers best suited for different application workloads.

| Service tier | Target workloads |
| :--- | --- |
| **Basic** | Best suited for a small database, supporting typically one single active operation at a given time. Examples include databases used for development or testing, or small-scale infrequently used applications. |
| **Standard** |The go-to option for cloud applications with low to medium IO performance requirements, supporting multiple concurrent queries. Examples include workgroup or web applications. |
| **Premium** | Designed for high transactional volume with high IO performance requirements, supporting many concurrent users. Examples are databases supporting mission critical applications. |
| **Premium RS** | Designed for IO-intensive workloads that do not require the highest availability guarantees. Examples include testing high-performance workloads, or an analytical workload where the database is not the system of record. |
|||

First decide if you want to run a single database with a defined amount of dedicated resource or if you want to share a pool of resources across a group of databases. Review the [elastic pool considerations](sql-database-elastic-pool.md). To decide on a service tier, start by determining the minimum database features that you need:

| **Service tier features** | **Basic** | **Standard** | **Premium** | **Premium RS**|
| :-- | --: | --: | --: | --: |
| Maximum single database size | 2 GB | 250 GB | 4 TB*  | 500 GB  |
| Maximum database size in an elastic pool | 156 GB | 2.9 TB | 500 GB | 500 GB |
| Maximum number of databases per pool | 500  | 500 | 100 | 100 |
| Database backup retention period | 7 days | 35 days | 35 days | 35 days |
||||||

> [!IMPORTANT]
> The additional storage options are currently available in the following regions: US East2, West US, West Europe, South East Asia, Japan East, Australia East, Canada Central, and Canada East. See [Current 4 TB limitations](sql-database-service-tiers.md#current-limitations-of-p11-and-p15-databases-with-4-tb-maxsize)
>

Once you have determined the minimum service tier, you are ready to determine the performance level for the database (the number of DTUs). The standard S2 and S3 performance levels are often a good starting point. For databases with high CPU or IO requirements, the Premium performance levels are the right starting point. Premium offers more CPU and starts at 10x more IO compared to the highest Standard performance level.

## Single database service tiers and performance levels
For single databases, there are multiple performance levels within each service tier. You have the flexibility to choose the level that best meets your workload’s demands using the Azure portal, [PowerShell](scripts/sql-database-monitor-and-scale-database-powershell.md), [Transact-SQL](https://docs.microsoft.com/sql/t-sql/statements/alter-database-azure-sql-database), C#, and the REST API.  

Regardless of the number of databases hosted, your database gets a guaranteed set of resources and the expected performance characteristics of your database are not affected.

[!INCLUDE [SQL DB service tiers table](../../includes/sql-database-service-tiers-table.md)]

> [!NOTE]
> For a detailed explanation of all other rows in this service tiers table, see [Service tier capabilities and limits](sql-database-performance-guidance.md#service-tier-capabilities-and-limits).
> 

## Scaling up or scaling down a single database

After initially picking a service tier and performance level, you can scale a single database up or down dynamically based on actual experience. If you need to scale up or down, you can easily change the tiers of your database using the Azure portal, [PowerShell](scripts/sql-database-monitor-and-scale-database-powershell.md), [Transact-SQL](https://docs.microsoft.com/sql/t-sql/statements/alter-database-azure-sql-database), C#, and the REST API. 

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Azure-SQL-Database-dynamically-scale-up-or-scale-down/player]
>

Changing the service tier and/or performance level of a database creates a replica of the original database at the new performance level, and then switches connections over to the replica. No data is lost during this process but during the brief moment when we switch over to the replica, connections to the database are disabled, so some transactions in flight may be rolled back. This window varies, but is on average under 4 seconds, and in more than 99% of cases is less than 30 seconds. If there are large numbers of transactions in flight at the moment connections are disabled, this window may be longer.  

The duration of the entire scale-up process depends on both the size and service tier of the database before and after the change. For example, a 250 GB database that is changing to, from, or within a Standard service tier, should complete within 6 hours. For a database of the same size that is changing performance levels within the Premium service tier, it should complete within 3 hours.

* To downgrade a database, the database should be smaller than the maximum allowed size of the target service tier. 
* When upgrading a database with [Geo-Replication](sql-database-geo-replication-portal.md) enabled, you must first upgrade its secondary databases to the desired performance tier before upgrading the primary database.
* When downgrading from a Premium service tier, you must first terminate all Geo-Replication relationships. You can follow the steps described in the [Recover from an outage](sql-database-disaster-recovery.md) topic to stop the replication process between the primary and the active secondary databases.
* The restore service offerings are different for the various service tiers. If you are downgrading you may lose the ability to restore to a point in time, or have a lower backup retention period. For more information, see [Azure SQL Database Backup and Restore](sql-database-business-continuity.md).
* The new properties for the database are not applied until the changes are complete.

## Elastic pool service tiers and performance in eDTUs

Pools allow databases to share and consume eDTU resources without needing to assign a specific performance level to each database in the pool. For example, a single database in a Standard pool can go from using 0 eDTUs to the maximum database eDTU you set up when you configure the pool. Pools allow multiple databases with varying workloads to efficiently use eDTU resources available to the entire pool. See [Price and performance considerations for an elastic pool](sql-database-elastic-pool.md) for details.

The following table describes the characteristics of pool service tiers.

[!INCLUDE [SQL DB service tiers table for elastic pools](../../includes/sql-database-service-tiers-table-elastic-pools.md)]

Each database within a pool also adheres to the single database characteristics for that tier. For example, the Basic pool has a limit for max sessions per pool of 4800 - 28800, but an individual database within a Basic pool has a database limit of 300 sessions.

## Scaling up or scaling down an elastic pool

After initially picking a service tier and performance level, you can scale the elastic pool up or down dynamically based on actual experience. 

* Changing the min eDTUs per database or max eDTUs per database typically completes in five minutes or less.
* Time to change the pool size (eDTUs) depends on the combined size of all databases in the pool. Changes average 90 minutes or less per 100 GB. For example, if the total space of all databases in the pool is 200 GB, then the expected latency for changing the pool eDTU per pool is 3 hours or less.

For detailed steps, see [Manage an elastic pool in the Azure portal](sql-database-elastic-pool-manage-portal.md), [Manage an elastic pool with Powershell](scripts/sql-database-monitor-and-scale-pool-powershell.md), [Manage an elastic pool with Transact-SQL](sql-database-elastic-pool-manage-tsql.md), or [Manage an elastic pool with C#](sql-database-elastic-pool-manage-csharp.md).

## Creating or upgrading to 4TB

The following sections discuss implementation details for the 4 TB option.

### Creating in the Azure portal

When creating a P11/P15, the default storage option of 1TB is pre-selected. For databases located in one of the supported regions, you can increase the storage maximum to 4TB. For all other regions, the storage slider cannot be changed. The price does not change when you select 4 TB of included storage.

### Creating using PowerShell or Transact-SQL

When creating a P11/P15 database, you can set the maxsize value to either 1 TB (default) or 4 TB. Values of ‘1024 GB’ and ‘4096 GB’ are also accepted. If you choose the 4 TB maxsize option, the create command will fail with an error if the database is provisioned in an unsupported region.

### Upgrading to 4TB 

For existing P11 and P15 databases located in one of the supported regions, you can increase the maxsize storage to 4 TB. This can be done in the Azure Portal, in PowerShell or with Transact-SQL. The following example shows the maxsize being changed using the ALTER DATABASE command:

 ```sql
ALTER DATABASE <myDatabaseName> 
   MODIFY (MAXSIZE = 4096 GB);
```

Upgrading an existing P11 or P15 database can only be performed by a server-level principal login or by members of the dbmanager database role. 
If executed in a supported region the configuration will be updated immediately. This can be checked using the [SELECT DATABASEPROPERTYEX](https://msdn.microsoft.com/library/ms186823.aspx) or by inspecting the database size in the Azure portal. The database will remain online during the upgrade process. However, you will not be able to utilize the full 4 TB of storage until the actual database files have been upgraded to the new maxsize. The length of time required depends upon on the size of the database being upgraded.  

### Error messages
When creating or upgrading an P11/P15 database in an unsupported region, the create or upgrade operation will fail with the following error message: **P11 and P15 database with up to 4TB of storage are available in US East 2, West US, South East Asia, West Europe, Canada East, Canada Central, Japan East, and Australia East.**

## Current limitations of P11 and P15 databases with 4 TB maxsize

- When creating or updating a P11 or P15 database, you can only chose between 1 TB and 4 TB maxsize. Intermediate storage sizes are not currently supported.
- The 4 TB database maxsize cannot be changed to 1 TB even if the actual storage used is below 1 TB. Thus, you cannot downgrade a P11-4TB/P15-4TB to a P11-1TB/P15-1TB or a lower performance tier (e.g., to P1-P6) until we are providing additional storage options for the rest of the performance tiers. This restriction also applies to the restore and copy scenarios including point-in-time, geo-restore, long-term-backup-retention, and database copy. Once a database is configured with the 4 TB option, all restore operations of this database must be into a P11/P15 with 4 TB maxsize.
- For Active Geo-Replication scenarios:
   - Setting up a geo-replication relationship: If the primary database is P11 or P15, the secondary(ies) must also be P11 or P15; lower performance tiers will be rejected as secondaries since they are not capable of supporting 4 TB.
   - Upgrading the primary database in a geo-replication relationship: Changing the maxsize to 4 TB on a primary database will trigger the same change on the secondary database. Both upgrades must be successful for the change on the primary to take effect. Region limitations for the 4TB option apply (see above). If the secondary is in a region that does not support 4 TB, the primary will not be upgraded.
- Using the Import/Export service for loading P11-4TB/P15-4TB databases is not supported. Use SqlPackage.exe to [import](sql-database-import.md) and [export](sql-database-export.md) data.

## Next steps

* Learn the details of [elastic pools](sql-database-elastic-pool.md) and [price and performance considerations for elastic pools](sql-database-elastic-pool.md).
* Learn how to [Monitor, manage, and resize elastic pools](sql-database-elastic-pool-manage-portal.md) and [Monitor the performance of single databases](sql-database-single-database-monitor.md).
* Now that you know about the SQL Database tiers, try them out with a [free account](https://azure.microsoft.com/pricing/free-trial/) and learn [how to create your first SQL database](sql-database-get-started-portal.md).
* For migration scenarios, use the [DTU Calculator](http://dtucalculator.azurewebsites.net/) to approximate the number of DTUs needed. 

