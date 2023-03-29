---
title: Default route injection in spoke virtual networks
titleSuffix: Azure Route Server
description: Learn about how Azure Route Server injects routes in virtual networks (VNets).
services: route-server
author: halkazwini
ms.service: route-server
ms.topic: conceptual
ms.date: 03/29/2023
ms.author: halkazwini
ms.custom: template-concept, engagement-fy23
---

# Default route injection in spoke virtual networks

One of the most common architectures in Azure is the hub and spoke design, where workloads deployed in a spoke virtual network (VNet) send traffic through shared network devices that exist in the hub VNet. User-defined routes (UDR) typically need to be configured in the spoke VNets to steer traffic towards security devices in the hub. However, this design requires administrators to manage these routes across many spokes. 

Azure Route Server offers a centralized point where network virtual appliances (NVAs) can advertise routes that it injects in the spoke VNets. This way, administrators don’t have to create and update route tables in spoke VNets. 

## Topology

The following diagram depicts a simple hub and spoke design with a hub VNet and two spoke VNets. In the hub, a network virtual appliance and a Route Server have been deployed. Without the Route Server, user-defined routes would have to be configured in every spoke. These UDRs would usually contain a default route for 0.0.0.0/0 that sends all traffic from the spoke VNets through the NVA. This scenario can be used, for example, to inspect the traffic for security purposes.

:::image type="content" source="./media/scenarios/route-injection.png" alt-text="Diagram showing a basic hub and spoke topology.":::

With the Route Server in the hub VNet, there's no need to use user-defined routes. The NVA advertises network prefixes to the Route Server, which injects them so they appear in the effective routes of any virtual machine deployed in the hub VNet or spoke VNets that are peered with the hub VNet with the setting *Use the remote virtual network's gateway or Route Server*.

## Connectivity to on-premises through the NVA

If the NVA is used to provide connectivity to on-premises network via IPsec VPNs or SD-WAN technologies, the same mechanism can be used to attract traffic from the spokes to the NVA. Additionally, the NVA can dynamically learn the Azure prefixes from the Azure Route Server, and advertise them with a dynamic routing protocol to on-premises. The following diagram describes this setup:

:::image type="content" source="./media/scenarios/route-injection-vpn.png" alt-text="Diagram showing a basic hub and spoke topology with on-premises connectivity via an NVA.":::

## Inspecting private traffic through the NVA

The previous sections depict the traffic being inspected by the network virtual appliance (NVA) by injecting a `0.0.0.0/0` default route from the NVA to the Route Server. However, if you wish to only inspect spoke-to-spoke and spoke-to-on-premises traffic through the NVA, you should consider that Azure Route Server doesn't advertise a route that is the same or longer prefix than the virtual network address space learned from the NVA. In other words, Azure Route Server won't inject these prefixes into the virtual network and they won't be programmed on the NICs of virtual machines in the hub or spoke VNets. 

Azure Route Server, however, will advertise a larger subnet than the VNet address space that is learned from the NVA. It's possible to advertise from the NVA a supernet of what you have in your virtual network. For example, if your virtual network uses the RFC 1918 address space `10.0.0.0/16`, your NVA can advertise `10.0.0.0/8` to the Azure Route Server and these prefixes will be injected into the hub and spoke VNets. This VNet behavior is referenced in [About BGP with VPN Gateway](../vpn-gateway/vpn-gateway-bgp-overview.md#can-i-advertise-the-exact-prefixes-as-my-virtual-network-prefixes).

:::image type="content" source="./media/scenarios/influencing-private-traffic-nva.png" alt-text="Diagram showing the injection of private prefixes through Azure Route Server and NVA.":::

> [!IMPORTANT]
> If you have a scenario where prefixes with the same length are being advertised from ExpressRoute and the NVA, Azure will prefer and program the routes learned from ExpressRoute. For more information, see the next section.

## Connectivity to on-premises through virtual network gateways

If a VPN or an ExpressRoute gateway exists in the same virtual network as the Route Server and NVA to provide connectivity to on-premises networks, routes learned by these gateways will be programmed as well in the spoke VNets. These routes override the default route (`0.0.0.0/0`) injected by the Route Server, since they would be more specific (longer network masks). The following diagram describes the previous design, where an ExpressRoute gateway has been added.

:::image type="content" source="./media/scenarios/route-injection-vpn-and-expressroute.png" alt-text="Diagram showing a basic hub and spoke topology with on-premises connectivity via an NVA and ExpressRoute.":::

You can't configure the subnets in the spoke VNets to only learn the routes from the Azure Route Server. Disabling "Propagate gateway routes" in a route table associated to a subnet would prevent both types of routes (routes from the virtual network gateway and routes from the Azure Route Server) to be injected into NICs in that subnet.

By default, the Route Server advertises all prefixes learned from the NVA to ExpressRoute too. This might not be desired, for example because of the route limits of ExpressRoute or the Route Server itself. In that case, the NVA can announce its routes to the Route Server including the BGP community `no-advertise` (with value `65535:65282`). When Route Server receives routes with this BGP community, it injects them to the subnets, but it will not advertise them to any other BGP peers (like ExpressRoute or VPN gateways, or other NVAs).

## SDWAN coexistence with ExpressRoute and Azure Firewall

A particular case of the previous design is when customers insert the Azure Firewall in the traffic flow to inspect all traffic going to on-premises networks, either via ExpressRoute or via SD-WAN/VPN appliances. In this situation, all spoke subnets have route tables that prevent the spokes from learning any route from ExpressRoute or the Route Server, and have default routes (0.0.0.0/0) with the Azure Firewall as next hop, as the following diagram shows:

:::image type="content" source="./media/scenarios/route-injection-vpn-expressroute-firewall.png" alt-text="Diagram showing hub and spoke topology with on-premises connectivity via NVA for VPN and ExpressRoute where Azure Firewall does the breakout.":::

The Azure Firewall subnet learns the routes coming from both ExpressRoute and the VPN/SDWAN NVA, and decides whether sending traffic one way or the other. As described in the previous section, if the NVA appliance advertises more than 200 routes to the Route Server, it should send its BGP routes marked with the BGP community `no-advertise`. This way, the SDWAN prefixes won't be injected back to on-premises via Express-Route.

## Traffic symmetry

If multiple NVA instances are used in active/active scenario for better resiliency or scalability, traffic symmetry will be a requirement if the NVAs need to keep the state of the connections. This is, for example, the case of Next Generation Firewalls.

- For connectivity from the Azure virtual machines to the public internet, the NVA uses source network address translation (SNAT) so that the egress traffic will be sourced from the NVA's public IP address, hence achieving traffic symmetry.
- For inbound traffic from the internet to workloads running in virtual machines, additional to destination network address translation (DNAT), the NVAs will require to do source network address translation (SNAT), to make sure that the return traffic from the virtual machines lands at the same NVA instance that processed the first packet.
- For Azure-to-Azure connectivity, since the source virtual machine will take the routing decision independently of the destination, SNAT is required today to achieve traffic symmetry.

Multiple NVA instances can be deployed in an active/passive setup as well, for example if one of them advertises worse routes (with a longer AS path) than the other. In this case, Azure Route Server will only inject the preferred route in the VNet virtual machines, and the less preferred route will only be used when the primary NVA instance stops advertising over BGP.

## Different Route Servers to advertise routes to Virtual Network Gateways and to VNets

As the previous sections have shown, Azure Route Server has a double role:

- It learns and advertises routes to/from virtual network gateways (VPN and ExpressRoute)
- It configures learned routes on its VNet, and on directly peered VNets

This dual functionality often is interesting, but at times it can be detrimental to certain requirements. For example, if the Route Server is deployed in a VNet with an NVA advertising a 0.0.0.0/0 route and an ExpressRoute gateway advertising prefixes from on-premises, it will configure all routes (both the 0.0.0.0/0 from the NVA and the on-premises prefixes) on the virtual machines in its VNet and directly peered VNets. As a consequence, since the on-premises prefixes will be more specific than 0.0.0.0/0, traffic between on-premises and Azure will bypass the NVA. If this isn't desired, the previous sections in this article have shown how to disable BGP propagation in the VM subnets and configure UDRs.

However, there's an alternative, more dynamic approach. It's possible using different Azure Route Servers for different functionality: one of them will be responsible for interacting with the virtual network gateways, and the other one for interacting with the virtual network routing. The following diagram shows a possible design for this:

:::image type="content" source="./media/scenarios/route-injection-split-route-server.png" alt-text="Diagram showing a basic hub and spoke topology with on-premises connectivity via ExpressRoute and two Route Servers.":::

Route Server 1 in the hub is used to inject the prefixes from the SDWAN into ExpressRoute. Since the spoke VNets are peered with the hub VNet without the *Use the remote virtual network's gateway or Route Server* (in the spoke VNet peering) and *Use this virtual network's gateway or Route Server* (in the hub VNet peering), the spoke VNets don't learn these routes (neither the SDWAN prefixes nor the ExpressRoute prefixes).

To propagate routes to the spoke VNets, the NVA uses Route Server 2, deployed in a new auxiliary VNet. The NVA will only propagate a single `0.0.0.0/0` route to Route Server 2. Since the spoke VNets are peered with this auxiliary VNet with *Use the remote virtual network's gateway or Route Server* (in the spoke VNet peering) and *Use this virtual network's gateway or Route Server* (in the hub VNet peering), the `0.0.0.0/0` route will be learned by all the virtual machines in the spokes.

The next hop for the `0.0.0.0/0` route is the NVA, so the spoke VNets still need to be peered to the hub VNet. Another important aspect to notice is that the hub VNet needs to be peered to the VNet where Route Server 2 is deployed, otherwise it won't be able to create the BGP adjacency.

If traffic from ExpressRoute to the spoke VNets is to be sent to a firewall NVA for inspection, a route table in the GatewaySubnet is still required, otherwise the ExpressRoute virtual network gateway will send packets to the virtual machines using the routes learnt from VNet peering. The routes in this route table should match the spoke prefixes, and the next hop should be the IP address of the firewall NVA (or the load balancer in front of the firewall NVAs, for redundancy). The firewall NVA can be the same as the SDWAN NVA in the diagram above, or it can be a different device such as Azure Firewall, since the SDWAN NVA can advertise routes with the next-hop pointing to other IP addresses. The following diagram shows this design with the addition of Azure Firewall:

:::image type="content" source="./media/scenarios/route-injection-split-route-server-with-firewall.png" alt-text="Diagram showing a basic hub and spoke topology with on-premises connectivity via ExpressRoute, an Azure Firewall and two Route Servers.":::

This design allows automatic injection of routes in spoke VNets without interference from other routes learned from ExpressRoute, VPN or an SDWAN environment, and the addition of firewall NVAs for traffic inspection.

## Next steps

* Learn more about [Azure Route Server support for ExpressRoute and Azure VPN](expressroute-vpn-support.md)
* Learn how to [Configure peering between Azure Route Server and Network Virtual Appliance](tutorial-configure-route-server-with-quagga.md)
