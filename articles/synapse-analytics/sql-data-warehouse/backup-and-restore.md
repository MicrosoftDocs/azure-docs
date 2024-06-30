---
title: Backup and restore - snapshots, geo-redundant
description: Learn how backup and restore works in Azure Synapse Analytics dedicated SQL pool. Use backups to restore your data warehouse to a restore point in the primary region. Use geo-redundant backups to restore to a different geographical region.
author: realAngryAnalytics
ms.author: stevehow
manager: joannapea
ms.reviewer: joanpo, wiassaf
ms.date: 03/21/2024
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
---

# Backup and restore dedicated SQL pools in Azure Synapse Analytics

In this article, you'll learn how to use backup and restore in Azure Synapse dedicated SQL pool. 

Use dedicated SQL pool restore points to recover or copy your data warehouse to a previous state in the primary region. Use data warehouse geo-redundant backups to restore to a different geographical region.

> [!NOTE]
> Not all features of the dedicated SQL pool in Azure Synapse workspaces apply to dedicated SQL pool (formerly SQL DW), and vice versa. To enable workspace features for an existing dedicated SQL pool (formerly SQL DW) refer to [How to enable a workspace for your dedicated SQL pool (formerly SQL DW)](workspace-connected-create.md). For more information, see [What's the difference between Azure Synapse dedicated SQL pools (formerly SQL DW) and dedicated SQL pools in an Azure Synapse Analytics workspace?](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/msft-docs-what-s-the-difference-between-synapse-formerly-sql-dw/ba-p/3597772).

## What is a data warehouse snapshot

A *data warehouse snapshot* creates a restore point you can leverage to recover or copy your data warehouse to a previous state.  Since dedicated SQL pool is a distributed system, a data warehouse snapshot consists of many files that are located in Azure storage. Snapshots capture incremental changes from the data stored in your data warehouse.

> [!NOTE]
> Dedicated SQL pool Recovery Time Objective (RTO) rates can vary. Factors that might affect the recovery (restore) time:
> - The database size
> - The location of the source and target data warehouse (in the case of a geo-restore)
> - Data warehouse snapshot can't be exported as a separate file (e.g. For Azure Storage, on-premises environment)

A *data warehouse restore* is a new data warehouse that is created from a restore point of an existing or deleted data warehouse. Restoring your data warehouse is an essential part of any business continuity and disaster recovery strategy because it re-creates your data after accidental corruption or deletion. Data warehouse snapshot is also a powerful mechanism to create copies of your data warehouse for test or development purposes.

> [!NOTE]
> Dedicated SQL pool Recovery Time Objective (RTO) rates can vary. Factors that might affect the recovery (restore) time:
> - The database size
> - The location of the source and target data warehouse (in the case of a geo-restore)

## Automatic Restore Points

Snapshots are a built-in feature that creates restore points. You do not have to enable this capability. However, the dedicated SQL pool should be in an active state for restore point creation. If it is paused frequently, automatic restore points might not be created so make sure to create user-defined restore point before pausing the dedicated SQL pool. Automatic restore points currently cannot be deleted by users as the service uses these restore points to maintain SLAs for recovery.

Snapshots of your data warehouse are taken throughout the day creating restore points that are available for seven days. This retention period cannot be changed. Dedicated SQL pool supports an eight-hour recovery point objective (RPO). You can restore your data warehouse in the primary region from any one of the snapshots taken in the past seven days.

To see when the last snapshot started, run this query on your online dedicated SQL pool.

```sql
SELECT TOP 1 *
FROM sys.pdw_loader_backup_runs
ORDER BY run_id desc;
```

> [!NOTE]
> Backups occur every four (4) hours to meet an eight (8) hour SLA. Therefore, the `sys.pdw_loader_backup_runs` dynamic management view will display backup activity every four (4) hours.

## User-defined restore points

This feature enables you to manually trigger snapshots to create restore points of your data warehouse before and after large modifications. This capability ensures that restore points are logically consistent, which provides additional data protection in case of any workload interruptions or user errors for quick recovery time. User-defined restore points are available for seven days and are automatically deleted on your behalf. You cannot change the retention period of user-defined restore points. **42 user-defined restore points** are guaranteed at any point in time so they must be [deleted](#delete-user-defined-restore-points) before creating another restore point. You can trigger snapshots to create user-defined restore points by using the Azure portal or programmatically by using the [PowerShell or REST APIs only](#create-user-defined-restore-points).

- For more information on user-defined restore points in a standalone data warehouse (formerly SQL pool), see [User-defined restore points for a dedicated SQL pool (formerly SQL DW)](sql-data-warehouse-restore-points.md).
- For more information on user-defined restore points in a dedicated SQL pool in a Synapse workspace, [User-defined restore points in Azure Synapse Analytics](../backuprestore/sqlpool-create-restore-point.md).

> [!NOTE]
> If you require restore points longer than 7 days, please [vote for this capability](https://feedback.azure.com/d365community/idea/4c446fd9-0b25-ec11-b6e6-000d3a4f07b8).

> [!NOTE]
> T-SQL script can't be used to take backup on-demand. User-defined restore points can be created by using the Azure portal or programmatically by using PowerShell or REST APIs.
> 
> In case you're looking for a Long-Term Backup (LTR) concept:
> 1. Create a new user-defined restore point, or you can use one of the automatically generated restore points.
> 1. Restore from the newly created restore point to a new data warehouse.
> 1. After you have restored, you have the dedicated SQL pool online. Pause it indefinitely to save compute costs. The paused database incurs storage charges at the Azure Synapse storage rate. 
> 
> If you need an active copy of the restored data warehouse, you can resume, which should take only a few minutes.

### Create user-defined restore points

You can create a new user-defined restore point programmatically. Choose the correct method based on the SQL pool you are using: either a standalone dedicated SQL pool (formerly SQL DW), or a dedicated SQL pool within a Synapse workspace.

**Azure PowerShell**
- For dedicated SQL pool (formerly SQL DW), use [New-AzSqlDatabaseRestorePoint](/powershell/module/az.sql/new-azsqldatabaserestorepoint)
- For dedicated SQL pool (within Synapse workspace), use [New-AzSynapseSqlPoolRestorePoint](/powershell/module/az.synapse/new-azsynapsesqlpoolrestorepoint)

**REST APIs**
- For dedicated SQL pool (formerly SQL DW), use [Restore Points - Create](/rest/api/sql/restore-points/create)
- For dedicated SQL pool (within Synapse workspace), use [Sql Pool Restore Points - Create](/rest/api/synapse/resourcemanager/sql-pool-restore-points/create)

### Delete user-defined restore points

You can delete a specific user-defined restore point programmatically. Choose the correct method based on the SQL pool you are using: either a standalone dedicated SQL pool (formerly SQL DW), or a dedicated SQL pool within a Synapse workspace.

**Azure PowerShell**
- For dedicated SQL pool (formerly SQL DW), use [Remove-AzSqlDatabaseRestorePoint](/powershell/module/az.sql/remove-azsqldatabaserestorepoint)
- For dedicated SQL pool (within Synapse workspace), use [Remove-AzSynapseSqlPoolRestorePoint](/powershell/module/az.synapse/remove-azsynapsesqlpoolrestorepoint)

**REST APIs**
- For dedicated SQL pool (formerly SQL DW), use [Restore Points - Delete](/rest/api/sql/restore-points/delete)
- For dedicated SQL pool (within Synapse workspace), use [Sql Pool Restore Points - Delete](/rest/api/synapse/resourcemanager/sql-pool-restore-points/delete)

### Restore point retention

The following lists details for restore point retention periods:

1. Dedicated SQL pool deletes a restore point when it hits the 7-day retention period **and** when there are at least 42 total restore points (including both user-defined and automatic).
1. Snapshots are not taken when a dedicated SQL pool is paused.
1. The age of a restore point is measured by the absolute calendar days from the time the restore point is taken including when the SQL pool is paused.
1. At any point in time, a dedicated SQL pool is guaranteed to be able to store up to 42 user-defined restore points or 42 automatic restore points as long as these restore points have not reached the 7-day retention period
1. If a snapshot is taken, the dedicated SQL pool is then paused for greater than 7 days, and then resumed, the restore point will persist until there are 42 total restore points (including both user-defined and automatic)

### Snapshot retention when a SQL pool is dropped

When you drop a dedicated SQL pool, a final snapshot is created and saved for seven days. You can restore the dedicated SQL pool to the final restore point created at deletion. If the dedicated SQL pool is dropped in a paused state, no snapshot is taken. In that scenario, make sure to create a user-defined restore point before dropping the dedicated SQL pool.

## Geo-backups and disaster recovery

A geo-backup is created once per day to a [paired data center](../../availability-zones/cross-region-replication-azure.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json). The RPO for a geo-restore is 24 hours. A geo-restore is always a data movement operation and the RTO will depend on the data size. Only the latest geo-backup is retained. You can restore the geo-backup to a server in any other region where dedicated SQL pool is supported. A geo-backup ensures you can restore data warehouse in case you cannot access the restore points in your primary region. 

If you do not require geo-backups for your dedicated SQL pool, you can disable them and save on disaster recovery storage costs. To do so, refer to [How to guide: Disable geo-backups for a dedicated SQL pool (formerly SQL DW)](disable-geo-backup.md). If you disable geo-backups, you will not be able to recover your dedicated SQL pool to your paired Azure region if your primary Azure data center is unavailable. 

> [!NOTE]
> If you require a shorter RPO for geo-backups, [vote for this capability](https://feedback.azure.com/d365community/idea/dc4975e5-0b25-ec11-b6e6-000d3a4f07b8). You can also create a user-defined restore point and restore from the newly created restore point to a new data warehouse in a different region. After you have restored, you have the data warehouse online and can pause it indefinitely to save compute costs. The paused database incurs storage charges at the Azure Premium Storage rate. Another common pattern for a shorter recovery point is to ingest data into primary and secondary instances of a data warehouse in parallel. In this scenario, data is ingested from a source (or sources) and persisted to two separate instances of the data warehouse (primary and secondary). To save on compute costs, you can pause the secondary instance of the warehouse. If you need an active copy of the data warehouse, you can resume, which should take only a few minutes.

## Data residency

If your paired data center is located outside of your country/region, you can ensure that your data stays within your region by provisioning your database on locally redundant storage (LRS). If your database has already been provisioned on RA-GRS (Read Only Geographically Redundant Storage, the current default) then you can opt out of geo-backups, however your database will continue to reside on storage that is replicated to a regional pair. To ensure that customer data stays within your region, you can provision or restore your dedicated SQL pool to locally redundant storage. For more information on how to provision or restore to local redundant storage, see [How-to guide for configuring single region residency for a dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics](single-region-residency.md)

To confirm that your paired data center is in a different country/region, refer to [Azure Paired Regions](../../availability-zones/cross-region-replication-azure.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

## Backup and restore costs

You will notice the Azure bill has a line item for Storage and a line item for Disaster Recovery Storage. The storage charge is the total cost for storing your data in the primary region along with the incremental changes captured by snapshots. For a more detailed explanation of how snapshots are charged, refer to  [Understanding how Snapshots Accrue Charges](/rest/api/storageservices/Understanding-How-Snapshots-Accrue-Charges?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json). The geo-redundant charge covers the cost for storing the geo-backups.  

The total cost for your primary data warehouse and seven days of snapshot changes is rounded to the nearest TB. For example, if your data warehouse is 1.5 TB and the snapshots captures 100 GB, you are billed for 2 TB of data at Azure standard storage rates.

If you are using geo-redundant storage, you receive a separate storage charge. The geo-redundant storage is billed at the standard Read-Access Geographically Redundant Storage (RA-GRS) rate.

For more information about Azure Synapse pricing, see [Azure Synapse pricing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/gen2/). You are not charged for data egress when restoring across regions.

## <a id="restoring-from-restore-points"></a> Restore from restore points

Each snapshot creates a restore point that represents the time the snapshot started. To restore a data warehouse, you choose a restore point and issue a restore command.  

You can either keep the restored data warehouse and the current one, or delete one of them. If you want to replace the current data warehouse with the restored data warehouse, you can rename it using [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) with the MODIFY NAME option.

- To restore a standalone data warehouse (formerly SQL pool), see [Restore a dedicated SQL pool (formerly SQL DW)](sql-data-warehouse-restore-points.md#create-user-defined-restore-points-through-the-azure-portal).
- To restore a dedicated SQL pool in a Synapse workspace, see [Restore an existing dedicated SQL pool](../backuprestore/restore-sql-pool.md).

- To restore a deleted standalone data warehouse (formerly SQL pool), see [Restore a deleted database (formerly SQL DW)](sql-data-warehouse-restore-deleted-dw.md), or if the entire server was deleted, see [Restore a data warehouse from a deleted server (formerly SQL DW)](sql-data-warehouse-restore-from-deleted-server.md).
- To restore a deleted dedicated SQL pool in a Synapse workspace, see [Restore a dedicated SQL pool from a deleted workspace](../backuprestore/restore-sql-pool-from-deleted-workspace.md).

> [!NOTE]
> Table-level restore is not supported in dedicated SQL Pools. You can only recover an entire database from your backup, and then copy the require table(s) by using 
>  - ETL tools activities such as [Copy Activity](../../data-factory/copy-activity-overview.md)
>  - Export and Import
>     - Export the data from the restored backup into your Data Lake by using CETAS [CETAS Example](/sql/t-sql/statements/create-external-table-as-select-transact-sql?view=sql-server-linux-ver16&preserve-view=true#d-use-create-external-table-as-select-exporting-data-as-parquet)
>     - Import the data by using [COPY](/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest&preserve-view=true) or [Polybase](../sql/load-data-overview.md#options-for-loading-with-polybase)

## Cross-subscription restore

You can perform a [cross-subscription restore](sql-data-warehouse-restore-active-paused-dw.md#restore-an-existing-dedicated-sql-pool-formerly-sql-dw-to-a-different-subscription-through-powershell).

## Geo-redundant restore

You can [restore your dedicated SQL pool](sql-data-warehouse-restore-from-geo-backup.md#restore-from-an-azure-geographical-region-through-powershell) to any region supporting dedicated SQL pool at your chosen performance level.

> [!NOTE]
> To perform a geo-redundant restore you must not have opted out of this feature.

## Support process

You can [submit a support ticket](sql-data-warehouse-get-started-create-support-ticket.md) through the Azure portal for Azure Synapse Analytics.

## Related content

- [What is dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics?](sql-data-warehouse-overview-what-is.md)
