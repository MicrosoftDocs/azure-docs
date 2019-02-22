---
title: PowerShell Example - Load balance multiple websites with Azure PowerShell | Microsoft Docs
description: This Azure PowerShell script example hows how to load balance multiple websites to the same virtual machine
services: load-balancer
documentationcenter: load-balancer
author: KumudD
manager: jeconnoc
editor: tysonn
tags:

ms.assetid:
ms.service: load-balancer
ms.devlang: powershell
ms.topic: sample
ms.tgt_pltfrm:
ms.workload: infrastructure
ms.date: 04/20/2018
ms.author: kumud
---

# Azure PowerShell script example: Load balance multiple websites

This Azure PowerShell script example creates a virtual network with two virtual machines (VM) that are members of an availability set. A load balancer directs traffic for two separate IP addresses to the two VMs. After running the script, you could deploy web server software to the VMs and host multiple web sites, each with its own IP address.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](https://docs.microsoft.com/powershell/azureps-cmdlets-docs/), and then run `Connect-AzAccount` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-powershell[main](../../../powershell_scripts/load-balancer/load-balance-multiple-web-sites-vm/load-balance-multiple-web-sites-vm.ps1  "Load balance multiple web sites")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, virtual network, load balancer, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzAvailabilitySet](/powershell/module/az.compute/new-azavailabilityset) | Creates an Azure availability set to provide high availability. |
| [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) | Creates a subnet configuration. This configuration is used with the virtual network creation process. |
| [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) | Creates a virtual network. |
| [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) | Creates a public IP address. |
| [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig) | Creates a front end IP config for a load balancer. |
| [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig) | Creates a backend address pool configuration for a load balancer. |
| [New-AzLoadBalancerProbeConfig](/powershell/module/az.network/new-azloadbalancerprobeconfig) | Creates an NLB probe. An NLB probe is used to monitor each VM in the NLB set. If any VM becomes inaccessible, traffic is not routed to the VM. |
| [New-AzLoadBalancerRuleConfig](/powershell/module/az.network/new-azloadbalancerruleconfig) | Creates an NLB rule. In this sample, a rule is created for port 80. As HTTP traffic arrives at the NLB, it is routed to port 80 one of the VMs in the NLB set. |
| [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer) | Creates a load balancer. |
| [New-AzNetworkInterfaceIpConfig](/powershell/module/az.network/new-aznetworkinterfaceipconfig) | Defines advanced features for a virtual network interface. |
| [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) | Creates a network interface. |
| [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) | Creates a VM configuration. This configuration includes information such as VM name, operating system, and administrative credentials. The configuration is used during VM creation. |
| [New-AzVM](/powershell/module/az.compute/new-azvm) | Create a virtual machine. |
|[Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Removes a resource group and all resources contained within. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/azure/overview).

Additional networking PowerShell script samples can be found in the [Azure Networking Overview documentation](../powershell-samples.md?toc=%2fazure%2fnetworking%2ftoc.json).
