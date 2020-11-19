---
title: Azure PowerShell script sample - Create a fully configured Windows VM 
description: Azure PowerShell Script Sample - Create a fully configured Windows VM.
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: gwallace

tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-windows

ms.topic: sample
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 03/02/2017
ms.author: cynthn
ms.custom: mvc, devx-track-azurepowershell
---

# Create a fully configured virtual machine with PowerShell

This script creates an Azure Virtual Machine running Windows Server 2016. After running the script, you can access the virtual machine over RDP.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

 

## Sample script

[!code-powershell[main](../../../powershell_scripts/virtual-machine/create-vm-detailed/create-windows-vm-detailed.ps1 "Create VM detailed")]

## Clean up deployment

Run the following command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup
```

## Script explanation

This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) | Creates a subnet configuration. This configuration is used with the virtual network creation process. |
| [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) | Creates a virtual network. |
| [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) | Creates a public IP address. |
| [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig) | Creates a network security group rule configuration. This configuration is used to create an NSG rule when the NSG is created. |
| [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) | Creates a network security group. |
| [Get-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/get-azvirtualnetworksubnetconfig) | Gets subnet information. This information is used when creating a network interface. |
| [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) | Creates a network interface. |
| [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) | Creates a VM configuration. This configuration includes information such as VM name, operating system, and administrative credentials. The configuration is used during VM creation. |
| [New-AzVM](/powershell/module/az.compute/new-azvm) | Create a virtual machine. |
|[Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Removes a resource group and all resources contained within. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional virtual machine PowerShell script samples can be found in the [Azure Windows VM documentation](../windows/powershell-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
