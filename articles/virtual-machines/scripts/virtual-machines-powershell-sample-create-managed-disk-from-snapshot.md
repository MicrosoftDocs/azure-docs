---
title: Create managed disk from snapshot - PowerShell sample
description: Azure PowerShell Sample - restore a snapshot of a disk and learn about the performance impact of restoring ultra disk and premium ssd v2 snapshots
services: virtual-machines
documentationcenter: storage
author: ramankumarlive
manager: kavithag
ms.service: virtual-machines
ms.subservice: disks
ms.topic: sample
ms.tgt_pltfrm: vm-windows
ms.custom: devx-track-azurepowershell
ms.workload: infrastructure
ms.date: 10/24/2023
ms.author: ramankum
---

# Create a managed disk from a snapshot with PowerShell 

This script creates a managed disk from a snapshot. Use it to restore a virtual machine from snapshots of OS and data disks. Create OS and data managed disks from respective snapshots and then create a new virtual machine by attaching managed disks. You can also restore data disks of an existing VM by attaching data disks created from snapshots.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

 

## Sample script

[!code-powershell[main](../../../powershell_scripts/virtual-machine/create-managed-disk-from-snapshot/create-managed-disk-from-snapshot.ps1 "Create managed disk from snapshot")]

## Check disk status

When you create a managed disk from a snapshot, it starts a background copy process. You can attach a disk to a VM while this process is running but you will experience performance impact (4k disks experience read impact, 512e experience both read and write impact). For Ultra Disks and Premium SSD v2, you can check the status of the background copy process with the [Azure CLI](create-managed-disk-from-snapshot.md#check-disk-status). This isn't currently supported with the Azure PowerShell module.

> [!IMPORTANT]
> You can't use the following sections to get the status of the background copy process for disk types other than Ultra Disk or Premium SSD v2. Other disk types will always report 100%.

## Script explanation

This script uses following commands to create a managed disk from a snapshot. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Get-AzSnapshot](/powershell/module/az.compute/get-azsnapshot) | Gets snapshot properties.  |
| [New-AzDiskConfig](/powershell/module/az.compute/new-azdiskconfig) | Creates disk configuration that is used for disk creation. It includes the resource Id of the parent snapshot, location that is same as the location of parent snapshot and the storage type.  |
| [New-AzDisk](/powershell/module/az.compute/new-azdisk) | Creates a disk using disk configuration, disk name, and resource group name passed as parameters. |


## Next steps

[Create a virtual machine from a managed disk](./virtual-machines-powershell-sample-create-vm-from-managed-os-disks.md?toc=%2fpowershell%2fmodule%2ftoc.json)

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional virtual machine PowerShell script samples can be found in the [Azure Windows VM documentation](../windows/powershell-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
