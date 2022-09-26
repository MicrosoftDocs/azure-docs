---
title: 'Multi-region designs with Azure Route Server'
description: Learn about how Azure Route Server enables multi-region designs.
services: route-server
author: halkazwini
ms.service: route-server
ms.topic: conceptual
ms.date: 02/03/2022
ms.author: halkazwini
---

# Multi-region networking with Azure Route Server

Applications that have demanding requirements around high availability or disaster recovery often need to be deployed in more than one Azure region, where spoke VNets in multiple regions need to communicate between each other. A possibility to achieve this communication pattern is peering to each other all spokes that need to communicate, but those flows would bypass any central NVAs in the hubs, such as firewalls. Another possibility is using User Defined Routes (UDRs) in the subnets where the hub NVAs are deployed, but that can be difficult to maintain. Azure Route Server offers an alternative which is very dynamic and adapts to topology changes without manual intervention.

## Topology

The following diagram shows a dual-region architecture, where a hub and spoke topology exists in each region, and the hub VNets are peered to each other via VNet global peering:

:::image type="content" source="./media/scenarios/multiregion.png" alt-text="Diagram of multi-region design with Azure Route Server.":::

Each NVA learns the prefixes from the local hub and spokes from its Azure Route Server, and will communicate it to the NVA in the other region via BGP. This communication between the NVAs should be established over an encapsulation technology such as IPsec or Virtual eXtensible LAN (VXLAN), since otherwise routing loops can occur in the network.

The spokes need to be peered with the hub VNet with the setting "Use Remote Gateways", so that Azure Route Server advertises their prefixes to the local NVAs, and it injects learnt routes back into the spokes. 

The NVAs will advertise to their local Route Server the routes that they learn from the remote region, and Route Server will configure these routes in the local spokes, hence attracting traffic. If there are multiple NVAs in the same region (Route Server supports up to 8 BGP adjacencies), AS path prepending can be used to make one of the NVAs preferred to the others, hence defining an active/standby NVA topology.

Note that when an NVA advertises routes coming from a Route Server in a remote region to its local Route Server, it should remove the Autonomous System Number (ASN) 65515 from the AS path of the routes. This is known in certain BGP platforms as "AS override" or "AS-path rewrite". Otherwise, the local Route Server will not learn those routes, as the BGP loop prevention mechanism forbids learning routes that already contain the local ASN.

## ExpressRoute

This design can be combined with ExpressRoute or VPN gateways. The following diagram shows a topology including an ExpressRoute gateway connected to an on-premises network in one of the Azure regions. In this case, an overlay network over the ExpressRoute circuit will help to simplify the network, so that on-premises prefixes will only appear in Azure as advertised by the NVA (and not from the ExpressRoute gateway).

:::image type="content" source="./media/scenarios/multiregion-with-er.png" alt-text="Diagram of multi-region design with Route Server and ExpressRoute.":::

## Design without overlays

The cross-region tunnels between the NVAs are required because otherwise a routing loop is formed. For example, looking at the NVA in region 1:

- The NVA in region 1 learns the prefixes from region 2, and advertises them to the Route Server in region 1
- The Route Server in region 1 will inject routes for those prefixes in all subnets in the local region, with the NVA in region 1 as the next hop
- For traffic from region 1 to region 2, when the NVA in region 1 sends traffic to the other NVA, its own subnet inherits as well the routes programmed by the Route Server, which are pointing to itself (the NVA). So the packet is returned to the NVA, and a routing loop appears.

If UDRs are an option, you could disable BGP route propagation in the NVAs' subnets, and configure static UDRs instead of an overlay, so that Azure can route traffic to the remote spokes. 

## Next steps

* [Learn how Azure Route Server works with ExpressRoute](expressroute-vpn-support.md)
* [Learn how Azure Route Server works with a network virtual appliance](resource-manager-template-samples.md)
