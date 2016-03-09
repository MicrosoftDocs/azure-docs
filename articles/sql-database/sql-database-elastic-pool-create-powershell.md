<properties 
    pageTitle="Scale-out resources with elastic database pools | Microsoft Azure" 
    description="Learn how to use PowerShell to scale-out Azure SQL Database resources by creating an elastic database pool to manage multiple databases." 
	keywords="multiple databases,scale-out"    
	services="sql-database" 
    documentationCenter="" 
    authors="stevestein" 
    manager="jeffreyg" 
    editor=""/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="get-started-article"
    ms.tgt_pltfrm="powershell"
    ms.workload="data-management" 
    ms.date="03/08/2016"
    ms.author="sstein"/>

# Create an elastic database pool with PowerShell to scale-out resources for multiple SQL databases 

> [AZURE.SELECTOR]
- [Azure portal](sql-database-elastic-pool-create-portal.md)
- [C#](sql-database-elastic-pool-create-csharp.md)
- [PowerShell](sql-database-elastic-pool-create-powershell.md)

Learn how to manage multiple databases by creating an [elastic database pool](sql-database-elastic-pool.md) using PowerShell cmdlets. 

> [AZURE.NOTE] Elastic database pools are currently in preview and only available with SQL Database V12 servers. If you have a SQL Database V11 server you can [use PowerShell to upgrade to V12 and create a pool](sql-database-upgrade-server-portal.md) in one step.

Elastic database pools allow you to scale-out database resources and management across multiple SQL databases.

This article shows you how to create everything you need (including the V12 server) to create and configure an elastic database pool except for the Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.




The individual steps to create an elastic database pool with Azure PowerShell are broken out and explained for clarity. For those who simply want a concise list of commands, see the **Putting it all together** section at the bottom of this article.


To run PowerShell cmdlets, you need to have Azure PowerShell installed and running. For detailed information, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).




## Create an elastic database pool, and elastic databases

The [New-AzureRmSqlElasticPool](https://msdn.microsoft.com/library/azure/mt619378.aspx) cmdlet creates an elastic database pool. This command creates a pool that shares a total of 400 eDTUs. Each database in the pool is guaranteed to always have 10 eDTUs available (DatabaseDtuMin). Individual databases in the pool can consume a maximum of 100 eDTUs (DatabaseDtuMax). For detailed parameter explanations, see [Azure SQL Database elastic pools](sql-database-elastic-pool.md). 


	New-AzureRmSqlElasticPool -ResourceGroupName "resourcegroup1" -ServerName "server1" -ElasticPoolName "elasticpool1" -Edition "Standard" -Dtu 400 -DatabaseDtuMin 10 -DatabaseDtuMax 100


### Create or add elastic databases into an elastic database pool

The pool created in the previous step is empty, it has no elastic databases in it. The following sections show how to create new elastic databases inside of the pool, and also how to add existing databases into the pool.

*After creating a pool you can also use Transact-SQL for creating new elastic databases in the pool, and moving existing databases in and out of a pool. For details see, [Elastic database pool reference - Transact-SQL](sql-database-elastic-pool-reference.md#Transact-SQL).*

### Create a new elastic database inside an elastic database pool

To create a new database directly inside a pool, use the [New-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619339.aspx) cmdlet and set the **ElasticPoolName** parameter.


	New-AzureRmSqlDatabase -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -ElasticPoolName "elasticpool1"



### Move an existing database into an elastic database pool

To move an existing database into a pool, use the [Set-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619433.aspx) cmdlet and set the **ElasticPoolName** parameter. 


	Set-AzureRmSqlDatabase -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -ElasticPoolName "elasticpool1"



## Create elastic database pool PowerShell script


    $subscriptionId = '<your Azure subscription id>'
    $resourceGroupName = '<resource group name>'
    $location = '<datacenter location>'
    $serverName = '<server name>'
    $poolName = '<pool name>'
    $databaseName = '<database name>'

    Login-AzureRmAccount
    Set-AzureRmContext -SubscriptionId $subscriptionId
    
    New-AzureRmResourceGroup -Name $resourceGroupName -Location $location
    New-AzureRmSqlServer -ResourceGroupName $resourceGroupName -ServerName $serverName -Location $location -ServerVersion "12.0"
    New-AzureRmSqlServerFirewallRule -ResourceGroupName $resourceGroupName -ServerName $serverName -FirewallRuleName "rule1" -StartIpAddress "192.168.0.198" -EndIpAddress "192.168.0.199"

    New-AzureRmSqlElasticPool -ResourceGroupName $resourceGroupName -ServerName $serverName -ElasticPoolName $poolName -Edition "Standard" -Dtu 400 -DatabaseDtuMin 10 -DatabaseDtuMax 100

    New-AzureRmSqlDatabase -ResourceGroupName $resourceGroupName -ServerName $serverName -DatabaseName $databaseName -ElasticPoolName $poolName -MaxSizeBytes 10GB



## Next steps

After creating an elastic database pool, you can manage elastic databases in the pool by creating elastic jobs. Elastic jobs facilitate running T-SQL scripts against any number of databases in the pool. For more information, see [Elastic database jobs overview](sql-database-elastic-jobs-overview.md).


## Elastic database reference

For more information about elastic databases and elastic database pools, including API and error details, see [Elastic database pool reference](sql-database-elastic-pool-reference.md).