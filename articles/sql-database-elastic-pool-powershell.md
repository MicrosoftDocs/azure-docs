<properties 
   pageTitle="Create an Azure SQL Database elastic pool using Azure PowerShell" 
   description="Create an Azure SQL Database elastic pool using Azure PowerShell" 
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
   ms.date="04/22/2015"
   ms.author="adamkr; sstein"/>

# Create an Azure SQL Database elastic pool using Azure PowerShell

> [AZURE.SELECTOR]
- [Create an elastic pool - portal](sql-database-elastic-pool.md)

## Overview

This article shows you how to create an Azure SQL elastic pool using Azure PowerShell. For detailed information about elastic pools, see [Azure SQL Database elastic pools](sql-database-elastic-pool.md)


The individual steps to create an elastic pool with Azure PowerShell are broken out and explained for clarity. 

To create an elastic pool you will need the following:

- Azure subscription
- Azure resource group
- Azure SQL Server
- Firewall rule on the server that allows access to the computer running the PowerShell cmdlets.

This article will show you how to create everything in the above list except for the Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article!


For those who simply want a concise list of commands see the **Putting it all together** section at the bottom of this article.


## Prepare your environment

To create an elastic pool with PowerShell, you need to have Azure PowerShell installed and running, and switch it into resource manager mode to access the Azure Resource Manager PowerShell Cmdlets. 

### Download and install Azure PowerShell
You can download and install the Azure PowerShell modules by running the [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409). For detailed information, see [How to install and configure Azure PowerShell](powershell-install-configure.md).

### Start PowerShell and switch to Azure Resource Management mode
The cmdlets for creating and managing Azure SQL Databases and elastic pools are located in the Azure Resource Manager module. When you start Azure PowerShell, the cmdlets in the Azure module are imported by default. To switch to the Azure Resource Manager module, use the Switch-AzureMode cmdlet.

	PS C:\>Switch-AzureMode -Name AzureResourceManager

For detailed information, see [Using Windows PowerShell with Resource Manager](powershell-azure-resource-manager.md).


## Configure your Azure credentials

Now that you are running the Azure resource manager module you have access to all the necessary cmdlets to create and configure an elastic pool. First you must establish access to your Azure account. Run the following and you will be presented with a sign in screen to enter your credentials. Use the same email and password that you use to sign in to the Azure portal.

	PS C:\>Add-AzureAccount

After successfully signing in you should see some information on screen that includes the Id you signed in with and the Azure subscriptions you have access to.


## Select the Azure subscription to create the elastic pool in

To select an Azure subscription you will need your subscription Id. You can copy it from the previous step, or if you have multiple subscriptions you can run the **Get-Subscription** cmdlet and copy the desired **SubscriptionId** from the resultset. Once you have your subscription Id run the following cmdlet:

	PS C:\>Select-AzureSubscription -SubscriptionId 4cac86b0-1e56-bbbb-aaaa-000000000000


## Select or create a resource group to create the elastic pool in

Now you have access to run cmdlets against your Azure subscription so the next step is establishing the resource group that contains the server where the elastic pool will be created.

If you already have a resource group you can go to the next step, or you can run the following command to create a new resource group:

	PS C:\>New-AzureResourceGroup -Name "resourcegroup1" -Location "West US"


## Select or create an Azure SQL Server to create the elastic pool in

Elastic pools are created inside Azure SQL Servers. If you already have a server you can go to the next step, or you can run the following command to create a new V12 server. Replace the ServerName with the name for your server. It must be unique to Azure SQL Servers so you may get an error here if the server name is already taken. Also worth noting is that this command may take several minutes to complete. The server details and PowerShell prompt will appear after the server is successfully created.

	PS C:\>New-AzureSqlServer -ResourceGroupName "resourcegroup1" -ServerName "server1" -Location "West US" -ServerVersion "12.0"

When you run this command a window opens asking for a **User name** and **Password**. This is  not your Azure credentials, enter the user name and password that will be the administrator credentials you want to create for the new server.  


## Configure a server firewall rule to allow access to the server

Establish a firewall rule to access the server. Run the following command replacing the start and end IP addresses with valid values for your computer.

	PS C:\>New-AzureSqlServerFirewallRule -ResourceGroupName "resourcegroup1" -ServerName "server1" -FirewallRuleName "rule1" -StartIpAddress "192.168.0.198" -EndIpAddress "192.168.0.199"

For more information, see [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx).


## Create an elastic pool

Now you have a resource group, a server, and a firewall rule configured so you can access the server the following command will create the elastic pool. This command creates a pool that shares a total of 400 DTUs. Each database in the pool is guaranteed to always have 10 DTUs available (DatabaseDtuMin). Individual databases in the pool can consume a maximum of 100 DTUs (DatabaseDtuMax). For detailed parameter explanations, see [Azure SQL Database elastic pools](sql-database-elastic-pool.md). 


	PS C:\>New-AzureSqlElasticPool -ResourceGroupName "resourcegroup1" -ServerName "server1" -ElasticPoolName "elasticpool1" -Edition "Standard" -Dtu 400 -DatabaseDtuMin 10 -DatabaseDtuMax 100


## Create or add databases into an elastic pool

The elastic pool created in the previous step is empty, it has no databases in it. The following sections show how to create new databases inside of the elastic pool, and also how to add existing databases into the pool.


### Create a new database inside an elastic pool

To create a new database directly inside an elastic pool, use the **New-AzureSqlDatabase** cmdlet and set the **ElasticPoolName** parameter.


	PS C:\>New-AzureSqlDatabase -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -ElasticPoolName "elasticpool1" -MaxSizeBytes 10GB



### Move an existing database into an elastic pool

To move an existing database into an elastic pool, use the **Set-AzurSqlDatabase** cmdlet and set the **ElasticPoolName** parameter. 


For demonstration, create a database that's not in an elastic pool.

	PS C:\>New-AzureSqlDatabase -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -Edition "Standard" -MaxSizeBytes 10GB

Move the existing database into the elastic pool.

	PS C:\>Set-AzureSqlDatabase -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -ElasticPoolName "elasticpool1"



## Putting it all together


    Switch-AzureMode -Name AzureResourceManager
    Add-AzureAccount
    Select-AzureSubscription -SubscriptionId 4cac86b0-1e56-bbbb-aaaa-000000000000
    New-AzureResourceGroup -Name "resourcegroup1" -Location "West US"
    New-AzureSqlServer -ResourceGroupName "resourcegroup1" -ServerName "server1" -Location "West US" -ServerVersion "12.0"
    New-AzureSqlServerFirewallRule -ResourceGroupName "resourcegroup1" -ServerName "server1" -FirewallRuleName "rule1" -StartIpAddress "192.168.0.198" -EndIpAddress "192.168.0.199"
    New-AzureSqlElasticPool -ResourceGroupName "resourcegroup1" -ServerName "server1" -ElasticPoolName "elasticpool1" -Edition "Standard" -Dtu 400 -DatabaseDtuMin 10 -DatabaseDtuMax 100
    New-AzureSqlDatabase -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -ElasticPoolName "elasticpool1" -MaxSizeBytes 10GB



## Next steps

After creating an elastic pool, you can manage the databases in the pool by creating elastic jobs. Elastic jobs facilitate running T-SQL scripts against any number of databases in the pool.

For more information, see [Elastic database jobs overview](sql-database-elastic-jobs-overview.md).

