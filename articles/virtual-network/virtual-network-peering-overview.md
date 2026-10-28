---
title: Azure Virtual Network Peering
titlesuffix: Azure Virtual Network
description: Learn about virtual network peering in Azure, including how it enables you to connect networks in Azure Virtual Network.
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 10/15/2026
ms.author: allensu
# Customer intent: As a cloud architect, I need to know how to use virtual network peering for connecting virtual networks. This knowledge will allow me to design connectivity correctly and understand future scalability options and limitations.
---

# Azure virtual network peering

Azure Virtual Network peering enables you to seamlessly connect two or more virtual networks in Azure, making them appear as one for connectivity purposes. This powerful feature allows you to create secure, high-performance connections between virtual networks while keeping all traffic on Microsoft's private backbone infrastructure, eliminating the need for public internet routing.

**What you learn in this article:**

- How virtual network peering works and its key benefits

- Different types of peering (local and global)

- How to implement connectivity and service chaining

- How to disable peering route propagation to steer traffic through a network virtual appliance

- Troubleshooting common peering issues

Whether you're designing a hub-and-spoke topology or connecting networks across regions, this guide helps you understand the capabilities and limitations of virtual network peering.

By using [Azure Virtual Network Manager connectivity configurations](../virtual-network-manager/concept-connectivity-configuration.md), you can scale connectivity beyond traditional virtual network peering limits. For example, you can create a hub-and-spoke topology with up to 1,000 spoke virtual networks connected to a hub, or create a mesh connected group containing up to 3,000 virtual networks that can communicate directly with one another.

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

Microsoft recently introduced an added flexibility on top of virtual network peering - '**Subnet peering**'.
 
It's an added flexibility built on top of virtual network peering, where you get an option to choose specific subnets that need to be peered across virtual networks. You can specify or enter the list of subnets across the virtual networks that you want to peer. In contrast, in regular virtual network peering, the entire address space and subnets across the virtual networks get peered. For more information, see [How to configure Subnet Peering](how-to-configure-subnet-peering.md).

## Connectivity

For peered virtual networks, resources in either virtual network can directly connect with resources in the peered virtual network.

The network latency between virtual machines in peered virtual networks in the same region is the same as the latency within a single virtual network. The network throughput is based on the bandwidth allowed for the virtual machine, proportionate to its size. There isn't any extra restriction on bandwidth within the peering.

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

You can also configure the gateway in the peered virtual network as a transit point to an on-premises network. In this case, the virtual network that's using a remote gateway can't have its own gateway. A virtual network can have only one gateway. The gateway should be either a local or remote gateway in the peered virtual network, as shown in the following diagram.

:::image type="content" source="./media/virtual-networks-peering-overview/local-or-remote-gateway-in-peered-virual-network.png" alt-text="Diagram that shows virtual network peering transit.":::

Both virtual network peering and global virtual network peering support gateway transit.

Gateway transit between virtual networks created through different deployment models is supported. The gateway must be in the virtual network in the Azure Resource Manager model. To learn more about using a gateway for transit, see [Configure a VPN gateway for transit in a virtual network peering](../vpn-gateway/vpn-gateway-peering-gateway-transit.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

To use a VPN or ExpressRoute gateway that's in a different Azure region from your workload virtual networks, see [Use a VPN or ExpressRoute gateway in a different region](../vpn-gateway/vpn-gateway-different-region.md).

When you peer virtual networks that share a single ExpressRoute connection, the traffic between them goes through the peering relationship. That traffic uses the Azure backbone network. You can still use local gateways in each virtual network to connect to the on-premises circuit. Otherwise, you can use a shared gateway and configure transit for on-premises connectivity.

### Advertised gateway prefixes

In hub-and-spoke designs that use gateway transit, Azure VPN Gateway and ExpressRoute Gateway can advertise a large number of prefixes to on-premises because the default behavior is to advertise the address space of the hub and the address spaces of peered virtual networks.

To reduce the number of advertised prefixes, you can configure advertised gateway prefixes on the gateway virtual network by using the `summarizedGatewayPrefixes` property. When you populate this property on the hub virtual network, Azure VPN Gateway and ExpressRoute Gateway advertise the summarized prefixes instead of the hub's address space and suppress advertisement of spoke address spaces that are covered by the summarized space.

> [!NOTE]
> The `summarizedGatewayPrefixes` property only affects virtual networks with a gateway subnet.

For more information, see [Advertised gateway prefixes overview](advertised-gateway-prefixes-overview.md).

## Disable peering route propagation (preview)

Disable peering route propagation is available in public preview. This route-table capability helps you steer traffic through a network virtual appliance (NVA), such as Azure Firewall, without maintaining a separate user-defined route (UDR) for every peered virtual network. It suppresses system-generated IPv4 and IPv6 peering routes for supported workloads on subnets associated with the route table while preserving the virtual network peering connection.

> [!IMPORTANT]
> During public preview, the Azure Firewall or NVA next hop must be in the same virtual network as the source workload's network interface. A next hop in a peered virtual network isn't supported. For other preview restrictions, see [Limitations](#limitations).

### When to disable peering route propagation

Use disable peering route propagation in large hub-and-spoke networks when you need to keep a centralized inspection path manageable as the network grows. As you add spokes, per-spoke route overrides consume route-table capacity and require recurring configuration.

Azure selects routes by [longest prefix match](virtual-networks-udr-overview.md#how-azure-selects-a-route). A system-generated peering route can be more specific than a summarized UDR. In that case, Azure selects the peering route, and traffic bypasses the NVA.

Disable peering route propagation suppresses the IPv4 and IPv6 peering routes so that Azure can select the intended UDR. In large hub-and-spoke networks, you can combine this capability with [advertised gateway prefixes](advertised-gateway-prefixes-overview.md) and use a summarized UDR instead of maintaining a separate override for each spoke.

The following diagram compares routing from on-premises networks to peered spoke virtual networks with and without peering route suppression. The gateway and Azure Firewall or NVA are in the hub virtual network.

:::image type="complex" source="./media/virtual-networks-peering-overview/disable-peering-route-propagation.png" alt-text="Diagram comparing default peering routes and route suppression for on-premises traffic through a hub gateway and firewall to spokes." lightbox="./media/virtual-networks-peering-overview/disable-peering-route-propagation.png":::
   The hub virtual network, 10.0.0.0/16, contains a gateway at 10.0.1.4 and Azure Firewall or an NVA at 10.0.2.4. The hub is peered with spoke virtual networks, including 10.1.0.0/16 and 10.2.0.0/16. With peering routes enabled, the more-specific system peering routes take precedence over the summarized 10.0.0.0/8 UDR, and traffic from on-premises networks bypasses the firewall. When disablePeeringRoute is set to All, the system peering routes are suppressed. The summarized UDR directs traffic through the firewall or NVA at 10.0.2.4 to the spokes. IPv4 and IPv6 peering routes are suppressed, and the virtual network peering connections remain configured.
:::image-end:::

### Benefits

For higher-scale routing, disable peering route propagation lets you:

- Replace per-spoke route overrides with a summarized UDR toward the NVA when the address plan and intended inspection path allow it.
- Apply route suppression at subnet scope through the associated route table while retaining peering connectivity and leaving other subnets unchanged.
- Reduce recurring route maintenance without increasing the UDR quota or automatically configuring the inspection path.

### Limitations

During public preview, disable peering route propagation has the following limitations:

- The Azure Firewall or NVA next hop must be in the same virtual network as the source workload's network interface. A next hop in a peered virtual network isn't supported.
- Peering route suppression doesn't apply to Azure BareMetal Infrastructure workloads. BareMetal workloads in a subnet associated with a route table that uses this feature continue to use standard longest-prefix-match routing and don't use the summarized routes for this feature. Other supported workloads in the same subnet use the summarized routes normally.
- For Terraform, use the AzAPI provider. The AzureRM provider doesn't currently support this setting.

### How peering route suppression works

The `disablePeeringRoute` route-table property supports the following values:

| Value | Behavior |
| --- | --- |
| `None` | Azure adds system-generated peering routes. This value is the default. |
| `All` | Azure suppresses IPv4 and IPv6 system-generated peering routes for supported workloads on subnets associated with the route table. |

Disabling peering route propagation doesn't create replacement routes or an inspection path. Before you enable it, configure the required UDRs and ensure that the specified next hop can forward traffic to the destination.

During public preview, manage this setting through the route table, not through Azure Virtual Network Manager routing rule collections. You don't need to change individual peering resources.

To configure this feature, see [Configure disable peering route propagation](configure-disable-peering-route-propagation.md).

## Troubleshoot

To confirm that virtual networks are peered, check effective routes. Check routes for a network interface in any subnet in a virtual network. By default, if a virtual network peering exists, all subnets within the virtual network have routes with next hop type **Virtual network peering**, for each address space in each peered virtual network. If [disable peering route propagation](#disable-peering-route-propagation-preview) is enabled on the subnet's route table, those peering routes are suppressed for supported workloads. Check that the required UDRs direct traffic to the intended next hop instead. For more information, see [Diagnose a virtual machine routing problem](diagnose-network-routing-problem.md).

You can also troubleshoot connectivity to a virtual machine in a peered virtual network by using Azure Network Watcher. A connectivity check lets you see how traffic is routed from a source virtual machine's network interface to a destination virtual machine's network interface. For more information, see [Troubleshoot connections with Azure Network Watcher by using the Azure portal](../network-watcher/network-watcher-connectivity-portal.md).

You can also see [Troubleshoot virtual network peering issues](virtual-network-troubleshoot-peering-issues.md).

## Constraints for peered virtual networks<a name="requirements-and-constraints"></a>

The following constraints apply only when virtual networks are globally peered:

* Resources in one virtual network can't communicate with the front-end IP address of a basic load balancer (internal or public) in a globally peered virtual network.
   
* Some services that use a basic load balancer don't work over global virtual network peering. For more information, see [What are the constraints related to Global virtual network peering and load balancers?](virtual-networks-faq.md#what-are-the-constraints-related-to-global-virtual-network-peering-and-load-balancers)

* You can't perform virtual network peerings as part of the `PUT` virtual network operation.

For more information, see [Requirements and constraints](virtual-network-manage-peering.md#requirements-and-constraints). To learn more about the supported number of peerings, see [Networking limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

## Permissions

To learn about permissions required to create a virtual network peering, see [Permissions](virtual-network-manage-peering.md#permissions).

## Pricing

You pay a nominal fee for ingress and egress traffic that uses a virtual network peering connection. For more information, see [Virtual network pricing](https://azure.microsoft.com/pricing/details/virtual-network).

Gateway transit is a peering property that enables a virtual network to use a virtual private network or an ExpressRoute gateway in a peered virtual network. Gateway transit works for both cross-premises and network-to-network connectivity. Traffic to the gateway (ingress or egress) in the peered virtual network incurs virtual network peering charges on the spoke virtual network (or virtual network without a VPN gateway). For more information, see [Azure VPN Gateway pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/) for VPN gateway charges and ExpressRoute gateway charges.

>[!NOTE]
> A previous version of this document stated that virtual network peering charges wouldn't apply on the spoke virtual network (or nongateway virtual network) with gateway transit. It now reflects accurate pricing per the pricing page.

## Next steps

Ready to implement virtual network peering? Choose your scenario:

### Get started with tutorials
- **[Create peering in same subscription](tutorial-connect-virtual-networks-portal.md)** - Perfect for testing and development environments.
- **[Create peering across subscriptions](create-peering-different-subscriptions.md)** - Ideal for enterprise scenarios with multiple subscriptions.

### Advanced configurations  
- **[Build a hub-and-spoke topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json)** - Scale your network architecture.
- **[Manage peering settings](virtual-network-manage-peering.md)** - Complete reference for all peering options.

### Need help?
- **[Virtual network peering FAQ](virtual-networks-faq.md#virtual-network-peering)** - Common questions and answers.
