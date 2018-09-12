---
title: Public IP address prefix | Microsoft Docs
description: Learn about what a public IP address prefix is and how it can help you assign predictable public IP addresses to your resources.
services: virtual-network
documentationcenter: na
author: anavinahar
manager: narayan
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/24/2018
ms.author: anavin

---

# Public IP address prefix

A public IP address prefix is a contiguous range of IP addresses. Creating a prefix enables you to specify how many public IP addresses you require. Azure allocates a contiguous range of addresses to your subscription based on how many you specify. If you're not familiar with public addresses, see [Public IP addresses](virtual-network-ip-addresses-overview-arm.md#public-ip-addresses).

Public IP addresses are assigned from a pool of addresses in each Azure region. You can [download](https://www.microsoft.com/en-us/download/details.aspx?id=41653) the list of ranges Azure uses for each region. For example, 40.121.0.0/16 is one of over 100 ranges Azure uses in the East US region. The range includes the usable addresses of 40.121.0.1 - 40.121.255.254.

You create a public IP address prefix in an Azure region and subscription by specifying a name, and how many addresses you want the prefix to include. For example, If you create a public IP address prefix of /28, Azure allocates 16 addresses from one of its ranges for you. You don't know which range Azure will assign until you create the range, but the addresses are contiguous. Public IP address prefixes have a fee. For details, see [pricing](https://azure.microsoft.com/pricing/details/ip-addresses).

## Why create a public IP address prefix?

When you create public IP address resources, Azure assign an available public IP address from any of the ranges used in a region. Once Azure assigns the address, you know what the address is, but until Azure assigns the address, you don't know what address might be assigned. This can be problematic when, for example, you, or your business partners, setup firewall rules that allow specific IP addresses. Each time you assign a new public IP address to a resource, the address has to be added to the firewall rule. When you assign addresses to your resources from a public IP address prefix, firewall rules don't need to be updated each time you assign one of the addresses, because the whole range could be added to a rule.

## Benefits

- You can create public IP address resources from a known range.
- You, or your business partners can create firewall rules with ranges that include public IP addresses you've currently assigned, as well as addresses you haven't assigned yet. This eliminates the need to change firewall rules as you assign IP addresses to new resources.
- There are no limits as to how many ranges you can create, however, there are limits on the maximum number of static public IP addresses you can have in an Azure subscription. As a result, the number of ranges you create can't encompass more static public IP addresses than you can have in your subscription. For more information, see [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).
- The addresses that you create using addresses from the prefix can be assigned to any Azure resource that you can assign a public IP address to.
- You can easily see which IP addresses that are allocated and not yet allocated within the range.

## Scenarios

- Use to associate to Azure firewall
- VM NICs
- Outbound rules
- Front end of Load Balancer

## Constraints

- You can't specify the IP addresses for the prefix. Azure allocates the IP addresses for the prefix, based on the size that you specify.
- You can't change the range, once you've created the prefix.
- The range is for IPv4 addresses only. The range does not contain IPv6 addresses.
- Only static public IP addresses created with the Standard SKU can be assigned from the prefix's range. To learn more about public IP address SKUs, see [public IP address](virtual-network-ip-addresses-overview-arm.md#public-ip-addresses).
- Addresses from the range can only be assigned to Azure Resource Manager resources. Addresses cannot be assigned resources in the classic deployment model.
- All public IP addresses created with from the prefix must exist in the same Azure region and subscription as the prefix, and must be assigned to resources in the same region and subscription.
- You can't delete a prefix if any addresses within it are assigned to public IP address resources associated to a resource. Dissociate all public IP address resources that are assigned IP addresses from the prefix first.

## Next steps

- [Create](manage-public-ip-address-prefix.md#create-a-public-ip-prefix) a public IP address prefix