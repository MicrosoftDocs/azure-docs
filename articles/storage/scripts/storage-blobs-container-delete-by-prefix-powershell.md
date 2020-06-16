---
title: Azure PowerShell Script Sample - Delete containers by prefix | Microsoft Docs
description: Delete Azure Storage blob containers based on a container name prefix.
services: storage
author: tamram

ms.service: storage
ms.subservice: blobs
ms.devlang: powershell
ms.topic: sample
ms.date: 06/13/2017
ms.author: tamram
---

# Delete containers based on container name prefix

This script deletes containers in Azure Blob storage based on a prefix in the container name.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh-az.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-powershell[main](../../../powershell_scripts/storage/delete-containers-by-prefix/delete-containers-by-prefix.ps1 "Delete containers by prefix")]

## Clean up deployment

Run the following command to remove the resource group, remaining containers, and all related resources.

```powershell
Remove-AzResourceGroup -Name containerdeletetestrg
```

## Script explanation

This script uses the following commands to delete containers based on container name prefix. Each item in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [Get-AzStorageAccount](/powershell/module/az.storage/get-azstorageaccount) | Gets a specified Storage account or all of the Storage accounts in a resource group or the subscription. |
| [Get-AzStorageContainer](/powershell/module/az.storage/Get-AzStorageContainer) | Lists the storage containers associated with a storage account. |
| [Remove-AzStorageContainer](/powershell/module/az.storage/Remove-AzStorageContainer) | Removes the specified storage container. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional storage PowerShell script samples can be found in [PowerShell samples for Azure Blob storage](../blobs/storage-samples-blobs-powershell.md).
