---
title: PowerShell script to update regions for an Azure Cosmos DB account
description: Run this Azure PowerShell script to add regions or change region failover order for an Azure Cosmos DB account.
author: seesharprun
ms.service: cosmos-db
ms.topic: sample
ms.date: 05/02/2022
ms.author: sidandrews
ms.reviewer: mjbrown 
ms.custom: devx-track-azurepowershell, ignite-2022
---

# Update regions for an Azure Cosmos DB account by using PowerShell

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](../../../includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

This PowerShell script updates the Azure regions that an Azure Cosmos DB account uses. You can use this script to add an Azure region or change region failover order.

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

## Prerequisites

- You need an existing Azure Cosmos DB account in an Azure resource group.

- The script requires Azure PowerShell Az 5.4.0 or later. Run `Get-Module -ListAvailable Az` to list your installed versions. If you need to install PowerShell, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

- Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure.

## Sample script

The [Update-AzCosmosDBAccountRegion](/powershell/module/az.cosmosdb/update-azcosmosdbaccountregion) command updates Azure regions for an Azure Cosmos DB account. The command requires a resource group name, an Azure Cosmos DB account name, and a list of Azure regions in desired failover order.

In this script, the [Get-AzCosmosDBAccount](/powershell/module/az.cosmosdb/get-azcosmosdbaccount) command gets the Azure Cosmos DB account you specify. [New-AzCosmosDBLocationObject](/powershell/module/az.cosmosdb/new-azcosmosdblocationobject) creates an object of type `PSLocation`. `Update-AzCosmosDBAccountRegion` uses the `PSLocation` parameter to update the account regions.

- If you add a region, don't change the first failover region in the same operation. Change failover priority order in a separate operation.
- You can't modify regions in the same operation as changing other Azure Cosmos DB account properties. Do these operations separately.

This sample uses a API for NoSQL account. To use this sample for other APIs, copy the related properties and apply them to your API-specific script.

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/common/ps-account-update-region.ps1 "Update Azure Cosmos DB account regions")]

Although the script returns a result, the update operation might not be finished. Check the status of the operation in the Azure portal by using the Azure Cosmos DB account **Activity log**.

## Delete Azure resource group

If you want to delete your Azure Cosmos DB account, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) PowerShell command to remove its resource group. This command removes the Azure resource group and all the resources in it, including Azure Cosmos DB accounts and their containers and databases.

```powershell
Remove-AzResourceGroup -ResourceGroupName "myResourceGroup"
```

## Next steps

- [Azure PowerShell documentation](/powershell)
