---
title: 'Default route injection in spoke VNets'
description: Learn about how Azure Route Server injects routes in VNets.
services: route-server
author: halkazwini
ms.service: route-server
ms.topic: conceptual
ms.date: 10/03/2022
ms.author: halkazwini
---

# Default route injection in spoke VNets

One of the most common architectures in Azure is the hub and spoke design, where workloads deployed in a spoke VNet send traffic through shared network devices that exist in a hub VNet. User Defined Routes (UDR) typically need to be configured in the spoke VNets to steer traffic towards security devices in the hub. However, this requires administrators to manage these routes across many spokes. 

Azure Route Server offers a centralized point where Network Virtual Appliances (NVAs) can inject routes that will be programmed for every virtual machine in the spoke, thus eliminating the need for spoke administrators to create and update route tables. 

## Topology

The following diagram depicts a simple hub and spoke design with a hub VNet and two spoke VNets. In the hub, a Network Virtual Appliance and a Route Server have been deployed. Without a Route Server, User-Defined Routes (UDRs) would have to be configured in every spoke (usually containing a default route for 0.0.0.0/0), that send all traffic from the spokes through the NVA, for example to get it inspected for security purposes.

:::image type="content" source="./media/scenarios/route-injection.png" alt-text="This network diagram shows a basic hub and spoke topology.":::

However, if the NVA advertises network prefixes to the Route Server, they will appear as effective routes in any virtual machine deployed in the hub VNet or spoke VNets that are peered with the hub VNet with the setting "Use remote virtual network's gateway". 

## Connectivity to on-premises through the NVA

If the NVA is used to provide connectivity to on-premises network via IPsec VPNs or SD-WAN technologies, the same mechanism can be used to attract traffic from the spokes to the NVA. Additionally, the NVA can dynamically learn the Azure prefixes from the Azure Route Server, and advertise them with a dynamic routing protocol to on-premises. The following diagram describes this setup:

:::image type="content" source="./media/scenarios/route-injection-vpn.png" alt-text="This network diagram shows a basic hub and spoke topology with on-premises connectivity via a V P N N V A.":::

## Inspecting Private Traffic through the NVA

The previous sections depict the traffic being inspected by the Network Virtual Appliance by injecting a `0.0.0.0/0` default route from the Network Virtual Appliance to the Route Server. However, if you wish to only inspect spoke-to-spoke and spoke-to-on-premises traffic through the NVA you should consider that Azure Route Server won't advertise a route that is the same or longer prefix than the VNet address space learned from the NVA. In other words, Azure Route Server won't inject these prefixes into the Virtual Network and won't be programmed on the NICs of the hubs or spokes. 

Azure Route Server, however, will advertise a larger subnet than the VNet address space that is learned from the NVA. It's possible to advertise a supernet from the NVA such as the RFC 1918 address space (`10.0.0.0/8`, `192.168.0.0/16` and `172.16.0.0/12`) to the Azure Route Server and these prefixes will be injected into the hubs and spoke VNets. Ultimately, the NVA will contain the necessary routes to reach the spokes and on-premises destinations. This VNet behavior is referenced in [About BGP with VPN Gateway](../vpn-gateway/vpn-gateway-bgp-overview.md#can-i-advertise-the-exact-prefixes-as-my-virtual-network-prefixes).

:::image type="content" source="./media/scenarios/influencing-private-traffic-nva.png" alt-text="This network diagram depicts the injection of private prefixes through Azure Route Server and N V A.":::

> [!IMPORTANT]
> If you have a scenario where prefixes with the same length are being advertised from ExpressRoute and the NVA, Azure will prefer and program the routes learned from ExpressRoute. For more information read onto the next section.
>


## Connectivity to on-premises through Azure Virtual Network Gateways

If a VPN or an ExpressRoute gateway exists in the same VNet as the Route Server and NVA to provide connectivity to on-premises networks, routes learned by these gateways will be programmed as well in the spoke VNets. These routes would override the default route injected by the Route Server, since they would be more specific (longer network masks). The following diagram describes the previous design, where an ExpressRoute gateway has been added.

:::image type="content" source="./media/scenarios/route-injection-vpn-and-expressroute.png" alt-text="This network diagram shows a basic hub and spoke topology with on-premises connectivity via a V P N N V A and ExpressRoute.":::

You can't configure the subnets in the spoke VNets to only learn the routes from the Azure Route Server. Disabling "Propagate gateway routes" in a route table associated to a subnet would prevent both types of routes (routes from the Virtual Network Gateway and routes from the Azure Route Server) to be injected on NICs in that subnet.

Note that Azure Route Server per default will advertise all prefixes learned from the NVA to ExpressRoute too. This might not be desired, for example because of the route limits of ExpressRoute or the Route Server itself. In that case, the NVA can announce its routes to the Route Server including the BGP community `no-advertise` (with value 65535:65282). When Azure Route Server receives routes with this BGP community, it will push them to the subnets, but it will not advertise them to any other BGP peer (like ExpressRoute or VPN gateways, or other NVAs).

## SDWAN coexistence with ExpressRoute and Azure Firewall

A particular case of the previous design is when customers insert the Azure Firewall in the traffic flow to inspect all traffic going to on-premises networks, either via ExpressRoute or via SD-WAN/VPN appliances. In this situation, all spoke subnets have route tables that prevent the spokes from learning any route from ExpressRoute or the Route Server, and have default routes (0.0.0.0/0) with the Azure Firewall as next hop, as the following diagram shows:

:::image type="content" source="./media/scenarios/route-injection-vpn-expressroute-firewall.png" alt-text="This network diagram shows hub and spoke topology with on-premises connectivity via N V A for V P N and ExpressRoute where Azure Firewall does the breakout.":::

The Azure Firewall subnet will learn the routes coming from both ExpressRoute and the VPN/SDWAN NVA, and will decide whether sending traffic one way or the other. As described in the previous section, if the NVA appliance advertises more than 200 routes to the Azure Route Server, it should send its BGP routes marked with the BGP community `no-advertise`. This way, the SDWAN prefixes won't be injected back to on-premises via Express-Route.

## Traffic symmetry

If multiple NVA instances are used for in an active/active fashion for better resiliency or scalability, traffic symmetry will be a requirement if the NVAs need to keep the state of the connections. This is, for example,  the case of Next Generation Firewalls.

- For connectivity from the Azure virtual machines to the public Internet, the NVA will use Source Network Address Translation (SNAT) so that the egress traffic will be sourced from the NVA's public IP address, hence achieving traffic symmetry.
- For inbound traffic from the Internet to workloads running in virtual machines, additional to Destination Network Address Translation (DNAT) the NVAs will require to do Source Network Address Translation (SNAT), to make sure that the return traffic from the virtual machines lands at the same NVA instance that processed the first packet.
- For Azure-to-Azure connectivity, since the source virtual machine will take the routing decision independently of the destination, SNAT is required today to achieve traffic symmetry.

Multiple NVA instances can be deployed in an active/passive setup as well, for example if one of them advertises worse routes (with a longer AS path) than the other. In this case, Azure Route Server will only inject the preferred route in the VNet virtual machines, and the less preferred route will only be used when the primary NVA instance stops advertising over BGP.

## Different Route Servers to advertise routes to Virtual Network Gateways and to VNets

As the previous sections have shown, Azure Route Server has a double role:

- It learns and advertises routes to/from Virtual Network Gateways (VPN and ExpressRoute)
- It configures learned routes on its VNet, and on directly peered VNets

This dual functionality often is interesting, but at times it can be detrimental to certain requirements. For example, if the Route Server is deployed in a VNet with an NVA advertising a 0.0.0.0/0 route and an ExpressRoute gateway advertising prefixes from on-premises, it will configure all routes (both the 0.0.0.0/0 from the NVA and the on-premises prefixes) on the virtual machines in its VNet and directly peered VNets. As a consequence, since the on-premises prefixes will be more specific than 0.0.0.0/0, traffic between on-premises and Azure will bypass the NVA. If this isn't desired, the previous sections in this article have shown how to disable BGP propagation in the VM subnets and configure UDRs.

However, there's an alternative, more dynamic approach. It's possible using different Azure Route Servers for different functionality: one of them will be responsible for interacting with the Virtual Network Gateways, and the other one for interacting with the Virtual Network routing. The following diagram shows a possible design for this:

:::image type="content" source="./media/scenarios/route-injection-split-route-server.png" alt-text="This network diagram shows a basic hub and spoke topology with on-premises connectivity via ExpressRoute and two Route Servers.":::

In the figure above, Azure Route Server 1 in the hub is used to inject the prefixes from the SDWAN into ExpressRoute. Since the spokes are peered with the hub VNet without the "Use Remote Gateways" and "Allow Gateway Transit" VNet peering options, the spokes won't learn these routes (neither the SDWAN prefixes nor the ExpressRoute prefixes).

To propagate routes to the spokes the NVA uses a second Azure Route Server 2, deployed in a new auxiliary VNet. The NVA will only propagate a single `0.0.0.0/0` route to this Azure Route Server 2. Since the spokes are peered with this auxiliary VNet with "Use Remote Gateways" and "Allow Gateway Transit" VNet peering options, this `0.0.0.0/0` route will be learned by all the Virtual Machines in the spokes.

The next hop for this `0.0.0.0/0` route will be the NVA, so the spokes still need to be peered to the hub VNet. Another important aspect to notice is that the hub VNet needs to be peered to the VNet where the new Azure Route Server 2 is deployed, otherwise it will not be able to create the BGP adjacency.

This design allows automatic injection of routes in a spoke VNets without interference from other routes learned from ExpressRoute, VPN or an SDWAN environment.

## Next steps

* [Learn how Azure Route Server works with ExpressRoute](expressroute-vpn-support.md)
* [Learn how Azure Route Server works with a network virtual appliance](resource-manager-template-samples.md)
