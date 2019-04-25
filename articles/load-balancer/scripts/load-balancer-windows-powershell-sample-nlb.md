---
title: PowerShell Example - Load balance traffic to VMs for high availability - Azure
titlesuffix: Azure Load Balancer
description: This Azure PowerShell Script Example shows how to load balance traffic to VMs for high availability
services: load-balancer
documentationcenter: load-balancer
author: KumudD
ms.service: load-balancer
ms.devlang: powershell
ms.topic: sample
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 04/20/2018
ms.author: kumud
---

# Azure PowerShell script example: Load balance traffic to VMs for high availability

This Azure PowerShell script example creates everything needed to run several Windows virtual machines configured in a highly available and load balanced configuration. After running the script, you will have three virtual machines, joined to an Azure Availability Set, and accessible through an Azure Load Balancer.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](https://docs.microsoft.com/powershell/azureps-cmdlets-docs/), and then run `Connect-AzAccount` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-powershell[main](../../../powershell_scripts/virtual-machine/create-vm-nlb/create-vm-nlb.ps1 "Quick Create VM")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, virtual machine, availability set, load balancer, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) | Creates a subnet configuration. This configuration is used with the virtual network creation process. |
| [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) | Creates an Azure virtual network and subnet. |
| [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress)  | Creates a public IP address with a static IP address and an associated DNS name. |
| [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer)  | Creates an Azure load balancer. |
| [New-AzLoadBalancerProbeConfig](/powershell/module/az.network/new-azloadbalancerprobeconfig) | Creates a load balancer probe. A load balancer probe is used to monitor each VM in the load balancer set. If any VM becomes inaccessible, traffic is not routed to the VM. |
| [New-AzLoadBalancerRuleConfig](/powershell/module/az.network/new-azloadbalancerruleconfig) | Creates an load balancer rule. In this sample, a rule is created for port 80. As HTTP traffic arrives at the load balancer, it is routed to port 80 one of the VMs in the load balancer set. |
| [New-AzLoadBalancerInboundNatRuleConfig](/powershell/module/az.network/new-azloadbalancerinboundnatruleconfig) | Creates a load balancer Network Address Translation (NAT) rule.  NAT rules map a port of the load balancer to a port on a VM. In this sample, a NAT rule is created for SSH traffic to each VM in the load balancer set.  |
| [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) | Creates a network security group (NSG), which is a security boundary between the internet and the virtual machine. |
| [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig) | Creates an NSG rule to allow inbound traffic. In this sample, port 22 is opened for SSH traffic. |
| [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) | Creates a virtual network card and attaches it to the virtual network, subnet, and NSG. |
| [New-AzAvailabilitySet](/powershell/module/az.compute/new-azavailabilityset) | Creates an availability set. Availability sets ensure application uptime by spreading the virtual machines across physical resources such that if failure occurs, the entire set is not effected. |
| [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) | Creates a VM configuration. This configuration includes information such as VM name, operating system, and administrative credentials. The configuration is used during VM creation. |
| [New-AzVM](/powershell/module/az.compute/new-azvm)  | Creates the virtual machine and connects it to the network card, virtual network, subnet, and NSG. This command also specifies the virtual machine image to be used and administrative credentials.  |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/azure/overview).

Additional networking PowerShell script samples can be found in the [Azure Networking Overview documentation](../powershell-samples.md?toc=%2fazure%2fnetworking%2ftoc.json).
