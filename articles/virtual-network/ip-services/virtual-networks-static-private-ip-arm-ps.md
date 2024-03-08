---
title: 'Create a VM with a static private IP address - Azure PowerShell'
description: Learn how to create a virtual machine with a static private IP address using Azure PowerShell.
ms.date: 08/24/2023
ms.author: mbender
author: mbender-ms
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.custom: template-how-to, engagement-fy23, devx-track-azurepowershell
---

# Create a virtual machine with a static private IP address using Azure PowerShell

A virtual machine (VM) is automatically assigned a private IP address from a range that you specify. This range is based on the subnet in which the VM is deployed. The VM keeps the address until the VM is deleted. Azure dynamically assigns the next available private IP address from the subnet you create a VM in. Assign a static IP address to the VM if you want a specific IP address in the subnet.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) named **myResourceGroup** in the **eastus2** location.

```azurepowershell-interactive
## Create resource group. ##
$rg =@{
    Name = 'myResourceGroup'
    Location = 'eastus2'
}
New-AzResourceGroup @rg

```

## Create a virtual machine

Create a virtual machine with [New-AzVM](/powershell/module/az.compute/new-azvm). 

The following command creates a Windows Server virtual machine. When prompted, provide a username and password to be used as the credentials for the virtual machine:

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

## Change private IP address to static

In this section, you'll change the private IP address from **dynamic** to **static** for the virtual machine you created previously. 

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to place the virtual network configuration into a variable. Use [Get-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/get-azvirtualnetworksubnetconfig) to place the subnet configuration into a variable. Use [Get-AzNetworkInterface](/powershell/module/az.network/get-aznetworkinterface) to obtain the network interface configuration and place into a variable. Use [Set-AzNetworkInterfaceIpConfig](/powershell/module/az.network/set-aznetworkinterfaceipconfig) to set the configuration of the network interface. Finally, use [Set-AzNetworkInterface](/powershell/module/az.network/set-aznetworkinterface) to set the configuration for the virtual machine.

The following command changes the private IP address of the virtual machine to static:

```azurepowershell-interactive
## Place virtual network configuration into a variable. ##
$net = @{
    Name = 'myVM'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Place subnet configuration into a variable. ##
$sub = @{
    Name = 'myVM'
    VirtualNetwork = $vnet
}
$subnet = Get-AzVirtualNetworkSubnetConfig @sub

## Get name of network interface and place into a variable ##
$int1 = @{
    Name = 'myVM'
    ResourceGroupName = 'myResourceGroup'
}
$vm = Get-AzVM @int1

## Place network interface configuration into a variable. ##
$nic = Get-AzNetworkInterface -ResourceId $vm.NetworkProfile.NetworkInterfaces.Id

## Set interface configuration. ##
$config =@{
    Name = 'myVM'
    PrivateIpAddress = '192.168.1.4'
    Subnet = $subnet
}
$nic | Set-AzNetworkInterfaceIpConfig @config -Primary

## Save interface configuration. ##
$nic | Set-AzNetworkInterface
```

> [!WARNING]
> From within the operating system of a VM, you shouldn't statically assign the *private* IP that's assigned to the Azure VM. Only do static assignment of a private IP when it's necessary, such as when [assigning many IP addresses to VMs](virtual-network-multiple-ip-addresses-portal.md). 
>
>If you manually set the private IP address within the operating system, make sure it matches the private IP address assigned to the Azure [network interface](virtual-network-network-interface-addresses.md#change-ip-address-settings). Otherwise, you can lose connectivity to the VM. Learn more about [private IP address](virtual-network-network-interface-addresses.md#private) settings.

## Clean up resources

When no longer needed, you can use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources it contains:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Next steps

- Learn more about [public IP addresses](public-ip-addresses.md#public-ip-addresses) in Azure.
- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).
- Learn more about [private IP addresses](private-ip-addresses.md) and assigning a [static private IP address](virtual-network-network-interface-addresses.md#add-ip-addresses) to an Azure virtual machine.
- Learn more about creating [Linux](../../virtual-machines/windows/tutorial-manage-vm.md) and [Windows](../../virtual-machines/windows/tutorial-manage-vm.md) virtual machines.
