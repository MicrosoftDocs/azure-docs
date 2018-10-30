---
title: Interoperability in Azure back-end connectivity features - Test setup | Microsoft Docs
description: This article describes a test setup you can use to analyze interoperability between ExpressRoute, a site-to-site VPN, and virtual network peering in Azure.
documentationcenter: na
services: networking
author: rambk
manager: tracsman

ms.service: expressroute,vpn-gateway,virtual-network
ms.topic: article
ms.workload: infrastructure-services
ms.date: 10/18/2018
ms.author: rambala

---

# Interoperability in Azure back-end connectivity features - Test setup

In this article, we identify a test setup that you can use to analyze how Azure networking services interoperate at the control-plane and data-plane levels. Let's look briefly at the Azure networking components:

-   **ExpressRoute**: Use private peering in Azure ExpressRoute to directly connect private IP spaces in your on-premises network to your Azure Virtual Network deployments. ExpressRoute can help you achieve higher bandwidth and a private connection. Many ExpressRoute eco partners offer ExpressRoute connectivity with SLAs. To learn more about ExpressRoute and to learn how to configure ExpressRoute, see [Introduction to ExpressRoute][ExpressRoute].
-   **Site-to-site VPN**: You can use Azure VPN Gateway as a site-to-site VPN to securely connect an on-premises network to Azure over the internet or by using ExpressRoute. To learn how to configure a site-to-site VPN to connect to Azure, see [Configure VPN Gateway][VPN]
-   **VNet peering**: Use VNet peering to establish connectivity between virtual networks (VNets) in Azure Virtual Network. To learn more about VNet peering, see [Tutorial on VNet peering][VNet].

## Test setup

The following diagram illustrates the test setup:

[![1]][1]

The centerpiece of the test setup is the hub VNet in Azure Region 1. The hub VNet is connected to different networks in the following ways:

-   To the spoke VNet by using VNet peering. The spoke VNet has remote access to both gateways in the hub VNet.
-   To the branch VNet by using site-to-site VPN. The connectivity uses eBGP to exchange routes.
-   To the Location1 on-premises network by using ExpressRoute private peering as the primary path and site-to-site VPN connectivity as the backup path. In the rest of this article, we refer to this ExpressRoute circuit as ExpressRoute1. By default, ExpressRoute circuits provide redundant connectivity for high availability. On ExpressRoute1, the secondary customer edge (CE) router's subinterface that faces the secondary Microsoft Enterprise Edge Router (MSEE) is disabled. This is indicated by using a red line over the double-line arrow in the preceding diagram.
-   To the Location2 on-premises network by using another ExpressRoute private peering. In the rest of this article, we refer to this second ExpressRoute circuit as ExpressRoute2.
-   ExpressRoute1 also connects both the hub VNet and Location1 on-premises to a remote VNet in Azure Region 2.

## ExpressRoute and site-to-site VPN connectivity in tandem

### Site-to-site VPN over ExpressRoute 

You can configure a site-to-site VPN by using ExpressRoute Microsoft peering to privately exchange data between your on-premises network and your Azure VNets. With this configuration, you can exchange data with confidentiality, authenticity, and integrity. The data exchange also will be anti-replay. For more information about how to configure a site-to-site IPsec VPN in tunnel mode by using ExpressRoute Microsoft peering, see [Site-to-site VPN over ExpressRoute Microsoft peering][S2S-Over-ExR]. 

The primary limitation of configuring a site-to-site VPN that uses Microsoft peering is the throughput. Throughput over the IPsec tunnel is limited by the VPN gateway capacity. The VPN gateway throughput is lower than ExpressRoute throughput. In this scenario, using the IPsec tunnel for highly secure traffic and using private peering for all other traffic helps optimize the ExpressRoute bandwidth utilization.

### Site-to-site VPN as a secure failover path for ExpressRoute

ExpressRoute is offered as a redundant circuit pair to ensure high availability. You can configure geo-redundant ExpressRoute connectivity in different Azure regions. Also, as demonstrated in our test setup, within an Azure region, you can use a site-to-site VPN to create a failover path for your ExpressRoute connectivity. When the same prefixes are advertised over both ExpressRoute and a site-to-site VPN, Azure prioritizes ExpressRoute. To avoid asymmetrical routing between ExpressRoute and the site-to-site VPN, on-premises network configuration should also reciprocate by using ExpressRoute before it uses site-to-site VPN connectivity.

For more information about how to configure coexisting connections for ExpressRoute and a site-to-site VPN, see [ExpressRoute and site-to-site coexistence][ExR-S2S-CoEx].

## Extend back-end connectivity to spoke VNets and branch locations

### Spoke VNet connectivity by using VNet peering

Hub and spoke VNet architecture is widely used. The hub is a VNet in Azure that acts as a central point of connectivity between your spoke VNets and to your on-premises network. The spokes are VNets that peer with the hub, and which you can use to isolate workloads. Traffic flows between the on-premises datacenter and the hub through an ExpressRoute or VPN connection. For more information about the architecture, see [Implement a hub-spoke network topology in Azure][Hub-n-Spoke].

VNet peering within a region allows spoke VNets to use hub VNet gateways (both VPN and ExpressRoute gateways) to communicate with remote networks.

### Branch VNet connectivity by using a site-to-site VPN

If you want branch VNets, which are in different regions, and on-premises networks to communicate with each other via a hub VNet, the native Azure solution is site-to-site VPN connectivity by using a VPN. An alternative option is to use a network virtual appliance (NVA) for routing in the hub.

For more information, see [What is VPN Gateway?][VPN] and [Deploy a highly available NVA][Deploy-NVA].

## Next steps

Learn about the [configuration details][Configuration] of the test topology.

Learn about the [control plane analysis][Control-Analysis] of the test setup and the views of different VNets/VLANs in the topology.

Learn about the [data plane analysis][Data-Analysis] of the test setup and Azure network monitoring feature views.

To learn how many ExpressRoute circuits you can connect to an ExpressRoute gateway and how many ExpressRoute gateways you can connect to an ExpressRoute circuit, see the [ExpressRoute FAQ][ExR-FAQ]. You can also learn about other scale limits of ExpressRoute in the FAQ.


<!--Image References-->
[1]: ./media/backend-interoperability/TestSetup.png "Diagram of the test topology"

<!--Link References-->
[ExpressRoute]: https://docs.microsoft.com/azure/expressroute/expressroute-introduction
[VPN]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways
[VNet]: https://docs.microsoft.com/azure/virtual-network/tutorial-connect-virtual-networks-portal
[Configuration]: https://docs.microsoft.com/azure/connectivty-interoperability-configuration
[Control-Analysis]:https://docs.microsoft.com/azure/connectivty-interoperability-control-plane
[Data-Analysis]: https://docs.microsoft.com/azure/connectivty-interoperability-data-plane
[ExR-FAQ]: https://docs.microsoft.com/azure/expressroute/expressroute-faqs
[S2S-Over-ExR]: https://docs.microsoft.com/azure/expressroute/site-to-site-vpn-over-microsoft-peering
[ExR-S2S-CoEx]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-coexist-resource-manager
[Hub-n-Spoke]: https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke
[Deploy-NVA]: https://docs.microsoft.com/azure/architecture/reference-architectures/dmz/nva-ha




