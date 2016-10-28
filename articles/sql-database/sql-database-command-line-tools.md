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
	ms.date="09/13/2016"
	ms.author="sstein"/>

# Manage Azure SQL Database with PowerShell


> [AZURE.SELECTOR]
- [Azure portal](sql-database-manage-portal.md)
- [Transact-SQL (SSMS)](sql-database-manage-azure-ssms.md)
- [PowerShell](sql-database-manage-powershell.md)

This topic shows the PowerShell cmdlets that are used to perform many Azure SQL Database tasks. For a complete list, see [Azure SQL Database Cmdlets](https://msdn.microsoft.com/library/mt574084.aspx).


## Create a resource group

Create a resource group for our SQL Database and related Azure resources with the [New-AzureRmResourceGroup](https://msdn.microsoft.com/library/azure/mt759837.aspx) cmdlet.

```
$resourceGroupName = "resourcegroup1"
$resourceGroupLocation = "northcentralus"
New-AzureRmResourceGroup -Name $resourceGroupName -Location $resourceGroupLocation
```

For more information, see [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md).
For a sample script, see [Create a SQL database PowerShell script](sql-database-get-started-powershell.md#create-a-sql-database-powershell-script).

## Create a SQL Database server

Create a SQL Database server with the [New-AzureRmSqlServer](https://msdn.microsoft.com/library/azure/mt603715.aspx) cmdlet. Replace *server1* with the name for your server. Server names must be unique across all Azure SQL Database servers. If the server name is already taken, you get an error. This command may take several minutes to complete. The resource group must already exist in your subscription.

```
$resourceGroupName = "resourcegroup1"

$sqlServerName = "server1"
$sqlServerVersion = "12.0"
$sqlServerLocation = "northcentralus"
$serverAdmin = "loginname"
$serverPassword = "password" 
$securePassword = ConvertTo-SecureString –String $serverPassword –AsPlainText -Force
$creds = New-Object –TypeName System.Management.Automation.PSCredential –ArgumentList $serverAdmin, $securePassword
    

$sqlServer = New-AzureRmSqlServer -ServerName $sqlServerName `
 -SqlAdministratorCredentials $creds -Location $sqlServerLocation `
 -ResourceGroupName $resourceGroupName -ServerVersion $sqlServerVersion
```

For more information, see [What is SQL Database](sql-database-technical-overview.md). For a sample script, see [Create a SQL database PowerShell script](sql-database-get-started-powershell.md#create-a-sql-database-powershell-script).


## Create a SQL Database server firewall rule

Create a firewall rule to access the server with the [New-AzureRmSqlServerFirewallRule](https://msdn.microsoft.com/library/azure/mt603860.aspx) cmdlet. Run the following command, replacing the start and end IP addresses with valid values for your client. The resource group, and server must already exist in your subscription.

```
$resourceGroupName = "resourcegroup1"
$sqlServerName = "server1"

$firewallRuleName = "firewallrule1"
$firewallStartIp = "0.0.0.0"
$firewallEndIp = "255.255.255.255"

New-AzureRmSqlServerFirewallRule -ResourceGroupName $resourceGroupName `
 -ServerName $sqlServerName -FirewallRuleName $firewallRuleName `
 -StartIpAddress $firewallStartIp -EndIpAddress $firewallEndIp
```

To allow other Azure services access to your server, create a firewall rule and set both the `-StartIpAddress` and `-EndIpAddress` to **0.0.0.0**. This special firewall rule allows all Azure traffic to access the server.

For more information, see [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx). For a sample script, see [Create a SQL database PowerShell script](sql-database-get-started-powershell.md#create-a-sql-database-powershell-script).


## Create a SQL database (blank)

Create a database with the [New-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619339.aspx) cmdlet. The resource group, and server must already exist in your subscription. 

```
$resourceGroupName = "resourcegroup1"
$sqlServerName = "server1"

$databaseName = "database1"
$databaseEdition = "Standard"
$databaseServiceLevel = "S0"

$currentDatabase = New-AzureRmSqlDatabase -ResourceGroupName $resourceGroupName `
 -ServerName $sqlServerName -DatabaseName $databaseName `
 -Edition $databaseEdition -RequestedServiceObjectiveName $databaseServiceLevel
```

For more information, see [What is SQL Database](sql-database-technical-overview.md). For a sample script, see [Create a SQL database PowerShell script](sql-database-get-started-powershell.md#create-a-sql-database-powershell-script).


## Change the performance level of a SQL database

Scale your database up or down with the [Set-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619433.aspx) cmdlet. The resource group, server, and database must already exist in your subscription. Set the `-RequestedServiceObjectiveName` to a single space (like the following snippet) for Basic tier. Set it to *S0*, *S1*, *P1*, *P6*, etc., like the preceding example for other tiers.

```
$resourceGroupName = "resourcegroup1"
$sqlServerName = "server1"

$databaseName = "database1"
$databaseEdition = "Basic"
$databaseServiceLevel = " "

Set-AzureRmSqlDatabase -ResourceGroupName $resourceGroupName `
 -ServerName $sqlServerName -DatabaseName $databaseName `
 -Edition $databaseEdition -RequestedServiceObjectiveName $databaseServiceLevel
```

For more information, see [SQL Database options and performance: Understand what's available in each service tier](sql-database-service-tiers.md). For a sample script, see [Sample PowerShell script to change the service tier and performance level of your SQL database](sql-database-scale-up-powershell.md#sample-powershell-script-to-change-the-service-tier-and-performance-level-of-your-sql-database).

## Copy a SQL database to the same server

Copy a SQL database to the same server with the [New-AzureRmSqlDatabaseCopy](https://msdn.microsoft.com/library/azure/mt603644.aspx) cmdlet. Set the `-CopyServerName` and `-CopyResourceGroupName` to the same values as your source database server and resource group.

```
$resourceGroupName = "resourcegroup1"
$sqlServerName = "server1"
$databaseName = "database1"

$copyDatabaseName = "database1_copy"
$copyServerName = $sqlServerName
$copyResourceGroupName = $resourceGroupName

New-AzureRmSqlDatabaseCopy -DatabaseName $databaseName `
 -ServerName $sqlServerName -ResourceGroupName $resourceGroupName `
 -CopyDatabaseName $copyDatabaseName -CopyServerName $sqlServerName `
 -CopyResourceGroupName $copyResourceGroupName
```

For more information, see [Copy an Azure SQL Database](sql-database-copy.md). For a sample script, see [Copy a SQL database PowerShell script](sql-database-copy-powershell.md#example-powershell-script).


## Delete a SQL database

Delete a SQL database with the [Remove-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619368.aspx) cmdlet. The resource group, server, and database must already exist in your subscription.

```
$resourceGroupName = "resourcegroup1"
$sqlServerName = "server1"
$databaseName = "database1"

Remove-AzureRmSqlDatabase -DatabaseName $databaseName `
 -ServerName $sqlServerName -ResourceGroupName $resourceGroupName
```

## Delete a SQL Database server

Delete a server with the [Remove-AzureRmSqlServer](https://msdn.microsoft.com/library/azure/mt603488.aspx) cmdlet.

```
$resourceGroupName = "resourcegroup1"
$sqlServerName = "server1"

Remove-AzureRmSqlServer -ServerName $sqlServerName -ResourceGroupName $resourceGroupName
```

## Create and manage elastic database pools using PowerShell

For details about creating elastic database pools using PowerShell, see [Create a new elastic database pool with PowerShell](sql-database-elastic-pool-create-powershell.md).

For details about managing elastic database pools using PowerShell, see [Monitor and manage an elastic database pool with PowerShell](sql-database-elastic-pool-manage-powershell.md).



## Related information

- [Azure SQL Database Cmdlets](https://msdn.microsoft.com/library/azure/mt574084.aspx)
- [Azure Cmdlet Reference](https://msdn.microsoft.com/library/azure/dn708514.aspx)
