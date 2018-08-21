---
title: Create, change, or delete an Azure public IP address prefix | Microsoft Docs
description: Learn how to create, change, or delete a public IP address prefix.
services: virtual-network
documentationcenter: na
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/12/2018
ms.author: jdial

---

# Create, change, or delete a public IP address prefix

Learn about a public IP address prefix and how to create, change, and delete one. A public IP address prefix enables you to specify how many public IP addresses you require. Azure allocates a contiguous range of addresses to your subscription, based on how many you specify. The addresses aren't assigned to any other subscription. When you create a public IP address resource, you can assign a static public IP address from the prefix. If you're not familiar with public IP address prefixes, see [Public IP address prefix overview](public-ip-address-prefix.md)

## Before you begin

Complete the following tasks before completing steps in any section of this article:

- If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using the portal, open https://portal.azure.com, and log in with your Azure account.
- If using PowerShell commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or by running PowerShell from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. This tutorial requires the AzureRm.Network PowerShell module version 6.3.1 or later. Run `Get-Module -ListAvailable AzureRM.Network` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](https://github.com/Azure/azure-powershell/releases/tag/AzureRm.Network.6.3.1). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.
- If using Azure Command-line interface (CLI) commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/bash), or by running the CLI from your computer. This tutorial requires the Azure CLI version 2.0.41 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). If you are running the Azure CLI locally, you also need to run `az login` to create a connection with Azure.

The account you log into, or connect to Azure with, must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned the appropriate actions listed in [Permissions](#permissions).

Public IP address prefixes have a charge. For details, see [pricing](https://azure.microsoft.com/pricing/details/ip-addresses).

## Create a public IP address prefix

1. At the top, left corner of the portal, select **+ Create a resource**.
2. Enter *public ip address prefix* in the *Search the Marketplace* box. When **Public IP address prefix** appears in the search results, select it.
3. Under **Public IP address prefix**, select **Create**.
4. Enter, or select values for the following settings, under **Create public IP address prefix**, then select **Create**:

	|Setting|Required?|Details|
	|---|---|---|
    |Name|Yes|The name must be unique within the resource group you select.|
    |Prefix|Yes| The prefix.
	|Subscription|Yes|Must exist in the same [subscription](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription) as the resource you want to associate the public IP address to.|
	|Resource group|Yes|Can exist in the same, or different, [resource group](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-group) as the resource you want to associate the public IP address to.|
	|Location|Yes|Must exist in the same [location](https://azure.microsoft.com/regions), also referred to as region, as the public IP addresses you'll assign addresses from the range to.|

**Commands**


|Tool|Command|
|---|---|
|CLI|[az network public-ip-prefix create](/cli/azure/network/public-ip-prefix#az-network-public-ip-prefix-create)|
|PowerShell|[New-AzureRmPublicIpAddressPrefix](/powershell/module/azurerm.network/new-azurermpublicipaddressprefix)|

## View, change settings for, or delete a prefix

1. In the box that contains the text *Search resources* at the top of the Azure portal, type *public ip address prefix*. When **Public IP address prefixes** appear in the search results, select it.
2. Select the name of the public IP address prefix that you want to view, change settings for, or delete from the list.
3. Complete one of the following options, depending on whether you want to view, delete, or change the public IP address prefix.
	- **View**: The **Overview** section shows key settings for the public IP address prefix, such as prefix.
	- **Delete**: To delete the public IP address prefix, select **Delete** in the **Overview** section. If addresses within the prefix are assigned to public IP address resources, you must first delete the public IP address resources. See [delete a public IP address](virtual-network-public-ip-address.md#view-change-settings-for-or-delete-a-public-ip-address).
	- **Change**: select **Configuration**. Change settings using the information in step 4 of [Create a public IP address prefix](#create-a-public-ip-address-prefix).

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network public-ip-prefix list](/cli/azure/network/public-ip-prefix#az-network-public-ip-prefix-list) to list public IP addresses, [az network public-ip-prefix show](/cli/azure/network/public-ip#az-network-public-ip-prefix-show) to show settings; [az network public-ip-prefix update](/cli/azure/network/public-ip-prefix#az-network-public-ip-prefix-update) to update; [az network public-ip-prefix delete](/cli/azure/network/public-ip#az-network-public-ip-prefix-delete) to delete|
|PowerShell|[Get-AzureRmPublicIpAddressPrefix](/powershell/module/azurerm.network/get-azurermpublicipaddressprefix) to retrieve a public IP address object and view its settings, [Set-AzureRmPublicIpAddressPrefix](/powershell/module/azurerm.network/set-azurermpublicipaddressprefix) to update settings; [Remove-AzureRmPublicIpAddressPrefix](/powershell/module/azurerm.network/remove-azurermpublicipaddressprefix) to delete|

## Permissions

To perform tasks on public IP address prefixes, your account must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) role that is assigned the appropriate actions listed in the following table:

| Action                                                                   | Name                                                           |
| ---------                                                                | -------------                                                  |
| Microsoft.Network/publicIPAddressPrefixes/read                           | Read a public IP address prefix                                |
| Microsoft.Network/publicIPAddressPrefixes/write                          | Create or update a public IP address prefix                    |
| Microsoft.Network/publicIPAddressPrefixes/delete                         | Delete a public IP address prefix                              |

## Next steps

- Create a public IP address prefix using [PowerShell](powershell-samples.md) or [Azure CLI](cli-samples.md) sample scripts, or using Azure [Resource Manager templates](template-samples.md)
- Create and apply [Azure policy](policy-samples.md) for public IP address prefixes
- [Create](virtual-network-public-ip-address.md#view-change-settings-for-or-delete-a-public-ip-address) a public IP address
