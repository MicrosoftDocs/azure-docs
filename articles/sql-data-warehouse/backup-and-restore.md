---
title: Azure SQL Data Warehouse backup and restore - snapshots, geo-redundant | Microsoft Docs
description: Learn how backup and restore works in Azure SQL Data Warehouse. Use data warehouse backups to restore your data warehouse to a restore point in the primary region. Use geo-redundant backups to restore to a different geographical region.
services: sql-data-warehouse
author: kevinvngo
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 09/06/2018
ms.author: kevin
ms.reviewer: igorstan
---

# Backup and restore in Azure SQL Data Warehouse
Learn how backup and restore works in Azure SQL Data Warehouse. Use data warehouse snapshots to recovery or copy your data warehouse to a previous restore point in the primary region. Use data warehouse geo-redundant backups to restore to a different geographical region. 

## What is a data warehouse snapshot?
A *data warehouse snapshot* creates a restore point you can leverage to recover or copy your data warehouse to a previous state.  Since SQL Data Warehouse is a distributed system, a data warehouse snapshot consists of many files that are located in Azure storage. Snapshots capture incremental changes from the data stored in your data warehouse.

A *data warehouse restore* is a new data warehouse that is created from a restore point of an existing or deleted data warehouse. Restoring your data warehouse is an essential part of any business continuity and disaster recovery strategy because it re-creates your data after accidental corruption or deletion. Data warehouse is also a powerful mechanism to create copies of your data warehouse for test or development purposes.  SQL Data Warehouse uses fast restore mechanisms within the same region which has been measured to take less than 20 minutes for any data size. 

## Automatic Restore Points
Snapshots are a built-in feature of the service which creates restore points. You do not have to enable this capability. Automatic restore points currently cannot be deleted by users where the service uses these restore points to maintain SLAs for recovery.

SQL Data Warehouse takes snapshots of your data warehouse throughout the day creating restore points that are available for seven days. This retention period cannot be changed. SQL Data Warehouse supports an eight-hour recovery point objective (RPO). You can restore your data warehouse in the primary region from any one of the snapshots taken in the past seven days.

To see when the last snapshot started, run this query on your online SQL Data Warehouse. 

```sql
select   top 1 *
from     sys.pdw_loader_backup_runs 
order by run_id desc
;
```

## User-Defined Restore Points
This feature enables you to manually trigger snapshots to create restore points  of your data warehouse before and after large modifications. This capability ensures that restore points are logically consistent which provides additional data protection in case of any workload interruptions or user errors for quick recovery time. User-defined restore points are available for seven days and are automatically deleted on your behalf. You cannot change the retention period of user-defined restore points. **42 user-defined restore points** are guaranteed at any point in time so they must be [deleted](https://go.microsoft.com/fwlink/?linkid=875299) before creating another restore point. You can trigger snapshots to create user-defined restore points through [PowerShell](https://docs.microsoft.com/powershell/module/azurerm.sql/new-azurermsqldatabaserestorepoint?view=azurermps-6.2.0#examples) or the Azure portal.


> [!NOTE]
> If you require restore points longer than 7 days, please vote for this capability [here](https://feedback.azure.com/forums/307516-sql-data-warehouse/suggestions/35114410-user-defined-retention-periods-for-restore-points). You can also create a user-defined restore point and restore from the newly created restore point to a new data warehouse. Once you have restored, you have the data warehouse online and can pause it indefinitely to save compute costs. The paused database incurs storage charges at the Azure Premium Storage rate. If you need an active copy of the restored data warehouse, you can resume which should take only a few minutes.
>

### Restore point retention
The following describes details on restore point retention periods:
1. SQL Data Warehouse deletes a restore point when it hits the 7-day retention period **and** when there are at least 42 total restore points (including both user-defined and automatic)
2. Snapshots are not taken when a data warehouse is paused
3. The age of a restore point is measured by the absolute calendar days from the time the restore point is taken including when the data warehouse is paused
4. At any point in time, a data warehouse is guaranteed to be able to store up to 42 user-defined restore points and 42 automatic restore points as long as these restore points have not reached the 7-day retention period
5. If a snapshot is taken, the data warehouse is then paused for greater than 7 days, and then resumes, it is possible for restore point to persist until there are 42 total restore points (including both user-defined and automatic)

### Snapshot retention when a data warehouse is dropped
When you drop a data warehouse, SQL Data Warehouse creates a final snapshot and saves it for seven days. You can restore the data warehouse to the final restore point created at deletion. 

> [!IMPORTANT]
> If you delete a logical SQL server instance, all databases that belong to the instance are also deleted and cannot be recovered. You cannot restore a deleted server.
>

## Geo-backups
SQL Data Warehouse performs a geo-backup once per day to a [paired data center](../best-practices-availability-paired-regions.md). The RPO for a geo-restore is 24 hours. You can restore the geo-backup to a server in any other region where SQL Data Warehouse is supported. A geo-backup ensures you can restore data warehouse in case you cannot access the restore points in your primary region.

Geo-backups are on by default. If your data warehouse is Gen1, you can [opt out](/powershell/module/azurerm.sql/set-azurermsqldatabasegeobackuppolicy) if you wish. You cannot opt out of geo-backups for Gen2 as data protection is a built-in guaranteed.

> [!NOTE]
> If you require a shorter RPO for geo-backups, vote for this capability [here](https://feedback.azure.com/forums/307516-sql-data-warehouse). You can also create a user-defined restore point and restore from the newly created restore point to a new data warehouse in a different region. Once you have restored, you have the data warehouse online and can pause it indefinitely to save compute costs. The paused database incurs storage charges at the Azure Premium Storage rate. and then pause. Should you need an active copy of the data warehouse, you can resume which should take only a few minutes.
>


## Backup and restore costs
You will notice the Azure bill has a line item for Storage and a line item for Disaster Recovery Storage. The Storage charge is the total cost for storing your data in the primary region along with the incremental changes captured by snapshots. For a more detailed explanation on how snapshots are currently taken, refer to this [documentation](https://docs.microsoft.com/rest/api/storageservices/Understanding-How-Snapshots-Accrue-Charges?redirectedfrom=MSDN#snapshot-billing-scenarios). The geo-redundant charge covers the cost for storing the geo-backups.  

The total cost for your primary data warehouse and seven days of snapshot changes is rounded to the nearest TB. For example, if your data warehouse is 1.5 TB and the snapshots captures 100 GB, you are billed for 2 TB of data at Azure Premium Storage rates. 

If you are using geo-redundant storage, you receive a separate storage charge. The geo-redundant storage is billed at the standard Read-Access Geographically Redundant Storage (RA-GRS) rate.

For more information about SQL Data Warehouse pricing, see [SQL Data Warehouse Pricing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/) and [egress charges](https://azure.microsoft.com/pricing/details/bandwidth/) when restoring cross region.

## Restoring from restore points
Each snapshot creates a restore point that represents the time the snapshot started. To restore a data warehouse, you choose a restore point and issue a restore command.  

You can either keep the restored data warehouse and the current one, or delete one of them. If you want to replace the current data warehouse with the restored data warehouse, you can rename it using [ALTER DATABASE (Azure SQL Data Warehouse)](/sql/t-sql/statements/alter-database-azure-sql-data-warehouse) with the MODIFY NAME option. 

To restore a data warehouse, see [Restore a data warehouse using the Azure portal](sql-data-warehouse-restore-database-portal.md), [Restore a data warehouse using PowerShell](sql-data-warehouse-restore-database-powershell.md), or [Restore a data warehouse using T-SQL](sql-data-warehouse-restore-database-rest-api.md).

To restore a deleted or paused data warehouse, you can [create a support ticket](sql-data-warehouse-get-started-create-support-ticket.md). 


## Geo-redundant restore
You can [restore your data warehouse](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-restore-database-powershell#restore-from-an-azure-geographical-region) to any region supporting SQL Data Warehouse at your chosen performance level. 

> [!NOTE]
> To perform a geo-redundant restore you must not have opted out of this feature.
>

## Next steps
For more information about disaster planning, see [Business continuity overview](../sql-database/sql-database-business-continuity.md)
