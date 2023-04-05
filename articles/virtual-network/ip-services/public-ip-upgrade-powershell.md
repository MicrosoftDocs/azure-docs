---
title: 'Upgrade a public IP address - Azure PowerShell'
description: In this article, you learn how to upgrade a basic SKU public IP address using Azure PowerShell.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 10/28/2022
ms.custom: template-how-to, engagement-fy23, devx-track-azurepowershell
---

# Upgrade a public IP address using Azure PowerShell

Azure public IP addresses are created with a SKU, either Basic or Standard. The SKU determines their functionality including allocation method, feature support, and resources they can be associated with. 

In this article, you'll learn how to upgrade a static Basic SKU public IP address to Standard SKU using Azure PowerShell.

## Prerequisites

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A **static** basic SKU public IP address in your subscription. For more information, see [Create a basic public IP address using PowerShell](./create-public-ip-powershell.md?tabs=create-public-ip-basic%2Ccreate-public-ip-non-zonal%2Crouting-preference#create-public-ip).
* Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Upgrade public IP address

In this section, you'll use the Azure CLI to upgrade your static Basic SKU public IP to the Standard SKU.

In order to upgrade a public IP, it must not be associated with any resource. For more information, see [View, modify settings for, or delete a public IP address](./virtual-network-public-ip-address.md#view-modify-settings-for-or-delete-a-public-ip-address) to learn how to disassociate a public IP.

>[!IMPORTANT]
>Public IPs upgraded from Basic to Standard SKU continue to have no [availability zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).  This means they cannot be associated with an Azure resource that is either zone-redundant or tied to a pre-specified zone in regions where this is offered.

```azurepowershell-interactive
### Place the public IP address into a variable. ###
$ip = @{
    Name = 'myBasicPublicIP'
    ResourceGroupName = 'myResourceGroup'
}
$pubIP = Get-AzPublicIpAddress @ip

### Set the SKU to standard. ###
$pubIP.Sku.Name = 'Standard'
Set-AzPublicIpAddress -PublicIpAddress $pubIP

```
> [!NOTE]
> The basic public IP you are upgrading must have static assignment. You'll receive a warning that the IP can't be upgraded if you try to upgrade a dynamically allocated IP address. Change the IP address assignment to static before upgrading.

> [!WARNING]
> Upgrading a basic public IP to standard SKU can't be reversed. Public IPs upgraded from basic to standard SKU continue to have no guaranteed [availability zones](../../availability-zones/az-overview.md#availability-zones).

## Verify upgrade

In this section, you'll verify the public IP address is now the standard SKU.

```azurepowershell-interactive
### Place the public IP address into a variable. ###
$ip = @{
    Name = 'myBasicPublicIP'
    ResourceGroupName = 'myResourceGroup'
}
$pubIP = Get-AzPublicIpAddress @ip

### Display setting. ####
$pubIP.Sku.Name
```
The command should display **Standard**.

## Next steps

In this article, you upgraded a basic SKU public IP address to standard SKU.

For more information on public IP addresses in Azure, see:

- [Public IP addresses in Azure](public-ip-addresses.md)
- [Create a public IP address using PowerShell](./create-public-ip-powershell.md)
