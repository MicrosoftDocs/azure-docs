---
title: Public IPv6 address prefix in Azure virtual network 
titlesuffix: Azure Virtual Network
description: Learn about public IPv6 address prefix in Azure virtual network.
services: virtual-network
ms.subservice: ip-services
author: asudbring
ms.service: virtual-network
ms.topic: conceptual
ms.date: 05/05/2021
ms.author: allensu
---

# Reserved public IPv6 address prefix

Dual stack (IPv4+IPv6) virtual networks (VNet) and virtual machines (VMs) are secure by default. You can add IPv6 Internet connectivity to your Azure Load Balancers and VMs with public IPv6 addresses.

Any public IPs you reserve are associated with an Azure region of your choice. You can move a reserved IPv6 public IP between any Azure Load Balancer or VMs in your subscription. You can dissociate the IPv6 public IP and it will be held for later reuse.

> [!WARNING]
> Use caution to not delete your public IP addresses accidentally. Deleting a public IP removes it from your subscription and you will not be able to recover it (not even with the help of Azure support).
 
You can reserve contiguous ranges of Azure IPv6 addresses (known as IP prefix) for your use.  Similar to single IP addresses, reserved prefixes are associated with an Azure region of your choice. 

Reserving a predictable, contiguous range of addresses has many uses. For example, you can greatly simplify IP *filtering* of your applications as your static IP ranges can be entered into on-premises firewalls. 

You can create single public IPs from your prefix. IPs are de-allocated from your reserved range when the individual IPs are deleted. These IPs can be reused later. All the IP addresses in your IP prefix are reserved for your exclusive use until you delete your prefix.

## IPv6 prefix sizes
The following public IP prefix sizes are available:

-  Minimum IPv6 Prefix size:  /127 = 2 addresses
-  Maximum IPv6 Prefix size: /124  = 16 addresses

Prefix size is specified as a Classless Inter-Domain Routing (CIDR) mask size. For example, a mask of /128 represents an individual IPv6 address as IPv6 addresses are composed of 128 bits.

## Pricing
 
For costs associated with using Azure Public IPs, both individual IP addresses and IP ranges, see [Public IP Address pricing](https://azure.microsoft.com/pricing/details/ip-addresses/).

## Limitations

IPv6 is supported on Basic Public IPs with "dynamic" allocation only. Dynamic allocation means the IPv6 address will change if you delete and redeploy your application (VM's or load balancers) in Azure. 

Standard IPv6 Public IP's support static (reserved) allocation. 

Standard internal load balancers support dynamic allocation from within the subnet to which they're assigned.  

We recommend you use standard public IPs and standard load balancers for your IPv6 applications.

## Next steps
- Reserve a public [IPv6 address prefix](ipv6-reserve-public-ip-address-prefix.md).
- Learn more about [IPv6 addresses](ipv6-overview.md).
- Learn about [how to create and use public IPs](virtual-network-public-ip-address.md) (both IPv4 and IPv6) in Azure.
