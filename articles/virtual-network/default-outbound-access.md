---
title: Default outbound access in Azure
titleSuffix: Azure Virtual Network
description: Learn about default outbound access in Azure.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: conceptual
ms.date: 07/13/2021
ms.author: allensu
---

# Default outbound access in Azure

In Azure, virtual machines created in a virtual network without explicit outbound connectivity defined are assigned a default outbound public IP address. This IP address enables outbound connectivity from the resources to the Internet. This access is referred to as default outbound access. 

Examples of explicit outbound connectivity, are virtual machines:

* Created within a subnet associated to a NAT Gateway.
* In the backend pool of a standard load balancer with outbound rules defined.
* In the backend pool of basic public load balancer.
* Virtual machines with public IP addresses explicitly associated to them.

## How is default outbound access provided?

The public IPv4 address used for the access is called the default outbound access IP. This IP is implicit and belongs to Microsoft. This IP address is subject to change and it's not recommended to depend on it for production workloads.

## When is default outbound access provided?

If you deploy a virtual machine in Azure and it doesn't have explicit outbound connectivity, it's assigned a default outbound access IP.
## Why is disabling default outbound access recommended?

* Secure by default
    
    * It's not recommended to open a virtual network to the Internet by default using the zero trust network security principle.

* Explicit vs. implicit

    * It's recommended to have explicit methods of connectivity instead of implicit when granting access to resources in your virtual network.

* Loss of IP address

    * The default outbound access IP isn't owned by customers. This IP is subject to change.  Any dependency on this IP could cause issues in the future.

## How can I disable default outbound access?

There are multiple ways to turn off default outbound access:

1.	Add an explicit outbound connectivity method

    * Associate a NAT gateway to the subnet of your virtual machine.

    * Associate a standard load balancer with outbound rules configured.

    * Associate a public IP to the virtual machine's network interface.

2.	Use Flexible orchestration mode for virtual machine scale sets.

    * Flexible scale sets are secure by default. Any instances created via Flexible scale sets won't have the default outbound access IP associated to it. For more information, see [Flexible orchestration mode for virtual machine scale sets](http://aka.ms/vmssflex/docs)

## If I need outbound access, what is the recommended way?

NAT gateway is the recommended approach to have explicit outbound connectivity. A firewall can also be used to provide this access.

## Limitations

* Connectivity maybe needed for Windows Updates.
* Default outbound access IP doesn't support fragmented packets. 

## Next steps

For more information on outbound connections in Azure and Azure Virtual Network NAT (NAT gateway), see:

* [Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md).

* [What is Azure Virtual Network NAT?](./nat-gateway/nat-overview.md)
