<properties
   pageTitle="Database restore in Azure SQL Data Warehouse (Overview) | Microsoft Azure"
   description="Overview of the database restore options for recovering a database in Azure SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="elfisher"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/05/2016"
   ms.author="elfish;barbkess;sonyama"/>


# Database restore in Azure SQL Data Warehouse (Overview)

> [AZURE.SELECTOR]
- [Overview](sql-data-warehouse-overview-manage-database-restore.md)
- [Portal](sql-data-warehouse-manage-database-restore-portal.md)
- [PowerShell](sql-data-warehouse-manage-database-restore-powershell.md)
- [REST](sql-data-warehouse-manage-database-restore-rest-api.md)

Describes the options for restoring a database in Azure SQL Data Warehouse. These include restoring a live data warehouse and a deleted data warehouse. Live and deleted data warehouses are restored from the automatic snapshots created from all data warehouses. 

## Recovery scenarios

**Recovering from infrastructure failures:** This scenario refers to recovering from infrastructure issues such as disk failures etc. A customer would like to ensure business continuity with a fault tolerant and highly available infrastructure.

**Recovering from user errors:** This scenario refers to recovering from unintentional or incidental Data Corruption or Deletion. In the event that a user unintentionally or incidentally modifies or deletes data, a customer would like to ensure business continuity by restoring the database to an earlier point in time.

## Snapshot policies

[AZURE.INCLUDE [SQL Data Warehouse backup retention policy](../../includes/sql-data-warehouse-backup-retention-policy.md)]


## Database restore capabilities

Let us take a look at how SQL Data Warehouse enhances the reliability of your database and allows for recoverability and continuous operation in the aforementioned scenarios.


### Data redundancy

SQL Data Warehouse stores all data on [locally redundant (LRS)](../storage/storage-redundancy.md) Azure Premium Storage keeping 3 copies of your data. 

### Database Restore

Database restore is designed to restore your database to an earlier point in time. Azure SQL Data Warehouse service protects all databases with automatic storage snapshots at least every 8 hours and retains them for 7 days to provide you with a discrete set of restore points. The automatic snapshot and restore features provide a zero-admin way to protect databases from accidental corruption or deletion. To learn more about database restore, refer to [Database restore tasks][].

## Next steps
For other important management tasks, see [Management overview][];

<!--Image references-->

<!--Article references-->
[Azure storage redundancy options]: ../storage/storage-redundancy.md#read-access-geo-redundant-storage
[Backup and restore tasks]: sql-data-warehouse-database-restore-portal.md
[Management overview]: sql-data-warehouse-overview-management.md

<!--MSDN references-->


<!--Other Web references-->
