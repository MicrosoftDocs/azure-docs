<properties
   pageTitle="Restore an Azure SQL Data Warehouse (Overview) | Microsoft Azure"
   description="Overview of the database restore options for recovering a database in Azure SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sonyam"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/28/2016"
   ms.author="sonyama;barbkess"/>


# Restore an Azure SQL Data Warehouse (Overview)

> [AZURE.SELECTOR]
- [Overview][]
- [Portal][]
- [PowerShell][]
- [REST][]

Azure SQL Data Warehouse protects your data with both locally redundant storage and automated backups. Automated backups give you a zero-admin way to protect your databases from accidental corruption or deletion. In the event that a user unintentionally or incidentally modifies or deletes data, you can ensure business continuity by restoring your database to an earlier point in time. SQL Data Warehouse uses Azure Storage Snapshots to backup your database seemlessly without the need for any downtime.

## Automated backups

Your **active** databases will automatically be backed up at a minimum of every 8 hours and kept for 7 days. This allows you to restore your active database to one of several restore points in the past 7 days.

When a database is paused, new backups will stop and previous backups will roll off as they reach 7 days in age. If a database is paused for more than 7 days, the most recent backup will be saved, ensuring that you always have at least one backup.

When a database is dropped, the last backup is saved for 7 days.

Run this query on your active SQL Data Warehouse to see when the last backup was taken:

```sql
select top 1 *
from sys.pdw_loader_backup_runs 
order by run_id desc;
```

If you need to retain a backup for longer than 7 days, you can simply restore one of your restore points to a new database and then optionally pause that database so that you only pay for the storage space of that backup.

## Data redundancy

In addition to backups, SQL Data Warehouse also protects your data with [locally redundant (LRS)][] Azure Premium Storage.  Multiple synchronous copies of the data are maintained in the local data center to guarantee transparent data protection in case of localized failures. Data redundancy ensures that your data can survive infrastructure issues such as disk failures etc.  Data redundancy ensures business continuity with a fault tolerant and highly available infrastructure.

## Restore a database

Restoring a SQL Data Warehouse is a simple opertaion which can be done in the Azure portal, or automated using PowerShell or REST APIs.


## Next steps
To learn about the business continuity features of Azure SQL Database editions, please read the [Azure SQL Database business continuity overview][].

<!--Image references-->

<!--Article references-->
[Azure SQL Database business continuity overview]: ./sql-database-business-continuity.md
[locally redundant (LRS)]: ../storage/storage-redundancy.md
[Overview]: ./sql-data-warehouse-restore-database-overview.md
[Portal]: ./sql-data-warehouse-restore-database-portal.md
[PowerShell]: ./sql-data-warehouse-restore-database-powershell.md
[REST]: ./sql-data-warehouse-restore-database-rest-api.md

<!--MSDN references-->


<!--Other Web references-->
