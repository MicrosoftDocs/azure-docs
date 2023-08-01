---
title: Interoperability in Azure - Control plane analysis
description: This article provides the control plane analysis of the test setup you can use to analyze interoperability between ExpressRoute, a site-to-site VPN, and virtual network peering in Azure.
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 03/24/2023
ms.author: allensu
ms.custom: ignite-fall-2021
---

# Interoperability in Azure - Control plane analysis

This article describes the control plane analysis of the test setup. You can also review the test setup configuration and the data plane analysis of the test setup.

Control plane analysis essentially examines routes that are exchanged between networks within a topology. Control plane analysis can help you understand how different networks view the topology.

## Hub and spoke virtual network perspective

The following figure illustrates the network from the perspective of a hub virtual network and a spoke virtual network (highlighted in blue). The figure also shows the autonomous system number (ASN) of different networks and routes that are exchanged between different networks: 

:::image type="content" source="./media/backend-interoperability/hubview.png" alt-text="Diagram of hub and spoke virtual network perspective of the topology.":::

The ASN of the virtual network's Azure ExpressRoute gateway is different from the ASN of Microsoft Enterprise edge routers (MSEEs). An ExpressRoute gateway uses a private ASN (a value of **65515**) and MSEEs use public ASN (a value of **12076**) globally. When you configure ExpressRoute peering, because MSEE is the peer, you use **12076** as the peer ASN. On the Azure side, MSEE establishes eBGP peering with the ExpressRoute gateway. The dual eBGP peering that the MSEE establishes for each ExpressRoute peering is transparent at the control plane level. Therefore, when you view an ExpressRoute route table, you see the virtual network's ExpressRoute gateway ASN for the VNet's prefixes. 

The following figure shows a sample ExpressRoute route table: 

:::image type="content" source="./media/backend-interoperability/exr1-routetable.png" alt-text="Diagram of ExpressRoute 1 route table.":::

Within Azure, the ASN is significant only from a peering perspective. By default, the ASN of both the ExpressRoute gateway and the VPN gateway in Azure VPN Gateway is **65515**.

## On-premises Location 1 and the remote virtual network perspective via ExpressRoute 1

Both on-premises Location 1 and the remote virtual network are connected to the hub virtual network via ExpressRoute 1. They share the same perspective of the topology, as shown in the following diagram:

:::image type="content" source="./media/backend-interoperability/loc1exrview.png" alt-text="Diagram of location 1 and remote virtual network perspective of the topology via ExpressRoute 1.":::

## On-premises Location 1 and the branch virtual network perspective via a site-to-site VPN

Both on-premises Location 1 and the branch virtual network are connected to a hub virtual network's VPN gateway via a site-to-site VPN connection. They share the same perspective of the topology, as shown in the following diagram:

:::image type="content" source="./media/backend-interoperability/loc1vpnview.png" alt-text="Diagram of location 1 and branch virtual network perspective of the topology via a site-to-site VPN.":::

## On-premises Location 2 perspective

On-premises Location 2 is connected to a hub virtual network via private peering of ExpressRoute 2: 

:::image type="content" source="./media/backend-interoperability/loc2view.png" alt-text="Diagram of location 2 perspective of the topology.":::

## ExpressRoute and site-to-site VPN connectivity in tandem

###  Site-to-site VPN over ExpressRoute

You can configure a site-to-site VPN by using ExpressRoute Microsoft peering to privately exchange data between your on-premises network and your Azure Virtual Networks. With this configuration, you can exchange data with confidentiality, authenticity, and integrity. The data exchange also is anti-replay. For more information about how to configure a site-to-site IPsec VPN in tunnel mode by using ExpressRoute Microsoft peering, see [Site-to-site VPN over ExpressRoute Microsoft peering](../expressroute/site-to-site-vpn-over-microsoft-peering.md). 

The primary limitation of configuring a site-to-site VPN that uses Microsoft peering is throughput. Throughput over the IPsec tunnel is limited by the VPN gateway capacity. The VPN gateway throughput is lower than ExpressRoute throughput. In this scenario, using the IPsec tunnel for highly secure traffic and using private peering for all other traffic helps optimize the ExpressRoute bandwidth utilization.

### Site-to-site VPN as a secure failover path for ExpressRoute

ExpressRoute serves as a redundant circuit pair to ensure high availability. You can configure geo-redundant ExpressRoute connectivity in different Azure regions. Also, as demonstrated in our test setup, within an Azure region, you can use a site-to-site VPN to create a failover path for your ExpressRoute connectivity. When the same prefixes are advertised over both ExpressRoute and a site-to-site VPN, Azure prioritizes ExpressRoute. To avoid asymmetrical routing between ExpressRoute and the site-to-site VPN, on-premises network configuration should also reciprocate by using ExpressRoute connectivity before it uses site-to-site VPN connectivity.

For more information about how to configure coexisting connections for ExpressRoute and a site-to-site VPN, see [ExpressRoute and site-to-site coexistence](../expressroute/expressroute-howto-coexist-resource-manager.md).

## Extend back-end connectivity to spoke virtual networks and branch locations

### Spoke virtual network connectivity by using virtual network peering

Hub and spoke virtual network architecture is widely used. The hub is a virtual network in Azure that acts as a central point of connectivity between your spoke virtual networks and to your on-premises network. The spokes are virtual networks that peer with the hub, and which you can use to isolate workloads. Traffic flows between the on-premises datacenter and the hub through an ExpressRoute or VPN connection. For more information about the architecture, see [Implement a hub-spoke network topology in Azure](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke).

In virtual network peering within a region, spoke virtual networks can use hub virtual network gateways (both VPN and ExpressRoute gateways) to communicate with remote networks.

### Branch virtual network connectivity by using site-to-site VPN

You might want branch virtual networks, which are in different regions, and on-premises networks to communicate with each other via a hub virtual network. The native Azure solution for this configuration is site-to-site VPN connectivity by using a VPN. An alternative is to use a network virtual appliance (NVA) for routing in the hub.

For more information, see [What is VPN Gateway?](../vpn-gateway/vpn-gateway-about-vpngateways.md) and [Deploy a highly available NVA](/azure/architecture/reference-architectures/dmz/nva-ha).

## Next steps

Learn about [data plane analysis](./connectivty-interoperability-data-plane.md) of the test setup and Azure network monitoring feature views.

See the [ExpressRoute FAQ](../expressroute/expressroute-faqs.md) to:

-   Learn how many ExpressRoute circuits you can connect to an ExpressRoute gateway.

-   Learn how many ExpressRoute gateways you can connect to an ExpressRoute circuit.

-   Learn about other scale limits of ExpressRoute.
