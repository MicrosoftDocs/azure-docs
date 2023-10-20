---
title: Calculate size of a blob container with PowerShell
titleSuffix: Azure Storage
description: Calculate the size of a container in Azure Blob Storage by totaling the size of each of its blobs.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.devlang: powershell
ms.topic: sample
ms.date: 12/04/2019
ms.author: shaas 
ms.custom: devx-track-azurepowershell
---

# Calculate the size of a blob container with PowerShell

This script calculates the size of a container in Azure Blob Storage. It first displays the total number of bytes used by the blobs within the container, then displays their individual names and lengths.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh-az.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

> [!IMPORTANT]
> This PowerShell script provides an estimated size for the container and should not be used for billing calculations. For a script that calculates container size for billing purposes, see [Calculate the size of a Blob storage container for billing purposes](../scripts/storage-blobs-container-calculate-billing-size-powershell.md).

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
| [Get-AzStorageBlob](/powershell/module/az.storage/Get-AzStorageBlob) | Lists blobs in a container. |

## Next steps

For a script that calculates container size for billing purposes, see [Calculate the size of a Blob storage container for billing purposes](../scripts/storage-blobs-container-calculate-billing-size-powershell.md).

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Find more PowerShell script samples in [PowerShell samples for Azure Storage](../blobs/storage-samples-blobs-powershell.md).
