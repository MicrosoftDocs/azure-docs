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
   ms.date="03/28/2016"
   ms.author="sahajs;barbkess;sonyama"/>

# Recover a database from user error in SQL Data Warehouse

SQL Data Warehouse offers two core capabilities for recovering from user error that causes unintentional data corruption or deletion:

- Restore a live database
- Restore a deleted database

Both of these capabilities restore to a new database on the same server. It is important to make sure the server you are restoring to has enough DTU capacity for the new database. You can request an increase of this quota by [contacting support][].


## Recover a live database
Azure SQL Data Warehouse service protects all live databases with database snapshots at least every 8 hours and retains them for 7 days to provide you with a discrete set of restore points. Database snapshots are also created when you pause or drop your database and are retained for 7 days. In the event of user error causing unintended data modification, you can restore the database to any of the restore points within the retention period.


### Azure Portal

To Restore using the Azure Portal, use the following steps.

1. Log in to the [Azure Portal][].
2. On the left side of the screen select **BROWSE** and then select **SQL Databases**.
3. Navigate to your database and select it.
4. At the top of the database blade, click **Restore**.
5. Specify a new **Database name**, select a **Restore Point** and then click **Create**.
6. The database restore process will begin and can be monitored using **NOTIFICATIONS**.


### PowerShell

Use Azure PowerShell to programmatically perform a database restore. To download the Azure PowerShell module, run [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409). You can check your version by running Get-Module -ListAvailable -Name AzureRM.Sql. This article is based on Microsoft AzureRM.Sql PowerShell version 1.0.5.

To restore a database, use the [Restore-AzureRmSqlDatabase][] cmdlet.

1. Open Windows PowerShell.
2. Connect to your Azure account and list all the subscriptions associated with your account.
3. Select the subscription that contains the database to be restored.
4. List the restore points for the database.
5. Pick the desired restore point using the RestorePointCreationDate.
6. Restore the database to the desired restore point.
7. Verify that the restored database is online.

```Powershell

Login-AzureRmAccount
Get-AzureRmSubscription
Select-AzureRmSubscription -SubscriptionName "<Subscription_name>"

# List the last 10 database restore points
((Get-AzureRMSqlDatabaseRestorePoints -ResourceGroupName "<YourResourceGroupName>" -ServerName "<YourServerName>" -DatabaseName "<YourDatabaseName>").RestorePointCreationDate)[-10 .. -1]

# Or list all restore points
Get-AzureRmSqlDatabaseRestorePoints -ResourceGroupName "<YourResourceGroupName>" -ServerName "<YourServerName>" -DatabaseName "<YourDatabaseName>" 

# Pick desired restore point using RestorePointCreationDate
$PointInTime = "<RestorePointCreationDate>"

# Get the specific database to restore
$Database = Get-AzureRmSqlDatabase -ResourceGroupName "<YourResourceGroupName>" -ServerName "<YourServerName>" -DatabaseName "<YourDatabaseName>"

# Restore database from a restore point
$RestoredDatabase = Restore-AzureRmSqlDatabase –FromPointInTimeBackup –PointInTime $PointInTime -ResourceGroupName $Database.ResourceGroupName -ServerName $Database.ServerName -TargetDatabaseName "<NewDatabaseName>" –ResourceId $Database.ResourceID

# Verify the status of restored database
$RestoredDatabase.status

```

>[AZURE.NOTE] For server foo.database.windows.net, use "foo" as the -ServerName in the above powershell cmdlets.


### REST API
Use REST to programmatically perform database restore.

1. Get the list of database restore points using the Get Database Restore Points operation.
2. Begin your restore by using the [Create database restore request][] operation.
3. Track the status of your restore by using the [Database operation status][] operation.


>[AZURE.NOTE] After the restore has completed, you can configure your recovered database by following the [Finalize a recovered database][] guide.


## Recover a deleted database
Azure SQL Data Warehouse takes a database snapshot before a database is dropped and retains it for 7 days. In the event of accidental database deletion, you can restore the deleted database to the time of deletion.


### Azure Portal

To restore a deleted database using the Azure Portal, use the following steps.

1. Log in to the [Azure Portal][].
2. On the left side of the screen select **BROWSE** and then select **SQL Servers**.
3. Navigate to your server and select it.
4. Scroll down to Operations on you server's blade, click the **Deleted Databases** tile.
5. Select the deleted database you want to restore.
5. Specify a new **Database name** and click **Create**.
6. The database restore process will begin and can be monitored using **NOTIFICATIONS**.


### PowerShell
Use Azure PowerShell to programmatically perform a deleted database restore. To download the Azure PowerShell module, run [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409). You can check your version by running Get-Module -ListAvailable -Name AzureRM.Sql. This article is based on Microsoft AzureRM.Sql PowerShell version 1.0.5.

To restore a deleted database, use the [Restore-AzureRmSqlDatabase][] cmdlet.

1. Open Windows PowerShell.
2. Connect to your Azure account and list all the subscriptions associated with your account.
3. Select the subscription that contains the deleted database to be restored.
4. Get the specific deleted database.
5. Restore the deleted database.
6. Verify that the restored database is online.

```Powershell

Login-AzureRmAccount
Get-AzureRmSubscription
Select-AzureRmSubscription -SubscriptionName "<Subscription_name>"

# Get the deleted database to restore
$DeletedDatabase = Get-AzureRmSqlDeletedDatabaseBackup -ResourceGroupName "<YourResourceGroupName>" -ServerName "<YourServerName>" -DatabaseName "<YourDatabaseName>"

# Restore deleted database
$RestoredDatabase = Restore-AzureRmSqlDatabase –FromDeletedDatabaseBackup –DeletionDate $DeletedDatabase.DeletionDate -ResourceGroupName $DeletedDatabase.ResourceGroupName -ServerName $DeletedDatabase.ServerName -TargetDatabaseName "<NewDatabaseName>" –ResourceId $DeletedDatabase.ResourceID

# Verify the status of restored database
$RestoredDatabase.status

```

>[AZURE.NOTE] For server foo.database.windows.net, use "foo" as the -ServerName in the above powershell cmdlets.


### REST API
Use REST to programmatically perform database restore.

1.	List all of your restorable deleted databases by using the [List restorable dropped databases][] operation.
2.	Get the details for the deleted database you want to restore by using the [Get restorable dropped database][] operation.
3.	Begin your restore by using the [Create database restore request][] operation.
4.	Track the status of your restore by using the [Database operation status][] operation.


>[AZURE.NOTE] After the restore has completed, you can configure your recovered database by following the [Finalize a recovered database][] guide.


## Next steps
To learn about the business continuity features of Azure SQL Database editions, please read the [Azure SQL Database business continuity overview][].


<!--Image references-->

<!--Article references-->
[Azure SQL Database business continuity overview]: sql-database/sql-database-business-continuity.md
[Finalize a recovered database]: sql-database/sql-database-recovered-finalize.md

<!--MSDN references-->
[Create database restore request]: http://msdn.microsoft.com/library/azure/dn509571.aspx
[Database operation status]: http://msdn.microsoft.com/library/azure/dn720371.aspx
[Get restorable dropped database]: http://msdn.microsoft.com/library/azure/dn509574.aspx
[List restorable dropped databases]: http://msdn.microsoft.com/library/azure/dn509562.aspx
[Restore-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt693390.aspx

<!--Other Web references-->
[Azure Portal]: https://portal.azure.com/
[contacting support]: https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests/
