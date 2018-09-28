---
title: Azure PowerShell Script Sample - Create a VM by attaching a managed disk as OS disk | Microsoft Docs
description: Azure PowerShell Script Sample - Create a VM by attaching a managed disk as OS disk
services: virtual-machines-windows
documentationcenter: virtual-machines
author: ramankum
manager: kavithag
editor: ramankum
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 05/10/2017
ms.author: ramankum
ms.custom: mvc
---

# Create a virtual machine using an existing managed OS disk with PowerShell

This script creates a virtual machine by attaching an existing managed disk as OS disk. Use this script in preceding scenarios:
* Create a VM from an existing managed OS disk that was copied from a managed disk in different subscription
* Create a VM from an existing managed disk that was created from a specialized VHD file 
* Create a VM from an existing managed OS disk that was created from a snapshot 

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-powershell[main](../../../powershell_scripts/virtual-machine/create-vm-from-snapshot/create-vm-from-snapshot.ps1 "Create VM from snapshot")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Script explanation

This script uses the following commands to get managed disk properties, attach a managed disk to a new VM and create a VM. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Get-AzureRmDisk](/powershell/module/azurerm.compute/Get-AzureRmDisk) | Gets disk object based on the name and the resource group of a disk. Id property of the returned disk object is used to attach the disk to a new VM |
| [New-AzureRmVMConfig](/powershell/module/azurerm.compute/new-azurermvmconfig) | Creates a VM configuration. This configuration includes information such as VM name, operating system, and administrative credentials. The configuration is used during VM creation. |
| [Set-AzureRmVMOSDisk](/powershell/module/azurerm.compute/set-azurermvmosdisk) | Attaches a managed disk using the Id property of the disk as OS disk to a new virtual machine |
| [New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress) | Creates a public IP address. |
| [New-AzureRmNetworkInterface](/powershell/module/azurerm.network/new-azurermnetworkinterface) | Creates a network interface. |
| [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm) | Create a virtual machine. |
|[Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Removes a resource group and all resources contained within. |

For marketplace images use [Set-AzureRmVMPlan](https://docs.microsoft.com/en-us/powershell/module/azurerm.compute/set-azurermvmplan?view=azurermps-6.7.0) to set the plan information
```powershell
Set-AzureRmVMPlan -VM $VirtualMachine -Publisher $Publisher -Product $Product -Name $Bame
```

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional virtual machine PowerShell script samples can be found in the [Azure Windows VM documentation](../windows/powershell-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
