---
title: Backup and restore - snapshots, geo-redundant 
description: Learn how backup and restore works in Azure Synapse Analytics dedicated SQL pool. Use backups to restore your data warehouse to a restore point in the primary region. Use geo-redundant backups to restore to a different geographical region.
services: synapse-analytics
author: joannapea
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: sql-dw 
ms.date: 11/13/2020
ms.author: joanpo
ms.reviewer: igorstan
ms.custom: seo-lt-2019"
---

# Backup and restore in Azure Synapse Dedicated SQL pool

Learn how to use backup and restore in Azure Synapse Dedicated SQL pool. Use dedicated SQL pool restore points to recover or copy your data warehouse to a previous state in the primary region. Use data warehouse geo-redundant backups to restore to a different geographical region.

## What is a data warehouse snapshot

A *data warehouse snapshot* creates a restore point you can leverage to recover or copy your data warehouse to a previous state.  Since dedicated SQL pool is a distributed system, a data warehouse snapshot consists of many files that are located in Azure storage. Snapshots capture incremental changes from the data stored in your data warehouse.

A *data warehouse restore* is a new data warehouse that is created from a restore point of an existing or deleted data warehouse. Restoring your data warehouse is an essential part of any business continuity and disaster recovery strategy because it re-creates your data after accidental corruption or deletion. Data warehouse is also a powerful mechanism to create copies of your data warehouse for test or development purposes. Dedicated SQL pool restore rates can vary depending on the database size and location of the source and target data warehouse.

## Automatic Restore Points

Snapshots are a built-in feature that creates restore points. You do not have to enable this capability. However, the dedicated SQL pool should be in an active state for restore point creation. If it is paused frequently, automatic restore points may not be created so make sure to create user-defined restore point before pausing the dedicated SQL pool. Automatic restore points currently cannot be deleted by users as the service uses these restore points to maintain SLAs for recovery.

Snapshots of your data warehouse are taken throughout the day creating restore points that are available for seven days. This retention period cannot be changed. Dedicated SQL pool supports an eight-hour recovery point objective (RPO). You can restore your data warehouse in the primary region from any one of the snapshots taken in the past seven days.

To see when the last snapshot started, run this query on your online dedicated SQL pool.

```sql
select   top 1 *
from     sys.pdw_loader_backup_runs
order by run_id desc
;
```

## User-Defined Restore Points

This feature enables you to manually trigger snapshots to create restore points of your data warehouse before and after large modifications. This capability ensures that restore points are logically consistent, which provides additional data protection in case of any workload interruptions or user errors for quick recovery time. User-defined restore points are available for seven days and are automatically deleted on your behalf. You cannot change the retention period of user-defined restore points. **42 user-defined restore points** are guaranteed at any point in time so they must be [deleted](/powershell/module/azurerm.sql/remove-azurermsqldatabaserestorepoint) before creating another restore point. You can trigger snapshots to create user-defined restore points through [PowerShell](/powershell/module/az.sql/new-azsqldatabaserestorepoint?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.jsont#examples) or the Azure portal.

> [!NOTE]
> If you require restore points longer than 7 days, please vote for this capability [here](https://feedback.azure.com/forums/307516-sql-data-warehouse/suggestions/35114410-user-defined-retention-periods-for-restore-points). You can also create a user-defined restore point and restore from the newly created restore point to a new data warehouse. Once you have restored, you have the dedicated SQL pool online and can pause it indefinitely to save compute costs. The paused database incurs storage charges at the Azure Synapse storage rate. If you need an active copy of the restored data warehouse, you can resume which should take only a few minutes.

### Restore point retention

The following lists details for restore point retention periods:

1. Dedicated SQL pool deletes a restore point when it hits the 7-day retention period **and** when there are at least 42 total restore points (including both user-defined and automatic).
2. Snapshots are not taken when a dedicated SQL pool is paused.
3. The age of a restore point is measured by the absolute calendar days from the time the restore point is taken including when the SQL pool is paused.
4. At any point in time, a dedicated SQL pool is guaranteed to be able to store up to 42 user-defined restore points and 42 automatic restore points as long as these restore points have not reached the 7-day retention period
5. If a snapshot is taken, the dedicated SQL pool is then paused for greater than 7 days, and then resumed, the restore point will persist until there are 42 total restore points (including both user-defined and automatic)

### Snapshot retention when a SQL pool is dropped

When you drop a dedicated SQL pool, a final snapshot is created and saved for seven days. You can restore the dedicated SQL pool to the final restore point created at deletion. If the dedicated SQL pool is dropped in a paused state, no snapshot is taken. In that scenario, make sure to create a user-defined restore point before dropping the dedicated SQL pool.

> [!IMPORTANT]
> If you delete the server/workspace hosting a dedicated SQL pool, all databases that belong to the server/workspace are also deleted and cannot be recovered. You cannot restore a deleted server.

## Geo-backups and disaster recovery

A geo-backup is created once per day to a [paired data center](../../best-practices-availability-paired-regions.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json). The RPO for a geo-restore is 24 hours. You can restore the geo-backup to a server in any other region where dedicated SQL pool is supported. A geo-backup ensures you can restore data warehouse in case you cannot access the restore points in your primary region.

If you do not require geo-backups for your dedicated SQL pool, you can disable them and save on disaster recovery storage costs. To do so, refer to [How to guide: Disable geo-backups for a dedicated SQL pool (formerly SQL DW)](disable-geo-backup.md). Note that if you disable geo-backups, you will not be able to recover your dedicated SQL pool to your paired Azure region if your primary Azure data center is unavailable. 

> [!NOTE]
> If you require a shorter RPO for geo-backups, vote for this capability [here](https://feedback.azure.com/forums/307516-sql-data-warehouse). You can also create a user-defined restore point and restore from the newly created restore point to a new data warehouse in a different region. Once you have restored, you have the data warehouse online and can pause it indefinitely to save compute costs. The paused database incurs storage charges at the Azure Premium Storage rate. Should you need an active copy of the data warehouse, you can resume which should take only a few minutes.

## Data residency 

If your paired data center is located outside of your geographical boundary, you can ensure that your data stays within your geographical boundary by opting out of geo-redundant storage. This can be done when provisioning your dedicated SQL pool (formerly SQL DW) through the  geo-redundant storage option when creating or restoring a dedicated SQL pool (formerly SQL DW). 

To confirm that your paired data center is in a different country, refer to [Azure Paired Regions](../../best-practices-availability-paired-regions.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

## Backup and restore costs

You will notice the Azure bill has a line item for Storage and a line item for Disaster Recovery Storage. The storage charge is the total cost for storing your data in the primary region along with the incremental changes captured by snapshots. For a more detailed explanation of how snapshots are charged, refer to  [Understanding how Snapshots Accrue Charges](/rest/api/storageservices/Understanding-How-Snapshots-Accrue-Charges?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json). The geo-redundant charge covers the cost for storing the geo-backups.  

The total cost for your primary data warehouse and seven days of snapshot changes is rounded to the nearest TB. For example, if your data warehouse is 1.5 TB and the snapshots captures 100 GB, you are billed for 2 TB of data at Azure Premium Storage rates.

If you are using geo-redundant storage, you receive a separate storage charge. The geo-redundant storage is billed at the standard Read-Access Geographically Redundant Storage (RA-GRS) rate.

For more information about Azure Synapse pricing, see [Azure Synapse pricing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/gen2/). You are not charged for data egress when restoring across regions.

## Restoring from restore points

Each snapshot creates a restore point that represents the time the snapshot started. To restore a data warehouse, you choose a restore point and issue a restore command.  

You can either keep the restored data warehouse and the current one, or delete one of them. If you want to replace the current data warehouse with the restored data warehouse, you can rename it using [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) with the MODIFY NAME option.

To restore a data warehouse, see [Restore a dedicated SQL pool](sql-data-warehouse-restore-points.md#create-user-defined-restore-points-through-the-azure-portal).

To restore a deleted or paused data warehouse, you can [create a support ticket](sql-data-warehouse-get-started-create-support-ticket.md).

## Cross subscription restore

If you need to directly restore across subscription, vote for this capability [here](https://feedback.azure.com/forums/307516-sql-data-warehouse/suggestions/36256231-enable-support-for-cross-subscription-restore). Restore to a different server and ['Move'](../../azure-resource-manager/management/move-resource-group-and-subscription.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) the server across subscriptions to perform a cross subscription restore.

## Geo-redundant restore

You can [restore your dedicated SQL pool](sql-data-warehouse-restore-from-geo-backup.md#restore-from-an-azure-geographical-region-through-powershell) to any region supporting dedicated SQL pool at your chosen performance level.

> [!NOTE]
> To perform a geo-redundant restore you must not have opted out of this feature.

## Next steps

For more information about restore points, see [User-defined restore points](sql-data-warehouse-restore-points.md)