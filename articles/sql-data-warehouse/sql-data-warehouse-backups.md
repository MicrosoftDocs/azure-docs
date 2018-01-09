---
title: Azure SQL Data Warehouse backups - snapshots, geo-redundant | Microsoft Docs
description: Learn about SQL Data Warehouse built-in database backups that enable you to restore an Azure SQL Data Warehouse to a restore point or a different geographical region.
services: sql-data-warehouse
documentationcenter: ''
author: barbkess
manager: jhubbard
editor: ''

ms.assetid: b5aff094-05b2-4578-acf3-ec456656febd
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.custom: backup-restore
ms.date: 10/23/2017
ms.author: jrj;barbkess

---
# Backup and restore in SQL Data Warehouse
This article explains the specifics of backups in SQL Data Warehouse. Use data warehouse backups to restore a database snapshot to the primary region, or restore a geo-backup to your geo-paired region. 

## What is a data warehouse backup?
A data warehouse backup is the copy of your database that you can use to restore a data warehouse.  Since SQL Data Warehouse is a distributed system, a data warehouse backup consists of many files that are located in Azure storage. A data warehouse backup includes both local database snapshots and geo-backups of all the databases and files that are associated with a data warehouse. 

## Local snapshot backups
SQL Data Warehouse takes snapshots of your data warehouse throughout the day. Snapshots are available for seven days. SQL Data Warehouse supports an eight hour recovery point objective (RPO). You can restore your data warehouse in the primary region to any one of the snapshots taken in the past seven days.

To see when the last snapshot started, run this query on your online SQL Data Warehouse. 

```sql
select   top 1 *
from     sys.pdw_loader_backup_runs 
order by run_id desc
;
```

## Geo-backups
SQL Data Warehouse performs a geo-backup once per day to a [paired data center](../best-practices-availability-paired-regions.md). The RPO for a geo-restore is 24 hours. You can restore the geo-backup to the server in the geo-paired region. geo-backup ensures you can restore data warehouse in case you cannot access the snapshots in your primary region.

Geo-backups are on by default. If your data warehouse is optimized for elasticity, you can [opt out](https://docs.microsoft.com/powershell/resourcemanager/Azurerm.sql/v2.1.0/Set-AzureRmSqlDatabaseGeoBackupPolicyredirectedfrom=msdn) if you wish. You cannot opt out of geo-backups with the optimized for compute performance tier.

## Backup costs
You will notice the Azure bill has a line item for Azure Premium Storage and a line item for geo-redundant storage. The Premium Storage charge is the total cost for storing your data in the primary region, which includes snapshots.  The geo-redundant charge covers the cost for storing the geo-backups.  

The total cost for your primary data warehouse and seven days of Azure Blob snapshots is rounded to the nearest TB. For example, if your data warehouse is 1.5 TB and the snapshots use 100 GB, you are billed for 2 TB of data at Azure Premium Storage rates. 

> [!NOTE]
> Each snapshot is empty initially and grows as you make changes to the primary data warehouse. All snapshots increase in size as the data warehouse changes. Therefore, the storage costs for snapshots grow according to the rate of change.
> 
> 

If you are using geo-redundant storage, you receive a separate storage charge. The geo-redundant storage is billed at the standard Read-Access Geographically Redundant Storage (RA-GRS) rate.

For more information about SQL Data Warehouse pricing, see [SQL Data Warehouse Pricing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/).

## Snapshot retention when a data warehouse is paused
SQL Data Warehouse does not create snapshots and does not expire snapshots while a data warehouse is paused. The snapshot age does not change while the data warehouse is paused. Snapshot retention is based on the number of days the data warehouse is online, not calendar days.

For example, if a snapshot starts October 1 at 4 pm and the data warehouse is paused October 3 at 4 pm, the snapshots are up to two days old. When the data warehouse comes back online the snapshot is two days old. If the data warehouse comes online October 5 at 4 pm, the snapshot is two days old and remains for five more days.

When the data warehouse comes back online, SQL Data Warehouse resumes new snapshots and expires snapshots when they have more than seven days of data.

## Can I restore a dropped data warehouse?
When you drop a data warehouse, SQL Data Warehouse creates a final snapshot and saves it for seven days. You can restore the data warehouse to the final restore point created at deletion. 

> [!IMPORTANT]
> If you delete a logical SQL server instance, all databases that belong to the instance are also deleted and cannot be recovered. You cannot restore a deleted server.
> 

## Next steps
To restore a SQL data warehouse, see [Restore a SQL data warehouse](sql-data-warehouse-restore-database-overview.md).

For a business continuity overview, see [Business continuity overview](../sql-database/sql-database-business-continuity.md)
