---
title: Manage Azure SQL Database with PowerShell | Microsoft Docs
description: Azure SQL Database management with PowerShell.
services: sql-database
documentationcenter: ''
author: stevestein
manager: jhubbard
editor: monicar

ms.assetid: 3f21ad5e-ba99-4010-b244-5e5815074d31
ms.service: sql-database
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/15/2016
ms.author: sstein

---
# Managing Azure SQL Database using PowerShell
> [!div class="op_single_selector"]
> * [Azure portal](sql-database-manage-portal.md)
> * [Transact-SQL (SSMS)](sql-database-manage-azure-ssms.md)
> * [PowerShell](sql-database-manage-powershell.md)
> 
> 

This topic shows the PowerShell cmdlets that are used to perform many Azure SQL database tasks. For a complete list, see [Azure SQL Database Cmdlets](https://msdn.microsoft.com/library/mt574084\(v=azure.300\).aspx).

## How do I create a resource group?
To create a resource group for your SQL database and related Azure resources, use the [New-AzureRmResourceGroup](https://msdn.microsoft.com/library/azure/mt759837\(v=azure.300\).aspx) cmdlet.

```
$resourceGroupName = "resourcegroup1"
$resourceGroupLocation = "northcentralus"
New-AzureRmResourceGroup -Name $resourceGroupName -Location $resourceGroupLocation
```

For more information, see [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md).
For a sample script, see [Create a SQL database PowerShell script](sql-database-get-started-powershell.md#create-a-sql-database-powershell-script).

## How do I create a SQL database server?
To create a SQL database server, use the [New-AzureRmSqlServer](https://msdn.microsoft.com/library/azure/mt603715\(v=azure.300\).aspx) cmdlet. Replace *server1* with the name for your server. Server names must be unique across all Azure SQL database servers. If the server name is already taken, you get an error. This command may take several minutes to complete. The resource group must already exist in your subscription.

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

## How do I create a SQL database server firewall rule?
To create a firewall rule to access the server, use the [New-AzureRmSqlServerFirewallRule](https://msdn.microsoft.com/library/azure/mt603860\(v=azure.300\).aspx) cmdlet. Run the following command, replacing the start and end IP addresses with valid values for your client. The resource group, and server must already exist in your subscription.

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

## How do I create a SQL database?
To create a SQL database, use the [New-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619339\(v=azure.300\).aspx) cmdlet. The resource group, and server must already exist in your subscription. 

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

## How do I change the performance level of a SQL database?
To change the performance level, scale your database up or down with the [Set-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619433\(v=azure.300\).aspx) cmdlet. The resource group, server, and database must already exist in your subscription. Set the `-RequestedServiceObjectiveName` to a single space (like the following snippet) for Basic tier. Set it to *S0*, *S1*, *P1*, *P6*, etc., like the preceding example for other tiers.

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

## How do I copy a SQL database to the same server?
To copy a SQL database to the same server, use the [New-AzureRmSqlDatabaseCopy](https://msdn.microsoft.com/library/azure/mt603644\(v=azure.300\).aspx) cmdlet. Set the `-CopyServerName` and `-CopyResourceGroupName` to the same values as your source database server and resource group.

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

## How do I delete a SQL database?
To delete a SQL database. use the [Remove-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619368\(v=azure.300\).aspx) cmdlet. The resource group, server, and database must already exist in your subscription.

```
$resourceGroupName = "resourcegroup1"
$sqlServerName = "server1"
$databaseName = "database1"

Remove-AzureRmSqlDatabase -DatabaseName $databaseName `
 -ServerName $sqlServerName -ResourceGroupName $resourceGroupName
```

## How do I delete a SQL database server?
To delete a SQL database server, use the [Remove-AzureRmSqlServer](https://msdn.microsoft.com/library/azure/mt603488\(v=azure.300\).aspx) cmdlet.

```
$resourceGroupName = "resourcegroup1"
$sqlServerName = "server1"

Remove-AzureRmSqlServer -ServerName $sqlServerName -ResourceGroupName $resourceGroupName
```

## How do I create and manage elastic database pools using PowerShell?
For details about creating elastic database pools using PowerShell, see [Create a new elastic database pool with PowerShell](sql-database-elastic-pool-create-powershell.md).

For details about managing elastic database pools using PowerShell, see [Monitor and manage an elastic database pool with PowerShell](sql-database-elastic-pool-manage-powershell.md).

## Related information
* [Azure SQL Database Cmdlets](https://msdn.microsoft.com/library/azure/mt574084\(v=azure.300\).aspx)
* [Azure Cmdlet Reference](https://msdn.microsoft.com/library/azure/dn708514\(v=azure.300\).aspx)

