---
title: Create a public IP - Azure PowerShell
description: Learn how to create a public IP using Azure PowerShell
services: virtual-network
documentationcenter: na
author: blehr
ms.service: virtual-network
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/28/2020
ms.author: blehr

---
# Quickstart: Create a public IP address using Azure PowerShell

This article shows you how to create a public IP address resource using Azure PowerShell. For more information on which resources this can be associated to, the difference between Basic and Standard SKU, and other related information, please see [Public IP addresses](https://docs.microsoft.com/azure/virtual-network/public-ip-addresses).  For this example, we will focus on IPv4 addresses only; for more information on IPv6 addresses, see [IPv6 for Azure VNet](https://docs.microsoft.com/azure/virtual-network/ipv6-overview).

## Prerequisites

- Azure PowerShell installed locally or Azure Cloud Shell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) named **myResourceGroup** in the **eastus2** location.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'myResourceGroup'
$loc = 'eastus2'

New-AzResourceGroup -Name $rg -Location $loc
```
---
# [**Standard SKU - Using zones**](#tab/option-create-public-ip-standard-zones)

>[!NOTE]
>The following command works for API version 2020-08-01 or later.  For more information about the API version currently being used, please refer to [Resource Providers and Types](https://docs.microsoft.com/azure/azure-resource-manager/management/resource-providers-and-types).

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a standard zone-redundant public IP address named **myStandardZRPublicIP** in **myResourceGroup**.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'myResourceGroup'
$loc = 'eastus2'
$pubIP = 'myStandardZRPublicIP'
$sku = 'Standard'
$alloc = 'Static'
$zone = 1,2,3

New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $alloc -SKU $sku -zone $zone
```
> [!IMPORTANT]
> For versions of the API older than 2020-08-01, run the command above without specifying a zone parameter to create a zone-redundant IP address. 
>

In order to create a standard zonal public IP address in Zone 2 named **myStandardZonalPublicIP** in **myResourceGroup**, use the following command:

```azurepowershell-interactive
## Variables for the command ##
$rg = 'myResourceGroup'
$loc = 'eastus2'
$pubIP = 'myStandardZonalPublicIP'
$sku = 'Standard'
$alloc = 'Static'
$zone = 2

New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $alloc -SKU $sku -zone $zone
```

Note that the above options for zones are only valid selections in regions with [Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview?toc=/azure/virtual-network/toc.json#availability-zones).

# [**Standard SKU - No zones**](#tab/option-create-public-ip-standard)

>[!NOTE]
>The following command works for API version 2020-08-01 or later.  For more information about the API version currently being used, please refer to [Resource Providers and Types](https://docs.microsoft.com/azure/azure-resource-manager/management/resource-providers-and-types).

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a standard public IP address as a non-zonal resource named **myStandardPublicIP** in **myResourceGroup**.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'myResourceGroup'
$loc = 'eastus2'
$pubIP = 'myStandardPublicIP'
$sku = 'Standard'
$alloc = 'Static'

New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $alloc -SKU $sku
```

This selection is valid in all regions and is the default selection for Standard Public IP addresses in regions without [Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview?toc=/azure/virtual-network/toc.json#availability-zones).

# [**Basic SKU**](#tab/option-create-public-ip-basic)

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a basic static public IP address named **myBasicPublicIP** in **myResourceGroup**.  Basic Public IPs do not have the concept of availability zones.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'myResourceGroup'
$loc = 'eastus2'
$pubIP = 'myBasicPublicIP'
$sku = 'Basic'
$alloc = 'Static'

New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $alloc -SKU $sku
```
If it is acceptable for the IP address to change over time, **Dynamic** IP assignment can be selected by changing the AllocationMethod to 'Dynamic'.

---

## Additional information 

For more details on the individual variables listed above, please see [Manage public IP addresses](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address#create-a-public-ip-address).

## Next steps
- Associate a [public IP address to a Virtual Machine](https://docs.microsoft.com/azure/virtual-network/associate-public-ip-address-vm#azure-portal)
- Learn more about [public IP addresses](virtual-network-ip-addresses-overview-arm.md#public-ip-addresses) in Azure.
- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).
