---
title: Azure PowerShell Samples - Attach and use data disks | Microsoft Docs
description: Azure PowerShell Samples
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machine-scale-sets
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/27/2018
ms.author: iainfou
ms.custom: mvc

---

# Attach and use data disks with a virtual machine scale set with PowerShell
This script creates a virtual machine scale set and attaches and prepares data disks.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script
[!code-powershell[main](../../../powershell_scripts/virtual-machine-scale-sets/use-data-disks/use-data-disks.ps1 "Create a virtual machine scale set with data disks")]

## Clean up deployment
Run the following command to remove the resource group, scale set, and all related resources.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Script explanation
This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig) | Creates a configuration object that defines the virtual network subnet. |
| [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork) | Creates a virtual network and subnet. |
| [New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress) | Creates a static public IP address. |
| [New-AzureRmLoadBalancerFrontendIpConfig](/powershell/module/azurerm.network/new-azurermloadbalancerfrontendipconfig) | Creates a configuration object that defines the load balancer front-end, including public IP address. |
| [New-AzureRmLoadBalancerBackendAddressPoolConfig](/powershell/module/azurerm.network/new-azurermloadbalancerbackendaddresspoolconfig) | Creates a configuration object that defines the load balancer back-end. |
| [New-AzureRmLoadBalancer](/powershell/module/azurerm.network/new-azurermloadbalancer) | Creates a load balancer based on the front-end and back-end configuration objects. |
| [New-AzureRmVmssIpConfig](/powershell/module/azurerm.compute/new-azurermvmssipconfig) | Creates a configuration object that defines the virtual machine scale set IP address information to connect the VM instances to the load balancer back-end pool and inbound NAT pool.
| [New-AzureRmVmssConfig](/powershell/module/azurerm.compute/new-azurermvmssconfig) | Creates a configuration object that defines the number of VM instances in a scale set, the VM instance size, and upgrade policy mode. |
| [Set-AzureRmVmssStorageProfile](/powershell/module/azurerm.compute/set-azurermvmssstorageprofile) | Creates a configuration object that defines the VM image to use for the VM instances. |
| [Set-AzureRmVmssOsProfile](/powershell/module/azurerm.compute/set-azurermvmssosprofile) | Creates a configuration profile that defines the VM instance name and user credentials. |
| [Add-AzureRmVmssNetworkInterfaceConfiguration](/powershell/module/azurerm.compute/add-azurermvmssnetworkinterfaceconfiguration) | Creates a configuration object that defines the virtual network interface card for each VM instance. |
| [New-AzureRmVmss](/powershell/module/azurerm.compute/new-azurermvmss) | Combines all the configuration objects to create the virtual machine scale set. |
| [Get-AzureRmVmss](/powershell/module/azurerm.compute/get-azurermvmss) | Gets information on a virtual machine scale set. |
| [Add-AzureRmVmssExtension](/powershell/module/azurerm.compute/add-azurermvmssextension) | Adds a VM extension for Custom Script to install a basic web application. |
| [Update-AzureRmVmss](/powershell/module/azurerm.compute/update-azurermvmss) | Updates the virtual machine scale set model to apply the VM extension. |
|[Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Removes a resource group and all resources contained within. |

## Next steps
For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional virtual machine scale set PowerShell script samples can be found in the [Azure virtual machine scale set documentation](../powershell-samples.md).