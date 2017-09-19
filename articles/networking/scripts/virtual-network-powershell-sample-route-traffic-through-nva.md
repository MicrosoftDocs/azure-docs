---
title: Azure PowerShell script sample - Route traffic through a network virtual appliance | Microsoft Docs
description: Azure PowerShell script sample - Route traffic through a firewall network virtual appliance.
services: virtual-network
documentationcenter: virtual-network
author: georgewallace
manager: timlt
editor: tysonn
tags:

ms.assetid:
ms.service: virtual-network
ms.devlang: powershell
ms.topic: article
ms.tgt_pltfrm:
ms.workload: infrastructure
ms.date: 05/16/2017
ms.author: gwallace

---

# Route traffic through a network virtual appliance

This script sample creates a virtual network with front-end and back-end subnets. It also creates a VM with IP forwarding enabled to route traffic between the two subnets. After running the script you can deploy network software, such as a firewall application, to the VM.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](https://docs.microsoft.com/powershell/azureps-cmdlets-docs/), and then run `Login-AzureRmAccount` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script


[!code-powershell[main](../../../powershell_scripts/virtual-network/route-traffic-through-nva/route-traffic-through-nva.ps1 "Route traffic through a network virtual appliance")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```
## Script explanation

This script uses the following commands to create a resource group, virtual network,  and network security groups. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup)  | Creates a resource group in which all resources are stored. |
| [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork) | Creates an Azure virtual network and front-end subnet. |
| [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig) | Creates back-end and DMZ subnets. |
| [New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress) | Creates a public IP address to access the VM from the Internet. |
| [New-AzureRmNetworkInterface](/powershell/module/azurerm.network/new-azurermnetworkinterface) | Creates a virtual network interface and enable IP forwarding for it. |
| [New-AzureRmNetworkSecurityGroup](/powershell/module/azurerm.network/new-azurermnetworksecuritygroup) | Creates a network security group (NSG). |
| [New-AzureRmNetworkSecurityRuleConfig](/powershell/module/azurerm.network/new-azurermnetworksecurityruleconfig) | Creates NSG rules that allow HTTP and HTTPS ports inbound to the VM. |
| [Set-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/set-azurermvirtualnetworksubnetconfig)| Associates the NSGs and route tables to subnets. |
| [New-AzureRmRouteTable](/powershell/module/azurerm.network/new-azurermroutetable)| Creates a route table for all routes. |
| [New-AzureRMRouteConfig](/powershell/module/azurerm.network/new-azurermrouteconfig)| Creates routes to route traffic between subnets and the Internet through the VM. |
| [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm) | Creates a virtual machine and attaches the NIC to it. This command also specifies the virtual machine image to use and administrative credentials. |
| [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup)  | Deletes a resource group and all resources it contains. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/azure/overview).

Additional networking PowerShell script samples can be found in the [Azure Networking Overview documentation](../powershell-samples.md?toc=%2fazure%2fnetworking%2ftoc.json).