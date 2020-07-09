---
title: 'Interoperability in Azure : Test setup | Microsoft Docs'
description: This article describes a test setup you can use to analyze interoperability between ExpressRoute, a site-to-site VPN, and virtual network peering in Azure.
documentationcenter: na
services: networking
author: rambk
manager: tracsman

ms.service: virtual-network
ms.topic: article
ms.workload: infrastructure-services
ms.date: 10/18/2018
ms.author: rambala

---

# Interoperability in Azure : Test setup

This article describes a test setup you can use to analyze how Azure networking services interoperate at the control plane level and data plane level. Let's look briefly at the Azure networking components:

-   **Azure ExpressRoute**: Use private peering in Azure ExpressRoute to directly connect private IP spaces in your on-premises network to your Azure Virtual Network deployments. ExpressRoute can help you achieve higher bandwidth and a private connection. Many ExpressRoute eco partners offer ExpressRoute connectivity with SLAs. To learn more about ExpressRoute and to learn how to configure ExpressRoute, see [Introduction to ExpressRoute][ExpressRoute].
-   **Site-to-site VPN**: You can use Azure VPN Gateway as a site-to-site VPN to securely connect an on-premises network to Azure over the internet or by using ExpressRoute. To learn how to configure a site-to-site VPN to connect to Azure, see [Configure VPN Gateway][VPN].
-   **VNet peering**: Use virtual network (VNet) peering to establish connectivity between VNets in Azure Virtual Network. To learn more about VNet peering, see the [tutorial on VNet peering][VNet].

## Test setup

The following figure illustrates the test setup:

![1][1]

The centerpiece of the test setup is the hub VNet in Azure Region 1. The hub VNet is connected to different networks in the following ways:

-   The hub VNet is connected to the spoke VNet by using VNet peering. The spoke VNet has remote access to both gateways in the hub VNet.
-   The hub VNet is connected to the branch VNet by using site-to-site VPN. The connectivity uses eBGP to exchange routes.
-   The hub VNet is connected to the on-premises Location 1 network by using ExpressRoute private peering as the primary path. It uses site-to-site VPN connectivity as the backup path. In the rest of this article, we refer to this ExpressRoute circuit as ExpressRoute 1. By default, ExpressRoute circuits provide redundant connectivity for high availability. On ExpressRoute 1, the secondary customer edge (CE) router's subinterface that faces the secondary Microsoft Enterprise Edge Router (MSEE) is disabled. A red line over the double-line arrow in the preceding figure represents the disabled CE router subinterface.
-   The hub VNet is connected to the on-premises Location 2 network by using another ExpressRoute private peering. In the rest of this article, we refer to this second ExpressRoute circuit as ExpressRoute 2.
-   ExpressRoute 1 also connects both the hub VNet and the on-premises Location 1 network to a remote VNet in Azure Region 2.

## ExpressRoute and site-to-site VPN connectivity in tandem

###  Site-to-site VPN over ExpressRoute

You can configure a site-to-site VPN by using ExpressRoute Microsoft peering to privately exchange data between your on-premises network and your Azure VNets. With this configuration, you can exchange data with confidentiality, authenticity, and integrity. The data exchange also is anti-replay. For more information about how to configure a site-to-site IPsec VPN in tunnel mode by using ExpressRoute Microsoft peering, see [Site-to-site VPN over ExpressRoute Microsoft peering][S2S-Over-ExR]. 

The primary limitation of configuring a site-to-site VPN that uses Microsoft peering is throughput. Throughput over the IPsec tunnel is limited by the VPN gateway capacity. The VPN gateway throughput is lower than ExpressRoute throughput. In this scenario, using the IPsec tunnel for highly secure traffic and using private peering for all other traffic helps optimize the ExpressRoute bandwidth utilization.

### Site-to-site VPN as a secure failover path for ExpressRoute

ExpressRoute serves as a redundant circuit pair to ensure high availability. You can configure geo-redundant ExpressRoute connectivity in different Azure regions. Also, as demonstrated in our test setup, within an Azure region, you can use a site-to-site VPN to create a failover path for your ExpressRoute connectivity. When the same prefixes are advertised over both ExpressRoute and a site-to-site VPN, Azure prioritizes ExpressRoute. To avoid asymmetrical routing between ExpressRoute and the site-to-site VPN, on-premises network configuration should also reciprocate by using ExpressRoute connectivity before it uses site-to-site VPN connectivity.

For more information about how to configure coexisting connections for ExpressRoute and a site-to-site VPN, see [ExpressRoute and site-to-site coexistence][ExR-S2S-CoEx].

## Extend back-end connectivity to spoke VNets and branch locations

### Spoke VNet connectivity by using VNet peering

Hub and spoke VNet architecture is widely used. The hub is a VNet in Azure that acts as a central point of connectivity between your spoke VNets and to your on-premises network. The spokes are VNets that peer with the hub, and which you can use to isolate workloads. Traffic flows between the on-premises datacenter and the hub through an ExpressRoute or VPN connection. For more information about the architecture, see [Implement a hub-spoke network topology in Azure][Hub-n-Spoke].

In VNet peering within a region, spoke VNets can use hub VNet gateways (both VPN and ExpressRoute gateways) to communicate with remote networks.

### Branch VNet connectivity by using site-to-site VPN

You might want branch VNets, which are in different regions, and on-premises networks to communicate with each other via a hub VNet. The native Azure solution for this configuration is site-to-site VPN connectivity by using a VPN. An alternative is to use a network virtual appliance (NVA) for routing in the hub.

For more information, see [What is VPN Gateway?][VPN] and [Deploy a highly available NVA][Deploy-NVA].

## Next steps

Learn about [configuration details][Configuration] for the test topology.

Learn about [control plane analysis][Control-Analysis] of the test setup and the views of different VNets or VLANs in the topology.

Learn about the [data plane analysis][Data-Analysis] of the test setup and Azure network monitoring feature views.

See the [ExpressRoute FAQ][ExR-FAQ] to:
-   Learn how many ExpressRoute circuits you can connect to an ExpressRoute gateway.
-   Learn how many ExpressRoute gateways you can connect to an ExpressRoute circuit.
-   Learn about other scale limits of ExpressRoute.


<!--Image References-->
[1]: ./media/backend-interoperability/TestSetup.png "Diagram of the test topology"

<!--Link References-->
[ExpressRoute]: https://docs.microsoft.com/azure/expressroute/expressroute-introduction
[VPN]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways
[VNet]: https://docs.microsoft.com/azure/virtual-network/tutorial-connect-virtual-networks-portal
[Configuration]: connectivty-interoperability-configuration.md
[Control-Analysis]: connectivty-interoperability-control-plane.md
[Data-Analysis]: connectivty-interoperability-data-plane.md
[ExR-FAQ]: https://docs.microsoft.com/azure/expressroute/expressroute-faqs
[S2S-Over-ExR]: https://docs.microsoft.com/azure/expressroute/site-to-site-vpn-over-microsoft-peering
[ExR-S2S-CoEx]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-coexist-resource-manager
[Hub-n-Spoke]: https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke
[Deploy-NVA]: https://docs.microsoft.com/azure/architecture/reference-architectures/dmz/nva-ha


