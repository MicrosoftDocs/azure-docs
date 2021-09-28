---
title: Create a public IP - Azure PowerShell
titleSuffix: Azure Virtual Network
description: Learn how to create a public IP using Azure PowerShell
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.date: 05/03/2021
ms.author: allensu

---
# Create a public IP address using Azure PowerShell

This article shows you how to create a public IP address resource using Azure PowerShell. 

For more information on resources that support public IPs, see [Public IP addresses](./public-ip-addresses.md).
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
## Create standard SKU public IP with zones

In this section, you'll create a public IP with zones. Public IP addresses can be zone-redundant or zonal.

### Zone redundant

>[!NOTE]
>The following command works for Az.Network module version 4.5.0 or later.  For more information about the Powershell modules currently being used, please refer to the [PowerShellGet documentation](/powershell/module/powershellget/).

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a standard zone-redundant public IPv4 address named **myStandardZRPublicIP** in **myResourceGroup**. 

To create an IPv6 address, modify the **version** parameter to **IPv6**.

```azurepowershell-interactive
$ip = @{
    Name = 'myStandardZRPublicIP'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
New-AzPublicIpAddress @ip
```
> [!IMPORTANT]
> For Az.Network modules older than 4.5.0, run the command above without specifying a zone parameter to create a zone-redundant IP address. 
>

### Zonal

To create a standard zonal public IPv4 address in Zone 2 named **myStandardZonalPublicIP** in **myResourceGroup**, use the following command.

To create an IPv6 address, modify the **version** parameter to **IPv6**.

```azurepowershell-interactive
$ip = @{
    Name = 'myStandardZonalPublicIP'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Zone = 2
}
New-AzPublicIpAddress @ip
```
>[!NOTE]
>The above options for zones are only valid selections in regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

## Create standard public IP without zones

In this section, you'll create a non-zonal IP address.  

>[!NOTE]
>The following command works for Az.Network module version 4.5.0 or later.  For more information about the Powershell modules currently being used, please refer to the [PowerShellGet documentation](/powershell/module/powershellget/).

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a standard public IPv4 address as a non-zonal resource named **myStandardPublicIP** in **myResourceGroup**. 

To create an IPv6 address, modify the **version** parameter to **IPv6**.

```azurepowershell-interactive
$ip = @{
    Name = 'myStandardPublicIP'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
}
New-AzPublicIpAddress @ip
```
The removal of the **zone** parameter in the command is valid in all regions.  

The removal of the **zone** parameter is the default selection for standard public IP addresses in regions without [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

## Create a basic public IP

In this section, you'll create a basic IP. Basic public IPs don't support availability zones.

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a basic static public IPv4 address named **myBasicPublicIP** in **myResourceGroup**.  

To create an IPv6 address, modify the **version** parameter to **IPv6**. 

```azurepowershell-interactive
$ip = @{
    Name = 'myStandardPublicIP'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Basic'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
}
New-AzPublicIpAddress @ip
```
If it's acceptable for the IP address to change over time, **Dynamic** IP assignment can be selected by changing the AllocationMethod to **Dynamic**. 

>[!NOTE]
> A basic IPv6 address must always be 'Dynamic'.

## Routing Preference and tier

Standard SKU static public IPv4 addresses support Routing Preference or the Global Tier feature.

### Routing preference

By default, the routing preference for public IP addresses is set to "Microsoft network", which delivers traffic over Microsoft's global wide area network to the user.  

The selection of **Internet** minimizes travel on Microsoft's network, instead using the transit ISP network to deliver traffic at a cost-optimized rate.  

For more information on routing preference, see [What is routing preference (preview)?](./routing-preference-overview.md).

The command creates a new standard zone-redundant public IPv4 address with a routing preference of type **Internet**:

```azurepowershell-interactive
## Create IP tag for Internet and Routing Preference. ##
$tag = ${
    IpTagType = 'RoutingPreference'
    Tag = 'Internet'   
}
$ipTag = New-AzPublicIpTag @tag

## Create IP. ##
$ip = @{
    Name = 'myStandardPublicIP'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    IpTag = $ipTag
    Zone = 1,2,3   
}
New-AzPublicIpAddress @ip
```
### Tier

Public IP addresses are associated with a single region. The **Global** tier spans an IP address across multiple regions. **Global** tier is required for the frontends of cross-region load balancers.  

For more information, see [Cross-region load balancer](../load-balancer/cross-region-overview.md).

The following command creates a global IPv4 address. This address can be associated with the frontend of a cross-region load balancer.

```azurepowershell-interactive
$ip = @{
    Name = 'myStandardPublicIP-Global'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Tier = 'Global'
}
New-AzPublicIpAddress @ip
```
>[!NOTE]
>Global tier addresses don't support Availability Zones.

## Additional information 

For more information on the individual parameters listed in this how-to, see [Manage public IP addresses](./virtual-network-public-ip-address.md#create-a-public-ip-address).

## Next steps
- Associate a [public IP address to a Virtual Machine](./associate-public-ip-address-vm.md#azure-portal)
- Learn more about [public IP addresses](./public-ip-addresses.md#public-ip-addresses) in Azure.
- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).
