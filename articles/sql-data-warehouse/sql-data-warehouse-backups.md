---
title: Azure SQL Data Warehouse backups - snapshots, geo-redundant | Microsoft Docs
description: Learn about SQL Data Warehouse built-in database backups that enable you to restore an Azure SQL Data Warehouse to a restore point or a different geographical region.
services: sql-data-warehouse
documentationcenter: ''
author: Lakshmi1812
manager: jhubbard
editor: ''

ms.assetid: b5aff094-05b2-4578-acf3-ec456656febd
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.custom: backup-restore
ms.date: 10/31/2016
ms.author: lakshmir;barbkess

---
# SQL Data Warehouse backups
SQL Data Warehouse offers both local and geographical backups as part of its data warehouse backup capabilities. These include Azure Storage Blob snapshots and geo-redundant storage. Use data warehouse backups to restore your data warehouse to a restore point in the primary region, or restore to a different geographical region. This article explains the specifics of backups in SQL Data Warehouse.

## What is a data warehouse backup?
A data warehouse backup is the data that you can use to restore a data warehouse to a specific time.  Since SQL Data Warehouse is a distributed system, a data warehouse backup consists of many files that are stored in Azure blobs. 

Database backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. For more information, see [Business continuity overview](../sql-database/sql-database-business-continuity.md).

## Data redundancy
SQL Data Warehouse protects your data by storing your data in locally redundant (LRS) Azure Premium Storage. This Azure Storage feature stores multiple synchronous copies of the data in the local data center to guarantee transparent data protection if there are localized failures. Data redundancy ensures that your data can survive infrastructure issues such as disk failures. Data redundancy ensures business continuity with a fault tolerant and highly available infrastructure.

To learn more about:

* Azure Premium storage, see [Introduction to Azure Premium Storage](../storage/storage-premium-storage.md).
* Locally Redundant storage, see [Azure Storage replication](../storage/storage-redundancy.md#locally-redundant-storage).

## Azure Storage Blob snapshots
As a benefit of using Azure Premium Storage, SQL Data Warehouse uses Azure Storage Blob snapshots to backup the data warehouse locally. You can restore a data warehouse to a snapshot restore point. Snapshots start a minimum of every eight hours and are available for seven days.  

To learn more about:

* Azure blob snapshots, see [Create a blob snapshot](../storage/storage-blob-snapshots.md).

## Geo-redundant backups
Every 24 hours, SQL Data Warehouse stores the full data warehouse in Standard storage. The full data warehouse is created to match the time of the last snapshot. The standard storage belongs to a geo-redundant storage account with read access (RA-GRS). The Azure Storage RA-GRS feature replicates the backup files to a [paired data center](../best-practices-availability-paired-regions.md). This geo-replication ensures you can restore data warehouse in case you cannot access the snapshots in your primary region. 

This feature is on by default. If you don't want to use geo-redundant backups, you can [opt out] (https://docs.microsoft.com/powershell/resourcemanager/Azurerm.sql/v2.1.0/Set-AzureRmSqlDatabaseGeoBackupPolicy?redirectedfrom=msdn). 

> [!NOTE]
> In Azure storage, the term *replication* refers to copying files from one location to another. SQL's *database replication* refers to keeping to multiple secondary databases synchronized with a primary database. 
> 
> 

To learn more about:

* Geo-redundant storage, see [Azure Storage replication](../storage/storage-redundancy.md).
* RA-GRS storage, see [Read-access geo-redundant storage](../storage/storage-redundancy.md#read-access-geo-redundant-storage).

## Data warehouse backup schedule and retention period
SQL Data Warehouse creates snapshots on your online data warehouses every four to eight hours and keeps each snapshot for seven days. You can restore your online database to one of the restore points in the past seven days. 

To see when the last snapshot started, run this query on your online SQL Data Warehouse. 

```sql
select top 1 *
from sys.pdw_loader_backup_runs 
order by run_id desc;
```

If you need to retain a snapshot for longer than seven days, you can restore a restore point to a new data warehouse. After the restore is finished, SQL Data Warehouse starts creating snapshots on the new data warehouse. If you don't make changes to the new data warehouse, the snapshots stay empty and therefore the snapshot cost is minimal. You could also pause the database to keep SQL Data Warehouse from creating snapshots.

### What happens to my backup retention while my data warehouse is paused?
SQL Data Warehouse does not create snapshots and does not expire snapshots while a data warehouse is paused. The snapshot age does not change while the data warehouse is paused. Snapshot retention is based on the number of days the data warehouse is online, not calendar days.

For example, if a snapshot starts October 1 at 4 pm and the data warehouse is paused October 3 at 4 pm, the snapshot is two days old. Whenever the data warehouse comes back online the snapshot is two days old. If the data warehouse comes online October 5 at 4 pm, the snapshot is two days old and remains for five more days.

When the data warehouse comes back online, SQL Data Warehouse resumes new snapshots and expires snapshots when they have more than seven days of data.

### How long is the retention period for a dropped data warehouse?
When a data warehouse is dropped, the data warehouse and the snapshots are saved for seven days and then removed. You can restore the data warehouse to any of the saved restore points.

> [!IMPORTANT]
> If you delete a logical SQL server instance, all databases that belong to the instance are also deleted and cannot be recovered. You cannot restore a deleted server.
> 
> 

## Data warehouse backup costs
The total cost for your primary data warehouse and seven days of Azure Blob snapshots is rounded to the nearest TB. For example, if your data warehouse is 1.5 TB and the snapshots use 100 GB, you are billed for 2 TB of data at Azure Premium Storage rates. 

> [!NOTE]
> Each snapshot is empty initially and grows as you make changes to the primary data warehouse. All snapshots increase in size as the data warehouse changes. Therefore, the storage costs for snapshots grow according to the rate of change.
> 
> 

If you are using geo-redundant storage, you receive a separate storage charge. The geo-redundant storage is billed at the standard Read-Access Geographically Redundant Storage (RA-GRS) rate.

For more information about SQL Data Warehouse pricing, see [SQL Data Warehouse Pricing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/).

## Using database backups
The primary use for SQL data warehouse backups is to restore the data warehouse to one of the restore points within the retention period.  

* To restore a SQL data warehouse, see [Restore a SQL data warehouse](sql-data-warehouse-restore-database-overview.md).

## Related topics
### Scenarios
* For a business continuity overview, see [Business continuity overview](../sql-database/sql-database-business-continuity.md)

<!-- ### Tasks -->

* To restore a data warehouse, see [Restore a SQL data warehouse](sql-data-warehouse-restore-database-overview.md)

<!-- ### Tutorials -->

