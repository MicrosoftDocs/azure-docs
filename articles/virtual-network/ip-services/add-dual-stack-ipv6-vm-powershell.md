---
title: Add a dual-stack network to an existing virtual machine - Azure PowerShell
titleSuffix: Azure Virtual Network
description: Learn how to add a dual-stack network to an existing virtual machine using Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 08/24/2023
ms.custom: template-how-to, devx-track-azurepowershell
---

# Add a dual-stack network to an existing virtual machine using Azure PowerShell

In this article, you add IPv6 support to an existing virtual network. You configure an existing virtual machine with both IPv4 and IPv6 addresses. When completed, the existing virtual network supports private IPv6 addresses. The existing virtual machine network configuration contains a public and private IPv4 and IPv6 address. 

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

- An existing virtual network, public IP address and virtual machine in your subscription that is configured for IPv4 support only. For more information about creating a virtual network, public IP address and a virtual machine, see [Quickstart: Create a Linux virtual machine in Azure with PowerShell](../../virtual-machines/linux/quick-create-powershell.md).

    - The example virtual network used in this article is named **myVNet**. Replace this value with the name of your virtual network.
    
    - The example virtual machine used in this article is named **myVM**. Replace this value with the name of your virtual machine.
    
    - The example public IP address used in this article is named **myPublicIP**. Replace this value with the name of your public IP address.

## Add IPv6 to virtual network

In this section, you add an IPv6 address space and subnet to your existing virtual network.

Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to update the virtual network.

```azurepowershell-interactive
## Place your virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Place address space into a variable. ##
$IPAddressRange = '2404:f800:8000:122::/63'

## Add the address space to the virtual network configuration. ##
$vnet.AddressSpace.AddressPrefixes.Add($IPAddressRange)

## Save the configuration to the virtual network. ##
Set-AzVirtualNetwork -VirtualNetwork $vnet
```

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to add the new IPv6 subnet to the virtual network.

```azurepowershell-interactive
## Place your virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Create the subnet configuration. ##
$sub = @{
    Name = 'myBackendSubnet'
    AddressPrefix = '10.0.0.0/24','2404:f800:8000:122::/64'
    VirtualNetwork = $vnet
}
Set-AzVirtualNetworkSubnetConfig @sub

## Save the configuration to the virtual network. ##
Set-AzVirtualNetwork -VirtualNetwork $vnet
```

## Create IPv6 public IP address

In this section, you create a IPv6 public IP address for the virtual machine.

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create the public IP address.

```azurepowershell-interactive
$ip6 = @{
    Name = 'myPublicIP-IPv6'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv6'
    Zone = 1,2,3
}
New-AzPublicIpAddress @ip6
```
## Add IPv6 configuration to virtual machine

Use [New-AzNetworkInterfaceIpConfig](/powershell/module/az.network/new-aznetworkinterfaceipconfig) to create the IPv6 configuration for the NIC. The **`-Name`** used in the example is **myvm569**. Replace this value with the name of the network interface in your virtual machine.

```azurepowershell-interactive
## Place your virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Place your virtual network subnet into a variable. ##
$sub = @{
    Name = 'myBackendSubnet'
    VirtualNetwork = $vnet
}
$subnet = Get-AzVirtualNetworkSubnetConfig @sub

## Place the IPv6 public IP address you created previously into a variable. ##
$pip = @{
    Name = 'myPublicIP-IPv6'
    ResourceGroupName = 'myResourceGroup'
}
$publicIP = Get-AzPublicIPAddress @pip

## Place the network interface into a variable. ##
$net = @{
    Name = 'myvm569'
    ResourceGroupName = 'myResourceGroup'
}
$nic = Get-AzNetworkInterface @net

## Create the configuration for the network interface. ##
$ipc = @{
    Name = 'Ipv6config'
    Subnet = $subnet
    PublicIpAddress = $publicIP
    PrivateIpAddressVersion = 'IPv6'
}
$ipconfig = New-AzNetworkInterfaceIpConfig @ipc

## Add the IP configuration to the network interface. ##
$nic.IpConfigurations.Add($ipconfig)

## Save the configuration to the network interface. ##
$nic | Set-AzNetworkInterface
```

## Next steps

In this article, you learned how to add a dual-stack network to an existing virtual machine.

For more information about IPv6 and IP addresses in Azure, see:

- [Overview of IPv6 for Azure Virtual Network.](ipv6-overview.md)

- [What is Azure Virtual Network IP Services?](ip-services-overview.md)
