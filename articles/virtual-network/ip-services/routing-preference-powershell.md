---
title: Configure routing preference for a public IP address - Azure PowerShell
titlesuffix: Azure Virtual Network
description: Learn how to Configure routing preference for a public IP address using Azure PowerShell.
services: virtual-network
ms.date: 08/24/2023
ms.author: mbender
author: mbender-ms
ms.service: virtual-network
ms.topic: how-to
ms.workload: infrastructure-services
ms.custom: devx-track-azurepowershell
---

# Configure routing preference for a public IP address using Azure PowerShell

This article shows you how to configure routing preference via ISP network (**Internet** option) for a public IP address using Azure PowerShell. After creating the public IP address, you can associate it with the following Azure resources for inbound and outbound traffic to the internet:

* Virtual machine
* Virtual machine scale set
* Azure Kubernetes Service (AKS)
* Internet-facing load balancer
* Application Gateway
* Azure Firewall

By default, the routing preference for public IP address is set to the Microsoft global network for all Azure services and can be associated with any Azure service.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]
If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 6.9.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

Create a resource group with [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup). This example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurepowershell
$rg = New-AzResourceGroup -Name myResourceGroup -Location EastUS
```

## Create a Public IP with Internet routing preference

The following command creates a new public IP with a routing preference type as *Internet* in the *East US* Azure region:

```azurepowershell
$iptagtype="RoutingPreference"
$tagName = "Internet"
$ipTag = New-AzPublicIpTag -IpTagType $iptagtype -Tag $tagName 
# attach the tag
$publicIp = New-AzPublicIpAddress  `
-Name "MyPublicIP" `
-ResourceGroupName $rg.ResourceGroupName `
-Location $rg.Location `
-IpTag $ipTag `
-AllocationMethod Static `
-Sku Standard `
-IpAddressVersion IPv4
```

You can associate the above created public IP address with a [Windows](../../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine. Use the CLI section on the tutorial page: [Associate a public IP address to a virtual machine](./associate-public-ip-address-vm.md) to associate the Public IP to your VM. You can also associate the public IP address created above with an [Azure Load Balancer](../../load-balancer/load-balancer-overview.md), by assigning it to the load balancer **frontend** configuration. The public IP address serves as a load-balanced virtual IP address (VIP).

## Clean up resources

If no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group, VM, and all related resources.

```azurepowershell
Remove-AzResourceGroup -Name myResourceGroup
```

## Next steps

- Learn more about [routing preference in public IP addresses](routing-preference-overview.md).
- [Configure routing preference for a VM using the Azure PowerShell](./configure-routing-preference-virtual-machine-powershell.md).