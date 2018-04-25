---
title: Azure SQL Data Warehouse backup and restore - snapshots, geo-redundant | Microsoft Docs
description: Learn how backup and restore works in Azure SQL Data Warehouse. Use data warehouse backups to restore your data warehouse to a restore point in the primary region. Use geo-redundant backups to restore to a different geographical region.
services: sql-data-warehouse
author: kevinvngo
manager: craigg-msft
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 04/17/2018
ms.author: kevin
ms.reviewer: igorstan
---

# Backup and restore in Azure SQL Data Warehouse
Learn how backup and restore works in Azure SQL Data Warehouse. Use data warehouse backups to restore your data warehouse to a restore point in the primary region. Use geo-redundant backups to restore to a different geographical region. 

## What is backup and restore?
A *data warehouse backup* is the copy of your database that you can use to restore a data warehouse.  Since SQL Data Warehouse is a distributed system, a data warehouse backup consists of many files that are located in Azure storage. A data warehouse backup includes both local database snapshots and geo-backups of all the databases and files that are associated with a data warehouse. 

A *data warehouse restore* is a new data warehouse that is created from a backup of an existing or deleted data warehouse. The restored data warehouse re-creates the backed-up data warehouse at a specific time. Restoring your data warehouse is an essential part of any business continuity and disaster recovery strategy because it re-creates your data after accidental corruption or deletion.

Both local and geographical restores are part of SQL Data Warehouse's disaster recovery capabilities. 

## Local snapshot backups
Local snapshot backups are a built-in feature of the service.  You do not have to enable them. 

SQL Data Warehouse takes snapshots of your data warehouse throughout the day. Snapshots are available for seven days. SQL Data Warehouse supports an eight hour recovery point objective (RPO). You can restore your data warehouse in the primary region to any one of the snapshots taken in the past seven days.

To see when the last snapshot started, run this query on your online SQL Data Warehouse. 

```sql
select   top 1 *
from     sys.pdw_loader_backup_runs 
order by run_id desc
;
```

### Snapshot retention when a data warehouse is paused
SQL Data Warehouse does not create snapshots and does not expire snapshots while a data warehouse is paused. The snapshot age does not change while the data warehouse is paused. Snapshot retention is based on the number of days the data warehouse is online, not calendar days.

For example, if a snapshot starts October 1 at 4 pm and the data warehouse is paused October 3 at 4 pm, the snapshots are up to two days old. When the data warehouse comes back online the snapshot is two days old. If the data warehouse comes online October 5 at 4 pm, the snapshot is two days old and remains for five more days.

When the data warehouse comes back online, SQL Data Warehouse resumes new snapshots and expires snapshots when they have more than seven days of data.

### Snapshot retention when a data warehouse is dropped
When you drop a data warehouse, SQL Data Warehouse creates a final snapshot and saves it for seven days. You can restore the data warehouse to the final restore point created at deletion. 

> [!IMPORTANT]
> If you delete a logical SQL server instance, all databases that belong to the instance are also deleted and cannot be recovered. You cannot restore a deleted server.
> 

## Geo-backups
SQL Data Warehouse performs a geo-backup once per day to a [paired data center](../best-practices-availability-paired-regions.md). The RPO for a geo-restore is 24 hours. You can restore the geo-backup to a server in any other region where SQL Data Warehouse is supported. A geo-backup ensures you can restore data warehouse in case you cannot access the snapshots in your primary region.

Geo-backups are on by default. If your data warehouse is optimized for elasticity, you can [opt out](/powershell/module/azurerm.sql/set-azurermsqldatabasegeobackuppolicy) if you wish. You cannot opt out of geo-backups with the optimized for compute performance tier.

## Backup costs
You will notice the Azure bill has a line item for Azure Premium Storage and a line item for geo-redundant storage. The Premium Storage charge is the total cost for storing your data in the primary region, which includes snapshots.  The geo-redundant charge covers the cost for storing the geo-backups.  

The total cost for your primary data warehouse and seven days of Azure Blob snapshots is rounded to the nearest TB. For example, if your data warehouse is 1.5 TB and the snapshots use 100 GB, you are billed for 2 TB of data at Azure Premium Storage rates. 

> [!NOTE]
> Each snapshot is empty initially and grows as you make changes to the primary data warehouse. All snapshots increase in size as the data warehouse changes. Therefore, the storage costs for snapshots grow according to the rate of change.
> 
> 

If you are using geo-redundant storage, you receive a separate storage charge. The geo-redundant storage is billed at the standard Read-Access Geographically Redundant Storage (RA-GRS) rate.

For more information about SQL Data Warehouse pricing, see [SQL Data Warehouse Pricing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/).

## Restoring from restore points
Each snapshot has a restore point that represents the time the snapshot started. To restore a data warehouse, you choose a restore point and issue a restore command.  

SQL Data Warehouse always restores the backup to a new data warehouse. You can either keep the restored data warehouse and the current one, or delete one of them. If you want to replace the current data warehouse with the restored data warehouse, you can rename it using [ALTER DATABASE (Azure SQL Data Warehouse)](/sql/t-sql/statements/alter-database-azure-sql-data-warehouse) with the MODIFY NAME option. 

To restore a data warehouse, see [Restore a data warehouse using the Azure portal](sql-data-warehouse-restore-database-portal.md), [Restore a data warehouse using PowerShell](sql-data-warehouse-restore-database-powershell.md), or [Restore a data warehouse using T-SQL](sql-data-warehouse-restore-database-rest-api.md).

To restore a deleted or paused data warehouse, you can [create a support ticket](sql-data-warehouse-get-started-create-support-ticket.md). 


## Geo-redundant restore
You can restore your data warehouse to any region supporting Azure SQL Data Warehouse at your chosen performance level. 

> [!NOTE]
> To perform a geo-redundant restore you must not have opted out of this feature.
> 
> 

## Restore timeline
You can restore a database to any available restore point within the last seven days. Snapshots start every four to eight hours, and are available for seven days. When a snapshot is older than seven days, it expires and its restore point is no longer available. 

Backups do not happen against a paused data warehouse. If your data warehouse is paused for more than seven days, you won't have any restore points. 

## Restore costs
The storage charge for the restored data warehouse is billed at the Azure Premium Storage rate. 

If you pause a restored data warehouse, you are charged for storage at the Azure Premium Storage rate. The advantage of pausing is you are not charged for the computing resources.

For more information about SQL Data Warehouse pricing, see [SQL Data Warehouse Pricing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/).

## Restore use cases
The primary use for data warehouse restore is to recover data after accidental data loss or corruption. You can also use data warehouse restore to retain a backup for longer than seven days. Once the backup is restored, you have the data warehouse online and can pause it indefinitely to save compute costs. The paused database incurs storage charges at the Azure Premium Storage rate. 

## Next steps
For more information about disaster planning, see [Business continuity overview](../sql-database/sql-database-business-continuity.md)
