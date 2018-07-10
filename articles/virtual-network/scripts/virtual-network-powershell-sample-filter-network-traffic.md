---
title: Azure PowerShell script sample - Filter VM network traffic | Microsoft Docs
description: Azure PowerShell script sample - Filter inbound and outbound VM network traffic.
services: virtual-network
documentationcenter: virtual-network
author: jimdial
manager: jeconnoc
editor: ''
tags:

ms.assetid:
ms.service: virtual-network
ms.devlang: powershell
ms.topic: sample
ms.tgt_pltfrm:
ms.workload: infrastructure
ms.date: 03/20/2018
ms.author: jdial

---

# Filter inbound and outbound VM network traffic script sample

This script sample creates a virtual network with front-end and back-end subnets. Inbound network traffic to the front-end subnet is limited to HTTP, and HTTPS, while outbound traffic to the internet from the back-end subnet is not permitted. After running the script, you have one virtual machine with two NICs. Each NIC is connected to a different subnet.

You can execute the script from the Azure [Cloud Shell](https://shell.azure.com/powershell), or from a local PowerShell installation. If you use PowerShell locally, this script requires the AzureRM PowerShell module version 5.4.1 or later. To find the installed version, run `Get-Module -ListAvailable AzureRM`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurepowershell-interactive[main](../../../powershell_scripts/virtual-network/filter-network-traffic/filter-network-traffic.ps1  "Filter VM network traffic")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources:

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup -Force
```

## Script explanation

This script uses the following commands to create a resource group, virtual network, and network security groups. Each command in the following table links to command-specific documentation:

| Command | Notes |
|---|---|
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig) | Creates a subnet configuration object |
| [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork) | Creates an Azure virtual network and front-end subnet. |
| [New-AzureRmNetworkSecurityRuleConfig](/powershell/module/azurerm.network/new-azurermnetworksecurityruleconfig) | Creates security rules to be assigned to a network security group. |
| [New-AzureRmNetworkSecurityGroup](/powershell/module/azurerm.network/new-azurermnetworksecuritygroup) |Creates NSG rules that allow or block specific ports to specific subnets. |
| [Set-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/set-azurermvirtualnetworksubnetconfig) | Associates NSGs to subnets. |
| [New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress) | Creates a public IP address to access the VM from the internet. |
| [New-AzureRmNetworkInterface](/powershell/module/azurerm.network/new-azurermnetworkinterface) | Creates virtual network interfaces and attaches them to the virtual network's front-end and back-end subnets. |
| [New-AzureRmVMConfig](/powershell/module/azurerm.compute/new-azurermvmconfig) | Creates a VM configuration. This configuration includes information such as VM name, operating system, and administrative credentials. The configuration is used during VM creation. |
| [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm) | Create a virtual machine. |
|[Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Removes a resource group and all resources contained within. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional virtual network PowerShell script samples can be found in [Virtual network PowerShell samples](../powershell-samples.md).
