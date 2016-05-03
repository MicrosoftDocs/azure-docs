<properties
   pageTitle="Recover a database from outage in SQL Data Warehouse | Microsoft Azure"
   description="Steps for recovering a database from outage in SQL Data Warehouse. "
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
   ms.date="04/20/2016"
   ms.author="sahajs;barbkess"/>

# Recover a database from an outage in SQL Data Warehouse

Geo-restore provides the ability to restore a database from a geo-redundant backup. The restored database can be created on any server in any Azure region. Because geo-restore uses a geo-redundant backup as its source it can be used to recover a database even if the database is inaccessible due to an outage. In addition to recovering from an outage, geo-restore can also be used for other scenarios like migrating or copying a database to a different server or region. 

## When to initiate recovery
The recovery operation requires changing the SQL connection string upon recovery and could result in permanent data loss. Therefore, it should be done only when the outage is likely to last longer than your application's RTO. Use the following data points to assert that the recovery is warranted:

- Permanent connectivity failure to the database.
- Your Azure Portal shows an alert about an incident in the region with broad impact.

## Recover using Geo-Restore
Recovering a database creates a new database from the latest geo-redundant backup. It is important to make sure the server you are restoring to has enough DTU capacity for the new database. See this blog post for more information on [how to view and increase DTU quota][].

### Azure Portal
1. Log in to the [Azure Portal][]
2. On the left side of the screen select **+NEW**, then select **Data and Storage**, and then select **SQL Data Warehouse**
3. Select **BACKUP** as the source and then select the geo-redundant backup you want to recover from
4. Specify the rest of the database properties and click **Create**
5. The database restore process will begin and can be monitored using **NOTIFICATIONS**

### PowerShell

To recover a database, use the [Restore-AzureRmSqlDatabase][] cmdlet.

> [AZURE.NOTE]  In order to use Azure PowerShell with SQL Data Warehouse, you will need to install Azure PowerShell version 1.0.3 or greater.  You can check your version by running **Get-Module -ListAvailable -Name Azure**.  The latest version can be installed from  [Microsoft Web Platform Installer][].  For more information on installing the latest version, see [How to install and configure Azure PowerShell][].

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

>[AZURE.NOTE] For server foo.database.windows.net, use "foo" as the -ServerName in the above powershell cmdlets.

### REST API
Use REST to programmatically perform database recovery.

1. Get your list of recoverable databases using the [List Recoverable Databases][] operation.
2. Get the database you want to recover using the [Get Recoverable Database][] operation.
3. Create the recovery request using the [Create Database Recovery Request][] operation.
4. Track the status of the recovery using the [Database Operation Status][] operation.

## Configure your database after recovery
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
[How to install and configure Azure PowerShell]: powershell-install-configure.md
[Azure SQL Database business continuity overview]: sql-database-business-continuity.md
[Finalize a recovered database]: sql-database-recovered-finalize.md

<!--MSDN references-->
[Restore-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt693390.aspx
[List Recoverable Databases]: https://msdn.microsoft.com/library/azure/dn800984.aspx
[Get Recoverable Database]: https://msdn.microsoft.com/library/azure/dn800985.aspx
[Create Database Recovery Request]: https://msdn.microsoft.com/library/azure/dn800986.aspx
[Database Operation Status]: https://msdn.microsoft.com/library/azure/dn720371.aspx

<!--Blog references-->
[how to view and increase DTU quota]: https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests/

<!--Other Web references-->
[Azure Portal]: https://portal.azure.com/
[Microsoft Web Platform Installer]: https://aka.ms/webpi-azps
