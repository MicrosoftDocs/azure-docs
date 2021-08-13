---
title: Upgrade a public IP address - Azure PowerShell
description: In this article, learn how to upgrade a basic SKU public IP address using Azure PowerShell.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 05/20/2021
ms.custom: template-how-to 
---

# Upgrade a public IP address using Azure PowerShell

Azure public IP addresses are created with a SKU, either basic or standard. The SKU determines their functionality including allocation method, feature support, and resources they can be associated with. 

In this article, you'll learn how to upgrade a static basic SKU public IP address to standard SKU using Azure PowerShell.

## Prerequisites

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
* A **static** basic SKU public IP address in your subscription. For more information, see [Create public IP address - Azure portal](create-public-ip-portal.md#create-a-basic-sku-public-ip-address).
* Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Upgrade public IP address

In this section, you'll use the Azure CLI to upgrade your static basic SKU public IP to the standard SKU.

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
> The basic public IP you are upgrading must have the static allocation type. You'll receive a warning that the IP can't be upgraded if you try to upgrade a dynamically allocated IP address.

> [!WARNING]
> Upgrading a basic public IP to standard SKU can't be reversed. Public IPs upgraded from basic to standard SKU continue to have no guaranteed [availability zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

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
- [Create a public IP - Azure portal](create-public-ip-portal.md)

