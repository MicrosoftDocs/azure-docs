---
title: PowerShell script to create resource lock for Azure Cosmos DB for NoSQL database and container
description: Create resource lock for Azure Cosmos DB for NoSQL database and container
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: sample
ms.date: 06/12/2020 
ms.custom: devx-track-azurepowershell, ignite-2022
---

# Create a resource lock for Azure Cosmos DB for NoSQL database and container using Azure PowerShell
[!INCLUDE[NoSQL](../../../includes/appliesto-nosql.md)]

[!INCLUDE [updated-for-az](../../../../../includes/updated-for-az.md)]

This sample requires Azure PowerShell Az 5.4.0 or later. Run `Get-Module -ListAvailable Az` to see which versions are installed.
If you need to install, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure.

> [!IMPORTANT]
> Resource locks do not work for changes made by users connecting using any Azure Cosmos DB SDK, any tools that connect via account keys, or the Azure Portal unless the Azure Cosmos DB account is first locked with the `disableKeyBasedMetadataWriteAccess` property enabled. To learn more about how to enable this property see, [Preventing changes from SDKs](../../../role-based-access-control.md#prevent-sdk-changes).

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
