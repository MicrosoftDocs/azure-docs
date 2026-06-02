---
title: DNS Alias (PowerShell & Azure CLI)
titleSuffix: Azure Synapse Analytics
description: PowerShell and Azure CLI cmdlets enable you to redirect new client connections to a different SQL server in Azure, without having to touch any client configuration.
author: joannapea
ms.author: joanpo
ms.reviewer: rsetlem, wiassaf
ms.date: 05/29/2026
ms.service: azure-synapse-analytics
ms.subservice: sql-dw
ms.topic: how-to
ms.devlang: powershell
---
# PowerShell and Azure CLI for DNS Alias for standalone dedicated SQL pools (formerly SQL DW)

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

This article provides Azure PowerShell Az module or Azure CLI scripts to demonstrate how you can manage a DNS alias for the [Azure SQL logical server](../sql/logical-servers.md) hosting your standalone dedicated SQL pool. 

Only standalone dedicated SQL pools (formerly DW) support the Azure SQL logical server DNS alias. For dedicated SQL pools in Azure Synapse workspaces, the DNS alias isn't currently supported. [What's the difference?](https://aka.ms/dedicatedSQLpooldiff)

## DNS alias in connection string

To connect a [logical SQL server](../sql/logical-servers.md), a client such as SQL Server Management Studio (SSMS) can provide [the DNS alias](dns-alias-overview.md) name instead of the true server name. In the following example server string, the alias *any-unique-alias-name* replaces the first dot-delimited node in the four node server string:

   `<yourServer>.database.windows.net`

## Prerequisites

To run the demo PowerShell script given in this article, ensure the following prerequisites:

- An Azure subscription and account. For a free trial, see [Azure trials](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Two Azure SQL logical servers containing standalone dedicated SQL pools.
- Install the [Azure PowerShell module](/powershell/azure/install-az-ps) or the [Azure CLI](/cli/azure/install-azure-cli).

## Example

The following code example starts by assigning literal values to several variables.

To run the code, edit the placeholder values to match real values in your system.

# [PowerShell](#tab/azure-powershell)

Use the following cmdlets:

- [New-AzSqlServerDNSAlias](/powershell/module/az.Sql/New-azSqlServerDnsAlias): Creates a DNS alias. The alias refers to server 1.
- [Get-AzSqlServerDNSAlias](/powershell/module/az.Sql/Get-azSqlServerDnsAlias): Gets and lists all the aliases assigned to server 1.
- [Set-AzSqlServerDNSAlias](/powershell/module/az.Sql/Set-azSqlServerDnsAlias): Modifies the server name that the alias refers to, changing from server 1 to server 2.
- [Remove-AzSqlServerDNSAlias](/powershell/module/az.Sql/Remove-azSqlServerDnsAlias): Removes the alias from server 2 by using the name of the alias.

To install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

Use `Get-Module -ListAvailable Az` in `powershell_ise.exe` to find the version.

```powershell
$subscriptionName = '<subscriptionName>';
$sqlServerDnsAliasName = '<aliasName>';
$resourceGroupName = '<resourceGroupName>';  
$sqlServerName = '<sqlServerName>';
$resourceGroupName2 = '<resourceGroupNameTwo>'; # can be same or different than $resourceGroupName
$sqlServerName2 = '<sqlServerNameTwo>'; # must be different from $sqlServerName.

# login to Azure
Connect-AzAccount -SubscriptionName $subscriptionName;
$subscriptionId = Get-AzSubscription -SubscriptionName $subscriptionName;

Write-Host 'Assign an alias to server 1...';
New-AzSqlServerDnsAlias –ResourceGroupName $resourceGroupName -ServerName $sqlServerName `
    -Name $sqlServerDnsAliasName;

Write-Host 'Get the aliases assigned to server 1...';
Get-AzSqlServerDnsAlias –ResourceGroupName $resourceGroupName -ServerName $sqlServerName;

Write-Host 'Move the alias from server 1 to server 2...';
Set-AzSqlServerDnsAlias –ResourceGroupName $resourceGroupName2 -TargetServerName $sqlServerName2 `
    -Name $sqlServerDnsAliasName `
    -SourceServerResourceGroup $resourceGroupName -SourceServerName $sqlServerName `
    -SourceServerSubscriptionId $subscriptionId.Id;

Write-Host 'Get the aliases assigned to server 2...';
Get-AzSqlServerDnsAlias –ResourceGroupName $resourceGroupName2 -ServerName $sqlServerName2;

Write-Host 'Remove the alias from server 2...';
Remove-AzSqlServerDnsAlias –ResourceGroupName $resourceGroupName2 -ServerName $sqlServerName2 `
    -Name $sqlServerDnsAliasName;
```

# [Azure CLI](#tab/azure-cli)

Use the following commands:

- [az sql server dns-alias create](/powershell/module/az.Sql/New-azSqlServerDnsAlias): Creates a DNS alias for a server. The alias refers to server 1.
- [az sql server dns-alias show](/powershell/module/az.Sql/Get-azSqlServerDnsAlias): Gets and lists all the aliases assigned to server 1.
- [az sql server dns-alias set](/powershell/module/az.Sql/Set-azSqlServerDnsAlias): Modifies the server name that the alias refers to, changing from server 1 to server 2.
- [az sql server dns-alias delete](/powershell/module/az.Sql/Remove-azSqlServerDnsAlias): Removes the alias from server 2 by using the name of the alias.

To install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

```azurecli-interactive
$subscriptionName = '<subscriptionName>';
$sqlServerDnsAliasName = '<aliasName>';
$resourceGroupName = '<resourceGroupName>';  
$sqlServerName = '<sqlServerName>';
$resourceGroupName2 = '<resourceGroupNameTwo>'; # can be same or different than $resourceGroupName
$sqlServerName2 = '<sqlServerNameTwo>'; # must be different from $sqlServerName.

# login to Azure
az login -SubscriptionName $subscriptionName;
$subscriptionId = az account list[0].i -SubscriptionName $subscriptionName;

Write-Host 'Assign an alias to server 1...';
az sql server dns-alias create –-resource-group $resourceGroupName --server $sqlServerName `
    --name $sqlServerDnsAliasName;

Write-Host 'Get the aliases assigned to server 1...';
az sql server dns-alias show –-resource-group $resourceGroupName --server $sqlServerName;

Write-Host 'Move the alias from server 1 to server 2...';
az sql server dns-alias set –-resource-group $resourceGroupName2 --server $sqlServerName2 `
    --name $sqlServerDnsAliasName `
    --original-resource-group $resourceGroupName --original-server $sqlServerName `
    --original-subscription-id $subscriptionId.Id;

Write-Host 'Get the aliases assigned to server 2...';
az sql server dns-alias show –-resource-group $resourceGroupName2 --server $sqlServerName2;

Write-Host 'Remove the alias from server 2...';
az sql server dns-alias delete –-resource-group $resourceGroupName2 --server $sqlServerName2 `
    --name $sqlServerDnsAliasName;
```

* * *

## Related content

- [DNS alias for standalone dedicated SQL pools (formerly SQL DW)](dns-alias-overview.md)
