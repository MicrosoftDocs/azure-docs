---
title: Azure Virtual Network peering | Microsoft Docs
description: Learn about virtual network peering in Azure.
services: virtual-network
documentationcenter: na
author: NarayanAnnamalai
manager: jefco
editor: tysonn

ms.assetid: eb0ba07d-5fee-4db0-b1cb-a569b7060d2a
ms.service: virtual-network
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/06/2017
ms.author: narayan

---
# Virtual network peering
Virtual network peering enables you to connect two virtual networks in the same region through the Azure backbone network. Once peered, the two virtual networks appear as one, for connectivity purposes. The two virtual networks are still managed as separate resources, but virtual machines in the peered virtual networks can communicate with each other directly, by using private IP addresses.

The traffic between virtual machines in the peered virtual networks is routed through the Azure infrastructure, much like traffic is routed between virtual machines in the same virtual network. Some of the benefits of using virtual network peering include:

* A low-latency, high-bandwidth connection between resources in different virtual networks.
* The ability to use resources such as network appliances and VPN gateways as transit points in a peered virtual network.
* The ability to peer two virtual networks created through the Azure Resource Manager deployment model or to peer one virtual network created through Resource Manager to a virtual network created through the classic deployment model. Read the [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article to learn more about the differences between the two Azure deployment models.

Requirements and key aspects of virtual network peering:

* The peered virtual networks must exist in the same Azure region. You can connect virtual networks in different Azure regions using a [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json#v2v).
* The peered virtual networks must have non-overlapping IP address spaces.
* Address spaces cannot be added to, or deleted from a virtual network once a virtual network is peered with another virtual network.
* Virtual network peering is between two virtual networks. There is no derived transitive relationship across peerings. For example, if virtualNetworkA is peered with virtualNetworkB, and virtualNetworkB is peered with virtualNetworkC, virtualNetwork A is *not* peered to virtualNetworkC.
* You can peer virtual networks that exist in two different subscriptions as long a privileged user of both subscriptions authorizes the peering and the subscriptions are associated to the same Active Directory tenant. If you need to connect virtual networks associated to different Active Directory tenants, you can use a [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json#v2v). to connect the virtual networks.
* Virtual networks can be peered if both are created through the Resource Manager deployment model or if one is created through the Resource Manager deployment model and the other is created through the classic deployment model. Two virtual networks created through the classic deployment model cannot be peered to each other, however. When peering virtual networks created through different deployment models, the virtual networks must both exist in  the *same* subscription. The ability to peer virtual networks created through different deployment models that exist in *different* subscriptions is in **preview** release. Read the [Create a virtual network peering](virtual-network-create-peering.md#different-subscriptions-different-deployment-models) article for further details.
* Though the communication between virtual machines in peered virtual networks has no additional bandwidth restrictions, there is a maximum network bandwidth depending on the virtual machine size that still applies. To learn more about maximum network bandwidth for different virtual machine sizes, read the [Windows](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine sizes articles.

![Basic virtual network peering](./media/virtual-networks-peering-overview/figure01.png)

## Connectivity
After two virtual networks are peered, virtual machines or Cloud Services roles in the virtual network can directly connect with other resources connected to the peered virtual network. The two virtual networks have full IP-level connectivity.

The network latency for a round trip between two virtual machines in peered virtual networks is the same as for a round trip within a single virtual network. The network throughput is based on the bandwidth that's allowed for the virtual machine, proportionate to its size. There isn't any additional restriction on bandwidth within the peering.

The traffic between the virtual machines in peered virtual networks is routed directly through the Azure back-end infrastructure, not through a gateway.

Virtual machines connected to a virtual network can access the internal load-balanced endpoints in the peered virtual network. Network security groups can be applied in either virtual network to block access to other virtual networks or subnets, if desired.

When configuring virtual network peering, you can either open or close the network security group rules between the virtual networks. If you open full connectivity between peered virtual networks (which is the default option), you can apply network security groups to specific subnets or virtual machines to block or deny specific access. To learn more about network security groups, read the [Network security groups overview](virtual-networks-nsg.md) article.

Azure-provided internal DNS name resolution for virtual machines doesn't work across peered virtual networks. Virtual machines have internal DNS names that are resolvable only within the local virtual network. You can however, configure virtual machines connected to peered virtual networks as DNS servers for a virtual network. For further details, read the [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server) article.

## Service chaining
You can configure user-defined routes that point to virtual machines in peered virtual networks as the "next hop" IP address to enable service chaining. Service chaining enables you to direct traffic from one virtual network to a virtual appliance in a peered virtual network through user-defined routes.

You can also effectively build hub-and-spoke type environments, where the hub can host infrastructure components such as a network virtual appliance. All the spoke virtual networks can then peer with the hub virtual network. Traffic can flow through network virtual appliances that are running in the hub virtual network. In short, virtual network peering enables the next hop IP address on the user-defined route to be the IP address of a virtual machine in the peered virtual network. To learn more about user-defined routes, read the [user-defined routes overview](virtual-networks-udr-overview.md) article.

## Gateways and on-premises connectivity
Each virtual network, regardless of whether it is peered with another virtual network, can still have its own gateway and use it to connect to an on-premises network. You can also configure [Virtual network-to-virtual network connections](../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json) by using gateways, even though the virtual networks are peered.

When both options for virtual network interconnectivity are configured, the traffic between the virtual networks flows through the peering configuration (that is, through the Azure backbone).

When virtual networks are peered, you can also configure the gateway in the peered virtual network as a transit point to an on-premises network. In this case, the virtual network that is using a remote gateway cannot have its own gateway. A virtual network can have only one gateway. The gateway can be either a local or remote gateway (in the peered virtual network), as shown in the following picture:

![VNet peering transit](./media/virtual-networks-peering-overview/figure02.png)

Gateway transit is not supported in the peering relationship between virtual networks created through different deployment models. Both virtual networks in the peering relationship must have been created through Resource Manager for a gateway transit to work.

When the virtual networks that are sharing a single Azure ExpressRoute connection are peered, the traffic between them goes through the peering relationship (that is, through the Azure backbone network). You can still use local gateways in each virtual network to connect to the on-premises circuit. Alternatively, you can use a shared gateway and configure transit for on-premises connectivity.

## Provisioning
Virtual network peering is a privileged operation. It’s a separate function under the VirtualNetworks namespace. A user can be given specific rights to authorize peering. A user who has read-write access to the virtual network inherits these rights automatically.

A user who is either an admin or a privileged user of the peering ability can initiate a peering operation on another virtual network. If there is a matching request for peering on the other side, and if other requirements are met, the peering is established.

## Limits
There are limits on the number of peerings that are allowed for a single virtual network. For more information, review the [Azure networking limits](../azure-subscription-service-limits.md#networking-limits).

## Pricing
There is a nominal charge for ingress and egress traffic that utilizes a virtual network peering. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/virtual-network).

## <a name="next-steps"></a>Next steps

* Complete the [virtual network peering tutorial](virtual-network-create-peering.md)
* Learn about all [virtual network peering settings and how to change them](virtual-network-manage-peering.md).
