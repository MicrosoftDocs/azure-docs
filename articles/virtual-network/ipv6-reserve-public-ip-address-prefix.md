---
title: Reserve public IPv6 addresses and address ranges in an Azure virtual network
titlesuffix: Azure Virtual Network
description: Learn how to reserve public IPv6 addresses and address ranges in an Azure virtual network.
services: virtual-network
documentationcenter: na
author: KumudD
ms.service: virtual-network
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/31/2020
ms.author: kumud
---

# Reserve public IPv6 address prefix
IPv6 for Azure Virtual Network (VNet) enables you to host applications in Azure with IPv6 and IPv4 connectivity both within a virtual network and to and from the Internet. In addition to reserving individual IPv6 addresses, you can reserve contiguous ranges of Azure IPv6 addresses (known as IP Prefix) for your use. This articles describes how to create IPv6 public IP addresses and address ranges using Azure PowerShell and CLI.


## Create a single reserved IPv6 public IP

### Using Azure PowerShell

You can create a single reserved (static) IPv6 Public IP address using Azure PowerShell with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) as follows:

```azurepowershell  
 $myOwnIPv6Address = New-AzPublicIpAddress `
 -name PIPv6_WestUS `
 -ResourceGroup MyRG `
 -Location "West US" `
 -Sku Standard `
 -allocationMethod static `
 -IpAddressVersion IPv6
 ```

### Using Azure CLI

 You can create a single reserved (static) IPv6 Public IP address Azure CLI with [az network public-ip create](/cli/azure/network/public-ip) as follows:
  
```azurecli
 az network public-ip create \
 --name dsPublicIP_v6 \
 --resource-group UpgradeInPlace_CLI_RG1 \
 --location WestUS \
 --sku Standard  \
 --allocation-method static  \
 --version IPv6
```

## Create a reserved IPv6 prefix (range)

To reserve an IPv6 prefix, add the IP address family of IPv6 to the same command used for creating IPv4 prefixes. The following commands create a prefix of size /125 ( 8 IPv6 addresses).  

### Using Azure PowerShell

You can create a public IPv6 address using Azure CLI with [az network public-ip create](/powershell/module/az.network/new-azpublicipprefix) as follows:
```azurepowershell  
 $myOwnIPv6Prefix = New-AzPublicIpPrefix `
 -name IPv6PrefixWestUS `
 -ResourceGroupName MyRG `
 -Location "West US" `
 -Sku Standard `
 -IpAddressVersion IPv6 `
 -PrefixLength 125
```

### Using Azure CLI

You can create a public IPv6 address using Azure CLI as follows:

```azurecli  
az network public-ip prefix create \
--name IPv6PrefixWestUS \
--resource-group MyRG \
--location WestUS \
--version IPv6 \
--length 125
```

## Allocate a public IP address from a reserved IPv6 Prefix

### Using Azure PowerShell

 You create a static IPv6 Public IP from a reserved prefix by adding the `-PublicIpPrefix` argument when creating the public IP using Azure PowerShell. The following example assumes that a prefix was created and stored in a PowerShell variable named: *$myOwnIPv6Prefix*.

```azurepowershell:  
 $MyIPv6PublicIPFromMyReservedPrefix = New-AzPublicIpAddress \
 -name PIPv6_fromPrefix `
 -ResourceGroup DsStdLb04 `
 -Location "West Central US" `
 -Sku Standard `
 -allocationMethod static `
 -IpAddressVersion IPv6 `
 -PublicIpPrefix $myOwnIPv6Prefix
```

### Using Azure CLI
 
The following example assumes that a prefix was created and stored in a CLI variable named: *IPv6PrefixWestUS*.

```azurecli 
az network public-ip create \
--name dsPublicIP_v6 \
--resource-group UpgradeInPlace_CLI_RG1 \
--location WestUS \
--sku Standard \
--allocation-method static \
--version IPv6 \
--public-ip-prefix  IPv6PrefixWestUS
```

## Next steps
- Learn more about [IPv6 address prefix](ipv6-public-ip-address-prefix.md).
- Learn more about [IPv6 addresses](ipv6-overview.md).
