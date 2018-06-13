---
title: Azure PowerShell script sample - Create a network for multi-tier applications | Microsoft Docs
description: Azure PowerShell script sample - Create a virtual network for multi-tier applications.
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

# Create a network for multi-tier applications script sample

This script sample creates a virtual network with front-end and back-end subnets. Traffic to the front-end subnet is limited to HTTP and SSH, while traffic to the back-end subnet is limited to MySQL, port 3306. After running the script, you will have two virtual machines, one in each subnet that you can deploy web server and MySQL software to.

You can execute the script from the Azure [Cloud Shell](https://shell.azure.com/powershell), or from a local PowerShell installation. If you use PowerShell locally, this script requires the AzureRM PowerShell module version 5.4.1 or later. To find the installed version, run `Get-Module -ListAvailable AzureRM`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script


[!code-azurepowershell-interactive[main](../../../powershell_scripts/virtual-network/virtual-network-multi-tier-application/virtual-network-multi-tier-application.ps1  "Virtual network for multi-tier application")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources:

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup -Force
```

## Script explanation

This script uses the following commands to create a resource group, virtual network,  and network security groups. Each command in the following table links to command-specific documentation:

| Command | Notes |
|---|---|
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork) | Creates an Azure virtual network and front-end subnet. |
| [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig) | Creates a back-end subnet. |
| [New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress) | Creates a public IP address to access the VM from the internet. |
| [New-AzureRmNetworkInterface](/powershell/module/azurerm.network/new-azurermnetworkinterface) | Creates virtual network interfaces and attaches them to the virtual network's front-end and back-end subnets. |
| [New-AzureRmNetworkSecurityGroup](/powershell/module/azurerm.network/new-azurermnetworksecuritygroup) | Creates network security groups (NSG) that are associated to the front-end and back-end subnets. |
| [New-AzureRmNetworkSecurityRuleConfig](/powershell/module/azurerm.network/new-azurermnetworksecurityruleconfig) |Creates NSG rules that allow or block specific ports to specific subnets. |
| [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm) | Creates virtual machines and attaches a NIC to each VM. This command also specifies the virtual machine image to use and administrative credentials. |
| [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Deletes a resource group and all resources it contains. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional virtual network PowerShell script samples can be found in [Virtual network PowerShell samples](../powershell-samples.md).
