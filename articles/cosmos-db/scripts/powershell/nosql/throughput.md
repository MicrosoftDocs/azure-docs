---
title: PowerShell scripts for throughput (RU/s) operations for Azure Cosmos DB for NoSQL database or container
description: PowerShell scripts for throughput (RU/s) operations for Azure Cosmos DB for NoSQL database or container
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: sample
ms.date: 10/07/2020
ms.author: sidandrews
ms.reviewer: mjbrown 
ms.custom: ignite-2022, devx-track-azurepowershell
---

# Throughput (RU/s) operations with PowerShell for a database or container for Azure Cosmos DB for NoSQL
[!INCLUDE[NoSQL](../../../includes/appliesto-nosql.md)]

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

This sample requires Azure PowerShell Az 5.4.0 or later. Run `Get-Module -ListAvailable Az` to see which versions are installed.
If you need to install, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure.

## Get throughput

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/sql/ps-sql-ru-get.ps1 "Get throughput (RU/s) for Azure Cosmos DB for NoSQL database or container")]

## Update throughput

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/sql/ps-sql-ru-update.ps1 "Update throughput (RU/s) for an Azure Cosmos DB for NoSQL database or container")]

## Migrate throughput

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/sql/ps-sql-ru-migrate.ps1 "Migrate between standard and autoscale throughput on an Azure Cosmos DB for NoSQL database or container")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```powershell
Remove-AzResourceGroup -ResourceGroupName "myResourceGroup"
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
|**Azure Cosmos DB**| |
| [Get-AzCosmosDBSqlDatabaseThroughput](/powershell/module/az.cosmosdb/get-azcosmosdbsqldatabasethroughput) | Get the throughput provisioned on an Azure Cosmos DB for NoSQL Database. |
| [Get-AzCosmosDBSqlContainerThroughput](/powershell/module/az.cosmosdb/get-azcosmosdbsqlcontainerthroughput) | Get the throughput provisioned on an Azure Cosmos DB for NoSQL Container. |
| [Update-AzCosmosDBSqlDatabaseThroughput](/powershell/module/az.cosmosdb/get-azcosmosdbsqldatabase) | Updates the throughput value of an Azure Cosmos DB for NoSQL Database. |
| [Update-AzCosmosDBSqlContainerThroughput](/powershell/module/az.cosmosdb/get-azcosmosdbsqlcontainer) | Updates the throughput value of an Azure Cosmos DB for NoSQL Container. |
| [Invoke-AzCosmosDBSqlDatabaseThroughputMigration](/powershell/module/az.cosmosdb/invoke-azcosmosdbsqldatabasethroughputmigration) | Migrate throughput of an Azure Cosmos DB for NoSQL Database. |
| [Invoke-AzCosmosDBSqlContainerThroughputMigration](/powershell/module/az.cosmosdb/invoke-azcosmosdbsqlcontainerthroughputmigration) | Migrate throughput of an Azure Cosmos DB for NoSQL Container. |
|**Azure Resource Groups**| |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).
