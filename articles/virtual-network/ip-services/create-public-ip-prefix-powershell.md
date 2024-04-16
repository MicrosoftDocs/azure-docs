---
title: 'Quickstart: Create a public IP address prefix - PowerShell'
titleSuffix: Azure Virtual Network
description: Learn how to create a public IP address prefix using PowerShell.
services: virtual-network
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: quickstart
ms.date: 08/24/2023
ms.custom: mode-api, devx-track-azurepowershell
---

# Quickstart: Create a public IP address prefix using PowerShell

Learn about a public IP address prefix and how to create, change, and delete one. A public IP address prefix is a contiguous range of standard SKU public IP addresses. 

When you create a public IP address resource, you can assign a static public IP address from the prefix and associate the address to virtual machines, load balancers, or other resources. For more information, see [Public IP address prefix overview](public-ip-address-prefix.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) named **QuickStartCreateIPPrefix-rg** in the **eastus2** location.

```azurepowershell-interactive
$rg =@{
    Name = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
}
New-AzResourceGroup @rg
```

## Create a public IP address prefix

In this section, you create a zone redundant, zonal, and non-zonal public IP prefix using Azure PowerShell. 

The prefixes in the examples are:

* **IPv4** - /28 (16 addresses)

* **IPv6** - /124 (16 addresses)

For more information on available prefix sizes, see [Prefix sizes](public-ip-address-prefix.md#prefix-sizes).

Create a public IP prefix with [New-AzPublicIpPrefix](/powershell/module/az.network/new-azpublicipprefix) named **myPublicIpPrefix** in the **eastus2** location.

## IPv4

# [**Zone redundant IPv4 prefix**](#tab/ipv4-zone-redundant)

To create a IPv4 public IP prefix, enter **IPv4** in the **`-IpAddressVersion`** parameter. To create a zone redundant IPv4 prefix, enter **1,2,3** in the **`-Zone`** parameter.

```azurepowershell-interactive
$ipv4 =@{
    Name = 'myPublicIpPrefix'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
    PrefixLength = '28'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
New-AzPublicIpPrefix @ipv4
```

# [**Zonal IPv4 prefix**](#tab/ipv4-zonal)

To create a IPv4 public IP prefix, enter **IPv4** in the **`-IpAddressVersion`** parameter. Enter **2** in the **`-Zone`** parameter to create a zonal IP prefix in zone 2.

```azurepowershell-interactive
$ipv4 =@{
    Name = 'myPublicIpPrefix-zonal'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
    PrefixLength = '28'
    IpAddressVersion = 'IPv4'
    Zone = 2
}
New-AzPublicIpPrefix @ipv4
```

>[!NOTE]
>The above options for zones are only valid selections in regions with [Availability Zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

# [**Non-zonal IPv4 prefix**](#tab/ipv4-non-zonal)

To create a IPv4 public IP prefix, enter **IPv4** in the **`-IpAddressVersion`** parameter. Remove the **`-Zone`** parameter to create a non-zonal IP prefix.

```azurepowershell-interactive
$ipv4 =@{
    Name = 'myPublicIpPrefix-nozone'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
    PrefixLength = '28'
    IpAddressVersion = 'IPv4'
}
New-AzPublicIpPrefix @ipv4
```

The removal of the **`-Zone`** parameter in the command is valid in all regions.  

The removal of the **`-Zone`** parameter is the default selection for standard public IP addresses in regions without [Availability Zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

# [**Routing Preference Internet IPv4 prefix**](#tab/ipv4-routing-pref)

To create a IPv4 public IP prefix with routing preference Internet, create an **IpTag** with an **ipTagType** 'Routing Preference' and **Tag** 'Internet'.

```azurepowershell-interactive
$tagproperty = @{
IpTagType = 'RoutingPreference'
Tag = 'Internet'
}
$routingprefinternettag = New-Object -TypeName Microsoft.Azure.Commands.Network.Models.PSPublicIpPrefixTag -Property $tagproperty 
$ipv4 =@{
    Name = 'myPublicIpPrefix-routingprefinternet'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
    PrefixLength = '28'
    IpAddressVersion = 'IPv4'
    IpTag = $routingprefinternettag
}
New-AzPublicIpPrefix @ipv4
```
---

## IPv6

# [**Zone redundant IPv6 prefix**](#tab/ipv6-zone-redundant)

To create a IPv4 public IP prefix, enter **IPv6** in the **`-IpAddressVersion`** parameter. To create a zone redundant IPv6 prefix, enter **1,2,3** in the **`-Zone`** parameter.

```azurepowershell-interactive
$ipv6 =@{
    Name = 'myPublicIpPrefix'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
    PrefixLength = '124'
    IpAddressVersion = 'IPv6'
    Zone = 1,2,3
}
New-AzPublicIpPrefix @ipv6
```

# [**Zonal IPv6 prefix**](#tab/ipv6-zonal)

To create a IPv6 public IP prefix, enter **IPv6** in the **`-IpAddressVersion`** parameter. Enter **2** in the **`-Zone`** parameter to create a zonal IP prefix in zone 2.

```azurepowershell-interactive
$ipv6 =@{
    Name = 'myPublicIpPrefix-zonal'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
    PrefixLength = '124'
    IpAddressVersion = 'IPv6'
    Zone = 2
}
New-AzPublicIpPrefix @ipv6
```

>[!NOTE]
>The above options for zones are only valid selections in regions with [Availability Zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

# [**Non-zonal IPv6 prefix**](#tab/ipv6-non-zonal)

To create a IPv6 public IP prefix, enter **IPv6** in the **`-IpAddressVersion`** parameter. Remove the **`-Zone`** parameter to create a non-zonal IP prefix.

```azurepowershell-interactive
$ipv6 =@{
    Name = 'myPublicIpPrefix-nozone'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
    PrefixLength = '124'
    IpAddressVersion = 'IPv6'
}
New-AzPublicIpPrefix @ipv6
```

The removal of the **`-Zone`** parameter in the command is valid in all regions.  

The removal of the **`-Zone`** parameter is the default selection for standard public IP addresses in regions without [Availability Zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

---

## Create a static public IP address from a prefix

Once you create a prefix, you must create static IP addresses from the prefix. In this section, you create a static IP address from the prefix you created earlier.

Create a public IP address with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) in the **myPublicIpPrefix** prefix.

# [**IPv4 address**](#tab/ipv4-address)

To create a IPv4 public IP address, enter **IPv4** in the **`-IpAddressVersion`** parameter.

```azurepowershell-interactive
$pf =@{
    Name = 'myPublicIpPrefix'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
}
$prefix = Get-AzPublicIpPrefix @pf

$ipv4 =@{
    Name = 'myPublicIpAddress'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
    Sku = 'Standard'
    Tier = 'Regional'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    PublicIpPrefix = $prefix
}
New-AzPublicIpAddress @ipv4
```

# [**IPv6 address**](#tab/ipv6-address)

To create a IPv6 public IP address, enter **IPv6** in the **`-IpAddressVersion`** parameter.
```azurepowershell-interactive
$pf =@{
    Name = 'myPublicIpPrefix'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
}
$prefix = Get-AzPublicIpPrefix @pf

$ipv6 =@{
    Name = 'myPublicIpAddress'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
    Location = 'eastus2'
    Sku = 'Standard'
    Tier = 'Regional'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv6'
    PublicIpPrefix = $prefix
}
New-AzPublicIpAddress @ipv6
```

---

>[!NOTE]
>Only static public IP addresses created with the standard SKU can be assigned from the prefix's range. To learn more about public IP address SKUs, see [public IP address](public-ip-addresses.md#public-ip-addresses).

## Delete a prefix

In this section, you learn how to delete a prefix.

To delete a public IP prefix, use [Remove-AzPublicIpPrefix](/powershell/module/az.network/remove-azpublicipprefix).

```azurepowershell-interactive
$pr =@{
    Name = 'myPublicIpPrefix'
    ResourceGroupName = 'QuickStartCreateIPPrefix-rg'
}
Remove-AzPublicIpPrefix @pr
```

>[!NOTE]
>If addresses within the prefix are associated to public IP address resources, you must first delete the public IP address resources. See [delete a public IP address](virtual-network-public-ip-address.md#view-modify-settings-for-or-delete-a-public-ip-address).

## Clean up resources

In this article, you created a public IP prefix and a public IP from that prefix. 

When you're done with the public IP prefix, delete the resource group and all of the resources it contains:

```azurepowershell-interactive
Remove-AzResourceGroup -ResourceGroupName 'QuickStartCreateIPPrefix-rg'
```

## Next steps

Advance to the next article to learn how to create a public IP prefix using the Azure CLI:
> [!div class="nextstepaction"]
> [Create public IP using PowerShell](create-public-ip-powershell.md)
