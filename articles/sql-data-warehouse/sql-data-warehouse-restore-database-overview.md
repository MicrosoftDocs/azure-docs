---
title: Restore an Azure data warehouse - local and geo-redundant | Microsoft Docs
description: Overview of the database restore options for recovering a database in Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: Lakshmi1812
manager: jhubbard
editor: ''

ms.assetid: 3e01c65c-6708-4fd7-82f5-4e1b5f61d304
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: backup-restore
ms.date: 10/31/2016
ms.author: lakshmir;barbkess

---
# SQL Data Warehouse restore
> [!div class="op_single_selector"]
> * [Overview][Overview]
> * [Portal][Portal]
> * [PowerShell][PowerShell]
> * [REST][REST]
> 
> 

SQL Data Warehouse offers both local and geographical restores as part of its data warehouse disaster recovery capabilities. Use data warehouse backups to restore your data warehouse to a restore point in the primary region, or use geo-redundant backups to restore to a different geographical region. This article explains the specifics of restoring a data warehouse.

## What is a data warehouse restore?
A data warehouse restore is a new data warehouse that is created from a backup of an existing or deleted data warehouse. The restored data warehouse re-creates the backed-up data warehouse at a specific time. Since SQL Data Warehouse is a distributed system, a data warehouse restore is created from many backup files that are stored in Azure blobs. 

Database restore is an essential part of any business continuity and disaster recovery strategy because it re-creates your data after accidental corruption or deletion.

For more information, see:

* [SQL Data Warehouse backups](sql-data-warehouse-backups.md)
* [Business continuity overview](../sql-database/sql-database-business-continuity.md)

## Data warehouse restore points
As a benefit of using Azure Premium Storage, SQL Data Warehouse uses Azure Storage Blob snapshots to backup the primary data warehouse. Each snapshot has a restore point that represents the time the snapshot started. To restore a data warehouse, you choose a restore point and issue a restore command.  

SQL Data Warehouse always restores the backup to a new data warehouse. You can either keep the restored data warehouse and the current one, or delete one of them. If you want to replace the current data warehouse with the restored data warehouse, you can rename it.

If you need to restore a deleted or paused data warehouse, you can [create a support ticket](sql-data-warehouse-get-started-create-support-ticket.md). 

<!-- 
### Can I restore a deleted data warehouse?

Yes, you can restore the last available restore point.

Yes, for the next seven calendar days. When you delete a data warehouse, SQL Data Warehouse actually keeps the data warehouse and its snapshots for seven days just in case you need the data. After seven days, you won't be able to restore to any of the restore points. -->

## Geo-redundant restore
If you are using the geo-redundant storage, you can restore the data warehouse to your [paired data center](../best-practices-availability-paired-regions.md) in a different geographical region. The data warehouse is restored from the last daily backup. 

## Restore timeline
You can restore a database to any available restore point within the last seven days. Snapshots start every four to eight hours and are available for seven days. When a snapshot is older than seven days, it expires and its restore point is no longer available.

## Restore costs
The storage charge for the restored data warehouse is billed at the Azure Premium Storage rate. 

If you pause a restored data warehouse, you are charged for storage at the Azure Premium Storage rate. The advantage of pausing is you are not charged for the DWU computing resources.

For more information about SQL Data Warehouse pricing, see [SQL Data Warehouse Pricing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/).

## Uses for restore
The primary use for data warehouse restore is to recover data after accidental data loss or corruption.

You can also use data warehouse restore to retain a backup for longer than seven days. Once the backup is restored, you have the data warehouse online and can pause it indefinitely to save compute costs. The paused database incurs storage charges at the Azure Premium Storage rate. 

## Related topics
### Scenarios
* For a business continuity overview, see [Business continuity overview](../sql-database/sql-database-business-continuity.md)

<!-- ### Tasks -->

To perform a data warehouse restore, restore using:

* Azure portal, see [Restore a data warehouse using the Azure portal](sql-data-warehouse-restore-database-portal.md)
* PowerShell cmdlets, see [Restore a data warehouse using PowerShell cmdlets](sql-data-warehouse-restore-database-powershell.md)
* REST APIs, see [Restore a data warehouse using the REST APIs](sql-data-warehouse-restore-database-rest-api.md)

<!-- ### Tutorials -->

<!--Image references-->

<!--Article references-->
[Azure SQL Database business continuity overview]: ../sql-database/sql-database-business-continuity.md
[Overview]: ./sql-data-warehouse-restore-database-overview.md
[Portal]: ./sql-data-warehouse-restore-database-portal.md
[PowerShell]: ./sql-data-warehouse-restore-database-powershell.md
[REST]: ./sql-data-warehouse-restore-database-rest-api.md

<!--MSDN references-->


<!--Other Web references-->
