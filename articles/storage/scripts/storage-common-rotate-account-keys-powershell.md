---
title: Azure PowerShell Script Sample - Rotate storage account access key | Microsoft Docs
description: Create an Azure Storage account, then retrieve and rotate one of its account access keys.
services: storage
documentationcenter: na
author: robinsh
manager: timlt
editor: tysonn

ms.assetid:
ms.custom: mvc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: azurecli
ms.topic: sample
ms.date: 06/13/2017
ms.author: robinsh
---

# Create a storage account and rotate its account access keys

This script creates an Azure Storage account, displays the new storage account's primary access key, then renews (rotates) the key.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-powershell[main](../../../powershell_scripts/storage/rotate-storage-account-keys/rotate-storage-account-keys.ps1 "Rotate storage account keys")]

## Clean up deployment 

Run the following command to remove the resource group, storage account, and all related resources.

```powershell
Remove-AzureRmResourceGroup -Name rotatekeystestrg
```

## Script explanation

This script uses the following commands to create the storage account and retrieve and rotate one of its access keys. Each item in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [Get-AzureRmLocation](/powershell/module/azurerm.resources/get-azurermlocation) | Gets all locations and the supported resource providers for each location. |
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) | Creates an Azure resource group. |
| [New-AzureRmStorageAccount](/powershell/module/azurerm.storage/new-azurermstorageaccount) | Creates a Storage account. |
| [Get-AzureRmStorageAccountKey](/powershell/module/azurerm.storage/get-azurermstorageaccountkey) | Gets the access keys for an Azure Storage account. |
| [New-AzureRmStorageAccountKey](/powershell/module/azurerm.storage/new-azurermstorageaccountkey) | Regenerates an access key for an Azure Storage account. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional storage PowerShell script samples can be found in [PowerShell samples for Azure Blob storage](../blobs/storage-samples-blobs-powershell.md).
