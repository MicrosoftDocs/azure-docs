---
title: PowerShell script to update the default consistency level on an Azure Cosmos DB account
description: Azure PowerShell script sample - Update default consistency level on an Azure Cosmos DB account using PowerShell
author: seesharprun
ms.service: cosmos-db
ms.topic: sample
ms.date: 03/21/2020
ms.author: sidandrews
ms.reviewer: mjbrown 
ms.custom: devx-track-azurepowershell, ignite-2022
---

# Update consistency level for an Azure Cosmos DB account with PowerShell
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](../../../includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

This sample requires Azure PowerShell Az 5.4.0 or later. Run `Get-Module -ListAvailable Az` to see which versions are installed.
If you need to install, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure.

## Sample script

> [!NOTE]
> You cannot modify regions and change other Azure Cosmos DB account properties in the same operation. These must be done as two separate operations.
> [!NOTE]
> This sample demonstrates using a API for NoSQL account. To use this sample for other APIs, copy the related properties and apply to your API-specific script.

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/common/ps-account-update.ps1 "Update an Azure Cosmos DB account")]

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
| [Update-AzCosmosDBAccount](/powershell/module/az.cosmosdb/update-azcosmosdbaccountfailoverpriority) | Update an Azure Cosmos DB Account. |
|**Azure Resource Groups**| |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).
