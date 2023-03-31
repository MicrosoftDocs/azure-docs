---
title: Create, change, or delete an Azure public IP address prefix
titlesuffix: Azure Virtual Network
description: Learn about public IP address prefixes and how to create, change, or delete them.
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: conceptual
ms.date: 03/30/2023
ms.author: allensu
---

# Manage a public IP address prefix

A public IP address prefix is a contiguous range of standard SKU public IP addresses.  When you create a public IP address resource, you can assign a static public IP from the prefix and associate the address to Azure resources. For more information, see [Public IP address prefix overview](public-ip-address-prefix.md).  This article explains how to create, modify, or delete public IP address prefixes, and create public IPs from an existing prefix.

## Create a public IP address prefix

The following section details the parameters when creating a public IP prefix.

   | Setting | Required? | Details |
   | --- | --- | --- |
   | Subscription|Yes|Must exist in the same [subscription](../../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription) as the resource you want to associate the public IP address to. |
   | Resource group|Yes|Can exist in the same, or different, [resource group](../../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-group) as the resource you want to associate the public IP address to. |
   | Name | Yes | The name must be unique within the resource group you select.|
   | Region | Yes | Must exist in the same [region](https://azure.microsoft.com/regions)as the public IP addresses assigned from the range. |
   | IP version | Yes | IP version of the prefix (v4 or v6). |
   | Prefix size | Yes | The size of the prefix you need. A range with 16 IP addresses (/28 for v4 or /124 for v6) is the default. |

Alternatively, you may use the following CLI and PowerShell commands to create a public IP address prefix.

**Commands**

| Tool | Command |
| --- | --- |
| CLI | [az network public-ip prefix create](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-create) |
| PowerShell |[New-AzPublicIpPrefix](/powershell/module/az.network/new-azpublicipprefix) |

>[!NOTE]
>In regions with availability zones, you can use PowerShell or CLI commands to create a public IP address prefix as either: non-zonal, associated with a specific zone, or to use zone-redundancy.  For API version 2020-08-01 or later, if a zone parameter is not provided, a non-zonal public IP address prefix is created. For versions of the API older than 2020-08-01, a zone-redundant public IP address prefix is created. 

## Create a static public IP address from a prefix

The following section details the parameters required when creating a static public IP address from a prefix.

   | Setting | Required? | Details |
   | --- | --- | --- |
   | Name | Yes | The name of the public IP address must be unique within the resource group you select. |
   | Idle timeout (minutes)| No| How many minutes to keep a TCP or HTTP connection open without relying on clients to send keep-alive messages. |
   | DNS name label | No | Must be unique within the Azure region you create the name in (across all subscriptions and all customers). </br> Azure automatically registers the name and IP address in its DNS so you can connect to a resource with the name. </br> Azure appends a default subnet *location.cloudapp.azure.com* to the name you provide to create the fully qualified DNS name. </br> For more information, see [Use Azure DNS with an Azure public IP address](../../dns/dns-custom-domain.md?toc=%2fazure%2fvirtual-network%2ftoc.json#public-ip-address). |

Alternatively, you may use the following CLI and PowerShell commands with the **`--public-ip-prefix`** **(CLI)** and **`-PublicIpPrefix`** **(PowerShell)** parameters, to create a public IP address resource from a prefix. 

| Tool | Command |
| --- | --- |
| CLI | [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) |
| PowerShell | [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) |

>[!NOTE]
>When requesting a Public IP address from a Public IP Prefix, the allocation is not deterministic or sequential. If a specific Public IP address from a Public IP Prefix is required, the PowerShell or CLI commands allow for this.  For PowerShell, the `IpAddress` parameter (followed by the desired IP) should be used; for CLI, the `ip-address` parameter (followed by the desired IP) should be used.

>[!NOTE]
>Only static public IP addresses created with the Standard SKU can be assigned from the prefix's range. To learn more about public IP address SKUs, see [public IP address](public-ip-addresses.md#public-ip-addresses).

## View or delete a prefix

To view or delete a prefix, the following commands can be used in Azure CLI and Azure PowerShell.

**Commands**

| Tool | Command |
| --- | --- |
| CLI | [az network public-ip prefix list](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-list) to list public IP addresses. <br> [az network public-ip prefix show](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-show) to show settings. <br> [az network public-ip prefix update](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-update) to update. <br> [az network public-ip prefix delete](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-delete) to delete. |
| PowerShell |[Get-AzPublicIpPrefix](/powershell/module/az.network/get-azpublicipprefix) to retrieve a public IP address object and view its settings. <br> [Set-AzPublicIpPrefix](/powershell/module/az.network/set-azpublicipprefix) to update settings. <br> [Remove-AzPublicIpPrefix](/powershell/module/az.network/remove-azpublicipprefix) to delete. |

## Permissions

For permissions to manage public IP address prefixes, your account must be assigned to the [network contributor](../../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom](../../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) role. 

| Action                                                            | Name                                                           |
| ---------                                                         | -------------                                                  |
| Microsoft.Network/publicIPPrefixes/read                           | Read a public IP address prefix                                |
| Microsoft.Network/publicIPPrefixes/write                          | Create or update a public IP address prefix                    |
| Microsoft.Network/publicIPPrefixes/delete                         | Delete a public IP address prefix                              |
| Microsoft.Network/publicIPPrefixes/join/action                     | Create a public IP address from a prefix |

## Next steps

- Learn about scenarios and benefits of using a [public IP prefix](public-ip-address-prefix.md)
