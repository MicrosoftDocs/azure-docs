---
title: PowerShell script to update an Azure Cosmos account's regions
description: Azure PowerShell script sample - Update an Azure Cosmos account's regions
author: markjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 05/01/2020
ms.author: mjbrown
---

# Update an Azure Cosmos account's regions using PowerShell

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

[!INCLUDE [sample-powershell-install](../../../../../includes/sample-powershell-install-no-ssh.md)]

## Sample script

> [!NOTE]
> You cannot modify regions and change other Cosmos account properties in the same operation. These must be done as two separate operations.
> [!NOTE]
> This sample demonstrates using a SQL (Core) API account. To use this sample for other APIs, copy the related properties and apply to your API specific script.

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/common/ps-account-update-region.ps1 "Update Azure Cosmos account regions")]

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
| [Get-AzCosmosDBAccount](https://docs.microsoft.com/powershell/module/az.cosmosdb/get-azcosmosdbaccount) | Lists Cosmos DB Accounts, or gets a specified Cosmos DB Account. |
| [New-AzCosmosDBLocationObject](https://docs.microsoft.com/powershell/module/az.cosmosdb/new-azcosmosdblocationobject) | Creates an object of type PSLocation to be used as a parameter for Update-AzCosmosDBAccountRegion. |
| [Update-AzCosmosDBAccountRegion](https://docs.microsoft.com/powershell/module/az.cosmosdb/update-azcosmosdbaccountregion) | Update Regions of a Cosmos DB Account. |
|**Azure Resource Groups**| |
| [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Cosmos DB PowerShell script samples can be found in the [Azure Cosmos DB PowerShell scripts](../../../powershell-samples.md).
