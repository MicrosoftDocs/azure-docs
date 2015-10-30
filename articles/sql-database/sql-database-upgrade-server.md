<properties 
	pageTitle="Upgrade to Azure SQL Database V12 using PowerShell" 
	description="Explains how to upgrade to Azure SQL Database V12 including how to upgrade Web and Business databases, and how to upgrade a V11 server migrating its databases directly into an elastic database pool using PowerShell." 
	services="sql-database" 
	documentationCenter="" 
	authors="stevestein" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/28/2015" 
	ms.author="sstein"/>

# Upgrade to SQL Database V12 using PowerShell


> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-v12-upgrade.md)
- [PowerShell](sql-database-upgrade-server.md)



SQL Database V12 is the latest version of SQL Database and has many [advantages over the previous version](sql-database-v12-whats-new.md). SQL Database V12 is recommended for all new development.

> [AZURE.IMPORTANT] All databases on the server will remain online and available throughout the upgrade operation. Upgrading to SQL Database V12 does not take any databases offline.

During the process of upgrading to SQL Database V12 you must also update all Web and Business databases to a new service tier. 

To assist you with upgrading, the SQL Database service recommends an appropriate service tier and performance level (pricing tier) for each database. The service recommends the best tier for running your existing database’s workload by analyzing the historical usage for your database. 

For servers with 2 or more databases, migrating to an [elastic database pool](sql-database-elastic-pool.md) is likely to be more cost effective than upgrading to individual performance levels. You can easily migrate databases directly from V11 servers into elastic database pools using PowerShell (as shown in this article). You can also use the portal to migrate V11 databases into a pool but you must first [upgrade to a V12 server](sql-database-v12-upgrade.md) -- then [add a pool to the server](sql-database-elastic-pool-portal.md#step-1-add-a-pool-to-a-server) and put some or all of the databases in the pool.


## Prerequisites 

To upgrade a server to V12 with PowerShell, you need to have Azure PowerShell installed and running, and  depending on the version you may need to switch it into resource manager mode to access the Azure Resource Manager PowerShell Cmdlets. 

> [AZURE.IMPORTANT] Starting with the release of Azure PowerShell 1.0 Preview, the Switch-AzureMode cmdlet is no longer available, and cmdlets that were in the Azure ResourceManger module have been renamed. The examples in this article use the new PowerShell 1.0 Preview naming convention. For detailed information, see [Deprecation of Switch-AzureMode in Azure PowerShell](https://github.com/Azure/azure-powershell/wiki/Deprecation-of-Switch-AzureMode-in-Azure-PowerShell).

To run PowerShell cmdlets, you need to have Azure PowerShell installed and running, and due to the removal of Switch-AzureMode, you should download and install the latest Azure PowerShell by running the [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409). For detailed information, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).


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

For more information, see [Azure SQL Database elastic database pool recommendations](sql-database-elastic-pool-portal.md#elastic-database-pool-pricing-tier-recommendations) and [Azure SQL Database picing tier recommendations](sql-database-service-tier-advisor.md). 



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
    Start-AzureRmSqlServerUpgrade –ResourceGroupName resourcegroup1 –ServerName server1 -Version 12.0 -DatabaseCollection @($databaseMap1, $databaseMap2) -ElasticPoolCollection @($elasticPool) 

    

## Monitor databases after upgrading to SQL Database V12


After upgrading, it is recommended to monitor the database actively to ensure applications are running at the desired performance and optimize usage as needed. The following additional steps are recommended for monitoring the database.


**Resource consumption data:** For Basic, Standard, and Premium databases more granular resource consumption data is available through the [sys.dm_ db_ resource_stats](http://msdn.microsoft.com/library/azure/dn800981.aspx) DMV in the user database. This DMV provides near real time resource consumption information at 15 second granularity for the previous hour of operation. The DTU percentage consumption for an interval is computed as the maximum percentage consumption of the CPU, IO and log dimensions. Here is a query to compute the average DTU percentage consumption over the last hour:

    SELECT end_time
    	 , (SELECT Max(v)
             FROM (VALUES (avg_cpu_percent)
                         , (avg_data_io_percent)
                         , (avg_log_write_percent)
    	   ) AS value(v)) AS [avg_DTU_percent]
    FROM sys.dm_db_resource_stats
    ORDER BY end_time DESC;

For more information, see [Azure SQL Database performance guidance for single databases](http://msdn.microsoft.com/library/azure/dn369873.aspx) and [Price and performance considerations for an elastic database pool](sql-database=elastic-pool-guidance.md).


**Alerts:** Set up 'Alerts' in the Azure Portal to notify you when the DTU consumption for an upgraded database approaches certain high level. Database alerts can be setup in the Azure Portal for various performance metrics like DTU, CPU, IO, and Log. Browse to your database and select **Alert rules** in the **Settings** blade.

For example, you can set up an email alert on “DTU Percentage” if the average DTU percentage value exceeds 75% over the last 5 minutes. Refer to [Receive alert notifications](insights-receive-alert-notifications.md) to learn more about how to configure alert notifications.





## Next Steps

- [Create an elastic database pool](sql-database-elastic-pool-portal.md) and add some or all of the databases into the pool.
- [Change the service tier and performance level of your database](sql-database-scale-up.md).



## Related Information

- [Get-AzureRmSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt603582.aspx)
- [Start-AzureRmSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt619403.aspx)
- [Stop-AzureRmSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt603589.aspx)

