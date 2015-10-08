<properties 
    pageTitle="Create an Azure SQL Database using PowerShell" 
    description="Create an Azure SQL Database using PowerShell" 
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
    ms.date="09/01/2015"
    ms.author="sstein"/>

# Create a SQL Database using PowerShell

**Single database**

> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-get-started.md)
- [C#](sql-database-get-started-csharp.md)
- [PowerShell](sql-database-get-started-powershell.md)


## Overview

This article shows you how to create a SQL Database using PowerShell.


To complete this article you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- Azure PowerShell. You can download and install the Azure PowerShell modules by running the [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409). For detailed information, see [How to install and configure Azure PowerShell](powershell-install-configure.md).

The cmdlets for creating and managing Azure SQL Databases are located in the Azure Resource Manager module. When you start Azure PowerShell, the cmdlets in the Azure module are imported by default. To switch to the Azure Resource Manager module, use the Switch-AzureMode cmdlet.

	Switch-AzureMode -Name AzureResourceManager

If you run the **Switch-AzureMode** and see warning: The *Switch-AzureMode cmdlet is deprecated and will be removed in a future release*, that's okay; just go to the next step to configure your credentials.

For detailed information, see [Using Windows PowerShell with Resource Manager](powershell-azure-resource-manager.md).


## Configure your credentials and select your subscription

Now that you are running the Azure Resource Manager module you have access to all the necessary cmdlets to create a SQL database. 

First you must establish access to your Azure account so run the following cmdlet and you will be presented with a sign in screen to enter your credentials. Use the same email and password that you use to sign in to the Azure portal.

	Add-AzureAccount

After successfully signing in you will see some information on screen that includes the Id you signed in with and the Azure subscriptions you have access to.


### Select your Azure subscription

To select the subscription you need your subscription Id. You can copy it from the previous step, or if you have multiple subscriptions you can run the **Get-AzureSubscription** cmdlet and copy the desired subscription information from the resultset. Once you have your subscription run the following cmdlet:

	Select-AzureSubscription -SubscriptionId 4cac86b0-1e56-bbbb-aaaa-000000000000

After successfully running **Select-AzureSubscription** you are returned to the PowerShell prompt. If you have more than one subscription you can run **Get-AzureSubscription** and verify the subscription you want to use shows **IsCurrent: True**.

## Create a resource group, server, and firewall rule

Now you have access to run cmdlets against your selected Azure subscription so the next step is establishing the resource group that contains the server where the database will be created. You can edit the next command to use whatever valid location you choose. Run **(Get-AzureLocation | where-object {$_.Name -eq "Microsoft.Sql/servers" }).Locations** to get a list of valid locations.

Run the following command to create a new resource group:

	New-AzureResourceGroup -Name "resourcegroupsqlgsps" -Location "West US"

After successfully creating the new resource group you see information on screen that includes **ProvisioningState : Succeeded**.


### Create a server 

SQL Databases are created inside Azure SQL Database servers. Run **New-AzureSqlServer** to create a new server. Replace the ServerName with the name for your server. It must be unique to all Azure SQL Servers so you will get an error here if the server name is already taken. Also worth noting is that this command may take several minutes to complete. You can edit the command to use any valid location you choose but you should use the same location you used for the resource group created in the previous step.

	New-AzureSqlServer -ResourceGroupName "resourcegroupsqlgsps" -ServerName "server1" -Location "West US" -ServerVersion "12.0"

When you run this command a window opens asking for a **User name** and **Password**. This is  not your Azure credentials, enter the user name and password that will be the administrator credentials you want to create for the new server.

The server details appear after the server is successfully created.

### Configure a server firewall rule to allow access to the server

Establish a firewall rule to access the server. Run the following command replacing the start and end IP addresses with valid values for your computer.

	New-AzureSqlServerFirewallRule -ResourceGroupName "resourcegroupsqlgsps" -ServerName "server1" -FirewallRuleName "rule1" -StartIpAddress "192.168.0.0" -EndIpAddress "192.168.0.0"

The firewall rule details appear after the rule is successfully created.

To allow other Azure services to access the server add a firewall rule and set both the StartIpAddress and EndIpAddress to 0.0.0.0. Note that this allows Azure traffic from any Azure subscription to access the server.

For more information, see [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx).


## Create a SQL database

Now you have a resource group, a server, and a firewall rule configured so you can access the server.

The following command creates a new (blank) SQL database at the Standard service tier with an S1 performance level:


	New-AzureSqlDatabase -ResourceGroupName "resourcegroupsqlgsps" -ServerName "server1" -DatabaseName "database1" -Edition "Standard" -RequestedServiceObjectiveName "S1"


The database details appear after the database is successfully created.

## Create a SQL database PowerShell script

    $SubscriptionId = "4cac86b0-1e56-bbbb-aaaa-000000000000"
    $ResourceGroupName = "resourcegroupname"
    $Location = "Japan West"
    
    $ServerName = "uniqueservername"
    
    $FirewallRuleName = "rule1"
    $FirewallStartIP = "192.168.0.0"
    $FirewallEndIp = "192.168.0.0"
    
    $DatabaseName = "database1"
    $DatabaseEdition = "Standard"
    $DatabasePerfomanceLevel = "S1"
    
    
    Add-AzureAccount
    Select-AzureSubscription -SubscriptionId $SubscriptionId
    
    $ResourceGroup = New-AzureResourceGroup -Name $ResourceGroupName -Location $Location
    
    $Server = New-AzureSqlServer -ResourceGroupName $ResourceGroupName -ServerName $ServerName -Location $Location -ServerVersion "12.0"
    
    $FirewallRule = New-AzureSqlServerFirewallRule -ResourceGroupName $ResourceGroupName -ServerName $ServerName -FirewallRuleName $FirewallRuleName -StartIpAddress $FirewallStartIP -EndIpAddress $FirewallEndIp
    
    $SqlDatabase = New-AzureSqlDatabase -ResourceGroupName $ResourceGroupName -ServerName $ServerName -DatabaseName $DatabaseName -Edition $DatabaseEdition -RequestedServiceObjectiveName $DatabasePerfomanceLevel
    
    $SqlDatabase
    


## Next steps

- [Connect with SQL Server Management Studio (SSMS)](sql-database-connect-to-database.md)


## Additional Resources

- [Azure SQL Database](https://azure.microsoft.com/documentation/services/sql-database/)