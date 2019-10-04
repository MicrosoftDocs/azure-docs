---
title: Azure Virtual Network peering
titlesuffix: Azure Virtual Network
description: Learn about virtual network peering in Azure.
services: virtual-network
documentationcenter: na
author: anavinahar
ms.service: virtual-network
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/01/2019
ms.author: anavin

---
# Virtual network peering

Virtual network peering enables you to seamlessly connect Azure [virtual networks](virtual-networks-overview.md). Once peered, the virtual networks appear as one, for connectivity purposes. The traffic between virtual machines in the peered virtual networks is routed through the Microsoft backbone infrastructure, much like traffic is routed between virtual machines in the same virtual network, through *private* IP addresses only. Azure supports:
* VNet peering - connecting VNets within the same Azure region
* Global VNet peering - connecting VNets across Azure regions

The benefits of using virtual network peering, whether local or global, include:

* Network traffic between peered virtual networks is private. Traffic between the virtual networks is kept on the Microsoft backbone network. No public Internet, gateways, or encryption is required in the communication between the virtual networks.
* A low-latency, high-bandwidth connection between resources in different virtual networks.
* The ability for resources in one virtual network to communicate with resources in a different virtual network, once the virtual networks are peered.
* The ability to transfer data across Azure subscriptions, deployment models, and across Azure regions.
* The ability to peer virtual networks created through the Azure Resource Manager or to peer one virtual network created through Resource Manager to a virtual network created through the classic deployment model. To learn more about Azure deployment models, see [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
* No downtime to resources in either virtual network when creating the peering, or after the peering is created.

## Connectivity

After virtual networks are peered, resources in either virtual network can directly connect with resources in the peered virtual network.

The network latency between virtual machines in peered virtual networks in the same region is the same as the latency within a single virtual network. The network throughput is based on the bandwidth that's allowed for the virtual machine, proportionate to its size. There isn't any additional restriction on bandwidth within the peering.

The traffic between virtual machines in peered virtual networks is routed directly through the Microsoft backbone infrastructure, not through a gateway or over the public Internet.

Network security groups can be applied in either virtual network to block access to other virtual networks or subnets, if desired.
When configuring virtual network peering, you can either open or close the network security group rules between the virtual networks. If you open full connectivity between peered virtual networks (which is the default option), you can apply network security groups to specific subnets or virtual machines to block or deny specific access. To learn more about network security groups, see [Network security groups overview](security-overview.md).

## Service chaining

You can configure user-defined routes that point to virtual machines in peered virtual networks as the *next hop* IP address, or to virtual network gateways, to enable service chaining. Service chaining enables you to direct traffic from one virtual network to a virtual appliance, or virtual network gateway, in a peered virtual network, through user-defined routes.

You can deploy hub-and-spoke networks, where the hub virtual network can host infrastructure components such as a network virtual appliance or VPN gateway. All the spoke virtual networks can then peer with the hub virtual network. Traffic can flow through network virtual appliances or VPN gateways in the hub virtual network. 

Virtual network peering enables the next hop in a user-defined route to be the IP address of a virtual machine in the peered virtual network, or a VPN gateway. You cannot however, route between virtual networks with a user-defined route specifying an ExpressRoute gateway as the next hop type. To learn more about user-defined routes, see [User-defined routes overview](virtual-networks-udr-overview.md#user-defined). To learn how to create a hub and spoke network topology, see [hub and spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Gateways and on-premises connectivity

Each virtual network, regardless of whether it is peered with another virtual network, can still have its own gateway and use it to connect to an on-premises network. You can also configure [virtual network-to-virtual network connections](../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json) by using gateways, even though the virtual networks are peered.

When both options for virtual network interconnectivity are configured, the traffic between the virtual networks flows through the peering configuration (that is, through the Azure backbone).

When virtual networks are peered, you can also configure the gateway in the peered virtual network as a transit point to an on-premises network. In this case, the virtual network that is using a remote gateway cannot have its own gateway. A virtual network can have only one gateway. The gateway can be either a local or remote gateway (in the peered virtual network), as shown in the following picture:

![virtual network peering transit](./media/virtual-networks-peering-overview/figure04.png)

Gateway transit is supported for both VNet Peering and Global VNet Peering. Gateway transit between virtual networks created through different deployment models (Resource Manager and classic) is supported only if the gateway is in the virtual network (Resource Manager). To learn more about using a gateway for transit, see [Configure a VPN gateway for transit in a virtual network peering](../vpn-gateway/vpn-gateway-peering-gateway-transit.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

When the virtual networks that are sharing a single Azure ExpressRoute connection are peered, the traffic between them goes through the peering relationship (that is, through the Azure backbone network). You can still use local gateways in each virtual network to connect to the on-premises circuit. Alternatively, you can use a shared gateway and configure transit for on-premises connectivity.

## Troubleshoot

To confirm a virtual network peering, you can [check effective routes](diagnose-network-routing-problem.md) for a network interface in any subnet in a virtual network. If a virtual network peering exists, all subnets within the virtual network have routes with next hop type *VNet peering*, for each address space in each peered virtual network.

You can also troubleshoot connectivity to a virtual machine in a peered virtual network using Network Watcher's [connectivity check](../network-watcher/network-watcher-connectivity-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json). Connectivity check lets you see how traffic is routed from a source virtual machine's network interface to a destination virtual machine's network interface.

You can also try the [Troubleshooter for virtual network peering issues](https://support.microsoft.com/help/4486956/troubleshooter-for-virtual-network-peering-issues).

## Requirements and constraints

The following constraints apply only when virtual networks are globally peered:
- Resources in one virtual network cannot communicate with the front-end IP address of a Basic internal load balancer in a globally peered virtual network. Support for Basic Load Balancer only exists within the same region. Support for Standard Load Balancer exists for both, VNet Peering and Global VNet Peering. Services that use a Basic load balancer which will not work over Global VNet Peering are documented [here.](virtual-networks-faq.md#what-are-the-constraints-related-to-global-vnet-peering-and-load-balancers)

To learn more about requirements and constraints, see [Virtual network peering requirements and constraints](virtual-network-manage-peering.md#requirements-and-constraints). To learn about the limits for the number of peerings you can create for a virtual network, see [Azure networking limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits). 

## Permissions

To learn about permissions required to create a virtual network peering, see [Virtual network peering permissions](virtual-network-manage-peering.md#permissions).

## Pricing

There is a nominal charge for ingress and egress traffic that utilizes a virtual network peering connection. For more information on VNet Peering and Global VNet peering pricing, see the [pricing page](https://azure.microsoft.com/pricing/details/virtual-network).

Gateway transit is a peering property that enables a virtual network to utilize a VPN/ExpressRoute gateway in a peered virtual network for cross premises or VNet-to-VNet connectivity. Traffic passing through a remote gateway in this scenario is subject to [VPN gateway charges](https://azure.microsoft.com/pricing/details/vpn-gateway/) or ExpressRoute gateway charges and does not incur [VNet peering charges.](https://azure.microsoft.com/pricing/details/virtual-network) For example, If VNetA has a VPN gateway for on-premises connectivity and VNetB is peered to VNetA with appropriate properties configured, traffic from VNetB to on-premises is only charged egress per VPN gateway pricing or ExpressRoute pricing. VNet peering charges do not apply. Learn how to [configure VPN gateway transit for virtual network peering.](../vpn-gateway/vpn-gateway-peering-gateway-transit.md?toc=%2fazure%2fvirtual-network%2ftoc.json)

## Next steps

* A virtual network peering is created between virtual networks created through the same, or different deployment models that exist in the same, or different subscriptions. Complete a tutorial for one of the following scenarios:

    |Azure deployment model             | Subscription  |
    |---------                          |---------|
    |Both Resource Manager              |[Same](tutorial-connect-virtual-networks-portal.md)|
    |                                   |[Different](create-peering-different-subscriptions.md)|
    |One Resource Manager, one classic  |[Same](create-peering-different-deployment-models.md)|
    |                                   |[Different](create-peering-different-deployment-models-subscriptions.md)|

* Learn how to create a [hub and spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json).
* Learn about all [virtual network peering settings and how to change them](virtual-network-manage-peering.md).
* Get answers to common VNet Peering and Global VNet Peering questions through our [VNet Peering FAQ](virtual-networks-faq.md#vnet-peering)
