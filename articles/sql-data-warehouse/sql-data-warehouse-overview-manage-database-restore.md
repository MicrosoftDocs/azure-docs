<properties
   pageTitle="Restoring a database in Azure SQL Data Warehouse (Overview) | Microsoft Azure"
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
   ms.date="06/02/2016"
   ms.author="elfish;barbkess;sonyama"/>


# Restoring a database in Azure SQL Data Warehouse (Overview)

> [AZURE.SELECTOR]
- [Overview](sql-data-warehouse-overview-manage-database-restore.md)
- [Portal](sql-data-warehouse-manage-database-restore-portal.md)
- [PowerShell](sql-data-warehouse-manage-database-restore-powershell.md)
- [REST](sql-data-warehouse-manage-database-restore-rest-api.md)

This article describes the options for restoring a database in Azure SQL Data Warehouse. These options include restoring a live data warehouse and a deleted data warehouse. You can restore live and deleted data warehouses from the automatic snapshots that are created from all data warehouses.

## Recovery scenarios

**Recovering from infrastructure failures:** This scenario refers to recovering from infrastructure issues, such as disk failures. You want to ensure business continuity with a fault-tolerant and highly available infrastructure.

**Recovering from user errors:** This scenario refers to recovering from unintentional or incidental data corruption or deletion. In the event that a user unintentionally or incidentally modifies or deletes data, you want to ensure business continuity by restoring the database to an earlier point in time.

## Snapshot policies

[AZURE.INCLUDE [SQL Data Warehouse backup retention policy](../../includes/sql-data-warehouse-backup-retention-policy.md)]


## Database restore capabilities

Let's take a look at how SQL Data Warehouse enhances the reliability of your database and allows for recoverability and continuous operation in the scenarios referred to earlier.


### Data redundancy

SQL Data Warehouse stores all data on [locally redundant](../storage/storage-redundancy.md) Azure Premium Storage and keeps three copies of your data.

### Database restore

The database restore features are designed to restore your database to an earlier point in time. Azure SQL Data Warehouse protects all databases with automatic storage snapshots at least every 8 hours and retains them for 7 days to provide you with a discrete set of restore points. The automatic snapshot and restore features provide a way to protect databases from accidental corruption or deletion, with no administrative overhead. To learn more about how to restore your database, see [Database restore tasks][].

## Next steps
For other important management tasks, see [Management overview][].

<!--Image references-->

<!--Article references-->
[Azure storage redundancy options]: ../storage/storage-redundancy.md#read-access-geo-redundant-storage
[Backup and restore tasks]: sql-data-warehouse-database-restore-portal.md
[Management overview]: sql-data-warehouse-overview-manage.md 
[Database restore tasks]: sql-data-warehouse-manage-database-restore-portal.md

<!--MSDN references-->


<!--Other Web references-->
