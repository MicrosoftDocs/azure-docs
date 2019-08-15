---
title: Azure PowerShell script - Update an Azure Cosmos account
description: Azure PowerShell script sample - Update an Azure Cosmos account with added regions
author: markjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 05/06/2019
ms.author: mjbrown
---

# Update an Azure Cosmos account and add a region using PowerShell

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

[!INCLUDE [sample-powershell-install](../../../../../includes/sample-powershell-install-no-ssh.md)]

## Sample script

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/sql/ps-account-update.ps1 "Update and add regions to an Azure Cosmos account")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```powershell
Remove-AzResourceGroup -ResourceGroupName "myResourceGroup"
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
|**Azure Resources**| |
| [Get-AzResource](https://docs.microsoft.com/powershell/module/az.resources/get-azresource) | Gets a resource. |
| [Set-AzResource](https://docs.microsoft.com/powershell/module/az.resources/set-azresource) | Updates a resource. |
|**Azure Resource Groups**| |
| [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Cosmos DB PowerShell script samples can be found in the [Azure Cosmos DB PowerShell scripts](../../../powershell-samples.md).