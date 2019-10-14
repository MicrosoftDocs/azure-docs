---
title: PowerShell for DNS alias Azure SQL | Microsoft Docs
description: PowerShell cmdlets such as New-AzSqlServerDNSAlias enable you to redirect new client connections to a different Azure SQL Database server, without having to touch any client configuration.
keywords: dns sql database
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.devlang: PowerShell
ms.topic: conceptual
author: oslake
ms.author: moslake
ms.reviewer: genemi,amagarwa,maboja, jrasnick
manager: craigg
ms.date: 03/12/2019
---
# PowerShell for DNS Alias to Azure SQL Database

This article provides a PowerShell script that demonstrates how you can manage a DNS alias for Azure SQL Database. The script runs the following cmdlets which takes the following actions:

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]
> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](https://docs.microsoft.com/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical.

The cmdlets used in the code example are the following:

- [New-AzSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/az.Sql/New-azSqlServerDnsAlias): Creates a new DNS alias in the Azure SQL Database service system. The alias refers to Azure SQL Database server 1.
- [Get-AzSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/az.Sql/Get-azSqlServerDnsAlias): Get and list all the DNS aliases that are assigned to SQL DB server 1.
- [Set-AzSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/az.Sql/Set-azSqlServerDnsAlias): Modifies the server name that the alias is configured to refer to, from server 1 to SQL DB server 2.
- [Remove-AzSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/az.Sql/Remove-azSqlServerDnsAlias): Remove the DNS alias from SQL DB server 2, by using the name of the alias.

## DNS alias in connection string

To connect a particular Azure SQL Database server, a client such as SQL Server Management Studio (SSMS) can provide the DNS alias name instead of the true server name. In the following example server string, the alias *any-unique-alias-name* replaces the first dot-delimited node in the four node server string:

- Example server string: `any-unique-alias-name.database.windows.net`.

## Prerequisites

If you want to run the demo PowerShell script given in this article, the following prerequisites apply:

- An Azure subscription and account. For a free trial, click [https://azure.microsoft.com/free/][https://azure.microsoft.com/free/].
- Azure PowerShell module, with cmdlet **New-AzSqlServerDNSAlias**.
  - To install or upgrade, see [Install Azure PowerShell module][install-Az-ps-84p].
  - Run `Get-Module -ListAvailable Az;` in powershell\_ise.exe, to find the version.
- Two Azure SQL Database servers.

## Code example

The following PowerShell code example starts by assign literal values to several variables. To run the code, you must first edit all the placeholder values to match real values in your system. Or you can just study the code. And the console output of the code is also provided.

# [PowerShell](#tab/azure-powershell)

```powershell
$subscriptionName = '<subscriptionName>';

$sqlServerDnsAliasName = '<aliasName>';

$resourceGroupName = '<resourceGroupName>';  
$sqlServerName = '<sqlServerName>';

$resourceGroupName2 = '<resourceGroupNameTwo>'; # can be same or different than $resourceGroupName
$sqlServerName2 = '<sqlServerNameTwo>'; # must be different from $sqlServerName.

# login to Azure (first time per session)
Connect-AzAccount -SubscriptionName $SubscriptionName;
$subscriptionId = Get-AzSubscription -SubscriptionName $subscriptionName;

Write-Host 'Assign an alias to server 1: ';
New-AzSqlServerDnsAlias `
    –ResourceGroupName $resourceGroupName `
    -ServerName $sqlServerName `
    -Name $sqlServerDnsAliasName;

Write-Host 'Get the aliases assigned to server 1: ';
Get-AzSqlServerDnsAlias `
    –ResourceGroupName $resourceGroupName `
    -ServerName $sqlServerName;

Write-Host 'Move the alias from server 1 to server 2: ';
Set-AzSqlServerDnsAlias `
    –ResourceGroupName $resourceGroupName2 `
    -TargetServerName $sqlServerName2 `
    -Name $sqlServerDnsAliasName `
    -SourceServerResourceGroup $resourceGroupName `
    -SourceServerName $sqlServerName `
    -SourceServerSubscriptionId $subscriptionId.Id;

Write-Host 'Get the aliases assigned to server 2: ';
Get-AzSqlServerDnsAlias `
    –ResourceGroupName $resourceGroupName2 `
    -ServerName $sqlServerName2;

Write-Host 'Remove the alias from server 2: ';
Remove-AzSqlServerDnsAlias `
    –ResourceGroupName $resourceGroupName2 `
    -ServerName $sqlServerName2 `
    -Name $sqlServerDnsAliasName;
```

# [Azure Rm](#tab/azure-rm)

```powershell
$subscriptionName = '<subscriptionName>';

$sqlServerDnsAliasName = '<aliasName>';

$resourceGroupName = '<resourceGroupName>';  
$sqlServerName = '<sqlServerName>';

$resourceGroupName2 = '<resourceGroupTwo>'; # can be same or different than $resourceGroupName
$sqlServerName2 = '<sqlServerNameTwo>'; # must be different from $sqlServerName.

# login to Azure (first time per session)
Connect-AzureRmAccount -SubscriptionName $SubscriptionName;
$subscriptionId = Get-AzureRmSubscription -SubscriptionName $subscriptionName;

Write-Host 'Assign an alias to server 1: ';
New-AzureRmSqlServerDnsAlias `
    –ResourceGroupName $resourceGroupName `
    -ServerName $sqlServerName `
    -Name $sqlServerDnsAliasName;

Write-Host 'Get the aliases assigned to server 1: ';
Get-AzureRmSqlServerDnsAlias `
    –ResourceGroupName $resourceGroupName `
    -ServerName $sqlServerName;

Write-Host 'Move the alias from server 1 to server 2: ';
Set-AzureRmSqlServerDnsAlias `
    –ResourceGroupName $resourceGroupName2 `
    -TargetServerName $sqlServerName2 `
    -Name $sqlServerDnsAliasName `
    -SourceServerResourceGroup $resourceGroupName `
    -SourceServerName $sqlServerName `
    -SourceServerSubscriptionId $subscriptionId.Id;

Write-Host 'Get the aliases assigned to server 2: ';
Get-AzuzreRmSqlServerDnsAlias `
    –ResourceGroupName $resourceGroupName2 `
    -ServerName $sqlServerName2;

Write-Host 'Remove the alias from server 2: ';
Remove-AzureRmSqlServerDnsAlias `
    –ResourceGroupName $resourceGroupName2 `
    -ServerName $sqlServerName2 `
    -Name $sqlServerDnsAliasName;
```

# [Azure CLI](#tab/azure-cli)

```powershell
$subscriptionName = '<subscriptionName>';

$sqlServerDnsAliasName = '<aliasName>';

$resourceGroupName = '<resourceGroupName>';  
$sqlServerName = '<sqlServerName>';

$resourceGroupName2 = '<resourceGroupNameTwo>'; # can be same or different than $resourceGroupName
$sqlServerName2 = '<sqlServerNameTwo>'; # must be different from $sqlServerName.

# Login to Azure (first time per session)
az login -SubscriptionName $SubscriptionName;
$subscriptionId = az account list[0].i -SubscriptionName $subscriptionName;

Write-Host 'Assign an alias to server 1: ';
az sql server dns-alias create `
    –-resource-group $resourceGroupName `
    --server $sqlServerName `
    --name $sqlServerDnsAliasName;

Write-Host 'Get the aliases assigned to server 1: ';
az sql server dns-alias show `
    –-resource-group $resourceGroupName `
    --server $sqlServerName;

Write-Host 'Move the alias from server 1 to server 2: ';
az sql server dns-alias set `
    –-resource-group $resourceGroupName2 `
    --server $sqlServerName2 `
    --name $sqlServerDnsAliasName `
    --original-resource-group $resourceGroupName `
    --original-server $sqlServerName `
    --original-subscription-id $subscriptionId.Id;

Write-Host 'Get the aliases assigned to server 2: ';
az sql server dns-alias show `
    –-resource-group $resourceGroupName2 `
    --server $sqlServerName2;

Write-Host 'Remove the alias from server 2: ';
az sql server dns-alias delete `
    –-resource-group $resourceGroupName2 `
    --server $sqlServerName2 `
    --name $sqlServerDnsAliasName;
```

* * *

## Next steps

For a full explanation of the DNS Alias feature for SQL Database, see [DNS alias for Azure SQL Database][dns-alias-overview-37v].

<!-- Article links. -->

[https://azure.microsoft.com/free/]: https://azure.microsoft.com/free/

[install-Az-ps-84p]: https://docs.microsoft.com/powershell/azure/install-az-ps

[dns-alias-overview-37v]: dns-alias-overview.md
