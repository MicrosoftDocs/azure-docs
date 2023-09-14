---
title: PowerShell script to create a table with autoscale in Azure Cosmos DB for Table
description: PowerShell script to create a table with autoscale in Azure Cosmos DB for Table
author: seesharprun
ms.service: cosmos-db
ms.subservice: table
ms.topic: sample
ms.date: 07/30/2020
ms.author: sidandrews
ms.reviewer: mjbrown 
ms.custom: ignite-2022, devx-track-azurepowershell
---

# Create a table with autoscale for Azure Cosmos DB - API for Table
[!INCLUDE[Table](../../../includes/appliesto-table.md)]

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

This sample requires Azure PowerShell Az 5.4.0 or later. Run `Get-Module -ListAvailable Az` to see which versions are installed.
If you need to install, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure.

## Sample script

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/table/ps-table-autoscale.ps1 "Create a table with autoscale for API for Table")]

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
| [New-AzCosmosDBTable](/powershell/module/az.cosmosdb/new-azcosmosdbtable) | Creates a API for Table Table. |
|**Azure Resource Groups**| |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).
