---
title: 'Azure SQL Database service and performance tiers | Microsoft Docs'
description: Compare SQL Database service tiers and performance levels for single databases, and introduce SQL elastic pools
keywords: database options,database performance
services: sql-database
documentationcenter: ''
author: janeng
manager: jhubbard
editor: ''

ms.assetid: f5c5c596-cd1e-451f-92a7-b70d4916e974
ms.service: sql-database
ms.custom: DBs & servers
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 06/30/2017
ms.author: janeng

---
# What performance options are available for an Azure SQL Database

[Azure SQL Database](sql-database-technical-overview.md) offers four service tiers for both single and [pooled](sql-database-elastic-pool.md) databases. These service tiers are: **Basic**, **Standard**, **Premium**, and **Premium RS**. Within each service tier are multiple performance levels to handle different workloads. Higher performance levels provide additional resources designed to deliver increasingly higher throughput. You can change service tiers and performance levels dynamically without downtime. **Basic**, **Standard** and **Premium** service tiers all have an uptime SLA of 99.99%, flexible business continuity options, security features, and hourly billing. The **Premium RS** tier provides the same performance levels as the Premium tier with a reduced SLA because it runs with a lower number of redundant copies than a database in the other service tiers. So, in the event of a service failure, you may need to recover your database from a backup with up to a 5-minute lag.

## Choosing a service tier
The following table provides examples of the tiers best suited for different application workloads.

| Service tier | Target workloads |
| :--- | --- |
| **Basic** | Best suited for a small database, supporting typically one single active operation at a given time. Examples include databases used for development or testing, or small-scale infrequently used applications. |
| **Standard** |The go-to option for cloud applications with low to medium IO performance requirements, supporting multiple concurrent queries. Examples include workgroup or web applications. |
| **Premium** | Designed for high transactional volume with high IO performance requirements, supporting many concurrent users. Examples are databases supporting mission critical applications. |
| **Premium RS** | Designed for IO-intensive workloads that do not require the highest availability guarantees. Examples include testing high-performance workloads, or an analytical workload where the database is not the system of record. |
|||

You can create single databases with dedicated resources within a service tier at a specific [performance level](sql-database-service-tiers.md#single-database-service-tiers-and-performance-levels) or you can also create databases within a [SQL elastic pool](sql-database-service-tiers.md#elastic-pool-service-tiers-and-performance-in-edtus). In a SQL elastic pool, the compute and storage resources are shared across multiple databases within a single logical server. Resources available for single databases are expressed in terms of Database Transaction Units (DTUs) and resources for a SQL elastic pools are expressed in terms of elastic Database Transaction Units (eDTUs). For more on DTUs and eDTUs, see [What are DTUs and eDTUs?](sql-database-what-is-a-dtu.md).

To decide on a service tier, start by determining the minimum database features that you need:

| **Service tier features** | **Basic** | **Standard** | **Premium** | **Premium RS**|
| :-- | --: | --: | --: | --: |
| Maximum single database size | 2 GB | 250 GB | 4 TB*  | 500 GB  |
| Maximum elastic pool size | 156 GB | 2.9 TB | 4 TB* | 750 GB |
| Maximum database size in an elastic pool | 2 GB | 250 GB | 500 GB | 500 GB |
| Maximum number of databases per pool | 500  | 500 | 100 | 100 |
| Maximum single database DTUs | 5 | 100 | 4000 | 1000 |
| Maximum DTUs per database in an elastic pool | 5 | 3000 | 4000 | 1000 |
| Database backup retention period | 7 days | 35 days | 35 days | 35 days |
||||||

> [!IMPORTANT]
> Storage up to 4 TB is currently available in the following regions: US East2, West US, US Gov Virginia, West Europe, Germany Central, South East Asia, Japan East, Australia East, Canada Central, and Canada East. See [Current 4 TB limitations](sql-database-service-tiers.md#current-limitations-of-p11-and-p15-databases-with-4-tb-maxsize)
>

Once you have determined the minimum service tier, you are ready to determine the performance level for the database (the number of DTUs). The S2 and S3 performance levels in the **Standard** tier are often a good starting point. For databases with high CPU or IO requirements, the performance levels in the **Premium** tier are the right starting point. The **Premium** tier offers more CPU and starts at 10x more IO compared to the highest performance level in the **Standard** tier.

> [!IMPORTANT]
> Review the [SQL elastic pools](sql-database-elastic-pool.md) topic for the details about SQL elastic pools. The remaindedr of this topic focuses on service tiers and performance levels for single databases.
>

## Single database service tiers and performance levels
For single databases, there are multiple performance levels within each service tier. With a single database, your database gets a guaranteed set of resources and the expected performance characteristics of your database are not affected by any other database within Azure.

[!INCLUDE [SQL DB service tiers table](../../includes/sql-database-service-tiers-table.md)]

## Scaling up or scaling down a single database

After initially picking a service tier and performance level, you can scale a single database up or down dynamically based on actual experience. 

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Azure-SQL-Database-dynamically-scale-up-or-scale-down/player]
>

Changing the service tier and/or performance level of a database creates a replica of the original database at the new performance level, and then switches connections over to the replica. No data is lost during this process but during the brief moment when we switch over to the replica, connections to the database are disabled, so some transactions in flight may be rolled back. The length of time for the switch over varies, but is generally under 4 seconds is less than 30 seconds 99% of the time. If there are large numbers of transactions in flight at the moment connections are disabled, the length of time for the switch over may be longer.  

The duration of the entire scale-up process depends on both the size and service tier of the database before and after the change. For example, a 250 GB database that is changing to, from, or within a Standard service tier, should complete within 6 hours. For a database of the same size that is changing performance levels within the Premium service tier, it should complete within 3 hours.

* To downgrade a database, the database should be smaller than the maximum allowed size of the target service tier. 
* When upgrading a database with [geo-replication](sql-database-geo-replication-portal.md) enabled, upgrade its secondary databases to the desired performance tier before upgrading the primary database (general guidance).
* When downgrading from a **Premium** service tier to a lower service tier, you must first terminate all geo-replication relationships. You can follow the steps described in the [Recover from an outage](sql-database-disaster-recovery.md) topic to stop the replication process between the primary and the secondary databases.
* The restore service offerings are different for the various service tiers. If you are downgrading you may have a lower backup retention period. For more information, see [Azure SQL Database Backups](sql-database/sql-database-automated-backups.md).
* The new properties for the database are not applied until the changes are complete.

## Current limitations of P11 and P15 databases with 4 TB maxsize

- When creating or updating a P11 or P15 database, you can only choose between 1 TB and 4 TB maxsize. Intermediate storage sizes are not currently supported. When creating a P11/P15, the default storage option of 1 TB is pre-selected. For databases located in one of the supported regions, you can increase the storage maximum to 4TB for a new or existing single database. For all other regions, max size cannot be increased above 1 TB. The price does not change when you select 4 TB of included storage.
- The 4 TB database maxsize cannot be changed to 1 TB even if the actual storage used is below 1 TB. Thus, you cannot downgrade a P11-4TB/P15-4TB to a P11-1TB/P15-1TB or a lower performance tier for example, to P1-P6) until we are providing additional storage options for the rest of the performance tiers. This restriction also applies to the restore and copy scenarios including point-in-time, geo-restore, long-term-backup-retention, and database copy. Once a database is configured with the 4 TB option, all restore operations of this database must be run into a P11/P15 with 4 TB maxsize.
- When creating or upgrading an P11/P15 database in an unsupported region, the create or upgrade operation fails with the following error message: **P11 and P15 database with up to 4TB of storage are available in US East2, West US, US Gov Virginia, West Europe, Germany Central, South East Asia, Japan East, Australia East, Canada Central, and Canada East.**
- For active geo-replication scenarios:
   - Setting up a geo-replication relationship: If the primary database is P11 or P15, the secondary(ies) must also be P11 or P15; lower performance tiers are rejected as secondaries since they are not capable of supporting 4 TB.
   - Upgrading the primary database in a geo-replication relationship: Changing the maxsize to 4 TB on a primary database triggers the same change on the secondary database. Both upgrades must be successful for the change on the primary to take effect. Region limitations for the 4TB option apply (see above). If the secondary is in a region that does not support 4 TB, the primary is not upgraded.
- Using the Import/Export service for loading P11-4TB/P15-4TB databases is not supported. Use SqlPackage.exe to [import](sql-database-import.md) and [export](sql-database-export.md) data.


## Manage single database service tiers using the Azure portal




## Manage single database service tiers using PowerShell



### Creating 4 TB

When creating a P11/P15 database, you can set the maxsize value to either 1 TB (default) or 4 TB. Values of ‘1024 GB’ and ‘4096 GB’ are also accepted. If you choose the 4 TB maxsize option, the create command fails with an error if the database is provisioned in an unsupported region.

### Upgrading to 4TB 

For existing P11 and P15 databases located in one of the supported regions, you can increase the maxsize storage to 4 TB. 





## Manage single database service tiers using the Azure CLI

## Manage single database service tiers using Transact-SQL


### Creating 4 TB

When creating a P11/P15 database, you can set the maxsize value to either 1 TB (default) or 4 TB. Values of ‘1024 GB’ and ‘4096 GB’ are also accepted. If you choose the 4 TB maxsize option, the create command fails with an error if the database is provisioned in an unsupported region.

The following example shows the maxsize being changed using the ALTER DATABASE command:

 ```sql
ALTER DATABASE <myDatabaseName> 
   MODIFY (MAXSIZE = 4096 GB);
```

Upgrading an existing P11 or P15 database can only be performed by a server-level principal login or by members of the dbmanager database role. 
If executed in a supported region the configuration is updated immediately. This can be checked using the [SELECT DATABASEPROPERTYEX](https://msdn.microsoft.com/library/ms186823.aspx) or by inspecting the database size in the Azure portal. The database remains online during the upgrade process. However, you cannot utilize the full 4 TB of storage until the actual database files have been upgraded to the new maxsize. The length of time required depends upon on the size of the database being upgraded.  




## Create and manage single databases using the REST API


## Next steps

* Learn the details of [elastic pools](sql-database-elastic-pool.md) and [price and performance considerations for elastic pools](sql-database-elastic-pool.md).
* Learn how to [Monitor, manage, and resize elastic pools](sql-database-elastic-pool-manage-portal.md) and [Monitor the performance of single databases](sql-database-single-database-monitor.md).
* Now that you know about the SQL Database tiers, try them out with a [free account](https://azure.microsoft.com/pricing/free-trial/) and learn [how to create your first SQL database](sql-database-get-started-portal.md).
* For migration scenarios, use the [DTU Calculator](http://dtucalculator.azurewebsites.net/) to approximate the number of DTUs needed. 

