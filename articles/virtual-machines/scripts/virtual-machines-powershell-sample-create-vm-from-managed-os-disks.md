---
title: Make VM by attaching managed disk as OS disk - PowerShell
description: Azure PowerShell Script Sample - Create a VM by attaching a managed disk as OS disk
documentationcenter: virtual-machines
author: ramankumarlive
manager: kavithag
ms.service: virtual-machines-windows
ms.subservice: disks
ms.topic: sample
ms.workload: infrastructure
ms.date: 05/10/2017
ms.author: ramankum
ms.custom: mvc, devx-track-azurepowershell
---

# Create a virtual machine using an existing managed OS disk with PowerShell 

This script creates a virtual machine by attaching an existing managed disk as OS disk. Use this script in preceding scenarios:
* Create a VM from an existing managed OS disk that was copied from a managed disk in different subscription
* Create a VM from an existing managed disk that was created from a specialized VHD file 
* Create a VM from an existing managed OS disk that was created from a snapshot 

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

 

## Sample script

[!code-powershell[main](../../../powershell_scripts/virtual-machine/create-vm-from-snapshot/create-vm-from-snapshot.ps1 "Create VM from snapshot")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup
```

## Script explanation

This script uses the following commands to get managed disk properties, attach a managed disk to a new VM and create a VM. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Get-AzDisk](/powershell/module/az.compute/get-azdisk) | Gets disk object based on the name and the resource group of a disk. Id property of the returned disk object is used to attach the disk to a new VM |
| [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) | Creates a VM configuration. This configuration includes information such as VM name, operating system, and administrative credentials. The configuration is used during VM creation. |
| [Set-AzVMOSDisk](/powershell/module/az.compute/set-azvmosdisk) | Attaches a managed disk using the Id property of the disk as OS disk to a new virtual machine |
| [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) | Creates a public IP address. |
| [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) | Creates a network interface. |
| [New-AzVM](/powershell/module/az.compute/new-azvm) | Create a virtual machine. |
|[Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Removes a resource group and all resources contained within. |

For marketplace images use [Set-AzVMPlan](/powershell/module/az.compute/set-azvmplan) to set the plan information.

```powershell
Set-AzVMPlan -VM $VirtualMachine -Publisher $Publisher -Product $Product -Name $Bame
```

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional virtual machine PowerShell script samples can be found in the [Azure Windows VM documentation](../windows/powershell-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
