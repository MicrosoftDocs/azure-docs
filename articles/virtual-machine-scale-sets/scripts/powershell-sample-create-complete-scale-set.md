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
This script creates a virtual machine scale set running Windows Server 2016. Individual resources are configured and created, rather than the using the [built-in resource creation options avaiable here in New-AzureRmVmss](powershell-sample-create-simple-scale-set.md). After running the script, you can access the VM instances through RDP.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script
[!code-powershell[main](../../../powershell_scripts/virtual-machine-scale-sets/complete-scale-set/complete-scale-set.ps1 "Create a complete virtual machine scale set")]

## Clean up deployment
Run the following command to remove the resource group, scale set, and all related resources.

```powershell
Remove-AzureRmResourceGroup -Name $resourceGroupName
```

## Script explanation
This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig) | Creates a subnet configuration. This configuration is used with the virtual network creation process. |
| [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork) | Creates a virtual network. |
| [New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress) | Creates a public IP address. |
| [New-AzureRmLoadBalancerFrontendIpConfig](/powershell/module/azurerm.network/new-azurermloadbalancerfrontendipconfig) | Creates a front-end IP configuration for a load balancer. |
| [New-AzureRmLoadBalancerBackendAddressPoolConfig](/powershell/module/azurerm.network/new-azurermloadbalancerbackendaddresspoolconfig) | Creates a backend address pool configuration for a load balancer. |
| [New-AzureRmLoadBalancerInboundNatRuleConfig](/powershell/module/azurerm.network/new-azurermloadbalancerinboundnatruleconfig) | Creates an inbound NAT rule configuration for a load balancer. |
| [New-AzureRmLoadBalancer](/powershell/module/azurerm.network/new-azurermloadbalancer) | Creates a load balancer. |
| [Add-AzureRmLoadBalancerProbeConfig](/powershell/module/azurerm.network/new-azurermloadbalancerprobeconfig) | Creates a probe configuration for a load balancer. |
| [Add-AzureRmLoadBalancerRuleConfig](/powershell/module/azurerm.network/new-azurermloadbalancerruleconfig) | Creates a rule configuration for a load balancer. |
| [Set-AzureRmLoadBalancer](/powershell/module/AzureRM.Network/Set-AzureRmLoadBalancer) | Update the load balancer with the provided information. |
| [New-AzureRmVmssIpConfig](/powershell/module/AzureRM.Compute/New-AzureRmVmssIpConfig) | Create an IP configuration for the scale set VM instances. The VM instances are connected to the load balancer backend pool, NAT pool, and virtual network subnet. |
| [New-AzureRmVmssConfig](/powershell/module/AzureRM.Compute/New-AzureRmVmssConfig) | Creates a scale set configuration. This configuration includes information such as number of VM instances to create, the VM SKU (size), and upgrade policy mode. The configuration is added to by additional cmdlets, and is used during scale set creation. |
| [Set-AzureRmVmssStorageProfile](/powershell/module/AzureRM.Compute/Set-AzureRmVmssStorageProfile) | Define the image to be used for the VM instances, and add it to the scale set config. |
| [Set-AzureRmVmssOsProfile](/powershell/module/AzureRM.Compute/Set-AzureRmVmssStorageProfile) | Define the administrative username and password credentials, and VM naming prefix. Add these values to the scale set config. |
| [Add-AzureRmVmssNetworkInterfaceConfiguration](/powershell/module/AzureRM.Compute/Add-AzureRmVmssNetworkInterfaceConfiguration) | Add a virtual network interface to the VM instances, based on the IP configuration. Add these values to the scale set config. |
| [New-AzureRmVmss](/powershell/module/AzureRM.Compute/New-AzureRmVmss) | Create the scale set based on the information provided in the scale set configuration. |
| [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Removes a resource group and all resources contained within. |

## Next steps
For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional virtual machine scale set PowerShell script samples can be found in the [Azure virtual machine scale set documentation](../powershell-samples.md).
