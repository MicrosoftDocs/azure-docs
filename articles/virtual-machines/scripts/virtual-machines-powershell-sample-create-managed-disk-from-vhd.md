---
title: Create a managed disk from a VHD file in a storage account in a subscription - PowerShell Sample
description: Azure PowerShell Script Sample -  Create a managed disk from a VHD file in a storage account in same or different subscription
documentationcenter: storage
author: ramankumarlive
manager: kavithag
ms.service: virtual-machines
ms.topic: sample
ms.workload: infrastructure
ms.custom: devx-track-azurepowershell
ms.date: 06/05/2017
ms.author: ramankum
---

# Create a managed disk from a VHD file in a storage account in same or different subscription with PowerShell

This script creates a managed disk from a VHD file in a storage account in same or different subscription. Use this script to import a specialized (not generalized/sysprepped) VHD to managed OS disk to create a virtual machine. Also, use it to import a data VHD to managed data disk. 

Don't create multiple identical managed disks from a VHD file in small amount of time. To create managed disks from a vhd file, blob snapshot of the vhd file is created and then it is used to create managed disks. Only one blob snapshot can be created in a minute that causes disk creation failures due to throttling. To avoid this throttling, create a [managed snapshot from the vhd file](virtual-machines-powershell-sample-create-snapshot-from-vhd.md?toc=%2fpowershell%2fmodule%2ftoc.json) and then use the managed snapshot to create multiple managed disks in short amount of time. 

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]


 

## Sample script

[!code-powershell[main](../../../powershell_scripts/virtual-machine/create-managed-disks-from-vhd-in-different-subscription/create-managed-disks-from-vhd-in-different-subscription.ps1 "Create managed disk from VHD")]


## Script explanation

This script uses following commands to create a managed disk from a VHD in different subscription. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzDiskConfig](/powershell/module/az.compute/new-azdiskconfig) | Creates disk configuration that is used for disk creation. It includes storage type, location, resource ID of the storage account where the parent VHD is stored, VHD URI of the parent VHD. |
| [New-AzDisk](/powershell/module/az.compute/new-azdisk) | Creates a disk using disk configuration, disk name, and resource group name passed as parameters. |

## Next steps

[Create a virtual machine by attaching a managed disk as OS disk](virtual-machines-powershell-sample-create-vm-from-managed-os-disks.md)

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional virtual machine PowerShell script samples can be found in the [Azure Windows VM documentation](../windows/powershell-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
