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
	ms.date="06/18/2015" 
	ms.author="vinsonyu"/>

# Manage Azure SQL Database Resources with PowerShell


In this topic you use a PowerShell commands to perform many Azure SQL Database tasks.

## Step 1: Install Azure SDK

If you haven't already, use the instructions in [How to install and configure Azure PowerShell to install Azure PowerShell](../powershell-install-configure.md) on your local computer. Then, open an Azure PowerShell command prompt.


For a list of valid Azure SQL Database server locations you can run the following cmdlets in your Azure Powershell Command Prompt

		$AzureSQLLocations = Get-AzureLocation | Where-Object Name -Like "*SQL/Servers"
		$AzureSQLLocations.Locations



## Prerequisites

To run PowerShell cmdlets, you need to have Azure PowerShell installed and running, and  depending on the version you may need to switch it into resource manager mode to access the Azure Resource Manager PowerShell Cmdlets. 

You can download and install the Azure PowerShell modules by running the [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409). For detailed information, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).

The cmdlets for creating and managing Azure SQL Databases and elastic pools are located in the Azure Resource Manager module. When you start Azure PowerShell, the cmdlets in the Azure module are imported by default. To switch to the Azure Resource Manager module, use the Switch-AzureMode cmdlet.

	PS C:\>Switch-AzureMode -Name AzureResourceManager

For detailed information, see [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).



## Configure your credentials and select your subscription

To run PowerShell Cmdlets against your Azure subscription you must first establish access to your Azure account. Run the following and you will be presented with a sign in screen to enter your credentials. Use the same email and password that you use to sign in to the Azure portal.

	PS C:\>Add-AzureAccount

After successfully signing in you should see some information on screen that includes the Id you signed in with and the Azure subscriptions you have access to.


## Select your Azure subscription

To select the subscription you need your subscription Id (**-SubscriptionId**) or subscription name (**-SubscriptionName**). You can copy it from the previous step, or if you have multiple subscriptions you can run the **Get-AzureSubscription** cmdlet and copy the desired subscription information from the resultset. Once you have your subscription info run the following cmdlet to set your current subscription:

	PS C:\>Select-AzureSubscription -SubscriptionId 4cac86b0-1e56-bbbb-aaaa-000000000000



## Create a resource group

Create the resource group that will contain the server. You can edit the next command to use whatever valid location you want. For a list of valid locations run **(Get-AzureLocation | where-object {$_.Name -eq "Microsoft.Sql/servers" }).Locations**.


If you already have a resource group you can jump ahead to create a server, or you can run the following command to create a new resource group:

	PS C:\>New-AzureResourceGroup -Name "resourcegroupJapanWest" -Location "Japan West"

## Create a server 

Elastic pools are created inside Azure SQL Servers. If you already have a server you can go to the next step, or you can run the following command to create a new V12 server. Replace the ServerName with the name for your server. It must be unique to Azure SQL Servers so you may get an error here if the server name is already taken. Also worth noting is that this command may take several minutes to complete. The server details and PowerShell prompt will appear after the server is successfully created. You can edit the  command to use whatever valid location you choose.

	PS C:\>New-AzureSqlServer -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -Location "Japan West" -ServerVersion "12.0"

When you run this command a window opens asking for a **User name** and **Password**. This is  not your Azure credentials, enter the user name and password that will be the administrator credentials you want to create for the new server.

## Create a server firewall rule

Establish a firewall rule to access the server. Run the following command replacing the start and end IP addresses with valid values for your client.

If your server needs to allow access to other Azure services, add the **-AllowAllAzureIPs** switch that will add a special firewall rule and allow all azure traffic access to the server.

	PS C:\>New-AzureSqlServerFirewallRule -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -FirewallRuleName "clientFirewallRule1" -StartIpAddress "192.168.0.198" -EndIpAddress "192.168.0.199"

For more information, see [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx).

## Create a SQL database

If you already have a server you can create a database. The following example creates a SQL database named TestDB12. The database is created as a Standard S1 database.

	PS C:\>New-AzureSqlDatabase -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -DatabaseName "TestDB12" -Edition Standard -RequestedServiceObjectiveName "S1"


## Change the performance level of a SQL database

You can use PowerShell to scale your database up or down. The following example scales up a SQL database named TestDB12 from its current performance level to a Standard S3 level.

	PS C:\>Set-AzureSqlDatabase -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -DatabaseName "TestDB12" -Edition Standard -RequestedServiceObjectiveName "S3"


## Delete a SQL database

You can delete a SQL database. The following example deletes a SQL database named TestDB12.

	PS C:\>Remove-AzureSqlDatabase -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -DatabaseName "TestDB12"

## Delete a server

You can also delete a server. The following example deletes a server named server12.

	PS C:\>Remove-AzureSqlDatabase -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -DatabaseName "TestDB12"



If you will be creating these Azure SQL resources again or a similar ones, you can: 

- Save this as a PowerShell script file (*.ps1)
- Save this as an Azure automation runbook in the Automation section of the Azure Management Portal 



## Related Information

- [Azure SQL Database Resource Manager Cmdlets](https://msdn.microsoft.com/library/mt163521.aspx)
- [Azure SQL Database Service Management Cmdlets](https://msdn.microsoft.com/library/dn546726.aspx)
 