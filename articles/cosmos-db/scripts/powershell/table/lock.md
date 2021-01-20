---
title: PowerShell script to create resource lock for Azure Cosmos Table API table
description: Create resource lock for Azure Cosmos Table API table
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.topic: sample
ms.date: 06/12/2020
---

# Create a resource lock for Azure Cosmos Table API table using Azure PowerShell
[!INCLUDE[appliesto-table-api](../../../includes/appliesto-table-api.md)]

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

[!INCLUDE [sample-PowerShell-install](../../../../../includes/sample-PowerShell-install-no-ssh.md)]

> [!IMPORTANT]
> Resource locks do not work for changes made by users connecting using any Cosmos DB SDK, any tools that connect via account keys, or the Azure Portal unless the Cosmos DB account is first locked with the `disableKeyBasedMetadataWriteAccess` property enabled. To learn more about how to enable this property see, [Preventing changes from SDKs](../../../role-based-access-control.md#prevent-sdk-changes).

## Sample script

[!code-PowerShell[main](../../../../../PowerShell_scripts/cosmosdb/table/ps-table-lock.ps1 "Create, list, and remove resource locks")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```PowerShell
Remove-AzResourceGroup -ResourceGroupName "myResourceGroup"
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
|**Azure Resource**| |
| [New-AzResourceLock](/PowerShell/module/az.resources/new-azresourcelock) | Creates a resource lock. |
| [Get-AzResourceLock](/PowerShell/module/az.resources/get-azresourcelock) | Gets a resource lock, or lists resource locks. |
| [Remove-AzResourceLock](/PowerShell/module/az.resources/remove-azresourcelock) | Removes a resource lock. |
|||

## Next steps

For more information on Azure PowerShell, see [Azure PowerShell documentation](/PowerShell/).