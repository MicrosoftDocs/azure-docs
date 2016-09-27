<properties
	pageTitle="Manage Azure SQL Database with PowerShell | Microsoft Azure"
	description="Azure SQL Database management with PowerShell."
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor="monicar"/>

<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/07/2016"
	ms.author="sstein"/>

# Manage Azure SQL Database with PowerShell


> [AZURE.SELECTOR]
- [Azure Portal](sql-database-manage-portal.md)
- [Transact-SQL (SSMS)](sql-database-manage-azure-ssms.md)
- [PowerShell](sql-database-command-line-tools.md)

This topic provides PowerShell commands to perform many Azure SQL Database tasks.

[AZURE.INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell.md)]


## Create a resource group

Create the resource group that will contain the server. You can edit the next command to use any valid location.

For a list of valid SQL Database server locations, run the following cmdlet:

	$AzureSQLLocations = (Get-AzureRmResourceProvider -ListAvailable | Where-Object {$_.ProviderNamespace -eq 'Microsoft.Sql'}).Locations

If you already have a resource group, you can skip to the next section ("Create a server"), or you can edit and run the following command to create a new resource group:

	New-AzureRmResourceGroup -Name "resourcegroupJapanWest" -Location "Japan West"

## Create a server

To create a new version 12 server, use the [New-AzureRmSqlServer](https://msdn.microsoft.com/library/azure/mt603715.aspx) cmdlet. Replace *server12* with the name for your server. If the server name is already taken, you will get an error message. Also worth noting is that this command may take several minutes to complete. The server details and PowerShell prompt appear after the server is successfully created. You can edit the command to use any valid location.

	New-AzureRmSqlServer -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -Location "Japan West" -ServerVersion "12.0"

When you run this command, you are prompted for your user name and password. Don't enter your Azure credentials here. Instead, enter the user name and password that will be the administrator credentials you want to create for the new server.

## Create a server firewall rule

To create a firewall rule to access the server, use the [New-AzureRmSqlServerFirewallRule](https://msdn.microsoft.com/library/azure/mt603860.aspx) command. Run the following command, replacing the start and end IP addresses with valid values for your client.

If your server needs to allow access to other Azure services, add the **-AllowAllAzureIPs** switch. This adds a special firewall rule, and allows all Azure traffic access to the server.

	New-AzureRmSqlServerFirewallRule -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -FirewallRuleName "clientFirewallRule1" -StartIpAddress "192.168.0.198" -EndIpAddress "192.168.0.199"

For more information, see [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx).

## Create a SQL database

To create a database, use the [New-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619339.aspx) command. You need a server to create a database. The following example creates a SQL database named TestDB12. The database is created as a Standard S1 database.

	New-AzureRmSqlDatabase -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -DatabaseName "TestDB12" -Edition Standard -RequestedServiceObjectiveName "S1"


## Change the performance level of a SQL database

You can scale your database up or down with the [Set-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619433.aspx) command. The following example scales up a SQL database named TestDB12 from its current performance level to a Standard S3 level.

	Set-AzureRmSqlDatabase -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -DatabaseName "TestDB12" -Edition Standard -RequestedServiceObjectiveName "S3"


## Delete a SQL database

You can delete a SQL database with the [Remove-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619368.aspx) command. The following example deletes a SQL database named TestDB12.

	Remove-AzureRmSqlDatabase -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12" -DatabaseName "TestDB12"

## Delete a server

You can also delete a server with the [Remove-AzureRmSqlServer](https://msdn.microsoft.com/library/azure/mt603488.aspx) command. The following example deletes a server named server12.


>[AZURE.NOTE]  The delete operation is asynchronous, and may take some time. Verify that the operation is finished before performing any additional operations that depend on the server being completely deleted (for example, creating a new server with the same name).


	Remove-AzureRmSqlServer -ResourceGroupName "resourcegroupJapanWest" -ServerName "server12"




## Next steps

Combine commands and automate. For example, to create a server, firewall rule, and database, replace everything within the quotes, including the < and > characters, with your values:


    New-AzureRmResourceGroup -Name "<resourceGroupName>" -Location "<Location>"
    New-AzureRmSqlServer -ResourceGroupName "<resourceGroupName>" -ServerName "<serverName>" -Location "<Location>" -ServerVersion "12.0"
    New-AzureRmSqlServerFirewallRule -ResourceGroupName "<resourceGroupName>" -ServerName "<serverName>" -FirewallRuleName "<firewallRuleName>" -StartIpAddress "<192.168.0.198>" -EndIpAddress "<192.168.0.199>"
    New-AzureRmSqlDatabase -ResourceGroupName "<resourceGroupName>" -ServerName "<serverName>" -DatabaseName "<databaseName>" -Edition <Standard> -RequestedServiceObjectiveName "<S1>"

## Related information

- [Azure SQL Database Cmdlets](https://msdn.microsoft.com/library/azure/mt574084.aspx)
