---
title: Azure SQL Database Resource Limits | Microsoft Docs
description: This page describes some common resource limits for Azure SQL Database.
services: sql-database
documentationcenter: na
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 884e519f-23bb-4b73-a718-00658629646a
ms.service: sql-database
ms.custom: DBs & servers
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 08/25/2017
ms.author: carlrab

---
# Azure SQL Database resource limits

## Single database: Storage sizes and performance levels

For single databases, the following tables show the resources available for a single database at each service tier and performance level. You can set the service tier, performance level, and storage amount for a single database using the [Azure portal](#manage-single-database-resources-using-the-azure-portal), [Transact-SQL](sql-database-single-database-resources.md#manage-single-database-resources-using-transact-sql), [PowerShell](sql-database-single-database-resources.md#manage-single-database-resources-using-powershell), the [Azure CLI](sql-database-single-database-resources.md#manage-single-database-resources-using-the-azure-cli), or the [REST API](sql-database-single-database-resources.md#manage-single-database-resources-using-the-rest-api).

[!INCLUDE [SQL DB service tiers table](../../includes/sql-database-service-tiers-table.md)]

## Single database: change storage size

- The DTU price for a single database includes a certain amount of storage at no additional cost. Extra storage beyond the included amount can be provisioned for an additional cost up to the max size limit in increments of 250 GB up to 1 TB, and then in increments of 256 GB beyond 1 TB. For included storage amounts and max size limits, see [Single database: Storage sizes and performance levels](#single-database-storage-sizes-and-performance-levels).
- Extra storage for a single database can be provisioned by increasing its max size using the [Azure portal](#manage-single-database-resources-using-the-azure-portal), [Transact-SQL](/sql/t-sql/statements/alter-database-azure-sql-database#examples), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqldatabase), the [Azure CLI](/cli/azure/sql/db#update), or the [REST API](/rest/api/sql/databases/update).
- The price of extra storage for a single database is the extra storage amount multiplied by the extra storage unit price of the service tier. For details on the price of extra storage, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/).

## Single database: change DTUs

After initially picking a service tier, performance level, and storage amount, you can scale a single database up or down dynamically based on actual experience using the [Azure portal](#manage-single-database-resources-using-the-azure-portal), [Transact-SQL](/sql/t-sql/statements/alter-database-azure-sql-database#examples), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqldatabase), the [Azure CLI](/cli/azure/sql/db#update), or the [REST API](/rest/api/sql/databases/update). 

The following video shows dynamically changing the performance tier to increase available DTUs for a single database.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Azure-SQL-Database-dynamically-scale-up-or-scale-down/player]
>

Changing the service tier and/or performance level of a database creates a replica of the original database at the new performance level, and then switches connections over to the replica. No data is lost during this process but during the brief moment when we switch over to the replica, connections to the database are disabled, so some transactions in flight may be rolled back. The length of time for the switch-over varies, but is generally under 4 seconds is less than 30 seconds 99% of the time. If there are large numbers of transactions in flight at the moment connections are disabled, the length of time for the switch-over may be longer. 

The duration of the entire scale-up process depends on both the size and service tier of the database before and after the change. For example, a 250-GB database that is changing to, from, or within a Standard service tier, should complete within six hours. For a database the same size that is changing performance levels within the Premium service tier, the scale-up should complete within three hours.

> [!TIP]
> To check on the status of an ongoing SQL database scaling operation, you can use the following query: ```select * from sys.dm_operation_status```.
>

* If you are upgrading to a higher service tier or performance level, the database max size does not increase unless you explicitly specify a larger size (maxsize).
* To downgrade a database, the database used space must be smaller than the maximum allowed size of the target service tier and performance level. 
* When downgrading from **Premium** or **Premium RS** to the **Standard** tier, an extra storage cost applies if both (1) the max size of the database is supported in the target performance level, and (2) the max size exceeds the included storage amount of the target performance level. For example, if a P1 database with a max size of 500 GB is downsized to S3, then an extra storage cost applies since S3 supports a max size of 500 GB and its included storage amount is only 250 GB. So, the extra storage amount is 500 GB – 250 GB = 250 GB. For pricing of extra storage, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/). If the actual amount of space used is less than the included storage amount, then this extra cost can be avoided by reducing the database max size to the included amount. 
* When upgrading a database with [geo-replication](sql-database-geo-replication-portal.md) enabled, upgrade its secondary databases to the desired performance tier before upgrading the primary database (general guidance). When upgrading to a different, upgrading the secondary database first is required.
* When downgrading a database with [geo-replication](sql-database-geo-replication-portal.md) enabled, downgrade its primary databases to the desired performance tier before downgrading the secondary database (general guidance). When downgrading to a different edition, downgrading the primary database first is required.
* The restore service offerings are different for the various service tiers. If you are downgrading to the **Basic** tier, there is a lower backup retention period - see [Azure SQL Database Backups](sql-database-automated-backups.md).
* The new properties for the database are not applied until the changes are complete.

## Single database: limitations of P11 and P15 when the maximum size greater than 1 TB

A maximum size greater than 1 TB for P11 and P15 database is supported in the following regions: US East2, West US, US Gov Virginia, West Europe, Germany Central, South East Asia, Japan East, Australia East, Canada Central, and Canada East. The following considerations and limitations apply to P11 and P15 databases with a maximum size greater than 1 TB:

- If you choose a maximum size greater than 1 TB when creating a database (using a value of 4 TB or 4096 GB), the create command fails with an error if the database is provisioned in an unsupported region.
- For existing P11 and P15 databases located in one of the supported regions, you can increase the maximum storage to beyond 1 TB in increments of 256 GB up to 4 TB. To see if a larger size is supported in your region, use the [DATABASEPROPERTYEX](/t-sql/functions/databasepropertyex-transact-sql) function or inspect the database size in the Azure portal. Upgrading an existing P11 or P15 database can only be performed by a server-level principal login or by members of the dbmanager database role. 
- If an upgrade operation is executed in a supported region the configuration is updated immediately. The database remains online during the upgrade process. However, you cannot utilize the full amount of storage beyond 1 TB of storage until the actual database files have been upgraded to the new maximum size. The length of time required depends upon on the size of the database being upgraded. 
- When creating or updating a P11 or P15 database, you can only choose between 1-TB and 4-TB maximum size in increments of 256 GB. When creating a P11/P15, the default storage option of 1 TB is pre-selected. For databases located in one of the supported regions, you can increase the storage maximum to up to a maximum of 4 TB for a new or existing single database. For all other regions, the maximum size cannot be increased above 1 TB. The price does not change when you select 4 TB of included storage.
- If the maximum size of a database is set to greater than 1 TB, then it cannot be changed to 1 TB even if the actual storage used is below 1 TB. Thus, you cannot downgrade a P11 or P15 with a maximum size larger than 1 TB to a 1 TB P11 or 1 TB P15 or lower performance tier, such as P1-P6). This restriction also applies to the restore and copy scenarios including point-in-time, geo-restore, long-term-backup-retention, and database copy. Once a database is configured with a maximum size greater than 1 TB, all restore operations of this database must be run into a P11/P15 with a maximum size greater than 1 TB.
- For active geo-replication scenarios:
   - Setting up a geo-replication relationship: If the primary database is P11 or P15, the secondary(ies) must also be P11 or P15; lower performance tiers are rejected as secondaries since they are not capable of supporting more than 1 TB.
   - Upgrading the primary database in a geo-replication relationship: Changing the maximum size to more than 1 TB on a primary database triggers the same change on the secondary database. Both upgrades must be successful for the change on the primary to take effect. Region limitations for the more than 1-TB option apply. If the secondary is in a region that does not support more than 1 TB, the primary is not upgraded.
- Using the Import/Export service for loading P11/P15 databases with more than 1 TB is not supported. Use SqlPackage.exe to [import](sql-database-import.md) and [export](sql-database-export.md) data.

## Elastic pool: storage sizes and performance levels

For SQL Database elastic pools, the following tables show the resources available at each service tier and performance level. You can set the service tier, performance level, and storage amount using the [Azure portal](sql-database-elastic-pool.md#manage-elastic-pools-and-databases-using-the-azure-portal), [PowerShell](sql-database-elastic-pool.md#manage-elastic-pools-and-databases-using-powershell), the [Azure CLI](sql-database-elastic-pool.md#manage-elastic-pools-and-databases-using-the-azure-cli), or the [REST API](sql-database-elastic-pool.md#manage-elastic-pools-and-databases-using-the-rest-api).

> [!NOTE]
> The resource limits of individual databases in elastic pools are generally the same as for single databases outside of pools based on DTUs and the service tier. For example, the max concurrent workers for an S2 database is 120 workers. So, the max concurrent workers for a database in a Standard pool is also 120 workers if the max DTU per database in the pool is 50 DTUs (which is equivalent to S2).
>

[!INCLUDE [SQL DB service tiers table for elastic pools](../../includes/sql-database-service-tiers-table-elastic-pools.md)]

If all DTUs of an elastic pool are used, then each database in the pool receives an equal amount of resources to process queries. The SQL Database service provides resource sharing fairness between databases by ensuring equal slices of compute time. Elastic pool resource sharing fairness is in addition to any amount of resource otherwise guaranteed to each database when the DTU min per database is set to a non-zero value.

### Database properties for pooled databases

The following table describes the properties for pooled databases.

| Property | Description |
|:--- |:--- |
| Max eDTUs per database |The maximum number of eDTUs that any database in the pool may use, if available based on utilization by other databases in the pool. Max eDTU per database is not a resource guarantee for a database. This setting is a global setting that applies to all databases in the pool. Set max eDTUs per database high enough to handle peaks in database utilization. Some degree of overcommitting is expected since the pool generally assumes hot and cold usage patterns for databases where all databases are not simultaneously peaking. For example, suppose the peak utilization per database is 20 eDTUs and only 20% of the 100 databases in the pool are peak at the same time. If the eDTU max per database is set to 20 eDTUs, then it is reasonable to overcommit the pool by 5 times, and set the eDTUs per pool to 400. |
| Min eDTUs per database |The minimum number of eDTUs that any database in the pool is guaranteed. This setting is a global setting that applies to all databases in the pool. The min eDTU per database may be set to 0, and is also the default value. This property is set to anywhere between 0 and the average eDTU utilization per database. The product of the number of databases in the pool and the min eDTUs per database cannot exceed the eDTUs per pool. For example, if a pool has 20 databases and the eDTU min per database set to 10 eDTUs, then the eDTUs per pool must be at least as large as 200 eDTUs. |
| Max storage per database |The maximum storage for a database in a pool. Pooled databases share pool storage, so database storage is limited to the smaller of remaining pool storage and max storage per database. Max storage per database refers to the maximum size of the data files and does not include the space used by log files. |
|||
 
## Elastic pool: change storage size

- The eDTU price for an elastic pool includes a certain amount of storage at no additional cost. Extra storage beyond the included amount can be provisioned for an additional cost up to the max size limit in increments of 250 GB up to 1 TB, and then in increments of 256 GB beyond 1 TB. For included storage amounts and max size limits, see [Elastic pool: storage sizes and performance levels](#elastic-pool-storage-sizes-and-performance-levels).
- Extra storage for an elastic pool can be provisioned by increasing its max size using the [Azure portal](sql-database-elastic-pool.md#manage-elastic-pools-and-databases-using-the-azure-portal), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqlelasticpool), the [Azure CLI](/cli/azure/sql/elastic-pool#update), or the [REST API](/rest/api/sql/elasticpools#Update).
- The price of extra storage for an elastic pool is the extra storage amount multiplied by the extra storage unit price of the service tier. For details on the price of extra storage, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/).

## Elastic pool: change eDTUs

You can increase or decrease the resources available to an elastic pool based on resource needs using the [Azure portal](sql-database-elastic-pool.md#manage-elastic-pools-and-databases-using-the-azure-portal), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqlelasticpool), the [Azure CLI](/cli/azure/sql/elastic-pool#update), or the [REST API](/rest/api/sql/elasticpools#Update).

- When rescaling pool eDTUs, database connections are briefly dropped. This is the same behavior as occurs when rescaling DTUs for a single database (not in a pool). For details on the duration and impact of dropped connections for a database during rescaling operations, see [Rescaling DTUs for a single database](#single-database-change-storage-size). 
- The duration to rescale pool eDTUs can depend on the total amount of storage space used by all databases in the pool. In general, the rescaling latency averages 90 minutes or less per 100 GB. For example, if the total space used by all databases in the pool is 200 GB, then the expected latency for rescaling the pool is 3 hours or less. In some cases within the Standard or Basic tier, the rescaling latency can be under five minutes regardless of the amount of space used.
- In general, the duration to change the min eDTUs per database or max eDTUs per database is five minutes or less.
- When downsizing pool eDTUs, the pool used space must be smaller than the maximum allowed size of the target service tier and pool eDTUs.
- When rescaling pool eDTUs, an extra storage cost applies if (1) the storage max size of the pool is supported by the target pool, and (2) the storage max size exceeds the included storage amount of the target pool. For example, if a 100 eDTU Standard pool with a max size of 100 GB is downsized to a 50 eDTU Standard pool, then an extra storage cost applies since target pool supports a max size of 100 GB and its included storage amount is only 50 GB. So, the extra storage amount is 100 GB – 50 GB = 50 GB. For pricing of extra storage, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/). If the actual amount of space used is less than the included storage amount, then this extra cost can be avoided by reducing the database max size to the included amount. 

## What happens when database and elastic pool resource limits are reached?

### Compute (DTUs and eDTUs)

When database compute utilization (measured by DTUs and eDTUs) becomes high, query latency increases and can even time out. Under these conditions, queries may be queued by the service and are provided resources for execution as resource become free.
When encountering high compute utilization, mitigation options include:

- Increasing the performance level of the database or elastic pool to provide the database with more DTUs or eDTUs. See [Single database: change DTUs](#single-database-change-dtus) and [Elastic pool: change eDTUs](#elastic-pool-change-edtus).
- Optimizing queries to reduce the resource utilization of each query. For more information, see [Query Tuning/Hinting](sql-database-performance-guidance.md#query-tuning-and-hinting).

### Storage

When database space used reaches the max size limit, database inserts and updates that increase the data size fail and clients receive an [error message](sql-database-develop-error-messages.md). Database SELECTS and DELETES continue to succeed.

When encountering high space utilization, mitigation options include:

- Increasing the max size of the database or elastic pool, or change the performance level to obtain more included storage. See [SQL Database Resource Limits](sql-database-resource-limits.md).
- If the database is in an elastic pool, then alternatively the database can be moved outside of the pool so that its storage space is not shared with other databases.

### Sessions and workers (requests) 

The maximum number of concurrent sessions and workers are determined by the service tier and performance level (DTUs and eDTUs).  New requests are rejected when session or worker limits are reached, and clients receive an error message. While the number of connections available can be controlled by the application, the number of concurrent workers is often harder to estimate and control. This is especially true during peak load periods when database resource limits are reached and workers pile up due to longer running queries. 

When encountering high session or worker utilization, mitigation options include:
- Increasing the service tier or performance level of the database or elastic pool. See [Single database: change storage size](#single-database-change-storage-size), [Single database: change DTUs](#single-database-change-dtus), [Elastic pool: change storage size](#elastic-pool-change-storage-size), and [Elastic pool: change eDTUs](#elastic-pool-change-edtus).
- Optimizing queries to reduce the resource utilization of each query if the cause of increased worker utilization is due to contention for compute resources. For more information, see [Query Tuning/Hinting](sql-database-performance-guidance.md#query-tuning-and-hinting).

## Next steps

- For information about service tiers, see [Service tiers](sql-database-service-tiers.md).
- For information about single databases, see [Single database resources](sql-database-resource-limits.md).
- For information about elastic pools, see [Elastic pools](sql-database-elastic-pool.md).
- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](/azure/azure-subscription-service-limits.md).
- For information about DTUs and eDTUs, see [DTUs and eDTUs](sql-database-what-is-a-dtu.md).