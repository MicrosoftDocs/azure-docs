---
title: Rotate storage account access keys with PowerShell
titleSuffix: Azure Storage
description: Create an Azure Storage account, then retrieve and rotate one of its account access keys.
services: storage
author: tamram

ms.service: storage
ms.subservice: blobs
ms.devlang: powershell
ms.topic: sample
ms.date: 12/04/2019
ms.author: tamram
---

# Rotate storage account access keys with PowerShell

This script creates an Azure Storage account, displays the new storage account's primary access key, then renews (rotates) the key.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh-az.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-powershell[main](../../../powershell_scripts/storage/rotate-storage-account-keys/rotate-storage-account-keys.ps1 "Rotate storage account keys")]

## Clean up deployment

Run the following command to remove the resource group, storage account, and all related resources.

```powershell
Remove-AzResourceGroup -Name rotatekeystestrg
```

## Script explanation

This script uses the following commands to create the storage account and retrieve and rotate one of its access keys. Each item in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [Get-AzLocation](/powershell/module/az.resources/get-azlocation) | Gets all locations and the supported resource providers for each location. |
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates an Azure resource group. |
| [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) | Creates a Storage account. |
| [Get-AzStorageAccountKey](/powershell/module/az.storage/get-azstorageaccountkey) | Gets the access keys for an Azure Storage account. |
| [New-AzStorageAccountKey](/powershell/module/az.storage/new-azstorageaccountkey) | Regenerates an access key for an Azure Storage account. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional storage PowerShell script samples can be found in [PowerShell samples for Azure Blob storage](../blobs/storage-samples-blobs-powershell.md).
