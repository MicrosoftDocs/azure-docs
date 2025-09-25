---
title: Route injection in spoke virtual networks
titleSuffix: Azure Route Server
description: Learn how Azure Route Server automatically injects routes in spoke virtual networks, eliminating the need for manual user-defined route management in hub-and-spoke architectures.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: concept-article
ms.date: 02/10/2025
ms.custom: sfi-image-nochange

#CustomerIntent: As an Azure administrator, I want to use Azure Route Server so it dynamically injects routes in spoke virtual networks (VNets).
---

# Route injection in spoke virtual networks


Azure Route Server simplifies network management in hub-and-spoke architectures by automatically injecting routes into spoke virtual networks. This capability eliminates the need for manually creating and maintaining user-defined routes across multiple spoke networks, while enabling dynamic routing through network virtual appliances.

In traditional hub-and-spoke designs, administrators must configure user-defined routes (UDRs) in each spoke virtual network to direct traffic through shared network devices in the hub. This manual approach becomes challenging to maintain as the number of spokes increases. Azure Route Server addresses this complexity by providing a centralized routing solution that automatically distributes routes learned from network virtual appliances to all connected spoke networks.

Key benefits of Route Server route injection include:

- **Simplified management**: Eliminates manual UDR configuration in spoke networks
- **Dynamic routing**: Automatically adapts to network topology changes
- **Centralized control**: Provides single point for route distribution from the hub
- **Scalable architecture**: Supports growth in spoke network count without more complexity injection in spoke virtual networks

## Basic hub-and-spoke topology

The following diagram illustrates a typical hub-and-spoke design with Azure Route Server. The hub virtual network contains both a network virtual appliance and a Route Server, while two spoke virtual networks host application workloads.

:::image type="content" source="./media/route-injection-in-spokes/route-injection.png" alt-text="Diagram showing hub-and-spoke topology with Azure Route Server automatically injecting routes to spoke virtual networks.":::

### How route injection works

In this configuration, the network virtual appliance advertises network prefixes to the Route Server through BGP peering. The Route Server then automatically injects these routes into the effective routes of virtual machines in both the hub and spoke virtual networks.

**Key requirements for route injection:**
- Spoke virtual networks must be peered with the hub virtual network
- Virtual network peering must include the setting **Use the remote virtual network's gateway or Route Server**
- Network virtual appliance must establish BGP peering with Route Server

This approach eliminates the need for manual user-defined routes in spoke networks, as the Route Server handles route distribution automatically. For example, a default route (0.0.0.0/0) advertised by the NVA directs all traffic from spoke networks through the security appliance for inspection.

## On-premises connectivity through network virtual appliances

Network virtual appliances can provide connectivity to on-premises networks through various technologies including IPsec VPNs and SD-WAN solutions. Route Server's dynamic routing capabilities enhance these scenarios by enabling automatic route exchange between Azure and on-premises networks.

:::image type="content" source="./media/route-injection-in-spokes/route-injection-vpn.png" alt-text="Diagram showing hub-and-spoke topology with on-premises connectivity through network virtual appliance and automatic route injection.":::

### Bidirectional route learning

In this configuration, Route Server facilitates bidirectional route learning:

**Azure to on-premises**: The NVA learns Azure network prefixes from Route Server and advertises them to on-premises networks using dynamic routing protocols.

**On-premises to Azure**: The NVA receives on-premises routes and advertises them to Route Server, which injects them into spoke virtual networks.

This dynamic approach eliminates the need for static route configuration and automatically adapts to network topology changes on both sides of the connection.

## Private traffic inspection strategies

When you implement traffic inspection for spoke-to-spoke and spoke-to-on-premises communication, understanding Route Server's route advertisement behavior is essential for proper configuration.

### Route advertisement limitations

Azure Route Server has specific behaviors when handling route advertisements:

- **Equal or longer prefixes**: Route Server doesn't advertise routes with prefixes equal to or longer than the virtual network address space
- **Shorter prefixes**: Route Server advertises routes with shorter prefixes (supernets) than the virtual network address space

### Supernet approach for private traffic inspection

To inspect private traffic between spokes, configure the NVA to advertise supernets that encompass your virtual network address spaces:

:::image type="content" source="./media/route-injection-in-spokes/influencing-private-traffic-nva.png" alt-text="Diagram showing supernet route injection through Azure Route Server for private traffic inspection between spoke virtual networks.":::

**Example configuration:**
- Virtual network address space: `10.0.0.0/16`
- NVA advertised route: `10.0.0.0/8` (supernet)
- Result: Route Server injects the supernet route, directing traffic through the NVA

This behavior is consistent with [BGP route advertisement principles with VPN Gateway](../vpn-gateway/vpn-gateway-vpn-faq.md#advertise-exact-prefixes).

> [!IMPORTANT]
> When routes with identical prefix lengths are advertised from both ExpressRoute and NVAs, Azure prioritizes ExpressRoute routes. For more information about route selection, see [Routing preference](hub-routing-preference.md).

> [!IMPORTANT]
> If you have a scenario where prefixes with the same length are being advertised from ExpressRoute and the NVA, Azure prefers and programs the routes learned from ExpressRoute. For more information, see [Routing preference](hub-routing-preference.md).

## Hybrid connectivity with virtual network gateways

When you combine Route Server with VPN or ExpressRoute gateways in the same virtual network, route precedence becomes important for traffic flow management.

:::image type="content" source="./media/route-injection-in-spokes/route-injection-vpn-and-expressroute.png" alt-text="Diagram showing hub-and-spoke topology with both network virtual appliance and ExpressRoute gateway providing on-premises connectivity.":::

### Route precedence behavior

Virtual network gateway routes take precedence over Route Server-injected routes due to their specificity:

- **Gateway routes**: More specific prefixes learned from VPN or ExpressRoute gateways
- **Route Server routes**: Less specific routes (such as default routes) from NVAs

This precedence means that on-premises prefixes learned by gateways override default routes injected by Route Server, ensuring optimal routing for known destinations.

### Controlling route propagation

To manage which routes reach spoke virtual networks:

**Disable gateway route propagation**: Prevent spoke subnets from learning on-premises routes by disabling "Propagate gateway routes" on spoke route tables.

**Use default route UDRs**: Configure user-defined routes with 0.0.0.0/0 pointing to the NVA to ensure traffic inspection.

**BGP community control**: Configure NVAs to advertise routes with the `no-advertise` BGP community (65535:65282) to prevent Route Server from advertising routes to other BGP peers.

> [!NOTE]
> Disabling "Propagate gateway routes" also prevents spoke subnets from dynamically learning routes from Route Server. Plan your routing configuration accordingly.

## SD-WAN coexistence with ExpressRoute and Azure Firewall

Enterprise environments often combine SD-WAN, ExpressRoute, and Azure Firewall to provide comprehensive connectivity and security. Route Server enables seamless integration of these technologies while maintaining centralized traffic inspection.

:::image type="content" source="./media/route-injection-in-spokes/route-injection-vpn-expressroute-firewall.png" alt-text="Diagram showing hub-and-spoke topology with SD-WAN, ExpressRoute, and Azure Firewall integration through Route Server.":::

### Architecture components

**Spoke networks**: Configure with route tables that prevent learning routes from ExpressRoute or Route Server, using default routes (0.0.0.0/0) pointing to Azure Firewall.

**Azure Firewall**: Learns routes from both ExpressRoute and SD-WAN NVAs through Route Server, making intelligent routing decisions for on-premises traffic.

**Route advertisement control**: SD-WAN NVAs should advertise routes with the `no-advertise` BGP community to prevent route injection back to on-premises via ExpressRoute.

### Private endpoint considerations

When implementing this architecture with private endpoints, consider routing symmetry requirements:

- **Asymmetric routing risk**: Traffic from on-premises to private endpoints bypasses firewall inspection
- **Solution**: Enable [Route Table network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md) on subnets hosting private endpoints

This configuration ensures routing symmetry and maintains security policies for private endpoint traffic.

## Traffic symmetry considerations

When you deploy multiple NVA instances for high availability or scalability, maintaining traffic symmetry is crucial for stateful network appliances such as next-generation firewalls.

### Traffic flow scenarios

**Internet-bound traffic**: NVAs use source network address translation (SNAT) to ensure return traffic reaches the same appliance that processed the outbound flow.

**Inbound internet traffic**: NVAs require both destination NAT (DNAT) and source NAT (SNAT) to ensure bidirectional traffic symmetry.

**Azure-to-Azure traffic**: Since source virtual machines make independent routing decisions, SNAT is necessary to achieve traffic symmetry across multiple NVA instances.

### High availability deployment options

**Active/active configuration**: Deploy multiple NVA instances with identical route advertisements and use SNAT for traffic symmetry.

**Active/passive configuration**: Deploy multiple NVA instances where the secondary advertises routes with longer AS paths, ensuring primary path preference until failover.

### Route Server limitations

Route Server operates only in the control plane and doesn't participate in data plane traffic forwarding. When advertising routes to Route Server, NVAs must specify next hop destinations as:

- The NVA itself
- A load balancer fronting the NVA
- Another NVA or firewall in the same virtual network

This design ensures proper traffic forwarding while maintaining Route Server's role as a routing control point. 


## Related content

- Learn more about [Azure Route Server support for ExpressRoute and Azure VPN](expressroute-vpn-support.md).
- Learn how to [Configure peering between Azure Route Server and Network Virtual Appliance](tutorial-configure-route-server-with-quagga.md).


