---
title: 'Multi-region designs with Route Server'
description: Learn about how Azure Route Server enables multi-region designs.
services: route-server
author: jomore
ms.service: route-server
ms.topic: conceptual
ms.date: 02/03/2022
ms.author: jomore
---

# Multi-region networking

Applications that have high availability or disaster recovery requirements often need to be deployed in more than one Azure region, where spoke VNets in multiple regions need to communicate between each other. A possibility to achieve this communication pattern is peering all spokes that need to communicate to each other, but those flows would bypass the firewall. Another possibility is using User Defined routes, but that can be difficult to maintain. Azure Route Server offers an alternative which is very dynamic and adapts to topology changes without manual intervention.

## Topology

The following diagram shows a dual-region architecture, where a hub and spoke topology exists in each region, and the hub VNets are peered to each other.

:::image type="content" source="./media/senarios/multiregion.png" alt-text="Diagram of multi-region design with Route Server.":::

Each NVA learns the prefixes from the local hub and spokes from its Azure Route Server, and will communicate it to the NVA in the other region via BGP. This communication between the NVAs should be established over an encapsulation technology such as IPsec or VXLAN, since otherwise routing loops can occur in the network.

The spokes need to be peered with the hub VNet with the setting "Use Remote Gateways", so that the Route Server advertises their prefixes to the local NVAs, and learnt routes can be programmed for virtual machines in those spokes. 

The NVAs will advertise to their local Route Server the routes that they learnt from the remote region, and Route Server will configure these routes in the local spokes, hence attracting traffic. If there are multiple NVAs in the same region (Route Server supports 8 BGP adjacencies), AS path prepending can be used to make one of the NVAs preferred to the others.

## ExpressRoute

This design can be combined with ExpressRoute or VPN gateways. The following diagram shows a topology including an ExpressRoute gateway in one of the regions connected to an on-premises network. In this case, an overlay network over the ExpressRoute circuit will help to simplify the network, so that on-premises prefixes will only appear in Azure as advertised by the NVA (and not from the ExpressRoute gateway).

:::image type="content" source="./media/senarios/multiregion-with-er.png" alt-text="Diagram of multi-region design with Route Server and ExpressRoute.":::

## Design without overlays

The cross-region tunnels between the NVAs are required because otherwise a routing loop is formed. For example, looking at the NVA in region 1:

- The NVA in region 1 learns the prefixes from region 2, and advertises them to the Route Server in region 1
- The Route Server in region 1 will program routes for those prefixes in all subnets in the local region, with the NVA in region 1 as the next hop
- For traffic from region 1 to region 2, when the NVA in region 1 sends traffic to the other NVA, its own subnet inherits as well the routes programmed by the Route Server, which are pointing to itself (the NVA). So the packet is returned to the NVA, and a routing loop appears.

If UDRs are an option, you could disable BGP route propagation in the NVAs' subnets, and configure static UDRs so that Azure can route traffic to the remote spokes. Note that this option is still easier to manage than the design without Route Server, since only UDRs in the hub are needed (as apposed as UDRs in the spokes). 

## Next steps

* [Learn how Azure Route Server works with ExpressRoute](expressroute-vpn-support.md)
* [Learn how Azure Route Server works with a network virtual appliance](resource-manager-template-samples.md)
