---
title: Create, change, or delete an Azure public IP address prefix
titlesuffix: Azure Virtual Network
description: Learn how to create, change, or delete a public IP address prefix.
services: virtual-network
documentationcenter: na
author: anavinahar
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/13/2019
ms.author: anavin
---

# Create, change, or delete a public IP address prefix

Learn about a public IP address prefix and how to create, change, and delete one. A public IP address prefix is a contiguous range of addresses based on the number of public IP addresses you specify. The addresses are assigned to your subscription. When you create a public IP address resource, you can assign a static public IP address from the prefix and associate the address to virtual machines, load balancers, or other resources, to enable internet connectivity. If you're not familiar with public IP address prefixes, see [Public IP address prefix overview](public-ip-address-prefix.md)

## Before you begin

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Complete the following tasks before completing steps in any section of this article:

- If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using the portal, open https://portal.azure.com, and log in with your Azure account.
- If using PowerShell commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or by running PowerShell from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. This tutorial requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.
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
   |Subscription|Yes|Must exist in the same [subscription](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription) as the resource you want to associate the public IP address to.|
   |Resource group|Yes|Can exist in the same, or different, [resource group](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-group) as the resource you want to associate the public IP address to.|
   |Name|Yes|The name must be unique within the resource group you select.|
   |Region|Yes|Must exist in the same [region](https://azure.microsoft.com/regions)as the public IP addresses you'll assign addresses from the range.|
   |Prefix size|Yes| The size of the prefix you need. A /28 or 16 IP addresses is the default.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network public-ip prefix create](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-create)|
|PowerShell|[New-AzPublicIpPrefix](/powershell/module/az.network/new-azpublicipprefix)|

## Create a static public IP address from a prefix
Once you create a prefix, you must create static IP addresses from the prefix. In order to do this, follow steps below.

1. In the box that contains the text *Search resources* at the top of the Azure portal, type *public ip address prefix*. When **Public IP address prefixes** appear in the search results, select it.
2. Select the prefix you want to create public IPs from.
3. When it appears in the search results, select it and click on **+Add IP address** in the Overview section.
4. Enter or select values for the following settings under **Create public IP address**. Since a prefix is for Standard SKU, IPv4, and static, you only need to provide the following information:

   |Setting|Required?|Details|
   |---|---|---|
   |Name|Yes|The name of the public IP address must be unique within the resource group you select.|
   |Idle timeout (minutes)|No|How many minutes to keep a TCP or HTTP connection open without relying on clients to send keep-alive messages. |
   |DNS name label|No|Must be unique within the Azure region you create the name in (across all subscriptions and all customers). Azure automatically registers the name and IP address in its DNS so you can connect to a resource with the name. Azure appends a default subnet such as *location.cloudapp.azure.com* (where location is the location you select) to the name you provide, to create the fully qualified DNS name.For more information, see [Use Azure DNS with an Azure public IP address](../dns/dns-custom-domain.md?toc=%2fazure%2fvirtual-network%2ftoc.json#public-ip-address).|

Alternatively you may use the CLI and PS commands below with the --public-ip-prefix (CLI) and -PublicIpPrefix (PS) parameters, to create a Public IP address resource. 

|Tool|Command|
|---|---|
|CLI|[az network public-ip create](/cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-create)|
|PowerShell|[New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress?view=azps-2.0.0)|

## View or delete a prefix

1. In the box that contains the text *Search resources* at the top of the Azure portal, type *public ip address prefix*. When **Public IP address prefixes** appear in the search results, select it.
2. Select the name of the public IP address prefix that you want to view, change settings for, or delete from the list.
3. Complete one of the following options, depending on whether you want to view, delete, or change the public IP address prefix.
   - **View**: The **Overview** section shows key settings for the public IP address prefix, such as prefix.
   - **Delete**: To delete the public IP address prefix, select **Delete** in the **Overview** section. If addresses within the prefix are associated to public IP address resources, you must first delete the public IP address resources. See [delete a public IP address](virtual-network-public-ip-address.md#view-change-settings-for-or-delete-a-public-ip-address).

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network public-ip prefix list](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-list) to list public IP addresses, [az network public-ip prefix show](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-show) to show settings; [az network public-ip prefix update](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-update) to update; [az network public-ip prefix delete](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-delete) to delete|
|PowerShell|[Get-AzPublicIpPrefix](/powershell/module/az.network/get-azpublicipprefix) to retrieve a public IP address object and view its settings, [Set-AzPublicIpPrefix](/powershell/module/az.network/set-azpublicipprefix) to update settings; [Remove-AzPublicIpPrefix](/powershell/module/az.network/remove-azpublicipprefix) to delete|

## Permissions

To perform tasks on public IP address prefixes, your account must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) role that is assigned the appropriate actions listed in the following table:

| Action                                                            | Name                                                           |
| ---------                                                         | -------------                                                  |
| Microsoft.Network/publicIPPrefixes/read                           | Read a public IP address prefix                                |
| Microsoft.Network/publicIPPrefixes/write                          | Create or update a public IP address prefix                    |
| Microsoft.Network/publicIPPrefixes/delete                         | Delete a public IP address prefix                              |
|Microsoft.Network/publicIPPrefixes/join/action                     | Create a public IP address from a prefix |

## Next steps

- Learn about scenarios and benefits of using a [public IP prefix](public-ip-address-prefix.md)
