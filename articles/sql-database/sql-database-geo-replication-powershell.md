<properties 
    pageTitle="Configure Active Geo-Replication for Azure SQL Database using PowerShell | Microsoft Azure" 
    description="Configure Active Geo-replication for Azure SQL Database using PowerShell" 
    services="sql-database" 
    documentationCenter="" 
    authors="stevestein" 
    manager="jhubbard" 
    editor=""/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="powershell"
   ms.workload="sqldb-bcdr"
    ms.date="06/14/2016"
    ms.author="sstein"/>

# Configure Geo-Replication for Azure SQL Database with PowerShell

> [AZURE.SELECTOR]
- [Overview](sql-database-geo-replication-overview.md)
- [Azure Portal](sql-database-geo-replication-portal.md)
- [PowerShell](sql-database-geo-replication-powershell.md)
- [T-SQL](sql-database-geo-replication-transact-sql.md)

This article shows you how to configure Active Geo-Replication for SQL Database with PowerShell.

To initiate failover using PowerShell, see [Initiate a planned or unplanned failover for Azure SQL Database with PowerShell](sql-database-geo-replication-failover-powershell.md).

>[AZURE.NOTE] Active Geo-Replication (readable secondaries) is now available for all databases in all service tiers. In April 2017 the non-readable secondary type will be retired and existing non-readable databases will automatically be upgraded to readable secondaries.



To configure Active Geo-Replication using PowerShell, you need the following:

- An Azure subscription. 
- An Azure SQL database - The primary database that you want to replicate.
- Azure PowerShell 1.0 or later. You can download and install the Azure PowerShell modules by following [How to install and configure Azure PowerShell](../powershell-install-configure.md).


## Configure your credentials and select your subscription

First you must establish access to your Azure account so start PowerShell and then run the following cmdlet. In the login screen enter the same email and password that you use to sign in to the Azure portal.


	Login-AzureRmAccount

After successfully signing in you will see some information on screen that includes the Id you signed in with and the Azure subscriptions you have access to.


### Select your Azure subscription

To select the subscription you need your subscription Id. You can copy the subscription Id from the information displayed from the previous step, or if you have multiple subscriptions and need more details you can run the **Get-AzureRmSubscription** cmdlet and copy the desired subscription information from the resultset. The following cmdlet uses the subscription Id to set the current subscription:

	Select-AzureRmSubscription -SubscriptionId 4cac86b0-1e56-bbbb-aaaa-000000000000

After successfully running **Select-AzureRmSubscription** you are returned to the PowerShell prompt.


## Add secondary database


The following steps create a new secondary database in a Geo-Replication partnership.  
  
To enable a secondary you must be the subscription owner or co-owner. 

You can use the **New-AzureRmSqlDatabaseSecondary** cmdlet to add a secondary database on a partner server to a local database on the server to which you are connected (the primary database). 

This cmdlet replaces **Start-AzureSqlDatabaseCopy** with the **–IsContinuous** parameter.  It will output an **AzureRmSqlDatabaseSecondary** object that can be used by other cmdlets to clearly identify a specific replication link. This cmdlet will return when the secondary database is created and fully seeded. Depending on the size of the database it may take from minutes to hours.

The replicated database on the secondary server will have the same name as the database on the primary server and will, by default, have the same service level. The secondary database can be readable or non-readable, and can be a single database or an elastic database. For more information, see [New-AzureRMSqlDatabaseSecondary](https://msdn.microsoft.com/library/mt603689.aspx) and [Service Tiers](sql-database-service-tiers.md).
After the secondary is created and seeded, data will begin replicating from the primary database to the new secondary database. The steps below describe how to accomplish this task using PowerShell to create non-readable and readable secondaries, either with a single database or an elastic database.

If the partner database already exists (for example - as a result of terminating a previous Geo-Replication relationship) the command will fail.



### Add a non-readable secondary (single database)

The following command creates a non-readable secondary of database "mydb" of server "srv2" in resource group "rg2":

    $database = Get-AzureRmSqlDatabase –DatabaseName "mydb" -ResourceGroupName "rg1" -ServerName "srv1"
    $secondaryLink = $database | New-AzureRmSqlDatabaseSecondary –PartnerResourceGroupName "rg2" –PartnerServerName "srv2" -AllowConnections "No"



### Add readable secondary (single database)

The following command creates a readable secondary of database "mydb" of server "srv2" in resource group "rg2":

    $database = Get-AzureRmSqlDatabase –DatabaseName "mydb" -ResourceGroupName "rg1" -ServerName "srv1"
    $secondaryLink = $database | New-AzureRmSqlDatabaseSecondary –PartnerResourceGroupName "rg2" –PartnerServerName "srv2" -AllowConnections "All"




### Add a non-readable secondary (elastic database)

The following command creates a non-readable secondary of database "mydb" in the elastic database pool named "ElasticPool1" of server "srv2" in resource group "rg2":

    $database = Get-AzureRmSqlDatabase –DatabaseName "mydb" -ResourceGroupName "rg1" -ServerName "srv1"
    $secondaryLink = $database | New-AzureRmSqlDatabaseSecondary –PartnerResourceGroupName "rg2" –PartnerServerName "srv2" –SecondaryElasticPoolName "ElasticPool1" -AllowConnections "No"


### Add a readable secondary (elastic database)

The following command creates a readable secondary of database "mydb" in the elastic database pool named "ElasticPool1" of server "srv2" in resource group "rg2":

    $database = Get-AzureRmSqlDatabase –DatabaseName "mydb" -ResourceGroupName "rg1" -ServerName "srv1"
    $secondaryLink = $database | New-AzureRmSqlDatabaseSecondary –PartnerResourceGroupName "rg2" –PartnerServerName "srv2" –SecondaryElasticPoolName "ElasticPool1" -AllowConnections "All"





## Remove secondary database

Use the **Remove-AzureRmSqlDatabaseSecondary** cmdlet to permanently terminate the replication partnership between a secondary database and its primary. After the relationship termination, the secondary database becomes a read-write database. If the connectivity to secondary database is broken the command succeeds but the secondary will become read-write after connectivity is restored. For more information, see [Remove-AzureRmSqlDatabaseSecondary](https://msdn.microsoft.com/library/mt603457.aspx) and [Service Tiers](sql-database-service-tiers.md).

This cmdlet replaces Stop-AzureSqlDatabaseCopy for replication. 

This removal is equivalent of a forced termination that removes the replication link and leaves the former secondary as a standalone database that is not fully replicated prior to termination. All link data will be cleaned up on both the former primary and former secondary, if or when they are available. This cmdlet will return when the replication link is removed. 


In order to remove secondary, users should have write access to both primary and secondary databases according to RBAC. See Role-based access control for details.

The following removes replication link of database named "mydb" to server "srv2" of the resource group "rg2". 

    $database = Get-AzureRmSqlDatabase –DatabaseName "mydb" -ResourceGroupName "rg1" -ServerName "srv1"
    $secondaryLink = $database | Get-AzureRmSqlDatabaseReplicationLink –SecondaryResourceGroup "rg2" –PartnerServerName "srv2"
    $secondaryLink | Remove-AzureRmSqlDatabaseSecondary 


## Monitor geo-replication configuration and health

Monitoring tasks include monitoring of the geo-replication configuration and monitoring data replication health.  

[Get-AzureRmSqlDatabaseReplicationLink](https://msdn.microsoft.com/library/mt619330.aspx) can be used to retrieve the information about the forward replication links visible in the sys.geo_replication_links catalog view.

The following command retrieves status of the replication link between the primary database "mydb” and the secondary on server "srv2” of the resource group "rg2”.

    $database = Get-AzureRmSqlDatabase –DatabaseName "mydb" -ResourceGroupName "rg1" -ServerName "srv1"
    $secondaryLink = $database | Get-AzureRmSqlDatabaseReplicationLink –PartnerResourceGroup "rg2” –PartnerServerName "srv2”


## Next steps

- To learn more about Active Geo-Replication, see - [Active Geo-Replication](sql-database-geo-replication-overview.md)
- To learn about business continuity design and recovery scenarios, see [Continuity scenarios](sql-database-business-continuity-scenarios.md)

