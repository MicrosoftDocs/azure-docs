---
title: VHD snapshot to make many identical managed disks (Windows) - PowerShell
description: Azure PowerShell Script Sample -  Create a snapshot from a VHD to create multiple identical managed disks in small amount of time
documentationcenter: storage
author: ramankumarlive
manager: kavithag
ms.service: virtual-machines
ms.subservice: disks
ms.topic: sample
ms.tgt_pltfrm: vm-windows
ms.custom: devx-track-azurepowershell
ms.workload: infrastructure
ms.date: 06/05/2017
ms.author: ramankum
---

# Create a snapshot from a VHD to create multiple identical managed disks in small amount of time with PowerShell (Windows)

This script creates a snapshot from a VHD file in a storage account in same or different subscription. Use this script to import a specialized (not generalized/sysprepped) VHD to a snapshot and then use the snapshot to create multiple identical managed disks in small amount of time. Also, use it to import a data VHD to a snapshot and then use the snapshot to create multiple managed disks in small amount of time. 

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]


 

## Sample script

[!code-powershell[main](../../../powershell_scripts/virtual-machine/create-snapshots-from-vhd-in-different-subscription/create-snapshots-from-vhd-in-different-subscription.ps1 "Create snapshot from VHD")]


## Next steps

[Create a managed disk from snapshot](virtual-machines-powershell-sample-create-managed-disk-from-snapshot.md?toc=%2fpowershell%2fmodule%2ftoc.json)


[Create a virtual machine by attaching a managed disk as OS disk](./virtual-machines-powershell-sample-create-vm-from-managed-os-disks.md)

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional virtual machine PowerShell script samples can be found in the [Azure Windows VM documentation](../windows/powershell-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
