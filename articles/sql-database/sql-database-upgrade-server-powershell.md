<properties
	pageTitle="Upgrade to Azure SQL Database V12 using PowerShell | Microsoft Azure"
	description="Explains how to upgrade to Azure SQL Database V12 including how to upgrade Web and Business databases, and how to upgrade a V11 server migrating its databases directly into an elastic database pool using PowerShell."
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/06/2016"
	ms.author="sstein"/>

# Upgrade to Azure SQL Database V12 using PowerShell


> [AZURE.SELECTOR]
- [Azure portal](sql-database-upgrade-server-portal.md)
- [PowerShell](sql-database-upgrade-server-powershell.md)


SQL Database V12 is the latest version so upgrading to SQL Database V12 is recommended.
SQL Database V12 has many [advantages over the previous version](sql-database-v12-whats-new.md) including:

- Increased compatibility with SQL Server.
- Improved premium performance and new performance levels.
- [Elastic database pools](sql-database-elastic-pool.md).

This article provides directions for upgrading existing SQL Database V11 servers and databases to SQL Database V12.

During the process of upgrading to V12 you will upgrade any Web and Business databases to a new service tier so directions for upgrading Web and Business databases are included.

In addition, migrating to an [elastic database pool](sql-database-elastic-pool.md) can be more cost effective than upgrading to individual performance levels (pricing tiers) for single databases. Pools also simplify database management because you only need to manage the performance settings for the pool rather than separately managing the performance levels of individual databases. If you have databases on multiple servers consider moving them into the same server and taking advantage of putting them into a pool.

You can easily auto-migrate databases from V11 servers directly into elastic database pools following the steps in this article.

Note that your databases will remain online and continue to work throughout the upgrade operation. At the time of the actual transition to the new performance level temporary dropping of the connections to the database can happen for a very small duration that is typically around 90 seconds but can be as much as 5 minutes. If your application has [transient fault handling for connection terminations](sql-database-connectivity-issues.md) then it is sufficient to protect against dropped connections at the end of the upgrade.

Upgrading to SQL Database V12 cannot be undone. After an upgrade the server cannot be reverted to V11.

After upgrading to V12, [service tier recommendations](sql-database-service-tier-advisor.md) and [elastic pool recommendations](sql-database-elastic-pool-create-portal.md) will not immediately be available until the service has time to evaluate your workloads on the new server. V11 server recommendation history does not apply to V12 servers so it is not retained.  

## Prepare to upgrade

- **Upgrade all Web and Business databases**: See [Upgrade all Web and Business databases](sql-database-v12-upgrade.md#upgrade-all-web-and-business-databases) section below or use [PowerShell to upgrade databases and server](sql-database-upgrade-server-powershell.md).
- **Review and suspend Geo-Replication**: If your Azure SQL database is configured for Geo-Replication you should document its current configuration and [stop Geo-Replication](sql-database-geo-replication-portal.md#remove-secondary-database). After the upgrade completes reconfigure your database for Geo-Replication.
- **Open these ports if you have clients on an Azure VM**: If your client program connects to SQL Database V12 while your client runs on an Azure virtual machine (VM), you must open port ranges 11000-11999 and 14000-14999 on the VM. For details, see [Ports for SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md).


## Prerequisites

To upgrade a server to V12 with PowerShell, you need to have Azure PowerShell installed and running, and  depending on the version you may need to switch it into resource manager mode to access the Azure Resource Manager PowerShell Cmdlets.

To run PowerShell cmdlets, you need to have Azure PowerShell installed and running. For detailed information, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).


## Configure your credentials and select your subscription

To run PowerShell cmdlets against your Azure subscription you must first establish access to your Azure account. Run the following and you will be presented with a sign in screen to enter your credentials. Use the same email and password that you use to sign in to the Azure portal.

	Add-AzureRmAccount

After successfully signing in you should see some information on screen that includes the Id you signed in with and the Azure subscriptions you have access to.

To select the subscription you want to work with you need your subscription Id (**-SubscriptionId**) or subscription name (**-SubscriptionName**). You can copy it from the previous step, or if you have multiple subscriptions you can run the **Get-AzureRmSubscription** cmdlet and copy the desired subscription information from the resultset.

Run the following cmdlet with your subscription information to set your current subscription:

	Select-AzureRmSubscription -SubscriptionId 4cac86b0-1e56-bbbb-aaaa-000000000000

The following commands will be run against the subscription you just selected above.

## Get Recommendations

To get the recommendation for the server upgrade run the following cmdlet:

    $hint = Get-AzureRmSqlServerUpgradeHint -ResourceGroupName “resourcegroup1” -ServerName “server1”

For more information, see [Create an elastic database pool](sql-database-elastic-pool-create-portal.md) and [Azure SQL Database pricing tier recommendations](sql-database-service-tier-advisor.md).



## Start the upgrade

To start the upgrade of the server run the following cmdlet:

    Start-AzureRmSqlServerUpgrade -ResourceGroupName “resourcegroup1” -ServerName “server1” -ServerVersion 12.0 -DatabaseCollection $hint.Databases -ElasticPoolCollection $hint.ElasticPools  


When you run this command upgrade process will begin. You can customize the output of the recommendation and provide the edited recommendation to this cmdlet.


## Upgrade a server


    # Adding the account
    #
    Add-AzureRmAccount

    # Setting the variables
    #
    $SubscriptionName = 'YOUR_SUBSCRIPTION'
    $ResourceGroupName = 'YOUR_RESOURCE_GROUP'
    $ServerName = 'YOUR_SERVER'

    # Selecting the right subscription
    #
    Select-AzureRmSubscription -SubscriptionName $SubscriptionName

    # Getting the upgrade recommendations
    #
    $hint = Get-AzureRmSqlServerUpgradeHint -ResourceGroupName $ResourceGroupName -ServerName $ServerName

    # Starting the upgrade process
    #
    Start-AzureRmSqlServerUpgrade -ResourceGroupName $ResourceGroupName -ServerName $ServerName -ServerVersion 12.0 -DatabaseCollection $hint.Databases -ElasticPoolCollection $hint.ElasticPools  


## Custom upgrade mapping

If the recommendations are not appropriate for your server and business case, then you can choose how your databases are upgraded and can map them to either single or elastic databases.

ElasticPoolCollection and DatabaseCollection parameters are optional:

    # Creating elastic pool mapping
    #
    $elasticPool = New-Object -TypeName Microsoft.Azure.Management.Sql.Models.UpgradeRecommendedElasticPoolProperties
    $elasticPool.DatabaseDtuMax = 100
    $elasticPool.DatabaseDtuMin = 0
    $elasticPool.Dtu = 800
    $elasticPool.Edition = "Standard"
    $elasticPool.DatabaseCollection = ("DB1", “DB2”, “DB3”, “DB4”)
    $elasticPool.Name = "elasticpool_1"
    $elasticPool.StorageMb = 800

    # Creating single database mapping for 2 databases. DBMain1 mapped to S0 and DBMain2 mapped to S2
    #
    $databaseMap1 = New-Object -TypeName Microsoft.Azure.Management.Sql.Models.UpgradeDatabaseProperties
    $databaseMap1.Name = "DBMain1"
    $databaseMap1.TargetEdition = "Standard"
    $databaseMap1.TargetServiceLevelObjective = "S0"

    $databaseMap2 = New-Object -TypeName Microsoft.Azure.Management.Sql.Models.UpgradeDatabaseProperties
    $databaseMap2.Name = "DBMain2"
    $databaseMap2.TargetEdition = "Standard"
    $databaseMap2.TargetServiceLevelObjective = "S2"

    # Starting the upgrade
    #
    Start-AzureRmSqlServerUpgrade –ResourceGroupName resourcegroup1 –ServerName server1 -ServerVersion 12.0 -DatabaseCollection @($databaseMap1, $databaseMap2) -ElasticPoolCollection @($elasticPool)



## Monitor databases after upgrading to SQL Database V12


After upgrading, it is recommended to monitor the database actively to ensure applications are running at the desired performance and optimize usage as needed.

In addition to monitoring individual databases you can monitor elastic database pools [using the portal](sql-database-elastic-pool-manage-portal.md) or with [PowerShell](sql-database-elastic-pool-manage-powershell.md)


**Resource consumption data:** For Basic, Standard, and Premium databases resource consumption data is available through the [sys.dm_ db_ resource_stats](http://msdn.microsoft.com/library/azure/dn800981.aspx) DMV in the user database. This DMV provides near real time resource consumption information at 15 second granularity for the previous hour of operation. The DTU percentage consumption for an interval is computed as the maximum percentage consumption of the CPU, IO and log dimensions. Here is a query to compute the average DTU percentage consumption over the last hour:

    SELECT end_time
    	 , (SELECT Max(v)
             FROM (VALUES (avg_cpu_percent)
                         , (avg_data_io_percent)
                         , (avg_log_write_percent)
    	   ) AS value(v)) AS [avg_DTU_percent]
    FROM sys.dm_db_resource_stats
    ORDER BY end_time DESC;

Additional monitoring information:

- [Azure SQL Database performance guidance for single databases](http://msdn.microsoft.com/library/azure/dn369873.aspx).
- [Price and performance considerations for an elastic database pool](sql-database-elastic-pool-guidance.md).
- [Monitoring Azure SQL Database using dynamic management views](sql-database-monitoring-with-dmvs.md)



**Alerts:** Set up 'Alerts' in the Azure portal to notify you when the DTU consumption for an upgraded database approaches certain high level. Database alerts can be setup in the Azure portal for various performance metrics like DTU, CPU, IO, and Log. Browse to your database and select **Alert rules** in the **Settings** blade.

For example, you can set up an email alert on “DTU Percentage” if the average DTU percentage value exceeds 75% over the last 5 minutes. Refer to [Receive alert notifications](../azure-portal/insights-receive-alert-notifications.md) to learn more about how to configure alert notifications.



## Next steps

- [Create an elastic database pool](sql-database-elastic-pool-create-portal.md) and add some or all of the databases into the pool.
- [Change the service tier and performance level of your database](sql-database-scale-up.md).



## Related Information

- [Get-AzureRmSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt603582.aspx)
- [Start-AzureRmSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt619403.aspx)
- [Stop-AzureRmSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt603589.aspx)
