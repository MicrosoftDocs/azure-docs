---
title: Scale single database resources - Azure SQL Database | Microsoft Docs
description: This article describes how to scale the compute and storage resources available for a single database in Azure SQL Database. 
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: CarlRabeler
ms.author: carlrab
ms.reviewer:
manager: craigg
ms.date: 10/15/2018
---
# Scale single database resources in Azure SQL Database

This article describes how to scale the compute and storage resources available for a single database in Azure SQL Database.

## vCore-based purchasing model: Change storage size

- Storage can be provisioned up to the max size limit using 1GB increments. The minimum configurable data storage is 5 GB
- Storage for a single database can be provisioned by increasing or decreasing its max size using the
 [Azure portal](https://portal.azure.com), [Transact-SQL](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql?view=azuresqldb-current#examples-1), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqldatabase), the [Azure CLI](/cli/azure/sql/db#az-sql-db-update), or the [REST API](https://docs.microsoft.com/rest/api/sql/databases/databases_update).
- SQL Database automatically allocates 30% of additional storage for the log files and 32GB per vCore for TempDB, but not to exceed 384GB. TempDB is located on an attached SSD in all service tiers.
- The price of storage for a single database is the sum of data storage and log storage amounts multiplied by the storage unit price of the service tier. The cost of TempDB is included in the vCore price. For details on the price of extra storage, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/).

> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](sql-database-file-space-management.md).

## vCore-based purchasing model: Change compute resources

After initially picking the number of vCores, you can scale a single database up or down dynamically based on actual experience using the [Azure portal](sql-database-single-databases-manage.md#manage-an-existing-sql-server), [Transact-SQL](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql?view=azuresqldb-current#examples-1), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqldatabase), the [Azure CLI](/cli/azure/sql/db#az-sql-db-update), or the [REST API](https://docs.microsoft.com/rest/api/sql/databases/databases_update).

Changing the service tier and/or compute size of a database creates a replica of the original database at the new compute size, and then switches connections over to the replica. No data is lost during this process but during the brief moment when we switch over to the replica, connections to the database are disabled, so some transactions in flight may be rolled back. The length of time for the switch-over varies, but is generally under 4 seconds is less than 30 seconds 99% of the time. If there are large numbers of transactions in flight at the moment connections are disabled, the length of time for the switch-over may be longer.

The duration of the entire scale-up process depends on both the size and service tier of the database before and after the change. For example, a 250-GB database that is changing to, from, or within a General Purpose service tier, should complete within six hours. For a database the same size that is changing compute sizes within the Business Critical service tier, the scale-up should complete within three hours.

> [!TIP]
> To monitor in-progess operations, see: [Manage operations using the SQL REST API](https://docs.microsoft.com/rest/api/sql/operations/operations_list), [Manage operations using CLI](/cli/azure/sql/db/op), [Monitor operations using T-SQL](/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database) and these two PowerShell commands: [Get-AzureRmSqlDatabaseActivity](/powershell/module/azurerm.sql/get-azurermsqldatabaseactivity) and [Stop-AzureRmSqlDatabaseActivity](/powershell/module/azurerm.sql/stop-azurermsqldatabaseactivity).

- If you are upgrading to a higher service tier or compute size, the database max size does not increase unless you explicitly specify a larger size (maxsize).
- To downgrade a database, the database used space must be smaller than the maximum allowed size of the target service tier and compute size.
- When upgrading a database with [geo-replication](sql-database-geo-replication-portal.md) enabled, upgrade its secondary databases to the desired service tier and compute size before upgrading the primary database (general guidance for best performance). When upgrading to a different, upgrading the secondary database first is required.
- When downgrading a database with [geo-replication](sql-database-geo-replication-portal.md) enabled, downgrade its primary databases to the desired service tier and compute size before downgrading the secondary database (general guidance for best performance). When downgrading to a different edition, downgrading the primary database first is required.
- The new properties for the database are not applied until the changes are complete.

## DTU-based purchasing model: Change storage size

- The DTU price for a single database includes a certain amount of storage at no additional cost. Extra storage beyond the included amount can be provisioned for an additional cost up to the max size limit in increments of 250 GB up to 1 TB, and then in increments of 256 GB beyond 1 TB. For included storage amounts and max size limits, see [Single database: Storage sizes and compute sizes](sql-database-dtu-resource-limits-single-databases.md#single-database-storage-sizes-and-compute-sizes).
- Extra storage for a single database can be provisioned by increasing its max size using the Azure portal, [Transact-SQL](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql?view=azuresqldb-current#examples-1), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqldatabase), the [Azure CLI](/cli/azure/sql/db#az-sql-db-update), or the [REST API](https://docs.microsoft.com/rest/api/sql/databases/databases_update).
- The price of extra storage for a single database is the extra storage amount multiplied by the extra storage unit price of the service tier. For details on the price of extra storage, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/).

> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](sql-database-file-space-management.md).

## DTU-based purchasing model: Change compute resources (DTUs)

After initially picking a service tier, compute size, and storage amount, you can scale a single database up or down dynamically based on actual experience using the Azure portal, [Transact-SQL](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql?view=azuresqldb-current#examples-1), [PowerShell](/powershell/module/azurerm.sql/set-azurermsqldatabase), the [Azure CLI](/cli/azure/sql/db#az-sql-db-update), or the [REST API](https://docs.microsoft.com/rest/api/sql/databases/databases_update).

The following video shows dynamically changing the service tier and compute size to increase available DTUs for a single database.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Azure-SQL-Database-dynamically-scale-up-or-scale-down/player]
>

Changing the service tier and/or compute size of a database creates a replica of the original database at the new compute size, and then switches connections over to the replica. No data is lost during this process but during the brief moment when we switch over to the replica, connections to the database are disabled, so some transactions in flight may be rolled back. The length of time for the switch-over varies, but is less than 30 seconds 99% of the time. If there are large numbers of transactions in flight at the moment connections are disabled, the length of time for the switch-over may be longer.

The duration of the entire scale-up process depends on both the size and service tier of the database before and after the change. For example, a 250-GB database that is changing to, from, or within a Standard service tier, should complete within six hours. For a database the same size that is changing compute sizes within the Premium service tier, the scale-up should complete within three hours.

> [!TIP]
> To monitor in-progress operations, see: [Manage operations using the SQL REST API](https://docs.microsoft.com/rest/api/sql/operations/operations_list), [Manage operations using CLI](/cli/azure/sql/db/op), [Monitor operations using T-SQL](/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database) and these two PowerShell commands: [Get-AzureRmSqlDatabaseActivity](/powershell/module/azurerm.sql/get-azurermsqldatabaseactivity) and [Stop-AzureRmSqlDatabaseActivity](/powershell/module/azurerm.sql/stop-azurermsqldatabaseactivity).

- If you are upgrading to a higher service tier or compute size, the database max size does not increase unless you explicitly specify a larger size (maxsize).
- To downgrade a database, the database used space must be smaller than the maximum allowed size of the target service tier and compute size.
- When downgrading from **Premium** to the **Standard** tier, an extra storage cost applies if both (1) the max size of the database is supported in the target compute size, and (2) the max size exceeds the included storage amount of the target compute size. For example, if a P1 database with a max size of 500 GB is downsized to S3, then an extra storage cost applies since S3 supports a max size of 500 GB and its included storage amount is only 250 GB. So, the extra storage amount is 500 GB – 250 GB = 250 GB. For pricing of extra storage, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/). If the actual amount of space used is less than the included storage amount, then this extra cost can be avoided by reducing the database max size to the included amount.
- When upgrading a database with [geo-replication](sql-database-geo-replication-portal.md) enabled, upgrade its secondary databases to the desired service tier and compute size before upgrading the primary database (general guidance for best performance). When upgrading to a different, upgrading the secondary database first is required.
- When downgrading a database with [geo-replication](sql-database-geo-replication-portal.md) enabled, downgrade its primary databases to the desired service tier and compute size before downgrading the secondary database (general guidance for best performance). When downgrading to a different edition, downgrading the primary database first is required.
- The restore service offerings are different for the various service tiers. If you are downgrading to the **Basic** tier, there is a lower backup retention period. See [Azure SQL Database Backups](sql-database-automated-backups.md).
- The new properties for the database are not applied until the changes are complete.

## DTU-based purchasing model: Limitations of P11 and P15 when the maximum size greater than 1 TB

A maximum size greater than 1 TB for P11 and P15 database is supported in the following regions: Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central US, France Central, Germany Central, Japan East, Japan West, Korea Central, North Central US, North Europe, South Central US, South East Asia, UK South, UK West, US East2, West US, US Gov Virginia, and West Europe. The following considerations and limitations apply to P11 and P15 databases with a maximum size greater than 1 TB:

- If you choose a maximum size greater than 1 TB when creating a database (using a value of 4 TB or 4096 GB), the create command fails with an error if the database is provisioned in an unsupported region.
- For existing P11 and P15 databases located in one of the supported regions, you can increase the maximum storage to beyond 1 TB in increments of 256 GB up to 4 TB. To see if a larger size is supported in your region, use the [DATABASEPROPERTYEX](/sql/t-sql/functions/databasepropertyex-transact-sql) function or inspect the database size in the Azure portal. Upgrading an existing P11 or P15 database can only be performed by a server-level principal login or by members of the dbmanager database role.
- If an upgrade operation is executed in a supported region the configuration is updated immediately. The database remains online during the upgrade process. However, you cannot utilize the full amount of storage beyond 1 TB of storage until the actual database files have been upgraded to the new maximum size. The length of time required depends upon on the size of the database being upgraded.
- When creating or updating a P11 or P15 database, you can only choose between 1-TB and 4-TB maximum size in increments of 256 GB. When creating a P11/P15, the default storage option of 1 TB is pre-selected. For databases located in one of the supported regions, you can increase the storage maximum to up to a maximum of 4 TB for a new or existing single database. For all other regions, the maximum size cannot be increased above 1 TB. The price does not change when you select 4 TB of included storage.
- If the maximum size of a database is set to greater than 1 TB, then it cannot be changed to 1 TB even if the actual storage used is below 1 TB. Thus, you cannot downgrade a P11 or P15 with a maximum size larger than 1 TB to a 1 TB P11 or 1 TB P15 or lower compute size, such as P1-P6). This restriction also applies to the restore and copy scenarios including point-in-time, geo-restore, long-term-backup-retention, and database copy. Once a database is configured with a maximum size greater than 1 TB, all restore operations of this database must be run into a P11/P15 with a maximum size greater than 1 TB.
- For active geo-replication scenarios:
  - Setting up a geo-replication relationship: If the primary database is P11 or P15, the secondary(ies) must also be P11 or P15; lower compute size are rejected as secondaries since they are not capable of supporting more than 1 TB.
  - Upgrading the primary database in a geo-replication relationship: Changing the maximum size to more than 1 TB on a primary database triggers the same change on the secondary database. Both upgrades must be successful for the change on the primary to take effect. Region limitations for the more than 1-TB option apply. If the secondary is in a region that does not support more than 1 TB, the primary is not upgraded.
- Using the Import/Export service for loading P11/P15 databases with more than 1 TB is not supported. Use SqlPackage.exe to [import](sql-database-import.md) and [export](sql-database-export.md) data.

## Next steps

For overall resource limits, see [SQL Database vCore-based resource limits - single databases](sql-database-vcore-resource-limits-single-databases.md) and [SQL Database DTU-based resource limits - elastic pools](sql-database-dtu-resource-limits-single-databases.md).
