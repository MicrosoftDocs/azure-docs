<properties 
	pageTitle="Manage Azure SQL Database Resources with PowerShell" 
	description="Azure SQL Database Manage with PowerShell." 
	services="sql-database" 
	documentationCenter="" 
	authors="TigerMint" 
	manager="" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/28/2015" 
	ms.author="vinsonyu"/>

# Manage Azure SQL Database Resources with PowerShell


This topic provides PowerShell commands to perform many Azure SQL Database tasks using Azure Resource Manager cmdlets.


## Prerequisites

To run PowerShell cmdlets, you need to have Azure PowerShell installed and running, and  depending on the version you may need to switch it into resource manager mode to access the Azure Resource Manager PowerShell Cmdlets. 

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

## Create a resource group

Create the resource group that will contain the server. You can edit the next command to use any valid location. 

For a list of valid Azure SQL Database server locations run the following cmdlets:

	$AzureSQLLocations = Get-AzureLocation | Where-Object Name -Like "*SQL/Servers"
	$AzureSQLLocations.Locations

If you already have a resource group you can jump ahead to create a server, or you can edit and run the following command to create a new resource group:

	New-AzureResourceGroup -Name "resourcegroupJapanWest" -Location "Japan West"

## Create a server 

To create a new V12 server use the [New-AzureSqlServer](https://msdn.microsoft.com/library/mt163526.aspx) command. Replace server12 with the name for your server. It must be unique to Azure SQL Servers so you may get an error here if the server name is already taken. Also worth noting is that this command may take several minutes to complete. The server details and PowerShell prompt will appear after the server is successfully created. You can edit the  command to use any valid location.

	New-AzureSqlServer -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -Location "Japan West" -ServerVersion "12.0"

When you run this command a window opens asking for a **User name** and **Password**. This is  not your Azure credentials, enter the user name and password that will be the administrator credentials you want to create for the new server.

## Create a server firewall rule

To create a firewall rule to access the server use the [New-AzureSqlServerFirewallRule](https://msdn.microsoft.com/library/mt125953.aspx) command. Run the following command replacing the start and end IP addresses with valid values for your client.

If your server needs to allow access to other Azure services, add the **-AllowAllAzureIPs** switch that will add a special firewall rule and allow all azure traffic access to the server.

	New-AzureSqlServerFirewallRule -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -FirewallRuleName "clientFirewallRule1" -StartIpAddress "192.168.0.198" -EndIpAddress "192.168.0.199"

For more information, see [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx).

## Create a SQL database

To create a database use the [New-AzureSqlDatabase](https://msdn.microsoft.com/library/mt125915.aspx) command. You need a server to create a database. The following example creates a SQL database named TestDB12. The database is created as a Standard S1 database.

	New-AzureSqlDatabase -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -DatabaseName "TestDB12" -Edition Standard -RequestedServiceObjectiveName "S1"


## Change the performance level of a SQL database

You can scale your database up or down with the [Set-AzureSqlDatabase](https://msdn.microsoft.com/library/mt125814.aspx) command. The following example scales up a SQL database named TestDB12 from its current performance level to a Standard S3 level.

	Set-AzureSqlDatabase -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -DatabaseName "TestDB12" -Edition Standard -RequestedServiceObjectiveName "S3"


## Delete a SQL database

You can delete a SQL database with the [Remove-AzureSqlDatabase](https://msdn.microsoft.com/library/mt125977.aspx) command. The following example deletes a SQL database named TestDB12.

	Remove-AzureSqlDatabase -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -DatabaseName "TestDB12"

## Delete a server

You can also delete a server with the [Remove-AzureSqlServer](https://msdn.microsoft.com/library/mt125891.aspx) command. The following example deletes a server named server12.

	Remove-AzureSqlServer -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12"



If you will be creating these Azure SQL resources again or a similar ones, you can: 

- Save this as a PowerShell script file (*.ps1)
- Save this as an Azure automation runbook in the Automation section of the Azure Management Portal 

## Next Steps

Combine commands and automate. For example, replace everything within the quotes, including the < and > characters, with your values to create a server, firewall rule and database:


    New-AzureResourceGroup -Name "<resourceGroupName>" -Location "<Location>"
    New-AzureSqlServer -ResourceGroupName "<resourceGroupName>" -ServerName "<serverName>" -Location "<Location>" -ServerVersion "12.0"
    New-AzureSqlServerFirewallRule -ResourceGroupName "<resourceGroupName>" -ServerName "<serverName>" -FirewallRuleName "<firewallRuleName>" -StartIpAddress "<192.168.0.198>" -EndIpAddress "<192.168.0.199>"
    New-AzureSqlDatabase -ResourceGroupName "<resourceGroupName>" -ServerName "<serverName>" -DatabaseName "<databaseName>" -Edition <Standard> -RequestedServiceObjectiveName "<S1>"

## Related Information

- [Azure SQL Database Resource Manager Cmdlets](https://msdn.microsoft.com/library/mt163521.aspx)
- [Azure SQL Database Service Management Cmdlets](https://msdn.microsoft.com/library/dn546726.aspx)
 