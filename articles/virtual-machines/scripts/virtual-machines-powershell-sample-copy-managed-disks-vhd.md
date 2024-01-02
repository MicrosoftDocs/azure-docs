---
title: Export/Copy the VHD of a managed disk to another region's account (Windows) - PowerShell
description: Azure PowerShell script sample -  Export/Copy the VHD of a managed disk to a storage account in same or different region
services: virtual-machines-windows
documentationcenter: storage
author: ramankumarlive
manager: kavithag

tags: azure-service-management
ms.custom: devx-track-azurepowershell

ms.assetid:
ms.service: virtual-machines

ms.topic: sample
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 03/01/2023
ms.author: ramankum
---

# Export/Copy the VHD of a managed disk to a storage account in different region with PowerShell (Windows)

This script exports the VHD of a managed disk to a storage account in different region. It first generates the SAS URI of the managed disk and then uses it to copy the underlying VHD to a storage account in different region. Use this script to copy managed disks to another region for regional expansion.  

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

 

## Sample script

[!code-powershell[main](../../../powershell_scripts/virtual-machine/copy-managed-disks-vhd-to-storage-account/copy-managed-disks-vhd-to-storage-account.ps1 "Copy the VHD of a managed disk")]


## Script explanation

This script uses the following commands to generate SAS URI of a managed disk and copies the underlying VHD to a storage account using the SAS URI. Each command in the table links to the command specific documentation.

| Command | Notes |
|---|---|
| [Grant-AzDiskAccess](/powershell/module/az.compute/grant-azdiskaccess) | Generates SAS URI for a managed disk that is used to copy the underlying VHD to a storage account. |
| [New-AzureStorageContext](/powershell/module/azure.storage/new-azurestoragecontext) | Creates a storage account context using the account name and key. This context can be used to perform read/write operations on the storage account. |
| [Start-AzureStorageBlobCopy](/powershell/module/azure.storage/start-azurestorageblobcopy) | Copies the underlying VHD of a snapshot to a storage account |

## Next steps

[Create a managed disk from a VHD](./virtual-machines-powershell-sample-create-managed-disk-from-vhd.md?toc=%252fpowershell%252fmodule%252ftoc.json)

[Create a virtual machine from a managed disk](./virtual-machines-powershell-sample-create-vm-from-managed-os-disks.md?toc=%2fpowershell%2fmodule%2ftoc.json)

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional virtual machine PowerShell script samples can be found in the [Azure Windows VM documentation](../windows/powershell-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
