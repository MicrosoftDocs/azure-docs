---
title: 'Interoperability of ExpressRoute, Site-to-site VPN, and VNet Peering - Control Plane Analysis: Azure Backend Connectivity Features Interoperability | Microsoft Docs'
description: This page provides the control plane analysis of the test setup created to analyze the interoperability of ExpressRoute, Site-to-site VPN, and VNet Peering features.
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

# Interoperability of ExpressRoute, Site-to-site VPN, and VNet-Peering - Control plane analysis

In this article, let's go through the control plane analysis of the test setup. If you want to review the Test Setup, see the [Test Setup][Setup]. To review the Test Setup configuration detail, see [Test Setup Configuration][Configuration].

Control plane analysis essentially examines routes exchanged between networks within a topology. Control plane analysis help how different network view the topology.

##Hub and Spoke VNet perspective

The following diagram illustrates the network from Hub VNet and Spoke VNet (highlighted in blue) perspective. The diagram also shows the Autonomous System Number (ASN) of different network and routes exchanged between different networks. 

[![1]][1]

Notice that the ASN of VNet's ExpressRoute gateway is different from the ASN of Microsoft Enterprise Edge Routers (MSEEs). ExpressRoute gateway uses a private ASN (65515) and MSEEs use public ASN (12076) globally. When you configure ExpressRoute peering, because MSEE is the peer, you use 12076 as the peer ASN. On the Azure side, MSEE establishes eBGP peering with ExpressRoute GW. The dual eBGP peering that the MSEE establishes for each ExpressRoute peering is transparent at the control-plane level. Therefore, when an ExpressRoute route table is viewed, you see the VNet’s ExpressRoute GW ASN for the VNet’s prefixes. A sample ExpressRoute route table screenshot is shown below: 

[![5]][5]

Within Azure, the ASN is only significant from a peering perspective. By default the ASN of both ExpressRoute GW and VPN GW is 65515.

##On-Premises Location-1 and Remote VNet perspective via ExpressRoute-1

On-Premises Location-1 and Remote VNet are both connected to Hub VNet via ExpressRoute 1 and therefore they share the same perspective of the topology, as shown in the below diagram.

[![2]][2]

##On-Premises Location-1 and Branch VNet perspective via Site-to-Site VPN

On-Premises Location-1 and Branch VNet are both connected to Hub VNet’s VPN GW via Site-to-Site VPN connections and therefore they share the same perspective of the topology, as shown in the below diagram.

[![3]][3]

##On-Premises Location-2 perspective

On-Premises Location-2 is connected to Hub VNet via private peering of ExpressRoute 2. 

[![4]][4]

## Further reading

### Using ExpressRoute and Site-to-Site VPN connectivity in tandem

####  Site-to-Site VPN over ExpressRoute

Site-to-Site VPN can be configured over ExpressRoute Microsoft peering to privately exchange data between your on-premises network and your Azure VNets with confidentiality, anti-replay, authenticity, and integrity. For more information on how to configure Site-to-Site IPSec VPN in tunnel mode over ExpressRoute Microsoft peering, see [Site-to-site VPN over ExpressRoute Microsoft-peering][S2S-Over-ExR]. 

The major limitation of configuring S2S VPN over Microsoft peering is the throughput. Throughput over the IPSec tunnel is limited by the VPN GW capacity. The VPN GW throughput is less compared to ExpressRoute throughput. In such scenarios, using the IPSec tunnel for high secure traffic and private peering for all other traffic would help optimize the ExpressRoute bandwidth utilization.

#### Site-to-Site VPN as a secure failover path for ExpressRoute
ExpressRoute is offered as redundant circuit pair to ensure high availability. You can configure geo-redundant ExpressRoute connectivity in different Azure regions. Also as done in our test setup, within a given Azure region, if you want a failover path for your ExpressRoute connectivity, you can do so using Site-to-Site VPN. When the same prefixes are advertised over both ExpressRoute and S2S VPN, Azure prefers ExpressRoute over S2S VPN. To avoid asymmetrical routing between ExpressRoute and S2S VPN, on-premises network configuration should also reciprocate preferring ExpressRoute over S2S VPN connectivity.

For more information on how to configure ExpressRoute and Site-to-Site VPN coexisting connections, see [ExpressRoute and Site-to-Site Coexistence][ExR-S2S-CoEx].

### Extending backend connectivity to spoke VNets and branch locations

#### Spoke VNet connectivity using VNet peering

Hub-and-spoke Vnet architecture is widely used. The hub is a virtual network (VNet) in Azure that acts as a central point of connectivity between your spoke VNets and to your on-premises network. The spokes are VNets that peer with the hub and can be used to isolate workloads. Traffic flows between the on-premises datacenter and the hub through an ExpressRoute or VPN connection. For further details about the architecture, see [Hub-and-Spoke Architecture][Hub-n-Spoke]

VNet peering within a region allows spoke VNets to use hub VNet gateways (both VPN and ExpressRoute gateways) to communicate with remote networks.

#### Branch VNet connectivity using Site-to-Site VPN

If you want branch Vnets (in different regions) and on-premises networks communicate with each other via a hub vnet, the native Azure solution is site-to-site VPN connectivity using VPN. An alternative option is to use an NVA for routing in the hub.

For configuring VPN gateways, see [Configuring VPN Gateway][VPN]. For deploying highly available NVA, see [Deploy highly available NVA][Deploy-NVA].

## Next steps

For data plane analysis of the test setup and for Azure network monitoring features views, see [Data-Plane Analysis][Data-Analysis].

To learn how many ExpressRoute circuits you can connect to an ExpressRoute Gateway, or how many ExpressRoute Gateways you can connect to an ExpressRoute circuit, or to learn other scale limits of ExpressRoute, see [ExpressRoute FAQ][ExR-FAQ]


<!--Image References-->
[1]: ./media/backend-interoperability/HubView.png "Hub and Spoke VNet Perspective of the Topology"
[2]: ./media/backend-interoperability/Loc1ExRView.png "Location-1 and Remote VNet Perspective via ExpressRoute 1 of the Topology"
[3]: ./media/backend-interoperability/Loc1VPNView.png "Location-1 and Branch VNet Perspective via S2S VPN of the Topology"
[4]: ./media/backend-interoperability/Loc2View.png "Location-2 Perspective of the Topology"
[5]: ./media/backend-interoperability/ExR1-RouteTable.png "ExpressRoute 1 RouteTable"

<!--Link References-->
[Setup]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-preface
[Configuration]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-config
[ExpressRoute]: https://docs.microsoft.com/azure/expressroute/expressroute-introduction
[VPN]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways
[VNet]: https://docs.microsoft.com/azure/virtual-network/tutorial-connect-virtual-networks-portal
[Configuration]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-configuration
[Control-Analysis]:https://docs.microsoft.com/azure/networking/connectivty-interoperability-control-plane
[Data-Analysis]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-data-plane
[ExR-FAQ]: https://docs.microsoft.com/azure/expressroute/expressroute-faqs
[S2S-Over-ExR]: https://docs.microsoft.com/azure/expressroute/site-to-site-vpn-over-microsoft-peering
[ExR-S2S-CoEx]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-coexist-resource-manager
[Hub-n-Spoke]: https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke
[Deploy-NVA]: https://docs.microsoft.com/azure/architecture/reference-architectures/dmz/nva-ha
[VNet-Config]: https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering




