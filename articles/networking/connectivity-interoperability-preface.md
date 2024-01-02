---
title: Interoperability in Azure - Test setup
description: This article describes a test setup you can use to analyze interoperability between ExpressRoute, a site-to-site VPN, and virtual network peering in Azure.
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 03/26/2023
ms.author: allensu
---

# Interoperability in Azure - Test setup

This article describes a test setup you can use to analyze how Azure networking services interoperate at the control plane level and data plane level. Let's look briefly at the Azure networking components:

- **Azure ExpressRoute**: Use private peering in Azure ExpressRoute to directly connect private IP spaces in your on-premises network to your Azure Virtual Network deployments. ExpressRoute can help you achieve higher bandwidth and a private connection. Many ExpressRoute eco partners offer ExpressRoute connectivity with SLAs. To learn more about ExpressRoute and to learn how to configure ExpressRoute, see [Introduction to ExpressRoute](../expressroute/expressroute-introduction.md).

- **Site-to-site VPN**: You can use Azure VPN Gateway as a site-to-site VPN to securely connect an on-premises network to Azure over the internet or by using ExpressRoute. To learn how to configure a site-to-site VPN to connect to Azure, see [Configure VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md).

- **Virtual network peering**: Use virtual network peering to establish connectivity between virtual networks in Azure. For more information about virtual network peering,[Tutorial: Connect virtual networks with VNet peering - Azure portal](../virtual-network/tutorial-connect-virtual-networks-portal.md).

## Test setup

The following figure illustrates the test setup:

:::image type="content" source="./media/backend-interoperability/TestSetup.png" alt-text="Diagram of the test topology.":::

The centerpiece of the test setup is the hub virtual network in Azure Region 1. The hub virtual network is connected to different networks in the following ways:

- The hub virtual network is connected to the spoke virtual network by using virtual network peering. The spoke virtual network has remote access to both gateways in the hub virtual network.

- The hub virtual network is connected to the branch virtual network by using site-to-site VPN. The connectivity uses eBGP to exchange routes.

- The hub virtual network is connected to the on-premises Location 1 network by using ExpressRoute private peering as the primary path. It uses site-to-site VPN connectivity as the backup path. In the rest of this article, we refer to this ExpressRoute circuit as ExpressRoute 1. By default, ExpressRoute circuits provide redundant connectivity for high availability. On ExpressRoute 1, the secondary customer edge (CE) router's subinterface that faces the secondary Microsoft Enterprise edge router (MSEE) is disabled. A red line over the double-line arrow in the preceding figure represents the disabled CE router subinterface.

- The hub virtual network is connected to the on-premises Location 2 network by using another ExpressRoute private peering. In the rest of this article, we refer to this second ExpressRoute circuit as ExpressRoute 2.

- ExpressRoute 1 also connects both the hub virtual network and the on-premises Location 1 network to a remote virtual network in Azure Region 2.

## ExpressRoute and site-to-site VPN connectivity in tandem

###  Site-to-site VPN over ExpressRoute

You can configure a site-to-site VPN by using ExpressRoute Microsoft peering to privately exchange data between your on-premises network and your Azure virtual networks. With this configuration, you can exchange data with confidentiality, authenticity, and integrity. The data exchange also is anti-replay. For more information about how to configure a site-to-site IPsec VPN in tunnel mode by using ExpressRoute Microsoft peering, see [Site-to-site VPN over ExpressRoute Microsoft peering](../expressroute/site-to-site-vpn-over-microsoft-peering.md). 

The primary limitation of configuring a site-to-site VPN that uses Microsoft peering is throughput. Throughput over the IPsec tunnel is limited by the VPN gateway capacity. The VPN gateway throughput is lower than ExpressRoute throughput. In this scenario, using the IPsec tunnel for highly secure traffic and using private peering for all other traffic helps optimize the ExpressRoute bandwidth utilization.

### Site-to-site VPN as a secure failover path for ExpressRoute

ExpressRoute serves as a redundant circuit pair to ensure high availability. You can configure geo-redundant ExpressRoute connectivity in different Azure regions. Also, as demonstrated in our test setup, within an Azure region, you can use a site-to-site VPN to create a failover path for your ExpressRoute connectivity. When the same prefixes are advertised over both ExpressRoute and a site-to-site VPN, Azure prioritizes ExpressRoute. To avoid asymmetrical routing between ExpressRoute and the site-to-site VPN, on-premises network configuration should also reciprocate by using ExpressRoute connectivity before it uses site-to-site VPN connectivity.

For more information about how to configure coexisting connections for ExpressRoute and a site-to-site VPN, see [ExpressRoute and site-to-site coexistence](../expressroute/expressroute-howto-coexist-resource-manager.md).

## Extend back-end connectivity to spoke virtual networks and branch locations

### Spoke virtual network connectivity by using virtual network peering

Hub and spoke virtual network architecture is widely used. The hub is a virtual network in Azure that acts as a central point of connectivity between your spoke virtual networks and to your on-premises network. The spokes are virtual networks that peer with the hub, and which you can use to isolate workloads. Traffic flows between the on-premises datacenter and the hub through an ExpressRoute or VPN connection. For more information about the architecture, see [Implement a hub-spoke network topology in Azure](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke).

In virtual network peering within a region, spoke virtual networks can use hub virtual network gateways (both VPN and ExpressRoute gateways) to communicate with remote networks.

### Branch virtual network connectivity by using site-to-site VPN

You might want branch virtual networks, which are in different regions, and on-premises networks to communicate with each other via a hub VNet. The native Azure solution for this configuration is site-to-site VPN connectivity by using a VPN. An alternative is to use a network virtual appliance (NVA) for routing in the hub.

For more information, see [What is VPN Gateway?](../vpn-gateway/vpn-gateway-about-vpngateways.md) and [Deploy a highly available NVA](/azure/architecture/reference-architectures/dmz/nva-ha).

## Next steps

See the [ExpressRoute FAQ](../expressroute/expressroute-faqs.md) to:

- Learn how many ExpressRoute circuits you can connect to an ExpressRoute gateway.

- Learn how many ExpressRoute gateways you can connect to an ExpressRoute circuit.

- Learn about other scale limits of ExpressRoute.
