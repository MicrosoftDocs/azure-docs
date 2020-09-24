---
title: Public IPv6 address prefix in Azure virtual network 
titlesuffix: Azure Virtual Network
description: Learn about public IPv6 address prefix in Azure virtual network.
services: virtual-network
documentationcenter: na
author: KumudD
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/31/2020
ms.author: kumud
---

# Reserved public IPv6 address prefix

In Azure, dual stack (IPv4+IPv6) virtual networks (VNet) and virtual machines (VMs) are secure by default since they have no Internet connectivity. You can easily add an IPv6 Internet connectivity to your Azure Load Balancers and VMs with public IPv6 addresses that you obtain from Azure.

Any public IPs that you reserve are associated with an Azure region of your choice and with your Azure subscription. You may move a reserved (static) IPv6 public IP between any of the Azure Load Balancers or VMs in your subscription. You may dissociate the IPv6 public IP entirely and it will be held for your use when you're ready.

> [!WARNING]
> Use caution to not delete your public IP addresses accidentally. Deleting a public IP removes it from your subscription and you will not be able to recover it (not even with the help of Azure support).

In addition to reserving individual IPv6 addresses, you can reserve contiguous ranges of Azure IPv6 addresses (known as IP prefix) for your use.  Similar to individual IP addresses, reserved prefixes are associated with an Azure region of your choice and with your Azure subscription. Reserving a predictable, contiguous range of addresses has many uses. For example, you can greatly simplify IP *whitelisting* of your Azure-hosted applications by your company and your customers as your static IP ranges can be readily programmed into on-premises firewalls.  You can create individual public IPs from your IP prefix as needed and when you delete those individual Public IPs they are *returned* to your reserved range so that you can reuse them later. All the IP addresses in your IP Prefix are reserved for your exclusive use until such time as you delete your Prefix.



## IPv6 prefix sizes
The following public IP prefix sizes are available:

-  Minimum IPv6 Prefix size:  /127 = 2 addresses
-  Maximum IPv6 Prefix size: /124  = 16 addresses

Prefix size is specified as a Classless Inter-Domain Routing (CIDR) mask size. For example, a mask of /128 represents an individual IPv6 address as IPv6 addresses are composed of 128 bits.

## Pricing
 
For costs associated with using Azure Public IPs, both individual IP addresses and IP ranges, see [Public IP Address pricing](https://azure.microsoft.com/pricing/details/ip-addresses/).

## Limitations
IPv6 is supported on Basic Public IPs only with "dynamic" allocation that means that the IPv6 address will change if you delete and redeploy your application (VM's or load balancers) in Azure. Standard IPv6 Public IP's support solely static (reserved) allocation though Standard INTERNAL load balancers can also support dynamic allocation from within the subnet to which they are assigned.  

As a best practice, we recommend that you use Standard Public IPs and Standard Load Balancers for your IPv6 applications.

## Next steps
- Reserve a public [IPv6 address prefix](ipv6-reserve-public-ip-address-prefix.md).
- Learn more about [IPv6 addresses](ipv6-overview.md).
- Learn about [how to create and use public IPs](virtual-network-public-ip-address.md) (both IPv4 and IPv6) in Azure.
