---
title: Azure PowerShell script sample - Filter VM network traffic | Microsoft Docs
description: Azure PowerShell script sample - Filter inbound and outbound VM network traffic.
services: virtual-network
documentationcenter: virtual-network
author: KumudD
manager: mtillman
ms.service: virtual-network
ms.devlang: powershell
ms.topic: article
ms.tgt_pltfrm:
ms.workload: infrastructure
ms.date: 05/16/2017
ms.author: kumud

---

# Filter inbound and outbound VM network traffic

This script sample creates a virtual network with front-end and back-end subnets. Inbound network traffic to the front-end subnet is limited to HTTP, and HTTPS, while outbound traffic to the Internet from the back-end subnet is not permitted. After running the script, you will have one virtual machine with two NICs. Each NIC is connected to a different subnet.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](https://docs.microsoft.com/powershell/azureps-cmdlets-docs/), and then run `Connect-AzAccount` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-powershell[main](../../../powershell_scripts/virtual-network/filter-network-traffic/filter-network-traffic.ps1  "Filter VM network traffic")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, virtual network,  and network security groups. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) | Creates a subnet configuration object |
| [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) | Creates an Azure virtual network and front-end subnet. |
| [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig) | Creates security rules to be assigned to a network security group. |
| [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) |Creates NSG rules that allow or block specific ports to specific subnets. |
| [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) | Associates NSGs to subnets. |
| [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) | Creates a public IP address to access the VM from the Internet. |
| [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) | Creates virtual network interfaces and attaches them to the virtual network's front-end and back-end subnets. |
| [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) | Creates a VM configuration. This configuration includes information such as VM name, operating system, and administrative credentials. The configuration is used during VM creation. |
| [New-AzVM](/powershell/module/az.compute/new-azvm) | Create a virtual machine. |
|[Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Removes a resource group and all resources contained within. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/azure/overview).

Additional networking PowerShell script samples can be found in the [Azure Networking Overview documentation](../powershell-samples.md?toc=%2fazure%2fnetworking%2ftoc.json).
