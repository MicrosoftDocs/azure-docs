---
title: 'Interoperability of ExpressRoute, Site-to-site VPN, and VNet Peering - Test Setup: Azure Backend Connectivity Features Interoperability | Microsoft Docs'
description: This page provides a test setup that is used to analyze interoperability of ExpressRoute, Site-to-site VPN, and VNet Peering features.
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

# Interoperability of ExpressRoute, Site-to-site VPN, and VNet-peering - test setup
In this article, let's identify a test setup that we can use to analyze how the different features inter-operate with one another both at the control-plane and data-plane level. Prior to discussing the test-setup, let's briefly look into what these different Azure networking features mean.

ExpressRoute: Using ExpressRoute private peering you can directly connect private IP spaces of your on-premises network to your Azure VNet deployments.  Using ExpressRoute you can achieve higher bandwidth and private connection. There are many ExpressRoute eco partners, who offer ExpressRoute connectivity with SLA. To learn more about ExpressRoute and how to configure it, see [Introduction to ExpressRoute][ExpressRoute]

Site-to-Site VPN: To securely connect an on-premises network to Azure over Internet or over ExpressRoute, Site-to-Site (S2S) VPN option is available. To learn about how to configure S2S VPN for connecting to Azure, see [Configuring VPN Gateway][VPN]

VNet-peering: VNet-peering is available to establish connectivity between virtual networks (VNets). To learn more about VNet peering, see [Tutorial on VNet-Peering][VNet].

##Test setup

The diagram below illustrates the test setup.

[![1]][1]

The center piece of the test setup is the Hub Vnet in the Azure Region 1. The Hub Vnet is connected to different networks as follows:

1.	To Spoke Vnet via Vnet-peering. The spoke Vnet has remote access to both the gateways in the Hub Vnet.
2.	To Branch Vnet via Site-to-Site VPN. The connectivity uses eBGP to exchange routes.
3.	To Location-1 on-premises network via ExpressRoute private peering as the primary path and Site-to-Site VPN connectivity as the back-up path. In the rest of this document, let’s refer this ExpressRoute circuit as ExpressRoute1. By default, ExpressRoute circuits provide redundant connectivity for High Availability. On the ExpressRoute1, the secondary CE router's subinterface facing the secondary MSEE is disabled. This is indicated using a red-line over the double-line arrow on the above diagram.
4.	To Location-2 on-premises network via another ExpressRoute private peering. In the rest of this document, let’s refer this second ExpressRoute circuit as ExpressRoute2.
5.	ExpressRoute1 also connects both the Hub Vnet and Location-1 on-premises to a remote Vnet in Azure Region 2.

## Further reading

### Using ExpressRoute and Site-to-Site VPN connectivity in tandem

#### Site-to-Site VPN over ExpressRoute 

Site-to-Site VPN can be configured over ExpressRoute Microsoft peering to privately exchange data between your on-premises network and your Azure VNets with confidentiality, anti-replay, authenticity, and integrity. For more information regarding how to configure Site-to-Site IPSec VPN in tunnel mode over ExpressRoute Microsoft peering, see [Site-to-site VPN over ExpressRoute Microsoft-peering][S2S-Over-ExR]. 

The major limitation of configuring S2S VPN over Microsoft peering is the throughput. Throughput over the IPSec tunnel is limited by the VPN GW capacity. The VPN GW throughput is less compared to ExpressRoute throughput. In such scenarios, using the IPSec tunnel for high secure traffic and private peering for all other traffic would help optimize the ExpressRoute bandwidth utilization.

#### Site-to-Site VPN as a secure failover path for ExpressRoute
ExpressRoute is offered as redundant circuit pair to ensure high availability. You can configure geo-redundant ExpressRoute connectivity in different Azure regions. Also as done in our test setup, within a given Azure region, if you want a failover path for your ExpressRoute connectivity, you can do so using Site-to-Site VPN. When the same prefixes are advertised over both ExpressRoute and S2S VPN, Azure prefers ExpressRoute over S2S VPN. To avoid asymmetrical routing between ExpressRoute and S2S VPN, on-premises network configuration should also reciprocate preferring ExpressRoute over S2S VPN connectivity.

For more information regarding how to configure ExpressRoute and Site-to-Site VPN coexisting connections, see [ExpressRoute and Site-to-Site Coexistence][ExR-S2S-CoEx].

### Extending backend connectivity to spoke VNets and branch locations

#### Spoke VNet connectivity using VNet peering

Hub-and-spoke Vnet architecture is widely used. The hub is a virtual network (VNet) in Azure that acts as a central point of connectivity between your spoke VNets and to your on-premises network. The spokes are VNets that peer with the hub and can be used to isolate workloads. Traffic flows between the on-premises datacenter and the hub through an ExpressRoute or VPN connection. For more information about the architecture, see [Hub-and-Spoke Architecture][Hub-n-Spoke]

VNet peering within a region allows spoke VNets to use hub VNet gateways (both VPN and ExpressRoute gateways) to communicate with remote networks.

#### Branch VNet connectivity using Site-to-Site VPN

If you want branch Vnets (in different regions) and on-premises networks communicate with each other via a hub vnet, the native Azure solution is site-to-site VPN connectivity using VPN. An alternative option is to use an NVA for routing in the hub.

For configuring VPN gateways, see [Configuring VPN Gateway][VPN]. For deploying highly available NVA, see [Deploy highly available NVA][Deploy-NVA].

## Next steps

For the configuration details of the test topology, see [Configuration Details][Configuration].

For control plane analysis of the test setup and to understand the views of different VNet/VLAN of the topology, see [Control-Plane Analysis][Control-Analysis].

For data plane analysis of the test setup and for Azure network monitoring features views, see [Data-Plane Analysis][Data-Analysis].

To learn how many ExpressRoute circuits you can connect to an ExpressRoute Gateway, or how many ExpressRoute Gateways you can connect to an ExpressRoute circuit, or to learn other scale limits of ExpressRoute, see [ExpressRoute FAQ][ExR-FAQ]



<!--Image References-->
[1]: ./media/backend-interoperability/TestSetup.png "The Test Topology"

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




