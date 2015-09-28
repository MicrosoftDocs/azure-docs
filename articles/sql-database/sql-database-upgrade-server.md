<properties 
	pageTitle="Upgrade an Azure SQL server to V12 with PowerShell" 
	description="Upgrade an Azure SQL server to V12 with PowerShell." 
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
	ms.date="09/05/2015" 
	ms.author="sstein"/>

# Upgrade Azure SQL server to V12 with PowerShell
 

This article shows you how to upgrade a SQL Database server to V12 using pricing tier and elastic pool recommendations. 



## Prerequisites 

To upgrade a server to V12 with PowerShell, you need to have Azure PowerShell installed and running, and  depending on the version you may need to switch it into resource manager mode to access the Azure Resource Manager PowerShell Cmdlets. 

You can download and install the Azure PowerShell modules by running the [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409). For detailed information, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).

The cmdlets for creating and managing Azure SQL Databases are located in the Azure Resource Manager module. When you start Azure PowerShell, the cmdlets in the Azure module are imported by default. To switch to the Azure Resource Manager module, use the **Switch-AzureMode** cmdlet.

	Switch-AzureMode -Name AzureResourceManager

If you get a warning saying 'The Switch-AzureMode cmdlet is deprecated and will be removed in a future release.' You can ignore it and move on to the next section.

For detailed information, see [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).



## Configure your credentials

To run PowerShell cmdlets against your Azure subscription you must first establish access to your Azure account. Run the following and you will be presented with a sign in screen to enter your credentials. Use the same email and password that you use to sign in to the Azure portal.

	Add-AzureAccount

After successfully signing in you should see some information on screen that includes the Id you signed in with and the Azure subscriptions you have access to.


## Select your Azure subscription

To select the subscription you want to work with you need your subscription Id (**-SubscriptionId**) or subscription name (**-SubscriptionName**). You can copy it from the previous step, or if you have multiple subscriptions you can run the **Get-AzureSubscription** cmdlet and copy the desired subscription information from the resultset.

Run the following cmdlet with your subscription information to set your current subscription:

	Select-AzureSubscription -SubscriptionId 4cac86b0-1e56-bbbb-aaaa-000000000000

The following commands will be run against the subscription you just selected above.

## Get Recommendations

To get the recommendation for the server upgrade run the following cmdlet: 

    $hint = Get-AzureSqlServerUpgradeHint -ResourceGroupName “resourcegroup1” -ServerName “server1” 

For more information, see [Azure SQL Database elastic database pool recommendations](sql-database-elastic-pool-portal.md#elastic-database-pool-pricing-tier-recommendations) and [Azure SQL Database picing tier recommendations](sql-database-service-tier-advisor.md). 



## Start the upgrade

To start the upgrade of the server run the following cmdlet: 

    Start-AzureSqlServerUpgrade -ResourceGroupName “resourcegroup1” -ServerName “server1” -ServerVersion 12.0 -DatabaseCollection $hint.Databases -ElasticPoolCollection $hint.ElasticPools  


When you run this command upgrade process will begin. You can customize the output of the recommendation and provide the edited recommendation to this cmdlet. 


## Upgrade an Azure SQL server


    # Adding the account
    #
    Add-AzureAccount
    
    # Switch mode
    #
    Switch-AzureMode -Name AzureResourceManager

    # Setting the variables
    #
    $SubscriptionName = 'YOUR_SUBSCRIPTION' 
    $ResourceGroupName = 'YOUR_RESOURCE_GROUP' 
    $ServerName = 'YOUR_SERVER' 
    
    # Selecting the right subscription 
    # 
    Select-AzureSubscription $SubscriptionName 
    
    # Getting the upgrade recommendations 
    #
    $hint = Get-AzureSqlServerUpgradeHint -ResourceGroupName $ResourceGroupName -ServerName $ServerName 
    
    # Starting the upgrade process 
    #
    Start-AzureSqlServerUpgrade -ResourceGroupName $ResourceGroupName -ServerName $ServerName -ServerVersion 12.0 -DatabaseCollection $hint.Databases -ElasticPoolCollection $hint.ElasticPools  


## Custom upgrade mapping

If the recommendations are not appropriate for your server and business case, then you can choose how your databases are upgraded and can map them to either single or elastic databases.

Upgrade databases into an elastic database pool:

    $elasticPool = New-Object -TypeName Microsoft.Azure.Management.Sql.Models.UpgradeRecommendedElasticPoolProperties
    $elasticPool.DatabaseDtuMax = 100  
    $elasticPool.DatabaseDtuMin = 0  
    $elasticPool.Dtu = 800
    $elasticPool.Edition = "Standard"  
    $elasticPool.DatabaseCollection = ("DB1")  
    $elasticPool.Name = "elasticpool_1"  


Upgrade databases into single databases:

    $databaseMap = New-Object -TypeName Microsoft.Azure.Management.Sql.Models.UpgradeDatabaseProperties  
    $databaseMap.Name = "DB2"
    $databaseMap.TargetEdition = "Standard"
    $databaseMap.TargetServiceLevelObjective = "S0"
    Start-AzureSqlServerUpgrade –ResourceGroupName resourcegroup1 –ServerName server1 -Version 12.0 -DatabaseCollection($databaseMap) -ElasticPoolCollection ($elasticPool)
    




## Related Information

- [Azure SQL Database Resource Manager Cmdlets](https://msdn.microsoft.com/library/mt163521.aspx)
- [Azure SQL Database Service Management Cmdlets](https://msdn.microsoft.com/library/dn546726.aspx)
 
