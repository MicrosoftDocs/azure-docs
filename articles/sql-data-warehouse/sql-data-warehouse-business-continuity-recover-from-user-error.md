<properties
   pageTitle="Recover a database from user error in SQL Data Warehouse | Microsoft Azure"
   description="Steps for recovering a database from user error in SQL Data Warehouse. "
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sahaj08"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/26/2015"
   ms.author="sahajs"/>

# Recover a database from user error in SQL Data Warehouse

SQL Data Warehouse offers two core capabilities for recovering from user error that causes unintentional data corruption or deletion:

- Restore a live database
- Restore a deleted database

Both of these capabilities restore to a new database on the same server.

## Recover a live database
In the event of user error causing unintended data modification, you can restore the database to any of the restore points within the retention period. The database snapshots for a live database occur every 8 hours and are retained for 7 days. 

### PowerShell

Use PowerShell to programmatically perform database restore. To restore a database, use the [Start-AzureSqlDatabaseRestore][] cmdlet.

1. Select the subscription under your account that contains the database to be restored.
2. List restore points for the database (requires Azure Resource Management mode)
3. Pick the desired restore point using the RestorePointCreationDate.
3. Restore the database to the desired restore point.
4. Monitor the progress of the restore.

```
Select-AzureSubscription -SubscriptionId <Subscription_GUID>

# List database restore points
Switch-AzureMode AzureResourceManager
Get-AzureSqlDatabaseRestorePoints -ServerName "<YourServerName>" -DatabaseName "<YourDatabaseName>" -ResourceGroupName "<YourResourceGroupName>"

# Pick desired restore point using RestorePointCreationDate
$PointInTime = "<RestorePointCreationDate>"

# Get the specific database to restore
Switch-AzureMode AzureServiceManagement
$Database = Get-AzureSqlDatabase -ServerName "<YourServerName>" –DatabaseName "<YourDatabaseName>"

# Restore database
$RestoreRequest = Start-AzureSqlDatabaseRestore -SourceServerName "<YourServerName>" -SourceDatabase $Database -TargetDatabaseName "<NewDatabaseName>" -PointInTime $PointInTime

# Monitor progress of restore operation
Get-AzureSqlDatabaseOperation -ServerName "<YourServerName>" –OperationGuid $RestoreRequest.RequestID
```

Note that if your server is foo.database.windows.net, use "foo" as the -ServerName in the powershell cmdlets.

### REST API
Use REST to programmatically perform database restore.

1. Get the list of database restore points using the Get Database Restore Points operation.
2. Begin your restore by using the [Create database restore request][] operation.
3. Track the status of your restore by using the [Database operation status][] operation.

After the restore has completed, you can configure your recovered database to be used by following the [Finalize a recovered database][] guide.

## Recover a deleted database
In the event a database is deleted, you can restore the deleted database to the time of deletion. Azure SQL Data Warehouse takes a database snapshot before the database is dropped and retains it for 7 days.

### PowerShell
Use PowerShell to programmatically perform a deleted database restore. To restore a deleted database, use the [Start-AzureSqlDatabaseRestore][] cmdlet.

1. Find the deleted database and its deletion date from the list of deleted databases

```
Get-AzureSqlDatabase -RestorableDropped -ServerName "<YourServerName>"
```

2. Get the specific deleted database and start the restore.

```
$Database = Get-AzureSqlDatabase -RestorableDropped -ServerName "<YourServerName>" –DatabaseName "<YourDatabaseName>" -DeletionDate "1/01/2015 12:00:00 AM"

$RestoreRequest = Start-AzureSqlDatabaseRestore -SourceRestorableDroppedDatabase $Database –TargetDatabaseName "<NewDatabaseName>"

Get-AzureSqlDatabaseOperation –ServerName "<YourServerName>" –OperationGuid $RestoreRequest.RequestID
```

### REST API
Use REST to programmatically perform database restore.

1.	List all of your restorable deleted databases by using the [List restorable dropped databases][] operation.
2.	Get the details for the deleted database you want to restore by using the [Get restorable dropped database][] operation.
3.	Begin your restore by using the [Create database restore request][] operation.
4.	Track the status of your restore by using the [Database operation status][] operation.

After the restore has completed, you can configure your recovered database to be used by following the [Finalize a recovered database][] guide.


## Next steps
To learn about the business continuity features of other Azure SQL Database editions, please read the [Azure SQL Database business continuity overview][].


<!--Image references-->

<!--Article references-->
[Azure SQL Database business continuity overview]: sql-database/sql-database-business-continuity.md
[Finalize a recovered database]: sql-database/sql-database-recovered-finalize.md

<!--MSDN references-->
[Create database restore request]: http://msdn.microsoft.com/library/azure/dn509571.aspx
[Database operation status]: http://msdn.microsoft.com/library/azure/dn720371.aspx
[Get restorable dropped database]: http://msdn.microsoft.com/library/azure/dn509574.aspx
[List restorable dropped databases]: http://msdn.microsoft.com/library/azure/dn509562.aspx
[Start-AzureSqlDatabaseRestore]: https://msdn.microsoft.com/en-us/library/dn720218.aspx

<!--Other Web references-->
