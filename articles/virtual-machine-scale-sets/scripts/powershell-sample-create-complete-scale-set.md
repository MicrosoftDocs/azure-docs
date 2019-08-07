---
title: Azure PowerShell Samples - Create a complete virtual machine scale set | Microsoft Docs
description: Azure PowerShell Samples
services: virtual-machine-scale-sets
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machine-scale-sets
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/29/2018
ms.author: cynthn
ms.custom: mvc

---

# Create a complete virtual machine scale set with PowerShell

This script creates a virtual machine scale set running Windows Server 2016. Individual resources are configured and created, rather than the using the [built-in resource creation options available here in New-AzVmss](powershell-sample-create-simple-scale-set.md). After running the script, you can access the VM instances through RDP.


[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [updated-for-az.md](../../../includes/updated-for-az.md)]

## Sample script

[!code-powershell[main](../../../powershell_scripts/virtual-machine-scale-sets/complete-scale-set/complete-scale-set.ps1 "Create a complete virtual machine scale set")]

## Clean up deployment
Run the following command to remove the resource group, scale set, and all related resources.

```powershell
Remove-AzResourceGroup -Name $resourceGroupName
```

## Script explanation
This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) | Creates a subnet configuration. This configuration is used with the virtual network creation process. |
| [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) | Creates a virtual network. |
| [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) | Creates a public IP address. |
| [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig) | Creates a front-end IP configuration for a load balancer. |
| [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig) | Creates a backend address pool configuration for a load balancer. |
| [New-AzLoadBalancerInboundNatRuleConfig](/powershell/module/az.network/new-azloadbalancerinboundnatruleconfig) | Creates an inbound NAT rule configuration for a load balancer. |
| [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer) | Creates a load balancer. |
| [Add-AzLoadBalancerProbeConfig](/powershell/module/az.network/new-azloadbalancerprobeconfig) | Creates a probe configuration for a load balancer. |
| [Add-AzLoadBalancerRuleConfig](/powershell/module/az.network/new-azloadbalancerruleconfig) | Creates a rule configuration for a load balancer. |
| [Set-AzLoadBalancer](/powershell/module/az.Network/Set-azLoadBalancer) | Update the load balancer with the provided information. |
| [New-AzVmssIpConfig](/powershell/module/az.Compute/New-azVmssIpConfig) | Create an IP configuration for the scale set VM instances. The VM instances are connected to the load balancer backend pool, NAT pool, and virtual network subnet. |
| [New-AzVmssConfig](/powershell/module/az.Compute/New-azVmssConfig) | Creates a scale set configuration. This configuration includes information such as number of VM instances to create, the VM SKU (size), and upgrade policy mode. The configuration is added to by additional cmdlets, and is used during scale set creation. |
| [Set-AzVmssStorageProfile](/powershell/module/az.Compute/Set-azVmssStorageProfile) | Define the image to be used for the VM instances, and add it to the scale set config. |
| [Set-AzVmssOsProfile](/powershell/module/az.Compute/Set-azVmssStorageProfile) | Define the administrative username and password credentials, and VM naming prefix. Add these values to the scale set config. |
| [Add-AzVmssNetworkInterfaceConfiguration](/powershell/module/az.Compute/Add-azVmssNetworkInterfaceConfiguration) | Add a virtual network interface to the VM instances, based on the IP configuration. Add these values to the scale set config. |
| [New-AzVmss](/powershell/module/az.Compute/New-azVmss) | Create the scale set based on the information provided in the scale set configuration. |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Removes a resource group and all resources contained within. |

## Next steps
For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional virtual machine scale set PowerShell script samples can be found in the [Azure virtual machine scale set documentation](../powershell-samples.md).
