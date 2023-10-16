---
title: 'Quickstart: Create a public IP - PowerShell'
titleSuffix: Azure Virtual Network
description: In this quickstart, learn how to create a public IP using Azure PowerShell
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: quickstart
ms.date: 08/24/2023
ms.custom: mode-api, devx-track-azurepowershell
---

# Quickstart: Create a public IP address using PowerShell

In this quickstart, you learn how to create an Azure public IP address. Public IP addresses in Azure are used for public connections to Azure resources. Public IP addresses are available in two SKUs: basic, and standard. Two tiers of public IP addresses are available: regional, and global. The routing preference of a public IP address is set when created. Internet routing and Microsoft Network routing are the available choices.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group
An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) named **QuickStartCreateIP-rg** in the **eastus2** location.

```azurepowershell-interactive
$rg =@{
    Name = 'QuickStartCreateIP-rg'
    Location = 'eastus2'
}
New-AzResourceGroup @rg
```
## Create public IP

# [**Standard SKU**](#tab/create-public-ip-standard)

>[!NOTE]
>Standard SKU public IP is recommended for production workloads.  For more information about SKUs, see **[Public IP addresses](public-ip-addresses.md)**.
>
>The following command works for Az.Network module version 4.5.0 or later.  For more information about the PowerShell modules currently being used, please refer to the [PowerShellGet documentation](/powershell/module/powershellget/).

In this section, you create a public IP with zones. Public IP addresses can be zone-redundant or zonal.

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a standard zone-redundant public IPv4 address named **myStandardPublicIP** in **QuickStartCreateIP-rg**. 

To create an IPv6 address, modify the **`--IpAddressVersion`** parameter to **IPv6**.

```azurepowershell-interactive
$ip = @{
    Name = 'myStandardPublicIP'
    ResourceGroupName = 'QuickStartCreateIP-rg'
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

# [**Basic SKU**](#tab/create-public-ip-basic)

>[!NOTE]
>Standard SKU public IP is recommended for production workloads.  For more information about SKUs, see **[Public IP addresses](public-ip-addresses.md)**.

In this section, you create a basic IP. Basic public IPs don't support availability zones.

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a basic static public IPv4 address named **myBasicPublicIP** in **QuickStartCreateIP-rg**.  

To create an IPv6 address, modify the **`--IpAddressVersion`** parameter to **IPv6**. 

```azurepowershell-interactive
$ip = @{
    Name = 'myBasicPublicIP'
    ResourceGroupName = 'QuickStartCreateIP-rg'
    Location = 'eastus2'
    Sku = 'Basic'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
}
New-AzPublicIpAddress @ip
```
If it's acceptable for the IP address to change over time, **Dynamic** IP assignment can be selected by changing the **`-AllocationMethod`** to **Dynamic**. 

>[!NOTE]
> A basic IPv6 address must always be 'Dynamic'.

---

## Create a zonal or no-zone public IP address

In this section, you learn how to create a zonal or no-zone public IP address.

# [**Zonal**](#tab/create-public-ip-zonal)

To create a standard zonal public IPv4 address in Zone 2 named **myStandardPublicIP-zonal** in **QuickStartCreateIP-rg**, use the following command.

To create an IPv6 address, modify the **`--IpAddressVersion`** parameter to **IPv6**.

```azurepowershell-interactive
$ip = @{
    Name = 'myStandardPublicIP-zonal'
    ResourceGroupName = 'QuickStartCreateIP-rg'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Zone = 2
}
New-AzPublicIpAddress @ip
```
>[!NOTE]
>The above options for zones are only valid selections in regions with [Availability Zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

# [**Non-zonal**](#tab/create-public-ip-non-zonal)

In this section, you create a non-zonal IP address.  

>[!NOTE]
>The following command works for Az.Network module version 4.5.0 or later.  For more information about the PowerShell modules currently being used, please refer to the [PowerShellGet documentation](/powershell/module/powershellget/).

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a standard public IPv4 address as a non-zonal resource named **myStandardPublicIP-nozone** in **QuickStartCreateIP-rg**. 

To create an IPv6 address, modify the **`-IpAddressVersion`** parameter to **IPv6**.

```azurepowershell-interactive
$ip = @{
    Name = 'myStandardPublicIP-nozone'
    ResourceGroupName = 'QuickStartCreateIP-rg'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
}
New-AzPublicIpAddress @ip
```
The removal of the **`-Zone`** parameter in the command is valid in all regions.  

The removal of the **`-Zone`** parameter is the default selection for standard public IP addresses in regions without [Availability Zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

---

## Routing Preference and Tier

Standard SKU static public IPv4 addresses support Routing Preference or the Global Tier feature.

# [**Routing Preference**](#tab/routing-preference)

By default, the routing preference for public IP addresses is set to **Microsoft network**, which delivers traffic over Microsoft's global wide area network to the user.  

The selection of **Internet** minimizes travel on Microsoft's network, instead using the transit ISP network to deliver traffic at a cost-optimized rate.  

For more information on routing preference, see [What is routing preference (preview)?](routing-preference-overview.md).

The command creates a new standard zone-redundant public IPv4 address with a routing preference of type **Internet**:

```azurepowershell-interactive
## Create IP tag for Internet and Routing Preference. ##
$tag = @{
    IpTagType = 'RoutingPreference'
    Tag = 'Internet'   
}
$ipTag = New-AzPublicIpTag @tag

## Create IP. ##
$ip = @{
    Name = 'myStandardPublicIP-RP'
    ResourceGroupName = 'QuickStartCreateIP-rg'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    IpTag = $ipTag
    Zone = 1,2,3   
}
New-AzPublicIpAddress @ip
```

# [**Tier**](#tab/tier)

Public IP addresses are associated with a single region. The **Global** tier spans an IP address across multiple regions. **Global** tier is required for the frontends of cross-region load balancers.  

For more information, see [Cross-region load balancer](../../load-balancer/cross-region-overview.md).

The following command creates a global IPv4 address. This address can be associated with the frontend of a cross-region load balancer.

```azurepowershell-interactive
$ip = @{
    Name = 'myStandardPublicIP-Global'
    ResourceGroupName = 'QuickStartCreateIP-rg'
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

---

## Clean up resources

When you're done with the virtual machine and public IP address, delete the resource group and all of the resources it contains with [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup).

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'TutorVMRoutePref-rg'

```

## Next steps

Advance to the next article to learn how to create a public IP prefix:
> [!div class="nextstepaction"]
> [Create public IP prefix using PowerShell](create-public-ip-prefix-powershell.md)
