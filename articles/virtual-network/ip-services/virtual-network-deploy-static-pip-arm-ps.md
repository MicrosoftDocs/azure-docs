---
title: Create a VM with a static public IP address - Azure PowerShell
titlesuffix: Azure Virtual Network
description: Create a virtual machine (VM) with a static public IP address using Azure PowerShell. Static public IP addresses are addresses that never change.
ms.date: 08/24/2023
ms.author: mbender
author: mbender-ms
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.custom: template-how-to, devx-track-azurepowershell
---

# Create a virtual machine with a static public IP address using Azure PowerShell

In this article, you'll create a VM with a static public IP address. A public IP address enables communication to a virtual machine from the internet. Assign a static public IP address, instead of a dynamic address, to ensure the address never changes. 

Public IP addresses have a [nominal charge](https://azure.microsoft.com/pricing/details/ip-addresses). There's a [limit](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) to the number of public IP addresses that you can use per subscription.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) named **myResourceGroup** in the **eastus2** location.

```azurepowershell-interactive
$rg =@{
    Name = 'myResourceGroup'
    Location = 'eastus2'
}
New-AzResourceGroup @rg

```

## Create a public IP address

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a standard public IPv4 address.

The following command creates a zone-redundant public IP address named **myPublicIP** in **myResourceGroup**.

```azurepowershell-interactive
## Create IP. ##
$ip = @{
    Name = 'myPublicIP'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3   
}
New-AzPublicIpAddress @ip
```
## Create a virtual machine

Create a virtual machine with [New-AzVM](/powershell/module/az.Compute/new-azvm). 

The following command creates a Windows Server virtual machine. You'll enter the name of the public IP address created previously in the **`-PublicIPAddressName`** parameter. When prompted, provide a username and password to be used as the credentials for the virtual machine:

```azurepowershell-interactive
## Create virtual machine. ##
$vm = @{
    ResourceGroupName = 'myResourceGroup'
    Location = 'East US 2'
    Name = 'myVM'
    PublicIpAddressName = 'myPublicIP'
}
New-AzVM @vm
```

For more information on public IP SKUs, see [Public IP address SKUs](public-ip-addresses.md#sku). A virtual machine can be added to the backend pool of an Azure Load Balancer. The SKU of the public IP address must match the SKU of a load balancer's public IP. For more information, see [Azure Load Balancer](../../load-balancer/skus.md).

View the public IP address assigned and confirm that it was created as a static address, with [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress):

```azurepowershell-interactive
## Retrieve public IP address settings. ##
$ip = @{
    Name = 'myPublicIP'
    ResourceGroupName = 'myResourceGroup'
}
Get-AzPublicIpAddress @ip | Select "IpAddress","PublicIpAllocationMethod" | Format-Table

```

> [!WARNING]
> Do not modify the IP address settings within the virtual machine's operating system. The operating system is unaware of Azure public IP addresses. Though you can add private IP address settings to the operating system, we recommend not doing so unless necessary, and not until after reading [Add a private IP address to an operating system](virtual-network-network-interface-addresses.md#private).

[!INCLUDE [ephemeral-ip-note.md](../../../includes/ephemeral-ip-note.md)]

## Clean up resources

When no longer needed, you can use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources it contains:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Next steps

- Learn more about [public IP addresses](public-ip-addresses.md#public-ip-addresses) in Azure.
- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).
- Learn more about [private IP addresses](private-ip-addresses.md) and assigning a [static private IP address](virtual-network-network-interface-addresses.md#add-ip-addresses) to an Azure virtual machine.
- Learn more about creating [Linux](../../virtual-machines/windows/tutorial-manage-vm.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Windows](../../virtual-machines/windows/tutorial-manage-vm.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machines.
