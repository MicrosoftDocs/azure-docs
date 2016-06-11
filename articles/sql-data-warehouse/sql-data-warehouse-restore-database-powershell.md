<properties
   pageTitle="Restore an Azure SQL Data Warehouse  (PowerShell) | Microsoft Azure"
   description="PowerShell tasks for restoring an Azure SQL Data Warehouse."
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
   ms.date="06/11/2016"
   ms.author="elfish;barbkess;sonyama"/>

# Restore an Azure SQL Data Warehouse  (PowerShell)

> [AZURE.SELECTOR]
- [Overview][]
- [Portal][]
- [PowerShell][]
- [REST][]

In this article you will learn how to restore an Azure SQL Data Warehouse using PowerShell.

## Before you begin

### Verify your SQL Database DTU capacity. 

Each SQL Data Warehouse is hosted by a SQL server logical server.  This logical server has a capacity limit measured in DTU.  Before you can restore a SQL Data Warehouse, it is important to make sure the SQL server logical server hosting your database has enough DTU capacity for the database being restored. See this blog post for more information on [how to view and increase DTU quota][].

### Install PowerShell

In order to use Azure PowerShell with SQL Data Warehouse, you will need to install Azure PowerShell version 1.0 or greater.  You can check your version by running **Get-Module -ListAvailable -Name Azure**.  The latest version can be installed from  [Microsoft Web Platform Installer][].  For more information on installing the latest version, see [How to install and configure Azure PowerShell][].

## Restore an active or paused database

To restore a database from a snapshot use the [Restore-AzureRmSqlDatabase][] PowerShell cmdlet.

1. Open Windows PowerShell.
2. Connect to your Azure account and list all the subscriptions associated with your account.
3. Select the subscription that contains the database to be restored.
4. List the restore points for the database.
5. Pick the desired restore point using the RestorePointCreationDate.
6. Restore the database to the desired restore point.
7. Verify that the restored database is online.

```Powershell

$SubscriptionName="<YourSubscriptionName>"
$ResourceGroupName="<YourResourceGroupName>"
$ServerName="<YourServerNameWithoutURLSuffixSeeNote>"  # Without database.windows.net
$DatabaseName="<YourDatabaseName>"
$NewDatabaseName="<YourDatabaseName>"

Login-AzureRmAccount
Get-AzureRmSubscription
Select-AzureRmSubscription -SubscriptionName $SubscriptionName

# List the last 10 database restore points
((Get-AzureRMSqlDatabaseRestorePoints -ResourceGroupName $ResourceGroupName -ServerName $ServerName -DatabaseName ($DatabaseName).RestorePointCreationDate)[-10 .. -1]

# Or list all restore points
Get-AzureRmSqlDatabaseRestorePoints -ResourceGroupName $ResourceGroupName -ServerName $ServerName -DatabaseName $DatabaseName

# Get the specific database to restore
$Database = Get-AzureRmSqlDatabase -ResourceGroupName $ResourceGroupName -ServerName $ServerName -DatabaseName $DatabaseName

# Pick desired restore point using RestorePointCreationDate
$PointInTime="<RestorePointCreationDate>"  

# Restore database from a restore point
$RestoredDatabase = Restore-AzureRmSqlDatabase –FromPointInTimeBackup –PointInTime $PointInTime -ResourceGroupName $Database.ResourceGroupName -ServerName $Database.$ServerName -TargetDatabaseName $NewDatabaseName –ResourceId $Database.ResourceID

# Verify the status of restored database
$RestoredDatabase.status

```

After the restore has completed, you can configure your recovered database by following the [Finalize a recovered database][] guide.

## Restore a deleted database

To restore a deleted database, use the [Restore-AzureRmSqlDatabase][] cmdlet.

1. Open Windows PowerShell.
2. Connect to your Azure account and list all the subscriptions associated with your account.
3. Select the subscription that contains the deleted database to be restored.
4. Get the specific deleted database.
5. Restore the deleted database.
6. Verify that the restored database is online.

```Powershell

$SubscriptionName="<YourSubscriptionName>"
$ResourceGroupName="<YourResourceGroupName>"
$ServerName="<YourServerNameWithoutURLSuffixSeeNote>"  # Without database.windows.net
$DatabaseName="<YourDatabaseName>"
$NewDatabaseName="<YourDatabaseName>"

Login-AzureRmAccount
Get-AzureRmSubscription
Select-AzureRmSubscription -SubscriptionName $SubscriptionName

# Get the deleted database to restore
$DeletedDatabase = Get-AzureRmSqlDeletedDatabaseBackup -ResourceGroupName $ResourceGroupNam -ServerName $ServerName -DatabaseName $DatabaseName

# Restore deleted database
$RestoredDatabase = Restore-AzureRmSqlDatabase –FromDeletedDatabaseBackup –DeletionDate $DeletedDatabase.DeletionDate -ResourceGroupName $DeletedDatabase.ResourceGroupName -ServerName $DeletedDatabase.ServerName -TargetDatabaseName $NewDatabaseName –ResourceId $DeletedDatabase.ResourceID

# Verify the status of restored database
$RestoredDatabase.status

```

After the restore has completed, you can configure your recovered database by following the [Finalize a recovered database][] guide.

## Restore from an Azure geographical region

To recover a database, use the [Restore-AzureRmSqlDatabase][] cmdlet.

1. Open Windows PowerShell.
2. Connect to your Azure account and list all the subscriptions associated with your account.
3. Select the subscription that contains the database to be restored.
4. Get the database you want to recover.
5. Create the recovery request for the database.
6. Verify the status of the geo-restored database.

```Powershell

Login-AzureRmAccount
Get-AzureRmSubscription
Select-AzureRmSubscription -SubscriptionName "<Subscription_name>"

# Get the database you want to recover
$GeoBackup = Get-AzureRmSqlDatabaseGeoBackup -ResourceGroupName "<YourResourceGroupName>" -ServerName "<YourServerName>" -DatabaseName "<YourDatabaseName>"

# Recover database
$GeoRestoredDatabase = Restore-AzureRmSqlDatabase –FromGeoBackup -ResourceGroupName "<YourResourceGroupName>" -ServerName "<YourTargetServer>" -TargetDatabaseName "<NewDatabaseName>" –ResourceId $GeoBackup.ResourceID

# Verify that the geo-restored database is online
$GeoRestoredDatabase.status

```

### Configure your database after performing a geo-restore

This is a checklist to help get your recovered database production ready.

1. **Update Connection Strings**: Verify connection strings of your client tools are pointing to the newly recovered database.
2. **Modify Firewall Rules**: Verify the firewall rules on the target server and make sure connections from your client computers or Azure to the server and the newly recovered database are enabled.
3. **Verify Server Logins and Database Users**: Verify if all the logins used by your application exist on the server which is hosting your recovered database. Re-create the missing logins and grant them appropriate permissions on the recovered database. 
4. **Enable Auditing**: If auditing is required to access your database, you need to enable Auditing after the database recovery.

The recovered database will be TDE-enabled if the source database is TDE-enabled.


## Next steps
For more information, see [Azure SQL Database business continuity overview][], and [Management overview][].

<!--Image references-->

<!--Article references-->
[Azure SQL Database business continuity overview]: sql-database-business-continuity.md
[Finalize a recovered database]: sql-database-recovered-finalize.md
[How to install and configure Azure PowerShell]: powershell-install-configure.md
[Management overview]: sql-data-warehouse-overview-manage.md
[Overview]: ./sql-data-warehouse-restore-database-overview.md
[Portal]: ./sql-data-warehouse-restore-database-portal.md
[PowerShell]: ./sql-data-warehouse-restore-database-powershell.md
[REST]: ./sql-data-warehouse-restore-database-rest-api.md

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
