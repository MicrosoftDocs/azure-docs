---
title: Multi-region designs with Azure Route Server
description: Learn how Azure Route Server enables multi-region designs.
services: route-server
author: halkazwini
ms.service: route-server
ms.topic: conceptual
ms.date: 03/31/2023
ms.author: halkazwini
ms.custom: template-concept, engagement-fy23
---

# Multi-region networking with Azure Route Server

Applications with demanding high availability or disaster recovery requirements often require to be deployed in more than one Azure regions. In such cases, spoke virtual networks (VNets) in different regions need to communicate with each other. One way to enable this communication is by peering all the required spoke VNets to each other. However, this approach would bypass any central network virtual appliances (NVAs) such as firewalls in the hubs. An alternative is to use user-defined routes (UDRs) in the subnets where hub NVAs are deployed, but maintaining UDRs can be challenging. Azure Route Server offers a dynamic alternative that adapts to topology changes automatically, without requiring manual intervention.

## Topology

The following diagram shows a dual-region architecture, where a hub and spoke topology exists in each region, and the hub VNets are peered to each other via VNet global peering:

:::image type="content" source="./media/multiregion/multiregion.png" alt-text="Diagram showing multi-region design with Azure Route Server.":::

The NVA in each region learns the prefixes of the local hub and spoke VNets through the Azure Route Server and shares them with the NVA in the other region using BGP. To avoid routing loops, it's crucial to establish this communication between the NVAs using an encapsulation technology such as IPsec or Virtual eXtensible LAN (VXLAN).

To enable Azure Route Server to advertise the prefixes of the spoke VNets to the local NVAs and inject the learned routes back into the spoke VNets, it's essential to use *Use remote virtual network's gateway or Route Server* setting for peering between the spoke VNets and the hub VNet.

The NVAs advertises the routes they learn from the remote region to their local Route Server, which will then configure these routes in the local spoke VNets, attracting traffic accordingly. In cases where multiple NVAs exist in the same region (Route Server supports up to eight BGP peers), AS path prepending can be utilized to make one of the NVAs preferred over the others, effectively establishing an active/standby NVA topology.

> [!IMPORTANT]
> To ensure that the local Route Server can learn the routes advertised by the NVA from the remote region, the NVA must remove the autonomous system number (ASN) 65515 from the AS path of the routes. This technique is sometimes referred to as "AS override" or "AS-path rewrite" in certain BGP platforms. Otherwise, the BGP loop prevention mechanism will prevent the local Route Server from learning those routes since it prohibits the learning of routes that already contain the local ASN.

## ExpressRoute

The multi-region design can be combined with ExpressRoute or VPN gateways. The following diagram shows a topology including an ExpressRoute gateway connected to an on-premises network in one of the Azure regions. In this case, an overlay network over the ExpressRoute circuit helps to simplify the network, so that on-premises prefixes only appear in Azure as advertised by the NVA (and not from the ExpressRoute gateway).

:::image type="content" source="./media/multiregion/multiregion-with-expressroute.png" alt-text="Diagram showing multi-region design with Route Server and ExpressRoute.":::

## Design without overlays

The cross-region tunnels between the NVAs are required because otherwise a routing loop is formed. For example, looking at the NVA in region 1:

- The NVA in region 1 learns the prefixes from region 2, and advertises them to the Route Server in region 1.
- The Route Server in region 1 will inject routes for those prefixes in all subnets in region 1, with the NVA in region 1 as the next hop.
- For traffic from region 1 to region 2, when the NVA in region 1 sends traffic to the other NVA, its own subnet inherits as well the routes programmed by the Route Server, which are pointing to itself (the NVA). So the packet is returned to the NVA, and a routing loop appears.

If UDRs are an option, you could disable BGP route propagation in the NVAs' subnets, and configure static UDRs instead of an overlay, so that Azure can route traffic to the remote spoke VNets. 

## Next steps

* Learn more about [Azure Route Server support for ExpressRoute and Azure VPN](expressroute-vpn-support.md)
* Learn how to [Configure peering between Azure Route Server and network virtual appliance](tutorial-configure-route-server-with-quagga.md)
