---
title: 'Default route injection in spoke VNets'
description: Learn about how Azure Route Server injects routes in VNets.
services: route-server
author: jomore
ms.service: route-server
ms.topic: conceptual
ms.date: 02/03/2022
ms.author: jomore
---

# Routes in spoke VNets

One of the most common architectures in Azure is the hub and spoke design, where workloads deployed in a spoke VNet send traffic through shared network devices that exist in a hub VNet. User Defined Routes (UDR) typically need to be configured in the spoke VNets to steer traffic towards security devices in the hub. However, this requires administrators to manage these routes across many spokes. 

Azure Route Server offers a centralized point where Network Virtual Appliances (NVAs) can inject routes that will be programmed for every virtual machine in the spoke, thus eliminating the need for spoke administrators to create route tables. 

## Topology

The following diagram depicts a simple hub and spoke design with a hub VNet and two spokes. In the hub a Network Virtual Appliance and a Route Server has been deployed. Typically, route tables would have to be configured in every spoke (usually containing a default route for 0.0.0.0/0), that send all traffic from the spokes through this NVA to get it inspected for security purposes.

:::image type="content" source="./media/senarios/route-injection.png" alt-text="Basic hub and spoke topology.":::

However, if the NVA advertises via BGP to the Route Server network prefixes, these will appear as effective routes in any virtual machine deployed in the hub or in any spoke. For spokes to "learn" the Route Server routes, they need to be peered with the hub VNet with the setting "Use Remote Gateway". 

## Connectivity to on-premises through the NVA

If the NVA is used to provide connectivity to on-premises network via IPsec VPNs or SD-WAN technologies, the same mechanism can be used to attract traffic from the spokes to the NVA. Additionally, the NVA can dynamically learn the Azure prefixes from the Azure Route Server, and advertise them with a dynamic routing protocol to on-premises. The following diagram describes this setup:

:::image type="content" source="./media/senarios/route-injection-vpn.png" alt-text="Basic hub and spoke topology with onprem connectivity via VPN.":::

## Connectivity to on-premises through Azure Virtual Network Gateways

If VPN or ExpresRoute gateways exist in the same VNet as the Route Server and NVA to provide connectivity to on-premises networks, routes learnt by these gateways will be programmed as well in the spoke VNets, overriding the routes injected by the Route Server if they are more specific (longer network masks). The following diagram describes the previous design, where an ExpressRoute gateway has been added.

:::image type="content" source="./media/senarios/route-injection-vpn-and-er.png" alt-text="Basic hub and spoke topology with onprem connectivity via VPN and ExpressRoute.":::

You cannot configure the subnets in the spoke VNets to only learn the routes from the Azure Route Server. Disabling "Virtual network gateway route propagation" in a route table associated to a subnet would prevent both types of routes (routes from the Virtual Network Gateway and routes from the Azure Route Server) to be programmed on NICs in that subnet.

## Next steps

* [Learn how Azure Route Server works with ExpressRoute](expressroute-vpn-support.md)
* [Learn how Azure Route Server works with a network virtual appliance](resource-manager-template-samples.md)
