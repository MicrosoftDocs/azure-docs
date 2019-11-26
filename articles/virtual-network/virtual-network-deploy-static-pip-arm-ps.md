---
title: Create a VM with a static public IP address - PowerShell | Microsoft Docs
description: Learn how to create a VM with a static public IP address using PowerShell.
services: virtual-network
documentationcenter: na
author: KumudD
manager: twooley
editor: ''
tags: azure-resource-manager

ms.assetid: ad975ab9-d69f-45c1-9e45-0d3f0f51e87e
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/08/2018
ms.author: kumud
---

# Create a virtual machine with a static public IP address using PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

You can create a virtual machine with a static public IP address. A public IP address enables you to communicate to a virtual machine from the internet. Assign a static public IP address, rather than a dynamic address, to ensure that the address never changes. Learn more about [static public IP addresses](virtual-network-ip-addresses-overview-arm.md#allocation-method). To change a public IP address assigned to an existing virtual machine from dynamic to static, or to work with private IP addresses, see [Add, change, or remove IP addresses](virtual-network-network-interface-addresses.md). Public IP addresses have a [nominal charge](https://azure.microsoft.com/pricing/details/ip-addresses), and there is a [limit](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) to the number of public IP addresses that you can use per subscription.

## Create a virtual machine

You can complete the following steps from your local computer or by using the Azure Cloud Shell. To use your local computer, ensure you have the [Azure PowerShell installed](/powershell/azure/install-az-ps?toc=%2fazure%2fvirtual-network%2ftoc.json). To use the Azure Cloud Shell, select **Try It** in the top right corner of any command box that follows. The Cloud Shell signs you into Azure.

1. If using the Cloud Shell, skip to step 2. Open a command session and sign into Azure with `Connect-AzAccount`.
2. Create a resource group with the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command. The following example creates a resource group in the East US Azure region:

   ```azurepowershell-interactive
   New-AzResourceGroup -Name myResourceGroup -Location EastUS
   ```

3. Create a virtual machine with the [New-AzVM](/powershell/module/az.Compute/New-azVM) command. The `-AllocationMethod "Static"` option assigns a static public IP address to the virtual machine. The following example creates a Windows Server virtual machine with a static, basic SKU public IP address named *myPublicIpAddress*. When prompted, provide a username and password to be used as the sign in credentials for the virtual machine:

   ```azurepowershell-interactive
   New-AzVm `
     -ResourceGroupName "myResourceGroup" `
     -Name "myVM" `
     -Location "East US" `
     -PublicIpAddressName "myPublicIpAddress" `
     -AllocationMethod "Static"
   ```

   If the public IP address must be a standard SKU, you have to [create a public IP address](virtual-network-public-ip-address.md#create-a-public-ip-address), [create a network interface](virtual-network-network-interface.md#create-a-network-interface), [assign the public IP address to the network interface](virtual-network-network-interface-addresses.md#add-ip-addresses), and then [create a virtual machine with the network interface](virtual-network-network-interface-vm.md#add-existing-network-interfaces-to-a-new-vm), in separate steps. Learn more about [Public IP address SKUs](virtual-network-ip-addresses-overview-arm.md#sku). If the virtual machine will be added to the back-end pool of a public Azure Load Balancer, the SKU of the virtual machine's public IP address must match the SKU of the load balancer's public IP address. For details, see [Azure Load Balancer](../load-balancer/load-balancer-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#skus).

4. View the public IP address assigned and confirm that it was created as a static address, with [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress):

   ```azurepowershell-interactive
   Get-AzPublicIpAddress `
     -ResourceGroupName "myResourceGroup" `
     -Name "myPublicIpAddress" `
     | Select "IpAddress", "PublicIpAllocationMethod" `
     | Format-Table
   ```

   Azure assigned a public IP address from addresses used in the region you created the virtual machine in. You can download the list of ranges (prefixes) for the Azure [Public](https://www.microsoft.com/download/details.aspx?id=56519), [US government](https://www.microsoft.com/download/details.aspx?id=57063), [China](https://www.microsoft.com/download/details.aspx?id=57062), and [Germany](https://www.microsoft.com/download/details.aspx?id=57064) clouds.

> [!WARNING]
> Do not modify the IP address settings within the virtual machine's operating system. The operating system is unaware of Azure public IP addresses. Though you can add private IP address settings to the operating system, we recommend not doing so unless necessary, and not until after reading [Add a private IP address to an operating system](virtual-network-network-interface-addresses.md#private).

## Clean up resources

When no longer needed, you can use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources it contains:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Next steps

- Learn more about [public IP addresses](virtual-network-ip-addresses-overview-arm.md#public-ip-addresses) in Azure
- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address)
- Learn more about [private IP addresses](virtual-network-ip-addresses-overview-arm.md#private-ip-addresses) and assigning a [static private IP address](virtual-network-network-interface-addresses.md#add-ip-addresses) to an Azure virtual machine
- Learn more about creating [Linux](../virtual-machines/windows/tutorial-manage-vm.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Windows](../virtual-machines/windows/tutorial-manage-vm.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machines
