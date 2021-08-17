---
title: 'About dual-homed network with Azure Route Server (Preview)'
description: Learn about how Azure Route Server (Preview) works in a dual-homed network.
services: route-server
author: duongau
ms.service: route-server
ms.topic: conceptual
ms.date: 05/04/2021
ms.author: duau
---

# About dual-homed network with Azure Route Server (Preview)

Azure Route Server supports your typical hub-and-spoke network topology. This configuration is when both the Route Server and network virtual appliance (NVA) are in the hub virtual network. Router Server also enables you to configure a different topology called a dual-homed network. This configuration is when you have a spoke virtual network peered with two or more hub virtual networks. Virtual machines in the spoke virtual network can communicate through either hub virtual network to your on-premises or the Internet.

## How to set it up

As can be seen in the following diagram, you need to:

* Deploy an NVA in each hub virtual network and the route server in the spoke virtual network.
* Enable VNet peering between the hub and spoke virtual networks.
* Configure BGP peering between the Route Server and each NVA deployed.

:::image type="content" source="./media/about-dual-homed-network/dual-homed-topology.png" alt-text="Diagram of Route Server in a dual-homed topology.":::

### How does it work?

In the control plane, the NVA and the Route Server will exchange routes as if they’re deployed in the same virtual network. The NVA will learn about spoke virtual network addresses from the Route Server. The Route Server will learn routes from each of the NVAs. The Route Server will then program all the virtual machines in the spoke virtual network with the routes it learned. 

In the data plane, virtual machines in the spoke virtual network will see the security NVA or the VPN NVA in the hub as the next hop. Traffic destined for the Internet-bound traffic or the hybrid cross-premises traffic will now route through the NVAs in the hub virtual network. You can configure both hubs to be either active/active or active/passive. In the case when the active hub fails, the traffic to and from the virtual machines will fail over to the other hub. These failures include but not limited to: NVA failures or service connectivity failures. This set up ensures your network is configured for high availability.

## Integration with ExpressRoute

You can build a dual-homed network that involves two or more ExpressRoute connections. Along with the steps described above, you'll need to:

* Create another Route Server in each hub virtual network that has an ExpressRoute gateway.
* Configure BGP peering between the NVA and the Route Server in the hub virtual network.
* [Enable route exchange](quickstart-configure-route-server-portal.md#configure-route-exchange) between the ExpressRoute gateway and the Route Server in the hub virtual network.
* Make sure “Use Remote Gateway or Remote Route Server” is **disabled** in the spoke virtual network VNet peering configuration.

:::image type="content" source="./media/about-dual-homed-network/dual-homed-topology-expressroute.png" alt-text="Diagram of Route Server in a dual-homed topology with ExpressRoute.":::

### How does it work?

In the control plane, the NVA in the hub virtual network will learn about on-premises routes from the ExpressRoute gateway through [route exchange](quickstart-configure-route-server-portal.md#configure-route-exchange) with the Route Server in the hub. In return, the NVA will send the spoke virtual network addresses to the ExpressRoute gateway using the same Route Server. The Route Server in both the spoke and hub virtual network will then program the on-premises network addresses to the virtual machines in their respective virtual network.

> [!IMPORTANT]
> BGP prevents a loop by verifying the AS number in the AS Path. If the receiving router sees its own AS number in the AS Path of a received BGP packet, it will drop the packet. In this example, both Route Servers have the same AS number, 65515. To prevent each Route Server from dropping the routes from the other Route Server, the NVA must apply **as-override** BGP policy when peering with each Route Server. 
>

In the data plane, the virtual machines in the spoke virtual network will send all traffic destined for the on-premises network to the NVA in the hub virtual network first. Then the NVA will forward the traffic to the on-premises network through ExpressRoute. Traffic from on-premises will traverse the same data path in the reverse direction. You'll notice neither of the Route Servers are in the data path.

## Next steps

* [Learn how Azure Route Server works with ExpressRoute](expressroute-vpn-support.md)
* [Learn how Azure Route Server works with a network virtual appliance](resource-manager-template-samples.md)

