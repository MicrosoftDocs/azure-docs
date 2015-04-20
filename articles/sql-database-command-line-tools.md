<properties 
	pageTitle="Manage SQL Azure Resources with PowerShell" 
	description="SQL Azure Manage with Command Line" 
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
	ms.date="04/13/2015" 
	ms.author="vinsonyu"/>

# Manage SQL Azure Resources with PowerShell


In this topic you use a PowerShell script to create an Azure SQL Database logical server, a database, and a firewall rule.

## Step 1: Install Azure SDK

If you haven't already, use the instructions in [How to install and configure Azure PowerShell to install Azure PowerShell](powershell-install-configure.md) on your local computer. Then, open an Azure PowerShell command prompt.


## Step 2: Configure PowerShell Scripts
This PowerShell script creates a server, database, and server firewall rule.


1. Copy the following the block of PowerShell cmdlets below into your text editor.
		
		
		Add-AzureAccount #Only needed if you have not been authenicated yet. For Azure Automation, you will need to set up a Service Principal.
		Switch-AzureMode -Name AzureServiceManagement
		$AzureServer = New-AzureSqlDatabaseServer -AdministratorLogin "<Service Admin Login>" -AdministratorLoginPassword "<ServerLoginPassword>" -Location "<Location>" -Version "12.0" -verbose
		New-AzureSqlDatabase -ServerName $AzureServer.ServerName -DatabaseName  "<Database1>" -Edition "Standard" -verbose
		New-AzureSqlDatabaseServerFirewallRule -ServerName $AzureServer.ServerName -RuleName "<FirewallRuleName>" -StartIpAddress "<IP4StartRange>" -EndIpAddress "<IP4EndRange>" -verbose

2. Replace everything within the < >, with the desired values. For a list of valid Azure SQL Server Locations you can run the following cmdlets in your Azure Powershell Command Prompt

		Switch-AzureMode -Name AzureResourceManager
		$AzureSQLLocations = Get-AzureLocation | Where-Object Name -Like "*SQL/Servers"
		$AzureSQLLocations.Locations

##Step 3: Run the PowerShell Script

Review the Azure PowerShell cmdlets you put together.

Copy the configured PowerShell cmdlets from step 2 and paste this into your Azure PowerShell command prompt. This will issue the cmdlets as a series of PowerShell commands and create your Azure SQL server, database and server firewall rule.  

If you will be creating these Azure SQL resources again or a similar one, you can: 

- Save this as a PowerShell script file (*.ps1)
- Save this as an Azure automation runbook in the Automation section of the Azure Management Portal 

##Examples

This PowerShell script will create the resources in West US 

		Add-AzureAccount #Needed if you have not been authenicated yet. For Azure Automation, you will need to set up a Service Principal.
		Switch-AzureMode -Name AzureServiceManagement
		$AzureServer = New-AzureSqlDatabaseServer -AdministratorLogin "admin" -AdministratorLoginPassword "P@ssword" -Location "West US" -Version "12.0" -verbose
		New-AzureSqlDatabase -ServerName $AzureServer.ServerName -DatabaseName  "Database1" -Edition "Standard" -verbose
		New-AzureSqlDatabaseServerFirewallRule -ServerName $AzureServer.ServerName -RuleName "MyFirewallRule" -StartIpAddress "192.168.1.1" -EndIpAddress "192.168.1.1" -verbose

##Resources

For more information on Azure SQL PowerShell Cmdlets, [Click Here](https://msdn.microsoft.com/library/dn546726.aspx)
