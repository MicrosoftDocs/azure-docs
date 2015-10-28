<properties 
    pageTitle="Geo-Replication for Azure SQL Database using PowerShell" 
    description="Geo-Replication for Azure SQL Database using PowerShell" 
    services="sql-database" 
    documentationCenter="" 
    authors="stevestein" 
    manager="jeffreyg" 
    editor=""/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="powershell"
    ms.workload="data-management" 
    ms.date="10/21/2015"
    ms.author="sstein"/>

# Geo-Replication for Azure SQL Database using PowerShell

**Single database**

> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-geo-replication-portal.md)
- [PowerShell](sql-database-geo-replication-powershell.md)
- [Transact-SQL](sql-database-geo-replication-transact-sql.md)


This article shows you how to configure Geo-Replication for SQL Database with PowerShell.



> [AZURE.NOTE] Preview note here


To configure Geo-Replication you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- A logical Azure SQL Database server and a SQL database - The primary database that you want to replicate to a different geographical region.
- A logical Azure SQL Database server - The logical server into which you will create a geo-replication secondary database.
- Azure PowerShell 1.0 Preview. You can download and install the Azure PowerShell modules by following [How to install and configure Azure PowerShell](powershell-install-configure.md).

> [AZURE.IMPORTANT] Starting with the release of Azure PowerShell 1.0 Preview, the Switch-AzureMode cmdlet is no longer available, and cmdlets that were in the Azure ResourceManger module have been renamed. The examples in this article use the new PowerShell 1.0 Preview naming convention. For detailed information, see [Deprecation of Switch-AzureMode in Azure PowerShell](https://github.com/Azure/azure-powershell/wiki/Deprecation-of-Switch-AzureMode-in-Azure-PowerShell).





## Configure your credentials and select your subscription

First you must establish access to your Azure account so start PowerShell and then run the following cmdlet. In the login screen enter the same email and password that you use to sign in to the Azure portal.


	Login-AzureRMAccount

After successfully signing in you will see some information on screen that includes the Id you signed in with and the Azure subscriptions you have access to.


### Select your Azure subscription

To select the subscription you need your subscription Id. You can copy the subscription Id from the information displayed from the previous step, or if you have multiple subscriptions and need more details you can run the **Get-AzureSubscription** cmdlet and copy the desired subscription information from the resultset. The following cmdlet uses the subscription Id to set the current subscription:

	Select-AzureRMSubscription -SubscriptionId 4cac86b0-1e56-bbbb-aaaa-000000000000

After successfully running **Select-AzureRMSubscription** you are returned to the PowerShell prompt.



## Add secondary database


The following commands make the local database into a Geo-Replication primary (assuming that it is not already) and begins replicating data from it to a secondary database with the same name on another "partner" server.  

To enable a secondary you must be the subscription owner or co-owner. 

You can use the **New-AzureRMSqlDatabaseSecondary** cmdlet to add a secondary database on a partner server to a local database on the server to which you are connected (the primary database). 

This cmdlet replaces **Start-AzureRMSqlDatabaseCopy** with the **–IsContinuous** parameter.  It will output an **AzureRMSqlDatabaseSecondary** object that can be used by other cmdlets to clearly identify a specific replication link. This cmdlet will return when the secondary database is created and fully seeded. Depending on the size of the database it may take from minutes to hours.

The replicated database on the secondary server will have the same name as the database on the primary server and will, by default, have the same service level. The secondary database can be readable or non-readable, and can be a single database or an elastic database. For more information, see [New-AzureRMSqlDatabaseSecondary](https://msdn.microsoft.com/library/mt603689.aspx) and [Service Tiers](sql-database-service-tiers.md).
After the secondary is created and seeded, data will begin replicating from the primary database to the new secondary database. The steps below describe how to accomplish this task using PowerShell to create non-readable and readable secondaries, either with a single database or an elastic database.

> [AZURE.NOTE] If the partner database already exists (for example - as a result of terminating a previous geo-replication relationship) the command will fail.



### Add a non-readable secondary (single database)

The following command creates a non-readable secondary of database "mydb" of server "srv2" in resource group "rg2":

    $database = Get-AzureRMSqlDatabase –DatabaseName "mydb"
    $secondaryLink = $database | New-AzureRMSqlDatabaseSecondary –PartnerResourceGroupName "rg2" –PartnerServerName "srv2" -AllowConnections "No"



### Add readable secondary (single database)

The following command creates a readable secondary of database "mydb" of server "srv2" in resource group "rg2":

    $database = Get-AzureRMSqlDatabase –DatabaseName "mydb"
    $secondaryLink = $database | New-AzureRMSqlDatabaseSecondary –PartnerResourceGroupName "rg2" –PartnerServerName "srv2" -AllowConnections "ReadOnly"




### Add a non-readable secondary (elastic database)

The following command creates a non-readable secondary of database "mydb" in the elastic database pool named "ElasticPool1" of server "srv2" in resource group "rg2":

    $database = Get-AzureRMSqlDatabase –DatabaseName "mydb"
    $secondaryLink = $database | New-AzureRMSqlDatabaseSecondary –PartnerResourceGroupName "rg2" –PartnerServerName "srv2" –SecondaryElasticPoolName "ElasticPool1" -AllowConnections "No"


### Add a readable secondary (elastic database)

The following command creates a readable secondary of database "mydb" in the elastic database pool named "ElasticPool1" of server "srv2" in resource group "rg2":

    $database = Get-AzureRMSqlDatabase –DatabaseName "mydb"
    $secondaryLink = $database | New-AzureRMSqlDatabaseSecondary –PartnerResourceGroupName "rg2" –PartnerServerName "srv2" –SecondaryElasticPoolName "ElasticPool1" -AllowConnections "ReadOnly"





## Remove secondary database

Use the **Remove-AzureRMSqlDatabaseSecondary** cmdlet to permanently terminate the replication partnership between a secondary database and its primary. After the relationship termination, the secondary database becomes a regular read-write database. If the connectivity to secondary database is broken the command succeeds but the secondary will become read-write after connectivity is restored. For more information, see [Remove-AzureRMSqlDatabaseSecondary](https://msdn.microsoft.com/library/mt603457.aspx) and [Service Tiers](https://azure.microsoft.com/documentation/articles/sql-database-service-tiers/).

This cmdlet replaces Stop-AzureRMSqlDatabaseCopy for replication. 

This removal is equivalent of a forced termination that removes the replication link and leaves the former secondary as a standalone database that is not fully replicated prior to termination. All link data will be cleaned up on both the former primary and former secondary, if or when they are available. This cmdlet will return when the replication link is removed. 


Auth: In order to remove secondary, users should have write access to both primary and secondary databases according to RBAC. See Role-based access control for details.

The following removes replication link of database named "mydb" to server "srv2" of the resource group "rg2". 

    $database = Get-AzureRMSqlDatabase –DatabaseName "mydb"
    $secondaryLink = $database | Get-AzureRMSqlDatabaseReplicationLink –SecondaryResourceGroup "rg2" –PartnerServerName "srv2"
    $secondaryLink | Remove-AzureRMSqlDatabaseSecondary 




## Initiate a planned failover from the primary database to the secondary database

Use the **Set-AzureRMSqlDatabaseSecondary** cmdlet with the **-Failover** parameter to promote a secondary database to become the new primary database in a planned fashion, demoting the existing primary to become a secondary. This functionality is designed for a planned failover, such as during disaster recovery drills, and requires that the primary database be available.

The command performs the following workflow:

1. Temporarily switch replication to synchronous mode. This will cause all outstanding transactions to be flushed to the secondary;

2. Switch the roles of the two databases in the geo-replication partnership.  

This sequence guarantees that no data loss will occur. There is a short period during which both databases are unavailable (on the order of 0 to 25 seconds) while the roles are switched. The entire operation should take less than a minute to complete under normal circumstances. For more information, see [Set-AzureRMSqlDatabaseSecondary](https://msdn.microsoft.com/library/mt619393.aspx).


> [AZURE.NOTE]:  If the primary database is unavailable when the command is issued it will fail with an error message indicating that the primary server is not available. In rare cases it is possible that the operation cannot complete and may appear stuck. In this case the user can call the force failover command (unplanned failover) and accept data loss.



This cmdlet will return when the process of switching the secondary database to primary is completed.

The following command switches the roles of the database named "mydb” on the server "srv2” under the resource group "rg2” to primary. The original primary to which "db2” was connected to will switch to secondary after the two databases are fully synchronized.

    $database = Get-AzureRMSqlDatabase –DatabaseName "mydb” –ResourceGroupName "rg2” –ServerName "srv2”
    $database | Set-AzureRMSqlDatabaseSecondary -Failover



## Initiate an unplanned failover from the primary database to the secondary database


You can use the **Set-AzureRMSqlDatabaseSecondary** cmdlet with **–Failover** and **-AllowDataLoss** parameters to promote a secondary database to become the new primary database in an unplanned fashion, forcing the demotion of the existing primary to become a secondary at a time when the primary database is no longer available.

This functionality is designed for disaster recovery when restoring availability of the database is critical and some data loss is acceptable. When forced failover is invoked, the specified secondary database immediately becomes the primary database and begins accepting write transactions. As soon as the original primary database is able to reconnect with this new primary database after the forced failover operation, an incremental backup is taken on the original primary database and the old primary database is made into a secondary database for the new primary database; subsequently, it is merely a replica of the new primary.

But because Point In Time Restore is not supported on the secondary databases, if the user wishes to recovery data committed to the old primary database which had not been replicated to the new primary database, she has to engage CSS to restore a database to the know log backup.

> [AZURE.NOTE]: If the command is issued when the both primary and secondary are online the old primary will become the new secondary but data synchronization will not be attempted. So some data loss may occur.


If the primary database has multiple secondaries the command will partially succeed. The secondary on which the command was executed will become primary. The old primary however will remain primary, i.e. the two primaries will end up in inconsistent state and connected by a suspended replication link. The user will have to manually repair this configuration using a “remove secondary” API on either of these primary databases.


The following command switches the roles of the database named "mydb” to primary when the primary is unavailable. The original primary to which "mydb” was connected to will switch to secondary after it is back online. At that point the synchronization may result in data loss

    $database = Get-AzureRMSqlDatabase –DatabaseName "mydb” –ResourceGroupName "rg2” –ServerName "srv2”
    $database | Set-AzureRMSqlDatabaseSecondary –Failover -AllowDataLoss



## Monitor Geo-Replication configuration and health

Monitoring tasks include monitoring of the geo-replication configuration and monitoring data replication health.  

[Get-AzureRMSqlDatabaseReplicationLink](https://msdn.microsoft.com/library/mt619330.aspx) can be used to retrieve the information about the forward replication links visible in the sys.geo_replication_links catalog view.

The following command retrieves status of the replication link between the primary database "mydb” and the secondary on server "srv2” of the resource group "rg2”.

    $database = Get-AzureRMSqlDatabase –DatabaseName "mydb”
    $secondaryLink = $database | Get-AzureRMSqlDatabaseReplicationLink –PartnerResourceGroup "rg2” –PartnerServerName "srv2”



## Copy a database

A new database is created in the same or different logical server using a default or user selected service objective, including a named elastic pool. As on option the user can decide to manually control the synchronization point.

Auth: In order to initiate database copies, users should have write access to both the target server and the source database according to RBAC. See Role-based access control for details.

This cmdlet replaces Start-AzureRMSqlDatabaseCopy for database copies.  It follows the same pattern as New-AzureRMSqlDatabase and will return when the copy operation is completed. Depending on the database size it may take from minutes to hours. 

### Copy a database

The following command creates a database named "db2” in server "srv2”.

    $database = Get-AzureRMSqlDatabase –DatabaseName "db1” –ResourceGroupName "rg1” –ServerName "srv1”
    $databaseCopy= $database | New-AzureRMSqlDatabaseCopy –CopyResourceGroupName "rg2”–CopyServerName "srv2” –CopyDatabaseName ”db2”


### Copy a database into an elastic database pool

The following command creates a database named "db2” in the elastic pool "MyPool” in logical server "srv2”.

    $database = Get-AzureRMSqlDatabase –DatabaseName "db1” –ResourceGroupName "rg1” –ServerName "srv1”
    $databaseCopy= $database | New-AzureRMSqlDatabaseCopy –CopyResourceGroupName "rg2”–CopyServerName "srv2” –CopyDatabaseName ”db2” –ElasticPoolName ""MyPool""" 



## Monitor a database copy

Since the database copy process is asynchronous the user can monitor the copy state transitions and the completion time.  

The copy is created with [New-AzureRMSqlDatabaseCopy](https://msdns.microsoft.com/library/mt603644.aspx) and no monitoring cmdlet is provided. To monitor the database copy with Transact-SQL, see [Monitor a database copy using Transact-SQL](sql-database-geo-replication-transact-sql.md#monitor-a-database-copy).


   

## Next steps

- [Disaster Recovery Drills](sql-database-disaster-recovery-drills.md)




## Additional resources

- [Designing cloud applications for business continuity using Geo-Replication](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)
