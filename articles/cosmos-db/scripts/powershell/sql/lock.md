---
title: PowerShell script to create resource lock for Azure Cosmos SQL API database and container
description: Create resource lock for Azure Cosmos SQL API database and container
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: sample
ms.date: 06/12/2020
---

# Create a resource lock for Azure Cosmos SQL API database and container using Azure PowerShell
[!INCLUDE[appliesto-sql-api](../../../includes/appliesto-sql-api.md)]

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

[!INCLUDE [sample-powershell-install](../../../../../includes/sample-powershell-install-no-ssh.md)]

> [!IMPORTANT]
> Resource locks do not work for changes made by users connecting using any Cosmos DB SDK, any tools that connect via account keys, or the Azure Portal unless the Cosmos DB account is first locked with the `disableKeyBasedMetadataWriteAccess` property enabled. To learn more about how to enable this property see, [Preventing changes from SDKs](../../../role-based-access-control.md#prevent-sdk-changes).

## Sample script

[!code-powershell[main](../../../../../powershell_scripts/cosmosdb/sql/ps-sql-lock.ps1 "Create, list, and remove resource locks")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```powershell
Remove-AzResourceGroup -ResourceGroupName "myResourceGroup"
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
|**Azure Resource**| |
| [New-AzResourceLock](/powershell/module/az.resources/new-azresourcelock) | Creates a resource lock. |
| [Get-AzResourceLock](/powershell/module/az.resources/get-azresourcelock) | Gets a resource lock, or lists resource locks. |
| [Remove-AzResourceLock](/powershell/module/az.resources/remove-azresourcelock) | Removes a resource lock. |
|||

## Next steps

For more information on Azure PowerShell, see [Azure PowerShell documentation](/powershell/).