---
title: PowerShell script to create Azure Cosmos DB for NoSQL database and container
description: Azure PowerShell script - Azure Cosmos DB create API for NoSQL database and container
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: sample
ms.date: 05/13/2020
ms.author: sidandrews
ms.reviewer: mjbrown 
ms.custom: devx-track-azurepowershell, ignite-2022
---

# Create a database and container for Azure Cosmos DB - API for NoSQL
[!INCLUDE[NoSQL](../../../includes/appliesto-nosql.md)]

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

This sample requires Azure PowerShell Az 5.4.0 or later. Run `Get-Module -ListAvailable Az` to see which versions are installed.
If you need to install, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure.

## Sample script

This script creates an Azure Cosmos DB account for API for NoSQL in two regions with session level consistency, a database, and a container with a partition key, custom indexing policy, unique key policy, TTL, dedicated throughput, and last writer wins conflict resolution policy with a custom conflict resolution path that will be used when `multipleWriteLocations=true`.

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/sql/ps-sql-create.ps1 "Create an account, database, and container for API for NoSQL")]

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
| [New-AzCosmosDBAccount](/powershell/module/az.cosmosdb/new-azcosmosdbaccount) | Creates an Azure Cosmos DB Account. |
| [New-AzCosmosDBSqlDatabase](/powershell/module/az.cosmosdb/new-azcosmosdbsqldatabase) | Creates an Azure Cosmos DB SQL Database. |
| [New-AzCosmosDBSqlUniqueKey](/powershell/module/az.cosmosdb/new-azcosmosdbsqluniquekey) | Creates a PSSqlUniqueKey object used as a parameter for New-AzCosmosDBSqlUniqueKeyPolicy. |
| [New-AzCosmosDBSqlUniqueKeyPolicy](/powershell/module/az.cosmosdb/new-azcosmosdbsqluniquekeypolicy) | Creates a PSSqlUniqueKeyPolicy object used as a parameter for New-AzCosmosDBSqlContainer. |
| [New-AzCosmosDBSqlCompositePath](/powershell/module/az.cosmosdb/new-azcosmosdbsqlcompositepath) | Creates a PSCompositePath object used as a parameter for New-AzCosmosDBSqlIndexingPolicy. |
| [New-AzCosmosDBSqlIncludedPathIndex](/powershell/module/az.cosmosdb/new-azcosmosdbsqlincludedpathindex) | Creates a PSIndexes object used as a parameter for New-AzCosmosDBSqlIncludedPath. |
| [New-AzCosmosDBSqlIncludedPath](/powershell/module/az.cosmosdb/new-azcosmosdbsqlincludedpath) | Creates a PSIncludedPath object used as a parameter for New-AzCosmosDBSqlIndexingPolicy. |
| [New-AzCosmosDBSqlIndexingPolicy](/powershell/module/az.cosmosdb/new-azcosmosdbsqlindexingpolicy) | Creates a PSSqlIndexingPolicy object used as a parameter for New-AzCosmosDBSqlContainer. |
| [New-AzCosmosDBSqlConflictResolutionPolicy](/powershell/module/az.cosmosdb/new-azcosmosdbsqlconflictresolutionpolicy) | Creates a PSSqlConflictResolutionPolicy object used as a parameter for New-AzCosmosDBSqlContainer. |
| [New-AzCosmosDBSqlContainer](/powershell/module/az.cosmosdb/new-azcosmosdbsqlcontainer) | Creates a new Azure Cosmos DB SQL Container. |
|**Azure Resource Groups**| |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).
