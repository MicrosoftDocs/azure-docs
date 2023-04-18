---
title: Load balance traffic to VMs for HA - Azure PowerShell
titleSuffix: Azure Load Balancer
description: This Azure PowerShell Script Example shows how to load balance traffic to VMs for high availability
services: load-balancer
documentationcenter: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.devlang: powershell
ms.topic: sample
ms.workload: infrastructure
ms.date: 02/28/2023
ms.author: mbender 
ms.custom: devx-track-azurepowershell, engagement-fy23
---

# Azure PowerShell script example: Load balance traffic to VMs for high availability

This Azure PowerShell script example creates everything needed to run several Windows virtual machines configured in a highly available and load balanced configuration. After running the script, you'll have three virtual machines, joined to an Azure Availability Set, and accessible through an Azure Load Balancer.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/), and then run `Connect-AzAccount` to create a connection with Azure.

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
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group for storing resources. |
| [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) | Creates a subnet configuration. This configuration works with the virtual network creation process. |
| [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) | Creates an Azure virtual network and subnet. |
| [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress)  | Creates a public IP address with a static IP address and an associated DNS name. |
| [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer)  | Creates an Azure load balancer. |
| [New-AzLoadBalancerProbeConfig](/powershell/module/az.network/new-azloadbalancerprobeconfig) | Creates a load balancer probe. A load balancer probe monitors each VM in the load balancer set. If any VM becomes inaccessible, no traffic routes to the VM. |
| [New-AzLoadBalancerRuleConfig](/powershell/module/az.network/new-azloadbalancerruleconfig) | Creates a load balancer rule. In this sample, you create a rule for port 80. As HTTP traffic arrives at the load balancer, traffic routes to port 80 on one of the VMs in the LB set. |
| [New-AzLoadBalancerInboundNatRuleConfig](/powershell/module/az.network/new-azloadbalancerinboundnatruleconfig) | Creates a load balancer Network Address Translation (NAT) rule.  NAT rules map a port of the load balancer to a port on a VM. This sample creates a NAT rule for SSH traffic to each VM in the load balancer set. |
| [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) | Creates a network security group (NSG), which is a security boundary between the internet and the virtual machine. |
| [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig) | Creates an NSG rule to allow inbound traffic. This sample creates a rule opening port 22 for SSH traffic. |
| [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) | Creates a virtual network card and attaches it to the virtual network, subnet, and NSG. |
| [New-AzAvailabilitySet](/powershell/module/az.compute/new-azavailabilityset) | Creates an availability set. Availability sets ensure application uptime by spreading the virtual machines across physical resources so a failure doesn't affect the entire set. |
| [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig) | Creates a VM configuration used during VM creation. This configuration includes information such as VM name, operating system, and administrative credentials. |
| [New-AzVM](/powershell/module/az.compute/new-azvm)  | Creates the virtual machine and connects it to the network card, virtual network, subnet, and NSG. This command also specifies the virtual machine image used and administrative credentials. |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/).

Find more networking PowerShell script samples in the [Azure Networking Overview documentation](../powershell-samples.md?toc=%2fazure%2fnetworking%2ftoc.json).