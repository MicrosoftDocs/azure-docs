---
title: Azure PowerShell Script Sample - Create a VM from a snapshot | Microsoft Docs
description: Azure PowerShell Script Sample - Create a VM from a snapshot
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

# Create a virtual machine from a snapshot with PowerShell

This script creates a virtual machine from a snapshot of an OS disk. 

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-powershell[main](../../../powershell_scripts/virtual-machine/create-vm-from-snapshot/create-vm-from-snapshot.ps1 "Create VM from managed os disk")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Script explanation

This script uses the following commands to get snapshot properties, create a managed disk from snapshot and create a VM. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Get-AzureRmSnapshot](/powershell/module/azurerm.compute/get-azurermsnapshot) | Gets a snapshot using snapshot name. |
| [New-AzureRmDiskConfig](/powershell/module/azurerm.compute/new-azurermdiskconfig) | Creates a disk configuration. This configuration is used with the disk creation process. |
| [New-AzureRmDisk](/powershell/module/azurerm.compute/new-azurermdisk) | Creates a managed disk. |
| [New-AzureRmVMConfig](/powershell/module/azurerm.compute/new-azurermvmconfig) | Creates a VM configuration. This configuration includes information such as VM name, operating system, and administrative credentials. The configuration is used during VM creation. |
| [Set-AzureRmVMOSDisk](/powershell/module/azurerm.compute/set-azurermvmosdisk) | Attaches the managed disk as OS disk to the virtual machine |
| [New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress) | Creates a public IP address. |
| [New-AzureRmNetworkInterface](/powershell/module/azurerm.network/new-azurermnetworkinterface) | Creates a network interface. |
| [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm) | Creates a virtual machine. |
|[Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Removes a resource group and all resources contained within. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional virtual machine PowerShell script samples can be found in the [Azure Windows VM documentation](../windows/powershell-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).