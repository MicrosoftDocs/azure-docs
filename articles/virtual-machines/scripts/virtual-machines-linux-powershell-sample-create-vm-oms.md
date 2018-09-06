---
title: Azure PowerShell Script Sample - OMS | Microsoft Docs
description: Azure PowerShell Script Sample - OMS
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/01/2017
ms.author: cynthn
ms.custom: mvc
---

# Create an Operations Management Suite monitored VM with PowerShell

This script creates an Azure Virtual Machine, installs the Operations Management Suite (OMS) agent, and enrolls the system with an OMS workspace. Once the script has run, the virtual machine will be visible in the OMS console.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-powershell[main](../../../powershell_scripts/virtual-machine/create-vm-monitor-oms/create-vm-monitor-oms.ps1 "Create VM OMS")]

## Clean up deployment

Run the following command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Script explanation

This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig) | Creates a subnet configuration. This configuration is used with the virtual network creation process. |
| [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork) | Creates a virtual network. |
| [New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress) | Creates a public IP address. |
| [New-AzureRmNetworkSecurityRuleConfig](/powershell/module/azurerm.network/new-azurermnetworksecurityruleconfig) | Creates a network security group rule configuration. This configuration is used to create an NSG rule when the NSG is created. |
| [New-AzureRmNetworkSecurityGroup](/powershell/module/azurerm.network/new-azurermnetworksecuritygroup) | Creates a network security group. |
| [Get-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/get-azurermvirtualnetworksubnetconfig) | Gets subnet information. This information is used when creating a network interface. |
| [New-AzureRmNetworkInterface](/powershell/module/azurerm.network/new-azurermnetworkinterface) | Creates a network interface. |
| [New-AzureRmVMConfig](/powershell/module/azurerm.compute/new-azurermvmconfig) | Creates a VM configuration. This configuration includes information such as VM name, operating system, and administrative credentials. The configuration is used during VM creation. |
| [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm) | Create a virtual machine. |
| [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) | Add a VM extension to the virtual machine. In this case, the Operations Management Suite agent extension is used to install the OMS agent and enroll the VM in an OMS workspace. |
|[Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Removes a resource group and all resources contained within. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional virtual machine PowerShell script samples can be found in the [Azure Linux VM documentation](../linux/powershell-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
