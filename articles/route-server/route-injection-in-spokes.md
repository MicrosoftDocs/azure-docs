---
title: 'Default route injection in spoke VNets'
description: Learn about how Azure Route Server injects routes in VNets.
services: route-server
author: halkazwini
ms.service: route-server
ms.topic: conceptual
ms.date: 02/03/2022
ms.author: halkazwini
---

# Default route injection in spoke VNets

One of the most common architectures in Azure is the hub and spoke design, where workloads deployed in a spoke VNet send traffic through shared network devices that exist in a hub VNet. User Defined Routes (UDR) typically need to be configured in the spoke VNets to steer traffic towards security devices in the hub. However, this requires administrators to manage these routes across many spokes. 

Azure Route Server offers a centralized point where Network Virtual Appliances (NVAs) can inject routes that will be programmed for every virtual machine in the spoke, thus eliminating the need for spoke administrators to create route tables. 

## Topology

The following diagram depicts a simple hub and spoke design with a hub VNet and two spokes. In the hub a Network Virtual Appliance and a Route Server has been deployed. Without Route Server User-Defined Routes (UDRs) would have to be configured in every spoke (usually containing a default route for 0.0.0.0/0), that send all traffic from the spokes through this NVA, for example to get it inspected for security purposes.

:::image type="content" source="./media/scenarios/route-injection.png" alt-text="This network diagram shows a basic hub and spoke topology.":::

However, if the NVA advertises via BGP to the Route Server network prefixes, these will appear as effective routes in any virtual machine deployed in the hub or in any spoke. For spokes to "learn" the Route Server routes, they need to be peered with the hub VNet with the setting "Use Remote Gateway". 

## Connectivity to on-premises through the NVA

If the NVA is used to provide connectivity to on-premises network via IPsec VPNs or SD-WAN technologies, the same mechanism can be used to attract traffic from the spokes to the NVA. Additionally, the NVA can dynamically learn the Azure prefixes from the Azure Route Server, and advertise them with a dynamic routing protocol to on-premises. The following diagram describes this setup:

:::image type="content" source="./media/scenarios/route-injection-vpn.png" alt-text="This network diagram shows a basic hub and spoke topology with on-premises connectivity via a V P N N V A.":::

## Connectivity to on-premises through Azure Virtual Network Gateways

If a VPN or an ExpresRoute gateway exists in the same VNet as the Route Server and NVA to provide connectivity to on-premises networks, routes learned by these gateways will be programmed as well in the spoke VNets. These routes would override the default route injected by the Route Server, since they would be more specific (longer network masks). The following diagram describes the previous design, where an ExpressRoute gateway has been added.

:::image type="content" source="./media/scenarios/route-injection-vpn-and-expressroute.png" alt-text="This network diagram shows a basic hub and spoke topology with on-premises connectivity via a V P N N V A and ExpressRoute.":::

You cannot configure the subnets in the spoke VNets to only learn the routes from the Azure Route Server. Disabling "Virtual network gateway route propagation" in a route table associated to a subnet would prevent both types of routes (routes from the Virtual Network Gateway and routes from the Azure Route Server) to be injected on NICs in that subnet.

Note that Azure Route Server per default will advertise all prefixes learnt from the NVA to ExpressRoute too. This might not be desired, for example because of the route limits of ExpressRoute or the Route Server itself. In that case, the NVA can announce its routes to the Route Server including the BGP community `no-advertise` (with value 65535:65282). When Azure Route Server receives routes with this BGP community, it will push them to the subnets, but it will not advertise them to any other BGP peer (like ExpressRoute or VPN gateways, or other NVAs).

## SDWAN coexistence with ExpressRoute and Azure Firewall

A particular case of the previous design is when customers insert the Azure Firewall in the traffic flow to inspect all traffic going to on-premises networks, either via ExpressRoute or via SD-WAN/VPN appliances. In this situation, all spoke subnets have route tables that prevent the spokes from learning any route from ExpressRoute or the Route Server, and have default routes (0.0.0.0/0) with the Azure Firewall as next hop, as the following diagram shows:

:::image type="content" source="./media/scenarios/route-injection-vpn-expressroute-firewall.png" alt-text="This network diagram shows hub and spoke topology with on-premises connectivity via N V A for V P N and ExpressRoute where Azure Firewall does the breakout.":::

The Azure Firewall subnet will learn the routes coming from both ExpressRoute and the VPN/SDWAN NVA, and will decide whether sending traffic one way or the other. As described in the previous section, if the NVA appliance advertises more than 200 routes to the Azure Route Server, it should send its BGP routes marked with the BGP community `no-advertise`. This way, the SDWAN prefixes will not be injected back to on-premises via Express-Route.

## Traffic symmetry

If multiple NVA instances are used for in an active/active fashion for better resiliency or scalability, traffic symmetry will be a requirement if the NVAs need to keep the state of the connections. This is for example the case of Next Generation Firewalls.

- For connectivity from the Azure virtual machines to the public Internet, the NVA will use Source Network Address Translation (SNAT) so that the egress traffic will be sourced from the NVA's public IP address, hence achieving traffic symmetry.
- For inbound traffic from the Internet to workloads running in virtual machines, additional to Destination Network Address Translation (DNAT) the NVAs will require to do Source Network Address Translation (SNAT), to make sure that the return traffic from the virtual machines lands at the same NVA instance that processed the first packet.
- For Azure-to-Azure connectivity, since the source virtual machine will take the routing decision independently of the destination, SNAT is required today to achieve traffic symmetry.

Multiple NVA instances can be deployed in an active/passive setup as well, for example if one of them advertises worse routes (with a longer AS path) than the other. In this case, Azure Route Server will only inject the preferred route in the VNet virtual machines, and the less preferred route will only be used when the primary NVA instance stops advertising over BGP.

## Next steps

* [Learn how Azure Route Server works with ExpressRoute](expressroute-vpn-support.md)
* [Learn how Azure Route Server works with a network virtual appliance](resource-manager-template-samples.md)
