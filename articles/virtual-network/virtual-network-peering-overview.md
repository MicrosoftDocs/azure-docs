---
title: Azure Virtual Network peering
titlesuffix: Azure Virtual Network
description: Learn about virtual network peering in Azure, including how it enables you to connect networks in Azure Virtual Network.
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 02/22/2024
ms.author: allensu
# Customer intent: As a cloud architect, I need to know how to use virtual network peering for connecting virtual networks. This knowledge will allow me to design connectivity correctly and understand future scalability options and limitations.
---

# Virtual network peering

Virtual network peering enables you to seamlessly connect two or more [virtual networks](virtual-networks-overview.md) in Azure. The virtual networks appear as one for connectivity purposes. The traffic between virtual machines in peered virtual networks uses the Microsoft backbone infrastructure. Like traffic between virtual machines in the same network, traffic is routed through the Microsoft *private* network only.

By default, a virtual network is peered with up to 500 other virtual networks. By using the [connectivity configuration for Azure Virtual Network Manager](../virtual-network-manager/concept-connectivity-configuration.md), you can increase this limit to peer up to 1,000 virtual networks to a single virtual network. With this larger size, you can create a hub-and-spoke topology with 1,000-spoke virtual networks, for example. You can also create a mesh of 1,000-spoke virtual networks where all spoke virtual networks are directly interconnected.

Azure supports the following types of peering:

* **Virtual network peering**: Connect virtual networks within the same Azure region.
* **Global virtual network peering**: Connect virtual networks across Azure regions.

The benefits of using virtual network peering, whether local or global, include:

* A low-latency, high-bandwidth connection between resources in different virtual networks.
* The ability for resources in one virtual network to communicate with resources in a different virtual network.
* The ability to transfer data between virtual networks across Azure subscriptions, Microsoft Entra tenants, deployment models, and Azure regions.
* The ability to peer virtual networks created through Azure Resource Manager.
* The ability to peer a virtual network created through Resource Manager to one created through the classic deployment model. To learn more about Azure deployment models, see [Understand Azure deployment models](../azure-resource-manager/management/deployment-models.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
* No downtime to resources in either virtual network when you create the peering or after the peering is created.

Network traffic between peered virtual networks is private. Traffic between the virtual networks is kept on the Microsoft backbone network. No public internet, gateways, or encryption are required in the communication between the virtual networks.

## Connectivity

For peered virtual networks, resources in either virtual network can directly connect with resources in the peered virtual network.

The network latency between virtual machines in peered virtual networks in the same region is the same as the latency within a single virtual network. The network throughput is based on the bandwidth that's allowed for the virtual machine, proportionate to its size. There isn't any extra restriction on bandwidth within the peering.

The traffic between virtual machines in peered virtual networks is routed directly through the Microsoft backbone infrastructure, not through a gateway or over the public internet.

You can apply network security groups in either virtual network to block access to other virtual networks or subnets.
When you configure virtual network peering, either open or close the network security group rules between the virtual networks. If you open full connectivity between peered virtual networks, you can apply network security groups to block or deny specific access. Full connectivity is the default option. To learn more about network security groups, see [Security groups](./network-security-groups-overview.md).

## Resize the address space of Azure virtual networks that are peered

You can resize the address space of Azure virtual networks that are peered without incurring any downtime on the currently peered address space. This feature is useful when you need to resize the virtual network's address space after you scale your workloads. After the address space is resized, peers must sync with the new address space changes. Resizing works for both IPv4 and IPv6 address spaces.

You can resize addresses in the following ways:

- Modify the address range prefix of an existing address range (for example, change 10.1.0.0/16 to 10.1.0.0/18).
- Add address ranges to a virtual network.
- Delete address ranges from a virtual network.

Resizing of address space is supported cross-tenant.

You can sync virtual network peers through the Azure portal or with Azure PowerShell. We recommend that you run sync after every resize address space operation instead of performing multiple resizing operations and then running the sync operation. To learn how to update the address space for a peered virtual network, see [Update the address space for a peered virtual network](./update-virtual-network-peering-address-space.yml).

> [!IMPORTANT]
> This feature doesn't support scenarios where the virtual network to be updated is peered with a classic virtual network.

## Service chaining

Service chaining enables you to direct traffic from one virtual network to a virtual appliance or gateway in a peered network through user-defined routes (UDRs).

To enable service chaining, configure UDRs that point to virtual machines in peered virtual networks as the *next hop* IP address. UDRs could also point to virtual network gateways to enable service chaining.

You can deploy hub-and-spoke networks where the hub virtual network hosts infrastructure components like a network virtual appliance or a VPN gateway. All the spoke virtual networks can then peer with the hub virtual network. Traffic flows through network virtual appliances or VPN gateways in the hub virtual network.

Virtual network peering enables the next hop in a UDR to be the IP address of a virtual machine in the peered virtual network, or a VPN gateway. You can't route between virtual networks with a UDR that specifies an Azure ExpressRoute gateway as the next hop type. To learn more about UDRs, see [User-defined routes overview](virtual-networks-udr-overview.md#user-defined). To learn how to create a hub-and-spoke network topology, see [Hub-and-spoke network topology in Azure](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Gateways and on-premises connectivity

Each virtual network, including a peered virtual network, can have its own gateway. A virtual network can use its gateway to connect to an on-premises network. You can also configure [virtual network-to-virtual network connections](../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json) by using gateways, even for peered virtual networks.

When you configure both options for virtual network interconnectivity, the traffic between the virtual networks flows through the peering configuration. The traffic uses the Azure backbone.

You can also configure the gateway in the peered virtual network as a transit point to an on-premises network. In this case, the virtual network that's using a remote gateway can't have its own gateway. A virtual network could have only one gateway. The gateway should be either a local or remote gateway in the peered virtual network, as shown in the following diagram.

:::image type="content" source="./media/virtual-networks-peering-overview/local-or-remote-gateway-in-peered-virual-network.png" alt-text="Diagram that shows virtual network peering transit.":::

Both virtual network peering and global virtual network peering support gateway transit.

Gateway transit between virtual networks created through different deployment models is supported. The gateway must be in the virtual network in the Azure Resource Manager model. To learn more about using a gateway for transit, see [Configure a VPN gateway for transit in a virtual network peering](../vpn-gateway/vpn-gateway-peering-gateway-transit.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

When you peer virtual networks that share a single ExpressRoute connection, the traffic between them goes through the peering relationship. That traffic uses the Azure backbone network. You can still use local gateways in each virtual network to connect to the on-premises circuit. Otherwise, you can use a shared gateway and configure transit for on-premises connectivity.

## Troubleshoot

To confirm that virtual networks are peered, you can check effective routes. Check routes for a network interface in any subnet in a virtual network. If a virtual network peering exists, all subnets within the virtual network have routes with next hop type **Virtual network peering**, for each address space in each peered virtual network. For more information, see [Diagnose a virtual machine routing problem](diagnose-network-routing-problem.md).

You can also troubleshoot connectivity to a virtual machine in a peered virtual network by using Azure Network Watcher. A connectivity check lets you see how traffic is routed from a source virtual machine's network interface to a destination virtual machine's network interface. For more information, see [Troubleshoot connections with Azure Network Watcher by using the Azure portal](../network-watcher/network-watcher-connectivity-portal.md).

You can also see [Troubleshoot virtual network peering issues](virtual-network-troubleshoot-peering-issues.md).

## Constraints for peered virtual networks<a name="requirements-and-constraints"></a>

The following constraints apply only when virtual networks are globally peered:

   * Resources in one virtual network can't communicate with the front-end IP address of a basic load balancer (internal or public) in a globally peered virtual network.
   * Some services that use a basic load balancer don't work over global virtual network peering. For more information, see [What are the constraints related to Global virtual network peering and load balancers?](virtual-networks-faq.md#what-are-the-constraints-related-to-global-virtual-network-peering-and-load-balancers).

You can't perform virtual network peerings as part of the `PUT` virtual network operation.

For more information, see [Requirements and constraints](virtual-network-manage-peering.md#requirements-and-constraints). To learn more about the supported number of peerings, see [Networking limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

## Permissions

To learn about permissions required to create a virtual network peering, see [Permissions](virtual-network-manage-peering.md#permissions).

## Pricing

A nominal fee is charged for ingress and egress traffic that uses a virtual network peering connection. For more information, see [Virtual network pricing](https://azure.microsoft.com/pricing/details/virtual-network).

Gateway transit is a peering property that enables a virtual network to use a virtual private network or an ExpressRoute gateway in a peered virtual network. Gateway transit works for both cross-premises and network-to-network connectivity. Traffic to the gateway (ingress or egress) in the peered virtual network incurs virtual network peering charges on the spoke virtual network (or virtual network without a VPN gateway). For more information, see [Azure VPN Gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/) for VPN gateway charges and ExpressRoute gateway charges.

>[!NOTE]
> A previous version of this document stated that virtual network peering charges would not apply on the spoke virtual network (or non-gateway virtual network) with gateway transit. It now reflects accurate pricing per the pricing page.

## Related content

* You can create a peering between two virtual networks. The networks can belong to the same subscription, different deployment models in the same subscription, or different subscriptions. Complete a tutorial for one of the following scenarios:

    |Azure deployment model             | Subscription  |
    |---------                          |---------|
    |Both Resource Manager              |[Same](tutorial-connect-virtual-networks-portal.md)|
    |                                   |[Different](create-peering-different-subscriptions.md)|
    |One Resource Manager, one classic  |[Same](create-peering-different-deployment-models.md)|
    |                                   |[Different](create-peering-different-deployment-models-subscriptions.md)|

* To learn how to create a hub-and-spoke network topology, see [Hub-and-spoke network topology in Azure](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json).
* To learn about all virtual network peering settings, see [Create, change, or delete a virtual network peering](virtual-network-manage-peering.md).
* For answers to common virtual network peering and global virtual network peering questions, see [Virtual network peering](virtual-networks-faq.md#virtual-network-peering).
