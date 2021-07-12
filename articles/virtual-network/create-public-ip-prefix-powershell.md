---
title: Create a public IP address prefix - PowerShell
titlesuffix: Azure Virtual Network
description: Learn how to create a public IP address prefix using PowerShell.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 07/09/2021
ms.author: allensu
---

# Create a public IP address prefix using PowerShell

Learn about a public IP address prefix and how to create, change, and delete one. A public IP address prefix is a contiguous range of standard SKU public IP addresses. 

When you create a public IP address resource, you can assign a static public IP address from the prefix and associate the address to virtual machines, load balancers, or other resources. For more information, see [Public IP address prefix overview](public-ip-address-prefix.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

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

## Create a public IP address prefix

In this section, you'll create a public IP prefix using Azure PowerShell.  

Create a public IP prefix with [New-AzPublicIpPrefix](/powershell/module/az.network/new-azpublicipprefix) named **myPublicIpPrefix** in the **eastus2** location.

### IPv4 prefix

To create a IPv4 public IP prefix, enter **IPv4** in the **--IpAddressVersion** parameter.

```azurepowershell-interactive
$ipv4 =@{
    Name = 'myPublicIpPrefix'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    PrefixLength = '28'
    IpAddressVersion = 'IPv4' 
}
New-AzPublicIpPrefix @ipv4
```

### IPv6 prefix

To create a IPv4 public IP prefix, enter **IPv6** in the **--IpAddressVersion** parameter.

```azurepowershell-interactive
$ipv6 =@{
    Name = 'myPublicIpPrefix'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    PrefixLength = '124'
    IpAddressVersion = 'IPv6' 
}
New-AzPublicIpPrefix @ipv6
```

## Create a static public IP address from a prefix

Once you create a prefix, you must create static IP addresses from the prefix. In this section, you'll create a static IP address from the prefix you created earlier.

Create a public IP address with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) in the **myPublicIpPrefix** created earlier.

### IPv4 address

To create a IPv4 public IP address, enter **IPv4** in the **--IpAddressVersion** parameter.

```azurepowershell-interactive
$ipv4 =@{
    Name = 'myPublicIpAddress'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    Tier = 'Regional'
    IpAddressVersion = 'IPv4'
    PublicIpPrefix = 'myPublicIpPrefix'
}
New-AzPublicIpAddress @ipv4
```

### IPv6 address

To create a IPv6 public IP prefix, enter **IPv6** in the **--IpAddressVersion** parameter.


```azurepowershell-interactive
$ipv6 =@{
    Name = 'myPublicIpAddress'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    Tier = 'Regional'
    IpAddressVersion = 'IPv6'
    PublicIpPrefix = 'myPublicIpPrefix'
}
New-AzPublicIpAddress @ipv6
```

>[!NOTE]
>Only static public IP addresses created with the standard SKU can be assigned from the prefix's range. To learn more about public IP address SKUs, see [public IP address](./public-ip-addresses.md#public-ip-addresses).


## Delete a prefix

In this section, you'll learn how to delete a prefix.

To delete a public IP prefix, use [Remove-AzPublicIpPrefix](/powershell/module/az.network/remove-azpublicipprefix).

```azurepowershell-interactive
$pr =@{
    Name = 'myPublicIpPrefix'
    ResourceGroupName = 'myResourceGroup'
}
Remove-AzPublicIpPrefix @pr
```

>[!NOTE]
>If addresses within the prefix are associated to public IP address resources, you must first delete the public IP address resources. See [delete a public IP address](virtual-network-public-ip-address.md#view-modify-settings-for-or-delete-a-public-ip-address).

## Clean up resources

In this article, you created a public IP prefix and a public IP from that prefix. 

When you're done with the public IP prefix, delete the resource group and all of the resources it contains:

```azurepowershell-interactive
Remove-AzResourceGroup -ResourceGroupName 'myResourceGroup'
```

## Next steps

- Learn about scenarios and benefits of using a [public IP prefix](public-ip-address-prefix.md)
