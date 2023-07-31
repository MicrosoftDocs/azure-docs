---
title: PowerShell script to list and get operations in Azure Cosmos DB's API for MongoDB
description: Azure PowerShell script - Azure Cosmos DB list and get operations for API for MongoDB
author: seesharprun
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: sample
ms.date: 05/01/2020
ms.author: sidandrews
ms.reviewer: mjbrown 
ms.custom: devx-track-azurepowershell, ignite-2022
---

# List and get databases and graphs for Azure Cosmos DB - API for MongoDB
[!INCLUDE[MongoDB](../../../includes/appliesto-mongodb.md)]

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

This sample requires Azure PowerShell Az 5.4.0 or later. Run `Get-Module -ListAvailable Az` to see which versions are installed.
If you need to install, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure.

## Sample script

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/mongodb/ps-mongodb-list-get.ps1 "List or get databases or collections for API for MongoDB")]

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
| [Get-AzCosmosDBAccount](/powershell/module/az.cosmosdb/get-azcosmosdbaccount) | Lists Azure Cosmos DB Accounts, or gets a specified Azure Cosmos DB Account. |
| [Get-AzCosmosDBMongoDBDatabase](/powershell/module/az.cosmosdb/get-azcosmosdbmongodbdatabase) | Lists API for MongoDB Databases in an Account, or gets a specified API for MongoDB Database in an Account. |
| [Get-AzCosmosDBMongoDBCollection](/powershell/module/az.cosmosdb/get-azcosmosdbmongodbcollection) | Lists API for MongoDB Collections, or gets a specified API for MongoDB Collection in a Database. |
|**Azure Resource Groups**| |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).
