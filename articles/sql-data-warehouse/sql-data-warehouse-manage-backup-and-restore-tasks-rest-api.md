<properties
   pageTitle="Backup and restore in Azure SQL Data Warehouse (PowerShell) | Microsoft Azure"
   description="REST API tasks for restoring a live, deleted, or inaccessible database in Azure SQL Data Warehouse."
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

# Backup and restore a database in Azure SQL Data Warehouse (PowerShell)

> [AZURE.SELECTOR]
- [Overview](sql-data-warehouse-overview-manage-backup-and-restore.md)
- [Portal](sql-data-warehouse-manage-backup-and-restore-tasks-portal.md)
- [PowerShell](sql-data-warehouse-manage-backup-and-restore-tasks-powershell.md)
- [REST](sql-data-warehouse-manage-backup-and-restore-tasks-rest-api.md)

How to backup and restore a database in SQL Data Warehouse by using REST APIs. 

Tasks in this topic:

- Restore a live database
- Restore a deleted database
- Restore an inaccessible database from a different Azure geographical region

[AZURE.INCLUDE [SQL Data Warehouse backup retention policy](../../includes/sql-data-warehouse-backup-retention-policy.md)]

## Before you begin

**Verify your SQL Database DTU capacity.** Since SQL Data Warehouse restores to a new database on your logical SQL server, it is important to make sure the SQL server you are restoring to has enough DTU capacity for the new database. See this blog post for more information on [how to view and increase DTU quota][].

## Restore a live database

To restore a database:

1. Get the list of database restore points using the Get Database Restore Points operation.
2. Begin your restore by using the [Create database restore request][] operation.
3. Track the status of your restore by using the [Database operation status][] operation.

>[AZURE.NOTE] After the restore has completed, you can configure your recovered database by following the [Finalize a recovered database][] guide.

## Restore a deleted database

To restore a deleted database

1.	List all of your restorable deleted databases by using the [List restorable dropped databases][] operation.
2.	Get the details for the deleted database you want to restore by using the [Get restorable dropped database][] operation.
3.	Begin your restore by using the [Create database restore request][] operation.
4.	Track the status of your restore by using the [Database operation status][] operation.

>[AZURE.NOTE] After the restore has completed, you can configure your recovered database by following the [Finalize a recovered database][] guide.

## Restore from an Azure geographical region

To perform a geo-restore:

1. Get your list of recoverable databases using the [List Recoverable Databases][] operation.
2. Get the database you want to recover using the [Get Recoverable Database][] operation.
3. Create the recovery request using the [Create Database Recovery Request][] operation.
4. Track the status of the recovery using the [Database Operation Status][] operation.

### Configure your database after performing a geo-restore
This is a checklist to help get your recovered database production ready.

1. **Update Connection Strings**: Verify connection strings of your client tools are pointing to the newly recovered database.
2. **Modify Firewall Rules**: Verify the firewall rules on the target server and make sure connections from your client computers or Azure to the server and the newly recovered database are enabled.
3. **Verify Server Logins and Database Users**: Verify if all the logins used by your application exist on the server which is hosting your recovered database. Re-create the missing logins and grant them appropriate permissions on the recovered database. 
4. **Enable Auditing**: If auditing is required to access your database, you need to enable Auditing after the database recovery.

The recovered database will be TDE-enabled if the source database is TDE-enabled.


## Next steps
To learn about the business continuity features of Azure SQL Database editions, please read the [Azure SQL Database business continuity overview][].

<!--Image references-->

<!--Article references-->
[Azure SQL Database business continuity overview]: sql-database-business-continuity.md
[Finalize a recovered database]: sql-database-recovered-finalize.md
[How to install and configure Azure PowerShell]: powershell-install-configure.md

<!--MSDN references-->
[Create database restore request]: https://msdn.microsoft.com/library/azure/dn509571.aspx
[Database operation status]: https://msdn.microsoft.com/library/azure/dn720371.aspx
[Get restorable dropped database]: https://msdn.microsoft.com/library/azure/dn509574.aspx
[List restorable dropped databases]: https://msdn.microsoft.com/library/azure/dn509562.aspx
[Restore-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt693390.aspx

<!--Blog references-->
[how to view and increase DTU quota]: https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests/

<!--Other Web references-->
[Azure Portal]: https://portal.azure.com/
[Microsoft Web Platform Installer]: https://aka.ms/webpi-azps
