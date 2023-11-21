---
title: Calculate the size of blob containers with PowerShell
titleSuffix: Azure Storage
description: Calculate the size of all Azure Blob Storage containers in a storage account.
services: storage
author: normesta

ms.service: azure-storage
ms.devlang: powershell
ms.topic: sample
ms.date: 11/21/2023
ms.author: normesta 
ms.custom: devx-track-azurepowershell
---

# Calculate the size of blob containers with PowerShell

This script calculates the size of all Azure Blob Storage containers in a storage account. 

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh-az.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

> [!IMPORTANT]
> This PowerShell script provides an estimated size for the containers in an account and should not be used for billing calculations. For a script that calculates container size for billing purposes, see [Calculate the size of a Blob storage container for billing purposes](../scripts/storage-blobs-container-calculate-billing-size-powershell.md).

## Sample script

[!code-powershell[main](../../../powershell_scripts/storage/calculate-container-size/calculate-container-size.ps1 "Calculate container size")]

## Clean up deployment

Run the following command to remove the resource group, container, and all related resources.

```powershell
Remove-AzResourceGroup -Name bloblisttestrg
```

## Script explanation

This script uses the following commands to calculate the size of the Blob storage container. Each item in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [Get-AzStorageAccount](/powershell/module/az.storage/get-azstorageaccount) | Gets a specified Storage account or all of the Storage accounts in a resource group or the subscription. |
| [Get-AzStorageContainer](/powershell/module/az.storage/get-azstoragecontainer) | Lists the storage containers. |
| [Get-AzStorageBlob](/powershell/module/az.storage/Get-AzStorageBlob) | Lists blobs in a container. |

## Next steps

For a script that calculates container size for billing purposes, see [Calculate the size of a Blob storage container for billing purposes](../scripts/storage-blobs-container-calculate-billing-size-powershell.md).

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Find more PowerShell script samples in [PowerShell samples for Azure Storage](../blobs/storage-samples-blobs-powershell.md).
