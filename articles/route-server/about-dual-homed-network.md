---
title: About dual-homed network with Azure Route Server
description: Learn how Azure Route Server works in a dual-homed network.
services: route-server
author: halkazwini
ms.service: route-server
ms.topic: conceptual
ms.date: 01/27/2023
ms.author: halkazwini
ms.custom: template-concept, engagement-fy23
---

# About dual-homed network with Azure Route Server

In a typical hub and spoke architecture, application workloads are deployed in spoke virtual networks (VNets). These spokes are peered with a single hub VNet, which contains shared network resources such as VPN and ExpressRoute gateways. In some situations it can be desirable to peer spokes to more than one hub VNet, for example if multiple VPN or ExpressRoute Gateways are required for any reason. Azure Route Server enables this architecture so that workloads in a spoke VNet can communicate through either of the hub VNets it's connected to.

## How to set it up

As can be seen in the following diagram, you need to:

* Deploy a Network Virtual Appliance (NVA) in each hub virtual network and a route server in the spoke virtual network.
* Enable VNet peering between the hub and spoke virtual networks.
* Configure BGP peering between the route server and each NVA deployed.

:::image type="content" source="./media/about-dual-homed-network/dual-homed-topology.png" alt-text="Diagram of Route Server in a dual-homed topology.":::

### How does it work?

In the control plane, the NVA and the route server will exchange routes as if they’re deployed in the same virtual network. The NVA will learn about spoke VNet addresses from the route server. The route server will learn routes from each of the NVAs. The route server will then program all the virtual machines in the spoke VNet with the routes it learned. 

In the data plane, virtual machines in the spoke VNet will see the security NVA or the VPN NVA in the hub as the next hop. Traffic destined for the Internet-bound traffic or the hybrid cross-premises traffic will now route through the NVAs in the hub VNet. You can configure both hubs to be either active/active or active/passive. In the case when the active hub fails, the traffic to and from the virtual machines will fail over to the other hub. These failures include but not limited to: NVA failures or service connectivity failures. This set up ensures your network is configured for high availability.

## Integration with ExpressRoute

You can build a dual-homed network that involves two or more ExpressRoute connections. Along with the steps described above, you'll need to:

* Create a route server in each hub VNet that has an ExpressRoute gateway.
* Configure BGP peering between the NVA and the route server in the hub VNet.
* [Enable route exchange](quickstart-configure-route-server-portal.md#configure-route-exchange) between the ExpressRoute gateway and the route server in the hub VNet.
* Make sure “Use Remote Gateway or Remote Route Server” is **disabled** in the spoke virtual network VNet peering configuration.

:::image type="content" source="./media/about-dual-homed-network/dual-homed-topology-expressroute.png" alt-text="Diagram of Route Server in a dual-homed topology with ExpressRoute.":::

### How does it work?

In the control plane, the NVA in the hub VNet will learn about on-premises routes from the ExpressRoute gateway through [route exchange](quickstart-configure-route-server-portal.md#configure-route-exchange) with the route server in the hub. In return, the NVA will send the spoke VNet addresses to the ExpressRoute gateway using the same route server. The route server in both the spoke and hub VNets will then program the on-premises network addresses to the virtual machines in their respective virtual network.

> [!IMPORTANT]
> BGP prevents a loop by verifying the AS number in the AS Path. If the receiving route server sees its own AS number in the AS Path of a received BGP packet, it will drop the packet. In this example, both route servers have the same AS number, 65515. To prevent each route server from dropping the routes from the other route server, the NVA must apply **as-override** BGP policy when peering with each route server. 
>

In the data plane, the virtual machines in the spoke VNet will send all traffic destined for the on-premises network to the NVA in the hub VNet first. Then the NVA will forward the traffic to the on-premises network through ExpressRoute. Traffic from on-premises will traverse the same data path in the reverse direction. You'll notice none of the route servers are in the data path.

## Next steps

* Learn about [Azure Route Server support for ExpressRoute and Azure VPN](expressroute-vpn-support.md)
* Learn how to [configure peering between Azure Route Server and Network Virtual Appliance](tutorial-configure-route-server-with-quagga.md)

